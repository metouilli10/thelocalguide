#!/usr/bin/env node

/**
 * Fix picture element layout issues in tour pages
 * Adds CSS to make picture elements fill containers properly
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

function fixPictureLayout(htmlPath) {
  let content = fs.readFileSync(htmlPath, 'utf8');
  const originalContent = content;
  
  // CSS to fix picture elements in slides
  const pictureCSS = `
        /* Fix picture elements in slides */
        .simple-slider .slide picture,
        .simple-slider picture {
            display: block;
            width: 100%;
            height: 100%;
        }
        .simple-slider .slide picture img,
        .simple-slider picture img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }
        /* Fix picture in thumbnails */
        .ss-thumb picture {
            display: block;
            width: 100%;
            height: 100%;
        }
        .ss-thumb picture img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }
        /* Fix picture in tour carousel */
        .tour-carousel picture {
            display: block;
            width: 100%;
            height: 100%;
        }
        .tour-carousel picture img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }
`;
  
  // Check if CSS already added
  if (content.includes('.simple-slider .slide picture')) {
    return false; // Already fixed
  }
  
  // Find where to insert the CSS (after .simple-slider img rule)
  let insertPoint = content.indexOf('.simple-slider img { width: 100%; height: 100%; object-fit: cover; display: block; }');
  
  if (insertPoint === -1) {
    // Try alternative pattern
    insertPoint = content.indexOf('.simple-slider img');
  }
  
  if (insertPoint !== -1) {
    // Find the end of the CSS rule (closing brace)
    let insertAfter = content.indexOf('}', insertPoint);
    if (insertAfter !== -1) {
      insertAfter += 1; // After the closing brace
      content = content.substring(0, insertAfter) + pictureCSS + content.substring(insertAfter);
    } else {
      // Fallback: insert after the line
      const lineEnd = content.indexOf('\n', insertPoint);
      if (lineEnd !== -1) {
        content = content.substring(0, lineEnd) + pictureCSS + content.substring(lineEnd);
      }
    }
  } else {
    // If no .simple-slider found, try inserting in style tag
    const styleTagEnd = content.indexOf('</style>');
    if (styleTagEnd !== -1) {
      content = content.substring(0, styleTagEnd) + pictureCSS + content.substring(styleTagEnd);
    }
  }
  
  // Also update JavaScript selectors to work with picture elements
  // Update: .slide img to .slide picture img or .slide img (both work)
  // The selector .slide img should still work, but let's make sure
  
  if (content !== originalContent) {
    fs.writeFileSync(htmlPath, content, 'utf8');
    console.log(`✅ Fixed: ${path.relative(__dirname, htmlPath)}`);
    return true;
  }
  
  return false;
}

function main() {
  console.log('🔧 Fixing picture element layout issues...\n');
  
  const htmlFiles = findHTMLFiles(__dirname);
  let fixed = 0;
  
  htmlFiles.forEach(htmlPath => {
    if (fixPictureLayout(htmlPath)) {
      fixed++;
    }
  });
  
  console.log(`\n✅ Fixed ${fixed} tour pages`);
  console.log('\n💡 The picture elements should now fill their containers properly.');
}

if (require.main === module) {
  main();
}

