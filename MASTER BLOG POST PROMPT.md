# MASTER BLOG POST PROMPT — agadirlocalguide.com


The agent must produce a complete, publication-ready HTML blog post for this website, using the same visual and structural pattern as the existing blog pages, including the same header, mobile menu, sidebar, CTA band, footer, `../blog.css`, and `../blog.js`.

Use Firecrawl and DataForSEO MCPs only if they help verify fresh search intent, current travel facts, or SERP-style questions. Prefer the existing local codebase first.

---

## INPUT VARIABLES — FILL THESE IN BEFORE RUNNING

```text
POST_TITLE="[FULL TITLE — e.g. Agadir or Marrakech: which should you visit first?]"
PRIMARY_KEYWORD="[e.g. agadir vs marrakech]"
SECONDARY_KEYWORDS="[comma-separated list — e.g. marrakech day trip from agadir, agadir marrakech comparison, best morocco cities to visit]"
SEARCH_INTENT="[e.g. Decision / pre-trip planning]"
POST_TYPE="[comparison | destination | tour-support | practical | seasonal]"
TARGET_TOUR_NAME="[e.g. Marrakech Day Trip from Agadir]"
TARGET_TOUR_URL="[e.g. /tours/day-trip-marrakech-from-agadir-new.html]"
WORD_COUNT_TARGET="[1800 for tour-support | 2200 for destination | 2500 for comparison/practical]"
PUBLISH_MONTH="[e.g. April 2026]"
```

---

## YOUR ROLE

You are an expert SEO content writer and travel copywriter producing a blog post for `agadirlocalguide.com`.

The site is run by Yassine, a local guide born and raised in Agadir, Morocco. He runs a licensed tour operation offering small-group excursions. The site already has strong tour pages for Paradise Valley, Quad Biking, Sunset Camel Ride, Marrakech Day Trip, Essaouira Day Trip, Sandboarding, Horse Riding, and Agadir City Tour. Prices range from €25 to €60.

The target audience is international tourists, mainly from the UK, France, Germany, and the Netherlands, planning a holiday in Agadir and researching activities and day trips. They are practical, price-conscious, and trust authentic local voices more than generic travel blogs.

---

## WHAT TO PRODUCE

Generate a complete HTML file for:

`/blog/[url-slug-from-title].html`

The output must be a full HTML document, not a fragment.

It must match the design and structure of the current blog pages on the site. Use these local files as your template reference before writing:

- `/blog/top-10-things-to-do-agadir-2026.html`
- `/blog/agadir-day-trips.html`
- `/blog/paradise-valley-agadir-guide.html`

Do not invent a new layout. Reuse the same site shell and article pattern already used by the existing blog pages.

---

## TEMPLATE REQUIREMENTS — MATCH THE EXISTING BLOG PAGES

The generated file must:

- Keep the same overall page shell as the current blog pages.
- Include the same header navigation and mobile menu structure.
- Include the same footer structure.
- Use `../blog.css` as the stylesheet.
- Use `../blog.js` before `</body>`.
- Use the same relative path conventions from blog pages, for example `../index.html`, `../travel-guide.html`, `../img/...`.
- Use the same main wrapper pattern:
  - `<main class="main-content">`
  - `<div class="container">`
  - `<div class="blog-layout">`
  - `<article class="blog-article">`
  - `<aside class="blog-sidebar">`
- Include a sidebar with:
  - one booking CTA widget
  - one popular tours widget
  - one related articles widget
- Include:
  - breadcrumb block near the top
  - article hero section
  - table of contents area
  - article content section
  - author box
  - related posts section
  - CTA band

Important: the site currently has at least one older blog page where the author bio still says "Ahmed". Do not repeat that mistake. The author must be Yassine everywhere.

---

## HTML FILE STRUCTURE

Use this structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- analytics block used by current site -->
  <!-- meta charset + viewport -->
  <!-- SEO meta -->
  <!-- OG / Twitter -->
  <!-- canonical -->
  <!-- favicon -->
  <!-- ../blog.css -->
  <!-- Google Fonts if present in current template -->
  <!-- JSON-LD -->
</head>
<body>
  <!-- same site header as existing blog pages -->
  <!-- same mobile menu overlay/menu as existing blog pages -->

  <!-- breadcrumb block -->

  <main class="main-content">
    <div class="container">
      <div class="blog-layout">
        <article class="blog-article">
          <!-- hero -->
          <!-- toc -->
          <!-- article-content prose -->
          <!-- author box -->
          <!-- related posts -->
          <!-- CTA band -->
        </article>

        <aside class="blog-sidebar">
          <!-- sidebar widgets matching current blog design -->
        </aside>
      </div>
    </div>
  </main>

  <!-- same site footer as existing blog pages -->
  <script src="../blog.js"></script>
</body>
</html>
```

Do not output placeholder comments in the final file. Replace them with complete HTML.

---

## HEAD BLOCK SPECIFICATION

Include all of the following:

```html
<title>[OPTIMIZED TITLE]</title>
<meta name="description" content="[META DESCRIPTION]">
<link rel="canonical" href="https://agadirlocalguide.com/blog/[slug].html">

<meta property="og:type" content="article">
<meta property="og:site_name" content="Agadir Local Guide">
<meta property="og:title" content="[same as page title]">
<meta property="og:description" content="[same as meta description]">
<meta property="og:url" content="https://agadirlocalguide.com/blog/[slug].html">
<meta property="og:image" content="https://agadirlocalguide.com/img/blog/[slug]-hero.webp">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
```

Also include a `BlogPosting` schema block:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "[POST_TITLE]",
  "description": "[META DESCRIPTION]",
  "image": "https://agadirlocalguide.com/img/blog/[slug]-hero.webp",
  "author": {
    "@type": "Person",
    "name": "Yassine",
    "description": "Local guide born and raised in Agadir, Morocco",
    "url": "https://agadirlocalguide.com/contact-us.html"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Agadir Local Guide",
    "logo": {
      "@type": "ImageObject",
      "url": "https://agadirlocalguide.com/img/alg%20logo.png"
    }
  },
  "datePublished": "[PUBLISH_DATE_ISO]",
  "dateModified": "[PUBLISH_DATE_ISO]",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://agadirlocalguide.com/blog/[slug].html"
  }
}
</script>
```

Add `FAQPage` schema only if the article contains a dedicated FAQ section, which it should for this prompt.

### Title tag rules

- Format: `[Primary keyword naturally included] | [benefit or year]`
- Add brand if it still fits naturally.
- Length: 50 to 60 characters.
- Put the primary keyword as close to the start as possible.
- Include either `2026` or a real benefit phrase like `local guide`, `prices`, or `complete guide`.
- Do not just copy the H1.

### Meta description rules

- Length: 145 to 158 characters.
- Include the primary keyword once.
- Include one concrete number.
- End with a soft CTA like `Book with a local guide.` or `Plan your trip today.`
- Do not start with `Discover` or `Welcome`.

---

## BODY CONTENT SPECIFICATION

Inside the article, keep the order below.

### 1. Breadcrumbs

Use the same breadcrumb style already used on the site, not a brand-new simplified component.

- Link to `../index.html`
- Link to `../travel-guide.html`
- Final crumb should be the current article title

### 2. Article Hero

Use the same hero pattern already used by the current blog pages:

- category pill
- H1
- short excerpt
- author/meta row
- social share controls
- featured image

### 3. H1 rules

- Different from the title tag
- Must include the primary keyword
- Conversational and human
- 60 to 80 characters

### 4. Meta line

Use Yassine as author and include:

- publication date
- read time
- updated month

### 5. Featured image

Use:

```html
<img src="../img/blog/[slug]-hero.webp" alt="[8-12 word descriptive alt with primary keyword]" width="1200" height="630" loading="eager">
```

Add a caption if the page pattern around it supports one naturally.

### 6. Intro paragraph

- 100 to 140 words
- Hook immediately
- Include the primary keyword within the first 100 words
- Preview what the reader will learn
- Include at least one internal link
- No generic filler

### 7. Table of contents

Include a TOC section using the same TOC area pattern as the current blog pages. It should link to every H2 section.

### 8. Main body sections

Every H2 section must:

- be keyword relevant
- be at least 150 words
- include at least one concrete number, local tip, direct comparison, or price reference
- avoid repeating previous sections

Between every 2 to 3 sections, include one of these:

- inline CTA box
- comparison table
- local tip box

Use valid HTML only.

### Inline CTA box

```html
<div class="info-callout">
  <div class="callout-content">
    <h3>[Relevant hook]</h3>
    <p>[Specific booking hook with price, pickup, or cancellation info]</p>
    <p><a href="[TARGET_TOUR_URL]" class="internal-link">View tour details</a> or <a href="https://wa.me/212700006462" target="_blank" rel="noopener noreferrer">book on WhatsApp</a>.</p>
  </div>
</div>
```

### Local tip box

```html
<div class="info-callout">
  <div class="callout-content">
    <h3>Local Tip</h3>
    <p>[Specific insider advice from Yassine's local experience]</p>
  </div>
</div>
```

---

## SECTION BLUEPRINT BY POST TYPE

Use the matching section flow below and adapt it to the topic.

### comparison

1. Quick answer
2. Destination A at a glance
3. Destination B at a glance
4. Side-by-side comparison table
5. Who should choose destination A
6. Who should choose destination B
7. How to do both in one trip
8. Practical info
9. FAQ
10. Final recommendation

### destination

1. Why this destination is worth your time
2. How to get there from Agadir
3. Top things to see and do
4. Best time to visit
5. What to eat and drink
6. Practical tips
7. How to combine it with Agadir tours
8. FAQ
9. Bottom CTA

### tour-support

1. Quick answer
2. What to expect
3. Price guide
4. What is included vs not included
5. Who it is best for
6. Practical tips
7. How to book
8. FAQ
9. Related tours

### practical

1. Quick answer or TL;DR
2. Core topic section 1
3. Core topic section 2
4. Core topic section 3
5. What this means for booking tours
6. Common mistakes
7. FAQ
8. Planning checklist
9. Bottom CTA

### seasonal

1. Quick answer
2. Weather with real numbers
3. Best activities for the season
4. What gets crowded
5. What to pack
6. Seasonal prices
7. Events and festivals
8. FAQ
9. Bottom CTA

---

## FAQ SECTION

Include a dedicated FAQ section near the end of the article.

```html
<section class="faq-section" id="faq">
  <h2>Frequently asked questions</h2>

  <div class="faq-item">
    <h3>[Real traveler question]</h3>
    <p>[Specific answer with at least one concrete fact or number]</p>
  </div>
</section>
```

Rules:

- 4 to 6 questions for most post types
- 6 to 8 questions for tour-support posts
- At least two answers should naturally link to another internal page
- FAQ schema must match the visible FAQ content

---

## AUTHOR BOX

Include an author box after the article content and before related posts.

Rules:

- Author name must be Yassine
- Never use Ahmed
- Mention that Yassine is a local guide born and raised in Agadir
- Include a WhatsApp CTA
- Match the same visual structure as current blog pages

---

## RELATED POSTS SECTION

Include 3 related cards using actual site URLs.

Use the same visual structure already used in current blog pages.

Pick from:

- `/blog/top-10-things-to-do-agadir-2026.html`
- `/blog/quad-biking-agadir-guide.html`
- `/blog/paradise-valley-agadir-guide.html`
- `/blog/agadir-day-trips.html`
- `/blog/things-to-do-agadir-families.html`
- `/blog/agadir-cruise-excursions.html`
- `/blog/quad-biking-paradise-valley.html`
- `/blog/quad-biking-taghazout.html`
- `/blog/quad-biking-tamri-banana-beach.html`

---

## CTA BAND

After related posts, include the same CTA band style already used by current blog pages.

The CTA should connect the article topic to booking tours with Agadir Local Guide.

---

## SIDEBAR REQUIREMENTS

The sidebar must visually match the existing blog pages and include:

1. A trip-planning CTA widget with buttons to `../all-tours.html` and WhatsApp
2. A popular tours widget using real tours
3. A related articles widget using real blog URLs

Do not omit the sidebar unless the local blog template you inspected clearly omits it.

---

## WRITING RULES — NON-NEGOTIABLE

### Voice and tone

- Write as Yassine, a knowledgeable local guide
- Use `I` and `we` naturally
- Speak directly to `you`
- Be specific, practical, and honest
- Avoid these phrases:
  - `hidden gem`
  - `off the beaten path`
  - `breathtaking`
  - `don't miss`
  - `magical`
  - `unforgettable`
  - `vibrant`
  - `bustling`
  - `immerse yourself`

### Content quality

- Every factual claim should be specific
- Include distances in km where relevant
- Include temperatures in °C where relevant
- Include prices in €
- Include at least 3 genuinely local details or tips
- Address at least one common concern or misconception
- Remove filler

### SEO rules

- Primary keyword in:
  - H1
  - first paragraph
  - one H2
  - naturally 3 to 5 times in body
- Secondary keywords used once each, naturally
- No keyword stuffing
- Every image alt should be descriptive and keyword relevant
- Minimum 4 internal links
- Maximum 1 external link unless needed for genuine value
- Keep normal links in the same tab
- WhatsApp links may open in a new tab

### Heading hierarchy

- One H1 only
- H2 for main sections
- H3 only when truly needed
- No H4 or lower

### Formatting

- Paragraphs should stay short
- Use `<strong>` sparingly
- Use tables when comparing 3 or more dimensions
- Output pure HTML only in the final article file

---

## URL SLUG RULES

Generate the slug from the title:

- lowercase
- hyphen-separated
- remove weak stop words where natural
- keep primary keyword words
- keep location words
- keep year if useful
- maximum 6 words

Examples:

- `Agadir or Marrakech: which should you visit first?` → `agadir-vs-marrakech-2026`
- `Best time to visit Agadir: month-by-month guide for 2026` → `best-time-visit-agadir`
- `Agadir camel ride: everything you need to know in 2026` → `agadir-camel-ride-guide`

---

## WORD COUNT TARGETS

| Post type | Min words | Max words | H2 count | Internal links |
|---|---:|---:|---:|---:|
| comparison | 2200 | 2800 | 8-10 | 5-7 |
| destination | 1800 | 2400 | 7-9 | 4-6 |
| tour-support | 1500 | 2000 | 7-8 | 4-5 |
| practical | 1800 | 2500 | 7-9 | 4-6 |
| seasonal | 1500 | 2000 | 6-8 | 4-5 |

Primary keyword density should stay natural at roughly 0.5% to 1.0%.

---

## INTERNAL LINKS TO USE

### Tour pages

- Paradise Valley: `/tours/tour-paradise-valley-agadir-new.html`
- Quad Biking: `/tours/tour-agadir-half-quad-biking-adventure.html`
- Sunset Camel Ride: `/tours/tour-agadir-sunset-camel-ride.html`
- Morning Camel Ride: `/tours/tour-morning-camel-ride-agadir.html`
- Marrakech Day Trip: `/tours/day-trip-marrakech-from-agadir-new.html`
- Essaouira Day Trip: `/tours/day-trip-essaouira-from-agadir-new.html`
- Sandboarding: `/tours/tour-sandboarding-agadir.html`
- Horse Riding: `/tours/tour-horse-riding-agadir.html`
- City Tour: `/tours/tour-agadir-guided-city-tour-cable-car.html`
- Buggy Adventure: `/tours/tour-buggy-adventure-agadir.html`
- Cooking Class: `/tours/tour-cooking-class-agadir.html`
- Hammam and Spa: `/tours/tour-moroccan-hammam-agadir.html`
- Jet Ski: `/tours/tour-jet-ski-agadir-new.html`
- Surf Lessons: `/tours/tour-surf-lessons-agadir.html`
- Boat Trip: `/tours/tour-agadir-half-day-boat-trip.html`
- Taroudant Day Trip: `/tours/day-trip-taroudant-from-agadir-new.html`

### Blog posts

- Top 10 things to do 2026: `/blog/top-10-things-to-do-agadir-2026.html`
- Quad biking guide: `/blog/quad-biking-agadir-guide.html`
- Paradise Valley guide: `/blog/paradise-valley-agadir-guide.html`
- Day trips from Agadir: `/blog/agadir-day-trips.html`
- Families guide: `/blog/things-to-do-agadir-families.html`
- Cruise excursions: `/blog/agadir-cruise-excursions.html`
- Quad biking near Paradise Valley: `/blog/quad-biking-paradise-valley.html`
- Quad biking from Taghazout: `/blog/quad-biking-taghazout.html`
- Quad biking Tamri and Banana Beach: `/blog/quad-biking-tamri-banana-beach.html`

### Key pages

- All tours: `/all-tours.html`
- Travel guide index: `/travel-guide.html`
- Contact: `/contact-us.html`
- FAQ: `/faq.html`
- WhatsApp: `https://wa.me/212700006462`

---

## BUSINESS FACTS — ALWAYS KEEP THESE ACCURATE

- Business name: Agadir Local Guide
- Phone: +212 700-006462
- WhatsApp: +212 700-006462
- Email: info@agadirlocalguide.com
- Location: Agadir, Souss-Massa, Morocco
- Rating: 4.9/5 from 877+ reviews combined
- Group size: maximum 8 travelers
- Pickup: free hotel pickup from Agadir, Taghazout, Tamraght, and Aourir
- Cancellation: free cancellation up to 24 hours before
- Languages: English, French, Arabic
- Tours are licensed and certified

### Correct tour prices

| Tour | Price | Duration |
|---|---:|---|
| Paradise Valley | €30 | 5-6 hours |
| Quad Biking | €30 | 2 hours |
| Sunset Camel Ride + BBQ | €40 | 3-4 hours |
| Morning Camel Ride | €30 | 2-3 hours |
| Marrakech Day Trip | €38 | 12 hours |
| Essaouira Day Trip | €40 | 11 hours |
| Sandboarding + BBQ | €60 | 4-5 hours |
| Horse Riding | €40 | 2 hours |
| Agadir City Tour | €25 | 3-4 hours |
| Buggy Adventure | €60 | 3 hours |
| Cooking Class | €50 | 4 hours |
| Hammam and Spa | €45 | 2 hours |
| Jet Ski | €60 | 30 min |
| Surf Lessons | €45 | 2 hours |
| Boat Trip | €48 | 4 hours |
| Taroudant Day Trip | €45 | 8 hours |

---

## QUALITY CHECKLIST

Verify all of this before outputting the final HTML file:

- Title tag is 50 to 60 characters and starts naturally with the primary keyword
- Meta description is 145 to 158 characters and includes a number plus soft CTA
- Canonical matches the final file path exactly
- BlogPosting schema uses `Yassine`
- FAQ schema matches the visible FAQ section
- H1 is different from title tag
- First paragraph includes the primary keyword within the first 100 words
- TOC links to all H2 sections
- At least 4 internal links are present
- At least one CTA block links to the target tour
- Related posts section has 3 real links
- Author is Yassine everywhere
- No banned phrases are used
- All prices match the approved pricing table above
- Word count matches the target for the post type
- The file uses the same existing site template structure, header, sidebar, footer, stylesheet, and script pattern as the current blog pages

---

## EXAMPLE VARIABLE SET

```text
POST_TITLE="Agadir or Marrakech: which should you visit first?"
PRIMARY_KEYWORD="agadir vs marrakech"
SECONDARY_KEYWORDS="marrakech day trip from agadir, agadir marrakech comparison, best morocco cities to visit"
SEARCH_INTENT="Decision / pre-trip planning"
POST_TYPE="comparison"
TARGET_TOUR_NAME="Marrakech Day Trip from Agadir"
TARGET_TOUR_URL="/tours/day-trip-marrakech-from-agadir-new.html"
WORD_COUNT_TARGET="2500"
PUBLISH_MONTH="April 2026"
```

---

## FINAL INSTRUCTION TO THE AGENT

Before writing the article, inspect at least one existing blog page from the local codebase and mirror its structural shell exactly.

Then generate one complete HTML file for `/blog/[slug].html`, fully indented, ready to publish, with no markdown in the HTML output.
