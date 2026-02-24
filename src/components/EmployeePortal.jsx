import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, CheckCircle, Calendar, DollarSign, Clock, Shield, Medal,
    List, User, LogOut, Plus, XCircle, Home, Briefcase, Share2, Code, MessageSquare, Gift, FileText, Video, Award
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

const EmployeePortal = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [currentUser, setCurrentUser] = useState(null);

    // Data State
    const [tasks, setTasks] = useState([]);
    const [leaves, setLeaves] = useState([]);
    const [wfhRequest, setWfhRequest] = useState([]);
    const [holidays, setHolidays] = useState([]);
    const [payrollHistory, setPayrollHistory] = useState([]);
    const [learning, setLearning] = useState([]); // User progress
    const [lmsCourses, setLmsCourses] = useState([]); // Catalog
    const [learningBudget, setLearningBudget] = useState(null);
    const [okrs, setOkrs] = useState([]);
    const [socialFeed, setSocialFeed] = useState([]);
    const [devTools, setDevTools] = useState({ jira: [], cloudCredentials: [] });
    const [referrals, setReferrals] = useState([]);

    // Leave Form State
    const [showLeaveForm, setShowLeaveForm] = useState(false);
    const [newLeave, setNewLeave] = useState({
        name: '',
        type: 'Sick Leave',
        startDate: '',
        endDate: '',
        reason: ''
    });

    useEffect(() => {
        const init = async () => {
            // Mock Login as "John Dev" (ID: 102)
            const mockUserId = 102;
            const users = await AdminService.getUsers();
            const user = users.find(u => u.id === mockUserId) || { name: 'John Dev', id: 102 };
            setCurrentUser(user);
            setNewLeave(prev => ({ ...prev, name: user.name }));

            await refreshData(mockUserId);
        };
        init();
    }, []);

    const refreshData = async (userId) => {
        const [
            tsks,
            allLv,
            wfh,
            hols,
            payroll,
            allLearn,
            lms,
            budget,
            okrList,
            social,
            tools,
            refList
        ] = await Promise.all([
            AdminService.getTasks(userId),
            AdminService.getLeaveRequests(),
            AdminService.getWorkFromHome(userId),
            AdminService.getHolidays(),
            AdminService.getPayrollHistory(userId),
            AdminService.getLearningProgress(),
            AdminService.getLMSCourses(),
            AdminService.getLearningBudget(userId),
            AdminService.getOKRs(userId),
            AdminService.getSocialFeed(),
            AdminService.getDevToolsData(),
            AdminService.getReferrals(userId)
        ]);

        setTasks(tsks || []);
        setLeaves((allLv || []).filter(l => l.name === 'John Dev'));
        setWfhRequest(wfh || []);
        setHolidays(hols || []);
        setPayrollHistory(payroll || []);
        setLearning((allLearn || []).filter(l => l.userId === userId));
        setLmsCourses(lms || []);
        setLearningBudget(budget);
        setOkrs(okrList || []);
        setSocialFeed(social || []);
        setDevTools(tools || { jira: [], cloudCredentials: [] });
        setReferrals(refList || []);
    };

    const handleLogout = () => {
        navigate('/');
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
        await refreshData(currentUser.id);
    };

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

    const StatCard = ({ title, value, icon: Icon, color, delay }) => (
        <FloatingWidget delay={delay}>
            <GlassCard style={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ background: `rgba(${color}, 0.2)`, padding: '12px', borderRadius: '50%', marginBottom: '10px' }}>
                    <Icon size={24} color={`rgb(${color})`} />
                </div>
                <h3 style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '5px' }}>{title}</h3>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff' }}>{value}</p>
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
                        <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.4rem', letterSpacing: '1px' }}>RES</span>
                    </div>
                </div>

                <div style={{ marginBottom: '30px', textAlign: 'center' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#D4AF37', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', color: '#0f172a' }}>
                        {currentUser?.name?.charAt(0) || 'U'}
                    </div>
                    <h3 style={{ color: '#fff', margin: 0 }}>{currentUser?.name || 'User'}</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>Frontend Engineer</p>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, overflowY: 'auto' }}>
                    <button onClick={() => setActiveTab('dashboard')} style={navLinkStyle(activeTab === 'dashboard')}>
                        <LayoutDashboard size={18} /> My Dashboard
                    </button>
                    <button onClick={() => setActiveTab('tasks')} style={navLinkStyle(activeTab === 'tasks')}>
                        <List size={18} /> My Tasks
                    </button>
                    <button onClick={() => setActiveTab('leaves')} style={navLinkStyle(activeTab === 'leaves')}>
                        <Calendar size={18} /> Time Off & WFH
                    </button>
                    <button onClick={() => setActiveTab('performance')} style={navLinkStyle(activeTab === 'performance')}>
                        <Briefcase size={18} /> Performance (OKRs)
                    </button>
                    <button onClick={() => setActiveTab('financials')} style={navLinkStyle(activeTab === 'financials')}>
                        <DollarSign size={18} /> Financials
                    </button>
                    <button onClick={() => setActiveTab('learning')} style={navLinkStyle(activeTab === 'learning')}>
                        <Medal size={18} /> L&D (LMS)
                    </button>
                    <button onClick={() => setActiveTab('social')} style={navLinkStyle(activeTab === 'social')}>
                        <MessageSquare size={18} /> Social & News
                    </button>
                    <button onClick={() => setActiveTab('devtools')} style={navLinkStyle(activeTab === 'devtools')}>
                        <Code size={18} /> Dev Tools
                    </button>
                    <button onClick={() => setActiveTab('referrals')} style={navLinkStyle(activeTab === 'referrals')}>
                        <Share2 size={18} /> Referrals
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
                        {activeTab === 'dashboard' && `Welcome back, ${currentUser?.name?.split(' ')[0]}! 👋`}
                        {activeTab === 'tasks' && 'My Tasks'}
                        {activeTab === 'leaves' && 'Time Off & Attendance'}
                        {activeTab === 'performance' && 'Performance & Goals'}
                        {activeTab === 'financials' && 'My Financials'}
                        {activeTab === 'learning' && 'Learning & Development'}
                        {activeTab === 'social' && 'Company Wall'}
                        {activeTab === 'devtools' && 'Developer Connect'}
                        {activeTab === 'referrals' && 'Referral Portal'}
                    </h1>
                    <p style={{ color: '#94a3b8' }}>Here's what's happening with you today.</p>
                </header>

                <AnimatePresence mode='wait'>
                    {activeTab === 'dashboard' && (
                        <motion.div
                            key="dashboard"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}
                        >
                            <StatCard title="Leave Balance" value="12 Days" icon={Calendar} color="34, 197, 94" delay={0} />
                            <StatCard title="Pending Tasks" value={tasks.filter(t => t.status !== 'Completed').length} icon={List} color="249, 115, 22" delay={0.1} />
                            <StatCard title="Next Payday" value="Nov 30" icon={DollarSign} color="212, 175, 55" delay={0.2} />
                            <StatCard title="Learning Score" value={`${learning[0]?.progress || 0}%`} icon={Medal} color="56, 189, 248" delay={0.3} />

                            <div style={{ gridColumn: 'span 2', marginTop: '20px' }}>
                                <GlassCard>
                                    <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px', marginBottom: '15px' }}>📌 Active Tasks</h3>
                                    {tasks.slice(0, 3).map(task => (
                                        <div key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                                            <div>
                                                <h4 style={{ margin: 0, color: '#e2e8f0' }}>{task.title}</h4>
                                                <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.8rem' }}>Due: {task.deadline}</p>
                                            </div>
                                            <span style={{
                                                fontSize: '0.75rem', padding: '4px 8px', borderRadius: '4px',
                                                background: task.status === 'Completed' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(234, 179, 8, 0.2)',
                                                color: task.status === 'Completed' ? '#86efac' : '#fde047'
                                            }}>{task.status}</span>
                                        </div>
                                    ))}
                                </GlassCard>
                            </div>

                            <div style={{ gridColumn: 'span 2', marginTop: '20px' }}>
                                <GlassCard>
                                    <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px', marginBottom: '15px' }}>📢 Latest Announcements</h3>
                                    <div style={{ color: '#94a3b8' }}>
                                        <p>🎉 <strong>Holiday Party</strong> is scheduled for Dec 15th!</p>
                                        <p>🔒 <strong>Security Audit</strong> successfully completed.</p>
                                        <p>🚀 <strong>Gold Industry ERP</strong> v2.0 launch next week.</p>
                                    </div>
                                </GlassCard>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'tasks' && (
                        <motion.div
                            key="tasks"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
                        >
                            {tasks.map(task => (
                                <GlassCard key={task.id}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <h3 style={{ margin: 0, color: '#e2e8f0' }}>{task.title}</h3>
                                            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Project: {task.project} • Priority: {task.priority}</p>
                                        </div>
                                        <span style={{
                                            fontSize: '0.85rem', padding: '6px 12px', borderRadius: '8px', fontWeight: 'bold',
                                            background: task.status === 'Completed' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(234, 179, 8, 0.2)',
                                            color: task.status === 'Completed' ? '#86efac' : '#fde047'
                                        }}>{task.status}</span>
                                    </div>
                                </GlassCard>
                            ))}
                        </motion.div>
                    )}

                    {activeTab === 'leaves' && (
                        <motion.div
                            key="leaves"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                    <ActionButton onClick={() => setShowLeaveForm(!showLeaveForm)} icon={showLeaveForm ? XCircle : Plus}>
                                        {showLeaveForm ? 'Cancel Request' : 'New Leave Request'}
                                    </ActionButton>
                                    <ActionButton variant="ghost" icon={Home}>Request WFH</ActionButton>
                                </div>

                                {showLeaveForm && (
                                    <GlassCard>
                                        <form onSubmit={handleLeaveSubmit} style={{ display: 'grid', gap: '15px' }}>
                                            <h3 style={{ margin: 0, marginBottom: '10px' }}>Request Time Off</h3>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
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
                                                placeholder="Reason..."
                                                value={newLeave.reason}
                                                onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
                                                style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', minHeight: '80px' }}
                                                required
                                            />
                                            <ActionButton type="submit" variant="primary" icon={CheckCircle}>Submit Request</ActionButton>
                                        </form>
                                    </GlassCard>
                                )}

                                <h3 style={{ color: '#94a3b8', margin: '0 0 10px' }}>My Leave History</h3>
                                {leaves.length === 0 ? (
                                    <p style={{ color: '#94a3b8', textAlign: 'center' }}>No leave history found.</p>
                                ) : (
                                    leaves.map(leave => (
                                        <GlassCard key={leave.id}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                    <h3 style={{ margin: 0, color: '#e2e8f0' }}>{leave.type}</h3>
                                                    <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{leave.reason}</p>
                                                    <div style={{ marginTop: '5px', fontSize: '0.85rem', color: '#cbd5e1' }}>
                                                        📅 {leave.startDate} to {leave.endDate} ({leave.days} days)
                                                    </div>
                                                </div>
                                                <span style={{
                                                    padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold',
                                                    background: leave.status === 'Approved' ? 'rgba(34, 197, 94, 0.2)' : leave.status === 'Pending' ? 'rgba(234, 179, 8, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                                    color: leave.status === 'Approved' ? '#86efac' : leave.status === 'Pending' ? '#fde047' : '#fca5a5'
                                                }}>{leave.status}</span>
                                            </div>
                                        </GlassCard>
                                    ))
                                )}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <GlassCard>
                                    <h3 style={{ margin: '0 0 15px', display: 'flex', alignItems: 'center', gap: '10px' }}><Calendar size={20} color="#D4AF37" /> Holiday List</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {holidays.map(h => (
                                            <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
                                                <span>{h.name}</span>
                                                <span style={{ color: '#94a3b8' }}>{h.date}</span>
                                            </div>
                                        ))}
                                    </div>
                                </GlassCard>

                                <GlassCard>
                                    <h3 style={{ margin: '0 0 15px', display: 'flex', alignItems: 'center', gap: '10px' }}><Home size={20} color="#38bdf8" /> WFH History</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {wfhRequest.map(w => (
                                            <div key={w.id} style={{ padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                                    <span style={{ fontWeight: 'bold' }}>{w.date}</span>
                                                    <span style={{ fontSize: '0.8rem', color: w.status === 'Approved' ? '#86efac' : '#fde047' }}>{w.status}</span>
                                                </div>
                                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>{w.reason}</p>
                                            </div>
                                        ))}
                                        {wfhRequest.length === 0 && <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No WFH taken.</p>}
                                    </div>
                                </GlassCard>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'performance' && (
                        <motion.div
                            key="performance"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '30px' }}>
                                <StatCard title="Overall Rating" value="4.5/5" icon={Medal} color="212, 175, 55" delay={0} />
                                <StatCard title="Goals Met" value={`${okrs.filter(o => o.progress >= 100).length}/${okrs.length}`} icon={CheckCircle} color="34, 197, 94" delay={0.1} />
                                <StatCard title="Next Appraisal" value="March '24" icon={Calendar} color="56, 189, 248" delay={0.2} />
                            </div>

                            <h2 style={{ marginBottom: '20px' }}>Quarterly Goals (OKRs)</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                {okrs.map(okr => (
                                    <GlassCard key={okr.id}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                            <h3 style={{ margin: 0 }}>{okr.title}</h3>
                                            <span style={{
                                                padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem',
                                                background: okr.status === 'On Track' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                                color: okr.status === 'On Track' ? '#86efac' : '#fca5a5'
                                            }}>{okr.status}</span>
                                        </div>
                                        <p style={{ color: '#94a3b8', marginBottom: '15px' }}>{okr.objective}</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                                                <div style={{ width: `${okr.progress}%`, height: '100%', background: '#D4AF37' }} />
                                            </div>
                                            <span style={{ fontWeight: 'bold' }}>{okr.progress}%</span>
                                        </div>
                                    </GlassCard>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'financials' && (
                        <motion.div
                            key="financials"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
                        >
                            {payrollHistory.map(pay => (
                                <GlassCard key={pay.id}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '15px' }}>
                                        <h3 style={{ margin: 0 }}>Payslip: {pay.month}</h3>
                                        <span style={{ color: '#86efac', fontWeight: 'bold' }}>{pay.status}</span>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', textAlign: 'center' }}>
                                        <div>
                                            <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '0 0 5px' }}>Basic Salary</p>
                                            <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>${pay.basic}</p>
                                        </div>
                                        <div>
                                            <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '0 0 5px' }}>Allowances</p>
                                            <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>${pay.allowances}</p>
                                        </div>
                                        <div>
                                            <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '0 0 5px' }}>Net Pay</p>
                                            <p style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#D4AF37' }}>${pay.net}</p>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: '15px', textAlign: 'right', fontSize: '0.8rem', color: '#64748b' }}>
                                        Paid on: {pay.date}
                                    </div>
                                </GlassCard>
                            ))}
                        </motion.div>
                    )}

                    {activeTab === 'learning' && (
                        <motion.div
                            key="learning"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                                <div>
                                    <h2 style={{ marginBottom: '20px' }}>Available Courses</h2>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                                        {lmsCourses.map(course => (
                                            <GlassCard key={course.id} style={{ padding: '0', overflow: 'hidden' }}>
                                                <div style={{ height: '120px', background: `url(${course.thumbnail}) center/cover` }} />
                                                <div style={{ padding: '15px' }}>
                                                    <span style={{ fontSize: '0.75rem', color: '#D4AF37', fontWeight: 'bold' }}>{course.category}</span>
                                                    <h3 style={{ fontSize: '1rem', margin: '5px 0' }}>{course.title}</h3>
                                                    <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Instructor: {course.instructor}</p>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                                                        <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>{course.duration}</span>
                                                        {course.progress > 0 ? (
                                                            <span style={{ fontSize: '0.8rem', color: '#86efac' }}>In Progress ({course.progress}%)</span>
                                                        ) : (
                                                            <ActionButton variant="primary" onClick={() => { }}>Start</ActionButton>
                                                        )}
                                                    </div>
                                                </div>
                                            </GlassCard>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <GlassCard style={{ marginBottom: '20px' }}>
                                        <h3 style={{ margin: '0 0 15px' }}>L&D Budget</h3>
                                        <div style={{ textAlign: 'center', margin: '20px 0' }}>
                                            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#D4AF37' }}>${learningBudget?.remaining || 0}</p>
                                            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Remaining of ${learningBudget?.total}</p>
                                        </div>
                                        <div style={{ width: '100%', background: 'rgba(255,255,255,0.1)', height: '8px', borderRadius: '4px' }}>
                                            <div style={{ width: `${(learningBudget?.used / learningBudget?.total) * 100}%`, background: '#D4AF37', height: '100%' }} />
                                        </div>
                                    </GlassCard>

                                    <h3 style={{ marginBottom: '15px', color: '#94a3b8' }}>My Progress</h3>
                                    {learning.map((learn, i) => (
                                        <div key={i} style={{ marginBottom: '20px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                                <span style={{ fontSize: '0.95rem' }}>{learn.module}</span>
                                                <span style={{ color: '#D4AF37', fontSize: '0.9rem' }}>{learn.status}</span>
                                            </div>
                                            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '5px', overflow: 'hidden' }}>
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${learn.progress}%` }}
                                                    transition={{ duration: 1, delay: 0.2 }}
                                                    style={{ height: '100%', background: '#D4AF37' }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'social' && (
                        <motion.div
                            key="social"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                                <GlassCard style={{ marginBottom: '30px', textAlign: 'center' }}>
                                    <h2>🏢 GoldTech Town Hall</h2>
                                    <p style={{ color: '#94a3b8' }}>Stay updated with the latest news, events, and recognitions.</p>
                                </GlassCard>

                                {socialFeed.map(post => (
                                    <GlassCard key={post.id} style={{ marginBottom: '20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>
                                                {post.author.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 style={{ margin: 0 }}>{post.author}</h4>
                                                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{post.timestamp}</span>
                                            </div>
                                            <span style={{ marginLeft: 'auto', padding: '4px 10px', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', fontSize: '0.8rem', color: '#D4AF37' }}>
                                                {post.type.toUpperCase()}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: '1.05rem', lineHeight: '1.6' }}>{post.content}</p>
                                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '15px', paddingTop: '15px', display: 'flex', gap: '20px' }}>
                                            <button style={{ background: 'none', border: 'none', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                                                <CheckCircle size={16} /> {post.likes} Likes
                                            </button>
                                            <button style={{ background: 'none', border: 'none', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                                                <MessageSquare size={16} /> {post.comments} Comments
                                            </button>
                                        </div>
                                    </GlassCard>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'devtools' && (
                        <motion.div
                            key="devtools"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '25px' }}>
                                <div>
                                    <GlassCard style={{ height: '100%' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}><Code size={20} color="#38bdf8" /> Jira My Tasks</h3>
                                            <ActionButton variant="ghost" onClick={() => { }}>Sync Jira</ActionButton>
                                        </div>
                                        {devTools.jira.map(ticket => (
                                            <div key={ticket.id} style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', marginBottom: '10px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                                    <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{ticket.id}</span>
                                                    <span style={{
                                                        fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px',
                                                        background: ticket.priority === 'High' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                                                        color: ticket.priority === 'High' ? '#fca5a5' : '#86efac'
                                                    }}>{ticket.priority}</span>
                                                </div>
                                                <p style={{ margin: 0, fontSize: '0.95rem' }}>{ticket.summary}</p>
                                                <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>{ticket.type}</span>
                                                    <span style={{ fontSize: '0.8rem', color: '#D4AF37' }}>{ticket.status}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </GlassCard>
                                </div>
                                <div>
                                    <GlassCard style={{ height: '100%' }}>
                                        <h3 style={{ margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '10px' }}><Shield size={20} color="#fcd34d" /> Cloud Access (Temporary)</h3>
                                        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '20px' }}>
                                            Request temporary access keys for development environments. Keys expire in 1 hour.
                                        </p>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <ActionButton variant="primary" onClick={() => alert('Mock AWS Keys Generated!')}>Generate AWS Keys</ActionButton>
                                            <ActionButton variant="ghost" onClick={() => { }}>Azure Keys</ActionButton>
                                        </div>
                                    </GlassCard>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'referrals' && (
                        <motion.div
                            key="referrals"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <GlassCard>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <div>
                                        <h2 style={{ margin: 0 }}>Referral Portal</h2>
                                        <p style={{ color: '#94a3b8' }}>Refer talent and earn bonuses!</p>
                                    </div>
                                    <ActionButton variant="primary" icon={Plus}>Submit New Referral</ActionButton>
                                </div>

                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                            <th style={{ textAlign: 'left', padding: '15px', color: '#94a3b8' }}>Candidate Name</th>
                                            <th style={{ textAlign: 'left', padding: '15px', color: '#94a3b8' }}>Position</th>
                                            <th style={{ textAlign: 'left', padding: '15px', color: '#94a3b8' }}>Status</th>
                                            <th style={{ textAlign: 'right', padding: '15px', color: '#94a3b8' }}>Potential Bonus</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {referrals.map(ref => (
                                            <tr key={ref.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <td style={{ padding: '15px' }}>{ref.candidate}</td>
                                                <td style={{ padding: '15px' }}>{ref.position}</td>
                                                <td style={{ padding: '15px' }}>
                                                    <span style={{
                                                        padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem',
                                                        background: 'rgba(212, 175, 55, 0.15)', color: '#D4AF37'
                                                    }}>{ref.status}</span>
                                                </td>
                                                <td style={{ padding: '15px', textAlign: 'right', fontWeight: 'bold' }}>${ref.bonus}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </GlassCard>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default EmployeePortal;
