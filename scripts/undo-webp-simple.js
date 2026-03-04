#!/usr/bin/env node

/**
 * Simple WebP Undo - Remove picture elements and restore img tags
 */

const fs = require('fs');
const path = require('path');

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

function revertHTML(htmlPath) {
  let content = fs.readFileSync(htmlPath, 'utf8');
  const original = content;
  let changed = false;
  
  // Remove picture elements - handle both opening and closing tags separately
  // First, remove closing </picture> tags that are orphaned
  content = content.replace(/<\/picture>/gi, '');
  changed = content !== original;
  
  // Remove opening <picture> tags
  content = content.replace(/<picture>/gi, '');
  changed = changed || content !== original;
  
  // Remove <source> tags (WebP sources)
  content = content.replace(/<source[^>]*srcset=["'][^"']*\.webp["'][^>]*>/gi, '');
  changed = changed || content !== original;
  
  // Clean up any remaining picture-related tags
  content = content.replace(/<source[^>]*type=["']image\/webp["'][^>]*>/gi, '');
  changed = changed || content !== original;
  
  // Remove loading="lazy" and decoding="async" from img tags
  content = content.replace(/(<img[^>]*)\s+loading=["']lazy["']([^>]*>)/gi, '$1$2');
  content = content.replace(/(<img[^>]*)\s+decoding=["']async["']([^>]*>)/gi, '$1$2');
  changed = changed || content !== original;
  
  // Clean up extra whitespace/newlines left by removed tags
  content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
  changed = changed || content !== original;
  
  // Remove picture CSS
  const cssPatterns = [
    /\/\* Fix picture elements[\s\S]*?\.tour-carousel picture img \{[\s\S]*?\}\s*/g,
    /\.simple-slider \.slide picture,[\s\S]*?\.tour-carousel picture img \{[\s\S]*?\}\s*/g
  ];
  
  cssPatterns.forEach(pattern => {
    if (pattern.test(content)) {
      content = content.replace(pattern, '');
      changed = true;
    }
  });
  
  if (changed) {
    fs.writeFileSync(htmlPath, content, 'utf8');
    console.log(`✅ Reverted: ${path.relative(__dirname, htmlPath)}`);
    return true;
  }
  
  return false;
}

function main() {
  console.log('🔄 Reverting WebP changes...\n');
  
  const htmlFiles = findHTMLFiles(__dirname);
  let reverted = 0;
  
  htmlFiles.forEach(file => {
    if (revertHTML(file)) {
      reverted++;
    }
  });
  
  console.log(`\n✅ Reverted ${reverted} files`);
  console.log('✅ All picture elements removed, img tags restored');
}

if (require.main === module) {
  main();
}

