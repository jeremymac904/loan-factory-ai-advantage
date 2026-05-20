// Compliance helpers for the (platform) marketing studio.
//
// Source of truth: Loan Factory Marketing & Advertising Policy
// (see docs/PILOT_SCOPE.md and the policy doc in Marketing's Drive).
//
// These are intentionally simple string-match heuristics. They exist to FLAG
// risk before Marketing review — not to replace Marketing review. A blocking
// rule means we should not let the user submit; a warning means we surface
// the issue but the user can proceed; an info note just educates.
//
// All checks must keep Loan Factory's wholesale broker positioning intact:
// no correspondent / "we fund" / "in-house underwriting" language.

import type {
  ComplianceCheckResult,
  ComplianceSeverity,
  LoState,
} from './platform-types';

export interface ComplianceContext {
  /** Full content body (caption + visual notes joined). */
  content: string;
  /** Optional separate caption field (for posts that have one). */
  caption?: string;
  /** States the LO is licensed in — drives state-specific rules. */
  licensedStates: LoState[];
  /** LO's NMLS — if missing, we treat NMLS requirements as failing. */
  loNmls?: string;
  /** True if the LO is using a team name / DBA on this asset. */
  usingTeamName?: boolean;
  /** Loan Factory company NMLS — constant. */
  companyNmls?: string;
}

export const LOAN_FACTORY_COMPANY_NMLS = '320841';

// --- Word lists ----------------------------------------------------------

const MORTGAGE_TRIGGER_WORDS = [
  'mortgage',
  'loan',
  'refinance',
  'refi',
  'fha',
  'va loan',
  'usda',
  'dscr',
  'jumbo',
  'website',
  'rate',
  'apr',
  'pre-approval',
  'preapproval',
  'pre approval',
  'closing cost',
];

const RATE_INDICATORS = ['%', 'rate', 'apr', 'interest'];

const PROHIBITED_PHRASES: { phrase: string; reason: string }[] = [
  { phrase: 'lowest rate', reason: 'Unsupported superlative claim.' },
  { phrase: 'lowest rates', reason: 'Unsupported superlative claim.' },
  { phrase: 'best rate', reason: 'Unsupported superlative claim.' },
  { phrase: 'best rates', reason: 'Unsupported superlative claim.' },
  {
    phrase: 'no closing cost',
    reason: 'Closing costs are not zero — they are paid by lender credits or built into the rate. Cannot advertise as "no closing costs."',
  },
  {
    phrase: 'no closing costs',
    reason: 'Closing costs are not zero — they are paid by lender credits or built into the rate. Cannot advertise as "no closing costs."',
  },
  { phrase: 'guaranteed rate', reason: 'Rates cannot be guaranteed until locked and disclosed.' },
  { phrase: 'guaranteed rates', reason: 'Rates cannot be guaranteed until locked and disclosed.' },
  { phrase: 'guaranteed approval', reason: 'Loan approval is subject to credit and property underwriting.' },
  { phrase: 'guaranteed loan', reason: 'Loan approval is subject to credit and property underwriting.' },
  { phrase: 'we fund', reason: 'Correspondent / direct-lender language. Loan Factory is a wholesale broker.' },
  { phrase: 'we underwrite', reason: 'Correspondent / direct-lender language. Loan Factory is a wholesale broker.' },
  { phrase: 'in-house underwriting', reason: 'Correspondent / direct-lender language. Loan Factory is a wholesale broker.' },
  { phrase: 'free refinance', reason: 'Refinances have closing costs — they are paid by lender credits or built into the rate. Cannot advertise as "free."' },
  { phrase: 'no fees', reason: 'Loans carry origination, lender, and third-party fees — they may be paid by credits, but cannot be advertised as zero.' },
];

const TRIGGER_TERMS_REQUIRING_DETAILS = [
  'down payment',
  'monthly payment',
  'finance charge',
  'term',
  'apr',
  'annual percentage rate',
];

// --- Utilities -----------------------------------------------------------

function lc(s: string | undefined): string {
  return (s ?? '').toLowerCase();
}

function mentionsAny(text: string, list: string[]): boolean {
  const lower = lc(text);
  return list.some((w) => lower.includes(w));
}

function hasNmlsReference(text: string, nmls: string | undefined): boolean {
  if (!nmls) return false;
  const lower = lc(text);
  return lower.includes(nmls) || lower.includes(`#${nmls}`);
}

function severityFromLevel(level: ComplianceSeverity, blocking?: boolean): boolean {
  return blocking ?? level === 'blocking';
}

// --- Public rule functions ----------------------------------------------

export function checkRequiredDisclosures(ctx: ComplianceContext): ComplianceCheckResult[] {
  const results: ComplianceCheckResult[] = [];
  const content = ctx.content;
  const lower = lc(content);
  const mentionsMortgage = mentionsAny(lower, MORTGAGE_TRIGGER_WORDS);

  // Company NMLS — required whenever mortgage business is mentioned.
  const hasCompanyNmls = hasNmlsReference(content, LOAN_FACTORY_COMPANY_NMLS);
  if (mentionsMortgage && !hasCompanyNmls) {
    results.push({
      ruleId: 'company-nmls',
      rule: 'Company NMLS required',
      severity: 'blocking',
      blocking: severityFromLevel('blocking'),
      message: `Mortgage-related posts must include "Loan Factory NMLS #${LOAN_FACTORY_COMPANY_NMLS}".`,
      suggestedFix: `Append "Loan Factory, NMLS #${LOAN_FACTORY_COMPANY_NMLS}" to the caption or footer.`,
    });
  }

  // LO NMLS — required whenever the LO's own name, website, or mortgage business is mentioned.
  const hasLoNmls = hasNmlsReference(content, ctx.loNmls);
  if (mentionsMortgage && !hasLoNmls) {
    results.push({
      ruleId: 'lo-nmls',
      rule: 'Your NMLS required',
      severity: 'blocking',
      blocking: true,
      message: `Your individual NMLS must appear on any mortgage-related post or asset.`,
      suggestedFix: ctx.loNmls
        ? `Include "NMLS #${ctx.loNmls}" alongside your name in the caption or image.`
        : `Add your NMLS to your profile first, then it will auto-attach.`,
    });
  }

  // Equal Housing Lender — required on any mortgage marketing asset.
  if (mentionsMortgage && !/equal\s+housing\s+lender/i.test(content)) {
    results.push({
      ruleId: 'equal-housing',
      rule: 'Equal Housing Lender mark required',
      severity: 'warning',
      message: `Include the Equal Housing Lender logo or text on the visual or in the caption.`,
      suggestedFix: `Add "Equal Housing Lender" to the footer or include the EHL logo in the image.`,
    });
  }

  return results;
}

export function checkRateAprRisk(ctx: ComplianceContext): ComplianceCheckResult[] {
  const results: ComplianceCheckResult[] = [];
  const content = ctx.content;
  const lower = lc(content);

  const looksLikeRate = mentionsAny(lower, RATE_INDICATORS) || /\d+(\.\d+)?\s?%/.test(content);
  const mentionsApr = /apr\b/i.test(content) || /annual percentage rate/i.test(content);

  if (looksLikeRate && !mentionsApr) {
    results.push({
      ruleId: 'rate-apr-parity',
      rule: 'APR must accompany any advertised rate',
      severity: 'blocking',
      blocking: true,
      message: `Any post mentioning an interest rate must show the APR with the same font, size, and prominence.`,
      suggestedFix: `Add the APR next to the rate. Example: "Rate 6.500% (APR 6.612%)". Use the same type size and weight for both numbers.`,
    });
  }

  // Trigger-terms compliance — require a full sample scenario if these appear.
  if (mentionsAny(lower, TRIGGER_TERMS_REQUIRING_DETAILS)) {
    results.push({
      ruleId: 'rate-apr-parity',
      rule: 'Trigger terms require a full sample scenario',
      severity: 'warning',
      message: `Mentions of down payment, monthly payment, term, or finance charge require a full loan-cost sample (loan amount, term, total cost).`,
      suggestedFix: `Add a sample-scenario line. Example: "$400,000 loan, 30-yr fixed, 6.500% rate / 6.612% APR, $2,528 P&I, total of payments $910,080."`,
    });
  }

  return results;
}

export function checkProhibitedClaims(ctx: ComplianceContext): ComplianceCheckResult[] {
  const results: ComplianceCheckResult[] = [];
  const lower = lc(ctx.content);

  for (const { phrase, reason } of PROHIBITED_PHRASES) {
    if (lower.includes(phrase)) {
      results.push({
        ruleId: 'prohibited-claims',
        rule: `Prohibited phrase: "${phrase}"`,
        severity: 'blocking',
        blocking: true,
        message: reason,
        suggestedFix: `Rephrase without "${phrase}". Use neutral, supportable language.`,
      });
    }
  }

  return results;
}

export function checkStateSpecificRules(ctx: ComplianceContext): ComplianceCheckResult[] {
  const results: ComplianceCheckResult[] = [];
  const content = ctx.content;
  const lower = lc(content);
  const states = new Set(ctx.licensedStates);
  const mentionsMortgage = mentionsAny(lower, MORTGAGE_TRIGGER_WORDS);

  // NJ
  if (states.has('NJ') && mentionsMortgage) {
    if (!/licensed by the nj department of banking and insurance/i.test(content)) {
      results.push({
        ruleId: 'nj-licensing-disclosure',
        rule: 'NJ disclosure required',
        severity: 'blocking',
        blocking: true,
        message: `NJ-licensed LOs must include "Licensed by the NJ Department of Banking and Insurance" on every mortgage post.`,
        suggestedFix: `Add "Licensed by the NJ Department of Banking and Insurance" to the caption or image.`,
      });
    }
    if (ctx.usingTeamName) {
      results.push({
        ruleId: 'team-name-restriction',
        rule: 'NJ: team name not allowed',
        severity: 'blocking',
        blocking: true,
        message: `NJ-licensed LOs cannot use team names or "Powered By" branding on marketing materials.`,
        suggestedFix: `Use your individual licensed name or a registered DBA — not a team name.`,
      });
    }
  }

  // RI
  if (states.has('RI') && mentionsMortgage) {
    const hasRiMlo = /ri licensed mortgage loan originator/i.test(content);
    const hasRiBroker = /ri licensed loan broker/i.test(content);
    if (!hasRiMlo || !hasRiBroker) {
      results.push({
        ruleId: 'ri-licensing-disclosure',
        rule: 'RI disclosures required',
        severity: 'blocking',
        blocking: true,
        message: `RI-licensed LOs must include both "RI licensed Mortgage Loan Originator" and "RI Licensed Loan Broker" on mortgage posts.`,
        suggestedFix: `Add both phrases to the caption or image footer.`,
      });
    }
    if (ctx.usingTeamName) {
      results.push({
        ruleId: 'team-name-restriction',
        rule: 'RI: team name not allowed',
        severity: 'blocking',
        blocking: true,
        message: `RI-licensed LOs cannot use team names or "Powered By" branding on marketing materials.`,
        suggestedFix: `Use your individual licensed name or a registered DBA — not a team name.`,
      });
    }
  }

  // MA — when advertising rates or loan terms.
  if (states.has('MA')) {
    const advertisesRates =
      mentionsAny(lower, RATE_INDICATORS) ||
      mentionsAny(lower, TRIGGER_TERMS_REQUIRING_DETAILS) ||
      /\d+(\.\d+)?\s?%/.test(content);
    if (advertisesRates && !/we arrange but do not make loans/i.test(content)) {
      results.push({
        ruleId: 'ma-rate-disclosure',
        rule: 'MA rate/term disclosure required',
        severity: 'blocking',
        blocking: true,
        message: `MA-licensed LOs advertising rates or loan terms must include "We arrange but do not make loans."`,
        suggestedFix: `Append "In Massachusetts: We arrange but do not make loans." to the caption.`,
      });
    }
  }

  // AZ — company AZ-license + LO AZ-license must appear on each post.
  if (states.has('AZ') && mentionsMortgage) {
    const hasCompanyAz = /bk-?2005457/i.test(content);
    if (!hasCompanyAz) {
      results.push({
        ruleId: 'az-license-display',
        rule: 'AZ company license required',
        severity: 'warning',
        message: `AZ-licensed LOs must include the company AZ license "BK-2005457" and their individual AZ license number on each post.`,
        suggestedFix: `Add "BK-2005457" plus your own AZ license number to the caption or image.`,
      });
    }
  }

  // TX — Texas disclosure link must be referenced on any TX mortgage post or website.
  if (states.has('TX') && mentionsMortgage) {
    if (!/loanfactory\.com\/texas-disclosures/i.test(content)) {
      results.push({
        ruleId: 'tx-disclosure',
        rule: 'TX disclosure link recommended',
        severity: 'info',
        message: `TX-licensed LOs are required to link to loanfactory.com/texas-disclosures in their About section. Recommend including this URL in the caption when relevant.`,
        suggestedFix: `Include "loanfactory.com/texas-disclosures" in the asset's About section or caption.`,
      });
    }
  }

  return results;
}

// --- Optional: Best Price Guarantee --------------------------------------

export function checkBestPriceGuaranteeTnC(ctx: ComplianceContext): ComplianceCheckResult[] {
  const results: ComplianceCheckResult[] = [];
  const lower = lc(ctx.content);
  const mentionsBpg = /best price guarantee|\$2,?000 best price/i.test(lower);
  if (!mentionsBpg) return results;

  if (!/loanfactory\.com\/best-price-guarantee/i.test(ctx.content)) {
    results.push({
      ruleId: 'best-price-guarantee-tnc',
      rule: '$2,000 Best Price Guarantee — Terms & Conditions required',
      severity: 'blocking',
      blocking: true,
      message: `Posts mentioning the $2,000 Best Price Guarantee must include "Terms and Conditions: www.loanfactory.com/best-price-guarantee" in BOTH the caption and the image.`,
      suggestedFix: `Append "Terms and Conditions: www.loanfactory.com/best-price-guarantee" to the caption and add it to the visual.`,
    });
  }

  return results;
}

// --- Aggregate runner ----------------------------------------------------

export function runComplianceCheck(ctx: ComplianceContext): ComplianceCheckResult[] {
  return [
    ...checkRequiredDisclosures(ctx),
    ...checkRateAprRisk(ctx),
    ...checkProhibitedClaims(ctx),
    ...checkStateSpecificRules(ctx),
    ...checkBestPriceGuaranteeTnC(ctx),
  ];
}

export function complianceSummary(results: ComplianceCheckResult[]): {
  blockingCount: number;
  warningCount: number;
  infoCount: number;
  canSubmit: boolean;
} {
  const blockingCount = results.filter((r) => r.blocking || r.severity === 'blocking').length;
  const warningCount = results.filter((r) => !r.blocking && r.severity === 'warning').length;
  const infoCount = results.filter((r) => r.severity === 'info').length;
  return {
    blockingCount,
    warningCount,
    infoCount,
    canSubmit: blockingCount === 0,
  };
}
