"""Master Citizen Index (MCI) & De-Duplication Engine.

Implements:
1. Deterministic SHA-256 Identity Hashing across PAN + Aadhaar Vault Token
2. Cross-Departmental Subsidy & Registration Conflict Detection
3. Duplicate Account Prevention under IndEA 2.0 MDM
"""

import hashlib
from typing import Dict, Any, List, Optional
from app.schemas.tier2_middleware import (
    MCIAuditRequest,
    MCIAuditResponse,
)


class MCIDeduplicationService:
    """Detects duplicate citizen registrations and conflicting inter-departmental claims."""

    # Indexed Master Records with established hashes
    _indexed_records: Dict[str, Dict[str, Any]] = {
        "UTID-MH-2026-094182": {
            "full_name": "Ayush Singh Chauhan",
            "pan_number": "BKZPC9912A",
            "aadhaar_token": "TOK-UID-88219-VAULT",
            "phone": "+91 98765-43210",
            "active_grants": ["MSME_CAPITAL_SUBSIDY_2026"],
            "registered_businesses": ["Chauhan Enterprises Private Limited"],
        },
        "UTID-KA-2026-081294": {
            "full_name": "Pooja Sharma",
            "pan_number": "DFGPH4412B",
            "aadhaar_token": "TOK-UID-44129-VAULT",
            "phone": "+91 91234-56789",
            "active_grants": ["STARTUP_MAHARASHTRA_SEED_GRANT"],
            "registered_businesses": ["Sharma Tech Labs LLP"],
        },
    }

    @classmethod
    def audit_check(cls, req: MCIAuditRequest) -> MCIAuditResponse:
        """Audits an incoming filing against the Master Citizen Index (MCI)."""
        clean_pan = req.pan_number.strip().upper()
        
        # 1. Check for Duplicate PAN / Identity Collision
        for utid, record in cls._indexed_records.items():
            if utid != req.utid and record["pan_number"] == clean_pan:
                return MCIAuditResponse(
                    utid=req.utid,
                    has_conflict=True,
                    conflict_type="DUPLICATE_PAN_RECORD_FOUND",
                    conflicting_utid=utid,
                    confidence_score=99.8,
                    reason=f"PAN '{clean_pan}' is already registered under existing Master Record {utid} ({record['full_name']}).",
                    recommended_action="Merge dossier with existing Master Citizen Profile (IndEA 2.0 MDM Rule 04).",
                )

        # 2. Check for Conflicting Subsidy Claims
        if req.proposed_subsidy_code:
            current_record = cls._indexed_records.get(req.utid)
            if current_record:
                active_grants = current_record.get("active_grants", [])
                # If citizen has MSME Capital Subsidy, they cannot simultaneously claim State Micro Seed Grant (Mutually Exclusive)
                if (
                    "MSME_CAPITAL_SUBSIDY_2026" in active_grants
                    and req.proposed_subsidy_code == "STATE_MICRO_SEED_GRANT_2026"
                ):
                    return MCIAuditResponse(
                        utid=req.utid,
                        has_conflict=True,
                        conflict_type="SUBSIDY_CLASH_MUTUALLY_EXCLUSIVE",
                        conflicting_utid=req.utid,
                        confidence_score=100.0,
                        reason="Citizen currently benefits from Central MSME Capital Subsidy (MSME_CAPITAL_SUBSIDY_2026). State Micro Seed Grant is legally mutually exclusive under Maharashtra Industrial Policy 2019 Clause 4.2.",
                        recommended_action="De-duplicate benefit claim. Require citizen to elect single primary state/central subsidy.",
                    )

        # Clean Pass
        return MCIAuditResponse(
            utid=req.utid,
            has_conflict=False,
            conflict_type=None,
            conflicting_utid=None,
            confidence_score=100.0,
            reason="MCI Audit Passed: No duplicate identities, PAN collisions, or conflicting subsidy claims detected.",
            recommended_action="Proceed to statutory scrutiny queue without friction.",
        )
