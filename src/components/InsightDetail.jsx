import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Calendar, Tag } from 'lucide-react';
import DOMPurify from 'dompurify';
import SEO from './SEO';
import Breadcrumbs from './Breadcrumbs';

import AdminService from '../services/adminService';

const InsightDetail = () => {
    const { id } = useParams();
    const [insight, setInsight] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchInsight = async () => {
            try {
                const blogs = await AdminService.getBlogs();
                const found = blogs?.find(b => {
                    const slug = b.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                    return slug === id || b.id.toString() === id || b.slug === id;
                });
                setInsight(found || null);
            } catch (error) {
                console.error("Error fetching insight:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchInsight();
    }, [id]);

    if (isLoading) {
        return (
            <div className="page-detail" style={{ paddingTop: '100px', textAlign: 'center', minHeight: '60vh', background: '#0f172a', color: '#D4AF37' }}>
                <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid rgba(212, 175, 55, 0.3)', borderTop: '4px solid #D4AF37', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
                <p>Loading insight...</p>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

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
            <SEO
                title={insight.title}
                description={DOMPurify.sanitize(insight.content || '').substring(0, 155)}
                url={`insights/${id}`}
            />
            <div className="detail-hero" style={{
                background: insight.bg_image_url
                    ? `linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.95)), url(${insight.bg_image_url})`
                    : 'linear-gradient(135deg, var(--color-blue-dark) 0%, #0f172a 100%)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
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
                <Breadcrumbs />
                <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '40px', color: 'var(--color-text-secondary)', fontWeight: '600' }}>
                    <ArrowLeft size={20} /> Back to Home
                </Link>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    style={{ background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
                >
                    {insight.image_url && (
                        <div style={{ marginBottom: '40px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }}>
                            <img src={insight.image_url} alt={insight.title} style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }} />
                        </div>
                    )}
                    <div
                        className="content-body"
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(insight.content || '') }}
                        style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#334155' }}
                    />
                </motion.div>
            </div>
        </div>
    );
};

export default InsightDetail;
