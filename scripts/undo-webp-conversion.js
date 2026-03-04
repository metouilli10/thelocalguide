#!/usr/bin/env node

/**
 * Undo WebP Conversion - Revert all changes
 * 1. Remove WebP files
 * 2. Revert HTML files to use img tags instead of picture elements
 * 3. Remove picture element CSS
 */

const fs = require('fs');
const path = require('path');

// Configuration
const IMG_DIR = path.join(__dirname, 'img');
const HTML_DIR = __dirname;

/**
 * Recursively find all WebP files
 */
function findWebPFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findWebPFiles(filePath, fileList);
    } else if (file.endsWith('.webp')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

/**
 * Find all HTML files
 */
function findHTMLFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
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
 * Revert picture elements back to img tags
 */
function revertHTMLFile(htmlPath) {
  let content = fs.readFileSync(htmlPath, 'utf8');
  const originalContent = content;
  let modified = false;
  
  // Pattern to match picture elements (multiline, flexible)
  // Match: <picture>...<source...>...<img...>...</picture>
  const picturePattern = /<picture>[\s\S]*?<source[^>]*srcset=["']([^"']+\.webp)["'][^>]*>[\s\S]*?<img([^>]*)src=["']([^"']+)["']([^>]*)>[\s\S]*?<\/picture>/gi;
  
  content = content.replace(picturePattern, (match, webpSrc, beforeSrc, originalSrc, afterSrc) => {
    modified = true;
    
    // Combine all img attributes, but remove loading and decoding if they were added
    let allAttrs = (beforeSrc + ' ' + afterSrc).trim();
    allAttrs = allAttrs.replace(/\s+loading=["']lazy["']/gi, '');
    allAttrs = allAttrs.replace(/\s+decoding=["']async["']/gi, '');
    
    // Clean up extra spaces
    allAttrs = allAttrs.replace(/\s+/g, ' ').trim();
    if (allAttrs && !allAttrs.startsWith(' ')) {
      allAttrs = ' ' + allAttrs;
    }
    
    // Return just the img tag with original src
    return `<img src="${originalSrc}"${allAttrs}>`;
  });
  
  // Also handle malformed picture elements (picture tag on separate lines)
  const malformedPattern = /<picture>[\s\S]*?<\/picture>/gi;
  content = content.replace(malformedPattern, (match) => {
    // Extract img tag from inside picture
    const imgMatch = match.match(/<img([^>]*)src=["']([^"']+)["']([^>]*)>/i);
    if (imgMatch) {
      modified = true;
      let attrs = (imgMatch[1] + ' ' + imgMatch[3]).trim();
      attrs = attrs.replace(/\s+loading=["']lazy["']/gi, '');
      attrs = attrs.replace(/\s+decoding=["']async["']/gi, '');
      attrs = attrs.replace(/\s+/g, ' ').trim();
      if (attrs && !attrs.startsWith(' ')) {
        attrs = ' ' + attrs;
      }
      return `<img src="${imgMatch[2]}"${attrs}>`;
    }
    return match;
  });
  
  // Remove picture element CSS
  const pictureCSSPatterns = [
    /\/\* Fix picture elements in slides \*\/[\s\S]*?\.tour-carousel picture img \{[\s\S]*?\}\s*/g,
    /\.simple-slider \.slide picture,[\s\S]*?\.tour-carousel picture img \{[\s\S]*?\}\s*/g
  ];
  
  pictureCSSPatterns.forEach(pattern => {
    if (pattern.test(content)) {
      content = content.replace(pattern, '');
      modified = true;
    }
  });
  
  if (modified) {
    fs.writeFileSync(htmlPath, content, 'utf8');
    console.log(`✅ Reverted: ${path.relative(__dirname, htmlPath)}`);
    return true;
  }
  
  return false;
}

/**
 * Main execution
 */
function main() {
  console.log('🔄 Starting WebP conversion undo process...\n');
  
  // Step 1: Remove WebP files
  console.log('🗑️  Step 1: Removing WebP files...\n');
  const webpFiles = findWebPFiles(IMG_DIR);
  console.log(`Found ${webpFiles.length} WebP files to remove\n`);
  
  let removed = 0;
  let errors = 0;
  
  webpFiles.forEach(webpPath => {
    try {
      fs.unlinkSync(webpPath);
      console.log(`✅ Removed: ${path.relative(__dirname, webpPath)}`);
      removed++;
    } catch (error) {
      console.error(`❌ Error removing ${webpPath}:`, error.message);
      errors++;
    }
  });
  
  console.log(`\n✅ WebP removal complete:`);
  console.log(`   - Removed: ${removed}`);
  console.log(`   - Errors: ${errors}\n`);
  
  // Step 2: Revert HTML files
  console.log('📝 Step 2: Reverting HTML files...\n');
  const htmlFiles = findHTMLFiles(HTML_DIR);
  console.log(`Found ${htmlFiles.length} HTML files to check\n`);
  
  let reverted = 0;
  htmlFiles.forEach(htmlPath => {
    if (revertHTMLFile(htmlPath)) {
      reverted++;
    }
  });
  
  console.log(`\n✅ HTML revert complete:`);
  console.log(`   - Reverted: ${reverted} files`);
  console.log(`   - Total: ${htmlFiles.length} files\n`);
  
  console.log('🎉 WebP conversion undo complete!');
  console.log('\n💡 All changes have been reverted:');
  console.log('   - WebP files removed');
  console.log('   - HTML files reverted to img tags');
  console.log('   - Picture element CSS removed');
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { revertHTMLFile, findWebPFiles };

