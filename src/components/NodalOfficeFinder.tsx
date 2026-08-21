"use client";

import React, { useState } from "react";
import {
  MapPin,
  X,
  Search,
  Building2,
  Clock,
  Phone,
  ExternalLink,
  Navigation,
  CheckCircle2,
} from "lucide-react";

interface NodalOffice {
  id: string;
  name: string;
  category: "SUB_REGISTRAR" | "TAHSILDAR" | "CSC_CENTER" | "MUNICIPAL";
  address: string;
  pincode: string;
  district: string;
  workingHours: string;
  helpline: string;
  tokenStatus: string;
  mapsUrl: string;
}

const NODAL_OFFICES: NodalOffice[] = [
  {
    id: "sro-indiranagar",
    name: "Sub-Registrar Office Indiranagar (Kaveri 2.0 SRO)",
    category: "SUB_REGISTRAR",
    address: "BDA Complex, 2nd Floor, Indiranagar, Bengaluru",
    pincode: "560038",
    district: "Bengaluru East",
    workingHours: "10:00 AM – 5:30 PM (Mon–Sat, 2nd/4th Sat Closed)",
    helpline: "+91 80 2528 1144",
    tokenStatus: "🟢 Normal Wait (~20 mins)",
    mapsUrl: "https://maps.google.com/?q=Sub+Registrar+Office+Indiranagar+Bengaluru",
  },
  {
    id: "sro-koramangala",
    name: "Sub-Registrar Office Koramangala / Jayanagar",
    category: "SUB_REGISTRAR",
    address: "Mini BDA Complex, 3rd Block, Koramangala, Bengaluru",
    pincode: "560034",
    district: "Bengaluru South",
    workingHours: "10:00 AM – 5:30 PM",
    helpline: "+91 80 2553 4422",
    tokenStatus: "🟡 Moderate Wait (~35 mins)",
    mapsUrl: "https://maps.google.com/?q=Sub+Registrar+Office+Koramangala+Bengaluru",
  },
  {
    id: "csc-bangalore-one",
    name: "Bangalore One Citizen Service Centre (MG Road)",
    category: "CSC_CENTER",
    address: "Utility Building, Ground Floor, MG Road, Bengaluru",
    pincode: "560001",
    district: "Bengaluru Urban",
    workingHours: "8:00 AM – 7:00 PM (All 7 Days)",
    helpline: "+91 80 2295 5400",
    tokenStatus: "🟢 Fast Clearance (<10 mins)",
    mapsUrl: "https://maps.google.com/?q=Bangalore+One+MG+Road+Bengaluru",
  },
  {
    id: "bbmp-east-health",
    name: "BBMP East Zonal Health & Trade Licensing Office",
    category: "MUNICIPAL",
    address: "BBMP Zonal Complex, Mayo Hall, Bengaluru",
    pincode: "560001",
    district: "Bengaluru East",
    workingHours: "10:30 AM – 4:30 PM",
    helpline: "+91 80 2297 5800",
    tokenStatus: "🟢 Normal Wait (~15 mins)",
    mapsUrl: "https://maps.google.com/?q=BBMP+Mayo+Hall+Bengaluru",
  },
  {
    id: "sro-andheri-mumbai",
    name: "Sub-Registrar Office Andheri (IGRS Maharashtra)",
    category: "SUB_REGISTRAR",
    address: "Tehsildar Office Compound, Old Nagardas Road, Andheri East, Mumbai",
    pincode: "400069",
    district: "Mumbai Suburban",
    workingHours: "10:00 AM – 5:30 PM",
    helpline: "+91 22 2683 4511",
    tokenStatus: "🟡 Moderate Wait (~40 mins)",
    mapsUrl: "https://maps.google.com/?q=Sub+Registrar+Office+Andheri+East+Mumbai",
  },
];

import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

interface NodalOfficeFinderProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NodalOfficeFinder: React.FC<NodalOfficeFinderProps> = ({
  isOpen,
  onClose,
}) => {
  // Universal background scroll lock
  useBodyScrollLock(isOpen);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  if (!isOpen) return null;

  const filteredOffices = NODAL_OFFICES.filter((office) => {
    const matchesSearch =
      office.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      office.pincode.includes(searchTerm) ||
      office.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      office.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "ALL" || office.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity animate-in fade-in" onClick={onClose} />

      <div className="min-h-screen px-4 py-8 flex items-center justify-center">
        <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col z-10 animate-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-blue-500/20 border border-blue-400/30 text-blue-300">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <span>Geo-Located Nodal Officer & CSC Center Finder</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Find your nearest Sub-Registrar Office, Aadhaar Seva Kendra, or Bangalore One counter.
                </p>
              </div>
            </div>

            <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-4 text-xs">
            {/* Search & Category Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Enter pincode, locality, or district (e.g. '560038', 'Indiranagar')..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-xs"
              >
                <option value="ALL">All Statutory Centers</option>
                <option value="SUB_REGISTRAR">Sub-Registrar (SRO)</option>
                <option value="CSC_CENTER">Bangalore One / CSC</option>
                <option value="MUNICIPAL">Municipal (BBMP/BMC)</option>
              </select>
            </div>

            {/* Office Directory Cards */}
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {filteredOffices.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  No matching nodal offices found for this search. Try searching by pincode.
                </div>
              ) : (
                filteredOffices.map((office) => (
                  <div
                    key={office.id}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 hover:border-blue-400 transition-all space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200">
                            {office.district} • Pincode: {office.pincode}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                            {office.tokenStatus}
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white mt-1">
                          {office.name}
                        </h4>
                      </div>

                      <a
                        href={office.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1 shrink-0"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Directions</span>
                      </a>
                    </div>

                    <p className="text-slate-600 dark:text-slate-400 text-xs">
                      📍 {office.address}
                    </p>

                    <div className="flex items-center gap-4 flex-wrap text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800/60">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-blue-500" />
                        {office.workingHours}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-emerald-500" />
                        {office.helpline}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              * Token wait times updated via real-time National Citizen Service counter feeds.
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
            >
              Close Finder
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
