"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Lock,
  Unlock,
  KeyRound,
  FileText,
  Upload,
  Download,
  Trash2,
  X,
  Eye,
  CheckCircle2,
  HardDrive,
  WifiOff,
  Wifi,
} from "lucide-react";
import {
  VaultDocument,
  loadStoredVaultDocs,
  saveVaultDoc,
  deleteVaultDoc,
  encryptDocument,
  decryptDocument,
} from "@/utils/offlineVault";
import { useToast } from "@/context/ToastContext";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

interface OfflineVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OfflineVaultModal: React.FC<OfflineVaultModalProps> = ({
  isOpen,
  onClose,
}) => {
  // Universal background scroll lock
  useBodyScrollLock(isOpen);

  const { showToast } = useToast();
  const [pin, setPin] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [vaultDocs, setVaultDocs] = useState<VaultDocument[]>([]);
  const [selectedDocPreview, setSelectedDocPreview] = useState<{ name: string; content: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setVaultDocs(loadStoredVaultDocs());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length < 4) {
      showToast("Please enter at least 4 digits for your security PIN.", "error");
      return;
    }

    // Try decrypting the first document to verify PIN if docs exist
    if (vaultDocs.length > 0) {
      try {
        await decryptDocument(vaultDocs[0], pin);
        setIsUnlocked(true);
        showToast("🔓 Encrypted Vault Unlocked successfully!", "success");
      } catch (err) {
        showToast("Incorrect PIN. Decryption failed.", "error");
      }
    } else {
      // First time initialization
      setIsUnlocked(true);
      showToast("🔓 Encrypted Vault Initialized with your PIN!", "success");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !pin) return;

    setIsUploading(true);
    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const base64Content = reader.result as string;
        const encrypted = await encryptDocument(base64Content, pin, {
          id: `doc_${Date.now()}`,
          name: file.name,
          category: file.type.includes("pdf") ? "PDF Document" : "Image File",
          mimeType: file.type || "application/octet-stream",
        });

        saveVaultDoc(encrypted);
        setVaultDocs(loadStoredVaultDocs());
        showToast(`🔒 "${file.name}" encrypted with AES-256 and saved!`, "success");
      } catch (err) {
        showToast("Encryption failed. Please try again.", "error");
      } finally {
        setIsUploading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const handlePreview = async (doc: VaultDocument) => {
    try {
      const decrypted = await decryptDocument(doc, pin);
      setSelectedDocPreview({ name: doc.name, content: decrypted });
    } catch (err) {
      showToast("Decryption error. Check your PIN.", "error");
    }
  };

  const handleDelete = (docId: string, name: string) => {
    deleteVaultDoc(docId);
    setVaultDocs(loadStoredVaultDocs());
    showToast(`Deleted "${name}" from local vault.`, "info");
  };

  const handleExportBackup = () => {
    const backupJson = JSON.stringify(vaultDocs, null, 2);
    const blob = new Blob([backupJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `JanSetu-EncryptedVault-${new Date().toISOString().slice(0, 10)}.jansetuvault`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("✓ Encrypted Vault backup exported!", "success");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity animate-in fade-in" onClick={onClose} />

      <div className="min-h-screen px-4 py-8 flex items-center justify-center">
        <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col z-10 animate-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-400">
                <HardDrive className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <span>Encrypted Offline Document Vault</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                    isOnline
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                      : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                  }`}>
                    {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                    {isOnline ? "Online (Sync Ready)" : "Offline Mode Active"}
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  AES-256-GCM zero-knowledge client encryption. Files never touch any server unencrypted.
                </p>
              </div>
            </div>

            <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-6">
            {!isUnlocked ? (
              /* PIN Lock Screen */
              <form onSubmit={handleUnlock} className="max-w-sm mx-auto text-center space-y-4 py-6">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800">
                  <Lock className="w-6 h-6" />
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">
                    Enter Vault Passphrase / PIN
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Your documents are protected with PBKDF2 + AES-256-GCM encryption on this device.
                  </p>
                </div>

                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    maxLength={8}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Enter 4 to 8 digit PIN"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-center tracking-widest font-mono text-base font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Unlock My Vault</span>
                </button>
              </form>
            ) : (
              /* Unlocked Vault Manager */
              <div className="space-y-5">
                
                {/* Upload Staging Box */}
                <div className="p-4 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-left">
                    <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900 dark:text-white text-xs">
                        Stage & Encrypt New Document
                      </h5>
                      <p className="text-[11px] text-slate-500">
                        Select Aadhaar, PAN, Electricity Bill, or Lease Agreement to encrypt locally.
                      </p>
                    </div>
                  </div>

                  <label className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5 transition-all shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploading ? "Encrypting..." : "Choose File"}</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                    />
                  </label>
                </div>

                {/* Stored Documents List */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">
                      Encrypted Documents in Device Vault ({vaultDocs.length})
                    </span>
                    {vaultDocs.length > 0 && (
                      <button
                        onClick={handleExportBackup}
                        className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export Backup (.civicvault)</span>
                      </button>
                    )}
                  </div>

                  {vaultDocs.length === 0 ? (
                    <div className="text-center py-8 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                      <FileText className="w-8 h-8 text-slate-400 mx-auto" />
                      <p className="text-xs text-slate-500">No documents stored in your local encrypted vault yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-56 overflow-y-auto">
                      {vaultDocs.map((doc) => (
                        <div
                          key={doc.id}
                          className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
                              <ShieldCheck className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 dark:text-white block">
                                {doc.name}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                AES-256 • {Math.round(doc.size / 1024)} KB • Stored {new Date(doc.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handlePreview(doc)}
                              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 cursor-pointer"
                              title="Decrypt & Preview"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(doc.id, doc.name)}
                              className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950 hover:bg-red-100 text-red-600 cursor-pointer"
                              title="Delete from Vault"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Decrypted Preview Modal / Drawer */}
                {selectedDocPreview && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-blue-200 dark:border-blue-800 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                        <Unlock className="w-3.5 h-3.5" />
                        <span>Decrypted Preview: {selectedDocPreview.name}</span>
                      </span>
                      <button
                        onClick={() => setSelectedDocPreview(null)}
                        className="text-slate-400 hover:text-slate-600 cursor-pointer font-bold"
                      >
                        Close Preview
                      </button>
                    </div>

                    {selectedDocPreview.content.startsWith("data:image") ? (
                      <img
                        src={selectedDocPreview.content}
                        alt="Decrypted preview"
                        className="max-h-48 rounded-xl object-contain mx-auto border border-slate-200"
                      />
                    ) : (
                      <div className="p-3 bg-white dark:bg-slate-900 rounded-xl text-[11px] font-mono text-slate-700 dark:text-slate-300 break-all max-h-32 overflow-y-auto">
                        {selectedDocPreview.content.slice(0, 500)}...
                      </div>
                    )}
                  </div>
                )}

              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
            <span>* DPDP Act 2023 Compliant • Zero-knowledge client encryption</span>
            {isUnlocked && (
              <button
                type="button"
                onClick={() => {
                  setIsUnlocked(false);
                  setPin("");
                  setSelectedDocPreview(null);
                  showToast("🔒 Vault locked.", "info");
                }}
                className="font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer flex items-center gap-1"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Lock Vault</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
