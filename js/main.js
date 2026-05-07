// Initialize AOS with minimal settings
AOS.init({
    duration: 600,
    easing: 'ease-out',
    once: true,
    offset: 50
});

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    // Close mobile menu when clicking on a link
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });
}

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Active Navigation Link on Scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveNav() {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= (sectionTop - 150)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('text-text-primary');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('text-text-primary');
        }
    });
}

window.addEventListener('scroll', updateActiveNav);
updateActiveNav();

// Project Filtering
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');
        
        projectCards.forEach(card => {
            const categories = card.getAttribute('data-category').split(' ');
            
            if (filterValue === 'all' || categories.includes(filterValue)) {
                card.style.display = '';
                card.style.opacity = '1';
            } else {
                card.style.display = 'none';
            }
        });
    });
});



// Contact Form Handling
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        try {
            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            console.log('Form submitted:', data);
            
            formMessage.textContent = 'Message sent successfully.';
            formMessage.classList.remove('hidden', 'text-red-400');
            formMessage.classList.add('text-accent');
            
            contactForm.reset();
            
            setTimeout(() => {
                formMessage.classList.add('hidden');
            }, 5000);
            
        } catch (error) {
            console.error('Error:', error);
            formMessage.textContent = 'Something went wrong. Please try again.';
            formMessage.classList.remove('hidden', 'text-accent');
            formMessage.classList.add('text-red-400');
        }
        
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}
