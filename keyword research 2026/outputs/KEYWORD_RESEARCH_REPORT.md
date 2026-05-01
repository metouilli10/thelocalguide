# Agadir Local Guide — master keyword research reference

**Site:** [agadirlocalguide.com](https://agadirlocalguide.com)  
**Last updated:** 2026-04-12  
**Purpose:** Canonical SEO reference for page refreshes, new page briefs, internal linking, keyword clustering, and future content planning.

## What Changed In This Upgrade

This file is no longer just a first-pass keyword summary. It now combines:

- the existing filtered keyword set in this folder;
- fresh April 2026 validation pulls from **DataForSEO**;
- live SERP and page-pattern sampling via **Firecrawl**;
- a site-level view of **where Agadir Local Guide ranks now** versus OTAs and local operators.

Use this document as the top-level strategic reference. Use `page_opportunity_map.csv` as the working sheet for execution.

## Methodology

| Layer | Tool | Notes |
|------|------|------|
| Base keyword corpus | Existing scripts in `keyword research 2026/` | Existing merge/filter/build pipeline preserved as the baseline dataset. |
| Fresh product validation | `dataforseo_labs_google_keyword_overview` | Used to validate real search demand for actual tours on the site. |
| Difficulty checks | `dataforseo_labs_bulk_keyword_difficulty` | Helpful where available, but many product phrases still return no KD. |
| Expansion and idea mining | `dataforseo_labs_google_keyword_ideas`, `keyword_suggestions`, `related_keywords` | Useful for discovery; noisy without business filtering. |
| Current visibility | `dataforseo_labs_google_ranked_keywords` | Used to see where `agadirlocalguide.com` already has traction. |
| Competitor overlap | `dataforseo_labs_google_competitors_domain`, `google_domain_intersection` | Used to identify local operators and topic gaps. |
| Live winner analysis | Firecrawl `search` + `scrape` | Used to extract page structures and conversion patterns from ranking pages. |

## Market Model

Think about this project in three SEO buckets:

1. **Money pages**  
   Tour / activity / excursion pages where the keyword already implies booking intent.
2. **Hybrid guide pages**  
   Pages that win both information and conversion intent, like Paradise Valley, day trips, or city tours.
3. **Authority hubs**  
   Broad guides like “things to do in Agadir” that build visibility, internal links, and remarketing demand for tour pages.

## Executive Thesis

- The current site already touches many commercial topics, but the organic footprint is still **weak-to-mid SERP range** for valuable English queries.
- The original research **underestimated French commercial demand** for several activity clusters, especially `hammam agadir`, `quad agadir`, `jet ski agadir`, `parc national souss massa`, `téléphérique agadir`, and `visite agadir`.
- OTAs dominate broad commercial head terms, but local operators win by combining **pricing, itinerary detail, hotel pickup, reviews, and bundle/cross-sell logic** on-page.
- The biggest near-term growth is not “more random blog posts.” It is:
  - upgrading the strongest commercial pages;
  - building a tighter activity hub architecture;
  - filling a few validated product gaps the current keyword master barely covered.

## Current Visibility Snapshot

Fresh DataForSEO ranking checks show the site is visible, but usually not yet competitive enough on high-value English terms:

| Keyword | Volume | Current position | Current URL |
|------|------:|------:|------|
| `quad bike agadir` | 320 | 31 | `blog/quad-biking-agadir-guide.html` |
| `horse riding in agadir` | 170 | 23 | `tours/tour-horse-riding-agadir.html` |
| `camel riding agadir` | 170 | 38-45 | `tours/tour-morning-camel-ride-agadir.html` / `tours/tour-agadir-sunset-camel-ride.html` |
| `agadir day trips` | 880 | 62 | `blog/agadir-day-trips.html` |
| `day trips from agadir` | 320 | 53 | `blog/agadir-day-trips.html` |
| `agadir to marrakech day trip` | 260 | 59 | `tours/day-trip-marrakech-from-agadir-new.html` |
| `agadir morocco paradise valley` | 1900 | 58 | `blog/paradise-valley-agadir-guide.html` |

Interpretation: the site has proof that Google understands the topics, but most high-value pages still need stronger rank-driving structure.

## High-Value Keyword Clusters

### Tier 1: Core revenue clusters

| Cluster | Why it matters | Best current asset | Immediate action |
|------|------|------|------|
| Paradise Valley | Biggest commercial cluster after Marrakech transport/day-trip demand; strong mixed guide + booking intent. | `blog/paradise-valley-agadir-guide.html` + Paradise Valley tour page | Turn the guide into the definitive local entity page and push the tour page harder through internal links. |
| Agadir day trips | Core commercial hub intent; OTAs own this today. | `blog/agadir-day-trips.html` | Rebuild as a money hub with pricing snippets, trip cards, and links to every excursion page. |
| Marrakech from Agadir | Strong commercial demand with direct booking and comparison intent. | `tours/day-trip-marrakech-from-agadir-new.html` + related blog | Tighten keyword focus, itinerary clarity, and FAQ around price / bus / train / distance comparisons. |
| Things to do in Agadir | Largest awareness cluster; essential authority hub. | `blog/top-10-things-to-do-agadir-2026.html` / `travel-guide.html` | Keep as a hub, but aggressively route users into product clusters instead of treating it as a pure blog play. |

### Tier 1.5: Product terms that deserve more weight than they currently get

Fresh validation showed the following product terms are stronger than the current research pack suggests.

#### English product validation

| Keyword | Volume | Intent | Competition | Notes |
|------|------:|------|------|------|
| `hammam agadir` | 320 | transactional | LOW | Strong enough to justify a serious commercial page, not a throwaway activity listing. |
| `agadir boat trip` / `boat trip agadir` | 260 | commercial / transactional | MEDIUM | Clear product demand; current research underweighted it. |
| `jet ski agadir` / `agadir jet ski` | 260 | commercial / transactional | MEDIUM | Strong activity demand with seasonal upside. |
| `horse riding agadir` / `agadir horse riding` | 170 | transactional | MEDIUM | Site already ranks, so this is an optimization opportunity, not a new-topic gamble. |
| `camel ride agadir` | 170 | transactional | MEDIUM | Existing pages should consolidate intent better. |
| `quad biking agadir` | 320 | transactional | MEDIUM | Already visible; worth stronger commercial treatment. |
| `agadir city tour` | 30 | commercial | MEDIUM, KD 19 | Lower volume but high fit; useful if paired with cable car intent. |
| `surf lessons agadir` | 50 | commercial | MEDIUM | Smaller but valid niche product term. |
| `agadir cooking class` | 20 | commercial | MEDIUM | Low volume, but highly specific and easy to own with the right page. |

#### French product validation

| Keyword | Volume | Intent | Competition | Notes |
|------|------:|------|------|------|
| `hammam agadir` | 4400 | commercial | MEDIUM | Major missed cluster in the first-pass pack. |
| `quad agadir` | 2400 | commercial | MEDIUM | Strong French demand; deserves direct page optimization. |
| `parc national souss massa` | 2400 | commercial | LOW | Important because the site already has a relevant tour. |
| `jet ski agadir` | 1600 | commercial | MEDIUM | Strong sellable activity demand. |
| `téléphérique agadir` | 1300 | commercial | LOW | Competitors are already using this to capture city-tour demand. |
| `visite agadir` | 720 | commercial | MEDIUM, KD 2 | Excellent low-friction French hub opportunity. |
| `buggy agadir` | 720 | commercial | MEDIUM | Stronger than the current pack reflected. |
| `surf agadir` | 720 | commercial | MEDIUM | Broad but usable if scoped carefully around lessons and surf experiences. |
| `excursion bateau agadir` | 90 | commercial | MEDIUM | Small but qualified booking term. |
| `balade bateau agadir` | 70 | commercial | MEDIUM | Same cluster, seasonally stronger. |
| `balade chameau agadir` | 70 | commercial | HIGH | Good French commercial modifier. |

## What The Site Should Prioritize

### Refresh first

These URLs are the highest-leverage refresh candidates:

1. `blog/agadir-day-trips.html`
2. `blog/paradise-valley-agadir-guide.html`
3. `tours/day-trip-marrakech-from-agadir-new.html`
4. `tours/tour-moroccan-hammam-agadir.html`
5. `tours/tour-agadir-half-day-boat-trip.html`
6. `tours/tour-jet-ski-agadir-new.html`
7. `tours/tour-agadir-guided-city-tour-cable-car.html`
8. `tours/tour-souss-massa-park-agadir.html`
9. `tours/tour-surf-lessons-agadir.html`
10. `all-tours.html`

### Why these matter

- `agadir-day-trips.html` should become the **commercial hub** that OTAs currently own.
- `paradise-valley-agadir-guide.html` should be the **definitive local guide** page that also routes booking demand.
- `tour-moroccan-hammam-agadir.html`, `tour-agadir-half-day-boat-trip.html`, and `tour-jet-ski-agadir-new.html` are sitting in clusters with better demand than the original pack captured.
- `tour-agadir-guided-city-tour-cable-car.html` has extra upside because competitors are actively targeting **cable car / telepherique** demand.
- `tour-souss-massa-park-agadir.html` is more valuable than it looked because `parc national souss massa` is strong in French and `souss massa national park` is meaningful in English.

## Competitor Landscape

### SERP reality

In English commercial SERPs, the site mainly overlaps with:

- `getyourguide.com`
- `viator.com`
- `tripadvisor.com`
- `tripadvisor.co.uk`
- `tui.co.uk`
- `admiremorocco.com`
- `agadir-visite.com`
- `excursionmania.com`

This means the site is not losing only to OTAs. It is also losing to **leaner local operators** that package the page more effectively.

### Local competitor signals worth watching

Fresh domain intersection checks showed competitor traction on topics that should matter to this project:

- `admiremorocco.com` has visibility on `agadir cable car`, `crocoparc`, `agadir medina`, `things to do in agadir`, `paradise valley agadir`, and `agadir to marrakech`.
- `agadir-visite.com` has visibility on broader destination queries like `agadir`, `where is agadir`, `agadir old town`, and `agadir quad`.
- `excursionagadiractivity.com` is weaker in the UK overlap snapshot, but still captures edge-case excursion demand on routes and circuit pages.

## What Winning Pages Are Doing

Firecrawl teardown of representative winners found repeatable patterns:

### OTA / marketplace pattern

`GetYourGuide` wins broad day-trip pages with:

- visible pricing;
- visible review volume;
- strong “hotel pickup” or convenience hooks;
- dense inventory on one page;
- clear conversion modules.

### Editorial guide pattern

`MarocMama` and `Mariela Around the World` win informational intent with:

- practical logistics;
- seasonality advice;
- itinerary/list structures;
- FAQ-style answers;
- destination context beyond the attraction itself.

### Local operator pattern

`Excursion Agadir Activity` and `Admire Morocco` consistently surface:

- pricing on-page;
- itinerary/timing detail;
- bundle offers and cross-sells;
- testimonials/reviews;
- photo-heavy product cards;
- pickup messaging.

That is the page pattern this project should emulate on core tour pages.

## Page Architecture Guidance

### Commercial hubs to own

- **Agadir day trips hub**  
  Primary job: rank for day-trip intent and distribute authority to Marrakech, Essaouira, Taroudant, Souss Massa, Paradise Valley, and future excursions.

- **All tours / things to do hub**  
  Primary job: act as the bridge between informational “things to do” demand and sellable activity pages.

- **French activity hub**  
  Best target cluster: `visite agadir`, `excursion agadir`, `quad agadir`, `hammam agadir`, `jet ski agadir`, `téléphérique agadir`.

### Supporting guide pages to expand

- Paradise Valley logistics guide
- Agadir vs Marrakech
- Agadir vs Essaouira
- 3-day Agadir itinerary
- transport/comparison guides around Marrakech access

### Commercial modifiers to work into product pages

- price / pricing
- hotel pickup
- duration
- what is included
- cancellation
- family / couples / beginner suitability
- local guide / licensed guide
- Taghazout / Tamraght / Aourir pickup variants where relevant

## Specific Content Gaps

| Gap | Why it matters | Recommendation |
|------|------|------|
| Cable car / telepherique demand | Competitors are already capturing it; French demand is real. | Strengthen `tour-agadir-guided-city-tour-cable-car.html` and make cable car intent explicit in title/H1/FAQ. |
| Hammam demand | The first-pass pack understated this badly, especially in French. | Treat hammam as a core sellable activity, not a minor supporting page. |
| Boat trip demand | Commercial and seasonal; already fits the offer set. | Improve page depth, pricing clarity, and seasonal language. |
| Jet ski demand | Strong commercial activity demand in both languages. | Make this page more independent and keyword-led. |
| French “visite Agadir” hub | KD is low and fit is strong. | Build or optimize a French city/activity hub that routes into tours. |
| Souss Massa demand | Strong match to an existing tour. | Upgrade the tour page and support it with guide-style internal links. |

## Question Angles To Own

Keep the existing `question_gaps.csv`, but expand coverage around:

- how much is the cable car in Agadir?
- is Paradise Valley worth it?
- do you need a guide for Paradise Valley?
- how many day trips from Agadir are worth doing?
- what is the difference between a hammam and spa in Agadir?
- which Agadir activity is best for families?
- what to do in Agadir in 3 days?

## How To Use This Reference

- For a **page refresh**: start with the relevant cluster and keyword section here, then use `page_opportunity_map.csv`.
- For a **new page brief**: choose the exact keyword, match the page to the right bucket, then pull supporting questions from `question_gaps.csv`.
- For **internal linking**: route authority from `things to do`, itinerary, and comparison content into money pages.
- For **future research**: preserve this document as the narrative layer, and rerun the scripts / MCP pulls beneath it.

## Important Caveats

- English demand is still best interpreted as **UK outbound demand**, because DataForSEO Labs does not reliably support `en + Morocco` for this workflow.
- French data is much more useful for local / regional demand, but some Morocco-FR results still include mixed-language tokens.
- Missing KD does **not** mean the topic is unattractive. For many activity phrases, the more important signals are demand, fit, and current competitor page quality.

## Deliverables In This Folder

| File | Purpose |
|------|---------|
| [`KEYWORD_RESEARCH_REPORT.md`](KEYWORD_RESEARCH_REPORT.md) | This flagship narrative reference. |
| [`page_opportunity_map.csv`](page_opportunity_map.csv) | Operational page-by-page action sheet. |
| [`executive_summary.json`](executive_summary.json) | Machine-readable strategy summary for future agents / automation. |
| [`keywords_master.csv`](keywords_master.csv) | Baseline filtered keyword export from the original pipeline. |
| [`long_tail_5plus_words.csv`](long_tail_5plus_words.csv) | Supporting long-tail list from the original pipeline. |
| [`question_gaps.csv`](question_gaps.csv) | FAQ / PAA-style gap inventory. |

## Re-Running The Research

1. Refresh the underlying DataForSEO pulls.
2. Rebuild the baseline dataset with:
   - `python3 merge_labs_outputs.py`
   - `python3 tourism_filter.py`
   - `python3 build_final.py`
3. Re-run the validation layer used in this update:
   - product keyword overview;
   - ranked keyword snapshots;
   - competitor overlap checks;
   - Firecrawl page teardowns.
4. Update this report last, after the quantitative layer is stable.
