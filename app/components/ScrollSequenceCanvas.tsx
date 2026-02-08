"use client";

import { useEffect, useRef } from "react";
import {
    motion,
    useScroll,
    useTransform,
    useMotionValueEvent,
} from "framer-motion";

const frameCount = 192;
const basePath = "/ezgif-369d407b7c48fee3-jpg";

const getFrameFileName = (index: number) => {
    const num = String(index + 1).padStart(3, "0");
    return `ezgif-frame-${num}.jpg`;
};

interface ScrollSequenceCanvasProps {
    titleStart: React.ReactNode;
    titleEnd: React.ReactNode;
    description: React.ReactNode;
}

const ScrollSequenceCanvas = ({
    titleStart,
    titleEnd,
    description
}: ScrollSequenceCanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLElement | null>(null);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const currentFrameRef = useRef(0);

    // Scroll progress for this section only
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const drawFrame = (index: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const img = imagesRef.current[index];
        if (!img || !img.complete) return;

        // Use logical CSS dimensions for drawing calculations
        // The context is already scaled by 'ratio' via setTransform
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Enable high-quality smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        ctx.clearRect(0, 0, width, height);

        // cover the screen (no black borders)
        const scale = Math.max(width / img.width, height / img.height);
        const x = (width - img.width * scale) / 2;
        const y = (height - img.height * scale) / 2 - 40; // small upward shift

        ctx.drawImage(
            img,
            0,
            0,
            img.width,
            img.height,
            x,
            y,
            img.width * scale,
            img.height * scale
        );
    };

    // Drive frames from scroll progress
    useMotionValueEvent(scrollYProgress, "change", (latestProgress) => {
        const targetIndex = Math.floor(latestProgress * (frameCount - 1));
        if (targetIndex !== currentFrameRef.current) {
            currentFrameRef.current = targetIndex;
            window.requestAnimationFrame(() => drawFrame(targetIndex));
        }
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resizeCanvas = () => {
            const ratio = window.devicePixelRatio || 1;

            const cssWidth = window.innerWidth;
            const cssHeight = window.innerHeight;

            // real pixel size (backing store)
            canvas.width = cssWidth * ratio;
            canvas.height = cssHeight * ratio;

            // CSS size (layout)
            canvas.style.width = `${cssWidth}px`;
            canvas.style.height = `${cssHeight}px`;

            // scale context so drawing coordinates are in CSS pixels
            ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

            drawFrame(currentFrameRef.current);
        };

        resizeCanvas();

        // preload frames
        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            img.src = `${basePath}/${getFrameFileName(i)}`;
            img.onload = () => {
                if (i === currentFrameRef.current) drawFrame(i);
            };
            imagesRef.current[i] = img;
        }

        const handleResize = () => resizeCanvas();
        window.addEventListener("resize", handleResize);

        // initial draw
        drawFrame(0);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <section
            ref={containerRef}
            className="relative h-[300vh] bg-black overflow-visible"
        >
            <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
                <canvas
                    ref={canvasRef}
                    className="block w-full h-full"
                    style={{ imageRendering: "auto" }}
                />

                {/* Hero Text Overlay */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center md:justify-start z-10">
                    <div className="text-center md:text-left px-6 md:ml-12 lg:ml-24 xl:ml-60 max-w-4xl -mt-20">
                        <h1 id="hero-title" className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
                            {titleStart} <br />
                            <span className="text-indigo-500">{titleEnd}</span>
                        </h1>
                        <div id="hero-description" className="relative max-w-2xl mx-auto md:mx-0 mb-8 p-4">
                            <div
                                className="absolute inset-0 bg-black/50 rounded-lg backdrop-blur-sm"
                                style={{
                                    maskImage: 'radial-gradient(ellipse at center, black 0%, transparent 70%)',
                                    WebkitMaskImage: 'radial-gradient(ellipse at center, black 0%, transparent 70%)'
                                }}
                            />
                            <div className="relative z-10 text-lg md:text-xl text-white">
                                {description}
                            </div>
                        </div>

                        {/* Decorative Whisk Image */}
                        <div className="mt-8 flex justify-center md:justify-start">
                            <div className="relative">
                                <img
                                    src="/Whisk_4256520b85356e885e74314d477b9272dr.jpeg"
                                    alt="Decorative Preview"
                                    className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl rounded-2xl shadow-2xl border border-white/10 opacity-90"
                                    style={{
                                        maskImage: 'radial-gradient(ellipse at center, white 50%, transparent 100%)',
                                        WebkitMaskImage: 'radial-gradient(ellipse at center, white 50%, transparent 100%)'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fade overlay at bottom - moved last and increased Z to ensure it covers even pulled-up sections */}
                <div className="absolute inset-x-0 bottom-0 h-[500px] bg-gradient-to-t from-black to-transparent pointer-events-none z-30" />
            </div>
        </section>
    );
};

export default ScrollSequenceCanvas;
