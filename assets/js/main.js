/* assets/js/main.js */
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            // Animate hamburger menu
            const spans = mobileMenuBtn.querySelectorAll('span');
            spans.forEach(span => span.classList.toggle('active'));
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenuBtn?.contains(e.target) && !navMenu?.contains(e.target)) {
            navMenu?.classList.remove('active');
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
    const headerHeight = header.offsetHeight;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop) {
            // Scrolling down
            header.style.transform = `translateY(-${headerHeight}px)`;
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }

        lastScrollTop = scrollTop;
    });

    // Add active class to current nav item
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 300)) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-item').forEach(navItem => {
            navItem.classList.remove('active');
            if (navItem.getAttribute('href') === `#${current}`) {
                navItem.classList.add('active');
            }
        });
    });

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
    document.querySelectorAll('.service-card, .donation-card, .involvement-card, .news-card').forEach(
        element => observer.observe(element)
    );
});

class RSSFeed {
    constructor(feedURL, containerId, maxItems = 3) {
        this.feedURL = feedURL;
        this.container = document.getElementById(containerId);
        this.maxItems = maxItems;
    }

    async fetchFeed() {
        try {
            // Using RSS2JSON API as a proxy since RSS feeds need CORS handling
            const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(this.feedURL)}`;
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.status === 'ok') {
                this.displayFeed(data.items);
            } else {
                throw new Error('Failed to load RSS feed');
            }
        } catch (error) {
            this.handleError(error);
        }
    }

    displayFeed(items) {
        // Clear loading message
        this.container.innerHTML = '';

        // Display up to maxItems
        items.slice(0, this.maxItems).forEach(item => {
            const date = new Date(item.pubDate);
            const formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }).toUpperCase();

            const article = document.createElement('article');
            article.className = 'news-item';
            article.innerHTML = `
                <div class="news-image">
                    <img src="${item.thumbnail || '/api/placeholder/400/300'}" alt="${item.title}">
                </div>
                <div class="news-content">
                    <div class="news-meta">
                        <span class="date">${formattedDate}</span>
                    </div>
                    <h3>${item.title}</h3>
                    <a href="${item.link}" class="read-more" target="_blank">Read more →</a>
                </div>
            `;

            this.container.appendChild(article);
        });
    }

    handleError(error) {
        this.container.innerHTML = `
            <div class="error-message">
                <p>Unable to load news feed. Please try again later.</p>
            </div>
        `;
        console.error('RSS Feed Error:', error);
    }
}

// Add some CSS for loading and error states
const style = document.createElement('style');
style.textContent = `
    .loading {
        text-align: center;
        padding: 2rem;
        grid-column: 1 / -1;
    }
    
    .error-message {
        text-align: center;
        padding: 2rem;
        color: var(--secondary-color);
        grid-column: 1 / -1;
    }
`;
document.head.appendChild(style);

// Initialize the RSS feed
document.addEventListener('DOMContentLoaded', () => {
    const rssFeed = new RSSFeed(
        'https://fetchrss.com/rss/673d9bf940c962a6d70e7832673d9bdaf3e3caec9a04c8e2.xml',
        'rss-feed',
        3  // This will show 3 latest news items
    );
    rssFeed.fetchFeed();
});