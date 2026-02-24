import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import modernOffice from '../assets/modern-office.png';

const insights = [
    { title: "The Future of AI in Banking", category: "Technology", date: "Oct 15, 2025" },
    { title: "Sustainable Supply Chains", category: "Industry", date: "Sep 28, 2025" },
    { title: "Cybersecurity Best Practices", category: "Security", date: "Sep 10, 2025" }
];

const Insights = () => {
    return (
        <section id="insights" className="services-section" style={{
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
                background: 'rgba(0, 0, 0, 0.7)', // Dark overlay for contrast
                zIndex: 0
            }} />

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                <div className="section-title">
                    <h2 style={{ color: '#ffffff', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Latest Insights</h2>
                    <p style={{ color: '#e2e8f0', fontWeight: '500' }}>Thought leadership and trends from our experts.</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                    {insights.map((item, i) => {
                        const slug = item.title.toLowerCase().replace(/ /g, '-');
                        return (
                            <motion.div
                                key={i}
                                className="service-card"
                                whileHover={{ y: -5 }}
                                style={{ padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'rgba(255,255,255,0.9)' }}
                            >
                                <div>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--color-gold-dark)', fontWeight: '600', textTransform: 'uppercase' }}>{item.category}</span>
                                    <h3 style={{ fontSize: '1.4rem', margin: '10px 0', color: 'var(--color-blue-dark)' }}>{item.title}</h3>
                                    <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>{item.date}</span>
                                </div>
                                <Link to={`/insights/${slug}`} style={{ marginTop: '20px', fontWeight: '600', color: 'var(--color-blue-primary)', cursor: 'pointer', display: 'inline-block' }}>
                                    Read More &rarr;
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Insights;
