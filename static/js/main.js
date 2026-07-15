/* ========================================
   LexRP Legal Associates & Consultants
   Complete JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ============ Navbar Scroll Effect ============
    const navbar = document.querySelector('.lexrp-navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // ============ Scroll Reveal Animations ============
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // ============ Back to Top Button ============
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('show', window.scrollY > 400);
        });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ============ Smooth Scrolling for Anchors ============
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const id = this.getAttribute('href');
            if (id === '#' || id === '#!') return;
            const target = document.querySelector(id);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
                // Close mobile nav if open
                const navCollapse = document.querySelector('#navbarNav');
                if (navCollapse && navCollapse.classList.contains('show')) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
                    if (bsCollapse) bsCollapse.hide();
                }
            }
        });
    });

    // ============ Assistant Callback Form Logic ============
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

    // ============ Consultation Form Logic ============
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

    // ============ Counter Animation ============
    const counters = document.querySelectorAll('.counter-number');
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach(c => counterObserver.observe(c));
    }

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target'));
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            el.textContent = Math.floor(current) + suffix;
        }, 16);
    }

    // ============ Toast Notification ============
    function showToast(message, type = 'success') {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) return;

        const toastEl = document.createElement('div');
        toastEl.className = `toast align-items-center text-bg-${type === 'success' ? 'dark' : 'danger'} border-0`;
        toastEl.setAttribute('role', 'alert');
        toastEl.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    <i class="fa-solid ${type === 'success' ? 'fa-check-circle text-success' : 'fa-exclamation-circle text-danger'} me-2"></i>
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;
        toastContainer.appendChild(toastEl);
        const toast = new bootstrap.Toast(toastEl, { delay: 4000 });
        toast.show();
        toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
    }

    // ============ Active Nav Link Highlighting ============
    const sections = document.querySelectorAll('section[id]');
    if (sections.length > 0) {
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 120;
                if (window.scrollY >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });
            document.querySelectorAll('.lexrp-navbar .nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        });
    }

});
