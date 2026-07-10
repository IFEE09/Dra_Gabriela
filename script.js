// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const nav = document.getElementById('nav');

if (mobileMenuBtn && nav) {
    mobileMenuBtn.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('active');
        mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });
}

// Header Scroll Effect
const header = document.getElementById('header');
if (header) {
    const updateHeaderScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', updateHeaderScroll, { passive: true });
    updateHeaderScroll();
}

// FAQ Accordion
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    question.setAttribute('aria-expanded', 'false'); // Init

    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all other items
        faqItems.forEach(otherItem => {
            otherItem.classList.remove('active');
            const otherQuestion = otherItem.querySelector('.faq-question');
            const otherAnswer = otherItem.querySelector('.faq-answer');
            if (otherQuestion) otherQuestion.setAttribute('aria-expanded', 'false');
            if (otherAnswer) otherAnswer.style.maxHeight = '';
        });

        // Toggle current item
        if (!isActive) {
            item.classList.add('active');
            question.setAttribute('aria-expanded', 'true');
            if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
        } else {
            question.setAttribute('aria-expanded', 'false');
        }
    });
});

// Recompute open FAQ height on resize/orientation change so answers never clip
window.addEventListener('resize', () => {
    document.querySelectorAll('.faq-item.active .faq-answer').forEach(answer => {
        answer.style.maxHeight = answer.scrollHeight + 'px';
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
            if (nav && mobileMenuBtn) {
                nav.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        }
    });
});

const initScrollAnimations = () => {
    const observerOptions = {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Selectores existentes + secciones y títulos para un reveal más amplio
    const targets = document.querySelectorAll(
        '.service-card, .expertise-card, .testimonial-card, .differentiator-card, .credentials-box, .location-card, .section-header, .section-title, .stat-card, .aeo-takeaway, [data-reveal]'
    );
    targets.forEach((el, i) => {
        el.classList.add('reveal-on-scroll');
        // Escalonado por grupos de 4 para tarjetas contiguas
        const d = (i % 4) + 1;
        el.classList.add('delay-' + d);
        observer.observe(el);
    });
};

// Contadores animados (estadísticas)
const initCounters = () => {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    if (!counters.length) return;

    const animateCount = (el) => {
        const target = parseFloat(el.getAttribute('data-target'));
        const suffix = el.getAttribute('data-suffix') || '';
        const prefix = el.getAttribute('data-prefix') || '';
        const duration = 1600;
        const start = performance.now();
        const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            // easeOutCubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.floor(eased * target);
            el.textContent = prefix + value.toLocaleString('es-MX') + suffix;
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = prefix + target.toLocaleString('es-MX') + suffix;
        };
        requestAnimationFrame(step);
    };

    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCount(entry.target);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => obs.observe(c));
};

const initVisualEnhancements = () => {
    initScrollAnimations();
    initCounters();
};

if ('requestIdleCallback' in window) {
    requestIdleCallback(initVisualEnhancements, { timeout: 2000 });
} else {
    setTimeout(initVisualEnhancements, 1);
}

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

        // Get form values
        const serviceEl = document.getElementById('service');
        const nameEl = document.getElementById('name');
        const phoneEl = document.getElementById('phone');
        const dateEl = document.getElementById('date');

        // Use security sanitization if available
        let service = serviceEl ? serviceEl.value : '';
        let name = nameEl ? nameEl.value : '';
        let phone = phoneEl ? phoneEl.value : '';
        let date = dateEl ? dateEl.value : '';

        // Apply security sanitization
        if (window.SecurityUtils && window.SecurityUtils.sanitize) {
            const sanitize = window.SecurityUtils.sanitize;

            // Sanitize name (required)
            name = sanitize.sanitizeName(name);
            if (!name) {
                alert('Por favor ingresa un nombre válido.');
                nameEl.focus();
                return;
            }

            // Sanitize phone (required)
            phone = sanitize.sanitizePhone(phone);
            if (!phone) {
                alert('Por favor ingresa un número de teléfono válido (mínimo 10 dígitos).');
                phoneEl.focus();
                return;
            }

            // Sanitize date (optional)
            if (date) {
                date = sanitize.sanitizeDate(date);
                if (!date) {
                    alert('Por favor selecciona una fecha válida (no puede ser en el pasado).');
                    dateEl.focus();
                    return;
                }
            }

            // Escape service for safety
            service = sanitize.escapeHTML(service);
        }

        // Build WhatsApp message with sanitized data
        const message = `Hola Dra. Gabriela B. Canché Escalante, me gustaría agendar una cita.%0A%0A*Nombre:* ${encodeURIComponent(name)}%0A*Servicio:* ${encodeURIComponent(service)}%0A*Teléfono:* ${encodeURIComponent(phone)}%0A*Fecha preferente:* ${encodeURIComponent(date || 'Por definir')}`;

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
    // Clone multiple times to ensure we have enough content to scroll smoothly without "cutting"
    // even on very wide screens.
    for (let i = 0; i < 3; i++) {
        slides.forEach(slide => {
            const clone = slide.cloneNode(true);
            sliderTrack.appendChild(clone);
        });
    }

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
    window.addEventListener('resize', calculateWidth, { passive: true });

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
    sliderTrack.addEventListener('touchstart', startDrag, { passive: true });
    window.addEventListener('touchmove', moveDrag, { passive: true });
    window.addEventListener('touchend', endDrag);

    // Pause on hover
    sliderTrack.addEventListener('mouseenter', () => { if (!isDragging) isPaused = true; });
    sliderTrack.addEventListener('mouseleave', () => { if (!isDragging) isPaused = false; });
}

// Lightbox — abrir con clic en miniatura, cerrar con X, Escape o clic en overlay/imagen
const galleryItems = document.querySelectorAll('.gallery-item');
const certSlides = document.querySelectorAll('.cert-slide img');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.querySelector('.lightbox-close');

const closeLightbox = () => {
    if (!lightbox || !lightboxImg) return;
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.src = '';
    lightboxImg.alt = '';
    if (lightboxCaption) lightboxCaption.textContent = '';
    document.body.style.overflow = '';
};

const openLightbox = (src, alt, caption) => {
    if (!lightbox || !lightboxImg) return;
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    if (lightboxCaption) {
        lightboxCaption.textContent = caption || alt || '';
    }
    document.body.style.overflow = 'hidden';
    if (lightboxClose) {
        lightboxClose.focus();
    }
};

if (lightbox && lightboxImg) {
    lightbox.setAttribute('aria-hidden', 'true');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (!img) return;

            const isSameImageOpen = lightbox.classList.contains('active') && lightboxImg.src === img.src;
            if (isSameImageOpen) {
                closeLightbox();
                return;
            }

            openLightbox(img.src, img.alt, item.dataset.caption || img.alt);
        });
    });

    certSlides.forEach(img => {
        img.addEventListener('click', () => {
            const isSameImageOpen = lightbox.classList.contains('active') && lightboxImg.src === img.src;
            if (isSameImageOpen) {
                closeLightbox();
                return;
            }
            openLightbox(img.src, img.alt, img.alt);
        });
    });

    document.querySelectorAll('.js-lightbox-trigger').forEach(trigger => {
        const openFromTrigger = () => {
            const img = trigger.querySelector('img');
            if (!img) return;

            const isSameImageOpen = lightbox.classList.contains('active') && lightboxImg.src === img.src;
            if (isSameImageOpen) {
                closeLightbox();
                return;
            }

            openLightbox(img.src, img.alt, img.alt);
        };

        trigger.addEventListener('click', openFromTrigger);
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeLightbox();
        });
    }

    lightboxImg.addEventListener('click', (e) => {
        e.stopPropagation();
        closeLightbox();
    });

    if (lightboxCaption) {
        lightboxCaption.addEventListener('click', closeLightbox);
    }

    lightbox.addEventListener('click', () => {
        closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

// Hero Slider — 3 categorías (mapeo endometriosis)
const heroSlider = document.getElementById('heroSliderTrack');
if (heroSlider) {
    const slides = heroSlider.querySelectorAll('.hero-slider__slide');
    const dots = document.querySelectorAll('.hero-slider__dot');
    const total = slides.length;
    let current = 0;
    let autoplayTimer = null;
    let touchStartX = 0;
    let touchDeltaX = 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const autoplayMs = 6500;
    const sliderSection = heroSlider.closest('.hero-slider');

    const goToSlide = (index) => {
        if (total === 0) return;
        current = (index + total) % total;
        heroSlider.style.transform = `translateX(-${current * 100}%)`;

        slides.forEach((slide, i) => {
            const isActive = i === current;
            slide.classList.toggle('is-active', isActive);
            slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
        });

        dots.forEach((dot, i) => {
            const isActive = i === current;
            dot.classList.toggle('is-active', isActive);
            dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
    };

    const nextSlide = () => goToSlide(current + 1);
    const prevSlide = () => goToSlide(current - 1);

    const stopAutoplay = () => {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
            autoplayTimer = null;
        }
    };

    const startAutoplay = () => {
        stopAutoplay();
        if (prefersReducedMotion || total <= 1) return;
        autoplayTimer = setInterval(nextSlide, autoplayMs);
    };

    dots.forEach((dot) => {
        dot.addEventListener('click', () => {
            goToSlide(Number(dot.dataset.slide));
            startAutoplay();
        });
    });

    const prevBtn = sliderSection?.querySelector('.hero-slider__arrow--prev');
    const nextBtn = sliderSection?.querySelector('.hero-slider__arrow--next');

    prevBtn?.addEventListener('click', () => {
        prevSlide();
        startAutoplay();
    });

    nextBtn?.addEventListener('click', () => {
        nextSlide();
        startAutoplay();
    });

    if (sliderSection) {
        sliderSection.addEventListener('mouseenter', stopAutoplay);
        sliderSection.addEventListener('mouseleave', startAutoplay);

        sliderSection.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchDeltaX = 0;
            stopAutoplay();
        }, { passive: true });

        sliderSection.addEventListener('touchmove', (e) => {
            touchDeltaX = e.changedTouches[0].screenX - touchStartX;
        }, { passive: true });

        sliderSection.addEventListener('touchend', () => {
            if (Math.abs(touchDeltaX) > 50) {
                if (touchDeltaX < 0) nextSlide();
                else prevSlide();
            }
            startAutoplay();
        }, { passive: true });
    }

    goToSlide(0);
    startAutoplay();
}
