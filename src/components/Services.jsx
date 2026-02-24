import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Code, Server, Shield, Database, Cpu, Globe, Megaphone, Smartphone, Briefcase } from 'lucide-react';
import imBg from '../assets/im.png';

const services = [
    {
        icon: Code,
        title: "Custom Software Development",
        description: "Tailored software solutions designed to meet your specific business needs and challenges."
    },
    {
        icon: Server,
        title: "Cloud Infrastructure",
        description: "Scalable and secure cloud solutions to power your enterprise applications."
    },
    {
        icon: Shield,
        title: "Cybersecurity",
        description: "Advanced security protocols to protect your digital assets and sensitive data."
    },
    {
        icon: Database,
        title: "Data Analytics",
        description: "Transform raw data into actionable insights for better decision making."
    },
    {
        icon: Cpu,
        title: "AI & Machine Learning",
        description: "Intelligent systems that automate processes and enhance business efficiency. Specializing in AI Strategy and engineering, Data for AI, Process for AI, Agentic legacy modernization, Physical AI, and AI Trust."
    },
    {
        icon: Globe,
        title: "Digital Transformation",
        description: "Comprehensive strategies to modernize your business operations and customer experience."
    },
    {
        icon: Smartphone,
        title: "Web & Mobile Applications",
        description: "Cutting-edge web and mobile solutions for iOS, Android, and cross-platform needs."
    },
    {
        icon: Briefcase,
        title: "Salesforce & SAP",
        description: "Enterprise-grade CRM and ERP solutions to streamline your business processes and data management."
    },
    {
        icon: Megaphone,
        title: "Digital & Media Marketing",
        description: "Strategic digital campaigns and media solutions to amplify your brand presence and engagement."
    }
];

const Services = () => {
    return (
        <section id="services" className="services-section" style={{
            position: 'relative',
            backgroundImage: `url(${imBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            color: '#fff' // Ensure text is readable on dark overlay
        }}>
            {/* Dark Overlay */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(15, 23, 42, 0.6)', // Lighter dark blue overlay
                zIndex: 0
            }} />

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                <div className="section-title">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{ color: '#fff' }}
                    >
                        Our Services
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        style={{ color: '#cbd5e1' }}
                    >
                        Empowering your business with cutting-edge technology solutions
                    </motion.p>
                </div>
                <div className="services-grid">
                    {services.map((item, index) => {
                        const slug = item.title.toLowerCase().replace(/\s+/g, '-');
                        return (
                            <motion.div
                                key={index}
                                className="service-card"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link to={`/services/${slug}`} style={{ display: 'block', height: '100%', textDecoration: 'none', color: 'inherit' }}>
                                    <item.icon className="service-icon" />
                                    <h3>{item.title}</h3>
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

export default Services;
