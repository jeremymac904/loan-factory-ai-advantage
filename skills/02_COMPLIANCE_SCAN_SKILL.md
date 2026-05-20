# Skill 02, Compliance Scan Skill

## Purpose

Run a first pass compliance screen before content is saved, submitted, or published.

## Inputs

1. Copy.
2. Channel.
3. State.
4. LO profile.
5. Team profile.
6. Template type.
7. Contains rate language.
8. Contains payment language.
9. Contains testimonial.
10. Contains Realtor branding.

## Checks

1. Required Loan Factory name.
2. Required NMLS.
3. Equal Housing Lender.
4. Rate and APR risk.
5. Unsupported claims.
6. State specific warnings.
7. Company email.
8. Team name restrictions.
9. Borrower PII.
10. Approval status.

## Output shape

```ts
type ComplianceWarning = {
  severity: "info" | "warning" | "blocker";
  rule: string;
  message: string;
  suggestedFix: string;
};
```

## Blocker examples

1. Rate shown without APR.
2. Guaranteed approval.
3. Lowest rate claim.
4. Borrower private information.
5. Missing NMLS on mortgage advertising content.
6. Unapproved Realtor branding.

## Result states

1. Draft allowed.
2. Needs review.
3. Blocked until fixed.
4. Ready for Marketing review.
5. Approved.
6. Published.
