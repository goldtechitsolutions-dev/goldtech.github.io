import React, { useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import corporateTeam from '../assets/corporate-team.png';
import aboutBg from '../assets/im1.png';

const Counter = ({ value, duration = 2 }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, { duration: duration * 1000 });

    useEffect(() => {
        if (inView) {
            motionValue.set(value);
        }
    }, [inView, value, motionValue]);

    useEffect(() => {
        springValue.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = Math.floor(latest) + "+";
            }
        });
    }, [springValue]);

    return <span ref={ref} />;
};

const About = () => {
    return (
        <section id="about" className="services-section" style={{
            position: 'relative',
            backgroundImage: `url(${aboutBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
        }}>
            {/* Dark Overlay for better text visibility */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(0, 0, 0, 0.4)', // Dark overlay
                zIndex: 0
            }} />

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                <div className="section-title">
                    <h2 style={{ color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>About Us</h2>
                    <p style={{ color: '#f1f5f9', fontWeight: '600', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>Driving digital excellence through innovation and integrity.</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', alignItems: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        style={{ background: 'rgba(255,255,255,0.1)', padding: '30px', borderRadius: '16px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}
                    >
                        <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: '#fff', fontWeight: '700' }}>Our Mission</h3>
                        <p style={{ marginBottom: '1.5rem', color: '#cbd5e1', fontWeight: '500', lineHeight: '1.6' }}>
                            To empower enterprises with future-ready technology solutions that drive sustainable growth and operational efficiency. We believe in building lasting partnerships based on trust, quality, and technical excellence.
                        </p>
                        <div style={{ display: 'flex', gap: '30px' }}>
                            <div>
                                <h4 style={{ fontSize: '2.5rem', color: 'var(--color-gold-primary)', margin: 0, fontWeight: '800' }}>
                                    <Counter value={15} />
                                </h4>
                                <span style={{ fontSize: '0.9rem', color: '#e2e8f0', fontWeight: '600' }}>Years of Excellence</span>
                            </div>
                            <div>
                                <h4 style={{ fontSize: '2.5rem', color: 'var(--color-gold-primary)', margin: 0, fontWeight: '800' }}>
                                    <Counter value={500} />
                                </h4>
                                <span style={{ fontSize: '0.9rem', color: '#e2e8f0', fontWeight: '600' }}>Projects Delivered</span>
                            </div>
                            <div>
                                <h4 style={{ fontSize: '2.5rem', color: 'var(--color-gold-primary)', margin: 0, fontWeight: '800' }}>
                                    <Counter value={50} />
                                </h4>
                                <span style={{ fontSize: '0.9rem', color: '#e2e8f0', fontWeight: '600' }}>Global Partners</span>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        style={{ height: '350px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                    >
                        <img src={corporateTeam} alt="GoldTech Team" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default About;
