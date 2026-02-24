import React from 'react';
import { motion } from 'framer-motion';
import { Box, Layers, Zap } from 'lucide-react';
import modernOffice from '../assets/modern-office.png';

const products = [
    { icon: Box, title: "Enterprise ERP", desc: "Comprehensive resource planning for large-scale operations." },
    { icon: Layers, title: "Supply Chain Suite", desc: "End-to-end visibility and optimization tools." },
    { icon: Zap, title: "Analytics Engine", desc: "Real-time data processing and visualization dashboard." }
];

const Products = () => {
    return (
        <section id="products" className="services-section" style={{
            position: 'relative',
            backgroundImage: `url(${modernOffice})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            color: '#fff'
        }}>
            {/* Dark Overlay */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(5, 16, 33, 0.85)', // Dark overlay for products
                zIndex: 0
            }} />

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                <div className="section-title">
                    <h2 style={{ color: '#fff' }}>Our Products</h2>
                    <p style={{ color: '#cbd5e1' }}>Scalable software solutions designed for the modern enterprise.</p>
                </div>
                <div className="services-grid">
                    {products.map((prod, i) => (
                        <motion.div
                            key={i}
                            className="service-card"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <prod.icon size={32} style={{ color: 'var(--color-blue-primary)', marginBottom: '15px' }} />
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', color: 'var(--color-blue-dark)' }}>{prod.title}</h3>
                            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)' }}>{prod.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Products;
