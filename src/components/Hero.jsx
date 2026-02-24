import React from 'react';
import { motion } from 'framer-motion';
import HeroBackground from './HeroBackground';
import logo from '../assets/logo-transparent.png';

const Hero = () => {
    return (
        <section className="hero">
            <HeroBackground />

            <div style={{ position: 'relative', zIndex: 10, width: '100%', height: '100%', display: 'flex', alignItems: 'center' }}>
                <div className="hero-content">
                    {/* Small tag above headline */}
                    <div style={{
                        display: 'inline-block',
                        padding: '8px 16px',
                        background: 'rgba(212, 175, 55, 0.2)',
                        color: '#D4AF37',
                        borderRadius: '4px',
                        fontWeight: '700',
                        fontSize: '1.2rem',
                        marginBottom: '1.5rem',
                        border: '1px solid rgba(212, 175, 55, 0.4)',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        IT Services & Consulting
                    </div>

                    <motion.h1
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        Building Future-Ready <br />
                        <span style={{ color: 'var(--color-gold-primary)' }}>Enterprises</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="hero-subtitle"
                    >
                        GoldTech combines deep industry knowledge with cutting-edge technology to drive digital transformation and sustainable growth.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        style={{ display: 'flex', gap: '20px' }}
                    >
                        <a href="#contact" className="btn btn-primary" style={{ padding: '16px 40px', borderRadius: '4px', textTransform: 'uppercase', fontSize: '0.9rem', border: 'none' }}>
                            Explore Solutions
                        </a>
                        <a href="#insights" className="btn" style={{ padding: '16px 40px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', textTransform: 'uppercase', fontSize: '0.9rem', background: 'transparent' }}>
                            Read Insights
                        </a>
                    </motion.div>
                </div>
            </div>

        </section>
    );
};

export default Hero;
