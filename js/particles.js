// Advanced Particle System

class AdvancedParticleSystem {
    constructor(container, options = {}) {
        this.container = container;
        this.particles = [];
        this.connections = [];
        
        // Configuration
        this.config = {
            particleCount: options.particleCount || 80,
            particleSize: options.particleSize || 2,
            particleSpeed: options.particleSpeed || 0.5,
            connectionDistance: options.connectionDistance || 120,
            particleColor: options.particleColor || '#00ff88',
            connectionColor: options.connectionColor || '#00ff88',
            connectionOpacity: options.connectionOpacity || 0.3,
            mouseInteraction: options.mouseInteraction !== false,
            mouseRadius: options.mouseRadius || 150,
            ...options
        };
        
        this.mouse = { x: 0, y: 0 };
        this.canvas = null;
        this.ctx = null;
        
        this.init();
        this.bindEvents();
        this.animate();
    }
    
    init() {
        // Create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;
        
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        this.resize();
        this.createParticles();
    }
    
    resize() {
        const rect = this.container.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }
    
    createParticles() {
        this.particles = [];
        
        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * this.config.particleSpeed,
                vy: (Math.random() - 0.5) * this.config.particleSpeed,
                size: Math.random() * this.config.particleSize + 1,
                opacity: Math.random() * 0.5 + 0.5,
                originalSize: 0
            });
        }
        
        // Store original sizes
        this.particles.forEach(particle => {
            particle.originalSize = particle.size;
        });
    }
    
    bindEvents() {
        if (this.config.mouseInteraction) {
            this.container.addEventListener('mousemove', (e) => {
                const rect = this.container.getBoundingClientRect();
                this.mouse.x = e.clientX - rect.left;
                this.mouse.y = e.clientY - rect.top;
            });
            
            this.container.addEventListener('mouseleave', () => {
                this.mouse.x = -1000;
                this.mouse.y = -1000;
            });
        }
        
        window.addEventListener('resize', () => {
            this.resize();
        });
    }
    
    updateParticles() {
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -1;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= -1;
            }
            
            // Keep particles within bounds
            particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            
            // Mouse interaction
            if (this.config.mouseInteraction) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.config.mouseRadius) {
                    const force = (this.config.mouseRadius - distance) / this.config.mouseRadius;
                    const angle = Math.atan2(dy, dx);
                    
                    particle.vx -= Math.cos(angle) * force * 0.01;
                    particle.vy -= Math.sin(angle) * force * 0.01;
                    
                    // Increase size when near mouse
                    particle.size = particle.originalSize * (1 + force);
                } else {
                    // Return to original size
                    particle.size = particle.originalSize;
                }
            }
        });
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = this.hexToRgba(this.config.particleColor, particle.opacity);
            this.ctx.fill();
            
            // Add glow effect
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = this.config.particleColor;
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        });
    }
    
    drawConnections() {
        this.connections = [];
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.config.connectionDistance) {
                    const opacity = (1 - distance / this.config.connectionDistance) * this.config.connectionOpacity;
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = this.hexToRgba(this.config.connectionColor, opacity);
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                    
                    this.connections.push({
                        from: this.particles[i],
                        to: this.particles[j],
                        distance: distance,
                        opacity: opacity
                    });
                }
            }
        }
    }
    
    hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.updateParticles();
        this.drawConnections();
        this.drawParticles();
        
        requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// Floating Particles for Hero Section
class FloatingParticles {
    constructor(container) {
        this.container = container;
        this.particles = [];
        this.particleCount = 30;
        
        this.init();
        this.animate();
    }
    
    init() {
        for (let i = 0; i < this.particleCount; i++) {
            this.createParticle();
        }
    }
    
    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        
        const size = Math.random() * 6 + 2;
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, #00ff88, transparent);
            border-radius: 50%;
            opacity: ${Math.random() * 0.7 + 0.3};
            pointer-events: none;
            animation: float ${duration}s linear infinite ${delay}s;
        `;
        
        this.container.appendChild(particle);
        this.particles.push(particle);
        
        // Remove and recreate particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
                const index = this.particles.indexOf(particle);
                if (index > -1) {
                    this.particles.splice(index, 1);
                }
                this.createParticle();
            }
        }, (duration + delay) * 1000);
    }
    
    animate() {
        // Add CSS animation if not exists
        if (!document.querySelector('#floating-particles-style')) {
            const style = document.createElement('style');
            style.id = 'floating-particles-style';
            style.textContent = `
                @keyframes float {
                    0% {
                        transform: translateY(100vh) translateX(0px) rotate(0deg);
                        opacity: 0;
                    }
                    10% {
                        opacity: 1;
                    }
                    90% {
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(-100px) translateX(100px) rotate(360deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// DNA Helix Particles
class DNAHelix {
    constructor(container) {
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.time = 0;
        
        this.init();
        this.animate();
    }
    
    init() {
        this.canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;
        
        this.container.appendChild(this.canvas);
        this.resize();
        
        // Create particles for DNA strands
        for (let i = 0; i < 100; i++) {
            this.particles.push({
                angle: (i / 100) * Math.PI * 4,
                radius: 50,
                y: (i / 100) * this.canvas.height,
                color: i % 2 === 0 ? '#00ff88' : '#ff6b35'
            });
        }
    }
    
    resize() {
        const rect = this.container.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const centerX = this.canvas.width / 2;
        this.time += 0.02;
        
        this.particles.forEach((particle, index) => {
            const x1 = centerX + Math.cos(particle.angle + this.time) * particle.radius;
            const x2 = centerX + Math.cos(particle.angle + this.time + Math.PI) * particle.radius;
            const y = particle.y + Math.sin(this.time + index * 0.1) * 10;
            
            // Draw particles
            this.ctx.beginPath();
            this.ctx.arc(x1, y, 3, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.fill();
            
            this.ctx.beginPath();
            this.ctx.arc(x2, y, 3, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.fill();
            
            // Draw connections
            if (index % 10 === 0) {
                this.ctx.beginPath();
                this.ctx.moveTo(x1, y);
                this.ctx.lineTo(x2, y);
                this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                this.ctx.lineWidth = 1;
                this.ctx.stroke();
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize particle systems when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize main particle system for hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        new AdvancedParticleSystem(heroSection, {
            particleCount: 60,
            particleSize: 3,
            particleSpeed: 0.3,
            connectionDistance: 100,
            mouseInteraction: true,
            mouseRadius: 120
        });
    }
    
    // Initialize floating particles
    const particlesContainer = document.querySelector('.particles');
    if (particlesContainer) {
        new FloatingParticles(particlesContainer);
    }
    
    // Initialize particle systems for other sections
    const skillsSection = document.querySelector('.skills');
    if (skillsSection) {
        new AdvancedParticleSystem(skillsSection, {
            particleCount: 40,
            particleSize: 2,
            particleSpeed: 0.2,
            connectionDistance: 80,
            mouseInteraction: false,
            particleColor: '#00ff88',
            connectionColor: '#00ff88',
            connectionOpacity: 0.2
        });
    }
    
    // Add resize handler for all particle systems
    window.addEventListener('resize', () => {
        // Particle systems handle their own resize events
    });
});

// Export classes
window.AdvancedParticleSystem = AdvancedParticleSystem;
window.FloatingParticles = FloatingParticles;
window.DNAHelix = DNAHelix;

