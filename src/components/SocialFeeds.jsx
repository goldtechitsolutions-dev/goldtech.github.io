import React, { useState, useEffect } from 'react';
import { Github, Linkedin, ExternalLink, Star, GitFork } from 'lucide-react';
import { motion } from 'framer-motion';
import modernOffice from '../assets/modern-office.png';

const SocialFeeds = () => {
    // Mock data for GitHub repos - in a real app, you'd fetch https://api.github.com/users/{username}/repos
    const repos = [
        { name: 'goldtech-finance-api', desc: 'Secure financial transaction processing engine for gold loans.', stars: 12, forks: 4, lang: 'TypeScript' },
        { name: 'enterprise-security-suite', desc: 'Comprehensive cybersecurity toolkit for small to medium businesses.', stars: 28, forks: 8, lang: 'Python' },
        { name: 'react-native-gold-tracker', desc: 'Real-time gold price tracking mobile application.', stars: 45, forks: 15, lang: 'JavaScript' }
    ];

    return (
        <section id="community" className="services-section" style={{
            position: 'relative',
            backgroundImage: `url(${modernOffice})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
        }}>
            {/* Dark Overlay */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(0, 0, 0, 0.7)', // Dark overlay for better text visibility
                zIndex: 0
            }} />

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                <div className="section-title">
                    <h2 style={{ color: '#ffffff', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Open Source & Community</h2>
                    <p style={{ color: '#e2e8f0', fontWeight: '500' }}>Building transparency through code and connection.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
                    {/* GitHub Section */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                            <Github size={24} color="#fff" />
                            <h3 style={{ margin: 0, color: '#fff' }}>Latest Repositories</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {repos.map((repo, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ x: 5 }}
                                    style={{
                                        padding: '20px',
                                        borderRadius: '4px',
                                        background: '#fff',
                                        border: '1px solid #e2e8f0',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                        <h4 style={{ color: 'var(--color-blue-accent)', margin: 0 }}>{repo.name}</h4>
                                        <span style={{ fontSize: '0.8rem', background: '#f1f5f9', padding: '2px 8px', borderRadius: '10px' }}>{repo.lang}</span>
                                    </div>
                                    <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '10px' }}>{repo.desc}</p>
                                    <div style={{ display: 'flex', gap: '15px', color: '#64748b', fontSize: '0.8rem' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Star size={14} /> {repo.stars}</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><GitFork size={14} /> {repo.forks}</span>
                                    </div>
                                </motion.div>
                            ))}
                            <a href="#" style={{ color: 'var(--color-blue-dark)', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '5px', marginTop: '10px' }}>
                                View all repositories <ExternalLink size={16} />
                            </a>
                        </div>
                    </div>

                    {/* LinkedIn Section */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                            <Linkedin size={24} color="#fff" />
                            <h3 style={{ margin: 0, color: '#fff' }}>GoldTech Updates</h3>
                        </div>
                        <div style={{
                            backgroundImage: `url(${modernOffice})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            borderRadius: '12px',
                            padding: '40px 25px',
                            border: '1px solid #e2e8f0',
                            height: '100%',
                            minHeight: '400px',
                            position: 'relative',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            textAlign: 'center',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                        }}>
                            {/* Dark Overlay for readability */}
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(to bottom, rgba(0, 16, 33, 0.85), rgba(0, 31, 63, 0.95))',
                                zIndex: 1
                            }}></div>

                            <div style={{ position: 'relative', zIndex: 2, color: '#fff' }}>
                                <img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" alt="LinkedIn" width="60" style={{ marginBottom: '20px', background: '#fff', borderRadius: '4px', padding: '2px' }} />
                                <h4 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Join Our Professional Network</h4>
                                <p style={{ color: '#cbd5e1', marginBottom: '30px', fontSize: '1.1rem', maxWidth: '300px', margin: '0 auto 30px' }}>
                                    Connect with us for the latest industry insights, company news, and career opportunities.
                                </p>
                                <a href="https://www.linkedin.com/company/goldtechitsolutions" target="_blank" rel="noreferrer" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', fontSize: '1.1rem' }}>
                                    Follow Page <ExternalLink size={18} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SocialFeeds;
