/* assets/js/main.js */
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            // Animate hamburger menu
            const spans = mobileMenuBtn.querySelectorAll('span');
            spans.forEach(span => span.classList.toggle('active'));
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (mobileMenuBtn 
            && navMenu 
            && !mobileMenuBtn.contains(e.target) 
            && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Sticky header with show/hide on scroll
    let lastScrollTop = 0;
    const header = document.querySelector('.main-nav');
    if (header) {
        const headerHeight = header.offsetHeight;
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

                    if (scrollTop > lastScrollTop) {
                        // Scrolling down
                        header.style.transform = `translateY(-${headerHeight}px)`;
                    } else {
                        // Scrolling up
                        header.style.transform = 'translateY(0)';
                    }

                    lastScrollTop = scrollTop;
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // Add active class to current nav item
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-item');

    if (sections.length && navItems.length) {
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;

                if (window.pageYOffset >= (sectionTop - 300)) {
                    current = section.getAttribute('id');
                }
            });

            navItems.forEach(navItem => {
                navItem.classList.remove('active');
                if (navItem.hash === `#${current}`) {
                    navItem.classList.add('active');
                }
            });
        });
    }

    // Initialize animations on scroll
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatableElements = document.querySelectorAll(
        '.service-card, .donation-card, .involvement-card, .news-card'
    );
    if (animatableElements.length) {
        animatableElements.forEach(element => observer.observe(element));
    }
});