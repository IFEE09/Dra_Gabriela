// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const nav = document.getElementById('nav');

mobileMenuBtn.addEventListener('click', () => {
    nav.classList.toggle('active');
    const icon = mobileMenuBtn.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
});

// Header Scroll Effect
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// FAQ Accordion
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all other items
        faqItems.forEach(otherItem => {
            otherItem.classList.remove('active');
        });

        // Toggle current item
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

            // Close mobile menu if open
            nav.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card, .expertise-card, .testimonial-card, .differentiator-card, .credentials-box, .location-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Modal Logic
const modal = document.getElementById('bookingModal');
const openModalBtns = document.querySelectorAll('.js-open-modal');
const closeModalBtn = document.getElementById('closeModal');
const bookingForm = document.getElementById('bookingForm');

// Open Modal
if (openModalBtns) {
    openModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
}

// Close Modal Function
const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
};

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
}

// Close on backdrop click
if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('modal-backdrop')) {
            closeModal();
        }
    });
}

// Handle Form Submission
if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const service = document.getElementById('service').value;
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const date = document.getElementById('date').value;

        const message = `Hola Dra. Gabriela, me gustaría agendar una cita.%0A%0A*Nombre:* ${name}%0A*Servicio:* ${service}%0A*Teléfono:* ${phone}%0A*Fecha preferente:* ${date || 'Por definir'}`;

        const whatsappUrl = `https://wa.me/529992010898?text=${message}`;

        window.open(whatsappUrl, '_blank');
        closeModal();
        bookingForm.reset();
    });
}

// Testimonials Infinite Scroll & Drag Logic
const sliderTrack = document.querySelector('.testimonials-track');
const slides = document.querySelectorAll('.testimonial-slide');

if (sliderTrack && slides.length > 0) {
    // 1. Setup Clones for Infinite Loop
    slides.forEach(slide => {
        const clone = slide.cloneNode(true);
        sliderTrack.appendChild(clone);
    });

    // 2. Variables
    let currentX = 0;
    let speed = window.innerWidth <= 768 ? 1.6 : 0.5; // 1.6px mobile, 0.5px desktop

    // Update speed on resize
    window.addEventListener('resize', () => {
        speed = window.innerWidth <= 768 ? 1.6 : 0.5;
    });
    let isDragging = false;
    let startX = 0;
    let lastX = 0;
    let animationId;
    let isPaused = false;

    // The width of the original set of slides (plus gaps)
    let singleSetWidth = 0;

    function calculateWidth() {
        if (slides.length > 0) {
            const slideWidth = slides[0].offsetWidth;
            const gap = window.innerWidth <= 768 ? 40 : 30; // Mobile has 40px gap, Desktop 30px
            singleSetWidth = (slideWidth + gap) * slides.length;
        }
    }

    // Initial Calc
    setTimeout(calculateWidth, 100);
    window.addEventListener('resize', calculateWidth);

    // 3. Animation Loop
    function animate() {
        if (!isDragging && !isPaused) {
            currentX -= speed;

            // Loop Logic: Reset when entire set has scrolled
            if (Math.abs(currentX) >= singleSetWidth && singleSetWidth > 0) {
                currentX += singleSetWidth;
            }
        }

        sliderTrack.style.transform = `translateX(${currentX}px)`;
        animationId = requestAnimationFrame(animate);
    }

    // Start Animation
    animate();

    // 4. Interaction Events (Mouse & Touch)
    const startDrag = (e) => {
        isDragging = true;
        isPaused = true;
        startX = e.pageX || e.touches[0].pageX;
        lastX = currentX;
        sliderTrack.style.cursor = 'grabbing';
    };

    const moveDrag = (e) => {
        if (!isDragging) return;
        const x = e.pageX || e.touches[0].pageX;
        const diff = x - startX;
        currentX = lastX + diff;
    };

    const endDrag = () => {
        isDragging = false;
        isPaused = false;
        sliderTrack.style.cursor = 'grab';
    };

    // Mouse Events
    sliderTrack.addEventListener('mousedown', startDrag);
    window.addEventListener('mousemove', moveDrag);
    window.addEventListener('mouseup', endDrag);

    // Touch Events
    sliderTrack.addEventListener('touchstart', startDrag);
    window.addEventListener('touchmove', moveDrag);
    window.addEventListener('touchend', endDrag);

    // Pause on hover
    sliderTrack.addEventListener('mouseenter', () => { if (!isDragging) isPaused = true; });
    sliderTrack.addEventListener('mouseleave', () => { if (!isDragging) isPaused = false; });
}
