#!/usr/bin/env python3
"""
Test script to verify Higgsfield AI API connection and credentials
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv
import requests
import json
import time

# Load environment variables
load_dotenv()

# Higgsfield API configuration
HF_API_KEY = os.getenv('HF_API_KEY')
HF_API_SECRET = os.getenv('HF_API_SECRET')
HF_API_BASE = "https://platform.higgsfield.ai"

def test_api_connection():
    """Test basic API connection and authentication"""
    print("=" * 60)
    print("🔍 Testing Higgsfield AI API Connection")
    print("=" * 60)
    print()
    
    # Check if credentials exist
    if not HF_API_KEY:
        print("❌ HF_API_KEY not found in .env file")
        return False
    if not HF_API_SECRET:
        print("❌ HF_API_SECRET not found in .env file")
        return False
    
    print(f"✅ API Key found: {HF_API_KEY[:20]}...")
    print(f"✅ API Secret found: {HF_API_SECRET[:20]}...")
    print()
    
    # Test connection
    session = requests.Session()
    # Higgsfield uses Authorization header: Key {api_key}:{api_secret}
    session.headers.update({
        'Authorization': f'Key {HF_API_KEY}:{HF_API_SECRET}',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    })
    
    # Test 1: Check API endpoint accessibility
    print("📡 Test 1: Checking API endpoint accessibility...")
    try:
        # Try submitting a simple test request to a known model
        # Using higgsfield-ai/soul/standard as a test model
        test_url = f"{HF_API_BASE}/higgsfield-ai/soul/standard"
        test_payload = {
            "prompt": "a simple red square on white background",
            "aspect_ratio": "1:1",
            "resolution": "720p"
        }
        response = session.post(test_url, json=test_payload, timeout=30)
        print(f"   Status Code: {response.status_code}")
        if response.status_code == 200:
            print("   ✅ API endpoint is reachable and authentication works!")
            try:
                result = response.json()
                if 'request_id' in result:
                    print(f"   ✅ Request submitted successfully!")
                    print(f"   📋 Request ID: {result['request_id']}")
                    return True
                else:
                    print(f"   ⚠️  Unexpected response: {json.dumps(result, indent=2)}")
            except:
                print("   ⚠️  Could not parse response")
        elif response.status_code == 401:
            print("   ❌ Authentication failed - check your API credentials")
            try:
                error_detail = response.json()
                print(f"   Error: {json.dumps(error_detail, indent=2)}")
            except:
                pass
            return False
        elif response.status_code == 402:
            print("   ❌ Payment required - check your account balance")
            return False
        elif response.status_code == 403:
            print("   ❌ Access forbidden - check API key permissions")
            return False
        else:
            print(f"   ⚠️  Unexpected status code: {response.status_code}")
            try:
                error_detail = response.json()
                print(f"   Response: {json.dumps(error_detail, indent=2)}")
            except:
                print(f"   Response: {response.text[:200]}")
    except requests.exceptions.Timeout:
        print("   ❌ Connection timeout - API server may be down or slow")
        return False
    except requests.exceptions.ConnectionError as e:
        print(f"   ❌ Connection error: {e}")
        print("   💡 This could mean:")
        print("      - API server is down")
        print("      - Network connectivity issues")
        print("      - Incorrect API base URL")
        return False
    except Exception as e:
        print(f"   ⚠️  Error: {e}")
    
    print()
    
    # Test 2: Try a simple image generation request and wait for completion
    print("\n🎨 Test 2: Testing complete image generation workflow...")
    try:
        # Try with a common model - if nano-banana-pro doesn't work, try soul/standard
        test_models = [
            "higgsfield-ai/nano-banana-pro",
            "higgsfield-ai/soul/standard"
        ]
        
        for model_id in test_models:
            print(f"\n   Trying model: {model_id}")
            endpoint = f"{HF_API_BASE}/{model_id}"
            payload = {
                "prompt": "a simple test image, red square on white background",
                "aspect_ratio": "1:1",
                "resolution": "720p"
            }
            
            print(f"   Sending request to: {endpoint}")
            print("   ⏳ Submitting request...")
            
            response = session.post(endpoint, json=payload, timeout=30)
            print(f"   Status Code: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                if 'request_id' in result:
                    request_id = result['request_id']
                    print(f"   ✅ Request submitted! Request ID: {request_id}")
                    print("   ⏳ Waiting for generation to complete (this may take 1-2 minutes)...")
                    
                    # Poll for status
                    status_url = f"{HF_API_BASE}/requests/{request_id}/status"
                    max_wait = 120  # 2 minutes
                    start_time = time.time()
                    
                    while time.time() - start_time < max_wait:
                        status_response = session.get(status_url, timeout=30)
                        if status_response.status_code == 200:
                            status_data = status_response.json()
                            status = status_data.get('status', 'unknown')
                            
                            if status == 'completed':
                                print("   ✅ Image generation completed!")
                                if 'images' in status_data and len(status_data['images']) > 0:
                                    image_url = status_data['images'][0].get('url')
                                    if image_url:
                                        print(f"   📸 Image URL: {image_url[:80]}...")
                                        return True
                            elif status == 'failed':
                                error_msg = status_data.get('error', 'Unknown error')
                                print(f"   ❌ Generation failed: {error_msg}")
                                break
                            elif status == 'nsfw':
                                print("   ❌ Content failed moderation")
                                break
                            elif status in ['queued', 'in_progress']:
                                elapsed = int(time.time() - start_time)
                                print(f"   Status: {status} (elapsed: {elapsed}s)", end='\r')
                                time.sleep(3)
                            else:
                                print(f"   ⚠️  Unknown status: {status}")
                                time.sleep(3)
                        else:
                            print(f"   ⚠️  Status check failed: {status_response.status_code}")
                            break
                    
                    print("\n   ⏱️  Timeout waiting for completion")
                    return False
                else:
                    print(f"   ⚠️  No request_id in response: {json.dumps(result, indent=2)}")
            elif response.status_code == 401:
                print("   ❌ Authentication failed")
                print("   💡 Check that your API key and secret are correct")
                continue  # Try next model
            elif response.status_code == 402:
                print("   ❌ Payment required")
                print("   💡 Your account may need credits or subscription")
                return False
            elif response.status_code == 403:
                print("   ❌ Access forbidden")
                print("   💡 Check that your API key has access to this model")
                continue  # Try next model
            elif response.status_code == 404:
                print("   ⚠️  Model not found - trying next model...")
                continue  # Try next model
            else:
                print(f"   ❌ Unexpected status code: {response.status_code}")
                try:
                    error_detail = response.json()
                    print(f"   Error details: {json.dumps(error_detail, indent=2)}")
                except:
                    print(f"   Response: {response.text[:200]}")
        
        print("   ❌ All model attempts failed")
        return False
            
    except requests.exceptions.Timeout:
        print("   ❌ Request timed out")
        print("   💡 API server may be slow or overloaded")
        return False
    except requests.exceptions.RequestException as e:
        print(f"   ❌ Request error: {e}")
        return False
    except Exception as e:
        print(f"   ❌ Unexpected error: {e}")
        return False


def main():
    """Main test function"""
    result = test_api_connection()
    
    print()
    print("=" * 60)
    if result:
        print("✅ API Test: PASSED")
        print("   Your Higgsfield AI API is working correctly!")
    else:
        print("❌ API Test: FAILED")
        print("   Please check the errors above and:")
        print("   1. Verify API credentials in .env file")
        print("   2. Check your Higgsfield AI account status")
        print("   3. Ensure you have access to nano-banana-pro model")
        print("   4. Check if API server is operational")
    print("=" * 60)
    
    return 0 if result else 1


if __name__ == "__main__":
    sys.exit(main())

