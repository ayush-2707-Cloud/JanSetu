/**
 * JanSetu™ (जनसेतु) AES-256-GCM Encrypted Offline Document Vault
 * Compliant with DPDP Act 2023 zero-knowledge client-side encryption.
 */

export interface VaultDocument {
  id: string;
  name: string;
  category: string;
  size: number;
  mimeType: string;
  encryptedData: string; // Base64 ciphertext
  iv: string; // Base64 initialization vector
  salt: string; // Base64 key derivation salt
  createdAt: string;
  verifiedStatus?: boolean;
}

// Helper: Convert ArrayBuffer to Base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

// Helper: Convert Base64 to ArrayBuffer
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary_string = window.atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

// Derive AES-256-GCM key from citizen PIN + Salt using PBKDF2
async function deriveKey(pin: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(pin),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt as any,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Encrypt a plaintext or base64 file string using citizen PIN
 */
export async function encryptDocument(
  fileContent: string,
  pin: string,
  docMeta: { id: string; name: string; category: string; mimeType: string }
): Promise<VaultDocument> {
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(pin, salt);

  const enc = new TextEncoder();
  const ciphertext = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    enc.encode(fileContent)
  );

  return {
    id: docMeta.id,
    name: docMeta.name,
    category: docMeta.category,
    size: fileContent.length,
    mimeType: docMeta.mimeType,
    encryptedData: arrayBufferToBase64(ciphertext),
    iv: arrayBufferToBase64(iv.buffer),
    salt: arrayBufferToBase64(salt.buffer),
    createdAt: new Date().toISOString(),
    verifiedStatus: true,
  };
}

/**
 * Decrypt a VaultDocument using citizen PIN
 */
export async function decryptDocument(
  doc: VaultDocument,
  pin: string
): Promise<string> {
  const salt = new Uint8Array(base64ToArrayBuffer(doc.salt));
  const iv = new Uint8Array(base64ToArrayBuffer(doc.iv));
  const key = await deriveKey(pin, salt);

  const ciphertext = base64ToArrayBuffer(doc.encryptedData);
  const decrypted = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv },
    key,
    ciphertext
  );

  const dec = new TextDecoder();
  return dec.decode(decrypted);
}

const VAULT_STORAGE_KEY = "civic_encrypted_vault_v1";

export function loadStoredVaultDocs(): VaultDocument[] {
  try {
    const raw = localStorage.getItem(VAULT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveVaultDoc(doc: VaultDocument): void {
  const current = loadStoredVaultDocs();
  const existingIndex = current.findIndex((d) => d.id === doc.id);
  if (existingIndex >= 0) {
    current[existingIndex] = doc;
  } else {
    current.push(doc);
  }
  localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(current));
}

export function deleteVaultDoc(docId: string): void {
  const current = loadStoredVaultDocs().filter((d) => d.id !== docId);
  localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(current));
}
