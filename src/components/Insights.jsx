import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, Calendar, User, Tag, ArrowRight } from 'lucide-react';
import modernOffice from '../assets/modern-office.png';
import SEO from './SEO';
import AdminService from '../services/adminService';

const Insights = () => {
    const [blogs, setBlogs] = useState([]);
    const [videos, setVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [fetchedBlogs, fetchedVideos] = await Promise.all([
                    AdminService.getBlogs(),
                    AdminService.getVideos()
                ]);
                setBlogs(fetchedBlogs || []);
                setVideos(fetchedVideos || []);
            } catch (error) {
                console.error("Error fetching insights:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <section id="insights" className="services-section" style={{
            position: 'relative',
            backgroundImage: `url(${modernOffice})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            padding: '100px 0'
        }}>
            <SEO
                title="Insights & Media | GoldTech IT Solutions"
                description="Read the latest thought leadership, tech trends, and watch our corporate media and walkthroughs."
                url="insights"
            />
            {/* Dark Overlay */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.6), rgba(0,0,0,0.8))',
                zIndex: 0
            }} />

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                <div className="section-title">
                    <h2 style={{ color: '#ffffff', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Latest Insights</h2>
                    <p style={{ color: '#e2e8f0', fontWeight: '500' }}>Thought leadership and industry trends from our experts.</p>
                </div>

                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '50px', color: '#fff' }}>
                        <div className="loading-spinner"></div>
                        <p>Loading the latest insights...</p>
                    </div>
                ) : (
                    <>
                        {/* Blogs Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px', marginBottom: '80px' }}>
                            {blogs.map((item, i) => {
                                const slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                                return (
                                    <motion.div
                                        key={item.id || i}
                                        className="service-card"
                                        whileHover={{ y: -10 }}
                                        style={{
                                            padding: '40px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            background: item.bg_image_url ? `linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.9)), url(${item.bg_image_url})` : 'rgba(255,255,255,0.03)',
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '20px',
                                            overflow: 'hidden',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <div>
                                            {item.thumbnail_url && (
                                                <div style={{ width: '100%', height: '200px', marginBottom: '25px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                    <img src={item.thumbnail_url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>
                                            )}
                                            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px', color: '#94a3b8', fontSize: '0.8rem' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#D4AF37' }}>
                                                    <Tag size={14} /> {item.category}
                                                </span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                    <Calendar size={14} /> {item.date}
                                                </span>
                                            </div>
                                            <h3 style={{ fontSize: '1.6rem', margin: '0 0 15px 0', color: '#fff', lineHeight: '1.3' }}>{item.title}</h3>
                                            <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '20px', display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                {item.content}
                                            </p>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.85rem' }}>
                                                <User size={14} /> {item.author}
                                            </div>
                                            <Link
                                                to={`/insights/${slug}`}
                                                style={{
                                                    color: '#D4AF37',
                                                    fontWeight: '700',
                                                    textDecoration: 'none',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    fontSize: '0.9rem',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                onMouseEnter={(e) => e.target.style.transform = 'translateX(5px)'}
                                                onMouseLeave={(e) => e.target.style.transform = 'translateX(0)'}
                                            >
                                                Read Insight <ArrowRight size={16} />
                                            </Link>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Video Intelligence Section */}
                        <div className="section-title" style={{ marginTop: '50px' }}>
                            <h2 style={{ color: '#ffffff', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Media & Walkthroughs</h2>
                            <p style={{ color: '#e2e8f0', fontWeight: '500' }}>Explore our solutions and corporate updates through video.</p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
                            {videos.map((video, i) => (
                                <motion.div
                                    key={video.id || i}
                                    whileHover={{ scale: 1.02 }}
                                    style={{
                                        background: 'rgba(15, 23, 42, 0.4)',
                                        backdropFilter: 'blur(12px)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '20px',
                                        overflow: 'hidden',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                                    }}
                                >
                                    <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#000' }}>
                                        {video.video_url.includes('youtube') || video.video_url.includes('youtu.be') ? (
                                            <iframe
                                                width="100%"
                                                height="100%"
                                                src={video.video_url.replace('watch?v=', 'embed/')}
                                                title={video.title}
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                style={{ border: 'none' }}
                                            ></iframe>
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', position: 'relative', cursor: 'pointer' }} onClick={() => window.open(video.video_url, '_blank')}>
                                                <img src={video.thumbnail_url || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop'} alt={video.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
                                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#D4AF37', borderRadius: '50%', padding: '15px', color: '#000' }}>
                                                    <Play size={24} fill="currentColor" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ padding: '20px' }}>
                                        <div style={{ color: '#D4AF37', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                                            {video.category}
                                        </div>
                                        <h3 style={{ color: '#fff', fontSize: '1.2rem', margin: '0 0 10px 0', fontWeight: '700' }}>{video.title}</h3>
                                        <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>{video.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

export default Insights;
