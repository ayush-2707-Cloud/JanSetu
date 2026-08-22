import { Language } from "@/types/journey";

export interface LoginTranslation {
  portalTitle: string;
  portalSubtitle: string;
  ssoBadge: string;
  tabCitizen: string;
  tabOfficer: string;
  tabRegister: string;
  
  // Citizen login
  citizenHeaderTitle: string;
  citizenHeaderSubtitle: string;
  citizenIdentifierLabel: string;
  citizenIdentifierPlaceholder: string;
  citizenPasswordLabel: string;
  citizenPasswordPlaceholder: string;
  forgotPasswordBtn: string;
  citizenSubmitBtn: string;
  citizenSubmittingBtn: string;
  
  // Officer login
  officerHeaderTitle: string;
  officerHeaderSubtitle: string;
  officerIdentifierLabel: string;
  officerIdentifierPlaceholder: string;
  officerPasswordLabel: string;
  officerPasswordPlaceholder: string;
  officerSubmitBtn: string;
  officerSubmittingBtn: string;

  // Register
  registerHeaderTitle: string;
  registerHeaderSubtitle: string;
  fullNameLabel: string;
  fullNamePlaceholder: string;
  usernameLabel: string;
  usernamePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  aadhaarLabel: string;
  aadhaarPlaceholder: string;
  stateLabel: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  confirmPasswordLabel: string;
  confirmPasswordPlaceholder: string;
  registerSubmitBtn: string;
  registerSubmittingBtn: string;

  // Evaluator Quick Fill Box
  evaluatorBoxTitle: string;
  evaluatorBoxDesc: string;
  citizenDemo1Label: string;
  citizenDemo2Label: string;
  officerDemo1Label: string;
  officerDemo2Label: string;

  // Security compliance note
  itActNotice: string;
  digilockerSafeNotice: string;

  // Forgot password modal
  forgotModalTitle: string;
  forgotModalDesc: string;
  forgotInputLabel: string;
  forgotInputPlaceholder: string;
  forgotSubmitBtn: string;
  forgotSentSuccess: string;
  forgotCloseBtn: string;
  
  // Language dropdown
  langSelectorLabel: string;
  backToHome: string;
  signOutBtn: string;
}

export const LOGIN_TRANSLATIONS: Record<Language, LoginTranslation> = {
  EN: {
    portalTitle: "JanSetu™ National Portal",
    portalSubtitle: "Universal Digital Citizen & Officer Gateway",
    ssoBadge: "Single Sign-On (SSO) & DigiLocker Federated Auth",
    tabCitizen: "Citizen Login",
    tabOfficer: "Officer / Admin",
    tabRegister: "New Register",

    citizenHeaderTitle: "Citizen Access Gateway",
    citizenHeaderSubtitle: "Track statutory roadmaps, verify legal documents, and submit municipal approvals.",
    citizenIdentifierLabel: "Email, Mobile Number, or Username",
    citizenIdentifierPlaceholder: "e.g. anand_kumar or anand.kumar@citizen.gov.in",
    citizenPasswordLabel: "Password or DigiLocker PIN",
    citizenPasswordPlaceholder: "••••••••",
    forgotPasswordBtn: "Forgot Password / Username?",
    citizenSubmitBtn: "Sign In to Citizen Dashboard",
    citizenSubmittingBtn: "Authenticating via SSO...",

    officerHeaderTitle: "Department Officer & Admin Scrutiny Hub",
    officerHeaderSubtitle: "Restricted official portal for cross-departmental application review, DigiLocker verification, and SLA decisioning.",
    officerIdentifierLabel: "Govt Employee ID or Official Email",
    officerIdentifierPlaceholder: "e.g. officer.foodsafety@karnataka.gov.in or OFF-MSME-KA-091",
    officerPasswordLabel: "Official Access Key / NIC Token PIN",
    officerPasswordPlaceholder: "••••••••",
    officerSubmitBtn: "Sign In to Officer Scrutiny Console",
    officerSubmittingBtn: "Verifying Official Credentials...",

    registerHeaderTitle: "New Citizen User Registration",
    registerHeaderSubtitle: "Create an official citizen identity linked with DigiLocker and API Setu.",
    fullNameLabel: "Full Legal Name (as on Aadhaar)",
    fullNamePlaceholder: "Anand Kumar",
    usernameLabel: "Desired Username",
    usernamePlaceholder: "anand_kumar2026",
    emailLabel: "Email Address",
    emailPlaceholder: "anand.kumar@citizen.gov.in",
    phoneLabel: "Mobile Number (Linked with Aadhaar)",
    phonePlaceholder: "+91 98765 43210",
    aadhaarLabel: "Aadhaar Number (Optional for DigiLocker Sync)",
    aadhaarPlaceholder: "1234 5678 9012",
    stateLabel: "State / Union Territory",
    passwordLabel: "Account Password",
    passwordPlaceholder: "Minimum 8 characters with numbers & symbols",
    confirmPasswordLabel: "Confirm Password",
    confirmPasswordPlaceholder: "Re-enter your password",
    registerSubmitBtn: "Create Citizen Account & Sync DigiLocker",
    registerSubmittingBtn: "Creating Account & Verifying Identity...",

    evaluatorBoxTitle: "SIH Evaluator / Quick Test Credentials",
    evaluatorBoxDesc: "Click any profile below to instantly auto-fill verified testing credentials:",
    citizenDemo1Label: "Citizen 1: Anand Kumar (MSME & FSSAI Journey)",
    citizenDemo2Label: "Citizen 2: Priya Patel (Agriculture Land NA)",
    officerDemo1Label: "Officer 1: Suresh Rao (Food Safety Nodal Officer)",
    officerDemo2Label: "Officer 2: Kavita Patil (Revenue & Land Tahsildar)",

    itActNotice: "Statutory Warning: Unauthorized access or tampering with this official GovTech portal is punishable under Section 43 & Section 66 of the Information Technology Act, 2000.",
    digilockerSafeNotice: "🔒 256-Bit TLS End-to-End Encrypted • Consent-based DigiLocker 2.0 Integration",

    forgotModalTitle: "Recover Account Credentials",
    forgotModalDesc: "Enter your registered email, mobile number, or username to receive a secure recovery OTP.",
    forgotInputLabel: "Registered Identifier",
    forgotInputPlaceholder: "Email or Mobile Number",
    forgotSubmitBtn: "Send Recovery Link / OTP",
    forgotSentSuccess: "Verification OTP and password reset instructions sent successfully to:",
    forgotCloseBtn: "Close",

    langSelectorLabel: "Select Language",
    backToHome: "Back to Home",
    signOutBtn: "Sign Out",
  },
  HI: {
    portalTitle: "जनसेतु™ राष्ट्रीय पोर्टल",
    portalSubtitle: "सार्वभौमिक डिजिटल नागरिक एवं अधिकारी प्रवेशद्वार",
    ssoBadge: "सिंगल साइन-ऑन (SSO) एवं डिजिलॉकर प्रमाणित प्रमाणीकरण",
    tabCitizen: "नागरिक लॉगिन",
    tabOfficer: "विभागीय अधिकारी / व्यवस्थापक",
    tabRegister: "नया पंजीकरण",

    citizenHeaderTitle: "नागरिक सेवा प्रवेशद्वार",
    citizenHeaderSubtitle: "वैधानिक रोडमैप ट्रैक करें, कानूनी दस्तावेज सत्यापित करें और नगर पालिका स्वीकृतियां प्राप्त करें।",
    citizenIdentifierLabel: "ईमेल, मोबाइल नंबर अथवा यूजरनेम",
    citizenIdentifierPlaceholder: "उदा. anand_kumar या anand.kumar@citizen.gov.in",
    citizenPasswordLabel: "पासवर्ड या डिजिलॉकर पिन",
    citizenPasswordPlaceholder: "••••••••",
    forgotPasswordBtn: "पासवर्ड / यूजरनेम भूल गए?",
    citizenSubmitBtn: "नागरिक डैशबोर्ड में लॉगिन करें",
    citizenSubmittingBtn: "SSO द्वारा प्रमाणीकरण जारी...",

    officerHeaderTitle: "विभागीय अधिकारी एवं जांच हब",
    officerHeaderSubtitle: "अंतर-विभागीय आवेदन समीक्षा, डिजिलॉकर सत्यापन एवं SLA निर्णय हेतु सुरक्षित अधिकारी पोर्टल।",
    officerIdentifierLabel: "शासकीय कर्मचारी आईडी अथवा आधिकारिक ईमेल",
    officerIdentifierPlaceholder: "उदा. officer.foodsafety@karnataka.gov.in अथवा OFF-MSME-KA-091",
    officerPasswordLabel: "अधिकारिक एक्सेस कुंजी / NIC टोकन पिन",
    officerPasswordPlaceholder: "••••••••",
    officerSubmitBtn: "अधिकारी कंसोल में लॉगिन करें",
    officerSubmittingBtn: "अधिकारिक पहचान सत्यापित की जा रही है...",

    registerHeaderTitle: "नया नागरिक उपयोगकर्ता पंजीकरण",
    registerHeaderSubtitle: "डिजिलॉकर और API सेतु से संबद्ध आधिकारिक नागरिक पहचान बनाएं।",
    fullNameLabel: "पूरा नाम (आधार के अनुसार)",
    fullNamePlaceholder: "आनंद कुमार",
    usernameLabel: "वांछित यूजरनेम",
    usernamePlaceholder: "anand_kumar2026",
    emailLabel: "ईमेल पता",
    emailPlaceholder: "anand.kumar@citizen.gov.in",
    phoneLabel: "मोबाइल नंबर (आधार से लिंक)",
    phonePlaceholder: "+91 98765 43210",
    aadhaarLabel: "आधार नंबर (डिजिलॉकर सिंक हेतु वैकल्पिक)",
    aadhaarPlaceholder: "1234 5678 9012",
    stateLabel: "राज्य / केंद्र शासित प्रदेश",
    passwordLabel: "खाता पासवर्ड",
    passwordPlaceholder: "कम से कम 8 अक्षर (अंक व विशेष वर्ण सहित)",
    confirmPasswordLabel: "पासवर्ड की पुष्टि करें",
    confirmPasswordPlaceholder: "पुनः पासवर्ड दर्ज करें",
    registerSubmitBtn: "नागरिक खाता बनाएं और डिजिलॉकर जोड़ें",
    registerSubmittingBtn: "खाता निर्माण व पहचान सत्यापन जारी...",

    evaluatorBoxTitle: "SIH मूल्यांकनकर्ता / त्वरित परीक्षण क्रेडेंशियल्स",
    evaluatorBoxDesc: "सत्यापित परीक्षण क्रेडेंशियल स्वतः भरने के लिए नीचे किसी भी प्रोफ़ाइल पर क्लिक करें:",
    citizenDemo1Label: "नागरिक 1: आनंद कुमार (MSME व FSSAI रोडमैप)",
    citizenDemo2Label: "नागरिक 2: प्रिया पटेल (कृषि भूमि अकृषिक रूपांतरण)",
    officerDemo1Label: "अधिकारी 1: सुरेश राव (खाद्य सुरक्षा नोडल अधिकारी)",
    officerDemo2Label: "अधिकारी 2: कविता पाटिल (राजस्व व भूमि तहसीलदार)",

    itActNotice: "वैधानिक चेतावनी: इस आधिकारिक पोर्टल पर अनधिकृत पहुंच या छेड़छाड़ सूचना प्रौद्योगिकी अधिनियम, 2000 की धारा 43 व 66 के तहत दंडनीय है।",
    digilockerSafeNotice: "🔒 256-बिट TLS एंड-टू-एंड एन्क्रिप्टेड • सहमति आधारित डिजिलॉकर 2.0 एकीकरण",

    forgotModalTitle: "खाता पासवर्ड पुनर्प्राप्ति",
    forgotModalDesc: "सुरक्षित पुनर्प्राप्ति OTP प्राप्त करने के लिए अपना पंजीकृत ईमेल, मोबाइल नंबर या यूजरनेम दर्ज करें।",
    forgotInputLabel: "पंजीकृत पहचानकर्ता",
    forgotInputPlaceholder: "ईमेल या मोबाइल नंबर",
    forgotSubmitBtn: "पुनर्प्राप्ति लिंक / OTP भेजें",
    forgotSentSuccess: "सत्यापन OTP और पासवर्ड रीसेट निर्देश सफलतापूर्वक भेजे गए:",
    forgotCloseBtn: "बंद करें",

    langSelectorLabel: "भाषा चुनें",
    backToHome: "मुख्य पृष्ठ पर जाएं",
    signOutBtn: "साइन आउट",
  },
  KN: {
    portalTitle: "ಜನಸೇತು™ ರಾಷ್ಟ್ರೀಯ ಪೋರ್ಟಲ್",
    portalSubtitle: "ಸಾರ್ವತ್ರಿಕ ಡಿಜಿಟಲ್ ನಾಗರಿಕ ಮತ್ತು ಅಧಿಕಾರಿ ಗೇಟ್‌ವೇ",
    ssoBadge: "ಏಕೀಕೃತ ಸೈನ್-ಆನ್ (SSO) & ಡಿಜಿಲಾಕರ್ ಅಧಿಕೃತ ದೃಢೀಕರಣ",
    tabCitizen: "ನಾಗರಿಕ ಲಾಗಿನ್",
    tabOfficer: "ಇಲಾಖಾ ಅಧಿಕಾರಿ / ನಿರ್ವಾಹಕ",
    tabRegister: "ಹೊಸ ನೋಂದಣಿ",

    citizenHeaderTitle: "ನಾಗರಿಕ ಸೇವಾ ಪ್ರವೇಶದ್ವಾರ",
    citizenHeaderSubtitle: "ಕಾನೂನುಬದ್ಧ ಮಾರ್ಗಸೂಚಿ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ, ದಾಖಲೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಅನುಮೋದನೆಗಳನ್ನು ಪಡೆಯಿರಿ.",
    citizenIdentifierLabel: "ಇಮೇಲ್, ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಅಥವಾ ಬಳಕೆದಾರ ಹೆಸರು",
    citizenIdentifierPlaceholder: "ಉದಾ: anand_kumar ಅಥವಾ anand.kumar@citizen.gov.in",
    citizenPasswordLabel: "ಪಾಸ್‌ವರ್ಡ್ ಅಥವಾ ಡಿಜಿಲಾಕರ್ ಪಿನ್",
    citizenPasswordPlaceholder: "••••••••",
    forgotPasswordBtn: "ಪಾಸ್‌ವರ್ಡ್ / ಯೂಸರ್ ನೇಮ್ ಮರೆತಿರಾ?",
    citizenSubmitBtn: "ನಾಗರಿಕ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಲಾಗಿನ್ ಮಾಡಿ",
    citizenSubmittingBtn: "SSO ದೃಢೀಕರಣ ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿದೆ...",

    officerHeaderTitle: "ಇಲಾಖಾ ಅಧಿಕಾರಿ ಮತ್ತು ಪರಿಶೀಲನಾ ಕೇಂದ್ರ",
    officerHeaderSubtitle: "ಅರ್ಜಿ ಪರಿಶೀಲನೆ, ಡಿಜಿಲಾಕರ್ ತಪಾಸಣೆ ಮತ್ತು SLA ನಿರ್ಧಾರಕ್ಕಾಗಿ ಅಧಿಕೃತ ಪೋರ್ಟಲ್.",
    officerIdentifierLabel: "ಸರ್ಕಾರಿ ನೌಕರರ ಐಡಿ ಅಥವಾ ಇಮೇಲ್",
    officerIdentifierPlaceholder: "ಉದಾ: officer.foodsafety@karnataka.gov.in",
    officerPasswordLabel: "ಅಧಿಕೃತ ಪ್ರವೇಶ ಕೀ / NIC ಟೋಕನ್ ಪಿನ್",
    officerPasswordPlaceholder: "••••••••",
    officerSubmitBtn: "ಅಧಿಕಾರಿ ಕನ್ಸೋಲ್‌ಗೆ ಲಾಗಿನ್ ಮಾಡಿ",
    officerSubmittingBtn: "ಅಧಿಕೃತ ರುಜುವಾತುಗಳನ್ನು ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...",

    registerHeaderTitle: "ಹೊಸ ನಾಗರಿಕ ನೋಂದಣಿ",
    registerHeaderSubtitle: "ಡಿಜಿಲಾಕರ್ ಮತ್ತು API ಸೇತುವಿನೊಂದಿಗೆ ಸಂಪರ್ಕ ಹೊಂದಿದ ಅಧಿಕೃತ ನಾಗರಿಕ ಗುರುತನ್ನು ರಚಿಸಿ.",
    fullNameLabel: "ಪೂರ್ಣ ಹೆಸರು (ಆಧಾರ್ ಪ್ರಕಾರ)",
    fullNamePlaceholder: "ಆನಂದ ಕುಮಾರ್",
    usernameLabel: "ಬಳಕೆದಾರ ಹೆಸರು",
    usernamePlaceholder: "anand_kumar2026",
    emailLabel: "ಇಮೇಲ್ ವಿಳಾಸ",
    emailPlaceholder: "anand.kumar@citizen.gov.in",
    phoneLabel: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ (ಆಧಾರ್ ಲಿಂಕ್)",
    phonePlaceholder: "+91 98765 43210",
    aadhaarLabel: "ಆಧಾರ್ ಸಂಖ್ಯೆ (ಐಚ್ಛಿಕ)",
    aadhaarPlaceholder: "1234 5678 9012",
    stateLabel: "ರಾಜ್ಯ / ಕೇಂದ್ರಾಡಳಿತ ಪ್ರದೇಶ",
    passwordLabel: "ಖಾತೆ ಪಾಸ್‌ವರ್ಡ್",
    passwordPlaceholder: "ಕನಿಷ್ಠ 8 ಅಕ್ಷರಗಳು",
    confirmPasswordLabel: "ಪಾಸ್‌ವರ್ಡ್ ಖಚಿತಪಡಿಸಿ",
    confirmPasswordPlaceholder: "ಮತ್ತೊಮ್ಮೆ ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ",
    registerSubmitBtn: "ನಾಗರಿಕ ಖಾತೆ ರಚಿಸಿ & ಡಿಜಿಲಾಕರ್ ಜೋಡಿಸಿ",
    registerSubmittingBtn: "ಖಾತೆ ರಚನೆ ಪ್ರಗತಿಯಲ್ಲಿದೆ...",

    evaluatorBoxTitle: "SIH ಮೌಲ್ಯಮಾಪಕರ / ತ್ವರಿತ ಪರೀಕ್ಷಾ ವಿವರಗಳು",
    evaluatorBoxDesc: "ಪರೀಕ್ಷಾರ್ಥಿ ವಿವರಗಳನ್ನು ಸ್ವಯಂ-ಭರ್ತಿ ಮಾಡಲು ಕೆಳಗಿನ ಯಾವುದೇ ಪ್ರೊಫೈಲ್ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ:",
    citizenDemo1Label: "ನಾಗರಿಕ 1: ಆನಂದ ಕುಮಾರ್ (MSME & FSSAI)",
    citizenDemo2Label: "ನಾಗರಿಕ 2: ಪ್ರಿಯಾ ಪಟೇಲ್ (ಕೃಷಿ ಭೂಮಿ ಪರಿವರ್ತನೆ)",
    officerDemo1Label: "ಅಧಿಕಾರಿ 1: ಸುರೇಶ್ ರಾವ್ (ಆಹಾರ ಸುರಕ್ಷತಾ ಅಧಿಕಾರಿ)",
    officerDemo2Label: "ಅಧಿಕಾರಿ 2: ಕವಿತಾ ಪಾಟೀಲ್ (ಕಂದಾಯ ತಹಶೀಲ್ದಾರ್)",

    itActNotice: "ಕಾನೂನು ಎಚ್ಚರಿಕೆ: ಈ ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಅನಧಿಕೃತ ಪ್ರವೇಶ ಅಥವಾ ಬದಲಾವಣೆ ಐಟಿ ಕಾಯ್ದೆ 2000 ರ ಕಲಂ 43 ಮತ್ತು 66 ರ ಅಡಿಯಲ್ಲಿ ಶಿಕ್ಷಾರ್ಹ ಅಪರಾಧವಾಗಿದೆ.",
    digilockerSafeNotice: "🔒 256-ಬಿಟ್ TLS ಎನ್‌ಕ್ರಿಪ್ಟೆಡ್ • ಸಮ್ಮತಿ ಆಧಾರಿತ ಡಿಜಿಲಾಕರ್ 2.0 ಸಂಯೋಜನೆ",

    forgotModalTitle: "ಪಾಸ್‌ವರ್ಡ್ ಮರುಪಡೆಯುವಿಕೆ",
    forgotModalDesc: "OTP ಪಡೆಯಲು ನಿಮ್ಮ ನೋಂದಾಯಿತ ಇಮೇಲ್, ಮೊಬೈಲ್ ಅಥವಾ ಬಳಕೆದಾರ ಹೆಸರು ನಮೂದಿಸಿ.",
    forgotInputLabel: "ನೋಂದಾಯಿತ ಗುರುತು",
    forgotInputPlaceholder: "ಇಮೇಲ್ ಅಥವಾ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
    forgotSubmitBtn: "OTP ಕಳುಹಿಸಿ",
    forgotSentSuccess: "OTP ಮತ್ತು ಮಾರ್ಗದರ್ಶನವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಕಳುಹಿಸಲಾಗಿದೆ:",
    forgotCloseBtn: "ಮುಚ್ಚಿ",

    langSelectorLabel: "ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ",
    backToHome: "ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ",
    signOutBtn: "ಸೈನ್ ಔಟ್",
  },
  MR: {
    portalTitle: "जनसेतू™ राष्ट्रीय पोर्टल",
    portalSubtitle: "सार्वत्रिक डिजिटल नागरिक व अधिकारी प्रवेशद्वार",
    ssoBadge: "सिंगल साइन-ऑन (SSO) आणि डिजीलॉकर प्रमाणित प्रणाली",
    tabCitizen: "नागरिक लॉगिन",
    tabOfficer: "विभागीय अधिकारी / व्यवस्थापक",
    tabRegister: "नवीन नोंदणी",

    citizenHeaderTitle: "नागरिक सेवा प्रवेशद्वार",
    citizenHeaderSubtitle: "शासकीय रोडमॅप ट्रॅक करा, कागदपत्रे पडताळा आणि पालिका मंजुऱ्या मिळवा.",
    citizenIdentifierLabel: "ईमेल, मोबाइल नंबर किंवा युझरनेम",
    citizenIdentifierPlaceholder: "उदा. anand_kumar किंवा anand.kumar@citizen.gov.in",
    citizenPasswordLabel: "पासवर्ड किंवा डिजीलॉकर पिन",
    citizenPasswordPlaceholder: "••••••••",
    forgotPasswordBtn: "पासवर्ड / युझरनेम विसरलात?",
    citizenSubmitBtn: "नागरिक डॅशबोर्डवर लॉगिन करा",
    citizenSubmittingBtn: "SSO द्वारे पडताळणी सुरू...",

    officerHeaderTitle: "विभागीय अधिकारी व तपासणी केंद्र",
    officerHeaderSubtitle: "अर्ज छाननी, डिजीलॉकर पडताळणी आणि SLA निर्णयासाठी अधिकृत पोर्टल.",
    officerIdentifierLabel: "शासकीय कर्मचारी आयडी किंवा ईमेल",
    officerIdentifierPlaceholder: "उदा. officer.foodsafety@karnataka.gov.in",
    officerPasswordLabel: "अधिकारी ॲक्सेस की / NIC टोकन पिन",
    officerPasswordPlaceholder: "••••••••",
    officerSubmitBtn: "अधिकारी कन्सोलवर लॉगिन करा",
    officerSubmittingBtn: "अधिकारी ओळख पडताळणी सुरू...",

    registerHeaderTitle: "नवीन नागरिक नोंदणी",
    registerHeaderSubtitle: "डिजीलॉकर आणि API सेतूशी जोडलेली अधिकृत नागरिक ओळख तयार करा.",
    fullNameLabel: "पूर्ण नाव (आधार कार्डानुसार)",
    fullNamePlaceholder: "आनंद कुमार",
    usernameLabel: "युझरनेम",
    usernamePlaceholder: "anand_kumar2026",
    emailLabel: "ईमेल पत्ता",
    emailPlaceholder: "anand.kumar@citizen.gov.in",
    phoneLabel: "मोबाइल नंबर (आधार संलग्न)",
    phonePlaceholder: "+91 98765 43210",
    aadhaarLabel: "आधार नंबर (पर्यायी)",
    aadhaarPlaceholder: "1234 5678 9012",
    stateLabel: "राज्य / केंद्रशासित प्रदेश",
    passwordLabel: "पासवर्ड",
    passwordPlaceholder: "किमान ८ अक्षरे",
    confirmPasswordLabel: "पासवर्ड पुष्टी करा",
    confirmPasswordPlaceholder: "पुन्हा पासवर्ड टाका",
    registerSubmitBtn: "नागरिक खाते तयार करा व डिजीलॉकर जोडा",
    registerSubmittingBtn: "खाते तयार होत आहे...",

    evaluatorBoxTitle: "SIH परीक्षक / जलद चाचणी क्रेडेंशियल्स",
    evaluatorBoxDesc: "चाचणी क्रेडेंशियल आपोआप भरण्यासाठी खालील कोणत्याही प्रोफाइलवर क्लिक करा:",
    citizenDemo1Label: "नागरिक १: आनंद कुमार (MSME व FSSAI)",
    citizenDemo2Label: "नागरिक २: प्रिया पटेल (शेतजमीन अकृषिक रूपांतरण)",
    officerDemo1Label: "अधिकारी १: सुरेश राव (अन्न सुरक्षा अधिकारी)",
    officerDemo2Label: "अधिकारी २: कविता पाटील (महसूल तहसीलदार)",

    itActNotice: "वैधानिक इशारा: या अधिकृत पोर्टलवर अनधिकृत प्रवेश किंवा फेरफार माहिती तंत्रज्ञान कायदा २००० च्या कलम ४३ व ६६ अंतर्गत दंडनीय अपराध आहे.",
    digilockerSafeNotice: "🔒 २५६-बिट TLS एन्क्रिप्टेड • संमती आधारित डिजीलॉकर २.० एकत्रीकरण",

    forgotModalTitle: "पासवर्ड पुनर्प्राप्ती",
    forgotModalDesc: "सुरक्षित OTP मिळवण्यासाठी तुमचा नोंदणीकृत ईमेल, मोबाइल किंवा युझरनेम प्रविष्ट करा.",
    forgotInputLabel: "नोंदणीकृत ओळख",
    forgotInputPlaceholder: "ईमेल किंवा मोबाइल नंबर",
    forgotSubmitBtn: "OTP पाठवा",
    forgotSentSuccess: "OTP आणि मार्गदर्शन यशस्वीरित्या पाठवले गेले:",
    forgotCloseBtn: "बंद करा",

    langSelectorLabel: "भाषा निवडा",
    backToHome: "मुख्य पृष्ठावर जा",
    signOutBtn: "साइन आउट",
  },
  TA: {
    portalTitle: "ஜனசேது™ தேசிய போர்டல்",
    portalSubtitle: "குடிமக்கள் மற்றும் அதிகாரிகளுக்கான ஒருங்கிணைந்த டிஜிட்டல் நுழைவாயில்",
    ssoBadge: "SSO & டிஜிலாக்கர் அங்கீகரிக்கப்பட்ட நுழைவு",
    tabCitizen: "குடிமக்கள் உள்நுழைவு",
    tabOfficer: "துறை அதிகாரி / நிர்வாகி",
    tabRegister: "புதிய பதிவு",

    citizenHeaderTitle: "குடிமக்கள் அணுகல் நுழைவாயில்",
    citizenHeaderSubtitle: "சட்டப்பூர்வ வழிகாட்டலைக் கண்காணிக்கவும், ஆவணங்களைச் சரிபார்க்கவும் மற்றும் நகராட்சி அனுமதிகளைப் பெறவும்.",
    citizenIdentifierLabel: "மின்னஞ்சல், மொபைல் எண் அல்லது பயனர்பெயர்",
    citizenIdentifierPlaceholder: "उदा. anand_kumar அல்லது anand.kumar@citizen.gov.in",
    citizenPasswordLabel: "கடவுச்சொல் அல்லது டிஜிலாக்கர் பின்",
    citizenPasswordPlaceholder: "••••••••",
    forgotPasswordBtn: "கடவுச்சொல்லை மறந்துவிட்டீர்களா?",
    citizenSubmitBtn: "குடிமக்கள் டாஷ்போர்டில் உள்நுழையவும்",
    citizenSubmittingBtn: "சரிபார்க்கப்படுகிறது...",

    officerHeaderTitle: "துறை அதிகாரி மற்றும் ஆய்வு மையம்",
    officerHeaderSubtitle: "விண்ணப்பங்களை ஆய்வு செய்யவும், டிஜிலாக்கர் சரிபார்ப்பு மற்றும் SLA முடிவுகளுக்குமான பிரத்யேக தளம்.",
    officerIdentifierLabel: "அரசு ஊழியர் ஐடி அல்லது அதிகாரப்பூர்வ மின்னஞ்சல்",
    officerIdentifierPlaceholder: "उदा. officer.foodsafety@karnataka.gov.in",
    officerPasswordLabel: "அதிகாரப்பூர்வ அணுகல் விசை",
    officerPasswordPlaceholder: "••••••••",
    officerSubmitBtn: "அதிகாரி தளத்தில் உள்நுழையவும்",
    officerSubmittingBtn: "அடையாளம் சரிபார்க்கப்படுகிறது...",

    registerHeaderTitle: "புதிய குடிமக்கள் பதிவு",
    registerHeaderSubtitle: "டிஜிலாக்கர் மற்றும் API சேதுவுடன் இணைக்கப்பட்ட அதிகாரப்பூர்வ அடையாளத்தை உருவாக்கவும்.",
    fullNameLabel: "முழுப் பெயர் (ஆதார் படி)",
    fullNamePlaceholder: "ஆனந்த் குமார்",
    usernameLabel: "பயனர்பெயர்",
    usernamePlaceholder: "anand_kumar2026",
    emailLabel: "மின்னஞ்சல் முகவரி",
    emailPlaceholder: "anand.kumar@citizen.gov.in",
    phoneLabel: "மொபைல் எண் (ஆதாருடன் இணைக்கப்பட்டது)",
    phonePlaceholder: "+91 98765 43210",
    aadhaarLabel: "ஆதார் எண் (விருப்பத்தேர்வு)",
    aadhaarPlaceholder: "1234 5678 9012",
    stateLabel: "மாநிலம் / யூனியன் பிரதேசம்",
    passwordLabel: "கடவுச்சொல்",
    passwordPlaceholder: "குறைந்தது 8 எழுத்துக்கள்",
    confirmPasswordLabel: "கடவுச்சொல்லை உறுதிப்படுத்தவும்",
    confirmPasswordPlaceholder: "மீண்டும் கடவுச்சொல்லை உள்ளிடவும்",
    registerSubmitBtn: "கணக்கை உருவாக்கி டிஜிலாக்கரை இணைக்கவும்",
    registerSubmittingBtn: "பதிவு செய்யப்படுகிறது...",

    evaluatorBoxTitle: "SIH மதிப்பீட்டாளர் / மாதிரி சோதனை கணக்குகள்",
    evaluatorBoxDesc: "மாதிரி கணக்குகளை தானாக நிரப்ப கீழே உள்ள சுயவிவரத்தைக் கிளிக் செய்யவும்:",
    citizenDemo1Label: "குடிமகன் 1: ஆனந்த் குமார் (MSME & FSSAI)",
    citizenDemo2Label: "குடிமகன் 2: பிரியா பட்டேல் (நில மாற்றம்)",
    officerDemo1Label: "அதிகாரி 1: சுரேஷ் ராவ் (உணவு பாதுகாப்பு அதிகாரி)",
    officerDemo2Label: "அதிகாரி 2: கவிதா பாட்டீல் (வருவாய்த் தாசில்தார்)",

    itActNotice: "சட்டப்பூர்வ எச்சரிக்கை: இந்த போர்ட்டலில் அங்கீகரிக்கப்படாத அணுகல் தகவல் தொழில்நுட்பச் சட்டம் 2000 பிரிவு 43 & 66 இன் கீழ் தண்டனைக்குரிய குற்றமாகும்.",
    digilockerSafeNotice: "🔒 256-பிட் TLS பாதுகாப்பு • டிஜிலாக்கர் 2.0 ஒருங்கிணைப்பு",

    forgotModalTitle: "கடவுச்சொல்லை மீட்டெடுக்கவும்",
    forgotModalDesc: "OTP பெற உங்கள் பதிவுசெய்த மின்னஞ்சல் அல்லது மொபைல் எண்ணை உள்ளிடவும்.",
    forgotInputLabel: "பதிவுசெய்த அடையாளம்",
    forgotInputPlaceholder: "மின்னஞ்சல் அல்லது மொபைல்",
    forgotSubmitBtn: "OTP அனுப்புக",
    forgotSentSuccess: "OTP வெற்றிகரமாக அனுப்பப்பட்டது:",
    forgotCloseBtn: "மூடுக",

    langSelectorLabel: "மொழியைத் தேர்ந்தெடுக்கவும்",
    backToHome: "முகப்புக்குச் செல்க",
    signOutBtn: "வெளியேறு",
  },
  TE: {
    portalTitle: "జనసేతు™ జాతీయ పోర్టల్",
    portalSubtitle: "పౌరులు మరియు అధికారుల కోసం డిజిటల్ గేట్‌వే",
    ssoBadge: "SSO & డిజిలాకర్ ధృవీకృత లాగిన్",
    tabCitizen: "పౌరుల లాగిన్",
    tabOfficer: "విభాగ అధికారి / అడ్మిన్",
    tabRegister: "కొత్త నమోదు",

    citizenHeaderTitle: "పౌర సేవల గేట్‌వే",
    citizenHeaderSubtitle: "రోడ్‌మ్యాప్‌ను ట్రాక్ చేయండి, చట్టపరమైన పత్రాలను ధృవీకరించండి మరియు మున్సిపల్ ఆమోదాలను పొందండి.",
    citizenIdentifierLabel: "ఈమెయిల్, మొబైల్ నంబర్ లేదా యూజర్‌నేమ్",
    citizenIdentifierPlaceholder: "ఉదా: anand_kumar లేదా anand.kumar@citizen.gov.in",
    citizenPasswordLabel: "పాస్‌వర్డ్ లేదా డిజిలాకర్ పిన్",
    citizenPasswordPlaceholder: "••••••••",
    forgotPasswordBtn: "పాస్‌వర్డ్ మర్చిపోయారా?",
    citizenSubmitBtn: "పౌర డాష్‌బోర్డ్‌లో లాగిన్ అవ్వండి",
    citizenSubmittingBtn: "ధృవీకరించబడుతోంది...",

    officerHeaderTitle: "విభాగ అధికారి పరిశీలన హబ్",
    officerHeaderSubtitle: "దరఖాస్తుల సమీక్ష, డిజిలాకర్ పరిశీలన మరియు SLA నిర్ణయాల కోసం ప్రత్యేక పోర్టల్.",
    officerIdentifierLabel: "ఉద్యోగి ఐడి లేదా అధికారిక ఈమెయిల్",
    officerIdentifierPlaceholder: "ఉదా: officer.foodsafety@karnataka.gov.in",
    officerPasswordLabel: "అధికారిక యాక్సెస్ కీ",
    officerPasswordPlaceholder: "••••••••",
    officerSubmitBtn: "అధికారి కన్సోల్‌లో లాగిన్ అవ్వండి",
    officerSubmittingBtn: "గుర్తింపును తనిఖీ చేస్తోంది...",

    registerHeaderTitle: "కొత్త పౌర నమోదు",
    registerHeaderSubtitle: "డిజిలాకర్ మరియు API సేతుతో అనుసంధానించబడిన పౌర గుర్తింపును సృష్టించండి.",
    fullNameLabel: "పూర్తి పేరు (ఆధార్ ప్రకారం)",
    fullNamePlaceholder: "ఆనంద్ కుమార్",
    usernameLabel: "యూజర్‌నేమ్",
    usernamePlaceholder: "anand_kumar2026",
    emailLabel: "ఈమెయిల్ చిరునామా",
    emailPlaceholder: "anand.kumar@citizen.gov.in",
    phoneLabel: "మొబైల్ నంబర్ (ఆధార్ లింక్)",
    phonePlaceholder: "+91 98765 43210",
    aadhaarLabel: "ఆధార్ నంబర్ (ఐచ్ఛికం)",
    aadhaarPlaceholder: "1234 5678 9012",
    stateLabel: "రాష్ట్రం / కేంద్రపాలిత ప్రాంతం",
    passwordLabel: "ఖాతా పాస్‌వర్డ్",
    passwordPlaceholder: "కనీసం 8 అక్షరాలు",
    confirmPasswordLabel: "పాస్‌వర్డ్‌ను నిర్ధారించండి",
    confirmPasswordPlaceholder: "మళ్లీ పాస్‌వర్డ్ నమోదు చేయండి",
    registerSubmitBtn: "ఖాతాను సృష్టించి డిజిలాకర్‌ను జతచేయండి",
    registerSubmittingBtn: "ఖాతా సృష్టించబడుతోంది...",

    evaluatorBoxTitle: "SIH మూల్యాంకనదారుల టెస్టింగ్ వివరాలు",
    evaluatorBoxDesc: "పరీక్ష వివరాలను ఆటో-ఫిల్ చేయడానికి క్రింది ప్రొఫైల్‌పై క్లిక్ చేయండి:",
    citizenDemo1Label: "పౌరుడు 1: ఆనంద్ కుమార్ (MSME & FSSAI)",
    citizenDemo2Label: "పౌరుడు 2: ప్రియా పటేల్ (భూమి మార్పిడి)",
    officerDemo1Label: "అధికారి 1: సురేష్ రావు (ఆహార భద్రతా అధికారి)",
    officerDemo2Label: "అధికారి 2: కవితా పాటిల్ (రెవెన్యూ తహశీల్దార్)",

    itActNotice: "చట్టబద్ధమైన హెచ్చరిక: ఈ అధికారిక పోర్టల్‌లో అనధికారిక ప్రవేశం ఐటీ చట్టం 2000 సెక్షన్ 43 & 66 ప్రకారం శిక్షార్హమైన నేరం.",
    digilockerSafeNotice: "🔒 256-బిట్ TLS ఎన్‌క్రిప్షన్ • డిజిలాకర్ 2.0 సమన్వయం",

    forgotModalTitle: "పాస్‌వర్డ్ పునరుద్ధరణ",
    forgotModalDesc: "OTP పొందడానికి మీ నమోదిత ఈమెయిల్ లేదా మొబైల్ నంబర్‌ను నమోదు చేయండి.",
    forgotInputLabel: "నమోదిత గుర్తింపు",
    forgotInputPlaceholder: "ఈమెయిల్ లేదా మొబైల్",
    forgotSubmitBtn: "OTP పంపండి",
    forgotSentSuccess: "OTP విజయవంతంగా పంపబడింది:",
    forgotCloseBtn: "మూసివేయి",

    langSelectorLabel: "భాషను ఎంచుకోండి",
    backToHome: "హోమ్‌కు తిరిగి వెళ్లండి",
    signOutBtn: "సైన్ అవుట్",
  },
  BN: {
    portalTitle: "জনসেতু™ জাতীয় পোর্টাল",
    portalSubtitle: "নাগরিক ও কর্মকর্তাদের জন্য ডিজিটাল গেটওয়ে",
    ssoBadge: "SSO ও ডিজিলকার অনুমোদিত লগইন",
    tabCitizen: "নাগরিক লগইন",
    tabOfficer: "বিভাগীয় কর্মকর্তা / অ্যাডমিন",
    tabRegister: "নতুন নিবন্ধন",

    citizenHeaderTitle: "নাগরিক পরিষেবা গেটওয়ে",
    citizenHeaderSubtitle: "রোডম্যাপ ট্র্যাক করুন, আইনি নথি যাচাই করুন এবং পৌরসভার অনুমোদন লাভ করুন।",
    citizenIdentifierLabel: "ইমেল, মোবাইল নম্বর বা ব্যবহারকারীর নাম",
    citizenIdentifierPlaceholder: "उदा. anand_kumar বা anand.kumar@citizen.gov.in",
    citizenPasswordLabel: "পাসওয়ার্ড বা ডিজিলকার পিন",
    citizenPasswordPlaceholder: "••••••••",
    forgotPasswordBtn: "পাসওয়ার্ড ভুলে গেছেন?",
    citizenSubmitBtn: "নাগরিক ড্যাশবোর্ডে লগইন করুন",
    citizenSubmittingBtn: "যাচাই করা হচ্ছে...",

    officerHeaderTitle: "বিভাগীয় কর্মকর্তা ও স্ক্রুটিনি হাব",
    officerHeaderSubtitle: "আবেদন পর্যালোচনা, ডিজিলকার যাচাই ও SLA সিদ্ধান্তের জন্য সংরক্ষিত পোর্টাল।",
    officerIdentifierLabel: "কর্মচারী আইডি বা অফিশিয়াল ইমেল",
    officerIdentifierPlaceholder: "उदा. officer.foodsafety@karnataka.gov.in",
    officerPasswordLabel: "অফিশিয়াল অ্যাক্সেস কি",
    officerPasswordPlaceholder: "••••••••",
    officerSubmitBtn: "কর্মকর্তা কনসোলে লগইন করুন",
    officerSubmittingBtn: "পরিচয় যাচাই করা হচ্ছে...",

    registerHeaderTitle: "নতুন নাগরিক নিবন্ধন",
    registerHeaderSubtitle: "ডিজিলকার ও API সেতুর সাথে যুক্ত অফিশিয়াল নাগরিক পরিচয় তৈরি করুন।",
    fullNameLabel: "পূর্ণ নাম (আধার অনুযায়ী)",
    fullNamePlaceholder: "আনন্দ কুমার",
    usernameLabel: "ইউজারনেম",
    usernamePlaceholder: "anand_kumar2026",
    emailLabel: "ইমেল ঠিকানা",
    emailPlaceholder: "anand.kumar@citizen.gov.in",
    phoneLabel: "মোবাইল নম্বর (আধার সংযুক্ত)",
    phonePlaceholder: "+91 98765 43210",
    aadhaarLabel: "আধার নম্বর (ঐচ্ছিক)",
    aadhaarPlaceholder: "1234 5678 9012",
    stateLabel: "রাজ্য / কেন্দ্রশাসিত অঞ্চল",
    passwordLabel: "পাসওয়ার্ড",
    passwordPlaceholder: "কমপক্ষে ৮টি অক্ষর",
    confirmPasswordLabel: "পাসওয়ার্ড নিশ্চিত করুন",
    confirmPasswordPlaceholder: "পুনরায় পাসওয়ার্ড লিখুন",
    registerSubmitBtn: "অ্যাকাউন্ট তৈরি করুন ও ডিজিলকার যুক্ত করুন",
    registerSubmittingBtn: "অ্যাকাউন্ট তৈরি হচ্ছে...",

    evaluatorBoxTitle: "SIH পরীক্ষক / দ্রুত পরীক্ষার তথ্য",
    evaluatorBoxDesc: "টেস্ট ক্রেডেনশিয়াল স্বয়ংক্রিয়ভাবে পূরণ করতে যেকোনো প্রোফাইলে ক্লিক করুন:",
    citizenDemo1Label: "নাগরিক ১: আনন্দ কুমার (MSME ও FSSAI)",
    citizenDemo2Label: "নাগরিক ২: প্রিয়া প্যাটেল (জমি রূপান্তর)",
    officerDemo1Label: "কর্মকর্তা ১: সুরেশ রাও (খাদ্য সুরক্ষা কর্মকর্তা)",
    officerDemo2Label: "কর্মকর্তা ২: কবিতা পাতিল (রাজস্ব তহসিলদার)",

    itActNotice: "আইনি সতর্কতা: এই অফিশিয়াল পোর্টালে অননুমোদিত প্রবেশ তথ্যপ্রযুক্তি আইন ২০০০ এর ধারা ৪৩ ও ৬৬ অনুযায়ী দণ্ডনীয় অপরাধ।",
    digilockerSafeNotice: "🔒 ২৫৬-বিট TLS এনক্রিপ্ট করা • ডিজিলকার ২.০ ইন্টিগ্রেশন",

    forgotModalTitle: "পাসওয়ার্ড পুনরুদ্ধার",
    forgotModalDesc: "OTP পেতে আপনার নিবন্ধিত ইমেল বা মোবাইল নম্বর লিখুন।",
    forgotInputLabel: "নিবন্ধিত পরিচয়",
    forgotInputPlaceholder: "ইমেল বা মোবাইল",
    forgotSubmitBtn: "OTP পাঠান",
    forgotSentSuccess: "OTP সফলভাবে পাঠানো হয়েছে:",
    forgotCloseBtn: "বন্ধ করুন",

    langSelectorLabel: "ভাষা নির্বাচন করুন",
    backToHome: "হোমপেজে ফিরে যান",
    signOutBtn: "সাইন আউট",
  },
  GU: {
    portalTitle: "જનસેતુ™ રાષ્ટ્રીય પોર્ટલ",
    portalSubtitle: "નાગરિકો અને અધિકારીઓ માટે ડિજિટલ ગેટવે",
    ssoBadge: "SSO અને ડિજીલૉકર પ્રમાણિત લૉગિન",
    tabCitizen: "નાગરિક લૉગિન",
    tabOfficer: "વિભાગીય અધિકારી / એડમિન",
    tabRegister: "નવી નોંધણી",

    citizenHeaderTitle: "નાગરિક સેવા પ્રવેશદ્વાર",
    citizenHeaderSubtitle: "કાનૂની રોડમેપ ટ્રેક કરો, દસ્તાવેજો ચકાસો અને મંજૂરીઓ મેળવો.",
    citizenIdentifierLabel: "ઇમેઇલ, મોબાઇલ નંબર અથવા યુઝરનેમ",
    citizenIdentifierPlaceholder: "દા.ત. anand_kumar અથવા anand.kumar@citizen.gov.in",
    citizenPasswordLabel: "પાસવર્ડ અથવા ડિજીલૉકર પિન",
    citizenPasswordPlaceholder: "••••••••",
    forgotPasswordBtn: "પાસવર્ડ ભૂલી ગયા છો?",
    citizenSubmitBtn: "નાગરિક ડેશબોર્ડમાં લૉગિન કરો",
    citizenSubmittingBtn: "ચકાસણી ચાલુ છે...",

    officerHeaderTitle: "વિભાગીય અધિકારી ચકાસણી હબ",
    officerHeaderSubtitle: "અરજી સમીક્ષા, ડિજીલૉકર ચકાસણી અને SLA નિર્ણયો માટેનું સુરક્ષિત પોર્ટલ.",
    officerIdentifierLabel: "કર્મચારી આઈડી અથવા સત્તાવાર ઇમેઇલ",
    officerIdentifierPlaceholder: "દા.ત. officer.foodsafety@karnataka.gov.in",
    officerPasswordLabel: "સત્તાવાર એક્સેસ કી",
    officerPasswordPlaceholder: "••••••••",
    officerSubmitBtn: "અધિકારી કન્સોલમાં લૉગિન કરો",
    officerSubmittingBtn: "ઓળખ ચકાસાઈ રહી છે...",

    registerHeaderTitle: "નવી નાગરિક નોંધણી",
    registerHeaderSubtitle: "ડિજીલૉકર અને API સેતુ સાથે જોડાયેલ નાગરિક ઓળખ બનાવો.",
    fullNameLabel: "પૂરું નામ (આધાર મુજબ)",
    fullNamePlaceholder: "આનંદ કુમાર",
    usernameLabel: "યુઝરનેમ",
    usernamePlaceholder: "anand_kumar2026",
    emailLabel: "ઇમેઇલ સરનામું",
    emailPlaceholder: "anand.kumar@citizen.gov.in",
    phoneLabel: "મોબાઇલ નંબર (આધાર સાથે જોડાયેલ)",
    phonePlaceholder: "+91 98765 43210",
    aadhaarLabel: "આધાર નંબર (વૈકલ્પિક)",
    aadhaarPlaceholder: "1234 5678 9012",
    stateLabel: "રાજ્ય / કેન્દ્રશાસિત પ્રદેશ",
    passwordLabel: "પાસવર્ડ",
    passwordPlaceholder: "ઓછામાં ઓછા ૮ અક્ષરો",
    confirmPasswordLabel: "પાસવર્ડની પુષ્ટિ કરો",
    confirmPasswordPlaceholder: "ફરીથી પાસવર્ડ દાખલ કરો",
    registerSubmitBtn: "ખાતું બનાવો અને ડિજીલૉકર જોડો",
    registerSubmittingBtn: "નોંધણી ચાલુ છે...",

    evaluatorBoxTitle: "SIH મૂલ્યાંકનકર્તા / ઝડપી પરીક્ષણ વિગતો",
    evaluatorBoxDesc: "ટેસ્ટ ક્રેડન્શિયલ્સ આપમેળે ભરવા માટે કોઈપણ પ્રોફાઇલ પર ક્લિક કરો:",
    citizenDemo1Label: "નાગરિક ૧: આનંદ કુમાર (MSME & FSSAI)",
    citizenDemo2Label: "નાગરિક ૨: પ્રિયા પટેલ (જમીન રૂપાંતરણ)",
    officerDemo1Label: "અધિકારી ૧: સુરેશ રાવ (ખાદ્ય સુરક્ષા અધિકારી)",
    officerDemo2Label: "અધિકારી ૨: કવિતા પાટીલ (મહેસૂલ મામલતદાર)",

    itActNotice: "કાનૂની ચેતવણી: આ પોર્ટલ પર અનધિકૃત પ્રવેશ IT એક્ટ ૨૦૦૦ ની કલમ ૪૩ અને ૬૬ હેઠળ સજાપાત્ર ગુનો છે.",
    digilockerSafeNotice: "🔒 ૨૫૬-બીટ TLS એન્ક્રિપ્શન • ડિજીલૉકર ૨.૦ સુવિધા",

    forgotModalTitle: "પાસવર્ડ પુનઃપ્રાપ્તિ",
    forgotModalDesc: "OTP મેળવવા માટે તમારો નોંધાયેલ ઇમેઇલ અથવા મોબાઇલ નંબર દાખલ કરો.",
    forgotInputLabel: "નોંધાયેલ ઓળખ",
    forgotInputPlaceholder: "ઇમેઇલ અથવા મોબાઇલ",
    forgotSubmitBtn: "OTP મોકલો",
    forgotSentSuccess: "OTP સફળતાપૂર્વક મોકલવામાં આવ્યો છે:",
    forgotCloseBtn: "બંધ કરો",

    langSelectorLabel: "ભાષા પસંદ કરો",
    backToHome: "મુખ્ય પૃષ્ઠ પર જાઓ",
    signOutBtn: "સાઇન આઉટ",
  },
  ML: {
    portalTitle: "ജനസേതു™ ദേശീയ പോർട്ടൽ",
    portalSubtitle: "പൗരന്മാർക്കും ഉദ്യോഗസ്ഥർക്കുമുള്ള ഡിജിറ്റൽ ഗേറ്റ്‌വേ",
    ssoBadge: "SSO & ഡിജിലോക്കർ പരിശോധിച്ചുറപ്പിച്ച ലോഗിൻ",
    tabCitizen: "പൗര ലോഗിൻ",
    tabOfficer: "വകുപ്പ് ഓഫീസർ / അഡ്മിൻ",
    tabRegister: "പുതിയ രജിസ്ട്രേഷൻ",

    citizenHeaderTitle: "പൗര സേവന പ്രവേശന കവാടം",
    citizenHeaderSubtitle: "റോഡ്‌മാപ്പുകൾ ട്രാക്ക് ചെയ്യുക, രേഖകൾ പരിശോധിക്കുക, നഗരസഭാ അനുമതികൾ നേടുക.",
    citizenIdentifierLabel: "ഇമെയിൽ, മൊബൈൽ നമ്പർ അല്ലെങ്കിൽ യൂസർനെയിം",
    citizenIdentifierPlaceholder: "ഉദാ: anand_kumar അല്ലെങ്കിൽ anand.kumar@citizen.gov.in",
    citizenPasswordLabel: "പാസ്‌വേഡ് അല്ലെങ്കിൽ ഡിജിലോക്കർ പിൻ",
    citizenPasswordPlaceholder: "••••••••",
    forgotPasswordBtn: "പാസ്‌വേഡ് മറന്നുപോയോ?",
    citizenSubmitBtn: "പൗര ഡാഷ്‌ബോർഡിലേക്ക് ലോഗിൻ ചെയ്യുക",
    citizenSubmittingBtn: "പരിശോധിക്കുന്നു...",

    officerHeaderTitle: "വകുപ്പ് ഓഫീസർ പരിശോധനാ കേന്ദ്രം",
    officerHeaderSubtitle: "അപേക്ഷ പരിശോധന, ഡിജിലോക്കർ പരിശോധന, SLA തീരുമാനങ്ങൾ എന്നിവയ്ക്കുള്ള പോർട്ടൽ.",
    officerIdentifierLabel: "ജീവനക്കാരുടെ ഐഡി അല്ലെങ്കിൽ ഇമെയിൽ",
    officerIdentifierPlaceholder: "ഉദാ: officer.foodsafety@karnataka.gov.in",
    officerPasswordLabel: "ഔദ്യോഗിക ആക്‌സസ്സ് കീ",
    officerPasswordPlaceholder: "••••••••",
    officerSubmitBtn: "ഓഫീസർ കൺസോളിലേക്ക് ലോഗിൻ ചെയ്യുക",
    officerSubmittingBtn: "തിരിച്ചറിയൽ പരിശോധിക്കുന്നു...",

    registerHeaderTitle: "പുതിയ പൗര രജിസ്ട്രേഷൻ",
    registerHeaderSubtitle: "ഡിജിലോക്കറുമായി ബന്ധിപ്പിച്ച ഔദ്യോഗിക പൗര ഐഡി സൃഷ്ടിക്കുക.",
    fullNameLabel: "പൂർണ്ണമായ പേര് (ആധാർ പ്രകാരം)",
    fullNamePlaceholder: "ആനന്ദ് കുമാർ",
    usernameLabel: "യൂസർനെയിം",
    usernamePlaceholder: "anand_kumar2026",
    emailLabel: "ഇമെയിൽ വിലാസം",
    emailPlaceholder: "anand.kumar@citizen.gov.in",
    phoneLabel: "മൊബൈൽ നമ്പർ (ആധാർ ലിങ്ക് ചെയ്തത്)",
    phonePlaceholder: "+91 98765 43210",
    aadhaarLabel: "ആധാർ നമ്പർ (ഓപ്ഷണൽ)",
    aadhaarPlaceholder: "1234 5678 9012",
    stateLabel: "സംസ്ഥാനം / കേന്ദ്രഭരണ പ്രദേശം",
    passwordLabel: "പാസ്‌വേഡ്",
    passwordPlaceholder: "കുറഞ്ഞത് 8 അക്ഷരങ്ങൾ",
    confirmPasswordLabel: "പാസ്‌വേഡ് സ്ഥിരീകരിക്കുക",
    confirmPasswordPlaceholder: "പാസ്‌വേഡ് വീണ്ടും നൽകുക",
    registerSubmitBtn: "അക്കൗണ്ട് സൃഷ്ടിച്ച് ഡിജിലോക്കർ ബന്ധിപ്പിക്കുക",
    registerSubmittingBtn: "രജിസ്റ്റർ ചെയ്യുന്നു...",

    evaluatorBoxTitle: "SIH ഇവാല്യുവേറ്റർ / ടെസ്റ്റ് വിവരങ്ങൾ",
    evaluatorBoxDesc: "വിവരങ്ങൾ സ്വയമേവ പൂരിപ്പിക്കുന്നതിന് താഴെയുള്ള ഏതെങ്കിലും പ്രൊഫൈലിൽ ക്ലിക്കുചെയ്യുക:",
    citizenDemo1Label: "പൗരൻ 1: ആനന്ദ് കുമാർ (MSME & FSSAI)",
    citizenDemo2Label: "പൗരൻ 2: പ്രിയ പട്ടേൽ (ഭൂമി തരംമാറ്റം)",
    officerDemo1Label: "ഓഫീസർ 1: സുരേഷ് റാവു (ഫുഡ് സേഫ്റ്റി ഓഫീസർ)",
    officerDemo2Label: "ഓഫീസർ 2: കവിത പാട്ടീൽ (റവന്യൂ തഹസിൽദാർ)",

    itActNotice: "നിയമപരമായ മുന്നറിയിപ്പ്: ഈ പോർട്ടലിലെ അനധികൃത പ്രവേശനം ഐടി ആക്ട് 2000 ലെ സെക്ഷൻ 43 & 66 പ്രകാരം ശിക്ഷാർഹമായ കുറ്റമാണ്.",
    digilockerSafeNotice: "🔒 256-ബിറ്റ് TLS എൻക്രിപ്ഷൻ • ഡിജിലോക്കർ 2.0 സംയോജനം",

    forgotModalTitle: "പാസ്‌വേഡ് വീണ്ടെടുക്കൽ",
    forgotModalDesc: "OTP ലഭിക്കാൻ രജിസ്റ്റർ ചെയ്ത ഇമെയിൽ അല്ലെങ്കിൽ മൊബൈൽ നമ്പർ നൽകുക.",
    forgotInputLabel: "രജിസ്റ്റർ ചെയ്ത വിവരങ്ങൾ",
    forgotInputPlaceholder: "ഇമെയിൽ അല്ലെങ്കിൽ മൊബൈൽ",
    forgotSubmitBtn: "OTP അയക്കുക",
    forgotSentSuccess: "OTP വിജയകരമായി അയച്ചു:",
    forgotCloseBtn: "അടയ്ക്കുക",

    langSelectorLabel: "ഭാഷ തിരഞ്ഞെടുക്കുക",
    backToHome: "ഹോം പേജിലേക്ക് മടങ്ങുക",
    signOutBtn: "സൈൻ ഔട്ട്",
  },
  PA: {
    portalTitle: "ਜਨਸੇਤੂ™ ਕੌਮੀ ਪੋਰਟਲ",
    portalSubtitle: "ਨਾਗਰਿਕਾਂ ਅਤੇ ਅਧਿਕਾਰੀਆਂ ਲਈ ਡਿਜੀਟਲ ਗੇਟਵੇ",
    ssoBadge: "SSO ਅਤੇ ਡਿਜੀਲਾਕਰ ਪ੍ਰਮਾਣਿਤ ਲੌਗਇਨ",
    tabCitizen: "ਨਾਗਰਿਕ ਲੌਗਇਨ",
    tabOfficer: "ਵਿਭਾਗੀ ਅਧਿਕਾਰੀ / ਐਡਮਿਨ",
    tabRegister: "ਨਵੀਂ ਰਜਿਸਟ੍ਰੇਸ਼ਨ",

    citizenHeaderTitle: "ਨਾਗਰਿਕ ਸੇਵਾ ਪ੍ਰਵੇਸ਼ ਦੁਆਰ",
    citizenHeaderSubtitle: "ਰੋਡਮੈਪ ਟਰੈਕ ਕਰੋ, ਕਾਨੂੰਨੀ ਦਸਤਾਵੇਜ਼ਾਂ ਦੀ ਜਾਂਚ ਕਰੋ ਅਤੇ ਨਗਰ ਨਿਗਮ ਮਨਜ਼ੂਰੀਆਂ ਲਵੋ।",
    citizenIdentifierLabel: "ਈਮੇਲ, ਮੋਬਾਈਲ ਨੰਬਰ ਜਾਂ ਉਪਭੋਗਤਾ ਨਾਮ",
    citizenIdentifierPlaceholder: "ਉਦਾ. anand_kumar ਜਾਂ anand.kumar@citizen.gov.in",
    citizenPasswordLabel: "ਪਾਸਵਰਡ ਜਾਂ ਡਿਜੀਲਾਕਰ ਪਿੰਨ",
    citizenPasswordPlaceholder: "••••••••",
    forgotPasswordBtn: "ਪਾਸਵਰਡ ਭੁੱਲ ਗਏ ਹੋ?",
    citizenSubmitBtn: "ਨਾਗਰਿਕ ਡੈਸ਼ਬੋਰਡ ਵਿੱਚ ਲੌਗਇਨ ਕਰੋ",
    citizenSubmittingBtn: "ਪੜਤਾਲ ਜਾਰੀ ਹੈ...",

    officerHeaderTitle: "ਵਿਭਾਗੀ ਅਧਿਕਾਰੀ ਅਤੇ ਜਾਂਚ ਕੇਂਦਰ",
    officerHeaderSubtitle: "ਅਰਜ਼ੀਆਂ ਦੀ ਸਮੀਖਿਆ, ਡਿਜੀਲਾਕਰ ਤਸਦੀਕ ਅਤੇ SLA ਫੈਸਲਿਆਂ ਲਈ ਅਧਿਕਾਰਤ ਪੋਰਟਲ।",
    officerIdentifierLabel: "ਕਰਮਚਾਰੀ ਆਈਡੀ ਜਾਂ ਅਧਿਕਾਰਤ ਈਮੇਲ",
    officerIdentifierPlaceholder: "ਉਦਾ. officer.foodsafety@karnataka.gov.in",
    officerPasswordLabel: "ਅਧਿਕਾਰਤ ਐਕਸੈਸ ਕੁੰਜੀ",
    officerPasswordPlaceholder: "••••••••",
    officerSubmitBtn: "ਅਧਿਕਾਰੀ ਕੰਸੋਲ ਵਿੱਚ ਲੌਗਇਨ ਕਰੋ",
    officerSubmittingBtn: "ਪਛਾਣ ਦੀ ਜਾਂਚ ਕੀਤੀ ਜਾ ਰਹੀ ਹੈ...",

    registerHeaderTitle: "ਨਵੀਂ ਨਾਗਰਿਕ ਰਜਿਸਟ੍ਰੇਸ਼ਨ",
    registerHeaderSubtitle: "ਡਿਜੀਲਾਕਰ ਅਤੇ API ਸੇਤੂ ਨਾਲ ਜੁੜੀ ਨਾਗਰਿਕ ਪਛਾਣ ਬਣਾਓ।",
    fullNameLabel: "ਪੂਰਾ ਨਾਮ (ਆਧਾਰ ਅਨੁਸਾਰ)",
    fullNamePlaceholder: "ਆਨੰਦ ਕੁਮਾਰ",
    usernameLabel: "ਯੂਜ਼ਰਨਾਮ",
    usernamePlaceholder: "anand_kumar2026",
    emailLabel: "ਈਮੇਲ ਪਤਾ",
    emailPlaceholder: "anand.kumar@citizen.gov.in",
    phoneLabel: "ਮੋਬਾਈਲ ਨੰਬਰ (ਆਧਾਰ ਨਾਲ ਜੁੜਿਆ)",
    phonePlaceholder: "+91 98765 43210",
    aadhaarLabel: "ਆਧਾਰ ਨੰਬਰ (ਵਿਕਲਪਿਕ)",
    aadhaarPlaceholder: "1234 5678 9012",
    stateLabel: "ਰਾਜ / ਕੇਂਦਰ ਸ਼ਾਸਿਤ ਪ੍ਰਦੇਸ਼",
    passwordLabel: "ਪਾਸਵਰਡ",
    passwordPlaceholder: "ਘੱਟੋ-ਘੱਟ 8 ਅੱਖਰ",
    confirmPasswordLabel: "ਪਾਸਵਰਡ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ",
    confirmPasswordPlaceholder: "ਦੁਬਾਰਾ ਪਾਸਵਰਡ ਦਰਜ ਕਰੋ",
    registerSubmitBtn: "ਖਾਤਾ ਬਣਾਓ ਅਤੇ ਡਿਜੀਲਾਕਰ ਜੋੜੋ",
    registerSubmittingBtn: "ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਜਾਰੀ ਹੈ...",

    evaluatorBoxTitle: "SIH ਮੁਲਾਂਕਣਕਰਤਾ / ਟੈਸਟਿੰਗ ਵੇਰਵੇ",
    evaluatorBoxDesc: "ਵੇਰਵੇ ਆਟੋ-ਫਿਲ ਕਰਨ ਲਈ ਹੇਠਾਂ ਕਿਸੇ ਵੀ ਪ੍ਰੋਫਾਈਲ 'ਤੇ ਕਲਿੱਕ ਕਰੋ:",
    citizenDemo1Label: "ਨਾਗਰਿਕ 1: ਆਨੰਦ ਕੁਮਾਰ (MSME & FSSAI)",
    citizenDemo2Label: "ਨਾਗਰਿਕ 2: ਪ੍ਰਿਆ ਪਟੇਲ (ਜ਼ਮੀਨ ਤਬਦੀਲੀ)",
    officerDemo1Label: "ਅਧਿਕਾਰੀ 1: ਸੁਰੇਸ਼ ਰਾਓ (ਫੂਡ ਸੇਫਟੀ ਅਫਸਰ)",
    officerDemo2Label: "ਅਧਿਕਾਰੀ 2: ਕਵਿਤਾ ਪਾਟਿਲ (ਮਾਲ ਤਹਿਸੀਲਦਾਰ)",

    itActNotice: "ਕਾਨੂੰਨੀ ਚੇਤਾਵਨੀ: ਇਸ ਅਧਿਕਾਰਤ ਪੋਰਟਲ 'ਤੇ ਅਣਅਧਿਕਾਰਤ ਪਹੁੰਚ IT ਐਕਟ 2000 ਦੀ ਧਾਰਾ 43 ਅਤੇ 66 ਦੇ ਤਹਿਤ ਸਜ਼ਾਯੋਗ ਅਪਰਾਧ ਹੈ।",
    digilockerSafeNotice: "🔒 256-ਬਿੱਟ TLS ਏਨਕ੍ਰਿਪਸ਼ਨ • ਡਿਜੀਲਾਕਰ 2.0 ਏਕੀਕਰਨ",

    forgotModalTitle: "ਪਾਸਵਰਡ ਰਿਕਵਰੀ",
    forgotModalDesc: "OTP ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ ਆਪਣਾ ਰਜਿਸਟਰਡ ਈਮੇਲ ਜਾਂ ਮੋਬਾਈਲ ਨੰਬਰ ਦਰਜ ਕਰੋ।",
    forgotInputLabel: "ਰਜਿਸਟਰਡ ਪਛਾਣ",
    forgotInputPlaceholder: "ਈਮੇਲ ਜਾਂ ਮੋਬਾਈਲ",
    forgotSubmitBtn: "OTP ਭੇਜੋ",
    forgotSentSuccess: "OTP ਸਫਲਤਾਪੂਰਵਕ ਭੇਜਿਆ ਗਿਆ ਹੈ:",
    forgotCloseBtn: "ਬੰਦ ਕਰੋ",

    langSelectorLabel: "ਭਾਸ਼ਾ ਚੁਣੋ",
    backToHome: "ਮੁੱਖ ਪੰਨੇ 'ਤੇ ਵਾਪਸ ਜਾਓ",
    signOutBtn: "ਸਾਈਨ ਆਉਟ",
  },
  OR: {
    portalTitle: "ଜନସେତୁ™ ଜାତୀୟ ପୋର୍ଟାଲ୍",
    portalSubtitle: "ନାଗରିକ ଏବଂ ଅଧିକାରୀଙ୍କ ପାଇଁ ଡିଜିଟାଲ୍ ଗେଟୱେ",
    ssoBadge: "SSO ଏବଂ ଡିଜିଲକର୍ ପ୍ରମାଣିତ ଲଗଇନ୍",
    tabCitizen: "ନାଗରିକ ଲଗଇନ୍",
    tabOfficer: "ବିଭାଗୀୟ ଅଧିକାରୀ / ଆଡମିନ୍",
    tabRegister: "ନୂତନ ପଞ୍ଜୀକରଣ",

    citizenHeaderTitle: "ନାଗରିକ ସେବା ପ୍ରବେଶ ଦ୍ୱାର",
    citizenHeaderSubtitle: "ରୋଡମ୍ୟାପ୍ ଟ୍ରାକ୍ କରନ୍ତୁ, ଆଇନଗତ ଦସ୍ତାବିଜ୍ ଯାଞ୍ଚ କରନ୍ତୁ ଏବଂ ଅନୁମୋଦନ ପାଆନ୍ତୁ।",
    citizenIdentifierLabel: "ଇମେଲ୍, ମୋବାଇଲ୍ ନମ୍ବର କିମ୍ବା ୟୁଜରନେମ୍",
    citizenIdentifierPlaceholder: "उदा. anand_kumar କିମ୍ବା anand.kumar@citizen.gov.in",
    citizenPasswordLabel: "ପାସୱାର୍ଡ କିମ୍ବା ଡିଜିଲକର୍ ପିନ୍",
    citizenPasswordPlaceholder: "••••••••",
    forgotPasswordBtn: "ପାସୱାର୍ଡ ଭୁଲିଗଲେ କି?",
    citizenSubmitBtn: "ନାଗରିକ ଡ୍ୟାସବୋର୍ଡରେ ଲଗଇନ୍ କରନ୍ତୁ",
    citizenSubmittingBtn: "ଯାଞ୍ଚ ଚାଲିଛି...",

    officerHeaderTitle: "ବିଭାଗୀୟ ଅଧିକାରୀ ଯାଞ୍ଚ କେନ୍ଦ୍ର",
    officerHeaderSubtitle: "ଆବେଦନ ସମୀକ୍ଷା, ଡିଜିଲକର୍ ଯାଞ୍ଚ ଏବଂ SLA ନିଷ୍ପତ୍ତି ପାଇଁ ସୁରକ୍ଷିତ ପୋର୍ଟାଲ୍।",
    officerIdentifierLabel: "କର୍ମଚାରୀ ଆଇଡି କିମ୍ବା ସରକାରୀ ଇମେଲ୍",
    officerIdentifierPlaceholder: "उदा. officer.foodsafety@karnataka.gov.in",
    officerPasswordLabel: "ସରକାରୀ ଆକ୍ସେସ୍ କି",
    officerPasswordPlaceholder: "••••••••",
    officerSubmitBtn: "ଅଧିକାରୀ କନସୋଲରେ ଲଗଇନ୍ କରନ୍ତୁ",
    officerSubmittingBtn: "ପରିଚୟ ଯାଞ୍ଚ ହେଉଛି...",

    registerHeaderTitle: "ନୂତନ ନାଗରିକ ପଞ୍ଜୀକରଣ",
    registerHeaderSubtitle: "ଡିଜିଲକର୍ ଏବଂ API ସେତୁ ସହିତ ସଂଯୁକ୍ତ ନାଗରିକ ପରିଚୟ ସୃଷ୍ଟି କରନ୍ତୁ।",
    fullNameLabel: "ପୂର୍ଣ୍ଣ ନାମ (ଆଧାର ଅନୁଯାୟୀ)",
    fullNamePlaceholder: "ଆନନ୍ଦ କୁମାର",
    usernameLabel: "ୟୁଜରନେମ୍",
    usernamePlaceholder: "anand_kumar2026",
    emailLabel: "ଇମେଲ୍ ଠିକଣା",
    emailPlaceholder: "anand.kumar@citizen.gov.in",
    phoneLabel: "ମୋବାଇଲ୍ ନମ୍ବର (ଆଧାର ସଂଯୁକ୍ତ)",
    phonePlaceholder: "+91 98765 43210",
    aadhaarLabel: "ଆଧାର ନମ୍ବର (ଇଚ୍ଛାଧୀନ)",
    aadhaarPlaceholder: "1234 5678 9012",
    stateLabel: "ରାଜ୍ୟ / କେନ୍ଦ୍ରଶାସିତ ଅଞ୍ଚଳ",
    passwordLabel: "ପାସୱାର୍ଡ",
    passwordPlaceholder: "ଅତି କମରେ ୮ଟି ଅକ୍ଷର",
    confirmPasswordLabel: "ପାସୱାର୍ଡ ନିଶ୍ଚିତ କରନ୍ତୁ",
    confirmPasswordPlaceholder: "ପୁନର୍ବାର ପାସୱାର୍ଡ ଦିଅନ୍ତୁ",
    registerSubmitBtn: "ଖାତା ସୃଷ୍ଟି କରନ୍ତୁ ଏବଂ ଡିଜିଲକର୍ ଯୋଡନ୍ତୁ",
    registerSubmittingBtn: "ପଞ୍ଜୀକରଣ ଚାଲିଛି...",

    evaluatorBoxTitle: "SIH ମୂଲ୍ୟାଙ୍କନକାରୀ / ପରୀକ୍ଷଣ ବିବରଣୀ",
    evaluatorBoxDesc: "ବିବରଣୀ ସ୍ୱୟଂଚାଳିତ ଭାବରେ ପୂରଣ କରିବାକୁ ଯେକୌଣସି ପ୍ରୋଫାଇଲ୍ ଉପରେ କ୍ଲିକ୍ କରନ୍ତୁ:",
    citizenDemo1Label: "ନାଗରିକ ୧: ଆନନ୍ଦ କୁମାର (MSME & FSSAI)",
    citizenDemo2Label: "ନାଗରିକ ୨: ପ୍ରିୟା ପଟେଲ (ଜମି ରୂପାନ୍ତରଣ)",
    officerDemo1Label: "ଅଧିକାରୀ ୧: ସୁରେଶ ରାଓ (ଖାଦ୍ୟ ସୁରକ୍ଷା ଅଧିକାରୀ)",
    officerDemo2Label: "ଅଧିକାରୀ ୨: କବିତା ପାଟିଲ (ରାଜସ୍ୱ ତହସିଲଦାର)",

    itActNotice: "ଆଇନଗତ ଚେତାବନୀ: ଏହି ସରକାରୀ ପୋର୍ଟାଲରେ ଅନଧିକୃତ ପ୍ରବେଶ IT ଆକ୍ଟ ୨୦୦୦ ର ଧାରା ୪୩ ଏବଂ ୬୬ ଅନୁଯାୟୀ ଦଣ୍ଡନୀୟ ଅପରାଧ।",
    digilockerSafeNotice: "🔒 ୨୫୬-ବିଟ୍ TLS ଏନକ୍ରିପ୍ସନ୍ • ଡିଜିଲକର୍ ୨.୦ ଏକୀକରଣ",

    forgotModalTitle: "ପାସୱାର୍ଡ ପୁନରୁଦ୍ଧାର",
    forgotModalDesc: "OTP ପାଇବା ପାଇଁ ଆପଣଙ୍କର ପଞ୍ଜୀକୃତ ଇମେଲ୍ କିମ୍ବା ମୋବାଇଲ୍ ନମ୍ବର ଦିଅନ୍ତୁ।",
    forgotInputLabel: "ପଞ୍ଜୀକୃତ ପରିଚୟ",
    forgotInputPlaceholder: "ଇମେଲ୍ କିମ୍ବା ମୋବାଇଲ୍",
    forgotSubmitBtn: "OTP ପଠାନ୍ତୁ",
    forgotSentSuccess: "OTP ସଫଳତାର ସହିତ ପଠାଯାଇଛି:",
    forgotCloseBtn: "ବନ୍ଦ କରନ୍ତୁ",

    langSelectorLabel: "ଭାଷା ଚୟନ କରନ୍ତୁ",
    backToHome: "ମୁଖ୍ୟ ପୃଷ୍ଠାକୁ ଫେରନ୍ତୁ",
    signOutBtn: "ସାଇନ୍ ଆଉଟ୍",
  },
};
