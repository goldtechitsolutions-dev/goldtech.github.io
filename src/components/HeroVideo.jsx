import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

// Import Videos
import aiVideo from '../assets/Artificial_Intelligence_AI_Stock_Footage_Video_1440P (1).mp4';
import smartCityVideo from '../assets/Smart_City_Digital_City_Video_2160P.mp4';
import p1Video from '../assets/InShot_P1.mp4';
import p2Video from '../assets/InShot_p2.mp4';
import p3Video from '../assets/InShot_P3.mp4';
import p4Video from '../assets/GT6.mp4';

import posterImage from '../assets/about-main.jpg';
import heroPoster from '../assets/hero-poster.jpg';
import fallbackImage from '../assets/modern-office.png';

const videoSlides = [
    {
        id: 0,
        videoSrc: aiVideo,
        poster: heroPoster,
        title: "AI and GOLDTECH",
        subtitle: "Harnessing the power of Artificial Intelligence to redefine possibilities. GoldTech leads the way in intelligent automation and data-driven innovation.",
        cta: "Discover AI Solutions",
        duration: 9000
    },
    {
        id: 1,
        videoSrc: smartCityVideo,
        title: "Next-Gen Cloud Solutions",
        subtitle: "Transform your business with scalable, secure, and high-performance cloud infrastructure designed for the future.",
        cta: "Explore Cloud Tech",
        duration: 10000
    },
    {
        id: 2,
        videoSrc: p2Video,
        title: "Expertise That Matters",
        subtitle: "From Cloud Architecture to AI-driven insights, our team delivers excellence.",
        cta: "View Expertise",
        duration: 10000
    },
    {
        id: 3,
        videoSrc: p1Video,
        title: "Innovating for Tomorrow",
        subtitle: "GoldTech IT Solutions: Where vision meets execution. We build the digital future.",
        cta: "Discover Our Vision",
        duration: 10000
    },
    {
        id: 4,
        videoSrc: p3Video,
        title: "Global Reach, Local Impact",
        subtitle: "Empowering businesses worldwide with scalable, secure, and robust IT solutions.",
        cta: "See Our Impact",
        duration: 10000
    },
    {
        id: 5,
        videoSrc: p4Video,
        title: "Partner with GoldTech",
        subtitle: "Let's collaborate to accelerate your digital transformation journey.",
        cta: "Start Your Project",
        duration: 12000
    }
];

const HeroVideo = () => {
    const [current, setCurrent] = useState(0);
    const videoRefs = React.useRef([]);

    // Auto-advance slide with variable duration
    useEffect(() => {
        const slideDuration = videoSlides[current].duration || 10000; // Default to 10s if not specified

        const timer = setTimeout(() => {
            setCurrent((prev) => (prev + 1) % videoSlides.length);
        }, slideDuration);

        return () => clearTimeout(timer);
    }, [current]);

    // Reset and play video when it becomes active
    useEffect(() => {
        videoRefs.current.forEach((vid, index) => {
            if (vid) {
                if (index === current) {
                    vid.currentTime = 0;
                    vid.playbackRate = 0.5; // Ensure slow speed is maintained
                    vid.play().catch(e => console.error("Video play failed:", e));
                } else {
                    vid.pause();
                }
            }
        });
    }, [current]);

    const nextSlide = () => setCurrent((prev) => (prev + 1) % videoSlides.length);
    const prevSlide = () => setCurrent((prev) => (prev - 1 + videoSlides.length) % videoSlides.length);

    return (
        <section className="hero-video" style={{ position: 'relative', height: '95vh', overflow: 'hidden', background: '#000' }}>
            {/* Video Background Layer */}
            <div style={{
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                zIndex: 1,
                pointerEvents: 'none',
                overflow: 'hidden'
            }}>
                {videoSlides.map((slide, index) => (
                    <motion.div
                        key={slide.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: index === current ? 1 : 0 }}
                        transition={{ duration: 1.5 }} // Slower crossfade
                        style={{
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            zIndex: index === current ? 1 : 0
                        }}
                    >
                        <video
                            src={slide.videoSrc}
                            poster={slide.poster || posterImage}
                            preload="metadata"
                            // autoPlay removed to prevent all videos playing at once
                            loop={index !== videoSlides.length - 1} // Loop all except the last one
                            muted
                            playsInline
                            onEnded={() => {
                                // If it's the last video, move to next slide when done
                                if (index === videoSlides.length - 1) {
                                    nextSlide();
                                }
                            }}
                            ref={el => (videoRefs.current[index] = el)}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                position: 'absolute',
                                top: 0,
                                left: 0
                            }}
                        />
                    </motion.div>
                ))}
            </div>

            {/* Dark Gradient Overlay */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, rgba(5, 16, 32, 0.7) 0%, rgba(5, 16, 32, 0.5) 40%, rgba(5, 16, 32, 0.2) 100%)',
                zIndex: 2
            }} />

            {/* Content Card */}
            <div className="container" style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', alignItems: 'center' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    style={{
                        maxWidth: '850px',
                        padding: '80px 60px',
                        background: 'linear-gradient(135deg, rgba(0, 31, 63, 0.4) 0%, rgba(0, 10, 20, 0.6) 100%)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        borderLeft: '2px solid rgba(212, 175, 55, 0.5)',
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        borderRadius: '0 40px 40px 0',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(212, 175, 55, 0.05)',
                        color: '#fff',
                        marginLeft: '-20px',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    {/* Subtle Internal Glow */}
                    <div style={{
                        position: 'absolute',
                        top: '-50%',
                        left: '-50%',
                        width: '200%',
                        height: '200%',
                        background: 'radial-gradient(circle, rgba(212, 175, 55, 0.03) 0%, transparent 60%)',
                        pointerEvents: 'none'
                    }} />

                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={current}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                        >
                            <span style={{
                                display: 'inline-block',
                                fontSize: '1.5rem',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                letterSpacing: '6px',
                                color: '#D4AF37',
                                marginBottom: '25px',
                                fontFamily: "'Outfit', sans-serif",
                                textShadow: '0 0 10px rgba(212, 175, 55, 0.3)'
                            }}>
                                IT Services & Consulting
                            </span>

                            <h1 style={{
                                fontSize: '5rem',
                                lineHeight: '1',
                                fontWeight: '800',
                                marginBottom: '35px',
                                fontFamily: "'Playfair Display', serif",
                                background: 'linear-gradient(to bottom, #FFFFFF 30%, #D4AF37 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))',
                                letterSpacing: '-1.5px'
                            }}>
                                {videoSlides[current].title}
                            </h1>

                            <p style={{
                                fontSize: '1.4rem',
                                lineHeight: '1.8',
                                color: 'rgba(255, 255, 255, 0.9)',
                                marginBottom: '50px',
                                fontWeight: '300',
                                fontFamily: "'Outfit', sans-serif",
                                letterSpacing: '0.5px',
                                maxWidth: '95%',
                                textShadow: '0 2px 4px rgba(0,0,0,0.4)',
                                borderLeft: '1px solid rgba(212, 175, 55, 0.3)',
                                paddingLeft: '20px'
                            }}>
                                {videoSlides[current].subtitle}
                            </p>

                            <motion.a
                                href="#contact"
                                whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(212, 175, 55, 0.4)' }}
                                whileTap={{ scale: 0.95 }}
                                className="btn"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '15px',
                                    background: 'rgba(212, 175, 55, 0.1)',
                                    border: '1px solid #D4AF37',
                                    color: '#D4AF37',
                                    padding: '16px 40px',
                                    borderRadius: '50px',
                                    fontSize: '1.1rem',
                                    fontWeight: '600',
                                    letterSpacing: '1px',
                                    textTransform: 'uppercase',
                                    textDecoration: 'none',
                                    backdropFilter: 'blur(5px)',
                                    transition: 'all 0.3s ease',
                                    fontFamily: "'Outfit', sans-serif"
                                }}
                            >
                                {videoSlides[current].cta}
                                <motion.span
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                >
                                    <ArrowRight size={22} />
                                </motion.span>
                            </motion.a>
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Controls */}
            <div style={{ position: 'absolute', bottom: '40px', right: '40px', zIndex: 20, display: 'flex', gap: '10px' }}>
                <button onClick={prevSlide} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '10px', borderRadius: '50%', cursor: 'pointer', backdropFilter: 'blur(5px)' }}>
                    <ChevronLeft size={24} />
                </button>
                <button onClick={nextSlide} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '10px', borderRadius: '50%', cursor: 'pointer', backdropFilter: 'blur(5px)' }}>
                    <ChevronRight size={24} />
                </button>
            </div>

            {/* Indicators */}
            <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', zIndex: 20, display: 'flex', gap: '8px' }}>
                {videoSlides.map((_, idx) => (
                    <div
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        style={{
                            width: idx === current ? '30px' : '10px',
                            height: '4px',
                            background: idx === current ? 'var(--color-gold-primary)' : 'rgba(255,255,255,0.3)',
                            borderRadius: '2px',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer'
                        }}
                    />
                ))}
            </div>
        </section>
    );
};

export default HeroVideo;
