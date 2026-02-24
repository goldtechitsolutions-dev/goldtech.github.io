import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Users, CheckCircle, XCircle, AlertTriangle,
    Briefcase, TrendingUp, Activity, UserPlus, Clock, Shield,
    FileText, Zap, LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo-transparent.png'; // Assuming this exists based on other files
import AdminService from '../services/adminService';

// --- Antigravity UI Components (Inline Styles) ---

const GlassCard = ({ children, delay = 0, className = '', style = {} }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
            color: '#fff',
            ...style
        }}
        className={className}
    >
        {children}
    </motion.div>
);

const FloatingWidget = ({ children, delay = 0 }) => (
    <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay }}
    >
        {children}
    </motion.div>
);

const ActionButton = ({ onClick, children, variant = 'primary', icon: Icon, disabled = false, style = {} }) => {
    const baseStyle = {
        padding: '8px 16px',
        borderRadius: '8px',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        transition: 'all 0.3s ease',
        fontSize: '0.85rem',
        opacity: disabled ? 0.6 : 1,
        ...style
    };

    const styles = {
        primary: { background: 'linear-gradient(135deg, #D4AF37 0%, #F2D06B 100%)', color: '#0f172a' },
        danger: { background: 'rgba(220, 38, 38, 0.2)', color: '#fca5a5', border: '1px solid rgba(220, 38, 38, 0.5)' },
        success: { background: 'rgba(22, 163, 74, 0.2)', color: '#86efac', border: '1px solid rgba(22, 163, 74, 0.5)' },
        ghost: { background: 'transparent', color: '#94a3b8' }
    };

    return (
        <motion.button
            whileHover={disabled ? {} : { scale: 1.05 }}
            whileTap={disabled ? {} : { scale: 0.95 }}
            onClick={!disabled ? onClick : undefined}
            style={{ ...baseStyle, ...styles[variant] }}
        >
            {Icon && <Icon size={16} />}
            {children}
        </motion.button>
    );
};

const ManagerPortal = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');

    // Data State
    const [managerStats, setManagerStats] = useState(null);
    const [resourceData, setResourceData] = useState([]);
    const [approvalList, setApprovalList] = useState([]);
    const [performanceData, setPerformanceData] = useState(null);
    const [incidents, setIncidents] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [predictions, setPredictions] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            const [stats, resources, approvals, performance, incidentList, candidateList, deliveryPredictions] = await Promise.all([
                AdminService.getManagerOverview(),
                AdminService.getResourceAllocation(),
                AdminService.getApprovals(),
                AdminService.getPerformanceMetrics(),
                AdminService.getIncidents(),
                AdminService.getCandidates(),
                AdminService.getProjectDeliveryPrediction()
            ]);

            setManagerStats(stats);
            setResourceData(resources);
            setApprovalList(approvals);
            setPerformanceData(performance);
            setIncidents(incidentList);
            setCandidates(candidateList);
            setPredictions(deliveryPredictions);
        };

        loadData();
    }, []);

    const handleLogout = () => {
        navigate('/');
    };

    // --- Helpers ---
    const navLinkStyle = (isActive) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 20px',
        width: '100%',
        borderRadius: '12px',
        color: isActive ? '#D4AF37' : '#94a3b8',
        background: isActive ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
        border: isActive ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid transparent',
        cursor: 'pointer',
        textAlign: 'left',
        fontWeight: isActive ? '600' : '500',
        transition: 'all 0.3s ease',
        fontSize: '0.95rem'
    });

    const StatCard = ({ title, value, icon: Icon, color, delay, trend }) => (
        <FloatingWidget delay={delay}>
            <GlassCard style={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ background: `rgba(${color}, 0.2)`, padding: '12px', borderRadius: '50%', marginBottom: '10px' }}>
                    <Icon size={24} color={`rgb(${color})`} />
                </div>
                <h3 style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '5px' }}>{title}</h3>
                <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fff' }}>{value}</p>
                {trend && (
                    <span style={{ fontSize: '0.8rem', color: trend.includes('+') ? '#86efac' : '#fca5a5' }}>
                        {trend}
                    </span>
                )}
            </GlassCard>
        </FloatingWidget>
    );

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#0f172a', fontFamily: "'Outfit', sans-serif" }}>

            {/* Sidebar */}
            <div style={{
                width: '280px',
                background: 'rgba(15, 23, 42, 0.6)',
                backdropFilter: 'blur(20px)',
                borderRight: '1px solid rgba(255,255,255,0.05)',
                padding: '30px',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                zIndex: 10
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '50px' }}>
                    <img src={logo} alt="GoldTech" style={{ width: '45px', height: 'auto' }} />
                    <div>
                        <span style={{ color: '#D4AF37', fontWeight: 'bold', fontSize: '1.4rem', letterSpacing: '1px' }}>GOLD</span>
                        <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.4rem', letterSpacing: '1px' }}>TECH</span>
                    </div>
                </div>

                <div style={{ marginBottom: '30px', textAlign: 'center' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#D4AF37', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', color: '#0f172a' }}>M</div>
                    <h3 style={{ color: '#fff', margin: 0 }}>Mike Manager</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>Delivery Head</p>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                    <button onClick={() => setActiveTab('dashboard')} style={navLinkStyle(activeTab === 'dashboard')}>
                        <LayoutDashboard size={18} /> Command Center
                    </button>
                    <button onClick={() => setActiveTab('resources')} style={navLinkStyle(activeTab === 'resources')}>
                        <Users size={18} /> Resource Alloc
                    </button>
                    <button onClick={() => setActiveTab('performance')} style={navLinkStyle(activeTab === 'performance')}>
                        <TrendingUp size={18} /> Performance
                    </button>
                    <button onClick={() => setActiveTab('approvals')} style={navLinkStyle(activeTab === 'approvals')}>
                        <CheckCircle size={18} /> Approvals {approvalList.length > 0 && <span style={{ marginLeft: 'auto', background: '#eab308', color: '#000', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '10px' }}>{approvalList.length}</span>}
                    </button>
                    <button onClick={() => setActiveTab('incidents')} style={navLinkStyle(activeTab === 'incidents')}>
                        <AlertTriangle size={18} /> Incidents
                    </button>
                    <button onClick={() => setActiveTab('hiring')} style={navLinkStyle(activeTab === 'hiring')}>
                        <UserPlus size={18} /> Hiring Pipeline
                    </button>
                </nav>

                <div style={{ marginTop: 'auto' }}>
                    <button onClick={handleLogout} style={{ ...navLinkStyle(false), color: '#ef4444', justifyContent: 'flex-start' }}>
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, marginLeft: '280px', padding: '40px', background: 'radial-gradient(circle at top right, #1e293b 0%, #0f172a 100%)', minHeight: '100vh' }}>
                <header style={{ marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '2.5rem', color: '#fff', fontWeight: '700', marginBottom: '5px' }}>
                        {activeTab === 'dashboard' && 'Manager Command Center'}
                        {activeTab === 'resources' && 'Resource Allocation'}
                        {activeTab === 'performance' && 'Performance Metrics'}
                        {activeTab === 'approvals' && 'Approval Workflow'}
                        {activeTab === 'incidents' && 'Incident Tracker'}
                        {activeTab === 'hiring' && 'Hiring Pipeline'}
                    </h1>
                    <p style={{ color: '#94a3b8' }}>Overview of Teams, Projects, and Deliverables</p>
                </header>

                <AnimatePresence mode='wait'>
                    {/* DASHBOARD */}
                    {activeTab === 'dashboard' && managerStats && (
                        <motion.div
                            key="dashboard"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            style={{ display: 'grid', gap: '24px' }}
                        >
                            {/* KPI Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                                {managerStats.stats.map((stat, i) => (
                                    <StatCard
                                        key={i}
                                        title={stat.title}
                                        value={stat.value}
                                        icon={i === 0 ? Zap : i === 1 ? Activity : i === 2 ? CheckCircle : Clock}
                                        color={stat.type === 'positive' ? "34, 197, 94" : stat.type === 'negative' ? "239, 68, 68" : "234, 179, 8"}
                                        trend={stat.change}
                                        delay={i * 0.1}
                                    />
                                ))}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                                {/* Alerts */}
                                <GlassCard>
                                    <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px', marginBottom: '15px', color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <AlertTriangle size={20} /> Urgent Attention
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                        {managerStats.alerts.map(alert => (
                                            <div key={alert.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(239, 68, 68, 0.1)', padding: '15px', borderRadius: '12px', borderLeft: '3px solid #ef4444' }}>
                                                <div>
                                                    <h4 style={{ margin: 0, color: '#e2e8f0', fontSize: '0.95rem' }}>[{alert.severity}] {alert.message}</h4>
                                                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.8rem', marginTop: '4px' }}>{alert.time}</p>
                                                </div>
                                                <ActionButton variant="danger" icon={CheckCircle}>Resolve</ActionButton>
                                            </div>
                                        ))}
                                    </div>
                                </GlassCard>

                                {/* Predictive Analytics */}
                                <GlassCard>
                                    <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px', marginBottom: '15px', color: '#D4AF37' }}>
                                        🔮 Delivery Predictions
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                        {predictions.map((pred, i) => (
                                            <div key={i} style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                                    <span style={{ fontWeight: 'bold' }}>{pred.project}</span>
                                                    <span style={{ color: pred.likelihood === 'On Time' ? '#86efac' : '#fca5a5' }}>{pred.likelihood}</span>
                                                </div>
                                                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginTop: '5px' }}>
                                                    <div style={{ width: `${pred.confidence}%`, height: '100%', background: pred.likelihood === 'On Time' ? '#22c55e' : '#f97316', borderRadius: '3px' }}></div>
                                                </div>
                                                <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '5px', textAlign: 'right' }}>{pred.confidence}% Confidence</p>
                                            </div>
                                        ))}
                                    </div>
                                </GlassCard>
                            </div>
                        </motion.div>
                    )}

                    {/* RESOURCES */}
                    {activeTab === 'resources' && (
                        <motion.div
                            key="resources"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <GlassCard>
                                <table style={{ width: '100%', borderCollapse: 'collapse', color: '#cbd5e1' }}>
                                    <thead>
                                        <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                            <th style={{ padding: '15px' }}>Team Member</th>
                                            <th style={{ padding: '15px' }}>Role</th>
                                            <th style={{ padding: '15px' }}>Current Project</th>
                                            <th style={{ padding: '15px' }}>Allocation %</th>
                                            <th style={{ padding: '15px' }}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {resourceData.map(res => (
                                            <tr key={res.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <td style={{ padding: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{res.name.charAt(0)}</div>
                                                    {res.name}
                                                </td>
                                                <td style={{ padding: '15px' }}>{res.role}</td>
                                                <td style={{ padding: '15px', color: '#D4AF37' }}>{res.project}</td>
                                                <td style={{ padding: '15px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <div style={{ width: '80px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
                                                            <div style={{
                                                                width: `${res.allocation}%`,
                                                                height: '100%',
                                                                background: res.allocation > 100 ? '#ef4444' : res.allocation === 100 ? '#22c55e' : '#eab308'
                                                            }}></div>
                                                        </div>
                                                        <span style={{ fontSize: '0.85rem' }}>{res.allocation}%</span>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '15px' }}>
                                                    <span style={{
                                                        padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold',
                                                        background: res.status === 'Busy' ? 'rgba(34, 197, 94, 0.2)' : res.status === 'Overloaded' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(148, 163, 184, 0.2)',
                                                        color: res.status === 'Busy' ? '#86efac' : res.status === 'Overloaded' ? '#fca5a5' : '#cbd5e1'
                                                    }}>
                                                        {res.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </GlassCard>
                        </motion.div>
                    )}

                    {/* APPROVALS */}
                    {activeTab === 'approvals' && (
                        <motion.div
                            key="approvals"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}
                        >
                            {approvalList.length === 0 ? <p className="text-gray-400">No pending approvals.</p> : approvalList.map(item => (
                                <GlassCard key={item.id} delay={0.1}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                                        <div>
                                            <span style={{ fontSize: '0.75rem', color: '#D4AF37', background: 'rgba(212, 175, 55, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>{item.type}</span>
                                            <h3 style={{ margin: '8px 0', fontSize: '1.1rem' }}>{item.requestor}</h3>
                                            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>{item.details}</p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>{item.date}</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                        <ActionButton variant="success" icon={CheckCircle} style={{ flex: 1, justifyContent: 'center' }}>Approve</ActionButton>
                                        <ActionButton variant="danger" icon={XCircle} style={{ flex: 1, justifyContent: 'center' }}>Reject</ActionButton>
                                    </div>
                                </GlassCard>
                            ))}
                        </motion.div>
                    )}

                    {/* INCIDENTS */}
                    {activeTab === 'incidents' && (
                        <motion.div
                            key="incidents"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
                        >
                            {incidents.map(inc => (
                                <GlassCard key={inc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <div style={{
                                            width: '40px', height: '40px', borderRadius: '8px',
                                            background: inc.severity === 'P1' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(234, 179, 8, 0.2)',
                                            color: inc.severity === 'P1' ? '#ef4444' : '#eab308',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                                        }}>
                                            {inc.severity}
                                        </div>
                                        <div>
                                            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{inc.title}</h3>
                                            <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '0.9rem' }}>Owner: {inc.owner} • ETA: {inc.eta}</p>
                                        </div>
                                    </div>
                                    <ActionButton variant="ghost" icon={Shield}>View Details</ActionButton>
                                </GlassCard>
                            ))}
                        </motion.div>
                    )}

                    {/* HIRING */}
                    {activeTab === 'hiring' && (
                        <motion.div
                            key="hiring"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}
                        >
                            {candidates.map(cand => (
                                <GlassCard key={cand.id}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div>
                                            <h3 style={{ margin: 0 }}>{cand.name}</h3>
                                            <p style={{ color: '#D4AF37', margin: '5px 0' }}>{cand.role}</p>
                                        </div>
                                        <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>★ {cand.rating}</span>
                                    </div>
                                    <div style={{ margin: '15px 0', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>Current Stage</p>
                                        <p style={{ margin: '5px 0 0 0', fontWeight: 'bold' }}>{cand.stage}</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <ActionButton variant="primary" icon={FileText} style={{ flex: 1, justifyContent: 'center' }}>Resume</ActionButton>
                                        <ActionButton variant="success" icon={CheckCircle} style={{ flex: 1, justifyContent: 'center' }}>Offer</ActionButton>
                                    </div>
                                </GlassCard>
                            ))}
                        </motion.div>
                    )}

                    {/* PERFORMANCE */}
                    {activeTab === 'performance' && performanceData && (
                        <motion.div
                            key="performance"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ display: 'grid', gap: '24px' }}
                        >
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                <GlassCard>
                                    <h3 style={{ marginBottom: '20px' }}>🏃‍♂️ Sprint Velocity Trend</h3>
                                    <div style={{ display: 'flex', alignItems: 'flex-end', height: '200px', gap: '20px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                        {performanceData.velocity.map((v, i) => (
                                            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ width: '40px', height: `${(v.value / 60) * 100}%`, background: '#D4AF37', borderRadius: '4px 4px 0 0' }}></div>
                                                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{v.sprint}</span>
                                            </div>
                                        ))}
                                    </div>
                                </GlassCard>

                                <GlassCard>
                                    <h3 style={{ marginBottom: '20px' }}>🛡️ Code Quality Gates</h3>
                                    {performanceData.quality.map((q, i) => (
                                        <div key={i} style={{ marginBottom: '15px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                <span>{q.metric}</span>
                                                <span style={{ color: q.value >= q.target ? '#86efac' : '#fca5a5' }}>
                                                    {q.value}% <span style={{ fontSize: '0.8rem', color: '#64748b' }}>(Target: {q.target}%)</span>
                                                </span>
                                            </div>
                                            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                                                <div style={{ width: `${q.value}%`, height: '100%', background: q.value >= q.target ? '#22c55e' : '#ef4444' }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </GlassCard>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
};

export default ManagerPortal;
