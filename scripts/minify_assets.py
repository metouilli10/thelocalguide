#!/usr/bin/env python3
"""
Minify CSS and JavaScript Files
Creates .min.css and .min.js versions of all CSS/JS files
"""

import re
from pathlib import Path

def minify_css(css_content):
    """Minify CSS by removing comments, whitespace, etc."""
    # Remove comments
    css_content = re.sub(r'/\*.*?\*/', '', css_content, flags=re.DOTALL)
    
    # Remove extra whitespace
    css_content = re.sub(r'\s+', ' ', css_content)
    
    # Remove whitespace around certain characters
    css_content = re.sub(r'\s*([{}:;,])\s*', r'\1', css_content)
    
    # Remove whitespace at start/end of lines
    css_content = re.sub(r'^\s+|\s+$', '', css_content, flags=re.MULTILINE)
    
    # Remove last semicolon before closing brace
    css_content = re.sub(r';\s*}', '}', css_content)
    
    return css_content.strip()

def minify_js(js_content):
    """Minify JavaScript by removing comments and unnecessary whitespace"""
    # Remove single-line comments (but not URLs with //)
    js_content = re.sub(r'(?<!:)\/\/.*', '', js_content)
    
    # Remove multi-line comments
    js_content = re.sub(r'/\*.*?\*/', '', js_content, flags=re.DOTALL)
    
    # Remove extra whitespace
    js_content = re.sub(r'\s+', ' ', js_content)
    
    # Remove whitespace around operators (but be careful with strings)
    # This is a simple version - for production, use a proper JS minifier
    js_content = re.sub(r'\s*([=+\-*/%<>!&|,;{}()\[\]])\s*', r'\1', js_content)
    
    # Remove whitespace at start/end
    js_content = js_content.strip()
    
    return js_content

def minify_file(input_path, output_path=None):
    """Minify a single file"""
    input_path = Path(input_path)
    
    if not input_path.exists():
        print(f"File not found: {input_path}")
        return None
    
    try:
        with open(input_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Determine if CSS or JS
        if input_path.suffix == '.css':
            minified = minify_css(content)
            if output_path is None:
                output_path = input_path.with_suffix('.min.css')
        elif input_path.suffix == '.js':
            minified = minify_js(content)
            if output_path is None:
                output_path = input_path.with_suffix('.min.js')
        else:
            print(f"Unsupported file type: {input_path.suffix}")
            return None
        
        # Write minified version
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(minified)
        
        # Calculate savings
        original_size = len(content)
        minified_size = len(minified)
        savings = ((original_size - minified_size) / original_size) * 100
        
        return {
            'original_size': original_size,
            'minified_size': minified_size,
            'savings_percent': savings,
            'output_path': output_path
        }
    
    except Exception as e:
        print(f"Error minifying {input_path}: {e}")
        return None

def main():
    script_dir = Path(__file__).parent
    root_dir = script_dir.parent
    
    css_dir = root_dir / 'css'
    js_dir = root_dir / 'js'
    
    print("=" * 60)
    print("CSS & JavaScript Minification")
    print("=" * 60)
    
    results = []
    
    # Minify CSS files
    print("\n📄 Minifying CSS files...\n")
    css_files = list(css_dir.glob('*.css'))
    css_files = [f for f in css_files if not f.name.endswith('.min.css')]
    
    for css_file in css_files:
        result = minify_file(css_file)
        if result:
            rel_path = css_file.relative_to(root_dir)
            print(f"✅ {rel_path}")
            print(f"   Original: {result['original_size']:,} bytes")
            print(f"   Minified: {result['minified_size']:,} bytes")
            print(f"   Savings: {result['savings_percent']:.1f}%")
            print(f"   Created: {result['output_path'].name}\n")
            results.append(('css', css_file, result))
    
    # Minify JS files
    print("\n📄 Minifying JavaScript files...\n")
    js_files = list(js_dir.glob('*.js'))
    js_files = [f for f in js_files if not f.name.endswith('.min.js')]
    
    for js_file in js_files:
        result = minify_file(js_file)
        if result:
            rel_path = js_file.relative_to(root_dir)
            print(f"✅ {rel_path}")
            print(f"   Original: {result['original_size']:,} bytes")
            print(f"   Minified: {result['minified_size']:,} bytes")
            print(f"   Savings: {result['savings_percent']:.1f}%")
            print(f"   Created: {result['output_path'].name}\n")
            results.append(('js', js_file, result))
    
    # Summary
    print("=" * 60)
    print("Summary")
    print("=" * 60)
    print(f"Files minified: {len(results)}")
    
    if results:
        total_original = sum(r[2]['original_size'] for r in results)
        total_minified = sum(r[2]['minified_size'] for r in results)
        total_savings = ((total_original - total_minified) / total_original) * 100
        
        print(f"Total original size: {total_original:,} bytes ({total_original/1024:.1f} KB)")
        print(f"Total minified size: {total_minified:,} bytes ({total_minified/1024:.1f} KB)")
        print(f"Total savings: {total_savings:.1f}% ({total_original - total_minified:,} bytes)")
        print(f"\n📝 Next step: Update HTML files to use .min.css and .min.js versions")
    
    return 0

if __name__ == '__main__':
    exit(main())

