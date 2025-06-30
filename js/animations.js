// Advanced Animations JavaScript

// Matrix Rain Effect
class MatrixRain {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        this.fontSize = 14;
        this.columns = 0;
        this.drops = [];
        
        this.init();
        this.animate();
    }
    
    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        
        // Initialize drops
        for (let i = 0; i < this.columns; i++) {
            this.drops[i] = Math.random() * -100;
        }
    }
    
    draw() {
        // Semi-transparent black background for trail effect
        this.ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Green text
        this.ctx.fillStyle = '#00ff88';
        this.ctx.font = `${this.fontSize}px 'Fira Code', monospace`;
        
        for (let i = 0; i < this.drops.length; i++) {
            const char = this.characters[Math.floor(Math.random() * this.characters.length)];
            const x = i * this.fontSize;
            const y = this.drops[i] * this.fontSize;
            
            this.ctx.fillText(char, x, y);
            
            // Reset drop when it reaches bottom
            if (y > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            
            this.drops[i]++;
        }
    }
    
    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
    
    resize() {
        this.init();
    }
}

// Particle System
class ParticleSystem {
    constructor(container) {
        this.container = container;
        this.particles = [];
        this.maxParticles = 50;
        
        this.init();
        this.animate();
    }
    
    init() {
        for (let i = 0; i < this.maxParticles; i++) {
            this.createParticle();
        }
    }
    
    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 4 + 1;
        const x = Math.random() * window.innerWidth;
        const y = window.innerHeight + 10;
        const speed = Math.random() * 2 + 1;
        const opacity = Math.random() * 0.5 + 0.3;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: #00ff88;
            border-radius: 50%;
            opacity: ${opacity};
            pointer-events: none;
            z-index: 1;
        `;
        
        particle.speed = speed;
        particle.life = 0;
        particle.maxLife = Math.random() * 200 + 100;
        
        this.container.appendChild(particle);
        this.particles.push(particle);
    }
    
    updateParticles() {
        this.particles.forEach((particle, index) => {
            particle.life++;
            const currentTop = parseFloat(particle.style.top);
            
            // Move particle up
            particle.style.top = (currentTop - particle.speed) + 'px';
            
            // Fade out as it reaches the top
            const progress = particle.life / particle.maxLife;
            const opacity = Math.max(0, 1 - progress);
            particle.style.opacity = opacity;
            
            // Remove particle when it's done
            if (particle.life >= particle.maxLife || currentTop < -10) {
                this.container.removeChild(particle);
                this.particles.splice(index, 1);
                this.createParticle(); // Create new particle
            }
        });
    }
    
    animate() {
        this.updateParticles();
        requestAnimationFrame(() => this.animate());
    }
}

// Glitch Effect
class GlitchEffect {
    constructor(element) {
        this.element = element;
        this.originalText = element.textContent;
        this.glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        
        this.element.addEventListener('mouseenter', () => this.startGlitch());
        this.element.addEventListener('mouseleave', () => this.stopGlitch());
    }
    
    startGlitch() {
        this.isGlitching = true;
        this.glitch();
    }
    
    stopGlitch() {
        this.isGlitching = false;
        this.element.textContent = this.originalText;
    }
    
    glitch() {
        if (!this.isGlitching) return;
        
        const glitchedText = this.originalText
            .split('')
            .map(char => {
                if (Math.random() < 0.1) {
                    return this.glitchChars[Math.floor(Math.random() * this.glitchChars.length)];
                }
                return char;
            })
            .join('');
        
        this.element.textContent = glitchedText;
        
        setTimeout(() => {
            if (this.isGlitching) {
                this.element.textContent = this.originalText;
                setTimeout(() => this.glitch(), Math.random() * 100 + 50);
            }
        }, 50);
    }
}

// Typewriter Effect
class TypewriterEffect {
    constructor(element, options = {}) {
        this.element = element;
        this.text = options.text || element.textContent;
        this.speed = options.speed || 100;
        this.delay = options.delay || 0;
        this.cursor = options.cursor !== false;
        
        this.element.textContent = '';
        if (this.cursor) {
            this.element.innerHTML = '<span class="cursor">|</span>';
        }
        
        setTimeout(() => this.type(), this.delay);
    }
    
    type() {
        let i = 0;
        const timer = setInterval(() => {
            if (i < this.text.length) {
                if (this.cursor) {
                    this.element.innerHTML = this.text.substring(0, i + 1) + '<span class="cursor">|</span>';
                } else {
                    this.element.textContent = this.text.substring(0, i + 1);
                }
                i++;
            } else {
                clearInterval(timer);
                if (this.cursor) {
                    // Keep cursor blinking
                    this.element.innerHTML = this.text + '<span class="cursor">|</span>';
                }
            }
        }, this.speed);
    }
}

// Morphing Text Effect
class MorphingText {
    constructor(element, texts, options = {}) {
        this.element = element;
        this.texts = texts;
        this.currentIndex = 0;
        this.speed = options.speed || 2000;
        this.morphSpeed = options.morphSpeed || 50;
        
        this.start();
    }
    
    start() {
        setInterval(() => {
            this.morphToNext();
        }, this.speed);
    }
    
    morphToNext() {
        const currentText = this.texts[this.currentIndex];
        const nextIndex = (this.currentIndex + 1) % this.texts.length;
        const nextText = this.texts[nextIndex];
        
        this.morphText(currentText, nextText, () => {
            this.currentIndex = nextIndex;
        });
    }
    
    morphText(from, to, callback) {
        const maxLength = Math.max(from.length, to.length);
        let progress = 0;
        
        const timer = setInterval(() => {
            let morphed = '';
            
            for (let i = 0; i < maxLength; i++) {
                const fromChar = from[i] || '';
                const toChar = to[i] || '';
                
                if (i < progress) {
                    morphed += toChar;
                } else if (i < progress + 3) {
                    morphed += this.getRandomChar();
                } else {
                    morphed += fromChar;
                }
            }
            
            this.element.textContent = morphed;
            progress++;
            
            if (progress > maxLength + 3) {
                clearInterval(timer);
                this.element.textContent = to;
                if (callback) callback();
            }
        }, this.morphSpeed);
    }
    
    getRandomChar() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        return chars[Math.floor(Math.random() * chars.length)];
    }
}

// Wave Text Effect
class WaveText {
    constructor(element) {
        this.element = element;
        this.text = element.textContent;
        this.createWaveText();
    }
    
    createWaveText() {
        this.element.innerHTML = '';
        
        this.text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.cssText = `
                display: inline-block;
                animation: wave 2s ease-in-out infinite;
                animation-delay: ${index * 0.1}s;
            `;
            this.element.appendChild(span);
        });
        
        // Add wave animation CSS if not exists
        if (!document.querySelector('#wave-animation-style')) {
            const style = document.createElement('style');
            style.id = 'wave-animation-style';
            style.textContent = `
                @keyframes wave {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Matrix Rain
    const matrixCanvas = document.getElementById('matrix-canvas');
    if (matrixCanvas) {
        const matrix = new MatrixRain(matrixCanvas);
        
        window.addEventListener('resize', () => {
            matrix.resize();
        });
    }
    
    // Initialize Particle System
    const particlesContainer = document.querySelector('.particles');
    if (particlesContainer) {
        new ParticleSystem(particlesContainer);
    }
    
    // Initialize Glitch Effects
    const glitchElements = document.querySelectorAll('.glitch');
    glitchElements.forEach(element => {
        new GlitchEffect(element);
    });
    
    // Initialize Typewriter Effects
    const typewriterElements = document.querySelectorAll('.typewriter');
    typewriterElements.forEach((element, index) => {
        new TypewriterEffect(element, {
            delay: index * 500
        });
    });
    
    // Initialize Wave Text
    const waveElements = document.querySelectorAll('.wave-text');
    waveElements.forEach(element => {
        new WaveText(element);
    });
    
    // Initialize Morphing Text for rotating roles
    const rotatingTextElement = document.querySelector('.rotating-text');
    if (rotatingTextElement) {
        const roles = [
            'Web Developer',
            'Cyber Security Engineer', 
            'IT Consultant',
            'Investor',
            'Informatics Engineer'
        ];
        
        // Clear existing content
        rotatingTextElement.innerHTML = '<span class="morphing-role"></span>';
        const morphingElement = rotatingTextElement.querySelector('.morphing-role');
        
        new MorphingText(morphingElement, roles, {
            speed: 3000,
            morphSpeed: 30
        });
    }
});

// Scroll-triggered animations
function initializeScrollTriggers() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Add specific animations based on element class
                if (element.classList.contains('skill-card')) {
                    element.style.animation = 'bounceIn 0.8s ease-out forwards';
                } else if (element.classList.contains('service-item')) {
                    element.style.animation = 'slideInLeft 0.6s ease-out forwards';
                } else if (element.classList.contains('portfolio-item')) {
                    element.style.animation = 'zoomIn 0.5s ease-out forwards';
                }
                
                observer.unobserve(element);
            }
        });
    }, observerOptions);
    
    // Observe elements
    const animatedElements = document.querySelectorAll('.skill-card, .service-item, .portfolio-item');
    animatedElements.forEach(el => observer.observe(el));
}

// Initialize scroll triggers
initializeScrollTriggers();

// Cursor trail effect
class CursorTrail {
    constructor() {
        this.trails = [];
        this.maxTrails = 10;
        this.init();
    }
    
    init() {
        document.addEventListener('mousemove', (e) => {
            this.addTrail(e.clientX, e.clientY);
        });
        
        this.animate();
    }
    
    addTrail(x, y) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.cssText = `
            position: fixed;
            width: 6px;
            height: 6px;
            background: #00ff88;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${x - 3}px;
            top: ${y - 3}px;
            opacity: 1;
            transform: scale(1);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(trail);
        this.trails.push({
            element: trail,
            life: 0,
            maxLife: 30
        });
        
        if (this.trails.length > this.maxTrails) {
            const oldTrail = this.trails.shift();
            if (oldTrail.element.parentNode) {
                oldTrail.element.parentNode.removeChild(oldTrail.element);
            }
        }
    }
    
    animate() {
        this.trails.forEach((trail, index) => {
            trail.life++;
            const progress = trail.life / trail.maxLife;
            const opacity = 1 - progress;
            const scale = 1 - progress * 0.5;
            
            trail.element.style.opacity = opacity;
            trail.element.style.transform = `scale(${scale})`;
            
            if (trail.life >= trail.maxLife) {
                if (trail.element.parentNode) {
                    trail.element.parentNode.removeChild(trail.element);
                }
                this.trails.splice(index, 1);
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize cursor trail on desktop only
if (window.innerWidth > 768) {
    new CursorTrail();
}

// Export classes for external use
window.MatrixRain = MatrixRain;
window.ParticleSystem = ParticleSystem;
window.GlitchEffect = GlitchEffect;
window.TypewriterEffect = TypewriterEffect;
window.MorphingText = MorphingText;
window.WaveText = WaveText;

