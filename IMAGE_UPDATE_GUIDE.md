# 🎨 Image Update Guide - Quick Start
**The Local Guide - Agadir Tours**

---

## ✅ You Now Have 4 Resources:

1. **IMAGE_AUDIT_REPORT.md** - Executive summary & recommendations
2. **IMAGE_DETAILED_REFERENCE.md** - Complete file-by-file breakdown
3. **image_inventory.csv** - Spreadsheet for Excel/Google Sheets tracking
4. **update_images_helper.sh** - Automated helper tool (this directory)

---

## 🚀 Quick Start - 3 Simple Steps

### Step 1: Backup Current Images
```bash
cd miracleair-clone
./update_images_helper.sh backup
```
Or manually:
```bash
zip -r img_backup.zip img/
```

### Step 2: Replace Images
**Option A: Same Filenames (Easiest)**
- Rename your new images to match existing names exactly
- Simply drag & drop into `/img/` folder
- Overwrite when prompted
- Done! ✅

**Option B: Different Filenames**
- Use Find & Replace in VS Code (Cmd+Shift+H)
- Find: `img/old-name.jpg`
- Replace: `img/new-name.jpg`
- Click "Replace All"

### Step 3: Test & Verify
```bash
./update_images_helper.sh validate
```
Or manually open a few pages in your browser and check

---

## 📊 Key Stats from Audit

| Metric | Value |
|--------|-------|
| Total Images | 17 files in `/img/` |
| Missing Images | 6 files referenced but not uploaded |
| HTML Pages | 33 pages using images |
| Total References | 275 image uses |
| Most Used Image | morocco-coastal-2.jpg (32 uses) |

---

## 🎯 Priority Images to Update

### CRITICAL (Update First) - 7 images
These have 20+ uses each and maximum impact:

1. ✅ **viator.png** (33 uses) - Footer logo
2. ✅ **tripadvisor.png** (33 uses) - Footer logo  
3. ✅ **morocco-coastal-2.jpg** (32 uses) - Coastal tours
4. ✅ **morocco-week-3.jpg** (26 uses) - General tours
5. ✅ **morocco-horizon-4.jpg** (25 uses) - Landscapes
6. ✅ **morocco-market.jpg** (20 uses) - Market tours
7. ✅ **morocco-heritage-1.jpg** (20 uses) - Heritage sites

**Impact:** Updating these 7 images = 189 references updated (69% of all images!)

### HIGH Priority - 4 images
8. ✅ **paradise-valley.jpg** (17 uses)
9. ✅ **berber-village.jpg** (14 uses)
10. ✅ **quad-biking.jpg** (12 uses)
11. ✅ **morocco-collage.jpg** (11 uses)

### MEDIUM Priority - 2 images
12. ✅ **camel-ride-sunset.jpg** (9 uses)
13. ✅ **horse-2.jpg** (6 uses)

### LOW Priority - 2 images
14. ✅ **ranch-tamri.jpg** (4 uses)
15. ✅ **quad-biking.webp** (4 uses)

---

## ⚠️ Missing Images to Upload

These are referenced in code but don't exist yet:

- [ ] **surf-2.jpg** - For surf lesson pages
- [ ] **morocco-food-1.jpg** - For cooking class pages
- [ ] **souss-massa-flamingos.jpg** - For Souss Massa park
- [ ] **author-1.jpg** - Author profile (400x400px)
- [ ] **author-2.jpg** - Author profile (400x400px)
- [ ] **author-3.jpg** - Author profile (400x400px)

---

## 💡 Recommended Image Specs

### Tour Images (Main)
- **Dimensions:** 1200 x 800 pixels (3:2 ratio)
- **Format:** JPG (or WebP for optimized version)
- **File Size:** <150KB (use compression)
- **Quality:** High enough for retina displays

### Hero/Background Images
- **Dimensions:** 1920 x 1080 pixels (16:9 ratio)
- **Format:** JPG
- **File Size:** <200KB
- **Examples:** morocco-collage.jpg

### Partner Logos
- **Dimensions:** ~200 x 100 pixels
- **Format:** PNG with transparent background
- **File Size:** <50KB
- **Examples:** viator.png, tripadvisor.png

### Author Profiles
- **Dimensions:** 400 x 400 pixels (square)
- **Format:** JPG
- **File Size:** <50KB

---

## 🔧 Using the Helper Tool

### Interactive Mode
```bash
cd miracleair-clone
./update_images_helper.sh
```
Then choose from menu:
- [1] Show current images
- [2] Check for missing images
- [3] Backup images folder
- [4] Check image file sizes
- [5] Show usage statistics
- [6] Find where an image is used
- [7] Validate all references
- [8] Run all checks

### Command Line Mode
```bash
# Backup images
./update_images_helper.sh backup

# Check for missing
./update_images_helper.sh check

# List all images
./update_images_helper.sh list

# Check file sizes
./update_images_helper.sh sizes

# Show stats
./update_images_helper.sh stats

# Find usage
./update_images_helper.sh find paradise-valley.jpg

# Validate references
./update_images_helper.sh validate
```

---

## 📝 Update Workflow Example

**Scenario:** You want to update the Paradise Valley tour images

1. **Check current usage:**
   ```bash
   ./update_images_helper.sh find paradise-valley.jpg
   ```
   
2. **Backup:**
   ```bash
   ./update_images_helper.sh backup
   ```

3. **Prepare new image:**
   - Resize to 1200x800px
   - Optimize to <150KB
   - Name it: `paradise-valley.jpg`

4. **Replace:**
   - Drag to `/img/` folder
   - Overwrite existing file

5. **Test:**
   - Open `tour-paradise-valley-agadir.html` in browser
   - Hard refresh (Cmd+Shift+R)
   - Check mobile view

6. **Validate:**
   ```bash
   ./update_images_helper.sh validate
   ```

✅ Done! Your image is updated across 17 pages!

---

## 🎨 Batch Update Strategy

### Approach 1: By Category (Recommended)
Update related images together for consistency:

**Week 1: Nature Images**
- paradise-valley.jpg
- morocco-coastal-2.jpg
- morocco-horizon-4.jpg

**Week 2: Cultural Images**
- morocco-heritage-1.jpg
- morocco-market.jpg
- berber-village.jpg

**Week 3: Adventure Images**
- quad-biking.jpg
- camel-ride-sunset.jpg
- horse-2.jpg

### Approach 2: By Priority
Update highest-impact images first:

**Day 1: Critical (Top 7)**
- Update images with 20+ uses
- Impact: 69% of all image references

**Day 2: High Priority**
- Update images with 10-19 uses
- Impact: +20% coverage

**Day 3: Remaining**
- Medium and low priority
- Add missing images

---

## ⚙️ Advanced: Bulk Find & Replace

If you need to rename images across all files:

### Using VS Code
1. Open VS Code in the `miracleair-clone` folder
2. Press `Cmd+Shift+H` (Mac) or `Ctrl+Shift+H` (Windows)
3. Enable "Match Case" and "Use Regular Expression" if needed
4. Find: `img/old-name.jpg`
5. Replace: `img/new-name.jpg`
6. Click "Replace All" (or review each one)

### Using Command Line
```bash
# Preview changes (dry run)
grep -rl "img/old-name.jpg" *.html

# Replace across all HTML files
find . -name "*.html" -type f -exec sed -i '' 's/img\/old-name.jpg/img\/new-name.jpg/g' {} +

# Verify
grep -r "img/new-name.jpg" *.html
```

---

## 🎯 Optimization Tips

### 1. Compress Images
**Tools:**
- [TinyPNG](https://tinypng.com) - Online, free
- [ImageOptim](https://imageoptim.com) - Mac app
- [Squoosh](https://squoosh.app) - Google's web tool

**Command Line:**
```bash
# Install ImageMagick
brew install imagemagick

# Resize to 1200x800
mogrify -resize 1200x800 -quality 85 *.jpg

# Convert to WebP
for img in *.jpg; do cwebp -q 85 "$img" -o "${img%.jpg}.webp"; done
```

### 2. Lazy Loading
Your images already use proper lazy loading in most galleries!

### 3. WebP Format
Consider creating WebP versions for modern browsers:
- Same quality, 25-35% smaller file size
- Example: `quad-biking.webp` already exists

### 4. Responsive Images
Use `srcset` for different screen sizes (future enhancement):
```html
<img src="img/paradise-valley.jpg"
     srcset="img/paradise-valley-400.jpg 400w,
             img/paradise-valley-800.jpg 800w,
             img/paradise-valley-1200.jpg 1200w"
     alt="Paradise Valley">
```

---

## 🚨 Troubleshooting

### Images Not Showing After Update
1. **Clear browser cache:** Cmd+Shift+R (Mac) or Ctrl+Shift+F5 (Windows)
2. **Check filename:** Must match exactly (case-sensitive!)
3. **Verify path:** Images should be in `/img/` folder
4. **File permissions:** Images must be readable
   ```bash
   chmod 644 img/*.jpg img/*.png
   ```

### Broken Images
```bash
# Find all broken image references
./update_images_helper.sh validate

# Or manually check
for img in $(grep -roh 'img/[^"'\'' ]*' *.html | sort -u); do
    [ ! -f "$img" ] && echo "Missing: $img"
done
```

### Large File Sizes
```bash
# Check which images are too large
./update_images_helper.sh sizes

# Compress them
cd img/
for img in *.jpg; do
    jpegoptim --size=150k "$img"
done
```

---

## 📋 Checklist: Before Going Live

- [ ] All images optimized (<200KB)
- [ ] No broken image references
- [ ] Backup created and stored safely
- [ ] Tested on desktop browser
- [ ] Tested on mobile browser
- [ ] All missing images uploaded
- [ ] Alt text is descriptive (already done!)
- [ ] Images load quickly (test with throttling)

---

## 🔗 Quick Reference

### File Locations
```
miracleair-clone/
├── img/                        ← Your images go here
├── IMAGE_AUDIT_REPORT.md       ← Executive summary
├── IMAGE_DETAILED_REFERENCE.md ← Complete breakdown
├── image_inventory.csv         ← Tracking spreadsheet
└── update_images_helper.sh     ← Automation tool
```

### Most Important Files to Update
1. morocco-coastal-2.jpg (32 uses) ⭐⭐⭐⭐⭐
2. morocco-week-3.jpg (26 uses) ⭐⭐⭐⭐⭐
3. morocco-horizon-4.jpg (25 uses) ⭐⭐⭐⭐⭐
4. morocco-market.jpg (20 uses) ⭐⭐⭐⭐⭐
5. morocco-heritage-1.jpg (20 uses) ⭐⭐⭐⭐⭐

---

## 💬 Need Help?

**Common Questions:**

**Q: Can I just replace the images without changing names?**  
A: Yes! That's the easiest way. Just overwrite the files in `/img/` folder.

**Q: What if I want to use different names?**  
A: Use VS Code's Find & Replace (Cmd+Shift+H) to update all references.

**Q: How do I know which images to prioritize?**  
A: See the priority list above. Start with the 7 CRITICAL images (20+ uses each).

**Q: Will updating images break the website?**  
A: No, as long as you keep the same filenames or update references properly.

**Q: What size should the images be?**  
A: 1200x800px for tour images, 1920x1080px for heroes, <150KB file size.

---

## ✨ You're All Set!

You now have everything you need to update all images efficiently:

✅ Complete audit of what's being used where  
✅ Priority ranking to focus your efforts  
✅ Helper tool for automation  
✅ Step-by-step guides  
✅ Tracking spreadsheet  

**Start with the top 7 images and you'll update 69% of all image references!**

Good luck! 🚀

