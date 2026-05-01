# SEO Cockpit

This folder is the internal operating layer for SEO work on Agadir Local Guide.

It is designed to support a multi-agent workflow:
- one agent defines the task
- one agent executes it
- one agent reviews it
- one agent monitors completeness and blockers

## Current Structure
- `agents/`: role playbooks for command, monitor, execution, and review agents
- `context/`: approved business facts and tour inventory
- `audits/`: structured audit schemas and reusable machine-readable findings
- `briefs/`: execution-ready templates for page refreshes and new content
- `prompts/`: reusable prompt packs adapted to a tour business
- `reports/`: merged GSC + keyword + audit priority reports

## Core Principle
This is not a generic local SEO system copied from a home-services workflow.

It is adapted for a tour operator, which means the prompts and briefs should focus on:
- destination intent
- tour comparison intent
- OTA gaps
- traveler review language
- trust and booking friction
- internal linking from informational pages to commercial pages

## Agent Roles
### Command Agent
Creates one sharply scoped task brief with exact inputs, constraints, and success criteria.

File:
- `agents/command-agent.md`

### Execution Agent
Builds one draft artifact from the brief.

File:
- `agents/execution-agent.md`

### Review Agent
Checks whether the draft is accurate, useful, and aligned with approved business facts.

File:
- `agents/review-agent.md`

### Monitor Agent
Tracks blockers, missing inputs, and unresolved review issues.

File:
- `agents/monitor-agent.md`

## Current Prompt Packs
### Competitor Tour Page Teardown
Use when comparing your tour pages with local operators or OTAs.

File:
- `prompts/competitor-tour-page-teardown.md`

### Traveler Review Mining
Use when extracting objections, motivations, and copy angles from review sources.

File:
- `prompts/traveler-review-mining.md`

### GSC Page Refresh Brief
Use when turning Search Console query signals into a page-update brief.

File:
- `prompts/gsc-page-refresh-brief.md`

## Audit Templates
### Competitor Tour Pages
Use to compare your page against local operators or OTAs across trust, FAQ coverage, booking clarity, and local authority.

File:
- `audits/competitor-tour-pages.template.json`

### Traveler Review Themes
Use to store review-mining outputs in a reusable format.

File:
- `audits/traveler-review-themes.template.json`

### Query Intent Opportunities
Use to convert GSC-style query sets into intent clusters and refresh opportunities.

File:
- `audits/query-intent-opportunities.template.json`

## Brief Templates
### Page Refresh Brief
Turn one existing URL into a tightly scoped optimization task.

File:
- `briefs/page-refresh-brief.template.md`

### New Blog Brief
Use when creating an informational page that supports a commercial tour page.

File:
- `briefs/new-blog-brief.template.md`

### New Commercial Page Brief
Use when a keyword gap requires a new tour, comparison, or destination-commercial page.

File:
- `briefs/new-commercial-page-brief.template.md`

## Report Templates
### Current Priorities
Use to summarize what should be worked on next based on context, audits, and performance inputs.

File:
- `reports/current-priorities.template.md`

### Monthly SEO Status
Use to track wins, losses, completed work, and next-month priorities.

File:
- `reports/monthly-seo-status.template.md`

## Suggested Workflow
1. Update `context/` if a business fact changes.
2. Create or update an audit file in `audits/` when research is done.
3. Have the command agent create one task brief.
4. Run the execution agent on that brief.
5. Run the review agent on the draft.
6. Let the monitor agent decide whether the task is ready, blocked, or needs revision.
7. Roll approved outputs into `reports/` or downstream page edits.

## Good First Tasks
- build a refresh brief for one existing blog page using GSC data
- compare one tour page against 3 competitors
- mine traveler reviews for one activity and turn findings into FAQ ideas

## Notes
- Keep approved facts in `context/` and reuse them across prompts.
- Avoid mixing planning, writing, review, and publishing in one step.
- Treat publishable page edits as downstream work after the cockpit artifacts are approved.
