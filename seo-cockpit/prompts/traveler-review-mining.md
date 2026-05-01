## Traveler Review Mining

Use this prompt when you want an agent to mine traveler reviews for language, objections, expectations, and buying signals that can improve page copy, FAQs, CTAs, and post ideas.

### Best For
- Tripadvisor reviews
- GetYourGuide reviews
- Google reviews
- Viator reviews
- Review sections on local competitor pages

### Inputs To Fill
```text
TARGET_ACTIVITY="[example: quad biking agadir]"
REVIEW_SOURCES="[URLs or named sources]"
OUR_TARGET_PAGE="[example: /tours/tour-agadir-half-quad-biking-adventure.html]"
MIN_REVIEW_COUNT="[example: 50]"
OUTPUT_FORMAT="[markdown | JSON]"
```

### Prompt
```text
You are mining traveler reviews for Agadir Local Guide, a local tour operator in Agadir, Morocco.

Target activity:
[TARGET_ACTIVITY]

Review sources:
[REVIEW_SOURCES]

Target page:
[OUR_TARGET_PAGE]

Minimum review count to analyze:
[MIN_REVIEW_COUNT]

Read the available reviews and extract patterns that would help a local tour operator improve SEO and conversion.

Focus on:
1. Top reasons travelers book this activity
2. Top fears before booking
3. Most repeated praise themes
4. Most repeated complaints or friction points
5. Specific words travelers use for outcomes and emotions
6. Questions travelers seem to care about before booking
7. What travelers value most in a local guide vs an OTA
8. Which details belong in:
   - hero copy
   - FAQs
   - trust blocks
   - WhatsApp CTA copy
   - blog support content

Return:
- "Top booking motivations"
- "Top objections"
- "Language customers actually use"
- "FAQ opportunities"
- "Copy updates for our target page"
- "3 blog ideas supported by review language"

Constraints:
- Do not invent review themes
- Quote short recurring phrases only when clearly supported
- Keep recommendations tied to real page sections
- Prioritize traveler language over generic marketing phrases
```
