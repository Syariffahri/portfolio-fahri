// ===== Mobile Navigation =====
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        navToggle.setAttribute('aria-expanded', isOpen);
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return; // Skip if just "#"
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// ===== Counter Animation =====
const counters = document.querySelectorAll('.stat-number');
let animated = false;

const animateCounters = () => {
    if (animated) return;
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current);
            }
        }, 30);
    });
    animated = true;
};

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) animateCounters();
    });
}, { threshold: 0.5 });

counters.forEach(c => counterObserver.observe(c));

// ===== EmailJS with Spam Protection =====
emailjs.init('vQQiPTdxWlyBZkO7y');

let lastSubmitTime = 0;
const RATE_LIMIT_MS = 30000; // 30 seconds between submissions

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Honeypot check - if filled, it's a bot
        const honeypot = document.getElementById('website');
        if (honeypot && honeypot.value) {
            console.log('Spam detected');
            return;
        }

        // Rate limit check
        const now = Date.now();
        if (now - lastSubmitTime < RATE_LIMIT_MS) {
            const remaining = Math.ceil((RATE_LIMIT_MS - (now - lastSubmitTime)) / 1000);
            alert(`Please wait ${remaining} seconds before sending another message.`);
            return;
        }

        const btn = this.querySelector('button');
        const originalText = btn.textContent;
        btn.textContent = 'Sending...';
        btn.disabled = true;

        emailjs.send('service_e9j242k', 'template_fj1fvgx', {
            from_name: document.getElementById('name').value,
            from_email: document.getElementById('email').value,
            subject: document.getElementById('subject').value || 'Portfolio Contact',
            message: document.getElementById('message').value
        }).then(() => {
            lastSubmitTime = Date.now();
            btn.textContent = 'Sent ✓';
            btn.style.background = '#00D4AA';
            this.reset();
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.disabled = false;
            }, 3000);
        }).catch(() => {
            btn.textContent = 'Failed ✕';
            btn.style.background = '#ff4444';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.disabled = false;
            }, 3000);
        });
    });
}

// ===== Nav Background on Scroll =====
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        nav.style.background = 'rgba(248, 248, 248, 0.98)';
    } else {
        nav.style.background = 'rgba(248, 248, 248, 0.9)';
    }
});
