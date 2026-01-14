# 🎨 Higgsfield AI Image Generation Setup

This guide explains how to use Higgsfield AI (Nano Banana Pro) to generate high-quality, realistic images for your Agadir blog posts.

## 📋 Prerequisites

1. **Python 3.7+** installed on your system
2. **Higgsfield AI Premium Account** with Nano Banana Pro access
3. **API Credentials** (already configured)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

Or install individually:
```bash
pip install higgsfield-client python-dotenv requests
```

### 2. Create `.env` File

Create a `.env` file in your project root with your API credentials:

```env
HF_API_KEY=6d1f5116-635c-49af-9c0e-4b9c3f6d5c05
HF_API_SECRET=967f50cb779b2bccd33178142a66b05850549941abd898aeaa3f5924cded5b8a
```

**⚠️ Important:** The `.env` file is already in `.gitignore` to protect your API keys.

### 3. Generate Your First Image

```bash
python scripts/generate-blog-images.py "paradise valley"
```

This will:
- Generate a 1920x1080 image using Nano Banana Pro
- Save it to `img/blog/paradise-valley-[timestamp].jpg`
- Use optimized prompts for travel photography

## 📖 Usage Examples

### Single Image Generation

```bash
# Basic usage (auto-generated filename)
python scripts/generate-blog-images.py "quad biking"

# Custom filename
python scripts/generate-blog-images.py "camel ride" camel-sunset-hero.jpg

# Custom dimensions
python scripts/generate-blog-images.py "desert safari" desert-hero.jpg 1920 1080
```

### Custom Prompts

You can also provide detailed custom prompts:

```bash
python scripts/generate-blog-images.py "Professional travel photography of Paradise Valley Agadir Morocco, natural swimming pools in rocky canyon, palm trees, turquoise water, dramatic mountain backdrop, golden hour lighting, vibrant colors, travel magazine style, 4K quality, ultra-realistic"
```

### Batch Generation

Generate images for all blog topics at once:

```bash
python scripts/generate-blog-images-batch.py
```

Or generate specific topics:

```bash
python scripts/generate-blog-images-batch.py "paradise valley" "quad biking"
```

## 🎯 Available Blog Topics

The script has optimized prompts for these topics:

- **paradise valley** - Natural swimming pools, rocky canyon
- **quad biking** - Desert ATV adventures
- **camel ride** - Sunset camel rides
- **desert safari** - Sahara desert experiences
- **taghazout** - Beach and surfing scenes
- **agadir city** - Cityscape and promenade
- **berber village** - Traditional mountain villages
- **argan oil** - Cultural production scenes
- **agadir day trips** - General day trip destinations
- **cruise excursions** - Port and tour scenes

## 📐 Image Specifications

**Default Settings:**
- **Model:** Nano Banana Pro (4K quality)
- **Dimensions:** 1920x1080 (blog hero images)
- **Format:** JPG
- **Style:** Professional travel photography
- **Quality:** Ultra-realistic, 4K

**Custom Dimensions:**
You can specify custom dimensions:
```bash
python scripts/generate-blog-images.py "topic" filename.jpg 2048 1536
```

## 📁 File Organization

Generated images are saved to:
```
img/blog/
├── paradise-valley-hero.jpg
├── quad-biking-hero.jpg
├── camel-ride-hero.jpg
└── ...
```

## 🔧 Troubleshooting

### API Authentication Errors

**Error:** `API credentials not found`
- **Solution:** Make sure `.env` file exists in project root
- Check that `HF_API_KEY` and `HF_API_SECRET` are set correctly

### Image Generation Fails

**Error:** `HTTP Error` or `API Error`
- **Solution:** 
  1. Check your internet connection
  2. Verify API key has Nano Banana Pro access
  3. Check API usage limits in your Higgsfield account

### Import Errors

**Error:** `ModuleNotFoundError`
- **Solution:** Install dependencies:
  ```bash
  pip install -r requirements.txt
  ```

## 💡 Tips for Best Results

1. **Use Specific Topics:** The script has optimized prompts for common topics. Use those for best results.

2. **Custom Prompts:** For unique images, provide detailed prompts with:
   - Location details
   - Time of day (golden hour, sunset, etc.)
   - Style (professional travel photography, documentary, etc.)
   - Camera settings (if relevant)

3. **Image Dimensions:** 
   - **1920x1080** - Standard blog hero images
   - **2048x1536** - Higher resolution
   - **1200x800** - Thumbnail/social media

4. **Batch Processing:** Use batch generation during off-peak hours to avoid rate limits.

## 🔗 Integration with Blog Posts

After generating images, you can:

1. **Update HTML:** Add images to your blog post HTML files
2. **Update Meta Tags:** Use images in Open Graph and Twitter Card meta tags
3. **Schema Markup:** Reference images in your JSON-LD structured data

Example:
```html
<meta property="og:image" content="https://agadirlocalguide.com/img/blog/paradise-valley-hero.jpg">
```

## 📊 API Usage

Monitor your API usage in your Higgsfield AI dashboard. The Nano Banana Pro model provides:
- High-quality 4K images
- Ultra-realistic results
- Fast generation times

## 🆘 Support

If you encounter issues:
1. Check the error messages in the terminal
2. Verify your API credentials
3. Check Higgsfield AI documentation: https://higgsfield.ai/
4. Review the script output for detailed error information

---

**Last Updated:** January 2025
**Model:** Nano Banana Pro (Higgsfield AI)


