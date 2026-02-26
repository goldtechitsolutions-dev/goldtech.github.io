import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Briefcase, FileText, MessageSquare, LogOut,
    CheckCircle, XCircle, Clock, DollarSign, TrendingUp, Calendar,
    Send, User, Server
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import logo from '../assets/logo-transparent.png';
import AdminService from '../services/adminService';

// --- Antigravity UI Components (Reused) ---

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

const ActionButton = ({ onClick, children, variant = 'primary', icon: Icon, disabled = false }) => {
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
        opacity: disabled ? 0.6 : 1
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

const ClientPortal = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const clientName = "TechCorp Inc"; // Mock Logged-in Client

    // Data State
    const [dashboardData, setDashboardData] = useState(null);
    const [projectBoard, setProjectBoard] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [assets, setAssets] = useState([]);
    const [supportTicket, setSupportTicket] = useState({ subject: '', message: '', priority: 'Medium' });
    const [auditLog, setAuditLog] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [pendingInvoicesTotal, setPendingInvoicesTotal] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // UI Toggles
    const [mfaEnabled, setMfaEnabled] = useState(false);
    const [ipWhitelist, setIpWhitelist] = useState('');

    useEffect(() => {
        refreshData();
    }, []);

    const refreshData = async () => {
        if (isRefreshing) return;
        setIsRefreshing(true);
        try {
            // Safe check for new methods to avoid crashing if service update isn't hot-reloaded yet
            if (AdminService.getClientDashboardData) {
                const [data, board, docs, clAssets, logs, invs] = await Promise.all([
                    AdminService.getClientDashboardData(clientName),
                    AdminService.getProjectBoard(clientName),
                    AdminService.getClientDocuments ? AdminService.getClientDocuments(clientName) : Promise.resolve([]),
                    AdminService.getClientAssets ? AdminService.getClientAssets(clientName) : Promise.resolve([]),
                    AdminService.getClientAuditLog ? AdminService.getClientAuditLog(clientName) : Promise.resolve([]),
                    AdminService.getClientInvoices ? AdminService.getClientInvoices(clientName) : Promise.resolve([])
                ]);

                setDashboardData(data);
                setProjectBoard(board);
                setDocuments(docs || []);
                setAssets(clAssets || []);
                setAuditLog(logs || []);
                setInvoices(invs || []);

                const total = (invs || []).reduce((acc, i) => acc + (i.status === 'Pending' ? i.total : 0), 0);
                setPendingInvoicesTotal(total);
            }
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleLogout = () => {
        navigate('/');
    };

    const handleTicketSubmit = async (e) => {
        e.preventDefault();
        if (AdminService.createSupportTicket) {
            await AdminService.createSupportTicket({ ...supportTicket, client: clientName });
            alert(`Support ticket created! SLA for ${supportTicket.priority} priority started.`);
            setSupportTicket({ ...supportTicket, subject: '', message: '' });
            await refreshData();
        }
    };

    const handleMfaToggle = async () => {
        const newState = !mfaEnabled;
        setMfaEnabled(newState);
        if (AdminService.toggleMFA) await AdminService.toggleMFA(newState);
        alert(`MFA has been ${newState ? 'ENABLED' : 'DISABLED'}.`);
        await refreshData();
    };

    const handleIpUpdate = async () => {
        if (AdminService.updateIPWhitelist) await AdminService.updateIPWhitelist(ipWhitelist);
        alert('IP Whitelist Updated.');
        await refreshData();
    };

    // Components
    const StatCard = ({ title, value, icon: Icon, color, delay }) => (
        <FloatingWidget delay={delay}>
            <GlassCard style={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ background: `rgba(${color}, 0.2)`, padding: '12px', borderRadius: '50%', marginBottom: '10px' }}>
                    <Icon size={24} color={`rgb(${color})`} />
                </div>
                <h3 style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '5px' }}>{title}</h3>
                <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fff' }}>{value}</p>
            </GlassCard>
        </FloatingWidget>
    );

    const KanbanColumn = ({ title, items, color }) => (
        <div style={{ flex: 1, minWidth: '250px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', padding: '15px' }}>
            <h4 style={{ color: color, marginBottom: '15px', borderBottom: `2px solid ${color}`, paddingBottom: '10px' }}>{title}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {items && items.map(item => (
                    <motion.div
                        key={item.id}
                        whileHover={{ scale: 1.02 }}
                        style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}
                    >
                        <p style={{ margin: 0, color: '#e2e8f0', fontSize: '0.9rem' }}>{item.content}</p>
                        <span style={{ display: 'inline-block', marginTop: '8px', fontSize: '0.75rem', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', color: '#94a3b8' }}>
                            {item.tag}
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    );

    const navLinkStyle = (isActive) => ({
        display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', width: '100%',
        borderRadius: '12px', color: isActive ? '#D4AF37' : '#94a3b8',
        background: isActive ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
        border: isActive ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid transparent',
        cursor: 'pointer', textAlign: 'left', fontWeight: isActive ? '600' : '500',
        transition: 'all 0.3s ease', fontSize: '0.95rem'
    });

    if (!dashboardData) return <div style={{ color: 'white', padding: '50px' }}>Loading Portal...</div>;

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#0f172a', fontFamily: "'Outfit', sans-serif" }}>
            {/* Sidebar */}
            <div style={{
                width: '280px', background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(20px)',
                borderRight: '1px solid rgba(255,255,255,0.05)', padding: '30px', display: 'flex', flexDirection: 'column',
                position: 'fixed', height: '100vh', zIndex: 10
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
                    <img src={logo} alt="GoldTech" style={{ width: '40px', height: 'auto' }} />
                    <div>
                        <span style={{ color: '#D4AF37', fontWeight: 'bold', fontSize: '1.2rem' }}>GOLD</span>
                        <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.2rem' }}>CLIENT</span>
                    </div>
                </div>

                <div style={{ marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff' }}>TC</div>
                        <div>
                            <h3 style={{ color: '#fff', margin: 0, fontSize: '0.95rem' }}>TechCorp Inc</h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: 0 }}>Premium Client</p>
                        </div>
                    </div>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, overflowY: 'auto' }}>
                    <button onClick={() => setActiveTab('dashboard')} style={navLinkStyle(activeTab === 'dashboard')}><LayoutDashboard size={18} /> Dashboard</button>
                    <button onClick={() => setActiveTab('projects')} style={navLinkStyle(activeTab === 'projects')}><TrendingUp size={18} /> Projects & Kanban</button>
                    <button onClick={() => setActiveTab('documents')} style={navLinkStyle(activeTab === 'documents')}><FileText size={18} /> Document Vault</button>
                    <button onClick={() => setActiveTab('assets')} style={navLinkStyle(activeTab === 'assets')}><Server size={18} /> Asset Manager</button>
                    <button onClick={() => setActiveTab('invoices')} style={navLinkStyle(activeTab === 'invoices')}><DollarSign size={18} /> Billing & Finance</button>
                    <button onClick={() => setActiveTab('support')} style={navLinkStyle(activeTab === 'support')}><MessageSquare size={18} /> Support Desk</button>
                    <button onClick={() => setActiveTab('settings')} style={navLinkStyle(activeTab === 'settings')}><CheckCircle size={18} /> Security & Logs</button>
                </nav>

                <div style={{ marginTop: 'auto' }}>
                    <button onClick={handleLogout} style={{ ...navLinkStyle(false), color: '#ef4444', justifyContent: 'flex-start' }}>
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, marginLeft: '280px', padding: '40px', background: 'radial-gradient(circle at top right, #1e293b 0%, #0f172a 100%)', minHeight: '100vh' }}>
                <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', color: '#fff', fontWeight: '700', marginBottom: '5px' }}>
                            {activeTab === 'dashboard' && 'Executive Dashboard'}
                            {activeTab === 'projects' && 'Project Roadmap'}
                            {activeTab === 'documents' && 'Secure Document Vault'}
                            {activeTab === 'assets' && 'Digital Asset Management'}
                            {activeTab === 'invoices' && 'Financial Center'}
                            {activeTab === 'support' && 'Support & SLA Tracking'}
                            {activeTab === 'settings' && 'Security Settings'}
                        </h1>
                        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Real-time overview of your engagement with GoldTech.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        {/* Status Indicators for Integrations */}
                        {dashboardData.integrations && Object.entries(dashboardData.integrations).map(([key, val]) => (
                            <div key={key} title={`${key.toUpperCase()} Connected`} style={{
                                width: '35px', height: '35px', borderRadius: '50%',
                                background: val.connected ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255,255,255,0.05)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: val.connected ? '1px solid #22c55e' : '1px solid #475569',
                                color: val.connected ? '#22c55e' : '#475569', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase'
                            }}>
                                {key.substring(0, 2)}
                            </div>
                        ))}
                    </div>
                </header>

                <AnimatePresence mode='wait'>
                    {activeTab === 'dashboard' && (
                        <motion.div
                            key="dashboard" initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}
                        >
                            {/* Summary Cards */}
                            <StatCard title="Upcoming Milestones" value={dashboardData.milestones.filter(m => m.status !== 'Completed').length} icon={Calendar} color="56, 189, 248" delay={0} />
                            <StatCard title="Open Tasks" value={projectBoard?.columns?.inProgress?.items?.length || 0} icon={Briefcase} color="249, 115, 22" delay={0.1} />
                            <StatCard title="Due Invoices" value={`$${pendingInvoicesTotal.toLocaleString()}`} icon={DollarSign} color="239, 68, 68" delay={0.2} />

                            {/* Milestones Widget */}
                            <GlassCard style={{ gridColumn: 'span 2' }}>
                                <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px', marginBottom: '15px' }}>🚀 Project Milestones</h3>
                                {dashboardData.milestones.map(m => (
                                    <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', marginBottom: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                                        <div>
                                            <p style={{ margin: 0, fontWeight: 'bold', color: '#fff' }}>{m.title}</p>
                                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>Target: {m.date}</p>
                                        </div>
                                        <span style={{
                                            padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold',
                                            background: m.status === 'Completed' ? 'rgba(34, 197, 94, 0.2)' : m.status === 'Upcoming' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(249, 115, 22, 0.2)',
                                            color: m.status === 'Completed' ? '#4ade80' : m.status === 'Upcoming' ? '#60a5fa' : '#fb923c'
                                        }}>{m.status}</span>
                                    </div>
                                ))}
                            </GlassCard>

                            {/* Notifications Widget */}
                            <GlassCard>
                                <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px', marginBottom: '15px' }}>🔔 Recent Alerts</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {dashboardData.notifications.map(n => (
                                        <div key={n.id} style={{ display: 'flex', gap: '10px', padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: n.type === 'warning' ? '#f59e0b' : '#3b82f6', marginTop: '6px' }}></div>
                                            <div>
                                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#e2e8f0' }}>{n.text}</p>
                                                <p style={{ margin: 0, fontSize: '0.7rem', color: '#64748b' }}>{n.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </GlassCard>
                        </motion.div>
                    )}

                    {activeTab === 'projects' && (
                        <motion.div key="projects" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div style={{ marginBottom: '20px', display: 'flex', gap: '15px' }}>
                                {['Jira', 'GitHub', 'Slack'].map(tool => (
                                    <span key={tool} style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }}></span>
                                        {tool} Synced
                                    </span>
                                ))}
                            </div>
                            <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px' }}>
                                {projectBoard && Object.values(projectBoard.columns).map(col => (
                                    <KanbanColumn key={col.id} title={col.title} items={col.items}
                                        color={col.id === 'todo' ? '#94a3b8' : col.id === 'inProgress' ? '#3b82f6' : col.id === 'qa' ? '#f59e0b' : '#22c55e'} />
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'documents' && (
                        <motion.div key="documents" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <GlassCard>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                                    {documents.map(doc => (
                                        <div key={doc.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                                            <FileText size={40} color={doc.access === 'Restricted' ? '#ef4444' : '#3b82f6'} style={{ marginBottom: '15px' }} />
                                            <h4 style={{ color: '#e2e8f0', fontSize: '0.9rem', marginBottom: '5px', wordBreak: 'break-all' }}>{doc.name}</h4>
                                            <p style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{doc.type} • {doc.size}</p>
                                            <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: '#cbd5e1' }}>{doc.access}</span>
                                                <button style={{ background: 'none', border: 'none', color: '#D4AF37', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}>Download</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </GlassCard>
                        </motion.div>
                    )}

                    {activeTab === 'assets' && (
                        <motion.div key="assets" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <GlassCard>
                                <table style={{ width: '100%', borderCollapse: 'collapse', color: '#cbd5e1' }}>
                                    <thead style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                        <tr>
                                            <th style={{ padding: '15px', textAlign: 'left' }}>Asset Name</th>
                                            <th style={{ padding: '15px', textAlign: 'left' }}>Type</th>
                                            <th style={{ padding: '15px', textAlign: 'left' }}>Value / Details</th>
                                            <th style={{ padding: '15px', textAlign: 'left' }}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {assets.map(asset => (
                                            <tr key={asset.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <td style={{ padding: '15px', fontWeight: '500', color: '#fff' }}>{asset.name}</td>
                                                <td style={{ padding: '15px' }}>{asset.type}</td>
                                                <td style={{ padding: '15px', fontFamily: 'monospace' }}>
                                                    {asset.sensitivity === 'High' ? '••••••••••••••••' : asset.value}
                                                </td>
                                                <td style={{ padding: '15px' }}>
                                                    <span style={{ color: '#4ade80', fontSize: '0.8rem', border: '1px solid #4ade80', padding: '2px 8px', borderRadius: '12px' }}>Active</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </GlassCard>
                        </motion.div>
                    )}

                    {activeTab === 'support' && (
                        <motion.div key="support" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: '600px', margin: '0 auto' }}>
                            <GlassCard>
                                <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Submit Support Request</h2>
                                <form onSubmit={handleTicketSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <div>
                                        <label style={{ color: '#94a3b8', marginBottom: '8px', display: 'block' }}>Priority Level</label>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            {['Low', 'Medium', 'High'].map(p => (
                                                <button
                                                    key={p}
                                                    type="button"
                                                    onClick={() => setSupportTicket({ ...supportTicket, priority: p })}
                                                    style={{
                                                        flex: 1, padding: '10px', borderRadius: '8px', border: 'none',
                                                        background: supportTicket.priority === p ? (p === 'High' ? '#ef4444' : p === 'Medium' ? '#f59e0b' : '#3b82f6') : 'rgba(255,255,255,0.1)',
                                                        color: '#fff', cursor: 'pointer', fontWeight: 'bold'
                                                    }}
                                                >
                                                    {p}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ color: '#94a3b8', marginBottom: '8px', display: 'block' }}>Subject</label>
                                        <input
                                            type="text"
                                            value={supportTicket.subject}
                                            onChange={(e) => setSupportTicket({ ...supportTicket, subject: e.target.value })}
                                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', outline: 'none' }}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label style={{ color: '#94a3b8', marginBottom: '8px', display: 'block' }}>Message</label>
                                        <textarea
                                            value={supportTicket.message}
                                            onChange={(e) => setSupportTicket({ ...supportTicket, message: e.target.value })}
                                            style={{ width: '100%', minHeight: '120px', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', outline: 'none' }}
                                            required
                                        />
                                    </div>
                                    <ActionButton type="submit" variant="primary" icon={Send} style={{ width: '100%', justifyContent: 'center' }}>Submit Request</ActionButton>
                                </form>
                            </GlassCard>
                        </motion.div>
                    )}

                    {activeTab === 'settings' && (
                        <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                <GlassCard>
                                    <h3 style={{ marginBottom: '20px' }}>🔐 Security Settings</h3>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                        <div>
                                            <p style={{ fontWeight: 'bold', margin: 0 }}>Multi-Factor Authentication (MFA)</p>
                                            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>Require OTP for all logins</p>
                                        </div>
                                        <button onClick={handleMfaToggle} style={{
                                            padding: '8px 16px', borderRadius: '20px', border: 'none',
                                            background: mfaEnabled ? '#22c55e' : '#475569', color: '#fff', cursor: 'pointer', fontWeight: 'bold'
                                        }}>
                                            {mfaEnabled ? 'ENABLED' : 'DISABLED'}
                                        </button>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', color: '#cbd5e1' }}>IP Whitelist (comma separated)</label>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <input
                                                type="text" placeholder="e.g. 192.168.1.1, 10.0.0.5"
                                                value={ipWhitelist} onChange={(e) => setIpWhitelist(e.target.value)}
                                                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
                                            />
                                            <ActionButton onClick={handleIpUpdate} variant="primary">Save</ActionButton>
                                        </div>
                                    </div>
                                </GlassCard>

                                <GlassCard>
                                    <h3 style={{ marginBottom: '20px' }}>🔗 Integration Manager</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                        {['Slack', 'Jira', 'GitHub', 'Stripe', 'Google Drive'].map(tool => (
                                            <div key={tool} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                                                <div style={{ fontWeight: '500', color: '#fff' }}>{tool}</div>
                                                <button
                                                    onClick={() => alert(`${tool} connection settings would open here.`)}
                                                    style={{
                                                        padding: '6px 12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)',
                                                        background: 'transparent', color: '#cbd5e1', cursor: 'pointer', fontSize: '0.8rem'
                                                    }}
                                                >
                                                    Configure
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </GlassCard>

                                <GlassCard style={{ gridColumn: 'span 2' }}>
                                    <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <MessageSquare size={20} color="#D4AF37" /> Feedback Loop (NPS)
                                    </h3>
                                    <div style={{ textAlign: 'center', padding: '20px' }}>
                                        <p style={{ color: '#cbd5e1', marginBottom: '20px' }}>How likely are you to recommend GoldTech to a friend or colleague?</p>
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(score => (
                                                <button
                                                    key={score}
                                                    onClick={async () => {
                                                        await AdminService.submitFeedback({ score, client: clientName });
                                                        alert(`Thank you for rating us ${score}/10!`);
                                                    }}
                                                    style={{
                                                        width: '40px', height: '40px', borderRadius: '50%',
                                                        border: '1px solid #475569', background: 'rgba(255,255,255,0.05)',
                                                        color: '#fff', cursor: 'pointer', fontWeight: 'bold',
                                                        transition: 'all 0.2s'
                                                    }}
                                                    onMouseOver={(e) => { e.target.style.background = '#D4AF37'; e.target.style.color = '#000'; }}
                                                    onMouseOut={(e) => { e.target.style.background = 'rgba(255,255,255,0.05)'; e.target.style.color = '#fff'; }}
                                                >
                                                    {score}
                                                </button>
                                            ))}
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '400px', margin: '0 auto', color: '#94a3b8', fontSize: '0.8rem' }}>
                                            <span>Not Likely</span>
                                            <span>Extremely Likely</span>
                                        </div>
                                    </div>
                                </GlassCard>

                                <GlassCard style={{ gridColumn: 'span 2' }}>
                                    <h3 style={{ marginBottom: '20px' }}>📜 Audit Logs</h3>
                                    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                        {auditLog.map(log => (
                                            <div key={log.id} style={{ fontSize: '0.85rem', padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <p style={{ margin: '0 0 4px 0', color: '#e2e8f0' }}>{log.action}</p>
                                                <p style={{ margin: 0, color: '#64748b', fontSize: '0.75rem' }}>{log.user} • {log.ip} • {log.time}</p>
                                            </div>
                                        ))}
                                    </div>
                                </GlassCard>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'invoices' && (
                        <motion.div key="invoices" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            {/* Reusing existing invoice logic but wrapped for consistency */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {invoices.map(inv => (
                                    <GlassCard key={inv.id}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <h3 style={{ margin: 0, color: '#e2e8f0' }}>Invoice #{inv.id}</h3>
                                                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Date: {inv.date} • Due: {inv.dueDate}</p>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#D4AF37', display: 'block' }}>${inv.total.toLocaleString()}</span>
                                                <span style={{ fontSize: '0.8rem', color: inv.status === 'Paid' ? '#4ade80' : '#fb923c' }}>{inv.status}</span>
                                            </div>
                                        </div>
                                    </GlassCard>
                                ))}
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
};

export default ClientPortal;
