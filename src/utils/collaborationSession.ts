/**
 * JanSetu™ (जनसेतु) Multi-Party Co-Applicant Collaboration Engine
 * Enables real-time milestone coordination across founders, partners, landlords, and CAs.
 */

export type CoApplicantRole = "PRIMARY_APPLICANT" | "CO_FOUNDER" | "LANDLORD" | "CA_LAWYER";

export interface CollaborationMember {
  id: string;
  name: string;
  role: CoApplicantRole;
  emailOrPhone: string;
  joinedAt: string;
  isOnline: boolean;
}

export interface DocumentAssignment {
  documentId: string;
  documentName: string;
  assignedMemberId: string;
  assignedMemberName: string;
  status: "PENDING" | "UPLOADED" | "VERIFIED";
  updatedAt: string;
}

export interface CollaborationSession {
  sessionId: string;
  journeyId: string;
  journeyTitle: string;
  createdAt: string;
  createdBy: string;
  members: CollaborationMember[];
  assignments: DocumentAssignment[];
  activityLogs: Array<{ id: string; timestamp: string; text: string }>;
}

const COLLAB_STORAGE_KEY = "civic_collab_session_v1";

// BroadcastChannel for cross-tab / multi-window live sync
let collabChannel: BroadcastChannel | null = null;
if (typeof window !== "undefined" && "BroadcastChannel" in window) {
  collabChannel = new BroadcastChannel("civic_collab_channel");
}

export function getStoredSession(): CollaborationSession | null {
  try {
    const raw = localStorage.getItem(COLLAB_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSession(session: CollaborationSession): void {
  localStorage.setItem(COLLAB_STORAGE_KEY, JSON.stringify(session));
  if (collabChannel) {
    collabChannel.postMessage({ type: "SESSION_UPDATED", session });
  }
}

export function createCollaborationSession(
  journeyId: string,
  journeyTitle: string,
  primaryApplicantName: string
): CollaborationSession {
  const session: CollaborationSession = {
    sessionId: `COLLAB-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
    journeyId,
    journeyTitle,
    createdAt: new Date().toISOString(),
    createdBy: primaryApplicantName,
    members: [
      {
        id: "mem_primary",
        name: primaryApplicantName || "Primary Applicant",
        role: "PRIMARY_APPLICANT",
        emailOrPhone: "primary@applicant.gov.in",
        joinedAt: new Date().toISOString(),
        isOnline: true,
      },
      {
        id: "mem_partner",
        name: "Co-Founder / Partner",
        role: "CO_FOUNDER",
        emailOrPhone: "+91 98450 11223",
        joinedAt: new Date().toISOString(),
        isOnline: true,
      },
      {
        id: "mem_landlord",
        name: "Property Owner (Landlord)",
        role: "LANDLORD",
        emailOrPhone: "+91 94480 33445",
        joinedAt: new Date().toISOString(),
        isOnline: false,
      },
    ],
    assignments: [
      {
        documentId: "doc_rent_deed",
        documentName: "Registered Lease / Rental Deed",
        assignedMemberId: "mem_landlord",
        assignedMemberName: "Property Owner (Landlord)",
        status: "PENDING",
        updatedAt: new Date().toISOString(),
      },
      {
        documentId: "doc_partner_pan",
        documentName: "Partner PAN Card & Aadhaar",
        assignedMemberId: "mem_partner",
        assignedMemberName: "Co-Founder / Partner",
        status: "UPLOADED",
        updatedAt: new Date().toISOString(),
      },
      {
        documentId: "doc_fssai_water",
        documentName: "Water Potability Test Report",
        assignedMemberId: "mem_primary",
        assignedMemberName: primaryApplicantName || "Primary Applicant",
        status: "VERIFIED",
        updatedAt: new Date().toISOString(),
      },
    ],
    activityLogs: [
      {
        id: "log_1",
        timestamp: new Date(Date.now() - 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: "Session initialized under Joint Co-Applicant Workflow.",
      },
      {
        id: "log_2",
        timestamp: new Date(Date.now() - 1800000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: "Partner PAN & Aadhaar uploaded by Co-Founder.",
      },
    ],
  };

  saveSession(session);
  return session;
}

export function subscribeToSessionChanges(callback: (session: CollaborationSession) => void): () => void {
  const channelHandler = (event: MessageEvent) => {
    if (event.data?.type === "SESSION_UPDATED" && event.data.session) {
      callback(event.data.session);
    }
  };

  const storageHandler = (e: StorageEvent) => {
    if (e.key === COLLAB_STORAGE_KEY && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        callback(parsed);
      } catch {
        // ignore parse error
      }
    }
  };

  if (collabChannel) {
    collabChannel.addEventListener("message", channelHandler);
  }

  if (typeof window !== "undefined") {
    window.addEventListener("storage", storageHandler);
  }

  return () => {
    collabChannel?.removeEventListener("message", channelHandler);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", storageHandler);
    }
  };
}
