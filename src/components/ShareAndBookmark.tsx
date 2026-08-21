"use client";

import React, { useState, useCallback } from "react";
import {
  Share2,
  Link2,
  Bookmark,
  BookmarkCheck,
  QrCode,
  Check,
  Copy,
  X,
} from "lucide-react";
import { Language } from "@/types/journey";
import { useToast } from "@/context/ToastContext";

interface ShareAndBookmarkProps {
  /** Shareable URL (journey or step deep-link) */
  shareUrl?: string;
  /** Title used in the share payload */
  shareTitle: string;
  /** Description for social sharing */
  shareDescription?: string;
  /** Whether the item is bookmarked */
  isBookmarked?: boolean;
  /** Callback when bookmark state toggles */
  onToggleBookmark?: () => void;
  language: Language;
  /** Render variant: inline row or compact icon-only */
  variant?: "inline" | "compact";
  className?: string;
}

const i18n = {
  EN: {
    share: "Share",
    copyLink: "Copy Link",
    copied: "Copied!",
    bookmark: "Bookmark",
    bookmarked: "Bookmarked",
    qrCode: "QR Code",
    shareVia: "Share via...",
    close: "Close",
    scanQr: "Scan QR code to open on mobile",
  },
  HI: {
    share: "साझा करें",
    copyLink: "लिंक कॉपी करें",
    copied: "कॉपी हो गया!",
    bookmark: "बुकमार्क",
    bookmarked: "बुकमार्क किया गया",
    qrCode: "QR कोड",
    shareVia: "इसके माध्यम से साझा करें...",
    close: "बंद करें",
    scanQr: "मोबाइल पर खोलने के लिए QR कोड स्कैन करें",
  },
  KN: {
    share: "ಹಂಚಿಕೊಳ್ಳಿ",
    copyLink: "ಲಿಂಕ್ ನಕಲಿಸಿ",
    copied: "ನಕಲಿಸಲಾಗಿದೆ!",
    bookmark: "ಬುಕ್‌ಮಾರ್ಕ್",
    bookmarked: "ಬುಕ್‌ಮಾರ್ಕ್ ಮಾಡಲಾಗಿದೆ",
    qrCode: "QR ಕೋಡ್",
    shareVia: "ಮೂಲಕ ಹಂಚಿಕೊಳ್ಳಿ...",
    close: "ಮುಚ್ಚಿ",
    scanQr: "ಮೊಬೈಲ್‌ನಲ್ಲಿ ತೆರೆಯಲು QR ಕೋಡ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ",
  },
};

/**
 * Share + Bookmark action bar.
 * Provides copy-link, native share API, bookmark toggle, and a QR-code modal.
 */
export const ShareAndBookmark: React.FC<ShareAndBookmarkProps> = ({
  shareUrl,
  shareTitle,
  shareDescription,
  isBookmarked = false,
  onToggleBookmark,
  language,
  variant = "inline",
  className,
}) => {
  const { showToast } = useToast();
  const t = (i18n as Record<string, typeof i18n.EN>)[language] || i18n.EN;
  const url = shareUrl || (typeof window !== "undefined" ? window.location.href : "");

  const [linkCopied, setLinkCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  // ── Copy link to clipboard ─────────────────────────────────────────
  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
      showToast("✓ Link copied to clipboard!", "success");
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement("textarea");
      ta.value = url;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  }, [url]);

  // ── Native Web Share API (mobile) ──────────────────────────────────
  const handleNativeShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareDescription || shareTitle,
          url,
        });
      } catch {
        // User cancelled — ignore
      }
    } else {
      // Fallback: copy link
      handleCopyLink();
    }
  }, [shareTitle, shareDescription, url, handleCopyLink]);

  // ── QR Code (generated via a public API — works offline-safe as a static URL) ─
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;

  const btnBase =
    "inline-flex items-center gap-1.5 text-xs font-semibold rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40";

  const btnDefault =
    "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600";

  const btnBookmarked =
    "bg-amber-50 dark:bg-amber-900/30 border-amber-300 dark:border-amber-600 text-amber-700 dark:text-amber-300";

  const btnSize = variant === "compact" ? "p-2" : "px-3 py-2";

  // ── Compact (icon-only row) ────────────────────────────────────────
  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-1 ${className || ""}`}>
        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          title={linkCopied ? t.copied : t.copyLink}
          className={`${btnBase} ${btnDefault} ${btnSize}`}
        >
          {linkCopied ? (
            <Check className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <Link2 className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Share */}
        <button
          onClick={handleNativeShare}
          title={t.share}
          className={`${btnBase} ${btnDefault} ${btnSize}`}
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>

        {/* Bookmark */}
        {onToggleBookmark && (
          <button
            onClick={onToggleBookmark}
            title={isBookmarked ? t.bookmarked : t.bookmark}
            className={`${btnBase} ${isBookmarked ? btnBookmarked : btnDefault} ${btnSize}`}
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-3.5 h-3.5" />
            ) : (
              <Bookmark className="w-3.5 h-3.5" />
            )}
          </button>
        )}

        {/* QR Code */}
        <button
          onClick={() => setShowQrModal(true)}
          title={t.qrCode}
          className={`${btnBase} ${btnDefault} ${btnSize}`}
        >
          <QrCode className="w-3.5 h-3.5" />
        </button>

        {/* QR Modal */}
        {showQrModal && (
          <QrModal
            url={url}
            qrCodeUrl={qrCodeUrl}
            language={language}
            onClose={() => setShowQrModal(false)}
          />
        )}
      </div>
    );
  }

  // ── Inline (full labels) ───────────────────────────────────────────
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className || ""}`}>
      {/* Copy Link */}
      <button
        onClick={handleCopyLink}
        className={`${btnBase} ${btnDefault} ${btnSize}`}
      >
        {linkCopied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-emerald-600 dark:text-emerald-400">{t.copied}</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            <span>{t.copyLink}</span>
          </>
        )}
      </button>

      {/* Share */}
      <button
        onClick={handleNativeShare}
        className={`${btnBase} ${btnDefault} ${btnSize}`}
      >
        <Share2 className="w-3.5 h-3.5" />
        <span>{t.share}</span>
      </button>

      {/* Bookmark */}
      {onToggleBookmark && (
        <button
          onClick={() => {
            onToggleBookmark();
            showToast(isBookmarked ? "Removed bookmark" : "⭐ Journey bookmarked!", "info");
          }}
          className={`${btnBase} ${isBookmarked ? btnBookmarked : btnDefault} ${btnSize}`}
        >
          {isBookmarked ? (
            <>
              <BookmarkCheck className="w-3.5 h-3.5" />
              <span>{t.bookmarked}</span>
            </>
          ) : (
            <>
              <Bookmark className="w-3.5 h-3.5" />
              <span>{t.bookmark}</span>
            </>
          )}
        </button>
      )}

      {/* QR Code */}
      <button
        onClick={() => setShowQrModal(true)}
        className={`${btnBase} ${btnDefault} ${btnSize}`}
      >
        <QrCode className="w-3.5 h-3.5" />
        <span>{t.qrCode}</span>
      </button>

      {/* QR Modal */}
      {showQrModal && (
        <QrModal
          url={url}
          qrCodeUrl={qrCodeUrl}
          language={language}
          onClose={() => setShowQrModal(false)}
        />
      )}
    </div>
  );
};

// ── QR Code Modal ──────────────────────────────────────────────────────
interface QrModalProps {
  url: string;
  qrCodeUrl: string;
  language: Language;
  onClose: () => void;
}

const QrModal: React.FC<QrModalProps> = ({ url, qrCodeUrl, language, onClose }) => {
  const t = (i18n as Record<string, typeof i18n.EN>)[language] || i18n.EN;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl p-6 max-w-xs w-full text-center animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          aria-label={t.close}
        >
          <X className="w-4 h-4" />
        </button>

        <QrCode className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
          {t.qrCode}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          {t.scanQr}
        </p>

        {/* QR Code Image */}
        <div className="bg-white rounded-xl p-4 inline-block mx-auto border border-slate-200 dark:border-slate-600">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrCodeUrl}
            alt="QR Code"
            width={200}
            height={200}
            className="w-48 h-48"
          />
        </div>

        {/* URL preview */}
        <p className="mt-4 text-[10px] text-slate-400 dark:text-slate-500 break-all leading-relaxed">
          {url}
        </p>
      </div>
    </div>
  );
};
