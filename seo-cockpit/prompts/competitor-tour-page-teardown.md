## Competitor Tour Page Teardown

Use this prompt when you want an agent to analyze how competing tour pages win clicks, trust, and conversions for a specific Agadir activity or day trip.

### Best For
- Paradise Valley competitors
- Quad biking competitors
- Camel ride competitors
- Marrakech or Essaouira day-trip competitors
- OTA vs local-operator page comparisons

### Inputs To Fill
```text
TARGET_TOUR="[example: Paradise Valley from Agadir]"
TARGET_KEYWORD="[example: paradise valley agadir]"
OUR_PAGE_URL="[example: /tours/tour-paradise-valley-agadir-new.html]"
COMPETITOR_URLS="[3-5 URLs from local operators or OTAs]"
OUTPUT_FORMAT="[markdown table | bullet summary | structured JSON]"
```

### Prompt
```text
You are analyzing competitor tour pages for Agadir Local Guide, a local tour operator in Agadir, Morocco.

Task:
Compare our page with competing pages for the target tour and explain what those pages do better, what they do worse, and what we should change on our page.

Target tour:
[TARGET_TOUR]

Primary keyword:
[TARGET_KEYWORD]

Our page:
[OUR_PAGE_URL]

Competitor URLs:
[COMPETITOR_URLS]

Focus only on these areas:
1. Search-intent match
2. Title tag and meta-description angle
3. Page headline and opening hook
4. Inclusion clarity: what is included, excluded, pickup, duration, pricing
5. FAQ coverage
6. Trust signals: reviews, guide credibility, cancellation, group size, photos
7. Conversion elements: CTA placement, WhatsApp, booking reassurance
8. Information OTAs include that a local operator should answer better
9. Internal-link opportunities if this became a supporting page or comparison page

Return:
- a short summary of the competitive pattern
- a table comparing our page vs each competitor on the nine areas above
- the top 5 changes we should make first
- one section called "What only a local operator can say better"

Constraints:
- Do not praise pages vaguely
- Do not invent facts about Agadir Local Guide
- Separate observed page elements from your recommendations
- Prefer practical travel and booking insights over generic SEO advice
```
