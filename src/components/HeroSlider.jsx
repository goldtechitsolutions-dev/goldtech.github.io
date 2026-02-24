import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronRight, ChevronLeft } from 'lucide-react';

const slides = [
    {
        id: 1,
        title: "Building Future-Ready Enterprises",
        subtitle: "GoldTech combines deep industry knowledge with cutting-edge technology to drive digital transformation and sustainable growth.",
        cta: "Explore Solutions",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop" // Tech/Global Network
    },
    {
        id: 2,
        title: "Innovation at Scale",
        subtitle: "Leveraging AI and Cloud Computing to unlock new value streams and operational efficiencies for your business.",
        cta: "Our Innovation Hub",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop" // Circuit/Chip
    },
    {
        id: 3,
        title: "Sustainable Technology",
        subtitle: "Creating a greener future through eco-friendly IT infrastructure and smart energy management systems.",
        cta: "View Sustainability",
        image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2070&auto=format&fit=crop" // Nature/Tech
    }
];

const HeroSlider = () => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

    return (
        <section className="hero-slider" style={{ position: 'relative', height: '90vh', overflow: 'hidden', background: '#000' }}>
            {/* Background Image Slider */}
            <AnimatePresence mode='wait'>
                <motion.div
                    key={current}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: `url(${slides[current].image}) no-repeat center center/cover`,
                        zIndex: 1
                    }}
                />
            </AnimatePresence>

            {/* Dark Gradient Overlay (Global consistency) */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, rgba(0, 44, 95, 0.7) 0%, rgba(0, 44, 95, 0.4) 50%, transparent 100%)', // TCS Blue Tint
                zIndex: 2
            }} />

            {/* Content Card - Left Aligned TCS Style */}
            <div className="container" style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', alignItems: 'center' }}>
                <div style={{
                    maxWidth: '650px',
                    padding: '40px',
                    // Glass Card Style
                    background: 'rgba(0, 31, 63, 0.85)', // Deep Enterprise Blue
                    backdropFilter: 'blur(10px)',
                    borderLeft: '5px solid var(--color-gold-primary)',
                    borderRadius: '0 8px 8px 0',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                    color: '#fff',
                    marginLeft: '-20px' // Align to edge or slightly off for dynamic look
                }}>
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={current}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <span style={{
                                display: 'inline-block',
                                fontSize: '1.2rem',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                color: 'var(--color-gold-primary)',
                                marginBottom: '15px'
                            }}>
                                IT Services & Consulting
                            </span>
                            <h1 style={{
                                fontSize: '2.8rem',
                                lineHeight: '1.2',
                                fontWeight: '700',
                                marginBottom: '20px',
                                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                            }}>
                                {slides[current].title}
                            </h1>
                            <p style={{
                                fontSize: '1.1rem',
                                lineHeight: '1.6',
                                color: '#e2e8f0',
                                marginBottom: '30px'
                            }}>
                                {slides[current].subtitle}
                            </p>

                            <a href="#contact" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                                {slides[current].cta} <ArrowRight size={18} />
                            </a>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Navigation Controls */}
            <div style={{ position: 'absolute', bottom: '40px', right: '40px', zIndex: 20, display: 'flex', gap: '10px' }}>
                <button onClick={prevSlide} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '10px', borderRadius: '50%', cursor: 'pointer', backdropFilter: 'blur(5px)' }}>
                    <ChevronLeft size={24} />
                </button>
                <button onClick={nextSlide} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '10px', borderRadius: '50%', cursor: 'pointer', backdropFilter: 'blur(5px)' }}>
                    <ChevronRight size={24} />
                </button>
            </div>

            {/* Slide Indicators */}
            <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', zIndex: 20, display: 'flex', gap: '8px' }}>
                {slides.map((_, idx) => (
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

export default HeroSlider;
