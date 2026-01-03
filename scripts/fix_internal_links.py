#!/usr/bin/env python3
"""
Fix Internal Links Script
Bulk fixes common broken internal links in HTML files.
"""

import os
import re
from pathlib import Path
from collections import defaultdict

# Link replacements to make
REPLACEMENTS = [
    # agadir-tours.html → all-tours.html
    (r'agadir-tours\.html', 'all-tours.html'),
    
    # tour-camel-ride-agadir.html → tour-agadir-sunset-camel-ride.html
    (r'tours/tour-camel-ride-agadir\.html', 'tours/tour-agadir-sunset-camel-ride.html'),
    (r'\.\./tours/tour-camel-ride-agadir\.html', '../tours/tour-agadir-sunset-camel-ride.html'),
    (r'tour-camel-ride-agadir\.html', 'tours/tour-agadir-sunset-camel-ride.html'),
    
    # Day trip links to use -new.html versions
    (r'tours/day-trip-marrakech-from-agadir\.html(?!-new)', 'tours/day-trip-marrakech-from-agadir-new.html'),
    (r'\.\./tours/day-trip-marrakech-from-agadir\.html(?!-new)', '../tours/day-trip-marrakech-from-agadir-new.html'),
    (r'tours/day-trip-taroudant-from-agadir\.html(?!-new)', 'tours/day-trip-taroudant-from-agadir-new.html'),
    (r'\.\./tours/day-trip-taroudant-from-agadir\.html(?!-new)', '../tours/day-trip-taroudant-from-agadir-new.html'),
    
    # day-trips-from-agadir.html → all-tours.html (doesn't exist)
    (r'day-trips-from-agadir\.html', 'all-tours.html'),
    (r'\.\./day-trips-from-agadir\.html', '../all-tours.html'),
    
    # Remove crocoparc link (doesn't exist)
    (r'<li><a href="blog/crocoparc-agadir-tour\.html"[^>]*>Croco Parc</a></li>\s*\n', ''),
]

# Files to skip
SKIP_PATTERNS = [
    'node_modules',
    '.git',
    'backups',
    '.backup',
    'INTERNAL_LINK_AUDIT_REPORT.md',
    'TOUR_PAGE_TEMPLATE.html',  # Template file - needs manual review
    'blog-post.html',  # Template file
]

def should_skip_file(file_path):
    """Check if file should be skipped"""
    path_str = str(file_path)
    return any(pattern in path_str for pattern in SKIP_PATTERNS)

def fix_links_in_file(file_path):
    """Fix links in a single file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        changes_made = []
        
        # Apply all replacements
        for pattern, replacement in REPLACEMENTS:
            if re.search(pattern, content):
                new_content = re.sub(pattern, replacement, content)
                if new_content != content:
                    changes_made.append(f"  - {pattern} → {replacement}")
                    content = new_content
        
        # Write back if changes were made
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True, changes_made
        
        return False, []
    
    except Exception as e:
        return None, [f"Error: {e}"]

def main():
    script_dir = Path(__file__).parent
    root_dir = script_dir.parent
    
    print(f"Fixing internal links in: {root_dir}\n")
    
    # Find all HTML files
    html_files = list(root_dir.rglob('*.html'))
    html_files = [f for f in html_files if not should_skip_file(f)]
    
    print(f"Found {len(html_files)} HTML files to process\n")
    
    files_modified = 0
    total_changes = 0
    errors = []
    
    for html_file in html_files:
        modified, changes = fix_links_in_file(html_file)
        
        if modified is None:
            errors.append((html_file, changes))
        elif modified:
            files_modified += 1
            total_changes += len(changes)
            rel_path = html_file.relative_to(root_dir)
            print(f"✅ Fixed {rel_path}")
            for change in changes:
                print(change)
    
    print(f"\n{'='*60}")
    print(f"Summary:")
    print(f"  Files processed: {len(html_files)}")
    print(f"  Files modified: {files_modified}")
    print(f"  Total changes: {total_changes}")
    
    if errors:
        print(f"\n⚠️  Errors ({len(errors)} files):")
        for file_path, error_msgs in errors:
            print(f"  {file_path.relative_to(root_dir)}")
            for msg in error_msgs:
                print(f"    {msg}")
    
    print(f"\n✅ Link fixing complete!")
    
    return 0 if not errors else 1

if __name__ == '__main__':
    exit(main())

