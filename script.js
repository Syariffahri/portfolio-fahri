const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

/* ---------- Nav ---------- */
if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('active');
        navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    navMenu.querySelectorAll('a').forEach(link => {
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
        const top = target.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});

const nav = document.querySelector('.nav');
const navLinks = [...document.querySelectorAll('.nav-menu a:not(.nav-cta)')];
const sections = navLinks.map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);
const onScroll = () => {
    if (nav) nav.classList.toggle('nav-scrolled', window.scrollY > 30);
    let current = null;
    sections.forEach(s => { if (s.getBoundingClientRect().top < 140) current = s.id; });
    navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Reveal on scroll ---------- */
const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 70}ms`;
    io.observe(el);
});

/* ---------- Counters ---------- */
const countIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target, end = +el.dataset.count;
        const t0 = performance.now();
        const tick = now => {
            const p = Math.min((now - t0) / 1400, 1);
            el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
            if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        countIO.unobserve(el);
    });
}, { threshold: 0.6 });
document.querySelectorAll('[data-count]').forEach(el => countIO.observe(el));

/* ---------- Terminal typing ---------- */
const term = document.getElementById('terminal');
const lines = [
    ['$ ', 't-ok', 'whoami'],
    ['', '', 'Senior Flutter Developer · 5+ yrs'],
    ['$ ', 't-ok', 'flutter build --platforms'],
    ['', 't-v', '✓ android  ✓ ios  ✓ web'],
    ['$ ', 't-ok', 'stack --list'],
    ['', '', 'Flutter · Firebase · Supabase · REST'],
    ['', 't-ok', '✓ Shipped to production.']
];
if (term) {
    if (prefersReduced) {
        term.innerHTML = lines.map(([p, c, t]) => `<span class="t-muted">${p}</span><span class="${c}">${t}</span>`).join('\n');
    } else {
        let li = 0, ci = 0, html = '';
        const type = () => {
            if (li >= lines.length) { term.innerHTML = html + '<span class="caret"></span>'; return; }
            const [p, c, t] = lines[li];
            ci++;
            term.innerHTML = html + `<span class="t-muted">${p}</span><span class="${c}">${t.slice(0, ci)}</span><span class="caret"></span>`;
            if (ci >= t.length) {
                html += `<span class="t-muted">${p}</span><span class="${c}">${t}</span>\n`;
                li++; ci = 0;
                setTimeout(type, p ? 260 : 120);
            } else setTimeout(type, p ? 45 : 14);
        };
        setTimeout(type, 700);
    }
}

/* ---------- Pointer effects ---------- */
if (finePointer && !prefersReduced) {
    const glow = document.querySelector('.cursor-glow');
    window.addEventListener('pointermove', e => {
        if (glow) { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; }
    }, { passive: true });

    document.querySelectorAll('[data-tilt]').forEach(card => {
        card.addEventListener('pointermove', e => {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
            card.style.setProperty('--mx', `${x * 100}%`);
            card.style.setProperty('--my', `${y * 100}%`);
            card.style.transform = `perspective(1200px) rotateX(${(0.5 - y) * 3}deg) rotateY(${(x - 0.5) * 3}deg)`;
        });
        card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });

    const phone = document.getElementById('heroPhone');
    const hero = document.getElementById('home');
    if (phone && hero) {
        hero.addEventListener('pointermove', e => {
            const r = hero.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
            phone.style.transform = `perspective(1000px) rotateY(${x * 14}deg) rotateX(${-y * 10}deg)`;
        });
        hero.addEventListener('pointerleave', () => { phone.style.transform = ''; });
    }

    const preview = document.getElementById('preview');
    document.querySelectorAll('[data-preview]').forEach(row => {
        row.addEventListener('pointerenter', () => {
            preview.style.backgroundImage = `url('${row.dataset.preview}')`;
            preview.classList.add('show');
        });
        row.addEventListener('pointermove', e => {
            preview.style.left = e.clientX + 'px';
            preview.style.top = e.clientY + 'px';
        });
        row.addEventListener('pointerleave', () => preview.classList.remove('show'));
    });
}

/* ---------- dp cursor (logical pixels, like Flutter) ---------- */
const dpCursor = document.getElementById('dpCursor');
const dpLabel = document.getElementById('dpLabel');
if (dpCursor && finePointer && !prefersReduced) {
    const dpr = window.devicePixelRatio || 1;
    window.addEventListener('pointermove', e => {
        dpCursor.classList.add('on');
        dpCursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        const tappable = e.target.closest('a, button, input, textarea');
        dpCursor.classList.toggle('tap', !!tappable);
        dpLabel.textContent = tappable
            ? (tappable.matches('input, textarea') ? 'TextField()' : 'onTap()')
            : `${Math.round(e.clientX)}, ${Math.round(e.clientY)} dp · ${dpr}x`;
    }, { passive: true });
    document.addEventListener('pointerleave', () => dpCursor.classList.remove('on'));
}

/* ---------- Hot reload easter egg ---------- */
const toast = document.getElementById('toast');
let toastTimer;
const showToast = html => {
    if (!toast) return;
    toast.innerHTML = html;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
};
const hotReload = () => {
    const t0 = performance.now();
    document.body.classList.remove('reloading');
    void document.body.offsetWidth;
    document.body.classList.add('reloading');
    document.querySelectorAll('.reveal').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) {
            el.classList.remove('in');
            void el.offsetWidth;
            requestAnimationFrame(() => el.classList.add('in'));
        }
    });
    const ms = Math.round(performance.now() - t0 + 180 + Math.random() * 120);
    showToast(`⚡ Performing hot reload… <b>Reloaded 1 of 1 libraries in ${ms}ms.</b>`);
};
document.getElementById('hotReload')?.addEventListener('click', hotReload);
window.addEventListener('keydown', e => {
    if (e.key !== 'r' || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.target.closest('input, textarea, [contenteditable]')) return;
    hotReload();
});

/* ---------- Contact (EmailJS) ---------- */
if (typeof emailjs !== 'undefined') emailjs.init('vQQiPTdxWlyBZkO7y');
window.addEventListener('load', () => { if (typeof emailjs !== 'undefined') emailjs.init('vQQiPTdxWlyBZkO7y'); });

const contactForm = document.getElementById('contactForm');
let lastSubmitTime = 0;
if (contactForm) {
    contactForm.addEventListener('submit', event => {
        event.preventDefault();
        const honeypot = document.getElementById('website');
        if (honeypot && honeypot.value.trim() !== '') return;
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
