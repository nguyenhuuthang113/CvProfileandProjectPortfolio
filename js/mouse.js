class CursorEffect {
    constructor() {
        this.cursor = null;
        this.trails = [];
        this.trailCount = 20; // Increased trail count
        this.mousePosition = { x: 0, y: 0 };
        this.lastPosition = { x: 0, y: 0 };
        this.velocity = { x: 0, y: 0 };
        this.init();
    }

    init() {
        // Create main cursor
        this.cursor = document.createElement('div');
        this.cursor.className = 'cursor';
        document.body.appendChild(this.cursor);

        // Create enhanced trails
        for (let i = 0; i < this.trailCount; i++) {
            const trail = document.createElement('div');
            trail.className = 'trail';
            document.body.appendChild(trail);
            this.trails.push({
                element: trail,
                x: 0,
                y: 0,
                age: 0,
                active: false
            });
        }

        // Enhanced event listeners
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('mouseenter', () => {
            this.cursor.style.opacity = '1';
            this.cursor.classList.remove('active');
        });
        document.addEventListener('mouseleave', () => {
            this.cursor.style.opacity = '0';
            this.trails.forEach(trail => trail.element.style.opacity = '0');
        });

        // Enhanced hover effects
        const interactiveElements = 'a, button, [data-nav-link], .avatar-box, .title, .info-content';
        document.querySelectorAll(interactiveElements).forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.classList.add('active');
                if (el.classList.contains('avatar-box')) {
                    this.cursor.style.borderRadius = '20px';
                }
            });
            el.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('active');
                this.cursor.style.borderRadius = '50%';
            });
        });

        requestAnimationFrame(this.animate.bind(this));
    }

    handleMouseMove(e) {
        this.mousePosition.x = e.clientX;
        this.mousePosition.y = e.clientY;

        // Calculate velocity
        this.velocity.x = this.mousePosition.x - this.lastPosition.x;
        this.velocity.y = this.mousePosition.y - this.lastPosition.y;
        
        // Update cursor with easing
        this.updateCursorPosition();

        // Update trails with physics
        this.updateTrails();

        this.lastPosition.x = this.mousePosition.x;
        this.lastPosition.y = this.mousePosition.y;
    }

    updateCursorPosition() {
        const ease = 0.2;
        const cursorX = this.lastPosition.x + (this.mousePosition.x - this.lastPosition.x) * ease;
        const cursorY = this.lastPosition.y + (this.mousePosition.y - this.lastPosition.y) * ease;

        this.cursor.style.left = `${cursorX}px`;
        this.cursor.style.top = `${cursorY}px`;
    }

    updateTrails() {
        const speed = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
        const maxOpacity = Math.min(speed / 30, 0.5);

        this.trails.forEach((trail, index) => {
            const delay = index * 2;
            setTimeout(() => {
                trail.x = this.mousePosition.x;
                trail.y = this.mousePosition.y;
                trail.element.style.left = `${trail.x}px`;
                trail.element.style.top = `${trail.y}px`;
                trail.element.style.opacity = maxOpacity - (index * 0.025);
                trail.element.classList.add('active');
            }, delay);
        });
    }

    animate() {
        // Smooth trail fade out
        this.trails.forEach(trail => {
            const currentOpacity = parseFloat(trail.element.style.opacity) || 0;
            trail.element.style.opacity = Math.max(0, currentOpacity * 0.95);
        });

        requestAnimationFrame(this.animate.bind(this));
    }
}

// Initialize with error handling
document.addEventListener('DOMContentLoaded', () => {
    try {
        new CursorEffect();
        document.body.style.cursor = 'none';
    } catch (error) {
        console.error('Cursor effect initialization failed:', error);
        document.body.style.cursor = 'auto';
    }
});