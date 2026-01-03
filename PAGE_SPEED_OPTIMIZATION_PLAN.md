# Page Speed Optimization Plan

**Current Status:** 71/100  
**Target:** 85+  
**Priority:** HIGH - Direct ranking factor

## 📊 Current Analysis

### Issues Identified:

1. **Large Images** ⚠️ CRITICAL
   - `img/top10.png`: 5.9MB (HUGE - needs immediate optimization!)
   - Multiple large JPG/PNG images without WebP conversion
   - Missing width/height attributes (causes CLS)

2. **CSS Files**
   - Multiple CSS files (styles.css, pages.css, tour-page.css, updated-styles.css)
   - Inline CSS in HTML (affects initial load)
   - Need to check for minification

3. **JavaScript**
   - main.js file exists
   - Need to check if minified
   - Google Analytics script (already async - good!)

4. **Fonts**
   - Google Fonts loaded (could be optimized with font-display: swap)
   - Two font families: Inter + Poppins

5. **Other**
   - Need to check for unused CSS/JS
   - Need caching headers configuration

## 🎯 Optimization Strategy (Priority Order)

### Phase 1: Image Optimization (BIGGEST WIN) ⚡
**Expected Impact:** +10-15 points  
**Effort:** Medium  
**Time:** 2-3 hours

1. **Fix Critical Issues:**
   - ✅ Compress `img/top10.png` (5.9MB → <200KB)
   - ✅ Convert to WebP format
   - ✅ Create responsive srcset versions

2. **General Image Optimization:**
   - Audit all images >100KB
   - Convert JPG/PNG to WebP (with fallbacks)
   - Compress all images
   - Add width/height attributes to prevent CLS
   - Ensure lazy loading on below-fold images

3. **Tools to Use:**
   - ImageMagick or Pillow for compression
   - cwebp for WebP conversion
   - Or use online tools like Squoosh

### Phase 2: CSS Optimization
**Expected Impact:** +3-5 points  
**Effort:** Low-Medium  
**Time:** 1 hour

1. **Minify CSS Files:**
   - Minify styles.css, pages.css, tour-page.css, updated-styles.css
   - Create .min.css versions

2. **Combine CSS Files:**
   - Consider combining multiple CSS files into one
   - Or use CSS bundling

3. **Remove Unused CSS:**
   - Use PurgeCSS or similar tool
   - Or manually audit

4. **Critical CSS:**
   - Extract above-the-fold CSS
   - Inline critical CSS in <head>
   - Load rest asynchronously

### Phase 3: JavaScript Optimization
**Expected Impact:** +2-4 points  
**Effort:** Low  
**Time:** 30 minutes

1. **Minify JavaScript:**
   - Minify main.js
   - Create .min.js version

2. **Defer Non-Critical Scripts:**
   - Ensure scripts are deferred or at bottom
   - Check for render-blocking scripts

3. **Remove Unused Code:**
   - Audit main.js for unused functions
   - Remove dead code

### Phase 4: Font Optimization
**Expected Impact:** +1-2 points  
**Effort:** Low  
**Time:** 15 minutes

1. **Font Loading:**
   - Add `font-display: swap` to Google Fonts
   - Consider self-hosting fonts (optional)

2. **Font Subset:**
   - Use only needed font weights
   - Currently loading: 400,500,600,700,800 (could reduce)

### Phase 5: Server & Caching
**Expected Impact:** +2-3 points  
**Effort:** Medium  
**Time:** 1 hour

1. **Caching Headers:**
   - Configure Vercel caching (if using Vercel)
   - Add cache-control headers for static assets
   - Browser caching for images, CSS, JS

2. **Compression:**
   - Enable Gzip/Brotli compression
   - Vercel should handle this automatically

3. **CDN:**
   - Consider Cloudflare (free tier)
   - Or use Vercel's CDN (if already on Vercel)

## 📝 Implementation Steps

### Step 1: Image Optimization (START HERE)

1. **Fix the 5.9MB image immediately:**
   ```bash
   # Convert and compress top10.png
   # Target: <200KB
   ```

2. **Create image optimization script:**
   - Script to convert all images to WebP
   - Script to compress images
   - Script to add width/height attributes

3. **Update HTML:**
   - Ensure all images have WebP versions
   - Add width/height attributes
   - Verify lazy loading

### Step 2: CSS Minification

1. **Minify CSS files:**
   - Use cssnano or similar
   - Or online minifier

2. **Update HTML references:**
   - Change CSS links to .min.css versions

### Step 3: JS Minification

1. **Minify JavaScript:**
   - Use terser or similar
   - Or online minifier

2. **Update HTML references:**
   - Change JS links to .min.js versions

### Step 4: Font Optimization

1. **Update Google Fonts link:**
   - Add `&display=swap` parameter
   - Reduce font weights if possible

### Step 5: Configure Caching

1. **Vercel Configuration:**
   - Add headers in vercel.json
   - Configure cache-control headers

## 🎯 Success Metrics

- **Performance Score:** 71 → 85+ (target)
- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1
- **Image sizes:** All <100KB (except hero images <200KB)

## 📋 Tools Needed

- Image optimization: ImageMagick, Pillow, or online tools
- CSS minification: cssnano, or online tools
- JS minification: terser, or online tools
- Testing: Google PageSpeed Insights, GTmetrix

## ⚠️ Important Notes

- Always test after each optimization phase
- Keep original files as backups
- Test on staging before deploying
- Monitor Core Web Vitals after deployment

---

**Created:** January 2025  
**Status:** Planning Phase  
**Next Step:** Start Phase 1 - Image Optimization

