// Centralized references to brand asset files served from /public.
//
// Originals live in assets/brand_guide/ (internal source storage). Anything
// the running app references must also exist in /public so Next.js can serve
// it. If you add a new brand asset, copy the runtime file into the matching
// /public subfolder and add a constant here — do not hardcode the path in
// components.
//
// See ASSETS.md at the repo root for the full drop-zone map.

// --- Logos ----------------------------------------------------------------

/** Full "Loan Factory · AI Advantage" combined wordmark, transparent PNG. */
export const AI_ADVANTAGE_LOGO = '/logos/loan_factor_ai_advantage_logo_transparent.png';

/** Plain "Loan Factory" wordmark, transparent PNG. Use on non-AI-Advantage chrome. */
export const LOAN_FACTORY_LOGO = '/logos/loan-factory-logo-transparent.png';

// --- Hero / surface backgrounds ------------------------------------------

/** Light, on-brand hero/background image. White / soft-gray / orange tones. */
export const LIGHT_HERO_BACKGROUND = '/brand/light-hero-background.png';

/** Dark counterpart, for dark sections only. Avoid on the public marketing pages. */
export const DARK_HERO_BACKGROUND = '/brand/dark-hero-background.png';

/** Product / team-marketing illustration for homepage feature card. */
export const TEAM_MARKETING_IMAGE = '/brand/team-marketing-system.png';

// --- Videos ---------------------------------------------------------------

/** Subtle motion loop for the hero or marketing surfaces. */
export const PLATFORM_MOTION_VIDEO = '/video/platform-motion-background.mp4';

/** Dark, premium AI-workflow motion clip. Use sparingly. */
export const DARK_AI_WORKFLOW_VIDEO = '/video/dark-premium-AI-workflow.mp4';

/** Walkthrough loop of the Team Leader website builder. */
export const TEAM_LEADER_BUILDER_VIDEO = '/video/team-leader-website-builder.mp4';
