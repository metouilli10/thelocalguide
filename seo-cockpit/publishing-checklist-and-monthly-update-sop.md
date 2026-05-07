# Publishing Checklist And Monthly Update SOP

Use this before every publish, then revisit the same page once a month in Google Search Console.

## Publishing Checklist
### SEO checks
- [ ] The file path matches the planned slug: `blog/your-slug.html`
- [ ] The title tag includes the main keyword naturally
- [ ] The meta description is clear, useful, and within normal snippet length
- [ ] The H1 is human and supports the main keyword
- [ ] The canonical URL matches the final live URL
- [ ] The article includes a hero image with a useful alt text
- [ ] The article includes a TOC block: `<nav id="toc-nav">`
- [ ] The page includes `BlogPosting` schema
- [ ] The page includes `FAQPage` schema
- [ ] The FAQ section is visible on the page, not schema only
- [ ] The intro answers the main search question quickly

### CRO checks
- [ ] There is one clear tour recommendation inside the article
- [ ] The CTA feels relevant to the topic, not random
- [ ] The CTA goes to a real page: tour page, `all-tours.html`, or WhatsApp path
- [ ] If the article is commercial-assist content, the target tour page is linked before the midpoint
- [ ] If a price cue is already approved, it is visible and accurate
- [ ] The page makes the next step obvious: read more, compare, or book

### Mobile checks
- [ ] The first screen shows a clear title and excerpt
- [ ] The intro is not too long on mobile
- [ ] The hero image loads cleanly and is not oversized in the layout
- [ ] Buttons are easy to tap
- [ ] The FAQ accordion opens cleanly on mobile
- [ ] Long paragraphs are broken into shorter blocks

### Internal linking checks
- [ ] The article includes `2-4` contextual links to blog posts
- [ ] The article includes `1-2` contextual links to tour pages
- [ ] At least one link supports a priority hub or money page
- [ ] Anchor text sounds natural
- [ ] Relative paths are correct
- [ ] Related articles are relevant to the same search journey
- [ ] Related tours match the article topic

### Final publish checks
- [ ] The page appears in `travel-guide.html` if it should be listed there
- [ ] `sitemap.xml` includes the new or refreshed URL
- [ ] Share links point to the right URL
- [ ] Author is `Yassine`
- [ ] There are no placeholder values left in the HTML

## After Publish
Submit the changed URL:

```bash
npm run indexnow:submit -- /blog/your-slug.html
```

If you published a batch or updated the sitemap:

```bash
npm run gsc:submit-sitemap
```

## Monthly Update SOP
### Goal
Use Search Console to improve pages that already have impressions before writing too many new articles.

### Step 1. Pull the opportunity queue
Run:

```bash
npm run gsc:cli:md -- --days 28
```

This uses the existing GSC connector and highlights pages that are:
- above the minimum impressions threshold
- ranking roughly in positions `3-15`
- underperforming on CTR

### Step 2. Review the highest-value pages first
Start with:
1. pages with high impressions and weak CTR
2. pages already close to page one or upper page two
3. pages that can drive bookings to core tours

Typical priority pages for this site:
- `blog/agadir-day-trips.html`
- `blog/paradise-valley-agadir-guide.html`
- `blog/agadir-3-day-itinerary.html`
- `tours/day-trip-marrakech-from-agadir-new.html`
- `tours/tour-agadir-guided-city-tour-cable-car.html`

### Step 3. Log the result back into Google Sheets
For each page reviewed, update these fields in the sheet:
- `Clicks`
- `Impressions`
- `CTR`
- `AveragePosition`
- `TopQuery`
- `LastUpdatedDate`
- `NextAction`
- `Status`

Set `Status` to `refresh-needed` if the page still has clear upside.

### Step 4. Choose one next action only
Keep the refresh focused. Pick one:
- `rewrite title/meta`
- `tighten intro`
- `add links/CTA`
- `expand FAQ/section coverage`

Do not try to rewrite everything every month.

### Step 5. Refresh based on the signal
Use these simple rules:

#### High impressions, low CTR
Update:
- title tag
- meta description
- opening paragraph

Good fit for:
- pages ranking well enough to win more clicks without major rewrites

#### Position 6-15, weak intent match
Update:
- H2 structure
- quick answer block
- missing comparison or practical sections

Good fit for:
- pages that rank, but do not answer the searcher fast enough

#### Strong information page, weak commercial assist
Update:
- contextual tour links
- CTA block
- next-step wording

Good fit for:
- itinerary, comparison, and planning content

#### FAQ opportunities from real queries
Update:
- FAQ section
- FAQ schema
- one or two practical questions near the end

Good fit for:
- transport, safety, prices, and planning pages

### Step 6. Republish lightly
After the refresh:
1. keep the same URL
2. update `dateModified`
3. resubmit the URL to IndexNow
4. resubmit the sitemap if needed

## Monthly Cadence
- Week 1: pull the queue and choose `3-5` refresh targets
- Week 2: update the best two pages
- Week 3: update the next two pages
- Week 4: compare results and set next month priorities

## Default Monthly Goal
Prefer:
- `2-4` strong refreshes

Over:
- publishing many weak new posts

That keeps the system simple and aligned with the site's current SEO opportunity.
