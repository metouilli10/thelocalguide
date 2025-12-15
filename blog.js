/**
 * AGADIR LOCAL GUIDE - BLOG POST JAVASCRIPT
 * Production-Ready Blog Template Scripts
 *
 * Features:
 * - Auto-generate table of contents from H2 headings
 * - Copy link to clipboard functionality
 * - Smooth scroll to sections
 * - Mobile menu toggle (if needed)
 */

// ============================================
// TABLE OF CONTENTS GENERATION
// ============================================

/**
 * Generates a table of contents from all H2 headings in the article
 */
function generateTableOfContents() {
    const tocNav = document.getElementById('toc-nav');
    const articleContent = document.querySelector('.article-content');

    if (!tocNav || !articleContent) {
        console.warn('TOC elements not found');
        return;
    }

    // Find all H2 headings in the article content
    const headings = articleContent.querySelectorAll('h2');

    if (headings.length === 0) {
        console.warn('No H2 headings found for TOC');
        return;
    }

    // Create ordered list for TOC
    const ol = document.createElement('ol');

    headings.forEach((heading, index) => {
        // Ensure each heading has an ID for linking
        if (!heading.id) {
            heading.id = `section-${index + 1}`;
        }

        // Create list item with link
        const li = document.createElement('li');
        const a = document.createElement('a');

        a.href = `#${heading.id}`;
        a.textContent = heading.textContent;
        a.addEventListener('click', smoothScrollToSection);

        li.appendChild(a);
        ol.appendChild(li);
    });

    // Insert the TOC into the nav element
    tocNav.appendChild(ol);
}

// ============================================
// SMOOTH SCROLLING
// ============================================

/**
 * Smooth scroll to section when TOC link is clicked
 * @param {Event} e - Click event
 */
function smoothScrollToSection(e) {
    e.preventDefault();

    const targetId = e.target.getAttribute('href');
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
        const headerOffset = 100; // Account for sticky header
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });

        // Update URL without jumping
        history.pushState(null, null, targetId);
    }
}

// ============================================
// COPY LINK FUNCTIONALITY
// ============================================

/**
 * Copy current page URL to clipboard and show toast notification
 */
function copyLinkToClipboard() {
    const url = window.location.href;

    // Modern clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url)
            .then(() => {
                showToast('Link copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy link:', err);
                fallbackCopyToClipboard(url);
            });
    } else {
        // Fallback for older browsers
        fallbackCopyToClipboard(url);
    }
}

/**
 * Fallback method for copying to clipboard
 * @param {string} text - Text to copy
 */
function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '-9999px';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showToast('Link copied to clipboard!');
        } else {
            showToast('Failed to copy link', 'error');
        }
    } catch (err) {
        console.error('Fallback copy failed:', err);
        showToast('Failed to copy link', 'error');
    }

    document.body.removeChild(textArea);
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type of notification (success/error)
 */
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');

    if (!toast) {
        console.warn('Toast element not found');
        return;
    }

    // Set message
    toast.textContent = message;

    // Add type-specific styling if needed
    if (type === 'error') {
        toast.style.background = '#EF4444';
    } else {
        toast.style.background = '#1F2937';
    }

    // Show toast
    toast.classList.add('show');

    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ============================================
// MOBILE MENU TOGGLE (Optional)
// ============================================

/**
 * Toggle mobile navigation menu
 */
function toggleMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const menu = document.querySelector('.nav-menu');

    if (!toggle || !menu) {
        return;
    }

    toggle.addEventListener('click', () => {
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

        toggle.setAttribute('aria-expanded', !isExpanded);
        menu.style.display = isExpanded ? 'none' : 'flex';

        // For mobile, show menu as vertical list
        if (!isExpanded) {
            menu.style.flexDirection = 'column';
            menu.style.position = 'absolute';
            menu.style.top = '100%';
            menu.style.left = '0';
            menu.style.right = '0';
            menu.style.background = 'white';
            menu.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            menu.style.padding = '1rem';
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !menu.contains(e.target)) {
            toggle.setAttribute('aria-expanded', 'false');
            if (window.innerWidth < 768) {
                menu.style.display = 'none';
            }
        }
    });

    // Reset menu on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
            menu.style.display = 'flex';
            menu.style.flexDirection = 'row';
            menu.style.position = 'static';
            menu.style.boxShadow = 'none';
            toggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// ============================================
// NEWSLETTER FORM HANDLING
// ============================================

/**
 * Handle newsletter form submission
 */
function handleNewsletterForm() {
    const form = document.querySelector('.newsletter-form');

    if (!form) {
        return;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const emailInput = form.querySelector('input[type="email"]');
        const email = emailInput.value;

        // Here you would typically send the email to your backend
        // For now, we'll just show a success message
        console.log('Newsletter subscription:', email);

        showToast('Thank you for subscribing!');

        // Reset form
        form.reset();

        // In production, you would do something like:
        // fetch('/api/subscribe', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ email })
        // })
        // .then(response => response.json())
        // .then(data => {
        //     showToast('Thank you for subscribing!');
        //     form.reset();
        // })
        // .catch(error => {
        //     showToast('Subscription failed. Please try again.', 'error');
        // });
    });
}

// ============================================
// READING PROGRESS INDICATOR (Bonus Feature)
// ============================================

/**
 * Show reading progress as user scrolls (optional enhancement)
 */
function initReadingProgress() {
    // Create progress bar element
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #0EA5E9, #F97316);
        width: 0%;
        z-index: 9999;
        transition: width 0.1s ease-out;
    `;
    document.body.appendChild(progressBar);

    // Update progress on scroll
    window.addEventListener('scroll', () => {
        const article = document.querySelector('.article-content');
        if (!article) return;

        const articleTop = article.offsetTop;
        const articleHeight = article.offsetHeight;
        const scrollPosition = window.pageYOffset;
        const windowHeight = window.innerHeight;

        const scrolled = scrollPosition - articleTop + windowHeight;
        const percentage = Math.min(100, Math.max(0, (scrolled / articleHeight) * 100));

        progressBar.style.width = `${percentage}%`;
    });
}

// ============================================
// LAZY LOADING IMAGES (Performance)
// ============================================

/**
 * Lazy load images for better performance
 */
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;

                    // If image has data-src, load it
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }

                    observer.unobserve(img);
                }
            });
        });

        // Observe all images with loading="lazy"
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// ============================================
// SOCIAL SHARE TRACKING (Analytics)
// ============================================

/**
 * Track social share clicks for analytics
 */
function trackSocialShares() {
    const shareButtons = document.querySelectorAll('.share-btn');

    shareButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const platform = button.classList.contains('facebook') ? 'Facebook' :
                           button.classList.contains('twitter') ? 'Twitter' :
                           button.classList.contains('whatsapp') ? 'WhatsApp' :
                           button.classList.contains('copy-link') ? 'Copy Link' : 'Unknown';

            // Log for analytics (replace with your analytics tool)
            console.log('Social share:', platform);

            // Example: Google Analytics event
            // if (typeof gtag !== 'undefined') {
            //     gtag('event', 'share', {
            //         'event_category': 'Social',
            //         'event_label': platform,
            //         'value': 1
            //     });
            // }
        });
    });
}

// ============================================
// INITIALIZE ALL FEATURES
// ============================================

/**
 * Initialize all blog features when DOM is ready
 */
function initBlogPost() {
    // Core features
    generateTableOfContents();

    // Copy link button
    const copyLinkBtn = document.querySelector('.copy-link');
    if (copyLinkBtn) {
        copyLinkBtn.addEventListener('click', copyLinkToClipboard);
    }

    // Mobile menu
    toggleMobileMenu();

    // Newsletter form
    handleNewsletterForm();

    // Optional enhancements
    initReadingProgress();
    initLazyLoading();
    trackSocialShares();

    // Handle deep links (if URL has hash)
    if (window.location.hash) {
        setTimeout(() => {
            const targetElement = document.querySelector(window.location.hash);
            if (targetElement) {
                const headerOffset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }

    console.log('Blog post initialized successfully!');
}

// ============================================
// ENTRY POINT
// ============================================

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBlogPost);
} else {
    // DOM is already loaded
    initBlogPost();
}

// Export functions for external use if needed
window.BlogPost = {
    generateTableOfContents,
    copyLinkToClipboard,
    showToast
};
