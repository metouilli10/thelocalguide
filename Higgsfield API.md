

# How to use API

> Complete guide to using the Higgsfield API

## Overview

The Model endpoint is the primary entry point for generating content with the Higgsfield API. Each model on the Higgsfield platform has a unique `model_id` (e.g., `higgsfield-ai/soul/standard`).

**Base API URL:** `https://platform.higgsfield.ai`

The Higgsfield API uses an asynchronous request-response pattern. When you submit a generation request, it enters a queue and processes in the background. This approach offers several advantages:

* Monitor task status without maintaining open connections
* Cancel requests that haven't started processing
* Avoid resource-intensive concurrent connections

## API Endpoints

### Queue Management

| Endpoint                                                      | Method | Description                                 |
| ------------------------------------------------------------- | ------ | ------------------------------------------- |
| `https://platform.higgsfield.ai/{model_id}`                   | POST   | Submit a generation request to the queue    |
| `https://platform.higgsfield.ai/requests/{request_id}/status` | GET    | Retrieve the status of a generation request |
| `https://platform.higgsfield.ai/requests/{request_id}/cancel` | POST   | Cancel a pending request                    |

### Parameters

* **`model_id`**: The unique identifier for the model (e.g., `higgsfield-ai/soul/standard`)
* **`request_id`**: A unique UUID assigned to your request upon submission

## Usage Examples

### Submitting a Generation Request

```bash  theme={null}
curl -X POST 'https://platform.higgsfield.ai/higgsfield-ai/soul/standard' \
  --header 'Authorization: Key {your_api_key}:{your_api_key_secret}' \
  --data '{
    "prompt": "your prompt here",
    "aspect_ratio": "16:9",
    "resolution": "720p"
  }'
```

### Response Format

#### Queued Request

```json  theme={null}
{
  "status": "queued",
  "request_id": "d7e6c0f3-6699-4f6c-bb45-2ad7fd9158ff",
  "status_url": "https://platform.higgsfield.ai/requests/d7e6c0f3-6699-4f6c-bb45-2ad7fd9158ff/status",
  "cancel_url": "https://platform.higgsfield.ai/requests/d7e6c0f3-6699-4f6c-bb45-2ad7fd9158ff/cancel"
}
```

#### Completed Request

```json  theme={null}
{
  "status": "completed",
  "request_id": "d7e6c0f3-6699-4f6c-bb45-2ad7fd9158ff",
  "status_url": "https://platform.higgsfield.ai/requests/d7e6c0f3-6699-4f6c-bb45-2ad7fd9158ff/status",
  "cancel_url": "https://platform.higgsfield.ai/requests/d7e6c0f3-6699-4f6c-bb45-2ad7fd9158ff/cancel",
  "images": [
    {
      "url": "https://image.url/example.jpg"
    }
  ],
  "video": {
    "url": "https://video.url/example.mp4"
  }
}
```

## Request Statuses

| Status        | Description                                                     |
| ------------- | --------------------------------------------------------------- |
| `queued`      | Request is waiting in the queue and has not started processing  |
| `in_progress` | Generation is actively processing (cancellation not available)  |
| `nsfw`        | Content failed moderation checks (credits refunded)             |
| `failed`      | Generation encountered an error (credits refunded)              |
| `completed`   | Generation finished successfully (media available for download) |

## Canceling a Request

You can cancel a request only while it remains in the `queued` status. Once processing begins, cancellation is no longer possible.

```bash  theme={null}
curl -X POST https://platform.higgsfield.ai/requests/{request_id}/cancel \
  --header 'Authorization: Key {your_api_key}:{your_api_key_secret}'
```

If cancellation was successful, you will get a `202 Accepted` response status code. Otherwise, response status code will be `400 Bad Request`.

## Best Practices

* Poll the status endpoint periodically to check request progress
* Or use webhooks to get generation result by HTTP
* Store the `request_id` to retrieve results later
* Handle different status codes appropriately in your application


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.higgsfield.ai/llms.txt

# Webhook Integration

> Guide to using webhooks with the Higgsfield API

## Overview

Webhooks allow you to receive automatic notifications when your generation requests reach a final status. Instead of polling the status endpoint, the Higgsfield API will send an HTTP POST request to your specified webhook URL.

## Configuration

To enable webhook notifications, include the `hf_webhook` query parameter in your generation request with your webhook endpoint URL.

### Example Request

```bash  theme={null}
curl -X POST 'https://platform.higgsfield.ai/higgsfield-ai/soul/standard?hf_webhook=https://webhook.url/example' \
  --header 'Authorization: Key {your_api_key}:{your_api_key_secret}' \
  --header 'Content-Type: application/json' \
  --header 'Accept: application/json' \
  --data '{
    "prompt": "your prompt here",
    "aspect_ratio": "16:9",
    "resolution": "720p"
  }'
```

## Webhook Notifications

Your webhook endpoint will receive an HTTP POST request when the generation reaches a final status: `completed`, `failed`, or `nsfw`.

### Completed Status

#### Image Generation

```json  theme={null}
{
  "status": "completed",
  "request_id": "9417a243-e457-4075-895b-b68f3cda5303",
  "status_url": "https://platform.higgsfield.ai/requests/9417a243-e457-4075-895b-b68f3cda5303/status",
  "cancel_url": "https://platform.higgsfield.ai/requests/9417a243-e457-4075-895b-b68f3cda5303/cancel",
  "images": [
    {
      "url": "https://images.url/example"
    }
  ]
}
```

#### Video Generation

```json  theme={null}
{
  "status": "completed",
  "request_id": "9417a243-e457-4075-895b-b68f3cda5303",
  "status_url": "https://platform.higgsfield.ai/requests/9417a243-e457-4075-895b-b68f3cda5303/status",
  "cancel_url": "https://platform.higgsfield.ai/requests/9417a243-e457-4075-895b-b68f3cda5303/cancel",
  "video": {
    "url": "https://video.url/example"
  }
}
```

### Failed Status

```json  theme={null}
{
  "status": "failed",
  "request_id": "9417a243-e457-4075-895b-b68f3cda5303",
  "error": "Generation fail message"
}
```

### NSFW Status

```json  theme={null}
{
  "status": "nsfw",
  "request_id": "9417a243-e457-4075-895b-b68f3cda5303"
}
```

## Retry Logic

The Higgsfield API implements automatic retry logic to ensure reliable webhook delivery:

* Webhooks will be retried for up to **2 hours** after the initial delivery attempt
* Retries continue until your endpoint returns a successful response (HTTP `2xx` status code)
* If your endpoint remains unavailable or continues to return error responses after 2 hours, retry attempts will cease
* You can still retrieve the generation results by polling the `status_url` if webhook delivery fails

### Handling Retries

To minimize unnecessary retries:

* Ensure your webhook endpoint is highly available
* Return a `2xx` status code promptly upon successful receipt
* Implement idempotency using the `request_id` to handle duplicate notifications
* Log received webhooks to track delivery patterns

## Webhook Requirements

* Your webhook endpoint must accept HTTP POST requests
* Your endpoint should respond with a `2xx` status code to acknowledge receipt
* The webhook payload will be sent as JSON in the request body
* Ensure your endpoint is publicly accessible and can handle the expected request volume

## Best Practices

* Implement proper error handling for webhook deliveries
* Validate the `request_id` to ensure the notification matches your records
* Store webhook payloads for audit and debugging purposes
* Use HTTPS endpoints for secure data transmission
* Respond quickly to webhook requests (under 10 seconds) to avoid timeouts
* Implement idempotency checks to safely handle duplicate webhook deliveries during retries


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.higgsfield.ai/llms.txt

# Client Libraries

> Official SDKs and client libraries for seamless integration with Higgsfield API

Higgsfield provides official client libraries to simplify integration with our API. These libraries handle authentication, request management, and provide a developer-friendly interface for all platform features.

## Supported Languages

We currently support the following languages:

<CardGroup cols={2}>
  <Card title="Python" icon="python" href="https://pypi.org/project/higgsfield-client/">
    Full-featured SDK with sync and async support
  </Card>

  <Card title="JavaScript/TypeScript" icon="js" iconType="duotone">
    Coming soon
  </Card>
</CardGroup>

Have a specific language in mind? Let us know in our community channels, and we'll consider adding support for it in future releases.

## Python SDK

The official Python SDK for [Higgsfield AI](https://cloud.higgsfield.ai). Supports both synchronous and asynchronous usage.

### Installation

Install the Higgsfield Python client using pip:

```bash  theme={null}
pip install higgsfield-client
```

### Authentication

Before using the client, set your API credentials as environment variables. You can use either a single key or separate API key and secret:

**Option 1: Single Key**

```bash  theme={null}
export HF_KEY="your-api-key:your-api-secret"
```

**Option 2: API Key + Secret**

```bash  theme={null}
export HF_API_KEY="your-api-key"
export HF_API_SECRET="your-api-secret"
```

Get your credentials from the [Higgsfield Cloud](https://cloud.higgsfield.ai/).

### Quick Start

<CodeGroup>
  ```python sync icon="python" theme={null}
  import higgsfield_client

  # Submit and wait for result
  result = higgsfield_client.subscribe(
      'bytedance/seedream/v4/text-to-image',
      arguments={
          'prompt': 'A serene lake at sunset with mountains',
          'resolution': '2K',
          'aspect_ratio': '16:9',
          'camera_fixed': False
      }
  )

  print(result['images'][0]['url'])
  ```

  ```python async icon="python" theme={null}
  import asyncio
  import higgsfield_client

  async def main():
      # Submit and wait for result
      result = await higgsfield_client.subscribe_async(
          'bytedance/seedream/v4/text-to-image',
          arguments={
              'prompt': 'A serene lake at sunset with mountains',
              'resolution': '2K',
              'aspect_ratio': '16:9',
              'camera_fixed': False
          }
      )

      print(result['images'][0]['url'])

  asyncio.run(main())
  ```
</CodeGroup>

## Usage Patterns

### Pattern 1: Simple Submit and Wait

Submit a request and wait for the result.

<CodeGroup>
  ```python sync icon="python" theme={null}
  import higgsfield_client

  result = higgsfield_client.subscribe(
      'bytedance/seedream/v4/text-to-image',
      arguments={
          'prompt': 'A serene lake at sunset with mountains',
          'resolution': '2K',
          'aspect_ratio': '16:9',
          'camera_fixed': False
      }
  )

  print(result['images'][0]['url'])
  ```

  ```python async icon="python" theme={null}
  import asyncio
  import higgsfield_client

  async def main():
      result = await higgsfield_client.subscribe_async(
          'bytedance/seedream/v4/text-to-image',
          arguments={
              'prompt': 'A serene lake at sunset with mountains',
              'resolution': '2K',
              'aspect_ratio': '16:9',
              'camera_fixed': False
          }
      )
      
      print(result['images'][0]['url'])

  asyncio.run(main())
  ```
</CodeGroup>

### Pattern 2: Submit and Track Progress

Submit a request and monitor its status in real-time.

<CodeGroup>
  ```python sync icon="python" theme={null}
  import higgsfield_client

  request_controller = higgsfield_client.submit(
      'bytedance/seedream/v4/text-to-image',
      arguments={
          'prompt': 'Football ball',
          'resolution': '2K',
          'aspect_ratio': '16:9',
          'camera_fixed': False
      },
      webhook_url='https://example.com/webhook'  # Optional webhook
  )

  for status in request_controller.poll_request_status():
      if isinstance(status, higgsfield_client.Queued):
          print('Queued')
      elif isinstance(status, higgsfield_client.InProgress):
          print('In progress')
      elif isinstance(status, higgsfield_client.Completed):
          print('Completed')
      elif isinstance(status, (higgsfield_client.Failed, higgsfield_client.NSFW, higgsfield_client.Cancelled)):
          print('Oops!')

  result = request_controller.get()
  print(result['images'][0]['url'])
  ```

  ```python async icon="python" theme={null}
  import asyncio
  import higgsfield_client

  async def main():
      request_controller = await higgsfield_client.submit_async(
          'bytedance/seedream/v4/text-to-image',
          arguments={
              'prompt': 'Football ball',
              'resolution': '2K',
              'aspect_ratio': '16:9',
              'camera_fixed': False
          },
          webhook_url='https://example.com/webhook'
      )

      async for status in request_controller.poll_request_status():
          if isinstance(status, higgsfield_client.Queued):
              print('Queued')
          elif isinstance(status, higgsfield_client.InProgress):
              print('In progress')
          elif isinstance(status, higgsfield_client.Completed):
              print('Completed')
          elif isinstance(status, (higgsfield_client.Failed, higgsfield_client.NSFW, higgsfield_client.Cancelled)):
              print('Oops!')

      result = await request_controller.get()
      print(result['images'][0]['url'])

  asyncio.run(main())
  ```
</CodeGroup>

### Pattern 3: Submit with Callbacks

Use callbacks to handle status updates.

<CodeGroup>
  ```python sync icon="python" theme={null}
  import higgsfield_client

  def on_enqueue(request_id):
      print(f'Request {request_id} was enqueued')

  def on_status_update(status):
      print(f'Status: {status}')

  result = higgsfield_client.subscribe(
      'bytedance/seedream/v4/text-to-image',
      arguments={
          'prompt': 'A serene lake at sunset with mountains',
          'resolution': '2K',
          'aspect_ratio': '16:9',
          'camera_fixed': False
      },
      on_enqueue=on_enqueue,
      on_queue_update=on_status_update
  )
  ```

  ```python async icon="python" theme={null}
  import asyncio
  import higgsfield_client

  def on_enqueue(request_id):
      print(f'Request {request_id} was enqueued')

  def on_status_update(status):
      print(f'Status: {status}')

  async def main():
      await higgsfield_client.subscribe_async(
          'bytedance/seedream/v4/text-to-image',
          arguments={
              'prompt': 'A serene lake at sunset with mountains',
              'resolution': '2K',
              'aspect_ratio': '16:9',
              'camera_fixed': False
          },
          on_enqueue=on_enqueue,
          on_queue_update=on_status_update
      )

  asyncio.run(main())
  ```
</CodeGroup>

### Pattern 4: Manage Existing Requests

Work with request controllers to manage requests.

<CodeGroup>
  ```python sync icon="python" theme={null}
  import higgsfield_client

  request_controller = higgsfield_client.submit(
      'bytedance/seedream/v4/text-to-image',
      arguments={
          'prompt': 'A serene lake at sunset with mountains',
          'resolution': '2K',
          'aspect_ratio': '16:9',
          'camera_fixed': False
      },
      webhook_url='https://example.com/webhook'
  )

  # Check status
  status = request_controller.status()

  # Wait for completion and get result
  result = request_controller.get()

  # Cancel a queued request
  request_controller.cancel()
  ```

  ```python async icon="python" theme={null}
  import asyncio
  import higgsfield_client

  async def main():
      request_controller = await higgsfield_client.submit_async(
          'bytedance/seedream/v4/text-to-image',
          arguments={
              'prompt': 'A serene lake at sunset with mountains',
              'resolution': '2K',
              'aspect_ratio': '16:9',
              'camera_fixed': False
          },
          webhook_url='https://example.com/webhook'
      )

      # Check status
      status = await request_controller.status()

      # Wait for completion and get result
      result = await request_controller.get()

      # Cancel a queued request
      await request_controller.cancel()

  asyncio.run(main())
  ```
</CodeGroup>

## File Uploads

Upload files to use in your requests.

### Upload Bytes

<CodeGroup>
  ```python sync icon="python" theme={null}
  import higgsfield_client

  image_path = 'path/to/example.jpeg'
  content_type = 'image/jpeg'

  with open(image_path, 'rb') as f:
      data = f.read()

  url = higgsfield_client.upload(data, content_type)

  # Upload path
  image_path = 'path/to/example.jpeg'

  url = higgsfield_client.upload_file(image_path)


  # Upload PIL image

  from PIL import Image
  import higgsfield_client

  image = Image.open('example.jpeg')
  url = higgsfield_client.upload_image(image, format='jpeg')
  ```

  ```python async icon="python" theme={null}
  import higgsfield_client

  # Async raw data upload
  url = await higgsfield_client.upload_async(data, content_type='image/jpeg')

  # Async file upload
  url = await higgsfield_client.upload_file_async('path/to/example.jpeg')

  # Async image upload
  url = await higgsfield_client.upload_image_async(image, format='jpeg')
  ```
</CodeGroup>

## Requirements

* Python >= 3.8

## Resources

* **GitHub Repository**: [higgsfield-ai/higgsfield-client](https://github.com/higgsfield-ai/higgsfield-client)
* **Homepage**: [cloud.higgsfield.ai](https://cloud.higgsfield.ai)
* **Package**: [PyPI](https://pypi.org/project/higgsfield-client/)

## JavaScript/TypeScript SDK

**Coming Soon** - Our JavaScript/TypeScript SDK is currently in development and will be available soon.

The upcoming SDK will feature:

* Full TypeScript support with type definitions
* Promise-based async API
* Support for Node.js and browser environments
* Webhook utilities
* Built-in retry logic

In the meantime, you can use the [REST API directly](/how-to/introduction).

## Support

If you encounter any issues or have questions:

* Check our [API Documentation](/api-reference)
* Review the [GitHub Repository](https://github.com/higgsfield-ai/higgsfield-client)
* Contact support at [support@higgsfield.ai](mailto:support@higgsfield.ai)


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.higgsfield.ai/llms.txt
# Generate Images from Text

> Learn how to create stunning images using text prompts with Higgsfield API

The Higgsfield API enables you to generate high-quality images from text descriptions using state-of-the-art AI models. Simply provide a text prompt describing what you want to create, and our models will generate images that match your description.

## Available Models

Higgsfield offers a wide variety of text-to-image and image editing models to suit different creative needs and use cases. Popular models include:

* `higgsfield-ai/soul/standard` - Our flagship text-to-image model
* `reve/text-to-image` - Versatile text-to-image generation
* `bytedance/seedream/v4/edit` - Advanced image editing capabilities
* And many more...

To explore all available text-to-image and image editing models, visit our [Models Gallery](https://cloud.higgsfield.ai/explore).

## Quick Start

### Basic Image Generation

Here's a simple example to generate an image from a text prompt:

```bash  theme={null}
curl -X POST 'https://platform.higgsfield.ai/higgsfield-ai/soul/standard' \
  --header 'Authorization: Key {your_api_key}:{your_api_key_secret}' \
  --header 'Content-Type: application/json' \
  --header 'Accept: application/json' \
  --data '{
    "prompt": "A serene mountain landscape at sunset with vibrant orange and purple skies",
    "aspect_ratio": "16:9",
    "resolution": "720p"
  }'
```

## Best Practices

### Writing Effective Prompts

* **Be specific**: Include details about style, mood, colors, and composition
* **Use descriptive language**: "A cozy mountain cabin at sunset with warm lighting" is better than "cabin"
* **Specify artistic style**: Mention styles like "photorealistic", "watercolor", "digital art", etc.
* **Include quality modifiers**: Terms like "highly detailed", "8k", "professional" can improve results

### Example Prompts

```text  theme={null}
Good: "A professional photograph of a golden retriever puppy playing in a sunlit garden, shallow depth of field, bokeh background"

Better: "Professional pet photography of a golden retriever puppy, 3 months old, playing with a red ball in a lush green garden, golden hour lighting, shallow depth of field, Canon EOS R5, 85mm lens, bokeh background"
```

### Optimizing Generation

* Start with lower resolutions for faster iterations
* Test different aspect ratios to find what works best for your use case
* Use webhooks for production workflows to avoid polling
* Store the `request_id` to retrieve results later if needed

## Common Use Cases

* **Marketing materials**: Product images, social media content, advertisements
* **Creative projects**: Concept art, illustrations, design mockups
* **Content creation**: Blog headers, thumbnails, visual storytelling
* **Prototyping**: Quick visualization of ideas and concepts


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.higgsfield.ai/llms.txt

# Generate Videos from Images

> Learn how to transform static images into dynamic videos with Higgsfield API

The Higgsfield API enables you to transform static images into dynamic, animated videos using state-of-the-art AI models. This powerful feature is perfect for creating engaging content for social media, marketing campaigns, presentations, and more.

## Available Models

Higgsfield offers a wide variety of image-to-video models optimized for different animation styles and use cases. Popular models include:

* `higgsfield-ai/dop/preview` - High-quality image animation
* `bytedance/seedance/v1/pro/image-to-video` - Professional-grade video generation
* `kling-video/v2.1/pro/image-to-video` - Advanced cinematic animations
* And many more...

To explore all available image-to-video models, visit our [Models Gallery](https://cloud.higgsfield.ai/explore).

## Quick Start

### Basic Video Generation

Here's a simple example to generate a video from an image:

<CodeGroup>
  ```bash DoP Standard theme={null}
  curl -X POST 'https://platform.higgsfield.ai/higgsfield-ai/dop/standard' \
    --header 'Authorization: Key {your_api_key}:{your_api_key_secret}' \
    --header 'Content-Type: application/json' \
    --header 'Accept: application/json' \
    --data '{
      "image_url": "https://example.com/your-image.jpg",
      "prompt": "A stylish woman walks down a Tokyo street filled with warm glowing neon and animated city signage",
      "duration": 5
    }'
  ```

  ```bash Kling 2.1 Pro theme={null}
  # Using Kling Video v2.1 Pro
  curl -X POST 'https://platform.higgsfield.ai/kling-video/v2.1/pro/image-to-video' \
    --header 'Authorization: Key {your_api_key}:{your_api_key_secret}' \
    --header 'Content-Type: application/json' \
    --data '{
      "image_url": "https://example.com/landscape.jpg",
      "prompt": "Camera slowly pans across the landscape as clouds drift overhead"
    }'
  ```

  ```bash Seedance 1.0 Pro theme={null}
  # Using ByteDance Seedance v1 Pro
  curl -X POST 'https://platform.higgsfield.ai/bytedance/seedance/v1/pro/image-to-video' \
    --header 'Authorization: Key {your_api_key}:{your_api_key_secret}' \
    --header 'Content-Type: application/json' \
    --data '{
      "image_url": "https://example.com/portrait.jpg",
      "prompt": "Subject turns head slightly and smiles at the camera"
    }'
  ```
</CodeGroup>

## Best Practices

### Writing Effective Motion Prompts

* **Describe the movement**: Be specific about the type of motion you want (pan, zoom, rotation, etc.)
* **Set the pace**: Use words like "slowly", "quickly", "smoothly" to control animation speed
* **Specify camera movements**: Mention camera actions like "camera pans left", "zooms in", "orbits around"
* **Add atmospheric details**: Include environmental elements like "wind blowing", "water flowing", "lights flickering"

### Example Prompts

```text  theme={null}
Good: "The camera slowly pans across the scene"

Better: "Smooth cinematic camera pan from left to right, golden hour lighting, gentle wind rustling through leaves, shallow depth of field"
```

### Image Preparation Tips

* **Use high-quality source images**: Higher resolution inputs generally produce better results
* **Consider composition**: Images with clear subjects and good composition animate more effectively
* **Avoid heavy compression**: Use PNG or high-quality JPEG formats
* **Match aspect ratio**: Ensure your source image matches your desired video aspect ratio

### Optimizing Generation

* Start with shorter durations to iterate faster
* Test different models to find the best fit for your animation style
* Use webhooks for production workflows to avoid polling
* Store the `request_id` to retrieve results later if needed

## Common Use Cases

* **Social media content**: Create engaging posts and stories from static images
* **Product demonstrations**: Animate product photos to showcase features
* **Marketing campaigns**: Transform marketing visuals into dynamic video ads
* **Creative projects**: Bring artwork and illustrations to life
* **Presentations**: Add motion to slides and visual content
* **Virtual tours**: Create animated walkthroughs from photos


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.higgsfield.ai/llms.txt