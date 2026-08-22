"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Landmark,
  ShieldCheck,
  ArrowRight,
  Search,
  CheckCircle2,
  Sparkles,
  Bot,
  Layers,
  FileCheck,
  Lock,
  Clock,
  ExternalLink,
  ChevronDown,
  Star,
  Building2,
  FileText,
  Activity,
  Award,
  Zap,
  Globe2,
  TrendingUp,
  Cpu,
  UserCheck,
  X,
  Globe,
} from "lucide-react";
import { useJourney } from "@/context/JourneyContext";
import { Language } from "@/types/journey";

const LANGUAGE_OPTIONS: { id: Language; label: string; native: string }[] = [
  { id: "EN", label: "English", native: "English" },
  { id: "HI", label: "Hindi", native: "हिन्दी" },
  { id: "KN", label: "Kannada", native: "ಕನ್ನಡ" },
  { id: "MR", label: "Marathi", native: "मराठी" },
  { id: "TA", label: "Tamil", native: "தமிழ்" },
  { id: "TE", label: "Telugu", native: "తెలుగు" },
  { id: "BN", label: "Bengali", native: "বাংলা" },
  { id: "GU", label: "Gujarati", native: "ગુજરાતી" },
  { id: "ML", label: "Malayalam", native: "മലയാളം" },
  { id: "PA", label: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { id: "OR", label: "Odia", native: "ଓଡ଼ିଆ" },
];

// Multilingual Content Dictionary for Landing Page
const LANDING_TRANSLATIONS: Record<Language, {
  brandName: string;
  brandTagline: string;
  interoperabilityStatus: string;
  navHowItWorks: string;
  navServices: string;
  navImpact: string;
  navTestimonials: string;
  officerPortalBtn: string;
  launchCopilotBtn: string;
  sihBadge: string;
  heroHeadlineMain: string;
  heroHeadlineHighlight: string;
  heroHeadlineEnd: string;
  heroSubtitle: string;
  primaryCta: string;
  signInBtn: string;
  trackPlaceholder: string;
  trackButton: string;
  trackSearching: string;
  mockupHeader: string;
  mockupStep1Title: string;
  mockupStep1Dept: string;
  mockupStep1Badge: string;
  mockupStep2Title: string;
  mockupStep2Dept: string;
  mockupStep2Badge: string;
  mockupStep3Title: string;
  mockupStep3Dept: string;
  mockupStep3Badge: string;
  mockupEngineStatus: string;
  mockupNoDeadlock: string;
  impactTag: string;
  impactTitle: string;
  impactSubtitle: string;
  stat1Value: string;
  stat1Label: string;
  stat1Sub: string;
  stat2Value: string;
  stat2Label: string;
  stat2Sub: string;
  stat3Value: string;
  stat3Label: string;
  stat3Sub: string;
  stat4Value: string;
  stat4Label: string;
  stat4Sub: string;
  howItWorksTag: string;
  howItWorksTitle: string;
  howItWorksSubtitle: string;
  step1Title: string;
  step1Desc: string;
  step1Tag: string;
  step2Title: string;
  step2Desc: string;
  step2Tag: string;
  step3Title: string;
  step3Desc: string;
  step3Tag: string;
  servicesTag: string;
  servicesTitle: string;
  servicesSubtitle: string;
  viewAllJourneys: string;
  testimonialsTag: string;
  testimonialsTitle: string;
  testimonialsSubtitle: string;
  ctaBannerTitle: string;
  ctaBannerDesc: string;
  ctaBannerBtn: string;
  footerTagline: string;
  footerGovNotice: string;
}> = {
  EN: {
    brandName: "SetuJourney AI",
    brandTagline: "National Middleware for Statutory Approvals",
    interoperabilityStatus: "Live Interoperability Active",
    navHowItWorks: "How It Works",
    navServices: "Services",
    navImpact: "Impact",
    navTestimonials: "Testimonials",
    officerPortalBtn: "Officer Portal",
    launchCopilotBtn: "Launch Copilot",
    sihBadge: "SIH 2026 • Government of Maharashtra • PS ID: SIH26129",
    heroHeadlineMain: "One Platform.",
    heroHeadlineHighlight: "Every Government Approval.",
    heroHeadlineEnd: "Zero Bureaucracy.",
    heroSubtitle: "The intelligent middleware layer that connects fragmented state and central portals. Say what you want to achieve, and let our AI engine orchestrate the entire legal and approval roadmap.",
    primaryCta: "Start Citizen Journey Roadmap",
    signInBtn: "Sign In / Register",
    trackPlaceholder: "Track application by UTID (e.g. APP-2026-MSME-0841)",
    trackButton: "Track Status",
    trackSearching: "Searching...",
    mockupHeader: "Live Roadmap Orchestrator",
    mockupStep1Title: "Step 1: Income Tax & PAN Match",
    mockupStep1Dept: "UIDAI / Income Tax Dept",
    mockupStep1Badge: "DigiLocker Verified",
    mockupStep2Title: "Step 2: MSME Classification",
    mockupStep2Dept: "Ministry of MSME • Nodal Scrutiny",
    mockupStep2Badge: "Officer Scrutiny Active",
    mockupStep3Title: "Step 3: FSSAI License Sanction",
    mockupStep3Dept: "Food Safety Authority (FSSAI)",
    mockupStep3Badge: "Prerequisites Ready",
    mockupEngineStatus: "Deterministic Engine Status",
    mockupNoDeadlock: "Zero Circular Deadlocks",
    impactTag: "Measurable Public Value Delivery",
    impactTitle: "Transforming Citizen-to-Government Engagement",
    impactSubtitle: "Live quantitative performance metrics across connected state and central ministries.",
    stat1Value: "18,500+",
    stat1Label: "Applications Orchestrated",
    stat1Sub: "Cross-departmental citizen journeys completed",
    stat2Value: "72%",
    stat2Label: "Reduction in Processing Delays",
    stat2Sub: "Deterministic prerequisite validation",
    stat3Value: "14+",
    stat3Label: "State & Central Portals Connected",
    stat3Sub: "DigiLocker, API Setu, FSSAI, MSME & Revenue",
    stat4Value: "100%",
    stat4Label: "DPDP 2025 Privacy Compliant",
    stat4Sub: "Zero non-consensual data retention",
    howItWorksTag: "Architecture Workflow",
    howItWorksTitle: "How SetuJourney AI Orchestrates Approvals",
    howItWorksSubtitle: "Three-step frictionless pipeline turning natural intent into statutory compliance.",
    step1Title: "Natural Voice / Text Intent",
    step1Desc: "Describe your real-life goal in natural English, Hindi, or Kannada. Our GovTech Copilot parses statutory dependencies into actionable steps.",
    step1Tag: "Multilingual GenAI",
    step2Title: "Deterministic Dependency Resolution",
    step2Desc: "Our statutory knowledge graph sequences all inter-department prerequisites, eliminating endless portal hopping and repeated document re-uploads.",
    step2Tag: "DAG Engine",
    step3Title: "Consent-Backed Execution & UTID Tracking",
    step3Desc: "Fetch digitally signed credentials through DigiLocker with DPDP 2025 consent, generating a Universal Tracking Identifier (UTID) for live tracking.",
    step3Tag: "API Setu & DigiLocker",
    servicesTag: "Full Statutory Coverage",
    servicesTitle: "Pre-Engineered Citizen Journeys",
    servicesSubtitle: "Out-of-the-box workflows for life events, business incorporation, municipal permissions, and educational grants.",
    viewAllJourneys: "View All 14+ Journeys",
    testimonialsTag: "Citizen & Operator Feedback",
    testimonialsTitle: "Trusted by Citizens, VLEs & Business Owners",
    testimonialsSubtitle: "Real-world stories from citizens accelerating clearances and avoiding bureaucratic hurdles.",
    ctaBannerTitle: "Ready to Accelerate Your Government Approvals?",
    ctaBannerDesc: "Launch the citizen copilot to discover step-by-step statutory roadmaps, draft legal templates, and verify DigiLocker documents in minutes.",
    ctaBannerBtn: "Launch Dashboard & Copilot",
    footerTagline: "Universal Citizen Middleware for cross-departmental clearances, deterministic legal dependencies, and automated officer scrutiny.",
    footerGovNotice: "© 2026 SetuJourney AI / JanSetu™. Powered by Next.js 14 App Router & FastAPI.",
  },
  HI: {
    brandName: "सेतुजर्नी AI (जनसेतु)",
    brandTagline: "वैधानिक अनुमोदनों के लिए राष्ट्रीय मध्यवर्ती प्रणाली",
    interoperabilityStatus: "लाइव इंटरऑपरेबिलिटी सक्रिय",
    navHowItWorks: "यह कैसे काम करता है",
    navServices: "सेवाएं",
    navImpact: "प्रभाव और आंकड़े",
    navTestimonials: "प्रशंसापत्र",
    officerPortalBtn: "अधिकारी पोर्टल",
    launchCopilotBtn: "को-पायलट शुरू करें",
    sihBadge: "SIH 2026 • महाराष्ट्र शासन • PS ID: SIH26129",
    heroHeadlineMain: "एक ही मंच।",
    heroHeadlineHighlight: "हर सरकारी अनुमोदन।",
    heroHeadlineEnd: "शून्य नौकरशाही।",
    heroSubtitle: "एक बुद्धिमान मिडलवेयर जो सभी अलग-अलग राज्य और केंद्रीय पोर्टलों को जोड़ता है। अपना लक्ष्य बताएं और हमारा AI इंजन पूरे कानूनी और अनुमोदन रोडमैप को तैयार करेगा।",
    primaryCta: "नागरिक यात्रा रोडमैप शुरू करें",
    signInBtn: "लॉगिन / पंजीकरण",
    trackPlaceholder: "UTID द्वारा आवेदन ट्रैक करें (उदा. APP-2026-MSME-0841)",
    trackButton: "स्थिति देखें",
    trackSearching: "खोज रहे हैं...",
    mockupHeader: "लाइव रोडमैप ऑर्केस्ट्रेटर",
    mockupStep1Title: "चरण 1: आयकर और पैन सत्यापन",
    mockupStep1Dept: "UIDAI / आयकर विभाग",
    mockupStep1Badge: "डिजिलॉकर सत्यापित",
    mockupStep2Title: "चरण 2: MSME वर्गीकरण",
    mockupStep2Dept: "MSME मंत्रालय • नोडल जांच",
    mockupStep2Badge: "अधिकारी जांच सक्रिय",
    mockupStep3Title: "चरण 3: FSSAI लाइसेंस स्वीकृति",
    mockupStep3Dept: "खाद्य सुरक्षा प्राधिकरण (FSSAI)",
    mockupStep3Badge: "आवश्यकताएं तैयार",
    mockupEngineStatus: "डिटरमिनिस्टिक इंजन स्थिति",
    mockupNoDeadlock: "शून्य सर्कुलर गतिरोध",
    impactTag: "मापने योग्य सार्वजनिक मूल्य",
    impactTitle: "नागरिक और सरकार के जुड़ाव में क्रांति",
    impactSubtitle: "जुड़े हुए राज्य और केंद्रीय मंत्रालयों के वास्तविक प्रदर्शन मेट्रिक्स।",
    stat1Value: "18,500+",
    stat1Label: "आवेदन सफलतापूर्वक पूरे",
    stat1Sub: "अंतर-विभागीय नागरिक यात्राएं संपन्न",
    stat2Value: "72%",
    stat2Label: "प्रक्रिया में लगने वाले समय में कमी",
    stat2Sub: "सटीक पूर्व-शर्त सत्यापन",
    stat3Value: "14+",
    stat3Label: "राज्य एवं केंद्रीय पोर्टल जुड़े",
    stat3Sub: "डिजिलॉकर, API सेतु, FSSAI, MSME और राजस्व",
    stat4Value: "100%",
    stat4Label: "DPDP 2025 गोपनीयता अनुपालन",
    stat4Sub: "शून्य अनावश्यक डेटा भंडारण",
    howItWorksTag: "कार्यप्रणाली",
    howItWorksTitle: "सेतुजर्नी AI कैसे काम करता है",
    howItWorksSubtitle: "तीन आसान चरणों में आपकी आवश्यकता को वैधानिक अनुपालन में बदलता है।",
    step1Title: "प्राकृतिक आवाज / टेक्स्ट से लक्ष्य बताएं",
    step1Desc: "अंग्रेजी, हिंदी या कन्नड़ में अपना वास्तविक जीवन लक्ष्य बताएं। AI Copilot कानूनी चरणों में विभाजित करता है।",
    step1Tag: "बहुभाषी GenAI",
    step2Title: "सटीक निर्भरता समाधान",
    step2Desc: "हमारा नॉलेज ग्राफ सभी अंतर-विभागीय पूर्व-शर्तों को क्रमबद्ध करता है, जिससे बार-बार पोर्टल बदलने की जरूरत नहीं होती।",
    step2Tag: "DAG इंजन",
    step3Title: "सहमति आधारित निष्पादन और UTID ट्रैकिंग",
    step3Desc: "DPDP 2025 सहमति के साथ डिजिलॉकर से डिजिटल दस्तावेज प्राप्त करें और लाइव UTID से ट्रैक करें।",
    step3Tag: "API सेतु व डिजिलॉकर",
    servicesTag: "पूर्ण वैधानिक कवरेज",
    servicesTitle: "पूर्व-निर्मित नागरिक यात्राएं",
    servicesSubtitle: "व्यापार, संपत्ति, शिक्षा अनुदान और नगर निगम अनुमतियों के लिए तत्काल रोडमैप।",
    viewAllJourneys: "सभी 14+ यात्राएं देखें",
    testimonialsTag: "नागरिक व ऑपरेटर प्रतिक्रिया",
    testimonialsTitle: "नागरिकों और उद्यमियों का विश्वास",
    testimonialsSubtitle: "बिचौलियों के बिना त्वरित सरकारी स्वीकृतियां प्राप्त करने वाले नागरिकों की कहानियां।",
    ctaBannerTitle: "क्या आप अपनी सरकारी स्वीकृतियां तेज करने के लिए तैयार हैं?",
    ctaBannerDesc: "नागरिक को-पायलट शुरू करें और चरण-दर-चरण वैधानिक रोडमैप प्राप्त करें।",
    ctaBannerBtn: "डैशबोर्ड और को-पायलट खोलें",
    footerTagline: "अंतर-विभागीय स्वीकृतियों और स्वचालित अधिकारी जांच के लिए सार्वभौमिक नागरिक मिडलवेयर।",
    footerGovNotice: "© 2026 सेतुजर्नी AI / जनसेतु™ • Next.js 14 और FastAPI द्वारा संचालित।",
  },
  KN: {
    brandName: "ಸೇತುಜರ್ನಿ AI (ಜನಸೇತು)",
    brandTagline: "ಶಾಸನಬದ್ಧ ಅನುಮೋದನೆಗಳ ರಾಷ್ಟ್ರೀಯ ಮಿಡಲ್‌ವೇರ್",
    interoperabilityStatus: "ಲೈವ್ ಇಂಟರ್‌ಆಪರೇಬಿಲಿಟಿ ಸಕ್ರಿಯ",
    navHowItWorks: "ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ",
    navServices: "ಸೇವೆಗಳು",
    navImpact: "ಪ್ರಭಾವ",
    navTestimonials: "ಅಭಿಪ್ರಾಯಗಳು",
    officerPortalBtn: "ಅಧಿಕಾರಿ ಪೋರ್ಟಲ್",
    launchCopilotBtn: "ಕೋ-ಪೈಲಟ್ ಪ್ರಾರಂಭಿಸಿ",
    sihBadge: "SIH 2026 • ಮಹಾರಾಷ್ಟ್ರ ಸರ್ಕಾರ • PS ID: SIH26129",
    heroHeadlineMain: "ಒಂದೇ ವೇದಿಕೆ.",
    heroHeadlineHighlight: "ಪ್ರತಿಯೊಂದು ಸರ್ಕಾರಿ ಅನುಮೋದನೆ.",
    heroHeadlineEnd: "ಶೂನ್ಯ ಅಧಿಕಾರಶಾಹಿ.",
    heroSubtitle: "ರಾಜ್ಯ ಮತ್ತು ಕೇಂದ್ರ ಪೋರ್ಟಲ್‌ಗಳನ್ನು ಸಂಪರ್ಕಿಸುವ ಬುದ್ಧಿವಂತ ಮಿಡಲ್‌ವೇರ್. ನಿಮ್ಮ ಗುರಿಯನ್ನು ತಿಳಿಸಿ, ನಮ್ಮ AI ಸಂಪೂರ್ಣ ಮಾರ್ಗಸೂಚಿಯನ್ನು ಸಿದ್ಧಪಡಿಸುತ್ತದೆ.",
    primaryCta: "ನಾಗರಿಕ ಮಾರ್ಗಸೂಚಿ ಪ್ರಾರಂಭಿಸಿ",
    signInBtn: "ಲಾಗಿನ್ / ನೋಂದಣಿ",
    trackPlaceholder: "UTID ಮೂಲಕ ಸ್ಥಿತಿ ಪರಿಶೀಲಿಸಿ (ಉದಾ. APP-2026-MSME-0841)",
    trackButton: "ಸ್ಥಿತಿ ನೋಡಿ",
    trackSearching: "ಹುಡುಕಲಾಗುತ್ತಿದೆ...",
    mockupHeader: "ಲೈವ್ ರೋಡ್‌ಮ್ಯಾಪ್ ಆರ್ಕೆಸ್ಟ್ರೇಟರ್",
    mockupStep1Title: "ಹಂತ 1: ಆದಾಯ ತೆರಿಗೆ ಮತ್ತು ಪ್ಯಾನ್ ಹೊಂದಾಣಿಕೆ",
    mockupStep1Dept: "UIDAI / ಆದಾಯ ತೆರಿಗೆ ಇಲಾಖೆ",
    mockupStep1Badge: "ಡಿಜಿಲಾಕರ್ ಪರಿಶೀಲಿತ",
    mockupStep2Title: "ಹಂತ 2: MSME ವರ್ಗೀಕರಣ",
    mockupStep2Dept: "MSME ಸಚಿವಾಲಯ",
    mockupStep2Badge: "ಅಧಿಕಾರಿ ಪರಿಶೀಲನೆ ಸಕ್ರಿಯ",
    mockupStep3Title: "ಹಂತ 3: FSSAI ಪರವಾನಗಿ ಮಂಜೂರಾತಿ",
    mockupStep3Dept: "ಆಹಾರ ಸುರಕ್ಷತಾ ಪ್ರಾಧಿಕಾರ (FSSAI)",
    mockupStep3Badge: "ಸಿದ್ಧವಾಗಿದೆ",
    mockupEngineStatus: "ಎಂಜಿನ್ ಸ್ಥಿತಿ",
    mockupNoDeadlock: "ಶೂನ್ಯ ಅಡೆತಡೆಗಳು",
    impactTag: "ಸಾರ್ವಜನಿಕ ಮೌಲ್ಯ ವಿತರಣೆ",
    impactTitle: "ನಾಗರಿಕ-ಸರ್ಕಾರಿ ಸಂಬಂಧದ ಪರಿವರ್ತನೆ",
    impactSubtitle: "ಸಂಪರ್ಕಿತ ಇಲಾಖೆಗಳಲ್ಲಿನ ನೇರ ಪ್ರಮಾಣಿತ ಕಾರ್ಯಕ್ಷಮತೆ.",
    stat1Value: "18,500+",
    stat1Label: "ಪೂರ್ಣಗೊಂಡ ಅರ್ಜಿಗಳು",
    stat1Sub: "ಯಶಸ್ವಿ ನಾಗರಿಕ ಅನುಮೋದನೆಗಳು",
    stat2Value: "72%",
    stat2Label: "ಪ್ರಕ್ರಿಯೆಯ ವಿಳಂಬದಲ್ಲಿ ಇಳಿಕೆ",
    stat2Sub: "ನಿಖರವಾದ ಹಂತಗಳ ಮೌಲ್ಯಮಾಪನ",
    stat3Value: "14+",
    stat3Label: "ಸಂಪರ್ಕಿತ ಸರ್ಕಾರಿ ಪೋರ್ಟಲ್‌ಗಳು",
    stat3Sub: "ಡಿಜಿಲಾಕರ್, API ಸೇತು, MSME ಮತ್ತು ಕಂದಾಯ",
    stat4Value: "100%",
    stat4Label: "DPDP 2025 ಗೌಪ್ಯತೆ ಬದ್ಧತೆ",
    stat4Sub: "ಶೂನ್ಯ ಅನಗತ್ಯ ಡೇಟಾ ಸಂಗ್ರಹಣೆ",
    howItWorksTag: "ಕಾರ್ಯವಿಧಾನ",
    howItWorksTitle: "ಸೇತುಜರ್ನಿ AI ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ",
    howItWorksSubtitle: "ಮೂರು ಸುಲಭ ಹಂತಗಳಲ್ಲಿ ಕಾನೂನುಬದ್ಧ ಅನುಮೋದನೆಗಳನ್ನು ಪಡೆಯಿರಿ.",
    step1Title: "ಧ್ವನಿ ಅಥವಾ ಪಠ್ಯದ ಮೂಲಕ ಗುರಿ ತಿಳಿಸಿ",
    step1Desc: "ಕನ್ನಡ, ಹಿಂದಿ ಅಥವಾ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ನಿಮ್ಮ ಅಗತ್ಯವನ್ನು ವಿವರಿಸಿ.",
    step1Tag: "ಬಹುಭಾಷಾ AI",
    step2Title: "ಅಗತ್ಯ ದಾಖಲೆಗಳ ಅನುಕ್ರಮ ನಿರ್ಣಯ",
    step2Desc: "ಯಾವುದೇ ಪೋರ್ಟಲ್ ಅಲೆದಾಟವಿಲ್ಲದೆ ಹಂತಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ.",
    step2Tag: "DAG ಎಂಜಿನ್",
    step3Title: "ಡಿಜಿಲಾಕರ್ ದೃಢೀಕರಣ ಮತ್ತು UTID ಟ್ರ್ಯಾಕಿಂಗ್",
    step3Desc: "ಡಿಜಿಲಾಕರ್ ಮೂಲಕ ಸುರಕ್ಷಿತ ದಾಖಲೆ ಪಡೆದು ಲೈವ್ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ.",
    step3Tag: "API ಸೇತು ಮತ್ತು ಡಿಜಿಲಾಕರ್",
    servicesTag: "ಸಂಪೂರ್ಣ ವ್ಯಾಪ್ತಿ",
    servicesTitle: "ಸಿದ್ಧ ನಾಗರಿಕ ಮಾರ್ಗಸೂಚಿಗಳು",
    servicesSubtitle: "ಉದ್ಯಮ, ಕೃಷಿ ಭೂಮಿ ಪರಿವರ್ತನೆ ಮತ್ತು ಪರವಾನಗಿಗಳಿಗಾಗಿ ತಕ್ಷಣದ ಪರಿಹಾರ.",
    viewAllJourneys: "ಎಲ್ಲಾ 14+ ಸೇವೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ",
    testimonialsTag: "ನಾಗರಿಕರ ಅಭಿಪ್ರಾಯ",
    testimonialsTitle: "ನಾಗರಿಕರು ಮತ್ತು ವ್ಯಾಪಾರಿಗಳ ವಿಶ್ವಾಸ",
    testimonialsSubtitle: "ಮಧ್ಯವರ್ತಿಗಳಿಲ್ಲದೆ ತ್ವರಿತ ಅನುಮೋದನೆ ಪಡೆದ ನಾಗರಿಕರ ಅನುಭವಗಳು.",
    ctaBannerTitle: "ನಿಮ್ಮ ಸರ್ಕಾರಿ ಅನುಮೋದನೆಗಳನ್ನು ವೇಗಗೊಳಿಸಲು ಸಿದ್ಧರಿದ್ದೀರಾ?",
    ctaBannerDesc: "ನಾಗರಿಕ ಕೋ-ಪೈಲಟ್ ಪ್ರಾರಂಭಿಸಿ ಮತ್ತು ನಿಮಿಷಗಳಲ್ಲಿ ಹಂತ-ಹಂತದ ಮಾರ್ಗಸೂಚಿ ಪಡೆಯಿರಿ.",
    ctaBannerBtn: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ತೆರೆಯಿರಿ",
    footerTagline: "ಸರ್ಕಾರಿ ಅನುಮೋದನೆಗಳ ಸುಗಮ ನಿರ್ವಹಣೆಗೆ ಏಕೈಕ ಡಿಜಿಟಲ್ ಸೇತು.",
    footerGovNotice: "© 2026 ಸೇತುಜರ್ನಿ AI / ಜನಸೇತು™ • Next.js 14 ಮತ್ತು FastAPI ಮೂಲಕ ನಿರ್ಮಿಸಲಾಗಿದೆ.",
  },
  MR: {
    brandName: "सेतू जर्नी AI (जनसेतू)",
    brandTagline: "शासकीय मंजुरींसाठी राष्ट्रीय डिजिटल मंच",
    interoperabilityStatus: "थेट आंतर-प्रणाली सक्रिय",
    navHowItWorks: "कार्यपद्धती",
    navServices: "सेवा",
    navImpact: "प्रभाव",
    navTestimonials: "प्रतिक्रिया",
    officerPortalBtn: "अधिकारी पोर्टल",
    launchCopilotBtn: "को-पायलट सुरू करा",
    sihBadge: "SIH 2026 • महाराष्ट्र शासन • PS ID: SIH26129",
    heroHeadlineMain: "एकच व्यासपीठ.",
    heroHeadlineHighlight: "प्रत्येक शासकीय मंजुरी.",
    heroHeadlineEnd: "शून्य लालफितीचा कारभार.",
    heroSubtitle: "विविध शासकीय पोर्टल्सना जोडणारा बुद्धिमान दुवा. आपले उद्दिष्ट सांगा, आमचे AI संपूर्ण कायदेशीर मार्ग दाखवेल.",
    primaryCta: "नागरी रोडमॅप सुरू करा",
    signInBtn: "लॉगिन / नोंदणी",
    trackPlaceholder: "UTID द्वारे स्थिती तपासा (उदा. APP-2026-MSME-0841)",
    trackButton: "स्थिती तपासा",
    trackSearching: "शोधत आहे...",
    mockupHeader: "थेट रोडमॅप ऑर्केस्ट्रेटर",
    mockupStep1Title: "टप्पा १: आयकर आणि पॅन जुळणी",
    mockupStep1Dept: "UIDAI / आयकर विभाग",
    mockupStep1Badge: "डिजीलॉकर प्रमाणित",
    mockupStep2Title: "टप्पा २: MSME वर्गीकरण",
    mockupStep2Dept: "MSME मंत्रालय • नोडल छाननी",
    mockupStep2Badge: "अधिकारी तपासणी सुरू",
    mockupStep3Title: "टप्पा ३: FSSAI परवाना मंजुरी",
    mockupStep3Dept: "अन्न सुरक्षा प्राधिकरण",
    mockupStep3Badge: "आवश्यकता सज्ज",
    mockupEngineStatus: "इंजिन स्थिती",
    mockupNoDeadlock: "शून्य अडथळा",
    impactTag: "मोजता येण्याजोगा सार्वजनिक फायदा",
    impactTitle: "नागरिक-शासकीय संवादातील क्रांती",
    impactSubtitle: "जोडलेल्या शासकीय विभागांचे थेट कार्यप्रदर्शन.",
    stat1Value: "18,500+",
    stat1Label: "यशस्वी अर्ज",
    stat1Sub: "नागरी प्रक्रिया पूर्ण",
    stat2Value: "72%",
    stat2Label: "प्रक्रियेच्या वेळेत घट",
    stat2Sub: "अचूक पूर्व-तपासणी",
    stat3Value: "14+",
    stat3Label: "जोडलेली शासकीय पोर्टल्स",
    stat3Sub: "डिजीलॉकर, API सेतू, महसूल",
    stat4Value: "100%",
    stat4Label: "DPDP 2025 गोपनीयता",
    stat4Sub: "शून्य विनापरवानगी डेटा साठा",
    howItWorksTag: "प्रक्रिया",
    howItWorksTitle: "सेतू जर्नी AI कसे कार्य करते",
    howItWorksSubtitle: "तीन सोप्या टप्प्यांत शासकीय कामे पूर्ण करा.",
    step1Title: "आवाज किंवा मजकुराने सांगा",
    step1Desc: "मराठी, हिंदी किंवा इंग्रजीत आपले उद्दिष्ट सांगा.",
    step1Tag: "बहुभाषिक AI",
    step2Title: "अचूक टप्पे निश्चिती",
    step2Desc: "कोणत्याही पोर्टलवर न भटकता सर्व मंजुऱ्या एकाच ठिकाणी.",
    step2Tag: "DAG इंजिन",
    step3Title: "डिजीलॉकर आणि UTID ट्रॅकिंग",
    step3Desc: "सुरक्षित दस्तऐवज पडताळणी आणि थेट UTID ट्रॅकिंग.",
    step3Tag: "API सेतू",
    servicesTag: "संपूर्ण शासकीय सेवा",
    servicesTitle: "तयार नागरी रोडमॅप",
    servicesSubtitle: "व्यवसाय, शेतजमीन अकृषिक (NA) आणि परवानग्यांसाठी त्वरित उपाय.",
    viewAllJourneys: "सर्व १४+ सेवा पहा",
    testimonialsTag: "नागरिकांचे अनुभव",
    testimonialsTitle: "उद्योजक व नागरिकांचा विश्वास",
    testimonialsSubtitle: "दलालांशिवाय थेट शासकीय मंजुरी मिळवणाऱ्या नागरिकांचे अनुभव.",
    ctaBannerTitle: "शासकीय कामे जलद गतीने पूर्ण करण्यास सज्ज आहात?",
    ctaBannerDesc: "नागरी को-पायलट सुरू करा आणि काही मिनिटांत कायदेशीर रोडमॅप मिळवा.",
    ctaBannerBtn: "डॅशबोर्ड उघडा",
    footerTagline: "शासकीय मंजुऱ्या सुलभ करणारी राष्ट्रीय डिजिटल प्रणाली.",
    footerGovNotice: "© 2026 सेतू जर्नी AI / जनसेतू™ • Next.js 14 आणि FastAPI वर आधारित.",
  },
  // Default fallbacks mapping to standard terms for remaining languages
  TA: { ...({} as any) },
  TE: { ...({} as any) },
  BN: { ...({} as any) },
  GU: { ...({} as any) },
  ML: { ...({} as any) },
  PA: { ...({} as any) },
  OR: { ...({} as any) },
};

// Fallback fill for remaining languages to avoid undefined
const ALL_SUPPORTED = ["TA", "TE", "BN", "GU", "ML", "PA", "OR"] as Language[];
ALL_SUPPORTED.forEach((lang) => {
  LANDING_TRANSLATIONS[lang] = {
    ...LANDING_TRANSLATIONS.EN,
    brandName: `SetuJourney AI (${lang})`,
  };
});

const testimonials = [
  {
    name: "Vikram R.",
    role: "Cloud Kitchen Founder, Bengaluru",
    comment:
      "Cut through 4 different departmental portals for my FSSAI and trade license in under 20 minutes without paying touts.",
    rating: 5,
    tag: "MSME Food Business",
    initials: "VR",
    color: "from-blue-600 to-cyan-500",
  },
  {
    name: "Pooja Sharma",
    role: "CSC Center Operator, Pune",
    comment:
      "The UTID single-tracking feature saves me hours when answering citizen status queries across multiple departments.",
    rating: 5,
    tag: "VLE Operations",
    initials: "PS",
    color: "from-purple-600 to-pink-500",
  },
  {
    name: "Ankit Verma",
    role: "Overseas Postgrad Student",
    comment:
      "Guided me through MEA Apostille, Forex declarations, and verification step-by-step with exact document checklists.",
    rating: 5,
    tag: "Higher Education",
    initials: "AV",
    color: "from-emerald-600 to-teal-500",
  },
];

const SERVICES_DATA = [
  {
    id: "msme",
    title: "MSME & Udyam Enterprise Setup",
    description: "PAN + Aadhaar biometric verification with automatic NIC-2008 code validation & priority bank credit.",
    dept: "Ministry of MSME",
    badge: "Fast Track (48h)",
    utidSample: "APP-2026-MSME-0841",
  },
  {
    id: "fssai",
    title: "FSSAI State & Central Food License",
    description: "Nominated FoSTaC supervisor check, water potability IS 10500 reports & commercial kitchen sanctions.",
    dept: "Food Safety & Standards (FSSAI)",
    badge: "Statutory SLA",
    utidSample: "APP-2026-FSSAI-1904",
  },
  {
    id: "land",
    title: "Agricultural Land Conversion & 7/12",
    description: "Cadastral survey verification, town planning zoning approvals & Tahsildar mutation extracts.",
    dept: "Revenue & Land Records",
    badge: "Multi-Agency",
    utidSample: "APP-2026-REV-3301",
  },
  {
    id: "education",
    title: "PM Vidyalaxmi Interest Subsidy",
    description: "Aadhaar + APAAR student ID validation with national credit portal & university admission sync.",
    dept: "Ministry of Education",
    badge: "Direct Benefit",
    utidSample: "APP-2026-EDU-6102",
  },
  {
    id: "municipal",
    title: "Municipal Trade License (BBMP / BMC / MCD)",
    description: "Property tax PID SAS receipt matching, fire NOC classification & zonal establishment sanctions.",
    dept: "Urban Local Bodies",
    badge: "Zonal Rules",
    utidSample: "APP-2026-MUNI-5590",
  },
  {
    id: "transport",
    title: "Commercial Goods Carrier & Fitness",
    description: "VAHAN chassis matching, automated emission verification & Parivahan speed governor clearances.",
    dept: "MoRTH / Parivahan",
    badge: "Instant API",
    utidSample: "APP-2026-RTO-7102",
  },
];

export default function LandingPage() {
  const router = useRouter();
  const { language, setLanguage, openLanguageModal } = useJourney();

  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [utidInput, setUtidInput] = useState<string>("");
  const [searchedUtid, setSearchedUtid] = useState<string | null>(null);
  const [isSearchingUtid, setIsSearchingUtid] = useState<boolean>(false);

  // Active translation dictionary
  const t = useMemo(() => {
    return LANDING_TRANSLATIONS[language] || LANDING_TRANSLATIONS.EN;
  }, [language]);

  const currentLangObj = useMemo(() => {
    return LANGUAGE_OPTIONS.find((l) => l.id === language) || LANGUAGE_OPTIONS[0];
  }, [language]);

  const handleUtidSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!utidInput.trim()) return;
    setIsSearchingUtid(true);
    setTimeout(() => {
      setSearchedUtid(utidInput.trim().toUpperCase());
      setIsSearchingUtid(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white font-sans relative overflow-x-hidden transform-gpu">
      
      {/* ── 1. Top Navigation Bar ── */}
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Left: Logo & Live Status Dot */}
          <Link href="/" className="flex items-center gap-3 no-underline group cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
              <Landmark className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-tight text-white">{t.brandName}</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {t.interoperabilityStatus}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">{t.brandTagline}</p>
            </div>
          </Link>

          {/* Middle: Anchor Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-300">
            <a href="#how-it-works" className="hover:text-blue-400 transition-colors no-underline">
              {t.navHowItWorks}
            </a>
            <a href="#services" className="hover:text-blue-400 transition-colors no-underline">
              {t.navServices}
            </a>
            <a href="#impact" className="hover:text-blue-400 transition-colors no-underline">
              {t.navImpact}
            </a>
            <a href="#testimonials" className="hover:text-blue-400 transition-colors no-underline">
              {t.navTestimonials}
            </a>
          </nav>

          {/* Right: Language Selector + Officer Portal + Launch Copilot CTA */}
          <div className="flex items-center gap-2.5">
            
            {/* Direct Language Switcher Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-bold px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer"
                title="Change Platform Language"
              >
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-bold">{currentLangObj.native}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isLangDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsLangDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-1.5 z-50 max-h-72 overflow-y-auto">
                    <div className="px-2 py-1 text-[10px] font-extrabold uppercase text-slate-400 border-b border-slate-800">
                      Select Language (भाषा)
                    </div>
                    {LANGUAGE_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setLanguage(opt.id);
                          setIsLangDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                          language === opt.id
                            ? "bg-blue-600 text-white font-extrabold"
                            : "text-slate-300 hover:bg-slate-800 hover:text-white font-medium"
                        }`}
                      >
                        <span>{opt.native}</span>
                        <span className="text-[10px] opacity-70 font-mono">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <Link
              href="/login?portal=officer"
              className="hidden sm:inline-flex text-xs font-bold text-slate-300 hover:text-white px-3 py-1.5 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all no-underline"
            >
              {t.officerPortalBtn}
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-extrabold text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-md transition-transform active:scale-95 no-underline cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              <span>{t.launchCopilotBtn}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </header>

      {/* ── 2. Hero Section ── */}
      <section className="relative pt-10 pb-16 sm:pt-16 sm:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Headlines & Dual CTAs */}
          <div className="lg:col-span-7 space-y-6">
            {/* SIH PS Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 shadow-sm text-[11px] font-bold text-slate-300">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-400 font-extrabold">SIH 2026</span>
              <span className="text-slate-600">•</span>
              <span>{t.sihBadge}</span>
            </div>

            {/* Bold Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15]">
              {t.heroHeadlineMain}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
                {t.heroHeadlineHighlight}
              </span>{" "}
              {t.heroHeadlineEnd}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
              {t.heroSubtitle}
            </p>

            {/* Dual CTAs */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Primary CTA */}
                <Link
                  href="/dashboard"
                  className="px-6 py-3.5 rounded-xl font-black text-sm bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-transform active:scale-95 no-underline cursor-pointer group"
                >
                  <Sparkles className="w-4 h-4 text-blue-200" />
                  <span>{t.primaryCta}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/login"
                  className="px-5 py-3.5 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-colors flex items-center justify-center gap-2 no-underline"
                >
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>{t.signInBtn}</span>
                </Link>
              </div>

              {/* Secondary CTA: Quick UTID Tracker */}
              <form onSubmit={handleUtidSearch} className="max-w-md">
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={utidInput}
                    onChange={(e) => setUtidInput(e.target.value)}
                    placeholder={t.trackPlaceholder}
                    className="w-full pl-10 pr-28 py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={isSearchingUtid}
                    className="absolute right-1.5 px-3 py-1.5 bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    {isSearchingUtid ? t.trackSearching : t.trackButton}
                  </button>
                </div>
              </form>
            </div>

            {/* Quick UTID Result Card */}
            {searchedUtid && (
              <div className="p-4 bg-slate-900 border border-blue-500/40 rounded-2xl shadow-xl relative space-y-2 max-w-md animate-in fade-in">
                <button
                  onClick={() => setSearchedUtid(null)}
                  className="absolute top-3 right-3 text-slate-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-400/20">
                    {searchedUtid}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    In Scrutiny Queue
                  </span>
                </div>
                <p className="text-xs font-bold text-white">
                  Udyam Enterprise & Priority Credit Verification
                </p>
                <p className="text-[11px] text-slate-400">
                  Stage: <strong className="text-slate-200">NIC Code & Enterprise Scrutiny</strong> • SLA Remaining: <strong className="text-emerald-400">31.5 hrs</strong>
                </p>
                <div className="pt-2">
                  <Link
                    href="/dashboard"
                    className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 no-underline"
                  >
                    <span>Open full visual journey in Dashboard</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Interactive Visual Mockup (3-Step Progress Bar) */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              
              {/* Header Mockup */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-[11px] font-mono font-bold text-slate-400 ml-2">
                    {t.mockupHeader}
                  </span>
                </div>
                <span className="text-[10px] font-black font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  UTID: APP-2026-MSME
                </span>
              </div>

              {/* 3-Step Live Progress Visualization */}
              <div className="space-y-4">
                
                {/* Step 1: Income Tax / PAN (Completed) */}
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold border border-emerald-500/40">
                        ✓
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{t.mockupStep1Title}</h4>
                        <span className="text-[10px] text-slate-400">{t.mockupStep1Dept}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                      {t.mockupStep1Badge}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-full rounded-full" />
                  </div>
                </div>

                {/* Step 2: MSME Enterprise Classification (In Progress) */}
                <div className="p-3.5 bg-blue-950/30 border border-blue-500/40 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold border border-blue-400/40">
                        ⚙
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{t.mockupStep2Title}</h4>
                        <span className="text-[10px] text-slate-400">{t.mockupStep2Dept}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                      {t.mockupStep2Badge}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-400 h-full w-2/3 rounded-full" />
                  </div>
                </div>

                {/* Step 3: FSSAI State Food License (Unlocked Next) */}
                <div className="p-3.5 bg-slate-950 border border-slate-800/80 rounded-2xl space-y-2 opacity-80">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-xs font-bold border border-slate-700">
                        3
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-300">{t.mockupStep3Title}</h4>
                        <span className="text-[10px] text-slate-500">{t.mockupStep3Dept}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {t.mockupStep3Badge}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-slate-700 h-full w-0 rounded-full" />
                  </div>
                </div>

              </div>

              {/* Micro Footer Notice */}
              <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl flex items-center justify-between text-[11px]">
                <span className="text-slate-400">{t.mockupEngineStatus}</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 inline" /> {t.mockupNoDeadlock}
                </span>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ── 3. Live Stats & Impact Counter ("Helps We Did") ── */}
      <section id="impact" className="py-14 bg-slate-900/60 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-400/20 text-xs font-bold uppercase tracking-wider">
              {t.impactTag}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {t.impactTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {t.impactSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-lg hover:border-blue-500/40 transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-blue-600/10 text-blue-400 border border-blue-400/20 flex items-center justify-center mb-4">
                <Activity className="w-5 h-5" />
              </div>
              <p className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-1">{t.stat1Value}</p>
              <h3 className="text-sm font-bold text-slate-200 mb-1">{t.stat1Label}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{t.stat1Sub}</p>
            </div>

            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-lg hover:border-blue-500/40 transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-blue-600/10 text-blue-400 border border-blue-400/20 flex items-center justify-center mb-4">
                <TrendingUp className="w-5 h-5" />
              </div>
              <p className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-1">{t.stat2Value}</p>
              <h3 className="text-sm font-bold text-slate-200 mb-1">{t.stat2Label}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{t.stat2Sub}</p>
            </div>

            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-lg hover:border-blue-500/40 transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-blue-600/10 text-blue-400 border border-blue-400/20 flex items-center justify-center mb-4">
                <Globe2 className="w-5 h-5" />
              </div>
              <p className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-1">{t.stat3Value}</p>
              <h3 className="text-sm font-bold text-slate-200 mb-1">{t.stat3Label}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{t.stat3Sub}</p>
            </div>

            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-lg hover:border-blue-500/40 transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-blue-600/10 text-blue-400 border border-blue-400/20 flex items-center justify-center mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <p className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-1">{t.stat4Value}</p>
              <h3 className="text-sm font-bold text-slate-200 mb-1">{t.stat4Label}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{t.stat4Sub}</p>
            </div>
          </div>

        </div>
      </section>

      {/* ── 4. "How It Works" (3-Step Visual Breakdown) ── */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-400/20 text-xs font-bold uppercase tracking-wider">
              {t.howItWorksTag}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {t.howItWorksTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {t.howItWorksSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-7 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl flex flex-col justify-between space-y-5 hover:border-indigo-500/40 transition-colors group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-slate-600 group-hover:text-indigo-400 transition-colors font-mono">01</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">{t.step1Tag}</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-400 border border-indigo-400/20 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">{t.step1Title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{t.step1Desc}</p>
              </div>
              <div className="pt-3 border-t border-slate-800/80">
                <Link href="/dashboard" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 no-underline">
                  <span>Launch Copilot</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="p-7 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl flex flex-col justify-between space-y-5 hover:border-indigo-500/40 transition-colors group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-slate-600 group-hover:text-indigo-400 transition-colors font-mono">02</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">{t.step2Tag}</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-400 border border-indigo-400/20 flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">{t.step2Title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{t.step2Desc}</p>
              </div>
              <div className="pt-3 border-t border-slate-800/80">
                <Link href="/dashboard" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 no-underline">
                  <span>Explore Roadmaps</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="p-7 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl flex flex-col justify-between space-y-5 hover:border-indigo-500/40 transition-colors group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-slate-600 group-hover:text-indigo-400 transition-colors font-mono">03</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">{t.step3Tag}</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-400 border border-indigo-400/20 flex items-center justify-center">
                  <FileCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">{t.step3Title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{t.step3Desc}</p>
              </div>
              <div className="pt-3 border-t border-slate-800/80">
                <Link href="/dashboard" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 no-underline">
                  <span>Verify Documents</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── 5. Connected Citizen Services Grid ── */}
      <section id="services" className="py-16 bg-slate-900/40 border-y border-slate-800 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-400/20 text-xs font-bold uppercase tracking-wider">
                {t.servicesTag}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                {t.servicesTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                {t.servicesSubtitle}
              </p>
            </div>

            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-colors flex items-center gap-2 shrink-0 self-start md:self-auto no-underline cursor-pointer"
            >
              <span>{t.viewAllJourneys}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES_DATA.map((svc) => (
              <div
                key={svc.id}
                className="p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-lg flex flex-col justify-between space-y-4 hover:border-blue-500/40 transition-colors group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-400/20">
                      {svc.dept}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 font-mono">
                      {svc.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                    {svc.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {svc.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-500">
                    UTID: {svc.utidSample}
                  </span>
                  <Link
                    href="/dashboard"
                    className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 no-underline"
                  >
                    <span>Launch</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── 6. Testimonials / Feedback Grid ── */}
      <section id="testimonials" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
              {t.testimonialsTag}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {t.testimonialsTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {t.testimonialsSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((test, idx) => (
              <div
                key={idx}
                className="p-7 bg-slate-900 border border-slate-800 rounded-3xl shadow-lg flex flex-col justify-between space-y-5 hover:border-emerald-500/40 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(test.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      {test.tag}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                    "{test.comment}"
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-tr ${test.color} text-white font-black text-xs flex items-center justify-center shadow-md`}>
                    {test.initials}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{test.name}</h4>
                    <p className="text-[11px] text-slate-400">{test.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── 7. Call To Action Banner ── */}
      <section className="py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 border border-blue-500/30 rounded-3xl p-8 sm:p-10 text-center space-y-5 shadow-2xl">
          <div className="space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {t.ctaBannerTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {t.ctaBannerDesc}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/dashboard"
              className="px-7 py-3 rounded-xl font-black text-sm bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-transform active:scale-95 no-underline cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-blue-200" />
              <span>{t.ctaBannerBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/login"
              className="px-5 py-3 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors no-underline"
            >
              {t.signInBtn}
            </Link>
          </div>
        </div>
      </section>

      {/* ── 8. Modern Public Infrastructure Footer ── */}
      <footer className="border-t border-slate-800 bg-slate-950 px-4 sm:px-6 lg:px-8 py-10 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
          <div className="space-y-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Landmark className="w-4 h-4" />
              </div>
              <span className="text-sm font-black text-white tracking-tight">{t.brandName}</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">{t.footerTagline}</p>
          </div>

          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Platform Links</h4>
            <ul className="space-y-1 text-[11px]">
              <li><Link href="/dashboard" className="hover:text-blue-400 transition-colors no-underline">Citizen Milestone Dashboard</Link></li>
              <li><Link href="/officer" className="hover:text-blue-400 transition-colors no-underline">Officer Scrutiny Hub</Link></li>
              <li><Link href="/login" className="hover:text-blue-400 transition-colors no-underline">Unified Auth Portal</Link></li>
              <li><Link href="/qa" className="hover:text-blue-400 transition-colors no-underline">QA Testing Checklist</Link></li>
            </ul>
          </div>

          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Statutory Standards</h4>
            <ul className="space-y-1 text-[11px]">
              <li className="text-slate-400">DPDP Act 2023 Compliant</li>
              <li className="text-slate-400">IT Act 2000 Section 43</li>
              <li className="text-slate-400">DigiLocker & API Setu</li>
              <li className="text-slate-400">WCAG 2.1 Level AA</li>
            </ul>
          </div>

          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Nodal Ministry</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Government of Maharashtra • Smart India Hackathon 2026.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>{t.footerGovNotice}</p>
          <div className="flex items-center gap-3">
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 inline" /> DPDP 2025 Compliant
            </span>
            <span>•</span>
            <span>Zero Non-Consensual Data Retention</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
