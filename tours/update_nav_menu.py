#!/usr/bin/env python3
"""
Script to update navigation menus in all tour pages
Replaces old dropdown menu with simple "All Tours" link
"""
import os
import re

# Get all HTML files in current directory
files = [f for f in os.listdir('.') if f.endswith('.html') and not f.endswith('.backup')]

print(f"Found {len(files)} files to process\n")

# Pattern to match the dropdown menu structure
dropdown_pattern = r'''<li class="has-dropdown">\s*<a href="\.\./agadir-tours\.html">\s*Tours\s*<svg class="dropdown-icon"[^>]*>.*?</svg>\s*</a>\s*<ul class="dropdown-menu">.*?</ul>\s*</li>'''

replacement = '''<li><a href="../all-tours.html">All Tours</a></li>'''

for file in files:
    try:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        
        # Replace dropdown menu (multiline pattern)
        content = re.sub(dropdown_pattern, replacement, content, flags=re.DOTALL)
        
        # Replace other references
        content = content.replace('href="../agadir-tours.html"', 'href="../all-tours.html"')
        content = content.replace('href="../blog.html"', 'href="../travel-guide.html"')
        
        # Mobile menu updates
        content = re.sub(r'<a href="\.\./agadir-tours\.html">Tours & Activities</a>', 
                        '<a href="../all-tours.html">All Tours</a>', content)
        content = re.sub(r'<a href="\.\./agadir-tours\.html">Tours</a>', 
                        '<a href="../all-tours.html">All Tours</a>', content)
        content = re.sub(r'<a href="\.\./contact-us\.html">Contact Us</a>', 
                        '<a href="../contact-us.html">Contact</a>', content)
        
        if content != original:
            with open(file, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ Updated: {file}")
        else:
            print(f"⏭️  Skipped: {file} (no changes needed)")
            
    except Exception as e:
        print(f"❌ Error processing {file}: {e}")

print(f"\n✅ Done! Processed {len(files)} files")



