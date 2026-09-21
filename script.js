const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('active');
        navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', event => {
        const href = anchor.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        event.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 82;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});

const nav = document.querySelector('.nav');
const updateNav = () => {
    if (nav) nav.classList.toggle('nav-scrolled', window.scrollY > 30);
};
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

if (typeof emailjs !== 'undefined') emailjs.init('vQQiPTdxWlyBZkO7y');

const contactForm = document.getElementById('contactForm');
let lastSubmitTime = 0;
if (contactForm) {
    contactForm.addEventListener('submit', event => {
        event.preventDefault();
        const honeypot = document.getElementById('website');
        if (honeypot && honeypot.value.trim() !== '') {
            return;
        }
        if (typeof emailjs === 'undefined') {
            alert('The contact service is currently unavailable. Please email me directly.');
            return;
        }
        const now = Date.now();
        if (now - lastSubmitTime < 30000) {
            alert(`Please wait ${Math.ceil((30000 - (now - lastSubmitTime)) / 1000)} seconds before sending another message.`);
            return;
        }
        const button = contactForm.querySelector('button');
        const originalText = button.innerHTML;
        button.disabled = true;
        button.textContent = 'Sending...';
        emailjs.send('service_e9j242k', 'template_fj1fvgx', {
            from_name: document.getElementById('name').value,
            from_email: document.getElementById('email').value,
            subject: document.getElementById('subject').value || 'Portfolio Contact',
            message: document.getElementById('message').value
        }).then(() => {
            lastSubmitTime = Date.now();
            button.textContent = 'Message sent ✓';
            contactForm.reset();
            setTimeout(() => { button.innerHTML = originalText; button.disabled = false; }, 3000);
        }).catch(() => {
            button.textContent = 'Failed — email me directly';
            setTimeout(() => { button.innerHTML = originalText; button.disabled = false; }, 3000);
        });
    });
}
