import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, DollarSign, CreditCard, PieChart, FileText,
    LogOut, TrendingUp, TrendingDown, CheckCircle, XCircle, ArrowUpRight,
    Users, Shield, Activity, Landmark, Plus, Trash2, Printer, Repeat,
    Briefcase, PlayCircle, Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// import { useReactToPrint } from 'react-to-print'; // Removed unused dependency

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

// --- Invoice Template Component ---
const InvoiceDocument = React.forwardRef(({ invoice }, ref) => (
    <div ref={ref} style={{
        background: '#fff', color: '#000', padding: '40px', maxWidth: '800px', margin: '0 auto',
        fontFamily: "'Inter', sans-serif", borderRadius: '8px', display: 'none' // Hidden by default, shown in print/modal
    }} className="invoice-print-view">
        <style>{`
            @media print {
                body * { visibility: hidden; }
                .invoice-print-view, .invoice-print-view * { visibility: visible; display: block !important; }
                .invoice-print-view { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 20px; box-shadow: none; }
            }
        `}</style>

        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #D4AF37', paddingBottom: '20px', marginBottom: '30px' }}>
            <div>
                <h1 style={{ color: '#D4AF37', margin: 0, fontSize: '2rem' }}>INVOICE</h1>
                <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '0.9rem' }}>#{invoice.id}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
                <h2 style={{ margin: 0, fontSize: '1.2rem' }}>GoldTech IT Solutions</h2>
                <p style={{ margin: '5px 0', fontSize: '0.8rem', color: '#666' }}>123 Tech Park, Innovation Way<br />Silicon Valley, CA, 94000<br />support@goldtech.com</p>
            </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
            <div>
                <h3 style={{ fontSize: '0.9rem', color: '#999', uppercase: 'uppercase', letterSpacing: '1px' }}>Bill To:</h3>
                <h2 style={{ margin: '5px 0', fontSize: '1.1rem' }}>{invoice.client}</h2>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>Client ID: GT-{invoice.client.substring(0, 3).toUpperCase()}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
                <div style={{ marginBottom: '10px' }}>
                    <span style={{ color: '#999', fontSize: '0.9rem', marginRight: '15px' }}>Date:</span>
                    <span style={{ fontWeight: 'bold' }}>{invoice.date}</span>
                </div>
                <div>
                    <span style={{ color: '#999', fontSize: '0.9rem', marginRight: '15px' }}>Due Date:</span>
                    <span style={{ fontWeight: 'bold' }}>{invoice.dueDate || 'Upon Receipt'}</span>
                </div>
            </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
            <thead>
                <tr style={{ background: '#f8f9fa', borderBottom: '1px solid #eee' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.85rem', color: '#666' }}>Description</th>
                    <th style={{ padding: '12px', textAlign: 'right', fontSize: '0.85rem', color: '#666' }}>Qty</th>
                    <th style={{ padding: '12px', textAlign: 'right', fontSize: '0.85rem', color: '#666' }}>Rate</th>
                    <th style={{ padding: '12px', textAlign: 'right', fontSize: '0.85rem', color: '#666' }}>Amount</th>
                </tr>
            </thead>
            <tbody>
                {invoice.items && invoice.items.length > 0 ? invoice.items.map((item, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '12px', fontSize: '0.9rem' }}>{item.desc}</td>
                        <td style={{ padding: '12px', textAlign: 'right', fontSize: '0.9rem' }}>{item.qty}</td>
                        <td style={{ padding: '12px', textAlign: 'right', fontSize: '0.9rem' }}>${item.rate ? item.rate.toLocaleString() : '0'}</td>
                        <td style={{ padding: '12px', textAlign: 'right', fontSize: '0.9rem' }}>${(item.rate * item.qty).toLocaleString()}</td>
                    </tr>
                )) : (
                    <tr style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '12px', fontSize: '0.9rem' }}>General Services</td>
                        <td style={{ padding: '12px', textAlign: 'right', fontSize: '0.9rem' }}>1</td>
                        <td style={{ padding: '12px', textAlign: 'right', fontSize: '0.9rem' }}>${invoice.amount ? invoice.amount.toLocaleString() : '0'}</td>
                        <td style={{ padding: '12px', textAlign: 'right', fontSize: '0.9rem' }}>${invoice.amount ? invoice.amount.toLocaleString() : '0'}</td>
                    </tr>
                )}
            </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: '250px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem' }}>
                    <span style={{ color: '#666' }}>Subtotal</span>
                    <span>${invoice.amount.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem' }}>
                    <span style={{ color: '#666' }}>Tax (18% GST)</span>
                    {/* Simplified tax calc if not present */}
                    <span>${(invoice.tax || invoice.amount * 0.18).toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #eee', paddingTop: '10px', fontSize: '1.1rem', fontWeight: 'bold' }}>
                    <span>Total</span>
                    <span>${(invoice.total || invoice.amount * 1.18).toLocaleString()}</span>
                </div>
            </div>
        </div>

        <div style={{ marginTop: '60px', borderTop: '1px solid #eee', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: '#999' }}>
                <p>Payment Terms: {invoice.paymentTerms || 'Net 30'}</p>
                <p>Thank you for your business.</p>
            </div>
            <div style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: '5px', fontFamily: 'cursive', fontSize: '1.2rem', color: '#000' }}>Fiona Finance</div>
                <div style={{ borderTop: '1px solid #000', width: '150px' }}></div>
                <span style={{ fontSize: '0.7rem', color: '#666' }}>Authorized Signature</span>
            </div>
        </div>
    </div>
));

const FinancePortal = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');

    // Data State
    const [stats, setStats] = useState({});
    const [invoices, setInvoices] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [corpCards, setCorpCards] = useState([]);
    const [auditLog, setAuditLog] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [milestones, setMilestones] = useState([]);

    // Core Accounting State
    const [glAccounts, setGlAccounts] = useState([]);
    const [arAging, setArAging] = useState({ '0-30': 0, '31-60': 0, '61-90': 0, '90+': 0 });
    const [newTransaction, setNewTransaction] = useState({ description: '', entries: [{ accountCode: '', debit: 0, credit: 0 }, { accountCode: '', debit: 0, credit: 0 }] });

    // IT Finance State
    const [projectProfitability, setProjectProfitability] = useState([]);
    const [assets, setAssets] = useState([]);
    const [cloudBills, setCloudBills] = useState([]);
    const [resourceCosting, setResourceCosting] = useState([]);

    // Advanced Finance State (New)
    const [apAging, setApAging] = useState({ '0-30': 0, '31-60': 0, '61-90': 0, '90+': 0 });
    const [deferredRevenue, setDeferredRevenue] = useState([]);
    const [projectBudgets, setProjectBudgets] = useState([]);
    const [currency, setCurrency] = useState('USD');
    const [exchangeRates, setExchangeRates] = useState({ USD: 1, INR: 83.5 });
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Helper for Currency Conversion
    const formatCurrency = (amount) => {
        const rate = exchangeRates[currency] || 1;
        const value = amount * rate;
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(value);
    };

    // Financial Reports State (Fix for undefined crash)
    const [reports, setReports] = useState({
        pl: { revenue: 0, expenses: 0, netProfit: 0 },
        bs: { assets: { cash: 0, receivables: 0 }, liabilities: { payables: 0, taxPayable: 0 }, equity: 0 },
        tax: { collected: 0, paid: 0, netPayable: 0 }
    });

    // UI State
    const [showInvoiceForm, setShowInvoiceForm] = useState(false);
    const [newInvoice, setNewInvoice] = useState({ client: '', amount: '', items: [] });
    const [showVendorForm, setShowVendorForm] = useState(false);
    const [newVendor, setNewVendor] = useState({ name: '', category: '', contact: '', paymentTerms: 'Net 30' });
    const [billingRunning, setBillingRunning] = useState(false);
    const [showSubForm, setShowSubForm] = useState(false);
    const [newSub, setNewSub] = useState({ client: '', plan: '', amount: '', billingCycle: 'Monthly' });
    const [viewInvoice, setViewInvoice] = useState(null); // Selected invoice for viewing

    const invoiceRef = useRef();

    useEffect(() => {
        const loadInitialData = async () => {
            await refreshData();
        };
        loadInitialData();
    }, []);

    const refreshData = async () => {
        if (isRefreshing) return;
        setIsRefreshing(true);
        try {
            const [
                st, invs, vends, cards, logs, exps, subs, miles,
                accounts, aging, profit, asts, clouds, costs,
                ap, deferred, budgets, rates,
                reportPL, reportBS, reportTax
            ] = await Promise.all([
                AdminService.getFinancialStats(),
                AdminService.getInvoices(),
                AdminService.getVendors ? AdminService.getVendors() : [],
                AdminService.getCorporateCards ? AdminService.getCorporateCards() : [],
                AdminService.getAuditLog ? AdminService.getAuditLog() : [],
                AdminService.getExpenseRequests ? AdminService.getExpenseRequests() : [],
                AdminService.getSubscriptions ? AdminService.getSubscriptions() : [],
                AdminService.getUnbilledMilestones ? AdminService.getUnbilledMilestones() : [],
                AdminService.getGLAccounts ? AdminService.getGLAccounts() : [],
                AdminService.getARAgingReport ? AdminService.getARAgingReport() : {},
                AdminService.getProjectProfitability ? AdminService.getProjectProfitability() : [],
                AdminService.getAssets ? AdminService.getAssets() : [],
                AdminService.getCloudBills ? AdminService.getCloudBills() : [],
                AdminService.getResourceCosting ? AdminService.getResourceCosting() : [],
                AdminService.getPayablesAging ? AdminService.getPayablesAging() : {},
                AdminService.getDeferredRevenue ? AdminService.getDeferredRevenue() : [],
                AdminService.getProjectBudgets ? AdminService.getProjectBudgets() : [],
                AdminService.getExchangeRates ? AdminService.getExchangeRates() : { USD: 1 },
                AdminService.getFinancialReport ? AdminService.getFinancialReport('PL') : null,
                AdminService.getFinancialReport ? AdminService.getFinancialReport('BS') : null,
                AdminService.getFinancialReport ? AdminService.getFinancialReport('Tax') : null
            ]);

            setStats(st || {});
            setInvoices(invs || []);
            setVendors(vends || []);
            setCorpCards(cards || []);
            setAuditLog(logs || []);
            setExpenses(exps || []);
            setSubscriptions(subs || []);
            setMilestones(miles || []);
            setGlAccounts(accounts || []);
            setArAging(aging || {});
            setProjectProfitability(profit || []);
            setAssets(asts || []);
            setCloudBills(clouds || []);
            setResourceCosting(costs || []);
            setApAging(ap || {});
            setDeferredRevenue(deferred || []);
            setProjectBudgets(budgets || []);
            setExchangeRates(rates || { USD: 1 });
            setReports({
                pl: reportPL || { revenue: 0, expenses: 0, netProfit: 0 },
                bs: reportBS || { assets: { cash: 0, receivables: 0 }, liabilities: { payables: 0, taxPayable: 0 }, equity: 0 },
                tax: reportTax || { collected: 0, paid: 0, netPayable: 0 }
            });
        } catch (error) {
            console.error("FinancePortal: Error refreshing data", error);
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleLogout = () => {
        navigate('/');
    };

    // --- Actions ---
    const handleCreateInvoice = async (e) => {
        e.preventDefault();
        await AdminService.createInvoice({
            client: newInvoice.client,
            amount: parseFloat(newInvoice.amount),
            dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Net 15 logic
        });
        setShowInvoiceForm(false);
        setNewInvoice({ client: '', amount: '', items: [] });
        await refreshData();
    };

    const handleRecordPayment = async (id) => {
        if (window.confirm("Simulate Razorpay Payment Gateway Success?")) {
            await AdminService.recordPayment(id, 'Razorpay');
            await refreshData();
        }
    };

    const handleAddVendor = async (e) => {
        e.preventDefault();
        await AdminService.addVendor(newVendor);
        setShowVendorForm(false);
        setNewVendor({ name: '', category: '', contact: '', paymentTerms: 'Net 30' });
        await refreshData();
    };

    const handleExpenseAction = async (expense, status) => {
        await AdminService.updateExpense({ ...expense, status });
        await refreshData();
    };

    const handleRunBillingCycle = async () => {
        setBillingRunning(true);
        setTimeout(async () => {
            const result = await AdminService.runBillingCycle();
            setBillingRunning(false);
            await refreshData();
            alert(`Billing Cycle Complete! Generated ${result.count} Invoices.`);
        }, 2000);
    };

    const handleDraftMilestoneInvoice = async (milestone) => {
        const success = await AdminService.createInvoiceFromMilestone(milestone.id);
        if (success) {
            await refreshData();
            alert(`Invoice drafted for ${milestone.project} - ${milestone.phase}`);
        }
    };

    const handleAddSubscription = async (e) => {
        e.preventDefault();
        await AdminService.addSubscription({
            ...newSub,
            amount: parseFloat(newSub.amount)
        });
        setShowSubForm(false);
        setNewSub({ client: '', plan: '', amount: '', billingCycle: 'Monthly' });
        await refreshData();
    };

    const handlePrintInvoice = () => {
        window.print();
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

    const StatCard = ({ title, value, icon: Icon, color, delay, subtext }) => (
        <FloatingWidget delay={delay}>
            <GlassCard style={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ background: `rgba(${color}, 0.2)`, padding: '12px', borderRadius: '50%', marginBottom: '10px' }}>
                    <Icon size={24} color={`rgb(${color})`} />
                </div>
                <h3 style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '5px' }}>{title}</h3>
                <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fff' }}>{value}</p>
                {subtext && <p style={{ fontSize: '0.8rem', color: (typeof subtext === 'string' && subtext.includes('+')) ? '#86efac' : '#fca5a5' }}>{subtext}</p>}
            </GlassCard>
        </FloatingWidget>
    );

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#0f172a', fontFamily: "'Outfit', sans-serif" }}>

            {/* INVOICE MODAL OVERLAY */}
            {viewInvoice && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex',
                    justifyContent: 'center', alignItems: 'center', overflowY: 'auto',
                    padding: '20px'
                }}>
                    <div style={{ width: '100%', maxWidth: '850px' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px', gap: '10px' }}>
                            <ActionButton onClick={handlePrintInvoice} icon={Printer} variant="primary">Print Invoice</ActionButton>
                            <ActionButton onClick={() => setViewInvoice(null)} icon={XCircle} variant="danger">Close</ActionButton>
                        </div>
                        {/* The Printable Invoice Document */}
                        <div style={{ display: 'block' }}> {/* Force display block for viewing */}
                            <InvoiceDocument invoice={viewInvoice} ref={invoiceRef} /> {/* Reusing component but overriding display style locally via CSS/Class if needed, actually just made it display:block via wrapper or handle via CSS */}
                        </div>
                        <style>{`
                            .invoice-print-view { display: block !important; } /* Force show in modal */
                        `}</style>
                    </div>
                </div>
            )}


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
                        <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.4rem', letterSpacing: '1px' }}>FIN</span>
                    </div>
                </div>

                <div style={{ marginBottom: '30px', textAlign: 'center' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#D4AF37', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', color: '#0f172a' }}>F</div>
                    <h3 style={{ color: '#fff', margin: 0 }}>Fiona Finance</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>CFO</p>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                    <button onClick={() => setActiveTab('dashboard')} style={navLinkStyle(activeTab === 'dashboard')}>
                        <LayoutDashboard size={18} /> Financial Health
                    </button>
                    <button onClick={() => setActiveTab('billing')} style={navLinkStyle(activeTab === 'billing')}>
                        <Repeat size={18} /> Billing System
                    </button>
                    <button onClick={() => setActiveTab('receivables')} style={navLinkStyle(activeTab === 'receivables')}>
                        <ArrowUpRight size={18} /> Accounts Receivable
                    </button>
                    <button onClick={() => setActiveTab('payables')} style={navLinkStyle(activeTab === 'payables')}>
                        <CreditCard size={18} /> Accounts Payable
                    </button>
                    <button onClick={() => setActiveTab('compliance')} style={navLinkStyle(activeTab === 'compliance')}>
                        <Shield size={18} /> Compliance & Reports
                    </button>
                    <button onClick={() => setActiveTab('gl')} style={navLinkStyle(activeTab === 'gl')}>
                        <Landmark size={18} /> General Ledger
                    </button>
                    <button onClick={() => setActiveTab('profitability')} style={navLinkStyle(activeTab === 'profitability')}>
                        <Activity size={18} /> IT Profitability
                    </button>
                    <button onClick={() => setActiveTab('assets')} style={navLinkStyle(activeTab === 'assets')}>
                        <Briefcase size={18} /> Assets
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
                        {activeTab === 'dashboard' && 'Financial Overview'}
                        {activeTab === 'billing' && 'Billing System'}
                        {activeTab === 'receivables' && 'Accounts Receivable'}
                        {activeTab === 'payables' && 'Accounts Payable'}
                        {activeTab === 'payables' && 'Accounts Payable'}
                        {activeTab === 'compliance' && 'Compliance & Reporting'}
                        {activeTab === 'gl' && 'General Ledger'}
                        {activeTab === 'profitability' && 'Project Profitability'}
                        {activeTab === 'assets' && 'Asset Management'}
                    </h1>
                    <p style={{ color: '#94a3b8' }}>Real-time financial insights and controls.</p>
                </header>

                {/* Currency Toggle */}
                <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#D4AF37', border: '1px solid rgba(212, 175, 55, 0.3)', outline: 'none', cursor: 'pointer' }}
                >
                    <option value="USD">USD ($)</option>
                    <option value="INR">INR (₹)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                </select>

                <AnimatePresence mode='wait'>
                    {activeTab === 'dashboard' && (
                        <motion.div
                            key="dashboard"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}
                        >
                            <StatCard title="Total Revenue" value={`$${(stats.revenue || 0).toLocaleString()}`} icon={TrendingUp} color="34, 197, 94" delay={0} subtext={`+${stats.growth}% vs last month`} />
                            <StatCard title="Operating Expenses" value={`$${(stats.expenses || 0).toLocaleString()}`} icon={TrendingDown} color="239, 68, 68" delay={0.1} />
                            <StatCard title="Net Profit" value={`$${(stats.netProfit || 0).toLocaleString()}`} icon={PieChart} color="212, 175, 55" delay={0.2} />
                            {/* ... (Existing Dashboard Widgets) */}
                            <div style={{ gridColumn: 'span 2', marginTop: '20px' }}>
                                <GlassCard>
                                    <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px', marginBottom: '15px' }}>📉 Cash Flow Analysis</h3>
                                    <div style={{ display: 'flex', gap: '30px' }}>
                                        <div>
                                            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Cash on Hand</p>
                                            <h2 style={{ color: '#fff' }}>${(stats.cashOnHand || 0).toLocaleString()}</h2>
                                        </div>
                                        <div>
                                            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Monthly Burn Rate</p>
                                            <h2 style={{ color: '#fca5a5' }}>${(stats.burnRate || 0).toLocaleString()}</h2>
                                        </div>
                                        <div>
                                            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Runway</p>
                                            <h2 style={{ color: '#D4AF37' }}>~{Math.round((stats.cashOnHand || 0) / (stats.burnRate || 1))} Months</h2>
                                        </div>
                                    </div>
                                </GlassCard>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'billing' && (
                        <motion.div
                            key="billing"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
                        >
                            <GlassCard>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h2 style={{ margin: 0 }}>Automated Billing Center</h2>
                                        <p style={{ color: '#94a3b8', marginTop: '5px' }}>Manage recurring subscriptions and unbilled milestones.</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <ActionButton
                                            variant="primary"
                                            icon={billingRunning ? undefined : PlayCircle}
                                            onClick={handleRunBillingCycle}
                                            disabled={billingRunning}
                                        >
                                            {billingRunning ? 'Running Cycle...' : 'Run Billing Cycle'}
                                        </ActionButton>
                                        <ActionButton
                                            variant="ghost"
                                            icon={showSubForm ? XCircle : Plus}
                                            onClick={() => setShowSubForm(!showSubForm)}
                                        >
                                            {showSubForm ? 'Cancel' : 'New Subscription'}
                                        </ActionButton>
                                    </div>
                                </div>
                            </GlassCard>

                            {showSubForm && (
                                <GlassCard>
                                    <form onSubmit={handleAddSubscription} style={{ display: 'grid', gap: '15px', gridTemplateColumns: '2fr 1fr 1fr 1fr auto' }}>
                                        <input
                                            placeholder="Client Name"
                                            value={newSub.client}
                                            onChange={(e) => setNewSub({ ...newSub, client: e.target.value })}
                                            style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
                                            required
                                        />
                                        <input
                                            placeholder="Plan Name"
                                            value={newSub.plan}
                                            onChange={(e) => setNewSub({ ...newSub, plan: e.target.value })}
                                            style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
                                            required
                                        />
                                        <input
                                            type="number"
                                            placeholder="Amount"
                                            value={newSub.amount}
                                            onChange={(e) => setNewSub({ ...newSub, amount: e.target.value })}
                                            style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
                                            required
                                        />
                                        <select
                                            value={newSub.billingCycle}
                                            onChange={(e) => setNewSub({ ...newSub, billingCycle: e.target.value })}
                                            style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: '#0f172a', color: '#fff' }}
                                        >
                                            <option value="Monthly">Monthly</option>
                                            <option value="Quarterly">Quarterly</option>
                                            <option value="Yearly">Yearly</option>
                                        </select>
                                        <ActionButton type="submit" variant="primary" icon={CheckCircle}>Add</ActionButton>
                                    </form>
                                </GlassCard>
                            )}

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                {/* Active Subscriptions */}
                                <GlassCard>
                                    <h3 style={{ marginBottom: '20px' }}>🔄 Active Subscriptions</h3>
                                    {subscriptions.length === 0 ? <p style={{ color: '#94a3b8' }}>No active subscriptions.</p> :
                                        subscriptions.map(sub => (
                                            <div key={sub.id} style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '10px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                                    <span style={{ fontWeight: 'bold' }}>{sub.client}</span>
                                                    <span style={{ color: '#86efac' }}>Active</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#94a3b8' }}>
                                                    <span>{sub.plan}</span>
                                                    <span>${sub.amount}/{sub.billingCycle}</span>
                                                </div>
                                                <div style={{ fontSize: '0.8rem', color: sub.nextBilling <= new Date().toISOString().split('T')[0] ? '#fca5a5' : '#cbd5e1', marginTop: '8px' }}>
                                                    Next Bill: {sub.nextBilling} {sub.nextBilling <= new Date().toISOString().split('T')[0] && '(Due Now)'}
                                                </div>
                                            </div>
                                        ))
                                    }
                                </GlassCard>

                                {/* Unbilled Milestones */}
                                <GlassCard>
                                    <h3 style={{ marginBottom: '20px' }}>🚧 Unbilled Milestones</h3>
                                    {milestones.length === 0 ? <p style={{ color: '#94a3b8' }}>No unbilled milestones.</p> :
                                        milestones.map(mile => (
                                            <div key={mile.id} style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '10px', opacity: mile.status === 'Billed' ? 0.5 : 1 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                                    <span style={{ fontWeight: 'bold' }}>{mile.project}</span>
                                                    <span style={{ background: mile.status === 'Billed' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(234, 179, 8, 0.2)', color: mile.status === 'Billed' ? '#86efac' : '#fde047', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px' }}>{mile.status}</span>
                                                </div>
                                                <p style={{ fontSize: '0.9rem', color: '#cbd5e1', margin: '5px 0' }}>{mile.phase}</p>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                                                    <span style={{ fontWeight: 'bold' }}>${mile.amount.toLocaleString()}</span>
                                                    {mile.status === 'Unbilled' && (
                                                        <ActionButton variant="primary" icon={FileText} onClick={() => handleDraftMilestoneInvoice(mile)}>Draft Invoice</ActionButton>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    }
                                </GlassCard>
                            </div>
                        </motion.div>
                    )}



                    {activeTab === 'receivables' && (
                        <motion.div
                            key="receivables"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
                        >
                            {/* AR Aging Summary */}
                            <GlassCard>
                                <h3 style={{ marginBottom: '15px' }}>⏳ Accounts Receivable Aging</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', textAlign: 'center' }}>
                                    {[
                                        { label: '0-30 Days', value: arAging['0-30'], color: '#86efac' },
                                        { label: '31-60 Days', value: arAging['31-60'], color: '#fde047' },
                                        { label: '61-90 Days', value: arAging['61-90'], color: '#fb923c' },
                                        { label: '90+ Days', value: arAging['90+'], color: '#fca5a5' }
                                    ].map((bucket, i) => (
                                        <div key={i} style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px' }}>
                                            <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '5px' }}>{bucket.label}</p>
                                            <h3 style={{ margin: 0, color: bucket.color }}>${bucket.value.toLocaleString()}</h3>
                                        </div>
                                    ))}
                                </div>
                            </GlassCard>

                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <ActionButton onClick={() => setShowInvoiceForm(!showInvoiceForm)} icon={showInvoiceForm ? XCircle : Plus}>
                                    {showInvoiceForm ? 'Cancel Invoice' : 'Create New Invoice'}
                                </ActionButton>
                            </div>

                            {showInvoiceForm && (
                                <GlassCard>
                                    <form onSubmit={handleCreateInvoice} style={{ display: 'grid', gap: '15px', gridTemplateColumns: '2fr 1fr auto' }}>
                                        <input
                                            placeholder="Client Name"
                                            value={newInvoice.client}
                                            onChange={(e) => setNewInvoice({ ...newInvoice, client: e.target.value })}
                                            style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
                                            required
                                        />
                                        <input
                                            type="number"
                                            placeholder="Amount"
                                            value={newInvoice.amount}
                                            onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
                                            style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
                                            required
                                        />
                                        <ActionButton type="submit" variant="primary" icon={FileText}>Generate Invoice</ActionButton>
                                    </form>
                                </GlassCard>
                            )}

                            {invoices && invoices.length > 0 ? invoices.map(inv => (
                                <GlassCard key={inv.id || Math.random()}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <h3 style={{ margin: 0, color: '#e2e8f0' }}>#{inv.id} - {inv.client || 'Unknown Client'}</h3>
                                            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Created: {inv.date} • Due: {inv.dueDate}</p>
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                            <span style={{ fontWeight: 'bold' }}>${(inv.total || 0).toLocaleString()}</span>

                                            {/* ACTION: View Invoice */}
                                            <ActionButton variant="ghost" icon={Eye} onClick={() => setViewInvoice(inv)}>View</ActionButton>

                                            {inv.status === 'Pending' ? (
                                                <ActionButton variant="success" icon={CreditCard} onClick={() => handleRecordPayment(inv.id)}>Pay</ActionButton>
                                            ) : (
                                                <span style={{ padding: '6px 12px', background: 'rgba(34, 197, 94, 0.2)', color: '#86efac', borderRadius: '8px' }}>Paid</span>
                                            )}
                                        </div>
                                    </div>
                                </GlassCard>
                            )) : (
                                <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>No invoices found.</p>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'payables' && (
                        <motion.div
                            key="payables"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}
                        >
                            {/* Vendor Management */}
                            <div style={{ gridColumn: 'span 2' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                    <h3>Vendor Directory</h3>
                                    <ActionButton onClick={() => setShowVendorForm(!showVendorForm)} icon={showVendorForm ? XCircle : Plus}>
                                        {showVendorForm ? 'Cancel' : 'Add Vendor'}
                                    </ActionButton>
                                </div>
                                {showVendorForm && (
                                    <GlassCard style={{ marginBottom: '20px' }}>
                                        <form onSubmit={handleAddVendor} style={{ display: 'grid', gap: '15px', gridTemplateColumns: '1fr 1fr 1fr auto' }}>
                                            <input placeholder="Vendor Name" value={newVendor.name} onChange={e => setNewVendor({ ...newVendor, name: e.target.value })} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }} />
                                            <input placeholder="Category" value={newVendor.category} onChange={e => setNewVendor({ ...newVendor, category: e.target.value })} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }} />
                                            <input placeholder="Contact Email" value={newVendor.contact} onChange={e => setNewVendor({ ...newVendor, contact: e.target.value })} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }} />
                                            <ActionButton type="submit" variant="primary" icon={CheckCircle}>Add</ActionButton>
                                        </form>
                                    </GlassCard>
                                )}
                                <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '10px' }}>
                                    {vendors.map(v => (
                                        <GlassCard key={v.id} style={{ minWidth: '250px' }}>
                                            <h4>{v.name}</h4>
                                            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{v.category}</p>
                                            <p style={{ fontSize: '0.8rem', color: '#fff' }}>Terms: {v.paymentTerms}</p>
                                        </GlassCard>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                    {activeTab === 'compliance' && (
                        <motion.div
                            key="compliance"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
                        >
                            <GlassCard>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h2 style={{ margin: 0 }}>Compliance & Reporting</h2>
                                        <p style={{ color: '#94a3b8', marginTop: '5px' }}>Real-time financial statements and audit logs.</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <ActionButton variant="primary" icon={Printer} onClick={handlePrintInvoice}>Print Reports</ActionButton>
                                    </div>
                                </div>
                            </GlassCard>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                                {/* Profit & Loss */}
                                <GlassCard>
                                    <h3 style={{ marginBottom: '15px' }}>📈 Profit & Loss</h3>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <span style={{ color: '#94a3b8' }}>Total Revenue</span>
                                        <span style={{ color: '#86efac' }}>+${reports.pl.revenue.toLocaleString()}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <span style={{ color: '#94a3b8' }}>Total Expenses</span>
                                        <span style={{ color: '#fca5a5' }}>-${reports.pl.expenses.toLocaleString()}</span>
                                    </div>
                                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                                        <span>Net Profit</span>
                                        <span style={{ color: '#D4AF37' }}>${reports.pl.netProfit.toLocaleString()}</span>
                                    </div>
                                </GlassCard>

                                {/* Balance Sheet Summary */}
                                <GlassCard>
                                    <h3 style={{ marginBottom: '15px' }}>⚖️ Balance Sheet</h3>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <span style={{ color: '#94a3b8' }}>Total Assets</span>
                                        <span style={{ color: '#fff' }}>${(reports.bs.assets.cash + reports.bs.assets.receivables).toLocaleString()}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <span style={{ color: '#94a3b8' }}>Liabilities</span>
                                        <span style={{ color: '#fff' }}>${(reports.bs.liabilities.payables + reports.bs.liabilities.taxPayable).toLocaleString()}</span>
                                    </div>
                                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                                        <span>Total Equity</span>
                                        <span style={{ color: '#D4AF37' }}>${reports.bs.equity.toLocaleString()}</span>
                                    </div>
                                </GlassCard>

                                {/* Tax Report */}
                                <GlassCard>
                                    <h3 style={{ marginBottom: '15px' }}>🏛️ Tax Liability (GST)</h3>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <span style={{ color: '#94a3b8' }}>Collected (Output)</span>
                                        <span style={{ color: '#fff' }}>${reports.tax.collected.toLocaleString()}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <span style={{ color: '#94a3b8' }}>Paid (Input Credit)</span>
                                        <span style={{ color: '#fff' }}>${reports.tax.paid.toLocaleString()}</span>
                                    </div>
                                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                                        <span>Net Payable</span>
                                        <span style={{ color: '#fca5a5' }}>${reports.tax.netPayable.toLocaleString()}</span>
                                    </div>
                                </GlassCard>

                                {/* Deferred Revenue */}
                                <GlassCard>
                                    <h3 style={{ marginBottom: '15px' }}>🕒 Deferred Revenue Recognition</h3>
                                    <div style={{ overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                            <thead>
                                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', textAlign: 'left' }}>
                                                    <th style={{ padding: '10px' }}>Client</th>
                                                    <th style={{ padding: '10px' }}>Total Contract</th>
                                                    <th style={{ padding: '10px' }}>Recognized</th>
                                                    <th style={{ padding: '10px' }}>Deferred</th>
                                                    <th style={{ padding: '10px' }}>Period</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {deferredRevenue.map(dr => (
                                                    <tr key={dr.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                        <td style={{ padding: '10px', color: '#fff' }}>{dr.client}</td>
                                                        <td style={{ padding: '10px', color: '#86efac' }}>{formatCurrency(dr.contractValue)}</td>
                                                        <td style={{ padding: '10px', color: '#60a5fa' }}>{formatCurrency(dr.Recognized)}</td>
                                                        <td style={{ padding: '10px', color: '#fca5a5' }}>{formatCurrency(dr.Deferred)}</td>
                                                        <td style={{ padding: '10px', color: '#94a3b8', fontSize: '0.8rem' }}>{dr.startDate} - {dr.endDate}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </GlassCard>
                            </div>

                            {/* Audit Log */}
                        </motion.div>
                    )}

                    {
                        activeTab === 'gl' && (
                            <motion.div
                                key="gl"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}
                            >
                                {/* Chart of Accounts */}
                                <GlassCard>
                                    <h3 style={{ marginBottom: '20px' }}>📚 General Ledger (Chart of Accounts)</h3>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', textAlign: 'left' }}>
                                                <th style={{ padding: '10px' }}>Code</th>
                                                <th style={{ padding: '10px' }}>Account Name</th>
                                                <th style={{ padding: '10px' }}>Type</th>
                                                <th style={{ padding: '10px', textAlign: 'right' }}>Balance</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {glAccounts.map((acc, i) => (
                                                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                    <td style={{ padding: '10px', color: '#94a3b8' }}>{acc.code}</td>
                                                    <td style={{ padding: '10px', color: '#fff' }}>{acc.name}</td>
                                                    <td style={{ padding: '10px' }}>
                                                        <span style={{
                                                            padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem',
                                                            background: acc.type === 'Asset' || acc.type === 'Expense' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                                                            color: acc.type === 'Asset' || acc.type === 'Expense' ? '#60a5fa' : '#fbbf24'
                                                        }}>
                                                            {acc.type}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold', color: '#D4AF37' }}>
                                                        ${acc.balance.toLocaleString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </GlassCard>

                                {/* Journal Entry Form */}
                                <GlassCard>
                                    <h3 style={{ marginBottom: '15px' }}>📝 Record Journal Entry</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                        <input
                                            placeholder="Description"
                                            style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
                                        />
                                        {/* Mock Entry Rows */}
                                        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '10px' }}>
                                            <select style={{ padding: '8px', borderRadius: '6px', background: '#0f172a', color: '#fff' }}>
                                                <option>Account...</option>
                                                {glAccounts.map(a => <option key={a.code} value={a.code}>{a.name}</option>)}
                                            </select>
                                            <input placeholder="Debit" type="number" style={{ padding: '8px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: 'none' }} />
                                            <input placeholder="Credit" type="number" style={{ padding: '8px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: 'none' }} />
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '10px' }}>
                                            <select style={{ padding: '8px', borderRadius: '6px', background: '#0f172a', color: '#fff' }}>
                                                <option>Account...</option>
                                                {glAccounts.map(a => <option key={a.code} value={a.code}>{a.name}</option>)}
                                            </select>
                                            <input placeholder="Debit" type="number" style={{ padding: '8px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: 'none' }} />
                                            <input placeholder="Credit" type="number" style={{ padding: '8px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: 'none' }} />
                                        </div>
                                        <ActionButton
                                            variant="primary"
                                            icon={CheckCircle}
                                            onClick={() => {
                                                alert("Journal Entry feature is in simulation mode (Mock Data).");
                                                AdminService.logAudit('Manual Journal Entry Recorded', 'Fiona Finance');
                                                refreshData();
                                            }}
                                        >
                                            Post Entry
                                        </ActionButton>
                                    </div>
                                </GlassCard>

                                {/* Accounts Payable Aging */}
                                <GlassCard>
                                    <h3 style={{ marginBottom: '15px' }}>⏳ Accounts Payable Aging</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
                                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
                                            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>0-30 Days</p>
                                            <h4 style={{ margin: '5px 0 0 0', color: '#ffb300' }}>{formatCurrency(apAging['0-30'])}</h4>
                                        </div>
                                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
                                            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>31-60 Days</p>
                                            <h4 style={{ margin: '5px 0 0 0', color: '#fb923c' }}>{formatCurrency(apAging['31-60'])}</h4>
                                        </div>
                                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
                                            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>61-90 Days</p>
                                            <h4 style={{ margin: '5px 0 0 0', color: '#f87171' }}>{formatCurrency(apAging['61-90'])}</h4>
                                        </div>
                                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
                                            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>90+ Days</p>
                                            <h4 style={{ margin: '5px 0 0 0', color: '#ef4444' }}>{formatCurrency(apAging['90+'])}</h4>
                                        </div>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        )}

                    {activeTab === 'profitability' && (
                        <motion.div
                            key="profitability"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}
                        >
                            {/* Project Margins */}
                            <GlassCard>
                                <h3 style={{ marginBottom: '20px' }}>📊 Project Profitability</h3>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', textAlign: 'left' }}>
                                            <th style={{ padding: '10px' }}>Project</th>
                                            <th style={{ padding: '10px', textAlign: 'right' }}>Revenue</th>
                                            <th style={{ padding: '10px', textAlign: 'right' }}>Est. Cost</th>
                                            <th style={{ padding: '10px', textAlign: 'right' }}>Margin</th>
                                            <th style={{ padding: '10px', textAlign: 'right' }}>%</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {projectProfitability.map((proj, i) => (
                                            <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <td style={{ padding: '10px', color: '#fff' }}>{proj.client} - {proj.name}</td>
                                                <td style={{ padding: '10px', textAlign: 'right', color: '#86efac' }}>${proj.revenue.toLocaleString()}</td>
                                                <td style={{ padding: '10px', textAlign: 'right', color: '#fca5a5' }}>${proj.cost.toLocaleString()}</td>
                                                <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold', color: proj.margin >= 0 ? '#D4AF37' : '#ef4444' }}>
                                                    ${proj.margin.toLocaleString()}
                                                </td>
                                                <td style={{ padding: '10px', textAlign: 'right', color: '#94a3b8' }}>
                                                    {proj.marginPercent.toFixed(1)}%
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </GlassCard>

                            {/* Project Budgets */}
                            <GlassCard>
                                <h3 style={{ marginBottom: '20px' }}>💰 Budget vs Actual</h3>
                                {projectBudgets.map(pb => (
                                    <div key={pb.id} style={{ marginBottom: '15px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                            <span style={{ color: '#fff' }}>{pb.name}</span>
                                            <span style={{ color: '#94a3b8' }}>{formatCurrency(pb.spent)} / {formatCurrency(pb.totalBudget)}</span>
                                        </div>
                                        <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                                            <div style={{
                                                width: `${Math.min(pb.percent, 100)}%`,
                                                height: '100%',
                                                background: pb.percent > 90 ? '#ef4444' : pb.percent > 70 ? '#f59e0b' : '#22c55e',
                                                borderRadius: '4px'
                                            }} />
                                        </div>
                                    </div>
                                ))}
                            </GlassCard>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                {/* Cloud Costs */}
                                <GlassCard>
                                    <h3 style={{ marginBottom: '15px' }}>☁️ Cloud Spend</h3>
                                    {cloudBills.map(bill => (
                                        <div key={bill.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <div>
                                                <span style={{ color: '#fff' }}>{bill.provider}</span>
                                                <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>{bill.service}</p>
                                            </div>
                                            <span style={{ fontWeight: 'bold', color: '#fca5a5' }}>${bill.amount}</span>
                                        </div>
                                    ))}
                                </GlassCard>

                                {/* Resource Costing */}
                                <GlassCard>
                                    <h3 style={{ marginBottom: '15px' }}>👥 Hourly Rates</h3>
                                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                        {resourceCosting.map(res => (
                                            <div key={res.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <span style={{ color: '#94a3b8' }}>{res.name}</span>
                                                <span style={{ color: '#fff' }}>${res.hourlyRate}/hr</span>
                                            </div>
                                        ))}
                                    </div>
                                </GlassCard>
                            </div>
                        </motion.div>
                    )}

                    {
                        activeTab === 'assets' && (
                            <motion.div
                                key="assets"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <GlassCard>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                        <h3>💻 Fixed Asset Registry</h3>
                                        <ActionButton variant="primary" icon={Plus} onClick={() => alert("Simulation: Add Asset Modal")}>Register Asset</ActionButton>
                                    </div>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', textAlign: 'left' }}>
                                                <th style={{ padding: '12px' }}>Asset Name</th>
                                                <th style={{ padding: '12px' }}>Category</th>
                                                <th style={{ padding: '12px' }}>Purchase Date</th>
                                                <th style={{ padding: '12px', textAlign: 'right' }}>Original Cost</th>
                                                <th style={{ padding: '12px', textAlign: 'right' }}>Current Value</th>
                                                <th style={{ padding: '12px', textAlign: 'right' }}>Depreciation</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {AdminService.runDepreciation ? AdminService.runDepreciation().map(asset => (
                                                <tr key={asset.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                    <td style={{ padding: '12px', color: '#fff', fontWeight: '500' }}>{asset.name}</td>
                                                    <td style={{ padding: '12px', color: '#94a3b8' }}>{asset.category}</td>
                                                    <td style={{ padding: '12px', color: '#94a3b8' }}>{asset.purchaseDate}</td>
                                                    <td style={{ padding: '12px', textAlign: 'right', color: '#94a3b8' }}>${asset.cost.toLocaleString()}</td>
                                                    <td style={{ padding: '12px', textAlign: 'right', color: '#D4AF37', fontWeight: 'bold' }}>${asset.currentValue.toLocaleString()}</td>
                                                    <td style={{ padding: '12px', textAlign: 'right', color: '#fca5a5' }}>-${asset.depreciation.toLocaleString()}</td>
                                                </tr>
                                            )) : (
                                                <tr><td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>Depreciation engine not loaded.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </GlassCard>
                            </motion.div>
                        )
                    }

                </AnimatePresence >
            </div >
        </div >
    );
};

export default FinancePortal;
