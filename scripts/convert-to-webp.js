#!/usr/bin/env node

/**
 * WebP Image Conversion Script
 * Converts all JPG/JPEG/PNG images to WebP format
 * and updates HTML files to use the picture element
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const IMG_DIR = path.join(__dirname, 'img');
const HTML_DIR = __dirname;
const QUALITY = 85; // WebP quality (0-100)
const SKIP_EXISTING = true; // Skip if WebP already exists

// Supported image formats
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG'];

/**
 * Recursively find all image files
 */
function findImages(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findImages(filePath, fileList);
    } else {
      const ext = path.extname(file);
      if (IMAGE_EXTENSIONS.includes(ext)) {
        fileList.push(filePath);
      }
    }
  });
  
  return fileList;
}

/**
 * Convert image to WebP
 */
function convertToWebP(imagePath) {
  const ext = path.extname(imagePath);
  const webpPath = imagePath.replace(ext, '.webp');
  
  // Skip if WebP already exists
  if (SKIP_EXISTING && fs.existsSync(webpPath)) {
    console.log(`⏭️  Skipping (WebP exists): ${path.relative(__dirname, imagePath)}`);
    return webpPath;
  }
  
  try {
    // Use cwebp command - escape paths properly
    const escapedImagePath = imagePath.replace(/"/g, '\\"');
    const escapedWebpPath = webpPath.replace(/"/g, '\\"');
    const command = `cwebp -q ${QUALITY} "${escapedImagePath}" -o "${escapedWebpPath}"`;
    execSync(command, { stdio: 'pipe' });
    
    // Get file sizes for comparison
    const originalSize = fs.statSync(imagePath).size;
    const webpSize = fs.statSync(webpPath).size;
    const savings = ((1 - webpSize / originalSize) * 100).toFixed(1);
    
    console.log(`✅ Converted: ${path.relative(__dirname, imagePath)} (${savings}% smaller)`);
    return webpPath;
  } catch (error) {
    console.error(`❌ Error converting ${imagePath}:`, error.message);
    return null;
  }
}

/**
 * Find all HTML files
 */
function findHTMLFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    // Skip node_modules, .git, and other hidden/system directories
    if (file.startsWith('.') || file === 'node_modules' || file === 'templates') {
      return;
    }
    
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findHTMLFiles(filePath, fileList);
    } else if (file.endsWith('.html') && !file.includes('.bak')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

/**
 * Update HTML to use picture element with WebP
 */
function updateHTMLFile(htmlPath) {
  let content = fs.readFileSync(htmlPath, 'utf8');
  let modified = false;
  
  // First, remove any nested picture elements that might have been created
  content = content.replace(/<picture>\s*<source[^>]*>\s*<picture>/gi, '<picture>');
  content = content.replace(/<\/picture>\s*<\/picture>/gi, '</picture>');
  
  // Pattern to match img tags that are NOT inside picture elements
  // Match img tags, but check they're not between <picture> and </picture>
  const imgPattern = /<img\s+([^>]*?)src=["']([^"']+\.(jpg|jpeg|png|JPG|JPEG|PNG))["']([^>]*?)>/gi;
  
  let lastIndex = 0;
  const matches = [];
  let match;
  
  // Collect all matches first
  while ((match = imgPattern.exec(content)) !== null) {
    const matchIndex = match.index;
    const beforeMatch = content.substring(Math.max(0, matchIndex - 200), matchIndex);
    const afterMatch = content.substring(matchIndex, Math.min(content.length, matchIndex + match[0].length + 200));
    
    // Skip if already inside a picture element
    if (beforeMatch.includes('<picture') && !beforeMatch.includes('</picture>')) {
      continue;
    }
    
    matches.push({
      match: match[0],
      index: matchIndex,
      beforeSrc: match[1],
      src: match[2],
      ext: match[3],
      afterSrc: match[4]
    });
  }
  
  // Process matches in reverse order to maintain indices
  for (let i = matches.length - 1; i >= 0; i--) {
    const m = matches[i];
    
    // Get the full image path
    let imagePath = m.src;
    if (!path.isAbsolute(m.src)) {
      // Relative path - resolve from HTML file location
      const htmlDir = path.dirname(htmlPath);
      imagePath = path.resolve(htmlDir, m.src);
    }
    
    // Check if WebP version exists
    const webpPath = imagePath.replace(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/i, '.webp');
    
    if (!fs.existsSync(webpPath)) {
      continue; // Skip if WebP doesn't exist
    }
    
    modified = true;
    
    // Extract existing attributes
    const altMatch = m.match.match(/alt=["']([^"']*)["']/i);
    const alt = altMatch ? altMatch[1] : '';
    const classMatch = m.match.match(/class=["']([^"']*)["']/i);
    const classAttr = classMatch ? ` class="${classMatch[1]}"` : '';
    const widthMatch = m.match.match(/width=["']?(\d+)["']?/i);
    const width = widthMatch ? widthMatch[1] : '';
    const heightMatch = m.match.match(/height=["']?(\d+)["']?/i);
    const height = heightMatch ? heightMatch[1] : '';
    
    // Build WebP relative path (use forward slashes for web)
    const webpSrc = path.relative(path.dirname(htmlPath), webpPath).replace(/\\/g, '/');
    const originalSrc = m.src.replace(/\\/g, '/');
    
    // Create picture element
    let pictureElement = `<picture>`;
    pictureElement += `\n  <source srcset="${webpSrc}" type="image/webp">`;
    pictureElement += `\n  <img src="${originalSrc}"${alt ? ` alt="${alt}"` : ''}${classAttr}${width ? ` width="${width}"` : ''}${height ? ` height="${height}"` : ''} loading="lazy" decoding="async">`;
    pictureElement += `\n</picture>`;
    
    // Replace in content
    content = content.substring(0, m.index) + pictureElement + content.substring(m.index + m.match.length);
  }
  
  if (modified) {
    fs.writeFileSync(htmlPath, content, 'utf8');
    console.log(`📝 Updated: ${path.relative(__dirname, htmlPath)}`);
    return true;
  }
  
  return false;
}

/**
 * Main execution
 */
function main() {
  console.log('🚀 Starting WebP conversion process...\n');
  
  // Step 1: Find and convert all images
  console.log('📸 Step 1: Converting images to WebP...\n');
  const images = findImages(IMG_DIR);
  console.log(`Found ${images.length} images to convert\n`);
  
  let converted = 0;
  let skipped = 0;
  let errors = 0;
  
  images.forEach((imagePath, index) => {
    const webpPath = convertToWebP(imagePath);
    if (webpPath) {
      converted++;
    } else if (SKIP_EXISTING && fs.existsSync(imagePath.replace(path.extname(imagePath), '.webp'))) {
      skipped++;
    } else {
      errors++;
    }
  });
  
  console.log(`\n✅ Conversion complete:`);
  console.log(`   - Converted: ${converted}`);
  console.log(`   - Skipped: ${skipped}`);
  console.log(`   - Errors: ${errors}\n`);
  
  // Step 2: Update HTML files
  console.log('📝 Step 2: Updating HTML files...\n');
  const htmlFiles = findHTMLFiles(HTML_DIR);
  console.log(`Found ${htmlFiles.length} HTML files to update\n`);
  
  let updated = 0;
  htmlFiles.forEach(htmlPath => {
    if (updateHTMLFile(htmlPath)) {
      updated++;
    }
  });
  
  console.log(`\n✅ HTML update complete:`);
  console.log(`   - Updated: ${updated} files`);
  console.log(`   - Total: ${htmlFiles.length} files\n`);
  
  console.log('🎉 WebP conversion process complete!');
  console.log('\n💡 Next steps:');
  console.log('   1. Test your website to ensure images load correctly');
  console.log('   2. Check PageSpeed Insights for improvements');
  console.log('   3. Verify all images have proper alt text');
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { convertToWebP, updateHTMLFile, findImages };

