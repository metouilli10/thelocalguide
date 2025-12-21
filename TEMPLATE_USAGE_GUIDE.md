# Tour Page Template - Usage Guide

This guide will help you create new tour pages using the `TOUR_PAGE_TEMPLATE.html` template.

## Quick Start

1. **Copy the template file** to create a new tour page:
   ```bash
   cp TOUR_PAGE_TEMPLATE.html your-tour-name.html
   ```

2. **Search and replace** all placeholder text (marked with `[PLACEHOLDER_NAME]`) with your tour-specific content.

3. **Update images** by replacing image URLs with your tour photos.

## Template Placeholders

### 1. Meta Tags (Head Section)
- `[TOUR_NAME]` - Tour title for `<title>` tag
- `[TOUR_DESCRIPTION]` - SEO meta description
- `[TOUR_KEYWORDS]` - SEO keywords (comma-separated)
- `[TOUR_SLUG]` - URL slug (e.g., "paradise-valley")

### 2. Breadcrumbs
- `[TOUR_NAME]` - Final breadcrumb text

### 3. Hero Slider Images
- `[HERO_IMAGE_1_URL]` - First slider image URL
- `[HERO_IMAGE_1_ALT]` - Alt text for first image
- `[HERO_IMAGE_2_URL]` - Second slider image URL
- `[HERO_IMAGE_2_ALT]` - Alt text for second image
- `[HERO_IMAGE_3_URL]` - Third slider image URL
- `[HERO_IMAGE_3_ALT]` - Alt text for third image

**Note:** Add more slides if needed and update the dot count accordingly.

### 4. Tour Title Section
- `[TOUR_TITLE]` - Main tour title (h1)
- `[TOUR_SUBTITLE]` - Tour subtitle/description
- `[TOUR_DURATION]` - Duration (e.g., "4-5 hours")
- `[TOUR_GROUP_SIZE]` - Group size (e.g., "Small Group", "Private Tour")
- `[TOUR_CANCELLATION]` - Cancellation policy (e.g., "Free Cancellation")
- `[TOUR_RATING]` - Rating score (e.g., "4.8")
- `[TOUR_REVIEWS]` - Number of reviews (e.g., "1,234")

### 5. Overview Section
- `[TOUR_OVERVIEW_PARAGRAPH_1]` - First paragraph of tour description
- `[TOUR_OVERVIEW_PARAGRAPH_2]` - Second paragraph of tour description

**Feature Badges:** The three feature badges (Free Hotel Pick-Up, Small Group, Instant Confirmation) can be customized or kept as-is.

### 6. Highlights Section
- `[HIGHLIGHT_1]` through `[HIGHLIGHT_6]` - Tour highlights

**Note:** Copy the `highlight-item` div block to add more highlights.

### 7. Itinerary Section
- `[ITINERARY_INTRODUCTION]` - Introduction paragraph for the itinerary

For each itinerary step:
- `[ITINERARY_IMAGE_X_URL]` - Image URL for step X
- `[ITINERARY_IMAGE_X_ALT]` - Alt text for step X image
- `[ITINERARY_STEP_X_TITLE]` - Title of step X
- `[ITINERARY_STEP_X_DESCRIPTION]` - Description of step X
- `[ITINERARY_STEP_X_DURATION]` - Duration of step X
- `[ITINERARY_STEP_X_INCLUDED]` - What's included in step X

**Note:** Copy the `itinerary-timeline-item` block to add more steps. Update the timeline number accordingly.

### 8. What's Included Section
- `[INCLUDED_ITEM_1]` through `[INCLUDED_ITEM_4]` - What's included in the tour
- `[NOT_INCLUDED_ITEM_1]` through `[NOT_INCLUDED_ITEM_2]` - What's not included

**Note:** Copy the `included-item` div blocks to add more items.

### 9. Important Information Section
- `[WHAT_TO_BRING_1]` through `[WHAT_TO_BRING_4]` - Items guests should bring
- `[HEALTH_SAFETY_1]` through `[HEALTH_SAFETY_3]` - Health & safety information
- `[IMPORTANT_NOTE_1]` through `[IMPORTANT_NOTE_3]` - Important notes

### 10. FAQ Section
- `[FAQ_QUESTION_1]`, `[FAQ_QUESTION_2]` - FAQ questions
- `[FAQ_ANSWER_1]`, `[FAQ_ANSWER_2]` - FAQ answers

**Note:** Copy the `faq-item` block to add more FAQs.

### 11. Reviews Section
- `[REVIEW_SCORE]` - Overall rating score (e.g., "4.8")
- `[REVIEW_COUNT]` - Total number of reviews (e.g., "1,234")

For each review:
- `[REVIEW_X_INITIALS]` - Reviewer's initials (for avatar)
- `[REVIEW_X_NAME]` - Reviewer's name
- `[REVIEW_X_STARS]` - Star rating (e.g., "★★★★★")
- `[REVIEW_X_TEXT]` - Review text

**Note:** Copy the `review-card` block to add more reviews.

### 12. Booking Card
- `[TOUR_PRICE]` - Price per person (e.g., "€30")

### 13. Related Tours Section
For each related tour:
- `[RELATED_TOUR_X_LINK]` - Link to related tour page
- `[RELATED_TOUR_X_IMAGE]` - Image URL
- `[RELATED_TOUR_X_ALT]` - Alt text for image
- `[RELATED_TOUR_X_BADGE]` - Badge text (e.g., "Popular", "Best Seller", "New")
- `[RELATED_TOUR_X_TITLE]` - Tour title
- `[RELATED_TOUR_X_SUBTITLE]` - Tour subtitle
- `[RELATED_TOUR_X_DURATION]` - Tour duration
- `[RELATED_TOUR_X_PRICE]` - Tour price

**Note:** Copy the `tour-card` block to add more related tours.

## Step-by-Step Process

1. **Create a new file** from the template
2. **Start with meta tags** - Update title, description, keywords, and URL slug
3. **Update breadcrumbs** - Change the final breadcrumb to your tour name
4. **Replace hero images** - Add 3-5 high-quality images of your tour
5. **Fill in tour details** - Title, subtitle, duration, rating, etc.
6. **Write overview** - 2-3 paragraphs describing the tour
7. **List highlights** - 6-8 key highlights of the tour
8. **Create itinerary** - Add timeline steps with images and descriptions
9. **Specify inclusions** - What's included and not included
10. **Add important info** - What to bring, health & safety, important notes
11. **Write FAQs** - Common questions and answers
12. **Add reviews** - Customer reviews (if available)
13. **Set price** - Update booking card price
14. **Link related tours** - Add 3-4 related tour cards

## Tips

- **Use consistent naming** - Keep placeholder names consistent for easier find/replace
- **Image optimization** - Use optimized images (WebP format recommended, max 400KB per image)
- **SEO optimization** - Fill in all meta tags with relevant keywords
- **Mobile testing** - Test the page on mobile devices after customization
- **Proofread** - Check all text for typos and grammar errors

## Example: Creating "Atlas Mountains Day Trip"

1. Copy template: `cp TOUR_PAGE_TEMPLATE.html atlas-mountains.html`
2. Search and replace:
   - `[TOUR_NAME]` → `Atlas Mountains Day Trip`
   - `[TOUR_SLUG]` → `atlas-mountains`
   - `[TOUR_TITLE]` → `Atlas Mountains Day Trip`
   - `[TOUR_DURATION]` → `Full day`
   - `[TOUR_PRICE]` → `€65`
   - Continue with all other placeholders...

## Support

If you need help customizing the template, refer to the comments in the HTML file which mark each section with `<!-- TEMPLATE: ... -->` comments explaining what needs to be customized.





