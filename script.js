
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - (document.querySelector('#navbar') ? document.querySelector('#navbar').offsetHeight : 0),
                    behavior: 'smooth'
                });
            }
        });
    });

    // Hero Canvas Animation (Glowing Trail Effect)
    const heroCanvas = document.getElementById('heroCanvas');
    if (heroCanvas) {
        const ctx = heroCanvas.getContext('2d');
        let particles = [];
        const maxParticles = 100;

        function resizeCanvas() {
            heroCanvas.width = window.innerWidth;
            heroCanvas.height = window.innerHeight;
        }

        class Particle {
            constructor(x, y, hue) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 2 + 1; // 1 to 3
                this.speedX = Math.random() * 0.5 - 0.25; // -0.25 to 0.25
                this.speedY = Math.random() * 0.5 - 0.25;
                this.life = 0;
                this.maxLife = Math.random() * 30 + 30;
                this.hue = hue;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.life++;
                if (this.size > 0.1) this.size -= 0.05;
            }
            draw() {
                ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${1 - this.life / this.maxLife})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function handleParticles() {
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
                if (particles[i].life >= particles[i].maxLife || particles[i].size <= 0.1) {
                    particles.splice(i, 1);
                    i--;
                }
            }
        }

        let mouse = { x: undefined, y: undefined };
        let hue = 0;

        heroCanvas.addEventListener('mousemove', (event) => {
            mouse.x = event.x;
            mouse.y = event.y;
            for (let i = 0; i < 3; i++) {
                if (particles.length < maxParticles) {
                    particles.push(new Particle(mouse.x, mouse.y, hue));
                }
            }
        });

        function animate() {
            ctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
            // ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; // subtle trail effect
            // ctx.fillRect(0, 0, heroCanvas.width, heroCanvas.height);
            handleParticles();
            hue+=2;
            if (hue > 360) hue = 0;
            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        animate();

        // Pulsing effect handled by CSS now
    }

    // --- Visual Models Drawing Functions ---

    // 1. Fractal Stack Diagram
    function drawFractalStack(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        // Set canvas dimensions based on its container, ensuring it's responsive
        const container = canvas.parentElement;
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;

        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const maxRadius = Math.min(canvas.width, canvas.height) / 2 - 20; // Max radius, with some padding
        const numLayers = 5;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < numLayers; i++) {
            const radius = maxRadius * (1 - i / numLayers);
            const alpha = 0.1 + (i / numLayers) * 0.4; // Outer layers more transparent
            const color = `hsla(180, 100%, 70%, ${alpha})`; // Bioluminescent Green hue

            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);

            ctx.strokeStyle = color;
            ctx.lineWidth = 2 + (numLayers - i) * 0.5; // Thicker outer lines
            ctx.shadowColor = `hsla(180, 100%, 70%, ${alpha * 2})`;
            ctx.shadowBlur = 10 + (numLayers - i) * 5; // Stronger glow for outer layers
            ctx.stroke();

            // Optional: fill with a very subtle gradient or color
            ctx.fillStyle = `hsla(180, 100%, 70%, ${alpha / 5})`;
            ctx.shadowBlur = 0; // Reset shadow for fill
            ctx.fill();
        }

        // Add a central pulsing node
        ctx.beginPath();
        ctx.arc(centerX, centerY, maxRadius * 0.1, 0, Math.PI * 2);
        ctx.fillStyle = 'var(--soft-gold)';
        ctx.shadowColor = 'var(--soft-gold)';
        ctx.shadowBlur = 15;
        ctx.fill();
    }

    // 2. Consciousness Gradient Map
    function drawConsciousnessGradient(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const container = canvas.parentElement;
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;

        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const maxRadius = Math.min(canvas.width, canvas.height) / 2 - 20;
        const numLevels = 6; // Rock, Thermostat, Slime Mold, Dog, Human, AI

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Get the current gradient level from CSS variable (updated by slider)
        const gradientLevel = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--gradient-level')) || 0.5;

        for (let i = 0; i < numLevels; i++) {
            const levelRadius = maxRadius * (0.2 + i / numLevels * 0.8); // Rings expand outwards
            const intensity = i / (numLevels - 1); // 0 to 1

            // Interpolate color based on intensity, aiming for a neural-violet to bioluminescent-green to soft-gold blend
            let hue, saturation, lightness;
            if (intensity <= 0.5) { // Violet to Green
                hue = 270 + (180 - 270) * (intensity * 2); // Neural Violet (270) to Bioluminescent Green (180)
                saturation = 100;
                lightness = 30 + (70 - 30) * (intensity * 2);
            } else { // Green to Gold
                hue = 180 + (45 - 180) * ((intensity - 0.5) * 2); // Bioluminescent Green (180) to Soft Gold (45)
                saturation = 100;
                lightness = 70 + (70 - 70) * ((intensity - 0.5) * 2);
            }

            const alpha = 0.1 + intensity * 0.6; // More intense for higher levels

            ctx.beginPath();
            ctx.arc(centerX, centerY, levelRadius, 0, Math.PI * 2);

            ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
            ctx.lineWidth = 2 + intensity * 3; // Thicker lines for higher consciousness
            ctx.shadowColor = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha * 2})`;
            ctx.shadowBlur = 5 + intensity * 10;
            ctx.stroke();

            // Highlight the active level based on the slider value
            if (Math.round(gradientLevel * (numLevels - 1)) === i) {
                ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha * 0.5})`;
                ctx.shadowBlur = 20; // Stronger glow for active
                ctx.fill();
            } else {
                ctx.shadowBlur = 0; // Reset shadow for fill
            }
        }

        // Central pulse/core, similar to Fractal Stack
        ctx.beginPath();
        ctx.arc(centerX, centerY, maxRadius * 0.1, 0, Math.PI * 2);
        ctx.fillStyle = 'var(--soft-gold)';
        ctx.shadowColor = 'var(--soft-gold)';
        ctx.shadowBlur = 15;
        ctx.fill();
    }

    // 3. Interface Architecture Diagram
    function drawInterfaceArchitecture(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const container = canvas.parentElement;
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const labels = ['Consciousness', 'Interface', 'Rendered World'];
        const numStages = labels.length;
        const padding = 50;
        const stageWidth = (canvas.width - padding * 2) / numStages;
        const startY = canvas.height / 2;

        ctx.font = '1.2rem IBM Plex Sans';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (let i = 0; i < numStages; i++) {
            const x = padding + i * stageWidth + stageWidth / 2;

            // Draw the node/stage
            ctx.beginPath();
            ctx.arc(x, startY, 20, 0, Math.PI * 2);
            ctx.fillStyle = 'var(--neural-violet)';
            ctx.shadowColor = 'var(--neural-violet)';
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.strokeStyle = 'var(--neural-violet)';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw the label
            ctx.shadowBlur = 0; // Reset shadow for text
            ctx.fillStyle = 'var(--text-light)';
            ctx.fillText(labels[i], x, startY + 40);

            // Draw connecting lines/arrows
            if (i < numStages - 1) {
                const nextX = padding + (i + 1) * stageWidth + stageWidth / 2;
                const controlOffset = 50; // For curve effect

                ctx.beginPath();
                ctx.moveTo(x + 20, startY);
                ctx.bezierCurveTo(x + 20 + controlOffset, startY - 20,
                                  nextX - 20 - controlOffset, startY - 20,
                                  nextX - 20, startY);
                ctx.strokeStyle = 'var(--bioluminescent-green)';
                ctx.lineWidth = 2;
                ctx.shadowColor = 'var(--bioluminescent-green)';
                ctx.shadowBlur = 8;
                ctx.stroke();

                // Draw arrowhead (simple triangle)
                ctx.fillStyle = 'var(--bioluminescent-green)';
                ctx.save();
                ctx.translate(nextX - 20, startY);
                ctx.rotate(Math.atan2(0, -1)); // Point left initially, will be rotated
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(-10, -5);
                ctx.lineTo(-10, 5);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            }
        }
    }

    // 4. Nested Hivemind Diagram
    function drawNestedHivemind(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const container = canvas.parentElement;
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const maxRadius = Math.min(canvas.width, canvas.height) / 2 - 30; // Max radius with some padding

        const layers = [
            { label: 'Atoms', color: 'hsla(0, 0%, 100%, 0.1)', radiusRatio: 0.1 },
            { label: 'Cells', color: 'hsla(120, 70%, 70%, 0.2)', radiusRatio: 0.25 },
            { label: 'Organisms', color: 'hsla(60, 90%, 70%, 0.3)', radiusRatio: 0.45 },
            { label: 'Ecosystems', color: 'hsla(180, 100%, 70%, 0.4)', radiusRatio: 0.65 },
            { label: 'Earth', color: 'hsla(240, 80%, 70%, 0.5)', radiusRatio: 0.8 },
            { label: 'Galaxy', color: 'hsla(270, 90%, 70%, 0.6)', radiusRatio: 1.0 }
        ];

        ctx.font = '1rem IBM Plex Sans';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Draw nested rings
        layers.forEach((layer, index) => {
            const radius = maxRadius * layer.radiusRatio;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.strokeStyle = layer.color;
            ctx.lineWidth = 2 + index * 0.5;
            ctx.shadowColor = layer.color;
            ctx.shadowBlur = 10 + index * 2;
            ctx.stroke();

            // Draw labels slightly outside the rings
            const labelRadius = radius + 20; // Position label a bit outside the circle
            const angle = (Math.PI * 2 / layers.length) * index; // Distribute labels around the circle
            const labelX = centerX + labelRadius * Math.cos(angle - Math.PI / 2); // Adjust angle for better positioning
            const labelY = centerY + labelRadius * Math.sin(angle - Math.PI / 2);

            ctx.shadowBlur = 0;
            ctx.fillStyle = 'var(--text-light)';
            ctx.fillText(layer.label, labelX, labelY);
        });

        // Central core for the 'collective consciousness' or focal point
        ctx.beginPath();
        ctx.arc(centerX, centerY, maxRadius * 0.08, 0, Math.PI * 2);
        ctx.fillStyle = 'var(--soft-gold)';
        ctx.shadowColor = 'var(--soft-gold)';
        ctx.shadowBlur = 15;
        ctx.fill();
    }

    // Call the drawing function when DOM is ready and on resize
    drawFractalStack('fractal-stack-canvas');
    window.addEventListener('resize', () => drawFractalStack('fractal-stack-canvas'));

    drawConsciousnessGradient('consciousness-gradient-canvas');
    window.addEventListener('resize', () => drawConsciousnessGradient('consciousness-gradient-canvas'));
    // Re-draw gradient on slider input to show active level
    const gradientSlider = document.getElementById('gradientSlider');
    if (gradientSlider) {
        gradientSlider.addEventListener('input', (event) => {
            const value = parseInt(event.target.value);
            const labels = ['Rock', 'Thermostat', 'Slime Mold', 'Dog', 'Human', 'AI'];
            console.log(`Consciousness Level: ${labels[value]}`);
            document.documentElement.style.setProperty('--gradient-level', value / (labels.length - 1));
            drawConsciousnessGradient('consciousness-gradient-canvas'); // Re-draw to update highlight
        });
    }

    drawInterfaceArchitecture('interface-architecture-canvas');
    window.addEventListener('resize', () => drawInterfaceArchitecture('interface-architecture-canvas'));

    drawNestedHivemind('nested-hivemind-canvas');
    window.addEventListener('resize', () => drawNestedHivemind('nested-hivemind-canvas'));

    // Nested Reality Explorer Logic
    document.querySelectorAll('.explorer-container .layer').forEach(layer => {
        layer.addEventListener('click', (event) => {
            alert(`Exploring: ${event.target.textContent} layer`);
            // Implement dynamic content loading or visual expansion here
        });
    });

    // Time Dilation Visualizer (simple animation for demonstration)
    const fastTimeline = document.querySelector('.timeline.fast');
    const slowTimeline = document.querySelector('.timeline.slow');
    if (fastTimeline && slowTimeline) {
        let fastProgress = 0;
        let slowProgress = 0;

        function updateTimelines() {
            fastProgress = (fastProgress + 0.005) % 1;
            slowProgress = (slowProgress + 0.001) % 1;

            fastTimeline.style.background = `linear-gradient(to right, var(--bioluminescent-green) ${fastProgress * 100}%, #00A88B ${fastProgress * 100}%)`;
            slowTimeline.style.background = `linear-gradient(to right, var(--neural-violet) ${slowProgress * 100}%, #6A11CB ${slowProgress * 100}%)`;

            requestAnimationFrame(updateTimelines);
        }
        requestAnimationFrame(updateTimelines);
    }

    // Interface Reveal Hover Effects (Placeholder for later CSS/JS)
    document.querySelectorAll('.model-container > div, .interactive-tool').forEach(item => {
        item.addEventListener('mouseenter', () => {
            // Add a class or inline style for geometric/data-structure pattern reveal
            // e.g., item.style.setProperty('--after-width', '100%');
        });
        item.addEventListener('mouseleave', () => {
            // Reset the effect
            // e.g., item.style.setProperty('--after-width', '0%');
        });
    });
});
