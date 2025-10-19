#!/bin/bash

# Image Update Helper Script
# The Local Guide - Agadir Tours Website
# Created: October 18, 2025

echo "=================================="
echo "🖼️  Image Update Helper Tool"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to show current images
show_current_images() {
    echo -e "${BLUE}📁 Current images in /img/ folder:${NC}"
    echo ""
    ls -lh img/ | grep -v "^d" | awk '{printf "%-30s %10s\n", $9, $5}' | grep -v "^$"
    echo ""
    echo -e "${GREEN}Total images: $(ls img/ | wc -l | tr -d ' ')${NC}"
    echo ""
}

# Function to check for missing images
check_missing_images() {
    echo -e "${YELLOW}🔍 Checking for referenced but missing images...${NC}"
    echo ""
    
    missing=0
    
    # List of expected images based on references
    expected_images=("surf-2.jpg" "morocco-food-1.jpg" "souss-massa-flamingos.jpg" "author-1.jpg" "author-2.jpg" "author-3.jpg")
    
    for img in "${expected_images[@]}"; do
        if [ ! -f "img/$img" ]; then
            echo -e "${RED}❌ MISSING: $img${NC}"
            ((missing++))
        else
            echo -e "${GREEN}✓ Found: $img${NC}"
        fi
    done
    
    echo ""
    if [ $missing -eq 0 ]; then
        echo -e "${GREEN}✅ All referenced images are present!${NC}"
    else
        echo -e "${RED}⚠️  Missing $missing image(s) - please upload them${NC}"
    fi
    echo ""
}

# Function to backup images
backup_images() {
    timestamp=$(date +%Y%m%d_%H%M%S)
    backup_name="img_backup_$timestamp.zip"
    
    echo -e "${BLUE}💾 Creating backup...${NC}"
    
    if [ -d "img" ]; then
        zip -r "$backup_name" img/ > /dev/null 2>&1
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Backup created: $backup_name${NC}"
            echo "   Size: $(ls -lh $backup_name | awk '{print $5}')"
        else
            echo -e "${RED}❌ Backup failed!${NC}"
        fi
    else
        echo -e "${RED}❌ /img/ folder not found!${NC}"
    fi
    echo ""
}

# Function to check image sizes
check_image_sizes() {
    echo -e "${BLUE}📏 Checking image file sizes...${NC}"
    echo ""
    
    large_files=0
    
    for img in img/*; do
        if [ -f "$img" ]; then
            size=$(stat -f%z "$img" 2>/dev/null || stat -c%s "$img" 2>/dev/null)
            size_kb=$((size / 1024))
            filename=$(basename "$img")
            
            if [ $size_kb -gt 200 ]; then
                echo -e "${RED}⚠️  $filename - ${size_kb}KB (>200KB - consider optimizing)${NC}"
                ((large_files++))
            elif [ $size_kb -gt 150 ]; then
                echo -e "${YELLOW}⚡ $filename - ${size_kb}KB (could be optimized)${NC}"
            else
                echo -e "${GREEN}✓ $filename - ${size_kb}KB (good)${NC}"
            fi
        fi
    done
    
    echo ""
    if [ $large_files -gt 0 ]; then
        echo -e "${YELLOW}💡 Tip: Use TinyPNG or ImageOptim to reduce file sizes${NC}"
    fi
    echo ""
}

# Function to show usage stats
show_usage_stats() {
    echo -e "${BLUE}📊 Image Usage Statistics:${NC}"
    echo ""
    echo "Top 10 most used images:"
    grep -r "img/" --include="*.html" --include="*.css" . 2>/dev/null | \
        grep -o 'img/[^"'\'' ]*' | \
        sort | uniq -c | sort -rn | head -10 | \
        awk '{printf "  %3d uses - %s\n", $1, $2}'
    echo ""
}

# Function to find which files use a specific image
find_image_usage() {
    if [ -z "$1" ]; then
        echo "Usage: $0 find <image-name>"
        return
    fi
    
    echo -e "${BLUE}🔎 Files using 'img/$1':${NC}"
    echo ""
    grep -l "img/$1" *.html 2>/dev/null | sed 's/^/  - /'
    echo ""
}

# Function to validate image references
validate_references() {
    echo -e "${BLUE}🔍 Validating all image references...${NC}"
    echo ""
    
    broken=0
    
    # Extract all img/ references from HTML files
    grep -roh 'img/[^"'\'' ]*' *.html 2>/dev/null | sort -u | while read -r ref; do
        filename=$(echo "$ref" | sed 's|img/||')
        if [ ! -f "img/$filename" ]; then
            echo -e "${RED}❌ Broken reference: $ref${NC}"
            ((broken++))
        fi
    done
    
    if [ $broken -eq 0 ]; then
        echo -e "${GREEN}✅ All image references are valid!${NC}"
    fi
    echo ""
}

# Main menu
show_menu() {
    echo "What would you like to do?"
    echo ""
    echo "1) Show current images"
    echo "2) Check for missing images"
    echo "3) Backup images folder"
    echo "4) Check image file sizes"
    echo "5) Show usage statistics"
    echo "6) Find where an image is used"
    echo "7) Validate all references"
    echo "8) Run all checks"
    echo "9) Exit"
    echo ""
    echo -n "Enter choice [1-9]: "
}

# Change to script directory
cd "$(dirname "$0")"

# If arguments provided, run specific function
if [ ! -z "$1" ]; then
    case "$1" in
        backup) backup_images ;;
        check) check_missing_images ;;
        sizes) check_image_sizes ;;
        stats) show_usage_stats ;;
        find) find_image_usage "$2" ;;
        validate) validate_references ;;
        list) show_current_images ;;
        *)
            echo "Usage: $0 [backup|check|sizes|stats|find|validate|list]"
            exit 1
            ;;
    esac
    exit 0
fi

# Interactive mode
while true; do
    show_menu
    read choice
    echo ""
    
    case $choice in
        1) show_current_images ;;
        2) check_missing_images ;;
        3) backup_images ;;
        4) check_image_sizes ;;
        5) show_usage_stats ;;
        6) 
            echo -n "Enter image filename (e.g., paradise-valley.jpg): "
            read imgname
            find_image_usage "$imgname"
            ;;
        7) validate_references ;;
        8)
            show_current_images
            check_missing_images
            check_image_sizes
            show_usage_stats
            validate_references
            ;;
        9)
            echo -e "${GREEN}👋 Goodbye!${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid choice. Please enter 1-9.${NC}"
            echo ""
            ;;
    esac
    
    echo ""
    echo "Press Enter to continue..."
    read
    clear
done

