#!/usr/bin/env python3
"""Merge tourism keyword rows with bulk KD overrides and write CSV + executive summary."""
import csv
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent

# DataForSEO bulk_keyword_difficulty (UK en) — only keywords that returned a numeric KD
KD_EN = {
    "agadir and taghazout things to do": 15,
    "agadir morocco things to do": 2,
    "agadir to marrakech bus": 11,
    "best things to do in agadir": 4,
    "best things to do in agadir morocco": 1,
    "morocco agadir things to do": 4,
    "paradise valley agadir map": 42,
    "things to do agadir": 2,
    "things to do agadir morocco": 4,
    "things to do in agadir": 2,
    "things to do in agadir and taghazout morocco": 15,
    "things to do in agadir in morocco": 4,
    "things to do in agadir morocco": 4,
    "things to do near agadir": 2,
    "top things to do in agadir morocco": 4,
    "tourist attractions things to do in agadir": 2,
}

KD_FR = {
    "bateau pirate agadir horaire": 22,
    "desert le plus proche d'agadir": 8,
    "désert de massa agadir": 11,
    "excursion agadir essaouira": 16,
    "excursion depuis agadir": 5,
}


def kd_for(kw: str, lang: str) -> int | None:
    k = kw.lower().strip()
    d = KD_EN if lang == "en" else KD_FR
    return d.get(k)


def page_type(kw: str, lang: str) -> str:
    k = kw.lower()
    if any(
        x in k
        for x in (
            "excursion",
            "day trip",
            "day trips",
            "tour",
            "quad",
            "camel",
            "chameau",
            "paradise valley",
            "vallée du paradis",
            "marrakech",
            "essaouira",
            "boat",
            "bateau",
            "desert",
            "désert",
            "transfer",
            "taxi",
            "bus",
            "train",
        )
    ):
        return "tour_or_transport"
    if "things to do" in k or "what to do" in k or "attractions" in k:
        return "blog_hub_or_listicle"
    return "supporting"


def priority_tier(vol: int, intent: str | None, kw: str, kd: int | None) -> str:
    k = kw.lower()
    money_kw = any(
        x in k for x in ("excursion", "day trip", "day trips", "tour", "trips from", "boat trip")
    )
    money_intent = intent in ("commercial", "transactional")
    kd_eff = kd if kd is not None else 35
    if (money_intent or money_kw) and vol >= 70 and kd_eff <= 28:
        return "P1"
    if (money_intent or money_kw) and vol >= 40:
        return "P1" if kd_eff <= 45 else "P2"
    if intent == "informational" and vol >= 1500:
        return "P2"
    if vol >= 200:
        return "P2"
    return "P3"


def main():
    en = json.loads((ROOT / "data/tourism_en.json").read_text(encoding="utf-8"))
    fr = json.loads((ROOT / "data/tourism_fr.json").read_text(encoding="utf-8"))
    rows = []
    for r in en + fr:
        kw = r["keyword"]
        lang = r["language"]
        vol = r.get("search_volume") or 0
        intent = r.get("main_intent_hint")
        hint_kd = r.get("keyword_difficulty_hint")
        bulk_kd = kd_for(kw, lang)
        kd = bulk_kd if bulk_kd is not None else hint_kd
        tier = priority_tier(vol, intent, kw, kd)
        rows.append(
            {
                "keyword": kw,
                "language": lang,
                "search_volume": vol,
                "cpc": r.get("cpc") or "",
                "competition_level": r.get("competition_level") or "",
                "search_intent": intent or "",
                "keyword_difficulty": kd if kd is not None else "",
                "priority_tier": tier,
                "page_type": page_type(kw, lang),
            }
        )

    rows.sort(
        key=lambda x: (
            {"P1": 0, "P2": 1, "P3": 2}[x["priority_tier"]],
            -int(x["search_volume"] or 0),
        )
    )

    out_dir = ROOT / "outputs"
    out_dir.mkdir(parents=True, exist_ok=True)
    csv_path = out_dir / "keywords_master.csv"
    with csv_path.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(
            f,
            fieldnames=[
                "keyword",
                "language",
                "search_volume",
                "cpc",
                "competition_level",
                "search_intent",
                "keyword_difficulty",
                "priority_tier",
                "page_type",
            ],
        )
        w.writeheader()
        w.writerows(rows)

    long_tail = [r for r in rows if len(r["keyword"].split()) >= 5]
    lt_path = out_dir / "long_tail_5plus_words.csv"
    with lt_path.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        w.writeheader()
        w.writerows(sorted(long_tail, key=lambda x: -int(x["search_volume"] or 0)))

    def top_n(lang, n=20):
        sub = [r for r in rows if r["language"] == lang]
        return sub[:n]

    summary = {
        "methodology": {
            "en_volume_location": "United Kingdom, English (DataForSEO does not support en+Morocco for Labs)",
            "fr_volume_location": "Morocco, French",
            "serp_paa": "United Kingdom (EN) and France (FR); city-level Agadir hierarchy rejected by API — use Morocco/UK/France per DataForSEO validation",
        },
        "top_20_en": top_n("en", 20),
        "top_20_fr": top_n("fr", 20),
        "counts": {"master_rows": len(rows), "long_tail_5plus_words": len(long_tail)},
    }
    (out_dir / "executive_summary.json").write_text(
        json.dumps(summary, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    print(f"Wrote {csv_path} ({len(rows)} rows), {lt_path} ({len(long_tail)} rows)")


if __name__ == "__main__":
    main()
