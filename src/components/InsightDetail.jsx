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
        <div className="page-detail" style={{
            paddingTop: '80px',
            minHeight: '100vh',
            backgroundImage: insight.bg_image_url ? `url('${insight.bg_image_url}')` : 'none',
            backgroundColor: '#0f172a',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            color: '#fff'
        }}>
            <SEO
                title={insight.title}
                description={DOMPurify.sanitize(insight.content || '').substring(0, 155)}
                url={`insights/${id}`}
            />



            <div className="detail-hero" style={{
                padding: '100px 0 80px',
                textAlign: 'center',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                position: 'relative',
                backgroundImage: insight.hero_image_url
                    ? `linear-gradient(to bottom, rgba(15, 23, 42, 0.1), rgba(15, 23, 42, 0.6)), url('${insight.hero_image_url}')`
                    : insight.bg_image_url
                        ? `linear-gradient(to bottom, rgba(15, 23, 42, 0.1), rgba(15, 23, 42, 0.6)), url('${insight.bg_image_url}')`
                        : 'none',
                backgroundColor: '#0f172a',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '400px'
            }}>
                <div className="container" style={{ maxWidth: '1000px', position: 'relative', zIndex: 1 }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span style={{
                            background: 'rgba(212, 175, 55, 0.2)',
                            color: '#D4AF37',
                            padding: '6px 16px',
                            borderRadius: '30px',
                            fontSize: '0.8rem',
                            textTransform: 'uppercase',
                            letterSpacing: '3px',
                            marginBottom: '24px',
                            display: 'inline-block',
                            fontWeight: '800',
                            border: '1px solid rgba(212, 175, 55, 0.4)',
                            backdropFilter: 'blur(10px)'
                        }}>
                            {insight.category}
                        </span>

                        {insight.hero_content ? (
                            <div
                                className="hero-content-rendered"
                                dangerouslySetInnerHTML={{ __html: insight.hero_content }}
                                style={{
                                    color: '#fff',
                                    marginBottom: '30px',
                                    textShadow: '0 2px 10px rgba(0,0,0,0.5)'
                                }}
                            />
                        ) : (
                            <motion.h1
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    fontSize: 'calc(2.5rem + 1.5vw)',
                                    marginBottom: '30px',
                                    fontWeight: '900',
                                    color: '#fff',
                                    letterSpacing: '-1.5px',
                                    lineHeight: '1.1',
                                    textShadow: '0 2px 20px rgba(0,0,0,0.8)'
                                }}
                            >
                                {insight.title}
                            </motion.h1>
                        )}

                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '30px',
                            color: 'rgba(255,255,255,0.9)',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            marginTop: '20px'
                        }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={18} color="#D4AF37" /> {insight.date}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><User size={18} color="#D4AF37" /> {insight.author}</span>
                        </div>
                    </motion.div>
                </div>

                {/* Visual enhancement: subtle overlay blur for deep focus */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(circle at center, transparent 0%, rgba(15, 23, 42, 0.4) 100%)',
                    pointerEvents: 'none'
                }} />
            </div>

            <div className="container" style={{ padding: '40px 20px', maxWidth: '1000px', position: 'relative', zIndex: 2 }}>
                <Breadcrumbs />
                <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '30px', color: '#D4AF37', fontSize: '0.9rem', fontWeight: '600', transition: 'all 0.3s ease' }}>
                    <ArrowLeft size={18} /> Back to Home
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    style={{
                        background: 'rgba(15, 23, 42, 0.85)',
                        padding: '40px',
                        borderRadius: '20px',
                        backdropFilter: 'blur(25px)',
                        WebkitBackdropFilter: 'blur(25px)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)'
                    }}
                >
                    {/* Main Content Wrapper */}
                    <div style={{ position: 'relative', zIndex: 2 }}>
                        {insight.image_url && (
                            <div style={{
                                width: '100%',
                                marginBottom: '30px',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                border: '1px solid rgba(255,255,255,0.1)'
                            }}>
                                <img
                                    src={insight.image_url}
                                    alt={insight.title}
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        display: 'block'
                                    }}
                                />
                            </div>
                        )}
                        <div
                            className="content-body"
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(insight.content || '') }}
                            style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#cbd5e1' }}
                        />
                    </div>

                    <style>{`
                        .content-body { overflow-wrap: break-word; word-wrap: break-word; hyphens: auto; }
                        .content-body h1, .content-body h2, .content-body h3, .content-body h4, .content-body h5, .content-body h6 { 
                            color: #fff; margin: 1.5em 0 0.8em; font-weight: 800; line-height: 1.25;
                            overflow-wrap: break-word;
                        }
                        .content-body h1 { fontSize: 2.2rem; }
                        .content-body h2 { fontSize: 1.8rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px; }
                        .content-body h3 { fontSize: 1.4rem; }
                        .content-body p { margin-bottom: 1.5em; }
                        .content-body a { color: #D4AF37; text-decoration: none; border-bottom: 1px solid rgba(212, 175, 55, 0.3); transition: all 0.3s; }
                        .content-body a:hover { border-bottom-color: #D4AF37; background: rgba(212, 175, 55, 0.05); }
                        .content-body ul, .content-body ol { margin-bottom: 25px; padding-left: 25px; }
                        .content-body li { margin-bottom: 12px; }
                        .content-body blockquote { 
                            border-left: 4px solid #D4AF37; padding: 20px 30px; 
                            font-style: italic; color: #cbd5e1; margin: 30px 0; 
                            background: rgba(212, 175, 55, 0.03); border-radius: 0 12px 12px 0;
                        }
                        .content-body img { max-width: 100%; height: auto; border-radius: 12px; margin: 30px 0; border: 1px solid rgba(255,255,255,0.1); }
                        
                        /* Quill Specific Sizes/Fonts */
                        .ql-size-small { font-size: 0.85rem; }
                        .ql-size-large { font-size: 1.5rem; }
                        .ql-size-huge { font-size: 2.25rem; }
                        .ql-font-serif { font-family: 'Georgia', serif; }
                        .ql-font-monospace { font-family: 'Courier New', monospace; }
                        .ql-align-center { text-align: center; }
                        .ql-align-right { text-align: right; }
                        .ql-align-justify { text-align: justify; }
                    `}</style>
                </motion.div>
            </div>
        </div>
    );
};

export default InsightDetail;
