#!/usr/bin/env python3
"""
Script to check all related tour links in tour pages and identify broken links.
"""

import os
import re
from pathlib import Path
from collections import defaultdict

# Get the tours directory
tours_dir = Path(__file__).parent.parent / "tours"

# Get all existing tour HTML files
existing_tours = set()
for file in tours_dir.glob("*.html"):
    if file.name != "TOUR_PAGE_TEMPLATE.html":  # Skip template
        existing_tours.add(file.name)
        # Also add without extension for matching
        existing_tours.add(file.stem)

print(f"Found {len(existing_tours)} tour files\n")

# Pattern to find related tour links in the "You Might Also Like" section
related_section_pattern = r'<section[^>]*id="related"[^>]*>.*?</section>'
tour_link_pattern = r'href=["\']([^"\']*tour[^"\']*\.html)["\']'

broken_links = []
all_links = defaultdict(list)  # file -> list of (link, line_number)

# Scan all tour files
for tour_file in tours_dir.glob("*.html"):
    if tour_file.name == "TOUR_PAGE_TEMPLATE.html":
        continue
    
    with open(tour_file, 'r', encoding='utf-8') as f:
        content = f.read()
        lines = content.split('\n')
    
    # Find the related section
    related_match = re.search(related_section_pattern, content, re.DOTALL)
    if not related_match:
        continue
    
    related_section = related_match.group(0)
    
    # Find all tour links in the related section
    for match in re.finditer(tour_link_pattern, related_section, re.IGNORECASE):
        link = match.group(1)
        
        # Normalize the link
        # Remove ../tours/ or ./tours/ prefix
        normalized_link = link.replace('../tours/', '').replace('./tours/', '').replace('tours/', '')
        # Remove leading ./
        normalized_link = normalized_link.lstrip('./')
        
        # Get just the filename
        link_filename = os.path.basename(normalized_link)
        
        # Check if file exists
        link_path = tours_dir / link_filename
        if not link_path.exists():
            # Get base name without extension
            base_name = link_filename.replace('-new.html', '.html').replace('.html', '')
            
            # Build list of possible matches
            possible_names = [
                f"{base_name}-new.html",
                f"{base_name}.html",
            ]
            
            # Try to find similar filenames by matching key words
            # Extract key words from the base name (remove common prefixes)
            base_words = set(base_name.split('-'))
            
            # Check all existing tour files for similar names
            for existing_file in tours_dir.glob("*.html"):
                if existing_file.name == "TOUR_PAGE_TEMPLATE.html":
                    continue
                existing_stem = existing_file.stem.replace('-new', '')
                existing_words = set(existing_stem.split('-'))
                
                # If most words match, it's likely the same tour
                # Check if at least 3 words match (excluding common words like 'tour', 'agadir', 'from', 'day', 'trip')
                common_words = {'tour', 'agadir', 'from', 'day', 'trip', 'the', 'a', 'an'}
                base_meaningful = base_words - common_words
                existing_meaningful = existing_words - common_words
                
                if len(base_meaningful) > 0 and len(existing_meaningful) > 0:
                    # If most meaningful words match
                    matching_words = base_meaningful & existing_meaningful
                    if len(matching_words) >= min(2, len(base_meaningful), len(existing_meaningful)):
                        possible_names.append(existing_file.name)
            
            found_alternative = None
            for possible_name in possible_names:
                if (tours_dir / possible_name).exists():
                    found_alternative = possible_name
                    break
            
            broken_links.append({
                'source_file': tour_file.name,
                'broken_link': link,
                'normalized': link_filename,
                'alternative': found_alternative,
                'line': content[:match.start()].count('\n') + 1,
                'issue_type': 'missing'
            })
        else:
            # File exists, but check if there's a newer version
            base_name = link_filename.replace('-new.html', '.html').replace('.html', '')
            if '-new' not in link_filename:
                # Check if -new version exists
                new_version = f"{base_name}-new.html"
                if (tours_dir / new_version).exists():
                    broken_links.append({
                        'source_file': tour_file.name,
                        'broken_link': link,
                        'normalized': link_filename,
                        'alternative': new_version,
                        'line': content[:match.start()].count('\n') + 1,
                        'issue_type': 'old_version'
                    })
        
        all_links[tour_file.name].append((link, link_filename))

# Print results
print("=" * 80)
print("BROKEN LINKS FOUND:")
print("=" * 80)

if not broken_links:
    print("✓ No broken links found!")
else:
    for issue in broken_links:
        issue_type = issue.get('issue_type', 'missing')
        if issue_type == 'old_version':
            print(f"\n⚠️  {issue['source_file']} (links to old version)")
        else:
            print(f"\n❌ {issue['source_file']} (broken link)")
        print(f"   Current link: {issue['broken_link']}")
        print(f"   Normalized: {issue['normalized']}")
        if issue['alternative']:
            print(f"   ✓ Suggested fix: {issue['alternative']}")
        else:
            print(f"   ✗ No alternative found - file doesn't exist")
        print(f"   Line: {issue['line']}")

print("\n" + "=" * 80)
print("SUMMARY:")
print("=" * 80)
print(f"Total tour files scanned: {len(all_links)}")
print(f"Total related tour links found: {sum(len(links) for links in all_links.values())}")
print(f"Broken links: {len(broken_links)}")

if broken_links:
    print("\n" + "=" * 80)
    print("FIXES NEEDED:")
    print("=" * 80)
    for issue in broken_links:
        if issue['alternative']:
            print(f"\n{issue['source_file']}:")
            print(f"  Replace: {issue['broken_link']}")
            print(f"  With:    {issue['alternative']}")
