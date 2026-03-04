#!/usr/bin/env python3
"""
Batch Image Generator for Blog Posts
Generates images for all your blog topics at once
"""

import sys
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import the generator functions
sys.path.insert(0, str(Path(__file__).parent))

# Import from the main script
import importlib.util
spec = importlib.util.spec_from_file_location(
    "generate_blog_images", 
    Path(__file__).parent / "generate-blog-images.py"
)
gen_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(gen_module)

generate_blog_image = gen_module.generate_blog_image

# Blog topics mapped to filenames
BLOG_TOPICS = {
    "paradise valley": "paradise-valley-hero.jpg",
    "quad biking": "quad-biking-hero.jpg",
    "agadir day trips": "agadir-day-trips-hero.jpg",
    "cruise excursions": "cruise-excursions-hero.jpg",
    "things to do agadir families": "agadir-families-hero.jpg",
    "taghazout": "taghazout-hero.jpg",
    "camel ride": "camel-ride-hero.jpg",
    "desert safari": "desert-safari-hero.jpg",
    "berber village": "berber-village-hero.jpg",
    "argan oil": "argan-oil-hero.jpg"
}


def generate_all_images():
    """Generate images for all blog topics"""
    print("=" * 60)
    print("🎨 Batch Image Generation for Blog Posts")
    print("=" * 60)
    print(f"\n📝 Generating {len(BLOG_TOPICS)} images...\n")
    
    results = {}
    
    for topic, filename in BLOG_TOPICS.items():
        print(f"\n{'=' * 60}")
        print(f"📸 Processing: {topic}")
        print(f"{'=' * 60}")
        
        result = generate_blog_image(topic, filename)
        results[topic] = result
        
        if result:
            print(f"✅ Success: {result.name}")
        else:
            print(f"❌ Failed: {topic}")
        
        # Small delay to avoid rate limiting
        import time
        time.sleep(2)
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 Generation Summary")
    print("=" * 60)
    
    successful = sum(1 for r in results.values() if r)
    failed = len(results) - successful
    
    print(f"✅ Successful: {successful}")
    print(f"❌ Failed: {failed}")
    
    if successful > 0:
        print("\n📁 Generated Images:")
        for topic, result in results.items():
            if result:
                print(f"   ✓ {topic}: img/blog/{result.name}")
    
    if failed > 0:
        print("\n⚠️  Failed Topics:")
        for topic, result in results.items():
            if not result:
                print(f"   ✗ {topic}")


def generate_selected(topics):
    """Generate images for selected topics only"""
    print("=" * 60)
    print("🎨 Selected Image Generation")
    print("=" * 60)
    
    for topic in topics:
        filename = BLOG_TOPICS.get(topic, None)
        if not filename:
            # Generate filename from topic
            filename = topic.lower().replace(' ', '-') + '-hero.jpg'
        
        print(f"\n📸 Generating: {topic}")
        result = generate_blog_image(topic, filename)
        
        if result:
            print(f"✅ Success: img/blog/{result.name}")
        else:
            print(f"❌ Failed: {topic}")


def main():
    """Main function"""
    if len(sys.argv) > 1:
        # Generate selected topics
        topics = sys.argv[1:]
        generate_selected(topics)
    else:
        # Generate all
        print("Generating images for all blog topics...")
        print("To generate specific topics, pass them as arguments:")
        print("  python scripts/generate-blog-images-batch.py 'paradise valley' 'quad biking'")
        print()
        generate_all_images()


if __name__ == "__main__":
    main()

