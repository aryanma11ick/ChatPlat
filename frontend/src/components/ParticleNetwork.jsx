"use client";
import { useEffect, useRef } from 'react';

export default function ParticleNetwork() {
    const canvasRef = useRef(null);
    const mousePosRef = useRef({ x: null, y: null });
    const particlesRef = useRef([]);
    const animationIdRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width = window.innerWidth;
        let height = window.innerHeight;

        // Initialize particles with density based on screen size
        const initParticles = () => {
            const density = Math.floor((width * height) / 10000);
            particlesRef.current = Array.from({ length: Math.min(density, 150) }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 3 + 1,
                speedX: Math.random() * 2 - 1,
                speedY: Math.random() * 2 - 1,
                color: `rgba(150, 180, 255, ${Math.random() * 0.3 + 0.2})`,
                originalX: Math.random() * width,
                originalY: Math.random() * height
            }));
        };

        const handleMouseMove = (e) => {
            mousePosRef.current = {
                x: e.clientX,
                y: e.clientY
            };
        };

        const handleMouseLeave = () => {
            mousePosRef.current = { x: null, y: null };
        };

        const connectParticles = () => {
            const particles = particlesRef.current;
            const maxDistance = width < 768 ? 100 : 150;

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(150, 180, 255, ${1 - distance/maxDistance})`;
                        ctx.lineWidth = 0.7;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            const mouse = mousePosRef.current;
            const particles = particlesRef.current;

            particles.forEach(p => {
                // Mouse repulsion effect
                if (mouse.x && mouse.y) {
                    const dx = mouse.x - p.x;
                    const dy = mouse.y - p.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const maxDist = 150;

                    if (distance < maxDist) {
                        const force = (maxDist - distance) / maxDist;
                        p.x -= (dx / distance) * force * 10;
                        p.y -= (dy / distance) * force * 10;
                    }
                }

                // Boundary bounce with momentum preservation
                if (p.x < 0 || p.x > width) p.speedX *= -0.9;
                if (p.y < 0 || p.y > height) p.speedY *= -0.9;

                // Natural movement
                p.x += p.speedX * 0.5;
                p.y += p.speedY * 0.5;

                // Draw particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
            });

            connectParticles();
            animationIdRef.current = requestAnimationFrame(animate);
        };

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            initParticles();
        };

        // Initial setup
        canvas.width = width;
        canvas.height = height;
        initParticles();
        animate();

        // Event listeners
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationIdRef.current);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10"
        />
    );
}