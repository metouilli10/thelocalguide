# Agadir Local Guide - Design System

This design system provides all the reusable components, styles, and patterns used across the Agadir Local Guide website. Use this as a reference when creating new tour pages to maintain consistency.

---

## Table of Contents
1. [Color System](#color-system)
2. [Typography](#typography)
3. [Spacing System](#spacing-system)
4. [Header Component](#header-component)
5. [Footer Component](#footer-component)
6. [Button System](#button-system)
7. [Card Components](#card-components)
8. [Common Patterns](#common-patterns)

---

## Color System

### Primary Colors (Brand - Terra Cotta)
```css
--primary-color: #c1564b;
--primary-600: #c1564b;
--primary-700: #c1564b;
--primary-100: #EEE9FF;  /* Light tint for backgrounds */
--primary-50: #FAF5FF;   /* Very light tint */
```

### Secondary Colors (CTA Yellow)
```css
--secondary-color: #FFD400;
--cta-yellow: #FFD400;
--cta-yellow-dark: #E6C000;
--secondary-500: #FFD400;
```

### Accent Colors (Teal - Natural Oasis)
```css
--accent-color: #14B8A6;
--accent-500: #14B8A6;
```

### Neutral Colors (Grays)
```css
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-200: #E5E7EB;
--gray-300: #D1D5DB;
--gray-400: #9CA3AF;
--gray-500: #6B7280;
--gray-600: #4B5563;
--gray-700: #374151;
--gray-800: #1F2937;
--gray-900: #111827;
```

### Semantic Colors
```css
--success: #10B981;
--warning: #F59E0B;
--error: #EF4444;
--info: #3B82F6;
```

### Background & Text
```css
--bg-white: #FFFFFF;
--bg-gray: #F8F8F8;
--text-dark: #222222;
--text-light: #555555;
--color-border: #EDEDED;
```

---

## Typography

### Font Families
```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-display: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
```

**Import (add to `<head>`):**
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@600;700;800;900&display=swap" rel="stylesheet">
```

### Heading Sizes
```css
h1 { font-size: clamp(2.5rem, 5vw, 4rem); }      /* 40px - 64px */
h2 { font-size: clamp(2rem, 4vw, 3rem); }        /* 32px - 48px */
h3 { font-size: clamp(1.5rem, 3vw, 2rem); }      /* 24px - 32px */
h4 { font-size: clamp(1.25rem, 2.5vw, 1.5rem); } /* 20px - 24px */
h5 { font-size: clamp(1.125rem, 2vw, 1.25rem); } /* 18px - 20px */
h6 { font-size: clamp(1rem, 1.5vw, 1.125rem); }  /* 16px - 18px */
```

**Usage:**
- All headings use `font-family: var(--font-display)` (Poppins)
- Body text uses `font-family: var(--font-sans)` (Inter)
- Line height for headings: `1.2`
- Line height for paragraphs: `1.7`

---

## Spacing System
Based on an 8pt grid system:

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
--space-32: 8rem;     /* 128px */
```

---

## Header Component

### Structure
The header consists of two parts:
1. **Top Bar** - Contact info and social links
2. **Main Navigation** - Logo and menu

### HTML Template
```html
<header class="site-header">
    <!-- Top Bar -->
    <div class="header-topbar">
        <div class="container">
            <div class="topbar-left">
                <a href="tel:+212123456789" class="topbar-item">
                    <svg><!-- Phone icon --></svg>
                    +212 123 456 789
                </a>
                <a href="mailto:info@agadirlocalguide.com" class="topbar-item">
                    <svg><!-- Email icon --></svg>
                    info@agadirlocalguide.com
                </a>
            </div>
            <div class="topbar-right">
                <!-- Social links -->
            </div>
        </div>
    </div>

    <!-- Main Navigation -->
    <nav class="main-nav">
        <div class="container">
            <a href="/" class="logo">
                <img src="img/logoalg.png" alt="Agadir Local Guide">
            </a>

            <ul class="nav-menu">
                <li><a href="/">Home</a></li>
                <li class="has-dropdown">
                    <a href="/agadir-tours.html">
                        Tours
                        <svg class="dropdown-icon"><!-- Chevron --></svg>
                    </a>
                    <ul class="dropdown-menu">
                        <!-- Dropdown items -->
                    </ul>
                </li>
                <li><a href="/blog.html">Blog</a></li>
                <li><a href="/contact.html">Contact</a></li>
            </ul>

            <div class="nav-actions">
                <a href="tel:+212123456789" class="btn-outline">
                    <svg><!-- Phone icon --></svg>
                    Call Now
                </a>
                <a href="/contact.html" class="btn-primary-nav">Book Now</a>
            </div>

            <!-- Mobile menu toggle -->
            <button class="mobile-menu-toggle" aria-label="Toggle menu">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
    </nav>
</header>
```

### Key Classes
- `.site-header` - Main header wrapper, fixed position
- `.site-header.scrolled` - Added via JavaScript when user scrolls
- `.header-topbar` - Top information bar
- `.main-nav` - Main navigation section
- `.nav-menu` - Navigation links list
- `.has-dropdown` - Menu item with dropdown
- `.nav-actions` - CTA buttons container

### Behavior
- Header is `position: fixed` at top
- Initially transparent with white text
- On scroll, adds `.scrolled` class:
  - White background
  - Dark text
  - Slimmer padding
  - Box shadow

### JavaScript Required
```javascript
window.addEventListener('scroll', function() {
    const header = document.querySelector('.site-header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});
```

---

## Footer Component

### Structure
The footer has three main sections:
1. **Footer Main** - Logo, links, newsletter
2. **Footer Bottom** - Copyright and legal links

### HTML Template
```html
<footer class="site-footer">
    <!-- Main Footer Section -->
    <div class="footer-main">
        <div class="container">
            <div class="footer-grid">
                <!-- Brand Column -->
                <div class="footer-column">
                    <img src="img/logoalg.png" alt="Agadir Local Guide" class="footer-logo">
                    <p>Discover the best of Agadir with local expert guides. Authentic experiences, unforgettable adventures.</p>

                    <!-- Social Links -->
                    <div class="social-links">
                        <a href="#" aria-label="Facebook">
                            <svg><!-- Facebook icon --></svg>
                        </a>
                        <a href="#" aria-label="Instagram">
                            <svg><!-- Instagram icon --></svg>
                        </a>
                        <a href="#" aria-label="Twitter">
                            <svg><!-- Twitter icon --></svg>
                        </a>
                    </div>
                </div>

                <!-- Quick Links -->
                <div class="footer-column">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/agadir-tours.html">Tours</a></li>
                        <li><a href="/blog.html">Blog</a></li>
                        <li><a href="/contact.html">Contact</a></li>
                    </ul>
                </div>

                <!-- Popular Tours -->
                <div class="footer-column">
                    <h4>Popular Tours</h4>
                    <ul>
                        <li><a href="/tours/tour-paradise-valley-agadir.html">Paradise Valley</a></li>
                        <li><a href="/tours/tour-quad-biking-agadir.html">Quad Biking</a></li>
                        <li><a href="/tours/day-trip-marrakech-from-agadir.html">Marrakech Day Trip</a></li>
                    </ul>
                </div>

                <!-- Support -->
                <div class="footer-column">
                    <h4>Support</h4>
                    <ul>
                        <li><a href="#">FAQs</a></li>
                        <li><a href="#">Booking Terms</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Cancellation Policy</a></li>
                    </ul>
                </div>

                <!-- Newsletter -->
                <div class="footer-column">
                    <h4>Newsletter</h4>
                    <div class="footer__newsletter">
                        <p class="footer__newsletter-text">Subscribe for exclusive deals and updates</p>
                        <form class="footer__newsletter-form">
                            <input type="email" placeholder="Your email" class="footer__newsletter-input">
                            <button type="submit" class="footer__newsletter-button">Subscribe</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Footer Bottom -->
    <div class="footer__bottom">
        <div class="container">
            <div class="footer__bottom-left">
                <p class="footer__copyright">© 2024 Agadir Local Guide. All rights reserved.</p>
                <div class="footer__legal-links">
                    <a href="#" class="footer__legal-link">Privacy Policy</a>
                    <span class="footer__separator">•</span>
                    <a href="#" class="footer__legal-link">Terms of Service</a>
                    <span class="footer__separator">•</span>
                    <a href="#" class="footer__legal-link">Cookie Policy</a>
                </div>
            </div>
            <div class="footer__bottom-right">
                <p class="footer__tagline">Your Adventure Starts Here</p>
            </div>
        </div>
    </div>
</footer>
```

### Key Styles
- Grid layout: 5 columns on desktop
- Responsive: 3 columns on tablet, 2 on mobile, 1 on small mobile
- Background: Gradient from light gray to white
- Border top: 1px solid gray-200

---

## Button System

### Primary Button (Yellow CTA)
**Use for:** Main actions, primary CTAs

```html
<button class="btn-primary">Book Now</button>
<a href="#" class="btn-primary">Explore Tours</a>
```

**Styles:**
- Background: `#FFC92E` (yellow)
- Color: `#111827` (dark text)
- Padding: `18px 40px`
- Border-radius: `9999px` (fully rounded)
- Font-weight: `700`
- Font-size: `18px`
- Box-shadow on hover

### Secondary Button (Outline)
**Use for:** Secondary actions, less emphasis

```html
<button class="btn-secondary">Learn More</button>
<a href="#" class="btn-secondary-large">Contact Us</a>
```

**Styles:**
- Background: `transparent`
- Color: `#c1564b` (primary color)
- Border: `2px solid #c1564b`
- Same padding and sizing as primary

### Header Navigation Buttons
**Special behavior:** Change appearance on scroll

```html
<!-- In header nav-actions -->
<a href="tel:+212123456789" class="btn-outline">
    <svg><!-- Icon --></svg>
    Call Now
</a>
<a href="/contact.html" class="btn-primary-nav">Book Now</a>
```

**Initial state (transparent header):**
- Background: `transparent`
- Border: `2px solid white`
- Color: `white`

**Scrolled state:**
- Background: `#c1564b`
- Border: `none`
- Color: `white`

### Card Buttons (Subtle)
**Use for:** Buttons inside cards

```html
<a href="#" class="trip-card__btn">View Details</a>
<a href="#" class="blog-card__link">Read More →</a>
```

**Styles:**
- Background: `#ffffff`
- Color: `#c1564b`
- Border: `1px solid rgba(0, 0, 0, 0.08)`
- Padding: `14px 28px`
- Border-radius: `9999px`
- Light box-shadow

---

## Card Components

### Tour Card
**Use for:** Displaying tour offerings

```html
<a href="/tours/tour-name.html" class="trip-card">
    <!-- Image -->
    <div class="trip-card__image-wrapper">
        <img src="img/tour.jpg" alt="Tour name" class="trip-card__image">
        <span class="trip-card__tag">Popular</span>
        <div class="trip-card__quick-view">
            <svg><!-- Eye icon --></svg>
            Quick View
        </div>
    </div>

    <!-- Content -->
    <div class="trip-card__content">
        <!-- Rating -->
        <div class="trip-card__rating">
            <div class="trip-card__stars">
                <span class="trip-card__rating-number">4.9</span>
                <span class="star">★</span>
            </div>
            <span class="trip-card__review-count">(127 reviews)</span>
        </div>

        <!-- Title -->
        <h3 class="trip-card__title">Paradise Valley Adventure</h3>

        <!-- Info -->
        <div class="trip-card__info">
            <span class="trip-card__info-item">
                <svg><!-- Clock icon --></svg>
                Full Day
            </span>
            <span class="trip-card__info-item">
                <svg><!-- Users icon --></svg>
                Max 8
            </span>
        </div>

        <!-- Description -->
        <p class="trip-card__description">
            Discover the natural beauty of Paradise Valley with swimming, hiking, and more.
        </p>

        <!-- Footer -->
        <div class="trip-card__footer">
            <div class="trip-card__price-wrapper">
                <span class="trip-card__price-label">From</span>
                <div class="trip-card__price">
                    €45<span class="trip-card__price-unit">/person</span>
                </div>
            </div>
            <div class="trip-card__cta">
                <button class="trip-card__btn">Book Now</button>
            </div>
        </div>
    </div>
</a>
```

**Grid Layout:**
```css
.trip-cards-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 54px 24px;
}

/* Responsive */
@media (max-width: 1024px) {
    .trip-cards-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 768px) {
    .trip-cards-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 480px) {
    .trip-cards-grid { grid-template-columns: 1fr; }
}
```

### Blog Card
**Use for:** Blog post previews

```html
<a href="/blog/article.html" class="blog-card">
    <!-- Image -->
    <div class="blog-card__image-wrapper">
        <img src="img/blog.jpg" alt="Article title" class="blog-card__image">
        <span class="blog-card__category">Travel Tips</span>
    </div>

    <!-- Content -->
    <div class="blog-card__content">
        <div class="blog-card__meta">
            <span class="blog-card__date">Dec 8, 2024</span>
            <span class="blog-card__read-time">5 min read</span>
        </div>

        <h3 class="blog-card__title">Best Things to Do in Agadir</h3>

        <p class="blog-card__excerpt">
            Discover the top attractions and hidden gems in Agadir with our comprehensive guide.
        </p>

        <a href="/blog/article.html" class="blog-card__link">
            Read More →
        </a>
    </div>
</a>
```

### Trust Badge
**Use for:** Displaying key benefits/features

```html
<div class="trust-badge">
    <div class="trust-badge__icon">
        <svg><!-- Icon --></svg>
    </div>
    <div class="trust-badge__content">
        <div class="trust-badge__title">Free Cancellation</div>
        <div class="trust-badge__subtitle">Up to 24h before</div>
    </div>
</div>
```

---

## Common Patterns

### Section Wrapper
Standard container for page sections:

```html
<section class="section-name">
    <div class="section-name__wrapper">
        <div class="section-name__header">
            <h2 class="section-name__title">Section Title</h2>
            <p class="section-name__subtitle">Subtitle text</p>
        </div>
        <!-- Section content -->
    </div>
</section>
```

**Spacing:**
- Section padding: `80px 40px` (desktop), `60px 20px` (mobile)
- Max-width: `1360px`
- Centered with `margin: 0 auto`

### Scroll Animations
Add fade-in effects to elements:

```html
<div class="fade-in-up">
    <!-- Content -->
</div>
```

**JavaScript:**
```javascript
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));
```

### Container Widths
```css
.container {
    max-width: 1360px;
    margin: 0 auto;
    padding: 0 40px;
}

@media (max-width: 768px) {
    .container {
        padding: 0 20px;
    }
}
```

### Responsive Breakpoints
```css
/* Mobile */
@media (max-width: 480px) { }

/* Tablet */
@media (max-width: 768px) { }

/* Desktop small */
@media (max-width: 1024px) { }

/* Desktop large */
@media (min-width: 1200px) { }
```

---

## Quick Start Checklist for New Tour Pages

When creating a new tour page, include:

✅ **Head Section:**
- [ ] Google Fonts (Inter + Poppins)
- [ ] Meta tags (description, keywords, OG tags)
- [ ] Favicon
- [ ] Google Analytics

✅ **Header:**
- [ ] Copy header HTML from template
- [ ] Update active navigation state
- [ ] Include scroll behavior JavaScript

✅ **Footer:**
- [ ] Copy footer HTML from template
- [ ] Update current year in copyright

✅ **Colors & Styles:**
- [ ] Use CSS variables from color system
- [ ] Primary color: `#c1564b`
- [ ] CTA color: `#FFD400`

✅ **Components:**
- [ ] Use button classes consistently
- [ ] Apply card layouts for content
- [ ] Add scroll animations where appropriate

✅ **Responsive:**
- [ ] Test on mobile (< 768px)
- [ ] Test on tablet (768px - 1024px)
- [ ] Test on desktop (> 1024px)

---

## File References

- **Logo:** `img/logoalg.png`
- **Primary Font:** Inter (body text)
- **Display Font:** Poppins (headings)
- **Container Max-Width:** `1360px`
- **Primary Padding:** `40px` (desktop), `20px` (mobile)

---

## Support

For questions or updates to this design system, contact the development team or reference the main `index.html` file for implementation examples.
