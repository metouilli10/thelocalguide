// Miracle Air Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeMenu = document.querySelector('.close-menu');
    
    hamburger.addEventListener('click', function() {
        mobileMenu.classList.add('active');
    });
    
    closeMenu.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!mobileMenu.contains(event.target) && !hamburger.contains(event.target)) {
            mobileMenu.classList.remove('active');
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            mobileMenu.classList.remove('active');
        }
    });

    // Tab Functionality
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // Back to Top Button
    const backToTop = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Form Submission
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            
            // Here you would normally send the data to a server
            console.log('Form submitted with data:', data);
            
            // Show success message
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
        });
    }

    // Smooth Scroll for Internal Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe sections
    document.querySelectorAll('.intro-section, .quick-links, .why-choose-section, .experiences-section, .locations-section, .contact-section, .hero-inner, .trust-grid, .popular-trips-section, .signature-section, .steps-section, .testimonials-section, .cta-banner-inner').forEach(section => {
        observer.observe(section);
    });

    // Lazy Load Images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // Compact mobile booking bar + toggle for tour pages
    const bookingSidebar = document.querySelector('.booking-sidebar');
    if (bookingSidebar) {
        // Inject overriding mobile CSS so buttons are side-by-side and smaller,
        // and add collapsed state support controlled by a small arrow toggle.
        const styleEl = document.createElement('style');
        styleEl.textContent = `
            @media (max-width: 768px) {
                body.has-sticky-booking { padding-bottom: 110px !important; }
                .booking-sidebar {
                    position: fixed !important;
                    left: 0; right: 0; bottom: 0 !important;
                    z-index: 999 !important;
                    transition: none !important;
                    transform: none !important;
                    background: #ffffff;
                    box-shadow: 0 -4px 20px rgba(0,0,0,0.15);
                }
                .booking-sidebar .booking-card { padding: 12px 12px 14px; position: relative; border: none; border-radius: 0; }
                .booking-sidebar .price-section { display: none !important; }
                .booking-sidebar .free-cancellation { display: none !important; }
                .booking-sidebar .booking-buttons { flex-direction: row !important; gap: 8px !important; margin: 0 !important; }
                .booking-sidebar .booking-buttons > a, .booking-sidebar .booking-buttons > button {
                    flex: 1 1 0; padding: 12px 10px !important; font-size: 14px !important;
                }
            }
        `;
        document.head.appendChild(styleEl);

        // Mark body so bottom padding is applied on mobile
        document.body.classList.add('has-sticky-booking');
    }

    // Remove any "Free cancellation" mentions site-wide (tours & index)
    try {
        // Explicit blocks
        document.querySelectorAll('.free-cancellation').forEach(function(el){ el.remove(); });
        // List items like: <li><strong>Free cancellation:</strong> ...</li>
        document.querySelectorAll('li').forEach(function(li){
            var strong = li.querySelector('strong');
            if (strong && /free\s*cancellation/i.test(strong.textContent)) {
                li.remove();
            }
        });
        // Standalone short notes starting with the phrase (e.g., homepage feature text)
        document.querySelectorAll('p, div, span').forEach(function(el){
            var txt = (el.textContent || '').trim();
            if (/^free\s*cancellation/i.test(txt)) {
                el.remove();
            }
        });
    } catch(e) { /* no-op */ }
});

// Initialize Fancybox
$(document).ready(function() {
    $('[data-fancybox]').fancybox({
        youtube: {
            controls: 1,
            showinfo: 0
        },
        vimeo: {
            color: 'af9461'
        }
    });
});
