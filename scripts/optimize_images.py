#!/usr/bin/env python3
"""
Image Optimization Script
Optimizes images for web by:
1. Converting to WebP format
2. Compressing images
3. Creating multiple sizes for responsive images
"""

import os
import subprocess
from pathlib import Path
from PIL import Image
import sys

def check_dependencies():
    """Check if required dependencies are available"""
    try:
        from PIL import Image
        return True
    except ImportError:
        print("ERROR: Pillow (PIL) is not installed.")
        print("Install with: pip3 install Pillow")
        return False

def get_image_size_mb(image_path):
    """Get image size in MB"""
    return os.path.getsize(image_path) / (1024 * 1024)

def compress_image(input_path, output_path, quality=85, max_size_mb=0.2):
    """Compress an image using Pillow"""
    try:
        img = Image.open(input_path)
        
        # Get original format
        original_format = img.format
        
        # Convert RGBA to RGB if saving as JPEG
        if output_path.suffix.lower() in ['.jpg', '.jpeg'] and img.mode in ('RGBA', 'LA', 'P'):
            background = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'P':
                img = img.convert('RGBA')
            background.paste(img, mask=img.split()[-1] if img.mode in ('RGBA', 'LA') else None)
            img = background
        
        # Save with optimization
        save_kwargs = {
            'optimize': True,
            'quality': quality
        }
        
        if output_path.suffix.lower() == '.webp':
            img.save(str(output_path), 'WEBP', quality=quality, method=6)
        elif output_path.suffix.lower() in ['.jpg', '.jpeg']:
            img.save(str(output_path), 'JPEG', **save_kwargs)
        elif output_path.suffix.lower() == '.png':
            # PNG optimization
            img.save(str(output_path), 'PNG', optimize=True)
            # Try to further compress if still too large
            size_mb = get_image_size_mb(output_path)
            if size_mb > max_size_mb:
                # Convert to JPEG if PNG is too large and not needed
                if img.mode not in ('RGBA', 'LA', 'P') or not img.info.get('transparency'):
                    jpeg_path = output_path.with_suffix('.jpg')
                    if img.mode == 'RGBA':
                        background = Image.new('RGB', img.size, (255, 255, 255))
                        background.paste(img, mask=img.split()[-1])
                        img = background
                    img.save(str(jpeg_path), 'JPEG', quality=quality, optimize=True)
                    print(f"  → Converted large PNG to JPEG: {jpeg_path.name}")
                    return jpeg_path
        else:
            img.save(str(output_path))
        
        return output_path
    
    except Exception as e:
        print(f"  ERROR compressing {input_path}: {e}")
        return None

def create_webp_version(input_path, output_path=None, quality=85):
    """Create WebP version of an image"""
    try:
        img = Image.open(input_path)
        
        # Convert RGBA to RGB if needed
        if img.mode in ('RGBA', 'LA', 'P'):
            background = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'P':
                img = img.convert('RGBA')
            background.paste(img, mask=img.split()[-1] if img.mode in ('RGBA', 'LA') else None)
            img = background
        
        if output_path is None:
            output_path = input_path.with_suffix('.webp')
        
        img.save(str(output_path), 'WEBP', quality=quality, method=6)
        return output_path
    
    except Exception as e:
        print(f"  ERROR creating WebP: {e}")
        return None

def optimize_image(input_path, target_max_size_mb=0.2, create_webp=True):
    """Optimize a single image"""
    input_path = Path(input_path)
    
    if not input_path.exists():
        print(f"File not found: {input_path}")
        return None
    
    original_size = get_image_size_mb(input_path)
    
    print(f"\n📸 {input_path.name}")
    print(f"   Original size: {original_size:.2f} MB")
    
    # Skip if already small enough
    if original_size < target_max_size_mb and input_path.suffix.lower() == '.webp':
        print(f"   ✅ Already optimized")
        return input_path
    
    optimized_path = input_path
    
    # Compress the original format
    if original_size > target_max_size_mb:
        print(f"   Compressing...")
        compressed = compress_image(input_path, input_path, quality=85, max_size_mb=target_max_size_mb)
        if compressed:
            new_size = get_image_size_mb(compressed)
            print(f"   Compressed: {new_size:.2f} MB ({((1 - new_size/original_size) * 100):.1f}% reduction)")
            optimized_path = compressed
    
    # Create WebP version
    if create_webp:
        webp_path = input_path.with_suffix('.webp')
        if not webp_path.exists() or get_image_size_mb(webp_path) > target_max_size_mb:
            print(f"   Creating WebP version...")
            webp = create_webp_version(input_path, webp_path, quality=85)
            if webp:
                webp_size = get_image_size_mb(webp)
                print(f"   WebP created: {webp_size:.2f} MB")
    
    return optimized_path

def find_large_images(directory, min_size_mb=0.5):
    """Find images larger than specified size"""
    directory = Path(directory)
    large_images = []
    
    for ext in ['*.jpg', '*.jpeg', '*.png', '*.JPG', '*.JPEG', '*.PNG']:
        for img_path in directory.rglob(ext):
            size_mb = get_image_size_mb(img_path)
            if size_mb >= min_size_mb:
                large_images.append((img_path, size_mb))
    
    return sorted(large_images, key=lambda x: x[1], reverse=True)

def main():
    script_dir = Path(__file__).parent
    root_dir = script_dir.parent
    img_dir = root_dir / 'img'
    
    if not check_dependencies():
        sys.exit(1)
    
    print("=" * 60)
    print("Image Optimization Script")
    print("=" * 60)
    
    # Find large images
    print(f"\n🔍 Finding large images (>0.5MB) in {img_dir}...")
    large_images = find_large_images(img_dir, min_size_mb=0.5)
    
    if not large_images:
        print("✅ No large images found!")
        return 0
    
    print(f"\nFound {len(large_images)} large image(s):\n")
    for img_path, size_mb in large_images[:15]:  # Show top 15
        rel_path = img_path.relative_to(root_dir)
        print(f"  {size_mb:6.2f} MB  {rel_path}")
    
    # Ask for confirmation
    print(f"\n⚠️  This will compress and optimize {len(large_images)} image(s).")
    print("   Original files will be backed up if they don't have .webp versions.")
    
    response = input("\nContinue? (y/n): ").strip().lower()
    if response != 'y':
        print("Cancelled.")
        return 0
    
    # Optimize each image
    optimized_count = 0
    for img_path, size_mb in large_images:
        result = optimize_image(img_path, target_max_size_mb=0.2, create_webp=True)
        if result:
            optimized_count += 1
    
    print(f"\n{'=' * 60}")
    print(f"✅ Optimization complete!")
    print(f"   Optimized: {optimized_count}/{len(large_images)} images")
    print(f"\n📝 Next steps:")
    print(f"   1. Test the optimized images")
    print(f"   2. Update HTML to use .webp versions with fallbacks")
    print(f"   3. Run PageSpeed Insights to verify improvement")
    
    return 0

if __name__ == '__main__':
    sys.exit(main())

