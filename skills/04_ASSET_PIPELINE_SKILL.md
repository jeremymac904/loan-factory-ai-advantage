# Skill 04, Asset Pipeline Skill

## Purpose

Keep logos, images, videos, reference files, and knowledge docs organized so the app stays clean.

## Folder rules

```text
public/logos        live logos
public/video        optimized site videos
public/headshots    live profile photos
public/templates    template thumbnails
public/brand        favicons and open graph images

assets/brand_guide       source brand docs and generated assets
assets/knowledge         policies and source docs
assets/reference_images  AI reference images
assets/video_source      raw video masters
assets/skills            draft skill files
agents                  agent markdown files
```

## Runtime rule

Files used by the website must be in public.

Files used as internal source material should stay in assets.

## Never place in public

1. Borrower docs.
2. Loan files.
3. Bank statements.
4. Pay stubs.
5. IDs.
6. Credit reports.
7. Private Realtor documents.
8. Private LO documents.
9. API keys.
10. Internal strategy docs.

## Asset naming rules

Use lowercase words with underscores.

Good:

```text
loan_factory_ai_advantage_logo.png
platform_motion_background.mp4
team_marketing_system.png
jeremy_mcdonald_headshot.jpg
```

Avoid:

```text
Screen Shot 2026 Final FINAL v2.png
image copy 3.png
video.mov
```

## Compression rule

Raw video goes in assets/video_source.
Optimized MP4 or WebM goes in public/video.
