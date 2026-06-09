/* =============================================================
   Portfolio — Main JavaScript
   Kube.io Aesthetic + Liquid Glass interactions
   ============================================================= */

/* ── AOS Init ── */
AOS.init({
    duration: 700,
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
const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
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
    });

    // Close mobile menu on link click
    mobileMenu.querySelectorAll('.nav-mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            const icon = mobileMenuBtn.querySelector('i');
            icon.className = 'fas fa-bars';
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        });
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
            behavior: 'smooth',
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
        link.classList.toggle('active', link.dataset.section === current);
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

        if (isHoverDevice) {
            // Calculate 3D tilt angle (max 8 degrees)
            const xVal = (e.clientX - rect.left) / rect.width;
            const yVal = (e.clientY - rect.top)  / rect.height;
            const maxTilt = 8;
            const rotateY = ((xVal - 0.5) * maxTilt).toFixed(2);
            const rotateX = ((0.5 - yVal) * maxTilt).toFixed(2);

            // Faster transition on hover for direct tracking responsiveness
            card.style.transition = 'transform 0.08s ease-out, border-color 0.3s ease, background 0.1s ease';
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02) translateY(-4px)`;
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
    btn.addEventListener('click', () => {
        // Update button state
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

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
    contactForm.addEventListener('submit', async e => {
        e.preventDefault();

        const submitBtn   = contactForm.querySelector('[type="submit"]');
        const originalHTML = submitBtn.innerHTML;

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';

        try {
            // Simulate async submission (replace with real endpoint)
            await new Promise(resolve => setTimeout(resolve, 1200));

            showFormMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
            contactForm.reset();

        } catch {
            showFormMessage('Something went wrong. Please try again or email me directly.', 'error');
        } finally {
            submitBtn.disabled  = false;
            submitBtn.innerHTML = originalHTML;
        }
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
