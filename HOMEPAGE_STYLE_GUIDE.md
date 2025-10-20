# The Local Guide Morocco - Homepage Style Guide

**Version:** 1.0  
**Last Updated:** October 2025  
**Purpose:** Design system reference for maintaining visual consistency across all website pages

---

## 📐 Table of Contents

1. [Color Palette](#color-palette)
2. [Typography](#typography)
3. [Buttons & CTAs](#buttons--ctas)
4. [Header & Navigation](#header--navigation)
5. [Footer](#footer)
6. [Spacing & Layout](#spacing--layout)
7. [Components](#components)
8. [Responsive Breakpoints](#responsive-breakpoints)

---

## 🎨 Color Palette

### Primary Colors

| Color Name | Hex Code | Usage | Example |
|------------|----------|-------|---------|
| **Brand Yellow** | `#cdff03` | Primary buttons, hero title, accent highlights | Buttons, CTAs |
| **Brand Yellow Hover** | `#b8e600` | Button hover states | Interactive elements |
| **Discount Yellow** | `#ccff02` | Hero title, promotional text | Special offers, emphasis |
| **Purple Accent** | `#8B5CF6` | WhatsApp button, promotional banner | Secondary CTAs |
| **Purple Dark** | `#7C3AED` | Gradient backgrounds | Banner gradients |

### Text Colors

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **Text Dark** | `#1F2937` | Primary text, headings |
| **Text Black** | `#000000` | Logo, navigation links, button text |
| **Text Light Gray** | `#6B7280` | Secondary text, descriptions |
| **Text Muted** | `#666666` | Footer links, subtle text |

### Background Colors

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **White** | `#FFFFFF` | Main background, cards, footer |
| **Light Gray** | `#F9FAFB` | Section backgrounds |
| **Light Border** | `#e5e5e5` | Footer border, dividers |

### Overlay & Shadows

| Property | Value | Usage |
|----------|-------|-------|
| **Hero Overlay** | `linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%)` | Hero section background overlay |
| **Card Shadow** | `0 8px 32px rgba(0,0,0,0.12)` | Promotional banner, cards |

---

## 📝 Typography

### Font Families

```css
/* Primary Font */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* Alternative Font (if Inter not available) */
font-family: 'Lato', 'Helvetica Neue', Arial, sans-serif;
```

### Font Sizes & Weights

#### Headings

| Element | Font Size | Font Weight | Line Height | Additional Styles |
|---------|-----------|-------------|-------------|-------------------|
| **Hero Title (H1)** | `64px` | `900` | `0.9` | `uppercase`, `letter-spacing: -0.02em`, `font-stretch: condensed`, `color: #ccff02` |
| **Hero Subtitle** | `24px` | `400` | `1.6` | `opacity: 0.9` |
| **Section Headings (H2)** | `36px` | `700-800` | `1.2` | `color: #1F2937` |
| **Card Titles (H3)** | `20-24px` | `700` | `1.3` | `color: #1F2937` |

#### Body Text

| Element | Font Size | Font Weight | Line Height |
|---------|-----------|-------------|-------------|
| **Body Text** | `16px` | `400` | `1.6` |
| **Small Text** | `14px` | `400-500` | `1.5` |
| **Card Descriptions** | `15px` | `400` | `1.5` |

#### Navigation & UI

| Element | Font Size | Font Weight | Additional Styles |
|---------|-----------|-------------|-------------------|
| **Logo** | `18px` | `700` | `color: #000000` |
| **Nav Links** | `14px` | `700` | `uppercase`, `color: #000000` |
| **Topbar Text** | `14px` | `500` | `color: #000000` |
| **Button Text** | `14-16px` | `700` | `uppercase` (for primary buttons) |

---

## 🔘 Buttons & CTAs

### Primary Button (Yellow)

```css
.btn-primary {
    background: #cdff03;
    color: #000000;
    font-weight: 700;
    padding: 12px 24px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-primary:hover {
    background: #b8e600;
    color: #000000;
    transform: translateY(-1px);
}
```

### WhatsApp Button (Purple)

```css
.btn-whatsapp {
    background: #8449f2;
    color: #ffffff;
    font-weight: 700;
    padding: 12px 24px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-whatsapp:hover {
    background: #7339d9;
    color: #ffffff;
    transform: translateY(-1px);
}
```

### Secondary Button (Outline)

```css
.btn-outline {
    background: transparent;
    color: #000000;
    font-weight: 700;
    padding: 12px 24px;
    border: 2px solid #cdff03;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-outline:hover {
    background: #cdff03;
    color: #000000;
    border-color: #cdff03;
}
```

### Button Sizing

| Size | Padding | Font Size |
|------|---------|-----------|
| **Small** | `8px 16px` | `13px` |
| **Medium (Default)** | `12px 24px` | `14px` |
| **Large** | `16px 32px` | `16px` |

---

## 🧭 Header & Navigation

### Topbar (Hidden by CSS)

```css
.topbar {
    display: none !important; /* Hidden on all pages */
    background: #ccff02;
    color: #000000;
    padding: 8px 0;
}
```

**Note:** The topbar is present in HTML but hidden via CSS. Keep it in the markup for potential future use.

### Header

```css
.header {
    background: #ffffff;
    padding: 16px 0;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
```

**Structure:**
- Logo: 18px, bold (700), black (#000000)
- Navigation Links: 14px, bold (700), uppercase, black (#000000)
- Actions: WhatsApp button + Book Now button

### Navigation Link States

```css
/* Default */
color: #000000;
font-weight: 700;
text-transform: uppercase;

/* Hover */
color: #8B5CF6; /* Purple accent */
transition: color 0.3s ease;
```

---

## 🦶 Footer

### Footer Design Specs

**Background:** White (`#ffffff`)  
**Border Top:** `1px solid #e5e5e5`  
**Padding:** `60px 0 20px`

### Footer Typography

| Element | Font Size | Color | Font Weight |
|---------|-----------|-------|-------------|
| **Column Titles** | `16px` | `#000000` | `700`, `uppercase`, `letter-spacing: 0.5px` |
| **Links** | `14px` | `#666666` | `400` |
| **Links Hover** | `14px` | `#000000` | `400` |
| **Copyright** | `14px` | `#666666` | `400` |
| **Legal Links** | `13px` | `#666666` | `400` |

### Footer Structure

**5-Column Grid Layout:**
1. Popular Tours
2. Day Trips
3. About Us
4. Helpful Info
5. Connect With Us (Newsletter)

**Newsletter Button:**
- Background: `#cdff03`
- Color: `#000000`
- Font Weight: `600`
- Padding: `10px 16px`

---

## 📏 Spacing & Layout

### Container Widths

| Element | Max Width | Padding |
|---------|-----------|---------|
| **Main Container** | `1360px` | `0 40px` |
| **Content Container** | `1200px` | `0 20px` |
| **Footer Container** | `1200px` | `0 20px` |

### Section Spacing

| Section | Padding |
|---------|---------|
| **Section Top/Bottom** | `80px 40px` |
| **Hero Section** | `Height: 600px` |
| **Footer** | `60px 0 20px` |

### Element Spacing

| Element | Value |
|---------|-------|
| **Gap between items** | `16px - 24px` |
| **Card margins** | `20px - 30px` |
| **Column gaps** | `40px` |

---

## 🎯 Components

### Promotional Banner

**Layout:** 2-column grid (50/50 split)  
**Border Radius:** `16px`  
**Box Shadow:** `0 8px 32px rgba(0,0,0,0.12)`

**Left Side (Purple):**
- Background: `linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)`
- Text: White
- Discount Number: `120px`, `900 weight`, `#cdff03`
- "OFF" Text: `48px`, `900 weight`, `#cdff03`

**Right Side (White):**
- Background: `#ffffff`
- Border Left: `4px solid #8B5CF6`
- Title: `36px`, `900 weight`, `#1F2937`
- Body Text: `16px`, `#6B7280`
- Strong Text: `#8B5CF6`, `700 weight`

### Tour Cards

```css
.tour-card {
    background: #ffffff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 16px rgba(0,0,0,0.08);
    transition: all 0.3s ease;
}

.tour-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}
```

**Card Elements:**
- **Image:** Full width, `aspect-ratio: 16/9`
- **Title:** `20px`, `700 weight`, `#1F2937`
- **Description:** `15px`, `#6B7280`
- **Price:** `24px`, `700 weight`, `#1a4d2e`
- **Badges:** `12px`, `600 weight`, rounded corners

---

## 📱 Responsive Breakpoints

### Media Queries

```css
/* Desktop Large */
@media (min-width: 1440px) {
    /* Full desktop experience */
}

/* Desktop */
@media (max-width: 1280px) {
    /* Standard desktop */
}

/* Tablet */
@media (max-width: 1024px) {
    /* Tablet landscape/portrait */
    .tour-content-wrapper {
        grid-template-columns: 1fr;
    }
}

/* Mobile Large */
@media (max-width: 768px) {
    /* Mobile landscape and smaller tablets */
    .hero__title {
        font-size: 36px;
    }
    
    .header__nav {
        display: none; /* Show hamburger menu */
    }
    
    .footer__top {
        grid-template-columns: repeat(2, 1fr);
    }
}

/* Mobile Small */
@media (max-width: 480px) {
    /* Mobile portrait */
    .hero__title {
        font-size: 28px;
    }
    
    .footer__top {
        grid-template-columns: 1fr;
    }
}
```

---

## 🎨 Design Tokens

### Border Radius

| Element | Border Radius |
|---------|--------------|
| **Buttons** | `6px` |
| **Cards** | `12px` |
| **Large Cards** | `16px` |
| **Input Fields** | `6px` |
| **Badges** | `20px` |

### Shadows

| Element | Box Shadow |
|---------|------------|
| **Header** | `0 2px 8px rgba(0,0,0,0.08)` |
| **Cards** | `0 4px 16px rgba(0,0,0,0.08)` |
| **Cards Hover** | `0 8px 24px rgba(0,0,0,0.12)` |
| **Banner** | `0 8px 32px rgba(0,0,0,0.12)` |

### Transitions

```css
/* Standard Transition */
transition: all 0.3s ease;

/* Hover Transform */
transform: translateY(-1px); /* Buttons */
transform: translateY(-4px); /* Cards */
```

---

## 🖼️ Hero Section

### Specifications

```css
.hero {
    height: 600px;
    background: url('img/ouarzazate.jpg') center/cover no-repeat;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Dark overlay for text readability */
.hero::before {
    background: linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%);
}
```

### Hero Content

**Title:**
- Font Size: `64px`
- Font Weight: `900`
- Color: `#ccff02` (Brand Yellow)
- Line Height: `0.9`
- Letter Spacing: `-0.02em`
- Text Transform: `uppercase`
- Font Stretch: `condensed`

**Subtitle:**
- Font Size: `24px`
- Color: White
- Opacity: `0.9`
- Margin Bottom: `32px`

**CTA Button:**
- Background: `#cdff03`
- Text: `#000000`, `700 weight`
- Padding: `12px 24px`
- Border Radius: `6px`

---

## 📋 Component Patterns

### Newsletter Form

```css
.footer__newsletter-input {
    padding: 10px 12px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 6px;
    background: #ffffff;
    font-size: 14px;
}

.footer__newsletter-button {
    padding: 10px 16px;
    background: #cdff03;
    color: #000000;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
}
```

### Badges

```css
.badge {
    background: #f0f0f0;
    padding: 8px 15px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
    color: #333;
}

.badge.featured {
    background: #1a4d2e;
    color: white;
}
```

---

## 🔄 Interactive States

### Hover Effects

**Buttons:**
```css
/* Default → Hover */
background: #cdff03 → #b8e600
transform: none → translateY(-1px)
box-shadow: none → 0 4px 12px rgba(205, 255, 3, 0.3)
```

**Links:**
```css
/* Default → Hover */
color: #666666 → #000000
opacity: 1 → 0.8
```

**Cards:**
```css
/* Default → Hover */
transform: none → translateY(-4px)
box-shadow: 0 4px 16px rgba(0,0,0,0.08) → 0 8px 24px rgba(0,0,0,0.12)
```

---

## 📐 Grid Layouts

### Footer Grid

```css
.footer__top {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 40px;
}

/* Responsive */
@media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
}

@media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 25px;
}
```

### Tour Cards Grid

```css
.tours-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 24px;
}
```

---

## 🚫 Elements to Hide

### CSS Overrides

```css
/* WhatsApp Widget - Hidden */
.whatsapp-widget {
    display: none !important;
}

/* Topbar - Hidden */
.topbar {
    display: none !important;
}

/* Floating Social Icons - Hidden */
.floating-social {
    display: none !important;
}
```

---

## 🎯 Brand Guidelines

### Do's ✅

- ✅ Use yellow (`#cdff03`) for all primary CTAs
- ✅ Use black (`#000000`) text on yellow buttons
- ✅ Keep navigation links bold and uppercase
- ✅ Use white footer background
- ✅ Maintain consistent spacing (40px gaps for columns)
- ✅ Apply hover effects with subtle transforms
- ✅ Use clean, modern sans-serif fonts (Inter/Lato)
- ✅ Keep WhatsApp button purple (`#8449f2`)

### Don'ts ❌

- ❌ Don't use green gradients in footer (use white)
- ❌ Don't show social media icons in footer
- ❌ Don't display floating WhatsApp/social widgets
- ❌ Don't show the green topbar (keep hidden)
- ❌ Don't use light text on light backgrounds
- ❌ Don't mix different button styles on same page
- ❌ Don't use multiple brand colors simultaneously

---

## 📸 Image Guidelines

### Hero Section

**Dimensions:** Minimum `1920x1080px`  
**Format:** JPG or WebP  
**Overlay:** Dark gradient for text readability  
**Current Image:** `img/ouarzazate.jpg`

### Tour Card Images

**Aspect Ratio:** `16:9` or `4:3`  
**Minimum Width:** `640px`  
**Format:** JPG (optimized)

### Image Placement

```
/img/
  ├── ouarzazate.jpg (Hero background)
  ├── morocco-*.jpg (Various tour images)
  └── [tour-specific-images].jpg
```

---

## 📊 Accessibility

### Color Contrast

- ✅ **Yellow buttons with black text:** WCAG AA compliant
- ✅ **White footer with gray text:** WCAG AA compliant
- ✅ **Hero title (yellow on dark):** WCAG AAA compliant

### Interactive Elements

- All buttons have `:hover` states
- All links have visible hover effects
- Focus states inherit hover styles
- Minimum touch target: `44px × 44px`

---

## 🔧 Quick Reference CSS Variables

```css
:root {
    /* Brand Colors */
    --brand-yellow: #cdff03;
    --brand-yellow-hover: #b8e600;
    --brand-purple: #8B5CF6;
    --whatsapp-purple: #8449f2;
    
    /* Text Colors */
    --text-black: #000000;
    --text-dark: #1F2937;
    --text-gray: #666666;
    --text-light-gray: #6B7280;
    
    /* Background Colors */
    --bg-white: #FFFFFF;
    --bg-light: #F9FAFB;
    
    /* Spacing */
    --container-width: 1360px;
    --section-padding: 80px 40px;
    --gap-small: 16px;
    --gap-medium: 24px;
    --gap-large: 40px;
    
    /* Borders */
    --border-radius: 6px;
    --border-radius-large: 12px;
    --border-color: #e5e5e5;
}
```

---

## 📦 Reusable Component Classes

### Container

```css
.container {
    max-width: 1360px;
    margin: 0 auto;
    padding: 0 40px;
}
```

### Section

```css
.section {
    padding: 80px 40px;
}
```

### Grid

```css
.grid-2 { grid-template-columns: repeat(2, 1fr); }
.grid-3 { grid-template-columns: repeat(3, 1fr); }
.grid-4 { grid-template-columns: repeat(4, 1fr); }
.grid-auto { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
```

### Gaps

```css
.gap-sm { gap: 16px; }
.gap-md { gap: 24px; }
.gap-lg { gap: 40px; }
```

---

## 🎨 Usage Examples

### Example: Creating a New Button

```html
<!-- Primary CTA -->
<a href="contact.html" class="btn btn-primary">Book Now</a>

<!-- WhatsApp Button -->
<a href="https://wa.me/212636372101" class="btn btn-whatsapp">WhatsApp Us</a>

<!-- Outline Button -->
<a href="tours.html" class="btn btn-outline">View All Tours</a>
```

### Example: Footer Implementation

```html
<footer class="footer">
    <div class="footer__wrapper">
        <div class="footer__top">
            <div class="footer__column">
                <h4 class="footer__title">Column Title</h4>
                <ul class="footer__links">
                    <li><a href="#" class="footer__link">Link</a></li>
                </ul>
            </div>
        </div>
        <div class="footer__bottom">
            <!-- Copyright and legal links -->
        </div>
    </div>
</footer>
```

---

## 📝 Notes

1. **Font Loading:** Ensure Inter or Lato font is loaded via Google Fonts
2. **Images:** All hero images should be placed in `/img/` directory
3. **Consistency:** All pages should use identical header and footer templates
4. **Mobile First:** Design for mobile, enhance for desktop
5. **Performance:** Optimize images (compress, use WebP when possible)

---

## 🔗 Related Files

- **Header Template:** `/templates/header-template.html`
- **Footer Template:** `/templates/footer-template.html`
- **Main CSS:** `/css/styles.css`
- **Homepage:** `/index.html`

---

**For questions or updates to this style guide, contact the development team.**

*Last updated: October 2025*

