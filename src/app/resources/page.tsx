"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  ExternalLink,
  Search,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Globe,
  Layers,
  Sparkles,
  Landmark,
} from "lucide-react";
import { GovTechHeader } from "@/components/GovTechHeader";

interface OfficialResource {
  id: string;
  name: string;
  acronym: string;
  ministry: string;
  statutoryAct: string;
  portalUrl: string;
  helpline: string;
  serviceScope: string;
  status: "OPERATIONAL" | "SCHEDULED_MAINTENANCE";
  category: "CENTRAL" | "STATE" | "KYC_IDENTITY" | "LEGAL_AID";
}

const OFFICIAL_PORTALS: OfficialResource[] = [
  {
    id: "foscos",
    name: "Food Safety Compliance System",
    acronym: "FoSCoS / FSSAI",
    ministry: "Ministry of Health & Family Welfare",
    statutoryAct: "Food Safety and Standards Act, 2006",
    portalUrl: "https://foscos.fssai.gov.in",
    helpline: "1800 112 100",
    serviceScope: "Food licensing, annual returns, and food safety supervisor registration.",
    status: "OPERATIONAL",
    category: "CENTRAL",
  },
  {
    id: "mca21",
    name: "MCA21 Corporate Registry (V3)",
    acronym: "MCA / SPICe+",
    ministry: "Ministry of Corporate Affairs",
    statutoryAct: "Companies Act, 2013 & LLP Act, 2008",
    portalUrl: "https://www.mca.gov.in",
    helpline: "0124 483 2500",
    serviceScope: "Company incorporation, DIN, RUN name reservation, and annual ROC filings.",
    status: "OPERATIONAL",
    category: "CENTRAL",
  },
  {
    id: "digilocker",
    name: "DigiLocker National Document Vault",
    acronym: "DigiLocker / NeGD",
    ministry: "Ministry of Electronics & IT (MeitY)",
    statutoryAct: "Information Technology Act, 2000 Section 35A",
    portalUrl: "https://www.digilocker.gov.in",
    helpline: "011 2430 1851",
    serviceScope: "Consent-driven electronic document issuance and instant KYC verification.",
    status: "OPERATIONAL",
    category: "KYC_IDENTITY",
  },
  {
    id: "kaveri",
    name: "Kaveri 2.0 State e-Stamping & Property Registry",
    acronym: "Kaveri 2.0 / IGR Karnataka",
    ministry: "Department of Stamps and Registration, Govt of Karnataka",
    statutoryAct: "Karnataka Stamp Act, 1957 & Registration Act, 1908",
    portalUrl: "https://kaverionline.karnataka.gov.in",
    helpline: "080 2221 2707",
    serviceScope: "Online e-Stamp paper procurement, deed registration, and Encumbrance Certificate (EC).",
    status: "OPERATIONAL",
    category: "STATE",
  },
  {
    id: "igr-mh",
    name: "IGRS Maharashtra Property & Stamp Portal",
    acronym: "IGRS / GRAS Maharashtra",
    ministry: "Revenue and Forest Department, Govt of Maharashtra",
    statutoryAct: "Maharashtra Stamp Act, 1958",
    portalUrl: "https://igrmaharashtra.gov.in",
    helpline: "020 2605 0006",
    serviceScope: "e-Filing of Leave and License agreements and state stamp duty valuation.",
    status: "OPERATIONAL",
    category: "STATE",
  },
  {
    id: "telelaw",
    name: "Tele-Law Pro Bono Legal Aid Scheme",
    acronym: "Tele-Law / DoJ",
    ministry: "Department of Justice, Ministry of Law and Justice",
    statutoryAct: "Legal Services Authorities Act, 1987 (NALSA)",
    portalUrl: "https://www.tele-law.in",
    helpline: "14434 / 1516",
    serviceScope: "Free video/phone consultation with Panel Lawyers for marginalized citizens.",
    status: "OPERATIONAL",
    category: "LEGAL_AID",
  },
  {
    id: "vidyalakshmi",
    name: "Vidya Lakshmi Higher Education Loan Portal",
    acronym: "Vidya Lakshmi / NSDL",
    ministry: "Department of Higher Education & Department of Financial Services",
    statutoryAct: "PM-Vidyalaxmi National Scheme",
    portalUrl: "https://www.vidyalakshmi.co.in",
    helpline: "022 4090 4484",
    serviceScope: "Single-window student education loan applications across 40+ scheduled banks.",
    status: "OPERATIONAL",
    category: "CENTRAL",
  },
  {
    id: "rtionline",
    name: "RTI Online Citizen Filing Portal",
    acronym: "RTI Online / DoPT",
    ministry: "Department of Personnel and Training",
    statutoryAct: "Right to Information Act, 2005",
    portalUrl: "https://rtionline.gov.in",
    helpline: "011 2462 2690",
    serviceScope: "First appeals, online RTI applications, and status tracking across central public authorities.",
    status: "OPERATIONAL",
    category: "LEGAL_AID",
  },
  {
    id: "udyam",
    name: "Udyam MSME Zero-Cost Registration",
    acronym: "Udyam / MSME",
    ministry: "Ministry of Micro, Small and Medium Enterprises",
    statutoryAct: "MSMED Act, 2006",
    portalUrl: "https://udyamregistration.gov.in",
    helpline: "011 2306 3288",
    serviceScope: "Instant paperless MSME certificate issuance with PAN/Aadhaar validation.",
    status: "OPERATIONAL",
    category: "CENTRAL",
  },
];

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const filteredPortals = OFFICIAL_PORTALS.filter((portal) => {
    const matchesSearch =
      portal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      portal.acronym.toLowerCase().includes(searchTerm.toLowerCase()) ||
      portal.ministry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      portal.statutoryAct.toLowerCase().includes(searchTerm.toLowerCase()) ||
      portal.serviceScope.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCat = selectedCategory === "ALL" || portal.category === selectedCategory;

    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      <GovTechHeader />

      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Page Hero */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">
            <Link href="/" className="hover:underline flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <span>/</span>
            <span>Government Portals Directory</span>
          </div>

          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
                <Landmark className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                <span>Verified .gov.in Portals & Statutory Gateways</span>
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-3xl mt-1">
                Authentic, direct links to central and state government licensing portals, e-stamping gateways, digital identity vaults, and pro-bono legal helplines.
              </p>
            </div>

            <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-slate-900 dark:text-white">All Gateways Operational</span>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search official portals, ministries, or acts (e.g. 'FSSAI', 'Kaveri', 'DigiLocker', 'MSME')..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-xs"
            >
              <option value="ALL">All Categories</option>
              <option value="CENTRAL">Central Portals</option>
              <option value="STATE">State E-Stamping & Revenue</option>
              <option value="KYC_IDENTITY">KYC & Document Vaults</option>
              <option value="LEGAL_AID">Legal Aid & RTI</option>
            </select>
          </div>
        </div>

        {/* Portals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPortals.map((portal) => (
            <div
              key={portal.id}
              className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 transition-all flex flex-col justify-between space-y-4 shadow-sm"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200">
                    {portal.acronym}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Operational
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {portal.name}
                  </h3>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mt-0.5">
                    {portal.ministry}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {portal.serviceScope}
                </p>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 text-[11px]">
                  <span className="font-bold text-slate-400 block text-[10px] uppercase">Statutory Act Reference:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{portal.statutoryAct}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-slate-500 font-mono text-[11px]">
                  <Phone className="w-3.5 h-3.5 text-emerald-500" />
                  {portal.helpline}
                </span>

                <a
                  href={portal.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs transition-all"
                >
                  <span>Open Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
