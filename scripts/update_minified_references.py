#!/usr/bin/env python3
"""
Update HTML files to use minified CSS/JS files
Replaces .css with .min.css and .js with .min.js
"""

import re
from pathlib import Path

# Files to update
CSS_FILES = ['styles.css', 'pages.css', 'tour-page.css', 'updated-styles.css']
JS_FILES = ['main.js']

def update_minified_references(file_path):
    """Update CSS/JS references to use minified versions"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        changes = []
        
        # Update CSS references
        for css_file in CSS_FILES:
            # Pattern: href="css/styles.css" or href="./css/styles.css" etc.
            pattern = rf'(href=["\']([^"\']*/)?{re.escape(css_file)}["\'])'
            replacement = rf'href="\2{css_file.replace(".css", ".min.css")}"'
            
            if re.search(pattern, content):
                content = re.sub(pattern, replacement, content)
                changes.append(f"{css_file} → {css_file.replace('.css', '.min.css')}")
        
        # Update JS references
        for js_file in JS_FILES:
            # Pattern: src="js/main.js" or src="./js/main.js" etc.
            pattern = rf'(src=["\']([^"\']*/)?{re.escape(js_file)}["\'])'
            replacement = rf'src="\2{js_file.replace(".js", ".min.js")}"'
            
            if re.search(pattern, content):
                content = re.sub(pattern, replacement, content)
                changes.append(f"{js_file} → {js_file.replace('.js', '.min.js')}")
        
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True, changes
        
        return False, []
    
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False, []

def main():
    script_dir = Path(__file__).parent
    root_dir = script_dir.parent
    
    # Skip patterns
    skip_patterns = ['node_modules', '.git', 'backups', '.backup', 'PAGE_SPEED', 'INTERNAL_LINK']
    
    # Find all HTML files
    html_files = [f for f in root_dir.rglob('*.html') 
                  if not any(pattern in str(f) for pattern in skip_patterns)]
    
    print("Updating HTML files to use minified CSS/JS...\n")
    print("Changes:")
    print("  - *.css → *.min.css")
    print("  - *.js → *.min.js\n")
    
    updated_files = []
    total_changes = 0
    
    for html_file in html_files:
        updated, changes = update_minified_references(html_file)
        if updated:
            rel_path = html_file.relative_to(root_dir)
            updated_files.append((rel_path, changes))
            total_changes += len(changes)
            print(f"✅ {rel_path}")
            for change in changes:
                print(f"   - {change}")
    
    print(f"\n{'='*60}")
    print(f"Summary:")
    print(f"  Files updated: {len(updated_files)}")
    print(f"  Total changes: {total_changes}")
    
    return 0

if __name__ == '__main__':
    exit(main())

