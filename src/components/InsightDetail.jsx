import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Calendar, Tag } from 'lucide-react';

const insightData = {
    "the-future-of-ai-in-banking": {
        title: "The Future of AI in Banking",
        category: "Technology",
        date: "Oct 15, 2025",
        author: "Dr. Sarah Chen",
        content: `
            <p>Artificial Intelligence is no longer just a buzzword in the banking sector; it is a fundamental driver of transformation. From personalized customer experiences to fraud detection and risk management, AI is reshaping how financial institutions operate.</p>
            <h3>Personalization at Scale</h3>
            <p>Banks are leveraging machine learning algorithms to analyze customer spending habits and offer tailored financial advice. This level of personalization was previously impossible to achieve at scale.</p>
            <h3>Enhanced Security</h3>
            <p>Real-time fraud detection systems powered by AI can identify suspicious patterns in milliseconds, protecting both the bank and its customers from financial loss.</p>
            <h3>Operational Efficiency</h3>
            <p>Robotic Process Automation (RPA) combined with AI is automating back-office operations, reducing errors, and freeing up human employees to focus on high-value tasks.</p>
        `
    },
    "sustainable-supply-chains": {
        title: "Sustainable Supply Chains",
        category: "Industry",
        date: "Sep 28, 2025",
        author: "James Wilson",
        content: `
            <p>Sustainability is moving from a corporate social responsibility (CSR) initiative to a core business strategy. Consumers and regulators alike are demanding transparency and ethical sourcing in supply chains.</p>
            <h3>Blockchain for Transparency</h3>
            <p>Blockchain technology provides an immutable record of a product's journey from raw material to the end consumer. This ensures authenticity and ethical sourcing.</p>
            <h3>Optimizing Logistics</h3>
            <p>AI-driven logistics platforms are optimizing delivery routes to minimize carbon footprints and reduce fuel consumption.</p>
        `
    },
    "cybersecurity-best-practices": {
        title: "Cybersecurity Best Practices",
        category: "Security",
        date: "Sep 10, 2025",
        author: "Michael Ross",
        content: `
            <p>In an increasingly digital world, cybersecurity is paramount. Organizations must adopt a proactive approach to security to safeguard their assets and reputation.</p>
            <h3>Zero Trust Architecture</h3>
            <p>The "never trust, always verify" approach is becoming the standard. Zero Trust ensures that strict identity verification is required for every person and device trying to access resources on a private network.</p>
            <h3>Employee Training</h3>
            <p>Human error remains the leading cause of security breaches. Regular training and phishing simulations are essential to keep employees vigilant.</p>
        `
    }
};

const InsightDetail = () => {
    const { id } = useParams();
    const insight = insightData[id];

    if (!insight) {
        return (
            <div className="page-detail" style={{ paddingTop: '100px', textAlign: 'center', minHeight: '60vh' }}>
                <h2>Insight not found</h2>
                <Link to="/insights" className="btn btn-primary" style={{ marginTop: '20px' }}>Back to Insights</Link>
            </div>
        );
    }

    return (
        <div className="page-detail" style={{ paddingTop: '80px', minHeight: '100vh', background: '#f8fafc' }}>
            <div className="detail-hero" style={{
                background: 'linear-gradient(135deg, var(--color-blue-dark) 0%, #0f172a 100%)',
                color: '#fff',
                padding: '80px 0 60px',
                textAlign: 'center'
            }}>
                <div className="container">
                    <span style={{
                        background: 'rgba(255,255,255,0.1)',
                        padding: '5px 15px',
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        marginBottom: '20px',
                        display: 'inline-block'
                    }}>
                        {insight.category}
                    </span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ fontSize: '2.5rem', marginBottom: '20px', fontWeight: '800' }}
                    >
                        {insight.title}
                    </motion.h1>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', color: 'rgba(255,255,255,0.8)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={18} /> {insight.date}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><User size={18} /> {insight.author}</span>
                    </div>
                </div>
            </div>

            <div className="container" style={{ padding: '60px 20px', maxWidth: '900px' }}>
                <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '40px', color: 'var(--color-text-secondary)', fontWeight: '600' }}>
                    <ArrowLeft size={20} /> Back to Home
                </Link>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    style={{ background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
                >
                    <div
                        className="content-body"
                        dangerouslySetInnerHTML={{ __html: insight.content }}
                        style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#334155' }}
                    />
                </motion.div>
            </div>
        </div>
    );
};

export default InsightDetail;
