import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Target, Eye, Award, Users, Globe, Zap } from 'lucide-react';
import aboutMain from '../assets/about-main.jpg'; // User provided image
import corporateTeam from '../assets/corporate-team.png';
import innovationBg from '../assets/innovation.png';
import modernOffice from '../assets/modern-office.png';

const AboutPage = () => {
    return (
        <div className="page-detail" style={{
            paddingTop: '80px',
            minHeight: '100vh',
            background: `linear-gradient(rgba(248, 250, 252, 0.4), rgba(248, 250, 252, 0.4)), url(${modernOffice})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
        }}>
            {/* Hero Section */}
            <div className="detail-hero" style={{
                background: `linear-gradient(135deg, rgba(0, 44, 95, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%), url(${innovationBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: '#fff',
                padding: '100px 0',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ fontSize: '3.5rem', marginBottom: '20px', fontWeight: '800' }}
                    >
                        Pioneering Digital Excellence
                    </motion.h1>
                    <p style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.25rem', color: 'rgba(255,255,255,0.9)', lineHeight: '1.6' }}>
                        We are GoldTech. A global technology partner dedicated to transforming businesses through innovation, integrity, and intelligent solutions.
                    </p>
                </div>
            </div>

            <div className="container" style={{ padding: '60px 20px' }}>
                <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '40px', color: 'var(--color-text-secondary)', fontWeight: '600' }}>
                    <ArrowLeft size={20} /> Back to Home
                </Link>

                {/* Who We Are */}
                <div className="about-section" style={{ marginBottom: '80px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '50px', alignItems: 'center' }}>
                        <div style={{ background: 'rgba(255, 255, 255, 0.9)', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                            <h2 style={{ fontSize: '2.5rem', color: 'var(--color-blue-dark)', marginBottom: '20px', fontWeight: '700' }}>Who We Are</h2>
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#334155', marginBottom: '20px' }}>
                                Founded on the principles of excellence and innovation, GoldTech IT Solutions has grown from a visionary startup to a trusted global technology partner. We specialize in delivering high-impact software solutions, cloud infrastructure, and digital strategies that empower enterprises to thrive in a rapidly evolving digital landscape.
                            </p>
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#334155' }}>
                                Our team of expert engineers, strategists, and creative minds work collaboratively to solve complex business challenges. We don't just build technology; we build pathways to success for our clients.
                            </p>
                        </div>
                        <div style={{
                            height: '400px',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                            position: 'relative'
                        }}>
                            <img src={aboutMain} alt="GoldTech Office" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    </div>
                </div>

                {/* Vision & Mission */}
                <div className="vision-mission-section" style={{ marginBottom: '80px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                        <div style={{ background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', borderTop: '4px solid var(--color-gold-primary)' }}>
                            <Eye size={40} color="var(--color-blue-dark)" style={{ marginBottom: '20px' }} />
                            <h3 style={{ fontSize: '1.8rem', marginBottom: '15px', color: 'var(--color-blue-dark)' }}>Our Vision</h3>
                            <p style={{ lineHeight: '1.7', color: '#475569' }}>
                                To be the global torchbearer of digital innovation, recognized for creating transformative technology that simplifies lives and accelerates business growth.
                            </p>
                        </div>
                        <div style={{ background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', borderTop: '4px solid var(--color-blue-primary)' }}>
                            <Target size={40} color="var(--color-blue-dark)" style={{ marginBottom: '20px' }} />
                            <h3 style={{ fontSize: '1.8rem', marginBottom: '15px', color: 'var(--color-blue-dark)' }}>Our Mission</h3>
                            <p style={{ lineHeight: '1.7', color: '#475569' }}>
                                To deliver world-class IT solutions with unwavering integrity and quality. We strive to empower our clients with the tools they need to lead their industries.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Team Section Added */}
                <div className="team-section" style={{ marginBottom: '80px', textAlign: 'center' }}>
                    <div style={{
                        borderRadius: '20px',
                        overflow: 'hidden',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                        position: 'relative',
                        height: '400px'
                    }}>
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(0,0,0,0.6) 0%, transparent 50%)', zIndex: 1 }}></div>
                        <img src={corporateTeam} alt="GoldTech Team" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', bottom: '30px', left: '0', width: '100%', zIndex: 2 }}>
                            <h3 style={{ color: '#fff', fontSize: '2.5rem', marginBottom: '10px' }}>Collaboration at our Core</h3>
                            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.2rem' }}>Driven by passion, united by excellence.</p>
                        </div>
                    </div>
                </div>

                {/* Core Values */}
                <div className="values-section" style={{ marginBottom: '60px' }}>
                    <h2 style={{ fontSize: '2.5rem', color: 'var(--color-blue-dark)', marginBottom: '40px', textAlign: 'center', fontWeight: '700' }}>Our Core Values</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
                        {[
                            { icon: Award, title: "Excellence", desc: "We aim for the highest standards in everything we do." },
                            { icon: Users, title: "Collaboration", desc: "We believe in the power of partnership and teamwork." },
                            { icon: Globe, title: "Integrity", desc: "Transparency and honesty are the foundations of our business." },
                            { icon: Zap, title: "Innovation", desc: "We constantly push boundaries to find better solutions." }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ y: -5 }}
                                style={{ background: '#fff', padding: '30px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
                            >
                                <item.icon size={32} color="var(--color-gold-primary)" style={{ marginBottom: '15px' }} />
                                <h4 style={{ fontSize: '1.25rem', marginBottom: '10px', color: 'var(--color-blue-dark)' }}>{item.title}</h4>
                                <p style={{ fontSize: '0.95rem', color: '#64748b' }}>{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
