/* ==========================================================================
   LexRP Law Firm
   "Royal Obsidian & Sky Blue 8D Water Glass Touch" - Animation Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ============ 0. Theme Toggle (Dark / Sky Blue Day Water Glass Mode) ============
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
                themeToggleBtn.title = 'Switch to Sky Blue Day Mode';
            }
        }
    }

    // ============ 1. GSAP Setup & Utilities ============
    gsap.registerPlugin(ScrollTrigger);

    // ============ 1.5 Custom Cinematic Cursor (Desktop Only) ============
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');
    
    if (cursorDot && cursorRing && !window.matchMedia("(hover: none)").matches && window.innerWidth > 768) {
        document.body.classList.add('custom-cursor-active');
        
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let dotX = mouseX;
        let dotY = mouseY;
        let ringX = mouseX;
        let ringY = mouseY;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        gsap.ticker.add(() => {
            // Smooth lerping
            dotX += (mouseX - dotX) * 0.5;
            dotY += (mouseY - dotY) * 0.5;
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;

            gsap.set(cursorDot, { x: dotX, y: dotY });
            gsap.set(cursorRing, { x: ringX, y: ringY });
        });

        // Hover states for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .glass-panel, input, textarea, select, .trust-box');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursorRing.classList.add('hovered'));
            el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovered'));
        });
    }

    // Lightweight DOM-aware text splitter (preserves HTML structure)
    function splitTextNodes(element) {
        const nodes = Array.from(element.childNodes);
        nodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent;
                if (!text.trim()) return;
                
                const fragment = document.createDocumentFragment();
                const words = text.split(/(\s+)/);
                
                words.forEach(word => {
                    if (word.trim() === '') {
                        fragment.appendChild(document.createTextNode(word));
                    } else {
                        const wordSpan = document.createElement('span');
                        wordSpan.style.display = 'inline-block';
                        wordSpan.style.overflow = 'hidden';
                        wordSpan.style.verticalAlign = 'bottom';
                        // wordSpan.style.marginRight = '0.15em'; // Optional if not splitting by \s+
                        
                        const innerSpan = document.createElement('span');
                        innerSpan.innerText = word;
                        innerSpan.style.display = 'inline-block';
                        innerSpan.style.transform = 'translateY(110%)';
                        innerSpan.classList.add('gsap-word-inner');
                        
                        wordSpan.appendChild(innerSpan);
                        fragment.appendChild(wordSpan);
                    }
                });
                element.replaceChild(fragment, node);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                splitTextNodes(node);
            }
        });
    }

    function splitTextToSpans(selector) {
        document.querySelectorAll(selector).forEach(el => {
            el.style.opacity = '1';
            splitTextNodes(el);
        });
        return document.querySelectorAll(`${selector} .gsap-word-inner`);
    }

    // ============ 2. Cinematic Intro & Hero Timeline ============
    const splash = document.getElementById('cinematic-intro-splash');
    
    window.threeJsReady = new Promise((resolve) => {
        window.resolveThreeJs = resolve;
    });

    const heroWords = splitTextToSpans('.hero-title');

    function playCinematicEntrance() {
        const tl = gsap.timeline();

        // Trigger Three.js cinematic entrance if ready
        if (window.playThreeJsEntrance) {
            window.playThreeJsEntrance();
        }

        // 1. Fade out splash
        if (splash) {
            tl.to(splash, {
                opacity: 0,
                scale: 1.05,
                duration: 1.2,
                ease: 'power3.inOut',
                onComplete: () => {
                    splash.style.visibility = 'hidden';
                    document.documentElement.style.overflow = '';
                    document.body.style.overflow = '';
                }
            }, 0);
        }

        // 2. Reveal Hero Title Words (Blur to Sharp, Slide Up)
        if (heroWords.length > 0) {
            tl.fromTo(heroWords, 
                { y: '110%', filter: 'blur(8px)', opacity: 0 },
                {
                    y: '0%',
                    filter: 'blur(0px)',
                    opacity: 1,
                    duration: 1.4,
                    stagger: 0.04,
                    ease: 'expo.out'
                }, splash ? 0.6 : 0.2);
        }

        // 3. Reveal Hero description
        tl.fromTo('.hero-description', 
            { opacity: 0, y: 30, filter: 'blur(4px)' },
            { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, ease: 'power3.out' },
            '<0.4'
        );

        // 4. Reveal CTA Buttons
        tl.fromTo('.hero-content .btn', 
            { opacity: 0, y: 20, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 1, stagger: 0.15, ease: 'power3.out', clearProps: 'transform' },
            '<0.2'
        );

        // 5. Reveal Trust Box with 3D Depth
        tl.fromTo('.trust-box',
            { opacity: 0, x: 50, rotationY: -20, rotationX: 10, scale: 0.95 },
            { opacity: 1, x: 0, rotationY: 0, rotationX: 0, scale: 1, duration: 1.6, ease: 'expo.out', clearProps: 'transform' },
            '<0.2'
        );
    }

    if (splash) {
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';

        Promise.race([
            window.threeJsReady,
            new Promise(resolve => setTimeout(resolve, 2500))
        ]).then(() => {
            playCinematicEntrance();
        });
    } else {
        playCinematicEntrance();
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
        const isMobile = window.innerWidth <= 768;
        
        const scene = new THREE.Scene();
        // Add fog for depth fading
        scene.fog = new THREE.FogExp2(0x060b14, 0.02);

        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 9;

        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: !isMobile, powerPreference: "high-performance" });
        renderer.setSize(window.innerWidth, window.innerHeight);
        // Adaptive pixel ratio: reduce on mobile to save battery
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 2));
        
        // PBR Requirements
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;

        const group3D = new THREE.Group();
        scene.add(group3D);

        // --- PBR Materials ---
        const glassMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            metalness: 0.1,
            roughness: 0.05,
            transmission: 0.9, // glass-like
            thickness: 0.5,
            envMapIntensity: 1.0,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
            transparent: true,
            opacity: 1
        });

        const goldMaterial = new THREE.MeshStandardMaterial({
            color: 0xffd700,
            metalness: 1.0,
            roughness: 0.2,
            envMapIntensity: 2.0
        });

        const lightModeColor = 0x0284c7; // Sky blue
        
        // Reduced geometry complexity on mobile
        const icoGeo = new THREE.IcosahedronGeometry(2.8, isMobile ? 0 : 1);
        const mainMesh = new THREE.Mesh(icoGeo, glassMaterial);
        
        // Add a subtle wireframe overlay for tech/modern feel
        const wireframeGeo = new THREE.WireframeGeometry(icoGeo);
        const wireframeMat = new THREE.LineBasicMaterial({ color: 0xd4af37, transparent: true, opacity: 0.15 });
        const wireframeMesh = new THREE.LineSegments(wireframeGeo, wireframeMat);
        mainMesh.add(wireframeMesh);
        
        group3D.add(mainMesh);

        const coreGeo = new THREE.OctahedronGeometry(1.2, 0);
        const coreMesh = new THREE.Mesh(coreGeo, goldMaterial);
        group3D.add(coreMesh);

        const torusGeo = new THREE.TorusGeometry(4.2, 0.02, isMobile ? 8 : 16, isMobile ? 50 : 100);
        const torusRing1 = new THREE.Mesh(torusGeo, goldMaterial);
        torusRing1.rotation.x = Math.PI / 3;
        group3D.add(torusRing1);

        const torusRing2 = new THREE.Mesh(torusGeo, glassMaterial);
        torusRing2.rotation.y = Math.PI / 4;
        group3D.add(torusRing2);

        // Particles
        const particleCount = isMobile ? 150 : 400;
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
            size: isMobile ? 0.08 : 0.11,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        const particleSystem = new THREE.Points(particleGeo, particleMat);
        scene.add(particleSystem);

        // --- Realistic Lighting ---
        const ambientLight = new THREE.AmbientLight(0xffffff, 0); // starts dark
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xfff5e6, 0); // starts dark
        dirLight.position.set(5, 10, 7);
        scene.add(dirLight);

        const pointLight = new THREE.PointLight(0xd4af37, 0, 20); // starts dark
        pointLight.position.set(-5, -2, 5);
        scene.add(pointLight);
        
        const bluePointLight = new THREE.PointLight(0x0284c7, 0, 20); // starts dark
        bluePointLight.position.set(5, -2, 5);
        scene.add(bluePointLight);

        // --- Setup Initial State for Cinematic Intro ---
        group3D.scale.set(0.8, 0.8, 0.8);
        group3D.position.y = 2;

        window.playThreeJsEntrance = () => {
            const isLight = htmlEl.getAttribute('data-theme') === 'light';
            
            gsap.to(group3D.scale, { x: 1, y: 1, z: 1, duration: 2.5, ease: 'expo.out' });
            gsap.to(group3D.position, { y: 0, duration: 2.5, ease: 'expo.out' });
            
            gsap.to(ambientLight, { intensity: 0.6, duration: 2, ease: 'power2.inOut' });
            gsap.to(dirLight, { intensity: 2.5, duration: 2, ease: 'power2.inOut' });
            
            if (isLight) {
                gsap.to(bluePointLight, { intensity: 5, duration: 2, ease: 'power2.inOut' });
            } else {
                gsap.to(pointLight, { intensity: 5, duration: 2, ease: 'power2.inOut' });
            }
        };

        // --- Post-Processing / Bloom Setup ---
        let composer, bloomPass;
        if (!isMobile && typeof THREE.EffectComposer !== 'undefined') {
            const renderScene = new THREE.RenderPass(scene, camera);
            bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.2, 0.4, 0.85);
            bloomPass.threshold = 0.2;
            bloomPass.strength = 0.7; // Enhanced for gold highlights
            bloomPass.radius = 0.5;

            composer = new THREE.EffectComposer(renderer);
            composer.addPass(renderScene);
            composer.addPass(bloomPass);
        }

        let scrollY = 0;
        let targetScrollY = 0;
        let mouseX = 0;
        let mouseY = 0;
        let isSceneVisible = true;

        window.addEventListener('scroll', () => {
            targetScrollY = window.scrollY;
        }, { passive: true });

        window.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 0.8;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 0.8;
        }, { passive: true });

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            if (composer) composer.setSize(window.innerWidth, window.innerHeight);
        }, { passive: true });

        // IntersectionObserver for pausing WebGL when out of view
        const observer = new IntersectionObserver((entries) => {
            isSceneVisible = entries[0].isIntersecting;
        });
        // We observe the body/hero, if we scroll far past it, we can pause. 
        // For simplicity, we just check scroll position in the render loop.

        // Resolve the global promise since scene is initialized
        if (window.resolveThreeJs) {
            window.resolveThreeJs();
        }

        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);

            // Pause WebGL rendering if user has scrolled very far down (performance)
            if (targetScrollY > window.innerHeight * 1.5) {
                return;
            }

            const time = clock.getElapsedTime();
            const isLightMode = htmlEl.getAttribute('data-theme') === 'light';
            
            // Smoothly animate theme transitions
            if (isLightMode) {
                scene.fog.color.setHex(0xe0f2fe);
                goldMaterial.color.setHex(0x0284c7);
                particleMat.color.setHex(0x0284c7);
                wireframeMat.color.setHex(0x0284c7);
                // We use pointLights for entrance, but here ensure we manage them if we want
                if (bloomPass) bloomPass.strength = 0.3; // Less bloom in daylight
            } else {
                scene.fog.color.setHex(0x060b14);
                goldMaterial.color.setHex(0xffd700);
                particleMat.color.setHex(0xffd700);
                wireframeMat.color.setHex(0xd4af37);
                if (bloomPass) bloomPass.strength = 0.7; // More bloom in dark mode
            }

            // Smooth scroll interpolation
            scrollY += (targetScrollY - scrollY) * 0.05;

            // Subtle continuous motion
            mainMesh.rotation.x = time * 0.1;
            mainMesh.rotation.y = time * 0.15;

            coreMesh.rotation.x = -time * 0.2;
            coreMesh.rotation.y = -time * 0.25;

            torusRing1.rotation.z = time * 0.1;
            torusRing2.rotation.z = -time * 0.1;

            // Camera/Group scroll interaction (Parallax) via GSAP ScrollTrigger
            // We use ScrollTrigger instead of raw scrollY for smoother cinematic control
            // The raw scrollY code is removed here in favor of GSAP

            particleSystem.rotation.y = time * 0.05;

            if (composer) {
                composer.render();
            } else {
                renderer.render(scene, camera);
            }
        }

        animate();

        // ---------------- GSAP Three.js Connection ----------------
        // Cinematic Scroll Choreography for 3D Scene
        const mm = gsap.matchMedia();
        
        mm.add("(min-width: 769px)", () => {
            // Desktop 3D Scroll Choreography
            const tl3D = gsap.timeline({
                scrollTrigger: {
                    trigger: 'body',
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 1.5
                }
            });

            // Choreograph 3D object to complement sections
            tl3D.to(group3D.position, { y: 2, z: -3, ease: 'power1.inOut' }, 0)
                .to(group3D.rotation, { x: Math.PI * 0.15, y: Math.PI * 0.6, ease: 'power1.inOut' }, 0)
                .to(group3D.position, { y: -1, z: 1, ease: 'power1.inOut' }, 0.5)
                .to(group3D.rotation, { x: -Math.PI * 0.1, y: Math.PI * 1.2, ease: 'power1.inOut' }, 0.5);
        });

        mm.add("(max-width: 768px)", () => {
            // Mobile: reduced motion, simple rotation
            gsap.to(group3D.rotation, {
                y: Math.PI * 0.5,
                ease: 'none',
                scrollTrigger: {
                    trigger: 'body',
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 1
                }
            });
        });
    }

    // ============ 4. 8D Sky Blue Liquid Water Ripple & Caustics Canvas ============
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
        let mouseX = width / 2;
        let mouseY = height / 2;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        window.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                mouseX = e.touches[0].clientX;
                mouseY = e.touches[0].clientY;
            }
        });

        function drawWater() {
            requestAnimationFrame(drawWater);
            ctx.clearRect(0, 0, width, height);

            step += 0.018;
            const isLightMode = htmlEl.getAttribute('data-theme') === 'light';

            // Sky Blue Primary Waves
            ctx.beginPath();
            for (let x = 0; x <= width; x += 12) {
                const y = Math.sin(x * 0.008 + step) * 26 + Math.cos(x * 0.004 + step * 1.5) * 18 + height * 0.4;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.strokeStyle = isLightMode ? 'rgba(2, 132, 199, 0.45)' : 'rgba(212, 175, 55, 0.15)';
            ctx.lineWidth = isLightMode ? 4 : 2;
            ctx.stroke();

            // Sky Blue Caustics Wave Layer 2
            ctx.beginPath();
            for (let x = 0; x <= width; x += 15) {
                const y = Math.cos(x * 0.007 - step * 1.3) * 32 + Math.sin(x * 0.003 - step * 0.8) * 20 + height * 0.6;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.strokeStyle = isLightMode ? 'rgba(56, 189, 248, 0.55)' : 'rgba(255, 215, 0, 0.12)';
            ctx.lineWidth = isLightMode ? 3 : 2;
            ctx.stroke();

            // Interactive Ripple Center under Pointer
            if (isLightMode) {
                ctx.beginPath();
                ctx.arc(mouseX, mouseY, 120 + Math.sin(step * 4) * 20, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(2, 132, 199, 0.35)';
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }

        drawWater();
    }

    // ============ 5. Mouse Spotlight Tracker on Glass Panels ============
    const glassPanels = document.querySelectorAll('.glass-panel, .practice-card, .core-value-card, .service-card-modern, .article-card, .advocate-card, .trust-box, .counter-card');
    glassPanels.forEach(panel => {
        panel.setAttribute('data-spotlight', 'true');

        const updateSpotlight = (clientX, clientY) => {
            const rect = panel.getBoundingClientRect();
            const x = clientX - rect.left;
            const y = clientY - rect.top;
            panel.style.setProperty('--mouse-x', `${x}px`);
            panel.style.setProperty('--mouse-y', `${y}px`);
        };

        panel.addEventListener('mousemove', (e) => updateSpotlight(e.clientX, e.clientY));
        panel.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                updateSpotlight(e.touches[0].clientX, e.touches[0].clientY);
            }
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

    // ============ 7. Cinematic Scroll Choreography (GSAP ScrollTrigger) ============
    
    // Split section titles
    splitTextToSpans('.section-title');

    // Create a match media for responsive animations
    const mm = gsap.matchMedia();

    mm.add("(min-width: 769px)", () => {
        // Desktop: High impact stagger reveals
        
        // 1. Animate section titles when they enter viewport
        gsap.utils.toArray('.section-title').forEach(title => {
            const words = title.querySelectorAll('.gsap-word-inner');
            if (words.length) {
                gsap.to(words, {
                    y: '0%',
                    duration: 1,
                    stagger: 0.03,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: title,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    }
                });
            }
        });

        // 2. Cinematic Section Choreography (Unique Motion per Section)
        
        // About Section (Mask & Blur)
        const aboutPanels = document.querySelectorAll('#about .glass-panel, .about-section .glass-panel');
        if (aboutPanels.length > 0) {
            gsap.fromTo(aboutPanels, 
                { opacity: 0, x: -30, filter: 'blur(8px)' },
                { 
                    opacity: 1, x: 0, filter: 'blur(0px)', duration: 1.5, stagger: 0.2, ease: 'power3.out',
                    scrollTrigger: { trigger: aboutPanels[0], start: 'top 80%', toggleActions: 'play none none reverse' }
                }
            );
        }

        // Practice Areas (Scale & Stagger)
        const practiceCards = document.querySelectorAll('.practice-card, .service-card-modern');
        if (practiceCards.length > 0) {
            gsap.fromTo(practiceCards, 
                { opacity: 0, y: 50, scale: 0.95 },
                { 
                    opacity: 1, y: 0, scale: 1, duration: 1.2, stagger: 0.1, ease: 'back.out(1.2)',
                    scrollTrigger: { trigger: practiceCards[0].closest('section'), start: 'top 75%', toggleActions: 'play none none reverse' }
                }
            );
        }

        // Core Values, Stats, and Team (3D Depth)
        const coreCards = document.querySelectorAll('.core-value-card, .advocate-card, .counter-card');
        if (coreCards.length > 0) {
            gsap.fromTo(coreCards,
                { opacity: 0, rotationY: 15, y: 40 },
                {
                    opacity: 1, rotationY: 0, y: 0, duration: 1.4, stagger: 0.15, ease: 'expo.out',
                    scrollTrigger: { trigger: coreCards[0].closest('section'), start: 'top 80%', toggleActions: 'play none none reverse' }
                }
            );
        }

        // Catch-all for any remaining glass panels (Contact, forms)
        const otherPanels = document.querySelectorAll('section:not(#about) .glass-panel:not(.trust-box)');
        if (otherPanels.length > 0) {
            gsap.fromTo(otherPanels,
                { opacity: 0, y: 30 },
                {
                    opacity: 1, y: 0, duration: 1.2, stagger: 0.1, ease: 'power2.out',
                    scrollTrigger: { trigger: otherPanels[0].closest('section'), start: 'top 80%', toggleActions: 'play none none reverse' }
                }
            );
        }

        // 3. Cinematic Section Transitions (Parallax images)
        gsap.utils.toArray('.hero-ambient-blob-1, .hero-ambient-blob-2').forEach(blob => {
            gsap.to(blob, {
                yPercent: 30,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.hero-section',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                }
            });
        });

        // 4. Cinematic Mouse Depth / Parallax (Desktop)
        const heroSection = document.querySelector('.hero-section');
        const heroContent = document.querySelector('.hero-content');
        const trustBox = document.querySelector('.trust-box');

        if (heroSection) {
            heroSection.addEventListener('mousemove', (e) => {
                const x = (e.clientX / window.innerWidth - 0.5);
                const y = (e.clientY / window.innerHeight - 0.5);

                // Very subtle movement for content, medium for trust box
                gsap.to(heroContent, { x: x * -15, y: y * -15, duration: 1.5, ease: 'power2.out' });
                if (trustBox) {
                    gsap.to(trustBox, { 
                        x: x * 25, 
                        y: y * 25, 
                        rotationY: x * 10, 
                        rotationX: -y * 10, 
                        duration: 1.5, 
                        ease: 'power2.out' 
                    });
                }
            });
            
            heroSection.addEventListener('mouseleave', () => {
                gsap.to(heroContent, { x: 0, y: 0, duration: 1.5, ease: 'power2.out' });
                if (trustBox) {
                    gsap.to(trustBox, { x: 0, y: 0, rotationY: 0, rotationX: 0, duration: 1.5, ease: 'power2.out' });
                }
            });
        }

        // 5. Hero Scroll Transition (Scene 01 -> Scene 02)
        gsap.to('.hero-section', {
            scale: 0.96,
            opacity: 0,
            yPercent: 5,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero-section',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });

        // 6. Magnetic CTA Buttons
        const magneticBtns = document.querySelectorAll('.hero-content .btn');
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                gsap.to(btn, { x: x * 0.25, y: y * 0.25, duration: 0.4, ease: 'power2.out' });
            });
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.3)' });
            });
        });
    });

    mm.add("(max-width: 768px)", () => {
        // Mobile: Lightweight fade ups (transform/opacity only)
        
        gsap.utils.toArray('.section-title .gsap-word-inner').forEach(word => {
            gsap.set(word, { y: '0%' }); // Disable complex text split on mobile for perf
        });

        const allRevealElements = gsap.utils.toArray('.glass-panel, .practice-card, .core-value-card, .service-card-modern, .advocate-card, .section-title, .section-label');
        
        allRevealElements.forEach(el => {
            gsap.fromTo(el, 
                { opacity: 0, y: 20 },
                {
                    opacity: 1, y: 0,
                    duration: 0.8,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 90%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });
    });

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
        const handleTilt = (clientX, clientY) => {
            const rect = card.getBoundingClientRect();
            const x = clientX - rect.left;
            const y = clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(30px) translateY(-8px)`;
        };

        card.addEventListener('mousemove', (e) => handleTilt(e.clientX, e.clientY));
        card.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) handleTilt(e.touches[0].clientX, e.touches[0].clientY);
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
