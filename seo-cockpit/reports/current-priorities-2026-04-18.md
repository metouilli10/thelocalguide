# Current Priorities

## Snapshot
- Reporting date: `2026-04-18`
- Prepared from:
  - `seo-cockpit/context/business-profile.json`
  - `seo-cockpit/context/tour-inventory.json`
  - `SEARCH_CONSOLE_REVIEW_2026-03-21.md`
  - `keyword research 2026/outputs/KEYWORD_RESEARCH_REPORT.md`
  - `keyword research 2026/outputs/page_opportunity_map.csv`
  - `seo-cockpit/briefs/top-3-refresh-keyword-map.md`
  - existing refresh briefs in `seo-cockpit/briefs/`

## Top 3 Quick Wins
1. Refresh `/blog/paradise-valley-agadir-guide.html` first. It already has strong visibility (`1,917` impressions, average position `9.8`) and is the clearest near-page-one CTR win.
2. Rebuild `/blog/agadir-day-trips.html` as a commercial hub. The topic is validated, but the page still behaves like a weak listicle instead of a route-comparison page that can rank and distribute authority.
3. Refresh `/tours/day-trip-marrakech-from-agadir-new.html` as a harder-working money page. The query fit is strong, but the page needs better objection handling around drive time, value, and transport alternatives.

## Existing Pages To Refresh
| Priority | File | Reason | Suggested Artifact |
| --- | --- | --- | --- |
| High | `/blog/paradise-valley-agadir-guide.html` | Best existing CTR refresh target; high impressions and clear guide-plus-booking intent | `page-refresh-brief` |
| High | `/blog/agadir-day-trips.html` | Validated P1 cluster; should become the main day-trip money hub | `page-refresh-brief` |
| High | `/tours/day-trip-marrakech-from-agadir-new.html` | Strong commercial fit; needs clearer price, itinerary, and comparison framing | `page-refresh-brief` |
| High | `/blog/top-10-things-to-do-agadir-2026.html` | Strong visibility with weak click efficiency; should route users into core tour pages | `page-refresh-brief` |
| High | `/tours/tour-moroccan-hammam-agadir.html` | Research materially underweighted this cluster, especially in French | `page-refresh-brief` |
| High | `/tours/tour-souss-massa-park-agadir.html` | Existing topic fit plus strong French demand around `parc national souss massa` | `page-refresh-brief` |
| Medium | `/tours/tour-agadir-guided-city-tour-cable-car.html` | Underserving both English city-tour intent and French cable-car demand | `page-refresh-brief` |
| Medium | `/tours/tour-agadir-half-day-boat-trip.html` | Commercial demand is stronger than the older keyword layer suggested | `page-refresh-brief` |
| Medium | `/tours/tour-jet-ski-agadir-new.html` | Strong seasonal product demand in both English and French | `page-refresh-brief` |
| Medium | `/tours/tour-agadir-half-quad-biking-adventure.html` | Existing visibility is present, but intent is split and internal-link support is weak | `page-refresh-brief` |

## New Content Opportunities
| Priority | Keyword Or Topic | Intent | Suggested Target | Suggested Artifact |
| --- | --- | --- | --- | --- |
| High | `visite agadir` / French city-and-activities hub | Informational with commercial assist | Retarget `travel-guide.html`, or create a dedicated French hub if bilingual targeting becomes too mixed | `new-commercial-page-brief` |
| Medium | Question-led support around `what to do in Agadir in 3 days` | Informational with commercial assist | Expand or retarget `/blog/agadir-3-day-itinerary.html` around activity-routing intent | `page-refresh-brief` |

## New Commercial Opportunities
| Priority | Keyword | Search Intent | Proposed Page Path | Why Now |
| --- | --- | --- | --- | --- |
| High | `visite agadir` | Commercial | `/fr/visite-agadir.html` | This is the only clearly validated net-new hub opportunity that beats forcing the keyword into an awkward English-first page. |
| Medium | French activity-layer landing for `excursion agadir` / `quad agadir` / `hammam agadir` | Commercial | `/fr/excursions-agadir.html` | French demand is materially stronger than the original research pack captured, but this should come after the highest-leverage refreshes. |

## Internal Linking Opportunities
- Source page: `/blog/top-10-things-to-do-agadir-2026.html`
  - target page: `/blog/paradise-valley-agadir-guide.html`
  - anchor suggestion: `Paradise Valley in Agadir`
  - reason: strengthen the strongest informational asset already close to page one
- Source page: `/blog/top-10-things-to-do-agadir-2026.html`
  - target page: `/blog/agadir-day-trips.html`
  - anchor suggestion: `best day trips from Agadir`
  - reason: push authority from the broadest awareness page into the day-trip hub
- Source page: `/blog/agadir-day-trips.html`
  - target page: `/tours/day-trip-marrakech-from-agadir-new.html`
  - anchor suggestion: `Marrakech day trip from Agadir`
  - reason: support the highest-value long-route money page with exact-intent anchors
- Source page: `/blog/agadir-day-trips.html`
  - target page: `/tours/tour-souss-massa-park-agadir.html`
  - anchor suggestion: `Souss Massa National Park tour`
  - reason: connect the day-trip hub to an underleveraged wildlife route with strong French demand
- Source page: `/blog/paradise-valley-agadir-guide.html`
  - target page: `/tours/tour-paradise-valley-agadir-new.html`
  - anchor suggestion: `Paradise Valley tour from Agadir`
  - reason: convert guide intent without collapsing the guide and tour pages into the same job
- Source page: `/blog/paradise-valley-agadir-guide.html`
  - target page: `/blog/agadir-day-trips.html`
  - anchor suggestion: `other day trips from Agadir`
  - reason: strengthen hub circulation and keep trip-planning pathways obvious

## Risks And Blockers
- Duplicate and legacy URL families still appear in Search Console, so refresh work may underperform until redirects are fully enforced.
- Some high-priority pages are already modified locally in the working tree, which means publish-readiness and final copy direction should be reviewed before rollout.
- Price-led snippet upgrades need validation against approved tour pricing before they are surfaced more aggressively.
- The repo has strong strategic inputs, but not yet a fresh April post-change GSC export to measure whether recent edits improved CTR or ranking.

## Recommended Next Artifacts
1. Create: `seo-cockpit/briefs/tour-moroccan-hammam-agadir-refresh-brief.md`
2. Create: `seo-cockpit/briefs/tour-souss-massa-park-agadir-refresh-brief.md`
3. Create: `seo-cockpit/briefs/tour-agadir-guided-city-tour-cable-car-refresh-brief.md`
