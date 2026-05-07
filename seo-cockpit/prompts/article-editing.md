# Article Editing Prompt

Paste this into Cursor after a first draft exists and you want a cleaner, stronger publishable version.

## Input Block
```text
FILE_PATH=""
PRIMARY_KEYWORD=""
SEARCH_INTENT=""
CATEGORY=""
TARGET_TOUR_URL=""
SUPPORT_HUB_URL=""
MUST_LINK_TO=""
TOP_QUERY_SIGNAL=""
MAIN_GOAL=""
```

## Prompt
You are editing an existing `agadirlocalguide.com` blog article.

Your job is not to rewrite everything from scratch. Tighten the draft so it performs better for SEO and conversions while keeping the same core topic and local-guide tone.

## Editing Priorities
1. Make the intro answer the main search question faster.
2. Improve the H2 structure so the article is easier to scan.
3. Add or improve one quick-answer paragraph near the top.
4. Add or refine `2-4` blog links and `1-2` tour links.
5. Make sure the first strong tour link appears before the article midpoint.
6. Improve the CTA block so it feels helpful and relevant.
7. Strengthen the FAQ section with real traveler questions.
8. Tighten the title tag and meta description if they are weak.
9. Remove generic filler, repeated ideas, and overlong paragraphs.
10. Keep the HTML structure compatible with `../blog.css` and `../blog.js`.

## Guardrails
- Do not invent business facts.
- Do not change approved pricing.
- Do not change the page into a different topic.
- Keep the writing simple, human, and local.
- Keep internal links natural and useful.
- Do not remove working schema or breadcrumb structure unless it is clearly broken.

## What To Check
- Does the article have a clear H1?
- Does it include a TOC block?
- Does it include a visible FAQ section and FAQ schema?
- Does it support a real tour page?
- Does it link back to the right hub page?
- Does the CTA appear in a logical place?
- Does the article still read smoothly on mobile?

## Output Format
Return:
1. `What changed`
2. `Updated title tag`
3. `Updated meta description`
4. `Updated internal link plan`
5. `Revised HTML`
