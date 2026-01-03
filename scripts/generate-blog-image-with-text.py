#!/usr/bin/env python3
"""
Generate blog image with text overlay for Paradise Valley blog post
"""

import os
import sys
import importlib.util
from pathlib import Path
from dotenv import load_dotenv
from PIL import Image, ImageDraw, ImageFont
import requests

# Load environment variables
load_dotenv()

# Import from existing script
spec = importlib.util.spec_from_file_location("generate_blog_images", Path(__file__).parent / "generate-blog-images.py")
generate_blog_images = importlib.util.module_from_spec(spec)
spec.loader.exec_module(generate_blog_images)

HF_API_KEY = os.getenv('HF_API_KEY')
HF_API_SECRET = os.getenv('HF_API_SECRET')
PROJECT_ROOT = Path(__file__).parent.parent
BLOG_IMG_DIR = PROJECT_ROOT / "img" / "blog"
BLOG_IMG_DIR.mkdir(parents=True, exist_ok=True)

HiggsfieldImageGenerator = generate_blog_images.HiggsfieldImageGenerator

def add_text_overlay(image_path, title, subtitle=None, output_path=None, position="top-left"):
    """
    Add text overlay to an image with modern travel poster style
    
    Args:
        image_path: Path to the base image
        title: Main title text (can include subtitle part like "2025 Guide")
        subtitle: Optional subtitle text (if None, will try to extract from title)
        output_path: Output path (defaults to image_path with _text suffix)
        position: Text position - "top-left" or "bottom"
    """
    # Open the image
    img = Image.open(image_path)
    draw = ImageDraw.Draw(img)
    
    # Get image dimensions
    width, height = img.size
    
    # Try to load a nice bold sans-serif font
    try:
        title_font_size = int(width * 0.05)  # Responsive font size
        subtitle_font_size = int(width * 0.03)
        
        # Try different font paths for bold sans-serif
        font_paths = [
            '/System/Library/Fonts/Supplemental/Arial Bold.ttf',
            '/System/Library/Fonts/Supplemental/Helvetica.ttc',
            '/System/Library/Fonts/Helvetica.ttc',
            '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
        ]
        
        title_font = None
        for font_path in font_paths:
            if os.path.exists(font_path):
                try:
                    title_font = ImageFont.truetype(font_path, title_font_size)
                    break
                except:
                    continue
        
        if title_font is None:
            title_font = ImageFont.load_default()
            title_font_size = 50
        
        subtitle_font = None
        if subtitle:
            for font_path in font_paths:
                if os.path.exists(font_path):
                    try:
                        subtitle_font = ImageFont.truetype(font_path, subtitle_font_size)
                        break
                    except:
                        continue
            if subtitle_font is None:
                subtitle_font = ImageFont.load_default()
    except:
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()
        title_font_size = 50
        subtitle_font_size = 30
    
    if position == "top-left":
        # Top-left positioning with rounded rectangle background
        padding = int(width * 0.04)  # 4% padding
        margin = int(width * 0.04)  # 4% margin from edges
        
        # Split title if it contains "2025 Guide" or similar
        main_title = title
        year_subtitle = None
        
        if "2025 Guide" in title:
            parts = title.split("2025 Guide")
            main_title = parts[0].strip()
            year_subtitle = "2025 Guide"
        elif subtitle:
            year_subtitle = subtitle
        
        # Calculate text dimensions
        bbox_main = draw.textbbox((0, 0), main_title, font=title_font)
        main_width = bbox_main[2] - bbox_main[0]
        main_height = bbox_main[3] - bbox_main[1]
        
        total_height = main_height + padding
        if year_subtitle:
            bbox_sub = draw.textbbox((0, 0), year_subtitle, font=subtitle_font)
            sub_width = bbox_sub[2] - bbox_sub[0]
            sub_height = bbox_sub[3] - bbox_sub[1]
            total_height += sub_height + padding // 2
            max_width = max(main_width, sub_width)
        else:
            max_width = main_width
        
        # Create rounded rectangle background
        rect_width = max_width + padding * 2
        rect_height = total_height + padding
        rect_x = margin
        rect_y = margin
        corner_radius = int(width * 0.015)  # 1.5% corner radius
        
        # Create overlay with rounded rectangle
        overlay = Image.new('RGBA', (width, height), (0, 0, 0, 0))
        overlay_draw = ImageDraw.Draw(overlay)
        
        # Draw rounded rectangle with gradient effect (darker at edges)
        # Try to use rounded_rectangle if available, otherwise use regular rectangle
        try:
            # Pillow 10.0.0+ has rounded_rectangle
            for i in range(5):
                alpha = int(200 - i * 20)  # Decreasing opacity
                overlay_draw.rounded_rectangle(
                    [(rect_x - i, rect_y - i), (rect_x + rect_width + i, rect_y + rect_height + i)],
                    radius=corner_radius + i,
                    fill=(0, 0, 0, alpha)
                )
        except AttributeError:
            # Fallback: draw regular rectangle with slight transparency
            for i in range(3):
                alpha = int(200 - i * 30)
                overlay_draw.rectangle(
                    [(rect_x - i, rect_y - i), (rect_x + rect_width + i, rect_y + rect_height + i)],
                    fill=(0, 0, 0, alpha)
                )
        
        # Composite the overlay
        img = Image.alpha_composite(img.convert('RGBA'), overlay).convert('RGB')
        draw = ImageDraw.Draw(img)
        
        # Draw main title
        text_x = rect_x + padding
        text_y = rect_y + padding
        
        # Draw text with slight shadow for depth
        shadow_offset = 2
        draw.text((text_x + shadow_offset, text_y + shadow_offset), main_title, 
                 font=title_font, fill=(0, 0, 0, 100))
        draw.text((text_x, text_y), main_title, font=title_font, fill='white')
        
        # Draw subtitle if exists
        if year_subtitle:
            text_y += main_height + padding // 2
            draw.text((text_x + shadow_offset, text_y + shadow_offset), year_subtitle, 
                     font=subtitle_font, fill=(0, 0, 0, 100))
            draw.text((text_x, text_y), year_subtitle, font=subtitle_font, fill='white')
    
    else:
        # Bottom positioning (original code)
        # Create a semi-transparent overlay for better text readability
        overlay = Image.new('RGBA', (width, height), (0, 0, 0, 0))
        overlay_draw = ImageDraw.Draw(overlay)
        
        # Add gradient overlay at bottom for text area (about 40% of height)
        text_area_height = int(height * 0.4)
        for y in range(height - text_area_height, height):
            alpha = int(180 * (1 - (height - y) / text_area_height))
            overlay_draw.rectangle([(0, y), (width, y + 1)], fill=(0, 0, 0, alpha))
        
        # Composite the overlay
        img = Image.alpha_composite(img.convert('RGBA'), overlay).convert('RGB')
        draw = ImageDraw.Draw(img)
        
        # Calculate text position (centered, near bottom)
        y_position = height - int(height * 0.25)  # 25% from bottom
        
        # Draw title
        title_lines = []
        words = title.split()
        current_line = ""
        
        # Simple word wrapping
        max_width = int(width * 0.85)  # 85% of image width
        for word in words:
            test_line = current_line + (" " if current_line else "") + word
            bbox = draw.textbbox((0, 0), test_line, font=title_font)
            text_width = bbox[2] - bbox[0]
            
            if text_width > max_width and current_line:
                title_lines.append(current_line)
                current_line = word
            else:
                current_line = test_line
        
        if current_line:
            title_lines.append(current_line)
        
        # Draw title lines
        title_y = y_position
        if subtitle:
            title_y -= subtitle_font_size + 20  # Make room for subtitle
        
        for i, line in enumerate(title_lines):
            bbox = draw.textbbox((0, 0), line, font=title_font)
            text_width = bbox[2] - bbox[0]
            x = (width - text_width) // 2
            
            # Draw text with shadow for better readability
            shadow_offset = 2
            draw.text((x + shadow_offset, title_y + shadow_offset), line, 
                     font=title_font, fill=(0, 0, 0, 180))
            draw.text((x, title_y), line, font=title_font, fill='white')
            
            # Move to next line
            bbox = draw.textbbox((0, 0), line, font=title_font)
            line_height = bbox[3] - bbox[1]
            title_y += line_height + 10
        
        # Draw subtitle if provided
        if subtitle:
            bbox = draw.textbbox((0, 0), subtitle, font=subtitle_font)
            text_width = bbox[2] - bbox[0]
            x = (width - text_width) // 2
            y = height - int(height * 0.15)
            
            # Draw subtitle with shadow
            shadow_offset = 1
            draw.text((x + shadow_offset, y + shadow_offset), subtitle, 
                     font=subtitle_font, fill=(0, 0, 0, 150))
            draw.text((x, y), subtitle, font=subtitle_font, fill='#FFD400')  # Yellow accent
    
    # Try to load a nice font, fallback to default
    try:
        # Try to use a bold system font
        title_font_size = int(width * 0.045)  # Responsive font size
        subtitle_font_size = int(width * 0.025)
        
        # Try different font paths
        font_paths = [
            '/System/Library/Fonts/Supplemental/Arial Bold.ttf',
            '/System/Library/Fonts/Helvetica.ttc',
            '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
        ]
        
        title_font = None
        for font_path in font_paths:
            if os.path.exists(font_path):
                try:
                    title_font = ImageFont.truetype(font_path, title_font_size)
                    break
                except:
                    continue
        
        if title_font is None:
            title_font = ImageFont.load_default()
            title_font_size = 40
        
        subtitle_font = None
        if subtitle:
            for font_path in font_paths:
                if os.path.exists(font_path):
                    try:
                        subtitle_font = ImageFont.truetype(font_path, subtitle_font_size)
                        break
                    except:
                        continue
            if subtitle_font is None:
                subtitle_font = ImageFont.load_default()
    except:
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()
        title_font_size = 40
        subtitle_font_size = 24
    
    # Calculate text position (centered, near bottom)
    y_position = height - int(height * 0.25)  # 25% from bottom
    
    # Draw title
    title_lines = []
    words = title.split()
    current_line = ""
    
    # Simple word wrapping
    max_width = int(width * 0.85)  # 85% of image width
    for word in words:
        test_line = current_line + (" " if current_line else "") + word
        bbox = draw.textbbox((0, 0), test_line, font=title_font)
        text_width = bbox[2] - bbox[0]
        
        if text_width > max_width and current_line:
            title_lines.append(current_line)
            current_line = word
        else:
            current_line = test_line
    
    if current_line:
        title_lines.append(current_line)
    
    # Draw title lines
    title_y = y_position
    if subtitle:
        title_y -= subtitle_font_size + 20  # Make room for subtitle
    
    for i, line in enumerate(title_lines):
        bbox = draw.textbbox((0, 0), line, font=title_font)
        text_width = bbox[2] - bbox[0]
        x = (width - text_width) // 2
        
        # Draw text with shadow for better readability
        shadow_offset = 2
        draw.text((x + shadow_offset, title_y + shadow_offset), line, 
                 font=title_font, fill=(0, 0, 0, 180))
        draw.text((x, title_y), line, font=title_font, fill='white')
        
        # Move to next line
        bbox = draw.textbbox((0, 0), line, font=title_font)
        line_height = bbox[3] - bbox[1]
        title_y += line_height + 10
    
    # Draw subtitle if provided
    if subtitle:
        bbox = draw.textbbox((0, 0), subtitle, font=subtitle_font)
        text_width = bbox[2] - bbox[0]
        x = (width - text_width) // 2
        y = height - int(height * 0.15)
        
        # Draw subtitle with shadow
        shadow_offset = 1
        draw.text((x + shadow_offset, y + shadow_offset), subtitle, 
                 font=subtitle_font, fill=(0, 0, 0, 150))
        draw.text((x, y), subtitle, font=subtitle_font, fill='#FFD400')  # Yellow accent
    
    # Save the image
    if output_path is None:
        base_name = Path(image_path).stem
        output_path = image_path.parent / f"{base_name}_text.jpg"
    
    img.save(output_path, 'JPEG', quality=95)
    print(f"✅ Text overlay added. Saved to: {output_path}")
    return output_path


def main():
    """Generate Paradise Valley blog image with title"""
    
    # Blog post title
    title = "Paradise Valley Agadir: The Complete 2025 Guide"
    
    print("=" * 60)
    print("🎨 Generating Paradise Valley Blog Image with Title")
    print("=" * 60)
    print()
    
    # Step 1: Generate base image
    generator = HiggsfieldImageGenerator(HF_API_KEY, HF_API_SECRET)
    
    prompt = "Featured image (16:9) for a travel blog guide about Paradise Valley Agadir. Show an adventurous scene: a traveler standing on a rock above a natural turquoise pool (small figure, back facing camera), palm trees, canyon cliffs, bright clear sky, realistic cinematic photography, vibrant but natural colors. No text, no watermark, no AI artifacts."
    
    print("📸 Step 1: Generating base image...")
    print(f"📝 Prompt: {prompt[:100]}...")
    print()
    
    image_url = generator.generate_image(
        prompt=prompt,
        model="nano-banana-pro",
        width=1920,
        height=1080
    )
    
    if not image_url:
        print("❌ Failed to generate base image")
        sys.exit(1)
    
    # Step 2: Download base image
    base_image_path = BLOG_IMG_DIR / "paradise-valley-base.jpg"
    print(f"\n📥 Step 2: Downloading base image...")
    if not generator.download_image(image_url, base_image_path):
        print("❌ Failed to download image")
        sys.exit(1)
    
    # Step 3: Add text overlay (top-left position with rounded rectangle)
    print(f"\n✍️  Step 3: Adding title text overlay (top-left, modern travel poster style)...")
    final_image_path = add_text_overlay(
        base_image_path,
        title=title,
        subtitle=None,  # Will extract "2025 Guide" from title
        output_path=BLOG_IMG_DIR / "paradise-valley-agadir-guide-2025.jpg",
        position="top-left"
    )
    
    # Clean up base image
    if base_image_path.exists():
        base_image_path.unlink()
        print(f"🧹 Cleaned up temporary base image")
    
    print()
    print("=" * 60)
    print("✅ Success! Blog image with title created:")
    print(f"   {final_image_path}")
    print(f"   📁 Relative path: img/blog/{final_image_path.name}")
    print("=" * 60)


if __name__ == "__main__":
    main()

