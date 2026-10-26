# ALG blog post template

Use [blog-post-v2.html](blog-post-v2.html) as the starting point for a new article in `blog/`. The [Paradise Valley guide](../blog/paradise-valley-agadir-guide.html) shows the template with a full article. All existing blog posts now use the same layout.

## Publish a new article

1. Copy `templates/blog-post-v2.html` to `blog/your-article-slug.html`.
2. Replace every `{{PLACEHOLDER}}`. Search for `{{` before publishing to catch any left behind. Escape `&`, `<`, `>` and quotes in HTML attributes. For JSON-LD fields, use valid JSON string escaping.
3. Write a descriptive page title and meta description; use the final live URL in `CANONICAL_URL`, the fully qualified hero URL in `ABSOLUTE_HERO_IMAGE_URL`, and dates in ISO format. Keep the visible author and schema author consistent.
4. Use a compressed landscape hero image. Set descriptive alt text. Images and other links in a `blog/` page normally need `../` to reach the project root.
5. Keep one H1 in the hero. Add article sections inside `.post-prose` with unique `<h2 id="...">` values. The sidebar table of contents and reading progress are generated automatically.
6. Keep booking and related links relevant to the subject. Remove any optional section that does not help the reader.
7. Check desktop and mobile layouts, links, image loading, article facts, and metadata. Remove the `noindex,nofollow` meta tag when publishing the final URL. Add the article to `travel-guide.html` and the sitemap if appropriate.

## Reusable content blocks

- Lead: `<p class="lead">...</p>` immediately opens the article with the practical answer.
- Comparison: a semantic `<table>` with `<thead>` and `<tbody>`; the stylesheet allows horizontal scrolling on narrow screens.
- Local tip: `.info-callout` with `.callout-icon` and `.callout-content`.
- Photograph: `<figure><img ...><figcaption>...</figcaption></figure>`.
- FAQ: `<section class="faq-section">` containing native `<details class="faq-accordion__item">` items. Add FAQ schema only when it accurately reflects the visible questions and answers.
- Conversion: update `.post-cta` and `.post-sidecard` for the relevant tour; do not leave unrelated Paradise Valley copy in another article.

Shared presentation lives in `css/blog-post-v2.css` and interactions in `js/blog-post-v2.js`. Navigation and footer styling comes from `css/homepage-v2.css` and `js/homepage-v2.js`, consistent with the homepage and travel guide.
