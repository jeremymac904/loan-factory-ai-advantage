# Project assets — drop zone map

Three asset folders live at the repo root. Each has a different visibility, retention, and serving model. Use them as documented — don't drop files in the wrong place.

| Folder | Served on the live site? | Tracked in git? | Use for |
| --- | --- | --- | --- |
| `public/` | **Yes** — anything here is fetchable at the same path on production | Yes | Logos, optimized MP4s, headshots, template thumbnails, favicons, OG images |
| `assets/` | **No** — internal source files only | Mostly (heavy raw files are gitignored) | Brand guide PDFs, knowledge docs, raw video, AI reference photos, Claude skills |
| `.claude/` | **No** — local tooling only | Yes (skills + commands + launch.json) | Claude Code project skills, slash commands, dev server config |

---

## `public/` — anything the website needs to serve

Files here are reachable at `https://your-domain/<path-inside-public>`. Next.js does not transform or strip them. Use only optimized, public-safe assets.

```
public/
├── logos/         Loan Factory wordmarks, Equal Housing mark, partner / co-brand logos
├── video/         Optimized .mp4 / .webm for hero loops, testimonials, page B-roll
├── headshots/     Team Leader portraits (replace Unsplash placeholders when real ones land)
├── templates/     Thumbnail previews shown on /templates-examples
└── brand/         OG images, favicon variants, other site-wide brand assets
```

### How the app references public files

```tsx
// Logo
<Image src="/logos/loan-factory-black.svg" alt="Loan Factory" width={160} height={32} />

// Headshot
<Image src="/headshots/jeremy-mcdonald.jpg" alt="Jeremy McDonald" width={400} height={400} />

// Template thumbnail
<Image src="/templates/modern-team-leader-website.jpg" alt="Modern Team Leader Website" width={640} height={360} />

// Hero video
<video src="/video/hero-loop.mp4" autoPlay muted loop playsInline />

// OG / brand
<meta property="og:image" content="/brand/og-image.png" />
```

Always lead the path with `/` and use forward slashes — even on macOS / Windows.

### What does NOT belong in `public/`

- Any borrower data, loan files, applications, or PII.
- Pre-approval letters, rate sheets, loan estimates, statements, IDs, paystubs.
- Marketing-policy PDFs, internal compliance docs, persona docs — those are internal source files (`assets/knowledge/`).
- Raw / unoptimized footage — compress to MP4 / WebM first; raw masters belong in `assets/video_source/`.
- AI source files like `.ai`, `.psd`, `.sketch`, `.fig` — those belong in `assets/brand_guide/`.

---

## `assets/` — internal project source files

Internal-only. **Never served to the public.** Used by you, Marketing, and Claude Code as reference material.

```
assets/
├── brand_guide/        Loan Factory brand standards: PDFs, AI files, Figma exports
├── knowledge/          Marketing policy, compliance docs, scripts, persona docs, decks
├── reference_images/   AI reference photos, mood boards, swipe files
├── video_source/       Raw masters — compress and copy MP4 into public/video before use
└── skills/             Markdown + JSON skill files (separate from .claude/skills)
```

### What is tracked vs ignored

`.gitignore` is wired so the structure stays in git but heavy raw files do not bloat the repo:

| Path | Tracked |
| --- | --- |
| `assets/brand_guide/*.pdf` and `*.md` | **Yes** |
| `assets/brand_guide/*.ai *.psd *.sketch *.fig *.zip *.indd *.eps *.tiff` | **No** (gitignored) |
| `assets/knowledge/*.md` and `*.pdf` | **Yes** |
| `assets/skills/*.md` and `*.json` | **Yes** |
| `assets/reference_images/*` | **No** (gitignored) |
| `assets/video_source/*` | **No** (gitignored) |

The `.gitkeep` markers keep the empty folders visible in git. Add a real file inside any folder and the marker can stay or go — it's harmless.

### How files in `assets/` get used

- **Brand guide** → reference when changing logos, colors, type, or imagery. Final, optimized assets get re-exported into `public/logos/` and `public/brand/` for the app to serve.
- **Knowledge** → reference when writing marketing copy, building compliance checks, or briefing Claude Code. The Marketing & Advertising Policy and any compliance documents belong here. Claude Code reads this folder when you point it there.
- **Reference images** → swipe files and AI reference shots. The selected hero image for a Team Leader gets re-exported into `public/headshots/`.
- **Video source** → raw 4K masters. Use FFmpeg / Handbrake to produce a web-optimized MP4 (~1080p, H.264, sub-10MB hero loops) and drop the optimized file into `public/video/`.
- **Skills** (asset-side) → working drafts of skill files. Polished, deploy-ready skills move to `.claude/skills/`.

### Hard rules for `assets/`

- **No borrower data, loan files, or PII.** Same rule as `public/`. Even though `assets/` is not served, this is still a shared internal repo — assume Marketing / Compliance / IT can see it.
- **Marketing policy + compliance docs live in `assets/knowledge/`** — not `public/`, not the app `src/`.
- **No production secrets, tokens, or API keys** — those go in `.env.local` (gitignored).

---

## `.claude/` — Claude Code project tooling

```
.claude/
├── launch.json         Preview server config (already exists — used by preview_start)
├── skills/             Project-scoped Claude Code skills (.md, .json)
└── commands/           Project-scoped slash commands (.md)
```

Everything inside `.claude/` is tracked in git so the whole team gets the same Claude Code experience when they pull the repo.

### Skills

Drop project-scoped skills here as `.md` files. Claude Code loads them automatically when this repo is the working folder. Examples:

- `.claude/skills/loan-factory-voice.md` — Jeremy's persona + Loan Factory wholesale-broker positioning
- `.claude/skills/compliance-check.md` — the NMLS / APR / state-specific checklist condensed
- `.claude/skills/ship-template.md` — the playbook for shipping a new builder template end-to-end

A skill file is just markdown with a short description block at the top so Claude knows when to use it. See `~/.claude/skills/` for examples from your global setup.

### Commands

`.claude/commands/*.md` files become project-only slash commands. Use them for repetitive workflows — e.g. `/ship-it` to lint, build, commit, push in one shot.

### When to put a skill in `assets/skills/` vs `.claude/skills/`

- **`assets/skills/`** — drafts, experiments, anything not yet ready to be auto-loaded.
- **`.claude/skills/`** — polished, ready for daily use. This is what Claude Code actually pulls from.

---

## Quick reference

```
PUBLIC (served on the live site)
  public/logos        logos, equal-housing mark
  public/video        optimized .mp4 hero loops
  public/headshots    Team Leader portraits
  public/templates    /templates-examples thumbnails
  public/brand        favicons, OG images

INTERNAL (source files only, never served)
  assets/brand_guide       brand PDFs (tracked) + AI/PSD/Sketch (ignored)
  assets/knowledge         marketing policy, compliance docs, personas
  assets/reference_images  AI references, mood boards (ignored — too heavy)
  assets/video_source      raw masters (ignored — too heavy)
  assets/skills            working drafts of Claude Code skills

CLAUDE CODE
  .claude/launch.json      preview server config
  .claude/skills/          deploy-ready project skills
  .claude/commands/        project slash commands

NEVER store
  • borrower data, loan files, applications, IDs, paystubs, statements
  • non-public personal info (NPI) of any client
  • production secrets, API keys, tokens
  • copyrighted assets without a license
```

When in doubt about which folder something belongs in, default to `assets/knowledge/` — it's the safest place for any internal document you're not sure about.
