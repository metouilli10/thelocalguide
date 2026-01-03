#!/usr/bin/env python3
"""
Update Image References to Use Optimized Formats
- essaouira 1.jpg → essaouira 1.avif (with webp fallback)
- top10.png → top10.webp
"""

import re
from pathlib import Path

def update_image_references(file_path):
    """Update image references in a single file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        changes = []
        
        # Update essaouira 1.jpg references to use AVIF
        # Pattern 1: Picture tags with source and img
        pattern1 = r'(<picture[^>]*>\s*)(<source[^>]*srcset=["\']([^"\']*essaouira 1\.)(webp|jpg|jpeg)["\']([^>]*type=["\']image/)(webp|jpeg)["\']([^>]*>)\s*)?(<img[^>]*src=["\']([^"\']*essaouira 1\.)(jpg|jpeg|webp)["\']([^>]*>))'
        def replace_essaouira(match):
            prefix = match.group(1)
            existing_source = match.group(2) or ''
            base_path = match.group(3)
            img_tag = match.group(8)
            img_src_path = match.group(9)
            img_ext = match.group(10)
            img_rest = match.group(11)
            
            # Replace img src to use webp as fallback
            new_img_tag = img_tag.replace(f'{img_src_path}{img_ext}', f'{img_src_path}webp')
            
            # Create new source tags: AVIF first, then WebP
            new_sources = f'<source srcset="{base_path}avif" type="image/avif">\n                                    <source srcset="{base_path}webp" type="image/webp">\n                                    '
            
            return f'{prefix}{new_sources}{new_img_tag}'
        
        content = re.sub(pattern1, replace_essaouira, content, flags=re.IGNORECASE | re.MULTILINE)
        
        # Pattern 2: Simple img tags without picture
        pattern2 = r'(src=["\']([^"\']*essaouira 1\.)(jpg|jpeg)["\'])'
        def replace_simple_essaouira(match):
            base = match.group(2)
            # For simple img tags, use webp as fallback (avif needs picture tag)
            return f'src="{base}webp"'
        content = re.sub(pattern2, replace_simple_essaouira, content, flags=re.IGNORECASE)
        
        # Pattern 3: Schema/OG tags - use webp (JSON doesn't support picture tags)
        pattern3 = r'(https://agadirlocalguide\.com/img/excursions/Essaouira Day Trip/essaouira 1\.)(jpg|jpeg)'
        content = re.sub(pattern3, r'\1webp', content, flags=re.IGNORECASE)
        
        # Update top10.png references to use webp
        # Pattern 4: Picture tags with top10
        pattern4 = r'(<picture[^>]*>\s*)(<source[^>]*srcset=["\']([^"\']*top10\.)(webp|png|jpg)["\']([^>]*type=["\']image/)(webp|png|jpeg)["\']([^>]*>)\s*)?(<img[^>]*src=["\']([^"\']*top10\.)(png|jpg|jpeg)["\']([^>]*>))'
        def replace_top10(match):
            prefix = match.group(1)
            img_tag = match.group(8)
            img_src_path = match.group(9)
            img_ext = match.group(10)
            img_rest = match.group(11)
            
            # Replace img src to use webp
            new_img_tag = img_tag.replace(f'{img_src_path}{img_ext}', f'{img_src_path}webp')
            
            # Create source tag for webp
            new_source = f'<source srcset="{img_src_path}webp" type="image/webp">\n                                    '
            
            return f'{prefix}{new_source}{new_img_tag}'
        
        content = re.sub(pattern4, replace_top10, content, flags=re.IGNORECASE | re.MULTILINE)
        
        # Pattern 5: Simple img tags for top10
        pattern5 = r'(src=["\']([^"\']*top10\.)(png|jpg|jpeg)["\'])'
        content = re.sub(pattern5, r'src="\2webp"', content, flags=re.IGNORECASE)
        
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
    
    # Skip patterns
    skip_patterns = ['node_modules', '.git', 'backups', '.backup', 'PAGE_SPEED']
    
    # Find all HTML files
    html_files = [f for f in root_dir.rglob('*.html') 
                  if not any(pattern in str(f) for pattern in skip_patterns)]
    
    print("Updating image references to use optimized formats...\n")
    print("Changes:")
    print("  - essaouira 1.jpg → essaouira 1.avif (with webp fallback)")
    print("  - top10.png → top10.webp\n")
    
    updated_files = []
    for html_file in html_files:
        if update_image_references(html_file):
            rel_path = html_file.relative_to(root_dir)
            updated_files.append(rel_path)
            print(f"✅ {rel_path}")
    
    print(f"\n{'='*60}")
    print(f"Summary: Updated {len(updated_files)} file(s)")
    
    return 0

if __name__ == '__main__':
    exit(main())

