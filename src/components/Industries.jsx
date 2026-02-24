import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingCart, Hammer, Landmark, Umbrella, HeartPulse, GraduationCap, Home, Cpu, Plane, Tv, Zap, Factory } from 'lucide-react';
import modernOffice from '../assets/modern-office.png';

const industries = [
    { icon: HeartPulse, title: "HEALTH CARE", description: "Advanced patient systems and telemedicine platforms." },
    { icon: Landmark, title: "BANKING & FINANCE", description: "Secure financial transactions and regulatory compliance." },
    { icon: ShoppingCart, title: "RETAIL & E-COMMERCE", description: "Omnichannel retail experiences and digital payment solutions." },
    { icon: Umbrella, title: "INSURANCE", description: "Digital policy management and risk assessment tools." },
    { icon: Hammer, title: "METALS & MINING", description: "IoT solutions for operational efficiency and safety." },
    { icon: Home, title: "REAL ESTATE", description: "Smart property management and virtual tour technologies." },
    { icon: Cpu, title: "HIGH TECH", description: "Innovative software solutions for technology companies." },
    { icon: GraduationCap, title: "EDUCATION", description: "E-learning platforms and student information systems." },
    { icon: Plane, title: "TRAVEL & HOSPITALITY", description: "Seamless booking engines and personalized guest experiences." },
    { icon: Tv, title: "MEDIA & ENTERTAINMENT", description: "Content management systems and digital distribution platforms." },
    { icon: Zap, title: "ENERGY & UTILITIES", description: "Smart grid management and renewable energy monitoring." },
    { icon: Factory, title: "MANUFACTURING & SUPPLY CHAIN", description: "Industrial IoT and resilient supply chain optimization." }
];


const Industries = () => {
    return (
        <section id="industries" className="services-section" style={{
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
                background: 'rgba(5, 16, 33, 0.6)', // Lighter dark overlay
                zIndex: 0
            }} />

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                <div className="section-title">
                    <h2 style={{ color: '#fff' }}>Industries We Serve</h2>
                    <p style={{ color: '#cbd5e1' }}>Delivering domain-specific expertise across key sectors</p>
                </div>
                <div className="services-grid">
                    {industries.map((item, index) => {
                        const slug = item.title.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
                        return (
                            <motion.div
                                key={index}
                                className="service-card"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Link to={`/industries/${slug}`} style={{ display: 'block', height: '100%', textDecoration: 'none', color: 'inherit' }}>
                                    <div className="service-icon" style={{ color: 'var(--color-blue-accent)' }}>
                                        <item.icon size={40} />
                                    </div>
                                    <h3 style={{ textTransform: 'uppercase', fontSize: '1.2rem' }}>{item.title}</h3>
                                    <p>{item.description}</p>
                                </Link>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    );
};

export default Industries;
