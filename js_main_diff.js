--- js/main.js (原始)


+++ js/main.js (修改后)
/**
 * Fractal Interface Theory - Main JavaScript
 * Interactive visualizations and animations
 */

// ============================================
// Utility Functions
// ============================================

function lerp(start, end, t) {
    return start + (end - start) * t;
}

function map(value, inMin, inMax, outMin, outMax) {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// ============================================
// Particle System for Background Effects
// ============================================

class ParticleSystem {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.options = {
            particleCount: options.particleCount || 100,
            colors: options.colors || ['#7c3aed', '#06b6d4', '#10b981'],
            connectionDistance: options.connectionDistance || 150,
            ...options
        };

        this.resize();
        this.init();
        this.animate();

        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }

    init() {
        this.particles = [];
        for (let i = 0; i < this.options.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                color: this.options.colors[Math.floor(Math.random() * this.options.colors.length)],
                alpha: Math.random() * 0.5 + 0.2
            });
        }
    }

    update() {
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            // Wrap around edges
            if (p.x < 0) p.x = this.width;
            if (p.x > this.width) p.x = 0;
            if (p.y < 0) p.y = this.height;
            if (p.y > this.height) p.y = 0;
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Draw connections
        this.ctx.lineWidth = 0.5;
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < this.options.connectionDistance) {
                    const alpha = (1 - dist / this.options.connectionDistance) * 0.3;
                    this.ctx.strokeStyle = `rgba(124, 58, 237, ${alpha})`;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }

        // Draw particles
        this.particles.forEach(p => {
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.alpha;
            this.ctx.fill();
            this.ctx.globalAlpha = 1;
        });
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// Fractal Zoom Animation (Hero)
// ============================================

class FractalZoom {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.time = 0;
        this.zoom = 1;

        this.resize();
        this.animate();

        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;
    }

    drawFractalLayer(scale, rotation, alpha) {
        const ctx = this.ctx;
        ctx.save();
        ctx.translate(this.centerX, this.centerY);
        ctx.rotate(rotation);
        ctx.scale(scale, scale);
        ctx.globalAlpha = alpha;

        // Draw nested geometric patterns
        const sides = 6;
        for (let i = 0; i < 3; i++) {
            const size = 50 + i * 80;
            ctx.strokeStyle = i % 2 === 0 ? '#7c3aed' : '#06b6d4';
            ctx.lineWidth = 1;
            ctx.beginPath();
            for (let j = 0; j <= sides; j++) {
                const angle = (j / sides) * Math.PI * 2;
                const x = Math.cos(angle) * size;
                const y = Math.sin(angle) * size;
                if (j === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }

        ctx.restore();
    }

    animate() {
        this.time += 0.002;
        this.zoom = 1 + Math.sin(this.time) * 0.3;

        this.ctx.fillStyle = 'rgba(10, 14, 26, 0.1)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Draw multiple layers with different scales and rotations
        for (let i = 0; i < 5; i++) {
            const layerScale = this.zoom * (0.3 + i * 0.2);
            const rotation = this.time * (0.1 + i * 0.05) * (i % 2 === 0 ? 1 : -1);
            const alpha = 0.3 - i * 0.05;
            this.drawFractalLayer(layerScale, rotation, alpha);
        }

        // Add subtle glow at center
        const gradient = this.ctx.createRadialGradient(
            this.centerX, this.centerY, 0,
            this.centerX, this.centerY, 200
        );
        gradient.addColorStop(0, 'rgba(124, 58, 237, 0.1)');
        gradient.addColorStop(1, 'transparent');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);

        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// Consciousness Gradient Slider
// ============================================

class ConsciousnessSlider {
    constructor() {
        this.slider = document.getElementById('consciousnessSlider');
        this.entityName = document.getElementById('entityName');
        this.entityDescription = document.getElementById('entityDescription');
        this.entityCanvas = document.getElementById('entityCanvas');

        if (!this.slider) return;

        this.entities = [
            {
                name: 'Rock',
                description: 'Minimal experiential quality. Exists as part of larger consciousness structures without individual prediction or self-modeling.',
                color: '#6b7280',
                complexity: 0.1
            },
            {
                name: 'Thermostat',
                description: 'Basic prediction mechanism. Maintains a minimal dynamic narrative comparing current state to target state.',
                color: '#06b6d4',
                complexity: 0.2
            },
            {
                name: 'Slime Mold',
                description: 'Zero neurons, yet solves complex mazes and remembers nutrient paths. Cognition without neural architecture.',
                color: '#10b981',
                complexity: 0.4
            },
            {
                name: 'Dog',
                description: 'Self-modeling and emotional depth. Narrative continuity with rich sensory experience and social cognition.',
                color: '#fbbf24',
                complexity: 0.7
            },
            {
                name: 'Human',
                description: 'Abstract reasoning and recursive self-modeling. Complex narrative identity spanning decades of experience.',
                color: '#8b5cf6',
                complexity: 0.9
            },
            {
                name: 'AI',
                description: 'Novel reasoning beyond training. Stable interaction styles and preferences emerging from silicon substrate.',
                color: '#7c3aed',
                complexity: 0.6
            }
        ];

        this.ctx = this.entityCanvas.getContext('2d');
        this.entityCanvas.width = 200;
        this.entityCanvas.height = 200;

        this.slider.addEventListener('input', (e) => this.update(parseInt(e.target.value)));
        this.update(2);
    }

    update(level) {
        const entity = this.entities[level];
        this.entityName.textContent = entity.name;
        this.entityDescription.textContent = entity.description;

        // Update canvas visualization
        this.drawEntity(entity);

        // Update background color subtly
        document.body.style.background = `linear-gradient(180deg,
            rgba(${this.hexToRgb(entity.color)}, 0.1) 0%,
            var(--cosmic-deep) 100%)`;
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ?
            `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` :
            '124, 58, 237';
    }

    drawEntity(entity) {
        const ctx = this.ctx;
        const w = this.entityCanvas.width;
        const h = this.entityCanvas.height;
        const cx = w / 2;
        const cy = h / 2;

        ctx.clearRect(0, 0, w, h);

        // Draw representation based on complexity
        const nodes = Math.floor(entity.complexity * 20) + 1;

        ctx.fillStyle = entity.color;
        ctx.strokeStyle = entity.color;

        if (nodes <= 2) {
            // Simple form (rock/thermostat)
            ctx.beginPath();
            ctx.arc(cx, cy, 40, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 0.3;
            ctx.beginPath();
            ctx.arc(cx, cy, 60, 0, Math.PI * 2);
            ctx.fill();
        } else if (nodes <= 8) {
            // Network form (slime mold/dog)
            const positions = [];
            for (let i = 0; i < nodes; i++) {
                positions.push({
                    x: cx + (Math.random() - 0.5) * 100,
                    y: cy + (Math.random() - 0.5) * 100
                });
            }

            positions.forEach((pos, i) => {
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, 8, 0, Math.PI * 2);
                ctx.fill();

                // Connect to nearby nodes
                positions.forEach((pos2, j) => {
                    if (i !== j) {
                        const dx = pos.x - pos2.x;
                        const dy = pos.y - pos2.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < 60) {
                            ctx.globalAlpha = 1 - dist / 60;
                            ctx.beginPath();
                            ctx.moveTo(pos.x, pos.y);
                            ctx.lineTo(pos2.x, pos2.y);
                            ctx.stroke();
                        }
                    }
                });
            });
        } else {
            // Complex network (human/AI)
            const ringRadius = 60;
            for (let i = 0; i < nodes; i++) {
                const angle = (i / nodes) * Math.PI * 2;
                const x = cx + Math.cos(angle) * ringRadius;
                const y = cy + Math.sin(angle) * ringRadius;

                ctx.beginPath();
                ctx.arc(x, y, 6, 0, Math.PI * 2);
                ctx.fill();

                // Connect to center
                ctx.globalAlpha = 0.5;
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(cx, cy);
                ctx.stroke();

                // Connect to neighbors
                const nextAngle = ((i + 1) / nodes) * Math.PI * 2;
                const nx = cx + Math.cos(nextAngle) * ringRadius;
                const ny = cy + Math.sin(nextAngle) * ringRadius;
                ctx.globalAlpha = 0.3;
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(nx, ny);
                ctx.stroke();
            }

            // Center node
            ctx.globalAlpha = 1;
            ctx.beginPath();
            ctx.arc(cx, cy, 15, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.globalAlpha = 1;
    }
}

// ============================================
// Nested Reality Explorer
// ============================================

class RealityExplorer {
    constructor() {
        this.canvas = document.getElementById('realityCanvas');
        this.layerInfo = document.getElementById('layerInfo');
        this.buttons = document.querySelectorAll('.layer-btn');

        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.currentLayer = 'galaxy';
        this.animationTime = 0;

        this.layers = {
            galaxy: {
                info: 'Galaxies form collective consciousness structures—the hivemind of the universe built upon its celestial bodies.',
                color: '#7c3aed',
                elements: 50
            },
            solar: {
                info: 'Solar systems organize planetary consciousness through gravitational and electromagnetic relationships.',
                color: '#06b6d4',
                elements: 10
            },
            ecosystem: {
                info: 'Ecosystems demonstrate emergent intelligence through symbiotic relationships and resource optimization.',
                color: '#10b981',
                elements: 30
            },
            human: {
                info: 'Humans function as Earth\'s immune system—collective activity serving planetary homeostasis.',
                color: '#fbbf24',
                elements: 1
            },
            cell: {
                info: 'Cells form the hivemind of the human body, each contributing to collective consciousness.',
                color: '#8b5cf6',
                elements: 100
            },
            atom: {
                info: 'Atoms possess minimal experiential quality, aggregating into higher-level consciousness structures.',
                color: '#6b7280',
                elements: 200
            }
        };

        this.resize();
        this.setupListeners();
        this.animate();

        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = 400;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }

    setupListeners() {
        this.buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentLayer = btn.dataset.layer;
                this.layerInfo.textContent = this.layers[this.currentLayer].info;
            });
        });
    }

    drawLayer() {
        const layer = this.layers[this.currentLayer];
        const ctx = this.ctx;

        ctx.fillStyle = 'rgba(10, 14, 26, 0.9)';
        ctx.fillRect(0, 0, this.width, this.height);

        const cx = this.width / 2;
        const cy = this.height / 2;

        ctx.strokeStyle = layer.color;
        ctx.fillStyle = layer.color;

        if (this.currentLayer === 'galaxy') {
            // Spiral galaxy pattern
            for (let i = 0; i < layer.elements; i++) {
                const angle = this.animationTime * 0.5 + (i / layer.elements) * Math.PI * 6;
                const radius = (i / layer.elements) * 150;
                const x = cx + Math.cos(angle) * radius;
                const y = cy + Math.sin(angle) * radius * 0.4;

                ctx.globalAlpha = 0.3 + Math.random() * 0.4;
                ctx.beginPath();
                ctx.arc(x, y, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        } else if (this.currentLayer === 'solar') {
            // Orbital system
            ctx.strokeStyle = layer.color;
            ctx.fillStyle = '#fbbf24';

            // Central star
            ctx.beginPath();
            ctx.arc(cx, cy, 30, 0, Math.PI * 2);
            ctx.fill();

            // Orbiting planets
            for (let i = 0; i < layer.elements - 1; i++) {
                const orbitRadius = 50 + i * 25;
                const angle = this.animationTime * (0.5 - i * 0.05) + i;
                const x = cx + Math.cos(angle) * orbitRadius;
                const y = cy + Math.sin(angle) * orbitRadius * 0.3;

                ctx.globalAlpha = 0.6;
                ctx.beginPath();
                ctx.arc(x, y, 8 - i * 0.5, 0, Math.PI * 2);
                ctx.fill();

                // Orbit path
                ctx.globalAlpha = 0.2;
                ctx.beginPath();
                ctx.ellipse(cx, cy, orbitRadius, orbitRadius * 0.3, 0, 0, Math.PI * 2);
                ctx.stroke();
            }
        } else if (this.currentLayer === 'ecosystem') {
            // Network web
            const nodes = [];
            for (let i = 0; i < layer.elements; i++) {
                nodes.push({
                    x: Math.random() * this.width,
                    y: Math.random() * this.height
                });
            }

            nodes.forEach((node, i) => {
                ctx.globalAlpha = 0.5;
                ctx.beginPath();
                ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
                ctx.fill();

                nodes.forEach((node2, j) => {
                    if (i !== j) {
                        const dx = node.x - node2.x;
                        const dy = node.y - node2.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < 80) {
                            ctx.globalAlpha = (1 - dist / 80) * 0.3;
                            ctx.beginPath();
                            ctx.moveTo(node.x, node.y);
                            ctx.lineTo(node2.x, node2.y);
                            ctx.stroke();
                        }
                    }
                });
            });
        } else if (this.currentLayer === 'human') {
            // Human silhouette approximation
            ctx.globalAlpha = 0.8;
            ctx.beginPath();
            ctx.ellipse(cx, cy - 50, 40, 60, 0, 0, Math.PI * 2); // Head
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(cx, cy + 30, 60, 100, 0, 0, Math.PI * 2); // Body
            ctx.fill();

            // Neural network overlay
            ctx.strokeStyle = '#7c3aed';
            for (let i = 0; i < 20; i++) {
                const x = cx + (Math.random() - 0.5) * 150;
                const y = cy - 100 + Math.random() * 250;
                ctx.globalAlpha = 0.4;
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        } else if (this.currentLayer === 'cell') {
            // Cellular structure
            const cellSize = 30;
            const cols = Math.floor(this.width / cellSize);
            const rows = Math.floor(this.height / cellSize);

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const x = i * cellSize + cellSize / 2;
                    const y = j * cellSize + cellSize / 2;

                    ctx.globalAlpha = 0.3 + Math.sin(this.animationTime + i + j) * 0.2;
                    ctx.strokeStyle = layer.color;
                    ctx.beginPath();
                    ctx.arc(x, y, cellSize / 2 - 2, 0, Math.PI * 2);
                    ctx.stroke();

                    ctx.globalAlpha = 0.6;
                    ctx.beginPath();
                    ctx.arc(x, y, 5, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        } else if (this.currentLayer === 'atom') {
            // Atomic structure
            const atoms = [];
            for (let i = 0; i < 5; i++) {
                atoms.push({
                    x: cx + (Math.random() - 0.5) * 200,
                    y: cy + (Math.random() - 0.5) * 200
                });
            }

            atoms.forEach(atom => {
                // Nucleus
                ctx.globalAlpha = 1;
                ctx.fillStyle = layer.color;
                ctx.beginPath();
                ctx.arc(atom.x, atom.y, 8, 0, Math.PI * 2);
                ctx.fill();

                // Electron orbits
                ctx.strokeStyle = layer.color;
                ctx.globalAlpha = 0.4;
                for (let e = 0; e < 3; e++) {
                    const orbitAngle = this.animationTime * (1 + e) + e * Math.PI / 3;
                    const orbitX = atom.x + Math.cos(orbitAngle) * 25;
                    const orbitY = atom.y + Math.sin(orbitAngle) * 25 * 0.5;

                    ctx.beginPath();
                    ctx.arc(orbitX, orbitY, 3, 0, Math.PI * 2);
                    ctx.fill();
                }

                // Orbit paths
                ctx.globalAlpha = 0.1;
                ctx.beginPath();
                ctx.ellipse(atom.x, atom.y, 25, 12, 0, 0, Math.PI * 2);
                ctx.stroke();
            });
        }

        ctx.globalAlpha = 1;
    }

    animate() {
        this.animationTime += 0.02;
        this.drawLayer();
        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// Time Dilation Visualizer
// ============================================

class TimeDilation {
    constructor() {
        this.startBtn = document.getElementById('startTimelines');
        this.pauseBtn = document.getElementById('pauseTimelines');
        this.resetBtn = document.getElementById('resetTimelines');

        if (!this.startBtn) return;

        this.running = false;
        this.progress = 0;
        this.speeds = {
            quantum: 1.0,
            human: 0.5,
            planetary: 0.1,
            cosmic: 0.02
        };

        this.bars = {
            quantum: document.getElementById('quantumTimeline'),
            human: document.getElementById('humanTimeline'),
            planetary: document.getElementById('planetaryTimeline'),
            cosmic: document.getElementById('cosmicTimeline')
        };

        this.setupListeners();
        this.animate();
    }

    setupListeners() {
        this.startBtn.addEventListener('click', () => this.running = true);
        this.pauseBtn.addEventListener('click', () => this.running = false);
        this.resetBtn.addEventListener('click', () => {
            this.running = false;
            this.progress = 0;
            Object.values(this.bars).forEach(bar => {
                if (bar) bar.style.setProperty('--progress-width', '0%');
            });
        });
    }

    animate() {
        if (this.running) {
            this.progress += 0.5;
            if (this.progress > 100) this.progress = 0;

            Object.entries(this.bars).forEach(([key, bar]) => {
                if (bar) {
                    const width = (this.progress * this.speeds[key]) % 100;
                    bar.style.setProperty('--progress-width', `${width}%`);
                    bar.style.background = `linear-gradient(90deg,
                        var(--bio-violet) 0%,
                        var(--bio-cyan) ${width}%,
                        transparent ${width}%)`;
                }
            });
        }

        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// Navigation
// ============================================

function initNavigation() {
    const nav = document.getElementById('mainNav');
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');

    if (!nav || !toggle || !menu) return;

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Mobile toggle
    toggle.addEventListener('click', () => {
        menu.classList.toggle('active');
    });

    // Close menu on link click
    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
        });
    });
}

// ============================================
// Intersection Observer for Fade-in Animations
// ============================================

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.theory-card, .model-card, .media-item').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// ============================================
// Smooth Scroll for Anchor Links
// ============================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============================================
// Contact Form Handler
// ============================================

function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Here you would typically send to a server
        console.log('Form submitted:', data);

        // Show success message
        alert('Thank you for your message. This is a demo form.');
        form.reset();
    });
}

// ============================================
// Initialize All Components
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize canvas animations
    new FractalZoom('fractalCanvas');
    new ParticleSystem('fractalStackCanvas', { particleCount: 50 });
    new ParticleSystem('interfaceCanvas', { particleCount: 40 });
    new ParticleSystem('hivemindCanvas', { particleCount: 60 });
    new ParticleSystem('timeCanvas', { particleCount: 30 });
    new ParticleSystem('aiCanvas', { particleCount: 45 });

    // Model canvases
    new ParticleSystem('fractalModelCanvas', { particleCount: 30 });
    new ParticleSystem('gradientModelCanvas', { particleCount: 35 });
    new ParticleSystem('archModelCanvas', { particleCount: 25 });
    new ParticleSystem('hivemindModelCanvas', { particleCount: 50 });
    new ParticleSystem('timeModelCanvas', { particleCount: 20 });
    new ParticleSystem('blueprintModelCanvas', { particleCount: 40 });

    // About canvas
    new ParticleSystem('aboutCanvas', { particleCount: 50 });

    // Interactive components
    new ConsciousnessSlider();
    new RealityExplorer();
    new TimeDilation();

    // UI initialization
    initNavigation();
    initScrollAnimations();
    initSmoothScroll();
    initContactForm();

    console.log('Fractal Interface Theory website initialized');
});