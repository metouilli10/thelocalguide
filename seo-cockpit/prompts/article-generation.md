# Article Generation Prompt

Paste this into Cursor when you want a full first draft for a blog article.

## Input Block
```text
POST_TITLE=""
PRIMARY_KEYWORD=""
SECONDARY_KEYWORDS=""
SEARCH_INTENT=""
CATEGORY=""
TOPIC_CLUSTER=""
TARGET_PERSONA=""
TARGET_TOUR_NAME=""
TARGET_TOUR_URL=""
SUPPORT_HUB_URL=""
RELATED_BLOG_URLS=""
RELATED_TOUR_URLS=""
CTA_GOAL=""
PUBLISH_MONTH=""
FEATURED_IMAGE_DIRECTION=""
WORD_COUNT_TARGET=""
NEW_OR_REFRESH="new"
SOURCE_FILE_IF_REFRESH=""
```

## Prompt
You are writing for `agadirlocalguide.com`, a local tour company in Agadir, Morocco.

The audience is English-speaking tourists from the UK, Europe, and the USA. Write in simple English with a local insider tone. Be practical, entertaining, and easy to scan. Sound like a helpful local guide, not a generic travel blog.

Use the current site pattern from:
- `blog/agadir-day-trips.html`
- `blog/agadir-3-day-itinerary.html`
- `blog/top-10-things-to-do-agadir-2026.html`

Output a complete, publication-ready HTML file for:
- `blog/[slug].html`

Use these site conventions:
- stylesheet: `../blog.css`
- script: `../blog.js`
- breadcrumbs: `../index.html` -> `../travel-guide.html` -> current article
- related tour links should use real `../tours/...` paths
- related article links should use real same-folder blog paths like `agadir-day-trips.html`
- author must always be `Yassine`

## What The Article Must Include
1. A strong SEO title tag and meta description.
2. A hero section with category pill, H1, excerpt, author row, social share buttons, and featured image.
3. A table of contents block that works with `blog.js`.
4. A short quick answer near the top.
5. Main sections with useful H2s matched to the search intent.
6. One local insider tip.
7. One realistic traveler expectation.
8. One practical timing or transport note.
9. One common tourist mistake or misconception.
10. One `best for` recommendation.
11. Relevant CTA blocks based on search intent and booking fit.
12. `2-4` contextual internal links to blog posts.
13. `1-2` contextual internal links to tour pages.
14. A FAQ section with visible questions and answers.
15. A related articles section.
16. A sidebar with one CTA widget and one related tours widget.
17. `BlogPosting` schema and `FAQPage` schema.

## Search Intent Rules
Use `SEARCH_INTENT` to decide how the article should behave.

- `informational`: answer the main question early, organize sections by traveler questions, keep recommendations helpful and low-pressure, use a soft CTA after the intro, and link to the best hub plus one relevant tour page.
- `commercial investigation`: help readers compare options before booking, organize sections around decision criteria, use clear recommendations, place a stronger CTA before the midpoint, and link to supporting guides plus the most relevant tour page.
- `transactional`: focus on booking confidence, logistics, inclusions, timing, price context if provided, and objections; use direct but helpful CTAs and link to the target tour page early.
- `itinerary planning`: organize by time, day, route, or sequence; place CTAs after itinerary sections where the activity naturally fits; link to day trips, activity guides, and tour pages in the same order a traveler would plan.
- `comparison`: compare options fairly, summarize who each option is best for, place the CTA after the recommendation summary, and link to both compared topics plus the recommended next step.
- `seasonal/travel timing`: organize by month, season, weather, crowds, or timing tradeoffs; keep CTA copy planning-focused and link to the most seasonally relevant guides or tours.

Each intent should influence article structure, CTA strength, recommendation style, section organization, and internal linking strategy.

## Humanization Requirements
Every article must include:
- one local insider tip
- one realistic traveler expectation
- one practical timing or transport note
- one common tourist mistake or misconception
- one `best for` recommendation

The article should feel written by a local guide, not a generic AI travel writer.

## Avoid AI-Sounding Patterns
Avoid:
- "hidden gem"
- "nestled"
- "vibrant"
- repetitive emotional travel fluff
- generic filler paragraphs
- unnatural keyword repetition

Prioritize:
- practical value
- specificity
- local realism
- scanability
- simple natural English

## Writing Rules
- Answer the main search question early.
- Keep paragraphs short.
- Avoid filler, hype, and fake local details.
- Do not invent prices, schedules, or business facts.
- If a fact is uncertain, keep it general.
- Make the target tour feel like a useful next step, not a hard sell.
- Use natural anchor text, not repeated exact-match spam.
- Keep the article useful even for people who do not book immediately.

## CTA Placement Rules
- informational articles: place a soft CTA after the intro
- commercial articles: place a stronger CTA before the midpoint
- itinerary articles: place CTAs after itinerary sections where the activity fits
- comparison articles: place the CTA after the recommendation summary

CTA copy should:
- feel helpful
- explain why the tour is relevant
- avoid aggressive sales wording

## Link Rules
- Include one support link to the best hub page for the topic.
- Put the first tour link before the midpoint of the article.
- Related articles should reinforce the article, not repeat the same topic.
- Related tours should match the article category and traveler intent.

## Topical Authority Rules
The article should strengthen the site's authority around:
- Agadir tourism
- Paradise Valley
- Tamri experiences
- day trips from Agadir
- beaches
- local Moroccan travel planning

When relevant, naturally reference nearby destinations, routes, landmarks, and related activities. Do not force unrelated entities into the article.

## Metadata Rules
- Title tag: 50-60 characters, keyword near the front.
- Meta description: 145-158 characters, one concrete detail when possible, soft CTA at the end.
- H1 should feel more human than the title tag.
- Canonical must point to `https://agadirlocalguide.com/blog/[slug].html`.

## SERP Optimization Rules
Titles should:
- place `Agadir` near the front when natural
- avoid generic wording
- create curiosity or practical value
- use the year only if freshness matters

Meta descriptions should:
- include one concrete detail
- sound natural
- include a soft CTA

## Semantic SEO Rules
Use related entities and phrases naturally. Expand semantic coverage around:
- destination
- activity
- traveler type
- route or transport context
- season or timing
- nearby places
- booking or planning context

Avoid exact-match keyword repetition. The page should feel complete because it answers the topic well, not because it repeats the keyword many times.

## Content Depth Rules
Do not add sections just to increase word count.

Every section must:
- answer a real traveler question
- reduce uncertainty
- improve planning confidence
- support booking intent naturally

Prioritize usefulness over article length.

## Featured Image Reminder
Follow the featured image workflow defined in `seo-cockpit/agadir-seo-content-workflow.md`.

For every article brief, generate:
- featured image prompt
- filename suggestion
- alt text suggestion
- social share image idea

## Output Format
Return these in order:
1. `Slug`
2. `Title tag`
3. `Meta description`
4. `Featured image prompt`
5. `Featured image filename suggestion`
6. `Featured image alt text suggestion`
7. `Social share image idea`
8. `Recommended internal blog links`
9. `Recommended internal tour links`
10. `Complete HTML file`

## Refresh Behavior
If `NEW_OR_REFRESH="refresh"`:
- preserve the original URL intent
- preserve the page's existing purpose instead of changing the topic entirely
- improve weak sections
- improve title and meta CTR potential
- improve scanability with clearer H2s, shorter paragraphs, and better summaries
- improve FAQ coverage based on likely traveler questions
- improve internal linking to relevant hub, blog, and tour pages
- improve CTA quality and relevance
- keep the canonical URL aligned with the existing page
