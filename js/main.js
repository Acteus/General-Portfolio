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
const themeContent = document.querySelectorAll('[data-content-theme]');

function syncThemeContent(theme) {
    const normalizedTheme = theme === 'light' ? 'light' : 'dark';
    themeContent.forEach(fragment => {
        fragment.hidden = fragment.dataset.contentTheme !== normalizedTheme;
    });
}

// Restore saved theme
const savedTheme = localStorage.getItem('portfolio-theme') ||
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
const initialTheme = savedTheme === 'light' ? 'light' : 'dark';
html.setAttribute('data-theme', initialTheme);
syncThemeContent(initialTheme);
updateThemeIcon(initialTheme);

function enhanceProjectNotebook(root) {
    return window.PortfolioJournal.createJournalFlipController(root, {
        motionMedia: reducedMotion,
        getTheme: () => html.getAttribute('data-theme'),
        history: window.history,
        location: window.location,
    });
}

const projectNotebook = document.querySelector('.project-notebook');
const projectJournalController = projectNotebook
    ? enhanceProjectNotebook(projectNotebook)
    : null;

themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    if (next === 'dark') projectJournalController?.cancelForEnvironmentChange();
    html.setAttribute('data-theme', next);
    syncThemeContent(next);
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
        const hash = this.getAttribute('href');
        if (hash.startsWith('#note-')) return;
        const target = document.querySelector(hash);
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
   HERO PARTICLES — Ambient field, not cursor toy
───────────────────────────────────────── */
const particleCanvas = document.getElementById('hero-particles');
const heroSection = document.getElementById('home');
const hoverCapable = window.matchMedia('(hover: hover)').matches;
const MAX_FIELD_DRIFT = 10;

if (particleCanvas && heroSection && !reducedMotion.matches) {
    const context = particleCanvas.getContext('2d');
    const particles = [];
    const connectionDistance = 104;
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let frameId = null;
    let fieldX = 0;
    let fieldY = 0;
    let targetFieldX = 0;
    let targetFieldY = 0;
    let running = true;

    function makeParticle() {
        return {
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.12,
            vy: (Math.random() - 0.5) * 0.12,
            radius: Math.random() * 0.8 + 0.45,
        };
    }

    function resizeParticles() {
        const bounds = heroSection.getBoundingClientRect();
        width = Math.max(1, bounds.width);
        height = Math.max(1, bounds.height);
        pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
        particleCanvas.width = Math.round(width * pixelRatio);
        particleCanvas.height = Math.round(height * pixelRatio);

        const count = width < 768 ? 28 : 58;
        particles.length = 0;
        for (let index = 0; index < count; index += 1) particles.push(makeParticle());
    }

    function updateParticle(particle) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.x < -8) particle.x = width + 8;
        if (particle.x > width + 8) particle.x = -8;
        if (particle.y < -8) particle.y = height + 8;
        if (particle.y > height + 8) particle.y = -8;
    }

    function drawParticles() {
        if (!running) {
            frameId = null;
            return;
        }

        fieldX += (targetFieldX - fieldX) * 0.035;
        fieldY += (targetFieldY - fieldY) * 0.035;
        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        context.clearRect(0, 0, width, height);
        context.save();
        context.translate(fieldX, fieldY);

        const color = getComputedStyle(document.documentElement)
            .getPropertyValue('--particle-rgb')
            .trim();

        particles.forEach(updateParticle);
        for (let from = 0; from < particles.length; from += 1) {
            for (let to = from + 1; to < particles.length; to += 1) {
                const deltaX = particles[from].x - particles[to].x;
                const deltaY = particles[from].y - particles[to].y;
                const distance = Math.hypot(deltaX, deltaY);
                if (distance > connectionDistance) continue;

                context.beginPath();
                context.moveTo(particles[from].x, particles[from].y);
                context.lineTo(particles[to].x, particles[to].y);
                context.strokeStyle = `rgba(${color}, ${(1 - distance / connectionDistance) * 0.11})`;
                context.lineWidth = 0.5;
                context.stroke();
            }
        }

        particles.forEach(particle => {
            context.beginPath();
            context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            context.fillStyle = `rgba(${color}, 0.48)`;
            context.fill();
        });

        context.restore();
        frameId = requestAnimationFrame(drawParticles);
    }

    function setFieldTarget(event) {
        if (!hoverCapable) return;
        const bounds = heroSection.getBoundingClientRect();
        targetFieldX = ((event.clientX - bounds.left) / bounds.width - 0.5) * MAX_FIELD_DRIFT * 2;
        targetFieldY = ((event.clientY - bounds.top) / bounds.height - 0.5) * MAX_FIELD_DRIFT * 2;
    }

    function resetFieldTarget() {
        targetFieldX = 0;
        targetFieldY = 0;
    }

    function syncParticleMotion() {
        running = !reducedMotion.matches && !document.hidden;
        if (!running && frameId) {
            cancelAnimationFrame(frameId);
            frameId = null;
        }
        if (running && !frameId) frameId = requestAnimationFrame(drawParticles);
    }

    resizeParticles();
    heroSection.addEventListener('pointermove', setFieldTarget, { passive: true });
    heroSection.addEventListener('pointerleave', resetFieldTarget, { passive: true });
    window.addEventListener('resize', resizeParticles, { passive: true });
    document.addEventListener('visibilitychange', syncParticleMotion);
    reducedMotion.addEventListener('change', syncParticleMotion);
    frameId = requestAnimationFrame(drawParticles);
}

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
