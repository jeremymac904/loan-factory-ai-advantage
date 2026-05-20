'use client';

import { useMemo, useState } from 'react';
import { CheckCircle2, Circle, ShieldAlert, ShieldCheck } from 'lucide-react';
import Topbar from '@/components/platform/Topbar';
import ComplianceBadge from '@/components/platform/ComplianceBadge';
import { currentUserProfile } from '@/lib/platform-mock-data';
import type { LoState } from '@/lib/platform-types';

interface ChecklistItem {
  id: string;
  label: string;
  detail: string;
  initiallyDone?: boolean;
}

interface ChecklistSection {
  key: string;
  title: string;
  description: string;
  items: ChecklistItem[];
  stateOnly?: LoState;
}

const ALL_SECTIONS: ChecklistSection[] = [
  {
    key: 'identity',
    title: 'Required identity disclosures',
    description: 'Shown on every public asset that mentions you or your mortgage business.',
    items: [
      {
        id: 'id-1',
        label: 'My full licensed name appears on the asset.',
        detail: 'Not a nickname or initials.',
        initiallyDone: true,
      },
      {
        id: 'id-2',
        label: 'Loan Factory wordmark is equal to or larger than my name / website.',
        detail: 'Required by policy 3.5.1.',
        initiallyDone: true,
      },
      {
        id: 'id-3',
        label: 'I am using my Loan Factory company email for all mortgage communications.',
        detail: 'Required by policy 3.4.',
        initiallyDone: true,
      },
    ],
  },
  {
    key: 'nmls',
    title: 'NMLS requirements',
    description:
      'Both individual and company NMLS numbers must appear on any mortgage-related asset.',
    items: [
      {
        id: 'nmls-1',
        label: 'My individual NMLS is on the asset.',
        detail: 'Example: NMLS #1195266.',
        initiallyDone: true,
      },
      {
        id: 'nmls-2',
        label: 'Loan Factory NMLS #320841 is on the asset.',
        detail: 'Required wherever my name, website, or mortgage business is mentioned.',
        initiallyDone: true,
      },
      {
        id: 'nmls-3',
        label: 'NMLS text is at least the same size as the smallest text in the image.',
        detail: 'See DRE 858 reference in the Marketing Policy.',
      },
    ],
  },
  {
    key: 'ehl',
    title: 'Equal Housing Lender',
    description: 'The Equal Housing Lender logo or text must appear on every mortgage marketing asset.',
    items: [
      {
        id: 'ehl-1',
        label: 'Equal Housing Lender logo or text appears on the visual.',
        detail: 'SVG mark preferred. Text-only is acceptable when image space is tight.',
        initiallyDone: true,
      },
    ],
  },
  {
    key: 'rate-apr',
    title: 'Rate and APR rules',
    description: 'Strict — applies to anything that displays or implies a rate.',
    items: [
      {
        id: 'rate-1',
        label: 'Every advertised interest rate also shows the APR.',
        detail: 'Same font, same size, same prominence as the rate.',
      },
      {
        id: 'rate-2',
        label: 'Trigger terms (down payment, monthly payment, term, finance charge) include a full sample scenario.',
        detail: 'Sample must list loan amount, term, rate, APR, P&I, and total of payments.',
      },
    ],
  },
  {
    key: 'prohibited',
    title: 'Prohibited claims',
    description: 'These phrases trigger immediate Marketing rejection.',
    items: [
      {
        id: 'pro-1',
        label: 'No "lowest rate" / "best rate" / "guaranteed rate" claims.',
        detail: 'Unsupported superlatives.',
        initiallyDone: true,
      },
      {
        id: 'pro-2',
        label: 'No "no closing costs" claim.',
        detail: 'Costs are paid via lender credits or built into the rate — never zero.',
        initiallyDone: true,
      },
      {
        id: 'pro-3',
        label: 'No correspondent / direct-lender language ("we fund", "we underwrite", "in-house underwriting").',
        detail: 'Loan Factory operates as a wholesale broker in this pilot.',
        initiallyDone: true,
      },
      {
        id: 'pro-4',
        label: 'No client non-public personal information (full name, SSN, DOB, employment, financials).',
        detail: 'Disclosure requires verbal or written consent on record.',
        initiallyDone: true,
      },
    ],
  },
  {
    key: 'state-nj',
    title: 'NJ — Licensed by NJ Department of Banking and Insurance',
    description: 'Required on every mortgage post when licensed in NJ.',
    stateOnly: 'NJ',
    items: [
      {
        id: 'nj-1',
        label: '"Licensed by the NJ Department of Banking and Insurance" appears on every mortgage post.',
        detail: 'Either in image or in caption.',
      },
      {
        id: 'nj-2',
        label: 'Team name / "Powered By" branding is NOT used on this asset.',
        detail: 'NJ prohibits team-name branding on marketing materials.',
      },
    ],
  },
  {
    key: 'state-ri',
    title: 'RI — RI licensed Mortgage Loan Originator + RI Licensed Loan Broker',
    description: 'Required on every mortgage post when licensed in RI.',
    stateOnly: 'RI',
    items: [
      {
        id: 'ri-1',
        label: '"RI licensed Mortgage Loan Originator" appears on the post.',
        detail: 'Either in image or caption.',
      },
      {
        id: 'ri-2',
        label: '"RI Licensed Loan Broker" appears on the post.',
        detail: 'Either in image or caption.',
      },
      {
        id: 'ri-3',
        label: 'Team name / "Powered By" branding is NOT used on this asset.',
        detail: 'RI prohibits team-name branding on marketing materials.',
      },
      {
        id: 'ri-4',
        label: 'Business card uses the Loan Factory San Jose office address.',
        detail: 'RI requirement.',
      },
    ],
  },
  {
    key: 'state-ma',
    title: 'MA — Rate / loan-term disclosure',
    description: 'Required on any post that mentions rates or loan terms when licensed in MA.',
    stateOnly: 'MA',
    items: [
      {
        id: 'ma-1',
        label: '"In Massachusetts: We arrange but do not make loans." appears on the post.',
        detail: 'Required wherever a rate or term is shown.',
      },
    ],
  },
  {
    key: 'state-tx',
    title: 'TX — Texas disclosures link',
    description: 'TX-licensed LOs must reference the company disclosure URL.',
    stateOnly: 'TX',
    items: [
      {
        id: 'tx-1',
        label: 'loanfactory.com/texas-disclosures appears in the About section or caption.',
        detail: 'Required for TX-licensed LOs.',
      },
    ],
  },
  {
    key: 'state-az',
    title: 'AZ — License display',
    description: 'AZ-licensed LOs must show both the company and individual AZ license numbers.',
    stateOnly: 'AZ',
    items: [
      {
        id: 'az-1',
        label: 'Company AZ license BK-2005457 appears on every mortgage post.',
        detail: 'Either in image or caption.',
      },
      {
        id: 'az-2',
        label: 'My individual AZ license number appears on every mortgage post.',
        detail: 'Either in image or caption.',
      },
    ],
  },
  {
    key: 'email',
    title: 'Company email requirement',
    description: 'All mortgage communications must use the appropriate Loan Factory company email.',
    items: [
      {
        id: 'em-1',
        label: 'I use my Loan Factory email for marketing replies and client comms.',
        detail: 'Required by policy 3.4.',
        initiallyDone: true,
      },
    ],
  },
  {
    key: 'team-name',
    title: 'Team name restrictions',
    description: 'Team names are prohibited in NJ and RI marketing materials.',
    items: [
      {
        id: 'team-1',
        label: 'If licensed in NJ or RI, this asset uses my individual licensed name or DBA — not a team name.',
        detail: 'Applies to domain names, websites, and social posts.',
      },
    ],
  },
  {
    key: 'review',
    title: 'Review submission process',
    description: 'Every public mortgage asset goes through Marketing before it ships.',
    items: [
      {
        id: 'rev-1',
        label: 'Asset has been submitted via the escalation desk or Content Studio review queue.',
        detail: 'Marketing audits monthly and posts to-do reminders.',
      },
      {
        id: 'rev-2',
        label: 'Marketing has approved the asset before any external publish.',
        detail: 'Required for the pilot — no exceptions.',
      },
    ],
  },
];

export default function CompliancePage() {
  const u = currentUserProfile;
  const initialDone = useMemo(() => {
    const set = new Set<string>();
    for (const s of ALL_SECTIONS) {
      for (const it of s.items) {
        if (it.initiallyDone) set.add(it.id);
      }
    }
    return set;
  }, []);
  const [done, setDone] = useState<Set<string>>(initialDone);

  const visibleSections = ALL_SECTIONS.filter(
    (s) => !s.stateOnly || u.licensed_states.includes(s.stateOnly),
  );

  const totalItems = visibleSections.reduce((acc, s) => acc + s.items.length, 0);
  const doneCount = visibleSections.reduce(
    (acc, s) => acc + s.items.filter((i) => done.has(i.id)).length,
    0,
  );
  const allClear = doneCount === totalItems;

  function toggle(id: string) {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <>
      <Topbar
        title="Compliance Checklist"
        subtitle={`Loan Factory Marketing Policy — adapts to your licensed states (${u.licensed_states.join(', ')}).`}
      />

      <div className="px-5 sm:px-8 py-8 space-y-6">
        {/* Summary */}
        <section
          className={`rounded-2xl p-5 border ${
            allClear ? 'bg-green-50 border-green-100' : 'bg-blue-50 border-blue-100'
          }`}
        >
          <div className="flex items-start gap-3">
            {allClear ? (
              <ShieldCheck className="text-green-600 shrink-0" size={22} />
            ) : (
              <ShieldAlert className="text-blue-600 shrink-0" size={22} />
            )}
            <div className="flex-1">
              <p className="font-semibold text-gray-800">
                {allClear
                  ? 'All required items checked. Submit for Marketing review when ready.'
                  : `${doneCount} of ${totalItems} required items checked.`}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                This checklist is a UI helper — Marketing review is still the source of truth before any
                public publish. State-specific sections appear only for states you are licensed in.
              </p>
            </div>
            <ComplianceBadge
              kind={allClear ? 'approved' : 'pending-review'}
              label={allClear ? 'Clear' : 'In progress'}
            />
          </div>
        </section>

        {/* Sections */}
        {visibleSections.map((section) => {
          const sectionDone = section.items.filter((i) => done.has(i.id)).length;
          const sectionTotal = section.items.length;
          const sectionClear = sectionDone === sectionTotal;
          return (
            <section
              key={section.key}
              className="bg-white border border-[var(--color-lf-border)] rounded-2xl"
            >
              <div className="px-5 py-4 border-b border-gray-50 flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">{section.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{section.description}</p>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 whitespace-nowrap">
                  {sectionDone} / {sectionTotal}{' '}
                  {sectionClear ? (
                    <CheckCircle2
                      size={12}
                      className="inline -mt-0.5 ml-1 text-green-600"
                      aria-hidden
                    />
                  ) : null}
                </span>
              </div>
              <ul className="divide-y divide-gray-50">
                {section.items.map((it) => {
                  const checked = done.has(it.id);
                  return (
                    <li key={it.id}>
                      <button
                        type="button"
                        onClick={() => toggle(it.id)}
                        className="w-full text-left px-5 py-4 hover:bg-gray-50/60 flex items-start gap-3"
                      >
                        {checked ? (
                          <CheckCircle2
                            size={16}
                            className="text-green-600 mt-0.5 shrink-0"
                          />
                        ) : (
                          <Circle size={16} className="text-gray-300 mt-0.5 shrink-0" />
                        )}
                        <div className="min-w-0">
                          <p
                            className={`text-sm ${
                              checked ? 'text-gray-500 line-through' : 'text-gray-800 font-medium'
                            }`}
                          >
                            {it.label}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">{it.detail}</p>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}

        <p className="text-[11px] text-gray-400 text-center pt-2">
          Full policy: see Loan Factory Marketing & Advertising Policy in Marketing&apos;s Drive.
          State-specific sections shown above are derived from your Profile&apos;s licensed states.
        </p>
      </div>
    </>
  );
}
