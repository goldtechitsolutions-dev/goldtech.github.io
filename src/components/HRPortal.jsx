import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Briefcase, FileText, LayoutDashboard, LogOut, CheckCircle, XCircle,
    Calendar, DollarSign, Clock, UserPlus, Shield, Medal, ArrowRight, Plus,
    Monitor, Link as LinkIcon, BarChart2, MessageSquare, Search, Layers
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import logo from '../assets/logo-transparent.png';
import AdminService from '../services/adminService';

// --- Antigravity UI Components ---

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

const ActionButton = ({ onClick, children, variant = 'primary', icon: Icon }) => {
    const baseStyle = {
        padding: '10px 20px',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'all 0.3s ease',
        fontSize: '0.9rem'
    };

    const styles = {
        primary: { background: 'linear-gradient(135deg, #D4AF37 0%, #F2D06B 100%)', color: '#0f172a' },
        danger: { background: 'rgba(220, 38, 38, 0.2)', color: '#fca5a5', border: '1px solid rgba(220, 38, 38, 0.5)' },
        success: { background: 'rgba(22, 163, 74, 0.2)', color: '#86efac', border: '1px solid rgba(22, 163, 74, 0.5)' },
        ghost: { background: 'transparent', color: '#94a3b8' }
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            style={{ ...baseStyle, ...styles[variant] }}
        >
            {Icon && <Icon size={16} />}
            {children}
        </motion.button>
    );
};

const HRPortal = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');

    // Data State
    const [employees, setEmployees] = useState([]);
    const [applications, setApplications] = useState([]);
    const [leaves, setLeaves] = useState([]);
    const [payroll, setPayroll] = useState([]);
    const [orgChart, setOrgChart] = useState([]);
    const [securityHealth, setSecurityHealth] = useState([]);
    const [learning, setLearning] = useState([]);

    // New HR Modules State
    const [jobs, setJobs] = useState([]);
    const [showJobForm, setShowJobForm] = useState(false);
    const [newJob, setNewJob] = useState({ title: '', department: '', location: '', type: 'Full-time', experience: '', description: '', skills: '' });
    const [candidates, setCandidates] = useState([]);
    const [recruitmentMetrics, setRecruitmentMetrics] = useState(null);
    const [onboarding, setOnboarding] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [assets, setAssets] = useState([]);
    const [surveys, setSurveys] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Leave Form State
    const [showLeaveForm, setShowLeaveForm] = useState(false);
    const [newLeave, setNewLeave] = useState({
        name: 'Sarah HR', // Defaulting to current user for demo
        type: 'Sick Leave',
        startDate: '',
        endDate: '',
        reason: ''
    });

    useEffect(() => {
        refreshData();
    }, []);

    const refreshData = async () => {
        if (isRefreshing) return;
        setIsRefreshing(true);
        try {
            const [
                usrs, apps, lvrs, pay, org, sec, lrn, jbs, onb, docs, asts, svys
            ] = await Promise.all([
                AdminService.getUsers(),
                AdminService.getApplications(),
                AdminService.getLeaveRequests(),
                AdminService.getPayrollStats(),
                AdminService.getOrgChart ? AdminService.getOrgChart() : [],
                AdminService.getSecurityHealth ? AdminService.getSecurityHealth() : [],
                AdminService.getLearningProgress ? AdminService.getLearningProgress() : [],
                AdminService.getJobs(),
                AdminService.getOnboarding(),
                AdminService.getDocuments(),
                AdminService.getAssets ? AdminService.getAssets() : [],
                AdminService.getSurveys ? AdminService.getSurveys() : []
            ]);

            setEmployees(usrs || []);
            setApplications(apps || []);
            setLeaves(lvrs || []);
            setPayroll(pay || []);
            setOrgChart(org || []);
            setSecurityHealth(sec || []);
            setLearning(lrn || []);
            setJobs(jbs || []);
            setCandidates(apps || []); // Applications and candidates are the same data
            setOnboarding(onb || []);
            setDocuments(docs || []);
            setAssets(asts || []);
            setSurveys(svys || []);

            // Calculate recruitment metrics locally to save API calls
            if (apps && jbs) {
                const totalCandidates = apps.length;
                const openPositions = jbs.filter(j => j.status === 'Active').length;
                const hiredCount = apps.filter(c => c.stage === 'hired').length;
                const rejectedCount = apps.filter(c => c.stage === 'rejected').length;
                const interviewCount = apps.filter(c => c.stage === 'Interview scheduled' || c.stage === 'interview(waiting / completed)').length;

                setRecruitmentMetrics({
                    totalCandidates,
                    openPositions,
                    hiredCount,
                    rejectedCount,
                    interviewCount,
                    timeToHire: '18 Days'
                });
            }
        } catch (error) {
            console.error("HRPortal: Error refreshing data", error);
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleLogout = () => {
        navigate('/');
    };

    const handleLeaveAction = async (leave, status) => {
        const updatedLeave = { ...leave, status };
        await AdminService.updateLeaveRequest(updatedLeave);
        await refreshData();
    };

    const handleLeaveSubmit = async (e) => {
        e.preventDefault();
        if (!newLeave.startDate || !newLeave.endDate || !newLeave.reason) return;

        const days = Math.floor((new Date(newLeave.endDate) - new Date(newLeave.startDate)) / (1000 * 60 * 60 * 24)) + 1;

        await AdminService.addLeaveRequest({
            ...newLeave,
            days: days > 0 ? days : 1
        });

        setShowLeaveForm(false);
        setNewLeave({ ...newLeave, startDate: '', endDate: '', reason: '' });
        await refreshData();
    };

    const handleJobSubmit = async (e) => {
        e.preventDefault();
        if (!newJob.title || !newJob.department) return;

        await AdminService.addJob(newJob);
        setShowJobForm(false);
        setNewJob({ title: '', department: '', location: '', type: 'Full-time', experience: '', description: '', skills: '' });
        await refreshData();
    };

    const StatCard = ({ title, value, icon: Icon, color, delay }) => (
        <FloatingWidget delay={delay}>
            <GlassCard style={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ background: `rgba(${color}, 0.2)`, padding: '12px', borderRadius: '50%', marginBottom: '10px' }}>
                    <Icon size={24} color={`rgb(${color})`} />
                </div>
                <h3 style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '5px' }}>{title}</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>{value}</p>
            </GlassCard>
        </FloatingWidget>
    );

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

    const handleCandidateMove = async (candidateId, newStage) => {
        await AdminService.updateCandidateStatus(candidateId, newStage);
        await refreshData();
    };

    const getNextStage = (current) => {
        const stages = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired'];
        const idx = stages.indexOf(current);
        return idx < stages.length - 1 ? stages[idx + 1] : current;
    };

    const getPrevStage = (current) => {
        const stages = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired'];
        const idx = stages.indexOf(current);
        return idx > 0 ? stages[idx - 1] : current;
    };

    const renderKanbanColumn = (stage, title, color) => (
        <GlassCard style={{ minWidth: '300px', flexShrink: 0, borderTop: `4px solid ${color}` }}>
            <h4 style={{ margin: '0 0 15px 0', color: color }}>{title} ({candidates.filter(c => c.stage === stage).length})</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {candidates.filter(c => c.stage === stage).map(candidate => (
                    <div key={candidate.id} style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px', borderLeft: `3px solid ${color}` }}>
                        <h5 style={{ margin: '0 0 5px 0', fontSize: '1rem' }}>{candidate.name}</h5>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>{candidate.role}</p>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Score: {candidate.score}%</span>
                            <div style={{ display: 'flex', gap: '5px' }}>
                                {stage !== 'Applied' && (
                                    <button
                                        onClick={() => handleCandidateMove(candidate.id, getPrevStage(stage))}
                                        style={{ cursor: 'pointer', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: '#fff', borderRadius: '4px', padding: '2px 6px' }}
                                        title="Move Back"
                                    >←</button>
                                )}
                                {stage !== 'Hired' && (
                                    <button
                                        onClick={() => handleCandidateMove(candidate.id, getNextStage(stage))}
                                        style={{ cursor: 'pointer', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '4px', padding: '2px 6px' }}
                                        title="Move Forward"
                                    >→</button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </GlassCard>
    );

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#0f172a', fontFamily: "'Outfit', sans-serif" }}>
            {/* Sidebar with Glass Effect */}
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

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                    <button onClick={() => setActiveTab('overview')} style={navLinkStyle(activeTab === 'overview')}>
                        <LayoutDashboard size={18} /> Dashboard
                    </button>
                    <button onClick={() => setActiveTab('employees')} style={navLinkStyle(activeTab === 'employees')}>
                        <Users size={18} /> Workforce Directory
                    </button>
                    <button onClick={() => setActiveTab('leaves')} style={navLinkStyle(activeTab === 'leaves')}>
                        <Calendar size={18} /> Time Off
                    </button>
                    <button onClick={() => setActiveTab('payroll')} style={navLinkStyle(activeTab === 'payroll')}>
                        <DollarSign size={18} /> Payroll
                    </button>
                    <button onClick={() => setActiveTab('orgchart')} style={navLinkStyle(activeTab === 'orgchart')}>
                        <Briefcase size={18} /> Org Chart
                    </button>
                    <button onClick={() => setActiveTab('security')} style={navLinkStyle(activeTab === 'security')}>
                        <Shield size={18} /> Security
                    </button>
                    <button onClick={() => setActiveTab('learning')} style={navLinkStyle(activeTab === 'learning')}>
                        <Medal size={18} /> Learning
                    </button>
                    <div style={{ margin: '10px 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}></div>
                    <button onClick={() => setActiveTab('recruitment')} style={navLinkStyle(activeTab === 'recruitment')}>
                        <UserPlus size={18} /> Recruitment
                    </button>
                    <button onClick={() => setActiveTab('onboarding')} style={navLinkStyle(activeTab === 'onboarding')}>
                        <Layers size={18} /> Onboarding
                    </button>
                    <button onClick={() => setActiveTab('assets')} style={navLinkStyle(activeTab === 'assets')}>
                        <Monitor size={18} /> IT Assets
                    </button>
                    <button onClick={() => setActiveTab('documents')} style={navLinkStyle(activeTab === 'documents')}>
                        <FileText size={18} /> Documents
                    </button>
                    <button onClick={() => setActiveTab('surveys')} style={navLinkStyle(activeTab === 'surveys')}>
                        <MessageSquare size={18} /> Surveys
                    </button>
                    <button onClick={() => setActiveTab('integrations')} style={navLinkStyle(activeTab === 'integrations')}>
                        <LinkIcon size={18} /> Integrations
                    </button>
                </nav>

                <div style={{ marginTop: 'auto' }}>
                    <button onClick={handleLogout} style={{ ...navLinkStyle(false), color: '#ef4444', justifyContent: 'flex-start' }}>
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div style={{ flex: 1, marginLeft: '280px', padding: '40px', background: 'radial-gradient(circle at top right, #1e293b 0%, #0f172a 100%)', minHeight: '100vh' }}>
                <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', color: '#fff', fontWeight: '700', marginBottom: '5px' }}>
                            {activeTab === 'overview' && 'GoldHR'}
                            {activeTab === 'employees' && 'Workforce Directory'}
                            {activeTab === 'leaves' && 'Leave Management'}
                            {activeTab === 'orgchart' && 'Project Organization'}
                            {activeTab === 'security' && 'Security Health'}
                            {activeTab === 'learning' && 'Continuous Learning'}
                            {activeTab === 'recruitment' && 'Talent Acquisition'}
                            {activeTab === 'onboarding' && 'Onboarding Journeys'}
                            {activeTab === 'assets' && 'IT Asset Management'}
                            {activeTab === 'documents' && 'Document Management'}
                            {activeTab === 'surveys' && 'Employee Feedback'}
                            {activeTab === 'integrations' && 'Integrations'}
                            {activeTab === 'payroll' && 'Payroll Management'}
                        </h1>
                        <p style={{ color: '#94a3b8' }}>Real-time insights for the modern workforce.</p>
                    </div>
                    <GlassCard style={{ padding: '10px 20px', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#D4AF37' }}></div>
                        <span style={{ fontWeight: '600' }}>Sarah HR</span>
                    </GlassCard>
                </header>

                <AnimatePresence mode='wait'>
                    {activeTab === 'overview' && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', gridTemplateRows: 'auto auto' }}
                        >
                            <StatCard title="Total Employees" value={employees.length} icon={Users} color="212, 175, 55" delay={0} />
                            <StatCard title="Pending Approvals" value={leaves.filter(l => l.status === 'Pending').length + applications.filter(a => a.status === 'Pending').length} icon={Clock} color="249, 115, 22" delay={0.1} />
                            <StatCard title="Open Positions" value={applications.filter(a => a.status === 'Pending').length} icon={Briefcase} color="56, 189, 248" delay={0.2} />
                            <StatCard title="Monthly Payroll" value={`$${(payroll[0]?.total || 0).toLocaleString()}`} icon={DollarSign} color="34, 197, 94" delay={0.3} />

                            {/* Action Dashboard (Antigravity) */}
                            <div style={{ gridColumn: 'span 2', marginTop: '20px' }}>
                                <GlassCard>
                                    <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px', marginBottom: '15px' }}>🚀 Action Required</h3>
                                    {leaves.filter(l => l.status === 'Pending').length === 0 ? (
                                        <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>All caught up! No pending actions.</p>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                            {leaves.filter(l => l.status === 'Pending').slice(0, 3).map(leave => (
                                                <div key={leave.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px' }}>
                                                    <div>
                                                        <h4 style={{ margin: 0, color: '#e2e8f0' }}>{leave.name}</h4>
                                                        <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem' }}>Requested {leave.type} ({leave.days} days)</p>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '10px' }}>
                                                        <ActionButton variant="success" icon={CheckCircle} onClick={() => handleLeaveAction(leave, 'Approved')}>Approve</ActionButton>
                                                        <ActionButton variant="danger" icon={XCircle} onClick={() => handleLeaveAction(leave, 'Rejected')}>Reject</ActionButton>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </GlassCard>
                            </div>

                            <div style={{ gridColumn: 'span 2', marginTop: '20px' }}>
                                <GlassCard>
                                    <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px', marginBottom: '15px' }}>📊 Recruitment Pipeline</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {applications.slice(0, 3).map(app => (
                                            <div key={app.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <span style={{ color: '#e2e8f0' }}>{app.name}</span>
                                                <span style={{ color: '#94a3b8' }}>{app.role}</span>
                                                <span style={{ color: '#D4AF37', fontWeight: 'bold' }}>{app.status}</span>
                                            </div>
                                        ))}
                                    </div>
                                </GlassCard>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'orgchart' && (
                        <motion.div
                            key="orgchart"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}
                        >
                            {orgChart.map((emp, i) => (
                                <GlassCard key={emp.id} delay={i * 0.1} style={{ position: 'relative', overflow: 'hidden' }}>
                                    <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: (emp.project && emp.project.includes('Gold')) ? '#D4AF37' : '#3b82f6' }}></div>
                                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                        <img src={emp.avatar} alt={emp.name} style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.2)' }} />
                                        <div>
                                            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{emp.name}</h3>
                                            <p style={{ margin: '5px 0', color: '#94a3b8', fontSize: '0.9rem' }}>{emp.role}</p>
                                            <span style={{
                                                fontSize: '0.75rem', padding: '4px 8px', borderRadius: '4px',
                                                background: (emp.project && emp.project.includes('Gold')) ? 'rgba(212, 175, 55, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                                                color: (emp.project && emp.project.includes('Gold')) ? '#fcd34d' : '#60a5fa'
                                            }}>
                                                {emp.project}
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '0.85rem', color: '#64748b' }}>
                                        Report to: <strong style={{ color: '#cbd5e1' }}>{emp.manager}</strong>
                                    </div>
                                </GlassCard>
                            ))}
                        </motion.div>
                    )}

                    {activeTab === 'security' && (
                        <motion.div
                            key="security"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <GlassCard>
                                <table style={{ width: '100%', borderCollapse: 'collapse', color: '#cbd5e1' }}>
                                    <thead>
                                        <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                            <th style={{ padding: '15px' }}>Employee</th>
                                            <th style={{ padding: '15px' }}>2FA Status</th>
                                            <th style={{ padding: '15px' }}>Password Strength</th>
                                            <th style={{ padding: '15px' }}>Last Audit</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {securityHealth.map(sec => (
                                            <tr key={sec.userId} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <td style={{ padding: '15px', fontWeight: 'bold' }}>{sec.name}</td>
                                                <td style={{ padding: '15px' }}>
                                                    {sec.twoFactor ?
                                                        <span style={{ color: '#86efac', display: 'flex', alignItems: 'center', gap: '5px' }}><CheckCircle size={14} /> Enabled</span> :
                                                        <span style={{ color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '5px' }}><XCircle size={14} /> Disabled</span>
                                                    }
                                                </td>
                                                <td style={{ padding: '15px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <div style={{ width: '60px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                                                            <div style={{
                                                                width: sec.passwordStrength === 'Strong' ? '100%' : sec.passwordStrength === 'Medium' ? '60%' : '30%',
                                                                height: '100%',
                                                                background: sec.passwordStrength === 'Strong' ? '#22c55e' : sec.passwordStrength === 'Medium' ? '#eab308' : '#ef4444'
                                                            }}></div>
                                                        </div>
                                                        {sec.passwordStrength}
                                                    </div>
                                                </td>
                                                <td style={{ padding: '15px', color: '#94a3b8' }}>{sec.lastAudit}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </GlassCard>
                        </motion.div>
                    )}

                    {activeTab === 'learning' && (
                        <motion.div
                            key="learning"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}
                        >
                            {learning.map((learn, i) => (
                                <GlassCard key={i} delay={i * 0.1}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                        <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{learn.module}</h3>
                                        <span style={{
                                            background: learn.status === 'Completed' ? '#16a34a' : '#ca8a04',
                                            padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold'
                                        }}>
                                            {learn.status}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                                        <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${learn.progress}%` }}
                                                transition={{ duration: 1, delay: 0.5 }}
                                                style={{ height: '100%', background: '#D4AF37' }}
                                            />
                                        </div>
                                        <span style={{ fontWeight: 'bold' }}>{learn.progress}%</span>
                                    </div>
                                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>Assigned to: <strong style={{ color: '#fff' }}>{learn.name}</strong></p>
                                </GlassCard>
                            ))}
                        </motion.div>
                    )}

                    {/* Placeholder for standard tabs (Leaves) - reusing GlassCard styles */}
                    {activeTab === 'leaves' && (
                        <motion.div
                            key="leaves"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <ActionButton onClick={() => setShowLeaveForm(!showLeaveForm)} icon={showLeaveForm ? XCircle : Plus}>
                                    {showLeaveForm ? 'Cancel Request' : 'New Leave Request'}
                                </ActionButton>
                            </div>

                            {showLeaveForm && (
                                <GlassCard>
                                    <form onSubmit={handleLeaveSubmit} style={{ display: 'grid', gap: '15px' }}>
                                        <h3 style={{ margin: 0, marginBottom: '10px' }}>Submit Leave Request</h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                            <input
                                                type="text"
                                                placeholder="Employee Name"
                                                value={newLeave.name}
                                                onChange={(e) => setNewLeave({ ...newLeave, name: e.target.value })}
                                                style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
                                                required
                                            />
                                            <select
                                                value={newLeave.type}
                                                onChange={(e) => setNewLeave({ ...newLeave, type: e.target.value })}
                                                style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
                                            >
                                                <option value="Sick Leave">Sick Leave</option>
                                                <option value="Casual Leave">Casual Leave</option>
                                                <option value="Earned Leave">Earned Leave</option>
                                            </select>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                            <input
                                                type="date"
                                                value={newLeave.startDate}
                                                onChange={(e) => setNewLeave({ ...newLeave, startDate: e.target.value })}
                                                style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
                                                required
                                            />
                                            <input
                                                type="date"
                                                value={newLeave.endDate}
                                                onChange={(e) => setNewLeave({ ...newLeave, endDate: e.target.value })}
                                                style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
                                                required
                                            />
                                        </div>
                                        <textarea
                                            placeholder="Reason for leave..."
                                            value={newLeave.reason}
                                            onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
                                            style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', minHeight: '80px' }}
                                            required
                                        />
                                        <ActionButton type="submit" variant="primary" icon={CheckCircle}>Submit Request</ActionButton>
                                    </form>
                                </GlassCard>
                            )}

                            {leaves.map(leave => (
                                <GlassCard key={leave.id}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <h3 style={{ margin: 0, color: '#e2e8f0' }}>{leave.name}</h3>
                                            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{leave.type} • {leave.days} Days</p>
                                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                                <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>📅 {leave.startDate} - {leave.endDate}</span>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '15px' }}>
                                            <span style={{
                                                padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold',
                                                background: leave.status === 'Approved' ? 'rgba(34, 197, 94, 0.2)' : leave.status === 'Pending' ? 'rgba(234, 179, 8, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                                color: leave.status === 'Approved' ? '#86efac' : leave.status === 'Pending' ? '#fde047' : '#fca5a5'
                                            }}>{leave.status}</span>

                                            {leave.status === 'Pending' && (
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    <ActionButton variant="success" icon={CheckCircle} onClick={() => handleLeaveAction(leave, 'Approved')}>Approve</ActionButton>
                                                    <ActionButton variant="danger" icon={XCircle} onClick={() => handleLeaveAction(leave, 'Rejected')}>Reject</ActionButton>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </GlassCard>
                            ))}
                        </motion.div>
                    )}

                    {activeTab === 'recruitment' && (
                        <motion.div
                            key="recruitment"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                                <ActionButton onClick={() => setShowJobForm(!showJobForm)} icon={showJobForm ? XCircle : Plus}>
                                    {showJobForm ? 'Cancel' : 'Post New Job'}
                                </ActionButton>
                            </div>

                            {showJobForm && (
                                <GlassCard style={{ marginBottom: '20px' }}>
                                    <form onSubmit={handleJobSubmit} style={{ display: 'grid', gap: '15px' }}>
                                        <h3 style={{ margin: 0, marginBottom: '10px' }}>Post New Job Opening</h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                            <input
                                                type="text"
                                                placeholder="Job Title"
                                                value={newJob.title}
                                                onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                                                style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
                                                required
                                            />
                                            <select
                                                value={newJob.department}
                                                onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
                                                style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
                                                required
                                            >
                                                <option style={{ color: 'black' }} value="" disabled>Select Department</option>
                                                <option style={{ color: 'black' }} value="Engineering">Engineering</option>
                                                <option style={{ color: 'black' }} value="Product">Product</option>
                                                <option style={{ color: 'black' }} value="Design">Design</option>
                                                <option style={{ color: 'black' }} value="Marketing">Marketing</option>
                                                <option style={{ color: 'black' }} value="Sales">Sales</option>
                                                <option style={{ color: 'black' }} value="HR">HR</option>
                                                <option style={{ color: 'black' }} value="Finance">Finance</option>
                                            </select>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                            <input
                                                type="text"
                                                placeholder="Location (e.g. Remote, New York)"
                                                value={newJob.location}
                                                onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                                                style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
                                                required
                                            />
                                            <div style={{ display: 'flex', gap: '15px' }}>
                                                <select
                                                    value={newJob.type}
                                                    onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                                                    style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
                                                >
                                                    <option style={{ color: 'black' }} value="Full-time">Full-time</option>
                                                    <option style={{ color: 'black' }} value="Part-time">Part-time</option>
                                                    <option style={{ color: 'black' }} value="Contract">Contract</option>
                                                    <option style={{ color: 'black' }} value="Internship">Internship</option>
                                                </select>
                                                <input
                                                    type="text"
                                                    placeholder="Experience (e.g. 3+ Years)"
                                                    value={newJob.experience}
                                                    onChange={(e) => setNewJob({ ...newJob, experience: e.target.value })}
                                                    style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <textarea
                                                placeholder="Job Description"
                                                value={newJob.description}
                                                onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', minHeight: '80px' }}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="Required Skills (comma separated, e.g. React, Node.js, Supabase)"
                                                value={newJob.skills}
                                                onChange={(e) => setNewJob({ ...newJob, skills: e.target.value })}
                                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
                                                required
                                            />
                                        </div>
                                        <ActionButton type="submit" variant="primary" icon={CheckCircle}>Publish Job</ActionButton>
                                    </form>
                                </GlassCard>
                            )}

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                                {jobs.map(job => (
                                    <GlassCard key={job.id}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                            <h3 style={{ margin: 0 }}>{job.title}</h3>
                                            <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>{job.type}</span>
                                        </div>
                                        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{job.department} • {job.location}</p>
                                        <div style={{ margin: '15px 0', display: 'flex', gap: '15px' }}>
                                            <div style={{ textAlign: 'center' }}>
                                                <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: 'bold' }}>{job.applicants}</span>
                                                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Applicants</span>
                                            </div>
                                            <div style={{ textAlign: 'center' }}>
                                                <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: 'bold', color: job.status === 'Active' ? '#4ade80' : '#fbbf24' }}>{job.status}</span>
                                                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Status</span>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Posted: {job.postedDate}</span>
                                            <button style={{ background: 'transparent', border: 'none', color: '#D4AF37', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                View Details <ArrowRight size={14} />
                                            </button>
                                        </div>
                                    </GlassCard>
                                ))}
                            </div>

                            {/* Recruitment Metrics & Kanban */}
                            {recruitmentMetrics && (
                                <div style={{ marginTop: '40px' }}>
                                    <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>Recruitment Overview</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
                                        <GlassCard>
                                            <h4 style={{ margin: '0 0 5px 0', color: '#94a3b8', fontSize: '0.9rem' }}>Total Candidates</h4>
                                            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{recruitmentMetrics.totalCandidates}</div>
                                        </GlassCard>
                                        <GlassCard>
                                            <h4 style={{ margin: '0 0 5px 0', color: '#94a3b8', fontSize: '0.9rem' }}>Active Openings</h4>
                                            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{recruitmentMetrics.openPositions}</div>
                                        </GlassCard>
                                        <GlassCard>
                                            <h4 style={{ margin: '0 0 5px 0', color: '#94a3b8', fontSize: '0.9rem' }}>Offers Sent</h4>
                                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fde047' }}>{recruitmentMetrics.offerCount}</div>
                                        </GlassCard>
                                        <GlassCard>
                                            <h4 style={{ margin: '0 0 5px 0', color: '#94a3b8', fontSize: '0.9rem' }}>Time to Hire (Avg)</h4>
                                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#86efac' }}>{recruitmentMetrics.timeToHire}</div>
                                        </GlassCard>
                                    </div>

                                    <h3 style={{ marginBottom: '20px' }}>Candidate Pipeline</h3>
                                    <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px' }}>
                                        {renderKanbanColumn('Applied', 'Applied', '#94a3b8')}
                                        {renderKanbanColumn('Screening', 'Screening', '#fde047')}
                                        {renderKanbanColumn('Interview', 'Interview', '#60a5fa')}
                                        {renderKanbanColumn('Offer', 'Offer', '#c084fc')}
                                        {renderKanbanColumn('Hired', 'Hired', '#4ade80')}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'onboarding' && (
                        <motion.div
                            key="onboarding"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <GlassCard>
                                <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px', marginBottom: '15px' }}>Onboarding Progress</h3>
                                {onboarding.map(ob => (
                                    <div key={ob.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ margin: 0, marginBottom: '5px' }}>{ob.name}</h4>
                                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>Current Step: {ob.step}</p>
                                        </div>
                                        <div style={{ flex: 1, maxWidth: '300px', marginRight: '20px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.8rem' }}>
                                                <span>Progress</span>
                                                <span>{ob.progress}%</span>
                                            </div>
                                            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                                                <div style={{ width: `${ob.progress}%`, height: '100%', background: '#38bdf8' }}></div>
                                            </div>
                                        </div>
                                        <span style={{ padding: '6px 12px', borderRadius: '20px', background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', fontSize: '0.85rem' }}>
                                            {ob.status}
                                        </span>
                                    </div>
                                ))}
                            </GlassCard>
                        </motion.div>
                    )}

                    {activeTab === 'assets' && (
                        <motion.div
                            key="assets"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <GlassCard>
                                <table style={{ width: '100%', borderCollapse: 'collapse', color: '#cbd5e1' }}>
                                    <thead>
                                        <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                            <th style={{ padding: '15px' }}>Asset Name</th>
                                            <th style={{ padding: '15px' }}>Serial / ID</th>
                                            <th style={{ padding: '15px' }}>Category</th>
                                            <th style={{ padding: '15px' }}>Assigned To</th>
                                            <th style={{ padding: '15px' }}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {assets.map(asset => (
                                            <tr key={asset.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <td style={{ padding: '15px', fontWeight: '600' }}>{asset.name}</td>
                                                <td style={{ padding: '15px', fontFamily: 'monospace' }}>{asset.serial || 'N/A'}</td>
                                                <td style={{ padding: '15px' }}>{asset.category}</td>
                                                <td style={{ padding: '15px', color: asset.assignedTo ? '#fff' : '#64748b' }}>
                                                    {asset.assignedTo || 'Unassigned'}
                                                </td>
                                                <td style={{ padding: '15px' }}>
                                                    <span style={{
                                                        padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold',
                                                        background: asset.assignedTo ? 'rgba(34, 197, 94, 0.2)' : 'rgba(148, 163, 184, 0.2)',
                                                        color: asset.assignedTo ? '#86efac' : '#cbd5e1'
                                                    }}>
                                                        {asset.assignedTo ? 'In Use' : 'Available'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </GlassCard>
                        </motion.div>
                    )}

                    {activeTab === 'documents' && (
                        <motion.div
                            key="documents"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}
                        >
                            {documents.map(doc => (
                                <GlassCard key={doc.id} whileHover={{ scale: 1.02 }} style={{ cursor: 'pointer' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '10px' }}>
                                        <div style={{ width: '60px', height: '60px', background: 'rgba(212, 175, 55, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px', color: '#D4AF37' }}>
                                            <FileText size={32} />
                                        </div>
                                        <h4 style={{ margin: '0 0 5px 0' }}>{doc.name}</h4>
                                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>{doc.type} • {doc.size}</p>
                                        <div style={{ marginTop: '15px', fontSize: '0.75rem', color: '#64748b' }}>
                                            Uploaded {doc.date} by {doc.uploadedBy}
                                        </div>
                                    </div>
                                </GlassCard>
                            ))}
                            <GlassCard style={{ border: '2px dashed rgba(255,255,255,0.1)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                                    <Plus size={32} style={{ marginBottom: '10px' }} />
                                    <p style={{ margin: 0 }}>Upload Document</p>
                                </div>
                            </GlassCard>
                        </motion.div>
                    )}

                    {activeTab === 'surveys' && (
                        <motion.div
                            key="surveys"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                                {surveys.map(survey => (
                                    <GlassCard key={survey.id}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                            <h3 style={{ margin: 0 }}>{survey.title}</h3>
                                            <span style={{
                                                padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold',
                                                background: survey.status === 'Active' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(148, 163, 184, 0.2)',
                                                color: survey.status === 'Active' ? '#86efac' : '#cbd5e1'
                                            }}>{survey.status}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ margin: '0 0 5px 0', fontSize: '0.85rem', color: '#94a3b8' }}>Participation</p>
                                                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                                                    <div style={{ width: `${survey.participation}%`, height: '100%', background: '#D4AF37' }}></div>
                                                </div>
                                            </div>
                                            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{survey.participation}%</span>
                                        </div>
                                        {survey.score > 0 && (
                                            <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                                <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Avg Score: </span>
                                                <strong style={{ color: '#fff' }}>{survey.score} / 5.0</strong>
                                            </div>
                                        )}
                                    </GlassCard>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'integrations' && (
                        <motion.div
                            key="integrations"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                                {['LinkedIn Recruiter', 'Slack', 'Google Workspace', 'Checkr', 'QuickBooks'].map((tool, i) => (
                                    <GlassCard key={i}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                                            <div style={{ width: '50px', height: '50px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <LinkIcon size={24} />
                                            </div>
                                            <div>
                                                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{tool}</h3>
                                                <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>Connected</p>
                                            </div>
                                            <div style={{ marginLeft: 'auto', width: '10px', height: '10px', borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 10px #4ade80' }}></div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
                                            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Last Sync: 10 mins ago</span>
                                            <button style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', fontSize: '0.8rem' }}>Settings</button>
                                        </div>
                                    </GlassCard>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'payroll' && (
                        <motion.div
                            key="payroll"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <GlassCard>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <h3 style={{ margin: 0 }}>Payroll History</h3>
                                    <ActionButton icon={DollarSign}>Run Payroll</ActionButton>
                                </div>
                                <table style={{ width: '100%', borderCollapse: 'collapse', color: '#cbd5e1' }}>
                                    <thead>
                                        <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                            <th style={{ padding: '15px' }}>Month</th>
                                            <th style={{ padding: '15px' }}>Total Payout</th>
                                            <th style={{ padding: '15px' }}>Status</th>
                                            <th style={{ padding: '15px' }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payroll.map(p => (
                                            <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <td style={{ padding: '15px', fontWeight: 'bold' }}>{p.month}</td>
                                                <td style={{ padding: '15px' }}>${p.total.toLocaleString()}</td>
                                                <td style={{ padding: '15px' }}>
                                                    <span style={{
                                                        padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold',
                                                        background: p.status === 'Paid' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(234, 179, 8, 0.2)',
                                                        color: p.status === 'Paid' ? '#86efac' : '#fde047'
                                                    }}>{p.status}</span>
                                                </td>
                                                <td style={{ padding: '15px' }}>
                                                    <button style={{ background: 'transparent', border: 'none', color: '#38bdf8', cursor: 'pointer' }}>View Slip</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </GlassCard>
                        </motion.div>
                    )}
                </AnimatePresence >
            </div >
        </div >
    );
};

export default HRPortal;
