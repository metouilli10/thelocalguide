#!/usr/bin/env python3
"""
Fix blog.html References Script
Updates all blog.html references to travel-guide.html since travel-guide.html is the main blog page.
"""

import re
from pathlib import Path

# Link replacements
REPLACEMENTS = [
    # blog.html → travel-guide.html
    (r'href=["\']blog\.html', 'href="travel-guide.html'),
    (r'href=["\']\.\./blog\.html', 'href="../travel-guide.html'),
    (r'href=["\']\./blog\.html', 'href="./travel-guide.html'),
    (r'href=["\']/blog\.html', 'href="/travel-guide.html'),
    (r'href=["\']/blog["\']', 'href="/travel-guide.html'),
]

# Files to skip
SKIP_PATTERNS = [
    'node_modules',
    '.git',
    'backups',
    '.backup',
    'INTERNAL_LINK_AUDIT',
    'TOUR_PAGE_TEMPLATE.html',
    'blog-post.html',
    'scripts/',
]

def should_skip_file(file_path):
    """Check if file should be skipped"""
    path_str = str(file_path)
    return any(pattern in path_str for pattern in SKIP_PATTERNS)

def fix_blog_links_in_file(file_path):
    """Fix blog.html references in a single file"""
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
    
    print(f"Fixing blog.html references to travel-guide.html in: {root_dir}\n")
    
    # Find all HTML files
    html_files = list(root_dir.rglob('*.html'))
    html_files = [f for f in html_files if not should_skip_file(f)]
    
    print(f"Found {len(html_files)} HTML files to process\n")
    
    files_modified = 0
    total_changes = 0
    errors = []
    
    for html_file in html_files:
        modified, changes = fix_blog_links_in_file(html_file)
        
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
    
    print(f"\n✅ Blog link fixing complete!")
    print(f"\nNote: travel-guide.html is the main blog listing page.")
    
    return 0 if not errors else 1

if __name__ == '__main__':
    exit(main())

