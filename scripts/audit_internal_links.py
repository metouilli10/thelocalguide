#!/usr/bin/env python3
"""
Internal Link Audit Script
Scans all HTML files for internal links and checks if they exist.
"""

import os
import re
from pathlib import Path
from html.parser import HTMLParser
from collections import defaultdict

class LinkExtractor(HTMLParser):
    def __init__(self, base_path):
        super().__init__()
        self.base_path = Path(base_path)
        self.links = []
        self.current_file = None
        
    def set_file(self, file_path):
        self.current_file = file_path
        
    def handle_starttag(self, tag, attrs):
        if tag == 'a':
            for attr_name, attr_value in attrs:
                if attr_name == 'href' and attr_value:
                    # Skip external links, mailto, tel, anchors
                    if not attr_value.startswith(('http://', 'https://', 'mailto:', 'tel:', '#', 'javascript:')):
                        self.links.append({
                            'file': self.current_file,
                            'href': attr_value,
                            'line': self.getpos()[0] if self.getpos() else None
                        })

def normalize_path(href, base_file, root_dir):
    """Convert relative href to absolute file path"""
    base_dir = Path(base_file).parent
    root_path = Path(root_dir)
    # Remove query strings and anchors
    href = href.split('?')[0].split('#')[0]
    
    # Handle relative paths
    if href.startswith('/'):
        # Root-relative path
        if href in ('/', ''):
            return root_path / 'index.html'
        return root_path / href.lstrip('/')
    else:
        # Relative path
        return (base_dir / href).resolve()

def check_file_exists(file_path, root_dir):
    """Check if file exists, handling both exact matches and common variations"""
    root_path = Path(root_dir)
    
    # Try exact path first
    if file_path.exists() and file_path.is_file():
        return True, 'exists'
    
    # Check if it's relative to root
    try:
        rel_path = file_path.relative_to(root_path)
        full_path = root_path / rel_path
        if full_path.exists() and full_path.is_file():
            return True, 'exists'
    except ValueError:
        pass
    
    # Check common variations
    file_name = file_path.name
    file_stem = file_path.stem
    file_dir = file_path.parent
    
    # Check for -new.html variant
    if not file_name.endswith('-new.html'):
        new_name = file_stem + '-new.html'
        new_path = file_dir / new_name
        if new_path.exists():
            return False, f'missing (but {new_name} exists)'
    
    # Check in root directory
    root_file = root_path / file_name
    if root_file.exists():
        return False, f'missing (but {file_name} exists in root)'
    
    # Check in tours directory if it's a tour file
    if 'tour' in file_name.lower() or 'day-trip' in file_name.lower():
        tours_file = root_path / 'tours' / file_name
        if tours_file.exists():
            return False, f'missing (but {file_name} exists in tours/)'
    
    return False, 'missing'

def audit_links(root_dir):
    """Audit all internal links in HTML files"""
    root_path = Path(root_dir)
    parser = LinkExtractor(root_dir)
    
    template_files = {'TOUR_PAGE_TEMPLATE.html', 'blog-post.html'}

    # Find all HTML files
    html_files = []
    for ext in ['*.html', '*.htm']:
        html_files.extend(root_path.rglob(ext))
    
    # Exclude node_modules, backups, and non-production templates
    html_files = [
        f for f in html_files
        if not any(x in str(f) for x in ['node_modules', '.git', 'backups', '.backup', '/templates/'])
        and f.name not in template_files
    ]
    
    print(f"Found {len(html_files)} HTML files to scan\n")
    
    all_links = []
    broken_links = []
    link_map = defaultdict(list)
    
    # Extract links from all files
    for html_file in html_files:
        try:
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            parser.set_file(html_file)
            parser.feed(content)
            parser.reset()
        except Exception as e:
            print(f"Error parsing {html_file}: {e}")
    
    all_links = parser.links
    
    # Check each link
    print(f"Checking {len(all_links)} internal links...\n")
    
    for link_info in all_links:
        href = link_info['href']
        source_file = link_info['file']
        
        # Normalize the path
        try:
            target_path = normalize_path(href, source_file, root_path)
            exists, status = check_file_exists(target_path, root_path)
            
            if not exists:
                broken_links.append({
                    'source_file': str(source_file.relative_to(root_path)),
                    'href': href,
                    'target_path': str(target_path.relative_to(root_path)) if target_path.is_relative_to(root_path) else str(target_path),
                    'status': status,
                    'line': link_info['line']
                })
            
            link_map[href].append({
                'source': str(source_file.relative_to(root_path)),
                'exists': exists
            })
        except Exception as e:
            broken_links.append({
                'source_file': str(source_file.relative_to(root_path)),
                'href': href,
                'target_path': 'ERROR',
                'status': f'error: {e}',
                'line': link_info['line']
            })
    
    return broken_links, link_map, html_files

def generate_report(root_dir, broken_links, link_map, html_files):
    """Generate a comprehensive audit report"""
    report = []
    report.append("# Internal Link Audit Report\n")
    report.append(f"**Generated:** {Path(__file__).stat().st_mtime}\n")
    report.append(f"**Files Scanned:** {len(html_files)}\n")
    report.append(f"**Total Links Found:** {sum(len(links) for links in link_map.values())}\n")
    report.append(f"**Broken Links Found:** {len(broken_links)}\n\n")
    report.append("---\n\n")
    
    if broken_links:
        report.append("## 🔴 Broken Links\n\n")
        
        # Group by source file
        by_source = defaultdict(list)
        for link in broken_links:
            by_source[link['source_file']].append(link)
        
        for source_file, links in sorted(by_source.items()):
            report.append(f"### {source_file}\n\n")
            for link in links:
                report.append(f"- **Line {link['line']}:** `{link['href']}`\n")
                report.append(f"  - Target: `{link['target_path']}`\n")
                report.append(f"  - Status: {link['status']}\n\n")
        
        report.append("---\n\n")
    else:
        report.append("## ✅ No Broken Links Found!\n\n")
        report.append("All internal links are valid.\n\n")
    
    # Summary of link patterns
    report.append("## 📊 Link Analysis Summary\n\n")
    
    # Find duplicate/alternative links (e.g., both -new.html and regular version)
    report.append("### Potential Issues:\n\n")
    
    # Check for links pointing to files that have -new.html variants
    issues_found = False
    for href, occurrences in sorted(link_map.items()):
        if 'tour' in href.lower() or 'day-trip' in href.lower():
            if not href.endswith('-new.html'):
                # Check if there's a -new.html version
                base_name = Path(href).stem
                if base_name.endswith('-new'):
                    base_name = base_name[:-4]
                new_href = str(Path(href).parent / f"{base_name}-new.html")
                
                # Check if new version exists in link_map
                if new_href in link_map or new_href.lstrip('./') in [h.lstrip('./') for h in link_map.keys()]:
                    if not issues_found:
                        report.append("**Files with -new.html variants that might need updating:**\n\n")
                        issues_found = True
                    report.append(f"- `{href}` (consider using `-new.html` version)\n")
    
    if not issues_found:
        report.append("No obvious link pattern issues detected.\n\n")
    
    report.append("\n---\n\n")
    report.append("## 📝 Recommendations\n\n")
    
    if broken_links:
        report.append("1. **Fix broken links:** Update or remove the broken links listed above\n")
        report.append("2. **Check redirects:** Some broken links might be handled by redirects in vercel.json\n")
        report.append("3. **Update templates:** If templates have broken links, fix them so all pages inherit the fix\n")
    else:
        report.append("✅ All links are valid!\n")
        report.append("Consider:\n")
        report.append("1. Running this audit regularly\n")
        report.append("2. Testing links after URL structure changes\n")
    
    return ''.join(report)

def main():
    # Get the root directory (parent of scripts/)
    script_dir = Path(__file__).parent
    root_dir = script_dir.parent
    
    print(f"Auditing internal links in: {root_dir}\n")
    
    broken_links, link_map, html_files = audit_links(root_dir)
    
    report = generate_report(root_dir, broken_links, link_map, html_files)
    
    # Save report
    report_file = root_dir / 'INTERNAL_LINK_AUDIT_REPORT.md'
    with open(report_file, 'w', encoding='utf-8') as f:
        f.write(report)
    
    print(f"\n✅ Audit complete!")
    print(f"📄 Report saved to: {report_file}")
    print(f"\nSummary:")
    print(f"  - Files scanned: {len(html_files)}")
    print(f"  - Total links: {sum(len(links) for links in link_map.values())}")
    print(f"  - Broken links: {len(broken_links)}")
    
    if broken_links:
        print(f"\n⚠️  {len(broken_links)} broken link(s) found. See report for details.")
        return 1
    else:
        print(f"\n✅ No broken links found!")
        return 0

if __name__ == '__main__':
    exit(main())
