#!/usr/bin/env node

/**
 * Fix nested picture elements in HTML files
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

function fixNestedPictures(htmlPath) {
  let content = fs.readFileSync(htmlPath, 'utf8');
  const originalContent = content;
  
  // Find all picture elements
  const pictureRegex = /<picture>[\s\S]*?<\/picture>/gi;
  const pictures = [];
  let match;
  
  while ((match = pictureRegex.exec(content)) !== null) {
    pictures.push({
      full: match[0],
      start: match.index,
      end: match.index + match[0].length
    });
  }
  
  // Check for nested pictures and fix them
  let fixed = false;
  for (let i = pictures.length - 1; i >= 0; i--) {
    const pic = pictures[i];
    const innerContent = pic.full;
    
    // Count opening and closing picture tags
    const openCount = (innerContent.match(/<picture>/gi) || []).length;
    const closeCount = (innerContent.match(/<\/picture>/gi) || []).length;
    
    if (openCount > 1 || closeCount > 1) {
      // Extract the actual content (first source and img)
      const sourceMatch = innerContent.match(/<source[^>]*>/i);
      const imgMatch = innerContent.match(/<img[^>]*>/i);
      
      if (sourceMatch && imgMatch) {
        const fixedPicture = `<picture>\n  ${sourceMatch[0]}\n  ${imgMatch[0]}\n</picture>`;
        content = content.substring(0, pic.start) + fixedPicture + content.substring(pic.end);
        fixed = true;
      }
    }
  }
  
  // Also fix any remaining nested patterns with a simpler approach
  let changed = true;
  while (changed) {
    const before = content;
    // Remove nested opening tags
    content = content.replace(/<picture>\s*<source[^>]*>\s*<picture>/gi, '<picture>\n  <source');
    // Remove nested closing tags  
    content = content.replace(/<\/picture>\s*<\/picture>/gi, '</picture>');
    changed = (before !== content);
  }
  
  if (content !== originalContent) {
    fs.writeFileSync(htmlPath, content, 'utf8');
    console.log(`✅ Fixed: ${path.relative(__dirname, htmlPath)}`);
    return true;
  }
  
  return false;
}

function main() {
  console.log('🔧 Fixing nested picture elements...\n');
  
  const htmlFiles = findHTMLFiles(__dirname);
  let fixed = 0;
  
  htmlFiles.forEach(htmlPath => {
    if (fixNestedPictures(htmlPath)) {
      fixed++;
    }
  });
  
  console.log(`\n✅ Fixed ${fixed} files`);
}

if (require.main === module) {
  main();
}

