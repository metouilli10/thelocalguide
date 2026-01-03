#!/usr/bin/env python3
"""
Update Image References Script
Updates HTML files to use optimized image formats:
- essaouira 1.jpg → essaouira 1.avif
- top10.png → top10.webp
"""

import re
from pathlib import Path

REPLACEMENTS = [
    # essaouira 1.jpg → essaouira 1.avif
    # Update picture source tags to prioritize AVIF
    (
        r'(<source[^>]*srcset=["\']([^"\']*essaouira 1\.)(webp|jpg|jpeg)["\']([^>]*type=["\']image/)(webp|jpeg)["\']([^>]*>))',
        r'<source\4avif"\6\n                                    <source\2webp"\4webp"\6'
    ),
    # Update img src fallback
    (
        r'(src=["\']([^"\']*essaouira 1\.)(jpg|jpeg)["\'])',
        r'src="\2webp"'
    ),
    # Simpler pattern for img tags with essaouira 1.jpg
    (
        r'(img/excursions/Essaouira Day Trip/essaouira 1\.)(jpg|jpeg)',
        r'\1avif'
    ),
    (
        r'(\.\./img/excursions/Essaouira Day Trip/essaouira 1\.)(jpg|jpeg)',
        r'\1avif'
    ),
    (
        r'(\./img/excursions/Essaouira Day Trip/essaouira 1\.)(jpg|jpeg)',
        r'\1avif'
    ),
    
    # top10.png → top10.webp
    (
        r'(img/top10\.)(png|jpg|jpeg)',
        r'\1webp'
    ),
    (
        r'(\.\./img/top10\.)(png|jpg|jpeg)',
        r'\1webp'
    ),
    (
        r'(\./img/top10\.)(png|jpg|jpeg)',
        r'\1webp'
    ),
]

def update_image_references(file_path):
    """Update image references in a single file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Apply replacements
        for pattern, replacement in REPLACEMENTS:
            content = re.sub(pattern, replacement, content, flags=re.IGNORECASE)
        
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        
        return False
    
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def main():
    script_dir = Path(__file__).parent
    root_dir = script_dir.parent
    
    # Find all HTML files
    html_files = list(root_dir.rglob('*.html'))
    html_files = [f for f in html_files if not any(x in str(f) for x in ['node_modules', '.git', 'backups', '.backup'])]
    
    print(f"Updating image references in {len(html_files)} HTML files...\n")
    
    updated_files = []
    for html_file in html_files:
        if update_image_references(html_file):
            rel_path = html_file.relative_to(root_dir)
            updated_files.append(rel_path)
            print(f"✅ Updated: {rel_path}")
    
    print(f"\n{'='*60}")
    print(f"Summary: Updated {len(updated_files)} file(s)")
    
    if updated_files:
        print(f"\nFiles updated:")
        for f in updated_files:
            print(f"  - {f}")
    
    return 0

if __name__ == '__main__':
    exit(main())

