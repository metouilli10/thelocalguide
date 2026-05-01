# Audits

This folder stores structured audit outputs that agents can reuse without redoing the same research every time.

## Purpose
Audit files should capture observed facts first, then recommendations.

They are meant to support:
- competitor page comparisons
- traveler review mining
- query and intent analysis
- future browser-assisted workflows

## Rules
- keep one audit file per topic or target page
- prefer JSON when the output needs to be machine-readable
- prefer markdown only for summary layers built from JSON audits
- do not mix raw observations and strategy notes without labeling them clearly

## Starter Templates
- `competitor-tour-pages.template.json`
- `traveler-review-themes.template.json`
- `query-intent-opportunities.template.json`
