#!/usr/bin/env python3
"""Merge DataForSEO Labs JSON responses (items arrays) into deduped keyword rows."""
import json
import re
import sys
from pathlib import Path


def load_items(path: Path):
    data = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(data, dict) and "items" in data:
        return data["items"]
    return []


def main():
    tool_dir = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(
        "/Users/yassine/.cursor/projects/Users-yassine-Documents-projects-thelocalguide/agent-tools"
    )
    out_dir = Path(__file__).resolve().parent / "data"
    out_dir.mkdir(parents=True, exist_ok=True)

    by_key = {}
    for p in sorted(tool_dir.glob("*.txt")):
        try:
            items = load_items(p)
        except (json.JSONDecodeError, OSError):
            continue
        for it in items:
            nested = it.get("keyword_data") or {}
            kw = (it.get("keyword") or nested.get("keyword") or "").strip().lower()
            lang = it.get("language_code") or nested.get("language_code") or "unknown"
            key = (kw, lang)
            ki = it.get("keyword_info") or nested.get("keyword_info") or {}
            vol = ki.get("search_volume")
            si = it.get("search_intent_info") or nested.get("search_intent_info") or {}
            intent = si.get("main_intent")
            kp = it.get("keyword_properties") or nested.get("keyword_properties") or {}
            kd = kp.get("keyword_difficulty")
            row = {
                "keyword": kw,
                "language": lang,
                "search_volume": vol,
                "cpc": ki.get("cpc"),
                "competition_level": ki.get("competition_level"),
                "main_intent_hint": intent,
                "keyword_difficulty_hint": kd,
                "source_file": p.name,
            }
            prev = by_key.get(key)
            if prev is None or (vol or 0) > (prev.get("search_volume") or 0):
                by_key[key] = row

    rows = sorted(by_key.values(), key=lambda r: (r["language"], -(r["search_volume"] or 0)))
    (out_dir / "merged_keywords.json").write_text(
        json.dumps(rows, indent=2, ensure_ascii=False), encoding="utf-8"
    )

    local = re.compile(
        r"agadir|taghazout|paradise\s+valley|immouzer|vall(é|e)e\s+du\s+paradis|"
        r"ouarzazate.*agadir|agadir.*ouarzazate",
        re.I,
    )
    from_agadir = re.compile(
        r"from\s+agadir|to\s+agadir|agadir\s+to|day\s+trips?\s+from\s+agadir|tours?\s+from\s+agadir|"
        r"depuis\s+agadir|d\x27agadir|excursion[s]?\s+.*agadir|agadir\s+.*excursion",
        re.I,
    )
    nearby_hub = re.compile(
        r"taroudant|tiznit|essaouira|marrakech|sahara|desert|d\x27?ésert|quad|chameau|camel",
        re.I,
    )

    def agadir_fit(kw: str, _lang: str) -> str:
        k = kw.lower()
        if local.search(k) or from_agadir.search(k):
            return "core"
        if nearby_hub.search(k) and "agadir" in k:
            return "core"
        if any(x in k for x in ("morocco", "maroc")) and (
            "agadir" in k or "taghazout" in k or "paradise" in k
        ):
            return "core"
        if "agadir" not in k and any(
            x in k for x in ("holiday", "holidays", "vacation", "things to do in morocco", "visiter le maroc")
        ):
            return "peripheral"
        return "off_topic"

    for r in rows:
        r["business_fit"] = agadir_fit(r["keyword"], r["language"])

    (out_dir / "merged_with_fit.json").write_text(
        json.dumps(rows, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    print(f"Merged {len(rows)} unique (keyword, lang) rows -> {out_dir / 'merged_with_fit.json'}")


if __name__ == "__main__":
    main()
