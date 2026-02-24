import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import googleLogo from '../assets/google-icon.svg';
import aboutMain from '../assets/about-main.jpg';

const reviews = [
    { name: 'K. Ramesh', rating: 5, text: 'GoldTech transformed our legacy jewelry software into a modern cloud platform. Exceptional service!', date: '2 weeks ago' },
    { name: 'Sarah Jenkins', rating: 5, text: 'The cybersecurity audit they performed saved us from a potential breach. Highly recommended experts.', date: '1 month ago' },
    { name: 'TechVibe Solutions', rating: 4, text: 'Great partners for backend development. Solid code quality and timely delivery.', date: '2 months ago' }
];

const Testimonials = () => {
    return (
        <section id="testimonials" className="services-section" style={{
            position: 'relative',
            backgroundImage: `url(${aboutMain})`,
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
                    <h2 style={{ color: '#ffffff', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Client Reviews</h2>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
                        <img src={googleLogo} alt="Google" width="24" />
                        <span style={{ fontWeight: '600', color: '#e2e8f0' }}>4.9/5 Rating on Google Business</span>
                    </div>
                </div>

                <div className="services-grid">
                    {reviews.map((review, index) => (
                        <motion.div
                            key={index}
                            className="service-card"
                            style={{ background: '#fff' }}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '15px' }}>
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} fill={i < review.rating ? "#FFD700" : "#e2e8f0"} color={i < review.rating ? "#FFD700" : "#e2e8f0"} />
                                ))}
                            </div>
                            <p style={{ fontStyle: 'italic', marginBottom: '20px', color: '#334155' }}>"{review.text}"</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: '700', color: 'var(--color-blue-dark)' }}>{review.name}</span>
                                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{review.date}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
