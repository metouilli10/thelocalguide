#!/usr/bin/env python3
"""
Add Lazy Loading to Images
Adds loading="lazy" and decoding="async" to images that don't have them,
excluding above-the-fold images (hero, logo, first visible images)
"""

import re
from pathlib import Path
from bs4 import BeautifulSoup

def should_skip_lazy_load(img_tag, soup, file_path):
    """Determine if image should skip lazy loading"""
    # Skip if already has loading attribute
    if img_tag.get('loading'):
        return True
    
    # Check if it's a logo (usually in header)
    src = img_tag.get('src', '')
    alt = img_tag.get('alt', '')
    class_name = ' '.join(img_tag.get('class', []))
    
    # Skip logos (usually above the fold)
    if 'logo' in src.lower() or 'logo' in alt.lower() or 'logo' in class_name.lower():
        return True
    
    # Skip if it's in a hero section
    parent = img_tag.find_parent(['section', 'div', 'header'])
    if parent:
        parent_class = ' '.join(parent.get('class', []))
        parent_id = parent.get('id', '')
        if any(x in parent_class.lower() or x in parent_id.lower() 
               for x in ['hero', 'header', 'topbar', 'navigation', 'nav']):
            return True
    
    # Skip first image in body (likely above fold)
    body = soup.find('body')
    if body:
        first_img = body.find('img')
        if first_img and first_img == img_tag:
            return True
    
    return False

def add_lazy_loading(file_path):
    """Add lazy loading to images in an HTML file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        soup = BeautifulSoup(content, 'html.parser')
        images = soup.find_all('img')
        
        changes_made = 0
        skipped = 0
        
        for img in images:
            # Skip if already has loading attribute
            if img.get('loading'):
                continue
            
            # Check if should skip
            if should_skip_lazy_load(img, soup, file_path):
                skipped += 1
                continue
            
            # Add lazy loading attributes
            img['loading'] = 'lazy'
            if not img.get('decoding'):
                img['decoding'] = 'async'
            changes_made += 1
        
        if changes_made > 0:
            # Write back
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(str(soup))
        
        return changes_made, skipped
    
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return 0, 0

def main():
    script_dir = Path(__file__).parent
    root_dir = script_dir.parent
    
    # Skip patterns
    skip_patterns = ['node_modules', '.git', 'backups', '.backup', 'PAGE_SPEED', 'INTERNAL_LINK']
    
    # Find all HTML files
    html_files = [f for f in root_dir.rglob('*.html') 
                  if not any(pattern in str(f) for pattern in skip_patterns)]
    
    print("=" * 60)
    print("Adding Lazy Loading to Images")
    print("=" * 60)
    print("\nRules:")
    print("  - Adds loading='lazy' to images below the fold")
    print("  - Skips logos, hero images, and above-fold images")
    print("  - Adds decoding='async' if not present")
    print()
    
    total_changes = 0
    total_skipped = 0
    files_updated = []
    
    for html_file in html_files:
        changes, skipped = add_lazy_loading(html_file)
        if changes > 0:
            rel_path = html_file.relative_to(root_dir)
            files_updated.append((rel_path, changes, skipped))
            total_changes += changes
            total_skipped += skipped
            print(f"✅ {rel_path}")
            print(f"   Added lazy loading to {changes} image(s), skipped {skipped}")
    
    print(f"\n{'='*60}")
    print("Summary:")
    print(f"  Files processed: {len(html_files)}")
    print(f"  Files updated: {len(files_updated)}")
    print(f"  Images updated: {total_changes}")
    print(f"  Images skipped (above fold): {total_skipped}")
    print(f"\n✅ Lazy loading added successfully!")
    
    return 0

if __name__ == '__main__':
    exit(main())

