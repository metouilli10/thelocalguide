# Content Refresh Plan — GSC May 2026

> **Progress:** Wave 1–3 ✅ · Wave 4 🔄 active · Re-measure on 2026-06-21

## Snapshot
- **Reporting window:** 2026-04-25 to 2026-05-22 (28 days)
- **Prepared from:** Search Console export (Chart, Queries, Pages, Countries, Devices)
- **Prior plans reconciled with:** `7-day-seo-plan-2026-05-01.md`, existing briefs in `seo-cockpit/briefs/`
- **Main goal:** Turn rising impressions into clicks by refreshing existing URLs before publishing net-new content

## What The Data Says

| Signal | Value | Implication |
| --- | --- | --- |
| Total clicks | ~170 | Low absolute traffic; every CTR point matters |
| Total impressions | ~25,900 | Visibility is growing |
| Site avg CTR | ~0.66% | Snippet and intent mismatch is the main leak |
| Site avg position | ~8 | Page-one and high page-two fixes will move the needle fastest |
| Mobile vs desktop CTR | 1.24% vs 0.30% | Desktop titles/meta need sharper promises |
| UK impressions | 6,630 (32 clicks) | Primary market; optimize for UK English phrasing |
| US impressions | 8,976 (7 clicks) | Huge wasted visibility; clearer “Agadir Morocco” framing |

**Trend:** Impressions climbed week over week (5.1K → 8.3K), but CTR fell (0.96% → 0.43%). This is a **refresh problem**, not a discovery problem.

### Top impression pages (refresh queue)

| URL | Clicks | Impressions | CTR | Position | Refresh type |
| --- | --- | --- | --- | --- | --- |
| `/blog/agadir-to-marrakech-train-bus-day-tour.html` | 18 | 5,001 | 0.36% | 9.6 | Intent + CTR |
| `/blog/agadir-vs-marrakech-2026.html` | 19 | 3,755 | 0.51% | 7.8 | CTR |
| `/blog/best-time-visit-agadir-2026.html` | 6 | 2,586 | 0.23% | 6.4 | CTR |
| `/tours/tour-jet-ski-agadir-new.html` | 2 | 2,641 | 0.08% | 6.1 | Money page |
| `/blog/paradise-valley-agadir-guide.html` | 12 | 2,497 | 0.48% | 8.6 | Reposition |
| `/blog/agadir-vs-essaouira-2026.html` | 20 | 1,727 | 1.16% | 7.3 | Maintain + link |
| `/blog/agadir-3-day-itinerary.html` | 23 | 1,478 | 1.56% | 4.0 | Support links |
| `/blog/souss-massa-national-park-agadir-guide.html` | 8 | 1,227 | 0.65% | 7.4 | Commercial assist |
| `/blog/top-10-things-to-do-agadir-2026.html` | 0 | 642 | 0% | 7.6 | CTR + hub |
| `/blog/agadir-day-trips.html` | 0 | 173 | 0% | 21.0 | Hub rebuild |

### What's already working (protect, don't break)

- **Brand:** `agadir local guide` — 17 clicks, 29.8% CTR, position 1.1 (homepage)
- **Comparison content:** Agadir vs Marrakech / vs Essaouira clusters
- **Itinerary:** 3-day plan at position ~4 with healthy CTR
- **Morocco + EU markets:** Best CTR from Morocco, France, Spain, Netherlands

---

## Plan Rules

1. **Refresh before create** — only net-new where no URL owns the intent (`where to stay` is the main exception).
2. **One primary artifact per page** — title/meta, intro, one structural fix, FAQ, internal links, CTA.
3. **Fix fragment dilution** — stop optimizing `#section` URLs; strengthen the canonical page body instead.
4. **Wave order** — highest impression × lowest CTR first, then money pages, then hub consolidation.
5. **Link sprint after each wave** — no refresh ships without 2–4 contextual in-body links per playbook.

---

## Wave Overview (6-week cadence)

| Wave | Weeks | Focus | Pages | Expected outcome |
| --- | --- | --- | --- | --- |
| **Wave 1** | 1–2 | Transport + comparison CTR | 2 blog | +clicks from ~8,750 imp pool |
| **Wave 2** | 2–3 | Planning content CTR | 2 blog | Fix 0-click page-1 rankings |
| **Wave 3** | 3–4 | Commercial + guide reposition | 3 pages | Convert impressions to bookings |
| **Wave 4** | 4–5 | Hub + support linking | 3 pages | Distribute authority to money pages |
| **Wave 5** | 5–6 | Tour page sprint + publish | 4 tours + 1 new | Capture transactional queries |
| **Ongoing** | Monthly | GSC loop | All refreshed URLs | Re-measure CTR at 28 days |

---

## Wave 1 — Transport & Comparison ✅ SHIPPED 2026-05-24

### 1. `/blog/agadir-to-marrakech-train-bus-day-tour.html` ✅

**Priority:** P0 — largest impression page on the site

| Field | Detail |
| --- | --- |
| Primary cluster | `agadir to marrakech`, `agadir to marrakech train`, distance queries |
| GSC signal | 5,001 imp, 0.36% CTR, position 9.6 |
| Intent | Informational with day-trip commercial assist |
| Refresh type | Intent + CTR |
| Existing brief | Extend from `7-day-seo-plan-2026-05-01.md` |

**Query targets (0-click, high volume):**

- `how far is agadir from marrakech` — 168 imp, pos 9.5
- `how far is marrakech from agadir` — 149 imp, pos 10.1
- `agadir to marrakech distance` — 109 imp, pos 9.6
- `is there a train from agadir to marrakech` — 29 imp, pos 8.8
- `how to get from agadir to marrakech` — 29 imp, pos 10.0

**Required changes:**

- **Title:** `Agadir to Marrakech: Train, Bus, Distance & Day Trip (2026 Guide)`
- **Meta:** Lead with distance (≈250 km), drive time, and “no direct train” if accurate — match the SERP question in the first 120 characters
- **Above fold:** Quick-answer box with distance table (km, drive time, train segment, bus, taxi range, day-trip option)
- **H2 add:** “How far is Agadir from Marrakech?” — answer in first sentence
- **H2 add:** “Is there a train from Agadir to Marrakech?” — yes/no + what actually runs
- **FAQ schema:** distance, train existence, bus price range, day trip worth it, drive time
- **Internal links:** → `/tours/day-trip-marrakech-from-agadir-new.html`, → `/blog/agadir-vs-marrakech-2026.html`, → `/blog/agadir-day-trips.html`
- **CTA:** Day-trip block after transport comparison section

**Definition of done:** ✅ Shipped — quick-answer table, FAQ schema, updated title/meta, day-trip CTA, cross-links. **Re-measure CTR ≥0.54% by 2026-06-21.**

---

### 2. `/blog/agadir-vs-marrakech-2026.html` ✅

**Priority:** P0 — second-largest impression page

| Field | Detail |
| --- | --- |
| Primary cluster | `agadir vs marrakech`, `agadir or marrakech`, `is agadir better than marrakech` |
| GSC signal | 3,755 imp, 0.51% CTR, position 7.8 |
| Refresh type | CTR |

**Required changes:**

- **Title:** `Agadir vs Marrakech (2026): Which Is Better for Your Trip?`
- **Meta:** Name the decision factors upfront — beach vs medina, families, nightlife, budget
- **Intro:** One-sentence verdict framework (“Choose Agadir if… Choose Marrakech if…”)
- **Snippet hook:** Comparison table moved higher (currently fragmented across `#comparison-table` anchors)
- **FAQ add:** `Should I stay in Agadir or Marrakech?`, `Is Agadir cheaper than Marrakech?`, `Can I visit both in one trip?`
- **Internal links:** → transport guide, → day-trip money page, → `/blog/agadir-3-day-itinerary.html`

**Definition of done:** ✅ Shipped — decision table above fold, updated title/meta, transport + day-trip links. **Re-measure CTR ≥0.77% by 2026-06-21.**

---

## Wave 2 — Planning Content CTR Fixes ✅ SHIPPED 2026-05-24

### 3. `/blog/best-time-visit-agadir-2026.html` ✅

**Priority:** P1

| Field | Detail |
| --- | --- |
| Primary cluster | `best time to visit agadir`, weather-by-month, seasonal planning |
| GSC signal | 2,586 imp, 0.23% CTR, position 6.4 |
| Refresh type | CTR |

**Query targets (page 1, 0 clicks):**

- `best time to visit agadir` — 54 imp, pos 8.4
- `agadir weather july` — 43 imp, pos 1.2
- `is agadir worth visiting` — 24 imp, pos 1.1
- `agadir morocco weather` — 11 imp, pos 2.1

**Required changes:**

- **Title:** `Best Time to Visit Agadir (2026): Weather by Month & Crowds`
- **Meta:** Include “worth visiting”, peak season, and warmest months
- **Above fold:** Month-by-month temperature table (°C + °F for US/UK)
- **H2 add:** “Is Agadir worth visiting?” — short honest answer with link to things-to-do hub
- **Consolidate:** Merge `#quick-answer`, `#weather-year`, `#month-planner` content into main body sections (reduce fragment impressions)
- **Internal links:** → top-10 things, → 3-day itinerary, → budget travel post

**Definition of done:** ✅ Shipped — °C/°F table, worth-visiting section, updated title/meta. **Re-measure CTR ≥0.35% by 2026-06-21.**

---

### 4. `/blog/top-10-things-to-do-agadir-2026.html` ✅

**Priority:** P1 — 642 impressions, **0 clicks**

| Field | Detail |
| --- | --- |
| Primary cluster | `things to do in agadir`, `things to do agadir`, `what to do in agadir` |
| GSC signal | 642 imp, 0% CTR, position 7.6 |
| Refresh type | CTR + hub |

**Required changes:**

- **Title:** `10 Best Things to Do in Agadir (2026 Local Guide)`
- **Meta:** Numbered hook — beach, Paradise Valley, Souss Massa, city tour, day trips
- **Intro:** Direct answer in 2 sentences; “updated for 2026”
- **Each list item:** One contextual tour link where relevant (Paradise Valley, cable car, jet ski, day trips)
- **Internal links:** → day-trips hub, → 3-day itinerary, → Paradise Valley guide
- **ItemList schema:** Ensure structured data matches visible numbered list

**Definition of done:** ✅ Shipped — numbered table, ItemList schema, updated title/meta. **Target: first clicks within 28 days.**

---

## Wave 3 — Guide Reposition + Commercial Assist 🔄 ACTIVE

### 5. `/blog/paradise-valley-agadir-guide.html`

**Priority:** P1 — existing brief at `briefs/paradise-valley-agadir-refresh-brief.md`

| Field | Detail |
| --- | --- |
| Primary cluster | `paradise valley agadir`, `paradise valley morocco`, entrance fee, distance |
| GSC signal | 2,497 imp, 0.48% CTR, position 8.6; main term at pos 18.9 |
| Refresh type | Reposition + commercial assist |

**Required changes:** Execute existing brief. Priority adds from May GSC:

- Push `paradise valley agadir` from ~19 → top 10
- Answer `paradise valley agadir official tourism` (87 imp, pos 7.7) with practical logistics, not generic copy
- Entrance fee + taxi vs tour + distance from Agadir in first 25% of page
- Strong CTA → `/tours/tour-paradise-valley-agadir-new.html`

---

### 6. `/blog/souss-massa-national-park-agadir-guide.html`

**Priority:** P2

| Field | Detail |
| --- | --- |
| Primary cluster | `souss massa national park`, park tours, worth it |
| GSC signal | 1,227 imp, 0.65% CTR, position 7.4 |
| Refresh type | Commercial assist |

**Required changes:**

- **Title/meta:** Include “tour from Agadir” and “is it worth it”
- **FAQ:** Best time, what you see, tour vs self-drive
- **CTA:** → `/tours/tour-souss-massa-park-agadir.html`
- **Internal links:** → day-trips hub, → top-10 things

---

### 7. `/blog/budget-travel-agadir.html`

**Priority:** P2 — underperforming relative to query fit

| Field | Detail |
| --- | --- |
| Primary cluster | `is agadir cheap`, budget daily cost, cheap things to do |
| GSC signal | 817 imp, 0.61% CTR, position 5.9; `is agadir cheap` at pos 5.9 with 1 click |
| Refresh type | CTR + commercial assist |

**Required changes:**

- Sharpen title around “Is Agadir cheap?” question
- Daily budget table (budget / mid / comfort)
- Link to free and low-cost activities via top-10 and things-to-do hub

---

## Wave 4 — Hub Consolidation & Link Distribution

### 8. `/blog/agadir-day-trips.html`

**Priority:** P1 — existing brief at `briefs/agadir-day-trips-refresh-brief.md`

| Field | Detail |
| --- | --- |
| Primary cluster | `day trips from agadir`, `agadir day trips`, `best day trips from agadir` |
| GSC signal | 173 imp, 0 clicks, position 21; queries at pos 40–51 |
| Refresh type | Hub rebuild |

**Required changes:** Execute existing brief. This hub unlocks Wave 1–3 gains:

- Route cards: Marrakech, Essaouira, Paradise Valley, Taroudant, Souss Massa
- Price band + drive time + best-for traveler type per route
- Direct links to every matching tour URL

---

### 9. `/blog/agadir-3-day-itinerary.html`

**Priority:** P2 — performing well; support role

| Field | Detail |
| --- | --- |
| GSC signal | 1,478 imp, 1.56% CTR, position 4.0 |
| Refresh type | Internal-link refresh only |

**Required changes (light touch):**

- Add links to refreshed transport guide, day-trips hub, where-to-stay (once published)
- Day 2 / Day 3 blocks → Paradise Valley tour, city tour, optional Marrakech day trip
- Do not rewrite what's working

---

### 10. `/blog/agadir-vs-essaouira-2026.html`

**Priority:** P2 — maintain

| Field | Detail |
| --- | --- |
| GSC signal | 1,727 imp, 1.16% CTR, position 7.3 |
| Refresh type | Link + snippet polish only |

**Required changes:**

- Add link to day-trips hub and Essaouira day-trip tour
- Consolidate `#quick-answer` / `#comparison-table` content into main body
- Minor title test if CTR dips below 1.0%

---

## Wave 5 — Money Pages + One Net-New Publish

### 11. `/tours/tour-jet-ski-agadir-new.html`

**Priority:** P0 commercial

| Field | Detail |
| --- | --- |
| Primary cluster | `jet ski agadir`, `agadir jet ski price`, duration queries |
| GSC signal | 2,641 imp, 0.08% CTR, position 6.1 |
| Refresh type | Money page |

**Required changes:**

- **Title:** Include price range and duration (e.g. 15 min / 30 min)
- **Above fold:** Price table, marina location, what's included
- **FAQ:** Price for 15 minutes, booking, age limits, best time of day
- **Support content:** Optional short blog assist only if tour page refresh doesn't move CTR in 28 days

---

### 12. `/tours/day-trip-marrakech-from-agadir-new.html`

**Priority:** P1 — existing brief

| Field | Detail |
| --- | --- |
| GSC signal | 49 imp, pos 21.8; long-tail day-trip queries at pos 34–55 |
| Refresh type | Money page |

**Required changes:** Execute `briefs/marrakech-day-trip-from-agadir-refresh-brief.md`. Link from refreshed transport guide and vs-Marrakech post.

---

### 13. `/tours/tour-paradise-valley-agadir-new.html`

**Priority:** P2

| Field | Detail |
| --- | --- |
| GSC signal | 381 imp, 0.26% CTR, position 8.3 |
| Refresh type | Money page |

**Required changes:** Align title/H1 with guide; pickup, duration, swimming season, price from.

---

### 14. `/tours/tour-moroccan-hammam-agadir.html`

**Priority:** P2 — research-weighted cluster

**Required changes:** Upgrade from minor tour page to core activity page; French query support in meta/H2 where appropriate.

---

### 15. **Publish** `/blog/where-to-stay-in-agadir.html` (net-new)

**Priority:** P1 new — not a refresh

| Field | Detail |
| --- | --- |
| Query signal | `where to stay in agadir` — pos 1, early impression |
| Status | Drafted in content database |
| Action | Finish edit → publish → add to travel-guide hub |

**Post-publish links:**

- From: 3-day itinerary, top-10 things, best-time post, homepage/travel-guide
- To: city tour, all-tours, day-trips hub

---

## Internal Linking Sprint (after Waves 1–2)

Run once transport + planning refreshes ship. Every source page gets contextual in-body links (not sidebar only).

| Source (after refresh) | Target | Anchor suggestion |
| --- | --- | --- |
| Transport guide | Marrakech day-trip tour | Marrakech day trip from Agadir |
| Transport guide | vs Marrakech post | Agadir vs Marrakech comparison |
| Transport guide | Day-trips hub | best day trips from Agadir |
| vs Marrakech | Transport guide | how to get from Agadir to Marrakech |
| vs Marrakech | Day-trip tour | guided Marrakech day trip |
| Best time | Top-10 things | things to do in Agadir |
| Best time | 3-day itinerary | 3 days in Agadir |
| Top-10 things | Paradise Valley guide | Paradise Valley guide |
| Top-10 things | Day-trips hub | Agadir day trips |
| Paradise Valley guide | PV tour | Paradise Valley tour from Agadir |
| 3-day itinerary | Day-trips hub | day trips from Agadir |
| Day-trips hub | All 5 core tour URLs | route-specific anchors |
| Homepage / travel-guide | Where-to-stay (new) | where to stay in Agadir |

---

## Fragment URL Cleanup

GSC shows many `#anchor` URLs with impressions and 0 clicks. During each refresh:

1. Move the answer content into the main page body.
2. Keep anchors for UX navigation only.
3. Do not create new standalone section URLs in sitemap or internal links.
4. Prefer linking to the canonical page URL without fragments.

**Highest-impact fragments to consolidate:**

- `best-time-visit-agadir-2026.html#quick-answer` — 137 imp
- `agadir-vs-essaouira-2026.html#comparison-table` — 116 imp
- `agadir-to-marrakech-train-bus-day-tour.html#train` — 37 imp

---

## Markets & Device Notes

| Segment | Action |
| --- | --- |
| **UK** | Default English phrasing; £ in budget examples where relevant |
| **US** | Add °F alongside °C on weather/best-time pages; “Agadir Morocco” in titles |
| **Morocco / FR** | Keep French FAQ variants on hammam and city-tour pages |
| **Desktop** | Longer meta descriptions (150–160 chars); comparison tables in HTML not image-only |
| **Mobile** | Quick-answer boxes first; tour CTA before midpoint per playbook |

---

## Metrics & Review Cadence

### Per-page success (check 28 days after each refresh)

| Metric | Target |
| --- | --- |
| CTR | Beat pre-refresh baseline by ≥50% relative (e.g. 0.36% → 0.54%+) |
| Clicks | +30% vs prior 28-day window for that URL |
| Position | Hold or improve for primary cluster |
| Fragment impressions | Flat or down for `#section` URLs |

### Site-level (monthly)

- Total clicks from refreshed URL set
- UK and US CTR separately
- Mobile vs desktop CTR gap (target: desktop within 50% of mobile CTR)
- Tour page clicks from organic landing

### Update these files after each wave

- `seo-cockpit/google-sheets-content-database.tsv` — Status → `published` / `refresh-needed`
- `seo-cockpit/reports/keyword-tracker-2026-05-01.csv` — add May 24 GSC columns
- `seo-cockpit/reports/monthly-seo-status.template.md` — copy to dated report

---

## Execution Calendar (Suggested)

| Week | Ship | Artifact |
| --- | --- | --- |
| **1** | ~~Transport guide refresh~~ | ✅ shipped 2026-05-24 |
| **1** | ~~vs Marrakech refresh~~ | ✅ shipped 2026-05-24 |
| **2** | ~~Best time refresh~~ | ✅ shipped 2026-05-24 |
| **2** | ~~Top-10 things refresh~~ | ✅ shipped 2026-05-24 |
| **3** | Paradise Valley guide | **← do now** |
| **3** | Souss Massa guide | page-refresh-brief |
| **4** | Day-trips hub rebuild | use existing brief |
| **4** | Budget travel light refresh | page-refresh-brief |
| **5** | Jet ski + Marrakech day-trip tours | money-page briefs |
| **5** | Publish where-to-stay | new blog |
| **6** | Paradise Valley tour + hammam | money-page briefs |
| **6** | 3-day itinerary link-only update | light touch |
| **6** | **GSC review** | export + compare to this baseline |

---

## Recommended Briefs To Create Next

These pages have enough GSC signal to brief immediately:

1. `briefs/agadir-to-marrakech-transport-refresh-brief.md` — Wave 1 #1 (or extend 7-day plan section)
2. `briefs/best-time-visit-agadir-refresh-brief.md` — Wave 2
3. `briefs/top-10-things-refresh-brief.md` — Wave 2
4. `briefs/jet-ski-agadir-refresh-brief.md` — Wave 5

Existing briefs ready to execute without rewrite:

- `briefs/paradise-valley-agadir-refresh-brief.md`
- `briefs/agadir-day-trips-refresh-brief.md`
- `briefs/marrakech-day-trip-from-agadir-refresh-brief.md`

---

## Risks & Guardrails

- **Do not** reposition the homepage away from brand intent.
- **Do not** merge vs-Marrakech and transport guides — different intent stages.
- **Do not** publish accommodation sub-cluster (best hotels, all-inclusive, etc.) until Wave 1–2 CTR fixes ship — avoid splitting crawl budget.
- **Verify** train/bus facts and pricing before transport refresh — no invented logistics.
- **Cannibalization watch:** `agadir to marrakech` splits across transport blog (pos 14) and day-trip tour (pos 21+) — link hierarchy should make the blog the info hub and the tour the booking page.

---

## Summary: Do This First

1. Refresh **Agadir to Marrakech transport guide** (5,001 impressions, 0.36% CTR)
2. Refresh **Agadir vs Marrakech** (3,755 impressions, 0.51% CTR)
3. Refresh **Best time to visit** (2,586 impressions, 0.23% CTR)
4. Fix **Top 10 things to do** (642 impressions, 0 clicks)
5. Run **internal linking sprint** across Waves 1–2
6. Execute existing **Paradise Valley** and **day-trips hub** briefs
7. Refresh **jet ski tour page** (2,641 impressions, 0.08% CTR)
8. **Publish where-to-stay** article

Everything else in this plan is Wave 3–5 support work that compounds after the first four refreshes land.
