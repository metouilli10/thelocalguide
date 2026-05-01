#!/usr/bin/env python3
"""Filter merged keywords to tourism/tour-relevant terms for scoring and API batches."""
import json
import re
from pathlib import Path

BAD = re.compile(
    r"^hotel\s|météo|meteo|emploi|prière|priere|temperature|température|"
    r"\busa\b|arizona|montana|scottsdale|john mayer|sleep token|homes for sale|"
    r"yellowstone|madeira|campground|country club|vacation rentals|"
    r"doubletree|jw marriott|mountain shadows|hermosa inn|resort paradise valley",
    re.I,
)


def paradise_ok(k: str) -> bool:
    if "paradise valley" not in k:
        return True
    return bool(
        re.search(
            r"morocco|agadir|taghazout|imouzzer|imouzer|ida ou tanane|waterfalls|photos|reviews",
            k,
            re.I,
        )
    )


def tourism_tour(kw: str, lang: str) -> bool:
    k = kw.lower()
    if BAD.search(k):
        return False
    if not paradise_ok(k):
        return False
    good_en = (
        "tour",
        "excursion",
        "day trip",
        "things to do",
        "what to do",
        "trip",
        "quad",
        "camel",
        "desert",
        "sahara",
        "marrakech",
        "essaouira",
        "paradise valley",
        "surf",
        "boat",
        "horse",
        "sandboard",
        "city tour",
        "guide",
        "activities",
        "attractions",
        "nightlife",
        "night club",
        "bars in agadir",
        "taghazout",
        "taroudant",
        "transfer",
        "taxi",
        "bus",
        "train",
        "distance",
        "holiday",
        "vacation",
    )
    good_fr = good_en + (
        "visite",
        "balade",
        "chameau",
        "désert",
        "desert",
        "bateau",
        "yacht",
        "nuit",
        "depuis agadir",
        "vallée du paradis",
        "vallee du paradis",
    )
    good = good_fr if lang == "fr" else good_en
    if any(g in k for g in good):
        return True
    if "agadir" in k and re.search(
        r"distance|to marrakech|from marrakech|train|bus|taxi|night|family|january|november|free things",
        k,
        re.I,
    ):
        return True
    return False


def main():
    root = Path(__file__).resolve().parent
    rows = json.loads((root / "data/merged_with_fit.json").read_text(encoding="utf-8"))
    filt = [r for r in rows if r["business_fit"] == "core" and tourism_tour(r["keyword"], r["language"])]
    en = [r for r in filt if r["language"] == "en"]
    fr = [r for r in filt if r["language"] == "fr"]
    en.sort(key=lambda x: -(x.get("search_volume") or 0))
    fr.sort(key=lambda x: -(x.get("search_volume") or 0))
    (root / "data/tourism_en.json").write_text(json.dumps(en, indent=2, ensure_ascii=False), encoding="utf-8")
    (root / "data/tourism_fr.json").write_text(json.dumps(fr, indent=2, ensure_ascii=False), encoding="utf-8")
    (root / "data/api_en_keywords.json").write_text(
        json.dumps([r["keyword"] for r in en[:300]], indent=2), encoding="utf-8"
    )
    (root / "data/api_fr_keywords.json").write_text(
        json.dumps([r["keyword"] for r in fr[:200]], indent=2), encoding="utf-8"
    )
    print(f"tourism EN {len(en)} FR {len(fr)} -> api batches {min(300,len(en))} + {min(200,len(fr))}")


if __name__ == "__main__":
    main()
