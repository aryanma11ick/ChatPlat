// components/GradientWave.jsx
"use client";
import { useEffect, useRef } from 'react';

export default function GradientWave() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let time = 0;
        let mouseX = 0;
        let mouseY = 0;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        function draw() {
            time += 0.005;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Create gradient
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#f8fafc');
            gradient.addColorStop(1, '#e2e8f0');

            // Apply wave distortion based on mouse position
            const waveFactorX = Math.sin(time) * 20 * (mouseX / canvas.width);
            const waveFactorY = Math.cos(time) * 20 * (mouseY / canvas.height);

            ctx.fillStyle = gradient;
            ctx.beginPath();

            // Create wavy shape
            ctx.moveTo(0, 0);
            for (let x = 0; x < canvas.width; x += 20) {
                const y = canvas.height/2 +
                    Math.sin(x * 0.01 + time) * 30 +
                    waveFactorX * Math.sin(x * 0.02);
                ctx.lineTo(x, y);
            }

            ctx.lineTo(canvas.width, 0);
            ctx.closePath();
            ctx.fill();

            requestAnimationFrame(draw);
        }

        function handleMouseMove(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        }

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', handleMouseMove);
        resize();
        draw();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-10"
        />
    );
}