"use client";

import React, { useEffect } from "react";
import { CheckCircle2, Shield, Landmark, X } from "lucide-react";
import { useJourney } from "@/context/JourneyContext";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { Language } from "@/types/journey";

export const LanguageWelcomeModal: React.FC = () => {
  const { language, setLanguage, isLanguageModalOpen, openLanguageModal, closeLanguageModal } = useJourney();

  // Universal background scroll lock
  useBodyScrollLock(isLanguageModalOpen);

  // Show modal once per session on first visit
  useEffect(() => {
    const hasChosenInSession = sessionStorage.getItem("legalpath_lang_modal_shown");
    if (!hasChosenInSession) {
      openLanguageModal();
      sessionStorage.setItem("legalpath_lang_modal_shown", "true");
    }
  }, [openLanguageModal]);

  const handleSelectLanguage = (lang: Language) => {
    setLanguage(lang);
    closeLanguageModal();
  };

  if (!isLanguageModalOpen) return null;

  const indianLanguages: {
    id: Language;
    name: string;
    native: string;
    desc: string;
    tag: string;
  }[] = [
    {
      id: "BN",
      name: "Bengali",
      native: "বাংলা",
      desc: "পশ্চিমবঙ্গ ও জাতীয় নাগরিক পরিষেবা",
      tag: "পশ্চিমবঙ্গ / ত্রিপুরা",
    },
    {
      id: "EN",
      name: "English",
      native: "English",
      desc: "Universal Statutory Process Roadmaps",
      tag: "PAN-INDIA",
    },
    {
      id: "GU",
      name: "Gujarati",
      native: "ગુજરાતી",
      desc: "ગુજરાત રાજ્ય નાગરિક સેવાઓ",
      tag: "ગુજરાત",
    },
    {
      id: "HI",
      name: "Hindi",
      native: "हिन्दी",
      desc: "सरकारी सेवा पोर्टल एवं वैधानिक निर्देश",
      tag: "उत्तर एवं मध्य भारत",
    },
    {
      id: "KN",
      name: "Kannada",
      native: "ಕನ್ನಡ",
      desc: "ಕರ್ನಾಟಕ ರಾಜ್ಯ ನಾಗರಿಕ ಸೇವೆಗಳು",
      tag: "ಕರ್ನಾಟಕ",
    },
    {
      id: "ML",
      name: "Malayalam",
      native: "മലയാളം",
      desc: "കേരള സംസ്ഥാന പൗര സേവനങ്ങൾ",
      tag: "കേരളം",
    },
    {
      id: "MR",
      name: "Marathi",
      native: "मराठी",
      desc: "महाराष्ट्र राज्य वैधानिक सेवा",
      tag: "महाराष्ट्र",
    },
    {
      id: "OR",
      name: "Odia",
      native: "ଓଡ଼ିଆ",
      desc: "ଓଡ଼ିଶା ରାଜ୍ୟ ସରକାରୀ ସେବା ରୋଡମ୍ୟାପ୍",
      tag: "ଓଡ଼ିଶା",
    },
    {
      id: "PA",
      name: "Punjabi",
      native: "ਪੰਜਾਬੀ",
      desc: "ਪੰਜਾਬ ਅਤੇ ਰਾਸ਼ਟਰੀ ਨਾਗਰਿਕ ਸੇਵਾਵਾਂ",
      tag: "ਪੰਜਾਬ",
    },
    {
      id: "TA",
      name: "Tamil",
      native: "தமிழ்",
      desc: "தமிழ்நாடு அரசு மற்றும் சட்ட சேவைகள்",
      tag: "தமிழ்நாடு",
    },
    {
      id: "TE",
      name: "Telugu",
      native: "తెలుగు",
      desc: "ఆంధ్రప్రదేశ్ & తెలంగాణ పౌర సేవలు",
      tag: "ఆంధ్రప్రదేశ్ / తెలంగాణ",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Ultra-fast GPU Hardware-Accelerated Solid Alpha Overlay */}
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-fade-in cursor-pointer"
        onClick={closeLanguageModal}
      />

      {/* Ultra-smooth GPU Compositor Modal Card */}
      <div 
        className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden z-10 border border-slate-200 dark:border-slate-800 modal-glide-in"
      >
        
        {/* Header */}
        <div className="bg-slate-950 text-white p-6 text-center space-y-2 border-b border-slate-800 relative">
          <button
            onClick={closeLanguageModal}
            aria-label="Close language selection"
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold px-3 py-1 rounded-full">
            <Landmark className="w-4 h-4 text-blue-400" />
            <span>JanSetu™ (जनसेतु) Universal Multi-Language Standard</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Select Your Language • भाषा चुनें • ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ
          </h2>

          <p className="text-xs text-slate-300 leading-relaxed max-w-lg mx-auto">
            Choose your preferred Indian language to customize all statutory service roadmaps, document checklists, and instructions across the portal.
          </p>
        </div>

        {/* Body Language Selection Cards (2-Column Responsive Grid) */}
        <div className="p-5 max-h-[440px] overflow-y-auto bg-slate-50/50 dark:bg-slate-950/50 overscroll-contain">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {indianLanguages.map((langItem) => {
              const isSelected = language === langItem.id;
              return (
                <div
                  key={langItem.id}
                  onClick={() => handleSelectLanguage(langItem.id)}
                  className={`group p-3.5 rounded-2xl border-2 cursor-pointer flex items-center justify-between gap-3 transition-colors duration-150 ${
                    isSelected
                      ? "bg-blue-50/90 dark:bg-blue-950/60 border-blue-600 shadow-md ring-1 ring-blue-400/30"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500"
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {langItem.native}
                      </h3>
                      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">({langItem.name})</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{langItem.desc}</p>
                    <span className="inline-block mt-1 text-[9px] font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-1.5 py-0.5 rounded border border-blue-100 dark:border-blue-900/60">
                      {langItem.tag}
                    </span>
                  </div>

                  <div className="shrink-0">
                    {isSelected ? (
                      <div className="p-1 bg-blue-600 text-white rounded-full">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-700 group-hover:border-blue-500" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>11 Official Languages Supported (Eighth Schedule)</span>
          </div>
          <button
            onClick={() => handleSelectLanguage(language)}
            className="text-blue-400 hover:text-blue-300 font-bold hover:underline flex items-center gap-1"
          >
            <span>Continue</span>
            <span>→</span>
          </button>
        </div>

      </div>
    </div>
  );
};
