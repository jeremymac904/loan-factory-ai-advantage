'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Eye,
  Inbox,
  MailQuestion,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import {
  WORKSPACE_CHECKLIST,
  mockAccessRequests,
  type WorkspaceChecklistItem,
} from '@/lib/access-request-mock-data';
import {
  APPROVAL_AUDIENCE,
  type AccessRequest,
  type AccessRequestStatus,
} from '@/lib/request-access-types';

type Filter = 'all' | AccessRequestStatus;

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'new', label: 'New' },
  { key: 'needs-info', label: 'Needs Info' },
  { key: 'approved', label: 'Approved' },
  { key: 'workspace-created', label: 'Workspace Created' },
  { key: 'in-setup', label: 'In Setup' },
  { key: 'ready-for-review', label: 'Ready for Review' },
  { key: 'live', label: 'Live' },
  { key: 'rejected', label: 'Rejected' },
];

const STATUS_LABEL: Record<AccessRequestStatus, string> = {
  new: 'New Request',
  'needs-info': 'Needs Info',
  approved: 'Approved',
  rejected: 'Rejected',
  'workspace-created': 'Workspace Created',
  'in-setup': 'In Setup',
  'ready-for-review': 'Ready for Review',
  live: 'Live',
  archived: 'Archived',
};

const STATUS_TONE: Record<AccessRequestStatus, string> = {
  new: 'bg-blue-50 text-blue-700 border border-blue-100',
  'needs-info': 'bg-amber-50 text-amber-700 border border-amber-100',
  approved: 'bg-green-50 text-green-700 border border-green-100',
  rejected: 'bg-red-50 text-red-700 border border-red-100',
  'workspace-created': 'bg-[var(--color-lf-orange-soft)] text-[var(--color-lf-orange-dark)] border border-orange-100',
  'in-setup': 'bg-purple-50 text-purple-700 border border-purple-100',
  'ready-for-review': 'bg-indigo-50 text-indigo-700 border border-indigo-100',
  live: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  archived: 'bg-gray-50 text-gray-500 border border-gray-100',
};

interface Workspace {
  id: string;
  request_id: string;
  team_or_leader_name: string;
  created_at: string;
  checklist: WorkspaceChecklistItem[];
}

export default function AdminIntakePage() {
  const [requests, setRequests] = useState<AccessRequest[]>(mockAccessRequests);
  const [filter, setFilter] = useState<Filter>('all');
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [confirmCreateId, setConfirmCreateId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const stats = useMemo(() => {
    const byStatus = (s: AccessRequestStatus) => requests.filter((r) => r.status === s).length;
    return {
      total: requests.length,
      newCount: byStatus('new'),
      needsInfo: byStatus('needs-info'),
      approved: byStatus('approved'),
      workspaces: workspaces.length,
    };
  }, [requests, workspaces]);

  const visible = useMemo(() => {
    if (filter === 'all') return requests;
    return requests.filter((r) => r.status === filter);
  }, [filter, requests]);

  const open = useMemo(() => requests.find((r) => r.id === openId) ?? null, [openId, requests]);

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  }

  function updateStatus(id: string, status: AccessRequestStatus, msg: string) {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status,
              updated_at: new Date().toISOString(),
              reviewer: r.reviewer ?? 'Demo Admin',
            }
          : r,
      ),
    );
    flash(msg);
  }

  function createWorkspace(req: AccessRequest) {
    const workspace: Workspace = {
      id: `ws_${req.id}`,
      request_id: req.id,
      team_or_leader_name: req.team_name || req.full_name,
      created_at: new Date().toISOString(),
      checklist: WORKSPACE_CHECKLIST,
    };
    setWorkspaces((prev) => (prev.some((w) => w.request_id === req.id) ? prev : [workspace, ...prev]));
    updateStatus(req.id, 'workspace-created', `${workspace.team_or_leader_name} workspace created`);
  }

  function resetDemo() {
    setRequests(mockAccessRequests);
    setWorkspaces([]);
    flash('Demo reset');
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-[var(--color-lf-black)] text-white text-sm font-semibold px-4 py-3 rounded-xl shadow-lg">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
        <div>
          <span className="inline-flex items-center gap-1.5 bg-[var(--color-lf-orange-soft)] text-[var(--color-lf-orange-dark)] text-[11px] font-bold uppercase tracking-[0.18em] px-3 py-1 rounded-full mb-2">
            <Sparkles size={11} /> Admin Intake
          </span>
          <h1 className="text-3xl font-black text-[var(--color-lf-black)] tracking-tight">
            Pilot access requests
          </h1>
          <p className="text-[var(--color-lf-muted)] mt-1 max-w-xl">
            Review, approve, and spin up Team Leader workspaces. Reviewers:{' '}
            {APPROVAL_AUDIENCE.join(', ')}.
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
          <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1.5 rounded-full">
            Demo Mode
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'All requests', value: stats.total, icon: <Inbox size={18} />, tone: 'navy' },
          { label: 'New', value: stats.newCount, icon: <MailQuestion size={18} />, tone: 'blue' },
          { label: 'Needs info', value: stats.needsInfo, icon: <Eye size={18} />, tone: 'amber' },
          { label: 'Approved', value: stats.approved, icon: <CheckCircle2 size={18} />, tone: 'green' },
          {
            label: 'Workspaces created',
            value: stats.workspaces,
            icon: <Users size={18} />,
            tone: 'orange',
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white border border-[var(--color-lf-border)] rounded-2xl p-5"
          >
            <div
              className={`inline-flex items-center justify-center w-9 h-9 rounded-lg mb-3 ${
                s.tone === 'navy'
                  ? 'bg-blue-50 text-[#003087]'
                  : s.tone === 'blue'
                  ? 'bg-blue-50 text-blue-700'
                  : s.tone === 'amber'
                  ? 'bg-amber-50 text-amber-700'
                  : s.tone === 'green'
                  ? 'bg-green-50 text-green-700'
                  : 'bg-[var(--color-lf-orange-soft)] text-[var(--color-lf-orange-dark)]'
              }`}
            >
              {s.icon}
            </div>
            <p className="text-3xl font-black text-[var(--color-lf-black)]">{s.value}</p>
            <p className="text-sm text-[var(--color-lf-muted)] mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Sub-nav */}
      <div className="flex items-center gap-2 flex-wrap mb-5">
        <Link
          href="/admin"
          className="text-xs font-bold text-[var(--color-lf-muted)] hover:text-[var(--color-lf-black)] bg-white border border-[var(--color-lf-border)] px-3 py-1.5 rounded-full"
        >
          ← Marketing Review Queue
        </Link>
        <Link
          href="/request-access"
          className="text-xs font-bold text-[var(--color-lf-orange-dark)] hover:underline ml-auto inline-flex items-center gap-1"
        >
          Submit a new request <ArrowRight size={11} />
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white border border-[var(--color-lf-border)] rounded-2xl p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                filter === f.key
                  ? 'bg-[var(--color-lf-black)] border-[var(--color-lf-black)] text-white'
                  : 'bg-white border-[var(--color-lf-border)] text-[var(--color-lf-muted)] hover:border-[var(--color-lf-black)] hover:text-[var(--color-lf-black)]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-[var(--color-lf-muted)] mt-3">
          Showing <span className="font-bold text-[var(--color-lf-black)]">{visible.length}</span> of{' '}
          {requests.length}
        </p>
      </div>

      {/* Table */}
      <div className="bg-white border border-[var(--color-lf-border)] rounded-2xl overflow-hidden">
        {visible.length === 0 ? (
          <div className="py-16 text-center text-sm text-[var(--color-lf-muted)]">
            No requests in this view.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--color-lf-surface)] text-xs font-bold text-[var(--color-lf-muted)] uppercase tracking-wide">
                  <th className="px-5 py-3 text-left">Requester</th>
                  <th className="px-5 py-3 text-left">Role · Group</th>
                  <th className="px-5 py-3 text-left">Markets</th>
                  <th className="px-5 py-3 text-left">Submitted</th>
                  <th className="px-5 py-3 text-left">Status</th>
                  <th className="px-5 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {visible.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/60">
                    <td className="px-5 py-4">
                      <p className="font-bold text-[var(--color-lf-black)]">{r.full_name}</p>
                      <p className="text-[11px] text-[var(--color-lf-muted)]">
                        NMLS #{r.nmls_number} · {r.loan_factory_email}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-[var(--color-lf-muted)] text-xs">
                      {r.current_role}
                      <br />
                      {r.group_type}
                    </td>
                    <td className="px-5 py-4 text-[var(--color-lf-muted)] text-xs">
                      {r.primary_markets}
                    </td>
                    <td className="px-5 py-4 text-[var(--color-lf-muted)] text-xs">
                      {new Date(r.submitted_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-block text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${STATUS_TONE[r.status]}`}
                      >
                        {STATUS_LABEL[r.status]}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => setOpenId(r.id)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-lf-muted)] hover:text-[var(--color-lf-black)]"
                        >
                          <Eye size={12} /> Review
                        </button>
                        {r.status !== 'workspace-created' &&
                          r.status !== 'in-setup' &&
                          r.status !== 'live' &&
                          r.status !== 'rejected' && (
                            <button
                              type="button"
                              onClick={() =>
                                updateStatus(r.id, 'needs-info', `${r.full_name} flagged for info`)
                              }
                              className="inline-flex items-center gap-1 text-xs bg-amber-100 text-amber-800 px-2.5 py-1 rounded-lg hover:bg-amber-200 font-semibold"
                            >
                              Request info
                            </button>
                          )}
                        {(r.status === 'new' || r.status === 'needs-info') && (
                          <button
                            type="button"
                            onClick={() =>
                              updateStatus(r.id, 'approved', `${r.full_name} approved for pilot`)
                            }
                            className="inline-flex items-center gap-1 text-xs bg-green-600 text-white px-2.5 py-1 rounded-lg hover:bg-green-700 font-semibold"
                          >
                            Approve
                          </button>
                        )}
                        {r.status === 'approved' && (
                          <button
                            type="button"
                            onClick={() => setConfirmCreateId(r.id)}
                            className="inline-flex items-center gap-1 text-xs bg-[var(--color-lf-orange)] text-white px-2.5 py-1 rounded-lg hover:bg-[var(--color-lf-orange-dark)] font-semibold"
                          >
                            Create Workspace
                          </button>
                        )}
                        {(r.status === 'new' || r.status === 'needs-info') && (
                          <button
                            type="button"
                            onClick={() =>
                              updateStatus(r.id, 'rejected', `${r.full_name} rejected`)
                            }
                            className="inline-flex items-center gap-1 text-xs text-red-700 hover:underline font-semibold"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Workspaces created */}
      {workspaces.length > 0 && (
        <section className="mt-10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--color-lf-muted)]">
              Workspaces created (demo)
            </h2>
            <Link
              href="/dashboard"
              className="text-xs font-semibold text-[var(--color-lf-orange-dark)] hover:underline inline-flex items-center gap-1"
            >
              Open Dashboard <ArrowRight size={11} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {workspaces.map((ws) => (
              <div
                key={ws.id}
                className="bg-white border border-[var(--color-lf-border)] rounded-2xl p-5"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-9 h-9 rounded-lg bg-[var(--color-lf-orange-soft)] text-[var(--color-lf-orange-dark)] flex items-center justify-center">
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <p className="font-bold text-[var(--color-lf-black)] text-sm">
                      {ws.team_or_leader_name}
                    </p>
                    <p className="text-[10px] text-[var(--color-lf-muted)]">
                      Created{' '}
                      {new Date(ws.created_at).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                <ul className="space-y-1.5 text-[11px] mt-3">
                  {ws.checklist.map((item) => (
                    <li
                      key={item.key}
                      className="flex items-start gap-2 text-[var(--color-lf-muted)]"
                    >
                      <ClipboardCheck size={11} className="mt-0.5 text-[var(--color-lf-orange)]" />
                      <span>
                        {item.label}
                        {item.required && (
                          <span className="text-[var(--color-lf-orange)] ml-1">*</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Create Workspace confirmation modal */}
      {confirmCreateId && (() => {
        const req = requests.find((r) => r.id === confirmCreateId);
        if (!req) return null;
        return (
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setConfirmCreateId(null)}
          >
            <div
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[var(--color-lf-orange-dark)] bg-[var(--color-lf-orange-soft)] px-2 py-0.5 rounded-full mb-2">
                    <ShieldCheck size={11} /> Create Workspace
                  </span>
                  <h3 className="text-xl font-black text-[var(--color-lf-black)] tracking-tight">
                    {req.team_name || req.full_name}
                  </h3>
                  <p className="text-xs text-[var(--color-lf-muted)] mt-0.5">
                    NMLS #{req.nmls_number} · {req.primary_markets}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setConfirmCreateId(null)}
                  className="p-1 text-[var(--color-lf-muted)] hover:text-red-600"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <p className="text-sm text-[var(--color-lf-muted)] mb-4 leading-relaxed">
                Creating a workspace will spin up the following resources in demo mode. Nothing
                external is created until Supabase persistence is wired.
              </p>

              <ul className="space-y-2 mb-5">
                {[
                  'Team or group profile draft',
                  'Branding checklist (logo, colors, headshot)',
                  'Recommended template assigned',
                  'AI Twin setup checklist',
                  'Starter content pack recommendation',
                  'Training kit recommendation',
                  'Compliance checklist seeded',
                  'Marketing review queue created',
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-[var(--color-lf-black)]"
                  >
                    <CheckCircle2
                      size={14}
                      className="text-[var(--color-lf-orange)] mt-0.5 shrink-0"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[var(--color-lf-border)]">
                <button
                  type="button"
                  onClick={() => setConfirmCreateId(null)}
                  className="text-sm font-semibold text-[var(--color-lf-muted)] hover:text-[var(--color-lf-black)] px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    createWorkspace(req);
                    setConfirmCreateId(null);
                  }}
                  className="inline-flex items-center gap-1.5 bg-[var(--color-lf-orange)] hover:bg-[var(--color-lf-orange-dark)] text-white text-sm font-bold px-4 py-2 rounded-xl"
                >
                  <ShieldCheck size={14} /> Confirm & Create
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Drawer / modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex justify-end"
          onClick={() => setOpenId(null)}
        >
          <div
            className="bg-white h-full w-full max-w-lg shadow-2xl overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-black text-[var(--color-lf-black)]">
                  {open.full_name}
                </h3>
                <p className="text-xs text-[var(--color-lf-muted)]">
                  NMLS #{open.nmls_number} · {open.loan_factory_email}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpenId(null)}
                className="p-1 text-[var(--color-lf-muted)] hover:text-red-600"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <span
              className={`inline-block text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full mb-4 ${STATUS_TONE[open.status]}`}
            >
              {STATUS_LABEL[open.status]}
            </span>
            <dl className="space-y-3 text-sm">
              <Row label="Role / Group">
                {open.current_role} · {open.group_type}
              </Row>
              <Row label="Team">{open.team_name || '—'}</Row>
              <Row label="Markets">{open.primary_markets}</Row>
              <Row label="Languages">{open.languages_served || '—'}</Row>
              <Row label="Loan focus">{open.loan_focus_areas || '—'}</Row>
              <Row label="Pilot">{open.is_pilot_request ? 'Yes' : 'No'}</Row>
              <Row label="Marketing goals">{open.marketing_goals || '—'}</Row>
              <Row label="Support needs">{open.support_needs || '—'}</Row>
              {open.reviewer_notes && <Row label="Reviewer notes">{open.reviewer_notes}</Row>}
            </dl>
          </div>
        </div>
      )}

      <p className="text-[11px] text-[var(--color-lf-muted)] text-center mt-10">
        Loan Factory, NMLS #320841 · Equal Housing Lender · Demo mode — workspaces persist in
        browser state only until Supabase is wired.
      </p>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-lf-muted)] mb-0.5">
        {label}
      </dt>
      <dd className="text-[var(--color-lf-black)] leading-snug">{children}</dd>
    </div>
  );
}
