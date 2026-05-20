'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Clock,
  Eye,
  FileEdit,
  Globe,
  History,
  MessageSquare,
  RotateCcw,
  ShieldCheck,
  SendHorizontal,
  Undo2,
  Users,
  X,
} from 'lucide-react';
import { mockTeamLeaders } from '@/lib/mock-data';
import { initialAuditEvents } from '@/lib/platform-mock-data';
import { formatNMLS } from '@/lib/utils';
import type { AuditEvent, SubmissionStatus } from '@/lib/platform-types';
import type { TeamLeader, TeamLeaderStatus } from '@/lib/types';

type Filter = 'all' | 'draft' | 'pending' | 'needs-revision' | 'approved' | 'live';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'draft', label: 'Draft' },
  { key: 'pending', label: 'Pending' },
  { key: 'needs-revision', label: 'Needs Revision' },
  { key: 'approved', label: 'Approved' },
  { key: 'live', label: 'Live' },
];

/**
 * Map mock TeamLeader.status (draft/pending_review/approved/published) into the
 * 5-status admin product flow. We layer a transient "needs revision" status on
 * top by tagging submissions whose latest audit event is "Requested Changes".
 */
function toSubmissionStatus(
  tl: TeamLeader,
  events: AuditEvent[],
): SubmissionStatus {
  const last = [...events]
    .filter((e) => e.submission_id === tl.id)
    .sort((a, b) => (a.at < b.at ? 1 : -1))[0];
  if (last?.action === 'Requested Changes') return 'Needs Revision';
  if (last?.action === 'Sent Back to Draft') return 'Draft';
  switch (tl.status) {
    case 'published':
      return 'Published';
    case 'approved':
      return 'Approved';
    case 'pending_review':
      return 'Pending Review';
    default:
      return 'Draft';
  }
}

const STATUS_BADGE: Record<SubmissionStatus, string> = {
  Draft: 'bg-gray-100 text-gray-700 border border-gray-200',
  'Pending Review': 'bg-yellow-50 text-yellow-800 border border-yellow-200',
  'Needs Revision': 'bg-amber-50 text-amber-800 border border-amber-200',
  Approved: 'bg-blue-50 text-blue-800 border border-blue-200',
  Published: 'bg-green-50 text-green-700 border border-green-200',
};

function filterToStatus(f: Filter): SubmissionStatus | null {
  switch (f) {
    case 'draft':
      return 'Draft';
    case 'pending':
      return 'Pending Review';
    case 'needs-revision':
      return 'Needs Revision';
    case 'approved':
      return 'Approved';
    case 'live':
      return 'Published';
    default:
      return null;
  }
}

/* ------------- canonical compliance checklist for the admin panel ------------- */
const REVIEW_CHECKLIST = [
  'Loan Factory NMLS #320841 visible',
  "Individual LO's NMLS visible",
  'Equal Housing Lender mark present',
  'No prohibited claims (lowest/best rate, guaranteed, no closing costs, free refinance, no fees)',
  'No correspondent / direct-lender language',
  'State-specific disclosures present (NJ / RI / MA / TX / AZ where applicable)',
  'Headshot is professional, no borrower/loan data visible',
  'Bio and copy match brand voice',
];

export default function AdminPage() {
  const [leaders, setLeaders] = useState<TeamLeader[]>(mockTeamLeaders);
  const [events, setEvents] = useState<AuditEvent[]>(initialAuditEvents);
  const [filter, setFilter] = useState<Filter>('all');
  const [openId, setOpenId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const reviewer = 'marketing@loanfactory.com';

  const stats = useMemo(() => {
    const statuses = leaders.map((l) => toSubmissionStatus(l, events));
    return {
      total: leaders.length,
      pending: statuses.filter((s) => s === 'Pending Review').length,
      needsRevision: statuses.filter((s) => s === 'Needs Revision').length,
      approved: statuses.filter((s) => s === 'Approved').length,
      live: statuses.filter((s) => s === 'Published').length,
    };
  }, [leaders, events]);

  const visible = useMemo(() => {
    const target = filterToStatus(filter);
    if (!target) return leaders;
    return leaders.filter((l) => toSubmissionStatus(l, events) === target);
  }, [filter, leaders, events]);

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  function addEvent(
    submissionId: string,
    action: AuditEvent['action'],
    note?: string,
  ) {
    const entry: AuditEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      submission_id: submissionId,
      at: new Date().toISOString(),
      actor: reviewer,
      action,
      note,
    };
    setEvents((prev) => [...prev, entry]);
  }

  function mutateStatus(
    id: string,
    nextStatus: TeamLeaderStatus,
    audit: AuditEvent['action'],
    note?: string,
    toastMsg?: string,
  ) {
    setLeaders((prev) =>
      prev.map((l) =>
        l.id === id
          ? {
              ...l,
              status: nextStatus,
              updated_at: new Date().toISOString(),
              approved_at:
                nextStatus === 'approved' ? new Date().toISOString() : l.approved_at,
              approved_by: nextStatus === 'approved' ? reviewer : l.approved_by,
            }
          : l,
      ),
    );
    addEvent(id, audit, note);
    if (toastMsg) flash(toastMsg);
  }

  function approve(tl: TeamLeader) {
    mutateStatus(tl.id, 'approved', 'Approved', undefined, `${tl.full_name} approved`);
  }
  function publish(tl: TeamLeader) {
    mutateStatus(tl.id, 'published', 'Published', undefined, `${tl.full_name} published`);
  }
  function requestChanges(tl: TeamLeader, note: string) {
    if (!note.trim()) return;
    // Keep status at pending_review but mark via audit event so the UI shows "Needs Revision".
    mutateStatus(
      tl.id,
      'pending_review',
      'Requested Changes',
      note.trim(),
      `Changes requested for ${tl.full_name}`,
    );
  }
  function sendBackToDraft(tl: TeamLeader) {
    mutateStatus(
      tl.id,
      'draft',
      'Sent Back to Draft',
      undefined,
      `${tl.full_name} sent back to Draft`,
    );
  }
  function addReviewerNote(tl: TeamLeader, note: string) {
    if (!note.trim()) return;
    addEvent(tl.id, 'Reviewer Note', note.trim());
    flash(`Note added to ${tl.full_name}`);
  }

  function resetDemo() {
    setLeaders(mockTeamLeaders);
    setEvents(initialAuditEvents);
    flash('Demo data reset');
  }

  const openSubmission = openId ? leaders.find((l) => l.id === openId) ?? null : null;
  const openEvents = openSubmission
    ? [...events]
        .filter((e) => e.submission_id === openSubmission.id)
        .sort((a, b) => (a.at < b.at ? 1 : -1))
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-[var(--color-lf-black)] text-white px-4 py-3 rounded-xl shadow-lg text-sm font-semibold">
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-black text-[var(--color-lf-black)] tracking-tight">
            Marketing Approval Queue
          </h1>
          <p className="text-[var(--color-lf-muted)] mt-1 text-sm">
            Review brand and compliance. Approve, request changes, send back to draft, or publish.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={resetDemo}
            className="inline-flex items-center gap-1.5 text-xs text-[var(--color-lf-muted)] hover:text-[var(--color-lf-black)] font-semibold"
          >
            <RotateCcw size={13} /> Reset demo
          </button>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-yellow-800 bg-yellow-50 border border-yellow-200 px-2 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
            Demo Mode
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        {[
          { label: 'Total Submitted', value: stats.total, icon: <Users size={18} />, tone: 'bg-[var(--color-lf-surface)] text-[var(--color-lf-black)]' },
          { label: 'Pending Review', value: stats.pending, icon: <Clock size={18} />, tone: 'bg-yellow-50 text-yellow-800' },
          { label: 'Needs Revision', value: stats.needsRevision, icon: <FileEdit size={18} />, tone: 'bg-amber-50 text-amber-800' },
          { label: 'Approved', value: stats.approved, icon: <CheckCircle2 size={18} />, tone: 'bg-blue-50 text-blue-800' },
          { label: 'Live Sites', value: stats.live, icon: <Globe size={18} />, tone: 'bg-green-50 text-green-700' },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white border border-[var(--color-lf-border)] rounded-2xl p-5"
          >
            <div
              className={`inline-flex items-center justify-center w-9 h-9 rounded-lg ${s.tone} mb-3`}
            >
              {s.icon}
            </div>
            <p className="text-3xl font-black text-[var(--color-lf-black)]">{s.value}</p>
            <p className="text-sm text-[var(--color-lf-muted)] mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-[var(--color-lf-border)] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--color-lf-border)] flex items-center justify-between flex-wrap gap-3">
          <h2 className="font-semibold text-[var(--color-lf-black)]">All Submissions</h2>
          <div className="flex gap-2 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${
                  filter === f.key
                    ? 'bg-[var(--color-lf-black)] border-[var(--color-lf-black)] text-white'
                    : 'bg-white border-[var(--color-lf-border)] text-[var(--color-lf-muted)] hover:border-[var(--color-lf-black)] hover:text-[var(--color-lf-black)]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {visible.length === 0 ? (
          <div className="py-16 text-center text-sm text-[var(--color-lf-muted)]">
            No submissions match this filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--color-lf-surface)] text-[10px] font-bold text-[var(--color-lf-muted)] uppercase tracking-widest">
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">NMLS</th>
                  <th className="px-6 py-3 text-left">Languages</th>
                  <th className="px-6 py-3 text-left">Areas</th>
                  <th className="px-6 py-3 text-left">Submitted</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-lf-border)]">
                {visible.map((tl) => {
                  const status = toSubmissionStatus(tl, events);
                  return (
                    <tr
                      key={tl.id}
                      className="hover:bg-[var(--color-lf-surface)]/60 transition-colors"
                    >
                      <td className="px-6 py-4 font-semibold text-[var(--color-lf-black)]">
                        {tl.full_name}
                      </td>
                      <td className="px-6 py-4 text-[var(--color-lf-muted)]">
                        {formatNMLS(tl.nmls_number)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {tl.languages.map((l) => (
                            <span
                              key={l}
                              className="bg-[var(--color-lf-surface)] text-[var(--color-lf-black)] text-[10px] font-semibold px-2 py-0.5 rounded-full border border-[var(--color-lf-border)]"
                            >
                              {l}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[var(--color-lf-muted)] text-xs">
                        {tl.service_areas.slice(0, 2).join(', ')}
                      </td>
                      <td className="px-6 py-4 text-[var(--color-lf-muted)]">
                        {new Date(tl.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${STATUS_BADGE[status]}`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Link
                            href={`/site/${tl.slug}`}
                            className="inline-flex items-center gap-1 text-xs text-[var(--color-lf-orange-dark)] hover:underline font-semibold"
                          >
                            <Eye size={13} /> Preview
                          </Link>
                          <button
                            type="button"
                            onClick={() => {
                              setOpenId(tl.id);
                              setNoteDraft('');
                            }}
                            className="inline-flex items-center gap-1 text-xs text-[var(--color-lf-black)] hover:bg-gray-50 font-semibold border border-[var(--color-lf-border)] px-2 py-1 rounded-lg"
                          >
                            <History size={12} /> Review
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-[11px] text-[var(--color-lf-muted)] mt-6 text-center">
        Demo dashboard — all state lives in this browser. Once Supabase persistence is wired,
        statuses and audit events will persist across sessions.
      </p>

      {/* Review drawer */}
      {openSubmission && (
        <ReviewDrawer
          submission={openSubmission}
          status={toSubmissionStatus(openSubmission, events)}
          events={openEvents}
          noteDraft={noteDraft}
          onNoteChange={setNoteDraft}
          onClose={() => setOpenId(null)}
          onApprove={() => approve(openSubmission)}
          onPublish={() => publish(openSubmission)}
          onRequestChanges={() => {
            requestChanges(openSubmission, noteDraft);
            setNoteDraft('');
          }}
          onSendBack={() => sendBackToDraft(openSubmission)}
          onAddNote={() => {
            addReviewerNote(openSubmission, noteDraft);
            setNoteDraft('');
          }}
        />
      )}
    </div>
  );
}

/* -------------------------------- drawer -------------------------------- */

function ReviewDrawer({
  submission,
  status,
  events,
  noteDraft,
  onNoteChange,
  onClose,
  onApprove,
  onPublish,
  onRequestChanges,
  onSendBack,
  onAddNote,
}: {
  submission: TeamLeader;
  status: SubmissionStatus;
  events: AuditEvent[];
  noteDraft: string;
  onNoteChange: (s: string) => void;
  onClose: () => void;
  onApprove: () => void;
  onPublish: () => void;
  onRequestChanges: () => void;
  onSendBack: () => void;
  onAddNote: () => void;
}) {
  const canApprove = status === 'Pending Review' || status === 'Needs Revision';
  const canPublish = status === 'Approved';
  const canRequestChanges = status === 'Pending Review' || status === 'Approved';
  const canSendBack = status !== 'Draft';

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end"
      onClick={onClose}
    >
      <aside
        className="w-full max-w-xl bg-white h-full overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="sticky top-0 bg-white border-b border-[var(--color-lf-border)] px-6 py-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[var(--color-lf-black)]">
              {submission.full_name}
            </h2>
            <p className="text-xs text-[var(--color-lf-muted)]">
              {formatNMLS(submission.nmls_number)} · {submission.service_areas[0]}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${STATUS_BADGE[status]}`}
            >
              {status}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-red-600"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </header>

        <div className="px-6 py-5 space-y-6">
          {/* Compliance checklist */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-lf-muted)] mb-2 inline-flex items-center gap-1.5">
              <ShieldCheck size={13} /> Compliance checklist
            </h3>
            <ul className="space-y-1.5">
              {REVIEW_CHECKLIST.map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-2 text-sm text-[var(--color-lf-black)]"
                >
                  <CheckCircle2
                    size={14}
                    className="text-[var(--color-lf-orange)] mt-0.5 shrink-0"
                  />
                  {line}
                </li>
              ))}
            </ul>
            <p className="text-[11px] text-[var(--color-lf-muted)] mt-2">
              Reviewer must mentally confirm each item before approving. Wire this to per-item
              checkboxes once Supabase is live.
            </p>
          </section>

          {/* Submission preview */}
          <section className="bg-[var(--color-lf-surface)] border border-[var(--color-lf-border)] rounded-2xl p-4 text-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-lf-muted)] mb-2">
              Summary
            </p>
            <p className="text-[var(--color-lf-black)] leading-relaxed">
              {submission.bio.slice(0, 220)}…
            </p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {submission.specialties.map((spec) => (
                <span
                  key={spec}
                  className="bg-[var(--color-lf-orange-soft)] text-[var(--color-lf-orange-dark)] text-[10px] font-semibold px-2 py-0.5 rounded-full"
                >
                  {spec}
                </span>
              ))}
            </div>
          </section>

          {/* Audit trail */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-lf-muted)] mb-2 inline-flex items-center gap-1.5">
              <History size={13} /> Audit trail
            </h3>
            {events.length === 0 ? (
              <p className="text-sm text-[var(--color-lf-muted)]">No events yet.</p>
            ) : (
              <ul className="space-y-2">
                {events.map((e) => (
                  <li
                    key={e.id}
                    className="border border-[var(--color-lf-border)] rounded-xl p-3 bg-white"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-[var(--color-lf-black)]">
                        {e.action}
                      </p>
                      <p className="text-[11px] text-[var(--color-lf-muted)]">
                        {new Date(e.at).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <p className="text-[11px] text-[var(--color-lf-muted)]">{e.actor}</p>
                    {e.note && (
                      <p className="text-sm text-[var(--color-lf-black)] bg-[var(--color-lf-surface)] border border-[var(--color-lf-border)] rounded-md px-2.5 py-1.5 mt-2 leading-relaxed">
                        {e.note}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Reviewer note */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-lf-muted)] mb-2 inline-flex items-center gap-1.5">
              <MessageSquare size={13} /> Reviewer note
            </h3>
            <textarea
              rows={3}
              value={noteDraft}
              onChange={(e) => onNoteChange(e.target.value)}
              placeholder="Add a note (used for Request Changes, or saved on its own)."
              className="w-full border border-[var(--color-lf-border)] rounded-xl px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[var(--color-lf-orange)]/30 focus:border-[var(--color-lf-orange)]"
            />
            <button
              type="button"
              onClick={onAddNote}
              disabled={!noteDraft.trim()}
              className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-lf-black)] bg-[var(--color-lf-surface)] hover:bg-gray-100 disabled:opacity-40 px-3 py-1.5 rounded-lg border border-[var(--color-lf-border)]"
            >
              <MessageSquare size={12} /> Save note only
            </button>
          </section>
        </div>

        {/* Sticky action bar */}
        <footer className="sticky bottom-0 bg-white border-t border-[var(--color-lf-border)] px-6 py-4 flex flex-wrap gap-2 justify-end">
          <button
            type="button"
            onClick={onSendBack}
            disabled={!canSendBack}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-lf-muted)] hover:text-[var(--color-lf-black)] disabled:opacity-40 px-3 py-2 rounded-xl"
          >
            <Undo2 size={14} /> Send back to Draft
          </button>
          <button
            type="button"
            onClick={onRequestChanges}
            disabled={!canRequestChanges || !noteDraft.trim()}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-700 hover:bg-amber-50 border border-amber-200 disabled:opacity-40 px-3 py-2 rounded-xl"
            title={!noteDraft.trim() ? 'Add a reviewer note explaining the change' : ''}
          >
            <FileEdit size={14} /> Request Changes
          </button>
          {canApprove && (
            <button
              type="button"
              onClick={onApprove}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-2 rounded-xl"
            >
              <CheckCircle2 size={14} /> Approve
            </button>
          )}
          {canPublish && (
            <button
              type="button"
              onClick={onPublish}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-white bg-[var(--color-lf-orange)] hover:bg-[var(--color-lf-orange-dark)] px-3.5 py-2 rounded-xl"
            >
              <SendHorizontal size={14} /> Publish
            </button>
          )}
        </footer>
      </aside>
    </div>
  );
}
