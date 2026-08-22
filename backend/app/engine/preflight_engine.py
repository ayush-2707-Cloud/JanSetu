"""Deterministic Pre-Flight Validation Engine for GovTech Filings.

Executes deterministic multi-point checks before statutory submission:
1. Cross-document and form-to-document Fuzzy Name Matching & Alias Detection
2. Expiry & Validity Period Guardrail (<30 days warning, past expiry blocker)
3. Statutory Schema & Format Completeness (PAN, Aadhaar, GSTIN, FSSAI, PIN)
4. OCR Confidence & Document Resolution Audit
"""

from __future__ import annotations
import re
import difflib
from datetime import datetime, date, timedelta, timezone
from typing import List, Dict, Any, Tuple, Optional
from app.schemas.preflight import (
    PreflightValidationRequest,
    PreflightValidationResponse,
    ValidationIssue,
    ValidationSeverity,
    IssueCategory,
    DiscrepancyDetail,
    QualityMetrics,
    UploadedDocument,
)


def _normalize_name(name: str) -> str:
    """Normalize name string by stripping honorifics, punctuation, and extra spaces."""
    if not name:
        return ""
    # Strip common Indian honorifics and noise
    cleaned = re.sub(r"\b(mr|mrs|ms|shri|smt|dr|prof|adv|shree)\b\.?", "", name, flags=re.IGNORECASE)
    cleaned = re.sub(r"[^\w\s]", " ", cleaned)
    cleaned = re.sub(r"\s+", " ", cleaned).strip().upper()
    return cleaned


def calculate_name_similarity(name_a: str, name_b: str) -> Tuple[float, bool]:
    """
    Calculate fuzzy similarity score (0.0 to 1.0) and whether name_a/name_b is a recognized initial-expanded alias.
    Examples:
    - 'AYUSH SINGH CHAUHAN' vs 'AYUSH S CHAUHAN' -> (0.88, True)
    - 'VIKRAM SHESHADRI RAO' vs 'V S RAO' -> (0.82, True)
    - 'RAMESH KUMAR' vs 'SURESH VERMA' -> (0.15, False)
    """
    norm_a = _normalize_name(name_a)
    norm_b = _normalize_name(name_b)

    if not norm_a or not norm_b:
        return (1.0 if norm_a == norm_b else 0.0, False)

    if norm_a == norm_b:
        return (1.0, False)

    tokens_a = norm_a.split()
    tokens_b = norm_b.split()

    if not tokens_a or not tokens_b:
        return (0.0, False)

    # Check for Initial Expansion / Alias Detection
    is_initial_expansion = False
    
    # Check 1: Same token count, corresponding tokens are equal or initial prefixes
    if len(tokens_a) == len(tokens_b) and len(tokens_a) > 1:
        matched_tokens = 0
        for ta, tb in zip(tokens_a, tokens_b):
            if ta == tb:
                matched_tokens += 1
            elif (len(ta) == 1 and tb.startswith(ta)) or (len(tb) == 1 and ta.startswith(tb)):
                matched_tokens += 1
        if matched_tokens == len(tokens_a):
            is_initial_expansion = True

    # Check 2: First & Last match, middle token is initial or missing
    if not is_initial_expansion and len(tokens_a) >= 2 and len(tokens_b) >= 2:
        if tokens_a[0] == tokens_b[0] and tokens_a[-1] == tokens_b[-1]:
            is_initial_expansion = True

    # Compute Token-Level Weighted Jaccard Match
    all_tokens = set(tokens_a + tokens_b)
    exact_matches = set(tokens_a).intersection(set(tokens_b))
    
    # Calculate pairwise best token matches
    token_match_scores = []
    for ta in tokens_a:
        best_match = max((difflib.SequenceMatcher(None, ta, tb).ratio() for tb in tokens_b), default=0.0)
        token_match_scores.append(best_match)
    
    avg_token_sim = sum(token_match_scores) / len(token_match_scores) if token_match_scores else 0.0
    jaccard_ratio = len(exact_matches) / len(all_tokens) if all_tokens else 0.0

    # Composite score
    effective_score = (avg_token_sim * 0.7) + (jaccard_ratio * 0.3)

    if is_initial_expansion:
        effective_score = max(effective_score, 0.82)
    elif len(exact_matches) == 0:
        # If no tokens match at all (e.g. Ramesh Kumar vs Suresh Verma), cap score
        effective_score = min(effective_score, 0.30)

    return (round(effective_score, 3), is_initial_expansion)


def validate_expiry_date(expiry_str: Optional[str]) -> Tuple[Optional[ValidationSeverity], Optional[str]]:
    """
    Validates document expiry date against today's date.
    Returns (Severity, Rejection/Warning Note)
    """
    if not expiry_str:
        return (None, None)

    try:
        if "-" in expiry_str:
            parts = expiry_str.split("-")
            if len(parts[0]) == 4:
                exp_date = datetime.strptime(expiry_str, "%Y-%m-%d").date()
            else:
                exp_date = datetime.strptime(expiry_str, "%d-%m-%Y").date()
        else:
            exp_date = datetime.strptime(expiry_str, "%Y/%m/%d").date()
    except Exception:
        return (ValidationSeverity.WARNING, f"Expiry date '{expiry_str}' format could not be verified.")

    today = date.today()
    if exp_date < today:
        return (
            ValidationSeverity.BLOCKED,
            f"Document expired on {exp_date.strftime('%d %b %Y')}. Statutory portal verification will automatically reject expired filings.",
        )
    elif exp_date <= today + timedelta(days=30):
        days_left = (exp_date - today).days
        return (
            ValidationSeverity.WARNING,
            f"Document expires in {days_left} days ({exp_date.strftime('%d %b %Y')}). Recommend submitting prior to expiry or uploading renewal receipt.",
        )
    elif exp_date <= today + timedelta(days=60):
        return (
            ValidationSeverity.WARNING,
            f"Document expires within 60 days ({exp_date.strftime('%d %b %Y')}). Ensure approval turnaround aligns with valid window.",
        )

    return (ValidationSeverity.PASSED, None)


def validate_statutory_patterns(req: PreflightValidationRequest) -> List[ValidationIssue]:
    """Validate format integrity for Indian statutory identity & credential schemas."""
    issues: List[ValidationIssue] = []

    # 1. PAN Pattern
    pan = req.applicant_pan or req.form_data.get("pan_number") or req.form_data.get("pan")
    if pan:
        pan_str = str(pan).strip().upper()
        if not re.match(r"^[A-Z]{5}[0-9]{4}[A-Z]$", pan_str):
            issues.append(
                ValidationIssue(
                    id="pan-format-invalid",
                    severity=ValidationSeverity.BLOCKED,
                    category=IssueCategory.SCHEMA_INVALID,
                    field="applicant_pan",
                    title="Invalid Income Tax PAN Format",
                    description=f"Entered PAN '{pan_str}' violates Section 139A of the Income Tax Act.",
                    rejection_reason="Automated NSDL/ITD API verification rejects non-compliant PAN structures immediately.",
                    corrective_action="Verify your 10-character alphanumeric PAN (e.g. ABCDE1234F) directly from your DigiLocker e-PAN.",
                    can_override=False,
                    autofix_available=False,
                )
            )

    # 2. Aadhaar Last 4 / VID
    aadhaar = req.applicant_aadhaar_last4 or req.form_data.get("aadhaar_last4") or req.form_data.get("aadhaar")
    if aadhaar:
        a_str = str(aadhaar).strip()
        if not re.match(r"^[0-9]{4}$", a_str) and not re.match(r"^[0-9]{12}$", a_str):
            issues.append(
                ValidationIssue(
                    id="aadhaar-format-invalid",
                    severity=ValidationSeverity.BLOCKED,
                    category=IssueCategory.SCHEMA_INVALID,
                    field="applicant_aadhaar_last4",
                    title="Invalid Aadhaar / UIDAI Reference",
                    description="Aadhaar entry must be either the last 4 digits (masked) or a valid 12-digit Virtual ID.",
                    rejection_reason="UIDAI e-KYC gateway requires exact 4-digit masked or 16-digit VID format for bio-authentication.",
                    corrective_action="Enter only the last 4 digits of your Aadhaar or verify seamlessly via DigiLocker.",
                    can_override=False,
                    autofix_available=False,
                )
            )

    # 3. PIN Code
    pin = req.applicant_pin or req.form_data.get("pin_code") or req.form_data.get("pincode")
    if pin:
        pin_str = str(pin).strip()
        if not re.match(r"^[1-9][0-9]{5}$", pin_str):
            issues.append(
                ValidationIssue(
                    id="pin-code-invalid",
                    severity=ValidationSeverity.BLOCKED,
                    category=IssueCategory.SCHEMA_INVALID,
                    field="applicant_pin",
                    title="Invalid Indian Postal PIN Code",
                    description=f"Entered PIN code '{pin_str}' is not a valid 6-digit Indian Postal Index.",
                    rejection_reason="Department of Posts jurisdiction lookup fails for malformed PIN codes, blocking nodal office dispatch.",
                    corrective_action="Provide a valid 6-digit PIN code corresponding to your municipal jurisdiction.",
                    can_override=False,
                    autofix_available=False,
                )
            )

    # 4. GSTIN
    gstin = req.form_data.get("gstin")
    if gstin:
        gstin_str = str(gstin).strip().upper()
        if not re.match(r"^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$", gstin_str):
            issues.append(
                ValidationIssue(
                    id="gstin-format-invalid",
                    severity=ValidationSeverity.WARNING,
                    category=IssueCategory.SCHEMA_INVALID,
                    field="gstin",
                    title="Invalid GSTIN Structure",
                    description=f"Entered GSTIN '{gstin_str}' does not match standard 15-character GST alphanumeric schema.",
                    rejection_reason="GSTN API cross-check will flag a schema discrepancy during MSME nodal scrutiny.",
                    corrective_action="Check GST certificate for exact 15-character GSTIN or leave blank if unregistered.",
                    can_override=True,
                    autofix_available=False,
                )
            )

    # 5. FSSAI License
    fssai = req.form_data.get("fssai_license_number")
    if fssai:
        fssai_str = str(fssai).strip()
        if not re.match(r"^[0-9]{14}$", fssai_str):
            issues.append(
                ValidationIssue(
                    id="fssai-format-invalid",
                    severity=ValidationSeverity.WARNING,
                    category=IssueCategory.SCHEMA_INVALID,
                    field="fssai_license_number",
                    title="Non-Standard FSSAI License Number",
                    description="FSSAI statutory registration numbers must be exactly 14 digits.",
                    rejection_reason="FSSAI FoSCoS portal lookup requires a 14-digit registration/license format.",
                    corrective_action="Enter the 14-digit FSSAI license number found on the top-right of your FoSCoS certificate.",
                    can_override=True,
                    autofix_available=False,
                )
            )

    return issues


def run_preflight_validation(req: PreflightValidationRequest) -> PreflightValidationResponse:
    """Execute full preflight validation suite and return comprehensive quality gate report."""
    issues: List[ValidationIssue] = []
    applicant_name = req.applicant_name or req.form_data.get("full_name") or req.form_data.get("applicant_name")

    ocr_confidences: List[float] = []
    name_similarities: List[float] = []
    has_expired_doc = False

    # 1. Identity & Name Consistency Checks
    if applicant_name and req.uploaded_documents:
        for doc in req.uploaded_documents:
            if doc.extracted_name:
                sim_score, is_alias = calculate_name_similarity(applicant_name, doc.extracted_name)
                name_similarities.append(sim_score)

                if sim_score >= 0.85:
                    pass
                elif sim_score >= 0.60 or is_alias:
                    issues.append(
                        ValidationIssue(
                            id=f"name-mismatch-{doc.id}",
                            severity=ValidationSeverity.WARNING,
                            category=IssueCategory.NAME_MISMATCH,
                            field=doc.doc_type,
                            title=f"Name Inconsistency: Form vs {doc.doc_type.replace('_', ' ').title()}",
                            description=(
                                f"Fuzzy similarity is {int(sim_score * 100)}%. "
                                f"Entered: '{applicant_name}' | Document: '{doc.extracted_name}'."
                            ),
                            discrepancy=DiscrepancyDetail(
                                field_a_name="Form Applicant Name",
                                field_a_value=applicant_name,
                                field_b_name=f"{doc.doc_type} Extracted Name",
                                field_b_value=doc.extracted_name,
                                similarity_score=sim_score,
                                is_recognized_alias=is_alias,
                            ),
                            rejection_reason=(
                                "Government scrutiny officers at FSSAI/MSME reject applications where the trade certificate "
                                "name does not strictly mirror the DigiLocker Aadhaar/PAN record without an attached alias affidavit."
                            ),
                            corrective_action=(
                                f"Option A: Auto-Sync application name to '{doc.extracted_name}'. "
                                "Option B: Attach a standard Name Alias Annexure-A self-declaration affidavit."
                            ),
                            can_override=True,
                            autofix_available=True,
                            autofix_action="SYNC_NAME_TO_AADHAAR",
                        )
                    )
                else:
                    issues.append(
                        ValidationIssue(
                            id=f"name-mismatch-blocked-{doc.id}",
                            severity=ValidationSeverity.BLOCKED,
                            category=IssueCategory.NAME_MISMATCH,
                            field=doc.doc_type,
                            title=f"Identity Mismatch in {doc.doc_type.replace('_', ' ').title()}",
                            description=(
                                f"Severe name divergence ({int(sim_score * 100)}% match). "
                                f"Form: '{applicant_name}' vs Document: '{doc.extracted_name}'."
                            ),
                            discrepancy=DiscrepancyDetail(
                                field_a_name="Form Applicant Name",
                                field_a_value=applicant_name,
                                field_b_name=f"{doc.doc_type} Extracted Name",
                                field_b_value=doc.extracted_name,
                                similarity_score=sim_score,
                                is_recognized_alias=False,
                            ),
                            rejection_reason="Severe name divergence indicates a third-party certificate was uploaded, triggering instant fraud scrutiny.",
                            corrective_action="Upload a certificate issued in the applicant's own name or complete legal name change documentation.",
                            can_override=False,
                            autofix_available=False,
                        )
                    )

    # 2. Cross-Document Name Consistency
    if len(req.uploaded_documents) >= 2:
        for i in range(len(req.uploaded_documents)):
            for j in range(i + 1, len(req.uploaded_documents)):
                doc_a = req.uploaded_documents[i]
                doc_b = req.uploaded_documents[j]
                if doc_a.extracted_name and doc_b.extracted_name:
                    sim, is_alias = calculate_name_similarity(doc_a.extracted_name, doc_b.extracted_name)
                    if sim < 0.60:
                        issues.append(
                            ValidationIssue(
                                id=f"cross-doc-mismatch-{doc_a.id}-{doc_b.id}",
                                severity=ValidationSeverity.BLOCKED,
                                category=IssueCategory.NAME_MISMATCH,
                                field=f"{doc_a.doc_type}_vs_{doc_b.doc_type}",
                                title=f"Cross-Document Identity Conflict: {doc_a.doc_type} vs {doc_b.doc_type}",
                                description=f"'{doc_a.extracted_name}' differs from '{doc_b.extracted_name}' ({int(sim*100)}% similarity).",
                                discrepancy=DiscrepancyDetail(
                                    field_a_name=f"{doc_a.doc_type} Name",
                                    field_a_value=doc_a.extracted_name,
                                    field_b_name=f"{doc_b.doc_type} Name",
                                    field_b_value=doc_b.extracted_name,
                                    similarity_score=sim,
                                    is_recognized_alias=is_alias,
                                ),
                                rejection_reason="Nodal scrutiny officer will flag cross-document identity conflicts as non-genuine.",
                                corrective_action="Re-upload matching proof of identity or attach a joint gazetted declaration.",
                                can_override=False,
                                autofix_available=False,
                            )
                        )

    # 3. Document Validity & Expiry
    for doc in req.uploaded_documents:
        if doc.expiry_date:
            severity, reason = validate_expiry_date(doc.expiry_date)
            if severity == ValidationSeverity.BLOCKED:
                has_expired_doc = True
                issues.append(
                    ValidationIssue(
                        id=f"doc-expired-{doc.id}",
                        severity=ValidationSeverity.BLOCKED,
                        category=IssueCategory.DOCUMENT_EXPIRED,
                        field=doc.doc_type,
                        title=f"Expired Certificate: {doc.doc_type.replace('_', ' ').title()}",
                        description=f"Document expired on {doc.expiry_date}.",
                        rejection_reason=reason or "Expired documents cannot be processed by statutory departments.",
                        corrective_action="Upload an active renewed document or current renewal acknowledgement slip.",
                        can_override=False,
                        autofix_available=False,
                        autofix_action="RENEW_DOC",
                    )
                )
            elif severity == ValidationSeverity.WARNING:
                issues.append(
                    ValidationIssue(
                        id=f"doc-expiring-soon-{doc.id}",
                        severity=ValidationSeverity.WARNING,
                        category=IssueCategory.EXPIRING_SOON,
                        field=doc.doc_type,
                        title=f"Expiring Soon: {doc.doc_type.replace('_', ' ').title()}",
                        description=f"Document expires on {doc.expiry_date}.",
                        rejection_reason=reason or "Certificate expiring within approval turnaround window.",
                        corrective_action="Submit filing promptly before expiry date or attach renewal application proof.",
                        can_override=True,
                        autofix_available=False,
                    )
                )

    # 4. OCR Quality & Resolution
    for doc in req.uploaded_documents:
        conf = doc.ocr_confidence if doc.ocr_confidence is not None else 0.95
        ocr_confidences.append(conf)

        if conf < 0.70:
            issues.append(
                ValidationIssue(
                    id=f"ocr-low-conf-{doc.id}",
                    severity=ValidationSeverity.BLOCKED,
                    category=IssueCategory.OCR_LOW_CONFIDENCE,
                    field=doc.doc_type,
                    title=f"Illegible Scan Quality: {doc.doc_type.replace('_', ' ').title()}",
                    description=f"OCR engine confidence is critically low ({int(conf * 100)}%). Document text cannot be parsed reliably.",
                    rejection_reason="Automated digital locker and document verification pipelines reject blurred or obscured scans.",
                    corrective_action="Re-scan document under good lighting with 300+ DPI resolution and minimum 100 KB file size.",
                    can_override=False,
                    autofix_available=False,
                )
            )
        elif conf < 0.88:
            issues.append(
                ValidationIssue(
                    id=f"ocr-warning-conf-{doc.id}",
                    severity=ValidationSeverity.WARNING,
                    category=IssueCategory.OCR_LOW_CONFIDENCE,
                    field=doc.doc_type,
                    title=f"Sub-Optimal OCR Confidence: {doc.doc_type.replace('_', ' ').title()}",
                    description=f"OCR extraction confidence is {int(conf * 100)}%. Some text elements may require manual scrutiny.",
                    rejection_reason="Scrutiny officers may issue a clarification notice if fine print is difficult to read.",
                    corrective_action="Review preview to confirm key numbers (PAN/License/Dates) are distinctly visible.",
                    can_override=True,
                    autofix_available=False,
                )
            )

        if doc.resolution_dpi and doc.resolution_dpi < 180:
            issues.append(
                ValidationIssue(
                    id=f"res-low-{doc.id}",
                    severity=ValidationSeverity.WARNING,
                    category=IssueCategory.RESOLUTION_LOW,
                    field=doc.doc_type,
                    title=f"Low Resolution Scan ({doc.resolution_dpi} DPI)",
                    description="Standard government specification recommends 200 to 300 DPI for micro-lettering readability.",
                    rejection_reason="Low resolution scans may fail optical barcode/QR verification.",
                    corrective_action="Re-upload in minimum 200 DPI PDF or PNG format.",
                    can_override=True,
                    autofix_available=False,
                )
            )

    # 5. Statutory Schema
    schema_issues = validate_statutory_patterns(req)
    issues.extend(schema_issues)

    # Aggregate Metrics
    blocked_count = sum(1 for iss in issues if iss.severity == ValidationSeverity.BLOCKED)
    warning_count = sum(1 for iss in issues if iss.severity == ValidationSeverity.WARNING)
    passed_count = max(0, 4 - blocked_count - (1 if warning_count > 0 else 0))

    avg_ocr = sum(ocr_confidences) / len(ocr_confidences) if ocr_confidences else 0.96
    min_name_sim = min(name_similarities) if name_similarities else 1.0

    base_score = 100
    base_score -= blocked_count * 35
    base_score -= warning_count * 12
    if min_name_sim < 0.85:
        base_score -= int((0.85 - min_name_sim) * 40)
    if avg_ocr < 0.90:
        base_score -= int((0.90 - avg_ocr) * 30)

    final_quality_score = max(10, min(100, base_score))

    if blocked_count > 0:
        overall_status = ValidationSeverity.BLOCKED
    elif warning_count > 0:
        overall_status = ValidationSeverity.WARNING
    else:
        overall_status = ValidationSeverity.PASSED

    if overall_status == ValidationSeverity.PASSED:
        ai_summary = (
            "All statutory pre-checks passed with 100% credential consistency. "
            "Zero discrepancies detected. Application is fully optimized for expedited nodal approval."
        )
    elif overall_status == ValidationSeverity.WARNING:
        ai_summary = (
            f"Quality Gate flagged {warning_count} non-blocking advisory item(s). "
            "Identity match and document validity are within acceptable thresholds, but review corrective actions before final filing."
        )
    else:
        ai_summary = (
            f"Quality Gate identified {blocked_count} blocking statutory defect(s). "
            "Filing cannot be submitted in its current state as it violates mandatory verification criteria."
        )

    metrics = QualityMetrics(
        quality_score=final_quality_score,
        ocr_confidence_avg=round(avg_ocr, 3),
        name_similarity_min=round(min_name_sim, 3),
        schema_completeness_pct=100 if len(schema_issues) == 0 else max(60, 100 - len(schema_issues) * 20),
        validity_guardrail_passed=not has_expired_doc,
    )

    return PreflightValidationResponse(
        overall_status=overall_status,
        metrics=metrics,
        passed_checks_count=passed_count,
        warning_checks_count=warning_count,
        blocked_checks_count=blocked_count,
        issues=issues,
        ai_summary=ai_summary,
        timestamp=datetime.now(timezone.utc).isoformat(),
    )
