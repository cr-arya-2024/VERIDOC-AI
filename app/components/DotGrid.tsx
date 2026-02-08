'use client';
import React, { useRef, useEffect } from 'react';

interface Dot {
    x: number;
    y: number;
    originX: number;
    originY: number;
    vx: number;
    vy: number;
}

interface DotGridProps {
    dotSize?: number;
    gap?: number;
    baseColor?: string;
    activeColor?: string;
    proximity?: number;
    shockRadius?: number;
    shockStrength?: number;
    resistance?: number;
    returnDuration?: number;
    elementIds?: string[];
    className?: string;
}

const DotGrid: React.FC<DotGridProps> = ({
    dotSize = 5,
    gap = 15,
    baseColor = '#271E37',
    activeColor = '#5227FF',
    proximity = 120,
    shockRadius = 250,
    shockStrength = 5,
    resistance = 750,
    returnDuration = 1.5,
    elementIds = [],
    className = "",
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const dots = useRef<Dot[]>([]);
    const mouse = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const initDots = () => {
            const newDots: Dot[] = [];
            const { width, height, left, top } = canvas.getBoundingClientRect();
            canvas.width = width;
            canvas.height = height;

            // Get bounding boxes of excluded elements relative to canvas
            const excludeRects = elementIds.map(id => {
                const el = document.getElementById(id);
                if (!el) return null;
                const rect = el.getBoundingClientRect();
                return {
                    left: rect.left - left,
                    top: rect.top - top,
                    right: rect.right - left,
                    bottom: rect.bottom - top
                };
            }).filter(Boolean) as { left: number; top: number; right: number; bottom: number }[];

            for (let x = gap / 2; x < width; x += gap) {
                for (let y = gap / 2; y < height; y += gap) {
                    const isExcluded = excludeRects.some(rect =>
                        x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
                    );

                    if (!isExcluded) {
                        newDots.push({
                            x,
                            y,
                            originX: x,
                            originY: y,
                            vx: 0,
                            vy: 0,
                        });
                    }
                }
            }
            dots.current = newDots;
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            dots.current.forEach((dot) => {
                const dx = mouse.current.x - dot.x;
                const dy = mouse.current.y - dot.y;
                const distSq = dx * dx + dy * dy;

                if (distSq < proximity * proximity) {
                    const dist = Math.sqrt(distSq);
                    const angle = Math.atan2(dy, dx);
                    const force = (proximity - dist) / proximity;

                    dot.vx -= Math.cos(angle) * force * shockStrength;
                    dot.vy -= Math.sin(angle) * force * shockStrength;
                    ctx.fillStyle = activeColor;
                } else {
                    ctx.fillStyle = baseColor;
                }

                // Return force
                const rx = dot.originX - dot.x;
                const ry = dot.originY - dot.y;
                dot.vx += rx / (returnDuration * resistance);
                dot.vy += ry / (returnDuration * resistance);

                // Friction
                dot.vx *= 0.95;
                dot.vy *= 0.95;

                dot.x += dot.vx;
                dot.y += dot.vy;

                ctx.beginPath();
                ctx.arc(dot.x, dot.y, dotSize / 2, 0, Math.PI * 2);
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouse.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };
        };

        initDots();
        draw();

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', initDots);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', initDots);
        };
    }, [dotSize, gap, baseColor, activeColor, proximity, shockRadius, shockStrength, resistance, returnDuration, elementIds]);

    return (
        <canvas
            ref={canvasRef}
            className={`absolute top-0 left-0 w-full h-full pointer-events-none ${className}`}
            style={{
                zIndex: 0,
            }}
        />
    );
};

export default DotGrid;
