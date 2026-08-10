/* =============================================================
   Portfolio — Main JavaScript
   Kube.io Aesthetic + Liquid Glass interactions
   ============================================================= */

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/* ── AOS Init ── */
AOS.init({
    duration: reducedMotion.matches ? 0 : 700,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    once: true,
    offset: 60,
});

/* ─────────────────────────────────────────
   THEME TOGGLE (Light / Dark)
───────────────────────────────────────── */
const html         = document.documentElement;
const themeToggle  = document.getElementById('theme-toggle');
const themeIcon    = document.getElementById('theme-icon');

// Restore saved theme
const savedTheme = localStorage.getItem('portfolio-theme') ||
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
    updateThemeIcon(next);
});

function updateThemeIcon(theme) {
    themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
}

/* ─────────────────────────────────────────
   MOBILE MENU
───────────────────────────────────────── */
const mobileMenuBtn  = document.getElementById('mobile-menu-btn');
const mobileMenu     = document.getElementById('mobile-menu');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('open');
        const icon   = mobileMenuBtn.querySelector('i');
        icon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
        mobileMenuBtn.setAttribute('aria-expanded', isOpen);
        mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    });

    // Close mobile menu on link click
    mobileMenu.querySelectorAll('.nav-mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            const icon = mobileMenuBtn.querySelector('i');
            icon.className = 'fas fa-bars';
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            mobileMenu.setAttribute('aria-hidden', 'true');
        });
    });

    document.addEventListener('keydown', e => {
        if (e.key !== 'Escape' || !mobileMenu.classList.contains('open')) return;
        mobileMenu.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        mobileMenuBtn.focus();
        mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
    });
}

/* ─────────────────────────────────────────
   SMOOTH SCROLLING
───────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const offset = 80;
        window.scrollTo({
            top: target.offsetTop - offset,
            behavior: reducedMotion.matches ? 'auto' : 'smooth',
        });
    });
});

/* ─────────────────────────────────────────
   ACTIVE NAV LINK ON SCROLL
───────────────────────────────────────── */
const sections     = document.querySelectorAll('section[id]');
const navLinks     = document.querySelectorAll('.nav-link');

function updateActiveNav() {
    let current = '';
    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 140) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        const isActive = link.dataset.section === current;
        link.classList.toggle('active', isActive);
        if (isActive) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
    });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();

/* ─────────────────────────────────────────
   AMBIENT ORBS — Subtle parallax on mouse move
───────────────────────────────────────── */
const orbs = document.querySelectorAll('.orb');

let mouseX = 0, mouseY = 0;
let orbX   = 0, orbY   = 0;
let rafOrb = null;

document.addEventListener('mousemove', e => {
    if (reducedMotion.matches || !isHoverDevice) return;
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 60;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 40;
    if (!rafOrb) rafOrb = requestAnimationFrame(animateOrbs);
});

function animateOrbs() {
    orbX += (mouseX - orbX) * 0.04;
    orbY += (mouseY - orbY) * 0.04;
    orbs.forEach((orb, i) => {
        const factor = (i + 1) * 0.35;
        orb.style.transform = `translate(${orbX * factor}px, ${orbY * factor}px)`;
    });
    rafOrb = null;
    if (Math.abs(mouseX - orbX) > 0.1 || Math.abs(mouseY - orbY) > 0.1) {
        rafOrb = requestAnimationFrame(animateOrbs);
    }
}

/* ─────────────────────────────────────────
   LIQUID GLASS — Card hover shimmer with
   dynamic gradient origin tracking
───────────────────────────────────────── */
const isHoverDevice = window.matchMedia('(hover: hover)').matches;

document.querySelectorAll('.glass').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x    = ((e.clientX - rect.left) / rect.width)  * 100;
        const y    = ((e.clientY - rect.top)  / rect.height) * 100;
        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);

        // Dynamic inner highlight follows cursor
        card.style.background = `radial-gradient(
            circle 180px at ${x}% ${y}%,
            var(--clr-shimmer) 0%,
            var(--clr-glass-bg) 70%
        )`;

        if (isHoverDevice && !reducedMotion.matches) {
            // Keep the physical cue subtle; content remains the focus.
            const xVal = (e.clientX - rect.left) / rect.width;
            const yVal = (e.clientY - rect.top)  / rect.height;
            const maxTilt = 2.5;
            const rotateY = ((xVal - 0.5) * maxTilt).toFixed(2);
            const rotateX = ((0.5 - yVal) * maxTilt).toFixed(2);

            // Faster transition on hover for direct tracking responsiveness
            card.style.transition = 'transform 0.08s ease-out, border-color 0.3s ease, background 0.1s ease';
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01) translateY(-2px)`;
        }
    });

    card.addEventListener('mouseleave', () => {
        // Slow transition back to center for organic spring feel
        card.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), border-color 0.3s ease, background 0.3s ease';
        card.style.transform = '';
        card.style.background = '';
    });
});

/* ─────────────────────────────────────────
   PROJECT FILTER
───────────────────────────────────────── */
const filterBtns   = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

// Assign unique view transition names to all project cards
projectCards.forEach((card, index) => {
    card.style.setProperty('view-transition-name', `project-card-${index}`);
});

filterBtns.forEach(btn => {
    btn.setAttribute('aria-pressed', btn.classList.contains('active') ? 'true' : 'false');

    btn.addEventListener('click', () => {
        // Update button state
        filterBtns.forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        const filter = btn.dataset.filter;

        const updateFilter = () => {
            projectCards.forEach(card => {
                const categories = card.dataset.category.split(' ');
                const show = filter === 'all' || categories.includes(filter);

                if (show) {
                    card.style.display = '';
                    card.style.opacity  = '1';
                    card.style.transform = '';
                } else {
                    card.style.display = 'none';
                    card.style.opacity  = '0';
                }
            });
        };

        if (document.startViewTransition) {
            document.startViewTransition(() => {
                updateFilter();
            });
        } else {
            // Fallback for older browsers (standard cross-fade with delay)
            projectCards.forEach(card => {
                const categories = card.dataset.category.split(' ');
                const show = filter === 'all' || categories.includes(filter);

                if (show) {
                    card.style.display = '';
                    void card.offsetHeight;
                    card.style.opacity  = '1';
                    card.style.transform = '';
                } else {
                    card.style.opacity  = '0';
                    card.style.transform = 'scale(0.96)';
                    setTimeout(() => {
                        if (card.style.opacity === '0') card.style.display = 'none';
                    }, 280);
                }
            });
        }
    });
});

/* ─────────────────────────────────────────
   CONTACT FORM
───────────────────────────────────────── */
const contactForm = document.getElementById('contact-form');
const formMsg     = document.getElementById('form-message');

if (contactForm) {
    contactForm.addEventListener('submit', e => {
        e.preventDefault();

        if (!contactForm.reportValidity()) return;

        const formData = new FormData(contactForm);
        const subject = encodeURIComponent(formData.get('subject'));
        const body = encodeURIComponent(
            `Name: ${formData.get('name')}\nEmail: ${formData.get('email')}\n\n${formData.get('message')}`
        );

        window.location.href = `mailto:garrendullas@gmail.com?subject=${subject}&body=${body}`;
        showFormMessage('Your email app is opening with the message ready to send.', 'success');
    });
}

function showFormMessage(text, type) {
    if (!formMsg) return;
    formMsg.textContent = text;
    formMsg.className   = `form-msg show ${type}`;
    setTimeout(() => {
        formMsg.className = 'form-msg';
    }, 6000);
}
