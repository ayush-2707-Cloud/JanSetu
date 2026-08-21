export type MunicipalDomainId =
  | "startups"
  | "agriculture"
  | "food"
  | "real_estate"
  | "healthcare"
  | "retail";

export interface DomainMeta {
  id: MunicipalDomainId;
  label: string;
  shortLabel: string;
  iconName: string;
  emoji: string;
  description: string;
  badge: string;
  colorScheme: {
    bg: string;
    border: string;
    text: string;
    accent: string;
    pill: string;
  };
}

export interface DomainRuleField {
  key: string;
  label: string;
  category: "sla" | "fee" | "noc" | "zoning" | "subsidy" | "compliance";
  categoryLabel: string;
  iconName: string;
  description: string;
}

export interface DomainRuleValue {
  value: string;
  highlight?: "better" | "warning" | "neutral" | "strict";
  details?: string;
  statutoryReference?: string;
}

export interface MunicipalComplianceProfile {
  id: string;
  cityName: string;
  corporationName: string;
  state: string;
  stateCode: string;
  pincodePrefix: string[];
  portalUrl: string;
  singleWindowPortal: string;
  helpline: string;
  domainRules: Partial<Record<MunicipalDomainId, Record<string, DomainRuleValue>>>;

  // Legacy fields for backward compatibility
  tradeLicenseSLA?: string;
  tradeLicenseFee?: string;
  healthNOCRequirements?: string[];
  fireNOCThreshold?: string;
  propertyTaxDocument?: string;
  waterSewerageBoard?: string;
  signagePolicyFee?: string;
}

export const MUNICIPAL_DOMAINS: Record<MunicipalDomainId, DomainMeta> = {
  startups: {
    id: "startups",
    label: "Startups, Tech & IT Enterprises",
    shortLabel: "Startups & Tech",
    iconName: "Rocket",
    emoji: "🚀",
    description:
      "DPIIT recognition, co-working trade licenses, 24/7 operations, signboard rules, and incubation subsidies.",
    badge: "High Growth Sector",
    colorScheme: {
      bg: "bg-indigo-50 dark:bg-indigo-950/40",
      border: "border-indigo-200 dark:border-indigo-800/60",
      text: "text-indigo-600 dark:text-indigo-400",
      accent: "from-indigo-600 to-blue-600",
      pill: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-200 border-indigo-300 dark:border-indigo-700",
    },
  },
  agriculture: {
    id: "agriculture",
    label: "Agriculture, Farming & Agro-Processing",
    shortLabel: "Agri & Farming",
    iconName: "Tractor",
    emoji: "🌾",
    description:
      "Agricultural land conversion (DC/CLU), APMC Mandi cess, borewell NOCs, solar pump subsidies, and grain storage.",
    badge: "Primary Sector & Rural",
    colorScheme: {
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      border: "border-emerald-200 dark:border-emerald-800/60",
      text: "text-emerald-600 dark:text-emerald-400",
      accent: "from-emerald-600 to-teal-600",
      pill: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700",
    },
  },
  food: {
    id: "food",
    label: "Restaurants, Cloud Kitchens & Cafes",
    shortLabel: "Food & Hospitality",
    iconName: "Utensils",
    emoji: "🍛",
    description:
      "Municipal health trade licenses, FSSAI alignment, grease trap STP drainage, Fire NOC thresholds, and terrace dining.",
    badge: "Hospitality & F&B",
    colorScheme: {
      bg: "bg-amber-50 dark:bg-amber-950/40",
      border: "border-amber-200 dark:border-amber-800/60",
      text: "text-amber-600 dark:text-amber-400",
      accent: "from-amber-600 to-orange-600",
      pill: "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200 border-amber-300 dark:border-amber-700",
    },
  },
  real_estate: {
    id: "real_estate",
    label: "Real Estate, Housing & Construction",
    shortLabel: "Real Estate & Infra",
    iconName: "Building",
    emoji: "🏢",
    description:
      "Floor Area Ratio (FAR/FSI), building sanction SLAs, rainwater harvesting mandates, and betterment impact fees.",
    badge: "Urban Planning & Infra",
    colorScheme: {
      bg: "bg-blue-50 dark:bg-blue-950/40",
      border: "border-blue-200 dark:border-blue-800/60",
      text: "text-blue-600 dark:text-blue-400",
      accent: "from-blue-600 to-cyan-600",
      pill: "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200 border-blue-300 dark:border-blue-700",
    },
  },
  healthcare: {
    id: "healthcare",
    label: "Healthcare, Clinics & Diagnostic Labs",
    shortLabel: "Healthcare & Labs",
    iconName: "Activity",
    emoji: "🏥",
    description:
      "Clinical Establishments Act, bio-medical waste authorization, pharmacy drug licenses, and AERB X-ray clearances.",
    badge: "Regulated Health",
    colorScheme: {
      bg: "bg-rose-50 dark:bg-rose-950/40",
      border: "border-rose-200 dark:border-rose-800/60",
      text: "text-rose-600 dark:text-rose-400",
      accent: "from-rose-600 to-pink-600",
      pill: "bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200 border-rose-300 dark:border-rose-700",
    },
  },
  retail: {
    id: "retail",
    label: "Retail Trade, Supermarkets & Commercial Shops",
    shortLabel: "Retail & Commerce",
    iconName: "ShoppingBag",
    emoji: "🛍️",
    description:
      "Shop & Establishment registration, 24/7 operating hours, signboard language quotas, and parking space mandates.",
    badge: "Commercial Commerce",
    colorScheme: {
      bg: "bg-purple-50 dark:bg-purple-950/40",
      border: "border-purple-200 dark:border-purple-800/60",
      text: "text-purple-600 dark:text-purple-400",
      accent: "from-purple-600 to-violet-600",
      pill: "bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200 border-purple-300 dark:border-purple-700",
    },
  },
};

export const DOMAIN_RULE_FIELDS: Record<MunicipalDomainId, DomainRuleField[]> = {
  startups: [
    {
      key: "single_window_clearance",
      label: "Single Window Clearance & Auto-Pass",
      category: "sla",
      categoryLabel: "⏱️ SLAs & Speed",
      iconName: "Zap",
      description: "State-level digital unified single-window portal turnaround time.",
    },
    {
      key: "coworking_trade_license",
      label: "Co-Working / Virtual Office Licensing",
      category: "compliance",
      categoryLabel: "📜 Compliance & Permissibility",
      iconName: "Building2",
      description: "Trade license requirement for shared workspaces & virtual desks.",
    },
    {
      key: "night_shift_permit",
      label: "24x7 Night Shift & Female Safety Norms",
      category: "compliance",
      categoryLabel: "📜 Compliance & Permissibility",
      iconName: "Moon",
      description: "Automatic night shift exemption for IT/ITES and cab security mandates.",
    },
    {
      key: "signboard_language_tax",
      label: "Signboard Language Ratio & Ad Tax",
      category: "fee",
      categoryLabel: "💰 Fees & Tariffs",
      iconName: "FileText",
      description: "Local language font prominence mandate and municipal advertisement tax.",
    },
    {
      key: "seed_fund_subsidy",
      label: "Municipal & State Startup Seed Grant",
      category: "subsidy",
      categoryLabel: "🎁 Subsidies & Concessions",
      iconName: "Gift",
      description: "Government financial grants, patent filing reimbursement, and power tariff subsidies.",
    },
    {
      key: "property_tax_concession",
      label: "IT / Tech SEZ Property Tax Rate",
      category: "fee",
      categoryLabel: "💰 Fees & Tariffs",
      iconName: "DollarSign",
      description: "Municipal property tax assessment formula for software & startup parks.",
    },
  ],

  agriculture: [
    {
      key: "land_conversion_slu",
      label: "Agricultural Land Conversion (CLU / DC)",
      category: "zoning",
      categoryLabel: "📐 Zoning & Land Use",
      iconName: "Map",
      description: "Process and SLA for converting agri land to commercial / industrial use.",
    },
    {
      key: "apmc_mandi_cess",
      label: "APMC Mandi Cess & Direct Farm Trading",
      category: "fee",
      categoryLabel: "💰 Fees & Tariffs",
      iconName: "Percent",
      description: "Market fee on farm produce and freedom of direct farm-gate sales.",
    },
    {
      key: "groundwater_borewell_noc",
      label: "Groundwater & Borewell NOC SLA",
      category: "noc",
      categoryLabel: "🛡️ Mandatory Clearances",
      iconName: "Droplets",
      description: "NOC requirements from ground water authority for agri & processing units.",
    },
    {
      key: "agro_warehouse_license",
      label: "Agro-Warehouse & Cold Storage License",
      category: "sla",
      categoryLabel: "⏱️ SLAs & Speed",
      iconName: "Warehouse",
      description: "Municipal trade license and zoning norms for rural produce godowns.",
    },
    {
      key: "solar_pumpset_subsidy",
      label: "Solar Agri Pump & PM-KUSUM Subsidy",
      category: "subsidy",
      categoryLabel: "🎁 Subsidies & Concessions",
      iconName: "Sun",
      description: "State & municipal capital subsidy for off-grid and feeder solarization.",
    },
  ],

  food: [
    {
      key: "health_trade_sla",
      label: "Health Trade License SLA",
      category: "sla",
      categoryLabel: "⏱️ SLAs & Speed",
      iconName: "Clock",
      description: "Municipal health trade certificate turnaround and inspection workflow.",
    },
    {
      key: "trade_license_fee",
      label: "Annual Municipal Trade License Fee",
      category: "fee",
      categoryLabel: "💰 Fees & Tariffs",
      iconName: "DollarSign",
      description: "Annual tariff based on horsepower, seat capacity, or floor area.",
    },
    {
      key: "fire_noc_threshold",
      label: "Fire & Safety NOC Threshold",
      category: "noc",
      categoryLabel: "🛡️ Mandatory Clearances",
      iconName: "Flame",
      description: "Kitchen floor area or LPG storage limit triggering Fire Brigade NOC.",
    },
    {
      key: "grease_trap_drainage",
      label: "Kitchen Grease Trap & Sewerage Clearance",
      category: "noc",
      categoryLabel: "🛡️ Mandatory Clearances",
      iconName: "ShieldAlert",
      description: "Mandatory dual-chamber grease trap installation and water board NOC.",
    },
    {
      key: "outdoor_terrace_dining",
      label: "Rooftop / Terrace Dining Permission",
      category: "compliance",
      categoryLabel: "📜 Compliance & Permissibility",
      iconName: "Coffee",
      description: "Municipal policy, surcharge, and fire safety norms for open-air seating.",
    },
  ],

  real_estate: [
    {
      key: "far_fsi_limits",
      label: "Base FAR / FSI & Premium Index",
      category: "zoning",
      categoryLabel: "📐 Zoning & Land Use",
      iconName: "Layers",
      description: "Maximum permissible Floor Area Ratio and purchasable premium FSI.",
    },
    {
      key: "building_plan_sla",
      label: "Online Building Plan Sanction (AutoDCR)",
      category: "sla",
      categoryLabel: "⏱️ SLAs & Speed",
      iconName: "FileCheck",
      description: "Turnaround time for sanction order via automated DCR scrutiny.",
    },
    {
      key: "rwh_mandatory_rule",
      label: "Mandatory Rainwater Harvesting (RWH)",
      category: "compliance",
      categoryLabel: "📜 Compliance & Permissibility",
      iconName: "CloudRain",
      description: "Plot size threshold requiring dual recharge pit RWH system.",
    },
    {
      key: "betterment_impact_fee",
      label: "Betterment & Infrastructure Cess",
      category: "fee",
      categoryLabel: "💰 Fees & Tariffs",
      iconName: "Coins",
      description: "Development fee per square meter for civic infrastructure upkeep.",
    },
    {
      key: "occupancy_cert_norm",
      label: "Occupancy Certificate (OC) Strictness",
      category: "noc",
      categoryLabel: "🛡️ Mandatory Clearances",
      iconName: "CheckCircle",
      description: "Physical inspection and utilities connection dependency on OC.",
    },
  ],

  healthcare: [
    {
      key: "clinical_est_reg",
      label: "Clinical Establishments Act Registration",
      category: "sla",
      categoryLabel: "⏱️ SLAs & Speed",
      iconName: "FileHeart",
      description: "District Registration Authority certificate SLA for clinics & hospitals.",
    },
    {
      key: "biomedical_waste_noc",
      label: "Bio-Medical Waste (BMW) Authorization",
      category: "noc",
      categoryLabel: "🛡️ Mandatory Clearances",
      iconName: "Biohazard",
      description: "Pollution Control Board and municipal tie-up with CBMWTF operator.",
    },
    {
      key: "pharmacy_retail_license",
      label: "Retail Pharmacy & Drug License SLA",
      category: "sla",
      categoryLabel: "⏱️ SLAs & Speed",
      iconName: "Pill",
      description: "State Drugs Control Department retail chemist inspection SLA.",
    },
    {
      key: "xray_radiation_noc",
      label: "AERB Radiation & Lead Shielding NOC",
      category: "noc",
      categoryLabel: "🛡️ Mandatory Clearances",
      iconName: "Radiation",
      description: "Mandatory e-LORA registration and radiation safety officer clearance.",
    },
    {
      key: "fire_evacuation_stair",
      label: "Hospital Fire Ramp & Stretcher Lift Norm",
      category: "compliance",
      categoryLabel: "📜 Compliance & Permissibility",
      iconName: "ShieldPlus",
      description: "Minimum stairwell width, external fire escape ramps, and ICU placement.",
    },
  ],

  retail: [
    {
      key: "shop_est_registration",
      label: "Shop & Establishment Registration",
      category: "sla",
      categoryLabel: "⏱️ SLAs & Speed",
      iconName: "FileSpreadsheet",
      description: "Instant deemed registration vs municipal labor inspector audit.",
    },
    {
      key: "operating_hours_24x7",
      label: "24x7 Night Operating Permission",
      category: "compliance",
      categoryLabel: "📜 Compliance & Permissibility",
      iconName: "Clock8",
      description: "Permissibility of round-the-clock commercial retail operation.",
    },
    {
      key: "signage_tax_language",
      label: "Shop Signboard Language Quota & Tax",
      category: "compliance",
      categoryLabel: "📜 Compliance & Permissibility",
      iconName: "Type",
      description: "Mandatory regional language script proportion on main nameplate.",
    },
    {
      key: "parking_space_ratio",
      label: "Mandatory Customer Parking Ratio",
      category: "zoning",
      categoryLabel: "📐 Zoning & Land Use",
      iconName: "Car",
      description: "Equivalent Car Spaces (ECS) required per 100 sq meters of retail carpet.",
    },
    {
      key: "plastic_waste_rule",
      label: "Single-Use Plastic Ban & EPR Fines",
      category: "noc",
      categoryLabel: "🛡️ Mandatory Clearances",
      iconName: "Trash2",
      description: "Municipal spot fine scale for non-woven polypropylene & plastic bags.",
    },
  ],
};

export const MUNICIPAL_PROFILES: Record<string, MunicipalComplianceProfile> = {
  BBMP: {
    id: "BBMP",
    cityName: "Bengaluru",
    corporationName: "Bruhat Bengaluru Mahanagara Palike (BBMP)",
    state: "Karnataka",
    stateCode: "KA",
    pincodePrefix: ["560", "561", "562"],
    portalUrl: "https://bbmptax.karnataka.gov.in",
    singleWindowPortal: "https://ebizkarnataka.gov.in",
    helpline: "080-22660000 / 1533",
    tradeLicenseSLA: "7–14 Business Days (via Seva Sindhu / BBMP Portal)",
    tradeLicenseFee: "₹2,500 – ₹10,000 / year (based on horsepower/sq ft)",
    healthNOCRequirements: [
      "Medical fitness certificate of food handlers",
      "Pest control certificate (quarterly)",
      "Potable water test report (BWSSB / NABL lab)",
    ],
    fireNOCThreshold: "Mandatory for commercial kitchens > 500 sq ft or gas storage > 100 kg",
    propertyTaxDocument: "e-Khata Certificate (A-Khata mandatory for commercial licenses)",
    waterSewerageBoard: "Bangalore Water Supply and Sewerage Board (BWSSB)",
    signagePolicyFee: "BBMP Advertisement Cess (₹250 – ₹1,500 / sq meter)",

    domainRules: {
      startups: {
        single_window_clearance: {
          value: "3–7 Days via e-Biz Karnataka (Karnataka Digital Economy Mission fast-track)",
          highlight: "better",
          details: "DPIIT-recognized startups receive deemed approval under KISSA Act within 7 working days.",
          statutoryReference: "Karnataka Innovation & Startup Policy 2022-2027",
        },
        coworking_trade_license: {
          value: "Master Operator License covers all registered desk tenants",
          highlight: "better",
          details: "Startup tenants do not need separate individual BBMP trade licenses if operating inside a registered co-working hub.",
          statutoryReference: "BBMP Trade License Manual Sec 353 Bye-laws",
        },
        night_shift_permit: {
          value: "Auto-exempted 24/7 for IT/ITES (Sec 25 Karnataka Shops Act)",
          highlight: "better",
          details: "No police NOC required. Mandatory GPS-tracked cab transport for female employees between 8 PM and 6 AM.",
          statutoryReference: "Karnataka S&E (Amendment) Act Sec 25",
        },
        signboard_language_tax: {
          value: "60% Kannada top-half mandate; Tech SEZs exempted from ad-cess",
          highlight: "strict",
          details: "Kannada Language Comprehensive Development Act enforces 60% Kannada script on all shop & office boards.",
          statutoryReference: "Kannada Language Comprehensive Dev Act 2024",
        },
        seed_fund_subsidy: {
          value: "Up to ₹50 Lakh Idea2PoC / ELEVATE Grant + 50% Patent Reimbursement",
          highlight: "better",
          details: "Government of Karnataka Startup Karnataka grant with zero equity dilution.",
          statutoryReference: "ELEVATE Karnataka Grand Challenge Scheme",
        },
        property_tax_concession: {
          value: "Zone-based SAS Tariff (Category VII - Software / IT Tech Parks)",
          highlight: "neutral",
          details: "Calculated at ₹12/sq ft for AC commercial vs ₹8/sq ft non-AC across 6 BBMP value zones.",
          statutoryReference: "BBMP SAS Property Tax Act 2008",
        },
      },

      agriculture: {
        land_conversion_slu: {
          value: "Deemed 30-Day DC Conversion via Bhoomi / Seva Sindhu 2.0",
          highlight: "better",
          details: "Karnataka Land Revenue Act Sec 95 amendment allows affidavit-based deemed master plan conversion.",
          statutoryReference: "KLR Act Sec 95 (2022 Amendment)",
        },
        apmc_mandi_cess: {
          value: "0.35% unified market fee; Direct farm-gate procurement permitted",
          highlight: "better",
          details: "Farmers can sell directly to food processors without entering physical APMC yard.",
          statutoryReference: "Karnataka APMR (Regulation & Dev) Act",
        },
        groundwater_borewell_noc: {
          value: "Mandatory KGWA permit in 45 Critical Taluks (₹500 application)",
          highlight: "strict",
          details: "Karnataka Ground Water Authority clearance mandatory before drilling rig operation.",
          statutoryReference: "Karnataka Ground Water (Regulation) Act 2011",
        },
        agro_warehouse_license: {
          value: "Gram Panchayat / BBMP 14-day clearance with 50% fee concession",
          highlight: "better",
          details: "Certified agricultural cold storage exempt from commercial manufacturing tariffs.",
          statutoryReference: "Karnataka Agro-Industry Policy",
        },
        solar_pumpset_subsidy: {
          value: "Surya Raitha Scheme: 80% Subsidy (30% MNRE + 50% KREDL)",
          highlight: "better",
          details: "Farmers pay only 20% cost for 3HP–10HP solar water pumping systems.",
          statutoryReference: "PM-KUSUM Component B Karnataka KREDL",
        },
      },

      food: {
        health_trade_sla: {
          value: "7–14 Business Days via Seva Sindhu (Health Officer inspection)",
          highlight: "neutral",
          details: "Requires potable water report from BWSSB/NABL and medical fitness of handlers.",
          statutoryReference: "BBMP Act 2020 Sec 305",
        },
        trade_license_fee: {
          value: "₹2,500 – ₹10,000 / year (based on motor power & seating)",
          highlight: "better",
          details: "Restaurants up to 50 seats pay ₹4,500/year; cloud kitchens pay ₹3,000 base.",
          statutoryReference: "BBMP Schedule X Trade Tariffs",
        },
        fire_noc_threshold: {
          value: "Mandatory if floor area > 500 sq ft or LPG > 100 kg",
          highlight: "neutral",
          details: "Karnataka State Fire & Emergency Services (KSFES) online provisional & final NOC.",
          statutoryReference: "Karnataka Fire Force Act 1964",
        },
        grease_trap_drainage: {
          value: "BWSSB Dual-Chamber Grease Trap mandatory for all food outlets",
          highlight: "strict",
          details: "Connecting kitchen oil/sludge to storm water drain incurs ₹25,000 spot penalty.",
          statutoryReference: "BWSSB Sewerage Regulation Act",
        },
        outdoor_terrace_dining: {
          value: "Permitted with 50% extra trade cess & KSFES roof clearance",
          highlight: "neutral",
          details: "Open-to-sky terrace seating allowed provided no permanent canopy is constructed.",
          statutoryReference: "BBMP Rooftop Food Outlet Guidelines 2023",
        },
      },

      real_estate: {
        far_fsi_limits: {
          value: "Base FAR 1.75–3.25 based on road width + Premium FAR up to 0.6",
          highlight: "neutral",
          details: "Road width > 12m allows 2.5 FAR; Premium FAR available at 50% of guidance value.",
          statutoryReference: "Revised Master Plan 2015 / BBMP Building Bye-laws",
        },
        building_plan_sla: {
          value: "30 Days via BBMP Online Auto-DCR (LPAS portal)",
          highlight: "better",
          details: "Automated scrutiny against zonal regulations with deemed approval clause.",
          statutoryReference: "Karnataka Sakala Services Act 2011",
        },
        rwh_mandatory_rule: {
          value: "Mandatory for all sites >= 1,200 sq ft (30x40 plots and above)",
          highlight: "strict",
          details: "BWSSB imposes 50% water tariff surcharge if RWH percolation pit is not installed.",
          statutoryReference: "BWSSB (Amendment) Act Sec 72A",
        },
        betterment_impact_fee: {
          value: "₹250 – ₹500 / sq meter betterment charge for B-Khata to A-Khata",
          highlight: "neutral",
          details: "Infrastructure development cess collected during layout regularization.",
          statutoryReference: "Karnataka Municipal Corporations Act Sec 466",
        },
        occupancy_cert_norm: {
          value: "Strict: BESCOM & BWSSB permanent lines disconnected without OC",
          highlight: "strict",
          details: "High-court ruling enforces no permanent utility connections for buildings without OC.",
          statutoryReference: "BBMP Building Bye-laws Clause 5.7",
        },
      },

      healthcare: {
        clinical_est_reg: {
          value: "KPME Registration within 30 Days via KPME Portal",
          highlight: "better",
          details: "District Health Officer (DHO) inspection; provisional registration granted in 15 days.",
          statutoryReference: "Karnataka Private Medical Establishments (KPME) Act",
        },
        biomedical_waste_noc: {
          value: "KSPCB Barcoded Waste Collection via Maridi Eco / SEMbctf",
          highlight: "neutral",
          details: "Daily GPS-tracked collection with QR coded yellow/red bins.",
          statutoryReference: "Bio-Medical Waste Management Rules 2016",
        },
        pharmacy_retail_license: {
          value: "21 Business Days via Karnataka State Drugs Control Portal",
          highlight: "better",
          details: "Requires registered pharmacist certificate and min 10 sq meter carpet area.",
          statutoryReference: "Drugs and Cosmetics Rules 1945 Form 20/21",
        },
        xray_radiation_noc: {
          value: "Mandatory AERB e-LORA registration + 2mm lead wall shielding",
          highlight: "strict",
          details: "Radiation Safety Officer (RSO) certificate required prior to diagnostic machine turn-on.",
          statutoryReference: "Atomic Energy (Radiation Protection) Rules",
        },
        fire_evacuation_stair: {
          value: "Minimum 2.0m wide stairwell + ICU restricted to ground/1st floor",
          highlight: "strict",
          details: "Dual fire staircase mandatory for hospitals with over 15 inpatient beds.",
          statutoryReference: "National Building Code (NBC) 2016 Part 4",
        },
      },

      retail: {
        shop_est_registration: {
          value: "Instant Online Deemed Registration via e-Karmika portal",
          highlight: "better",
          details: "Zero inspection fee for retail establishments under 10 employees; valid for lifetime.",
          statutoryReference: "Karnataka Shops & Commercial Est Act 1961",
        },
        operating_hours_24x7: {
          value: "24/7 Operations permitted for retail with >= 10 staff",
          highlight: "better",
          details: "Subject to rotational shifts, overtime wages, and CCTV surveillance records.",
          statutoryReference: "Govt of Karnataka Gazette Notification No. LD 197",
        },
        signage_tax_language: {
          value: "Strict 60% Kannada on upper half of board; ₹10,000 fine for default",
          highlight: "strict",
          details: "BBMP marshals conduct compliance drives; notices issued to non-compliant shops.",
          statutoryReference: "BBMP Outdoor Signage Bylaws 2024",
        },
        parking_space_ratio: {
          value: "1 Car Space per 50 sq meters of retail carpet area",
          highlight: "neutral",
          details: "Basement/stilt parking cannot be converted to commercial storage.",
          statutoryReference: "BBMP Master Plan Parking Standards",
        },
        plastic_waste_rule: {
          value: "Total ban on SUP & non-woven bags; ₹5,000 spot penalty",
          highlight: "strict",
          details: "Commercial shops must provide paper/cotton bags; repeated breach leads to trade license freeze.",
          statutoryReference: "Plastic Waste Management Rules & BBMP Circular",
        },
      },
    },
  },

  BMC: {
    id: "BMC",
    cityName: "Mumbai",
    corporationName: "Brihanmumbai Municipal Corporation (BMC / MCGM)",
    state: "Maharashtra",
    stateCode: "MH",
    pincodePrefix: ["400"],
    portalUrl: "https://portal.mcgm.gov.in",
    singleWindowPortal: "https://maitri.mahaonline.gov.in",
    helpline: "1916 / 022-22620251",
    tradeLicenseSLA: "15–21 Business Days (via MCGM Citizen Portal Section 394)",
    tradeLicenseFee: "₹5,000 – ₹25,000 / year (Section 394 Schedule M tariff)",
    healthNOCRequirements: [
      "Health Officer Inspection report",
      "Grease trap drainage approval",
      "Food handler typhoid vaccination certificates",
    ],
    fireNOCThreshold: "Mandatory Mumbai Fire Brigade NOC for all commercial kitchens",
    propertyTaxDocument: "Property Card & Assessment Extract (PR Card)",
    waterSewerageBoard: "MCGM Hydraulic Engineering Department",
    signagePolicyFee: "MCGM License Department Shop Board Fee",

    domainRules: {
      startups: {
        single_window_clearance: {
          value: "7–14 Days via MAITRI Single Window Portal",
          highlight: "neutral",
          details: "Maharashtra Industry, Trade and Investment Facilitation Cell integrated gateway.",
          statutoryReference: "Maharashtra MAITRI Act 2016",
        },
        coworking_trade_license: {
          value: "Individual Section 394 license required per registered company",
          highlight: "strict",
          details: "MCGM requires each company registered at a shared space to file Schedule M declaration.",
          statutoryReference: "Mumbai Municipal Corporation Act Sec 394",
        },
        night_shift_permit: {
          value: "24/7 Operations allowed via Form L intimation to Labor Dept",
          highlight: "better",
          details: "Shops & Est Act 2017 allows 24-hr operations with woman safety cab protocols.",
          statutoryReference: "Maharashtra Shops & Est (RE&CS) Act 2017",
        },
        signboard_language_tax: {
          value: "Marathi Devanagari script font size MUST be >= English font",
          highlight: "strict",
          details: "Supreme Court upheld BMC rule: Marathi signboard name mandatory for all shops & offices.",
          statutoryReference: "Maharashtra Shops & Est Rules Sec 35",
        },
        seed_fund_subsidy: {
          value: "Up to ₹15 Lakh MSInS Grant + 80% Patent Rebate up to ₹2 Lakh",
          highlight: "neutral",
          details: "Maharashtra State Innovation Society funding vouchers for incubatees.",
          statutoryReference: "Maharashtra State Innovative Startup Policy",
        },
        property_tax_concession: {
          value: "Capital Value Based Property Tax System (Commercial Rate Index 2.0)",
          highlight: "warning",
          details: "Calculated on SDRR Ready Reckoner rates; premium rate for Island City & Suburbs.",
          statutoryReference: "MCGM Capital Value Tax Rules 2012",
        },
      },

      agriculture: {
        land_conversion_slu: {
          value: "60–90 Days Collector NA Sanction (Section 42 MLRC)",
          highlight: "warning",
          details: "Non-Agricultural (NA) permission from District Collector required with 50% conversion cess.",
          statutoryReference: "Maharashtra Land Revenue Code (MLRC) 1966 Sec 42",
        },
        apmc_mandi_cess: {
          value: "1.0% Mandi Cess (Fruits & Veggies de-notified from mandatory APMC)",
          highlight: "neutral",
          details: "Direct farm marketing license permitted under Maharashtra Agricultural Marketing Board.",
          statutoryReference: "Maharashtra APMC (Regulation) Act 1963",
        },
        groundwater_borewell_noc: {
          value: "GSDA Clearance mandatory in Over-Exploited Watersheds",
          highlight: "strict",
          details: "Groundwater Surveys and Development Agency approval required for deep borewells.",
          statutoryReference: "Maharashtra Groundwater (Development & Mgmt) Act",
        },
        agro_warehouse_license: {
          value: "Collector NA + Gram Panchayat / MMRDA warehousing permit",
          highlight: "neutral",
          details: "Special logistics & warehousing zones in Bhiwandi / Panvel belt.",
          statutoryReference: "Maharashtra Logistics Policy 2018",
        },
        solar_pumpset_subsidy: {
          value: "Mukhyamantri Saur Krushi Vahini: 90% Subsidy for SC/ST, 85% General",
          highlight: "better",
          details: "MSEDCL solar pumps up to 7.5 HP with automated IoT metering.",
          statutoryReference: "MSKVE Scheme MSEDCL Maharashtra",
        },
      },

      food: {
        health_trade_sla: {
          value: "15–21 Business Days via MCGM Citizen Portal (Medical Officer Health)",
          highlight: "warning",
          details: "Stringent physical inspection by MOH and building proposal clearance.",
          statutoryReference: "MMC Act 1888 Sec 394 Schedule M",
        },
        trade_license_fee: {
          value: "₹5,000 – ₹25,000 / year (Higher slab in South Mumbai A/B/C Wards)",
          highlight: "warning",
          details: "Significantly higher commercial trade tariff based on carpet area and AC tonnage.",
          statutoryReference: "MCGM Schedule of Trade Tariffs",
        },
        fire_noc_threshold: {
          value: "STRICT: Mandatory Mumbai Fire Brigade (MFB) NOC for ALL kitchens",
          highlight: "strict",
          details: "No area exemption. Even 100 sq ft cloud kitchen requires MFB compliance certificate.",
          statutoryReference: "Maharashtra Fire Prevention & Life Safety Act",
        },
        grease_trap_drainage: {
          value: "Hydraulic Dept inspection; Grease interceptor mandatory",
          highlight: "strict",
          details: "Direct discharge of oil/grease into Mumbai stormwater nullahs leads to immediate sealing.",
          statutoryReference: "MCGM Drainage & Sanitation Bylaws",
        },
        outdoor_terrace_dining: {
          value: "Rooftop dining allowed on non-combustible open terraces (₹50,000 fee)",
          highlight: "neutral",
          details: "Strictly prohibited during monsoon (June-Sept) unless retractable fire-rated canopy exists.",
          statutoryReference: "MCGM Rooftop Restaurant Policy",
        },
      },

      real_estate: {
        far_fsi_limits: {
          value: "Base FSI 1.33 (Island City) / 1.0 (Suburbs) + TDR + Premium FSI up to 3.0",
          highlight: "better",
          details: "DCPR 2034 allows fungible compensatory FSI of 35% residential / 20% commercial.",
          statutoryReference: "Development Control & Promotion Regulations (DCPR 2034)",
        },
        building_plan_sla: {
          value: "30–45 Days via MCGM AutoDCR (Building Proposal Dept)",
          highlight: "neutral",
          details: "Requires concessions from Municipal Commissioner for high-rises > 70 meters.",
          statutoryReference: "Ease of Doing Business Construction Permits MCGM",
        },
        rwh_mandatory_rule: {
          value: "Mandatory for all plots > 300 sq meters",
          highlight: "strict",
          details: "1% of total project cost held as security deposit until RWH commissioning.",
          statutoryReference: "DCPR 2034 Regulation 38(32)",
        },
        betterment_impact_fee: {
          value: "Development Charge + Fungible FSI Premium (50% of Ready Reckoner)",
          highlight: "warning",
          details: "High infrastructure cess and development charges for transit corridors.",
          statutoryReference: "MRTP Act 1966 Sec 124",
        },
        occupancy_cert_norm: {
          value: "Strict: CFO final NOC, Water connection, and Lift inspection mandatory",
          highlight: "strict",
          details: "Full OC / Part OC issued only after water meter test and sewage connection.",
          statutoryReference: "DCPR 2034 Clause 11",
        },
      },

      healthcare: {
        clinical_est_reg: {
          value: "Bombay Nursing Homes Registration within 45 Days",
          highlight: "neutral",
          details: "Executive Health Officer (EHO) inspection and police character certificate.",
          statutoryReference: "Bombay Nursing Homes Registration Act 1949",
        },
        biomedical_waste_noc: {
          value: "MPCB + BMC SMS Envoclean Barcoded Collection (Daily)",
          highlight: "neutral",
          details: "Color-coded barcoded bag scanning; annual BMW audit mandatory.",
          statutoryReference: "MPCB Bio-Medical Waste Authorization",
        },
        pharmacy_retail_license: {
          value: "30 Business Days via Maharashtra FDA (Food & Drug Admin)",
          highlight: "neutral",
          details: "Requires 10 sq meter space, 24/7 refrigerator, and registered D.Pharm/B.Pharm.",
          statutoryReference: "FDA Maharashtra Licensing System",
        },
        xray_radiation_noc: {
          value: "AERB e-LORA Certificate + BMC Public Health Dept Radiation Check",
          highlight: "strict",
          details: "Diagnostic X-ray/Cath lab requires BARC-approved shielding design.",
          statutoryReference: "AERB Safety Code for Medical Diagnostics",
        },
        fire_evacuation_stair: {
          value: "Dedicated Fire Stretcher Lift + 2.4m wide corridor in hospitals > 15m",
          highlight: "strict",
          details: "Mumbai Fire Brigade requires smoke extraction shafts and fire refuge floors.",
          statutoryReference: "Maharashtra Fire Act Hospital Guidelines",
        },
      },

      retail: {
        shop_est_registration: {
          value: "Instant Online Form F Registration via Aaple Sarkar Portal",
          highlight: "better",
          details: "Zero physical inspection for shops under 10 employees (Intimation Form G).",
          statutoryReference: "Maharashtra Shops & Est (RE&CS) Act 2017",
        },
        operating_hours_24x7: {
          value: "24/7 Opening permitted for all retail (except liquor/bars)",
          highlight: "better",
          details: "Shops can operate 24 hours 365 days provided overtime 2x wage is paid.",
          statutoryReference: "Govt of Maharashtra Notification No. MHA-2017",
        },
        signage_tax_language: {
          value: "STRICT: Marathi in Devanagari script font size >= any other language",
          highlight: "strict",
          details: "BMC prosecutes non-compliant shops in Metropolitan Magistrate Court.",
          statutoryReference: "Maharashtra Shops Act Sec 35(2)",
        },
        parking_space_ratio: {
          value: "1 Car Space per 40 sq meters carpet area in commercial zones",
          highlight: "strict",
          details: "Strict off-street parking enforcement; mechanical puzzle parking approved.",
          statutoryReference: "DCPR 2034 Table 21",
        },
        plastic_waste_rule: {
          value: "Zero-tolerance ban; ₹5,000 first offense, ₹10,000 second offense",
          highlight: "strict",
          details: "BMC Blue Squad conducts daily spot checks on retail markets & malls.",
          statutoryReference: "Maharashtra Plastic Ban Notification",
        },
      },
    },
  },

  MCD: {
    id: "MCD",
    cityName: "Delhi NCR",
    corporationName: "Municipal Corporation of Delhi (MCD)",
    state: "Delhi",
    stateCode: "DL",
    pincodePrefix: ["110"],
    portalUrl: "https://mcdonline.nic.in",
    singleWindowPortal: "https://mids.delhi.gov.in",
    helpline: "155305 / 011-23225000",
    tradeLicenseSLA: "5–10 Business Days (General Trade / Storage License)",
    tradeLicenseFee: "₹1,500 – ₹6,000 / year (Category B/C commercial)",
    healthNOCRequirements: [
      "Delhi Health Trade License inspection",
      "NOC from Delhi Pollution Control Committee (DPCC - Green/Orange)",
    ],
    fireNOCThreshold: "Delhi Fire Service (DFS) clearance required for floor area > 90 sq meters",
    propertyTaxDocument: "MCD Unique Property Identification Code (UPIC)",
    waterSewerageBoard: "Delhi Jal Board (DJB)",
    signagePolicyFee: "Delhi Outdoor Advertising Policy Registration",

    domainRules: {
      startups: {
        single_window_clearance: {
          value: "5–10 Days via Delhi Single Window MIDS Portal",
          highlight: "better",
          details: "Integrated clearance with DSIIDC, DPCC, and MCD licensing departments.",
          statutoryReference: "Delhi Startup Policy 2022",
        },
        coworking_trade_license: {
          value: "Virtual desk operations allowed under master commercial lease",
          highlight: "better",
          details: "Incubators & co-working spaces in commercial/mixed-use streets hold master UPIC.",
          statutoryReference: "Master Plan for Delhi (MPD 2021) Mixed Land Use",
        },
        night_shift_permit: {
          value: "24x7 Commercial Opening notified for 500+ categories",
          highlight: "better",
          details: "LG Delhi approved 24x7 operations with automated labor department intimation.",
          statutoryReference: "Delhi Shops & Establishments Act 1954",
        },
        signboard_language_tax: {
          value: "Bilingual English / Hindi nameplate; Commercial ad-tax on LED boards",
          highlight: "better",
          details: "Standard bilingual requirement; no aggressive language quota enforcement.",
          statutoryReference: "Delhi Outdoor Advertising Policy 2017",
        },
        seed_fund_subsidy: {
          value: "Collateral-free loans up to ₹50 Lakh + ₹20,000/mo Incubation Stipend",
          highlight: "better",
          details: "Delhi Government Startup Task Force financial assistance for student & tech founders.",
          statutoryReference: "Delhi Startup Policy Scheme Guidelines",
        },
        property_tax_concession: {
          value: "Unit Area Method (UAM) Category A to H Colony Slabs",
          highlight: "neutral",
          details: "Commercial properties charged 15% rate on base unit area value.",
          statutoryReference: "Delhi Municipal Corporation (Property Tax) Bylaws",
        },
      },

      agriculture: {
        land_conversion_slu: {
          value: "LDRA Land Pooling Policy (DDA / Master Plan 2041)",
          highlight: "neutral",
          details: "Low Density Residential & Agro-warehousing zones in urbanized rural villages.",
          statutoryReference: "DDA Land Pooling Policy / MPD 2041",
        },
        apmc_mandi_cess: {
          value: "1.0% APMC Azadpur / Ghazipur Market Fee + 1% Development Cess",
          highlight: "neutral",
          details: "Direct trading allowed for organic and hydroponic farmers via e-NAM.",
          statutoryReference: "Delhi Agricultural Produce Marketing (Regulation) Act",
        },
        groundwater_borewell_noc: {
          value: "STRICT BAN: DJB / District Magistrate clearance only for emergency",
          highlight: "strict",
          details: "Entire NCT of Delhi is notified as critical; tube-wells strictly regulated.",
          statutoryReference: "Delhi Water Resources (Regulation & Mgmt) Act",
        },
        agro_warehouse_license: {
          value: "MCD Rural Godown license on notified 60-ft wide village roads",
          highlight: "neutral",
          details: "Permitted in Alipur, Kanjhawala, and Najafgarh warehousing clusters.",
          statutoryReference: "MCD Warehouse Licensing Guidelines",
        },
        solar_pumpset_subsidy: {
          value: "PM-KUSUM Component B: 60% Total Subsidy (30% Centre + 30% Delhi)",
          highlight: "neutral",
          details: "Implemented by DTL / Energy Efficiency & Renewable Energy Management Centre.",
          statutoryReference: "Delhi Solar Energy Policy",
        },
      },

      food: {
        health_trade_sla: {
          value: "5–10 Business Days via SARAL MCD Portal",
          highlight: "better",
          details: "Instant deemed provisional license on self-certification for low-risk cafes.",
          statutoryReference: "MCD SARAL Health Trade Scheme",
        },
        trade_license_fee: {
          value: "₹1,500 – ₹6,000 / year (Based on colony category A/B/C/D)",
          highlight: "better",
          details: "One of the most competitive municipal trade license fees in metros.",
          statutoryReference: "MCD Unified Trade Tariff Schedule",
        },
        fire_noc_threshold: {
          value: "Delhi Fire Service (DFS) NOC required for area > 90 sq meters (approx 968 sq ft)",
          highlight: "better",
          details: "Outlets with carpet area below 90 sq meters do not require DFS clearance.",
          statutoryReference: "Delhi Fire Force Rules 2010",
        },
        grease_trap_drainage: {
          value: "Delhi Jal Board (DJB) grease separator clearance",
          highlight: "neutral",
          details: "Effluent treatment clearance from DPCC if discharge exceeds 10 KLD.",
          statutoryReference: "DPCC Water Pollution Consent to Operate",
        },
        outdoor_terrace_dining: {
          value: "Permitted on open terraces at ₹200 / sq ft annual fee",
          highlight: "better",
          details: "MCD approved policy for open terrace dining with DFS safety conditions.",
          statutoryReference: "MCD Open Space & Terrace Dining Policy 2022",
        },
      },

      real_estate: {
        far_fsi_limits: {
          value: "FAR 2.0 – 3.5 under MPD 2021 based on plot size and road width",
          highlight: "better",
          details: "Higher FAR on TOD (Transit Oriented Development) corridors along Metro lines.",
          statutoryReference: "Master Plan for Delhi (MPD 2021)",
        },
        building_plan_sla: {
          value: "15–30 Days via SARAL OBPS (Online Building Plan Sanction)",
          highlight: "better",
          details: "Residential plots up to 500 sq m receive instant sanction via registered architect.",
          statutoryReference: "MCD Unified Building Bye Laws 2016",
        },
        rwh_mandatory_rule: {
          value: "Mandatory for all plots >= 100 sq meters (approx 120 sq yards)",
          highlight: "strict",
          details: "MCD withholds completion certificate and DJB penalizes water bill without RWH.",
          statutoryReference: "Delhi Water Board Notification on RWH",
        },
        betterment_impact_fee: {
          value: "External Development Charges (EDC) + Mixed Use Conversion Charges",
          highlight: "neutral",
          details: "Annual mixed use charges payable for commercial activity on notified streets.",
          statutoryReference: "DMC Act Sec 357 Mixed Use Regulations",
        },
        occupancy_cert_norm: {
          value: "Completion-cum-Occupancy Certificate via SARAL portal in 15 days",
          highlight: "better",
          details: "Deemed OC granted if MCD building inspector fails to inspect within 15 days.",
          statutoryReference: "UBBL 2016 Clause 2.18",
        },
      },

      healthcare: {
        clinical_est_reg: {
          value: "30 Days via Delhi Directorate General of Health Services (DGHS)",
          highlight: "better",
          details: "Online registration under Delhi Nursing Homes Registration Act.",
          statutoryReference: "Delhi Nursing Homes Registration Act / DGHS",
        },
        biomedical_waste_noc: {
          value: "DPCC Barcoded Authorization + Biotic Waste / Synergy collection",
          highlight: "neutral",
          details: "Daily electronic tracking of biohazard waste manifests.",
          statutoryReference: "DPCC Bio-Medical Waste Authorization",
        },
        pharmacy_retail_license: {
          value: "15–20 Days via Delhi Drugs Control Department",
          highlight: "better",
          details: "Fast-track retail allopathic chemist license issuance.",
          statutoryReference: "Delhi State Drugs Control Licensing",
        },
        xray_radiation_noc: {
          value: "AERB e-LORA + Structural Stability Certification from MCD Engineer",
          highlight: "strict",
          details: "Lead glass observation window and TLD badge monitoring for technicians.",
          statutoryReference: "AERB Diagnostic Radiology Safety Directive",
        },
        fire_evacuation_stair: {
          value: "Two enclosed fire staircases for nursing homes above G+2 floors",
          highlight: "strict",
          details: "Fire sprinkler coverage and 100,000-liter underground water tank mandate.",
          statutoryReference: "Delhi Fire Service Guidelines for Hospitals",
        },
      },

      retail: {
        shop_est_registration: {
          value: "Instant Online Deemed Certificate via MCD / Delhi Labour Portal",
          highlight: "better",
          details: "100% paperless registration with instant downloadable certificate.",
          statutoryReference: "Delhi Shops and Establishments Act 1954",
        },
        operating_hours_24x7: {
          value: "24/7 Operations permitted for establishments on notified commercial streets",
          highlight: "better",
          details: "Notification by Lt. Governor covering supermarkets, pharmacies, and retail.",
          statutoryReference: "Delhi Govt 24x7 Commercial Notification",
        },
        signage_tax_language: {
          value: "Bilingual English & Hindi; Nameplate up to 5 sq ft is tax-free",
          highlight: "better",
          details: "Standard identity boards exempt from municipal advertisement license fees.",
          statutoryReference: "MCD Signage & Advertisement Policy",
        },
        parking_space_ratio: {
          value: "2 ECS (Equivalent Car Spaces) per 100 sq meters built-up area",
          highlight: "neutral",
          details: "Commercial complexes must provide surface or basement parking facilities.",
          statutoryReference: "UBBL 2016 Chapter 3 Parking Norms",
        },
        plastic_waste_rule: {
          value: "Ban on SUP < 120 microns; MCD seizing non-woven carry bags",
          highlight: "strict",
          details: "Heavy spot penalties on wholesale market traders for single-use plastic.",
          statutoryReference: "DPCC Plastic Waste Ban Notification",
        },
      },
    },
  },

  GCC: {
    id: "GCC",
    cityName: "Chennai",
    corporationName: "Greater Chennai Corporation (GCC)",
    state: "Tamil Nadu",
    stateCode: "TN",
    pincodePrefix: ["600"],
    portalUrl: "https://chennaicorporation.gov.in",
    singleWindowPortal: "https://tnswp.com",
    helpline: "1913 / 044-25384520",
    tradeLicenseSLA: "7–15 Business Days",
    tradeLicenseFee: "₹2,000 – ₹8,000 / year",
    healthNOCRequirements: [
      "GCC Health Officer sanitary certificate",
      "CMWSSB drainage connection clearance",
    ],
    fireNOCThreshold: "Tamil Nadu Fire & Rescue Services (TNFRS) NOC for > 1000 sq ft",
    propertyTaxDocument: "GCC Property Tax Assessment & New Khata",
    waterSewerageBoard: "Chennai Metro Water Supply and Sewage Board (CMWSSB)",
    signagePolicyFee: "GCC Nameboard Advertisement Tax",

    domainRules: {
      startups: {
        single_window_clearance: {
          value: "5–10 Days via Tamil Nadu Single Window Portal (TNSWP)",
          highlight: "better",
          details: "Guidance Tamil Nadu single-window portal with MSME facilitation desk.",
          statutoryReference: "Tamil Nadu Business Facilitation Act 2018",
        },
        coworking_trade_license: {
          value: "Unified IT Park License covers software startup occupants",
          highlight: "better",
          details: "ELCOT / SIPCOT tech park incubators hold centralized municipal trade clearance.",
          statutoryReference: "GCC Trade License Rules & ELCOT Policy",
        },
        night_shift_permit: {
          value: "24/7 Exemption for IT/ITES and Commercial under TN S&E Rules",
          highlight: "better",
          details: "Tamil Nadu allows 24/7 opening for all commercial establishments with 10+ employees.",
          statutoryReference: "Tamil Nadu Shops and Establishments Act 1947",
        },
        signboard_language_tax: {
          value: "Tamil script must occupy top 50% prominence on all boards",
          highlight: "strict",
          details: "Tamil Nadu government order mandates Tamil prominently displayed above English.",
          statutoryReference: "TN G.O. Ms. No. 25 Tamil Development Dept",
        },
        seed_fund_subsidy: {
          value: "TANSEED Grant up to ₹10 Lakh (StartupTN) + Payroll Subsidy",
          highlight: "better",
          details: "StartupTN seed fund with special tranches for green tech and women founders.",
          statutoryReference: "Tamil Nadu Startup and Innovation Policy",
        },
        property_tax_concession: {
          value: "GCC Annual Rental Value (ARV) Method (Zoned by Street Tier)",
          highlight: "neutral",
          details: "Commercial establishments pay 23%–25% of annual rental valuation.",
          statutoryReference: "Chennai City Municipal Corporation Act 1919",
        },
      },

      agriculture: {
        land_conversion_slu: {
          value: "45 Days via DTCP / Revenue Divisional Officer (RDO) NOC",
          highlight: "neutral",
          details: "Clearance from Directorate of Town and Country Planning for unapproved layouts.",
          statutoryReference: "Tamil Nadu Town and Country Planning Act Sec 47A",
        },
        apmc_mandi_cess: {
          value: "1.0% Regulated Market Committee Fee; Uzhavar Sandhai direct sales",
          highlight: "better",
          details: "Direct farmer-to-consumer markets (Uzhavar Sandhai) operate fee-free.",
          statutoryReference: "Tamil Nadu Agricultural Produce Marketing Act",
        },
        groundwater_borewell_noc: {
          value: "CMWSSB / Ground Water Dept NOC required within Chennai Metro area",
          highlight: "strict",
          details: "Extraction of groundwater for commercial transport is prohibited without permit.",
          statutoryReference: "Chennai Metropolitan Area Groundwater Act",
        },
        agro_warehouse_license: {
          value: "DTCP Agro-Logistics permission in peri-urban Chengalpattu / Tiruvallur",
          highlight: "better",
          details: "Concessional development charges for food grain & horticulture cold storages.",
          statutoryReference: "Tamil Nadu Agro-Industrial Policy",
        },
        solar_pumpset_subsidy: {
          value: "TEDA Solar Agri Pump: 70% Subsidy (30% MNRE + 40% TEDA)",
          highlight: "better",
          details: "Tamil Nadu Energy Development Agency standalone solar pump installation.",
          statutoryReference: "PM-KUSUM Component B TEDA Tamil Nadu",
        },
      },

      food: {
        health_trade_sla: {
          value: "7–15 Business Days via GCC Online Portal",
          highlight: "neutral",
          details: "Sanitary Inspector visit and CMWSSB drainage connectivity verification.",
          statutoryReference: "CCMC Act 1919 Health Licensing",
        },
        trade_license_fee: {
          value: "₹2,000 – ₹8,000 / year (Based on trade category and seating)",
          highlight: "better",
          details: "Economical commercial food license fee schedule.",
          statutoryReference: "GCC Revenue Department License Fee Schedule",
        },
        fire_noc_threshold: {
          value: "TNFRS NOC mandatory for floor area > 1000 sq ft or multistoried building",
          highlight: "better",
          details: "Small cloud kitchens below 1000 sq ft exempt from full fire department NOC.",
          statutoryReference: "Tamil Nadu Fire Service Act 1985",
        },
        grease_trap_drainage: {
          value: "CMWSSB Oil & Grease Interceptor mandatory before sewer link",
          highlight: "strict",
          details: "Commercial food waste discharge without grease trap attracts sewer line disconnect.",
          statutoryReference: "CMWSSB Industrial & Commercial Effluent Rules",
        },
        outdoor_terrace_dining: {
          value: "Allowed within private premises setback; Special license for terrace",
          highlight: "neutral",
          details: "Requires structural stability certificate from chartered engineer.",
          statutoryReference: "GCC Urban Planning Open Dining Directives",
        },
      },

      real_estate: {
        far_fsi_limits: {
          value: "Base FSI 1.5 – 2.0 + Premium FSI up to 0.5 under TNCDBR 2019",
          highlight: "neutral",
          details: "Road width > 18m allows 2.0 FSI; Multi-storeyed buildings up to 3.25 FSI.",
          statutoryReference: "Tamil Nadu Combined Development & Building Rules (TNCDBR)",
        },
        building_plan_sla: {
          value: "30 Days via CMDA / GCC Single Window Portal",
          highlight: "better",
          details: "Automated drawing validation with GIS zoning integration.",
          statutoryReference: "CMDA Single Window Clearance System",
        },
        rwh_mandatory_rule: {
          value: "STRICT: Mandatory for ALL buildings regardless of size",
          highlight: "strict",
          details: "Chennai was the pioneer of mandatory RWH; no building sanctioned without RWH design.",
          statutoryReference: "Tamil Nadu Municipal Laws (Amendment) Act 2003",
        },
        betterment_impact_fee: {
          value: "Infrastructure and Amenities (I&A) Charges @ ₹375/sq meter",
          highlight: "neutral",
          details: "Collected by CMDA/GCC for major commercial developments.",
          statutoryReference: "TNCDBR Rule 46 I&A Charges",
        },
        occupancy_cert_norm: {
          value: "Completion Certificate mandatory for all developments > 3 dwellings / 750 sq m",
          highlight: "strict",
          details: "TANGEDCO electricity and CMWSSB water connections linked to CC.",
          statutoryReference: "TNCDBR Rule 20 Completion Certificate",
        },
      },

      healthcare: {
        clinical_est_reg: {
          value: "30 Days via Tamil Nadu Clinical Establishments Portal",
          highlight: "better",
          details: "Registration with Directorate of Medical and Rural Health Services (DMS).",
          statutoryReference: "Tamil Nadu Clinical Establishments (Regulation) Act",
        },
        biomedical_waste_noc: {
          value: "TNPCB Authorization + GJ Multiclave / Medicare Enviro Collection",
          highlight: "neutral",
          details: "Daily GPS barcoded bio-medical waste segregation.",
          statutoryReference: "TNPCB Bio-Medical Waste Management Rules",
        },
        pharmacy_retail_license: {
          value: "20 Business Days via TN Drugs Control Department",
          highlight: "better",
          details: "Online application with drug inspector premise inspection.",
          statutoryReference: "Drugs and Cosmetics Rules 1945 Tamil Nadu",
        },
        xray_radiation_noc: {
          value: "AERB e-LORA Certificate + GCC Public Health Department NOC",
          highlight: "strict",
          details: "Mandatory lead aprons, thyroid shields, and quarterly TLD badge dosimeter checks.",
          statutoryReference: "AERB Radiation Safety Code",
        },
        fire_evacuation_stair: {
          value: "External fire escape ramp with 1:10 slope for hospitals > 2 floors",
          highlight: "strict",
          details: "TNFRS mandatory stretcher evacuation ramp requirement.",
          statutoryReference: "TNFRS Hospital Fire Safety Guidelines",
        },
      },

      retail: {
        shop_est_registration: {
          value: "Instant Registration via Tamil Nadu Labour Department Portal",
          highlight: "better",
          details: "Form C certificate generated online with digital signature.",
          statutoryReference: "Tamil Nadu Shops and Establishments Act 1947",
        },
        operating_hours_24x7: {
          value: "24/7 Opening permitted for shops with 10+ employees across TN",
          highlight: "better",
          details: "Government order permits 24/7 operation with women safety transport norms.",
          statutoryReference: "TN G.O. Ms. No. 60 Labour & Employment Dept",
        },
        signage_tax_language: {
          value: "Tamil in letters with prominent spacing (Min 50% board area)",
          highlight: "strict",
          details: "GCC officials issue warning notices for English-only nameplates.",
          statutoryReference: "Tamil Nadu Public Health Act Signboard By-laws",
        },
        parking_space_ratio: {
          value: "1 Car Space per 75 sq meters of commercial floor area",
          highlight: "better",
          details: "Two-wheeler parking mandate: 1 space per 25 sq meters.",
          statutoryReference: "TNCDBR Annexure IV Parking Standards",
        },
        plastic_waste_rule: {
          value: "Comprehensive SUP ban across Chennai; GCC confiscation drives",
          highlight: "strict",
          details: "Supermarkets and retail stores must provide cloth/jute bags (Meendum Manjappai).",
          statutoryReference: "TN Environment & Forest Dept Ban on 14 SUP Items",
        },
      },
    },
  },

  GHMC: {
    id: "GHMC",
    cityName: "Hyderabad",
    corporationName: "Greater Hyderabad Municipal Corporation (GHMC)",
    state: "Telangana",
    stateCode: "TS",
    pincodePrefix: ["500", "501", "502"],
    portalUrl: "https://ghmc.gov.in",
    singleWindowPortal: "https://ipass.telangana.gov.in",
    helpline: "040-21111111 / 100",
    tradeLicenseSLA: "3–7 Business Days (via TS-iPASS / GHMC Portal)",
    tradeLicenseFee: "₹1,500 – ₹7,500 / year",
    healthNOCRequirements: [
      "Health Officer sanitary certificate",
      "HMWSSB sewerage connection clearance",
    ],
    fireNOCThreshold: "Telangana Disaster Response & Fire Services NOC for > 500 sq meters",
    propertyTaxDocument: "GHMC PTIN (Property Tax Identification Number)",
    waterSewerageBoard: "Hyderabad Metropolitan Water Supply & Sewerage Board (HMWSSB)",
    signagePolicyFee: "GHMC Directorate of Enforcement, Vigilance & Disaster Management",

    domainRules: {
      startups: {
        single_window_clearance: {
          value: "Deemed Approval in 15 Days via TS-iPASS (T-Hub Fast-Track)",
          highlight: "better",
          details: "Telangana State Industrial Project Approval and Self-Certification System (TS-iPASS) guarantees right to timely clearance.",
          statutoryReference: "Telangana TS-iPASS Act 2014",
        },
        coworking_trade_license: {
          value: "Master TS-iPASS Registration covers T-Hub & HITEC City incubatees",
          highlight: "better",
          details: "Startups registered within recognized incubators enjoy blanket self-certification.",
          statutoryReference: "Telangana Innovation Policy 2021",
        },
        night_shift_permit: {
          value: "24/7 Operations permitted under IT/ITES blanket exemption",
          highlight: "better",
          details: "Telangana S&E Act Sec 13 blanket exemption for technology and call center firms.",
          statutoryReference: "Telangana Shops & Establishments Act 1988",
        },
        signboard_language_tax: {
          value: "Telugu / English bilingual allowed; EV&DM permits standard boards",
          highlight: "better",
          details: "No aggressive language quota policing; advertisement tax applies to LED hoardings.",
          statutoryReference: "GHMC Advertisement Guidelines 2020",
        },
        seed_fund_subsidy: {
          value: "T-Fund Seed Grant up to ₹25 Lakh + 50% Lease Rental Subsidy",
          highlight: "better",
          details: "T-Hub and Telangana Innovation Cell grant for early-stage deeptech startups.",
          statutoryReference: "T-Fund & Telangana ICT Policy",
        },
        property_tax_concession: {
          value: "GHMC Capital Valuation / Rental Slab (IT Corridor Concessions in Madhapur)",
          highlight: "better",
          details: "Special rebate for green-rated commercial IT buildings (IGBC/LEED).",
          statutoryReference: "GHMC Property Tax Rules 2018",
        },
      },

      agriculture: {
        land_conversion_slu: {
          value: "Instant NALA Conversion via Dharani Portal",
          highlight: "better",
          details: "Dharani integrated land portal offers instant online non-agricultural conversion (NALA) on fee payment.",
          statutoryReference: "Telangana Non-Agricultural Lands Assessment (NALA) Act",
        },
        apmc_mandi_cess: {
          value: "1.0% Market Fee; Rythu Bazar direct farmer marketing",
          highlight: "better",
          details: "Farmers sell vegetables and fruits directly to consumers with zero intermediary fee.",
          statutoryReference: "Telangana Agricultural Produce Marketing Rules",
        },
        groundwater_borewell_noc: {
          value: "WALTA Clearance via Revenue Department (Tahsildar)",
          highlight: "neutral",
          details: "Water, Land and Trees Act (WALTA) registration required for new borewells.",
          statutoryReference: "Telangana WALTA Act 2002",
        },
        agro_warehouse_license: {
          value: "TS-iPASS 7-Day clearance for warehousing along Outer Ring Road (ORR)",
          highlight: "better",
          details: "Logistics and cold storage hubs along ORR receive fast-track zoning approval.",
          statutoryReference: "Telangana Logistics Policy",
        },
        solar_pumpset_subsidy: {
          value: "TSREDCO Solar Agri Pump: 80% Subsidy (30% Centre + 50% State)",
          highlight: "better",
          details: "Telangana State Renewable Energy Development Corporation installations.",
          statutoryReference: "PM-KUSUM Component B TSREDCO",
        },
      },

      food: {
        health_trade_sla: {
          value: "3–7 Business Days via TS-iPASS Food Services Portal",
          highlight: "better",
          details: "One of India's fastest health trade license delivery mechanisms.",
          statutoryReference: "GHMC Trade License Citizen Charter",
        },
        trade_license_fee: {
          value: "₹1,500 – ₹7,500 / year (Fixed fee per sq ft matrix)",
          highlight: "better",
          details: "Transparent online tariff calculation without discretionary inspection fees.",
          statutoryReference: "GHMC Trade License Tariff Order",
        },
        fire_noc_threshold: {
          value: "Fire NOC mandatory for premises > 500 sq meters or height > 15m",
          highlight: "better",
          details: "Telangana State Disaster Response and Fire Services clearance via TS-iPASS.",
          statutoryReference: "Telangana Fire Service Act 1999",
        },
        grease_trap_drainage: {
          value: "HMWSSB Oil & Grease Trap clearance for commercial kitchens",
          highlight: "strict",
          details: "Commercial food kitchens must install mechanical skimmer/grease traps.",
          statutoryReference: "HMWSSB Sewerage By-laws",
        },
        outdoor_terrace_dining: {
          value: "Open-air and terrace dining permitted under GHMC Hospitality Policy",
          highlight: "better",
          details: "No exorbitant additional surcharge if structural stability certificate is submitted.",
          statutoryReference: "GHMC Hospitality Regulations",
        },
      },

      real_estate: {
        far_fsi_limits: {
          value: "UNLIMITED FSI (Free FSI with Impact Fee for high-rises)",
          highlight: "better",
          details: "Hyderabad has no maximum FAR cap; developers pay City Infrastructure Impact Fee based on road width.",
          statutoryReference: "Telangana Building Rules G.O. 168",
        },
        building_plan_sla: {
          value: "21 Days via TS-bPASS (Telangana State Building Permission Approval)",
          highlight: "better",
          details: "Plots up to 75 sq yards receive instant registration; up to 500 sq m self-certification.",
          statutoryReference: "TS-bPASS Act 2020",
        },
        rwh_mandatory_rule: {
          value: "Mandatory for all plots >= 300 sq meters",
          highlight: "strict",
          details: "Rainwater harvesting injection wells mandatory before GHMC final clearance.",
          statutoryReference: "WALTA Act Section 23",
        },
        betterment_impact_fee: {
          value: "City Infrastructure Impact Fee @ ₹250–₹500 / sq ft above 15m height",
          highlight: "neutral",
          details: "Collected by GHMC / HMDA for widening arterial roads and flyovers.",
          statutoryReference: "Telangana G.O. Ms. No. 168",
        },
        occupancy_cert_norm: {
          value: "TS-bPASS online OC issuance within 15 days of joint inspection",
          highlight: "better",
          details: "HMWSSB and TSSPDCL connections released automatically post-OC.",
          statutoryReference: "TS-bPASS Procedural Guidelines",
        },
      },

      healthcare: {
        clinical_est_reg: {
          value: "21 Days via TS-iPASS Medical Establishment Clearance",
          highlight: "better",
          details: "District Medical and Health Officer (DM&HO) digital certification.",
          statutoryReference: "Telangana Allopathic Private Medical Care Act",
        },
        biomedical_waste_noc: {
          value: "TGPCB Authorization + GJ Multiclave Barcoded Manifest",
          highlight: "neutral",
          details: "Daily GPS collection with real-time pollution board data sync.",
          statutoryReference: "TGPCB Bio-Medical Waste Guidelines",
        },
        pharmacy_retail_license: {
          value: "14 Business Days via Telangana Drugs Control Administration",
          highlight: "better",
          details: "Fully digital processing on DCA Telangana portal.",
          statutoryReference: "Drugs and Cosmetics Act Telangana DCA",
        },
        xray_radiation_noc: {
          value: "AERB e-LORA + Structural Radiation Shielding Certificate",
          highlight: "strict",
          details: "Mandatory lead lining and AERB approved equipment layout plan.",
          statutoryReference: "AERB Radiation Safety Code",
        },
        fire_evacuation_stair: {
          value: "External fire stair with 2.0m width + dedicated smoke lobby",
          highlight: "strict",
          details: "Telangana Fire Services requires pressurized staircases in high-rise hospitals.",
          statutoryReference: "Telangana Fire Safety in Healthcare Guidelines",
        },
      },

      retail: {
        shop_est_registration: {
          value: "Instant Registration via TS-iPASS / Labour Department Portal",
          highlight: "better",
          details: "Self-certification without prior inspector physical visit.",
          statutoryReference: "Telangana Shops & Commercial Establishments Act",
        },
        operating_hours_24x7: {
          value: "24/7 Operations permitted across GHMC for all retail shops",
          highlight: "better",
          details: "Annual nominal fee of ₹10,000 for 24/7 commercial opening.",
          statutoryReference: "Govt of Telangana G.O. Ms. No. 4",
        },
        signage_tax_language: {
          value: "Telugu / Urdu / English trilingual encouraged; No punitive language fines",
          highlight: "better",
          details: "GHMC permits business logos and standard branding on storefronts.",
          statutoryReference: "GHMC Signage Guidelines",
        },
        parking_space_ratio: {
          value: "30% of total built-up area dedicated to parking in commercial complexes",
          highlight: "better",
          details: "Multi-level mechanical parking permitted with nil property tax on parking floors.",
          statutoryReference: "Telangana Building Rules G.O. 168",
        },
        plastic_waste_rule: {
          value: "Strict ban on SUP < 120 microns; EV&DM spot fine ₹2,500 – ₹10,000",
          highlight: "strict",
          details: "Enforcement Vigilance & Disaster Management wing conducts random mall checks.",
          statutoryReference: "GHMC Solid Waste Management By-laws",
        },
      },
    },
  },

  PMC: {
    id: "PMC",
    cityName: "Pune",
    corporationName: "Pune Municipal Corporation (PMC)",
    state: "Maharashtra",
    stateCode: "MH",
    pincodePrefix: ["411", "412", "413"],
    portalUrl: "https://pmc.gov.in",
    singleWindowPortal: "https://maitri.mahaonline.gov.in",
    helpline: "1800-1030-222 / 020-25501000",
    tradeLicenseSLA: "7–14 Business Days via PMC Parvana Dept",
    tradeLicenseFee: "₹1,800 – ₹8,500 / year (Based on trade area & power)",
    healthNOCRequirements: [
      "Health Officer sanitary certificate",
      "Potable water test by PMC water lab",
      "Waste segregation undertaking",
    ],
    fireNOCThreshold: "Mandatory for commercial kitchens > 500 sq ft or height > 15m",
    propertyTaxDocument: "PMC Property Tax Assessment No. & No-Dues Certificate",
    waterSewerageBoard: "PMC Water Supply & Drainage Department",
    domainRules: {
      startups: {
        single_window_clearance: {
          value: "5–7 Days via MAITRI Single Window Portal",
          highlight: "better",
          details: "Maharashtra State Innovation Society (MSInS) startup grant integration.",
          statutoryReference: "Maharashtra State Startup Policy",
        },
      },
      agriculture: {
        apmc_mandi_cess: {
          value: "1.05% APMC cess in Gultekdi Market Yard; Direct farmer-processor sales permitted",
          highlight: "neutral",
          details: "Maharashtra APMC Amendment allows electronic trading platforms.",
          statutoryReference: "Maharashtra APMC Regulation Act",
        },
      },
      food: {
        health_trade_sla: {
          value: "10 Business Days via PMC Online Citizen Portal",
          highlight: "neutral",
          details: "Requires sanitary inspection and FSSAI basic/state registration.",
          statutoryReference: "Maharashtra Municipal Corporations Act Sec 376",
        },
      },
      real_estate: {
        building_plan_sla: {
          value: "30 Days via AutoDCR PMC Building Permission Department",
          highlight: "better",
          details: "Sanctioned under Unified Development Control and Promotion Regulations (UDCPR).",
          statutoryReference: "Maharashtra UDCPR 2020",
        },
      },
      healthcare: {
        clinical_est_reg: {
          value: "Bombay Nursing Home Registration via PMC Health Dept",
          highlight: "neutral",
          details: "Bio-medical waste disposal tie-up with Passco Environmental Solutions.",
          statutoryReference: "Bombay Nursing Homes Act 1949",
        },
      },
      retail: {
        operating_hours_24x7: {
          value: "24/7 Operations permitted under Maharashtra Shops Act (Aaple Sarkar)",
          highlight: "better",
          details: "Online instant registration for establishments with < 10 employees.",
          statutoryReference: "Maharashtra S&E (Regulation of Employment) Act 2017",
        },
      },
    },
  },

  KMC: {
    id: "KMC",
    cityName: "Kolkata",
    corporationName: "Kolkata Municipal Corporation (KMC)",
    state: "West Bengal",
    stateCode: "WB",
    pincodePrefix: ["700", "701", "711", "712"],
    portalUrl: "https://www.kmcgov.in",
    singleWindowPortal: "https://silpasathi.wb.gov.in",
    helpline: "1800-345-3375 / 033-22861000",
    tradeLicenseSLA: "Instant Auto-Renewal & 3–7 Days New via Silpa Sathi Portal",
    tradeLicenseFee: "₹750 – ₹5,000 / year (Certificate of Enlistment CE)",
    healthNOCRequirements: [
      "KMC Health Department sanitary NOC",
      "Food handlers fitness card",
      "KMC Potable water supply test",
    ],
    fireNOCThreshold: "Mandatory for commercial kitchens > 500 sq ft (WB Fire & Emergency Services)",
    propertyTaxDocument: "Assessee Number & Paid Tax Receipt",
    waterSewerageBoard: "KMC Water Supply & Sewerage Department",
    domainRules: {
      startups: {
        single_window_clearance: {
          value: "3–7 Days via Silpa Sathi Single Window System",
          highlight: "better",
          details: "Bengal Silicon Valley & Webel incubators receive priority trade enlistment.",
          statutoryReference: "West Bengal Startup Policy",
        },
      },
      agriculture: {
        apmc_mandi_cess: {
          value: "0.5% Regulated Market Committee cess in West Bengal",
          highlight: "better",
          details: "Exemptions for cold-chain operators and farmer producer groups.",
          statutoryReference: "WB Agricultural Produce Marketing Act",
        },
      },
      food: {
        health_trade_sla: {
          value: "5–7 Days via KMC License Department",
          highlight: "better",
          details: "Instant Certificate of Enlistment (CE) issued for food vendors upon payment.",
          statutoryReference: "KMC Act 1980 Sec 199",
        },
      },
      real_estate: {
        building_plan_sla: {
          value: "30–60 Days via KMC Building Department Online Portal",
          highlight: "neutral",
          details: "Heritage Committee clearance mandatory for buildings in historic zones.",
          statutoryReference: "KMC Building Rules 2009",
        },
      },
      healthcare: {
        clinical_est_reg: {
          value: "West Bengal Clinical Establishments Regulatory Commission (WBCERC)",
          highlight: "neutral",
          details: "Strict pricing transparency and WBPCB bio-medical authorization.",
          statutoryReference: "West Bengal Clinical Establishments Act 2017",
        },
      },
      retail: {
        operating_hours_24x7: {
          value: "Retail operations permitted up to midnight; 24/7 permitted in IT SEZs",
          highlight: "neutral",
          details: "Special overtime permit required for late-night commercial operations.",
          statutoryReference: "West Bengal Shops and Establishments Act 1963",
        },
      },
    },
  },

  AMC: {
    id: "AMC",
    cityName: "Ahmedabad",
    corporationName: "Ahmedabad Municipal Corporation (AMC)",
    state: "Gujarat",
    stateCode: "GJ",
    pincodePrefix: ["380", "382", "384"],
    portalUrl: "https://ahmedabadcity.gov.in",
    singleWindowPortal: "https://ifp.gujarat.gov.in",
    helpline: "155303 / 079-25391811",
    tradeLicenseSLA: "3–7 Business Days via Investor Facilitation Portal (IFP Gujarat)",
    tradeLicenseFee: "₹1,200 – ₹6,000 / year (Gumastadhara / AMC Trade License)",
    healthNOCRequirements: [
      "AMC Health Officer sanitation report",
      "AMC Potable water test report",
      "Solid waste collection agreement",
    ],
    fireNOCThreshold: "Mandatory for commercial kitchens > 500 sq ft or height > 15m (Gujarat Fire Prevention Act)",
    propertyTaxDocument: "AMC Tenement Number & Property Tax Assessment Bill",
    waterSewerageBoard: "AMC Water & Drainage Project Department",
    domainRules: {
      startups: {
        single_window_clearance: {
          value: "3 Days via IFP Gujarat / iHub Startup Assistance Portal",
          highlight: "better",
          details: "Fast-track deemed clearance and seed assistance under Gujarat Industrial Policy.",
          statutoryReference: "Gujarat Startup and Innovation Policy (GSIP 2.0)",
        },
      },
      agriculture: {
        apmc_mandi_cess: {
          value: "0.5% – 1.0% User Fee in APMC Ahmedabad (Jamalpur / Vasna yards)",
          highlight: "better",
          details: "e-NAM and private sub-market yards permitted with minimal licensing.",
          statutoryReference: "Gujarat Agricultural Produce Markets Act",
        },
      },
      food: {
        health_trade_sla: {
          value: "5 Business Days via AMC Citizen Center (Civic Center Online)",
          highlight: "better",
          details: "FSSAI state license sync and instant verification.",
          statutoryReference: "BPMC Act (Gujarat Municipalities Act)",
        },
      },
      real_estate: {
        building_plan_sla: {
          value: "21 Days via AMC e-Nagar / ODPS (Online Development Permission System)",
          highlight: "better",
          details: "Automated scrutiny under Comprehensive General Development Control Regulations (CGDCR).",
          statutoryReference: "Gujarat CGDCR 2017",
        },
      },
      healthcare: {
        clinical_est_reg: {
          value: "Gujarat Clinical Establishments Registration via District Health Office",
          highlight: "better",
          details: "GPCB bio-medical authorization integration.",
          statutoryReference: "Gujarat Clinical Establishments Act",
        },
      },
      retail: {
        operating_hours_24x7: {
          value: "24/7 Operations permitted across Ahmedabad under Gujarat Shops Act 2019",
          highlight: "better",
          details: "Zero restriction on operating hours for shops, commercial establishments, and restaurants.",
          statutoryReference: "Gujarat Shops and Establishments Act 2019",
        },
      },
    },
  },

  BBSR: {
    id: "BBSR",
    cityName: "Bhubaneswar",
    corporationName: "Bhubaneswar Municipal Corporation (BMC)",
    state: "Odisha",
    stateCode: "OD",
    pincodePrefix: ["751", "752", "753"],
    portalUrl: "https://bmc.gov.in",
    singleWindowPortal: "https://investodisha.gov.in",
    helpline: "1800-345-0061 / 0674-2431403",
    tradeLicenseSLA: "7 Business Days via GO-SWIFT (Government of Odisha Single Window)",
    tradeLicenseFee: "₹1,000 – ₹5,000 / year",
    healthNOCRequirements: ["BMC City Health Officer inspection", "WATCO water connection test"],
    fireNOCThreshold: "Mandatory for commercial kitchens > 500 sq ft (Odisha Fire Service)",
    propertyTaxDocument: "BMC Holding Tax Assessment Number",
    waterSewerageBoard: "Water Corporation of Odisha (WATCO)",
    domainRules: {
      startups: {
        single_window_clearance: {
          value: "3–5 Days via Startup Odisha Portal (O-Hub)",
          highlight: "better",
          details: "Monthly allowance and product development subsidy under Odisha Startup Policy.",
          statutoryReference: "Odisha Startup Policy 2016/2022",
        },
      },
      agriculture: {
        apmc_mandi_cess: {
          value: "1.0% Regulated Market Committee (RMC) fee across Odisha",
          highlight: "neutral",
          details: "Direct purchase center licenses available for agri-enterprises.",
          statutoryReference: "Odisha APM Act",
        },
      },
      food: {
        health_trade_sla: {
          value: "7 Business Days via BMC Bhubaneswar.me Smart Portal",
          highlight: "better",
          details: "Integrated trade license and food safety registration.",
          statutoryReference: "Odisha Municipal Corporation Act 2003",
        },
      },
      real_estate: {
        building_plan_sla: {
          value: "30 Days via BDA / BMC Common Application Form (e-BIKASH)",
          highlight: "better",
          details: "Bhubaneswar Development Authority (BDA) automated building approval.",
          statutoryReference: "Odisha Development Authorities Rules",
        },
      },
      healthcare: {
        clinical_est_reg: {
          value: "Odisha Clinical Establishments Registration Directorate of Medical Education",
          highlight: "neutral",
          details: "State Pollution Control Board (OSPCB) bio-medical manifest compliance.",
          statutoryReference: "Odisha Clinical Establishments Act",
        },
      },
      retail: {
        operating_hours_24x7: {
          value: "Shops permitted to operate up to 11:00 PM; 24/7 allowed in InfoCity SEZ",
          highlight: "neutral",
          details: "Self-certification on Odisha Labour Portal (e-Shramik).",
          statutoryReference: "Odisha Shops and Commercial Establishments Act",
        },
      },
    },
  },

  JMC: {
    id: "JMC",
    cityName: "Jaipur",
    corporationName: "Jaipur Municipal Corporation (JMC Greater / Heritage)",
    state: "Rajasthan",
    stateCode: "RJ",
    pincodePrefix: ["302", "303"],
    portalUrl: "https://jaipurmc.org",
    singleWindowPortal: "https://swcs.rajasthan.gov.in",
    helpline: "0141-2742900 / 181",
    tradeLicenseSLA: "7–14 Business Days via RajNivesh Single Window",
    tradeLicenseFee: "₹1,200 – ₹6,000 / year",
    healthNOCRequirements: ["JMC Swasthya Adhikari certificate", "PHED potable water certificate"],
    fireNOCThreshold: "Mandatory for commercial kitchens > 500 sq ft or multistory hotels",
    propertyTaxDocument: "JMC Urban Development (UD) Tax Assessment Receipt",
    waterSewerageBoard: "Public Health Engineering Department (PHED Rajasthan)",
    domainRules: {
      startups: {
        single_window_clearance: {
          value: "3–5 Days via iStart Rajasthan / RajNivesh Portal",
          highlight: "better",
          details: "Incubation at Bhamashah Techno Hub with zero-cost municipal trade fee in Year 1.",
          statutoryReference: "Rajasthan Startup Policy 2022",
        },
      },
      agriculture: {
        apmc_mandi_cess: {
          value: "1.60% Mandi Tax + 0.5% Krishak Kalyan Fee in Muhana Mandi",
          highlight: "strict",
          details: "Krishak Kalyan Cess applicable on wholesale transactions.",
          statutoryReference: "Rajasthan Agricultural Produce Markets Act",
        },
      },
      food: {
        health_trade_sla: {
          value: "7 Business Days via JMC Portal",
          highlight: "neutral",
          details: "Zonal commissioner inspection for Heritage zone properties.",
          statutoryReference: "Rajasthan Municipalities Act 2009",
        },
      },
      real_estate: {
        building_plan_sla: {
          value: "30 Days via JDA / JMC Online Building Plan Approval System",
          highlight: "better",
          details: "Jaipur Development Authority (JDA) master plan compliance.",
          statutoryReference: "Rajasthan Unified Building Bye-laws 2017",
        },
      },
      healthcare: {
        clinical_est_reg: {
          value: "Rajasthan Clinical Establishments Act Registration via CMHO Jaipur",
          highlight: "neutral",
          details: "RSPCB pollution clearance mandatory.",
          statutoryReference: "Rajasthan Clinical Establishments Act",
        },
      },
      retail: {
        operating_hours_24x7: {
          value: "24/7 Operations allowed for retail shops with online intimation",
          highlight: "better",
          details: "Rajasthan Shops Act amendment allows flexible shift hours.",
          statutoryReference: "Rajasthan Shops & Commercial Establishments Act",
        },
      },
    },
  },

  LMC: {
    id: "LMC",
    cityName: "Lucknow",
    corporationName: "Lucknow Municipal Corporation (LMC / Nagar Nigam)",
    state: "Uttar Pradesh",
    stateCode: "UP",
    pincodePrefix: ["226", "227"],
    portalUrl: "https://lmc.up.nic.in",
    singleWindowPortal: "https://niveshmitra.up.nic.in",
    helpline: "1533 / 0522-2288858",
    tradeLicenseSLA: "7–15 Business Days via Nivesh Mitra Single Window",
    tradeLicenseFee: "₹1,000 – ₹7,500 / year",
    healthNOCRequirements: ["Nagar Nigam Health Inspector clearance", "Jal Sansthan water test"],
    fireNOCThreshold: "Mandatory for commercial kitchens > 500 sq ft (UP Fire Service)",
    propertyTaxDocument: "LMC House Tax / Property Identification Number",
    waterSewerageBoard: "Lucknow Jal Sansthan",
    domainRules: {
      startups: {
        single_window_clearance: {
          value: "5–7 Days via Nivesh Mitra / StartInUP Portal",
          highlight: "better",
          details: "Capital grant and patent reimbursement under UP Startup Policy.",
          statutoryReference: "Uttar Pradesh Startup Policy 2020",
        },
      },
      agriculture: {
        apmc_mandi_cess: {
          value: "1.5% Mandi Shulk + 0.5% Vikas Shulk across UP Mandi Samitis",
          highlight: "strict",
          details: "UP Krishi Utpadan Mandi Samiti regulation.",
          statutoryReference: "UP Krishi Utpadan Mandi Adhiniyam 1964",
        },
      },
      food: {
        health_trade_sla: {
          value: "10 Business Days via Nivesh Mitra",
          highlight: "neutral",
          details: "Food business license integrated with Nagar Swasthya Adhikari clearance.",
          statutoryReference: "UP Municipal Corporation Act 1959",
        },
      },
      real_estate: {
        building_plan_sla: {
          value: "30 Days via LDA / LMC Online Building Permission (OBPS UP)",
          highlight: "better",
          details: "Lucknow Development Authority (LDA) master plan adherence.",
          statutoryReference: "UP Urban Planning and Development Act 1973",
        },
      },
      healthcare: {
        clinical_est_reg: {
          value: "UP Clinical Establishments Registration via CMO Lucknow",
          highlight: "neutral",
          details: "UPPCB bio-medical authorization mandatory.",
          statutoryReference: "UP Clinical Establishments (Registration) Rules",
        },
      },
      retail: {
        operating_hours_24x7: {
          value: "Retail operations permitted up to 11:00 PM; 24/7 allowed with special permit",
          highlight: "neutral",
          details: "Online registration on UP Dukan Evam Vanijya Adhisthan portal.",
          statutoryReference: "UP Dookan Aur Vanijya Adhishthan Adhiniyam 1962",
        },
      },
    },
  },

  GMC: {
    id: "GMC",
    cityName: "Guwahati",
    corporationName: "Guwahati Municipal Corporation (GMC)",
    state: "Assam",
    stateCode: "AS",
    pincodePrefix: ["781"],
    portalUrl: "https://gmc.assam.gov.in",
    singleWindowPortal: "https://eodb.assam.gov.in",
    helpline: "0361-2540525 / 7399003001",
    tradeLicenseSLA: "7–10 Business Days via EoDB Assam (Sewa Setu)",
    tradeLicenseFee: "₹1,000 – ₹5,000 / year",
    healthNOCRequirements: ["GMC Health Officer sanitary report", "Guwahati Jal Board water report"],
    fireNOCThreshold: "Mandatory for commercial kitchens > 500 sq ft (State Fire Service Organisation)",
    propertyTaxDocument: "GMC Holding Assessment Number & Tax Receipt",
    waterSewerageBoard: "Guwahati Jal Board (JICA Project)",
    domainRules: {
      startups: {
        single_window_clearance: {
          value: "5–7 Days via Startup Assam (The Nest) / EoDB Portal",
          highlight: "better",
          details: "Fiscal incentives and incubation under Assam Startup Policy.",
          statutoryReference: "Assam Startup Policy",
        },
      },
      agriculture: {
        apmc_mandi_cess: {
          value: "1.0% Assam State Agricultural Marketing Board (ASAMB) cess",
          highlight: "neutral",
          details: "Pamohi wholesale market yard transactions.",
          statutoryReference: "Assam Agricultural Produce Market Act",
        },
      },
      food: {
        health_trade_sla: {
          value: "7 Business Days via GMC Sewa Setu Online",
          highlight: "better",
          details: "Instant trade license generation upon document upload.",
          statutoryReference: "GMC Act 1969",
        },
      },
      real_estate: {
        building_plan_sla: {
          value: "30–45 Days via GMDA / GMC Online Building Permission",
          highlight: "neutral",
          details: "Guwahati Metropolitan Development Authority (GMDA) master plan scrutiny.",
          statutoryReference: "Guwahati Building Construction Byelaws 2014",
        },
      },
      healthcare: {
        clinical_est_reg: {
          value: "Assam Clinical Establishments Registration via Joint Director of Health Services",
          highlight: "neutral",
          details: "PCBA bio-medical waste authorization.",
          statutoryReference: "Assam Clinical Establishments Act",
        },
      },
      retail: {
        operating_hours_24x7: {
          value: "Shops permitted up to 10:00 PM; Special festival exemptions apply",
          highlight: "neutral",
          details: "Registration on Assam Labour Welfare Portal.",
          statutoryReference: "Assam Shops and Establishments Act 1971",
        },
      },
    },
  },

  MCC: {
    id: "MCC",
    cityName: "Chandigarh",
    corporationName: "Municipal Corporation Chandigarh (MCC)",
    state: "Chandigarh (UT)",
    stateCode: "CH",
    pincodePrefix: ["160"],
    portalUrl: "https://mcchandigarh.gov.in",
    singleWindowPortal: "https://chdswcs.gov.in",
    helpline: "0172-2787200 / 1800-180-2172",
    tradeLicenseSLA: "5–7 Business Days via MCC e-Services",
    tradeLicenseFee: "₹1,500 – ₹7,000 / year",
    healthNOCRequirements: ["MCC Medical Officer of Health (MOH) clearance", "Water quality report"],
    fireNOCThreshold: "Mandatory for commercial kitchens > 500 sq ft or commercial SCO units",
    propertyTaxDocument: "Commercial Property Tax Assessment Number",
    waterSewerageBoard: "MCC Public Health Engineering Division",
    domainRules: {
      startups: {
        single_window_clearance: {
          value: "3–5 Days via Chandigarh Single Window System",
          highlight: "better",
          details: "SPIC & Chandigarh IT Park incubation concessions.",
          statutoryReference: "Chandigarh Startup Policy",
        },
      },
      food: {
        health_trade_sla: {
          value: "5 Business Days via MCC Citizen Portal",
          highlight: "better",
          details: "Strict hygiene enforcement by MOH Chandigarh.",
          statutoryReference: "Punjab Municipal Corporation Act (Extended to Chandigarh)",
        },
      },
      real_estate: {
        building_plan_sla: {
          value: "21 Days via Chandigarh Estate Office / Architecture Dept",
          highlight: "strict",
          details: "Strict Corbusian architectural heritage bye-laws and facade controls.",
          statutoryReference: "Chandigarh Master Plan 2031 & Building Rules",
        },
      },
      retail: {
        operating_hours_24x7: {
          value: "24/7 Operations permitted in commercial shopping arcades (Sec 17, 35, 26)",
          highlight: "better",
          details: "Notification by UT Administrator for round-the-clock commercial operations.",
          statutoryReference: "Punjab Shops & Commercial Establishments Act",
        },
      },
    },
  },

  VMC: {
    id: "VMC",
    cityName: "Vijayawada",
    corporationName: "Vijayawada Municipal Corporation (VMC)",
    state: "Andhra Pradesh",
    stateCode: "AP",
    pincodePrefix: ["520", "521", "522"],
    portalUrl: "https://vmc.gov.in",
    singleWindowPortal: "https://singlewindow.ap.gov.in",
    helpline: "1800-425-4422 / 0866-2424172",
    tradeLicenseSLA: "7 Business Days via AP Single Desk Portal",
    tradeLicenseFee: "₹1,200 – ₹6,000 / year",
    healthNOCRequirements: ["VMC Health Officer inspection report", "Potable water certificate"],
    fireNOCThreshold: "Mandatory for commercial kitchens > 500 sq ft (AP State Disaster Response and Fire Services)",
    propertyTaxDocument: "VMC Property Assessment Number",
    waterSewerageBoard: "VMC Engineering (Water Supply & Drainage)",
    domainRules: {
      startups: {
        single_window_clearance: {
          value: "3–5 Days via AP Innovation Society Single Desk",
          highlight: "better",
          details: "Fast-track processing under AP Startup Policy.",
          statutoryReference: "Andhra Pradesh Startup Policy",
        },
      },
      food: {
        health_trade_sla: {
          value: "7 Business Days via VMC Citizen Portal",
          highlight: "better",
          details: "FSSAI compliance check integrated with municipal D&O license.",
          statutoryReference: "AP Municipal Corporations Act 1994",
        },
      },
      real_estate: {
        building_plan_sla: {
          value: "21 Days via AP-DPMS (Development Permission Management System)",
          highlight: "better",
          details: "Automated scrutiny by APCRDA / VMC.",
          statutoryReference: "AP Building Rules G.O. 119",
        },
      },
      retail: {
        operating_hours_24x7: {
          value: "24/7 Operations permitted across Andhra Pradesh for all retail shops",
          highlight: "better",
          details: "G.O. Ms. No. 12 permits round-the-clock operations with safety protocols.",
          statutoryReference: "AP Shops & Establishments Act",
        },
      },
    },
  },

  SMC: {
    id: "SMC",
    cityName: "Surat",
    corporationName: "Surat Municipal Corporation (SMC)",
    state: "Gujarat",
    stateCode: "GJ",
    pincodePrefix: ["395", "394"],
    portalUrl: "https://suratmunicipal.gov.in",
    singleWindowPortal: "https://ifp.gujarat.gov.in",
    helpline: "1800-123-8000 / 0261-2423751",
    tradeLicenseSLA: "3–5 Business Days via SMC Online Portal",
    tradeLicenseFee: "₹1,000 – ₹5,500 / year",
    healthNOCRequirements: ["SMC Health Department inspection", "SMC Potable water certificate"],
    fireNOCThreshold: "Mandatory for commercial kitchens > 500 sq ft (SMC Fire Department)",
    propertyTaxDocument: "SMC Tenement Number & Property Tax Receipt",
    waterSewerageBoard: "SMC Hydraulic Department",
    domainRules: {
      startups: {
        single_window_clearance: {
          value: "3 Days via IFP Gujarat / Surat Smart City Incubation Center",
          highlight: "better",
          details: "Textile and diamond tech startups receive fast-track deemed approvals.",
          statutoryReference: "Gujarat Startup and Innovation Policy",
        },
      },
      food: {
        health_trade_sla: {
          value: "3–5 Business Days via SMC Portal",
          highlight: "better",
          details: "Quick turnaround via 7 Zonal Civic Centers.",
          statutoryReference: "BPMC Act Gujarat",
        },
      },
      real_estate: {
        building_plan_sla: {
          value: "21 Days via SMC e-Nagar ODPS",
          highlight: "better",
          details: "Automated architectural approval under CGDCR.",
          statutoryReference: "Gujarat CGDCR",
        },
      },
      retail: {
        operating_hours_24x7: {
          value: "24/7 Operations permitted under Gujarat Shops Act 2019",
          highlight: "better",
          details: "Zero closing hour restrictions for textile & retail markets.",
          statutoryReference: "Gujarat Shops and Establishments Act 2019",
        },
      },
    },
  },

  IMC: {
    id: "IMC",
    cityName: "Indore",
    corporationName: "Indore Municipal Corporation (IMC)",
    state: "Madhya Pradesh",
    stateCode: "MP",
    pincodePrefix: ["452", "453"],
    portalUrl: "https://imcindore.mp.gov.in",
    singleWindowPortal: "https://invest.mp.gov.in",
    helpline: "1800-233-1311 / 0731-2535555",
    tradeLicenseSLA: "5–7 Business Days via e-Nagar Palika MP Portal",
    tradeLicenseFee: "₹1,000 – ₹5,000 / year",
    healthNOCRequirements: ["IMC Swachhata Health Inspector clearance", "Solid waste segregation contract"],
    fireNOCThreshold: "Mandatory for commercial kitchens > 500 sq ft or multistory establishments",
    propertyTaxDocument: "IMC Property ID & Swachhata Tax Receipt",
    waterSewerageBoard: "IMC Narmada Water Supply & Drainage Department",
    domainRules: {
      startups: {
        single_window_clearance: {
          value: "3–5 Days via MP Startup Center (invest.mp.gov.in)",
          highlight: "better",
          details: "Special lease rental and electricity concessions under MP Startup Policy.",
          statutoryReference: "Madhya Pradesh Startup Policy 2022",
        },
      },
      food: {
        health_trade_sla: {
          value: "5 Business Days via e-Nagar Palika Portal",
          highlight: "better",
          details: "India's cleanest city strict hygiene & segregation standards.",
          statutoryReference: "MP Municipal Corporation Act 1956",
        },
      },
      real_estate: {
        building_plan_sla: {
          value: "21 Days via ABPAS (Automated Building Plan Approval System MP)",
          highlight: "better",
          details: "Automated scrutiny under MP Bhumi Vikas Niyam.",
          statutoryReference: "MP Bhumi Vikas Rules 2012",
        },
      },
      retail: {
        operating_hours_24x7: {
          value: "24/7 Operations permitted in BRTS corridor and notified commercial zones",
          highlight: "better",
          details: "Notification under MP Shops & Commercial Establishments Act.",
          statutoryReference: "MP Shops and Establishments Act 1958",
        },
      },
    },
  },

  KMC_KL: {
    id: "KMC_KL",
    cityName: "Kochi / Thiruvananthapuram",
    corporationName: "Kochi Municipal Corporation (KMC / TMC Kerala)",
    state: "Kerala",
    stateCode: "KL",
    pincodePrefix: ["682", "683", "695", "696"],
    portalUrl: "https://kochicorporation.lsgkerala.gov.in",
    singleWindowPortal: "https://kswift.kerala.gov.in",
    helpline: "1800-425-1177 / 0484-2369007",
    tradeLicenseSLA: "Instant Deemed Approval via K-SWIFT / Sanchitha Portal",
    tradeLicenseFee: "₹750 – ₹4,500 / year",
    healthNOCRequirements: ["LSGD Health Inspector sanitary certificate", "Kerala Water Authority test"],
    fireNOCThreshold: "Mandatory for commercial kitchens > 500 sq ft (Kerala Fire & Rescue Services)",
    propertyTaxDocument: "LSGD Building Assessment Number & Sanchaya Tax Receipt",
    waterSewerageBoard: "Kerala Water Authority (KWA)",
    domainRules: {
      startups: {
        single_window_clearance: {
          value: "Instant Deemed Approval for White/Green categories via K-SWIFT",
          highlight: "better",
          details: "Kerala Startup Mission (KSUM) technology incubators deemed valid for 3 years without inspection.",
          statutoryReference: "Kerala Micro Small and Medium Enterprises Facilitation Act",
        },
      },
      food: {
        health_trade_sla: {
          value: "3–7 Business Days via K-SWIFT Online Portal",
          highlight: "better",
          details: "Self-declaration based deemed license issuance.",
          statutoryReference: "Kerala Municipality Act 1994",
        },
      },
      real_estate: {
        building_plan_sla: {
          value: "30 Days via IBPMS / Sanketham LSGD Portal",
          highlight: "better",
          details: "Scrutiny under Kerala Municipality Building Rules (KMBR).",
          statutoryReference: "Kerala Municipality Building Rules (KMBR 2019)",
        },
      },
      retail: {
        operating_hours_24x7: {
          value: "24/7 Operations permitted across Kerala with female employee night transport",
          highlight: "better",
          details: "Labour department online self-registration.",
          statutoryReference: "Kerala Shops and Commercial Establishments Act",
        },
      },
    },
  },
};

/**
 * Auto-detects the municipal corporation compliance profile based on 6-digit postal pincode.
 */
export function detectMunicipalityByPincode(pincode: string): string | null {
  const cleanPin = (pincode || "").trim().replace(/\D/g, "");
  if (cleanPin.length < 3) return null;
  const prefix = cleanPin.substring(0, 3);

  for (const [id, profile] of Object.entries(MUNICIPAL_PROFILES)) {
    if (profile.pincodePrefix.some((p) => cleanPin.startsWith(p) || p.startsWith(prefix))) {
      return id;
    }
  }
  return null;
}

/**
 * Finds the nearest municipal corporation based on GPS latitude and longitude coordinates.
 */
export function getNearestMunicipalityByCoords(lat: number, lng: number): string {
  const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
    BBMP: { lat: 12.9716, lng: 77.5946 },
    BMC: { lat: 19.076, lng: 72.8777 },
    MCD: { lat: 28.6139, lng: 77.209 },
    GHMC: { lat: 17.385, lng: 78.4867 },
    GCC: { lat: 13.0827, lng: 80.2707 },
    PMC: { lat: 18.5204, lng: 73.8567 },
    KMC: { lat: 22.5726, lng: 88.3639 },
    AMC: { lat: 23.0225, lng: 72.5714 },
    BBSR: { lat: 20.2961, lng: 85.8245 },
    JMC: { lat: 26.9124, lng: 75.7873 },
    LMC: { lat: 26.8467, lng: 80.9462 },
    GMC: { lat: 26.1445, lng: 91.7362 },
    MCC: { lat: 30.7333, lng: 76.7794 },
    VMC: { lat: 16.5062, lng: 80.648 },
    SMC: { lat: 21.1702, lng: 72.8311 },
    IMC: { lat: 22.7196, lng: 75.8577 },
    KMC_KL: { lat: 9.9312, lng: 76.2673 },
  };

  let minDistance = Infinity;
  let closestCity = "BBMP";

  for (const [id, coords] of Object.entries(CITY_COORDS)) {
    const dist = Math.hypot(lat - coords.lat, lng - coords.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closestCity = id;
    }
  }

  return closestCity;
}

