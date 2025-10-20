#!/bin/bash

# Script to update all HTML pages with consistent header and footer

# List of all HTML files to update (excluding index.html and agadir-tours.html which are already updated)
files=(
    "contact.html"
    "day-trips-from-agadir.html"
    "things-to-do-in-agadir.html"
    "tour-paradise-valley-agadir.html"
    "tour-quad-biking-agadir.html"
    "tour-camel-ride-agadir.html"
    "tour-sandboarding-agadir.html"
    "tour-horse-riding-agadir.html"
    "tour-agadir-city-tour.html"
    "day-trip-marrakech-from-agadir.html"
    "day-trip-essaouira-from-agadir.html"
    "day-trip-taroudant-from-agadir.html"
    "crocoparc-agadir-tour.html"
    "tour-atv-quad-safari.html"
    "tour-buggy-adventure-agadir.html"
    "tour-cooking-class-agadir.html"
    "tour-boat-trip-agadir.html"
    "tour-jet-ski-agadir.html"
    "tour-moroccan-hammam-agadir.html"
    "tour-souk-el-had-agadir.html"
    "tour-souss-massa-park-agadir.html"
    "tour-surf-lessons-agadir.html"
    "about.html"
    "gallery.html"
    "payment.html"
    "safety.html"
    "pilots.html"
    "lounge.html"
)

# Header template
header_template='    <!-- TOPBAR -->
    <div class="topbar">
        <div class="topbar__wrapper">
            <div class="topbar__left">
                <a href="agadir-tours.html" class="topbar__link">Agadir Tours</a>
                <a href="day-trips-from-agadir.html" class="topbar__link">Day Trips</a>
                <a href="#deals" class="topbar__link">Special Offers</a>
            </div>
            <div class="topbar__right">
                <a href="tel:+212636372101" class="topbar__link">+212 636-372101</a>
                <a href="contact.html" class="topbar__link">Contact</a>
            </div>
        </div>
    </div>

    <!-- HEADER -->
    <header class="header">
        <div class="header__wrapper">
            <a href="index.html" class="header__logo">The Local Guide</a>
            <nav class="header__nav">
                <a href="index.html" class="header__nav-link">Home</a>
                <a href="agadir-tours.html" class="header__nav-link">Agadir Tours</a>
                <a href="day-trips-from-agadir.html" class="header__nav-link">Day Trips</a>
                <a href="things-to-do-in-agadir.html" class="header__nav-link">Things to Do</a>
                <a href="contact.html" class="header__nav-link">Contact</a>
            </nav>
            <div class="header__actions">
                <a href="https://wa.me/212636372101" class="btn btn-whatsapp">WhatsApp Us</a>
                <a href="contact.html" class="btn btn-primary">Book Now</a>
            </div>
        </div>
    </header>'

echo "Starting to update all HTML pages with consistent header and footer..."

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "Processing $file..."
        
        # Create a backup
        cp "$file" "${file}.backup"
        
        # For now, just echo what we would do
        echo "  - Would update header and footer in $file"
    else
        echo "  - File $file not found, skipping..."
    fi
done

echo "Update script completed!"
