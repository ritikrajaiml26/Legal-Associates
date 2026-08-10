/* ==========================================================================
   LexRP Law Firm
   "Royal Obsidian & 8D Liquid Glass Water Touch" - 3D/8D Animation Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ============ 0. Theme Toggle (Dark / Day Water Glass Mode) ============
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = document.getElementById('theme-icon');
    const htmlEl = document.documentElement;

    // Load saved theme preference
    const savedTheme = localStorage.getItem('lexrp_theme') || 'dark';
    setTheme(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlEl.getAttribute('data-theme') || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
        });
    }

    function setTheme(theme) {
        htmlEl.setAttribute('data-theme', theme);
        localStorage.setItem('lexrp_theme', theme);
        if (themeIcon) {
            if (theme === 'light') {
                themeIcon.className = 'fa-solid fa-sun text-warning';
                themeToggleBtn.title = 'Switch to Dark Mode';
            } else {
                themeIcon.className = 'fa-solid fa-moon text-gold-bright';
                themeToggleBtn.title = 'Switch to Day Glass Water Mode';
            }
        }
    }

    // ============ 1. Cinematic 3D/6D Intro Splash Screen (4 Seconds) ============
    const splash = document.getElementById('cinematic-intro-splash');
    if (splash) {
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';

        setTimeout(() => {
            splash.classList.add('fade-out');
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';

            setTimeout(() => {
                triggerScrollReveals();
            }, 300);
        }, 4000);
    }

    // ============ 2. Top Scroll Progress Line ============
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress-bar';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / (height || 1)) * 100;
        if (progressBar) {
            progressBar.style.width = scrolled + '%';
        }
    });

    // ============ 3. Three.js Interactive 3D WebGL Background ============
    const canvas3D = document.getElementById('webgl-3d-canvas');
    if (canvas3D && typeof THREE !== 'undefined') {
        initThreeJSWebGL(canvas3D);
    }

    function initThreeJSWebGL(canvas) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 9;

        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const group3D = new THREE.Group();
        scene.add(group3D);

        // 1. Central Floating 3D Gold Geometry (Icosahedron Wireframe)
        const icoGeo = new THREE.IcosahedronGeometry(2.8, 1);
        const icoMat = new THREE.MeshBasicMaterial({
            color: 0xd4af37,
            wireframe: true,
            transparent: true,
            opacity: 0.25
        });
        const mainMesh = new THREE.Mesh(icoGeo, icoMat);
        group3D.add(mainMesh);

        // Inner solid core
        const coreGeo = new THREE.OctahedronGeometry(1.4, 0);
        const coreMat = new THREE.MeshBasicMaterial({
            color: 0xffd700,
            wireframe: true,
            transparent: true,
            opacity: 0.4
        });
        const coreMesh = new THREE.Mesh(coreGeo, coreMat);
        group3D.add(coreMesh);

        // 2. Floating Orbiting 3D Legal Polyhedra Rings
        const torusGeo = new THREE.TorusGeometry(4.2, 0.03, 16, 100);
        const torusMat = new THREE.MeshBasicMaterial({
            color: 0xd4af37,
            transparent: true,
            opacity: 0.2
        });
        const torusRing1 = new THREE.Mesh(torusGeo, torusMat);
        torusRing1.rotation.x = Math.PI / 3;
        group3D.add(torusRing1);

        const torusRing2 = new THREE.Mesh(torusGeo, torusMat);
        torusRing2.rotation.y = Math.PI / 4;
        group3D.add(torusRing2);

        // 3. 3D Particle Starfield
        const particleCount = 380;
        const particleGeo = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 35;
            positions[i + 1] = (Math.random() - 0.5) * 35;
            positions[i + 2] = (Math.random() - 0.5) * 25;
        }

        particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const particleMat = new THREE.PointsMaterial({
            color: 0xffd700,
            size: 0.11,
            transparent: true,
            opacity: 0.55
        });
        const particleSystem = new THREE.Points(particleGeo, particleMat);
        scene.add(particleSystem);

        let scrollY = 0;
        let targetScrollY = 0;
        let mouseX = 0;
        let mouseY = 0;

        window.addEventListener('scroll', () => {
            targetScrollY = window.scrollY;
        });

        window.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 0.8;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 0.8;
        });

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        function animate() {
            requestAnimationFrame(animate);

            scrollY += (targetScrollY - scrollY) * 0.05;

            mainMesh.rotation.x += 0.003;
            mainMesh.rotation.y += 0.005;

            coreMesh.rotation.x -= 0.004;
            coreMesh.rotation.y -= 0.006;

            torusRing1.rotation.z += 0.002;
            torusRing2.rotation.z -= 0.002;

            group3D.rotation.y = scrollY * 0.0015 + mouseX;
            group3D.rotation.x = scrollY * 0.001 + mouseY;
            group3D.position.y = -scrollY * 0.0025;

            particleSystem.rotation.y = scrollY * 0.0005;

            renderer.render(scene, camera);
        }

        animate();
    }

    // ============ 4. 8D Liquid Water Ripple & Caustics Animation Canvas ============
    const waterCanvas = document.getElementById('water-canvas');
    if (waterCanvas) {
        init8DWaterAnimation(waterCanvas);
    }

    function init8DWaterAnimation(canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        let step = 0;

        function drawWater() {
            requestAnimationFrame(drawWater);
            ctx.clearRect(0, 0, width, height);

            step += 0.015;
            const isLightMode = htmlEl.getAttribute('data-theme') === 'light';

            // Water Wave 1
            ctx.beginPath();
            for (let x = 0; x <= width; x += 15) {
                const y = Math.sin(x * 0.008 + step) * 22 + Math.cos(x * 0.004 + step * 1.5) * 15 + height * 0.45;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.strokeStyle = isLightMode ? 'rgba(56, 189, 248, 0.18)' : 'rgba(212, 175, 55, 0.12)';
            ctx.lineWidth = 3;
            ctx.stroke();

            // Water Wave 2 (Caustics Reflection Layer)
            ctx.beginPath();
            for (let x = 0; x <= width; x += 18) {
                const y = Math.cos(x * 0.006 - step * 1.2) * 28 + Math.sin(x * 0.003 - step) * 18 + height * 0.55;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.strokeStyle = isLightMode ? 'rgba(14, 165, 233, 0.15)' : 'rgba(255, 215, 0, 0.1)';
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        drawWater();
    }

    // ============ 5. Mouse Spotlight Tracker on Glass Panels ============
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

    // ============ 6. Navbar Scroll Transformation & Active Link Highlighter ============
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

    // ============ 7. Advanced 3D Scroll Reveal Animations ============
    document.querySelectorAll('.stagger-children').forEach(parent => {
        Array.from(parent.children).forEach((child, index) => {
            child.classList.add(`delay-${(index % 5) + 1}`);
            if (!child.classList.contains('reveal') &&
                !child.classList.contains('reveal-up') &&
                !child.classList.contains('reveal-left') &&
                !child.classList.contains('reveal-right') &&
                !child.classList.contains('reveal-scale') &&
                !child.classList.contains('reveal-3d-up')) {
                child.classList.add('reveal-3d-up');
            }
        });
    });

    const revealSelector = '.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale, .reveal-3d-up, .reveal-3d-left, .reveal-3d-right, .reveal-3d-scale';
    
    function triggerScrollReveals() {
        const revealElements = document.querySelectorAll(revealSelector);
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.92) {
                el.classList.add('visible');
            }
        });
    }

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

    // ============ 8. Smooth Animated Counters ============
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

    // ============ 9. Dynamic 3D Perspective Tilt Effect ============
    const tiltCards = document.querySelectorAll('.trust-box, .practice-card, .core-value-card, .advocate-card, .article-card, [data-tilt]');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(30px) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) translateY(0px)';
        });
    });

    // ============ 10. Back to Top Button ============
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('show', window.scrollY > 350);
        });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ============ 11. Smooth Anchor Scroll ============
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

    // ============ 12. Assistant Callback Form Logic ============
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

    // ============ 13. Consultation Inquiry Form Logic ============
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

    // ============ 14. Toast Notification ============
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
