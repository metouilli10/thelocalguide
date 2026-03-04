#!/usr/bin/env python3
"""
Script to check that prices in related tour cards match the actual tour page prices.
"""

import os
import re
from pathlib import Path
from collections import defaultdict

# Get the tours directory
tours_dir = Path(__file__).parent.parent / "tours"

# Pattern to find related tour links in the "You Might Also Like" section
related_section_pattern = r'<section[^>]*id="related"[^>]*>.*?</section>'
tour_card_pattern = r'<a[^>]*class="tour-card"[^>]*href="([^"]+)"[^>]*>.*?<div class="tour-card-price">([^<]+)</div>.*?</a>'
price_amount_pattern = r'<span class="price-amount">([^<]+)</span>'

price_mismatches = []
tour_prices = {}  # Store actual tour prices

# First pass: Extract actual prices from all tour pages
print("Extracting actual tour prices from tour pages...\n")
for tour_file in tours_dir.glob("*.html"):
    if tour_file.name == "TOUR_PAGE_TEMPLATE.html":
        continue
    
    with open(tour_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the booking price
    price_match = re.search(price_amount_pattern, content)
    if price_match:
        price_text = price_match.group(1).strip()
        # Extract just the number
        price_num = re.search(r'€?\s*(\d+)', price_text)
        if price_num:
            tour_prices[tour_file.name] = int(price_num.group(1))
            # Also store without extension for matching
            tour_prices[tour_file.stem] = int(price_num.group(1))

print(f"Found prices for {len(tour_prices)} tours\n")

# Second pass: Check related tour prices
print("Checking related tour prices...\n")
for tour_file in tours_dir.glob("*.html"):
    if tour_file.name == "TOUR_PAGE_TEMPLATE.html":
        continue
    
    with open(tour_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the related section
    related_match = re.search(related_section_pattern, content, re.DOTALL)
    if not related_match:
        continue
    
    related_section = related_match.group(0)
    
    # Find all tour cards in the related section
    for card_match in re.finditer(tour_card_pattern, related_section, re.DOTALL):
        link = card_match.group(1)
        card_price_text = card_match.group(2).strip()
        
        # Normalize the link to get the filename
        normalized_link = link.replace('../tours/', '').replace('./tours/', '').replace('tours/', '')
        normalized_link = normalized_link.lstrip('./')
        link_filename = os.path.basename(normalized_link)
        
        # Extract price from card
        card_price_match = re.search(r'€?\s*(\d+)', card_price_text)
        if not card_price_match:
            continue
        
        card_price = int(card_price_match.group(1))
        
        # Get actual price from tour page
        actual_price = None
        if link_filename in tour_prices:
            actual_price = tour_prices[link_filename]
        elif link_filename.replace('-new.html', '.html') in tour_prices:
            actual_price = tour_prices[link_filename.replace('-new.html', '.html')]
        elif link_filename.replace('.html', '-new.html') in tour_prices:
            actual_price = tour_prices[link_filename.replace('.html', '-new.html')]
        
        if actual_price and card_price != actual_price:
            price_mismatches.append({
                'source_file': tour_file.name,
                'related_tour': link_filename,
                'related_link': link,
                'card_price': card_price,
                'actual_price': actual_price,
                'card_price_text': card_price_text
            })

# Print results
print("=" * 80)
print("PRICE MISMATCHES FOUND:")
print("=" * 80)

if not price_mismatches:
    print("✓ All related tour prices match the actual tour prices!")
else:
    for mismatch in price_mismatches:
        print(f"\n❌ {mismatch['source_file']}")
        print(f"   Related tour: {mismatch['related_tour']}")
        print(f"   Link: {mismatch['related_link']}")
        print(f"   Card shows: €{mismatch['card_price']} ({mismatch['card_price_text']})")
        print(f"   Actual price: €{mismatch['actual_price']}")
        print(f"   → Should be: €{mismatch['actual_price']}")

print("\n" + "=" * 80)
print("SUMMARY:")
print("=" * 80)
print(f"Total price mismatches: {len(price_mismatches)}")

if price_mismatches:
    print("\n" + "=" * 80)
    print("FIXES NEEDED:")
    print("=" * 80)
    for mismatch in price_mismatches:
        print(f"\n{mismatch['source_file']}:")
        print(f"  Find: <div class=\"tour-card-price\">{mismatch['card_price_text']}</div>")
        print(f"  Replace with: <div class=\"tour-card-price\">€{mismatch['actual_price']}</div>")
        print(f"  (in the related tour card linking to {mismatch['related_tour']})")
