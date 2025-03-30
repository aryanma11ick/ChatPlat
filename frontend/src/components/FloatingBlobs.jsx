// components/FloatingBlobs.jsx
"use client";
import { useEffect, useRef } from 'react';

export default function FloatingBlobs() {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        const blobs = [];
        const colors = ['#e2e8f0', '#cbd5e1', '#94a3b8'];
        const blobCount = 5;

        class Blob {
            constructor() {
                this.size = Math.random() * 200 + 100;
                this.x = Math.random() * window.innerWidth;
                this.y = Math.random() * window.innerHeight;
                this.targetX = Math.random() * window.innerWidth;
                this.targetY = Math.random() * window.innerHeight;
                this.speed = Math.random() * 0.02 + 0.01;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.element = document.createElement('div');
                this.element.className = 'absolute rounded-full blur-xl';
                this.element.style.width = `${this.size}px`;
                this.element.style.height = `${this.size}px`;
                this.element.style.backgroundColor = this.color;
                container.appendChild(this.element);
            }

            update(mouseX, mouseY) {
                // Move toward target
                this.x += (this.targetX - this.x) * this.speed;
                this.y += (this.targetY - this.y) * this.speed;

                // React to mouse
                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 200) {
                    this.targetX = this.x - dx * 0.1;
                    this.targetY = this.y - dy * 0.1;
                }

                // Change target if close
                if (Math.abs(this.targetX - this.x) < 10 && Math.abs(this.targetY - this.y) < 10) {
                    this.targetX = Math.random() * window.innerWidth;
                    this.targetY = Math.random() * window.innerHeight;
                }

                this.element.style.transform = `translate(${this.x - this.size/2}px, ${this.y - this.size/2}px)`;
                this.element.style.opacity = 0.3;
            }
        }

        // Initialize blobs
        for (let i = 0; i < blobCount; i++) {
            blobs.push(new Blob());
        }

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;

        function handleMouseMove(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        }

        function animate() {
            blobs.forEach(blob => blob.update(mouseX, mouseY));
            requestAnimationFrame(animate);
        }

        window.addEventListener('mousemove', handleMouseMove);
        animate();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden"
        />
    );
}