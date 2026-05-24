# Cross-Brand Link Measurement — Target 2026-06-21

**Shipped:** 2026-05-24  
**Brands:** [agadirlocalguide.com](https://agadirlocalguide.com/) ↔ [ranchtamri.com](https://ranchtamri.com/)

## What was shipped

### Entity / schema
- ALG: `sameAs` + `founder` on homepage and tour-page `LocalBusiness` blocks
- RT: `lib/site-entity.ts`, homepage JSON-LD, tour `provider`, blog `publisher`

### Contextual links (ALG → RT)
- `blog/quad-biking-tamri-banana-beach.html`
- `tours/tour-horse-riding-agadir.html`
- `blog/top-10-things-to-do-agadir-2026.html`
- `blog/agadir-3-day-itinerary.html`
- `contact-us.html`

### Contextual links (RT → ALG)
- Homepage blog guides section → travel guide hub
- `best-things-to-do-in-agadir` + `is-agadir-worth-visiting` blog sections
- Desert tour bottom CTA → day trips + Paradise Valley on ALG
- Footer partner line

### Sitewide footer
- ALG: partner line on all pages with site footer
- RT: partner line in `Footer.tsx`

## Re-measure on 2026-06-21

Check **both** GSC properties separately.

### Cannibalization watchlist

| Query cluster | Primary domain | Watch for |
| --- | --- | --- |
| horse riding agadir | ranchtamri.com | ALG URL swapping in/out of top 10 |
| quad biking tamri | ranchtamri.com | Both domains ranking same URL type |
| things to do in agadir | agadirlocalguide.com | RT blog outranking ALG pillar |
| paradise valley agadir | agadirlocalguide.com | RT day-trip page competing |
| camel ride agadir bbq | ranchtamri.com | Duplicate intent on ALG camel pages |

### Cross-domain referral (optional GA4)

If UTM tags are added later, use:
- `utm_source=agadirlocalguide&utm_medium=referral&utm_campaign=sister-brand`
- `utm_source=ranchtamri&utm_medium=referral&utm_campaign=sister-brand`

### Crawl check

In GSC → URL inspection, confirm Google can fetch cross-domain targets from:
- ALG Tamri quad blog → RT quad hub
- RT homepage → ALG travel guide

### Definition of done (4–6 weeks)

- [ ] At least one cross-domain link pair shows referral sessions in analytics OR GSC links report shows discovered external links
- [ ] Cannibalization watchlist queries show a stable primary domain (not weekly swapping)
- [ ] No new manual actions or link-spam warnings (none expected if rules in playbook are followed)

## If cannibalization appears

1. Strengthen primary-domain page for that query (title, intro, internal links)
2. Reduce secondary-domain competing page to commercial-assist (shorter, links out)
3. Do **not** add more reciprocal footer links
