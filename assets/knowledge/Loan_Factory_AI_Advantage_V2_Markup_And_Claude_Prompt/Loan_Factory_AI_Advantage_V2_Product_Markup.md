# Loan Factory AI Advantage V2 Product Markup

Source reviewed: `Loan Factory AI Advantage Screen MarkUp V1.pptx`

Local folder shown by Jeremy:

`/Users/JeremyMcDonald/Desktop/JEREMY’S MASTER BUILD FOLDER/Loan Factory AI Advantage/ui-ux-walkthroughs/`

## Executive verdict

The current product is a useful prototype, but it still feels like a basic website demo instead of a real internal Loan Factory marketing platform. The visual system is too flat, the workflow is not guided enough, and the product is missing the most important business step, controlled access into the 1+1+1=5 program.

The next build should move from “website builder demo” to “Team Leader Marketing Operating System.”

That means the system needs four big layers:

1. Public marketing site and access request form
2. Admin intake inbox and approval workflow
3. Approved Team Leader workspace
4. Content, training, templates, agent support, and team sharing

## What is currently weak

### 1. Public landing page lacks significance

The current homepage is cleaner than the first version, but it still does not feel important enough for a company level platform. It needs a stronger visual hierarchy, better use of the new logo, motion or product preview visuals, stronger value framing, and a clear request access path.

### 2. No program access gate

Right now users can go straight into the builder. That is backwards.

The correct workflow should be:

Visitor clicks Request Access
User completes program application
Application appears in admin intake inbox
Admin team reviews the request
Admin clicks Approve or Request Info
Admin clicks Create Workspace
Approved Team Leader receives access to their workspace

### 3. Builder is trying to do too much before context exists

The builder asks for content and uploads, but it does not first establish whether the person is approved, what program they belong to, who supports them, what team they are building, what marketing categories they want, or whether they need brand assets created.

This should become a guided onboarding and workspace setup flow after approval.

### 4. Dashboard is too passive

The dashboard should not just show cards. It should direct the user toward the next best action.

Examples:

Complete profile
Upload reference image
Upload persona document
Choose website template
Create first Realtor campaign
Build first webinar kit
Submit first content piece for review
Share template with team

### 5. Content Studio is too complex

The current Content Studio has too many inputs visible at once. It should have two modes:

Guided Mode for regular LOs and Team Leaders
Advanced Mode for power users and admins

In Guided Mode, users should answer simple questions, then the system generates a draft using the existing compliance guardrails.

### 6. Content generation should happen once guardrails are present

The V1 markup correctly notes that if compliance guardrails are built, the system should generate the content. The app should not pretend the Generate button is only a placeholder forever.

For demo mode, use a simulated generation response.

For live mode, route through a secure server side MiniMax provider once environment variables exist.

### 7. Templates page should be more useful

Templates should not just look like static examples. They should be cloneable campaign starting points.

Template types should include:

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

### 8. Missing teaching and webinar module

A major part of this platform should support Team Leaders teaching and growing their teams.

Add a Training and Webinars section with ready to clone kits:

First Time Homebuyer Webinar for Realtors
VA Buyer Class
FHA Basics Class
Investor Lunch and Learn
DSCR Investor Webinar
Credit Prep Workshop
Listing Agent Marketing Kit
Recruiting Presentation Kit
Weekly Team Huddle Kit
Loan Factory AI Advantage Training Kit

Each kit should include:

Landing page template
Registration page copy
Email invite copy
Social post copy
Slides outline
Speaker notes
Follow up email
Short form video scripts
Compliance reminders

### 9. Admin workflow is too shallow

The admin area should become an operating inbox, not only an approval table.

Admin inbox tabs:

Access Requests
Workspace Creation
Marketing Review
Revision Requests
Approved Assets
Live Sites
Training Requests
Agent Tasks

Admin actions:

Approve access
Request more information
Reject request
Create workspace
Assign reviewer
Assign coach
Generate initial brand kit
Generate initial persona profile
Generate first content pack
Publish approved site
Send approval message

### 10. Product needs “wow” without becoming messy

The platform needs stronger visuals, but not gimmicks.

Use:

Large Loan Factory AI Advantage logo
Orange call to action buttons
White and soft gray workspace
Motion video cards
Template previews
Progress cards
Approval timeline
Team sharing preview
AI assistant panel
Agent boardroom preview

Avoid:

Heavy navy everywhere
Tiny logo
Crowded forms
Sci fi dashboards
Fake automation claims
Borrower file workflows
Rate quote workflows
TERA data manipulation

## V2 route map

### Public routes

`/`

Public landing page with stronger hero, platform explanation, request access button, templates preview, and pilot program framing.

`/request-access`

Program application form.

`/templates`

Public preview of cloneable template examples and live examples.

`/site/[slug]`

Published Team Leader site.

### Protected platform routes

`/dashboard`

Approved workspace dashboard.

`/builder`

Website and landing page builder for approved users.

`/content-studio`

Guided content creation.

`/calendar`

Content calendar and campaign schedule.

`/team-library`

Shared team templates, assets, captions, brand files, and persona docs.

`/training`

Webinars, teaching kits, and team education campaigns.

`/ai-twin`

Persona, reference image, voice, video style, and AI content memory setup.

`/agents`

Agent boardroom, skills, and specialized content workflows.

`/profile`

Team Leader and LO profile setup.

`/compliance`

Checklist, rules, warnings, and required disclosure helper.

`/settings`

Workspace settings, publishing controls, team sharing, AI provider status.

### Admin routes

`/admin`

Admin command center overview.

`/admin/intake`

Access request inbox.

`/admin/review`

Marketing approval queue.

`/admin/workspaces`

Approved workspaces and build status.

`/admin/agents`

Agent task queue and generated assets.

## Request access form spec

The request access form should appear before a user can enter the real workspace.

### Form sections

#### Personal and licensing information

Full name
Preferred display name
Loan Factory email
Phone
NMLS number
Licensed states
Current role
Team Leader or Group Leader status
Corporate coach, if applicable

#### Team or group information

Team name
Group type
Primary markets
Languages served
Loan focus areas
Number of expected team members
Is this for 1+1+1=5 pilot

#### Marketing goals

Recruiting
Realtor referrals
Consumer education
First time buyers
VA buyers
Spanish content
Investor content
Team training
Webinar campaigns
Local market domination

#### Current assets

Existing website
Google Business Profile link
Facebook page
Instagram
LinkedIn
YouTube
Current logo
Headshot
Reference image
Persona document
Brand voice document
Sample content

#### Support needs

Need logo or brand cleanup
Need persona built
Need website template selected
Need first campaign created
Need webinar kit built
Need bilingual support
Need Marketing review
Need TERA or ALLY coordination later

### Submission behavior

In demo mode, save request to local mock data and show it in Admin Intake.

In production, save request to PostgreSQL through approved backend API.

Do not email live unless email sending is explicitly wired and enabled.

## Admin intake inbox spec

### Inbox columns

Applicant
Team or group
Program fit
Requested assets
Status
Assigned reviewer
Assigned coach
Submitted date
Last updated
Next action

### Statuses

New request
Needs info
Approved for pilot
Rejected
Workspace created
In setup
Ready for Marketing review
Live

### Admin action buttons

Review
Request info
Approve access
Create workspace
Assign reviewer
Assign coach
Generate brand kit
Generate starter content
Publish workspace
Archive

## Create Workspace action

When admin clicks Create Workspace, demo mode should generate:

User profile draft
Team profile draft
Workspace dashboard
Selected template recommendation
Initial compliance checklist
AI Twin setup checklist
Starter content pack recommendation
Training kit recommendation
Review timeline

The action should not pretend to create real accounts unless auth is wired.

## AI Twin module spec

Purpose: help each Team Leader or LO create marketing content in their own voice while staying inside compliance guardrails.

### Required inputs

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

### Outputs

Content voice profile
Video script style guide
Social post style guide
Image prompt style guide
Compliance footer defaults
Reusable campaign angles
Suggested first 10 content topics

## Training and webinar module spec

Add a new nav item called Training.

This section should help Team Leaders run campaigns and teach Realtors, buyers, and team members.

### Training kit card fields

Title
Audience
Format
Estimated length
Includes
Compliance status
Clone kit button
Generate invite copy button
Generate follow up button

### Starter kits

First Time Homebuyer Realtor Webinar
VA Buyer Realtor Training
FHA Buyer Basics Class
Credit Prep Workshop
DSCR Investor Lunch and Learn
Listing Agent Marketing Strategy Session
AI for Loan Officers Training
1+1+1=5 Team Launch Training

## Content Studio V2 spec

Replace the complex one screen form with a guided workflow.

### Step 1: Choose goal

Educate consumers
Get Realtor meetings
Recruit LOs
Promote a webinar
Create weekly team content
Create listing partner content
Create Spanish content
Create video script

### Step 2: Choose audience

First time buyers
VA buyers
Realtors
Listing agents
Investors
Loan officers
Team members
Spanish speaking buyers
Local market audience

### Step 3: Choose format

Reel script
Static post
Carousel
Email
Landing page
Webinar invite
Follow up email
YouTube outline
AI avatar script

### Step 4: Generate draft

Use MiniMax provider if server side key exists.
Use demo generation fallback if no key exists.

### Step 5: Compliance review

Run local compliance rules.
Show warnings.
Require user acknowledgement before submit.

### Step 6: Submit for Marketing review

Save draft in review queue.

## MiniMax provider direction

MiniMax should be wired as a server side provider only.

Never expose the API key in the browser.

Environment variables:

`MINIMAX_API_KEY`
`MINIMAX_BASE_URL`
`MINIMAX_TEXT_MODEL`
`MINIMAX_IMAGE_MODEL`
`MINIMAX_VIDEO_MODEL`
`AI_PROVIDER=minimax`

Add a provider status card in Settings that shows configured or not configured without exposing secrets.

## Visual direction

Use Loan Factory inspired white, black, gray, and orange.

The app should feel more like Loan Factory’s real website and ALLY style internal tools, not a generic SaaS template.

### Brand feel

Clean
Modern
Fast
Practical
Professional
Team focused
AI assisted but not gimmicky

### Visual priorities

Bigger logo
Better spacing
Better hero image or video
More dynamic cards
More guided workflows
More obvious next steps
Less generic dashboard language
More platform value

## Acceptance criteria

The next build is successful when:

The public site has a Request Access button in the top nav and hero.
The Request Access form exists and works in demo mode.
Submitted requests appear in Admin Intake.
Admin can approve, request info, reject, and create workspace in demo mode.
Approved workspace has a better dashboard with next steps.
Templates are cloneable examples, not just static cards.
Training section exists with webinar and teaching kits.
Content Studio has Guided Mode and can generate demo drafts.
MiniMax provider scaffold exists server side only.
Builder remains usable.
Existing routes do not break.
Netlify build passes.
Lint passes.
