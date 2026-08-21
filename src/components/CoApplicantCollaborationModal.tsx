"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  Share2,
  CheckCircle2,
  Clock,
  Copy,
  X,
  ShieldCheck,
  Building2,
  FileText,
  Mail,
  Phone,
  Send,
} from "lucide-react";
import {
  CollaborationSession,
  CollaborationMember,
  CoApplicantRole,
  getStoredSession,
  createCollaborationSession,
  saveSession,
  subscribeToSessionChanges,
} from "@/utils/collaborationSession";
import { useToast } from "@/context/ToastContext";
import { UniversalJourney, EnhancedJourney } from "@/types/journey";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

interface CoApplicantCollaborationModalProps {
  isOpen: boolean;
  onClose: () => void;
  journey: UniversalJourney | EnhancedJourney;
}

export const CoApplicantCollaborationModal: React.FC<CoApplicantCollaborationModalProps> = ({
  isOpen,
  onClose,
  journey,
}) => {
  // Universal background scroll lock
  useBodyScrollLock(isOpen);

  const { showToast } = useToast();
  const [session, setSession] = useState<CollaborationSession | null>(null);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberContact, setNewMemberContact] = useState("");
  const [newMemberRole, setNewMemberRole] = useState<CoApplicantRole>("CO_FOUNDER");
  const [isInviting, setIsInviting] = useState(false);

  useEffect(() => {
    if (isOpen && journey) {
      let current = getStoredSession();
      if (!current || current.journeyId !== journey.journeyId) {
        current = createCollaborationSession(journey.journeyId, journey.title, "Primary Applicant");
      }
      setSession(current);
    }
  }, [isOpen, journey]);

  useEffect(() => {
    const unsubscribe = subscribeToSessionChanges((updated) => {
      setSession(updated);
    });
    return () => unsubscribe();
  }, []);

  if (!isOpen || !journey || !session) return null;

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || !newMemberContact.trim()) return;

    const newMember: CollaborationMember = {
      id: `mem_${Date.now()}`,
      name: newMemberName.trim(),
      role: newMemberRole,
      emailOrPhone: newMemberContact.trim(),
      joinedAt: new Date().toISOString(),
      isOnline: true,
    };

    const updatedSession: CollaborationSession = {
      ...session,
      members: [...session.members, newMember],
      activityLogs: [
        {
          id: `log_${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          text: `Added ${newMember.name} as ${newMember.role.replace("_", " ")}.`,
        },
        ...session.activityLogs,
      ],
    };

    saveSession(updatedSession);
    setSession(updatedSession);
    setNewMemberName("");
    setNewMemberContact("");
    setIsInviting(false);
    showToast(`✓ Invited ${newMember.name} to collaboration session!`, "success");
  };

  const handleToggleDocStatus = (docId: string) => {
    const updatedAssignments = session.assignments.map((a) => {
      if (a.documentId === docId) {
        const nextStatus =
          a.status === "PENDING"
            ? ("UPLOADED" as const)
            : a.status === "UPLOADED"
            ? ("VERIFIED" as const)
            : ("PENDING" as const);

        return { ...a, status: nextStatus, updatedAt: new Date().toISOString() };
      }
      return a;
    });

    const targetDoc = session.assignments.find((a) => a.documentId === docId);

    const updatedSession: CollaborationSession = {
      ...session,
      assignments: updatedAssignments,
      activityLogs: [
        {
          id: `log_${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          text: `Document "${targetDoc?.documentName}" marked as status update.`,
        },
        ...session.activityLogs,
      ],
    };

    saveSession(updatedSession);
    setSession(updatedSession);
    showToast("✓ Checklist status updated for all collaborators!", "success");
  };

  const handleCopyInviteLink = () => {
    const inviteUrl = `${window.location.origin}/journey/${journey.journeyId}?session=${session.sessionId}`;
    navigator.clipboard.writeText(inviteUrl);
    showToast("📋 Encrypted Collaboration Link copied to clipboard!", "success");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity animate-in fade-in" onClick={onClose} />

      <div className="min-h-screen px-4 py-8 flex items-center justify-center">
        <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col z-10 animate-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="px-6 py-5 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-blue-500/20 border border-blue-400/30 text-blue-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <span>Multi-Party Co-Applicant Collaboration Hub</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Live Multi-User Sync
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Collaborate on joint filings with business partners, property landlords, and legal advisors.
                </p>
              </div>
            </div>

            <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Session Overview Bar */}
          <div className="px-6 py-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-500">Session ID:</span>
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-900">
                {session.sessionId}
              </span>
            </div>

            <button
              onClick={handleCopyInviteLink}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Co-Applicant Invite Link</span>
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto">
            
            {/* Stakeholder Members Row */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                  Active Stakeholders & Co-Applicants ({session.members.length})
                </h4>

                <button
                  type="button"
                  onClick={() => setIsInviting(!isInviting)}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{isInviting ? "Cancel Invite" : "+ Invite Member"}</span>
                </button>
              </div>

              {/* Invite Form */}
              {isInviting && (
                <form
                  onSubmit={handleAddMember}
                  className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-3 animate-in slide-in-from-top-2"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      placeholder="Stakeholder Name (e.g. Rahul Sharma)"
                      className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      required
                    />

                    <input
                      type="text"
                      value={newMemberContact}
                      onChange={(e) => setNewMemberContact(e.target.value)}
                      placeholder="Mobile No or Email"
                      className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      required
                    />

                    <select
                      value={newMemberRole}
                      onChange={(e) => setNewMemberRole(e.target.value as CoApplicantRole)}
                      className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
                    >
                      <option value="CO_FOUNDER">Co-Founder / Partner</option>
                      <option value="LANDLORD">Property Owner (Landlord)</option>
                      <option value="CA_LAWYER">Chartered Accountant / Lawyer</option>
                    </select>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Invite</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Members Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {session.members.map((member) => (
                  <div
                    key={member.id}
                    className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          member.role === "PRIMARY_APPLICANT"
                            ? "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                            : member.role === "LANDLORD"
                            ? "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
                            : "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                        }`}
                      >
                        {member.role.replace("_", " ")}
                      </span>

                      <span className="flex items-center gap-1 text-[10px] text-slate-400">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            member.isOnline ? "bg-emerald-500" : "bg-slate-300"
                          }`}
                        />
                        {member.isOnline ? "Online" : "Offline"}
                      </span>
                    </div>

                    <div>
                      <h5 className="font-bold text-slate-900 dark:text-white text-xs">
                        {member.name}
                      </h5>
                      <span className="text-[11px] text-slate-500 truncate block">
                        {member.emailOrPhone}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Document Checklist Assignments */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                Document Checklist Ownership Matrix
              </h4>

              <div className="space-y-2">
                {session.assignments.map((assignment) => (
                  <div
                    key={assignment.documentId}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-900 dark:text-white block">
                        {assignment.documentName}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Assigned to: <strong className="text-blue-600 dark:text-blue-400">{assignment.assignedMemberName}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleDocStatus(assignment.documentId)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                          assignment.status === "VERIFIED"
                            ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300"
                            : assignment.status === "UPLOADED"
                            ? "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-300"
                            : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        {assignment.status === "VERIFIED" ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 text-blue-600" />
                        )}
                        <span>{assignment.status}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Audit & Activity Log */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                Live Session Audit Ledger
              </h4>
              <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 text-[11px] max-h-32 overflow-y-auto">
                {session.activityLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between text-slate-600 dark:text-slate-400 py-0.5 border-b border-slate-100 dark:border-slate-800/60 last:border-0">
                    <span>• {log.text}</span>
                    <span className="font-mono text-slate-400 text-[10px]">{log.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
            <span>* Real-time state synchronized across all co-applicant sessions.</span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs cursor-pointer"
            >
              Done
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
