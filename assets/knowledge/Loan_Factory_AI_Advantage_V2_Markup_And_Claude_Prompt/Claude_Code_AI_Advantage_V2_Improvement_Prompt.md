You are working in this repo:

`/Users/JeremyMcDonald/Desktop/JEREMY’S MASTER BUILD FOLDER/Loan Factory AI Advantage`

GitHub repo:

`https://github.com/jeremymac904/loan-factory-ai-advantage`

Netlify site:

`https://loan-factory-ai-advantage.netlify.app`

Reference files in the local repo:

`ui-ux-walkthroughs/Loan Factory AI Advantage Screen MarkUp V1.pptx`
`assets/knowledge/Loan_Factory_AI_Advantage_V2_Product_Markup.md`
`assets/skills/loan_factory_ai_advantage_agent_pack/`
`agents/`
`skills/`
`knowledge/`

Important context:

The current app works as a visual demo, but it is too basic. It lacks significance, guided workflows, access control, admin intake, workspace creation, training kits, and a true platform feel.

The goal of this task is to upgrade the product flow, not rebuild the entire codebase from scratch.

Do not break the current Netlify demo.

## Architecture rules

AI Advantage should align with the ALLY platform direction:

React frontend
Python backend target later
PostgreSQL target later
Loan Factory SSO ready later
GKE ready later
GitHub and Claude Code workflow

TERA is separate:

Java backend
GWT frontend
Google App Engine
Cloud SQL Postgres
Long running LOS and CRM

Do not build AI Advantage inside TERA.
Do not assume direct access to TERA data.
Do not create fake TERA APIs.
Do not build borrower LOS workflows.
Do not build AUS, pricing, rate quote, or CRM features.

Current Netlify app is the demo and prototype layer.

## Primary build goal

Move the app from a simple website builder demo to a Team Leader Marketing Operating System for the 1+1+1=5 pilot.

Add:

Public request access form
Admin intake inbox
Create workspace demo flow
More dynamic workspace dashboard
Training and webinar section
Guided Content Studio
MiniMax provider scaffold for future live generation
Stronger Loan Factory inspired UI polish

## Build these routes

### Public route

Create:

`/request-access`

This should be a polished access request form for Team Leaders and Group Leaders who want to join the Loan Factory AI Advantage or 1+1+1=5 pilot.

Add Request Access to the top nav.

The form should collect:

Full name
Preferred display name
Loan Factory email
Phone
NMLS number
Licensed states
Current role
Team Leader or Group Leader status
Corporate coach, if applicable
Team name
Group type
Primary markets
Languages served
Loan focus areas
Expected team members
Is this for 1+1+1=5 pilot
Marketing goals
Current website
Google Business Profile link
Social profile links
Support needs
Notes

Use demo mode storage for now, local state or mock data is fine.

After submit, show a clean confirmation:

Your request has been submitted for review. Jeremy, Victoria, Andre, and Marketing can review it in the admin intake queue.

Do not send live email yet unless an existing email provider is already safely wired.

### Admin intake route

Create:

`/admin/intake`

This is the approval inbox for program access requests.

It should show submitted requests with statuses:

New request
Needs info
Approved for pilot
Rejected
Workspace created
In setup
Ready for Marketing review
Live

Admin actions:

Review
Request info
Approve access
Reject
Create workspace
Assign reviewer
Assign coach
Generate brand kit
Generate starter content
Archive

In demo mode, actions update local mock state.

### Workspace creation flow

When admin clicks Create Workspace, create a demo workspace record from the request.

The workspace should include:

Team Leader profile draft
Team profile draft
Recommended template
Profile completion checklist
AI Twin setup checklist
Starter content pack recommendation
Training kit recommendation
Marketing review status
Next best action

Add the created workspace to the dashboard or workspace list.

### Dashboard update

Upgrade `/dashboard` so it feels like an operating center.

Add sections:

Next Best Actions
Workspace Setup Progress
Pending Reviews
Starter Campaigns
Training Kits
AI Twin Setup
Team Library Activity
Agent Boardroom Preview

Make it more dynamic and less boring.

Use stronger cards, better spacing, orange CTAs, and clearer workflow movement.

### Training route

Create:

`/training`

This section helps Team Leaders teach Realtors, buyers, and team members.

Add training kit cards:

First Time Homebuyer Realtor Webinar
VA Buyer Realtor Training
FHA Buyer Basics Class
Credit Prep Workshop
DSCR Investor Lunch and Learn
Listing Agent Marketing Strategy Session
AI for Loan Officers Training
1+1+1=5 Team Launch Training

Each card should show:

Audience
Format
Estimated length
Includes
Compliance status
Clone kit button
Generate invite copy button
Generate follow up button

Buttons can be demo mode only.

### AI Twin route

Create:

`/ai-twin`

This should guide Team Leaders through setting up their AI content voice.

Inputs:

Persona summary
Tone preferences
Do not say list
Preferred audience
Common topics
Loan specialties
Reference image
Headshot
Brand voice document
Sample posts
Sample video scripts
Compliance notes
Licensed states

Outputs shown in demo:

Content voice profile
Video script style guide
Social post style guide
Image prompt style guide
Compliance footer defaults
Reusable campaign angles
Suggested first 10 content topics

### Agents route

Create:

`/agents`

This should show the AI Boardroom and available agent types.

Read local agent and skill documentation if available.

Show agent cards for:

AI Twin Builder Agent
UI UX Designer Agent
SEO GEO AEO Content Agent
Market Research Agent
Competitor Research Agent
YouTube Research Agent
Webinar Builder Agent
Compliance Review Agent
Template Builder Agent
Social Content Agent
Recruiting Campaign Agent
Realtor Partner Campaign Agent

Each card should show:

Purpose
Inputs needed
Outputs produced
Status
Run demo button

Do not run live AI yet unless provider is wired.

### Content Studio V2

Update `/content-studio` to use two modes:

Guided Mode
Advanced Mode

Guided Mode should be default.

Guided steps:

Choose goal
Choose audience
Choose format
Generate draft
Review compliance
Submit for Marketing review

Goals:

Educate consumers
Get Realtor meetings
Recruit LOs
Promote a webinar
Create weekly team content
Create listing partner content
Create Spanish content
Create video script

Formats:

Reel script
Static post
Carousel
Email
Landing page
Webinar invite
Follow up email
YouTube outline
AI avatar script

After guardrails run, Generate Draft should produce a demo draft if MiniMax is not configured.

### MiniMax provider scaffold

Add server side only MiniMax scaffold.

Do not expose API keys in the browser.

Create or update:

`src/lib/ai/providers/minimax.ts`
`src/lib/ai/provider-router.ts`
`src/app/api/ai/generate/route.ts`

Environment variables:

`MINIMAX_API_KEY`
`MINIMAX_BASE_URL`
`MINIMAX_TEXT_MODEL`
`MINIMAX_IMAGE_MODEL`
`MINIMAX_VIDEO_MODEL`
`AI_PROVIDER=minimax`

Do not guess MiniMax endpoint or model names.

If endpoint or model is missing, return demo mode output and a clear configuration warning.

Add provider status to `/settings`:

MiniMax configured or not configured
Server side key present or missing
Do not expose the key value

### Templates route update

Make `/templates` more useful and clone focused.

Template categories:

Team Leader Website
Landing Page
Funnel
Realtor Partner Campaign
Consumer Education Campaign
Recruiting Campaign
Spanish Content
AI Twin Video Script
Webinar Kit
Email Sequence
Social Content Pack

Each template card should have:

Title
Type
Best use case
Includes
Compliance status
Preview
Clone Template
Submit for Review

Move live site examples into a section called Live Examples.

## Visual polish requirements

The app should feel more important and more dynamic.

Use Loan Factory inspired branding:

White
Black
Soft gray
Loan Factory orange
Clean professional cards
Large readable logo
Strong CTA buttons
Less heavy navy
More product preview visuals
More motion where already available

The public homepage needs more significance.

Add:

Request Access CTA
Product preview section
Workflow diagram
Who this is for section
Admin approval explanation
Training and webinar preview
AI Twin preview
Agent Boardroom preview

Do not make it look like generic SaaS.
Do not make it sci fi.
Do not overcomplicate the forms.

## Compliance and scope rules

Keep these rules hardcoded into the direction:

Loan Factory name must be visible on marketing assets.
Loan Factory NMLS 320841 must be included where required.
LO NMLS must be included when LO identity or mortgage services are promoted.
Equal Housing Lender must be included where required.
If rates are mentioned, APR must be equally prominent.
No unsupported claims like lowest rate, best rate, guaranteed approval, no closing costs, or guaranteed savings.
No borrower data.
No private loan files.
No credit data.
No income docs.
No LOS workflow.
No AUS workflow.
No pricing workflow.
No CRM workflow.
No correspondent lending language.

## Demo behavior

Keep the app usable without live auth, live email, live database, or live MiniMax.

Label demo mode clearly.

All actions can update mock data for now.

Do not pretend external systems were actually updated.

## Navigation updates

Update sidebar and top nav to include:

Home
Request Access
Builder
Templates
Dashboard
Content Studio
Training
AI Twin
Agents
Team Library
Calendar
Compliance
Settings
Admin
Admin Intake

Keep existing routes working:

`/`
`/builder`
`/templates`
`/dashboard`
`/admin`

## Files to add or update

Add or update data files:

`src/lib/platform-mock-data.ts`
`src/lib/compliance-rules.ts`
`src/lib/request-access-types.ts`
`src/lib/workspace-types.ts`
`src/lib/training-kits.ts`
`src/lib/agent-registry.ts`
`src/lib/ai/providers/minimax.ts`
`src/lib/ai/provider-router.ts`

Add components as needed:

Access request form components
Admin intake table components
Workspace setup cards
Training kit cards
Agent cards
Guided content wizard
Provider status card

## Build quality

Run:

`npm run lint`
`npm run build`

Fix all errors and warnings.

## Commit

Commit and push with this message:

`feat: add access intake and dynamic platform workflow`

## Final report

Report:

Files created
Files changed
Routes added
Demo features added
MiniMax scaffold status
Lint result
Build result
Commit hash
Netlify deploy notes
Remaining next steps
