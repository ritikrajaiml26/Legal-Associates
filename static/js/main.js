/* ==========================================================================
   LexRP Advocates & Consultants
   "Royal Obsidian & Frosted Glass Touch" - JavaScript Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ============ 1. Top Scroll Progress Line ============
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress-bar';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (progressBar) {
            progressBar.style.width = scrolled + '%';
        }
    });

    // ============ 2. Mouse Spotlight Tracker on Glass Panels ============
    const glassPanels = document.querySelectorAll('.glass-panel, .practice-card, .core-value-card, .service-card-modern, .article-card, .advocate-card, .trust-box, .counter-card');
    glassPanels.forEach(panel => {
        panel.setAttribute('data-spotlight', 'true');
        panel.addEventListener('mousemove', (e) => {
            const rect = panel.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            panel.style.setProperty('--mouse-x', `${x}px`);
            panel.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // ============ 3. Navbar Scroll Transformation & Active Link Highlighter ============
    const navbar = document.querySelector('.lexrp-navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 40);
        });
    }

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.lexrp-navbar .nav-link');

    if (sections.length > 0 && navLinks.length > 0) {
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 120;
                const sectionHeight = section.offsetHeight;
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (current && link.getAttribute('href').includes(current)) {
                    link.classList.add('active');
                }
            });
        });
    }

    // ============ 4. Advanced Scroll Reveal Animations ============
    // Auto-assign staggered delays to children of .stagger-children
    document.querySelectorAll('.stagger-children').forEach(parent => {
        Array.from(parent.children).forEach((child, index) => {
            child.classList.add(`delay-${(index % 5) + 1}`);
            if (!child.classList.contains('reveal') &&
                !child.classList.contains('reveal-up') &&
                !child.classList.contains('reveal-left') &&
                !child.classList.contains('reveal-right') &&
                !child.classList.contains('reveal-scale')) {
                child.classList.add('reveal-up');
            }
        });
    });

    const revealSelector = '.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale';
    const revealElements = document.querySelectorAll(revealSelector);

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ============ 5. Smooth Animated Counters ============
    const counters = document.querySelectorAll('.counter-number');
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });
        counters.forEach(c => counterObserver.observe(c));
    }

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target'), 10) || 0;
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 2200;
        const startTime = performance.now();

        function easeOutExpo(t) {
            return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        }

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutExpo(progress);
            const currentValue = Math.floor(easedProgress * target);

            el.textContent = currentValue.toLocaleString() + suffix;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                el.textContent = target.toLocaleString() + suffix;
            }
        }

        requestAnimationFrame(updateCounter);
    }

    // ============ 6. 3D Card Tilt Effect ============
    const tiltCards = document.querySelectorAll('.trust-box, .practice-card, .core-value-card, .advocate-card, .article-card, [data-tilt]');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });

    // ============ 7. Back to Top Button ============
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('show', window.scrollY > 350);
        });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ============ 8. Smooth Anchor Scroll ============
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const id = this.getAttribute('href');
            if (id === '#' || id === '#!') return;
            const target = document.querySelector(id);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
                const navCollapse = document.querySelector('#navbarNav');
                if (navCollapse && navCollapse.classList.contains('show')) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
                    if (bsCollapse) bsCollapse.hide();
                }
            }
        });
    });

    // ============ 9. Assistant Callback Form Logic ============
    const asstForm = document.getElementById('assistant-form');
    const asstName = document.getElementById('asst-name');
    const asstMobile = document.getElementById('asst-mobile');
    const asstAddress = document.getElementById('asst-address');
    const asstSubmit = document.getElementById('asst-submit');

    function validateAssistantForm() {
        if (asstName && asstMobile && asstAddress && asstSubmit) {
            const allFilled = asstName.value.trim() !== '' &&
                               asstMobile.value.trim() !== '' &&
                               asstAddress.value.trim() !== '';
            asstSubmit.disabled = !allFilled;
        }
    }

    if (asstName) asstName.addEventListener('input', validateAssistantForm);
    if (asstMobile) asstMobile.addEventListener('input', validateAssistantForm);
    if (asstAddress) asstAddress.addEventListener('input', validateAssistantForm);

    if (asstForm) {
        asstForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = asstSubmit;
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i>Submitting...';
            btn.disabled = true;

            const formData = new FormData(asstForm);
            
            fetch('/api/consultations/assistant-call/', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': window.CSRF_TOKEN || ''
                },
                body: formData
            })
            .then(async response => {
                const data = await response.json();
                if (response.ok) {
                    showToast('Thank you! Our assistant will contact you shortly.', 'success');
                    asstForm.reset();
                    const modalEl = document.getElementById('assistantModal');
                    if (modalEl) {
                        const modal = bootstrap.Modal.getInstance(modalEl);
                        if (modal) modal.hide();
                    }
                } else {
                    let errMsg = 'Validation error occurred.';
                    if (data && typeof data === 'object') {
                        errMsg = Object.values(data).flat().join(' ');
                    }
                    showToast(errMsg, 'danger');
                }
            })
            .catch(error => {
                console.error('Error submitting assistant callback:', error);
                showToast('An error occurred. Please try again.', 'danger');
            })
            .finally(() => {
                btn.innerHTML = originalText;
                validateAssistantForm();
            });
        });
    }

    // ============ 10. Consultation Inquiry Form Logic ============
    const consultForm = document.getElementById('consultation-form');
    if (consultForm) {
        consultForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = consultForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i>Submitting...';
            btn.disabled = true;

            const formData = new FormData(consultForm);

            fetch('/api/consultations/inquiry/', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': window.CSRF_TOKEN || ''
                },
                body: formData
            })
            .then(async response => {
                const data = await response.json();
                if (response.ok) {
                    showToast('Your inquiry has been submitted. We will contact you soon!', 'success');
                    consultForm.reset();
                } else {
                    let errMsg = 'Validation error occurred.';
                    if (data && typeof data === 'object') {
                        errMsg = Object.values(data).flat().join(' ');
                    }
                    showToast(errMsg, 'danger');
                }
            })
            .catch(error => {
                console.error('Error submitting consultation inquiry:', error);
                showToast('An error occurred. Please try again.', 'danger');
            })
            .finally(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
            });
        });
    }

    // ============ 11. Toast Notification ============
    function showToast(message, type = 'success') {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) return;

        const toastId = 'toast-' + Date.now();
        const toastHtml = `
            <div id="${toastId}" class="toast align-items-center text-white bg-${type === 'success' ? 'success' : 'danger'} border-0 shadow-lg" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body d-flex align-items-center gap-2">
                        <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'} fs-5"></i>
                        <span>${message}</span>
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        `;

        toastContainer.insertAdjacentHTML('beforeend', toastHtml);
        const toastEl = document.getElementById(toastId);
        if (toastEl) {
            const toast = new bootstrap.Toast(toastEl, { delay: 5000 });
            toast.show();
            toastEl.addEventListener('hidden.bs.toast', () => {
                toastEl.remove();
            });
        }
    }
});
