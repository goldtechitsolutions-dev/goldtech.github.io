import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Users, Briefcase, TrendingUp,
    LogOut, Plus, CheckCircle, XCircle, Search,
    Phone, Mail, Calendar, DollarSign, Target,
    Filter, MoreHorizontal, ArrowRight, FileText,
    MapPin, Clock, BarChart2, UserCheck, File,
    ExternalLink, MessageSquare, RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import logo from '../assets/logo-transparent.png';
import AdminService from '../services/adminService';

// --- Reusable UI Components (Mirrored from FinancePortal for consistency) ---

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

const ActionButton = ({ onClick, children, variant = 'primary', icon: Icon, disabled = false, ...props }) => {
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
        success: { background: 'rgba(16, 185, 129, 0.2)', color: '#86efac', border: '1px solid rgba(16, 185, 129, 0.5)' },
        ghost: { background: 'transparent', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)' }
    };

    return (
        <motion.button
            whileHover={disabled ? {} : { scale: 1.05 }}
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

const SalesPortal = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');

    // Data State
    const [leads, setLeads] = useState([]);
    const [deals, setDeals] = useState([]);
    const [activities, setActivities] = useState([]);
    const [meetings, setMeetings] = useState([]);
    const [queries, setQueries] = useState([]);

    // UI State
    const [showLeadForm, setShowLeadForm] = useState(false);
    const [newLead, setNewLead] = useState({ name: '', contact: '', email: '', stage: 'New', value: '', source: 'Website' });

    // State for API Features
    const [marketNews, setMarketNews] = useState([]);
    const [syncStatus, setSyncStatus] = useState(null);
    const [calculatorOpen, setCalculatorOpen] = useState(false);
    const [estimate, setEstimate] = useState({ hours: 0, rate: 0, discount: 0, total: 0 });

    // State for Advanced Features
    const [benchOpen, setBenchOpen] = useState(false);
    const [benchResources, setBenchResources] = useState([]);
    const [rateCards, setRateCards] = useState([]);
    const [lostAnalysis, setLostAnalysis] = useState([]);
    const [timelineLead, setTimelineLead] = useState(null);
    const [leadTimeline, setLeadTimeline] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // UI State for Modals
    const [proposalModalOpen, setProposalModalOpen] = useState(false);
    const [selectedDeal, setSelectedDeal] = useState(null);
    const [proposalForm, setProposalForm] = useState({ title: '', amount: 0, notes: '', discount: 0 });
    const [billModalOpen, setBillModalOpen] = useState(false);
    const [billForm, setBillForm] = useState({ date: '', dueDate: '', address: '' });

    // State for V2 Features
    const [pipelineView, setPipelineView] = useState('list'); // 'list' or 'kanban'
    const [serviceCatalog, setServiceCatalog] = useState([]);
    const [scopingTemplates, setScopingTemplates] = useState([]);
    const [catalogOpen, setCatalogOpen] = useState(false);
    const [scopingOpen, setScopingOpen] = useState(false);
    const [scopingForm, setScopingForm] = useState({});

    // V3 State
    const [caseStudies, setCaseStudies] = useState([]);
    const [partnerStats, setPartnerStats] = useState([]);

    useEffect(() => {
        const loadInitialData = async () => {
            const [lds, dls, acts, mts, qrs, srv, scp, bnch, rts, lost, news, studies, pStats] = await Promise.all([
                AdminService.getLeads(),
                AdminService.getDeals(),
                AdminService.getSalesActivities ? AdminService.getSalesActivities() : [],
                AdminService.getMeetings(),
                AdminService.getQueries(),
                AdminService.getServiceCatalog ? AdminService.getServiceCatalog() : [],
                AdminService.getScopingTemplates ? AdminService.getScopingTemplates() : [],
                AdminService.getBenchResources ? AdminService.getBenchResources() : [],
                AdminService.getRateCards ? AdminService.getRateCards() : [],
                AdminService.getLostDealAnalysis ? AdminService.getLostDealAnalysis() : [],
                AdminService.getMarketIntelligence ? AdminService.getMarketIntelligence() : [],
                AdminService.getCaseStudies ? AdminService.getCaseStudies() : [],
                AdminService.getPartnerStats ? AdminService.getPartnerStats() : []
            ]);

            setLeads(lds || []);
            setDeals(dls || []);
            setActivities(acts || []);
            setMeetings(mts || []);
            setQueries(qrs || []);
            setServiceCatalog(srv || []);
            setScopingTemplates(scp || []);
            setBenchResources(bnch || []);
            setRateCards(rts || []);
            setLostAnalysis(lost || []);
            setMarketNews(news || []);
            setCaseStudies(studies || []);
            setPartnerStats(pStats || []);
        };
        loadInitialData();
    }, []);

    const refreshData = async () => {
        if (isRefreshing) return;
        setIsRefreshing(true);
        try {
            const [lds, dls, acts, mts, qrs] = await Promise.all([
                AdminService.getLeads(),
                AdminService.getDeals(),
                AdminService.getSalesActivities ? AdminService.getSalesActivities() : [],
                AdminService.getMeetings(),
                AdminService.getQueries()
            ]);
            setLeads(lds || []);
            setDeals(dls || []);
            setActivities(acts || []);
            setMeetings(mts || []);
            setQueries(qrs || []);
        } catch (error) {
            console.error("SalesPortal: Error refreshing data", error);
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleCalculate = () => {
        const total = (estimate.hours * estimate.rate) * (1 - (estimate.discount / 100));
        setEstimate({ ...estimate, total });
    };

    const handleCRM_Sync = async () => {
        setSyncStatus('Syncing...');
        try {
            const res = await AdminService.syncCRM();
            setSyncStatus(`Synced: ${res.timestamp}`);
            await refreshData();
            setTimeout(() => setSyncStatus(null), 3000);
        } catch (error) {
            console.error("CRM Sync Error:", error);
            setSyncStatus('Sync Failed');
            setTimeout(() => setSyncStatus(null), 3000);
        }
    };

    const handleImportLeads = async () => {
        const count = await AdminService.ingestLeads("mock_csv_data");
        alert(`Imported ${count} leads from CSV.`);
        await refreshData();
    };

    const handleEnrichLead = async (lead) => {
        const enriched = await AdminService.enrichLead(lead.id);
        if (enriched) {
            await refreshData();
            alert(`Lead Enriched: ${enriched.name}`);
        }
    };

    const handleScoreLead = async (lead) => {
        const score = await AdminService.calculateLeadScore(lead);
        alert(`Lead Score for ${lead.name}: ${score}/100`);
    };

    const handleCreateProposal = async (deal) => {
        const proposal = await AdminService.generateProposal(deal.id);
        if (proposal) {
            alert(`Proposal Created: ${proposal.title}`);
        }
    };

    const handleSignProposal = async (deal) => {
        // Mocking proposal ID as deal ID for simplicity in this demo flow
        await AdminService.requestSignature(deal.id);
        alert(`Signature Requested for ${deal.client}`);
    };

    const handleOpenProposal = (deal) => {
        setSelectedDeal(deal);
        setProposalForm({ title: `Proposal for ${deal.client}`, notes: 'Standard implementation services...', amount: deal.amount });
        setProposalModalOpen(true);
    };

    const handleSubmitProposal = async (e) => {
        e.preventDefault();
        const proposal = await AdminService.generateProposal(selectedDeal.id, proposalForm);
        if (proposal) {
            alert(`Proposal "${proposal.title}" Created & Sent!`);
            setProposalModalOpen(false);
            await refreshData(); // Update deal status
        }
    };

    const handleOpenBill = (deal) => {
        setSelectedDeal(deal);
        const today = new Date().toISOString().split('T')[0];
        setBillForm({ date: today, dueDate: today, address: '123 Client St, City' });
        setBillModalOpen(true);
    };

    const handleSubmitBill = async (e) => {
        e.preventDefault();
        const invoice = await AdminService.generateInvoiceFromDeal(selectedDeal.id, billForm);
        if (invoice.success) {
            alert(`Invoice #${invoice.invoice.id} Generated Successfully!`);
            setBillModalOpen(false);
        } else {
            alert('Error generating invoice');
        }
    };

    const handleRouteLead = async (lead) => {
        const result = await AdminService.autoRouteLead(lead.id);
        if (result.success) {
            alert(`Lead Auto-Routed to: ${result.assignedTo}\nReason: ${result.reason}`);
        }
    };

    const handleViewTimeline = async (lead) => {
        const timeline = await AdminService.getLeadTimeline(lead.id);
        setTimelineLead(lead);
        setLeadTimeline(timeline);
    };

    const handleKickoff = async (deal) => {
        const res = await AdminService.initiateKickoff(deal.id);
        if (res.success) alert(res.message);
    };

    const handleLogout = () => {
        navigate('/');
    };

    const handleAddLead = async (e) => {
        e.preventDefault();
        await AdminService.addLead({
            ...newLead,
            value: parseFloat(newLead.value) || 0
        });
        setShowLeadForm(false);
        setNewLead({ name: '', contact: '', email: '', stage: 'New', value: '', source: 'Website' });
        await refreshData();
    };

    const updateLeadStage = async (lead, newStage) => {
        await AdminService.updateLead({ ...lead, stage: newStage });
        await refreshData();
    };

    // Calculate Stats
    const totalPipelineValue = deals.reduce((acc, deal) => acc + deal.amount, 0);
    const weightedPipelineValue = deals.reduce((acc, deal) => acc + (deal.amount * (deal.probability / 100)), 0);
    const conversionRate = leads.length > 0 ? ((deals.length / leads.length) * 100).toFixed(1) : 0;

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
                        <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.4rem', letterSpacing: '1px' }}>SALES</span>
                    </div>
                </div>

                <div style={{ marginBottom: '30px', textAlign: 'center' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#D4AF37', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', color: '#0f172a' }}>M</div>
                    <h3 style={{ color: '#fff', margin: 0 }}>Mike Manager</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>Head of Sales</p>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                    <button onClick={() => setActiveTab('dashboard')} style={navLinkStyle(activeTab === 'dashboard')}>
                        <LayoutDashboard size={18} /> Overview
                    </button>
                    <button onClick={() => setActiveTab('leads')} style={navLinkStyle(activeTab === 'leads')}>
                        <Users size={18} /> Lead Management
                    </button>
                    <button onClick={() => setActiveTab('bookings')} style={navLinkStyle(activeTab === 'bookings')}>
                        <Calendar size={18} /> Scheduled Meetings
                    </button>
                    <button onClick={() => setActiveTab('queries')} style={navLinkStyle(activeTab === 'queries')}>
                        <MessageSquare size={18} /> Contact Queries
                    </button>
                    <button onClick={() => setActiveTab('deals')} style={navLinkStyle(activeTab === 'deals')}>
                        <Briefcase size={18} /> Active Deals
                    </button>
                    <div style={{ margin: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}></div>
                    <button onClick={() => setActiveTab('bench')} style={navLinkStyle(activeTab === 'bench')}>
                        <UserCheck size={18} /> Resource Bench
                    </button>
                    <button onClick={() => setActiveTab('content')} style={navLinkStyle(activeTab === 'content')}>
                        <FileText size={18} /> Case Studies
                    </button>
                    <button onClick={() => setActiveTab('ops')} style={navLinkStyle(activeTab === 'ops')}>
                        <CheckCircle size={18} /> Operations
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
                <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', color: '#fff', fontWeight: '700', marginBottom: '5px' }}>
                            {activeTab === 'dashboard' && 'Sales Overview'}
                            {activeTab === 'leads' && 'Lead Management'}
                            {activeTab === 'bookings' && 'Consultation Bookings'}
                            {activeTab === 'queries' && 'Contact Queries'}
                            {activeTab === 'deals' && 'Deal Pipeline'}
                            {activeTab === 'bench' && 'Resource Availability'}
                            {activeTab === 'content' && 'Sales Enablement'}
                            {activeTab === 'ops' && 'Sales Operations'}
                        </h1>
                        <p style={{ color: '#94a3b8' }}>Track performance, manage relationships, and close deals.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <ActionButton onClick={() => setBenchOpen(!benchOpen)} icon={UserCheck} variant="ghost">Resource Bench</ActionButton>
                        <ActionButton onClick={() => setCalculatorOpen(!calculatorOpen)} icon={DollarSign} variant="ghost">CPQ Calculator</ActionButton>
                        <ActionButton onClick={handleCRM_Sync} icon={TrendingUp} variant="primary">
                            {syncStatus || 'Sync CRM'}
                        </ActionButton>
                    </div>
                </header>

                {benchOpen && (
                    <GlassCard style={{ marginBottom: '20px', border: '1px solid #3b82f6' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                            <h3>Resource Bench & Rate Cards</h3>
                            <button onClick={() => setBenchOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><XCircle size={18} /></button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <h4 style={{ color: '#94a3b8', marginBottom: '10px' }}>Available Resources</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {benchResources.map(res => (
                                        <div key={res.id} style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', borderLeft: res.availability === 'Immediate' ? '3px solid #86efac' : '3px solid #fca5a5' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ fontWeight: '600' }}>{res.name}</span>
                                                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{res.availability}</span>
                                            </div>
                                            <p style={{ fontSize: '0.8rem', margin: '5px 0 0 0', color: '#cbd5e1' }}>{res.title} • {res.skills.join(', ')}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 style={{ color: '#94a3b8', marginBottom: '10px' }}>Rate Cards</h4>
                                <table style={{ width: '100%', fontSize: '0.9rem' }}>
                                    <tbody>
                                        {rateCards.map((rc, idx) => (
                                            <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <td style={{ padding: '8px 0' }}>{rc.role}</td>
                                                <td style={{ padding: '8px 0', textAlign: 'right' }}>${rc.rate}/hr</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </GlassCard>
                )}

                {calculatorOpen && (
                    <GlassCard style={{ marginBottom: '20px', border: '1px solid #D4AF37' }}>
                        <h3 style={{ marginBottom: '15px' }}>Quick Estimate Calculator</h3>
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-end' }}>
                            <div>
                                <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem' }}>Hours</label>
                                <input type="number" value={estimate.hours} onChange={e => setEstimate({ ...estimate, hours: +e.target.value })} style={{ padding: '8px', borderRadius: '6px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '80px' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem' }}>Rate ($/hr)</label>
                                <input type="number" value={estimate.rate} onChange={e => setEstimate({ ...estimate, rate: +e.target.value })} style={{ padding: '8px', borderRadius: '6px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '80px' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem' }}>Discount (%)</label>
                                <input type="number" value={estimate.discount} onChange={e => setEstimate({ ...estimate, discount: +e.target.value })} style={{ padding: '8px', borderRadius: '6px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '80px' }} />
                            </div>
                            <ActionButton onClick={handleCalculate} icon={CheckCircle}>Calculate</ActionButton>
                            <div style={{ marginLeft: 'auto' }}>
                                <span style={{ color: '#94a3b8', marginRight: '10px' }}>Total:</span>
                                <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>${(estimate.total || 0).toLocaleString()}</span>
                            </div>
                        </div>
                    </GlassCard>
                )}

                <AnimatePresence mode='wait'>
                    {activeTab === 'dashboard' && (
                        <motion.div
                            key="dashboard"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
                        >
                            {/* KPI Cards */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                                <GlassCard delay={0.1}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                                        <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(212, 175, 55, 0.2)', color: '#D4AF37' }}>
                                            <TrendingUp size={24} />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Total Revenue</div>
                                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>$482,000</div>
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#86efac', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <TrendingUp size={14} /> +12.5% from last month
                                    </div>
                                </GlassCard>

                                <GlassCard delay={0.2}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                                        <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8' }}>
                                            <Target size={24} />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Win Rate</div>
                                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>32%</div>
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Target: 35%</div>
                                </GlassCard>

                                <GlassCard delay={0.3}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                                        <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.2)', color: '#a855f7' }}>
                                            <Briefcase size={24} />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Open Deals</div>
                                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>24</div>
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#fca5a5' }}>3 requiring attention</div>
                                </GlassCard>

                                {/* V2: Renewal Widget */}
                                <GlassCard delay={0.4}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                                        <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(236, 72, 153, 0.2)', color: '#ec4899' }}>
                                            <Calendar size={24} />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Upcoming Renewals</div>
                                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>3</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <div style={{ fontSize: '0.85rem', color: '#cbd5e1', display: 'flex', justifyContent: 'space-between' }}>
                                            <span>TechCorp Inc</span>
                                            <span style={{ color: '#fde047' }}>15 Days</span>
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: '#cbd5e1', display: 'flex', justifyContent: 'space-between' }}>
                                            <span>EduStream</span>
                                            <span style={{ color: '#fde047' }}>28 Days</span>
                                        </div>
                                    </div>
                                </GlassCard>
                            </div>

                            {/* Scoping Action (Mock entry point) */}
                            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                                <ActionButton icon={FileText} onClick={() => setScopingOpen(true)}>Open Scoping Tool</ActionButton>
                            </div>

                            <GlassCard>
                                <h3 style={{ marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>Lost Deal Analysis</h3>
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                    {lostAnalysis.map((item, idx) => (
                                        <div key={idx} style={{ flex: 1, minWidth: '120px', padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', textAlign: 'center' }}>
                                            <h4 style={{ margin: '0 0 5px 0', color: '#fca5a5' }}>{item.percentage}%</h4>
                                            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>{item.reason}</p>
                                            <p style={{ fontSize: '0.7rem', color: '#475569', margin: '5px 0 0 0' }}>{item.count} Deals</p>
                                        </div>
                                    ))}
                                </div>
                            </GlassCard>

                            <GlassCard>
                                <h3 style={{ marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>Market Intelligence</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    {marketNews.map(news => (
                                        <div key={news.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                                            <div>
                                                <p style={{ fontWeight: '600', margin: 0, color: '#e2e8f0' }}>{news.title}</p>
                                                <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '2px 0 0 0' }}>{news.source} • {news.date}</p>
                                            </div>
                                            <span style={{ fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px', background: news.sentiment === 'Positive' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: news.sentiment === 'Positive' ? '#86efac' : '#fca5a5' }}>
                                                {news.sentiment}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </GlassCard>

                            {/* Recent Activity */}
                            <GlassCard>
                                <h3 style={{ marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>Recent Activity</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    {[...activities, ...leads.map(l => ({ type: 'Lead', subject: `New Lead: ${l.name}`, date: 'Just now', icon: Users })),
                                    ...deals.map(d => ({ type: 'Deal', subject: `Deal Updated: ${d.name}`, date: 'Today', icon: Briefcase }))]
                                        .slice(0, 5)
                                        .map((item, idx) => (
                                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                                                <div style={{ padding: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}>
                                                    {item.type === 'Call' ? <Phone size={16} /> : item.type === 'Email' ? <Mail size={16} /> : <CheckCircle size={16} />}
                                                </div>
                                                <div>
                                                    <p style={{ fontWeight: '600', margin: 0 }}>{item.subject}</p>
                                                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>{item.date}</p>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </GlassCard>
                        </motion.div>
                    )}

                    {activeTab === 'leads' && (
                        <motion.div
                            key="leads"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <div style={{ position: 'relative' }}>
                                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                    <input
                                        placeholder="Search leads..."
                                        style={{
                                            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                            padding: '10px 10px 10px 36px', borderRadius: '8px', color: '#fff', outline: 'none'
                                        }}
                                    />
                                </div>
                                <ActionButton onClick={handleImportLeads} icon={MoreHorizontal} variant="ghost">Import CSV</ActionButton>
                                <ActionButton onClick={() => setShowLeadForm(!showLeadForm)} icon={showLeadForm ? XCircle : Plus} variant="primary">
                                    {showLeadForm ? 'Cancel' : 'Add New Lead'}
                                </ActionButton>
                            </div>

                            {timelineLead && (
                                <GlassCard style={{ border: '1px solid #3b82f6' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                        <h3>Activity Timeline: {timelineLead.name}</h3>
                                        <button onClick={() => setTimelineLead(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><XCircle size={18} /></button>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '200px', overflowY: 'auto' }}>
                                        {leadTimeline.map(item => (
                                            <div key={item.id} style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                                <div style={{ minWidth: '80px', fontSize: '0.85rem', color: '#94a3b8' }}>{item.date}</div>
                                                <div style={{ padding: '8px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa' }}>
                                                    {item.type === 'Email' ? <Mail size={14} /> : item.type === 'Call' ? <Phone size={14} /> : <Users size={14} />}
                                                </div>
                                                <div>
                                                    <p style={{ margin: 0, fontSize: '0.9rem' }}>{item.summary}</p>
                                                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>By {item.by}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </GlassCard>
                            )}

                            {showLeadForm && (
                                <GlassCard>
                                    <form onSubmit={handleAddLead} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                        <input placeholder="Company Name" value={newLead.name} onChange={e => setNewLead({ ...newLead, name: e.target.value })} style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} required />
                                        <input placeholder="Contact Person" value={newLead.contact} onChange={e => setNewLead({ ...newLead, contact: e.target.value })} style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} required />
                                        <input placeholder="Email" type="email" value={newLead.email} onChange={e => setNewLead({ ...newLead, email: e.target.value })} style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} required />
                                        <input placeholder="Est. Value ($)" type="number" value={newLead.value} onChange={e => setNewLead({ ...newLead, value: e.target.value })} style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                                        <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end' }}>
                                            <ActionButton type="submit" icon={CheckCircle}>Save Lead</ActionButton>
                                        </div>
                                    </form>
                                </GlassCard>
                            )}

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                                {leads.map(lead => (
                                    <GlassCard key={lead.id} style={{ position: 'relative', overflow: 'hidden' }}>
                                        <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: lead.stage === 'New' ? '#3b82f6' : lead.stage === 'Qualified' ? '#10b981' : '#f59e0b' }}></div>
                                        <div style={{ paddingLeft: '10px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <div>
                                                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{lead.name}</h3>
                                                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '5px 0' }}>{lead.contact}</p>
                                                </div>
                                                <span style={{
                                                    fontSize: '0.75rem', padding: '4px 8px', borderRadius: '12px',
                                                    background: 'rgba(255,255,255,0.1)', color: '#fff'
                                                }}>{lead.stage}</span>
                                            </div>

                                            <div style={{ margin: '15px 0', padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Est. Value</span>
                                                <span style={{ fontWeight: 'bold' }}>${(lead.value || 0).toLocaleString()}</span>
                                            </div>

                                            {lead.isEnriched && (
                                                <div style={{ marginBottom: '10px', fontSize: '0.8rem', color: '#86efac' }}>
                                                    Verified • {lead.companySize} • {lead.location}
                                                </div>
                                            )}

                                            <div style={{ display: 'flex', gap: '5px', marginTop: '15px', flexWrap: 'wrap' }}>
                                                <ActionButton variant="ghost" icon={Phone} style={{ padding: '6px' }} />
                                                <ActionButton variant="ghost" icon={Mail} style={{ padding: '6px' }} onClick={async () => { await AdminService.sendEmail(lead.id, 'Intro_Template'); alert('Email Sent!'); }} />
                                                <ActionButton variant="ghost" icon={Clock} style={{ padding: '6px' }} onClick={() => handleViewTimeline(lead)} />
                                                <ActionButton variant="ghost" icon={MapPin} style={{ padding: '6px' }} onClick={() => handleRouteLead(lead)} />
                                                <ActionButton variant="ghost" icon={Target} style={{ padding: '6px' }} onClick={() => handleScoreLead(lead)} />
                                                {!lead.isEnriched && <ActionButton variant="ghost" icon={Search} style={{ padding: '6px' }} onClick={() => handleEnrichLead(lead)} />}

                                                <div style={{ flex: 1 }}></div>
                                                {lead.stage === 'New' && (
                                                    <ActionButton variant="success" icon={ArrowRight} onClick={() => updateLeadStage(lead, 'Qualified')}>Qualify</ActionButton>
                                                )}
                                                {lead.stage === 'Qualified' && (
                                                    <ActionButton variant="primary" icon={Briefcase} onClick={() => updateLeadStage(lead, 'Contacted')}>Convert</ActionButton>
                                                )}
                                            </div>
                                        </div>
                                    </GlassCard>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'bookings' && (
                        <motion.div
                            key="bookings"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
                        >
                            <GlassCard>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <h3>Scheduled Meetings</h3>
                                    <ActionButton onClick={refreshData} icon={RefreshCw} variant="ghost" style={{ padding: '8px 16px', fontSize: '0.85rem', background: '#D4AF37', color: '#0f172a', border: 'none', fontWeight: 'bold' }}>Refresh Data</ActionButton>
                                </div>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', color: '#e2e8f0' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                                                <th style={{ padding: '12px', color: '#94a3b8', fontSize: '0.9rem' }}>Client Name</th>
                                                <th style={{ padding: '12px', color: '#94a3b8', fontSize: '0.9rem' }}>Topic</th>
                                                <th style={{ padding: '12px', color: '#94a3b8', fontSize: '0.9rem' }}>Date & Time</th>
                                                <th style={{ padding: '12px', color: '#94a3b8', fontSize: '0.9rem' }}>Contact</th>
                                                <th style={{ padding: '12px', color: '#94a3b8', fontSize: '0.9rem' }}>Status</th>
                                                <th style={{ padding: '12px', color: '#94a3b8', fontSize: '0.9rem' }}>Link</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {meetings.length === 0 ? (
                                                <tr>
                                                    <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                                                        <Calendar size={48} style={{ opacity: 0.2, marginBottom: '20px' }} />
                                                        <p>No meetings scheduled.</p>
                                                    </td>
                                                </tr>
                                            ) : (
                                                meetings.map(meeting => (
                                                    <tr key={meeting.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                        <td style={{ padding: '12px' }}>{meeting.name}</td>
                                                        <td style={{ padding: '12px' }}>{meeting.topic}</td>
                                                        <td style={{ padding: '12px' }}>{meeting.date} at {meeting.time}</td>
                                                        <td style={{ padding: '12px', fontSize: '0.85rem' }}>
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                                <span>{meeting.mobile}</span>
                                                                <span style={{ color: '#94a3b8' }}>{meeting.email}</span>
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: '12px' }}>
                                                            <span style={{
                                                                padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem',
                                                                background: meeting.status === 'Scheduled' ? 'rgba(212, 175, 55, 0.2)' : 'rgba(148, 163, 184, 0.2)',
                                                                color: meeting.status === 'Scheduled' ? '#D4AF37' : '#94a3b8'
                                                            }}>
                                                                {meeting.status}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: '12px' }}>
                                                            {meeting.link ? (
                                                                <a href={meeting.link} target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                                    Link <ExternalLink size={14} />
                                                                </a>
                                                            ) : <span style={{ color: '#64748b' }}>-</span>}
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </GlassCard>
                        </motion.div>
                    )}

                    {activeTab === 'queries' && (
                        <motion.div
                            key="queries"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
                        >
                            <GlassCard>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <h3>Contact Queries</h3>
                                    <ActionButton onClick={refreshData} icon={RefreshCw} variant="ghost" style={{ padding: '8px 16px', fontSize: '0.85rem', background: '#D4AF37', color: '#0f172a', border: 'none', fontWeight: 'bold' }}>Refresh Data</ActionButton>
                                </div>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', color: '#e2e8f0' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                                                <th style={{ padding: '12px', color: '#94a3b8', fontSize: '0.9rem' }}>Name</th>
                                                <th style={{ padding: '12px', color: '#94a3b8', fontSize: '0.9rem' }}>Email</th>
                                                <th style={{ padding: '12px', color: '#94a3b8', fontSize: '0.9rem' }}>Date</th>
                                                <th style={{ padding: '12px', color: '#94a3b8', fontSize: '0.9rem' }}>Message</th>
                                                <th style={{ padding: '12px', color: '#94a3b8', fontSize: '0.9rem' }}>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {queries.length === 0 ? (
                                                <tr>
                                                    <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                                                        <MessageSquare size={48} style={{ opacity: 0.2, marginBottom: '20px' }} />
                                                        <p>No queries received yet.</p>
                                                    </td>
                                                </tr>
                                            ) : (
                                                queries.map(query => (
                                                    <tr key={query.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                        <td style={{ padding: '12px' }}>{query.name}</td>
                                                        <td style={{ padding: '12px' }}>{query.email}</td>
                                                        <td style={{ padding: '12px' }}>{query.date}</td>
                                                        <td style={{ padding: '12px', maxWidth: '300px' }}>
                                                            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={query.message}>
                                                                {query.message}
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: '12px' }}>
                                                            <span style={{
                                                                padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem',
                                                                background: query.status === 'New' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(148, 163, 184, 0.2)',
                                                                color: query.status === 'New' ? '#60a5fa' : '#94a3b8'
                                                            }}>
                                                                {query.status || 'New'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </GlassCard>
                        </motion.div>
                    )}

                    {activeTab === 'deals' && (
                        <motion.div
                            key="deals"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
                        >
                            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3>Active Deals</h3>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <ActionButton variant="ghost" onClick={() => setPipelineView('list')} icon={Filter}>List</ActionButton>
                                    <ActionButton variant="ghost" onClick={() => setPipelineView('kanban')} icon={LayoutDashboard}>Kanban</ActionButton>
                                    <ActionButton onClick={() => console.log('New Deal')} icon={Plus}>New Deal</ActionButton>
                                </div>
                            </div>

                            {pipelineView === 'list' ? (
                                <GlassCard style={{ padding: '0', overflow: 'hidden' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff' }}>
                                        <thead>
                                            <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
                                                <th style={{ padding: '15px' }}>Deal Name</th>
                                                <th style={{ padding: '15px' }}>Client</th>
                                                <th style={{ padding: '15px' }}>Stage</th>
                                                <th style={{ padding: '15px' }}>Probability</th>
                                                <th style={{ padding: '15px' }}>Close Date</th>
                                                <th style={{ padding: '15px', textAlign: 'right' }}>Amount</th>
                                                <th style={{ padding: '15px', textAlign: 'center' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {deals.map(deal => (
                                                <tr key={deal.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                    <td style={{ padding: '15px', fontWeight: 'bold' }}>{deal.name}</td>
                                                    <td style={{ padding: '15px', color: '#cbd5e1' }}>{deal.client}</td>
                                                    <td style={{ padding: '15px' }}>
                                                        <span style={{
                                                            padding: '4px 10px', borderRadius: '12px', fontSize: '0.85rem',
                                                            background: deal.stage === 'Won' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(212, 175, 55, 0.2)',
                                                            color: deal.stage === 'Won' ? '#86efac' : '#fde047'
                                                        }}>{deal.stage}</span>
                                                    </td>
                                                    <td style={{ padding: '15px' }}>{deal.probability}%</td>
                                                    <td style={{ padding: '15px', color: '#94a3b8' }}>{deal.closeDate}</td>
                                                    <td style={{ padding: '15px', textAlign: 'right', fontWeight: 'bold' }}>${deal.amount.toLocaleString()}</td>
                                                    <td style={{ padding: '15px', textAlign: 'center', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                        {deal.stage !== 'Won' && (
                                                            <>
                                                                <ActionButton variant="ghost" icon={FileText} style={{ padding: '6px 12px' }} onClick={() => handleOpenProposal(deal)} title="Create Proposal">Proposal</ActionButton>
                                                                <ActionButton variant="primary" icon={CheckCircle} style={{ padding: '6px 12px' }} onClick={() => handleSignProposal(deal)} title="Mark as Signed">Sign</ActionButton>
                                                            </>
                                                        )}
                                                        {deal.stage === 'Won' && (
                                                            <>
                                                                <ActionButton variant="success" icon={File} style={{ padding: '6px 12px' }} onClick={() => handleKickoff(deal)} title="Start Project Kickoff">Kickoff</ActionButton>
                                                                <ActionButton variant="ghost" icon={DollarSign} style={{ padding: '6px 12px' }} onClick={() => handleOpenBill(deal)} title="Generate Invoice">Invoice</ActionButton>
                                                                <ActionButton variant="ghost" icon={ArrowRight} style={{ padding: '6px 12px' }} onClick={async () => { if (await AdminService.exportToERP(deal.id)) alert('Synced to ERP!'); }} title="Export to QuickBooks">ERP</ActionButton>
                                                            </>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </GlassCard>
                            ) : (
                                <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px' }}>
                                    {['Discovery', 'Scoping', 'Proposal', 'Negotiation', 'Won'].map(stage => (
                                        <div key={stage} style={{ minWidth: '300px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '15px' }}>
                                            <h4 style={{ marginBottom: '15px', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>{stage}</h4>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                                {deals.filter(d => d.stage === stage || (stage === 'Discovery' && !['Proposal Sent', 'Negotiation', 'Won'].includes(d.stage))).map(deal => (
                                                    <GlassCard key={deal.id} style={{ padding: '15px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                                        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{deal.name}</div>
                                                        <div style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '10px' }}>{deal.client}</div>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <span style={{ color: '#D4AF37', fontWeight: 'bold' }}>${deal.amount.toLocaleString()}</span>
                                                            <ActionButton variant="ghost" style={{ padding: '4px' }} icon={MoreHorizontal} />
                                                        </div>
                                                    </GlassCard>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Proposal Modal */}
                    {proposalModalOpen && selectedDeal && (
                        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
                            <GlassCard style={{ width: '500px', border: '1px solid #D4AF37' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                    <h3>Create Proposal: {selectedDeal.name}</h3>
                                    <button onClick={() => setProposalModalOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><XCircle size={20} /></button>
                                </div>
                                <form onSubmit={handleSubmitProposal} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    <div>
                                        <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.9rem', marginBottom: '5px' }}>Proposal Title</label>
                                        <input value={proposalForm.title} onChange={e => setProposalForm({ ...proposalForm, title: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} required />
                                    </div>
                                    <div style={{ padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', marginBottom: '15px' }}>
                                        <h4 style={{ margin: '0 0 10px 0', color: '#86efac', fontSize: '0.9rem' }}>Estimation Engine</h4>

                                        {/* Service Package */}
                                        <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '4px' }}>Base Service Package</label>
                                        <select onChange={e => {
                                            const item = serviceCatalog.find(p => p.id === e.target.value);
                                            if (item) {
                                                const currentInfra = proposalForm.infraPrice || 0;
                                                const currentServices = proposalForm.servicePrice || 0;
                                                setProposalForm({ ...proposalForm, basePrice: item.price, infraPrice: currentInfra, servicePrice: currentServices, amount: item.price + currentInfra + currentServices, notes: (proposalForm.notes || '') + `\nIncluded: ${item.name}` });
                                            }
                                        }} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', marginBottom: '10px' }}>
                                            <option value="">Select Package...</option>
                                            {serviceCatalog.filter(i => i.type !== 'Monthly' && !i.id.startsWith('i')).map(pkg => (
                                                <option key={pkg.id} value={pkg.id}>{pkg.name} - ${pkg.price}</option>
                                            ))}
                                        </select>

                                        {/* Infrastructure */}
                                        <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '4px' }}>Cloud Infrastructure (Monthly)</label>
                                        <select onChange={e => {
                                            const item = serviceCatalog.find(p => p.id === e.target.value);
                                            if (item) {
                                                const currentBase = proposalForm.basePrice || 0;
                                                const currentServices = proposalForm.servicePrice || 0;
                                                setProposalForm({ ...proposalForm, basePrice: currentBase, infraPrice: item.price, servicePrice: currentServices, amount: currentBase + item.price + currentServices, notes: (proposalForm.notes || '') + `\nInfra: ${item.name}` });
                                            }
                                        }} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', marginBottom: '10px' }}>
                                            <option value="">Select Infrastructure...</option>
                                            {serviceCatalog.filter(i => i.id.startsWith('i')).map(pkg => (
                                                <option key={pkg.id} value={pkg.id}>{pkg.name} - ${pkg.price}/mo</option>
                                            ))}
                                        </select>

                                        {/* Professional Services */}
                                        <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '4px' }}>Add Professional Services (Hours)</label>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <select style={{ flex: 2, padding: '8px', borderRadius: '6px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} id="roleSelect">
                                                {rateCards.map(r => <option key={r.role} value={r.rate}>{r.role} (${r.rate}/hr)</option>)}
                                            </select>
                                            <input type="number" placeholder="Hrs" style={{ flex: 1, padding: '8px', borderRadius: '6px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} id="hoursInput" />
                                            <ActionButton variant="ghost" icon={Plus} type="button" onClick={() => {
                                                const rate = parseFloat(document.getElementById('roleSelect').value);
                                                const hours = parseFloat(document.getElementById('hoursInput').value) || 0;
                                                const cost = rate * hours;
                                                const currentBase = proposalForm.basePrice || 0;
                                                const currentInfra = proposalForm.infraPrice || 0;
                                                const currentServices = (proposalForm.servicePrice || 0) + cost;
                                                setProposalForm({ ...proposalForm, basePrice: currentBase, infraPrice: currentInfra, servicePrice: currentServices, amount: currentBase + currentInfra + currentServices });
                                            }}>Add</ActionButton>
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.9rem', marginBottom: '5px' }}>Scope & Notes</label>
                                        <textarea value={proposalForm.notes} onChange={e => setProposalForm({ ...proposalForm, notes: e.target.value })} style={{ width: '100%', height: '80px', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                        <div>
                                            <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.9rem', marginBottom: '5px' }}>Total Amount ($)</label>
                                            <input type="number" value={proposalForm.amount} readOnly style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', cursor: 'not-allowed' }} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.9rem', marginBottom: '5px' }}>Discount (%)</label>
                                            <input type="number" value={proposalForm.discount} onChange={e => setProposalForm({ ...proposalForm, discount: parseFloat(e.target.value) })} style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                                        </div>
                                    </div>
                                    {proposalForm.discount > 15 && (
                                        <div style={{ padding: '10px', background: 'rgba(220, 38, 38, 0.2)', color: '#fca5a5', borderRadius: '8px', fontSize: '0.9rem' }}>
                                            High Discount Warning: Manager Approval Required.
                                        </div>
                                    )}
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                                        <ActionButton onClick={() => setProposalModalOpen(false)} variant="ghost">Cancel</ActionButton>
                                        <ActionButton type="submit" variant={proposalForm.discount > 15 ? 'danger' : 'primary'} icon={CheckCircle}>
                                            {proposalForm.discount > 15 ? 'Request Approval' : 'Create & Send'}
                                        </ActionButton>
                                    </div>
                                </form>
                            </GlassCard>
                        </div>
                    )}

                    {activeTab === 'bench' && (
                        <motion.div key="bench" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                            {benchResources.map(resource => (
                                <GlassCard key={resource.id}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <h3 style={{ margin: 0 }}>{resource.name}</h3>
                                        <span style={{ padding: '4px 8px', borderRadius: '8px', background: resource.availability === 'Available Now' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(234, 179, 8, 0.2)', color: resource.availability === 'Available Now' ? '#86efac' : '#fde047', fontSize: '0.8rem' }}>
                                            {resource.availability}
                                        </span>
                                    </div>
                                    <p style={{ color: '#94a3b8', margin: '5px 0' }}>{resource.role}</p>
                                    <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
                                        <span style={{ padding: '4px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', fontSize: '0.75rem' }}>{resource.skill}</span>
                                    </div>
                                    <div style={{ marginTop: '15px' }}>
                                        <ActionButton variant="primary" icon={CheckCircle} style={{ width: '100%', justifyContent: 'center' }} onClick={() => alert(`Reserved ${resource.name}!`)}>Reserve Resource</ActionButton>
                                    </div>
                                </GlassCard>
                            ))}
                        </motion.div>
                    )}

                    {activeTab === 'content' && (
                        <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                <input placeholder="Search Case Studies..." style={{ flex: 1, padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                                <ActionButton icon={Search}>Search</ActionButton>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                                {caseStudies.map(study => (
                                    <GlassCard key={study.id}>
                                        <h3 style={{ color: '#D4AF37', marginBottom: '5px' }}>{study.title}</h3>
                                        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{study.industry} • {study.tech}</p>
                                        <div style={{ margin: '15px 0', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                                            <strong style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Outcome:</strong>
                                            <span style={{ color: '#86efac' }}>{study.outcome}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <ActionButton variant="ghost" icon={FileText} style={{ flex: 1 }} onClick={() => alert('Opening PDF...')}>View PDF</ActionButton>
                                            <ActionButton variant="primary" icon={Mail} style={{ flex: 1 }} onClick={() => alert('Shared via Email!')}>Share</ActionButton>
                                        </div>
                                    </GlassCard>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'ops' && (
                        <motion.div key="ops" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <GlassCard>
                                <h3>Partner Performance</h3>
                                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px', color: '#fff' }}>
                                    <thead style={{ background: 'rgba(255,255,255,0.05)' }}>
                                        <tr>
                                            <th style={{ padding: '10px', textAlign: 'left' }}>Partner</th>
                                            <th style={{ padding: '10px', textAlign: 'center' }}>Leads</th>
                                            <th style={{ padding: '10px', textAlign: 'center' }}>Converted</th>
                                            <th style={{ padding: '10px', textAlign: 'right' }}>Commission ($)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {partnerStats.map((partner, idx) => (
                                            <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <td style={{ padding: '10px' }}>{partner.name}</td>
                                                <td style={{ padding: '10px', textAlign: 'center' }}>{partner.leads}</td>
                                                <td style={{ padding: '10px', textAlign: 'center' }}>{partner.converted}</td>
                                                <td style={{ padding: '10px', textAlign: 'right' }}>{partner.commission}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </GlassCard>
                            <GlassCard>
                                <h3>Document Vault</h3>
                                <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                                    <FileText size={48} style={{ marginBottom: '15px', color: '#38bdf8' }} />
                                    <p style={{ fontSize: '1.1rem' }}>Drag and drop MSAs, NDAs, or SOWs here.</p>
                                    <ActionButton variant="ghost" style={{ marginTop: '10px' }}>Browse Files</ActionButton>
                                </div>
                            </GlassCard>
                        </motion.div>
                    )}

                    {/* Bill Generation Modal */}
                    {billModalOpen && selectedDeal && (
                        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
                            <GlassCard style={{ width: '500px', border: '1px solid #86efac' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                    <h3>Generate Invoice: {selectedDeal.client}</h3>
                                    <button onClick={() => setBillModalOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><XCircle size={20} /></button>
                                </div>
                                <form onSubmit={handleSubmitBill} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                        <div>
                                            <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.9rem', marginBottom: '5px' }}>Invoice Date</label>
                                            <input type="date" value={billForm.date} onChange={e => setBillForm({ ...billForm, date: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} required />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.9rem', marginBottom: '5px' }}>Due Date</label>
                                            <input type="date" value={billForm.dueDate} onChange={e => setBillForm({ ...billForm, dueDate: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} required />
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.9rem', marginBottom: '5px' }}>Billing Address</label>
                                        <textarea value={billForm.address} onChange={e => setBillForm({ ...billForm, address: e.target.value })} style={{ width: '100%', height: '80px', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                                    </div>
                                    <div style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600' }}>
                                            <span>Total Amount:</span>
                                            <span>${selectedDeal.amount.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                                        <ActionButton onClick={() => setBillModalOpen(false)} variant="ghost">Cancel</ActionButton>
                                        <ActionButton type="submit" variant="success" icon={DollarSign}>Generate Bill</ActionButton>
                                    </div>
                                </form>
                            </GlassCard>
                        </div>
                    )}

                    {/* Scoping Modal */}
                    {scopingOpen && (
                        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
                            <GlassCard style={{ width: '600px', border: '1px solid #38bdf8', maxHeight: '80vh', overflowY: 'auto' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                    <h3>Technical Scoping Tool</h3>
                                    <button onClick={() => setScopingOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><XCircle size={20} /></button>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    {scopingTemplates.map(template => (
                                        <div key={template.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px' }}>
                                            <h4 style={{ color: '#38bdf8', marginBottom: '10px' }}>{template.name}</h4>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                                {template.fields.map(field => (
                                                    <div key={field}>
                                                        <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>{field}</label>
                                                        <input type="text" style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} placeholder="Enter details..." />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                                        <ActionButton onClick={() => setScopingOpen(false)} variant="ghost">Close</ActionButton>
                                        <ActionButton onClick={() => { alert('Scoping Saved & Sent to Solutions Architect!'); setScopingOpen(false); }} variant="primary" icon={CheckCircle}>Save & Request Review</ActionButton>
                                    </div>
                                </div>
                            </GlassCard>
                        </div>
                    )}

                </AnimatePresence>
            </div>
        </div >
    );

};

export default SalesPortal;
