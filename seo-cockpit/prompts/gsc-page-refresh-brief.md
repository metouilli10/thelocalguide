## GSC Page Refresh Brief

Use this prompt when you want an agent to convert Search Console signals into a focused page-refresh brief for an existing tour or blog page.

### Best For
- tour pages ranking mid-page one or page two
- blog pages with strong impressions but weak CTR
- pages with query drift that need intent tightening

### Inputs To Fill
```text
TARGET_PAGE="[example: /blog/paradise-valley-agadir-guide.html]"
PAGE_TYPE="[blog | tour | hub]"
TOP_QUERIES="[top 5-10 queries with clicks, impressions, CTR, position]"
CURRENT_TITLE="[paste current title]"
CURRENT_META_DESCRIPTION="[paste current meta description]"
PAGE_GOAL="[example: move from informational support into stronger commercial assist]"
RELATED_COMMERCIAL_PAGE="[optional supporting money page URL]"
```

### Prompt
```text
You are building a refresh brief for an existing Agadir Local Guide page using Search Console data.

Target page:
[TARGET_PAGE]

Page type:
[PAGE_TYPE]

Current title:
[CURRENT_TITLE]

Current meta description:
[CURRENT_META_DESCRIPTION]

Top queries:
[TOP_QUERIES]

Page goal:
[PAGE_GOAL]

Related commercial page:
[RELATED_COMMERCIAL_PAGE]

Analyze the query set and produce a practical refresh brief.

Focus on:
1. Dominant search intent
2. Whether the current title and meta match the strongest queries
3. Which query clusters deserve dedicated headings or FAQ entries
4. Whether the intro needs a stronger promise or clearer scope
5. Internal-link opportunities to commercial pages
6. CTR improvement opportunities
7. Whether the page should stay informational, become mixed-intent, or support a different page more clearly

Return:
- page purpose in one sentence
- primary query cluster
- secondary query clusters
- recommended new title tag
- recommended new meta description
- recommended H2 additions or rewrites
- FAQ additions
- internal-link recommendations
- CTA recommendation
- priority score: high, medium, or low

Constraints:
- Base recommendations on the query set
- Do not suggest a full rewrite unless the query mismatch is severe
- Keep recommendations concrete enough that an editor can implement them directly
```
