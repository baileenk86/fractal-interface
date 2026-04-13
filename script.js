
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

    // Hero Canvas Animation (Placeholder: Simple Particle Effect)
    const heroCanvas = document.getElementById('heroCanvas');
    if (heroCanvas) {
        const ctx = heroCanvas.getContext('2d');
        let particles = [];

        function resizeCanvas() {
            heroCanvas.width = window.innerWidth;
            heroCanvas.height = window.innerHeight;
        }

        class Particle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 2 + 1; // 1 to 3
                this.speedX = Math.random() * 0.5 - 0.25; // -0.25 to 0.25
                this.speedY = Math.random() * 0.5 - 0.25;
                this.color = `rgba(0, 255, 192, ${Math.random() * 0.5 + 0.3})`; // Bioluminescent Green
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.size > 0.1) this.size -= 0.02;
            }
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function handleParticles() {
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
                if (particles[i].size <= 0.1) {
                    particles.splice(i, 1);
                    i--;
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
            handleParticles();
            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        animate();

        // Add particles on mouse move
        heroCanvas.addEventListener('mousemove', (event) => {
            for (let i = 0; i < 5; i++) {
                particles.push(new Particle(event.x, event.y));
            }
        });

        // Add pulsing effect to hero content (CSS based for now)
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.animation = 'pulseGlow 4s infinite alternate ease-in-out';
            const styleSheet = document.styleSheets[0];
            const keyframes = `@keyframes pulseGlow {
  0% { box-shadow: 0 0 30px rgba(0, 0, 0, 0.6), 0 0 10px var(--border-glow); }
  100% { box-shadow: 0 0 45px rgba(0, 0, 0, 0.8), 0 0 25px var(--bioluminescent-green); }
}`;
            styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
        }
    }

    // Consciousness Gradient Slider Logic
    const gradientSlider = document.getElementById('gradientSlider');
    if (gradientSlider) {
        gradientSlider.addEventListener('input', (event) => {
            const value = parseInt(event.target.value);
            const labels = ['Rock', 'Thermostat', 'Slime Mold', 'Dog', 'Human', 'AI'];
            console.log(`Consciousness Level: ${labels[value]}`);
            // Implement background shift or visual feedback here
            // e.g., document.body.style.background = `linear-gradient(to right, #121212, ${['#333', '#555', '#777', '#999', '#BBB', '#DDD'][value]})`;
        });
    }

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

    // Populate 'The Theory' section with parsed content from thesis_content
    // This will involve further parsing of the 'thesis_content' variable in Python
    // and then injecting the relevant parts into the sub-sections.
    // For now, the entire thesis content is in the 'the-theory' section.
});
