'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { mockTeamLeaders } from '@/lib/mock-data';
import { statusColor, statusLabel, formatNMLS } from '@/lib/utils';
import type { TeamLeader, TeamLeaderStatus } from '@/lib/types';
import { CheckCircle, Eye, Globe, Users, Clock, FileEdit, RotateCcw } from 'lucide-react';

type Filter = 'all' | 'pending' | 'approved' | 'live' | 'draft';

const FILTERS: { key: Filter; label: string; status?: TeamLeaderStatus }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending', status: 'pending_review' },
  { key: 'approved', label: 'Approved', status: 'approved' },
  { key: 'live', label: 'Live', status: 'published' },
  { key: 'draft', label: 'Draft', status: 'draft' },
];

export default function AdminPage() {
  const [leaders, setLeaders] = useState<TeamLeader[]>(mockTeamLeaders);
  const [filter, setFilter] = useState<Filter>('all');
  const [toast, setToast] = useState<string | null>(null);

  const stats = useMemo(
    () => ({
      total: leaders.length,
      pending: leaders.filter((t) => t.status === 'pending_review').length,
      approved: leaders.filter((t) => t.status === 'approved').length,
      live: leaders.filter((t) => t.status === 'published').length,
    }),
    [leaders],
  );

  const visible = useMemo(() => {
    if (filter === 'all') return leaders;
    const target = FILTERS.find((f) => f.key === filter)?.status;
    return leaders.filter((l) => l.status === target);
  }, [leaders, filter]);

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  }

  function updateStatus(id: string, status: TeamLeaderStatus, msg: string) {
    setLeaders((prev) =>
      prev.map((l) =>
        l.id === id
          ? {
              ...l,
              status,
              updated_at: new Date().toISOString(),
              approved_at: status === 'approved' ? new Date().toISOString() : l.approved_at,
              approved_by: status === 'approved' ? 'marketing@loanfactory.com' : l.approved_by,
            }
          : l,
      ),
    );
    flash(msg);
  }

  function resetDemo() {
    setLeaders(mockTeamLeaders);
    flash('Demo data reset');
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-[#003087] text-white px-4 py-3 rounded-xl shadow-lg text-sm font-semibold animate-in fade-in slide-in-from-top-2">
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-[#003087]">Marketing Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Review and approve Team Leader website submissions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={resetDemo}
            className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#003087] font-semibold"
          >
            <RotateCcw size={13} /> Reset demo
          </button>
          <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1.5 rounded-full">
            Demo Mode
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          {
            label: 'Total Submitted',
            value: stats.total,
            icon: <Users size={20} />,
            color: 'text-[#003087] bg-blue-50',
          },
          {
            label: 'Pending Review',
            value: stats.pending,
            icon: <Clock size={20} />,
            color: 'text-yellow-700 bg-yellow-50',
          },
          {
            label: 'Approved',
            value: stats.approved,
            icon: <CheckCircle size={20} />,
            color: 'text-blue-700 bg-blue-50',
          },
          {
            label: 'Live Sites',
            value: stats.live,
            icon: <Globe size={20} />,
            color: 'text-green-700 bg-green-50',
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
            <div
              className={`inline-flex items-center justify-center w-9 h-9 rounded-lg ${stat.color} mb-3`}
            >
              {stat.icon}
            </div>
            <p className="text-3xl font-black text-gray-800">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
          <h2 className="font-semibold text-gray-800">All Submissions</h2>
          <div className="flex gap-2 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={`text-xs px-3 py-1.5 rounded-full border font-semibold transition-colors ${
                  filter === f.key
                    ? 'bg-[#003087] border-[#003087] text-white'
                    : 'border-gray-200 text-gray-600 hover:border-[#003087] hover:text-[#003087]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {visible.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-500">
            No submissions in this view.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">NMLS</th>
                  <th className="px-6 py-3 text-left">Languages</th>
                  <th className="px-6 py-3 text-left">Areas</th>
                  <th className="px-6 py-3 text-left">Submitted</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {visible.map((tl) => (
                  <tr key={tl.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-[#003087]">{tl.full_name}</td>
                    <td className="px-6 py-4 text-gray-500">{formatNMLS(tl.nmls_number)}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {tl.languages.map((l) => (
                          <span
                            key={l}
                            className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full"
                          >
                            {l}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {tl.service_areas.slice(0, 2).join(', ')}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(tl.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor(tl.status)}`}
                      >
                        {statusLabel(tl.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link
                          href={`/site/${tl.slug}`}
                          className="inline-flex items-center gap-1 text-xs text-[#003087] hover:underline font-medium"
                        >
                          <Eye size={13} /> Preview
                        </Link>
                        {tl.status === 'pending_review' && (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                updateStatus(tl.id, 'approved', `${tl.full_name} approved`)
                              }
                              className="inline-flex items-center gap-1 text-xs bg-green-600 text-white px-2.5 py-1 rounded-lg hover:bg-green-700 font-medium"
                            >
                              <CheckCircle size={13} /> Approve
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                updateStatus(
                                  tl.id,
                                  'draft',
                                  `${tl.full_name} sent back for revision`,
                                )
                              }
                              className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg hover:bg-gray-200 font-medium"
                            >
                              <FileEdit size={13} /> Revise
                            </button>
                          </>
                        )}
                        {tl.status === 'approved' && (
                          <button
                            type="button"
                            onClick={() =>
                              updateStatus(
                                tl.id,
                                'published',
                                `${tl.full_name} published — site is live`,
                              )
                            }
                            className="inline-flex items-center gap-1 text-xs bg-[#003087] text-white px-2.5 py-1 rounded-lg hover:bg-[#002060] font-medium"
                          >
                            <Globe size={13} /> Publish
                          </button>
                        )}
                        {tl.status === 'draft' && (
                          <button
                            type="button"
                            onClick={() =>
                              updateStatus(
                                tl.id,
                                'pending_review',
                                `${tl.full_name} resubmitted for review`,
                              )
                            }
                            className="inline-flex items-center gap-1 text-xs bg-amber-500 text-white px-2.5 py-1 rounded-lg hover:bg-amber-600 font-medium"
                          >
                            <Clock size={13} /> Resubmit
                          </button>
                        )}
                        {tl.status === 'published' && (
                          <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                            <Globe size={13} /> Live
                          </span>
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

      <p className="text-xs text-gray-400 mt-6 text-center">
        Demo dashboard — all state is in-browser. Approvals and publishes don&apos;t persist.
      </p>
    </div>
  );
}
