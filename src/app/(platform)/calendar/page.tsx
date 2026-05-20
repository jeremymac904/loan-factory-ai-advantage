'use client';

import { useMemo, useState } from 'react';
import { CalendarDays, Plus, X } from 'lucide-react';
import Topbar from '@/components/platform/Topbar';
import ComplianceBadge, { type ComplianceBadgeKind } from '@/components/platform/ComplianceBadge';
import { calendarItems } from '@/lib/platform-mock-data';
import type { ContentStatus } from '@/lib/platform-types';

const STATUS_LIST: ContentStatus[] = [
  'Draft',
  'Needs Review',
  'Scheduled',
  'Approved',
  'Published',
];

function statusToKind(s: ContentStatus): ComplianceBadgeKind {
  switch (s) {
    case 'Draft':
      return 'needs-personalization';
    case 'Needs Review':
      return 'pending-review';
    case 'Approved':
      return 'approved';
    case 'Published':
      return 'pre-approved';
    case 'Scheduled':
      return 'approved';
    default:
      return 'needs-personalization';
  }
}

function startOfWeek(d: Date): Date {
  const day = d.getDay(); // 0 = Sunday
  const result = new Date(d);
  result.setDate(d.getDate() - day);
  result.setHours(0, 0, 0, 0);
  return result;
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(d.getDate() + n);
  return r;
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function CalendarPage() {
  // Anchor to the week containing the earliest scheduled item so the demo always shows content.
  const initialAnchor = useMemo(() => {
    const earliest = [...calendarItems]
      .map((c) => new Date(c.scheduled_for))
      .sort((a, b) => a.getTime() - b.getTime())[0];
    return earliest ? startOfWeek(earliest) : startOfWeek(new Date());
  }, []);

  const [weekStart, setWeekStart] = useState<Date>(initialAnchor);
  const [statusFilter, setStatusFilter] = useState<ContentStatus | null>(null);
  const [showSchedule, setShowSchedule] = useState(false);

  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);

  const itemsByDay = useMemo(() => {
    const map = new Map<string, typeof calendarItems>();
    for (const day of days) {
      const key = day.toISOString();
      const items = calendarItems
        .filter((c) => sameDay(new Date(c.scheduled_for), day))
        .filter((c) => !statusFilter || c.status === statusFilter)
        .sort((a, b) => a.scheduled_for.localeCompare(b.scheduled_for));
      map.set(key, items);
    }
    return map;
  }, [days, statusFilter]);

  return (
    <>
      <Topbar
        title="Content Calendar"
        subtitle="Weekly view. Scheduling here is for planning only — no external posting until Marketing approves the loop."
        rightSlot={
          <button
            type="button"
            onClick={() => setShowSchedule(true)}
            className="inline-flex items-center gap-1.5 bg-[var(--color-lf-orange)] hover:bg-[var(--color-lf-orange-dark)] text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors"
          >
            <Plus size={14} /> Schedule
          </button>
        }
      />

      <div className="px-5 sm:px-8 py-8 space-y-6">
        {/* Controls */}
        <section className="bg-white border border-[var(--color-lf-border)] rounded-2xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setWeekStart(addDays(weekStart, -7))}
              className="text-xs font-semibold text-gray-600 hover:text-[#003087] border border-gray-200 px-3 py-1.5 rounded-lg"
            >
              ← Previous week
            </button>
            <p className="text-sm font-semibold text-[#003087]">
              {weekStart.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} —{' '}
              {addDays(weekStart, 6).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
            <button
              type="button"
              onClick={() => setWeekStart(addDays(weekStart, 7))}
              className="text-xs font-semibold text-gray-600 hover:text-[#003087] border border-gray-200 px-3 py-1.5 rounded-lg"
            >
              Next week →
            </button>
            <button
              type="button"
              onClick={() => setWeekStart(initialAnchor)}
              className="text-xs font-semibold text-[var(--color-lf-orange-dark)] hover:underline"
            >
              Demo week
            </button>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setStatusFilter(null)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${
                statusFilter === null
                  ? 'bg-[#003087] border-[#003087] text-white'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-[#003087] hover:text-[#003087]'
              }`}
            >
              All
            </button>
            {STATUS_LIST.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(statusFilter === s ? null : s)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${
                  statusFilter === s
                    ? 'bg-[#003087] border-[#003087] text-white'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-[#003087] hover:text-[#003087]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </section>

        {/* Week grid */}
        <section className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {days.map((day) => {
            const key = day.toISOString();
            const items = itemsByDay.get(key) ?? [];
            const isToday = sameDay(day, new Date());
            return (
              <div
                key={key}
                className={`bg-white border rounded-2xl min-h-[180px] flex flex-col ${
                  isToday ? 'border-[var(--color-lf-orange)]' : 'border-[var(--color-lf-border)]'
                }`}
              >
                <div
                  className={`px-3 py-2.5 border-b border-gray-50 flex items-center justify-between text-xs ${
                    isToday ? 'bg-[var(--color-lf-orange-soft)]' : ''
                  }`}
                >
                  <span className="font-bold text-gray-700 uppercase tracking-widest">
                    {day.toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <span className={isToday ? 'text-[var(--color-lf-orange-dark)] font-bold' : 'text-gray-400'}>
                    {day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <div className="flex-1 p-2 space-y-2">
                  {items.length === 0 ? (
                    <button
                      type="button"
                      onClick={() => setShowSchedule(true)}
                      className="w-full h-full min-h-[100px] text-[11px] text-gray-300 hover:text-[var(--color-lf-orange-dark)] hover:bg-[var(--color-lf-orange-soft)]/40 rounded-lg border border-dashed border-transparent hover:border-[var(--color-lf-orange)]/30 flex items-center justify-center"
                    >
                      + Schedule
                    </button>
                  ) : (
                    items.map((it) => (
                      <div
                        key={it.id}
                        className="bg-gray-50 hover:bg-white hover:border-[var(--color-lf-orange)] border border-transparent rounded-lg p-2.5 transition-colors"
                      >
                        <p className="text-[11px] font-semibold text-gray-800 leading-tight line-clamp-2">
                          {it.title}
                        </p>
                        <div className="flex items-center justify-between mt-1.5">
                          <span className="text-[10px] text-gray-400">
                            {new Date(it.scheduled_for).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                          </span>
                          <span className="text-[10px] font-medium text-gray-500">
                            {it.channel}
                          </span>
                        </div>
                        <div className="mt-1.5">
                          <ComplianceBadge kind={statusToKind(it.status)} label={it.status} />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </section>

        <p className="text-[11px] text-gray-400 text-center">
          External posting is <span className="font-semibold">disabled</span> for the pilot. Manage that
          in Settings → Publishing Controls.
        </p>
      </div>

      {/* Schedule modal */}
      {showSchedule && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowSchedule(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-lf-orange-soft)] text-[var(--color-lf-orange-dark)] flex items-center justify-center">
                  <CalendarDays size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Schedule a post</h3>
                  <p className="text-xs text-gray-500">Demo modal — nothing is published.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSchedule(false)}
                className="p-1 text-gray-400 hover:text-red-600"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-1">
                  Draft
                </label>
                <select className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white">
                  <option>VA Loan Zero-Down Reel — June</option>
                  <option>DSCR Investor Carousel — Portfolio Builder</option>
                  <option>Saturday Buyer Workshop</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-1">
                  Channel
                </label>
                <select className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white">
                  <option>Instagram</option>
                  <option>Facebook</option>
                  <option>LinkedIn</option>
                  <option>TikTok</option>
                  <option>Email</option>
                </select>
              </div>
              <p className="text-[11px] text-gray-400 bg-gray-50 border border-gray-100 rounded-md p-3">
                External posting is disabled during the pilot. Scheduling here only updates the
                planning calendar.
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSchedule(false)}
                  className="text-sm font-semibold text-gray-600 hover:text-[#003087] px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setShowSchedule(false)}
                  className="bg-[var(--color-lf-orange)] hover:bg-[var(--color-lf-orange-dark)] text-white text-sm font-bold px-4 py-2 rounded-lg"
                >
                  Add to Calendar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
