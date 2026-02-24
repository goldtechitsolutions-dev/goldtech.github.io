import React, { useState, useEffect } from 'react';
import {
    Users,
    Grid,
    List,
    Calendar,
    CheckSquare,
    Clock,
    Briefcase,
    AlertCircle,
    Plus,
    MoreVertical,
    ChevronRight,
    TrendingUp,
    MessageSquare,
    FileText,
    Search,
    Filter,
    BarChart2,
    LogOut,
    Menu,
    Github,
    Slack,
    Server,
    Trello,
    AlertTriangle,
    BookOpen,
    Settings,
    PlayCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AdminService from '../services/adminService';
import logo from '../assets/logo-transparent.png';

// --- Reusable UI Components (Mirrored from SalesPortal/ClientPortal) ---

const GlassCard = ({ children, delay = 0, className = '', style = {}, onClick }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        onClick={onClick}
        style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
            color: '#fff',
            cursor: onClick ? 'pointer' : 'default',
            ...style
        }}
        className={className}
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
        success: { background: 'rgba(16, 185, 129, 0.2)', color: '#86efac', border: '1px solid rgba(16, 185, 129, 0.5)' },
        ghost: { background: 'transparent', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)' }
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

const ProjectManagementPortal = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [projects, setProjects] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedProject, setSelectedProject] = useState(null);
    const [projectTasks, setProjectTasks] = useState([]);
    const [integrations, setIntegrations] = useState([]);
    const [timeLogs, setTimeLogs] = useState([]);
    const [wikiArticles, setWikiArticles] = useState([]);

    useEffect(() => {
        loadData();
    }, [activeTab, selectedProject]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [allProjects, integrationList, logs, articles] = await Promise.all([
                AdminService.getDetailedProjects ? AdminService.getDetailedProjects() : Promise.resolve([]),
                AdminService.getIntegrations ? AdminService.getIntegrations() : Promise.resolve([]),
                AdminService.getTimeLogs ? AdminService.getTimeLogs() : Promise.resolve([]),
                AdminService.getWikiArticles ? AdminService.getWikiArticles() : Promise.resolve([])
            ]);

            setProjects(allProjects || []);
            setIntegrations(integrationList || []);
            setTimeLogs(logs || []);
            setWikiArticles(articles || []);

            // Calculate Stats
            const total = (allProjects || []).length;
            const active = (allProjects || []).filter(p => p.status === 'In Progress').length;
            const completed = (allProjects || []).filter(p => p.status === 'Completed').length;
            const delayed = (allProjects || []).filter(p => p.status === 'At Risk' || p.status === 'On Hold').length;

            setStats({ total, active, completed, delayed });

            if (selectedProject) {
                const tasks = AdminService.getProjectTasks ? await AdminService.getProjectTasks(selectedProject.id) : [];
                setProjectTasks(tasks || []);
            }
        } catch (error) {
            console.error("ProjectManagementPortal: Error loading data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleProjectClick = (project) => {
        setSelectedProject(project);
        setActiveTab('project-details');
    };

    const handleLogout = () => {
        navigate('/');
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

    const StatusBadge = ({ status }) => {
        const styles = {
            'In Progress': { bg: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa' },
            'Completed': { bg: 'rgba(34, 197, 94, 0.2)', color: '#86efac' },
            'At Risk': { bg: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5' },
            'On Hold': { bg: 'rgba(234, 179, 8, 0.2)', color: '#fde047' },
            'Planning': { bg: 'rgba(168, 85, 247, 0.2)', color: '#c084fc' },
        };
        const style = styles[status] || styles['Planning'];
        return (
            <span style={{
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                background: style.bg,
                color: style.color
            }}>
                {status}
            </span>
        );
    };

    const StatCard = ({ title, value, icon: Icon, trend, color, delay }) => (
        <GlassCard delay={delay} style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{
                position: 'absolute', right: '-20px', top: '-20px', width: '100px', height: '100px',
                borderRadius: '50%', background: color, opacity: 0.1, filter: 'blur(20px)'
            }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', color: '#fff' }}>
                    {Icon && <Icon size={24} />}
                </div>
                {trend && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#86efac', background: 'rgba(34, 197, 94, 0.1)', padding: '4px 8px', borderRadius: '12px' }}>
                        <TrendingUp size={12} />
                        {trend}
                    </div>
                )}
            </div>
            <div>
                <div style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '5px' }}>{title}</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>{value}</div>
            </div>
        </GlassCard>
    );

    const TaskCard = ({ task, opacity }) => (
        <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            padding: '16px',
            borderRadius: '12px',
            marginBottom: '12px',
            opacity: opacity ? 0.6 : 1,
            cursor: 'grab'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span style={{
                    fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px',
                    background: (task.priority === 'High' || task.priority === 'Critical') ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                    color: (task.priority === 'High' || task.priority === 'Critical') ? '#fca5a5' : '#60a5fa'
                }}>
                    {task.priority}
                </span>
                <button style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><MoreVertical size={14} /></button>
            </div>
            <p style={{ fontSize: '0.9rem', fontWeight: '500', color: '#e2e8f0', marginBottom: '12px', margin: '0 0 12px 0' }}>{task.title}</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} />
                    <span>{task.dueDate}</span>
                </div>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.7rem' }}>
                    {task.assignee % 100}
                </div>
            </div>
        </div>
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
                        <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.4rem', letterSpacing: '1px' }}>PROJECTS</span>
                    </div>
                </div>

                <div style={{ marginBottom: '30px', textAlign: 'center' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#D4AF37', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', color: '#0f172a' }}>PM</div>
                    <h3 style={{ color: '#fff', margin: 0 }}>Mike Manager</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>Head of Delivery</p>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, overflowY: 'auto' }}>
                    <button onClick={() => { setActiveTab('dashboard'); setSelectedProject(null); }} style={navLinkStyle(activeTab === 'dashboard')}>
                        <Grid size={18} /> Dashboard
                    </button>
                    <button onClick={() => { setActiveTab('projects'); setSelectedProject(null); }} style={navLinkStyle(activeTab === 'projects')}>
                        <Briefcase size={18} /> Projects
                    </button>
                    <button onClick={() => setActiveTab('team')} style={navLinkStyle(activeTab === 'team')}>
                        <Users size={18} /> Resources
                    </button>
                    <div style={{ margin: '10px 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}></div>
                    <button onClick={() => setActiveTab('board')} style={navLinkStyle(activeTab === 'board')}>
                        <Trello size={18} /> Agile Board
                    </button>
                    <button onClick={() => setActiveTab('time')} style={navLinkStyle(activeTab === 'time')}>
                        <Clock size={18} /> Time Logs
                    </button>
                    <button onClick={() => setActiveTab('wiki')} style={navLinkStyle(activeTab === 'wiki')}>
                        <BookOpen size={18} /> Wiki / Docs
                    </button>
                    <div style={{ margin: '10px 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}></div>
                    <button onClick={() => setActiveTab('integrations')} style={navLinkStyle(activeTab === 'integrations')}>
                        <Settings size={18} /> Integrations
                    </button>
                </nav>

                <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
                    <button onClick={handleLogout} style={{ ...navLinkStyle(false), color: '#ef4444', justifyContent: 'flex-start' }}>
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, marginLeft: '280px', padding: '40px', background: 'radial-gradient(circle at top right, #1e293b 0%, #0f172a 100%)', minHeight: '100vh' }}>

                <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', color: '#fff', fontWeight: '700', marginBottom: '5px' }}>
                            {activeTab === 'dashboard' && 'Project Dashboard'}
                            {activeTab === 'projects' && 'All Projects'}
                            {activeTab === 'project-details' && selectedProject ? selectedProject.name : 'Project Details'}
                            {['tasks', 'team', 'calendar'].includes(activeTab) && 'Work in Progress'}
                        </h1>
                        <p style={{ color: '#94a3b8' }}>Oversee all your ongoing initiatives and team performance.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <ActionButton icon={Filter} variant="ghost">Filter</ActionButton>
                        <ActionButton icon={Plus} variant="primary">New Project</ActionButton>
                    </div>
                </header>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(212, 175, 55, 0.3)', borderTop: '3px solid #D4AF37', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                    </div>
                ) : (
                    <AnimatePresence mode='wait'>
                        {activeTab === 'dashboard' && stats && (
                            <motion.div
                                key="dashboard"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
                            >
                                {/* Stats Grid */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                                    <StatCard title="Total Projects" value={stats.total} icon={Briefcase} trend="+12%" color="#3b82f6" delay={0.1} />
                                    <StatCard title="Active Projects" value={stats.active} icon={Clock} trend="+5%" color="#a855f7" delay={0.2} />
                                    <StatCard title="Delayed / At Risk" value={stats.delayed} icon={AlertCircle} color="#ef4444" delay={0.3} />
                                    <StatCard title="Completed" value={stats.completed} icon={CheckSquare} trend="+8%" color="#10b981" delay={0.4} />
                                </div>

                                {/* Recent Projects Table */}
                                <GlassCard>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                        <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Active Projects</h3>
                                        <button onClick={() => setActiveTab('projects')} style={{ background: 'none', border: 'none', color: '#D4AF37', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            View All <ChevronRight size={14} />
                                        </button>
                                    </div>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', color: '#94a3b8', fontSize: '0.9rem' }}>
                                                <th style={{ padding: '15px' }}>Project Name</th>
                                                <th style={{ padding: '15px' }}>Manager</th>
                                                <th style={{ padding: '15px' }}>Deadline</th>
                                                <th style={{ padding: '15px' }}>Status</th>
                                                <th style={{ padding: '15px' }}>Progress</th>
                                                <th style={{ padding: '15px' }}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {projects.slice(0, 5).map((project) => (
                                                <tr key={project.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.3s' }}>
                                                    <td style={{ padding: '15px', fontWeight: 'bold' }}>{project.name}</td>
                                                    <td style={{ padding: '15px', color: '#cbd5e1' }}>{project.manager}</td>
                                                    <td style={{ padding: '15px', color: '#cbd5e1' }}>{project.endDate}</td>
                                                    <td style={{ padding: '15px' }}><StatusBadge status={project.status} /></td>
                                                    <td style={{ padding: '15px', width: '200px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                            <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                                                                <div style={{ width: `${project.progress}%`, background: project.progress === 100 ? '#10b981' : '#D4AF37', height: '100%' }}></div>
                                                            </div>
                                                            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{project.progress}%</span>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '15px', textAlign: 'right' }}>
                                                        <button onClick={() => handleProjectClick(project)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', padding: '8px', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}>
                                                            <ChevronRight size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </GlassCard>
                            </motion.div>
                        )}

                        {activeTab === 'board' && (
                            <motion.div
                                key="board"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{ height: '100%', overflowX: 'auto' }}
                            >
                                <div style={{ display: 'flex', gap: '24px', minWidth: '1000px', height: 'calc(100vh - 200px)' }}>
                                    {[
                                        { id: 'ToDo', title: 'To Do', color: '#94a3b8' },
                                        { id: 'In Progress', title: 'In Progress', color: '#60a5fa' },
                                        { id: 'Review', title: 'Review / QA', color: '#c084fc' },
                                        { id: 'Done', title: 'Done', color: '#86efac' }
                                    ].map(column => (
                                        <div key={column.id} style={{ flex: 1, background: 'rgba(255,255,255,0.03)', borderRadius: '16px', display: 'flex', flexDirection: 'column', maxHeight: '100%' }}>
                                            <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <h3 style={{ margin: 0, fontSize: '1rem', color: column.color }}>{column.title}</h3>
                                                <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>
                                                    {projectTasks.filter(t => (t.status === column.id) || (column.id === 'Review' && t.status === 'Review')).length}
                                                </span>
                                            </div>

                                            <div style={{ padding: '16px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                {projectTasks
                                                    .filter(t => (t.status === column.id) || (column.id === 'Review' && t.status === 'Review')) // Simple mapping
                                                    .map(task => (
                                                        <motion.div
                                                            layoutId={task.id}
                                                            key={task.id}
                                                            drag // Enable drag
                                                            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }} // Constrain to not fly away too far, mostly for effect
                                                            dragElastic={0.2}
                                                            onDragEnd={(e, info) => {
                                                                // In a real app, calculate drop target. Here we just snap back.
                                                                // Future: Implement drop logic to update status.
                                                            }}
                                                        >
                                                            <TaskCard task={task} opacity={column.id === 'Done'} />
                                                        </motion.div>
                                                    ))}
                                                <button style={{ width: '100%', padding: '12px', border: '1px dashed rgba(255,255,255,0.1)', background: 'transparent', color: '#64748b', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}>
                                                    <Plus size={16} /> Add Card
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'projects' && (
                            <motion.div
                                key="projects"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}
                            >
                                {projects.map(project => (
                                    <GlassCard key={project.id} onClick={() => handleProjectClick(project)} style={{ cursor: 'pointer', transition: 'transform 0.3s' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                            <div style={{ padding: '12px', background: '#020617', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                                <Briefcase size={20} color="#D4AF37" />
                                            </div>
                                            <StatusBadge status={project.status} />
                                        </div>
                                        <h3 style={{ fontSize: '1.2rem', margin: '0 0 10px 0', color: '#fff' }}>{project.name}</h3>
                                        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '20px', lineHeight: '1.5' }}>{project.description}</p>

                                        <div style={{ marginBottom: '20px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.8rem', color: '#94a3b8' }}>
                                                <span>Progress</span>
                                                <span style={{ color: '#fff' }}>{project.progress}%</span>
                                            </div>
                                            <div style={{ width: '100%', background: 'rgba(255,255,255,0.1)', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                                                <div style={{ width: `${project.progress}%`, background: '#D4AF37', height: '100%' }}></div>
                                            </div>
                                        </div>

                                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', marginLeft: '10px' }}>
                                                {[...Array(3)].map((_, i) => (
                                                    <div key={i} style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#1e293b', border: '2px solid #0f172a', marginLeft: '-10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#cbd5e1' }}>
                                                        {String.fromCharCode(65 + i)}
                                                    </div>
                                                ))}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: '#94a3b8' }}>
                                                <Calendar size={14} /> {project.endDate}
                                            </div>
                                        </div>
                                    </GlassCard>
                                ))}
                            </motion.div>
                        )}

                        {activeTab === 'project-details' && selectedProject && (
                            <motion.div
                                key="details"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}
                            >
                                <button onClick={() => setActiveTab('projects')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem', width: 'fit-content' }}>
                                    <ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} /> Back to Projects
                                </button>

                                <GlassCard>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <h2 style={{ fontSize: '2rem', margin: '0 0 10px 0' }}>{selectedProject.name}</h2>
                                            <p style={{ color: '#94a3b8', maxWidth: '800px', lineHeight: '1.6' }}>{selectedProject.description}</p>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                                            <StatusBadge status={selectedProject.status} />
                                            <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Manager: {selectedProject.manager}</div>
                                        </div>
                                    </div>

                                    <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', padding: '20px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
                                        <div><div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Start Date</div><div style={{ color: '#fff' }}>{selectedProject.startDate}</div></div>
                                        <div><div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>End Date</div><div style={{ color: '#fff' }}>{selectedProject.endDate}</div></div>
                                        <div><div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Budget</div><div style={{ color: '#fff' }}>${selectedProject.budget.toLocaleString()}</div></div>
                                        <div><div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Spent</div><div style={{ color: '#fff' }}>${selectedProject.spent.toLocaleString()}</div></div>
                                    </div>
                                </GlassCard>

                                {/* Kanban Board */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                                    {/* Todo Column */}
                                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                                            <h4 style={{ margin: 0, fontWeight: 'bold' }}>To Do</h4>
                                            <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>{projectTasks.filter(t => t.status === 'ToDo').length}</span>
                                        </div>
                                        {projectTasks.filter(t => t.status === 'ToDo').map(task => (
                                            <TaskCard key={task.id} task={task} />
                                        ))}
                                        <button style={{ width: '100%', padding: '12px', border: '1px dashed rgba(255,255,255,0.2)', background: 'transparent', color: '#94a3b8', borderRadius: '8px', cursor: 'pointer', marginTop: '10px' }}>
                                            + Add Task
                                        </button>
                                    </div>

                                    {/* In Progress Column */}
                                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                                            <h4 style={{ margin: 0, fontWeight: 'bold', color: '#60a5fa' }}>In Progress</h4>
                                            <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>{projectTasks.filter(t => t.status === 'In Progress').length}</span>
                                        </div>
                                        {projectTasks.filter(t => t.status === 'In Progress').map(task => (
                                            <TaskCard key={task.id} task={task} />
                                        ))}
                                    </div>

                                    {/* Done Column */}
                                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                                            <h4 style={{ margin: 0, fontWeight: 'bold', color: '#86efac' }}>Done</h4>
                                            <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>{projectTasks.filter(t => t.status === 'Done').length}</span>
                                        </div>
                                        {projectTasks.filter(t => t.status === 'Done').map(task => (
                                            <TaskCard key={task.id} task={task} opacity />
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Time Logs View */}
                        {activeTab === 'time' && (
                            <motion.div
                                key="time"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <GlassCard>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                        <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Resource Time Logs</h2>
                                        <ActionButton icon={Plus} variant="primary">Log Time</ActionButton>
                                    </div>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', color: '#94a3b8', fontSize: '0.9rem' }}>
                                                <th style={{ padding: '15px' }}>Date</th>
                                                <th style={{ padding: '15px' }}>Project</th>
                                                <th style={{ padding: '15px' }}>Task</th>
                                                <th style={{ padding: '15px' }}>Description</th>
                                                <th style={{ padding: '15px' }}>Hours</th>
                                                <th style={{ padding: '15px' }}>Billable</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {timeLogs.map(log => (
                                                <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                    <td style={{ padding: '15px' }}>{log.date}</td>
                                                    <td style={{ padding: '15px', color: '#D4AF37' }}>{projects.find(p => p.id === log.projectId)?.name || 'Unknown'}</td>
                                                    <td style={{ padding: '15px' }}>Task #{log.taskId}</td>
                                                    <td style={{ padding: '15px', color: '#cbd5e1' }}>{log.description}</td>
                                                    <td style={{ padding: '15px', fontWeight: 'bold' }}>{log.hours}h</td>
                                                    <td style={{ padding: '15px' }}>
                                                        {log.billable ? <span style={{ color: '#86efac' }}><CheckSquare size={14} /></span> : <span style={{ color: '#94a3b8' }}>-</span>}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
                                                <td colSpan="4" style={{ padding: '15px', textAlign: 'right', fontWeight: 'bold' }}>Total Hours:</td>
                                                <td style={{ padding: '15px', fontWeight: 'bold', color: '#D4AF37' }}>{timeLogs.reduce((acc, log) => acc + log.hours, 0)}h</td>
                                                <td></td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </GlassCard>
                            </motion.div>
                        )}

                        {/* Wiki View */}
                        {activeTab === 'wiki' && (
                            <motion.div
                                key="wiki"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px' }}
                            >
                                <GlassCard style={{ height: 'fit-content' }}>
                                    <h3 style={{ marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>Categories</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                        {['All', 'Onboarding', 'Best Practices', 'DevOps', 'Architecture'].map(cat => (
                                            <button key={cat} style={{ textAlign: 'left', padding: '10px', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', borderRadius: '8px', transition: 'background 0.2s', ':hover': { background: 'rgba(255,255,255,0.05)' } }}>
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                    <div style={{ marginTop: '20px' }}>
                                        <ActionButton icon={Plus} style={{ width: '100%', justifyContent: 'center' }}>New Page</ActionButton>
                                    </div>
                                </GlassCard>

                                <div style={{ display: 'grid', gap: '15px' }}>
                                    {wikiArticles.map(article => (
                                        <GlassCard key={article.id} style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <BookOpen size={18} color="#D4AF37" />
                                                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{article.title}</h3>
                                                </div>
                                                <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px' }}>{article.category}</span>
                                            </div>
                                            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '15px' }}>{article.content}</p>
                                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Author: {article.author}</div>
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
                                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}
                            >
                                {integrations.map(tool => (
                                    <GlassCard key={tool.id}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                                            <div style={{ width: '50px', height: '50px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {tool.icon === 'Github' && <Github size={24} />}
                                                {tool.icon === 'Slack' && <Slack size={24} />}
                                                {tool.icon === 'AlertTriangle' && <AlertTriangle size={24} />}
                                                {tool.icon === 'Trello' && <Trello size={24} />}
                                                {tool.icon === 'Server' && <Server size={24} />}
                                            </div>
                                            <div>
                                                <h3 style={{ margin: 0 }}>{tool.name}</h3>
                                                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{tool.type}</span>
                                            </div>
                                            <div style={{ marginLeft: 'auto', width: '10px', height: '10px', borderRadius: '50%', background: tool.status === 'Connected' ? '#10b981' : '#ef4444', boxShadow: tool.status === 'Connected' ? '0 0 10px #10b981' : 'none' }}></div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                            <span style={{ fontSize: '0.8rem', color: tool.status === 'Connected' ? '#86efac' : '#fca5a5' }}>
                                                {tool.status}
                                            </span>
                                            <button style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: '6px', color: '#fff', cursor: 'pointer', fontSize: '0.8rem' }}>
                                                {tool.status === 'Connected' ? 'Configure' : 'Connect'}
                                            </button>
                                        </div>
                                    </GlassCard>
                                ))}
                            </motion.div>
                        )}

                        {/* Fallback for Team / Calendar */}
                        {['team', 'calendar'].includes(activeTab) && (
                            <GlassCard style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
                                <div style={{ width: '80px', height: '80px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                                    <Clock size={40} color="#64748b" />
                                </div>
                                <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Coming Soon</h2>
                                <p style={{ color: '#94a3b8', textAlign: 'center', maxWidth: '400px' }}>This module is currently under development. Check back later for updates.</p>
                            </GlassCard>
                        )}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default ProjectManagementPortal;
