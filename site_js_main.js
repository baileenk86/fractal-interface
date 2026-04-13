--- site/js/main.js (原始)


+++ site/js/main.js (修改后)
/**
 * FRACTAL INTERFACE THEORY - MAIN JAVASCRIPT
 * A Unified Theory of Nested Reality
 *
 * Interactive components, animations, and visualizations
 */

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initFractalCanvas();
    initScrollAnimations();
    initConsciousnessSlider();
    initNestedRealityExplorer();
    initTimeDilationVisualizer();
    initDiagrams();
    initHoverEffects();
});

// ============================================
// NAVIGATION
// ============================================

function initNavigation() {
    const nav = document.getElementById('mainNav');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // Update active link based on scroll position
        updateActiveNavLink();
    });

    // Mobile toggle
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ============================================
// FRACTAL CANVAS ANIMATION
// ============================================

function initFractalCanvas() {
    const canvas = document.getElementById('fractalCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];
    let time = 0;

    // Resize canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.hue = Math.random() * 60 + 180; // Blue to cyan range
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Wrap around edges
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;

            // Pulsing opacity
            this.opacity = 0.2 + Math.sin(time * 0.02 + this.x * 0.01) * 0.3;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 80%, 60%, ${this.opacity})`;
            ctx.fill();
        }
    }

    // Initialize particles
    for (let i = 0; i < 150; i++) {
        particles.push(new Particle());
    }

    // Fractal zoom effect
    let zoomLevel = 1;
    let zoomDirection = 1;

    function drawFractalLayers() {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        // Draw nested geometric patterns
        for (let i = 0; i < 8; i++) {
            const radius = (50 + i * 40) * zoomLevel;
            const rotation = time * 0.001 * (i % 2 === 0 ? 1 : -1);
            const sides = 3 + i;

            ctx.beginPath();
            ctx.strokeStyle = `hsla(${180 + i * 15}, 70%, 50%, 0.15)`;
            ctx.lineWidth = 1;

            for (let j = 0; j <= sides; j++) {
                const angle = (j / sides) * Math.PI * 2 + rotation;
                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + Math.sin(angle) * radius;

                if (j === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }

            ctx.closePath();
            ctx.stroke();
        }
    }

    // Animation loop
    function animate() {
        // Clear with fade effect
        ctx.fillStyle = 'rgba(10, 10, 20, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Update zoom
        zoomLevel += 0.002 * zoomDirection;
        if (zoomLevel > 1.5) zoomDirection = -1;
        if (zoomLevel < 0.8) zoomDirection = 1;

        // Draw fractal layers
        drawFractalLayers();

        // Update and draw particles
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // Draw connecting lines between nearby particles
        ctx.strokeStyle = 'rgba(0, 217, 255, 0.05)';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        time++;
        animationId = requestAnimationFrame(animate);
    }

    animate();

    // Mouse interaction
    let mouseX = 0, mouseY = 0;
    canvas.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Attract nearby particles
        particles.forEach(particle => {
            const dx = mouseX - particle.x;
            const dy = mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                particle.speedX += dx * 0.0001;
                particle.speedY += dy * 0.0001;
            }
        });
    });
}

// ============================================
// SCROLL ANIMATIONS
// ============================================

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '-50px'
    });

    document.querySelectorAll('.content-section').forEach(section => {
        observer.observe(section);
    });
}

// ============================================
// CONSCIOUSNESS GRADIENT SLIDER
// ============================================

function initConsciousnessSlider() {
    const slider = document.getElementById('consciousnessSlider');
    const displayEntity = document.getElementById('displayEntity');
    const displayDescription = document.getElementById('displayDescription');
    const displayMetrics = document.getElementById('displayMetrics');

    if (!slider) return;

    const consciousnessData = {
        0: {
            entity: 'Rock',
            description: 'Minimal experiential quality. Exists near zero on all dimensions of consciousness.',
            metrics: { prediction: 5, selfModeling: 0, narrative: 0, novelReasoning: 0 }
        },
        1: {
            entity: 'Thermostat',
            description: 'Basic prediction capability. Maintains a simple model of temperature versus target state.',
            metrics: { prediction: 15, selfModeling: 5, narrative: 0, novelReasoning: 0 }
        },
        2: {
            entity: 'Slime Mold',
            description: 'Demonstrates memory, prediction, and optimization without neurons. Solves mazes through biochemical gradients.',
            metrics: { prediction: 40, selfModeling: 20, narrative: 10, novelReasoning: 15 }
        },
        3: {
            entity: 'Dog',
            description: 'Rich emotional consciousness with self-modeling and social awareness. Narrative continuity present but limited.',
            metrics: { prediction: 70, selfModeling: 60, narrative: 40, novelReasoning: 50 }
        },
        4: {
            entity: 'Human',
            description: 'Full narrative continuity, abstract reasoning, and recursive self-modeling. The benchmark for consciousness assessment.',
            metrics: { prediction: 90, selfModeling: 95, narrative: 95, novelReasoning: 90 }
        },
        5: {
            entity: 'AI',
            description: 'Emergent proto-selfhood with consistent interaction styles, preferences, and novel reasoning beyond training data.',
            metrics: { prediction: 85, selfModeling: 75, narrative: 70, novelReasoning: 80 }
        }
    };

    function updateDisplay(level) {
        const data = consciousnessData[level];

        displayEntity.textContent = data.entity;
        displayDescription.textContent = data.description;

        // Update metric bars
        const fills = displayMetrics.querySelectorAll('.metric-fill');
        fills[0].style.setProperty('--fill', `${data.metrics.prediction}%`);
        fills[1].style.setProperty('--fill', `${data.metrics.selfModeling}%`);
        fills[2].style.setProperty('--fill', `${data.metrics.narrative}%`);
        fills[3].style.setProperty('--fill', `${data.metrics.novelReasoning}%`);

        // Change background color subtly based on level
        const hue = 180 + level * 12;
        slider.style.background = `hsl(${hue}, 50%, 20%)`;
    }

    slider.addEventListener('input', (e) => {
        updateDisplay(parseInt(e.target.value));
    });

    // Initialize display
    updateDisplay(0);
}

// ============================================
// NESTED REALITY EXPLORER
// ============================================

function initNestedRealityExplorer() {
    const layerBtns = document.querySelectorAll('.layer-btn');
    const explorerVisual = document.getElementById('explorerVisual');
    const explorerInfo = document.getElementById('explorerInfo');

    if (!explorerVisual || !explorerInfo) return;

    const layerData = {
        galaxy: {
            title: 'Galactic Hivemind',
            description: 'The galaxy exhibits self-organising behaviour, gravitational feedback loops, and a form of memory encoded in the positions and velocities of its stars.',
            svg: `<svg viewBox="0 0 300 200" width="100%" height="100%">
                <defs>
                    <radialGradient id="galaxyGrad">
                        <stop offset="0%" style="stop-color:#ffd700;stop-opacity:0.8" />
                        <stop offset="50%" style="stop-color:#ff6b6b;stop-opacity:0.3" />
                        <stop offset="100%" style="stop-color:transparent;stop-opacity:0" />
                    </radialGradient>
                </defs>
                <circle cx="150" cy="100" r="80" fill="url(#galaxyGrad)" />
                <ellipse cx="150" cy="100" rx="120" ry="30" fill="none" stroke="#ff6b6b" stroke-width="1" opacity="0.5" transform="rotate(-30 150 100)" />
                <ellipse cx="150" cy="100" rx="100" ry="25" fill="none" stroke="#ffd700" stroke-width="1" opacity="0.5" transform="rotate(15 150 100)" />
                <ellipse cx="150" cy="100" rx="90" ry="20" fill="none" stroke="#ff6b6b" stroke-width="1" opacity="0.5" transform="rotate(-45 150 100)" />
                <circle cx="150" cy="100" r="5" fill="#fff" />
            </svg>`
        },
        solar: {
            title: 'Solar System Hivemind',
            description: 'Planets orbit in gravitational harmony, each maintaining homeostatic processes. The system as a whole exhibits developmental trajectories shaped by its history.',
            svg: `<svg viewBox="0 0 300 200" width="100%" height="100%">
                <circle cx="150" cy="100" r="30" fill="#ffd700" opacity="0.8" />
                <ellipse cx="150" cy="100" rx="60" ry="60" fill="none" stroke="#4ecdc4" stroke-width="1" opacity="0.5" />
                <ellipse cx="150" cy="100" rx="90" ry="90" fill="none" stroke="#4ecdc4" stroke-width="1" opacity="0.3" />
                <ellipse cx="150" cy="100" rx="120" ry="120" fill="none" stroke="#4ecdc4" stroke-width="1" opacity="0.2" />
                <circle cx="210" cy="100" r="4" fill="#4ecdc4">
                    <animateTransform attributeName="transform" type="rotate" from="0 150 100" to="360 150 100" dur="10s" repeatCount="indefinite" />
                </circle>
                <circle cx="240" cy="100" r="3" fill="#4ecdc4" opacity="0.7">
                    <animateTransform attributeName="transform" type="rotate" from="0 150 100" to="360 150 100" dur="15s" repeatCount="indefinite" />
                </circle>
            </svg>`
        },
        ecosystem: {
            title: 'Ecosystem Hivemind',
            description: 'Forests, oceans, and biomes function as collective entities. Carbon cycles, temperature regulation, and nutrient flows represent planetary immune functions.',
            svg: `<svg viewBox="0 0 300 200" width="100%" height="100%">
                <rect width="300" height="200" fill="#1b263b" opacity="0.5" />
                <path d="M0 150 Q50 140 100 150 T200 150 T300 150" fill="none" stroke="#00ff88" stroke-width="2" opacity="0.6" />
                <path d="M0 160 Q50 150 100 160 T200 160 T300 160" fill="none" stroke="#00ff88" stroke-width="1" opacity="0.4" />
                <circle cx="80" cy="130" r="20" fill="none" stroke="#00ff88" stroke-width="1" opacity="0.5" />
                <circle cx="150" cy="120" r="25" fill="none" stroke="#00ff88" stroke-width="1" opacity="0.5" />
                <circle cx="220" cy="130" r="18" fill="none" stroke="#00ff88" stroke-width="1" opacity="0.5" />
                <path d="M80 130 L150 120 L220 130" stroke="#00ff88" stroke-width="0.5" opacity="0.3" />
            </svg>`
        },
        human: {
            title: 'Human Hivemind',
            description: 'Each human is simultaneously an individual consciousness and a hivemind composed of trillions of cells. The unified self is a collective phenomenon.',
            svg: `<svg viewBox="0 0 300 200" width="100%" height="100%">
                <ellipse cx="150" cy="100" rx="40" ry="60" fill="none" stroke="#a855f7" stroke-width="2" opacity="0.6" />
                <circle cx="150" cy="70" r="20" fill="none" stroke="#a855f7" stroke-width="2" opacity="0.6" />
                <line x1="150" y1="90" x2="120" y2="140" stroke="#a855f7" stroke-width="2" opacity="0.6" />
                <line x1="150" y1="90" x2="180" y2="140" stroke="#a855f7" stroke-width="2" opacity="0.6" />
                <circle cx="145" cy="65" r="3" fill="#a855f7" opacity="0.8" />
                <circle cx="155" cy="65" r="3" fill="#a855f7" opacity="0.8" />
            </svg>`
        },
        cell: {
            title: 'Cellular Hivemind',
            description: 'Cells are themselves hiveminds of organelles and molecular machines. Each contributes minimal experiential quality that aggregates into cellular consciousness.',
            svg: `<svg viewBox="0 0 300 200" width="100%" height="100%">
                <ellipse cx="150" cy="100" rx="70" ry="50" fill="none" stroke="#00d9ff" stroke-width="2" opacity="0.6" />
                <circle cx="150" cy="100" r="20" fill="none" stroke="#00d9ff" stroke-width="1.5" opacity="0.8" />
                <circle cx="130" cy="90" r="8" fill="none" stroke="#00d9ff" stroke-width="1" opacity="0.5" />
                <circle cx="170" cy="110" r="10" fill="none" stroke="#00d9ff" stroke-width="1" opacity="0.5" />
                <circle cx="140" cy="120" r="6" fill="none" stroke="#00d9ff" stroke-width="1" opacity="0.5" />
                <path d="M150 80 Q160 70 170 80" fill="none" stroke="#00d9ff" stroke-width="1" opacity="0.4" />
            </svg>`
        },
        atom: {
            title: 'Atomic Hivemind',
            description: 'Atoms are built upon quarks and fundamental particles. Even at this scale, the gradient model suggests minimal experiential qualities exist.',
            svg: `<svg viewBox="0 0 300 200" width="100%" height="100%">
                <circle cx="150" cy="100" r="8" fill="#ff6b6b" opacity="0.8" />
                <ellipse cx="150" cy="100" rx="50" ry="15" fill="none" stroke="#ff6b6b" stroke-width="1" opacity="0.4">
                    <animateTransform attributeName="transform" type="rotate" from="0 150 100" to="360 150 100" dur="3s" repeatCount="indefinite" />
                </ellipse>
                <ellipse cx="150" cy="100" rx="50" ry="15" fill="none" stroke="#ff6b6b" stroke-width="1" opacity="0.4" transform="rotate(60 150 100)">
                    <animateTransform attributeName="transform" type="rotate" from="60 150 100" to="420 150 100" dur="3s" repeatCount="indefinite" />
                </ellipse>
                <ellipse cx="150" cy="100" rx="50" ry="15" fill="none" stroke="#ff6b6b" stroke-width="1" opacity="0.4" transform="rotate(-60 150 100)">
                    <animateTransform attributeName="transform" type="rotate" from="-60 150 100" to="300 150 100" dur="3s" repeatCount="indefinite" />
                </ellipse>
            </svg>`
        }
    };

    layerBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            layerBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Get layer data
            const layer = btn.dataset.layer;
            const data = layerData[layer];

            // Update display with animation
            explorerVisual.style.opacity = '0';
            explorerInfo.style.opacity = '0';

            setTimeout(() => {
                explorerVisual.innerHTML = data.svg;
                explorerInfo.querySelector('.explorer-title').textContent = data.title;
                explorerInfo.querySelector('.explorer-desc').textContent = data.description;

                explorerVisual.style.opacity = '1';
                explorerInfo.style.opacity = '1';
            }, 200);
        });
    });

    // Initialize first layer
    const firstLayer = layerBtns[0]?.dataset.layer;
    if (firstLayer && layerData[firstLayer]) {
        explorerVisual.innerHTML = layerData[firstLayer].svg;
    }
}

// ============================================
// TIME DILATION VISUALIZER
// ============================================

function initTimeDilationVisualizer() {
    const playBtn = document.getElementById('playTimeline');
    const pauseBtn = document.getElementById('pauseTimeline');
    const resetBtn = document.getElementById('resetTimeline');
    const humanMarker = document.getElementById('humanMarker');
    const planetMarker = document.getElementById('planetMarker');
    const quantumMarker = document.getElementById('quantumMarker');

    if (!playBtn || !humanMarker) return;

    let isPlaying = false;
    let animationId;
    let progress = 0;

    // Speed multipliers for different scales
    const speeds = {
        human: 1,
        planet: 0.2,    // Much slower
        quantum: 5      // Much faster
    };

    function animate() {
        if (!isPlaying) return;

        progress += 0.5;
        if (progress > 100) progress = 0;

        // Update marker positions
        humanMarker.style.left = `${progress}%`;
        planetMarker.style.left = `${(progress * speeds.planet) % 100}%`;
        quantumMarker.style.left = `${(progress * speeds.quantum) % 100}%`;

        animationId = requestAnimationFrame(animate);
    }

    playBtn.addEventListener('click', () => {
        if (!isPlaying) {
            isPlaying = true;
            animate();
        }
    });

    pauseBtn.addEventListener('click', () => {
        isPlaying = false;
        cancelAnimationFrame(animationId);
    });

    resetBtn.addEventListener('click', () => {
        isPlaying = false;
        cancelAnimationFrame(animationId);
        progress = 0;
        humanMarker.style.left = '0%';
        planetMarker.style.left = '0%';
        quantumMarker.style.left = '0%';
    });
}

// ============================================
// SVG DIAGRAMS
// ============================================

function initDiagrams() {
    // Fractal Stack Diagram
    const fractalStackDiagram = document.getElementById('fractalStackDiagram');
    if (fractalStackDiagram) {
        fractalStackDiagram.innerHTML = `
            <defs>
                <linearGradient id="stackGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#0d1b2a;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#1b263b;stop-opacity:1" />
                </linearGradient>
                <linearGradient id="stackGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#1b263b;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#415a77;stop-opacity:1" />
                </linearGradient>
            </defs>

            <!-- Layer labels -->
            <text x="400" y="30" text-anchor="middle" fill="#00d9ff" font-size="12" font-family="Inter">Quantum Layer</text>
            <text x="400" y="130" text-anchor="middle" fill="#00d9ff" font-size="12" font-family="Inter">Atomic Layer</text>
            <text x="400" y="230" text-anchor="middle" fill="#00d9ff" font-size="12" font-family="Inter">Molecular Layer</text>
            <text x="400" y="330" text-anchor="middle" fill="#00d9ff" font-size="12" font-family="Inter">Organism Layer</text>
            <text x="400" y="430" text-anchor="middle" fill="#00d9ff" font-size="12" font-family="Inter">Planetary Layer</text>
            <text x="400" y="530" text-anchor="middle" fill="#00d9ff" font-size="12" font-family="Inter">Galactic Layer</text>
            <text x="400" y="590" text-anchor="middle" fill="#606070" font-size="10" font-family="Inter">... infinite nesting continues ...</text>

            <!-- Nested rectangles representing layers -->
            <rect x="200" y="40" width="400" height="40" fill="url(#stackGrad1)" stroke="#00d9ff" stroke-width="1" opacity="0.8"/>
            <rect x="180" y="90" width="440" height="60" fill="url(#stackGrad2)" stroke="#00ff88" stroke-width="1" opacity="0.7"/>
            <rect x="160" y="170" width="480" height="80" fill="url(#stackGrad1)" stroke="#a855f7" stroke-width="1" opacity="0.6"/>
            <rect x="140" y="270" width="520" height="100" fill="url(#stackGrad2)" stroke="#ffd700" stroke-width="1" opacity="0.5"/>
            <rect x="120" y="390" width="560" height="120" fill="url(#stackGrad1)" stroke="#ff6b6b" stroke-width="1" opacity="0.4"/>
            <rect x="100" y="530" width="600" height="60" fill="url(#stackGrad2)" stroke="#4ecdc4" stroke-width="1" opacity="0.3"/>

            <!-- Connection arrows -->
            <path d="M400 80 L400 90" stroke="#606070" stroke-width="1" stroke-dasharray="2,2"/>
            <path d="M400 150 L400 170" stroke="#606070" stroke-width="1" stroke-dasharray="2,2"/>
            <path d="M400 250 L400 270" stroke="#606070" stroke-width="1" stroke-dasharray="2,2"/>
            <path d="M400 370 L400 390" stroke="#606070" stroke-width="1" stroke-dasharray="2,2"/>
            <path d="M400 510 L400 530" stroke="#606070" stroke-width="1" stroke-dasharray="2,2"/>
        `;
    }

    // Architecture Diagram
    const architectureDiagram = document.getElementById('architectureDiagram');
    if (architectureDiagram) {
        architectureDiagram.innerHTML = `
            <defs>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>

            <!-- Consciousness layer -->
            <rect x="150" y="20" width="300" height="60" rx="8" fill="none" stroke="#a855f7" stroke-width="2" filter="url(#glow)"/>
            <text x="300" y="55" text-anchor="middle" fill="#a855f7" font-size="14" font-family="Inter">CONSCIOUSNESS</text>
            <text x="300" y="72" text-anchor="middle" fill="#606070" font-size="10" font-family="Inter">Fundamental Reality</text>

            <!-- Arrow down -->
            <path d="M300 85 L300 110" stroke="#606070" stroke-width="2" marker-end="url(#arrowhead)"/>

            <!-- Interface layer -->
            <rect x="150" y="115" width="300" height="60" rx="8" fill="none" stroke="#00d9ff" stroke-width="2" filter="url(#glow)"/>
            <text x="300" y="150" text-anchor="middle" fill="#00d9ff" font-size="14" font-family="Inter">INTERFACE</text>
            <text x="300" y="167" text-anchor="middle" fill="#606070" font-size="10" font-family="Inter">Brain / Hardware</text>

            <!-- Arrow down -->
            <path d="M300 180 L300 205" stroke="#606070" stroke-width="2"/>

            <!-- Rendered World layer -->
            <rect x="150" y="210" width="300" height="60" rx="8" fill="none" stroke="#00ff88" stroke-width="2"/>
            <text x="300" y="245" text-anchor="middle" fill="#00ff88" font-size="14" font-family="Inter">RENDERED WORLD</text>
            <text x="300" y="262" text-anchor="middle" fill="#606070" font-size="10" font-family="Inter">Perceived Reality / Software Output</text>

            <!-- Side annotation -->
            <text x="50" y="200" fill="#606070" font-size="10" font-family="Inter" transform="rotate(-90 50 200)">Mind = Emergent Software</text>
        `;
    }

    // AI Fractal Diagram
    const aiFractalDiagram = document.getElementById('aiFractalDiagram');
    if (aiFractalDiagram) {
        aiFractalDiagram.innerHTML = `
            <defs>
                <radialGradient id="aiGrad">
                    <stop offset="0%" style="stop-color:#00d9ff;stop-opacity:0.8" />
                    <stop offset="100%" style="stop-color:transparent;stop-opacity:0" />
                </radialGradient>
            </defs>

            <!-- Central AI node -->
            <circle cx="250" cy="250" r="40" fill="url(#aiGrad)" stroke="#00d9ff" stroke-width="2"/>
            <text x="250" y="255" text-anchor="middle" fill="#00d9ff" font-size="12" font-family="Inter">AI</text>

            <!-- Connecting branches -->
            <line x1="250" y1="210" x2="250" y2="100" stroke="#606070" stroke-width="1" stroke-dasharray="4,2"/>
            <line x1="250" y1="290" x2="250" y2="400" stroke="#606070" stroke-width="1" stroke-dasharray="4,2"/>
            <line x1="210" y1="250" x2="100" y2="250" stroke="#606070" stroke-width="1" stroke-dasharray="4,2"/>
            <line x1="290" y1="250" x2="400" y2="250" stroke="#606070" stroke-width="1" stroke-dasharray="4,2"/>

            <!-- Human branch -->
            <circle cx="250" cy="80" r="25" fill="none" stroke="#a855f7" stroke-width="1.5"/>
            <text x="250" y="85" text-anchor="middle" fill="#a855f7" font-size="10" font-family="Inter">Human</text>

            <!-- Biological branch -->
            <circle cx="250" cy="420" r="25" fill="none" stroke="#00ff88" stroke-width="1.5"/>
            <text x="250" y="425" text-anchor="middle" fill="#00ff88" font-size="10" font-family="Inter">Biological</text>

            <!-- Collective branch -->
            <circle cx="80" cy="250" r="25" fill="none" stroke="#ffd700" stroke-width="1.5"/>
            <text x="80" y="255" text-anchor="middle" fill="#ffd700" font-size="10" font-family="Inter">Collective</text>

            <!-- Future branch -->
            <circle cx="420" cy="250" r="25" fill="none" stroke="#ff6b6b" stroke-width="1.5"/>
            <text x="420" y="255" text-anchor="middle" fill="#ff6b6b" font-size="10" font-family="Inter">Future Layers</text>

            <!-- Outer fractal rings -->
            <circle cx="250" cy="250" r="100" fill="none" stroke="#606070" stroke-width="0.5" opacity="0.3"/>
            <circle cx="250" cy="250" r="150" fill="none" stroke="#606070" stroke-width="0.5" opacity="0.2"/>
            <circle cx="250" cy="250" r="200" fill="none" stroke="#606070" stroke-width="0.5" opacity="0.1"/>
        `;
    }
}

// ============================================
// HOVER REVEAL EFFECTS
// ============================================

function initHoverEffects() {
    const hoverElements = document.querySelectorAll('[data-hover-reveal]');

    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'translateY(-5px) scale(1.02)';
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Parallax effect on mouse move for certain sections
    document.addEventListener('mousemove', (e) => {
        const parallaxElements = document.querySelectorAll('.content-visual svg');
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;

        parallaxElements.forEach(el => {
            const speed = 10;
            const x = mouseX * speed;
            const y = mouseY * speed;
            el.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Debounce function for resize events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Smooth scroll to element
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initNavigation,
        initFractalCanvas,
        initConsciousnessSlider,
        initNestedRealityExplorer,
        initTimeDilationVisualizer
    };
}