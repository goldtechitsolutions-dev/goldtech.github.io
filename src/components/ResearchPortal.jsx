import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Beaker, BookOpen, Rocket,
    Shield, BarChart3, LogOut, Plus, Search,
    FileText, Zap, Globe, Cpu, Microscope,
    Lightbulb, ThumbsUp, Layers, Compass,
    ExternalLink, RefreshCw, XCircle, CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import logo from '../assets/logo-transparent.png';
import AdminService from '../services/adminService';

// --- Reusable UI Components ---

const GlassCard = ({ children, delay = 0, className = '', style = {} }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        style={{
            background: 'rgba(76, 29, 149, 0.05)', // Deep purple tint
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(139, 92, 246, 0.2)', // Indigo border
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
            color: '#fff',
            ...style
        }}
        className={className}
    >
        {children}
    </motion.div>
);

const ActionButton = ({ onClick, children, variant = 'primary', icon: Icon, disabled = false, ...props }) => {
    const baseStyle = {
        padding: '8px 16px',
        borderRadius: '8px',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'all 0.3s ease',
        fontSize: '0.85rem',
        opacity: disabled ? 0.6 : 1
    };

    const styles = {
        primary: { background: 'linear-gradient(135deg, #8B5CF6 0%, #D946EF 100%)', color: '#fff' },
        secondary: { background: 'rgba(139, 92, 246, 0.1)', color: '#A78BFA', border: '1px solid rgba(139, 92, 246, 0.3)' },
        ghost: { background: 'transparent', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)' }
    };

    return (
        <motion.button
            whileHover={disabled ? {} : { scale: 1.05, boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)' }}
            whileTap={disabled ? {} : { scale: 0.95 }}
            onClick={!disabled ? onClick : undefined}
            style={{ ...baseStyle, ...styles[variant] }}
            {...props}
        >
            {Icon && <Icon size={16} />}
            {children}
        </motion.button>
    );
};

const ResearchPortal = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [loading, setLoading] = useState(true);

    // Data State
    const [projects, setProjects] = useState([]);
    const [patents, setPatents] = useState([]);
    const [papers, setPapers] = useState([]);
    const [ideas, setIdeas] = useState([]);
    const [techRadar, setTechRadar] = useState([]);

    // UI State
    const [showIdeaForm, setShowIdeaForm] = useState(false);
    const [newIdea, setNewIdea] = useState({ title: '', submitter: '' });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [projs, pats, paps, ideaList, radar] = await Promise.all([
                AdminService.getRDProjects(),
                AdminService.getPatents(),
                AdminService.getResearchPapers(),
                AdminService.getInnovationIdeas(),
                AdminService.getTechRadar()
            ]);

            setProjects(projs || []);
            setPatents(pats || []);
            setPapers(paps || []);
            setIdeas(ideaList || []);
            setTechRadar(radar || []);
        } catch (error) {
            console.error("ResearchPortal: Error loading data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleVote = async (id) => {
        if (await AdminService.voteIdea(id)) {
            const updatedIdeas = await AdminService.getInnovationIdeas();
            setIdeas(updatedIdeas);
        }
    };

    const handleSubmitIdea = async (e) => {
        e.preventDefault();
        await AdminService.submitIdea(newIdea);
        const updatedIdeas = await AdminService.getInnovationIdeas();
        setIdeas(updatedIdeas);
        setShowIdeaForm(false);
        setNewIdea({ title: '', submitter: '' });
    };

    const handleLogout = () => navigate('/');

    const navLinkStyle = (isActive) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 20px',
        width: '100%',
        borderRadius: '12px',
        color: isActive ? '#C084FC' : '#94a3b8',
        background: isActive ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
        border: isActive ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid transparent',
        cursor: 'pointer',
        textAlign: 'left',
        fontWeight: isActive ? '600' : '500',
        transition: 'all 0.3s ease',
        fontSize: '0.95rem',
        marginBottom: '4px'
    });

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#020617' }}>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    style={{ color: '#8B5CF6' }}
                >
                    <RefreshCw size={48} />
                </motion.div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#020617', fontFamily: "'Outfit', sans-serif" }}>

            {/* Sidebar */}
            <div style={{
                width: '280px',
                background: 'rgba(2, 6, 23, 0.8)',
                backdropFilter: 'blur(20px)',
                borderRight: '1px solid rgba(139, 92, 246, 0.1)',
                padding: '30px',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                zIndex: 10
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '50px' }}>
                    <img src={logo} alt="GoldTech" style={{ width: '45px', height: 'auto' }} />
                    <div style={{ lineHeight: 1 }}>
                        <span style={{ color: '#8B5CF6', fontWeight: 'bold', fontSize: '1.4rem', letterSpacing: '1px' }}>GOLD</span>
                        <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.4rem', letterSpacing: '1px' }}>LABS</span>
                    </div>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                    <button onClick={() => setActiveTab('dashboard')} style={navLinkStyle(activeTab === 'dashboard')}>
                        <LayoutDashboard size={18} /> Lab Dashboard
                    </button>
                    <button onClick={() => setActiveTab('projects')} style={navLinkStyle(activeTab === 'projects')}>
                        <Rocket size={18} /> Active Research
                    </button>
                    <button onClick={() => setActiveTab('patents')} style={navLinkStyle(activeTab === 'patents')}>
                        <Shield size={18} /> IP & Patents
                    </button>
                    <button onClick={() => setActiveTab('library')} style={navLinkStyle(activeTab === 'library')}>
                        <BookOpen size={18} /> Tech Library
                    </button>
                    <button onClick={() => setActiveTab('hub')} style={navLinkStyle(activeTab === 'hub')}>
                        <Lightbulb size={18} /> Innovation Hub
                    </button>
                    <button onClick={() => setActiveTab('radar')} style={navLinkStyle(activeTab === 'radar')}>
                        <Compass size={18} /> Tech Radar
                    </button>
                </nav>

                <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid rgba(139, 92, 246, 0.1)' }}>
                    <button onClick={handleLogout} style={{ ...navLinkStyle(false), color: '#ef4444' }}>
                        <LogOut size={18} /> Terminate Session
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, marginLeft: '280px', padding: '40px', background: 'radial-gradient(circle at top right, #1e1b4b 0%, #020617 100%)', minHeight: '100vh' }}>
                <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', color: '#fff', fontWeight: '800', marginBottom: '5px' }}>
                            {activeTab === 'dashboard' && 'Research Dashboard'}
                            {activeTab === 'projects' && 'Active Research Units'}
                            {activeTab === 'patents' && 'Intellectual Property'}
                            {activeTab === 'library' && 'Tech Library'}
                            {activeTab === 'hub' && 'Innovation Hub'}
                            {activeTab === 'radar' && 'Technology Radar'}
                        </h1>
                        <p style={{ color: '#94a3b8' }}>Propelling GoldTech into the next frontier of digital excellence.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <ActionButton variant="secondary" onClick={loadData} icon={RefreshCw}>Re-Sync</ActionButton>
                        <ActionButton onClick={() => setShowIdeaForm(true)} icon={Plus}>Submit Invention</ActionButton>
                    </div>
                </header>

                <AnimatePresence mode='wait'>
                    {activeTab === 'dashboard' && (
                        <motion.div
                            key="dashboard"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
                        >
                            {/* Stats */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                                <GlassCard>
                                    <Microscope style={{ color: '#8B5CF6', marginBottom: '10px' }} size={24} />
                                    <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Live Projects</div>
                                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{projects.length}</div>
                                </GlassCard>
                                <GlassCard>
                                    <Shield style={{ color: '#D946EF', marginBottom: '10px' }} size={24} />
                                    <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Protected IP</div>
                                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{patents.length}</div>
                                </GlassCard>
                                <GlassCard>
                                    <Layers style={{ color: '#C084FC', marginBottom: '10px' }} size={24} />
                                    <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Lab Efficiency</div>
                                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>94%</div>
                                </GlassCard>
                                <GlassCard>
                                    <Zap style={{ color: '#F472B6', marginBottom: '10px' }} size={24} />
                                    <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Innovation Score</div>
                                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>8.4</div>
                                </GlassCard>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }}>
                                <GlassCard>
                                    <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <BarChart3 size={20} color="#8B5CF6" /> Research Velocity
                                    </h3>
                                    <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '10px', paddingBottom: '20px' }}>
                                        {[65, 80, 45, 90, 75, 100, 85].map((h, i) => (
                                            <div key={i} style={{ flex: 1, height: `${h}%`, background: 'linear-gradient(to top, #8B5CF6, #D946EF)', borderRadius: '4px 4px 0 0', opacity: 0.6 + (i * 0.05) }}></div>
                                        ))}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', fontSize: '0.8rem' }}>
                                        <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
                                    </div>
                                </GlassCard>

                                <GlassCard>
                                    <h3 style={{ marginBottom: '20px' }}>Trending Tech</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {techRadar.slice(0, 3).map(tech => (
                                            <div key={tech.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                <div>
                                                    <div style={{ fontWeight: '600' }}>{tech.tech}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{tech.quadrant}</div>
                                                </div>
                                                <span style={{ fontSize: '0.75rem', padding: '4px 8px', borderRadius: '6px', background: 'rgba(139, 92, 246, 0.2)', color: '#A78BFA' }}>{tech.status}</span>
                                            </div>
                                        ))}
                                    </div>
                                </GlassCard>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'projects' && (
                        <motion.div
                            key="projects"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}
                        >
                            {projects.map(proj => (
                                <GlassCard key={proj.id} style={{ position: 'relative' }}>
                                    <div style={{ position: 'absolute', top: '15px', right: '15px' }}>
                                        <span style={{ fontSize: '0.7rem', padding: '4px 8px', borderRadius: '20px', background: proj.status === 'Active' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: proj.status === 'Active' ? '#4ade80' : '#fbbf24', border: '1px solid currentColor' }}>{proj.status}</span>
                                    </div>
                                    <h3 style={{ margin: '0 0 10px 0', fontSize: '1.3rem' }}>{proj.name}</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.85rem', marginBottom: '20px' }}>
                                        <Globe size={14} /> {proj.category} Unit • Lead: {proj.lead}
                                    </div>

                                    <div style={{ marginBottom: '15px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '5px' }}>
                                            <span>Progress</span>
                                            <span>{proj.progress}%</span>
                                        </div>
                                        <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                                            <div style={{ height: '100%', width: `${proj.progress}%`, background: 'linear-gradient(90deg, #8B5CF6, #D946EF)', borderRadius: '3px' }}></div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#cbd5e1' }}>
                                        <div>
                                            <div style={{ color: '#64748b', fontSize: '0.75rem' }}>Funding</div>
                                            ${(proj.budget / 1000).toLocaleString()}k
                                        </div>
                                        <div>
                                            <div style={{ color: '#64748b', fontSize: '0.75rem' }}>Personnel</div>
                                            {proj.members} Members
                                        </div>
                                        <div>
                                            <div style={{ color: '#64748b', fontSize: '0.75rem' }}>Target</div>
                                            {proj.deadline}
                                        </div>
                                    </div>
                                </GlassCard>
                            ))}
                        </motion.div>
                    )}

                    {activeTab === 'patents' && (
                        <motion.div
                            key="patents"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <GlassCard>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(139, 92, 246, 0.2)' }}>
                                            <th style={{ padding: '15px', color: '#94a3b8' }}>Patent Title</th>
                                            <th style={{ padding: '15px', color: '#94a3b8' }}>Status</th>
                                            <th style={{ padding: '15px', color: '#94a3b8' }}>Inventors</th>
                                            <th style={{ padding: '15px', color: '#94a3b8' }}>Region</th>
                                            <th style={{ padding: '15px', color: '#94a3b8' }}>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {patents.map(patent => (
                                            <tr key={patent.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                                <td style={{ padding: '15px', fontWeight: 'bold' }}>{patent.title}</td>
                                                <td style={{ padding: '15px' }}>
                                                    <span style={{ fontSize: '0.8rem', padding: '4px 10px', borderRadius: '12px', background: patent.status === 'Granted' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(139, 92, 246, 0.1)', color: patent.status === 'Granted' ? '#4ade80' : '#A78BFA' }}>{patent.status}</span>
                                                </td>
                                                <td style={{ padding: '15px', fontSize: '0.9rem' }}>{patent.inventors.join(', ')}</td>
                                                <td style={{ padding: '15px' }}>{patent.country}</td>
                                                <td style={{ padding: '15px', color: '#94a3b8', fontSize: '0.9rem' }}>{patent.status === 'Granted' ? patent.grantedDate : patent.filedDate}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </GlassCard>
                        </motion.div>
                    )}

                    {activeTab === 'hub' && (
                        <motion.div
                            key="hub"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
                        >
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                                {ideas.sort((a, b) => b.votes - a.votes).map(idea => (
                                    <GlassCard key={idea.id} style={{ border: idea.status === 'Trending' ? '1px solid rgba(217, 70, 239, 0.3)' : '1px solid rgba(139, 92, 246, 0.2)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                            <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: '#94a3b8' }}>{idea.status}</span>
                                            <button
                                                onClick={() => handleVote(idea.id)}
                                                style={{ background: 'none', border: 'none', color: '#8B5CF6', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                                            >
                                                <ThumbsUp size={16} /> {idea.votes}
                                            </button>
                                        </div>
                                        <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>{idea.title}</h3>
                                        <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Submitted by: {idea.submitter}</p>
                                    </GlassCard>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'radar' && (
                        <motion.div
                            key="radar"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <GlassCard>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                                    {['Adopt', 'Trial', 'Assess', 'Hold'].map(status => (
                                        <div key={status}>
                                            <h3 style={{ marginBottom: '15px', textTransform: 'uppercase', fontSize: '0.9rem', color: '#8B5CF6', letterSpacing: '1px' }}>{status}</h3>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                {techRadar.filter(t => t.status === status).map(tech => (
                                                    <div key={tech.id} style={{ padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', borderLeft: '3px solid #8B5CF6' }}>
                                                        <div style={{ fontWeight: '600' }}>{tech.tech}</div>
                                                        <p style={{ margin: '5px 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>{tech.description}</p>
                                                    </div>
                                                ))}
                                                {techRadar.filter(t => t.status === status).length === 0 && (
                                                    <div style={{ padding: '15px', color: '#475569', fontSize: '0.85rem', fontStyle: 'italic' }}>No tech currently in this phase.</div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </GlassCard>
                        </motion.div>
                    )}

                    {activeTab === 'library' && (
                        <motion.div
                            key="library"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}
                        >
                            {papers.map(paper => (
                                <GlassCard key={paper.id} style={{ display: 'flex', gap: '20px' }}>
                                    <div style={{ width: '80px', height: '100px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <FileText size={32} color="#8B5CF6" />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2rem' }}>{paper.title}</h3>
                                        <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0 0 15px 0' }}>Author: {paper.author} • {paper.date}</p>
                                        <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
                                            {paper.tags.map(tag => (
                                                <span key={tag} style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: '#A78BFA' }}>#{tag}</span>
                                            ))}
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{paper.citations} Citations</span>
                                            <ActionButton variant="ghost" icon={ExternalLink}>Access Paper</ActionButton>
                                        </div>
                                    </div>
                                </GlassCard>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Submission Modal */}
            <AnimatePresence>
                {showIdeaForm && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            style={{ width: '100%', maxWidth: '500px', background: '#0f172a', borderRadius: '24px', padding: '40px', border: '1px solid rgba(139, 92, 246, 0.3)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                                <h2 style={{ color: '#fff', margin: 0 }}>Register New Invention</h2>
                                <button onClick={() => setShowIdeaForm(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><XCircle size={24} /></button>
                            </div>
                            <form onSubmit={handleSubmitIdea} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '8px', fontSize: '0.9rem' }}>Project Title/Idea</label>
                                    <input
                                        type="text"
                                        required
                                        value={newIdea.title}
                                        onChange={e => setNewIdea({ ...newIdea, title: e.target.value })}
                                        placeholder="e.g. Neural-Linked IDE Integration"
                                        style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '8px', fontSize: '0.9rem' }}>Principal Investigator</label>
                                    <input
                                        type="text"
                                        required
                                        value={newIdea.submitter}
                                        onChange={e => setNewIdea({ ...newIdea, submitter: e.target.value })}
                                        placeholder="Name of Lead Researcher"
                                        style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}
                                    />
                                </div>
                                <div style={{ marginTop: '10px' }}>
                                    <ActionButton type="submit" style={{ width: '100%', padding: '16px', justifyContent: 'center' }} icon={CheckCircle}>Confirm Patent Entry</ActionButton>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default ResearchPortal;
