
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Users, FileText, Settings, LogOut,
    Plus, Search, Bell, Menu, X, Filter, Download,
    ChevronDown, ChevronUp, Check, AlertCircle, ChevronLeft, ChevronRight,
    DollarSign, Briefcase, Calendar, Clock, Lock,
    Shield, Key, Eye, EyeOff, Copy, RefreshCw, Hash,
    MessageSquare, BarChart2, User, Trash2, Edit, Activity, Server, HardDrive, BarChart3, Video, Building, Globe, AlertTriangle, FileCheck, Mail, Phone, Microscope,
    Cloud, Code, ClipboardList, Zap, UserPlus, Reply, ShieldCheck, ShieldAlert
} from 'lucide-react';

import logo from '../assets/logo-transparent.png';

import AdminService from '../services/adminService';
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from 'recharts';

const Admin = ({ currentUser }) => {
    const departmentDesignations = {
        'Engineering': ['Senior Developer', 'Junior Developer', 'QA Engineer', 'System Admin', 'Full Stack Developer'],
        'HR': ['HR Manager', 'HR Specialist', 'Recruitment Manager'],
        'Sales': ['Sales Director', 'Sales Executive', 'Account Manager'],
        'Finance': ['CFO', 'Finance Analyst', 'Accountant'],
        'Operations': ['Operations Manager', 'Logistics Coordinator'],
        'Marketing': ['Marketing Manager', 'Content Strategist', 'SEO Specialist'],
        'Management': ['CEO', 'CTO', 'Project Manager'],
        'Research': ['Research Analyst', 'Data Scientist'],
        'Support': ['Support Specialist', 'Helpdesk Technician']
    };

    const navigate = useNavigate();

    const [isLoggedIn, setIsLoggedIn] = useState(!!currentUser);
    const [username, setUsername] = useState(currentUser?.name || '');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('overview'); // overview, applications, employees, finance, projects, vault, chatbot

    useEffect(() => {
        if (currentUser) {
            setUsername(currentUser.name);
            setIsLoggedIn(true);
        }
    }, [currentUser]);
    // Data State
    const [stats, setStats] = useState([]);
    const [applications, setApplications] = useState([]);
    const [queries, setQueries] = useState([]);
    const [meetings, setMeetings] = useState([]);
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [clients, setClients] = useState([]);
    const [credentials, setCredentials] = useState([]); // Password Vault
    const [chatStats, setChatStats] = useState(null);
    const [chatLogs, setChatLogs] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [companyInfo, setCompanyInfo] = useState({ address: '', email: '', phone: '', footerOpacity: 0.5 });

    // Recruitment Filter & Sort State
    const [recruitmentFilters, setRecruitmentFilters] = useState({
        search: '',
        stage: 'All',
        role: 'All',
        source: 'All'
    });
    const [recruitmentSort, setRecruitmentSort] = useState({ key: 'appliedDate', direction: 'desc' });

    const processedCandidates = useMemo(() => {
        let result = [...candidates];

        // Filtering
        if (recruitmentFilters.search) {
            const query = recruitmentFilters.search.toLowerCase();
            result = result.filter(c =>
                (c.name && c.name.toLowerCase().includes(query)) ||
                (c.email && c.email.toLowerCase().includes(query)) ||
                (c.role && c.role.toLowerCase().includes(query))
            );
        }


        if (recruitmentFilters.stage !== 'All') {
            result = result.filter(c => c.stage === recruitmentFilters.stage);
        }

        if (recruitmentFilters.role !== 'All') {
            result = result.filter(c => c.role === recruitmentFilters.role);
        }

        if (recruitmentFilters.source !== 'All') {
            result = result.filter(c => c.source === recruitmentFilters.source);
        }

        // Sorting
        result.sort((a, b) => {
            let valA = a[recruitmentSort.key] || '';
            let valB = b[recruitmentSort.key] || '';

            if (typeof valA === 'string') valA = valA.toLowerCase();
            if (typeof valB === 'string') valB = valB.toLowerCase();

            if (valA < valB) return recruitmentSort.direction === 'asc' ? -1 : 1;
            if (valA > valB) return recruitmentSort.direction === 'asc' ? 1 : -1;
            return 0;
        });

        return result;
    }, [candidates, recruitmentFilters, recruitmentSort]);


    // Monitoring & New Modules State
    const [systemHealth, setSystemHealth] = useState({ cpu: 0, memory: 0, disk: 0, uptime: '0m' });
    const [infraStats, setInfraStats] = useState({ servers: [], cloudCosts: [], domains: [], apiUsage: [], securityAlerts: [] });
    const [complianceLogs, setComplianceLogs] = useState([]);
    const [apiKeys, setApiKeys] = useState([]);
    const [jitRequests, setJitRequests] = useState([]);
    const [auditLog, setAuditLog] = useState([]);
    const [resetHistory, setResetHistory] = useState([]);
    const [industryMetrics, setIndustryMetrics] = useState(null);
    const [projectHealth, setProjectHealth] = useState([]);
    const [financialMetrics, setFinancialMetrics] = useState(null);
    const [securityHealth, setSecurityHealth] = useState(null);
    const [vaultSearch, setVaultSearch] = useState('');
    const [vaultCategory, setVaultCategory] = useState('All');

    // Privileged Access Management Search State
    const [searchTerm, setSearchTerm] = useState('');
    const filteredUsers = useMemo(() => {
        if (!searchTerm) return users;
        return users.filter(u =>
            (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (u.role && u.role.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (u.department && u.department.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [users, searchTerm]);

    // Global Search State
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [copiedId, setCopiedId] = useState(null);

    const [serviceStatus, setServiceStatus] = useState([]);
    const [systemLogs, setSystemLogs] = useState([]);

    // Form State for User Upsert
    const [formData, setFormData] = useState({});

    // Modal State
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalType, setModalType] = useState(null); // 'application', 'query', 'meeting', 'upsert_user', 'upsert_credential', 'chat_transcript'
    const [modalError, setModalError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Password Vault State
    const [visiblePasswords, setVisiblePasswords] = useState({});

    // Expansion state for Access Management sections
    const [expandedSections, setExpandedSections] = useState({
        privileged: false,
        clients: false
    });

    useEffect(() => {
        if (isLoggedIn) {
            refreshData();
        }

        // Global Search Hotkey
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsSearchOpen(prev => !prev);
                // Focus input if opening - logic inside render or separate effect
            }
        };

        const handleStorageChange = (e) => {
            if (isRefreshing) return; // Prevent loop if already refreshing

            let key = e.key;
            // Handle custom event for same-tab updates
            if (e.type === 'gt_data_update' && e.detail) {
                key = e.detail.key;
            }

            if (key && key.startsWith('gt_')) {
                refreshData();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('gt_data_update', handleStorageChange);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('gt_data_update', handleStorageChange);
        };
    }, [isLoggedIn]);

    const refreshData = async () => {
        if (isRefreshing) return;
        setIsRefreshing(true);
        try {
            // Use Promise.all for parallel fetching
            const [
                apps, qs, meets, usrs, rls, jbs,
                health, services, logs, infra, cLogs, keys, jit, audits, creds, sec,
                metrics, proj, fin, info, fetchedClients, history
            ] = await Promise.all([
                AdminService.getApplications(),
                AdminService.getQueries(),
                AdminService.getMeetings(),
                AdminService.getUsers(),
                AdminService.getRoles(),
                AdminService.getJobs(),
                AdminService.getSystemHealth(),
                AdminService.getServiceStatus(),
                AdminService.getRecentLogs(),
                AdminService.getInfrastructureDetails ? AdminService.getInfrastructureDetails() : Promise.resolve({ servers: [], cloudCosts: [], domains: [] }),
                AdminService.getComplianceLogs ? AdminService.getComplianceLogs() : Promise.resolve([]),
                AdminService.getApiKeys ? AdminService.getApiKeys() : Promise.resolve([]),
                AdminService.getJitRequests ? AdminService.getJitRequests() : Promise.resolve([]),
                AdminService.getAuditLog(),
                AdminService.getCredentials(),
                AdminService.getSecurityHealthSummary ? AdminService.getSecurityHealthSummary() : Promise.resolve({}),
                AdminService.getIndustryMetrics ? AdminService.getIndustryMetrics() : Promise.resolve({}),
                AdminService.getProjectHealth(),
                AdminService.getFinancialStats(),
                AdminService.getCompanyInfo(),
                AdminService.getClients(),
                AdminService.getPasswordResetHistory()
            ]);

            setApplications(apps || []);
            setQueries(qs || []);
            setMeetings(meets || []);
            setUsers(usrs || []);
            setRoles(rls || []);
            setCandidates(apps || []); // Candidates are same as Applications
            setJobs(jbs || []);
            setSystemHealth(health || { cpu: 0, memory: 0, disk: 0, uptime: '0m' });
            setServiceStatus(services || []);
            setSystemLogs(logs || []);
            setInfraStats(infra || { servers: [], cloudCosts: [], domains: [] });
            setComplianceLogs(cLogs || []);
            setApiKeys(keys || []);
            setJitRequests(jit || []);
            setAuditLog(audits || []);
            setCredentials(creds || []);
            setSecurityHealth(sec);
            setIndustryMetrics(metrics);
            setProjectHealth(proj || []);
            setFinancialMetrics(fin);
            setCompanyInfo(info);
            setClients(fetchedClients || []);
            setResetHistory(history || []);

            setStats([
                { title: 'Total Visits', value: '12,450', change: '+12%', icon: <Users size={24} color="#004687" /> },
                { title: 'Active Leads', value: (qs?.length || 0).toString(), change: 'Hot', icon: <MessageSquare size={24} color="#f59e0b" /> },
                { title: 'Talent Pipeline', value: (apps?.length || 0).toString(), change: 'Active', icon: <Briefcase size={24} color="#D4AF37" /> },
                { title: 'Infrastructure', value: '99.98%', change: 'Uptime', icon: <Activity size={24} color="#3b82f6" /> },
                { title: 'Security', value: 'Secure', change: 'No Alerts', icon: <Shield size={24} color="#D4AF37" /> },
            ]);
        } catch (error) {
            console.error("Admin.jsx: Error refreshing data", error);
            // alert("Error refreshing data. Check console for details.");
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        // 1. Hardcoded Demo Login (Super Admin)
        if (username === 'admin' && password === 'admin123') {
            setIsLoggedIn(true);
            setError('');
            return;
        }

        // 2. Check stored users (Mock Auth - Password 'password123' for all)
        const users = await AdminService.getUsers();
        const storedUser = users.find(u => (u.email === username || u.name === username) && u.status === 'Active');
        if (storedUser && password === 'password123') {
            setIsLoggedIn(true);
            setError('');
            return;
        }

        setError('Invalid credentials');
    };

    const handleIdentitySubmit = async (e) => {
        e.preventDefault();
        setResetMessage({ type: '', text: '' });
        if (!resetIdentity.trim()) {
            setResetMessage({ type: 'error', text: 'Please enter your email or username' });
            return;
        }
        // Verify user exists
        const users = await AdminService.getUsers();
        const user = users.find(u => (u.email === resetIdentity || u.name === resetIdentity) && u.status === 'Active');
        if (!user && resetIdentity !== 'admin') {
            setResetMessage({ type: 'error', text: 'Account not found' });
            return;
        }
        setResetStep('security_key');
    };

    const handleSecurityKeySubmit = async (e) => {
        e.preventDefault();
        setResetMessage({ type: '', text: '' });
        const res = await AdminService.verifySecurityKey(resetIdentity, securityKeyInput);
        if (res.success) {
            setResetStep('security_questions');
        } else {
            setResetMessage({ type: 'error', text: res.message });
        }
    };

    const handleSecurityQuestionsSubmit = async (e) => {
        e.preventDefault();
        setResetMessage({ type: '', text: '' });
        const res = await AdminService.verifySecurityQuestions(resetIdentity, {
            petName: petNameInput,
            changeMind: changeMindInput
        });
        if (res.success) {
            setResetStep('new_password');
        } else {
            setResetMessage({ type: 'error', text: res.message });
        }
    };

    const handleNewPasswordSubmit = async (e) => {
        e.preventDefault();
        setResetMessage({ type: '', text: '' });
        if (newPasswordInput !== confirmPasswordInput) {
            setResetMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }
        if (newPasswordInput.length < 9) {
            setResetMessage({ type: 'error', text: 'Password must be at least 9 characters' });
            return;
        }
        const res = await AdminService.updatePasswordByIdentity(resetIdentity, newPasswordInput);
        if (res.success) {
            setResetStep('success');
            setResetMessage({ type: 'success', text: 'Security Key updated successfully! You can now log in.' });
        } else {
            setResetMessage({ type: 'error', text: res.message });
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUsername('');
        setPassword('');
        setActiveTab('overview');
    };

    const portals = [
        'Sales portal',
        'HR portal',
        'Tasks portal',
        'Project-management',
        'Finance portal',
        'Manager portal',
        'Employee portal',
        'Research & development portal'
    ];

    const recruitmentStages = ['review pending', 'under process', 'Interview scheduled', 'hired', 'rejected'];

    const handleMoveStage = async (candidateId, direction) => {
        const candidate = candidates.find(c => c.id === candidateId);
        if (!candidate) return;

        const currentIndex = recruitmentStages.indexOf(candidate.stage);
        const newIndex = currentIndex + direction;

        if (newIndex >= 0 && newIndex < recruitmentStages.length) {
            await AdminService.updateCandidateStatus(candidateId, recruitmentStages[newIndex]);
            await refreshData();
        }
    };

    const handleViewItem = (item, type) => {
        setSelectedItem(item);
        setModalType(type);
        setFormData({}); // Reset form
    };

    const handleOpenUserModal = (user = null) => {
        setSelectedItem(user);
        setModalType('upsert_user');
        const generatedEmpId = `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
        setFormData(user ? { ...user, newPassword: '' } : {
            name: '',
            email: '',
            role: 'Employee',
            department: '',
            designation: '',
            dob: '',
            mobile: '',
            employeeId: generatedEmpId,
            password: '',
            access: [],
            status: 'Active'
        });
    };

    const handleOpenClientModal = (client = null) => {
        setSelectedItem(client);
        setModalType('upsert_client');
        const generatedClientId = `CLI-${Math.floor(1000 + Math.random() * 9000)}`;
        setFormData(client ? { ...client, newPassword: '' } : {
            name: '',
            industry: '',
            clientPhone: '',
            email: '',
            pocName: '',
            pocPhone: '',
            pocEmail: '',
            projectId: '',
            projectName: '',
            projectDetails: '',
            projectManager: '',
            businessHead: '',
            expiryDate: '',
            clientId: generatedClientId,
            password: '',
            status: 'Active'
        });
    };

    const closeModal = () => {
        setSelectedItem(null);
        setModalType(null);
        setFormData({});
        setModalError('');
        setIsSubmitting(false);
    };

    const handleUserSubmit = async (e) => {
        e.preventDefault();
        setModalError('');

        // 1. Explicit Field Validation
        if (!formData.department) {
            setModalError('Please select a Department.');
            return;
        }
        if (!formData.designation) {
            setModalError('Please select a Designation.');
            return;
        }

        // 2. Password Strength Validation (for new users)
        if (!selectedItem) {
            if (!formData.password) {
                setModalError('Password is required for new users.');
                return;
            }
            const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+~`|}{[\]:;?><,./\-=])(?=.{9,})/;
            if (!passwordRegex.test(formData.password)) {
                setModalError('Password must be at least 9 characters long and contain at least one uppercase letter, one number, and one symbol.');
                return;
            }
        }

        // 3. Duplicate Check
        const isDuplicate = users.some(u =>
            (u.email?.toLowerCase() === formData.email?.toLowerCase() || u.name?.toLowerCase() === formData.name?.toLowerCase()) &&
            (!selectedItem || u.id !== selectedItem.id)
        );

        if (isDuplicate) {
            setModalError('A user with this Email or Name already exists.');
            return;
        }

        setIsSubmitting(true);
        console.log('Initiating User Save:', formData.email);
        try {
            if (selectedItem && selectedItem.id) {
                const updatePayload = { ...selectedItem, ...formData };
                if (formData.newPassword) {
                    updatePayload.password = formData.newPassword;
                }
                await AdminService.updateUser(updatePayload);
            } else {
                await AdminService.addUser(formData);
            }
            await refreshData();
            closeModal();
            console.log('User Save Successful');
        } catch (err) {
            setModalError('Failed to save user. Please check your network or try again.');
            console.error('User Submit Error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };
    const handleClientSubmit = async (e) => {
        e.preventDefault();
        setModalError('');
        setIsSubmitting(true);
        try {
            if (selectedItem && selectedItem.id) {
                const updatePayload = { ...selectedItem, ...formData };
                if (formData.newPassword) {
                    updatePayload.password = formData.newPassword;
                }
                await AdminService.updateClient(updatePayload);
            } else {
                await AdminService.addClient(formData);
            }
            await refreshData();
            closeModal();
        } catch (err) {
            setModalError(err.message || 'Failed to save client. Please check your network or try again.');
            console.error('Client Submit Error:', err);
            console.error('Client Submit Error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleJobSubmit = async (e) => {
        e.preventDefault();
        if (selectedItem && selectedItem.id) {
            await AdminService.updateJob({ ...selectedItem, ...formData });
        } else {
            await AdminService.addJob(formData);
        }
        await refreshData();
        closeModal();
    };

    const handlePermissionChange = async (roleId, resource, value) => {
        const role = roles.find(r => r.id === roleId);
        if (role) {
            const newPermissions = { ...role.permissions, [resource]: value };
            await AdminService.updatePermissions(roleId, newPermissions);
            await refreshData();
        }
    };

    const handlePasswordManagement = async (user) => {
        const newPassword = prompt(`Enter new password for ${user.name}(Leave empty to reset to random): `);
        if (newPassword === null) return; // Cancelled

        if (newPassword.trim() === '') {
            if (window.confirm(`Are you sure you want to reset the password for ${user.name} to a random value ? `)) {
                const res = await AdminService.resetUserPassword(user.id);
                if (res.success) alert(res.message);
            }
        } else {
            const res = await AdminService.updateUserPassword(user.id, newPassword);
            if (res.success) alert(res.message);
        }
    };

    const handleDelete = async (id, type) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            if (type === 'application') {
                await AdminService.deleteApplication(id);
            } else if (type === 'query') {
                await AdminService.deleteQuery(id);
            } else if (type === 'meeting') {
                await AdminService.deleteMeeting(id);
            } else if (type === 'user') {
                await AdminService.deleteUser(id);
            } else if (type === 'client') {
                await AdminService.deleteClient(id);
            } else if (type === 'job') {
                await AdminService.deleteJob(id);
            }
            await refreshData();
            if (selectedItem && selectedItem.id === id) closeModal();
        }
    };

    const handleStatusUpdate = async (id, status, type) => {
        if (type === 'application') {
            const app = applications.find(a => a.id == id);
            const candidate = candidates.find(c => c.id == id);

            if (app) {
                await AdminService.updateApplication({ ...app, status });
            } else if (candidate) {
                // Use the full selectedItem to capture all fields (date, link, comments, etc)
                await AdminService.updateCandidate(id, { ...selectedItem, stage: status });
            }
        } else if (type === 'query') {
            const q = queries.find(q => q.id == id);
            if (q) await AdminService.updateQuery({ ...q, status });
        } else if (type === 'meeting') {
            const m = meetings.find(m => m.id == id);
            if (m) await AdminService.updateMeeting({ ...m, status });
        }

        await refreshData();
        closeModal();
    };

    const handleCompanyInfoSubmit = async (e) => {
        e.preventDefault();
        await AdminService.updateCompanyInfo(companyInfo);
        alert('Company Profile Settings Updated Successfully');
        await refreshData();
    };


    const togglePasswordVisibility = (id) => {
        setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('Information copied to clipboard!');
    };

    const handleDownloadResume = (sourceOrUrl, filename) => {
        try {
            if (!sourceOrUrl) {
                alert("This resume record contains no file data.");
                return;
            }

            // sourceOrUrl could be a URL, a data URI, or just a filename
            const sourceStr = String(sourceOrUrl);

            // Check if it's a URL
            if (sourceStr.startsWith('http')) {
                const link = document.createElement('a');
                link.href = sourceStr;
                link.target = '_blank';
                link.download = filename || 'resume.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                return;
            }

            // Check if it's a Data URI
            if (sourceStr.startsWith('data:')) {
                const [header, content] = sourceStr.split(',');
                const mime = header.match(/:(.*?);/)[1];
                const bstr = atob(content);
                let n = bstr.length;
                const u8arr = new Uint8Array(n);
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                const blob = new Blob([u8arr], { type: mime });
                const url = URL.createObjectURL(blob);

                const link = document.createElement('a');
                link.href = url;
                link.download = filename || 'resume.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                setTimeout(() => URL.revokeObjectURL(url), 100);
                return;
            }

            // If it's just a filename or random string, we can't do much but show info
            alert(`Record contains a file reference: "${sourceStr}". Only full file data or Supabase links can be opened.`);
        } catch (e) {
            console.error("Download error:", e);
            alert("Failed to process resume file. The file might be corrupted or too large.");
        }
    };


    // --- Password Vault Handlers ---
    const handleOpenCredentialModal = (cred = null) => {
        setSelectedItem(cred);
        setModalType('upsert_credential');
        const defaultCred = { service: '', username: '', password: '', category: 'Infrastructure' };
        setFormData(cred || defaultCred);
    };

    const handleCredentialSubmit = async (e) => {
        e.preventDefault();
        setModalError('');
        setIsSubmitting(true);
        try {
            if (selectedItem && selectedItem.id) {
                await AdminService.updateCredential({ ...selectedItem, ...formData });
            } else {
                await AdminService.addCredential(formData);
            }
            await refreshData();
            closeModal();
        } catch (err) {
            setModalError('Encryption failure or save error. Please try again.');
            console.error('Credential Submit Error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteCredential = async (id) => {
        if (window.confirm('Are you sure you want to delete this credential?')) {
            await AdminService.deleteCredential(id);
            await refreshData();
        }
    };

    if (!isLoggedIn) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'radial-gradient(circle at top right, #1e293b 0%, #0f172a 100%)',
                padding: '20px'
            }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        padding: '50px',
                        borderRadius: '30px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        textAlign: 'center',
                        maxWidth: '420px',
                        width: '100%'
                    }}
                >
                    <div style={{
                        width: '70px', height: '70px', margin: '0 auto 15px',
                        background: 'rgba(212, 175, 55, 0.1)',
                        borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '1px solid rgba(212, 175, 55, 0.2)'
                    }}>
                        <img src={logo} alt="GoldTech Logo" style={{ height: '45px' }} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '10px', color: '#fff' }}>Secure Session Required</h2>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '30px' }}>Your administrative session has ended or is unauthorized.</p>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            width: '100%',
                            padding: '16px',
                            background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
                            color: '#000',
                            border: 'none',
                            borderRadius: '12px',
                            fontWeight: '800',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}
                    >
                        Return to Authentication
                    </button>
                </motion.div>
                <style>{`
                    .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
                    .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
                    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(212,175,55,0.2); borderRadius: 10px; }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(212,175,55,0.4); }
                `}</style>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'radial-gradient(circle at top right, #001E3C 0%, #000B18 100%)', color: '#fff' }}>
            {/* Sidebar */}
            <div style={{
                width: '280px',
                height: '100vh',
                background: 'rgba(0, 11, 24, 0.4)',
                backdropFilter: 'blur(30px)',
                WebkitBackdropFilter: 'blur(30px)',
                color: '#fff',
                padding: '25px',
                display: 'flex',
                flexDirection: 'column',
                borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                zIndex: 10,
                position: 'sticky',
                top: 0
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px', paddingBottom: '25px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <div style={{
                        width: '35px', height: '35px', background: 'rgba(212, 175, 55, 0.1)',
                        borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '1px solid rgba(212, 175, 55, 0.2)'
                    }}>
                        <img src={logo} alt="GoldTech Logo" style={{ width: '22px', height: 'auto' }} />
                    </div>
                    <div>
                        <span style={{ color: '#D4AF37', fontWeight: '800', fontSize: '1.3rem', letterSpacing: '1px' }}>GOLD</span>
                        <span style={{ color: '#fff', fontWeight: '800', fontSize: '1.3rem', letterSpacing: '1px' }}>TECH</span>
                    </div>
                </div>

                <nav className="custom-scrollbar" style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, overflowY: 'auto', paddingRight: '5px' }}>
                    <div style={{ padding: '15px 15px 10px', fontSize: '0.7rem', fontWeight: '700', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '2px' }}>Operations</div>
                    <button onClick={() => setActiveTab('overview')} style={navLinkStyle(activeTab === 'overview')}>
                        <LayoutDashboard size={18} /> Overview
                    </button>
                    <button onClick={() => setActiveTab('settings')} style={navLinkStyle(activeTab === 'settings')}>
                        <Settings size={18} /> Company Profile
                    </button>

                    <div style={{ padding: '20px 15px 10px', fontSize: '0.7rem', fontWeight: '700', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '2px' }}>Lead Management</div>
                    <button onClick={() => setActiveTab('queries')} style={navLinkStyle(activeTab === 'queries')}>
                        <Mail size={18} /> Central Inbox
                    </button>
                    <button onClick={() => setActiveTab('leads')} style={navLinkStyle(activeTab === 'leads')}>
                        <BarChart2 size={18} /> Sales Intelligence
                    </button>
                    <button onClick={() => setActiveTab('meetings')} style={navLinkStyle(activeTab === 'meetings')}>
                        <Calendar size={18} /> Scheduled Meeting
                    </button>
                    <button onClick={() => setActiveTab('chatbot')} style={navLinkStyle(activeTab === 'chatbot')}>
                        <Zap size={18} /> AI Chat Analysis
                    </button>

                    <div style={{ padding: '20px 15px 10px', fontSize: '0.7rem', fontWeight: '700', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '2px' }}>Human Resources</div>
                    <button onClick={() => setActiveTab('recruitment')} style={navLinkStyle(activeTab === 'recruitment')}>
                        <Briefcase size={18} /> Recruitment Pipeline
                    </button>
                    <button onClick={() => setActiveTab('directory')} style={navLinkStyle(activeTab === 'directory')}>
                        <Users size={18} /> Team Directory
                    </button>
                    <button onClick={() => setActiveTab('attendance')} style={navLinkStyle(activeTab === 'attendance')}>
                        <Clock size={18} /> Attendance & Tasks
                    </button>

                    <div style={{ padding: '20px 15px 10px', fontSize: '0.7rem', fontWeight: '700', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '2px' }}>Client Relations</div>
                    <button onClick={() => setActiveTab('crm')} style={navLinkStyle(activeTab === 'crm')}>
                        <Building size={18} /> Enterprise CRM
                    </button>
                    <button onClick={() => setActiveTab('project-health')} style={navLinkStyle(activeTab === 'project-health')}>
                        <Activity size={18} /> Project Systems
                    </button>

                    <div style={{ padding: '20px 15px 10px', fontSize: '0.7rem', fontWeight: '700', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '2px' }}>Infrastructure</div>
                    <button onClick={() => setActiveTab('infrastructure')} style={navLinkStyle(activeTab === 'infrastructure')}>
                        <Server size={18} /> Cloud Systems
                    </button>
                    <button onClick={() => setActiveTab('api-management')} style={navLinkStyle(activeTab === 'api-management')}>
                        <Key size={18} /> API Management
                    </button>
                    <button onClick={() => setActiveTab('security-center')} style={navLinkStyle(activeTab === 'security-center')}>
                        <Shield size={18} /> Security Center
                    </button>
                    <button onClick={() => setActiveTab('vault')} style={navLinkStyle(activeTab === 'vault')}>
                        <Lock size={18} /> Password Vault
                    </button>
                    <button onClick={() => setActiveTab('billing')} style={navLinkStyle(activeTab === 'billing')}>
                        <DollarSign size={18} /> Payroll & Billing
                    </button>
                    <button onClick={() => setActiveTab('access-management')} style={navLinkStyle(activeTab === 'access-management')}><ShieldCheck size={18} /> Access Management</button>

                    <div style={{ padding: '20px 15px 10px', fontSize: '0.7rem', fontWeight: '700', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '2px' }}>Intel & Audit</div>
                    <button onClick={() => setActiveTab('chat-analytics')} style={navLinkStyle(activeTab === 'chat-analytics')}>
                        <MessageSquare size={18} /> Conversational Logs
                    </button>
                    <button onClick={() => setActiveTab('audit')} style={navLinkStyle(activeTab === 'audit')}>
                        <ClipboardList size={18} /> Action Audit
                    </button>
                    <button onClick={() => navigate('/research')} style={navLinkStyle(false)}>
                        <Microscope size={18} /> Research Lab
                    </button>
                </nav>
                <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                        <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: 'rgba(212, 175, 55, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4AF37' }}>
                            <User size={18} />
                        </div>
                        <div>
                            <p style={{ fontSize: '0.9rem', fontWeight: '600' }}>Admin User</p>
                            <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>Super Admin</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} style={{ ...navLinkStyle(false), color: '#ef4444', justifyContent: 'flex-start' }}>
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, padding: '20px', overflowY: 'auto', position: 'relative', background: 'transparent', scrollbarGutter: 'stable' }}>
                <header style={{
                    marginBottom: '40px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0 10px'
                }}>
                    <div>
                        <h1 style={{
                            fontSize: '2.2rem',
                            color: '#fff',
                            fontWeight: '900',
                            letterSpacing: '-0.5px',
                            background: 'linear-gradient(to right, #fff 0%, #94a3b8 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: '4px'
                        }}>
                            {activeTab === 'overview' && 'Dashboard Overview'}
                            {activeTab === 'chatbot' && 'Chat Intelligence'}
                            {activeTab === 'recruitment' && 'Recruitment Management'}
                            {activeTab === 'directory' && 'Team Directory'}
                            {activeTab === 'attendance' && 'Attendance & Tasks'}
                            {activeTab === 'leads' && 'Pipeline Management'}
                            {activeTab === 'crm' && 'Client Management'}
                            {activeTab === 'project-health' && 'System Health'}
                            {activeTab === 'meetings' && 'Scheduled Meetings'}
                            {activeTab === 'gold-tech' && 'Gold Tech Monitor'}
                            {activeTab === 'hms-compliance' && 'HMS Compliance'}
                            {activeTab === 'infrastructure' && 'Cloud Architecture'}
                            {activeTab === 'api-management' && 'API Management'}
                            {activeTab === 'security-center' && 'Security Dashboard'}
                            {activeTab === 'vault' && 'Password Vault'}
                            {activeTab === 'billing' && 'Payroll & Finance'}
                            {activeTab === 'revenue' && 'Revenue Vectors'}
                            {activeTab === 'chat-analytics' && 'Conversational Intelligence'}

                            {activeTab === 'audit' && 'Immutable Logs'}
                            {activeTab === 'access-management' && 'Privileged Access Management'}
                            {activeTab === 'settings' && 'Core Configuration'}
                        </h1>
                        <p style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: '500' }}>Authenticated Command Session • {new Date().toLocaleDateString()}</p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            padding: '8px 16px',
                            borderRadius: '12px',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                            <Search size={18} color="#94a3b8" />
                            <input
                                type="text"
                                placeholder="Search Intel..."
                                style={{ background: 'none', border: 'none', outline: 'none', color: '#fff', width: '150px' }}
                                onFocus={() => setIsSearchOpen(true)}
                            />
                            <span style={{ fontSize: '0.7rem', color: '#cbd5e1', background: 'rgba(212, 175, 55, 0.15)', padding: '2px 8px', borderRadius: '4px', fontWeight: '800', border: '1px solid rgba(212, 175, 55, 0.2)' }}>⌘K</span>
                        </div>
                        <div style={{ position: 'relative', cursor: 'pointer' }}>
                            <Bell size={22} color="#94a3b8" />
                            <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', background: '#D4AF37', borderRadius: '50%', border: '2px solid #000B18' }}></div>
                        </div>
                        <button onClick={refreshData} disabled={isRefreshing} style={{
                            background: 'rgba(212, 175, 55, 0.1)',
                            border: '1px solid rgba(212, 175, 55, 0.2)',
                            color: '#D4AF37',
                            padding: '8px',
                            borderRadius: '10px',
                            cursor: 'pointer'
                        }}>
                            <RefreshCw size={20} className={isRefreshing ? 'spin' : ''} />
                        </button>
                    </div>
                </header>

                {activeTab === 'overview' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                        {/* 1. Stats Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                            {stats.map((stat, index) => (
                                <div key={index} style={cardStyle}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                                        <div style={{
                                            padding: '12px',
                                            borderRadius: '12px',
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            color: '#D4AF37'
                                        }}>
                                            {stat.icon}
                                        </div>
                                        <div style={{
                                            fontSize: '0.75rem',
                                            fontWeight: '700',
                                            color: stat.change.startsWith('+') ? '#10b981' : '#D4AF37',
                                            background: stat.change.startsWith('+') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(212, 175, 55, 0.1)',
                                            padding: '4px 8px',
                                            borderRadius: '6px'
                                        }}>
                                            {stat.change}
                                        </div>
                                    </div>
                                    <p style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>{stat.title}</p>
                                    <p style={{ color: '#fff', fontSize: '1.8rem', fontWeight: '800' }}>{stat.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* 2. Content Grid: Upcoming Meetings & Recent Activity */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>

                            {/* Upcoming Meetings */}
                            <div style={cardStyle}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                                    <h3 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: '800', letterSpacing: '0.5px' }}>Upcoming Meetings</h3>
                                    <button onClick={() => setActiveTab('meetings')} style={{ color: '#D4AF37', background: 'rgba(212, 175, 55, 0.1)', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '800', padding: '6px 14px', borderRadius: '8px', textTransform: 'uppercase' }}>View All</button>
                                </div>
                                {meetings.filter(m => m.status === 'Scheduled').slice(0, 3).length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                        {meetings.filter(m => m.status === 'Scheduled').slice(0, 3).map(meeting => (
                                            <div key={meeting.id} style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                padding: '15px',
                                                background: 'rgba(255, 255, 255, 0.02)',
                                                borderRadius: '12px',
                                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                                transition: 'all 0.3s'
                                            }}
                                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
                                            >
                                                <div style={{ marginRight: '20px', textAlign: 'center', minWidth: '60px', padding: '10px', background: 'rgba(212, 175, 55, 0.05)', borderRadius: '10px', border: '1px solid rgba(212, 175, 55, 0.1)' }}>
                                                    <p style={{ fontWeight: '800', color: '#D4AF37', fontSize: '1.2rem' }}>{meeting.date.split(' ')[0]}</p>
                                                    <p style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>{meeting.time}</p>
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <p style={{ fontWeight: '700', color: '#fff', fontSize: '1rem' }}>{meeting.name}</p>
                                                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '500' }}>Topic: <span style={{ color: '#D4AF37' }}>{meeting.topic}</span></p>
                                                </div>
                                                {meeting.link && (
                                                    <a href={meeting.link.startsWith('http') ? meeting.link : `https://${meeting.link}`} target="_blank" rel="noopener noreferrer"
                                                        style={{ padding: '10px', background: 'rgba(212, 175, 55, 0.1)', color: '#D4AF37', borderRadius: '10px', display: 'flex', alignItems: 'center', transition: 'all 0.3s' }}
                                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(212, 175, 55, 0.2)'}
                                                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)'}
                                                    >
                                                        <Video size={18} />
                                                    </a>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p style={{ color: '#94a3b8', fontStyle: 'italic', textAlign: 'center', padding: '20px' }}>Clear schedule. No upcoming meetings.</p>
                                )}
                            </div >

                            {/* Recent Activity */}
                            <div style={cardStyle}>
                                <h3 style={{ marginBottom: '25px', color: '#fff', fontSize: '1.2rem', fontWeight: '800', letterSpacing: '0.5px' }}>Recent Analytics Activity</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {(() => {
                                        const combinedActivity = [
                                            ...applications.map(a => ({ ...a, type: 'Application', action: 'Applied for role' })),
                                            ...queries.map(q => ({ ...q, type: 'Query', action: 'Sent a message' }))
                                        ].sort((a, b) => new Date(b.date) - new Date(a.date));

                                        return combinedActivity.slice(0, 4).map((item, idx) => (
                                            <div key={idx} style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '15px',
                                                padding: '12px',
                                                borderRadius: '12px',
                                                background: 'rgba(255, 255, 255, 0.02)',
                                                border: '1px solid rgba(255, 255, 255, 0.05)'
                                            }}>
                                                <div style={{
                                                    padding: '10px',
                                                    borderRadius: '10px',
                                                    background: item.type === 'Application' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                                    color: item.type === 'Application' ? '#3b82f6' : '#10b981',
                                                    border: `1px solid ${item.type === 'Application' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`
                                                }}>
                                                    {item.type === 'Application' ? <Briefcase size={16} /> : <MessageSquare size={16} />}
                                                </div>
                                                <div>
                                                    <p style={{ fontSize: '0.9rem', fontWeight: '500', color: '#fff' }}>
                                                        <span style={{ fontWeight: '800', color: '#D4AF37' }}>{item.name}</span> {item.action}
                                                    </p>
                                                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <Clock size={12} /> {item.date}
                                                    </p>
                                                </div>
                                            </div>
                                        ));
                                    })()}
                                </div>
                            </div >

                        </div >
                    </div >
                )}

                {/* Tables Sections - keeping structure, updating styles via cardStyle */}
                {/* 1. Operations & Talent Modules */}
                {activeTab === 'recruitment' && (
                    <div style={cardStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                            <h3 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: '800' }}>Active Talent Pipeline</h3>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    id="post-job-btn"
                                    onClick={() => { setModalType('post_job'); setFormData({ title: '', role: '', experience: '', education: '', description: '', responsibilities: '', note: '', department: 'Engineering', location: 'Remote', type: 'Full-time' }); }}
                                    style={{
                                        background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
                                        color: '#000',
                                        border: 'none',
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        fontSize: '0.8rem',
                                        fontWeight: '800',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <Plus size={14} /> POST NEW JOB
                                </button>
                                <button onClick={refreshData} style={{ background: 'rgba(212, 175, 55, 0.1)', color: '#D4AF37', border: '1px solid rgba(212, 175, 55, 0.2)', padding: '8px 16px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <RefreshCw size={14} className={isRefreshing ? "spin-icon" : ""} /> REFRESH PIPELINE
                                </button>
                            </div>
                        </div>

                        {/* Filter & Sort Bar */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '25px', padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            {/* Search */}
                            <div style={{ position: 'relative' }}>
                                <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                                <input
                                    type="text"
                                    placeholder="Search candidates..."
                                    value={recruitmentFilters.search}
                                    onChange={(e) => setRecruitmentFilters({ ...recruitmentFilters, search: e.target.value })}
                                    style={{ ...inputStyle, padding: '8px 12px 8px 35px', width: '100%', fontSize: '0.85rem' }}
                                />
                            </div>

                            {/* Stage Filter */}
                            <select
                                value={recruitmentFilters.stage}
                                onChange={(e) => setRecruitmentFilters({ ...recruitmentFilters, stage: e.target.value })}
                                style={{ ...inputStyle, padding: '8px 12px', fontSize: '0.85rem' }}
                            >
                                <option value="All" style={{ background: '#1a1a1a', color: '#fff' }}>All Stages</option>
                                {recruitmentStages.map(stage => (
                                    <option key={stage} value={stage} style={{ background: '#1a1a1a', color: '#fff' }}>
                                        {stage.charAt(0).toUpperCase() + stage.slice(1)}
                                    </option>
                                ))}
                            </select>

                            {/* Role Filter */}
                            <select
                                value={recruitmentFilters.role}
                                onChange={(e) => setRecruitmentFilters({ ...recruitmentFilters, role: e.target.value })}
                                style={{ ...inputStyle, padding: '8px 12px', fontSize: '0.85rem' }}
                            >
                                <option value="All" style={{ background: '#1a1a1a', color: '#fff' }}>All Roles</option>
                                {[...new Set(candidates.map(c => c.role))].sort().map(role => (
                                    role && <option key={role} value={role} style={{ background: '#1a1a1a', color: '#fff' }}>{role}</option>
                                ))}
                            </select>

                            {/* Source Filter */}
                            <select
                                value={recruitmentFilters.source}
                                onChange={(e) => setRecruitmentFilters({ ...recruitmentFilters, source: e.target.value })}
                                style={{ ...inputStyle, padding: '8px 12px', fontSize: '0.85rem' }}
                            >
                                <option value="All" style={{ background: '#1a1a1a', color: '#fff' }}>All Sources</option>
                                {[...new Set(candidates.map(c => c.source || 'Career Page'))].sort().map(source => (
                                    <option key={source} value={source} style={{ background: '#1a1a1a', color: '#fff' }}>{source}</option>
                                ))}
                            </select>

                            {/* Sort By */}
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <select
                                    value={recruitmentSort.key}
                                    onChange={(e) => setRecruitmentSort({ ...recruitmentSort, key: e.target.value })}
                                    style={{ ...inputStyle, flex: 1, padding: '8px 12px', fontSize: '0.85rem' }}
                                >
                                    <option value="name" style={{ background: '#1a1a1a', color: '#fff' }}>Sort by Name</option>
                                    <option value="role" style={{ background: '#1a1a1a', color: '#fff' }}>Sort by Role</option>
                                    <option value="stage" style={{ background: '#1a1a1a', color: '#fff' }}>Sort by Stage</option>
                                    <option value="appliedDate" style={{ background: '#1a1a1a', color: '#fff' }}>Sort by Time</option>
                                </select>
                                <button
                                    onClick={() => setRecruitmentSort({ ...recruitmentSort, direction: recruitmentSort.direction === 'asc' ? 'desc' : 'asc' })}
                                    style={{ ...inputStyle, width: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0' }}
                                    title={`Direction: ${recruitmentSort.direction}`}
                                >
                                    {recruitmentSort.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                </button>
                            </div>

                            {/* Clear All */}
                            <button
                                onClick={() => {
                                    setRecruitmentFilters({ search: '', stage: 'All', role: 'All', source: 'All' });
                                    setRecruitmentSort({ key: 'appliedDate', direction: 'desc' });
                                }}
                                style={{ ...inputStyle, background: 'rgba(212, 175, 55, 0.1)', color: '#D4AF37', border: '1px solid rgba(212, 175, 55, 0.2)', fontWeight: 'bold', fontSize: '0.75rem', letterSpacing: '0.5px' }}
                            >
                                RESET
                            </button>
                        </div>

                        <div style={{ overflowX: 'auto' }} className="custom-scrollbar">
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
                                        <th style={{ ...thStyle, width: '80px' }}>Ref ID</th>
                                        <th style={thStyle}>Candidate Identity</th>
                                        <th style={thStyle}>Target Role</th>
                                        <th style={thStyle}>Recruitment Stage</th>
                                        <th style={thStyle}>Message</th>
                                        <th style={thStyle}>Pipeline Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {processedCandidates.map((candidate) => (
                                        <tr key={candidate.id} id={`candidate-row-${candidate.id}`} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)', transition: 'all 0.3s' }} className="premium-row">
                                            <td style={tdStyle}>
                                                <code style={{ fontSize: '0.7rem', color: '#D4AF37', background: 'rgba(212, 175, 55, 0.1)', padding: '2px 6px', borderRadius: '4px', fontWeight: '800' }}>
                                                    GT-C-{candidate.id.toString().padStart(3, '0')}
                                                </code>
                                            </td>
                                            <td style={tdStyle}>
                                                <div style={{ fontWeight: '700', color: '#fff' }}>{candidate.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{candidate.email}</div>
                                            </td>
                                            <td style={tdStyle}>
                                                <div style={{ fontWeight: '600' }}>{candidate.role}</div>
                                            </td>
                                            <td style={tdStyle}>
                                                <span style={statusBadge(candidate.stage)}>
                                                    {candidate.stage}
                                                </span>
                                            </td>
                                            <td style={tdStyle}>
                                                <div style={{
                                                    fontSize: '0.85rem',
                                                    color: '#cbd5e1',
                                                    maxWidth: '200px',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    fontWeight: '500'
                                                }} title={candidate.screening}>
                                                    {candidate.screening || 'No message provided'}
                                                </div>
                                            </td>
                                            <td style={tdStyle}>
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    <button
                                                        id={`prev-stage-btn-${candidate.id}`}
                                                        onClick={() => handleMoveStage(candidate.id, -1)}
                                                        disabled={recruitmentStages.indexOf(candidate.stage) === 0}
                                                        style={{
                                                            color: recruitmentStages.indexOf(candidate.stage) === 0 ? '#64748b' : '#D4AF37',
                                                            background: 'rgba(255, 255, 255, 0.02)',
                                                            border: '1px solid rgba(255, 255, 255, 0.05)',
                                                            cursor: recruitmentStages.indexOf(candidate.stage) === 0 ? 'not-allowed' : 'pointer',
                                                            padding: '6px',
                                                            borderRadius: '6px',
                                                            display: 'flex',
                                                            alignItems: 'center'
                                                        }}
                                                        title="Previous Stage"
                                                    >
                                                        <ChevronLeft size={16} />
                                                    </button>

                                                    <button
                                                        id={`view-candidate-btn-${candidate.id}`}
                                                        onClick={() => handleViewItem(candidate, 'application')}
                                                        style={{
                                                            color: '#D4AF37',
                                                            background: 'rgba(212, 175, 55, 0.1)',
                                                            border: '1px solid rgba(212, 175, 55, 0.2)',
                                                            cursor: 'pointer',
                                                            padding: '6px 12px',
                                                            borderRadius: '6px',
                                                            fontSize: '0.75rem',
                                                            fontWeight: '800',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '6px'
                                                        }}
                                                    >
                                                        <Eye size={14} /> DETAILS
                                                    </button>

                                                    <button
                                                        id={`next-stage-btn-${candidate.id}`}
                                                        onClick={() => handleMoveStage(candidate.id, 1)}
                                                        disabled={recruitmentStages.indexOf(candidate.stage) === recruitmentStages.length - 1}
                                                        style={{
                                                            color: recruitmentStages.indexOf(candidate.stage) === recruitmentStages.length - 1 ? '#64748b' : '#D4AF37',
                                                            background: 'rgba(255, 255, 255, 0.02)',
                                                            border: '1px solid rgba(255, 255, 255, 0.05)',
                                                            cursor: recruitmentStages.indexOf(candidate.stage) === recruitmentStages.length - 1 ? 'not-allowed' : 'pointer',
                                                            padding: '6px',
                                                            borderRadius: '6px',
                                                            display: 'flex',
                                                            alignItems: 'center'
                                                        }}
                                                        title="Next Stage"
                                                    >
                                                        <ChevronRight size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Job Vacancies Section */}
                        <div style={{ marginTop: '50px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '40px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                                <h3 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: '800' }}>Active Job Vacancies</h3>
                            </div>

                            <div style={{ overflowX: 'auto' }} className="custom-scrollbar">
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
                                            <th style={thStyle}>Job Identity</th>
                                            <th style={thStyle}>Experience</th>
                                            <th style={thStyle}>Posted Date</th>
                                            <th style={thStyle}>Applicants</th>
                                            <th style={thStyle}>Vacancies Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {jobs.map((job) => (
                                            <tr key={job.id} id={`job-row-${job.id}`} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }} className="premium-row">
                                                <td style={tdStyle}>
                                                    <div style={{ fontWeight: '700', color: '#fff' }}>{job.title}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{job.department} • {job.location}</div>
                                                </td>
                                                <td style={tdStyle}>{job.experience}</td>
                                                <td style={tdStyle}>{job.postedDate}</td>
                                                <td style={tdStyle}>
                                                    <span style={{ color: '#D4AF37', fontWeight: '800' }}>{job.applicants}</span>
                                                </td>
                                                <td style={tdStyle}>
                                                    <div style={{ display: 'flex', gap: '10px' }}>
                                                        <button
                                                            id={`edit-job-btn-${job.id}`}
                                                            onClick={() => { setSelectedItem(job); setFormData(job); setModalType('post_job'); }}
                                                            style={{ color: '#D4AF37', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', cursor: 'pointer', padding: '6px', borderRadius: '6px' }}
                                                            title="Edit Job"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button
                                                            id={`delete-job-btn-${job.id}`}
                                                            onClick={() => handleDelete(job.id, 'job')}
                                                            style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)', cursor: 'pointer', padding: '6px', borderRadius: '6px' }}
                                                            title="Delete Job"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'directory' && (
                    <div style={cardStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                            <h3 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: '800' }}>Team Availability & Capacity</h3>
                            <div style={{ display: 'flex', gap: '20px' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#94a3b8', fontWeight: '700' }}><div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px rgba(16, 185, 129, 0.4)' }}></div> AVAILABLE</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#94a3b8', fontWeight: '700' }}><div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 10px rgba(245, 158, 11, 0.4)' }}></div> ENGAGED</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#94a3b8', fontWeight: '700' }}><div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 10px rgba(239, 68, 68, 0.4)' }}></div> AT CAPACITY</span>
                            </div>
                        </div>
                        <div style={{ overflowX: 'auto', paddingBottom: '10px' }} className="custom-scrollbar">
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
                                        <th style={thStyle}>Team Member</th>
                                        <th style={thStyle}>Designation</th>
                                        <th style={thStyle}>Department</th>
                                        <th style={thStyle}>Active Project</th>
                                        <th style={thStyle}>Current Workload</th>
                                        <th style={thStyle}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u) => (
                                        <tr key={u.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                                            <td style={tdStyle}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>{u.name.charAt(0)}</div>
                                                    <div>
                                                        <div style={{ fontWeight: '700' }}>{u.name}</div>
                                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            {u.email}
                                                            <button
                                                                onClick={() => { copyToClipboard(u.email); setCopiedId(`${u.id}-email`); setTimeout(() => setCopiedId(null), 2000); }}
                                                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: copiedId === `${u.id}-email` ? '#10b981' : '#64748b', display: 'flex' }}
                                                                title="Copy Email"
                                                            >
                                                                {copiedId === `${u.id}-email` ? <Check size={10} /> : <Copy size={10} />}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={tdStyle}>{u.role}</td>
                                            <td style={tdStyle}>{u.department}</td>
                                            <td style={tdStyle}>{u.id === 102 ? 'Gold ERP' : u.id === 101 ? 'Security Audit' : 'Internal Ops'}</td>
                                            <td style={tdStyle}>
                                                <div style={{ width: '100px', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                                                    <div style={{ width: `${u.id === 102 ? 85 : 40}%`, height: '100%', background: u.id === 102 ? '#f59e0b' : '#10b981', boxShadow: '0 0 10px currentColor' }}></div>
                                                </div>
                                                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '700', marginTop: '4px', display: 'block' }}>{u.id === 102 ? '85%' : '40%'} ALLOCATION</span>
                                            </td>
                                            <td style={tdStyle}>
                                                <span style={{
                                                    padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold',
                                                    background: u.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                    color: u.status === 'Active' ? '#10b981' : '#ef4444'
                                                }}>{u.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'attendance' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div style={cardStyle}>
                                <h3 style={{ marginBottom: '20px', color: '#fff', fontSize: '1.2rem', fontWeight: '800' }}>Leave Requests</h3>
                                <div style={{ overflowX: 'auto', paddingBottom: '10px' }} className="custom-scrollbar">
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
                                                <th style={thStyle}>Employee</th>
                                                <th style={thStyle}>Leave Type</th>
                                                <th style={thStyle}>Date Range</th>
                                                <th style={thStyle}>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {AdminService.getLeaveRequests().map(req => (
                                                <tr key={req.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                                                    <td style={tdStyle}>{req.name}</td>
                                                    <td style={tdStyle}>{req.type}</td>
                                                    <td style={tdStyle}>{req.startDate} - {req.endDate}</td>
                                                    <td style={tdStyle}>
                                                        <span style={statusBadge(req.status)}>{req.status}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div style={cardStyle}>
                                <h3 style={{ marginBottom: '20px', color: '#fff', fontSize: '1.2rem', fontWeight: '800' }}>Team Activity</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {users.map(u => (
                                        <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                            <span style={{ fontWeight: '700', color: '#fff' }}>{u.name}</span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '500' }}>{u.status === 'Active' ? 'Status: Online' : 'Status: Offline'}</span>
                                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: u.status === 'Active' ? '#10b981' : '#64748b', boxShadow: u.status === 'Active' ? '0 0 10px #10b981' : 'none' }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'queries' && (
                    <div style={cardStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                            <h3 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: '800' }}>Central Inbox</h3>
                            <button
                                onClick={refreshData}
                                disabled={isRefreshing}
                                style={{
                                    background: 'rgba(212, 175, 55, 0.1)',
                                    border: '1px solid rgba(212, 175, 55, 0.2)',
                                    color: '#D4AF37',
                                    padding: '10px 20px',
                                    borderRadius: '10px',
                                    fontWeight: '800',
                                    cursor: isRefreshing ? 'not-allowed' : 'pointer'
                                }}
                            >
                                <RefreshCw size={18} className={isRefreshing ? "spin" : ""} />
                                {isRefreshing ? 'Syncing...' : 'Sync Inbox'}
                            </button>
                        </div>
                        {queries.length === 0 ? (
                            <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
                                <p>No queries found.</p>
                            </div>
                        ) : (
                            <div style={{ overflowX: 'auto', paddingBottom: '10px' }} className="custom-scrollbar">
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
                                            <th style={thStyle}>Operator Name</th>
                                            <th style={thStyle}>Message Payload</th>
                                            <th style={thStyle}>Contact Identity</th>
                                            <th style={thStyle}>Time & Date</th>
                                            <th style={thStyle}>Status</th>
                                            <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {queries.map((q) => (
                                            <tr key={q.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                                                <td style={{ ...tdStyle, fontWeight: '700', color: '#fff' }}>{q.name}</td>
                                                <td style={{ ...tdStyle, color: '#cbd5e1', fontSize: '0.85rem' }}>{q.message}</td>
                                                <td style={tdStyle}>{q.email}</td>
                                                <td style={{ ...tdStyle, color: '#94a3b8', fontSize: '0.8rem' }}>{q.date}</td>
                                                <td style={tdStyle}><span style={statusBadge(q.status)}>{q.status}</span></td>
                                                <td style={{ ...tdStyle, textAlign: 'right' }}>
                                                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                                        <button onClick={() => handleViewItem(q, 'query')} style={{ color: '#D4AF37', background: 'rgba(212, 175, 55, 0.1)', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '8px' }}><Eye size={16} /></button>
                                                        <button onClick={() => handleDelete(q.id, 'query')} style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '8px' }}><Trash2 size={16} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'leads' && (
                    <div style={cardStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                            <h3 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: '800' }}>Sales Intelligence</h3>
                            <button onClick={refreshData} style={{ background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.2)', color: '#D4AF37', padding: '10px 20px', borderRadius: '10px', fontWeight: '800', cursor: 'pointer' }}>Update Funnel</button>
                        </div>
                        <div style={{ overflowX: 'auto', paddingBottom: '10px' }} className="custom-scrollbar">
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
                                        <th style={thStyle}>Identity Profile</th>
                                        <th style={thStyle}>Message</th>
                                        <th style={thStyle}>Sales Intelligence</th>
                                        <th style={thStyle}>Temporal Activity</th>
                                        <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {queries.filter(q => !q.message?.includes('[SECURITY]')).map((q) => (
                                        <tr key={q.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                                            <td style={tdStyle}>
                                                <div style={{ fontWeight: '700', color: '#fff' }}>{q.name}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    {q.email}
                                                    <button
                                                        onClick={() => { copyToClipboard(q.email); setCopiedId(`${q.id}-email`); setTimeout(() => setCopiedId(null), 2000); }}
                                                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: copiedId === `${q.id}-email` ? '#10b981' : '#64748b', display: 'flex' }}
                                                        title="Copy Email"
                                                    >
                                                        {copiedId === `${q.id}-email` ? <Check size={12} /> : <Copy size={12} />}
                                                    </button>
                                                </div>
                                            </td>
                                            <td style={tdStyle}>
                                                <span style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>{q.message || q.subject}</span>
                                            </td>
                                            <td style={tdStyle}><span style={statusBadge(q.status)}>{q.status === 'New' ? 'Priority Target' : q.status}</span></td>
                                            <td style={{ ...tdStyle, color: '#94a3b8', fontSize: '0.85rem' }}>{q.date}</td>
                                            <td style={{ ...tdStyle, textAlign: 'right' }}>
                                                <button onClick={() => handleViewItem(q, 'query')} style={{ color: '#000', background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)', border: 'none', cursor: 'pointer', fontWeight: '800', padding: '8px 16px', borderRadius: '8px' }}>Initiate Contact</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'crm' && (
                    <div style={cardStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                            <h3 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: '800' }}>Client Ecosystem</h3>
                            <button onClick={() => handleOpenClientModal()} style={{ background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.2)', color: '#D4AF37', padding: '10px 20px', borderRadius: '10px', fontWeight: '800', cursor: 'pointer', fontSize: '0.75rem', textTransform: 'uppercase' }}>Onboard Client</button>
                        </div>
                        <div style={{ overflowX: 'auto', paddingBottom: '10px' }} className="custom-scrollbar">
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
                                        <th style={thStyle}>Strategic Partner</th>
                                        <th style={thStyle}>Command Liaison</th>
                                        <th style={thStyle}>Service Tier</th>
                                        <th style={thStyle}>Active Assets</th>
                                        <th style={thStyle}>Status</th>
                                        <th style={{ ...thStyle, textAlign: 'right' }}>Management</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clients.map((c) => (
                                        <tr key={c.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)', transition: 'all 0.3s' }}>
                                            <td style={{ ...tdStyle, fontWeight: '800', color: '#fff' }}>{c.name}</td>
                                            <td style={tdStyle}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    {c.contactPerson || 'System Managed'}
                                                    {c.contactPerson && (
                                                        <button
                                                            onClick={() => { copyToClipboard(c.contactPerson); setCopiedId(`${c.id}-liaison`); setTimeout(() => setCopiedId(null), 2000); }}
                                                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: copiedId === `${c.id}-liaison` ? '#10b981' : '#64748b', display: 'flex' }}
                                                            title="Copy Liaison"
                                                        >
                                                            {copiedId === `${c.id}-liaison` ? <Check size={12} /> : <Copy size={12} />}
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                            <td style={tdStyle}>
                                                <span style={{ padding: '4px 10px', background: 'rgba(212, 175, 55, 0.1)', color: '#D4AF37', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '800' }}>ELITE SUPPORT</span>
                                            </td>
                                            <td style={tdStyle}><span style={{ color: '#cbd5e1' }}>4 Operational Projects</span></td>
                                            <td style={tdStyle}><span style={statusBadge(c.status)}>{c.status}</span></td>
                                            <td style={{ ...tdStyle, textAlign: 'right' }}>
                                                <button onClick={() => handleOpenClientModal(c)} style={{ color: '#D4AF37', background: 'rgba(212, 175, 55, 0.1)', border: 'none', cursor: 'pointer', fontWeight: '800', padding: '8px 16px', borderRadius: '8px', fontSize: '0.75rem', textTransform: 'uppercase' }}>MANAGE</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {
                    activeTab === 'project-health' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                                {projectHealth.map(project => (
                                    <div key={project.id} style={{
                                        ...cardStyle,
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                            <h4 style={{ margin: 0, color: '#fff', fontWeight: '800', fontSize: '1.1rem' }}>{project.name}</h4>
                                            <span style={{
                                                padding: '4px 10px', borderRadius: '8px', fontSize: '0.65rem', fontWeight: '800',
                                                background: project.risk === 'Low' ? 'rgba(16, 185, 129, 0.1)' : project.risk === 'Medium' ? 'rgba(212, 175, 55, 0.1)' : 'rgba(225, 29, 72, 0.1)',
                                                color: project.risk === 'Low' ? '#10b981' : project.risk === 'Medium' ? '#D4AF37' : '#f43f5e',
                                                border: `1px solid ${project.risk === 'Low' ? 'rgba(16, 185, 129, 0.2)' : project.risk === 'Medium' ? 'rgba(212, 175, 55, 0.2)' : 'rgba(225, 29, 72, 0.2)'}`,
                                                textTransform: 'uppercase'
                                            }}>{project.risk} Risk</span>
                                        </div>
                                        <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '10px', overflow: 'hidden', marginBottom: '15px' }}>
                                            <div style={{ width: `${project.progress}%`, height: '100%', background: project.status === 'On Track' ? 'linear-gradient(90deg, #10b981, #34d399)' : 'linear-gradient(90deg, #D4AF37, #F2D06B)' }}></div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#94a3b8', fontWeight: '600' }}>
                                            <span>Completion: {project.progress}%</span>
                                            <span>Due: {project.deadline}</span>
                                        </div>
                                        <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Milestones: <strong style={{ color: '#D4AF37' }}>{project.milestonesReached}/{project.milestones}</strong></div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: project.status === 'On Track' ? '#10b981' : '#f43f5e' }}></div>
                                                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: project.status === 'On Track' ? '#10b981' : '#f43f5e', textTransform: 'uppercase' }}>{project.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div style={cardStyle}>
                                <h3 style={{ marginBottom: '20px' }}>Project Delivery Timeline</h3>
                                <div style={{ height: '300px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={projectHealth}>
                                            <defs>
                                                <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                            <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                            <Tooltip
                                                contentStyle={{ background: '#001E3C', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                                                itemStyle={{ color: '#D4AF37' }}
                                            />
                                            <Area type="monotone" dataKey="progress" stroke="#D4AF37" strokeWidth={3} fillOpacity={1} fill="url(#colorProgress)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    )
                }

                {
                    activeTab === 'meetings' && (
                        <div style={cardStyle}>
                            <div style={{ overflowX: 'auto', paddingBottom: '10px' }} className="custom-scrollbar">
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
                                            <th style={thStyle}>Client Partner</th>
                                            <th style={thStyle}>Session Objective</th>
                                            <th style={thStyle}>Temporal Window</th>
                                            <th style={thStyle}>Meeting Status</th>
                                            <th style={thStyle}>Communication Link</th>
                                            <th style={{ ...thStyle, textAlign: 'right' }}>Directives</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {meetings.map((m) => (
                                            <tr key={m.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                                                <td style={{ ...tdStyle, fontWeight: '800', color: '#fff' }}>{m.name}</td>
                                                <td style={tdStyle}>{m.topic}</td>
                                                <td style={tdStyle}>{m.date} at {m.time}</td>
                                                <td style={tdStyle}>
                                                    <span style={statusBadge(m.status)}>{m.status}</span>
                                                </td>
                                                <td style={tdStyle}>
                                                    {m.link ? (
                                                        <a
                                                            href={m.link.startsWith('http') ? m.link : `https://${m.link}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            style={{ color: '#D4AF37', textDecoration: 'none', fontWeight: '500' }}
                                                        >
                                                            {m.link}
                                                        </a>
                                                    ) : (
                                                        <span style={{ color: '#94a3b8' }}>No Link</span>
                                                    )}
                                                </td>
                                                <td style={{ ...tdStyle, textAlign: 'right' }}>
                                                    <button
                                                        onClick={() => handleViewItem(m, 'meeting')}
                                                        style={{ color: '#000', background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)', border: 'none', cursor: 'pointer', fontWeight: '800', padding: '8px 16px', borderRadius: '8px', fontSize: '0.75rem' }}
                                                    >
                                                        DETAILS
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )
                }

                {/* 3. Industry Verticals Modules */}
                {
                    activeTab === 'gold-tech' && industryMetrics && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={cardStyle}>
                                <h3 style={{ marginBottom: '25px', color: '#fff', fontSize: '1.2rem', fontWeight: '800', letterSpacing: '0.5px' }}>Distributed Ledger Terminal</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                                    {industryMetrics.goldTech.ledgers.map(ledger => (
                                        <div key={ledger.id} style={{
                                            padding: '20px',
                                            background: 'rgba(255, 255, 255, 0.02)',
                                            borderRadius: '16px',
                                            border: '1px solid rgba(255, 255, 255, 0.05)',
                                            transition: 'all 0.3s'
                                        }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
                                                <span style={{ fontWeight: '800', color: '#fff', fontSize: '0.95rem' }}>{ledger.name}</span>
                                                <span style={{
                                                    color: ledger.status === 'Synced' ? '#10b981' : '#D4AF37',
                                                    fontSize: '0.7rem',
                                                    fontWeight: '800',
                                                    background: ledger.status === 'Synced' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(212, 175, 55, 0.1)',
                                                    padding: '4px 8px',
                                                    borderRadius: '6px',
                                                    textTransform: 'uppercase'
                                                }}>{ledger.status}</span>
                                            </div>
                                            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '15px', fontFamily: 'monospace' }}>LATEST_BLOCK: {ledger.lastBlock}</div>
                                            <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                                                <div style={{ width: `${ledger.health}%`, height: '100%', background: 'linear-gradient(90deg, #D4AF37, #F2D06B)' }}></div>
                                            </div>
                                            <div style={{ marginTop: '8px', textAlign: 'right', fontSize: '0.7rem', fontWeight: '700', color: '#D4AF37' }}>SYSTEM_HEALTH: {ledger.health}%</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div style={cardStyle}>
                                <h3 style={{ marginBottom: '25px', color: '#fff', fontSize: '1.2rem', fontWeight: '800', letterSpacing: '0.5px' }}>Logistics Nexus APIs</h3>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                                            <th style={thStyle}>API Endpoint</th>
                                            <th style={thStyle}>Status</th>
                                            <th style={thStyle}>Latency</th>
                                            <th style={thStyle}>Throughput</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {industryMetrics.goldTech.logisticsAPIs.map((api, idx) => (
                                            <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                <td style={tdStyle}>{api.name}</td>
                                                <td style={tdStyle}><span style={{ color: api.status === 'Healthy' ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>{api.status}</span></td>
                                                <td style={tdStyle}>{api.latency}</td>
                                                <td style={tdStyle}>{api.throughput}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )
                }

                {
                    activeTab === 'hms-compliance' && industryMetrics && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={cardStyle}>
                                <h3 style={{ marginBottom: '25px', color: '#fff', fontSize: '1.2rem', fontWeight: '800', letterSpacing: '0.5px' }}>Compliance Governance Proxy</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                                    {industryMetrics.healthcare.compliance.map((item, idx) => (
                                        <div key={idx} style={{
                                            padding: '25px',
                                            background: 'rgba(255, 255, 255, 0.02)',
                                            borderRadius: '20px',
                                            textAlign: 'center',
                                            border: '1px solid rgba(255, 255, 255, 0.05)'
                                        }}>
                                            <div style={{ marginBottom: '12px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>{item.name}</div>
                                            <div style={{ fontSize: '2.5rem', fontWeight: '900', color: item.score === 100 ? '#10b981' : '#D4AF37', marginBottom: '8px' }}>{item.score}%</div>
                                            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#fff' }}>Protocol: <strong style={{ color: item.status === 'Compliant' ? '#10b981' : '#D4AF37' }}>{item.status}</strong></div>
                                            <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px' }}>Last Scan: {item.lastAudit}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div style={cardStyle}>
                                <h3 style={{ marginBottom: '20px' }}>Security Infrastructure (Healthcare Edition)</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                                    {Object.entries(industryMetrics.healthcare.securityStatus).map(([key, value]) => (
                                        <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '15px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                                            <Shield size={20} color="#10b981" />
                                            <div>
                                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{key.replace(/([A-Z])/g, ' $1').toUpperCase()}</div>
                                                <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{value}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )
                }

                {/* 4. Technical Infrastructure Modules */}
                {
                    activeTab === 'api-management' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={cardStyle}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                                    <h3 style={{ margin: 0, color: '#fff', fontSize: '1.2rem', fontWeight: '800' }}>Governance & Audit Logs</h3>
                                    <button
                                        onClick={() => {
                                            const name = prompt('Enter API Key Name:');
                                            const service = prompt('Enter Service Name:');
                                            if (name && service) {
                                                AdminService.generateApiKey(name, service);
                                                refreshData();
                                            }
                                        }}
                                        style={{ background: '#0f172a', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                                    >
                                        <Plus size={18} /> Generate New Key
                                    </button>
                                </div>
                                <div style={{ height: '250px', marginBottom: '30px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={infraStats?.apiUsage || []}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                            <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis yAxisId="left" orientation="left" stroke="#D4AF37" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                            <Tooltip
                                                contentStyle={{ background: '#001E3C', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                                                itemStyle={{ color: '#D4AF37' }}
                                            />
                                            <Bar yAxisId="left" dataKey="calls" fill="#D4AF37" radius={[4, 4, 0, 0]} name="Total Calls" />
                                            <Bar yAxisId="right" dataKey="latency" fill="rgba(212, 175, 55, 0.2)" radius={[4, 4, 0, 0]} name="Avg Latency (ms)" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                                            <th style={thStyle}>Name</th>
                                            <th style={thStyle}>Service</th>
                                            <th style={thStyle}>Prefix</th>
                                            <th style={thStyle}>Status</th>
                                            <th style={thStyle}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {apiKeys.map((key) => (
                                            <tr key={key.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                <td style={tdStyle}>{key.name}</td>
                                                <td style={tdStyle}>{key.service}</td>
                                                <td style={{ ...tdStyle, fontFamily: 'monospace' }}>{key.key.substring(0, 8)}...</td>
                                                <td style={tdStyle}><span style={{ color: key.status === 'Active' ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>{key.status}</span></td>
                                                <td style={tdStyle}>
                                                    <button onClick={() => AdminService.revokeApiKey(key.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>Revoke</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )
                }

                {
                    activeTab === 'security-center' && securityHealth && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                            {/* Security Intelligence Overview */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                                <div style={cardStyle}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                        <h3 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: '800' }}>MFA Adoption Metric</h3>
                                        <ShieldCheck size={20} color="#10b981" />
                                    </div>
                                    <div style={{ position: 'relative', height: '180px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                        <div style={{ fontSize: '3rem', fontWeight: '900', color: '#10b981' }}>{securityHealth.mfaRate}%</div>
                                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Global Coverage</div>
                                        <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', marginTop: '20px', overflow: 'hidden' }}>
                                            <div style={{ width: `${securityHealth.mfaRate}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #34d399)' }}></div>
                                        </div>
                                    </div>
                                </div>

                                <div style={cardStyle}>
                                    <h3 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: '800', marginBottom: '20px' }}>Password Strength Distribution</h3>
                                    <div style={{ height: '180px' }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={[
                                                { name: 'Strong', value: securityHealth.strengthDist.Strong, fill: '#10b981' },
                                                { name: 'Medium', value: securityHealth.strengthDist.Medium, fill: '#f59e0b' },
                                                { name: 'Weak', value: securityHealth.strengthDist.Weak, fill: '#ef4444' }
                                            ]}>
                                                <XAxis dataKey="name" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                                                <Tooltip
                                                    contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                                />
                                                <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                <div style={cardStyle}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                        <h3 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: '800' }}>Exposure Analytics</h3>
                                        <Eye size={20} color="#ef4444" />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                        <div style={{ padding: '15px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#ef4444' }}>{securityHealth.exposedCredentials}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: '800', textTransform: 'uppercase' }}>High Risk Credentials</div>
                                        </div>
                                        <div style={{ padding: '15px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#fff' }}>{securityHealth.totalCredentials}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '800', textTransform: 'uppercase' }}>Total Protected Assets</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '25px' }}>
                                {/* Critical Security Alerts */}
                                <div style={cardStyle}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                                        <h3 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: '800' }}>Operational Security Alerts</h3>
                                        <div style={{ background: '#ef4444', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '900' }}>
                                            {securityHealth.criticalAlerts.length} URGENT
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {securityHealth.criticalAlerts.map((alert, idx) => (
                                            <div key={idx} style={{
                                                display: 'flex', alignItems: 'center', gap: '15px', padding: '18px',
                                                background: 'rgba(239, 68, 68, 0.05)', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.1)'
                                            }}>
                                                <div style={{ padding: '10px', background: 'rgba(239, 68, 68, 0.2)', borderRadius: '10px', color: '#ef4444' }}>
                                                    <AlertTriangle size={20} />
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: '800', color: '#fff', fontSize: '0.95rem' }}>{alert.issue}</div>
                                                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600' }}>OPERATOR: {alert.user}</div>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        const user = users.find(u => u.name === alert.user);
                                                        if (user) {
                                                            setActiveTab('access-management');
                                                            // Could potentially trigger password reset modal here
                                                        }
                                                    }}
                                                    style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer' }}
                                                >
                                                    MITIGATE
                                                </button>
                                            </div>
                                        ))}
                                        {securityHealth.criticalAlerts.length === 0 && (
                                            <div style={{ padding: '40px', textAlign: 'center', color: '#10b981', fontWeight: '700' }}>
                                                <ShieldCheck size={48} style={{ marginBottom: '15px', opacity: 0.3 }} />
                                                <div>ALL SYSTEMS OPERATIONAL</div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Security Compliance Trail */}
                                <div style={cardStyle}>
                                    <h3 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: '800', marginBottom: '20px' }}>Compliance Audit</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                        {complianceLogs?.slice(0, 5).map(log => (
                                            <div key={log.id} style={{ paddingBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#fff' }}>{log.action}</div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
                                                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{log.user}</span>
                                                    <span style={{ fontSize: '0.75rem', color: log.severity === 'High' ? '#ef4444' : '#94a3b8', fontWeight: '800' }}>{log.severity}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => setActiveTab('audit')}
                                        style={{ width: '100%', marginTop: '20px', padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', color: '#94a3b8', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}
                                    >
                                        VIEW FULL LEDGER
                                    </button>
                                </div>
                            </div>
                        </div>
                    )

                }

                {/* 5. Financials & Reporting Modules */}
                {
                    activeTab === 'billing' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                                <div style={cardStyle}>
                                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Total Unpaid Invoices</div>
                                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#ef4444' }}>${financialMetrics?.overdueInvoices.toLocaleString()}</div>
                                </div>
                                <div style={cardStyle}>
                                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Pending Billing (This Month)</div>
                                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1e293b' }}>$42,500</div>
                                </div>
                                <div style={cardStyle}>
                                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Projected Revenue Q4</div>
                                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#004687' }}>$285,000</div>
                                </div>
                            </div>
                            <div style={cardStyle}>
                                <h3 style={{ marginBottom: '20px' }}>Overdue Invoices Tracking</h3>
                                <div style={{ overflowX: 'auto', paddingBottom: '10px' }} className="custom-scrollbar">
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
                                                <th style={thStyle}>Invoice #</th>
                                                <th style={thStyle}>Client Entity</th>
                                                <th style={thStyle}>Valuation</th>
                                                <th style={thStyle}>Temporal Deadline</th>
                                                <th style={thStyle}>Overdue Interval</th>
                                                <th style={thStyle}>Administrative</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[
                                                { id: 'INV-4521', client: 'EduStream', amount: 3500, due: '2023-10-15', days: 37 },
                                                { id: 'INV-4558', client: 'StartUp Hub', amount: 1200, due: '2023-11-01', days: 20 },
                                                { id: 'INV-4590', client: 'Global Corp', amount: 8000, due: '2023-11-15', days: 6 }
                                            ].map(inv => (
                                                <tr key={inv.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                                                    <td style={{ ...tdStyle, fontWeight: '700' }}>{inv.id}</td>
                                                    <td style={tdStyle}>{inv.client}</td>
                                                    <td style={{ ...tdStyle, color: '#D4AF37', fontWeight: '800' }}>${inv.amount.toLocaleString()}</td>
                                                    <td style={tdStyle}>{inv.due}</td>
                                                    <td style={tdStyle}><span style={{ color: '#f43f5e', fontWeight: '800' }}>{inv.days} DAYS</span></td>
                                                    <td style={tdStyle}>
                                                        <button style={{ color: '#D4AF37', background: 'rgba(212, 175, 55, 0.1)', border: 'none', cursor: 'pointer', padding: '6px 12px', borderRadius: '6px', fontWeight: '800', fontSize: '0.7rem' }}>NOTIFY</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )
                }

                {
                    activeTab === 'revenue' && financialMetrics && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={cardStyle}>
                                <h3 style={{ marginBottom: '25px', color: '#fff', fontSize: '1.2rem', fontWeight: '800' }}>Revenue Architecture: MRR vs Liquidity</h3>
                                <div style={{ height: '350px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={[
                                                    { name: 'Monthly Recurring (MRR)', value: financialMetrics.mrr },
                                                    { name: 'One-time Project Fees', value: financialMetrics.projectFees / 12 }
                                                ]}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={80}
                                                outerRadius={130}
                                                paddingAngle={8}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                <Cell fill="#D4AF37" />
                                                <Cell fill="rgba(212, 175, 55, 0.1)" />
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ background: '#001E3C', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                                            />
                                            <Legend verticalAlign="bottom" height={36} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div style={cardStyle}>
                                    <h3 style={{ marginBottom: '15px' }}>Monthly Revenue Growth</h3>
                                    <div style={{ height: '200px' }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={[
                                                { month: 'Jun', rev: 85000 },
                                                { month: 'Jul', rev: 92000 },
                                                { month: 'Aug', rev: 88000 },
                                                { month: 'Sep', rev: 105000 },
                                                { month: 'Oct', rev: 115000 },
                                                { month: 'Nov', rev: 125000 }
                                            ]}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                                <Tooltip
                                                    contentStyle={{ background: '#001E3C', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                                                    itemStyle={{ color: '#D4AF37' }}
                                                />
                                                <Line type="monotone" dataKey="rev" stroke="#D4AF37" strokeWidth={4} dot={{ r: 6, fill: '#D4AF37', strokeWidth: 2, stroke: '#000B18' }} activeDot={{ r: 8, strokeWidth: 0 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                <div style={cardStyle}>
                                    <h3 style={{ marginBottom: '20px', color: '#fff', fontSize: '1.2rem', fontWeight: '800' }}>Portfolio Concentration</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                        {[
                                            { name: 'Healthcare Co', val: 45 },
                                            { name: 'Global Corp', val: 25 },
                                            { name: 'TechSolutions', val: 20 },
                                            { name: 'Others', val: 10 }
                                        ].map((c, i) => (
                                            <div key={i}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px', color: '#cbd5e1', fontWeight: '600' }}>
                                                    <span>{c.name}</span>
                                                    <span style={{ color: '#D4AF37' }}>{c.val}%</span>
                                                </div>
                                                <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                                                    <div style={{ width: `${c.val}%`, height: '100%', background: 'linear-gradient(90deg, #D4AF37, #F2D06B)' }}></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }

                {/* --- Client Onboarding (Moved below) --- */}

                {
                    activeTab === 'settings' && (
                        <div style={cardStyle}>
                            <h3 style={{ marginBottom: '20px', color: '#1e293b' }}>Role-Based Access Control (RBAC)</h3>
                            <div style={{ overflowX: 'auto', paddingBottom: '10px' }} className="custom-scrollbar">
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
                                            <th style={thStyle}>Role Name</th>
                                            <th style={thStyle}>User Management</th>
                                            <th style={thStyle}>Content Engine</th>
                                            <th style={thStyle}>Intelligence Reports</th>
                                            <th style={thStyle}>System Configuration</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {roles.map((role) => (
                                            <tr key={role.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                                                <td style={{ ...tdStyle, fontWeight: '800', color: '#fff' }}>{role.name}</td>
                                                {['users', 'content', 'reports', 'settings'].map(perm => (
                                                    <td key={perm} style={tdStyle}>
                                                        <select
                                                            value={role.permissions[perm]}
                                                            onChange={(e) => handlePermissionChange(role.id, perm, e.target.value)}
                                                            style={{
                                                                padding: '8px 12px',
                                                                borderRadius: '8px',
                                                                background: 'rgba(0,0,0,0.2)',
                                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                                color: '#fff',
                                                                width: '100%',
                                                                maxWidth: '140px',
                                                                fontSize: '0.8rem',
                                                                outline: 'none'
                                                            }}
                                                            disabled={role.name === 'Admin'}
                                                        >
                                                            <option value="read_write">Full Access</option>
                                                            <option value="read">View Only</option>
                                                            <option value="none">Restricted</option>
                                                        </select>
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )
                }

                {
                    activeTab === 'reports' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {/* Reports Summary Cards */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                                <div style={cardStyle}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                                        <div>
                                            <h3 style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '500' }}>Total Revenue</h3>
                                            <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1e293b' }}>$124,500</p>
                                        </div>
                                        <div style={{ padding: '10px', background: 'rgba(212, 175, 55, 0.1)', borderRadius: '8px' }}>
                                            <Briefcase size={24} color="#D4AF37" />
                                        </div>
                                    </div>
                                    <p style={{ fontSize: '0.9rem', color: '#10b981' }}>+15% from last month</p>
                                </div>
                                <div style={cardStyle}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                                        <div>
                                            <h3 style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '500' }}>New Leads</h3>
                                            <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1e293b' }}>482</p>
                                        </div>
                                        <div style={{ padding: '10px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px' }}>
                                            <Users size={24} color="#3b82f6" />
                                        </div>
                                    </div>
                                    <p style={{ fontSize: '0.9rem', color: '#10b981' }}>+8% new users</p>
                                </div>
                                <div style={cardStyle}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                                        <div>
                                            <h3 style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '500' }}>Support Tickets</h3>
                                            <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1e293b' }}>24</p>
                                        </div>
                                        <div style={{ padding: '10px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                                            <MessageSquare size={24} color="#ef4444" />
                                        </div>
                                    </div>
                                    <p style={{ fontSize: '0.9rem', color: '#10b981' }}>-5% decrease (Good)</p>
                                </div>
                            </div>

                            {/* Recent Reports Table */}
                            <div style={cardStyle}>
                                <h3 style={{ marginBottom: '20px', color: '#1e293b' }}>Generated Reports</h3>
                                <div style={{ overflowX: 'auto', paddingBottom: '10px' }} className="custom-scrollbar">
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
                                                <th style={thStyle}>Intelligence Asset</th>
                                                <th style={thStyle}>Time Stamp</th>
                                                <th style={thStyle}>Authorized By</th>
                                                <th style={thStyle}>System Tier</th>
                                                <th style={thStyle}>Directives</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[
                                                { id: 1, name: 'Monthly Financial Summary', date: 'Oct 2023', by: 'Admin User', type: 'PDF' },
                                                { id: 2, name: 'User Growth Analytics', date: 'Oct 2023', by: 'System', type: 'CSV' },
                                                { id: 3, name: 'Service Performance Review', date: 'Sep 2023', by: 'Admin User', type: 'PDF' },
                                                { id: 4, name: 'Q3 Sales Report', date: 'Sep 2023', by: 'Manager', type: 'PDF' },
                                            ].map((report) => (
                                                <tr key={report.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                                                    <td style={{ ...tdStyle, fontWeight: '700' }}>{report.name}</td>
                                                    <td style={tdStyle}>{report.date}</td>
                                                    <td style={tdStyle}>{report.by}</td>
                                                    <td style={tdStyle}>
                                                        <span style={{
                                                            padding: '4px 10px',
                                                            borderRadius: '6px',
                                                            fontSize: '0.75rem',
                                                            fontWeight: '800',
                                                            background: report.type === 'PDF' ? 'rgba(244, 63, 94, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                                                            color: report.type === 'PDF' ? '#f43f5e' : '#3b82f6',
                                                            border: `1px solid ${report.type === 'PDF' ? 'rgba(244, 63, 94, 0.2)' : 'rgba(59, 130, 246, 0.2)'}`
                                                        }}>
                                                            {report.type}
                                                        </span>
                                                    </td>
                                                    <td style={tdStyle}>
                                                        <button style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '8px',
                                                            background: 'rgba(212, 175, 55, 0.1)',
                                                            border: 'none',
                                                            padding: '8px 16px',
                                                            borderRadius: '8px',
                                                            cursor: 'pointer',
                                                            color: '#D4AF37',
                                                            fontSize: '0.8rem',
                                                            fontWeight: '800'
                                                        }}>
                                                            <Download size={14} /> EXPORT
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )
                }

                {/* --- AI Chat Analytics --- */}
                {
                    activeTab === 'chatbot' && (
                        <div style={{ padding: '0 10px', width: '100%', margin: '0' }}>
                            <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '10px', background: 'linear-gradient(90deg, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                        AI Chat Analytics
                                    </h2>
                                    <p style={{ color: '#94a3b8' }}>Monitor chatbot performance and review conversation logs.</p>
                                </div>
                                <button
                                    onClick={refreshData}
                                    disabled={isRefreshing}
                                    style={{
                                        background: 'linear-gradient(90deg, #D4AF37 0%, #F2D06B 100%)',
                                        border: 'none',
                                        color: '#002C5F',
                                        cursor: isRefreshing ? 'not-allowed' : 'pointer',
                                        fontWeight: 'bold',
                                        padding: '10px 20px',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                        opacity: isRefreshing ? 0.8 : 1,
                                        fontSize: '1rem'
                                    }}
                                >
                                    <RefreshCw size={18} className={isRefreshing ? "spin-icon" : ""} style={isRefreshing ? { animation: 'spin 1s linear infinite' } : {}} />
                                    {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
                                </button>
                                <style>{`
                                @keyframes spin {
                                    from { transform: rotate(0deg); }
                                    to { transform: rotate(360deg); }
                                }
                            `}</style>
                            </div>

                            {/* Stat Cards */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                                <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: '16px', padding: '24px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
                                        <div style={{ background: 'rgba(34, 197, 94, 0.1)', padding: '10px', borderRadius: '12px', color: '#22c55e' }}>
                                            <MessageSquare size={24} />
                                        </div>
                                        <span style={{ fontSize: '0.9rem', color: '#22c55e', background: 'rgba(34, 197, 94, 0.1)', padding: '4px 10px', borderRadius: '20px' }}>+12%</span>
                                    </div>
                                    <h3 style={{ fontSize: '2rem', fontWeight: '700', margin: '0 0 5px 0' }}>{chatStats?.totalChats || 0}</h3>
                                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>Total Conversations</p>
                                </div>

                                <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: '16px', padding: '24px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
                                        <div style={{ background: 'rgba(234, 179, 8, 0.1)', padding: '10px', borderRadius: '12px', color: '#eab308' }}>
                                            <Users size={24} />
                                        </div>
                                        <span style={{ fontSize: '0.9rem', color: '#eab308', background: 'rgba(234, 179, 8, 0.1)', padding: '4px 10px', borderRadius: '20px' }}>{chatStats ? ((chatStats.leadsCaptured / chatStats.totalChats) * 100).toFixed(0) : 0}% Conv.</span>
                                    </div>
                                    <h3 style={{ fontSize: '2rem', fontWeight: '700', margin: '0 0 5px 0' }}>{chatStats?.leadsCaptured || 0}</h3>
                                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>Leads Captured</p>
                                </div>

                                <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: '16px', padding: '24px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
                                        <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '10px', borderRadius: '12px', color: '#3b82f6' }}>
                                            <Clock size={24} />
                                        </div>
                                    </div>
                                    <h3 style={{ fontSize: '2rem', fontWeight: '700', margin: '0 0 5px 0' }}>{chatStats?.avgDuration || '0m'}</h3>
                                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>Avg. Duration</p>
                                </div>

                                <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: '16px', padding: '24px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
                                        <div style={{ background: 'rgba(168, 85, 247, 0.1)', padding: '10px', borderRadius: '12px', color: '#a855f7' }}>
                                            <BarChart2 size={24} />
                                        </div>
                                    </div>
                                    <h3 style={{ fontSize: '2rem', fontWeight: '700', margin: '0 0 5px 0' }}>{chatStats?.satisfaction || 'N/A'}</h3>
                                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>User Satisfaction</p>
                                </div>
                            </div>

                            {/* Recent Chat Logs */}
                            <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.05)', overflow: 'hidden' }}>
                                <div style={{ padding: '20px 30px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Recent Chat Sessions</h3>
                                    <button
                                        onClick={refreshData}
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            border: 'none',
                                            color: '#fff',
                                            padding: '8px 12px',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        <RefreshCw size={16} className={isRefreshing ? 'spin' : ''} /> Refresh
                                    </button>
                                </div>

                                <div style={{ overflowX: 'auto', paddingBottom: '10px' }} className="custom-scrollbar">
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                                        <thead>
                                            <tr style={{ background: 'rgba(255, 255, 255, 0.02)', textAlign: 'left', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                                <th style={{ padding: '16px 30px', color: '#94a3b8', fontWeight: '600', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Session ID</th>
                                                <th style={{ padding: '16px 30px', color: '#94a3b8', fontWeight: '600', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>User</th>
                                                <th style={{ padding: '16px 30px', color: '#94a3b8', fontWeight: '600', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contact</th>
                                                <th style={{ padding: '16px 30px', color: '#94a3b8', fontWeight: '600', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                                                <th style={{ padding: '16px 30px', color: '#94a3b8', fontWeight: '600', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Duration</th>
                                                <th style={{ padding: '16px 30px', color: '#94a3b8', fontWeight: '600', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Timestamp</th>
                                                <th style={{ padding: '16px 30px', color: '#94a3b8', fontWeight: '600', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {chatLogs.length > 0 ? (
                                                chatLogs.map((log) => (
                                                    <tr key={log.id} className="premium-row" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)', transition: 'all 0.3s ease' }}>
                                                        <td style={{ padding: '16px 30px' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#D4AF37', fontWeight: '600', fontSize: '0.85rem' }}>
                                                                <Hash size={14} />
                                                                GT-{log.id ? String(log.id).slice(-4).toUpperCase() : '----'}
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: '16px 30px' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                                <div style={{
                                                                    width: '36px', height: '36px', borderRadius: '10px',
                                                                    background: 'linear-gradient(135deg, #3b82f622, #8b5cf622)',
                                                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                    color: '#D4AF37', fontSize: '0.9rem', fontWeight: '700'
                                                                }}>
                                                                    {log.user.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <div style={{ fontWeight: '600', color: '#f8fafc' }}>{log.user}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: '16px 30px' }}>
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                                {log.formData?.email && (
                                                                    <div style={{ fontSize: '0.85rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                        <div style={{ background: 'rgba(212, 175, 55, 0.1)', padding: '4px', borderRadius: '4px', color: '#D4AF37' }}><Mail size={12} /></div>
                                                                        {log.formData.email}
                                                                        <button
                                                                            onClick={() => { copyToClipboard(log.formData.email); setCopiedId(`${log.id}-email`); setTimeout(() => setCopiedId(null), 2000); }}
                                                                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: copiedId === `${log.id}-email` ? '#10b981' : '#64748b', display: 'flex' }}
                                                                            title="Copy Email"
                                                                        >
                                                                            {copiedId === `${log.id}-email` ? <Check size={12} /> : <Copy size={12} />}
                                                                        </button>
                                                                    </div>
                                                                )}
                                                                {log.formData?.phone && (
                                                                    <div style={{ fontSize: '0.85rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                        <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '4px', borderRadius: '4px', color: '#10b981' }}><Phone size={12} /></div>
                                                                        {log.formData.phone}
                                                                        <button
                                                                            onClick={() => { copyToClipboard(log.formData.phone); setCopiedId(`${log.id}-phone`); setTimeout(() => setCopiedId(null), 2000); }}
                                                                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: copiedId === `${log.id}-phone` ? '#10b981' : '#64748b', display: 'flex' }}
                                                                            title="Copy Phone"
                                                                        >
                                                                            {copiedId === `${log.id}-phone` ? <Check size={12} /> : <Copy size={12} />}
                                                                        </button>
                                                                    </div>
                                                                )}
                                                                {!log.formData?.email && !log.formData?.phone && (
                                                                    <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontStyle: 'italic', fontWeight: '600' }}>[ No Contact Data Provided ]</span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: '16px 30px' }}>
                                                            <span className={log.status === 'New' ? "status-pulse-gold" : ""} style={statusBadge(log.status)}>
                                                                {log.status === 'New' ? '● New Interaction' : log.status}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: '16px 30px' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.85rem' }}>
                                                                <Clock size={14} /> {log.duration}
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: '16px 30px' }}>
                                                            <div style={{ color: '#f8fafc', fontSize: '0.85rem', fontWeight: '500' }}>{log.date}</div>
                                                            <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{log.time}</div>
                                                        </td>
                                                        <td style={{ padding: '16px 30px', textAlign: 'right' }}>
                                                            <button
                                                                onClick={() => { setSelectedItem(log); setModalType('chat_transcript'); }}
                                                                style={{
                                                                    background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.2)',
                                                                    color: '#D4AF37', cursor: 'pointer', padding: '8px 16px', borderRadius: '8px',
                                                                    fontSize: '0.85rem', fontWeight: '600', transition: 'all 0.2s',
                                                                    display: 'inline-flex', alignItems: 'center', gap: '6px'
                                                                }}
                                                                onMouseEnter={(e) => { e.currentTarget.style.background = '#D4AF37'; e.currentTarget.style.color = '#002C5F'; }}
                                                                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)'; e.currentTarget.style.color = '#D4AF37'; }}
                                                            >
                                                                <Eye size={16} /> View
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                                                        No chat logs found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )
                }

                {
                    activeTab === 'monitoring' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {/* Health Cards */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                                <div style={cardStyle}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                        <Activity size={24} color="#3b82f6" />
                                        <h3 style={{ fontSize: '0.9rem', color: '#64748b' }}>CPU Usage</h3>
                                    </div>
                                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{systemHealth.cpu}%</p>
                                    <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', marginTop: '10px' }}>
                                        <div style={{ width: `${systemHealth.cpu}%`, height: '100%', background: '#3b82f6', borderRadius: '3px' }}></div>
                                    </div>
                                </div>
                                <div style={cardStyle}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                        <Server size={24} color="#8b5cf6" />
                                        <h3 style={{ fontSize: '0.9rem', color: '#64748b' }}>Memory Usage</h3>
                                    </div>
                                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{systemHealth.memory}%</p>
                                    <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', marginTop: '10px' }}>
                                        <div style={{ width: `${systemHealth.memory}%`, height: '100%', background: '#8b5cf6', borderRadius: '3px' }}></div>
                                    </div>
                                </div>
                                <div style={cardStyle}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                        <HardDrive size={24} color="#f59e0b" />
                                        <h3 style={{ fontSize: '0.9rem', color: '#64748b' }}>Disk Space</h3>
                                    </div>
                                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{systemHealth.disk}%</p>
                                    <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', marginTop: '10px' }}>
                                        <div style={{ width: `${systemHealth.disk}%`, height: '100%', background: '#f59e0b', borderRadius: '3px' }}></div>
                                    </div>
                                </div>
                                <div style={cardStyle}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                        <Activity size={24} color="#10b981" />
                                        <h3 style={{ fontSize: '0.9rem', color: '#64748b' }}>Uptime</h3>
                                    </div>
                                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{systemHealth.uptime}</p>
                                    <p style={{ fontSize: '0.8rem', color: '#10b981', marginTop: '10px' }}>All systems operational</p>
                                </div>
                            </div>

                            {/* Services Status */}
                            <div style={cardStyle}>
                                <h3 style={{ marginBottom: '15px', color: '#1e293b' }}>Microservices Status</h3>
                                <div style={{ overflowX: 'auto', paddingBottom: '10px' }} className="custom-scrollbar">
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
                                                <th style={thStyle}>Identity / ID</th>
                                                <th style={thStyle}>Revision</th>
                                                <th style={thStyle}>Operational Time</th>
                                                <th style={thStyle}>Vital Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {serviceStatus.map(s => (
                                                <tr key={s.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                                                    <td style={{ ...tdStyle, fontWeight: '700', color: '#fff' }}>{s.name}</td>
                                                    <td style={tdStyle}>{s.version}</td>
                                                    <td style={tdStyle}>{s.uptime}</td>
                                                    <td style={tdStyle}>
                                                        <span style={{
                                                            padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800',
                                                            background: s.status === 'Online' ? 'rgba(16, 185, 129, 0.1)' : s.status === 'Degraded' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                                                            color: s.status === 'Online' ? '#10b981' : s.status === 'Degraded' ? '#f59e0b' : '#f43f5e',
                                                            border: `1px solid ${s.status === 'Online' ? 'rgba(16, 185, 129, 0.2)' : s.status === 'Degraded' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(244, 63, 94, 0.2)'}`
                                                        }}>
                                                            {s.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* System Logs */}
                            <div style={cardStyle}>
                                <h3 style={{ marginBottom: '15px', color: '#1e293b' }}>Recent System Logs</h3>
                                <div style={{ maxHeight: '300px', overflowY: 'auto', background: '#0f172a', color: '#33ff33', padding: '15px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                                    {systemLogs.map(log => (
                                        <div key={log.id} style={{ marginBottom: '5px', borderBottom: '1px solid #334155', paddingBottom: '5px' }}>
                                            <span style={{ color: '#94a3b8', marginRight: '10px' }}>[{log.timestamp}]</span>
                                            <span style={{
                                                color: log.type === 'Error' ? '#ef4444' : log.type === 'Warning' ? '#f59e0b' : '#3b82f6',
                                                fontWeight: 'bold', marginRight: '10px'
                                            }}>
                                                {log.type.toUpperCase()}:
                                            </span>
                                            <span>{log.message}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )
                }

                {/* Modal Overlay System */}
                {
                    modalType && ['application', 'query', 'meeting', 'upsert_client', 'upsert_credential', 'upsert_user', 'chat_transcript', 'post_job', 'loading'].includes(modalType) && (
                        <div style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'rgba(0,0,0,0.5)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 1000
                        }} onClick={closeModal}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                style={{
                                    background: 'rgba(0, 30, 60, 0.85)',
                                    backdropFilter: 'blur(30px)',
                                    WebkitBackdropFilter: 'blur(30px)',
                                    padding: '40px',
                                    borderRadius: '24px',
                                    width: '100%',
                                    maxWidth: '600px',
                                    maxHeight: '85vh',
                                    overflowY: 'auto',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className="custom-scrollbar"
                            >
                                <div style={{ position: 'relative' }}>
                                    <button onClick={closeModal} style={{ position: 'absolute', top: '-10px', right: '-10px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                                        <X size={24} />
                                    </button>

                                    {modalType === 'upsert_client' && (
                                        <form onSubmit={handleClientSubmit}>
                                            <h2 style={{ marginBottom: '25px', color: '#fff', fontSize: '1.5rem', fontWeight: '800' }}>
                                                {selectedItem ? 'Refine Client Record' : 'Initialize Client Record'}
                                            </h2>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                                                    <div>
                                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Client Name</label>
                                                        <input
                                                            type="text"
                                                            value={formData.name || ''}
                                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                            style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff' }}
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Industry</label>
                                                        <select
                                                            value={formData.industry || ''}
                                                            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                                            style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff' }}
                                                            required
                                                        >
                                                            <option value="" disabled>Select Industry</option>
                                                            <option value="Technology">Technology</option>
                                                            <option value="Banking & Finance">Banking & Finance</option>
                                                            <option value="Healthcare">Healthcare</option>
                                                            <option value="Retail & E-commerce">Retail & E-commerce</option>
                                                            <option value="Manufacturing">Manufacturing</option>
                                                            <option value="Education">Education</option>
                                                            <option value="Real Estate">Real Estate</option>
                                                            <option value="Other">Other</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Client Phone No</label>
                                                        <input
                                                            type="tel"
                                                            value={formData.clientPhone || ''}
                                                            onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                                                            style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff' }}
                                                        />
                                                    </div>
                                                </div>

                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                                                    <div>
                                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>POC Name</label>
                                                        <input
                                                            type="text"
                                                            value={formData.pocName || ''}
                                                            onChange={(e) => setFormData({ ...formData, pocName: e.target.value })}
                                                            style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff' }}
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>POC Phone</label>
                                                        <input
                                                            type="tel"
                                                            value={formData.pocPhone || ''}
                                                            onChange={(e) => setFormData({ ...formData, pocPhone: e.target.value })}
                                                            style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff' }}
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>POC Email</label>
                                                        <input
                                                            type="email"
                                                            value={formData.pocEmail || ''}
                                                            onChange={(e) => setFormData({ ...formData, pocEmail: e.target.value })}
                                                            style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff' }}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                                    <div>
                                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Corporate Email</label>
                                                        <input
                                                            type="email"
                                                            value={formData.email || ''}
                                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                            style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', color: '#fff' }}
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Project ID</label>
                                                        <input
                                                            type="text"
                                                            value={formData.projectId || ''}
                                                            onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                                                            style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', color: '#fff' }}
                                                            placeholder="e.g. PRJ-1011"
                                                        />
                                                    </div>
                                                </div>

                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                                    <div>
                                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Project Name</label>
                                                        <input
                                                            type="text"
                                                            value={formData.projectName || ''}
                                                            onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                                                            style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', color: '#fff' }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Project Manager</label>
                                                        <input
                                                            type="text"
                                                            value={formData.projectManager || ''}
                                                            onChange={(e) => setFormData({ ...formData, projectManager: e.target.value })}
                                                            style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', color: '#fff' }}
                                                        />
                                                    </div>
                                                </div>

                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                                    <div>
                                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Business Head Details</label>
                                                        <input
                                                            type="text"
                                                            value={formData.businessHead || ''}
                                                            onChange={(e) => setFormData({ ...formData, businessHead: e.target.value })}
                                                            style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', color: '#fff' }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Expiry Date</label>
                                                        <input
                                                            type="date"
                                                            value={formData.expiryDate || ''}
                                                            onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                                            style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', color: '#fff' }}
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Project Details</label>
                                                    <textarea
                                                        value={formData.projectDetails || ''}
                                                        onChange={(e) => setFormData({ ...formData, projectDetails: e.target.value })}
                                                        style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', color: '#fff', minHeight: '80px', resize: 'vertical' }}
                                                    />
                                                </div>

                                                <div>
                                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Client ID (System Generated)</label>
                                                    <input
                                                        type="text"
                                                        value={formData.clientId || ''}
                                                        readOnly
                                                        style={{ width: '100%', padding: '12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', color: '#94a3b8', cursor: 'not-allowed' }}
                                                    />
                                                </div>

                                                {!selectedItem && (
                                                    <div>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                            <label style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Client Portal Password</label>
                                                            <button
                                                                type="button"
                                                                onClick={async () => {
                                                                    const strongPass = await AdminService.generateSecurePassword();
                                                                    setFormData({ ...formData, password: strongPass });
                                                                }}
                                                                style={{ background: 'none', border: 'none', color: '#D4AF37', fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                                                            >
                                                                <RefreshCw size={12} /> Suggest Secure Password
                                                            </button>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            value={formData.password || ''}
                                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                            placeholder="Secure password required for portal login"
                                                            style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', color: '#fff' }}
                                                            required={!selectedItem}
                                                        />
                                                    </div>
                                                )}

                                                {selectedItem && (
                                                    <div style={{ marginTop: '5px' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                            <label style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Reset Client Password (Optional)</label>
                                                            <button
                                                                type="button"
                                                                onClick={async () => {
                                                                    const strongPass = await AdminService.generateSecurePassword();
                                                                    setFormData({ ...formData, newPassword: strongPass });
                                                                }}
                                                                style={{ background: 'none', border: 'none', color: '#D4AF37', fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                                                            >
                                                                <RefreshCw size={12} /> Suggest Secure Password
                                                            </button>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            value={formData.newPassword || ''}
                                                            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                                            placeholder="Leave blank to keep current password"
                                                            style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', color: '#fff' }}
                                                        />
                                                    </div>
                                                )}
                                                {modalError && (
                                                    <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '10px', color: '#ef4444', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <AlertCircle size={16} /> {modalError}
                                                    </div>
                                                )}
                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    style={{
                                                        marginTop: '10px',
                                                        background: isSubmitting ? '#4b5563' : 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
                                                        color: isSubmitting ? '#9ca3af' : '#000',
                                                        border: 'none',
                                                        padding: '14px',
                                                        borderRadius: '10px',
                                                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                                        fontWeight: '800',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '1px',
                                                        opacity: isSubmitting ? 0.7 : 1
                                                    }}
                                                >
                                                    {isSubmitting ? 'Processing...' : (selectedItem ? 'Authorize Update' : 'Create Client Record')}
                                                </button>
                                            </div>
                                        </form>
                                    )}

                                    {modalType === 'upsert_credential' && (
                                        <form onSubmit={handleCredentialSubmit}>
                                            <h2 style={{ marginBottom: '25px', color: '#fff', fontSize: '1.5rem', fontWeight: '800' }}>
                                                {selectedItem ? 'Edit Credential' : 'Add New Credential'}
                                            </h2>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                                <div>
                                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Production Service</label>
                                                    <input
                                                        type="text"
                                                        value={formData.service || ''}
                                                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                                                        style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff' }}
                                                        required
                                                    />
                                                </div>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                                    <div>
                                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Username / ID</label>
                                                        <input
                                                            type="text"
                                                            value={formData.username || ''}
                                                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                                            style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff' }}
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Category</label>
                                                        <select
                                                            value={formData.category || 'Infrastructure'}
                                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                            style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff' }}
                                                        >
                                                            <option value="Infrastructure">Infrastructure</option>
                                                            <option value="Database">Database</option>
                                                            <option value="SaaS">SaaS Platform</option>
                                                            <option value="Security">Security Tool</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                        <label style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Master Key (Password)</label>
                                                        <button
                                                            type="button"
                                                            onClick={async () => {
                                                                const strongKey = await AdminService.generateSecurePassword();
                                                                setFormData({ ...formData, password: strongKey });
                                                            }}
                                                            style={{ background: 'none', border: 'none', color: '#D4AF37', fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                                                        >
                                                            <RefreshCw size={12} /> Suggest Secure Key
                                                        </button>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={formData.password || ''}
                                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                        style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', marginBottom: '8px' }}
                                                        required
                                                    />
                                                    {formData.password && (
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                            <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                                                                <div style={{
                                                                    width: `${(AdminService.checkPasswordStrength(formData.password).score / 5) * 100}%`,
                                                                    height: '100%',
                                                                    background: AdminService.checkPasswordStrength(formData.password).color,
                                                                    transition: 'all 0.3s'
                                                                }}></div>
                                                            </div>
                                                            <span style={{ fontSize: '0.7rem', fontWeight: '800', color: AdminService.checkPasswordStrength(formData.password).color }}>
                                                                {AdminService.checkPasswordStrength(formData.password).label}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                {modalError && (
                                                    <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '10px', color: '#ef4444', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <AlertCircle size={16} /> {modalError}
                                                    </div>
                                                )}
                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    style={{
                                                        marginTop: '10px',
                                                        background: isSubmitting ? '#4b5563' : 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
                                                        color: isSubmitting ? '#9ca3af' : '#000',
                                                        border: 'none',
                                                        padding: '14px',
                                                        borderRadius: '10px',
                                                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                                        fontWeight: '800',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '1px',
                                                        opacity: isSubmitting ? 0.7 : 1
                                                    }}
                                                >
                                                    {isSubmitting ? 'Processing...' : (selectedItem ? 'Authorize Update' : 'Secure New Credential')}
                                                </button>
                                            </div>
                                        </form>
                                    )}

                                    {modalType === 'upsert_user' && (
                                        <form onSubmit={handleUserSubmit}>
                                            <h2 style={{ marginBottom: '25px', color: '#fff', fontSize: '1.5rem', fontWeight: '800' }}>
                                                {selectedItem ? 'Update User Details' : 'Add New User'}
                                            </h2>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                                    <div>
                                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Full Legal Name</label>
                                                        <input
                                                            type="text"
                                                            value={formData.name || ''}
                                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                            style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', color: '#fff' }}
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Corporate Email</label>
                                                        <input
                                                            type="email"
                                                            value={formData.email || ''}
                                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                            style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', color: '#fff' }}
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Employee ID (System Generated)</label>
                                                        <input
                                                            type="text"
                                                            value={formData.employeeId || ''}
                                                            readOnly
                                                            style={{ width: '100%', padding: '12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', color: '#94a3b8', cursor: 'not-allowed' }}
                                                        />
                                                    </div>
                                                </div>

                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                                    <div>
                                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Department</label>
                                                        <select
                                                            value={formData.department || ''}
                                                            onChange={(e) => setFormData({ ...formData, department: e.target.value, designation: '' })}
                                                            style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', color: '#fff' }}
                                                            required
                                                        >
                                                            <option value="" disabled>Select Department</option>
                                                            {Object.keys(departmentDesignations).map(dept => (
                                                                <option key={dept} value={dept}>{dept}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Designation</label>
                                                        <select
                                                            value={formData.designation || ''}
                                                            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                                            style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', color: '#fff' }}
                                                            required
                                                            disabled={!formData.department}
                                                        >
                                                            <option value="" disabled>{formData.department ? 'Select Designation' : 'Select Department First'}</option>
                                                            {formData.department && departmentDesignations[formData.department].map(desg => (
                                                                <option key={desg} value={desg}>{desg}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>

                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                                    <div>
                                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Date of Birth</label>
                                                        <input
                                                            type="date"
                                                            value={formData.dob || ''}
                                                            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                                            style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', color: '#fff' }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Mobile No</label>
                                                        <input
                                                            type="tel"
                                                            value={formData.mobile || ''}
                                                            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                                            placeholder="+1 234 567 890"
                                                            style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', color: '#fff' }}
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label style={{ display: 'block', marginBottom: '12px', fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Portal Access</label>
                                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                        {portals.map(portal => (
                                                            <div key={portal} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                                <input
                                                                    type="checkbox"
                                                                    id={`portal-${portal}`}
                                                                    checked={formData.access?.includes(portal)}
                                                                    onChange={(e) => {
                                                                        const newAccess = e.target.checked
                                                                            ? [...(formData.access || []), portal]
                                                                            : (formData.access || []).filter(p => p !== portal);
                                                                        setFormData({ ...formData, access: newAccess });
                                                                    }}
                                                                    style={{ cursor: 'pointer', accentColor: '#D4AF37' }}
                                                                />
                                                                <label htmlFor={`portal-${portal}`} style={{ color: '#cbd5e1', fontSize: '0.85rem', cursor: 'pointer' }}>{portal}</label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {!selectedItem && (
                                                    <div>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                            <label style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Initial Security Key (Password)</label>
                                                            <button
                                                                type="button"
                                                                onClick={async () => {
                                                                    const strongPass = await AdminService.generateSecurePassword();
                                                                    setFormData({ ...formData, password: strongPass });
                                                                }}
                                                                style={{ background: 'none', border: 'none', color: '#D4AF37', fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                                                            >
                                                                <RefreshCw size={12} /> Suggest Strong Key
                                                            </button>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            value={formData.password || ''}
                                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                            placeholder="Strong password required"
                                                            style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', color: '#fff' }}
                                                            required={!selectedItem}
                                                        />
                                                    </div>
                                                )}

                                                {selectedItem && (
                                                    <div style={{ marginTop: '10px' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                            <label style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Reset Password (Optional)</label>
                                                            <button
                                                                type="button"
                                                                onClick={async () => {
                                                                    const strongPass = await AdminService.generateSecurePassword();
                                                                    setFormData({ ...formData, newPassword: strongPass });
                                                                }}
                                                                style={{ background: 'none', border: 'none', color: '#D4AF37', fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                                                            >
                                                                <RefreshCw size={12} /> Suggest Strong Key
                                                            </button>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            value={formData.newPassword || ''}
                                                            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                                            placeholder="Leave blank to keep current password"
                                                            style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', color: '#fff' }}
                                                        />
                                                    </div>
                                                )}

                                                {selectedItem && (
                                                    <div style={{ marginTop: '10px' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                            <label style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Reset Password (Optional)</label>
                                                            <button
                                                                type="button"
                                                                onClick={async () => {
                                                                    const strongPass = await AdminService.generateSecurePassword();
                                                                    setFormData({ ...formData, newPassword: strongPass });
                                                                }}
                                                                style={{ background: 'none', border: 'none', color: '#D4AF37', fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                                                            >
                                                                <RefreshCw size={12} /> Suggest Strong Key
                                                            </button>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            value={formData.newPassword || ''}
                                                            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                                            placeholder="Leave blank to keep current password"
                                                            style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', color: '#fff' }}
                                                        />
                                                    </div>
                                                )}

                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                                    <div>
                                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Access Role</label>
                                                        <select
                                                            value={formData.role || 'Employee'}
                                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                                            style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', color: '#fff' }}
                                                        >
                                                            <option value="Admin">Administrator</option>
                                                            <option value="Manager">Manager</option>
                                                            <option value="Employee">Employee</option>
                                                            <option value="Developer">Developer</option>
                                                            <option value="Support">Support</option>
                                                            <option value="Research">Research Analyst</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Account Status</label>
                                                        <select
                                                            value={formData.status || 'Active'}
                                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                                            style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', color: '#fff' }}
                                                        >
                                                            <option value="Active">Active</option>
                                                            <option value="Pending">Pending</option>
                                                            <option value="Inactive">Suspended</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                {modalError && (
                                                    <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '10px', color: '#ef4444', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <AlertCircle size={16} /> {modalError}
                                                    </div>
                                                )}

                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    style={{
                                                        marginTop: '10px',
                                                        background: isSubmitting ? '#4b5563' : 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
                                                        color: isSubmitting ? '#9ca3af' : '#000',
                                                        border: 'none',
                                                        padding: '14px',
                                                        borderRadius: '10px',
                                                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                                        fontWeight: '800',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '1px',
                                                        opacity: isSubmitting ? 0.7 : 1
                                                    }}
                                                >
                                                    {isSubmitting ? 'Processing...' : (selectedItem ? 'Authorize Update' : 'Authorize Identity Onboarding')}
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                    {['application', 'query', 'meeting', 'chat_transcript'].includes(modalType) && (
                                        selectedItem ? (
                                            <>
                                                {/* Header for detail views */}
                                                <h2 style={{ marginBottom: '20px', color: '#fff', fontSize: '1.5rem', fontWeight: '800' }}>
                                                    {modalType === 'application' && 'Application Details'}
                                                    {modalType === 'query' && 'Message Details'}
                                                    {modalType === 'meeting' && 'Meeting Schedule'}
                                                    {modalType === 'chat_transcript' && 'Chat Transcript'}
                                                </h2>

                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                                    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '10px', fontSize: '1rem', color: '#f8fafc' }}>
                                                        <span style={{ color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.8rem' }}>Identity:</span>
                                                        <span style={{ fontWeight: '500' }}>{selectedItem.name || selectedItem.user || 'Unknown'}</span>
                                                    </div>

                                                    {['application', 'query'].includes(modalType) && (
                                                        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '10px', fontSize: '1rem', color: '#f8fafc' }}>
                                                            <span style={{ color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.8rem' }}>Endpoint:</span>
                                                            <span style={{ fontWeight: '500' }}>{selectedItem.email}</span>
                                                        </div>
                                                    )}

                                                    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '10px', fontSize: '1rem', color: '#f8fafc' }}>
                                                        <span style={{ color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.8rem' }}>Timestamp:</span>
                                                        <span style={{ fontWeight: '500' }}>{selectedItem.date || selectedItem.appliedDate} {selectedItem.time && `at ${selectedItem.time}`}</span>
                                                    </div>

                                                    {modalType === 'application' && (
                                                        <>
                                                            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '10px', fontSize: '1rem', color: '#f8fafc' }}>
                                                                <span style={{ color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.8rem' }}>Phone:</span>
                                                                <span style={{ fontWeight: '500' }}>{selectedItem.phone || 'N/A'}</span>
                                                            </div>
                                                            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '10px', fontSize: '1rem', color: '#f8fafc' }}>
                                                                <span style={{ color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.8rem' }}>Experience:</span>
                                                                <span style={{ fontWeight: '500' }}>{selectedItem.experience} Years</span>
                                                            </div>
                                                            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '10px', fontSize: '1rem', color: '#f8fafc' }}>
                                                                <span style={{ color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.8rem' }}>Role:</span>
                                                                <span style={{ fontWeight: '500', color: '#D4AF37' }}>{selectedItem.role}</span>
                                                            </div>
                                                            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '10px', fontSize: '1rem', color: '#f8fafc' }}>
                                                                <span style={{ color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.8rem' }}>Links:</span>
                                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                                    {selectedItem.linkedin && (
                                                                        <a href={selectedItem.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', fontSize: '0.85rem', textDecoration: 'none', borderBottom: '1px solid #3b82f6' }}>LinkedIn</a>
                                                                    )}
                                                                    {selectedItem.portfolio && (
                                                                        <a href={selectedItem.portfolio} target="_blank" rel="noopener noreferrer" style={{ color: '#10b981', fontSize: '0.85rem', textDecoration: 'none', borderBottom: '1px solid #10b981' }}>Portfolio/GitHub</a>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '10px', fontSize: '1rem', color: '#f8fafc' }}>
                                                                <span style={{ color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.8rem' }}>Resume:</span>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                                    <span style={{ fontWeight: '500', fontSize: '0.9rem', color: '#cbd5e1' }}>{selectedItem.resume_url ? (selectedItem.resume_url.startsWith('http') ? 'Supabase Storage' : selectedItem.resume_url) : (selectedItem.resume || 'Not Provided')}</span>
                                                                    {(selectedItem.resume_url?.startsWith('http') || selectedItem.resume_url?.startsWith('data:') || selectedItem.resume?.startsWith('data:') || selectedItem.resume?.startsWith('http')) ? (
                                                                        <button
                                                                            onClick={() => handleDownloadResume(selectedItem.resume_url || selectedItem.resume, selectedItem.resume || 'resume.pdf')}
                                                                            style={{ padding: '4px 8px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid #10b981', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer', fontWeight: 'bold' }}
                                                                        >
                                                                            OPEN SOURCE FILE
                                                                        </button>
                                                                    ) : (selectedItem.resume && (
                                                                        <button
                                                                            style={{ padding: '4px 8px', background: 'rgba(212, 175, 55, 0.1)', color: '#D4AF37', border: '1px solid #D4AF37', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer', fontWeight: 'bold' }}
                                                                            onClick={() => alert(`RESUME DATA SUMMARY:\n\nField 'resume': ${selectedItem.resume || 'EMPTY'}\nField 'resume_url': ${selectedItem.resume_url ? (selectedItem.resume_url.startsWith('data:') ? 'DATA_URI_FOUND' : (selectedItem.resume_url.startsWith('http') ? 'URL_FOUND' : selectedItem.resume_url)) : 'EMPTY'}\n\nOnly valid URLs or Data URIs can be opened.`)}
                                                                        >
                                                                            INFO
                                                                        </button>
                                                                    ))}
                                                                </div>

                                                            </div>
                                                        </>
                                                    )}

                                                    {modalType === 'meeting' && (
                                                        <>
                                                            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '10px', fontSize: '1rem', color: '#f8fafc' }}>
                                                                <span style={{ color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.8rem' }}>Objective:</span>
                                                                <span style={{ fontWeight: '500' }}>{selectedItem.topic}</span>
                                                            </div>
                                                            {selectedItem.link && (
                                                                <div style={{ background: 'rgba(212, 175, 55, 0.1)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(212, 175, 55, 0.2)', marginTop: '10px' }}>
                                                                    <div style={{ fontSize: '0.8rem', color: '#D4AF37', textTransform: 'uppercase', fontWeight: '800', marginBottom: '5px' }}>Meeting Endpoint</div>
                                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                        <code style={{ fontSize: '0.9rem', color: '#fff' }}>{selectedItem.link}</code>
                                                                        <button
                                                                            onClick={() => { navigator.clipboard.writeText(selectedItem.link); alert('Endpoint Copied'); }}
                                                                            style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem' }}
                                                                        >Copy</button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </>
                                                    )}

                                                    {modalType === 'chat_transcript' && (
                                                        <div style={{ marginTop: '10px' }}>
                                                            <span style={{ color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.8rem', display: 'block', marginBottom: '10px' }}>Intelligence Log:</span>
                                                            <div style={{ maxHeight: '350px', overflowY: 'auto', background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }} className="custom-scrollbar">
                                                                {selectedItem.messages?.map((msg, idx) => (
                                                                    <div key={idx} style={{ marginBottom: '15px', textAlign: msg.isBot ? 'left' : 'right' }}>
                                                                        <div style={{
                                                                            display: 'inline-block',
                                                                            padding: '12px 18px',
                                                                            borderRadius: msg.isBot ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                                                                            background: msg.isBot ? 'rgba(59, 130, 246, 0.1)' : 'rgba(212, 175, 55, 0.1)',
                                                                            color: msg.isBot ? '#3b82f6' : '#D4AF37',
                                                                            fontSize: '0.95rem',
                                                                            border: `1px solid ${msg.isBot ? 'rgba(59, 130, 246, 0.2)' : 'rgba(212, 175, 55, 0.2)'}`,
                                                                            maxWidth: '85%',
                                                                            lineHeight: '1.5'
                                                                        }}>
                                                                            {msg.text}
                                                                        </div>
                                                                        <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '5px', fontWeight: '700' }}>{msg.isBot ? 'AI AGENT' : 'CLIENT'}</div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {modalType === 'application' && (
                                                        <div style={{ marginTop: '10px' }}>
                                                            <span style={{ color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.8rem', display: 'block', marginBottom: '10px' }}>Candidate Statement</span>
                                                            <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.95rem', color: '#fff', lineHeight: '1.6', fontStyle: 'italic' }}>
                                                                "{selectedItem.screening || selectedItem.justification || 'No response provided.'}"
                                                            </div>
                                                        </div>
                                                    )}

                                                    {modalType === 'query' && (
                                                        <div style={{ marginTop: '10px' }}>
                                                            <span style={{ color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.8rem', display: 'block', marginBottom: '10px' }}>Customer Message</span>
                                                            <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.95rem', color: '#fff', lineHeight: '1.6' }}>
                                                                {selectedItem.message || 'No content.'}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Status Selector & Actions */}
                                                    {['application', 'query', 'meeting'].includes(modalType) && (
                                                        <div style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
                                                            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: '15px', fontSize: '1rem', color: '#f8fafc', alignItems: 'center' }}>
                                                                <span style={{ color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.8rem' }}>Update Status:</span>
                                                                <select
                                                                    value={selectedItem.status}
                                                                    onChange={(e) => setSelectedItem({ ...selectedItem, status: e.target.value })}
                                                                    style={{
                                                                        padding: '10px 15px',
                                                                        borderRadius: '10px',
                                                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                                                        background: 'rgba(0,0,0,0.3)',
                                                                        color: '#fff',
                                                                        fontSize: '0.95rem',
                                                                        outline: 'none',
                                                                        cursor: 'pointer'
                                                                    }}
                                                                >
                                                                    {modalType === 'application' && (
                                                                        <>
                                                                            <option value="review pending" style={{ background: '#1a1a1a', color: '#fff' }}>Review Pending</option>
                                                                            <option value="under process" style={{ background: '#1a1a1a', color: '#fff' }}>Under Process</option>
                                                                            <option value="Interview scheduled" style={{ background: '#1a1a1a', color: '#fff' }}>Interview Scheduled</option>
                                                                            <option value="hired" style={{ background: '#1a1a1a', color: '#fff' }}>Hired</option>
                                                                            <option value="rejected" style={{ background: '#1a1a1a', color: '#fff' }}>Rejected</option>
                                                                        </>
                                                                    )}
                                                                    {modalType === 'query' && (
                                                                        <>
                                                                            <option value="New" style={{ background: '#1a1a1a', color: '#fff' }}>New Lead</option>
                                                                            <option value="Read" style={{ background: '#1a1a1a', color: '#fff' }}>In Progress</option>
                                                                            <option value="Replied" style={{ background: '#1a1a1a', color: '#fff' }}>Completed</option>
                                                                        </>
                                                                    )}
                                                                    {modalType === 'meeting' && (
                                                                        <>
                                                                            <option value="Scheduled" style={{ background: '#1a1a1a', color: '#fff' }}>Scheduled</option>
                                                                            <option value="Completed" style={{ background: '#1a1a1a', color: '#fff' }}>Completed</option>
                                                                            <option value="Cancelled" style={{ background: '#1a1a1a', color: '#fff' }}>Cancelled</option>
                                                                            <option value="Pending" style={{ background: '#1a1a1a', color: '#fff' }}>Pending</option>
                                                                        </>
                                                                    )}
                                                                </select>
                                                                <button
                                                                    onClick={() => handleStatusUpdate(selectedItem.id, selectedItem.status, modalType)}
                                                                    style={{
                                                                        padding: '10px 20px',
                                                                        background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
                                                                        color: '#000',
                                                                        border: 'none',
                                                                        borderRadius: '10px',
                                                                        fontWeight: 'bold',
                                                                        cursor: 'pointer',
                                                                        fontSize: '0.85rem'
                                                                    }}
                                                                >
                                                                    Save Changes
                                                                </button>
                                                            </div>

                                                            {modalType === 'application' && (
                                                                <div style={{ marginTop: '20px' }}>
                                                                    {/* Interview Scheduling Fields - Only show if Interview Scheduled is selected */}
                                                                    {selectedItem.status === 'Interview scheduled' && (
                                                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px', padding: '15px', background: 'rgba(212, 175, 55, 0.05)', borderRadius: '12px', border: '1px solid rgba(212, 175, 55, 0.1)' }}>
                                                                            <div style={{ gridColumn: 'span 2' }}>
                                                                                <span style={{ color: '#D4AF37', fontWeight: '600', fontSize: '0.8rem', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Interview Scheduling</span>
                                                                            </div>
                                                                            <div>
                                                                                <label style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'block', marginBottom: '5px' }}>Date</label>
                                                                                <input
                                                                                    type="date"
                                                                                    value={selectedItem.interviewDate || ''}
                                                                                    onChange={(e) => setSelectedItem({ ...selectedItem, interviewDate: e.target.value })}
                                                                                    style={inputStyle}
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <label style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'block', marginBottom: '5px' }}>Time</label>
                                                                                <input
                                                                                    type="time"
                                                                                    value={selectedItem.interviewTime || ''}
                                                                                    onChange={(e) => setSelectedItem({ ...selectedItem, interviewTime: e.target.value })}
                                                                                    style={inputStyle}
                                                                                />
                                                                            </div>
                                                                            <div style={{ gridColumn: 'span 2' }}>
                                                                                <label style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'block', marginBottom: '5px' }}>Meeting Link</label>
                                                                                <input
                                                                                    type="text"
                                                                                    placeholder="https://meet.google.com/..."
                                                                                    value={selectedItem.interviewLink || ''}
                                                                                    onChange={(e) => setSelectedItem({ ...selectedItem, interviewLink: e.target.value })}
                                                                                    style={inputStyle}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    {/* Admin Comments - Always Visible */}
                                                                    <div style={{ marginTop: '10px' }}>
                                                                        <span style={{ color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.8rem', display: 'block', marginBottom: '10px' }}>Admin Comments (Internal)</span>
                                                                        <textarea
                                                                            placeholder="Enter internal evaluation notes, feedback or specific instructions..."
                                                                            value={selectedItem.adminComments || ''}
                                                                            onChange={(e) => setSelectedItem({ ...selectedItem, adminComments: e.target.value })}
                                                                            style={{
                                                                                ...inputStyle,
                                                                                minHeight: '100px',
                                                                                resize: 'vertical',
                                                                                fontFamily: 'inherit'
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        ) : null
                                    )}

                                    {modalType === 'post_job' && (
                                        <form onSubmit={handleJobSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                            <div style={{ gridColumn: 'span 2' }}>
                                                <label style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'block', marginBottom: '5px', fontWeight: '700' }}>Job Title</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g., Senior Full Stack Engineer"
                                                    value={formData.title}
                                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                    style={inputStyle}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'block', marginBottom: '5px', fontWeight: '700' }}>Role / Department</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g., Engineering"
                                                    value={formData.department}
                                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                                    style={inputStyle}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'block', marginBottom: '5px', fontWeight: '700' }}>Years of Experience</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g., 5+ Years"
                                                    value={formData.experience}
                                                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                                    style={inputStyle}
                                                    required
                                                />
                                            </div>
                                            <div style={{ gridColumn: 'span 2' }}>
                                                <label style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'block', marginBottom: '5px', fontWeight: '700' }}>Education Qualification</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g., B.Tech/BE in CS or related field"
                                                    value={formData.education}
                                                    onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                                                    style={inputStyle}
                                                    required
                                                />
                                            </div>
                                            <div style={{ gridColumn: 'span 2' }}>
                                                <label style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'block', marginBottom: '5px', fontWeight: '700' }}>Description</label>
                                                <textarea
                                                    placeholder="Provide a brief summary of the role..."
                                                    value={formData.description}
                                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                    style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                                                    required
                                                />
                                            </div>
                                            <div style={{ gridColumn: 'span 2' }}>
                                                <label style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'block', marginBottom: '5px', fontWeight: '700' }}>Roles & Responsibilities</label>
                                                <textarea
                                                    placeholder="List key duties and expectations..."
                                                    value={formData.responsibilities}
                                                    onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                                                    style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
                                                    required
                                                />
                                            </div>
                                            <div style={{ gridColumn: 'span 2' }}>
                                                <label style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'block', marginBottom: '5px', fontWeight: '700' }}>Notes (Internal)</label>
                                                <textarea
                                                    placeholder="Any internal notes or hiring priorities..."
                                                    value={formData.note}
                                                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                                    style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                                                />
                                            </div>
                                            <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
                                                <button
                                                    type="button"
                                                    onClick={closeModal}
                                                    style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer' }}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    style={{ padding: '12px 30px', background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)', color: '#000', border: 'none', borderRadius: '10px', fontSize: '0.9rem', fontWeight: '800', cursor: 'pointer', boxShadow: '0 10px 20px -5px rgba(212, 175, 55, 0.3)' }}
                                                >
                                                    {selectedItem ? 'UPDATE VACANCY' : 'POST VACANCY'}
                                                </button>
                                            </div>
                                        </form>
                                    )}

                                    {modalType === 'loading' && (
                                        <div style={{ padding: '60px 40px', textAlign: 'center', color: '#94a3b8', fontSize: '1rem' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                                                <Activity className="animate-pulse" size={48} color="rgba(212, 175, 55, 0.3)" />
                                                <div style={{ fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>[ Establishing Secure Data Link... ]</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    )
                }

                {/* New Modules Content */}

                {
                    activeTab === 'infrastructure' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                                <div style={cardStyle}>
                                    <h3 style={{ marginBottom: '20px', color: '#fff', fontSize: '1.2rem', fontWeight: '800' }}>System Audit Logs</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {infraStats.servers.map(server => (
                                            <div key={server.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                                <div>
                                                    <p style={{ fontWeight: '700', color: '#fff' }}>{server.name}</p>
                                                    <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{server.type} • {server.region}</p>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <span style={statusBadge(server.status === 'Healthy' ? 'Completed' : 'Rejected')}>
                                                        {server.status}
                                                    </span>
                                                    <p style={{ fontSize: '0.8rem', marginTop: '8px', color: '#cbd5e1' }}>CPU: <span style={{ color: '#D4AF37' }}>{server.cpu}%</span></p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div style={cardStyle}>
                                    <h3 style={{ marginBottom: '20px', color: '#fff', fontSize: '1.2rem', fontWeight: '800' }}>Cloud Resource Allocation</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {infraStats.cloudCosts.map((cost, idx) => (
                                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{ padding: '10px', background: 'rgba(212, 175, 55, 0.1)', borderRadius: '10px', color: '#D4AF37' }}>
                                                        <Zap size={18} />
                                                    </div>
                                                    <div>
                                                        <p style={{ fontWeight: '700', color: '#fff' }}>{cost.provider}</p>
                                                        <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{cost.details}</p>
                                                    </div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <p style={{ fontWeight: '800', color: '#fff', fontSize: '1.1rem' }}>${cost.amount}</p>
                                                    <p style={{ fontSize: '0.75rem', color: cost.trend.startsWith('+') ? '#ef4444' : '#10b981', fontWeight: 'bold' }}>{cost.trend}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div style={cardStyle}>
                                    <h3 style={{ marginBottom: '20px', color: '#fff', fontSize: '1.2rem', fontWeight: '800' }}>Active Domain Portfolio</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {infraStats.domains.map(domain => (
                                            <div key={domain.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)', borderLeft: domain.autoRenew ? '4px solid #10b981' : '4px solid #f59e0b' }}>
                                                <div>
                                                    <p style={{ fontWeight: '700', color: '#fff' }}>{domain.name}</p>
                                                    <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{domain.provider}</p>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <p style={{ fontSize: '1rem', fontWeight: '800', color: '#fff' }}>{domain.expiry}</p>
                                                    <p style={{ fontSize: '0.75rem', color: domain.autoRenew ? '#10b981' : '#f59e0b', fontWeight: '700', textTransform: 'uppercase', marginTop: '4px' }}>
                                                        {domain.autoRenew ? 'Active Protection' : 'Action Required'}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }



                {
                    activeTab === 'audit' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                            <div style={cardStyle}>
                                <h3 style={{ marginBottom: '25px', color: '#fff', fontSize: '1.2rem', fontWeight: '800' }}>Operational Audit Ledger</h3>
                                <div style={{ overflowX: 'auto', paddingBottom: '10px' }} className="custom-scrollbar">
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
                                                <th style={thStyle}>Time & Date</th>
                                                <th style={thStyle}>Action Type</th>
                                                <th style={thStyle}>Originator</th>
                                                <th style={thStyle}>Payload Details</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {auditLog.map((log) => (
                                                <tr key={log.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                                                    <td style={{ ...tdStyle, color: '#94a3b8', fontSize: '0.85rem' }}>{log.timestamp}</td>
                                                    <td style={{ ...tdStyle, fontWeight: '700', color: '#D4AF37' }}>{log.action}</td>
                                                    <td style={tdStyle}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '800', color: '#cbd5e1', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                                                {log.user.charAt(0)}
                                                            </div>
                                                            <span style={{ fontWeight: '600' }}>{log.user}</span>
                                                        </div>
                                                    </td>
                                                    <td style={tdStyle}>
                                                        <span style={{ color: '#64748b', fontSize: '0.8rem', fontStyle: 'italic' }}>Encryption active</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div style={cardStyle}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                                    <h3 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: '800' }}>Security Event Records (Password Resets)</h3>
                                    <Shield color="#D4AF37" size={20} />
                                </div>
                                <div style={{ overflowX: 'auto', paddingBottom: '10px' }} className="custom-scrollbar">
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
                                                <th style={thStyle}>Event Timestamp</th>
                                                <th style={thStyle}>Account Identifier</th>
                                                <th style={thStyle}>Security Action</th>
                                                <th style={thStyle}>Verification Trace</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {resetHistory.length > 0 ? resetHistory.map((entry) => (
                                                <tr key={entry.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                                                    <td style={{ ...tdStyle, color: '#94a3b8', fontSize: '0.85rem' }}>
                                                        {new Date(entry.timestamp).toLocaleString()}
                                                    </td>
                                                    <td style={{ ...tdStyle, fontWeight: '700', color: '#fff' }}>
                                                        {entry.user_email}
                                                    </td>
                                                    <td style={tdStyle}>
                                                        <span style={{
                                                            padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '800',
                                                            background: entry.action === 'Reset' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                                            color: entry.action === 'Reset' ? '#ef4444' : '#10b981',
                                                            border: `1px solid ${entry.action === 'Reset' ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'}`
                                                        }}>
                                                            {entry.action === 'Reset' ? 'SYSTEM FORCED RESET' : 'USER INITIATED UPDATE'}
                                                        </span>
                                                    </td>
                                                    <td style={tdStyle}>
                                                        <div style={{ color: '#64748b', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                            <Lock size={12} />
                                                            {entry.id.substring(0, 16).toUpperCase()}...
                                                        </div>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="4" style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>
                                                        No security event records found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )
                }

                {
                    activeTab === 'settings' && (
                        <div style={{ maxWidth: '800px' }}>
                            <div style={cardStyle}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                                    <div style={{
                                        width: '45px', height: '45px', background: 'rgba(212, 175, 55, 0.1)',
                                        borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        border: '1px solid rgba(212, 175, 55, 0.2)'
                                    }}>
                                        <Settings size={22} color="#D4AF37" />
                                    </div>
                                    <div>
                                        <h3 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: '800', margin: 0 }}>Company Profile Settings</h3>
                                        <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>Update headquarters and communication vectors</p>
                                    </div>
                                </div>

                                <form onSubmit={handleCompanyInfoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                        <div style={{ gridColumn: 'span 2' }}>
                                            <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.8rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Headquarters Address</label>
                                            <div style={{ position: 'relative' }}>
                                                <Building size={18} style={{ position: 'absolute', left: '15px', top: '15px', color: '#64748b' }} />
                                                <textarea
                                                    value={companyInfo.address}
                                                    onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
                                                    style={{
                                                        width: '100%', padding: '15px 15px 15px 45px', borderRadius: '12px',
                                                        background: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(255, 255, 255, 0.1)',
                                                        color: '#fff', fontSize: '1rem', outline: 'none', transition: 'all 0.3s',
                                                        minHeight: '100px', resize: 'vertical'
                                                    }}
                                                    placeholder="Enter company address"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.8rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Global Email</label>
                                            <div style={{ position: 'relative' }}>
                                                <Mail size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                                                <input
                                                    type="email"
                                                    value={companyInfo.email}
                                                    onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value })}
                                                    style={{
                                                        width: '100%', padding: '15px 15px 15px 45px', borderRadius: '12px',
                                                        background: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(255, 255, 255, 0.1)',
                                                        color: '#fff', fontSize: '1rem', outline: 'none', transition: 'all 0.3s'
                                                    }}
                                                    placeholder="company@example.com"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.8rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Secure Hotlink (Phone)</label>
                                            <div style={{ position: 'relative' }}>
                                                <Phone size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                                                <input
                                                    type="text"
                                                    value={companyInfo.phone}
                                                    onChange={(e) => setCompanyInfo({ ...companyInfo, phone: e.target.value })}
                                                    style={{
                                                        width: '100%', padding: '15px 15px 15px 45px', borderRadius: '12px',
                                                        background: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(255, 255, 255, 0.1)',
                                                        color: '#fff', fontSize: '1rem', outline: 'none', transition: 'all 0.3s'
                                                    }}
                                                    placeholder="+1 234 567 890"
                                                />
                                            </div>
                                        </div>

                                        <div style={{ gridColumn: 'span 2', marginTop: '10px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Footer Location Opacity</label>
                                                <span style={{ color: '#D4AF37', fontWeight: '800', fontSize: '0.9rem' }}>{Math.round(companyInfo.footerOpacity * 100)}%</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="1"
                                                step="0.1"
                                                value={companyInfo.footerOpacity}
                                                onChange={(e) => setCompanyInfo({ ...companyInfo, footerOpacity: parseFloat(e.target.value) })}
                                                style={{
                                                    width: '100%',
                                                    height: '6px',
                                                    background: 'rgba(255, 255, 255, 0.1)',
                                                    borderRadius: '5px',
                                                    appearance: 'none',
                                                    outline: 'none',
                                                    cursor: 'pointer'
                                                }}
                                            />
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
                                                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Transparent</span>
                                                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Opaque</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                                        <button type="submit" style={{
                                            background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
                                            color: '#000', border: 'none', padding: '14px 40px', fontSize: '0.9rem',
                                            fontWeight: '800', borderRadius: '12px', cursor: 'pointer',
                                            transition: 'all 0.3s', boxShadow: '0 10px 20px -5px rgba(212, 175, 55, 0.3)',
                                            textTransform: 'uppercase', letterSpacing: '1px'
                                        }}>
                                            Synchronize Profile
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <div style={{ ...cardStyle, marginTop: '20px', background: 'rgba(212, 175, 55, 0.05)', border: '1px solid rgba(212, 175, 55, 0.1)' }}>
                                <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                                    <AlertCircle size={24} color="#D4AF37" />
                                    <div>
                                        <h4 style={{ color: '#fff', margin: '0 0 5px', fontSize: '1rem' }}>Data Synchronization Note</h4>
                                        <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.85rem', lineHeight: '1.5' }}>
                                            Updating these parameters will instantly propagate the changes across the global landing page footer and all communication modules. Ensure the information is vetted before synchronization.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }


                {
                    activeTab === 'vault' && (
                        <div style={cardStyle}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div style={{
                                        width: '45px', height: '45px', background: 'rgba(212, 175, 55, 0.1)',
                                        borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        border: '1px solid rgba(212, 175, 55, 0.2)'
                                    }}>
                                        <Lock size={22} color="#D4AF37" />
                                    </div>
                                    <div>
                                        <h3 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: '800', margin: 0 }}>Corporate Security Vault</h3>
                                        <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: 0 }}>Secured multi-factor credential storage</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                    <div style={{ position: 'relative' }}>
                                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                                        <input
                                            type="text"
                                            placeholder="Search service/user..."
                                            value={vaultSearch}
                                            onChange={(e) => setVaultSearch(e.target.value)}
                                            style={{
                                                background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)',
                                                padding: '10px 10px 10px 35px', borderRadius: '10px', color: '#fff',
                                                fontSize: '0.85rem', width: '220px'
                                            }}
                                        />
                                    </div>
                                    <select
                                        value={vaultCategory}
                                        onChange={(e) => setVaultCategory(e.target.value)}
                                        style={{
                                            background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)',
                                            padding: '10px', borderRadius: '10px', color: '#fff', fontSize: '0.85rem'
                                        }}
                                    >
                                        <option value="All">All Categories</option>
                                        <option value="Infrastructure">Infrastructure</option>
                                        <option value="Database">Database</option>
                                        <option value="Social Media">Social Media</option>
                                        <option value="Finance">Finance</option>
                                    </select>
                                    <button
                                        onClick={() => handleOpenCredentialModal()}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '10px',
                                            background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
                                            color: '#000', border: 'none', padding: '12px 20px',
                                            borderRadius: '12px', cursor: 'pointer', fontWeight: '800',
                                            fontSize: '0.9rem', boxShadow: '0 10px 20px -5px rgba(212, 175, 55, 0.3)'
                                        }}
                                    >
                                        <Plus size={18} /> Initialize Credential
                                    </button>
                                </div>
                            </div>

                            <div style={{ overflowX: 'auto', paddingBottom: '10px' }} className="custom-scrollbar">
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
                                            <th style={thStyle}>Secure Service</th>
                                            <th style={thStyle}>Identity</th>
                                            <th style={thStyle}>Access Key</th>
                                            <th style={thStyle}>Strength</th>
                                            <th style={thStyle}>Rotation Status</th>
                                            <th style={thStyle}>Classification</th>
                                            <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {credentials
                                            .filter(c => (vaultCategory === 'All' || c.category === vaultCategory) &&
                                                ((c.service && c.service.toLowerCase().includes(vaultSearch.toLowerCase())) ||
                                                    (c.username && c.username.toLowerCase().includes(vaultSearch.toLowerCase()))))
                                            .map((cred) => {
                                                const strength = AdminService.checkPasswordStrength(cred.password);
                                                return (
                                                    <tr key={cred.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)', transition: 'all 0.3s' }}>
                                                        <td style={{ ...tdStyle, fontWeight: '800', color: '#fff' }}>{cred.service}</td>
                                                        <td style={tdStyle}>{cred.username}</td>
                                                        <td style={tdStyle}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                                <span style={{ fontFamily: 'monospace', fontSize: '1.1rem', letterSpacing: '2px', color: '#cbd5e1' }}>
                                                                    {visiblePasswords[cred.id] ? cred.password : '••••••••'}
                                                                </span>
                                                                <button onClick={() => togglePasswordVisibility(cred.id)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '6px', borderRadius: '6px' }}>
                                                                    {visiblePasswords[cred.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                                                                </button>
                                                                <button onClick={() => copyToClipboard(cred.password)} style={{ background: 'rgba(212,175,55,0.1)', border: 'none', cursor: 'pointer', color: '#D4AF37', padding: '6px', borderRadius: '6px' }} title="Copy">
                                                                    <Copy size={14} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                        <td style={tdStyle}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                <div style={{ width: '40px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                                                                    <div style={{ width: `${(strength.score / 5) * 100}%`, height: '100%', background: strength.color }}></div>
                                                                </div>
                                                                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: strength.color }}>{strength.label}</span>
                                                            </div>
                                                        </td>
                                                        <td style={tdStyle}>
                                                            <div>
                                                                <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: '600' }}>Next: {cred.rotationDate}</div>
                                                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Updated: {cred.lastUpdated}</div>
                                                            </div>
                                                        </td>
                                                        <td style={tdStyle}>
                                                            <span style={{ padding: '4px 12px', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', color: '#D4AF37', fontSize: '0.75rem', fontWeight: '800', border: '1px solid rgba(212,175,55,0.2)' }}>{cred.category}</span>
                                                        </td>
                                                        <td style={{ ...tdStyle, textAlign: 'right' }}>
                                                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                                                <button onClick={() => handleOpenCredentialModal(cred)} style={{ color: '#D4AF37', background: 'rgba(212,175,55,0.1)', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '8px' }}>
                                                                    <Edit size={16} />
                                                                </button>
                                                                <button onClick={() => handleDeleteCredential(cred.id)} style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '8px' }}>
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )
                }



                {/* --- Access Management --- */}
                {
                    activeTab === 'access-management' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                            {/* JIT Access Requests Queue */}
                            <div style={cardStyle}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff', letterSpacing: '0.5px' }}>JIT Request Queue</h3>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <span style={{ background: 'rgba(212, 175, 55, 0.1)', color: '#D4AF37', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                                            {jitRequests.filter(r => r.status === 'Pending').length} PENDING
                                        </span>
                                    </div>
                                </div>
                                <div style={{ overflowX: 'auto' }} className="custom-scrollbar">
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ background: 'rgba(255, 255, 255, 0.02)', textAlign: 'left' }}>
                                                <th style={thStyle}>Operator</th>
                                                <th style={thStyle}>Requested Role</th>
                                                <th style={thStyle}>Justification</th>
                                                <th style={thStyle}>Duration</th>
                                                <th style={thStyle}>Status</th>
                                                <th style={thStyle}>Directives</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {jitRequests.map((req) => (
                                                <tr key={req.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                                                    <td style={{ ...tdStyle, fontWeight: '700', color: '#fff' }}>{req.user}</td>
                                                    <td style={tdStyle}><span style={{ color: '#D4AF37', fontWeight: 'bold' }}>{req.role}</span></td>
                                                    <td style={{ ...tdStyle, fontSize: '0.8rem', opacity: 0.8 }}>{req.reason}</td>
                                                    <td style={tdStyle}>{req.duration}</td>
                                                    <td style={tdStyle}>
                                                        <span style={{
                                                            padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800',
                                                            background: req.status === 'Approved' ? 'rgba(16, 185, 129, 0.1)' : req.status === 'Pending' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                            color: req.status === 'Approved' ? '#10b981' : req.status === 'Pending' ? '#f59e0b' : '#ef4444'
                                                        }}>
                                                            {req.status}
                                                        </span>
                                                    </td>
                                                    <td style={tdStyle}>
                                                        {req.status === 'Pending' && (
                                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                                <button
                                                                    onClick={() => setJitRequests(AdminService.approveJitAccess(req.id))}
                                                                    style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '800' }}
                                                                >
                                                                    APPROVE
                                                                </button>
                                                                <button
                                                                    onClick={() => setJitRequests(AdminService.rejectJitAccess(req.id))}
                                                                    style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '800' }}
                                                                >
                                                                    REJECT
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Operator Access (Employee Privileged Access Management) */}
                            <div style={cardStyle}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '20px' }}>
                                    <div
                                        style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', flex: 1 }}
                                        onClick={() => setExpandedSections(prev => ({ ...prev, privileged: !prev.privileged }))}
                                    >
                                        <div style={{
                                            width: '45px', height: '45px', background: 'rgba(212, 175, 55, 0.1)',
                                            borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            border: '1px solid rgba(212, 175, 55, 0.2)'
                                        }}>
                                            <ShieldAlert size={22} color="#D4AF37" />
                                        </div>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff', margin: 0 }}>Privileged Access Management</h3>
                                                {expandedSections.privileged ? <ChevronUp size={20} color="#D4AF37" /> : <ChevronDown size={20} color="#94a3b8" />}
                                            </div>
                                            <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: 0 }}>Manage core administrative accounts and active directories.</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <div style={{ position: 'relative' }}>
                                            <Search size={16} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                                            <input
                                                type="text"
                                                placeholder="Search identities..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                style={{ ...inputStyle, paddingLeft: '35px', width: '250px' }}
                                            />
                                        </div>
                                        <button onClick={() => handleOpenUserModal()} style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)', color: '#000', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', fontSize: '0.9rem' }}>
                                            <UserPlus size={16} /> Enlist Identity
                                        </button>
                                    </div>
                                </div>
                                <AnimatePresence>
                                    {expandedSections.privileged && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                                            style={{ overflow: 'hidden' }}
                                        >
                                            <div style={{ overflowX: 'auto', marginTop: '20px' }} className="custom-scrollbar">
                                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                    <thead>
                                                        <tr style={{ background: 'rgba(255, 255, 255, 0.02)', textAlign: 'left' }}>
                                                            <th style={thStyle}>Designation</th>
                                                            <th style={thStyle}>Identifier</th>
                                                            <th style={thStyle}>Clearance Level</th>
                                                            <th style={thStyle}>Department Unit</th>
                                                            <th style={thStyle}>System Status</th>
                                                            <th style={{ ...thStyle, textAlign: 'right' }}>Directives</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {filteredUsers.map((user) => (
                                                            <tr key={user.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)', transition: 'background 0.2s', ':hover': { background: 'rgba(255,255,255,0.01)' } }}>
                                                                <td style={{ ...tdStyle, fontWeight: '700', color: '#fff' }}>
                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(212, 175, 55, 0.1)', color: '#D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                                                                            {user.name.charAt(0)}
                                                                        </div>
                                                                        <div>
                                                                            <div>{user.name}</div>
                                                                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 'normal' }}>Employee ID: {user.employeeId || String(user.id).substring(0, 8)}</div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td style={{ ...tdStyle, color: '#94a3b8', fontSize: '0.9rem' }}>{user.email}</td>
                                                                <td style={tdStyle}>
                                                                    <span style={{
                                                                        padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '800',
                                                                        background: user.role === 'Super_Admin' ? 'rgba(239, 68, 68, 0.1)' : user.role === 'Admin' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                                                        color: user.role === 'Super_Admin' ? '#ef4444' : user.role === 'Admin' ? '#3b82f6' : '#10b981',
                                                                        border: `1px solid ${user.role === 'Super_Admin' ? 'rgba(239,68,68,0.2)' : user.role === 'Admin' ? 'rgba(59,130,246,0.2)' : 'rgba(16,185,129,0.2)'}`
                                                                    }}>
                                                                        {user.role}
                                                                    </span>
                                                                </td>
                                                                <td style={{ ...tdStyle, color: '#cbd5e1', fontSize: '0.9rem' }}>{user.department || 'Central Command'}</td>
                                                                <td style={tdStyle}>
                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: user.status === 'Active' ? '#10b981' : '#f59e0b', boxShadow: `0 0 8px ${user.status === 'Active' ? '#10b981' : '#f59e0b'}` }}></div>
                                                                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>{user.status}</span>
                                                                    </div>
                                                                </td>
                                                                <td style={{ ...tdStyle, textAlign: 'right' }}>
                                                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                                        <button onClick={() => handleOpenUserModal(user)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '6px', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s' }} title="Edit Profile">
                                                                            <Edit size={14} />
                                                                        </button>
                                                                        <button onClick={() => handleDeleteUser(user.id)} style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '6px', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s' }} title="Revoke Access">
                                                                            <Trash2 size={14} />
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        {filteredUsers.length === 0 && (
                                                            <tr>
                                                                <td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>
                                                                    <ShieldAlert size={48} style={{ opacity: 0.2, marginBottom: '10px' }} /><br />
                                                                    No identities match current filters.
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
                                {/* Client Management Pipeline */}
                                <div style={cardStyle}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '20px' }}>
                                        <div
                                            style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', flex: 1 }}
                                            onClick={() => setExpandedSections(prev => ({ ...prev, clients: !prev.clients }))}
                                        >
                                            <div style={{
                                                width: '45px', height: '45px', background: 'rgba(212, 175, 55, 0.1)',
                                                borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                border: '1px solid rgba(212, 175, 55, 0.2)'
                                            }}>
                                                <UserPlus size={22} color="#D4AF37" />
                                            </div>
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <h3 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: '800', margin: 0 }}>Client Management Pipeline</h3>
                                                    {expandedSections.clients ? <ChevronUp size={20} color="#D4AF37" /> : <ChevronDown size={20} color="#94a3b8" />}
                                                </div>
                                                <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: 0 }}>Manage enterprise client intake and setup</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleOpenClientModal()}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '10px',
                                                background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
                                                color: '#000', border: 'none', padding: '12px 20px',
                                                borderRadius: '12px', cursor: 'pointer', fontWeight: '800',
                                                fontSize: '0.9rem', boxShadow: '0 10px 20px -5px rgba(212, 175, 55, 0.3)'
                                            }}
                                        >
                                            <UserPlus size={18} /> Onboard New Client
                                        </button>
                                    </div>

                                    <AnimatePresence>
                                        {expandedSections.clients && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                                                style={{ overflow: 'hidden' }}
                                            >
                                                <div style={{ overflowX: 'auto', paddingBottom: '10px', marginTop: '20px' }} className="custom-scrollbar">
                                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                        <thead>
                                                            <tr style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
                                                                <th style={thStyle}>Client Partner</th>
                                                                <th style={thStyle}>Liaison</th>
                                                                <th style={thStyle}>Onboarding Stage</th>
                                                                <th style={thStyle}>Account Status</th>
                                                                <th style={{ ...thStyle, textAlign: 'right' }}>Directives</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {clients.map((c) => (
                                                                <tr key={c.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)', transition: 'all 0.3s' }}>
                                                                    <td style={{ ...tdStyle, fontWeight: '800', color: '#D4AF37' }}>
                                                                        {c.name}
                                                                    </td>
                                                                    <td style={tdStyle}>
                                                                        <div style={{ fontWeight: '700', color: '#fff' }}>{c.contactPerson || 'System Admin'}</div>
                                                                    </td>
                                                                    <td style={tdStyle}>
                                                                        <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>{c.status === 'Active' ? 'Fully Setup' : 'Requirements Gathering'}</div>
                                                                        <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginTop: '5px' }}>
                                                                            <div style={{ width: c.status === 'Active' ? '100%' : '40%', height: '100%', background: c.status === 'Active' ? '#10b981' : '#f59e0b', borderRadius: '2px' }}></div>
                                                                        </div>
                                                                    </td>
                                                                    <td style={tdStyle}>
                                                                        <span style={statusBadge(c.status)}>{c.status}</span>
                                                                    </td>
                                                                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                                                                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                                                            <button onClick={() => handleOpenClientModal(c)} title="Continue Onboarding" style={{ color: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)', border: 'none', cursor: 'pointer', padding: '8px 16px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '800' }}>
                                                                                MANAGE
                                                                            </button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                            {clients.length === 0 && (
                                                                <tr>
                                                                    <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>No clients currently in pipeline.</td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Permissions Matrix Overview */}
                                <div style={cardStyle}>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff', marginBottom: '25px' }}>Role Permissions Matrix</h3>
                                    <div style={{ overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                            <thead>
                                                <tr style={{ textAlign: 'left', background: 'rgba(255,255,255,0.02)' }}>
                                                    <th style={thStyle}>Identity Role</th>
                                                    <th style={thStyle}>Users</th>
                                                    <th style={thStyle}>Content</th>
                                                    <th style={thStyle}>Security</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {roles.map(role => (
                                                    <tr key={role.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                                                        <td style={{ ...tdStyle, fontWeight: '700' }}>{role.name}</td>
                                                        {['users', 'content', 'settings'].map(perm => (
                                                            <td key={perm} style={tdStyle}>
                                                                <span style={{
                                                                    padding: '2px 6px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: '800',
                                                                    background: role.permissions[perm] === 'read_write' ? 'rgba(16, 185, 129, 0.1)' : role.permissions[perm] === 'read' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                                    color: role.permissions[perm] === 'read_write' ? '#10b981' : role.permissions[perm] === 'read' ? '#3b82f6' : '#ef4444'
                                                                }}>
                                                                    {role.permissions[perm] === 'read_write' ? 'FULL' : role.permissions[perm] === 'read' ? 'READ' : 'NONE'}
                                                                </span>
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <button onClick={() => setActiveTab('settings')} style={{ width: '100%', marginTop: '20px', padding: '12px', background: 'rgba(212, 175, 55, 0.05)', border: '1px solid rgba(212, 175, 55, 0.1)', color: '#D4AF37', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '800', cursor: 'pointer' }}>
                                        CONFIGURE DETAILED POLICIES
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }

            </div >


            {/* Global Search Modal */}
            {
                isSearchOpen && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.5)', zIndex: 1000,
                        display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '100px'
                    }} onClick={() => setIsSearchOpen(false)}>
                        <div style={{
                            background: '#fff', width: '100%', maxWidth: '600px', borderRadius: '12px',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                            overflow: 'hidden'
                        }} onClick={e => e.stopPropagation()}>
                            <div style={{ padding: '15px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Search size={20} color="#94a3b8" />
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Search users, invoices, projects..."
                                    value={searchQuery}
                                    onChange={async (e) => {
                                        setSearchQuery(e.target.value);
                                        const results = await AdminService.globalSearch(e.target.value);
                                        setSearchResults(results);
                                    }}
                                    style={{ border: 'none', outline: 'none', fontSize: '1.1rem', width: '100%' }}
                                />
                                <button onClick={() => setIsSearchOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>Esc</button>
                            </div>
                            <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '10px' }}>
                                {searchResults.length > 0 ? (
                                    searchResults.map((result, idx) => (
                                        <div key={idx} style={{ padding: '10px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px', transition: 'background 0.2s', ':hover': { background: '#f1f5f9' } }}
                                            onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <div style={{ padding: '8px', background: '#e0f2fe', borderRadius: '6px', color: '#0284c7' }}>
                                                {result.type === 'User' ? <User size={16} /> : result.type === 'Invoice' ? <FileText size={16} /> : <Briefcase size={16} />}
                                            </div>
                                            <div>
                                                <p style={{ fontWeight: '600', color: '#1e293b' }}>{result.title}</p>
                                                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{result.subtitle} • {result.type}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>
                                        {searchQuery ? 'No results found.' : 'Type to search...'}
                                    </div>
                                )}
                            </div>
                            <div style={{ padding: '10px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', fontSize: '0.75rem', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
                                <span>Search globally across all portals</span>
                                <span>ProTip: Use arrows to navigate</span>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};


const navLinkStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 15px',
    borderRadius: '12px',
    border: 'none',
    background: isActive ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
    color: isActive ? '#D4AF37' : 'rgba(255, 255, 255, 0.6)',
    width: '100%',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: isActive ? '700' : '500',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    marginBottom: '2px'
});

const cardStyle = {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '20px',
    padding: '30px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
};

const thStyle = {
    textAlign: 'left',
    padding: '15px 20px',
    color: '#64748b',
    fontSize: '0.75rem',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
};

const tdStyle = {
    padding: '20px',
    color: '#cbd5e1',
    fontSize: '0.9rem'
};

const statusBadge = (status) => {
    let bg = 'rgba(148, 163, 184, 0.1)';
    let color = '#94a3b8';
    let border = 'rgba(148, 163, 184, 0.2)';

    if (status === 'Pending' || status === 'New' || status === 'Lead Captured' || status === 'Lead Form Submitted' || status === 'Contacted' || status === 'review pending') {
        bg = 'rgba(212, 175, 55, 0.1)';
        color = '#D4AF37';
        border = 'rgba(212, 175, 55, 0.2)';
    }
    if (status === 'under process') {
        bg = 'rgba(59, 130, 246, 0.1)';
        color = '#3b82f6';
        border = 'rgba(59, 130, 246, 0.2)';
    }
    if (status && typeof status === 'string' && (status.includes('Service Inquiry') || status === 'Reviewed' || status === 'Replied' || status === 'Completed' || status === 'Confirmed' || status === 'hired' || status.includes('interview'))) {
        bg = 'rgba(16, 185, 129, 0.1)';
        color = '#10b981';
        border = 'rgba(16, 185, 129, 0.2)';
    }

    if (status === 'Rejected' || status === 'rejected') {
        bg = 'rgba(225, 29, 72, 0.1)';
        color = '#f43f5e';
        border = 'rgba(225, 29, 72, 0.2)';
    }

    return {
        padding: '6px 14px',
        borderRadius: '8px',
        fontSize: '0.75rem',
        background: bg,
        color: color,
        fontWeight: '700',
        border: `1px solid ${border}`,
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    };
};

const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    background: 'rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#fff',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'all 0.3s'
};

export default Admin;

