#!/usr/bin/env python3
"""
Higgsfield AI Image Generator for Blog Posts
Generates high-quality images for Agadir tour blog posts using Nano Banana Pro model
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv
import requests
import json
import time
from datetime import datetime

# Load environment variables
load_dotenv()

# Higgsfield API configuration
HF_API_KEY = os.getenv('HF_API_KEY')
HF_API_SECRET = os.getenv('HF_API_SECRET')
HF_API_BASE = "https://platform.higgsfield.ai"

if not HF_API_KEY or not HF_API_SECRET:
    print("❌ Error: API credentials not found in .env file")
    print("   Make sure .env file exists in project root with HF_API_KEY and HF_API_SECRET")
    sys.exit(1)

# Project paths
PROJECT_ROOT = Path(__file__).parent.parent
IMG_DIR = PROJECT_ROOT / "img"
BLOG_IMG_DIR = IMG_DIR / "blog"

# Create blog images directory if it doesn't exist
BLOG_IMG_DIR.mkdir(parents=True, exist_ok=True)


class HiggsfieldImageGenerator:
    """Wrapper for Higgsfield AI image generation using correct API format"""
    
    def __init__(self, api_key, api_secret):
        self.api_key = api_key
        self.api_secret = api_secret
        self.base_url = HF_API_BASE
        self.session = requests.Session()
        # Higgsfield uses Authorization header: Key {api_key}:{api_secret}
        self.session.headers.update({
            'Authorization': f'Key {api_key}:{api_secret}',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })
    
    def _get_aspect_ratio(self, width, height):
        """Convert width/height to aspect ratio string"""
        ratio = width / height
        if abs(ratio - 16/9) < 0.1:
            return "16:9"
        elif abs(ratio - 4/3) < 0.1:
            return "4:3"
        elif abs(ratio - 1) < 0.1:
            return "1:1"
        elif abs(ratio - 9/16) < 0.1:
            return "9:16"
        elif abs(ratio - 21/9) < 0.1:
            return "21:9"
        else:
            # Default to 16:9 for blog images
            return "16:9"
    
    def _get_resolution(self, width, height):
        """Convert width/height to resolution string"""
        max_dim = max(width, height)
        if max_dim >= 3840:
            return "4K"
        elif max_dim >= 2560:
            return "2K"
        elif max_dim >= 1920:
            return "1080p"
        elif max_dim >= 1280:
            return "720p"
        else:
            return "720p"
    
    def _get_model_id(self, model_name):
        """Convert model name to model_id format"""
        # Map common model names to model_id format
        model_map = {
            "nano-banana": "nano-banana",
            "nano-banana-pro": "nano-banana-pro",
            "soul": "higgsfield-ai/soul/standard",
            "reve": "reve/text-to-image",
            "seedream": "bytedance/seedream/v4/text-to-image"
        }
        
        # If already in model_id format (contains /) or is a simple name like "nano-banana", use as-is
        if '/' in model_name or model_name in ["nano-banana", "nano-banana-pro"]:
            return model_name
        
        # Otherwise, try to map it
        return model_map.get(model_name.lower(), f"higgsfield-ai/{model_name}")
    
    def submit_request(self, prompt, model="nano-banana-pro", width=1920, height=1080, **kwargs):
        """
        Submit an image generation request (async)
        
        Args:
            prompt: Text description of the image
            model: Model name or model_id (default: nano-banana-pro)
            width: Image width (default: 1920)
            height: Image height (default: 1080)
            **kwargs: Additional parameters
        
        Returns:
            request_id or None
        """
        model_id = self._get_model_id(model)
        endpoint = f"{self.base_url}/{model_id}"
        
        aspect_ratio = kwargs.get('aspect_ratio') or self._get_aspect_ratio(width, height)
        
        # Different payload format for nano-banana models
        if model_id == "nano-banana":
            payload = {
                "prompt": prompt,
                "num_images": kwargs.get('num_images', 1),
                "aspect_ratio": aspect_ratio,
                "output_format": kwargs.get('output_format', 'png')
            }
            
            # Add input_images if provided
            if 'input_images' in kwargs:
                payload["input_images"] = kwargs['input_images']
            
            print(f"🔄 Submitting request to {model_id}...")
            print(f"📝 Prompt: {prompt[:100]}...")
            print(f"📐 Aspect Ratio: {aspect_ratio}, Format: {payload['output_format']}")
        elif model_id == "nano-banana-pro":
            # nano-banana-pro uses resolution parameter
            resolution = kwargs.get('resolution') or self._get_resolution(width, height)
            # Convert resolution format (e.g., "1080p" -> "1k", "2K" -> "2k", "4K" -> "4k")
            resolution_map = {
                "720p": "1k",
                "1080p": "1k",
                "2K": "2k",
                "4K": "4k"
            }
            resolution_value = resolution_map.get(resolution, "1k")
            
            payload = {
                "prompt": prompt,
                "num_images": kwargs.get('num_images', 1),
                "resolution": kwargs.get('resolution', resolution_value),
                "aspect_ratio": aspect_ratio,
                "output_format": kwargs.get('output_format', 'png')
            }
            
            print(f"🔄 Submitting request to {model_id}...")
            print(f"📝 Prompt: {prompt[:100]}...")
            print(f"📐 Aspect Ratio: {aspect_ratio}, Resolution: {payload['resolution']}, Format: {payload['output_format']}")
        else:
            # Standard format for other models
            resolution = kwargs.get('resolution') or self._get_resolution(width, height)
            payload = {
                "prompt": prompt,
                "aspect_ratio": aspect_ratio,
                "resolution": resolution,
            }
            
            print(f"🔄 Submitting request to {model_id}...")
            print(f"📝 Prompt: {prompt[:100]}...")
            print(f"📐 Aspect Ratio: {aspect_ratio}, Resolution: {resolution}")
        
        # Add any additional kwargs (excluding already handled ones)
        # Note: resolution is handled differently for nano-banana-pro
        excluded_keys = ['aspect_ratio', 'width', 'height', 'num_images', 'output_format', 'input_images']
        if model_id != "nano-banana-pro":
            excluded_keys.append('resolution')
        for key, value in kwargs.items():
            if key not in excluded_keys:
                payload[key] = value
        
        try:
            
            response = self.session.post(endpoint, json=payload, timeout=30)
            response.raise_for_status()
            
            result = response.json()
            
            if 'request_id' in result:
                request_id = result['request_id']
                print(f"✅ Request submitted! Request ID: {request_id}")
                return request_id
            else:
                print(f"❌ No request_id in response: {json.dumps(result, indent=2)}")
            return None
                
        except requests.exceptions.HTTPError as e:
            print(f"❌ HTTP Error: {e}")
            if hasattr(e, 'response') and e.response is not None:
                try:
                    error_detail = e.response.json()
                    print(f"   Details: {json.dumps(error_detail, indent=2)}")
                except:
                    print(f"   Response: {e.response.text[:500]}")
            return None
        except requests.exceptions.RequestException as e:
            print(f"❌ API Error: {e}")
            return None
    
    def check_status(self, request_id):
        """
        Check the status of a generation request
        
        Args:
            request_id: The request ID from submit_request
        
        Returns:
            Status dict with 'status' and potentially 'images' or 'error'
        """
        endpoint = f"{self.base_url}/requests/{request_id}/status"
        
        try:
            response = self.session.get(endpoint, timeout=30)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.HTTPError as e:
            print(f"❌ HTTP Error checking status: {e}")
            if hasattr(e, 'response') and e.response is not None:
                try:
                    error_detail = e.response.json()
                    print(f"   Details: {json.dumps(error_detail, indent=2)}")
                except:
                    print(f"   Response: {e.response.text[:500]}")
            return None
        except requests.exceptions.RequestException as e:
            print(f"❌ API Error checking status: {e}")
            return None
    
    def wait_for_completion(self, request_id, max_wait_time=600, poll_interval=5):
        """
        Wait for a request to complete by polling the status endpoint
        
        Args:
            request_id: The request ID from submit_request
            max_wait_time: Maximum time to wait in seconds (default: 600 = 10 minutes)
            poll_interval: Time between status checks in seconds (default: 5)
        
        Returns:
            Image URL or None
        """
        start_time = time.time()
        
        print(f"⏳ Waiting for generation to complete...")
        
        while time.time() - start_time < max_wait_time:
            status_result = self.check_status(request_id)
            
            if not status_result:
                print("❌ Failed to check status")
                return None
            
            status = status_result.get('status', 'unknown')
            
            if status == 'completed':
                print("✅ Generation completed!")
                # Extract image URL
                if 'images' in status_result and len(status_result['images']) > 0:
                    image_url = status_result['images'][0].get('url')
                    if image_url:
                        return image_url
                print(f"⚠️  Completed but no image URL found: {json.dumps(status_result, indent=2)}")
                return None
            
            elif status == 'failed':
                error_msg = status_result.get('error', 'Unknown error')
                print(f"❌ Generation failed: {error_msg}")
                return None
            
            elif status == 'nsfw':
                print("❌ Content failed moderation checks")
                return None
            
            elif status in ['queued', 'in_progress']:
                elapsed = int(time.time() - start_time)
                print(f"   Status: {status} (elapsed: {elapsed}s)", end='\r')
                time.sleep(poll_interval)
            else:
                print(f"⚠️  Unknown status: {status}")
                time.sleep(poll_interval)
        
        print(f"\n❌ Timeout: Request did not complete within {max_wait_time} seconds")
        return None
    
    def generate_image(self, prompt, model="nano-banana-pro", width=1920, height=1080, **kwargs):
        """
        Generate an image using Higgsfield AI (complete workflow)
        
        Args:
            prompt: Text description of the image
            model: Model name or model_id (default: nano-banana-pro)
            width: Image width (default: 1920 for blog hero images)
            height: Image height (default: 1080 for blog hero images)
            **kwargs: Additional parameters
        
        Returns:
            Image URL or None
        """
        # Submit request
        request_id = self.submit_request(prompt, model, width, height, **kwargs)
        
        if not request_id:
            return None
        
        # Wait for completion
        image_url = self.wait_for_completion(request_id)
        
        return image_url
    
    def download_image(self, image_url, output_path):
        """Download image from URL to local file"""
        try:
            # Handle base64 encoded images
            if image_url.startswith('data:image'):
                import base64
                header, encoded = image_url.split(',', 1)
                image_data = base64.b64decode(encoded)
                with open(output_path, 'wb') as f:
                    f.write(image_data)
                print(f"💾 Image saved to: {output_path}")
                return True
            
            # Handle URL images
            response = requests.get(image_url, stream=True, timeout=60)
            response.raise_for_status()
            
            with open(output_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            
            print(f"💾 Image saved to: {output_path}")
            return True
        except Exception as e:
            print(f"❌ Error downloading image: {e}")
            return False


def create_blog_image_prompt(topic, style="professional travel photography"):
    """
    Create optimized prompts for blog images based on topic
    Enhanced to match high-end travel magazine quality standards
    
    Args:
        topic: Blog topic (e.g., "paradise valley", "quad biking")
        style: Photography style
    
    Returns:
        Formatted prompt string with premium quality specifications
    """
    
    # Base quality template that matches your successful prompt
    base_quality = "High-end travel magazine cover image (16:9). Premium and minimal. Strong contrast, crisp clarity, cinematic color grading. No text, no logos, no watermark, no AI artifacts, no extra limbs."
    
    prompts = {
        "paradise valley": f"{base_quality} A single striking scene of Paradise Valley near Agadir Morocco: natural turquoise swimming pools in a dramatic rocky canyon, palm trees framing the scene, visitors swimming in crystal-clear water, dramatic mountain backdrop. Golden hour lighting with warm highlights, vibrant emerald and turquoise tones. Modern editorial photography, crisp focus, realistic lighting, cinematic depth. Composition: subject in center, negative space for headline overlay.",
        
        "quad biking": f"{base_quality} Dynamic action scene of quad biking adventure in Agadir Morocco desert: ATV vehicle kicking up dust clouds on sand dunes, rider in motion, dramatic sunset lighting creating long shadows. Adventure sports photography with motion blur effect, strong contrast between warm sand and cool sky. Cinematic composition with diagonal lines, vibrant orange and blue tones.",
        
        "camel ride": f"{base_quality} Cinematic scene of camel riding in Agadir Morocco desert at sunset: silhouettes of travelers on camels against vibrant orange and purple sky, sand dunes creating flowing lines, traditional Berber guide leading the way. Warm golden hour lighting, wide angle shot showing vast desert landscape. Premium travel photography with dramatic depth and contrast.",
        
        "desert safari": f"{base_quality} Atmospheric scene of Sahara desert safari from Agadir: vast sand dunes with wind-swept patterns, traditional Berber camp with tents, travelers around campfire under starry night sky. Dramatic lighting from fire and stars, authentic Moroccan desert experience. Long exposure feel, cinematic color grading with warm firelight and cool starlight.",
        
        "taghazout": f"{base_quality} Coastal scene of Taghazout beach Morocco: surfers catching waves, colorful fishing boats in harbor, traditional fishing village architecture, Atlantic Ocean with perfect waves. Golden hour lighting, coastal atmosphere with vibrant blues and warm earth tones. Modern editorial photography, crisp clarity, premium travel magazine style.",
        
        "agadir city": f"{base_quality} Aerial view of Agadir city Morocco: modern beachfront promenade with palm trees, white buildings with Mediterranean architecture, Atlantic Ocean coastline, vibrant city life. Clean composition, strong contrast between white architecture and blue ocean. Premium travel photography, crisp clarity, cinematic color grading with warm highlights.",
        
        "berber village": f"{base_quality} Authentic scene of traditional Berber village in Atlas Mountains near Agadir: stone houses with terraced fields, mountain backdrop, local people in traditional dress, warm natural lighting. Cultural authenticity, documentary-style photography with premium quality. Strong contrast, crisp clarity, cinematic depth showing traditional Moroccan architecture.",
        
        "argan oil": f"{base_quality} Documentary-style scene of Argan oil production in Morocco: Berber women working with argan trees, traditional process, goats in argan trees, authentic cultural experience. Warm natural lighting, premium photography quality. Strong contrast, crisp clarity, cinematic color grading. No text, no logos, no watermark.",
        
        "agadir day trips": f"{base_quality} Modern Morocco destinations collage: Paradise Valley natural pools, Essaouira blue medina with coastal port, Marrakech terracotta architecture, Taghazout surf beach. Dynamic diagonal composition with soft borders between scenes (like torn-paper or smooth blended panels). Strong contrast, crisp clarity, cinematic color grading. Premium and minimal.",
        
        "cruise excursions": f"{base_quality} Scene of Agadir cruise port excursions: tourists exploring Morocco, modern port with cruise ships, tour buses, cultural experiences blending modern and traditional. Premium travel photography, crisp clarity, cinematic color grading. Strong contrast between modern port infrastructure and traditional Moroccan elements."
    }
    
    # Find matching topic (case-insensitive)
    topic_lower = topic.lower()
    for key, prompt in prompts.items():
        if key in topic_lower:
            return prompt
    
    # Enhanced default prompt for unknown topics
    return f"{base_quality} A single striking scene of {topic} in Agadir Morocco. Modern editorial photography, crisp focus, realistic lighting, cinematic depth, warm highlights. Composition with negative space for headline overlay. Premium travel magazine style."


def generate_blog_image(topic, filename=None, model="nano-banana-pro", width=1920, height=1080):
    """
    Generate and save a blog image
    
    Args:
        topic: Blog topic or custom prompt
        filename: Output filename (auto-generated if None)
        model: Higgsfield model to use (default: nano-banana-pro)
        width: Image width (default: 1920)
        height: Image height (default: 1080)
    
    Returns:
        Path to saved image or None
    """
    generator = HiggsfieldImageGenerator(HF_API_KEY, HF_API_SECRET)
    
    # Create prompt
    if len(topic.split()) > 15:
        # Assume it's already a detailed prompt
        prompt = topic
    else:
        # Generate prompt from topic
        prompt = create_blog_image_prompt(topic)
    
    print(f"\n🎨 Generating image for: {topic}")
    print(f"📦 Model: {model}")
    print(f"📐 Size: {width}x{height}\n")
    
    # Generate image
    image_url = generator.generate_image(
        prompt=prompt,
        model=model,
        width=width,
        height=height
    )
    
    if not image_url:
        print("❌ Failed to generate image")
        return None
    
    # Generate filename if not provided
    if not filename:
        safe_topic = "".join(c for c in topic.lower() if c.isalnum() or c in (' ', '-', '_')).strip()
        safe_topic = safe_topic.replace(' ', '-')[:50]
        timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
        filename = f"{safe_topic}-{timestamp}.jpg"
    
    # Ensure .jpg extension
    if not filename.endswith(('.jpg', '.jpeg', '.png', '.webp')):
        filename += '.jpg'
    
    output_path = BLOG_IMG_DIR / filename
    
    # Download image
    if generator.download_image(image_url, output_path):
        # Get file size
        file_size = output_path.stat().st_size / (1024 * 1024)  # MB
        print(f"📊 File size: {file_size:.2f} MB")
        return output_path
    return None


def main():
    """Main function for CLI usage"""
    if len(sys.argv) < 2:
        print("=" * 60)
        print("🎨 Higgsfield AI Image Generator for Blog Posts")
        print("=" * 60)
        print("\nUsage: python scripts/generate-blog-images.py <topic> [filename] [model] [width] [height]")
        print("\nExamples:")
        print("  python scripts/generate-blog-images.py 'paradise valley'")
        print("  python scripts/generate-blog-images.py 'quad biking' quad-biking-hero.jpg")
        print("  python scripts/generate-blog-images.py 'camel ride' camel-sunset.jpg higgsfield-ai/soul/standard 1920 1080")
        print("\n📝 Available Topics:")
        print("  - paradise valley")
        print("  - quad biking")
        print("  - camel ride")
        print("  - desert safari")
        print("  - taghazout")
        print("  - agadir city")
        print("  - berber village")
        print("  - argan oil")
        print("  - agadir day trips")
        print("  - cruise excursions")
        print("\n🤖 Available Models:")
        print("  - nano-banana-pro (default)")
        print("  - nano-banana")
        print("  - higgsfield-ai/soul/standard")
        print("  - reve/text-to-image")
        print("  - bytedance/seedream/v4/text-to-image")
        print("\n💡 Tip: You can also provide a custom detailed prompt instead of a topic")
        print("=" * 60)
        sys.exit(1)
    
    topic = sys.argv[1]
    filename = sys.argv[2] if len(sys.argv) > 2 and not sys.argv[2].startswith('--') else None
    
    # Parse arguments - handle model, width, height
    model = "nano-banana-pro"  # Default
    width = 1920
    height = 1080
    
    # Simple argument parsing
    args = sys.argv[2:]
    i = 0
    while i < len(args):
        arg = args[i]
        if arg == '--model' and i + 1 < len(args):
            model = args[i + 1]
            i += 2
        elif arg.endswith(('.jpg', '.jpeg', '.png', '.webp')) and filename is None:
            filename = arg
            i += 1
        elif arg.isdigit() and width == 1920:
            width = int(arg)
            i += 1
        elif arg.isdigit() and height == 1080:
            height = int(arg)
            i += 1
        else:
            i += 1
    
    result = generate_blog_image(topic, filename, model=model, width=width, height=height)
    
    if result:
        print(f"\n✅ Success! Image saved to:")
        print(f"   {result}")
        print(f"   📁 Relative path: img/blog/{result.name}")
        print(f"\n💡 You can now use this image in your blog posts!")
    else:
        print("\n❌ Failed to generate image. Please check:")
        print("   1. API credentials in .env file")
        print("   2. Internet connection")
        print("   3. API key permissions and account balance")
        sys.exit(1)


if __name__ == "__main__":
    main()

