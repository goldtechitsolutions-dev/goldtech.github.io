import { supabase } from '../supabaseClient';

// Mock Initial Data
const API_URL = 'http://localhost:5000/api';
const initialCredentials = [
    { id: 1, service: 'Supabase Project', username: 'admin@goldtech.com', password: 'password123', category: 'Infrastructure', lastUpdated: '2023-10-20', rotationDate: '2024-01-20', strength: 'Strong' },
    { id: 2, service: 'Corporate Twitter', username: '@GoldTechIT', password: 'socialPassword!', category: 'Social Media', lastUpdated: '2023-09-15', rotationDate: '2023-12-15', strength: 'Strong' },
    { id: 3, service: 'MongoDB Atlas', username: 'db_admin', password: 'dbSecurePassword#', category: 'Database', lastUpdated: '2023-10-25', rotationDate: '2024-01-25', strength: 'Strong' }
];

const initialApplications = [
    { id: 1, name: 'John Doe', role: 'Frontend Developer', email: 'john@example.com', phone: '123-456-7890', experience: 5, applied_date: '2023-10-25', appliedDate: '2023-10-25', status: 'review pending', screening: 'Developed a high-performance trading dashboard.', resume: 'john_doe_resume.pdf', resume_url: 'http://example.com/john_doe_resume.pdf' },
    { id: 2, name: 'Jane Smith', role: 'UX Designer', email: 'jane@example.com', phone: '987-654-3210', experience: 4, applied_date: '2023-10-24', appliedDate: '2023-10-24', status: 'under process', screening: 'Redesigned the user journey for a major e-commerce platform.', resume: 'jane_smith_cv.pdf', resume_url: 'http://example.com/jane_smith_cv.pdf' },
    { id: 3, name: 'Mike Johnson', role: 'Backend Developer', email: 'mike@example.com', phone: '555-123-4567', experience: 6, applied_date: '2023-10-23', appliedDate: '2023-10-23', status: 'rejected', screening: 'Optimized database queries, reducing response time by 50%.', resume: 'mike_backend_eng.docx', resume_url: 'http://example.com/mike_backend_eng.docx' },
];




const initialQueries = [
    { id: 1, name: 'Alice Brown', email: 'alice@company.com', message: 'Project Inquiry', date: '2023-10-26', status: 'New' },
    { id: 2, name: 'Bob Wilson', email: 'bob@test.com', message: 'Partnership Proposal', date: '2023-10-25', status: 'Replied' },
];

const initialLeaveRequests = [
    { id: 1, name: 'John Dev', type: 'Sick Leave', startDate: '2023-11-01', endDate: '2023-11-03', days: 3, status: 'Pending', reason: 'Flu' },
    { id: 2, name: 'Mike Manager', type: 'Vacation', startDate: '2023-12-20', endDate: '2023-12-30', days: 10, status: 'Approved', reason: 'Family Trip' },
    { id: 3, name: 'Sarah HR', type: 'Personal', startDate: '2023-11-15', endDate: '2023-11-15', days: 1, status: 'Rejected', reason: 'Urgent meeting scheduled' },
];

const initialPayroll = [
    { id: 1, month: 'October 2023', total: 45000, status: 'Processed', pending: 0 },
    { id: 2, month: 'September 2023', total: 44500, status: 'Paid', pending: 0 },
    { id: 3, month: 'November 2023 (Projection)', total: 46000, status: 'Pending', pending: 46000 },
];

const initialOrgChart = [
    { id: 101, name: 'Kyle Reese', role: 'Security Analyst', project: 'Hospital IT Security', manager: 'Sarah Connor', avatar: 'https://i.pravatar.cc/150?u=101' },
    { id: 102, name: 'John Dev', role: 'Frontend Engineer', project: 'Gold Industry ERP', manager: 'Mike Manager', avatar: 'https://i.pravatar.cc/150?u=102' },
    { id: 103, name: 'Alice Smith', role: 'Backend Engineer', project: 'Gold Industry ERP', manager: 'Mike Manager', avatar: 'https://i.pravatar.cc/150?u=103' },
    { id: 104, name: 'Dr. Miles', role: 'AI Specialist', project: 'Hospital AI Diag', manager: 'Sarah Connor', avatar: 'https://i.pravatar.cc/150?u=104' },
];

const initialSecurityHealth = [
    { userId: 101, name: 'Kyle Reese', twoFactor: true, passwordStrength: 'Strong', lastAudit: '2 days ago' },
    { userId: 102, name: 'John Dev', twoFactor: false, passwordStrength: 'Weak', lastAudit: '1 month ago' },
    { userId: 103, name: 'Alice Smith', twoFactor: true, passwordStrength: 'Medium', lastAudit: '5 days ago' },
];

const initialLearningProgress = [
    { userId: 101, name: 'Kyle Reese', module: 'The Goldtech Way', progress: 100, status: 'Completed' },
    { userId: 102, name: 'John Dev', module: 'The Goldtech Way', progress: 45, status: 'In Progress' },
    { userId: 103, name: 'Alice Smith', module: 'Advanced Cybersecurity', progress: 10, status: 'Started' },
];

const initialTasks = [
    { id: 1, userId: 102, title: 'Fix Login Bug', project: 'Gold Industry ERP', status: 'In Progress', priority: 'High', deadline: '2023-11-05' },
    { id: 2, userId: 102, title: 'Update User Profile UI', project: 'Gold Industry ERP', status: 'Pending', priority: 'Medium', deadline: '2023-11-10' },
    { id: 3, userId: 102, title: 'Write Unit Tests', project: 'Gold Industry ERP', status: 'Completed', priority: 'Low', deadline: '2023-10-30' },
];

const initialPayrollHistory = [
    { id: 1, userId: 102, month: 'October 2023', basic: 5000, allowances: 1200, deductions: 500, net: 5700, status: 'Paid', date: '2023-10-31' },
    { id: 2, userId: 102, month: 'September 2023', basic: 5000, allowances: 1200, deductions: 500, net: 5700, status: 'Paid', date: '2023-09-30' },
];

const initialProjectStats = [
    { id: 1, name: 'Gold Industry ERP', status: 'In Progress', progress: 65, deadline: '2023-12-15', budget: 150000, spent: 85000, teamSize: 5 },
    { id: 2, name: 'Legacy System Migration', status: 'On Hold', progress: 30, deadline: 'TBD', budget: 50000, spent: 12000, teamSize: 2 },
];

const initialFinancialStats = {
    revenue: 1250000,
    expenses: 850000,
    netProfit: 400000,
    burnRate: 45000,
    cashOnHand: 350000,
    growth: 12,
    mrr: 95000,
    projectFees: 450000,
    overdueInvoices: 12500
};

const initialInvoices = [
    { id: 101, client: 'TechCorp Inc', amount: 3500, tax: 630, total: 4130, date: '2023-11-01', dueDate: '2023-11-15', status: 'Pending', items: [{ desc: 'Cloud Consulting', rate: 3500, qty: 1 }] },
    { id: 102, client: 'StartUp Hub', amount: 5000, tax: 900, total: 5900, date: '2023-11-01', dueDate: '2023-11-30', status: 'Pending', items: [{ desc: 'Custom Software Dev', rate: 5000, qty: 1 }] },
    { id: 103, client: 'EduStream', amount: 1200, tax: 216, total: 1416, date: '2023-10-25', dueDate: '2023-11-10', status: 'Paid', items: [{ desc: 'Maintenance Retainer', rate: 1200, qty: 1 }] },
];

const initialVendors = [
    { id: 1, name: 'Supabase Services', category: 'Infrastructure', contact: 'support@supabase.io', status: 'Active', paymentTerms: 'Net 30' },
    { id: 2, name: 'WeWork Spaces', category: 'Real Estate', contact: 'admin@wework.com', status: 'Active', paymentTerms: 'Prepaid' },
    { id: 3, name: 'LinkedIn Recruiter', category: 'HR Tech', contact: 'sales@linkedin.com', status: 'Active', paymentTerms: 'Net 15' },
];

const initialCorpCards = [
    { id: 1, holder: 'Mike Manager', last4: '4242', limit: 5000, used: 1200, status: 'Active' },
    { id: 2, holder: 'Sarah HR', last4: '8888', limit: 3000, used: 450, status: 'Active' },
    { id: 3, holder: 'John Dev', last4: '1234', limit: 1000, used: 850, status: 'Active' },
];

const initialAuditLog = [
    { id: 1, action: 'Invoice #101 Created', user: 'Fiona Finance', timestamp: '2023-11-01 10:00 AM' },
    { id: 2, action: 'Payroll Run (Oct)', user: 'Fiona Finance', timestamp: '2023-11-01 09:30 AM' },
    { id: 3, action: 'Vendor Added: Supabase', user: 'Admin User', timestamp: '2023-10-28 02:00 PM' },
];

const initialSubscriptions = [
    { id: 1, client: 'TechCorp Inc', plan: 'Gold Support', amount: 5000, billingCycle: 'Monthly', nextBilling: '2023-11-15', status: 'Active' },
    { id: 2, client: 'EduStream', plan: 'Cloud Maintenance', amount: 1200, billingCycle: 'Monthly', nextBilling: '2023-11-01', status: 'Active' }, // Due Now
];

const initialMilestones = [
    { id: 1, project: 'Gold Industry ERP', phase: 'Phase 1 - Discovery', amount: 15000, status: 'Unbilled', dueDate: '2023-10-31' },
    { id: 2, project: 'Gold Industry ERP', phase: 'Phase 2 - Prototype', amount: 25000, status: 'Pending', dueDate: '2023-11-30' },
];

const initialExpenses = [
    { id: 1, employee: 'John Dev', type: 'Travel', amount: 450, date: '2023-10-28', status: 'Pending' },
    { id: 2, employee: 'Sarah HR', type: 'Team Lunch', amount: 120, date: '2023-10-30', status: 'Approved' },
];

const initialMeetings = [
    { id: 1, name: 'Sarah Connor', topic: 'AI Integration Strategy', date: '2023-10-27', time: '10:00 AM', status: 'Scheduled', link: 'meet.google.com/abc-defg-hij' },
    { id: 2, name: 'Kyle Reese', topic: 'Security Audit', date: '2023-10-27', time: '02:00 PM', status: 'Scheduled', link: 'meet.google.com/xyz-uvwx-yz' },
    { id: 3, name: 'Dr. Miles Bennett', topic: 'Cloud Migration', date: '2023-10-28', time: '11:30 AM', status: 'Pending', link: 'TBD' },
];

const initialUsers = [
    {
        id: 101, name: 'Admin User', email: 'admin@goldtech.com', role: 'Admin', department: 'Management', status: 'Active',
        password: 'adminPassword1!', securityKey: '185576',
        securityQuestions: { petName: 'Ramu', changeMind: 'DigN3' },
        mfa: true, lastLogin: '2023-11-01 09:00 AM', passwordAge: 45, passwordStrength: 'Strong',
        designation: 'Chief Technology Officer', dob: '1985-05-20', mobile: '9640786029', employee_id: 'GT-1001', access: ['Admin', 'Sales', 'HR', 'Finance', 'Manager']
    },
    {
        id: 102, name: 'John Dev', email: 'john.dev@goldtech.com', role: 'Developer', department: 'Engineering', status: 'Active',
        password: 'devPassword2@', securityKey: '185576',
        securityQuestions: { petName: 'Ramu', changeMind: 'DigN3' },
        mfa: false, lastLogin: '2023-11-01 10:15 AM', passwordAge: 120, passwordStrength: 'Weak',
        designation: 'Senior Frontend Engineer', dob: '1992-08-15', mobile: '9876543210', employee_id: 'GT-1002', access: ['Employee', 'Tasks', 'Project-management']
    },
    {
        id: 103, name: 'Sarah HR', email: 'sarah.hr@goldtech.com', role: 'HR', department: 'Human Resources', status: 'Active',
        password: 'hrPassword3#', securityKey: '185576',
        securityQuestions: { petName: 'Ramu', changeMind: 'DigN3' },
        mfa: true, lastLogin: '2023-10-31 04:45 PM', passwordAge: 15, passwordStrength: 'Strong',
        designation: 'HR Manager', dob: '1990-03-25', mobile: '5551234567', employee_id: 'GT-1003', access: ['HR', 'Employee']
    },
    {
        id: 104, name: 'Mike Manager', email: 'mike.manager@goldtech.com', role: 'Manager', department: 'Sales', status: 'Inactive',
        password: 'salesPassword4$', securityKey: '185576',
        securityQuestions: { petName: 'Ramu', changeMind: 'DigN3' },
        mfa: false, lastLogin: '2023-10-25 11:30 AM', passwordAge: 200, passwordStrength: 'Medium',
        designation: 'Sales Director', dob: '1988-11-10', mobile: '4449876543', employee_id: 'GT-1004', access: ['Sales', 'Manager']
    },
];
const initialClients = [
    { id: 1, name: 'TechCorp Inc', contactPerson: 'Alice Tech', email: 'alice@techcorp.com', status: 'Active' },
    { id: 2, name: 'EduStream', contactPerson: 'Bob Edu', email: 'bob@edustream.com', status: 'Active' },
    { id: 3, name: 'StartUp Hub', contactPerson: 'Charlie Hub', email: 'charlie@startuphub.com', status: 'Inactive' }
];

const initialLeads = [
    { id: 1, name: 'TechSolutions Ltd', contact: 'Alice Tech', email: 'alice@techsolutions.com', stage: 'New', value: 50000, source: 'Website', status: 'Open' },
    { id: 2, name: 'Global Corp', contact: 'Bob Global', email: 'bob@globalcorp.com', stage: 'Contacted', value: 120000, source: 'LinkedIn', status: 'Open' },
    { id: 3, name: 'SmallBiz Inc', contact: 'Charlie Biz', email: 'charlie@smallbiz.com', stage: 'Qualified', value: 15000, source: 'Referral', status: 'Open' },
];

const initialDeals = [
    { id: 100, name: 'AI Pilot Project', client: 'Healthcare Co', amount: 25000, stage: 'Discovery', probability: 20, closeDate: '2024-03-15' },
    { id: 101, name: 'ERP Implementation - TechSolutions', client: 'TechSolutions Ltd', amount: 45000, stage: 'Proposal', probability: 60, closeDate: '2023-12-15' },
    { id: 102, name: 'Consulting Retainer - Global Corp', client: 'Global Corp', amount: 12000, stage: 'Negotiation', probability: 80, closeDate: '2023-11-30' },
    { id: 103, name: 'Cloud Migration - SmallBiz', client: 'SmallBiz Inc', amount: 18000, stage: 'Scoping', probability: 40, closeDate: '2024-02-20' }
];

const initialSalesActivities = [
    { id: 1, type: 'Call', subject: 'Intro Call with Alice', date: '2023-10-25', status: 'Completed', leadId: 1 },
    { id: 2, type: 'Email', subject: 'Proposal Follow-up', date: '2023-10-26', status: 'Pending', leadId: 1 },
];

const initialRDProjects = [
    { id: 1, name: 'Project Quantum-Gold', lead: 'Dr. Miles', status: 'Active', members: 4, budget: 500000, deadline: '2024-12-31', progress: 45, category: 'Computing' },
    { id: 2, name: 'Bio-IT Interface', lead: 'Sarah HR', status: 'Planning', members: 3, budget: 250000, deadline: '2025-06-30', progress: 10, category: 'Biotech' },
    { id: 3, name: 'Eco-System AI', lead: 'John Dev', status: 'In Review', members: 5, budget: 150000, deadline: '2024-03-31', progress: 90, category: 'Sustainability' }
];

const initialPatents = [
    { id: 1, title: 'Quantum Encryption Method', status: 'Filed', filedDate: '2023-01-15', inventors: ['Dr. Miles', 'John Dev'], country: 'USA' },
    { id: 2, title: 'Adaptive UI Algorithm', status: 'Granted', grantedDate: '2022-11-20', inventors: ['Alice Smith'], country: 'International' },
    { id: 3, title: 'Self-Healing Data Mesh', status: 'Drafting', filedDate: 'N/A', inventors: ['Dr. Miles'], country: 'EU' }
];

const initialResearchPapers = [
    { id: 1, title: 'The Future of Gold-Backed Crypto', author: 'Dr. Miles', date: '2023-08-10', tags: ['Crypto', 'Finance'], citations: 12 },
    { id: 2, title: 'Neuromorphic UI Patterns', author: 'Alice Smith', date: '2022-12-05', tags: ['UX', 'AI'], citations: 45 }
];

const initialInnovationIdeas = [
    { id: 1, title: 'Holographic Meeting Rooms', submitter: 'John Dev', votes: 42, status: 'Trending' },
    { id: 2, title: 'AI-Driven Code Reviews', submitter: 'Alice Smith', votes: 120, status: 'In Evaluation' },
    { id: 3, title: 'Carbon-Neutral Data Centers', submitter: 'Sarah HR', votes: 85, status: 'Top Rated' }
];

const initialTechRadar = [
    { id: 1, tech: 'React 19', quadrant: 'Frontend', status: 'Adopt', description: 'Production ready for next gen apps.' },
    { id: 2, tech: 'WebAssembly', quadrant: 'Performance', status: 'Trial', description: 'Testing for heavy computation modules.' },
    { id: 3, tech: 'Post-Quantum Crypto', quadrant: 'Security', status: 'Assess', description: 'Long term security roadmap.' }
];

const initialRoles = [
    { id: 1, name: 'Admin', permissions: { users: 'read_write', content: 'read_write', reports: 'read_write', settings: 'read_write' } },
    { id: 2, name: 'HR', permissions: { users: 'read_write', content: 'read', reports: 'read', settings: 'none' } },
    { id: 3, name: 'Developer', permissions: { users: 'read', content: 'read_write', reports: 'none', settings: 'none' } },
    { id: 4, name: 'Manager', permissions: { users: 'read', content: 'read', reports: 'read_write', settings: 'none' } },
];

const initialGLAccounts = [
    { code: '1000', name: 'Cash on Hand', type: 'Asset', balance: 350000 },
    { code: '1100', name: 'Accounts Receivable', type: 'Asset', balance: 0 },
    { code: '1200', name: 'Equipment', type: 'Asset', balance: 50000 },
    { code: '2000', name: 'Accounts Payable', type: 'Liability', balance: 15000 },
    { code: '2100', name: 'GST Payable', type: 'Liability', balance: 0 },
    { code: '3000', name: 'Owner Equity', type: 'Equity', balance: 300000 },
    { code: '4000', name: 'Service Revenue', type: 'Revenue', balance: 0 },
    { code: '5000', name: 'Salaries Expense', type: 'Expense', balance: 0 },
    { code: '5100', name: 'Rent Expense', type: 'Expense', balance: 0 },
    { code: '5200', name: 'Cloud Infrastructure', type: 'Expense', balance: 0 },
];

const initialTransactions = [
    { id: 1, date: '2023-11-01', description: 'Initial Investment', entries: [{ accountCode: '1000', debit: 300000, credit: 0 }, { accountCode: '3000', debit: 0, credit: 300000 }] },
];

const initialAssets = [
    { id: 1, name: 'MacBook Pro M3', category: 'Hardware', purchaseDate: '2024-01-15', cost: 2500, usefulLifeYears: 3, assignedTo: 'John Dev', serial: 'MB-001' },
    { id: 2, name: 'Dell PowerEdge Server', category: 'Hardware', purchaseDate: '2023-12-10', cost: 8000, usefulLifeYears: 5, assignedTo: 'Server Room', serial: 'DELL-SRV-99' },
    { id: 3, name: 'Office Furniture', category: 'Furniture', purchaseDate: '2023-11-05', cost: 12000, usefulLifeYears: 7, assignedTo: 'General Office', serial: 'N/A' },
    { id: 4, name: 'IPhone 15 Pro', category: 'Mobile', purchaseDate: '2024-02-01', cost: 1100, usefulLifeYears: 2, assignedTo: 'Sarah HR', serial: 'IP-998' }
];

const initialCloudBills = [
    { id: 1, provider: 'Supabase', service: 'PostgreSQL Database', amount: 25, date: '2024-02-01' },
    { id: 2, provider: 'Supabase', service: 'File Storage', amount: 10, date: '2024-02-01' },
    { id: 3, provider: 'Azure', service: 'Virtual Machines', amount: 300, date: '2024-02-01' },
];

const initialDetailedProjects = [
    {
        id: 1,
        name: 'Gold Industry ERP',
        description: 'Comprehensive ERP solution for gold manufacturing and retail chains.',
        status: 'In Progress',
        progress: 65,
        startDate: '2023-08-15',
        endDate: '2024-02-28',
        budget: 150000,
        spent: 85000,
        manager: 'Mike Manager',
        team: [102, 103], // User IDs
        tags: ['ERP', 'Enterprise', 'High Priority']
    },
    {
        id: 2,
        name: 'Legacy System Migration',
        description: 'Migrating legacy on-premise data to cloud infrastructure.',
        status: 'On Hold',
        progress: 30,
        startDate: '2023-09-01',
        endDate: '2024-01-15',
        budget: 50000,
        spent: 12000,
        manager: 'Sarah Connor',
        team: [101, 104],
        tags: ['Migration', 'Cloud', 'Internal']
    },
    {
        id: 3,
        name: 'AI Diagnostic Tool',
        description: 'AI-powered diagnostic tool for healthcare clients.',
        status: 'Planning',
        progress: 10,
        startDate: '2023-11-01',
        endDate: '2024-06-30',
        budget: 200000,
        spent: 5000,
        manager: 'Dr. Miles',
        team: [104],
        tags: ['AI', 'Healthcare', 'R&D']
    }
];

const initialProjectTasks = [
    { id: 1, projectId: 1, title: 'Database Schema Design', status: 'Done', assignee: 103, priority: 'High', dueDate: '2023-09-15' },
    { id: 2, projectId: 1, title: 'Auth Service Implementation', status: 'Done', assignee: 102, priority: 'Critical', dueDate: '2023-09-30' },
    { id: 3, projectId: 1, title: 'Frontend Dashboard Setup', status: 'In Progress', assignee: 102, priority: 'Medium', dueDate: '2023-11-10' },
    { id: 4, projectId: 1, title: 'Inventory Module API', status: 'ToDo', assignee: 103, priority: 'High', dueDate: '2023-11-20' },
    { id: 5, projectId: 2, title: 'Data Mapping', status: 'In Progress', assignee: 101, priority: 'Medium', dueDate: '2023-11-05' },
    { id: 6, projectId: 3, title: 'Feasibility Study', status: 'Done', assignee: 104, priority: 'High', dueDate: '2023-10-15' }
];

// --- Employee Portal Additions ---
const initialWorkFromHome = [
    { id: 1, userId: 102, date: '2023-11-10', reason: 'Plumber coming', status: 'Approved' },
    { id: 2, userId: 102, date: '2023-11-17', reason: 'Focus time', status: 'Pending' }
];

const initialHolidays = [
    { id: 1, name: 'Diwali', date: '2023-11-12', type: 'Public Holiday' },
    { id: 2, name: 'Christmas', date: '2023-12-25', type: 'Public Holiday' },
    { id: 3, name: 'New Year', date: '2024-01-01', type: 'Public Holiday' }
];

const initialOKRs = [
    { id: 1, userId: 102, title: 'Improve Code Coverage', objective: 'Increase unit test coverage to 90%', progress: 75, status: 'On Track', quarter: 'Q4 2023' },
    { id: 2, userId: 102, title: 'Learn React Native', objective: 'Build a prototype mobile app', progress: 30, status: 'At Risk', quarter: 'Q4 2023' },
];

const initialLMSCourses = [
    { id: 1, title: 'Advanced React Patterns', instructor: 'Kent C. Dodds', duration: '4h 30m', progress: 0, thumbnail: 'https://placehold.co/300x200/1e293b/FFF?text=React', category: 'Frontend' },
    { id: 2, title: 'Supabase Cloud Architect', instructor: 'Stephane Maarek', duration: '20h', progress: 45, thumbnail: 'https://placehold.co/300x200/1e293b/FFF?text=Supabase', category: 'Backend' },
    { id: 3, title: 'Secure Coding Practices', instructor: 'GoldTech Security', duration: '2h', progress: 100, thumbnail: 'https://placehold.co/300x200/1e293b/FFF?text=Security', category: 'Security' }
];

const initialLearningBudget = { userId: 102, total: 1000, used: 350, remaining: 650, currency: 'USD' };

const initialSocialFeed = [
    { id: 1, type: 'announcement', author: 'Sarah Connor', content: '🎉 Creating the future! Welcome our new AI Specialist, Dr. Miles.', timestamp: '2 hours ago', likes: 24, comments: 5 },
    { id: 2, type: 'recognition', author: 'Mike Manager', content: '🏆 Employee of the Month: John Dev for his outstanding work on the ERP module!', timestamp: '1 day ago', likes: 45, comments: 12 },
    { id: 3, type: 'event', author: 'HR Team', content: 'Reminder: Town Hall meeting this Friday at 4 PM.', timestamp: '2 days ago', likes: 15, comments: 0 }
];

const initialDevTools = {
    jira: [
        { id: 'GT-1234', summary: 'Fix memory leak in checkout', status: 'In Progress', type: 'Bug', priority: 'High' },
        { id: 'GT-5678', summary: 'Implement Dark Mode', status: 'To Do', type: 'Story', priority: 'Medium' }
    ],
    cloudCredentials: []
};

const initialReferrals = [
    { id: 1, candidate: 'Neo Anderson', position: 'Senior Backend Engineer', status: 'Interviewing', bonus: 1500 },
    { id: 2, candidate: 'Trinity', position: 'DevOps Lead', status: 'Hired', bonus: 2000 }
];


// --- Mock Data ---
const initialJobs = [
    { id: 1, title: 'Senior Frontend Developer', department: 'Engineering', location: 'Remote', type: 'Full-time', status: 'Active', applicants: 12, postedDate: '2023-10-15', experience: '5+ Years', salaryRange: '$120k - $160k', techStack: ['React', 'TypeScript', 'Tailwind'], description: 'Lead our frontend team.', roles: 'Senior Frontend Developer', responsibilities: 'Develop high-quality UI components, lead code reviews, and mentor junior devs.', education: 'B.Tech/BE in CS or related field', note: 'Priority hire for the Q1 Roadmap.', skills: 'React, Vue, Leadership' },
    { id: 2, title: 'Product Manager', department: 'Product', location: 'New York', type: 'Full-time', status: 'Active', applicants: 8, postedDate: '2023-10-20', experience: '3+ Years', salaryRange: '$110k - $140k', techStack: ['JIRA', 'Figma', 'SQL'], description: 'Drive product vision.', roles: 'Product Manager', responsibilities: 'Define product roadmap, gather requirements, and collaborate with engineering.', education: 'MBA or Equivalent', note: 'Strong communication skills required.', skills: 'Agile, JIRA, Roadmapping' },
    { id: 3, title: 'DevOps Engineer', department: 'Engineering', location: 'Remote', type: 'Contract', status: 'Draft', applicants: 0, postedDate: '2023-10-25', experience: '4+ Years', salaryRange: '$80/hr', techStack: ['Supabase', 'Docker', 'Kubernetes'], description: 'Manage cloud infrastructure and CI/CD pipelines.', roles: 'DevOps Engineer', responsibilities: 'Automate deployments, manage cloud infrastructure, and monitor system performance.', education: 'Certifications in Supabase/Azure/GCP preferred', note: 'Immediate start candidate preferred.', skills: 'Supabase, Docker, Jenkins' }
];

const initialCandidates = [
    { id: 1, name: 'Alice Johnson', role: 'Senior Frontend Developer', stage: 'under process', email: 'alice@example.com', phone: '123-456-7890', appliedDate: '2023-11-01', experience: 5, score: 85, source: 'LinkedIn', linkedin: 'https://linkedin.com/in/alice', portfolio: 'https://github.com/alice', screening: 'I improved page load by 40% using code splitting and lazily loading assets.', resume: 'alice_j_frontend.pdf', interviewScores: { technical: 4, culture: 5 } },
    { id: 2, name: 'Bob Smith', role: 'Product Manager', stage: 'Interview scheduled', email: 'bob@example.com', phone: '987-654-3210', appliedDate: '2023-11-02', experience: 4, score: 92, source: 'Referral', linkedin: 'https://linkedin.com/in/bob', portfolio: 'https://bob.product', screening: 'Managed a team of 10 to launch a Fintech app that reached 100k users in 3 months.', resume: 'bob_smith_pm.pdf', interviewScores: { technical: 5, culture: 4 }, interviewDate: '2023-11-20', interviewTime: '10:00 AM', interviewLink: 'meet.google.com/abc-def-ghi', adminComments: 'Strong candidate for leadership role.' },
    { id: 3, name: 'Charlie Lee', role: 'Senior Frontend Developer', stage: 'review pending', email: 'charlie@example.com', phone: '555-123-4567', appliedDate: '2023-11-03', experience: 6, score: 70, source: 'Indeed', linkedin: 'https://linkedin.com/in/charlie', portfolio: 'https://behance.net/charlie', screening: 'Implemented a custom design system that reduced UI development time by 30%.', resume: 'charlie_design_system.pdf', interviewScores: {} },
    { id: 4, name: 'Dana White', role: 'Product Manager', stage: 'hired', email: 'dana@example.com', phone: '444-987-6543', appliedDate: '2023-10-28', experience: 7, score: 95, source: 'Career Page', linkedin: 'https://linkedin.com/in/dana', portfolio: 'https://dana.io', screening: 'Redesigned the onboarding flow, increasing conversion rate by 15%.', resume: 'dana_white_cv.pdf', interviewScores: { technical: 5, culture: 5 } },
    { id: 5, name: 'Sarah Connor', role: 'Security Lead', stage: 'hired', email: 'sarah@resistance.com', phone: '555-000-2029', experience: 10, score: 96, appliedDate: '2023-10-27', source: 'Direct', screening: 'Prevented a massive data breach by identifying a zero-day vulnerability in our auth layer.', resume: 'sarah_connor_security.pdf', interviewScores: { technical: 5, culture: 5 } },
    { id: 6, name: 'Danny Dyson', role: 'Junior Dev', stage: 'Interview scheduled', email: 'danny@cyberdyne.com', phone: '555-111-2233', experience: 1, score: 75, appliedDate: '2023-10-27', source: 'LinkedIn', screening: 'Fixed a long-standing reporting bug that was causing inconsistent financial data.', resume: 'danny_dyson_cv.pdf', interviewScores: { technical: 3, culture: 4 }, interviewDate: '2023-11-15', interviewTime: '02:30 PM', interviewLink: 'meet.google.com/xyz-uvw-rst' },
    { id: 7, name: 'Marcus Wright', role: 'DevOps', stage: 'under process', email: 'marcus@skynet.net', phone: '555-222-3344', experience: 8, score: 82, appliedDate: '2023-10-27', source: 'Referral', screening: 'Automated our entire infrastructure using Terraform, reducing deployment time from hours to minutes.', resume: 'marcus_wright_devops.pdf', interviewScores: {} }
];

const initialOnboarding = [
    { id: 1, userId: 105, name: 'Dr. Miles', step: 'Document Submission', progress: 40, status: 'In Progress', startDate: '2023-11-01' },
    { id: 2, userId: 106, name: 'T-800', step: 'IT Setup', progress: 80, status: 'In Progress', startDate: '2023-10-28' }
];

const initialDocuments = [
    { id: 1, name: 'Employment Contract', type: 'PDF', size: '2.5 MB', uploadedBy: 'Sarah HR', date: '2023-01-15' },
    { id: 2, name: 'NDA', type: 'PDF', size: '1.2 MB', uploadedBy: 'Sarah HR', date: '2023-01-15' },
    { id: 3, name: 'Employee Handbook', type: 'PDF', size: '5.0 MB', uploadedBy: 'Admin', date: '2022-12-01' }
];

const initialSurveys = [
    { id: 1, title: 'Q3 Employee Satisfaction', participation: 85, status: 'Closed', date: '2023-09-30', score: 4.2 },
    { id: 2, title: 'Remote Work Feedback', participation: 45, status: 'Active', date: '2023-10-25', score: 0 }
];

// --- Infrastructure & DevOps Oversight ---
const initialInfraStats = {
    servers: [
        { id: 1, name: 'Main-Database-Cluster', type: 'Database', status: 'Healthy', cpu: 45, memory: 60, region: 'global', cost: 1200, uptime: '100%', latency: '2ms' },
        { id: 2, name: 'Edge-Functions-Fleet', type: 'Compute', status: 'Healthy', cpu: 30, memory: 40, region: 'global', cost: 800, uptime: '99.95%', latency: '8ms' },
        { id: 3, name: 'Realtime-Sync-Engine', type: 'Compute', status: 'Warning', cpu: 85, memory: 70, region: 'global', cost: 1500, uptime: '98.50%', latency: '35ms' }
    ],
    cloudCosts: [
        { provider: 'Supabase', amount: 35, trend: '+5%', details: 'Database & Storage' },
        { provider: 'Azure', amount: 1200, trend: '-2%', details: 'Optimized storage' },
        { provider: 'GCP', amount: 800, trend: '0%', details: 'Stable' }
    ],
    domains: [
        { id: 1, name: 'goldtech.com', provider: 'GoDaddy', expiry: '2024-10-15', autoRenew: true, cost: 20 },
        { id: 2, name: 'goldtech.io', provider: 'Namecheap', expiry: '2023-12-01', autoRenew: false, cost: 35 }
    ],
    apiUsage: [
        { name: 'Auth API', calls: 125000, errors: 12, latency: 150 },
        { name: 'Payment API', calls: 45000, errors: 5, latency: 300 },
        { name: 'Data Sync API', calls: 850000, errors: 145, latency: 450 }
    ],
    securityAlerts: [
        { id: 1, type: 'Brute Force', source: 'IP 192.168.1.1', status: 'Blocked', time: '10 mins ago', severity: 'High' },
        { id: 2, type: 'Failed Login Peak', source: 'Multiple IPs', status: 'Investigating', time: '1 hour ago', severity: 'Critical' },
        { id: 3, type: 'Unauthorized API Call', source: 'API Key #45', status: 'Logged', time: '3 hours ago', severity: 'Medium' }
    ]
};

const initialIndustryMetrics = {
    goldTech: {
        ledgers: [
            { id: 1, name: 'Main Distribution Ledger', status: 'Synced', lastBlock: '4,521,092', health: 100 },
            { id: 2, name: 'Regional Warehouse A', status: 'Syncing', lastBlock: '4,521,085', health: 95 },
            { id: 3, name: 'Client Portal Ledger', status: 'Synced', lastBlock: '4,521,092', health: 100 }
        ],
        logisticsAPIs: [
            { name: 'Global Shipping Tracker', status: 'Healthy', latency: '120ms', throughput: '45 req/s' },
            { name: 'Inventory Sync', status: 'Degraded', latency: '450ms', throughput: '12 req/s' }
        ]
    },
    healthcare: {
        compliance: [
            { name: 'HIPAA Data Encryption', status: 'Compliant', lastAudit: '2023-10-15', score: 100 },
            { name: 'Access Control Logs', status: 'Compliant', lastAudit: '2023-11-01', score: 98 },
            { name: 'BAA Agreements', status: 'Action Required', lastAudit: '2023-09-20', score: 85 }
        ],
        securityStatus: {
            firewall: 'Active',
            intrusionDetection: 'Active',
            dataLossPrevention: 'Active',
            threatHunting: 'Ongoing'
        }
    }
};

const initialProjectHealth = [
    { id: 1, name: 'Gold Industry ERP', progress: 65, deadline: '2023-12-15', status: 'On Track', risk: 'Low', milestones: 12, milestonesReached: 8 },
    { id: 2, name: 'Healthcare HMS v2', progress: 85, deadline: '2023-11-30', status: 'At Risk', risk: 'High', milestones: 20, milestonesReached: 15 },
    { id: 3, name: 'FinTech Migration', progress: 25, deadline: '2024-03-31', status: 'Delayed', risk: 'Medium', milestones: 15, milestonesReached: 3 }
];

// --- Compliance & Security ---
const initialComplianceLogs = [
    { id: 1, type: 'Security', action: 'Failed Login Attempt', user: 'unknown@ip-192.168.1.5', timestamp: '2023-11-02 14:20:00', status: 'Blocked', severity: 'High' },
    { id: 2, type: 'Compliance', action: 'GDPR Data Export', user: 'Sarah HR', timestamp: '2023-11-01 10:00:00', status: 'Completed', severity: 'Medium' },
    { id: 3, type: 'System', action: 'API Key Rotated', user: 'Admin User', timestamp: '2023-10-30 09:15:00', status: 'Success', severity: 'Low' }
];

const initialApiKeys = [
    { id: 1, name: 'SendGrid Email API', key: 'SG.xxxxxxxxxxxx', service: 'SendGrid', created: '2023-01-15', status: 'Active', lastUsed: '2 mins ago' },
    { id: 2, name: 'Stripe Payments', key: 'sk_live_xxxxxxxx', service: 'Stripe', created: '2023-02-20', status: 'Active', lastUsed: '1 hour ago' },
    { id: 3, name: 'Internal Analytics', key: 'gt_int_xxxxxxxx', service: 'Internal', created: '2023-06-10', status: 'Revoked', lastUsed: '5 days ago' }
];

const initialJitRequests = [
    { id: 1, user: 'John Dev', role: 'DbAdmin', reason: 'Fix Prod DB migration', duration: '2 hours', time: '2023-11-03 10:00', status: 'Pending' },
    { id: 2, user: 'Mike Manager', role: 'SuperAdmin', reason: 'Audit Log Review', duration: '4 hours', time: '2023-11-02 11:30', status: 'Approved' },
    { id: 3, user: 'Alice Smith', role: 'DevOps', reason: 'Infrastructure Patching', duration: '1 hour', time: '2023-11-03 14:00', status: 'Pending' },
    { id: 4, user: 'Kyle Reese', role: 'SecurityAdmin', reason: 'Log Rotation', duration: '30 mins', time: '2023-11-03 15:30', status: 'Pending' }
];

// --- Sales Portal Data ---
const initialServiceCatalog = [
    { id: 'p1', name: 'Starter Website Package', price: 2500, type: 'Project', description: '5-page responsive website' },
    { id: 'p2', name: 'E-commerce Standard', price: 8000, type: 'Project', description: 'Shopify/WooCommerce setup with 50 products' },
    { id: 'p3', name: 'Custom Web App MVP', price: 15000, type: 'Project', description: 'React/Node stack, core features' },
    { id: 'r1', name: 'SEO Retainer (Basic)', price: 1200, type: 'Monthly', description: 'On-page technical SEO & reporting' },
    { id: 'r2', name: 'Maintenance Gold', price: 800, type: 'Monthly', description: '24/7 uptime monitoring + 10h support' }
];

const initialScopingTemplates = [
    { id: 't1', name: 'Standard Web Project', questions: ['Number of pages?', 'CMS required?', 'Design provided?'] },
    { id: 't2', name: 'Mobile App Discovery', questions: ['iOS/Android or both?', 'Offline mode?', 'Push notifications?'] }
];

const initialBenchResources = [
    { id: 105, name: 'David Designer', role: 'UI/UX Designer', availability: 'Immediate', skills: ['Figma', 'Adobe XD', 'Prototyping'], title: 'Senior Designer' },
    { id: 106, name: 'Sam Server', role: 'DevOps Engineer', availability: '2 Weeks', skills: ['Supabase', 'Docker', 'K8s'], title: 'DevOps Specialist' }
];

const initialRateCards = [
    { role: 'Senior Developer', rate: 120 },
    { role: 'UI/UX Designer', rate: 95 },
    { role: 'Project Manager', rate: 110 },
    { role: 'QA Engineer', rate: 80 }
];

const initialLostDealAnalysis = [
    { reason: 'Price too high', count: 12, percentage: 45 },
    { reason: 'Feature gap', count: 8, percentage: 30 },
    { reason: 'Timing/Budget', count: 4, percentage: 15 },
    { reason: 'Competitor', count: 3, percentage: 10 }
];

const initialCaseStudies = [
    { id: 1, title: 'FinTech App Modernization', client: 'BankCorp', outcome: '40% performance boost', industry: 'Finance' },
    { id: 2, title: 'Healthcare Portal', client: 'MediPlus', outcome: 'HIPAA compliant & secure', industry: 'Healthcare' }
];

const initialPartnerStats = [
    { name: 'GitHub', tier: 'Enterprise Partner', revenueInfluenced: 150000 },
    { name: 'Supabase', tier: 'Platform Partner', revenueInfluenced: 85000 }
];

const initialMarketIntelligence = [
    { id: 1, title: 'Competitor X launched AI tool', source: 'TechCrunch', date: '2023-11-05', sentiment: 'Negative' },
    { id: 2, title: 'Demand for Cloud Security up 200%', source: 'Gartner', date: '2023-11-02', sentiment: 'Positive' }
];

const initialChatLogs = [
    {
        id: 1, user: 'Visitor #1234', date: '2023-11-05', time: '10:30 AM', duration: '2m 15s', status: 'Completed', messages: [
            { sender: 'bot', text: 'Hi there! 👋 I\'m SONA, your virtual assistant. How can I help you today?' },
            { sender: 'user', text: 'I need a website.' },
            { sender: 'bot', text: 'I\'d be happy to assist you with that. To get started, may I know your full name?' },
            { sender: 'user', text: 'Alice' },
            { sender: 'bot', text: 'Nice to meet you, Alice! To connect you with the right expert, could you please share your contact details?' },
            { sender: 'user', text: 'alice@example.com' }
        ]
    },
    {
        id: 2, user: 'Visitor #5678', date: '2023-11-05', time: '11:45 AM', duration: '5m 00s', status: 'Lead Captured', messages: [
            { sender: 'bot', text: 'Hi there! 👋 I\'m SONA. How can I help?' },
            { sender: 'user', text: 'Pricing for mobile app' },
            { sender: 'bot', text: 'Our pricing is customized. Would you like a quote?' }
        ]
    }
];

const initialCompanyInfo = {
    address: '9, Mindspace, HYDERABAD',
    email: 'goldtechitsolutions@gmail.com',
    phone: '9640786029',
    footerOpacity: 0.5
};




const AdminService = {
    // Utilities to get data from localStorage or initialize it
    _getData: (key, initialData) => {
        try {
            const data = localStorage.getItem(key);
            if (data) {
                const parsed = JSON.parse(data);
                // Handle case where local storage has "null" string or parses to null
                return parsed !== null ? parsed : initialData;
            } else {
                localStorage.setItem(key, JSON.stringify(initialData));
                return initialData;
            }
        } catch (error) {
            console.error(`Error parsing data for ${key}:`, error);
            // Fallback to initial data if parsing fails
            return initialData;
        }
    },

    _saveData: (key, data) => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            // Dispatch custom event for same-tab updates
            window.dispatchEvent(new CustomEvent('gt_data_update', { detail: { key, data } }));
        } catch (e) {
            console.error("LocalStorage error:", e);
            if (e.name === 'QuotaExceededError') {
                alert("Storage limit reached. Try deleting some old browser data or using smaller resume files.");
            }
        }
    },

    // Helper to fetch with a timeout fallback
    _fetchWithTimeout: async (url, options = {}, timeout = 5000) => {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(id);
            return response;
        } catch (error) {
            clearTimeout(id);
            throw error;
        }
    },

    // --- Applications ---
    getApplications: async () => {
        try {
            const { data, error } = await supabase
                .from('applications')
                .select('*')
                .order('applied_date', { ascending: false });

            if (error) throw error;
            return data.map(app => {
                const resumeSource = app.resume_url || app.resume;
                return {
                    ...app,
                    appliedDate: app.applied_date,
                    linkedin: app.linkedin_url,
                    portfolio: app.portfolio_url,
                    resume_url: resumeSource,
                    resume: app.resume || (resumeSource && !resumeSource.startsWith('http') && !resumeSource.startsWith('data:') ? resumeSource : 'resume.pdf')
                };
            });

        } catch (error) {
            console.error('Supabase fetch applications error, falling back:', error);
            return AdminService._getData('gt_applications', initialApplications);
        }
    },

    addApplication: async (formData) => {
        // Reuse addCandidate logic for consistent application handling
        return AdminService.addCandidate(formData);
    },

    updateApplication: async (updatedApp) => {
        // Map to updateCandidate for consistency
        return AdminService.updateCandidate(updatedApp.id, updatedApp);
    },

    deleteApplication: async (id) => {
        try {
            const { error } = await supabase
                .from('applications')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Supabase delete application error, falling back:', error);
            const apps = await AdminService.getApplications();
            const newApps = apps.filter(app => app.id !== id);
            AdminService._saveData('gt_applications', newApps);
            return newApps;
        }
    },


    // --- Core HR: Recruitment ---
    getJobsImmediate: () => {
        return AdminService._getData('gt_jobs', initialJobs);
    },
    getJobs: async () => {
        try {
            const { data, error } = await supabase
                .from('jobs')
                .select('*')
                .order('posted_date', { ascending: false });

            if (error) throw error;
            const mappedJobs = data.map(job => ({
                ...job,
                salaryRange: job.salary_range,
                techStack: job.tech_stack,
                postedDate: job.posted_date
            }));

            // Update cache silently for next "immediate" load
            AdminService._saveData('gt_jobs', mappedJobs);

            return mappedJobs;

        } catch (error) {
            console.error('Supabase fetch jobs error, falling back:', error);
            return AdminService._getData('gt_jobs', initialJobs);
        }
    },
    addJob: async (job) => {
        try {
            const { data, error } = await supabase
                .from('jobs')
                .insert([{
                    title: job.title,
                    department: job.department,
                    location: job.location,
                    type: job.type,
                    status: job.status || 'Active',
                    experience: job.experience,
                    salary_range: job.salaryRange,
                    tech_stack: job.techStack,
                    description: job.description,
                    roles: job.roles,
                    responsibilities: job.responsibilities,
                    education: job.education,
                    note: job.note,
                    skills: job.skills
                }])
                .select();

            if (error) throw error;
            AdminService.logAudit(`New Job Posted: ${job.title}`, 'Sarah HR');
            return data[0];
        } catch (error) {
            console.error('Supabase add job error, falling back:', error);
            const jobs = await AdminService.getJobs();
            const newJob = {
                ...job,
                id: Date.now(),
                status: 'Active',
                applicants: 0,
                postedDate: new Date().toISOString().split('T')[0]
            };
            const updatedJobs = [newJob, ...jobs];
            AdminService._saveData('gt_jobs', updatedJobs);
            AdminService.logAudit(`New Job Posted: ${job.title}`, 'Sarah HR');
            return newJob;
        }
    },
    updateJob: async (updatedJob) => {
        try {
            const { data, error } = await supabase
                .from('jobs')
                .update({
                    title: updatedJob.title,
                    department: updatedJob.department,
                    location: updatedJob.location,
                    type: updatedJob.type,
                    status: updatedJob.status,
                    experience: updatedJob.experience,
                    salary_range: updatedJob.salaryRange,
                    tech_stack: updatedJob.techStack,
                    description: updatedJob.description,
                    roles: updatedJob.roles,
                    responsibilities: updatedJob.responsibilities,
                    education: updatedJob.education,
                    note: updatedJob.note,
                    skills: updatedJob.skills
                })
                .eq('id', updatedJob.id)
                .select();

            if (error) throw error;
            AdminService.logAudit(`Job Updated: ${updatedJob.title}`, 'Sarah HR');
            return data[0];
        } catch (error) {
            console.error('Supabase update job error, falling back:', error);
            const jobs = await AdminService.getJobs();
            const newJobs = jobs.map(j => j.id == updatedJob.id ? updatedJob : j);
            AdminService._saveData('gt_jobs', newJobs);
            AdminService.logAudit(`Job Updated: ${updatedJob.title}`, 'Sarah HR');
            return newJobs;
        }
    },

    deleteJob: async (id) => {
        try {
            const { error } = await supabase
                .from('jobs')
                .delete()
                .eq('id', id);

            if (error) throw error;
            AdminService.logAudit(`Job Deleted: ID ${id}`, 'Sarah HR');
            return true;
        } catch (error) {
            console.error('Supabase delete job error, falling back:', error);
            const jobs = await AdminService.getJobs();
            const newJobs = jobs.filter(j => j.id !== id);
            AdminService._saveData('gt_jobs', newJobs);
            AdminService.logAudit(`Job Deleted: ID ${id}`, 'Sarah HR');
            return newJobs;
        }
    },
    getCandidates: async () => {
        return AdminService.getApplications();
    },
    updateCandidate: async (id, updatedCandidate) => {
        try {
            // Map fields back to Supabase schema
            const dbData = {};
            if (updatedCandidate.name !== undefined) dbData.name = updatedCandidate.name;
            if (updatedCandidate.role !== undefined) dbData.role = updatedCandidate.role;
            if (updatedCandidate.email !== undefined) dbData.email = updatedCandidate.email;
            if (updatedCandidate.phone !== undefined) dbData.phone = updatedCandidate.phone;
            if (updatedCandidate.experience !== undefined) dbData.experience = parseInt(updatedCandidate.experience);
            if (updatedCandidate.screening !== undefined) dbData.screening = updatedCandidate.screening;
            if (updatedCandidate.stage !== undefined) dbData.stage = updatedCandidate.stage;
            if (updatedCandidate.linkedin !== undefined) dbData.linkedin_url = updatedCandidate.linkedin;
            if (updatedCandidate.portfolio !== undefined) dbData.portfolio_url = updatedCandidate.portfolio;
            if (updatedCandidate.resume_url !== undefined) dbData.resume_url = updatedCandidate.resume_url;
            if (updatedCandidate.source !== undefined) dbData.source = updatedCandidate.source;
            if (updatedCandidate.appliedDate !== undefined) dbData.applied_date = updatedCandidate.appliedDate;

            const { data, error } = await supabase
                .from('applications')
                .update(dbData)
                .eq('id', id)
                .select();


            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('Supabase update candidate error, falling back:', error);
            const candidates = await AdminService.getCandidates();
            const index = candidates.findIndex(c => c.id == id);
            if (index !== -1) {
                candidates[index] = { ...candidates[index], ...updatedCandidate };
                AdminService._saveData('gt_candidates', candidates);
                return candidates[index];
            }
            return null;
        }
    },

    // Keep for backward compatibility if needed, but updated to use updateCandidate logic
    updateCandidateStatus: async (id, stage) => {
        return await AdminService.updateCandidate(id, { stage });
    },
    addCandidate: async (candidate) => {
        try {
            let candidateData = candidate;
            let resumeUrl = null;

            if (candidate instanceof FormData) {
                candidateData = Object.fromEntries(candidate.entries());
                const resumeFile = candidate.get('resume');

                if (resumeFile && resumeFile instanceof File && resumeFile.size > 0) {
                    const fileExt = resumeFile.name.split('.').pop();
                    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
                    const filePath = `${fileName}`;

                    const { data: uploadData, error: uploadError } = await supabase.storage
                        .from('RESUMES')
                        .upload(filePath, resumeFile, {
                            cacheControl: '3600',
                            upsert: false
                        });

                    if (uploadError) {
                        console.error("Supabase Storage Upload Error:", uploadError);
                        throw new Error(`Resume upload failed: ${uploadError.message}. Check your Supabase Storage policies.`);
                    } else {
                        const { data: { publicUrl } } = supabase.storage
                            .from('RESUMES')
                            .getPublicUrl(filePath);
                        resumeUrl = publicUrl;
                        candidateData.resume_url = resumeUrl;
                    }
                }
            }

            // Map fields to Supabase schema
            const dbData = {
                name: candidateData.name,
                role: candidateData.role,
                email: candidateData.email,
                phone: candidateData.phone,
                experience: isNaN(parseInt(candidateData.experience)) ? 0 : parseInt(candidateData.experience),
                screening: candidateData.screening,
                linkedin_url: candidateData.linkedin,
                portfolio_url: candidateData.portfolio,
                resume_url: candidateData.resume_url || candidateData.resume?.name || candidateData.resume,
                resume: candidateData.resume?.name || candidateData.resume || (candidateData.resume_url && !candidateData.resume_url.startsWith('http') && !candidateData.resume_url.startsWith('data:') ? candidateData.resume_url : 'resume.pdf')
            };

            const { data, error } = await supabase
                .from('applications')
                .insert([dbData])
                .select();

            if (error) throw error;
            const newApp = data[0];
            return {
                ...newApp,
                appliedDate: newApp.applied_date,
                linkedin: newApp.linkedin_url,
                portfolio: newApp.portfolio_url,
                resume_url: newApp.resume_url
            };

        } catch (error) {
            console.error("Candidate submission failed. Error context:", error);
            alert("Cloud upload failed! Your data is saved locally, but not in Supabase. Error: " + error.message);

            let candidateData = candidate;
            let resumeName = 'resume.pdf';

            if (candidate instanceof FormData) {
                candidateData = Object.fromEntries(candidate.entries());
                if (candidateData.resume && candidateData.resume instanceof File) {
                    resumeName = candidateData.resume.name;
                    candidateData.resume = resumeName;
                }
            }

            const candidates = await AdminService.getCandidates();
            const newCandidate = {
                ...candidateData,
                id: Date.now(),
                stage: 'review pending',
                applied_date: new Date().toISOString().split('T')[0],
                score: Math.floor(Math.random() * (95 - 60 + 1)) + 60,
                interviewScores: {},
                resume: resumeName,
                resume_url: resumeName // Fallback to filename so it's not "EMPTY"
            };

            const newList = [newCandidate, ...candidates];
            AdminService._saveData('gt_candidates', newList);

            const currentApps = await AdminService.getApplications();
            const newAppEntry = {
                ...newCandidate,
                date: newCandidate.applied_date,
                status: 'review pending'
            };
            AdminService._saveData('gt_applications', [newAppEntry, ...currentApps]);

            return newCandidate;
        }
    },
    getRecruitmentMetrics: async () => {
        const [candidates, jobs] = await Promise.all([
            AdminService.getCandidates(),
            AdminService.getJobs()
        ]);

        const totalCandidates = candidates.length;
        const openPositions = jobs.filter(j => j.status === 'Active').length;
        const hiredCount = candidates.filter(c => c.stage === 'hired').length;
        const rejectedCount = candidates.filter(c => c.stage === 'rejected').length;
        const interviewCount = candidates.filter(c => c.stage === 'Interview scheduled' || c.stage === 'interview(waiting / completed)').length;

        return {
            totalCandidates,
            openPositions,
            hiredCount,
            rejectedCount,
            interviewCount,
            timeToHire: '18 Days' // Mocked avg
        };
    },

    // --- Core HR: Onboarding ---
    getOnboarding: async () => {
        return AdminService._getData('gt_onboarding', initialOnboarding);
    },

    // --- Core HR: Documents ---
    getDocuments: async () => {
        return AdminService._getData('gt_documents', initialDocuments);
    },

    // --- Core HR: Pulse Surveys ---
    getSurveys: async () => {
        return AdminService._getData('gt_surveys', initialSurveys);
    },

    // --- Core HR: Asset Mgmt ---
    getAssets: async () => {
        return AdminService._getData('gt_assets', initialAssets);
    },

    assignAsset: async (assetId, employeeName) => {
        const assets = await AdminService.getAssets();
        const newAssets = assets.map(a => a.id === assetId ? { ...a, assignedTo: employeeName, status: 'Assigned' } : a);
        AdminService._saveData('gt_assets', newAssets);
        return newAssets;
    },


    // --- Queries ---
    getQueries: async () => {
        try {
            const { data, error } = await supabase
                .from('queries')
                .select('*')
                .order('date', { ascending: false });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Supabase fetch queries error, falling back:', error);
            return AdminService._getData('gt_queries', initialQueries);
        }
    },

    async addQuery(query) {
        try {
            const { data, error } = await supabase
                .from('queries')
                .insert([{
                    name: query.name,
                    email: query.email,
                    message: query.message
                }])
                .select();

            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('Supabase error, falling back to local storage:', error);
            const queries = await AdminService.getQueries();
            const newQuery = { ...query, id: Date.now(), status: 'New', date: new Date().toISOString().split('T')[0] };
            const newQueries = [newQuery, ...queries];
            AdminService._saveData('gt_queries', newQueries);
            return newQuery;
        }
    },

    async updateQuery(updatedQuery) {
        const queries = await AdminService.getQueries();
        const newQueries = queries.map(q => q.id === updatedQuery.id ? updatedQuery : q);
        AdminService._saveData('gt_queries', newQueries);
        return updatedQuery;
    },

    async deleteQuery(id) {
        const queries = await AdminService.getQueries();
        const newQueries = queries.filter(q => q.id !== id);
        AdminService._saveData('gt_queries', newQueries);
        return true;
    },

    // --- Meetings ---
    getMeetings: async () => {
        try {
            const response = await AdminService._fetchWithTimeout(`${API_URL}/meetings`);
            if (!response.ok) throw new Error('Failed to fetch meetings');
            return await response.json();
        } catch (error) {
            console.error(error);
            return AdminService._getData('gt_meetings', initialMeetings);
        }
    },

    async updateMeeting(updatedMeeting) {
        const meetings = await AdminService.getMeetings();
        const newMeetings = meetings.map(m => m.id === updatedMeeting.id ? updatedMeeting : m);
        AdminService._saveData('gt_meetings', newMeetings);
        return updatedMeeting;
    },

    async addMeeting(meeting) {
        const meetings = await AdminService.getMeetings();
        const newMeeting = { ...meeting, id: Date.now() };
        const newMeetings = [newMeeting, ...meetings];
        AdminService._saveData('gt_meetings', newMeetings);
        return newMeeting;
    },

    async deleteMeeting(id) {
        const meetings = await AdminService.getMeetings();
        const newMeetings = meetings.filter(m => m.id !== id);
        AdminService._saveData('gt_meetings', newMeetings);
        return true;
    },



    getIndustryMetrics: async () => {
        return AdminService._getData('gt_industry_metrics', initialIndustryMetrics);
    },

    getProjectHealth: async () => {
        return AdminService._getData('gt_project_health', initialProjectHealth);
    },




    // --- User Management ---
    getUsers: async () => {
        try {
            const { data, error } = await supabase
                .from('Users')
                .select('*')
                .order('id', { ascending: true });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Supabase fetch users error, falling back:', error);
            return AdminService._getData('gt_users', initialUsers);
        }
    },

    addUser: async (user) => {
        try {
            const users = await AdminService.getUsers();

            // Generate sequential Employee ID
            let nextId = 1001;
            const empIds = users
                .map(u => u.employee_id)
                .filter(id => id && id.startsWith('GT-'))
                .map(id => parseInt(id.split('-')[1]))
                .filter(num => !isNaN(num));

            if (empIds.length > 0) {
                nextId = Math.max(...empIds) + 1;
            }
            const generatedEmpId = `GT-${nextId}`;

            const userData = {
                name: user.name,
                email: user.email,
                password: user.password || 'Temporary@123',
                role: user.role,
                department: user.department,
                designation: user.designation,
                dob: user.dob,
                mobile: user.mobile,
                employee_id: generatedEmpId,
                access: user.access || [],
                status: user.status || 'Active'
            };

            const { data, error } = await supabase
                .from('Users')
                .insert([userData])
                .select();

            if (error) throw error;

            // Sync local storage
            const updatedUsers = [...users, data[0]];
            AdminService._saveData('gt_users', updatedUsers);

            return data[0];
        } catch (error) {
            console.error('Supabase add user error, falling back:', error);
            const users = await AdminService.getUsers();
            const newUser = { ...user, id: Date.now(), status: 'Active' };
            const newUsers = [...users, newUser];
            AdminService._saveData('gt_users', newUsers);
            return newUser;
        }
    },

    updateUser: async (updatedUser) => {
        try {
            const { data, error } = await supabase
                .from('Users')
                .update({
                    name: updatedUser.name,
                    email: updatedUser.email,
                    role: updatedUser.role,
                    department: updatedUser.department,
                    designation: updatedUser.designation,
                    dob: updatedUser.dob,
                    mobile: updatedUser.mobile,
                    access: updatedUser.access,
                    status: updatedUser.status
                })
                .eq('id', updatedUser.id)
                .select();

            if (error) throw error;

            // Sync local storage
            const users = await AdminService.getUsers();
            const newUsers = users.map(u => u.id === updatedUser.id ? data[0] : u);
            AdminService._saveData('gt_users', newUsers);

            return data[0];
        } catch (error) {
            console.error('Supabase update user error, falling back:', error);
            const users = await AdminService.getUsers();
            const newUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
            AdminService._saveData('gt_users', newUsers);
            return updatedUser;
        }
    },

    deleteUser: async (id) => {
        try {
            const { error } = await supabase
                .from('Users')
                .delete()
                .eq('id', id);

            if (error) throw error;

            const users = await AdminService.getUsers();
            const newUsers = users.filter(u => u.id !== id);
            AdminService._saveData('gt_users', newUsers);
            return true;
        } catch (error) {
            console.error('Supabase delete user error, falling back:', error);
            const users = await AdminService.getUsers();
            const newUsers = users.filter(u => u.id !== id);
            AdminService._saveData('gt_users', newUsers);
            return newUsers;
        }
    },

    resetUserPassword: async (id) => {
        const users = await AdminService.getUsers();
        const userIndex = users.findIndex(u => u.id === id);
        if (userIndex === -1) return { success: false, message: 'User not found' };

        const tempPassword = Math.random().toString(36).slice(-8);
        users[userIndex].password = tempPassword;
        users[userIndex].passwordAge = 0;
        users[userIndex].passwordStrength = 'Weak';

        AdminService._saveData('gt_users', users);
        await AdminService.logAudit(`Password Reset for User ID ${id}`, 'Admin');
        return { success: true, message: `Password reset to: ${tempPassword}` };
    },

    updateUserPassword: async (id, newPassword) => {
        const users = await AdminService.getUsers();
        const userIndex = users.findIndex(u => u.id === id);
        if (userIndex === -1) return { success: false, message: 'User not found' };

        // Strict Validation: minimum 9 characters, Alphanumeric, at least one symbol
        const minLength = 9;
        const hasAlphanumeric = /[A-Za-z]/.test(newPassword) && /[0-9]/.test(newPassword);
        const hasSymbol = /[^A-Za-z0-9]/.test(newPassword);

        if (newPassword.length < minLength) {
            return { success: false, message: `Password must be at least ${minLength} characters.` };
        }
        if (!hasAlphanumeric) {
            return { success: false, message: 'Password must be alphanumeric (contain both letters and numbers).' };
        }
        if (!hasSymbol) {
            return { success: false, message: 'Password must contain at least one special symbol.' };
        }

        users[userIndex].password = newPassword;
        users[userIndex].passwordAge = 0;
        users[userIndex].passwordStrength = 'Strong';

        AdminService._saveData('gt_users', users);
        await AdminService.logAudit(`Password Updated for User ID ${id}`, 'Admin');
        return { success: true, message: 'Password updated successfully.' };
    },

    verifySecurityKey: async (identity, key) => {
        const users = await AdminService.getUsers();
        const user = users.find(u => (u.email === identity || u.name === identity) && u.status === 'Active');

        if (!user && identity === 'admin' && key === '185576') {
            return { success: true, message: 'Identity Verified' };
        }

        if (user && user.securityKey === key) {
            return { success: true, message: 'Identity Verified' };
        }

        return { success: false, message: 'Invalid Security Key' };
    },


    verifySecurityQuestions: async (identity, answers) => {
        const users = await AdminService.getUsers();
        const user = users.find(u => (u.email === identity || u.name === identity) && u.status === 'Active');

        if (!user && identity === 'admin' && answers.petName === 'Ramu' && answers.changeMind === 'DigN3') {
            return { success: true, message: 'Security Answers Verified' };
        }

        if (user && user.securityQuestions) {
            if (user.securityQuestions.petName === answers.petName && user.securityQuestions.changeMind === answers.changeMind) {
                return { success: true, message: 'Security Answers Verified' };
            }
        }

        return { success: false, message: 'Incorrect security answers' };
    },

    updatePasswordByIdentity: async (identity, newPassword) => {
        const users = await AdminService.getUsers();
        const userIndex = users.findIndex(u => (u.email === identity || u.name === identity) && u.status === 'Active');

        if (userIndex === -1 && identity === 'admin') {
            return { success: true, message: 'Password updated successfully (Demo Admin).' };
        }

        if (userIndex !== -1) {
            return await AdminService.updateUserPassword(users[userIndex].id, newPassword);
        }

        return { success: false, message: 'User not found' };
    },

    authenticate: async (identifier, password) => {
        // Hardcoded Demo Admin
        if (identifier === 'admin' && password === 'admin123') {
            return {
                success: true,
                user: {
                    id: 'admin-id',
                    name: 'Admin User',
                    email: 'admin@goldtech.com',
                    role: 'Admin',
                    access: ['Admin', 'Sales portal', 'HR portal', 'Tasks portal', 'Project-management', 'Finance portal', 'Manager portal', 'Employee portal', 'Research & development portal']
                }
            };
        }

        try {
            const { data, error } = await supabase
                .from('Users')
                .select('*')
                .or(`email.eq."${identifier}",name.eq."${identifier}"`)
                .eq('password', password)
                .eq('status', 'Active')
                .maybeSingle();

            if (error) throw error;
            if (data) {
                return { success: true, user: data };
            }
        } catch (error) {
            console.error('Authentication error:', error);
        }

        // Fallback to local storage (Mock Data)
        const users = await AdminService.getUsers();
        const user = users.find(u => (u.email === identifier || u.name === identifier) && u.password === password && u.status === 'Active');
        if (user) return { success: true, user };

        return { success: false, message: 'Invalid credentials or inactive account' };
    },

    // --- Client Management ---
    getClients: async () => {
        try {
            const { data, error } = await supabase
                .from('clients')
                .select('*')
                .order('id', { ascending: false });

            if (error) {
                console.error('Supabase fetch clients error, falling back:', error);
                return AdminService._getData('gt_clients', initialClients);
            }
            // Update local cache for offline sync/hot refresh
            if (data && data.length > 0) {
                AdminService._saveData('gt_clients', data);
                return data;
            }
            return AdminService._getData('gt_clients', initialClients);
        } catch (error) {
            console.error('Network error fetching clients, falling back:', error);
            return AdminService._getData('gt_clients', initialClients);
        }
    },

    addClient: async (client) => {
        try {
            const clientPayload = { ...client, status: 'Active' };
            delete clientPayload.id; // Let Supabase gen_random_uuid handle ID creation

            const { data, error } = await supabase
                .from('clients')
                .insert([clientPayload])
                .select();

            if (error) throw error;

            // Re-fetch all to ensure synchronization
            return await AdminService.getClients();
        } catch (error) {
            console.error('Supabase add client error, falling back:', error);
            // Fallback
            const clients = await AdminService.getClients();
            const newClient = { ...client, id: Date.now().toString(), status: 'Active' };
            const newClients = [...clients, newClient];
            AdminService._saveData('gt_clients', newClients);
            return newClients;
        }
    },

    updateClient: async (updatedClient) => {
        try {
            const { id, ...updatePayload } = updatedClient;

            const { data, error } = await supabase
                .from('clients')
                .update(updatePayload)
                .eq('id', id)
                .select();

            if (error) throw error;

            return await AdminService.getClients();
        } catch (error) {
            console.error('Supabase update client error, falling back:', error);
            // Fallback
            const clients = await AdminService.getClients();
            const newClients = clients.map(c => c.id === updatedClient.id ? updatedClient : c);
            AdminService._saveData('gt_clients', newClients);
            return newClients;
        }
    },

    deleteClient: async (id) => {
        try {
            const { error } = await supabase
                .from('clients')
                .delete()
                .eq('id', id);

            if (error) throw error;

            return await AdminService.getClients();
        } catch (error) {
            console.error('Supabase delete client error, falling back:', error);
            // Fallback
            const clients = await AdminService.getClients();
            const newClients = clients.filter(c => c.id !== id);
            AdminService._saveData('gt_clients', newClients);
            return newClients;
        }
    },

    // --- Role-Based Access Control (RBAC) ---
    getRoles: async () => {
        return AdminService._getData('gt_roles', initialRoles);
    },

    updatePermissions: async (roleId, newPermissions) => {
        const roles = await AdminService.getRoles();
        const newRoles = roles.map(r => r.id === roleId ? { ...r, permissions: newPermissions } : r);
        AdminService._saveData('gt_roles', newRoles);
        return newRoles;
    },

    // --- Company Info ---
    getCompanyInfo: async () => {
        return AdminService._getData('gt_company_info', initialCompanyInfo);
    },

    updateCompanyInfo: async (info) => {
        AdminService._saveData('gt_company_info', info);
        await AdminService.logAudit('Company Info Updated', 'Admin');
        return info;
    },

    // Infrastructure & Monitoring APIs
    getSystemHealth: async () => {
        // Mock data for system health
        return {
            cpu: Math.floor(Math.random() * 30) + 20, // 20-50%
            memory: Math.floor(Math.random() * 40) + 30, // 30-70%
            disk: 45, // Constant for now
            uptime: '14d 3h 22m'
        };
    },

    getServiceStatus: async () => {
        return [
            { id: 1, name: 'Authentication Service', status: 'Online', version: 'v1.2.0', uptime: '99.9%' },
            { id: 2, name: 'Payment Gateway', status: 'Online', version: 'v2.0.1', uptime: '99.95%' },
            { id: 3, name: 'Notification Service', status: 'Degraded', version: 'v1.0.5', uptime: '98.5%' },
            { id: 4, name: 'Database Cluster', status: 'Online', version: 'PostgreSQL 14', uptime: '99.99%' },
            { id: 5, name: 'Storage Service', status: 'Online', version: 'Supabase Storage', uptime: '99.9%' }
        ];
    },

    getRecentLogs: async () => {
        const logs = [
            { id: 1, type: 'Info', message: 'User login successful: admin', timestamp: '2 mins ago' },
            { id: 2, type: 'Warning', message: 'High memory usage detected on node-2', timestamp: '15 mins ago' },
            { id: 3, type: 'Error', message: 'Payment gateway timeout (retry success)', timestamp: '1 hour ago' },
            { id: 4, type: 'Info', message: 'Scheduled backup completed successfully', timestamp: '3 hours ago' },
            { id: 5, type: 'Info', message: 'New user registration: john.doe@example.com', timestamp: '5 hours ago' }
        ];
        return logs;
    },


    // --- HR Module (Leaves & Payroll) ---
    getLeaveRequests: async () => {
        return AdminService._getData('gt_leaves', initialLeaveRequests);
    },

    updateLeaveRequest: async (updatedLeave) => {
        try {
            const response = await AdminService._fetchWithTimeout(`${API_URL}/leaves/${updatedLeave.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedLeave)
            });
            if (!response.ok) throw new Error('Failed to update leave request');
            return await response.json();
        } catch (error) {
            console.error(error);
            const leaves = await AdminService.getLeaveRequests();
            const newLeaves = leaves.map(l => l.id === updatedLeave.id ? updatedLeave : l);
            AdminService._saveData('gt_leaves', newLeaves);
            return newLeaves;
        }
    },


    addLeaveRequest: async (newLeave) => {
        try {
            const response = await AdminService._fetchWithTimeout(`${API_URL}/leaves`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newLeave)
            });
            if (!response.ok) throw new Error('Failed to add leave request');
            return await response.json();
        } catch (error) {
            console.error(error);
            const leaves = await AdminService.getLeaveRequests();
            const leaveWithId = { ...newLeave, id: Date.now(), status: 'Pending' };
            const newLeaves = [leaveWithId, ...leaves];
            AdminService._saveData('gt_leaves', newLeaves);
            return newLeaves;
        }
    },

    getPayrollStats: async () => {
        return AdminService._getData('gt_payroll', initialPayroll);
    },

    getOrgChart: async () => {
        return AdminService._getData('gt_org_chart', initialOrgChart);
    },

    getSecurityHealth: async () => {
        return AdminService._getData('gt_security_health', initialSecurityHealth);
    },

    getLearningProgress: async () => {
        return AdminService._getData('gt_learning', initialLearningProgress);
    },


    getTasks: async (userId) => {
        // Return tasks for specific user (mocking filtering)
        const allTasks = await AdminService._getData('gt_tasks', initialTasks);
        if (userId) return allTasks.filter(t => t.userId === userId);
        return allTasks;
    },

    addTask: async (task) => {
        const tasks = await AdminService.getTasks();
        const newTask = {
            ...task,
            id: Date.now(),
            status: 'Pending',
            createdDate: new Date().toISOString().split('T')[0]
        };
        const newTasks = [newTask, ...tasks];
        AdminService._saveData('gt_tasks', newTasks);
        await AdminService.logAudit(`Task Created: ${task.title}`, 'System');
        return newTasks;
    },

    updateTask: async (updatedTask) => {
        const tasks = await AdminService.getTasks();
        const newTasks = tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
        AdminService._saveData('gt_tasks', newTasks);
        await AdminService.logAudit(`Task Updated: ${updatedTask.title}`, 'System');
        return newTasks;
    },

    deleteTask: async (taskId) => {
        const tasks = await AdminService.getTasks();
        const task = tasks.find(t => t.id === taskId);
        const newTasks = tasks.filter(t => t.id !== taskId);
        AdminService._saveData('gt_tasks', newTasks);
        if (task) await AdminService.logAudit(`Task Deleted: ${task.title}`, 'System');
        return newTasks;
    },


    async getPayrollHistory(userId) {
        const history = await AdminService._getData('gt_payroll_history', initialPayrollHistory);
        if (userId) return history.filter(p => p.userId === userId);
        return history;
    },

    // --- Manager Portal Methods ---
    async getManagerOverview() {
        return {
            stats: [
                { title: 'Project Velocity', value: '124 SP', change: '+12%', type: 'positive' },
                { title: 'Team Utilization', value: '87%', change: '-2%', type: 'neutral' },
                { title: 'Pending Approvals', value: '8', change: 'Urgent', type: 'negative' },
                { title: 'Budget Variance', value: '+5%', change: 'Under Budget', type: 'positive' }
            ],
            alerts: [
                { id: 1, severity: 'Critical', message: 'Production Incident: Login Failure rate spike', time: '10 mins ago' },
                { id: 2, severity: 'High', message: 'Resource Conflict: John Dev over-allocated in Sprint 12', time: '2 hours ago' }
            ]
        };
    },

    async getResourceAllocation() {
        return [
            { id: 101, name: 'Kyle Reese', role: 'Security Analyst', project: 'Hospital IT Security', allocation: 100, status: 'Busy', avatar: 'https://i.pravatar.cc/150?u=101' },
            { id: 102, name: 'John Dev', role: 'Frontend Engineer', project: 'Gold Industry ERP', allocation: 120, status: 'Overloaded', avatar: 'https://i.pravatar.cc/150?u=102' },
            { id: 103, name: 'Alice Smith', role: 'Backend Engineer', project: 'Gold Industry ERP', allocation: 80, status: 'Available', avatar: 'https://i.pravatar.cc/150?u=103' },
            { id: 104, name: 'Dr. Miles', role: 'AI Specialist', project: 'Hospital AI Diag', allocation: 50, status: 'Bench', avatar: 'https://i.pravatar.cc/150?u=104' },
            { id: 105, name: 'T-800', role: 'DevOps Engineer', project: 'Infra Upgrade', allocation: 0, status: 'On Bench', avatar: 'https://i.pravatar.cc/150?u=105' },
        ];
    },

    async getPerformanceMetrics() {
        return {
            velocity: [
                { sprint: 'S1', value: 45 }, { sprint: 'S2', value: 52 }, { sprint: 'S3', value: 48 }, { sprint: 'S4', value: 60 }
            ],
            quality: [
                { metric: 'Code Coverage', value: 85, target: 80 },
                { metric: 'Bug Leakage', value: 2.5, target: 5 },
                { metric: 'Tech Debt', value: 12, target: 10 }
            ],
            individual: [
                { name: 'John Dev', billableHours: 38, defects: 1 },
                { name: 'Alice Smith', billableHours: 40, defects: 0 },
                { name: 'Kyle Reese', billableHours: 35, defects: 2 }
            ]
        };
    },

    async getApprovals() {
        return [
            { id: 1, type: 'Leave', requestor: 'John Dev', details: 'Sick Leave (2 days)', date: '2023-11-01', status: 'Pending' },
            { id: 2, type: 'Expense', requestor: 'Alice Smith', details: 'supabase_security_cert.pdf ($150)', date: '2023-10-30', status: 'Pending' },
            { id: 3, type: 'Timesheet', requestor: 'Kyle Reese', details: 'Oct 15-30 (80 hrs)', date: '2023-10-31', status: 'Pending' },
            { id: 4, type: 'PR', requestor: 'T-800', details: 'Feat: Skynet Integ #402', repo: 'gold-erp-core', date: '2023-11-02', status: 'Pending' }
        ];
    },

    async getIncidents() {
        return [
            { id: 101, title: 'API Latency High', severity: 'P1', status: 'Open', owner: 'T-800', eta: '2h' },
            { id: 102, title: 'Data Sync Failure', severity: 'P2', status: 'Investigating', owner: 'Alice Smith', eta: '4h' },
            { id: 103, title: 'UI Glitch on Safari', severity: 'P3', status: 'Resolved', owner: 'John Dev', eta: '-' }
        ];
    },



    async getProjectDeliveryPrediction() {
        return [
            { project: 'Gold Industry ERP', likelihood: 'On Time', confidence: 85, riskFactor: 'Low' },
            { project: 'Hospital AI Diag', likelihood: 'Delayed', confidence: 60, riskFactor: 'High (Data unavailability)' },
            { project: 'Infra Upgrade', likelihood: 'At Risk', confidence: 40, riskFactor: 'Medium (Resource shortage)' }
        ];
    },

    // --- Chatbot Analytics ---
    async getChatLogs() {
        return await AdminService._getData('gt_chat_logs', initialChatLogs);
    },

    async addChatLog(log) {
        const logs = await AdminService.getChatLogs();
        const existingIndex = logs.findIndex(l => l.id === log.id);

        const logEntry = {
            ...log,
            date: log.date || new Date().toISOString().split('T')[0],
            time: log.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        let newLogs;
        if (existingIndex !== -1) {
            newLogs = logs.filter((_, i) => i !== existingIndex);
            newLogs = [logEntry, ...newLogs];
        } else {
            newLogs = [logEntry, ...logs];
        }

        AdminService._saveData('gt_chat_logs', newLogs);
        return logEntry;
    },

    async getChatStats() {
        const logs = await AdminService.getChatLogs();
        const totalChats = logs.length;
        const leadsCaptured = logs.filter(l => l.status === 'Lead Captured').length;
        const avgDuration = '3m 12s'; // Mock for now, or calculate if durations are numbers

        return {
            totalChats,
            leadsCaptured,
            avgDuration,
            satisfaction: '4.8/5'
        };
    },

    getFeedbackReviews: async () => {
        return [
            { id: 1, employee: 'John Dev', lastReview: '2023-09-15', nextReview: '2023-12-15', rating: 'Exceeds Expectations' },
            { id: 2, employee: 'Alice Smith', lastReview: '2023-09-10', nextReview: '2023-12-10', rating: 'Outstanding' }
        ];
    },

    getTeam: async (managerName) => {
        // Find users who report to this manager (using org chart data)
        const orgChart = await AdminService.getOrgChart();
        return orgChart.filter(emp => emp.manager === managerName);
    },

    getPendingTeamLeaves: async (managerName) => {
        // 1. Get team members
        const team = await AdminService.getTeam(managerName);
        const teamNames = team.map(t => t.name);

        // 2. Get all leaves and filter by team members AND 'Pending' status
        const allLeaves = await AdminService.getLeaveRequests();
        return allLeaves.filter(l => teamNames.includes(l.name) && l.status === 'Pending');
    },


    async getProjectStats() {
        return AdminService._getData('gt_project_stats', initialProjectStats);
    },

    // --- Finance Portal Methods (Expanded) ---
    async getFinancialStats() {
        return AdminService._getData('gt_finance_stats', initialFinancialStats);
    },

    // Accounts Receivable
    async getInvoices() {
        return AdminService._getData('gt_invoices', initialInvoices);
    },

    async createInvoice(invoiceData) {
        const invoices = await AdminService.getInvoices();
        const taxRate = 0.18; // 18% GST Mock
        const tax = invoiceData.amount * taxRate;
        const total = invoiceData.amount + tax;

        const newInvoice = {
            ...invoiceData,
            id: Date.now(),
            tax,
            total,
            status: 'Pending',
            date: new Date().toISOString().split('T')[0]
        };

        const newInvoices = [newInvoice, ...invoices];
        AdminService._saveData('gt_invoices', newInvoices);
        await AdminService.logAudit(`Invoice Generated for ${invoiceData.client}`, 'Fiona Finance');
        return newInvoices;
    },

    async recordPayment(invoiceId, method) {
        const invoices = await AdminService.getInvoices();
        const newInvoices = invoices.map(inv => inv.id === invoiceId ? { ...inv, status: 'Paid' } : inv);
        AdminService._saveData('gt_invoices', newInvoices);
        await AdminService.logAudit(`Payment Received for Invoice #${invoiceId} via ${method}`, 'System');
        return newInvoices;
    },

    // Accounts Payable
    async getVendors() {
        return AdminService._getData('gt_vendors', initialVendors);
    },

    async addVendor(vendorData) {
        const vendors = await AdminService.getVendors();
        const newVendor = { ...vendorData, id: Date.now(), status: 'Active' };
        const newVendors = [...vendors, newVendor];
        AdminService._saveData('gt_vendors', newVendors);
        await AdminService.logAudit(`Vendor Added: ${vendorData.name}`, 'Fiona Finance');
        return newVendors;
    },

    async getCorporateCards() {
        return AdminService._getData('gt_corp_cards', initialCorpCards);
    },

    // Compliance & Reporting
    async getAuditLog() {
        return AdminService._getData('gt_audit_log', initialAuditLog);
    },

    async logAudit(action, user) {
        const logs = await AdminService.getAuditLog();
        const newLog = { id: Date.now(), action, user, timestamp: new Date().toLocaleString() };
        const newLogs = [newLog, ...logs];
        AdminService._saveData('gt_audit_log', newLogs);
        return newLogs;
    },

    async getPendingInvoices() {
        const invoices = await AdminService.getInvoices();
        return invoices.filter(inv => inv.status === 'Pending');
    },

    async updateInvoice(updatedInvoice) {
        const invoices = await AdminService.getInvoices();
        const newInvoices = invoices.map(i => i.id === updatedInvoice.id ? updatedInvoice : i);
        AdminService._saveData('gt_invoices', newInvoices);
        return newInvoices;
    },

    async getExpenseRequests() {
        return AdminService._getData('gt_expenses', initialExpenses);
    },

    async updateExpense(updatedExpense) {
        const expenses = await AdminService.getExpenseRequests();
        const newExpenses = expenses.map(e => e.id === updatedExpense.id ? updatedExpense : e);
        AdminService._saveData('gt_expenses', newExpenses);
        await AdminService.logAudit(`Expense ${updatedExpense.status}: ${updatedExpense.employee}`, 'Fiona Finance');
        return newExpenses;
    },

    async processPayroll(month) {
        console.log(`Processing payroll for ${month}... Success!`);
        await AdminService.logAudit(`Payroll Processed for ${month}`, 'Fiona Finance');
        return true;
    },

    // --- Financial Reporting & Compliance ---
    async getFinancialReport(type) {
        const [invoices, expenses, corpCards] = await Promise.all([
            AdminService.getInvoices(),
            AdminService.getExpenseRequests(),
            AdminService.getCorporateCards()
        ]);
        const assets = 350000;

        if (type === 'PL') {
            const totalRevenue = invoices.reduce((acc, inv) => acc + (inv.status === 'Paid' ? inv.amount : 0), 0);
            const totalExpenses = expenses.reduce((acc, exp) => acc + (exp.status === 'Approved' ? exp.amount : 0), 0) +
                corpCards.reduce((acc, card) => acc + card.used, 0);

            return {
                revenue: totalRevenue,
                expenses: totalExpenses,
                netProfit: totalRevenue - totalExpenses,
                breakdown: [
                    { category: 'Service Revenue', amount: totalRevenue },
                    { category: 'OpEx (Travel/Meals)', amount: expenses.reduce((acc, exp) => acc + (exp.status === 'Approved' ? exp.amount : 0), 0) },
                    { category: 'Corp Card Spends', amount: corpCards.reduce((acc, card) => acc + card.used, 0) }
                ]
            };
        } else if (type === 'BS') {
            const receivables = invoices.reduce((acc, inv) => acc + (inv.status === 'Pending' ? inv.total : 0), 0);
            const payables = 15000;

            return {
                assets: {
                    cash: assets,
                    receivables: receivables,
                    equipment: 50000
                },
                liabilities: {
                    payables: payables,
                    taxPayable: invoices.reduce((acc, inv) => acc + (inv.status === 'Pending' ? inv.tax : 0), 0)
                },
                equity: (assets + receivables + 50000) - (payables + invoices.reduce((acc, inv) => acc + (inv.status === 'Pending' ? inv.tax : 0), 0))
            };
        } else if (type === 'Tax') {
            const outputTax = invoices.reduce((acc, inv) => acc + inv.tax, 0);
            const inputTax = 2500;

            return {
                collected: outputTax,
                paid: inputTax,
                netPayable: outputTax - inputTax,
                status: outputTax - inputTax > 0 ? 'Payable' : 'Refundable'
            };
        }
    },

    async getInfrastructureDetails() {
        return AdminService._getData('gt_infra_stats', initialInfraStats);
    },

    async getComplianceLogs() {
        return AdminService._getData('gt_compliance_logs', initialComplianceLogs);
    },

    async requestJitAccess(request) {
        const requests = await AdminService.getJitRequests();
        const newRequest = { ...request, id: Date.now(), status: 'Pending', time: new Date().toLocaleString() };
        const newRequests = [newRequest, ...requests];
        AdminService._saveData('gt_jit_requests', newRequests);
        await AdminService.logAudit(`JIT Access Requested: ${request.role} for ${request.user}`, request.user);
        return newRequests;
    },

    async getJitRequests() {
        return AdminService._getData('gt_jit_requests', initialJitRequests);
    },

    async approveJitAccess(id) {
        const requests = await AdminService.getJitRequests();
        const newRequests = requests.map(r => r.id === id ? { ...r, status: 'Approved' } : r);
        AdminService._saveData('gt_jit_requests', newRequests);
        const req = requests.find(r => r.id === id);
        await AdminService.logAudit(`JIT Access Approved for Request #${id} (${req?.user})`, 'Admin');
        return newRequests;
    },

    async rejectJitAccess(id) {
        const requests = await AdminService.getJitRequests();
        const newRequests = requests.map(r => r.id === id ? { ...r, status: 'Rejected' } : r);
        AdminService._saveData('gt_jit_requests', newRequests);
        const req = requests.find(r => r.id === id);
        await AdminService.logAudit(`JIT Access Rejected for Request #${id} (${req?.user})`, 'Admin');
        return newRequests;
    },

    async getApiKeys() {
        return AdminService._getData('gt_api_keys', initialApiKeys);
    },

    async generateApiKey(name, service) {
        const keys = await AdminService.getApiKeys();
        const newKey = {
            id: Date.now(),
            name,
            service,
            key: `gt_${Math.random().toString(36).substr(2, 16)}`,
            created: new Date().toISOString().split('T')[0],
            status: 'Active',
            lastUsed: 'Never'
        };
        const newKeys = [newKey, ...keys];
        AdminService._saveData('gt_api_keys', newKeys);
        await AdminService.logAudit(`API Key Generated: ${name}`, 'Admin');
        return newKeys;
    },

    async revokeApiKey(id) {
        const keys = await AdminService.getApiKeys();
        const newKeys = keys.map(k => k.id === id ? { ...k, status: 'Revoked' } : k);
        AdminService._saveData('gt_api_keys', newKeys);
        await AdminService.logAudit(`API Key Revoked: ID ${id}`, 'Admin');
        return newKeys;
    },

    // --- Key Admin Functionalities ---
    async impersonateUser(userId) {
        const users = await AdminService.getUsers();
        const user = users.find(u => u.id === userId);
        if (user) {
            await AdminService.logAudit(`Impersonation Started: Admin as ${user.name}`, 'Admin');
            return {
                success: true,
                message: `Now impersonating ${user.name}. All actions will be logged.`,
                user: user
            };
        }
        return { success: false, message: 'User not found' };
    },

    async performBulkAction(actionType, entityType, ids) {
        await AdminService.logAudit(`Bulk Action: ${actionType} on ${ids.length} ${entityType}s`, 'Admin');
        return {
            success: true,
            message: `Successfully performed ${actionType} on ${ids.length} items.`
        };
    },

    // --- Global Search ---
    async globalSearch(query) {
        if (!query) return [];
        const q = query.toLowerCase();
        const results = [];

        const [users, invoices, projects] = await Promise.all([
            AdminService.getUsers(),
            AdminService.getInvoices(),
            AdminService.getProjectStats()
        ]);

        users.forEach(u => {
            if (u.name && typeof u.name === 'string' && u.name.toLowerCase().includes(q) ||
                u.email && typeof u.email === 'string' && u.email.toLowerCase().includes(q)) {
                results.push({ type: 'User', title: u.name, subtitle: u.role, link: '/admin/users' });
            }
        });

        invoices.forEach(i => {
            if (i.client && typeof i.client === 'string' && i.client.toLowerCase().includes(q) ||
                i.id && i.id.toString().includes(q)) {
                results.push({ type: 'Invoice', title: `INV-${i.id}`, subtitle: i.client, link: '/finance/invoices' });
            }
        });

        projects.forEach(p => {
            if (p.name && typeof p.name === 'string' && p.name.toLowerCase().includes(q)) {
                results.push({ type: 'Project', title: p.name, subtitle: p.status, link: '/projects' });
            }
        });

        return results;
    },

    // --- Core Accounting (General Ledger) ---
    async getGLAccounts() {
        return AdminService._getData('gt_gl_accounts', initialGLAccounts);
    },

    async getTransactions() {
        return AdminService._getData('gt_transactions', initialTransactions);
    },

    async addTransaction(transaction) {
        const [transactions, accounts] = await Promise.all([
            AdminService.getTransactions(),
            AdminService.getGLAccounts()
        ]);

        const newTransaction = { ...transaction, id: Date.now() };
        const newTransactions = [newTransaction, ...transactions];

        const newAccounts = accounts.map(acc => {
            const entry = transaction.entries.find(e => e.accountCode === acc.code);
            if (entry) {
                if (['Asset', 'Expense'].includes(acc.type)) {
                    return { ...acc, balance: acc.balance + (entry.debit - entry.credit) };
                } else {
                    return { ...acc, balance: acc.balance + (entry.credit - entry.debit) };
                }
            }
            return acc;
        });

        AdminService._saveData('gt_transactions', newTransactions);
        AdminService._saveData('gt_gl_accounts', newAccounts);
        await AdminService.logAudit(`Journal Entry Recorded: ${transaction.description}`, 'Fiona Finance');
        return newTransactions;
    },

    // --- Advanced AR/AP ---
    async getARAgingReport() {
        const invoices = (await AdminService.getInvoices()).filter(inv => inv.status === 'Pending');
        const today = new Date();
        const buckets = { '0-30': 0, '31-60': 0, '61-90': 0, '90+': 0 };

        invoices.forEach(inv => {
            const dueDate = new Date(inv.dueDate);
            const diffTime = Math.abs(today - dueDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays <= 30) buckets['0-30'] += inv.total;
            else if (diffDays <= 60) buckets['31-60'] += inv.total;
            else if (diffDays <= 90) buckets['61-90'] += inv.total;
            else buckets['90+'] += inv.total;
        });
        return buckets;
    },

    // --- IT Finance Components ---
    async getAssets() {
        return AdminService._getData('gt_assets', initialAssets);
    },

    async getCloudBills() {
        return AdminService._getData('gt_cloud_bills', initialCloudBills);
    },

    async getProjects() {
        return AdminService._getData('gt_projects', initialDetailedProjects);
    },

    async getProjectProfitability() {
        return AdminService._getData('gt_project_profit', initialProjectProfitability);
    },

    // --- Employee Portal Methods ---
    async getWorkFromHome(userId) {
        const wfh = await AdminService._getData('gt_wfh', initialWorkFromHome);
        return wfh.filter(w => w.userId === userId);
    },

    async requestWorkFromHome(wfhData) {
        const wfh = await AdminService._getData('gt_wfh', initialWorkFromHome);
        const newWfh = { ...wfhData, id: Date.now(), status: 'Pending' };
        const newList = [newWfh, ...wfh];
        AdminService._saveData('gt_wfh', newList);
        return newList;
    },

    async getHolidays() {
        return AdminService._getData('gt_holidays', initialHolidays);
    },

    async getOKRs(userId) {
        const okrs = await AdminService._getData('gt_okrs', initialOKRs);
        return okrs.filter(o => o.userId === userId);
    },

    async updateOKR(updatedOKR) {
        const okrs = await AdminService._getData('gt_okrs', initialOKRs);
        const newOkrs = okrs.map(o => o.id === updatedOKR.id ? updatedOKR : o);
        AdminService._saveData('gt_okrs', newOkrs);
        return newOkrs;
    },

    async getLMSCourses() {
        return AdminService._getData('gt_lms_courses', initialLMSCourses);
    },

    async getLearningBudget(userId) {
        return initialLearningBudget;
    },

    async getSocialFeed() {
        return AdminService._getData('gt_social_feed', initialSocialFeed);
    },

    async postSocialUpdate(post) {
        const feed = await AdminService.getSocialFeed();
        const newPost = { ...post, id: Date.now(), timestamp: 'Just now', likes: 0, comments: 0 };
        const newFeed = [newPost, ...feed];
        AdminService._saveData('gt_social_feed', newFeed);
        return newFeed;
    },

    async getDevToolsData() {
        return initialDevTools;
    },

    async generateCloudCredentials(provider) {
        return {
            accessKeyId: 'AKIA' + Math.random().toString(36).substring(7).toUpperCase(),
            secretAccessKey: Math.random().toString(36).substring(7) + Math.random().toString(36).substring(7),
            expiration: new Date(Date.now() + 3600 * 1000).toISOString()
        };
    },

    async getReferrals(userId) {
        return AdminService._getData('gt_referrals', initialReferrals);
    },

    async submitReferral(referral) {
        const referrals = await AdminService.getReferrals();
        const newReferral = { ...referral, id: Date.now(), status: 'Received', bonus: 0 };
        const newList = [newReferral, ...referrals];
        AdminService._saveData('gt_referrals', newList);
        return newList;
    },

    async getResourceCosting() {
        return AdminService._getData('gt_resource_costs', initialResourceCosting);
    },

    async runDepreciation() {
        const assets = await AdminService.getAssets();
        const today = new Date();

        return assets.map(asset => {
            const purchaseDate = new Date(asset.purchaseDate);
            const ageInYears = (today - purchaseDate) / (1000 * 60 * 60 * 24 * 365.25);
            const depreciationPerYear = asset.cost / asset.usefulLifeYears;
            const totalDepreciation = Math.min(asset.cost, depreciationPerYear * ageInYears);
            const currentValue = Math.max(0, asset.cost - totalDepreciation);

            return {
                ...asset,
                currentValue: parseFloat(currentValue.toFixed(2)),
                depreciation: parseFloat(totalDepreciation.toFixed(2))
            };
        });
    },

    // --- Advanced Finance: Remaining Modules ---
    async getPayablesAging() {
        return AdminService._getData('gt_ap_aging', { '0-30': 15000, '31-60': 5000, '61-90': 0, '90+': 0 });
    },

    async getDeferredRevenue() {
        return AdminService._getData('gt_deferred_rev', initialDeferredRevenue);
    },

    async getProjectBudgets() {
        return AdminService._getData('gt_project_budgets', initialProjectBudgets);
    },

    // --- Subscriptions ---
    getSubscriptions: async () => {
        return AdminService._getData('gt_subscriptions', initialSubscriptions);
    },

    addSubscription: async (sub) => {
        const subs = await AdminService.getSubscriptions();
        const newSub = { ...sub, id: Date.now(), nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: 'Active' };
        const newSubs = [...subs, newSub];
        AdminService._saveData('gt_subscriptions', newSubs);
        AdminService.logAudit(`New Subscription: ${sub.client} - ${sub.plan}`, 'Fiona Finance');
        return newSubs;
    },

    // --- Milestones ---
    getUnbilledMilestones: async () => {
        return AdminService._getData('gt_unbilled_milestones', initialUnbilledMilestones);
    },

    createInvoiceFromMilestone: async (milestoneId) => {
        const miles = await AdminService.getUnbilledMilestones();
        const milestone = miles.find(m => m.id === milestoneId);
        if (milestone) {
            await AdminService.createInvoice({
                client: milestone.client || 'Unknown',
                amount: milestone.amount,
                items: [{ desc: `${milestone.project}: ${milestone.phase}`, qty: 1, rate: milestone.amount }]
            });
            const newMiles = miles.map(m => m.id === milestoneId ? { ...m, status: 'Billed' } : m);
            AdminService._saveData('gt_unbilled_milestones', newMiles);
            return true;
        }
        return false;
    },

    // --- Billing Cycle ---
    runBillingCycle: async () => {
        // Mock cycle logic
        const subs = await AdminService.getSubscriptions();
        const miles = await AdminService.getUnbilledMilestones();
        AdminService.logAudit(`Automated Billing Cycle Executed`, 'System');
        return { count: subs.length + miles.filter(m => m.status === 'Unbilled').length };
    },

    // --- Exchange Rates ---
    getExchangeRates: async () => {
        return { USD: 1, INR: 83.5, EUR: 0.92, GBP: 0.79 };
    },

    // --- Password Management Utilities ---
    async generateSecurePassword(options = { length: 16, numbers: true, symbols: true, uppercase: true }) {
        const charset = {
            lowercase: 'abcdefghijklmnopqrstuvwxyz',
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            numbers: '0123456789',
            symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-='
        };

        let characters = charset.lowercase;
        if (options.uppercase) characters += charset.uppercase;
        if (options.numbers) characters += charset.numbers;
        if (options.symbols) characters += charset.symbols;

        let password = '';
        for (let i = 0; i < options.length; i++) {
            password += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        // Ensure at least one of each requested type
        if (options.uppercase && !/[A-Z]/.test(password)) return AdminService.generateSecurePassword(options);
        if (options.numbers && !/[0-9]/.test(password)) return AdminService.generateSecurePassword(options);
        if (options.symbols && !/[!@#$%^&*()_+~`|}{[\]:;?><,./\-=]/.test(password)) return AdminService.generateSecurePassword(options);

        return password;
    },

    checkPasswordStrength(password) {
        if (!password) return { score: 0, label: 'None', color: '#94a3b8' };

        let score = 0;
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        if (score <= 2) return { score, label: 'Weak', color: '#ef4444' };
        if (score <= 4) return { score, label: 'Medium', color: '#f59e0b' };
        return { score, label: 'Strong', color: '#10b981' };
    },

    async getSecurityHealthSummary() {
        const [users, credentials] = await Promise.all([
            AdminService.getUsers(),
            AdminService.getCredentials()
        ]);

        const mfaEnabled = users.filter(u => u.mfa).length;
        const totalUsers = users.length;
        const mfaRate = totalUsers > 0 ? (mfaEnabled / totalUsers) * 100 : 0;

        const strengthDist = {
            Strong: users.filter(u => u.passwordStrength === 'Strong').length,
            Medium: users.filter(u => u.passwordStrength === 'Medium').length,
            Weak: users.filter(u => u.passwordStrength === 'Weak').length
        };

        const criticalAlerts = [];
        users.forEach(u => {
            if (u.passwordAge > 90) criticalAlerts.push({ user: u.name, issue: 'Password expired (90+ days)' });
            if (!u.mfa) criticalAlerts.push({ user: u.name, issue: 'MFA not enabled' });
        });

        return {
            mfaRate: Math.round(mfaRate),
            strengthDist,
            criticalAlerts,
            totalCredentials: credentials.length,
            exposedCredentials: credentials.filter(c => c.strength === 'Weak').length
        };
    },

    async getCredentials() {
        return AdminService._getData('gt_credentials', initialCredentials);
    },

    async addCredential(cred) {
        const credentials = await AdminService.getCredentials();
        const strength = AdminService.checkPasswordStrength(cred.password).label;
        const newCred = {
            ...cred,
            id: Date.now(),
            lastUpdated: new Date().toISOString().split('T')[0],
            rotationDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            strength
        };
        const newCredentials = [newCred, ...credentials];
        AdminService._saveData('gt_credentials', newCredentials);
        await AdminService.logAudit(`Credential Added: ${cred.service}`, 'Admin');
        return newCredentials;
    },

    async updateCredential(updatedCred) {
        const credentials = await AdminService.getCredentials();
        const strength = AdminService.checkPasswordStrength(updatedCred.password).label;
        const newCredentials = credentials.map(c => c.id === updatedCred.id ? { ...updatedCred, strength } : c);
        AdminService._saveData('gt_credentials', newCredentials);
        await AdminService.logAudit(`Credential Updated: ${updatedCred.service}`, 'Admin');
        return newCredentials;
    },

    async deleteCredential(id) {
        const credentials = await AdminService.getCredentials();
        const newCredentials = credentials.filter(c => c.id !== id);
        AdminService._saveData('gt_credentials', newCredentials);
        await AdminService.logAudit(`Credential Deleted: ID ${id}`, 'Admin');
        return newCredentials;
    },

    // --- Project Management Tasks ---
    async getProjectTasks(projectId) {
        const allTasks = await AdminService._getData('gt_project_tasks', initialProjectTasks);
        if (projectId) return allTasks.filter(t => t.projectId === parseInt(projectId));
        return allTasks;
    },

    async addProjectTask(task) {
        const allTasks = await AdminService.getProjectTasks();
        const newTask = { ...task, id: Date.now(), status: 'ToDo' };
        const newTasks = [...allTasks, newTask];
        AdminService._saveData('gt_project_tasks', newTasks);
        await AdminService.logAudit(`New Task Added to Project ${task.projectId}`, 'Project Manager');
        return newTasks;
    },

    async updateProjectTaskStatus(taskId, status) {
        const allTasks = await AdminService.getProjectTasks();
        const newTasks = allTasks.map(t => t.id === taskId ? { ...t, status } : t);
        AdminService._saveData('gt_project_tasks', newTasks);
        return newTasks;
    },

    // --- Password Vault ---
    async getStoredCredentials() {
        return AdminService._getData('gt_credentials', initialCredentials);
    },

    async addStoredCredential(credential) {
        const creds = await AdminService.getStoredCredentials();
        const newCred = { ...credential, id: Date.now(), lastUpdated: new Date().toISOString().split('T')[0] };
        const newCreds = [...creds, newCred];
        AdminService._saveData('gt_credentials', newCreds);
        await AdminService.logAudit(`Added Credential: ${credential.service}`, 'Admin');
        return newCreds;
    },

    async updateStoredCredential(updatedCred) {
        const creds = await AdminService.getStoredCredentials();
        const newCreds = creds.map(c => c.id === updatedCred.id ? { ...updatedCred, lastUpdated: new Date().toISOString().split('T')[0] } : c);
        AdminService._saveData('gt_credentials', newCreds);
        await AdminService.logAudit(`Updated Credential: ${updatedCred.service}`, 'Admin');
        return newCreds;
    },

    async deleteStoredCredential(id) {
        const creds = await AdminService.getStoredCredentials();
        const newCreds = creds.filter(c => c.id !== id);
        AdminService._saveData('gt_credentials', newCreds);
        await AdminService.logAudit(`Deleted Credential ID: ${id}`, 'Admin');
        return newCreds;
    },

    // --- Sales Portal Methods ---
    async getLeads() {
        return AdminService._getData('gt_leads', initialLeads);
    },

    async getDeals() {
        return AdminService._getData('gt_deals', initialDeals);
    },

    async getSalesActivities() {
        return AdminService._getData('gt_sales_activities', initialSalesActivities);
    },

    async getServiceCatalog() {
        return AdminService._getData('gt_service_catalog', initialServiceCatalog);
    },

    async getScopingTemplates() {
        return AdminService._getData('gt_scoping_templates', initialScopingTemplates);
    },

    async getBenchResources() {
        return AdminService._getData('gt_bench_resources', initialBenchResources);
    },

    async getRateCards() {
        return AdminService._getData('gt_rate_cards', initialRateCards);
    },

    async getLostDealAnalysis() {
        return AdminService._getData('gt_lost_analysis', initialLostDealAnalysis);
    },

    async getCaseStudies() {
        return AdminService._getData('gt_case_studies', initialCaseStudies);
    },

    async getPartnerStats() {
        return AdminService._getData('gt_partner_stats', initialPartnerStats);
    },

    async getMarketIntelligence() {
        return AdminService._getData('gt_market_intelligence', initialMarketIntelligence);
    },

    async syncCRM() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({ success: true, timestamp: new Date().toLocaleTimeString() });
            }, 1000);
        });
    },

    async ingestLeads(source) {
        const leads = await AdminService.getLeads();
        const newLead = {
            id: Date.now(),
            name: 'Imported Lead ' + Math.floor(Math.random() * 100),
            contact: 'Unknown',
            email: 'info@imported.com',
            stage: 'New',
            value: 5000,
            source: 'CSV Import',
            status: 'Open'
        };
        const newLeads = [newLead, ...leads];
        AdminService._saveData('gt_leads', newLeads);
        return 1;
    },

    async enrichLead(leadId) {
        const leads = await AdminService.getLeads();
        const lead = leads.find(l => l.id === leadId);
        if (lead) {
            const enriched = { ...lead, isEnriched: true, companySize: '100-500', location: 'San Francisco, CA' };
            const newLeads = leads.map(l => l.id === leadId ? enriched : l);
            AdminService._saveData('gt_leads', newLeads);
            return enriched;
        }
        return null;
    },

    async calculateLeadScore(lead) {
        let score = 0;
        if (lead.email) score += 20;
        if (lead.phone) score += 20;
        if (lead.value > 10000) score += 30;
        if (lead.stage !== 'New') score += 30;
        return Math.min(score, 100);
    },

    async generateProposal(dealId, proposalData = {}) {
        const deals = await AdminService.getDeals();
        const deal = deals.find(d => d.id === dealId);
        if (deal) {
            const updatedDeal = { ...deal, stage: 'Proposal' };
            await AdminService.updateDeal(updatedDeal);
            return { title: proposalData.title || `Proposal for ${deal.client}`, success: true };
        }
        return null;
    },

    async requestSignature(dealId) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({ success: true, status: 'Sent' });
            }, 1000);
        });
    },

    async generateInvoiceFromDeal(dealId, billData) {
        const deals = await AdminService.getDeals();
        const deal = deals.find(d => d.id === dealId);
        if (deal) {
            await AdminService.createInvoice({
                client: deal.client,
                amount: deal.amount,
                items: [{ desc: `Project: ${deal.name}`, rate: deal.amount, qty: 1 }],
                dueDate: billData.dueDate
            });
            return { success: true, invoice: { id: Date.now() } };
        }
        return { success: false };
    },

    async autoRouteLead(leadId) {
        return { success: true, assignedTo: 'John Doe', reason: 'Territory Match' };
    },

    async getLeadTimeline(leadId) {
        return [
            { id: 1, type: 'Email', summary: 'Intro email sent', date: '2 days ago', by: 'System' },
            { id: 2, type: 'Call', summary: 'Discovery call scheduled', date: 'Yesterday', by: 'Mike Manager' }
        ];
    },

    async initiateKickoff(dealId) {
        return { success: true, message: 'Kickoff email sent & Project created.' };
    },

    async addLead(lead) {
        const leads = await AdminService.getLeads();
        const newLead = { ...lead, id: Date.now(), status: 'Open' };
        const newLeads = [newLead, ...leads];
        AdminService._saveData('gt_leads', newLeads);
        return newLeads;
    },

    async updateLead(updatedLead) {
        const leads = await AdminService.getLeads();
        const newLeads = leads.map(l => l.id === updatedLead.id ? updatedLead : l);
        AdminService._saveData('gt_leads', newLeads);
        return newLeads;
    },

    async updateDeal(updatedDeal) {
        const deals = await AdminService.getDeals();
        const newDeals = deals.map(d => d.id === updatedDeal.id ? updatedDeal : d);
        AdminService._saveData('gt_deals', newDeals);
        return newDeals;
    },

    async sendEmail(to, template) {
        console.log(`Sending ${template} to ${to}`);
        return true;
    },

    async exportToERP(dealId) {
        console.log(`Exporting Deal ${dealId} to ERP...`);
        return true;
    },

    // --- CLIENT PORTAL METHODS ---
    async getClientDashboardData(clientName) {
        return {
            milestones: [
                { id: 1, title: 'Phase 1 Delivery', date: '2023-11-15', status: 'Completed' },
                { id: 2, title: 'UAT Sign-off', date: '2023-11-20', status: 'Upcoming' },
                { id: 3, title: 'Go-Live', date: '2023-12-01', status: 'Pending' }
            ],
            notifications: [
                { id: 1, text: 'New Invoice #INV-2024-001 Generated', time: '2 hours ago', type: 'info' },
                { id: 2, text: 'Pending Approval: SRS Document v2', time: '1 day ago', type: 'warning' }
            ],
            integrations: {
                jira: { connected: true },
                github: { connected: true },
                slack: { connected: false }
            }
        };
    },

    async getProjectBoard(clientName) {
        return {
            columns: {
                todo: { id: 'todo', title: 'To Do', items: [{ id: 't1', content: 'Review API Specs', tag: 'Documentation' }] },
                inProgress: { id: 'inProgress', title: 'In Progress', items: [{ id: 't2', content: 'Dashboard UI', tag: 'Frontend' }, { id: 't3', content: 'Auth Integration', tag: 'Backend' }] },
                qa: { id: 'qa', title: 'QA / Review', items: [{ id: 't4', content: 'Mobile Responsiveness', tag: 'Design' }] },
                done: { id: 'done', title: 'Done', items: [{ id: 't5', content: 'Project Setup', tag: 'DevOps' }] }
            }
        };
    },

    async getClientDocuments(clientName) {
        return [
            { id: 1, name: 'Service Agreement.pdf', type: 'Contract', size: '2.4 MB', access: 'Restricted' },
            { id: 2, name: 'Technical_Spec_v2.docx', type: 'SRS', size: '1.1 MB', access: 'Team' },
            { id: 3, name: 'Compliance_Report_Q3.pdf', type: 'Compliance', size: '3.5 MB', access: 'Restricted' }
        ];
    },

    async getClientAssets(clientName) {
        return [
            { id: 1, name: 'goldtech-app.com', type: 'Domain', value: 'Expires 2025', sensitivity: 'Low' },
            { id: 2, name: 'Supabase Production', type: 'Hosting', value: 'global', sensitivity: 'Medium' },
            { id: 3, name: 'Stripe API Key', type: 'Credential', value: 'sk_live_...', sensitivity: 'High' }
        ];
    },

    async getClientInvoices(clientName) {
        return [
            { id: 'INV-2024-001', date: '2023-10-25', dueDate: '2023-11-25', total: 15000, status: 'Pending' },
            { id: 'INV-2023-012', date: '2023-09-25', dueDate: '2023-10-25', total: 12500, status: 'Paid' }
        ];
    },

    async getClientAuditLog(clientName) {
        return [
            { id: 1, action: 'Document Downloaded: Compliance_Report_Q3.pdf', user: 'Admin User', ip: '192.168.1.5', time: '10 mins ago' },
            { id: 2, action: 'MFA Enabled', user: 'Admin User', ip: '192.168.1.5', time: '2 days ago' }
        ];
    },

    async createSupportTicket(ticket) {
        console.log('Support ticket created:', ticket);
        await AdminService.logAudit(`Support Ticket Created: ${ticket.subject}`, ticket.client);
        return true;
    },

    async toggleMFA(status) {
        console.log('MFA Toggled:', status);
        return true;
    },

    async updateIPWhitelist(ips) {
        console.log('Whitelisted IPs updated:', ips);
        return true;
    },

    async submitFeedback(feedback) {
        const feedbackLog = await AdminService._getData('gt_feedback', []);
        feedbackLog.push({ ...feedback, id: Date.now(), date: new Date().toISOString() });
        AdminService._saveData('gt_feedback', feedbackLog);
        await AdminService.logAudit(`Feedback Submitted: Score ${feedback.score}`, feedback.client);
        return true;
    },

    // --- R&D Portal Methods ---
    async getRDProjects() { return AdminService._getData('gt_rd_projects', initialRDProjects); },
    async getPatents() { return AdminService._getData('gt_patents', initialPatents); },
    async getResearchPapers() { return AdminService._getData('gt_research_papers', initialResearchPapers); },
    async getInnovationIdeas() { return AdminService._getData('gt_innovation_ideas', initialInnovationIdeas); },
    async getTechRadar() { return AdminService._getData('gt_tech_radar', initialTechRadar); },

    async submitIdea(idea) {
        const ideas = await AdminService.getInnovationIdeas();
        const newIdea = { ...idea, id: Date.now(), votes: 0, status: 'New' };
        ideas.push(newIdea);
        AdminService._saveData('gt_innovation_ideas', ideas);
        await AdminService.logAudit(`Innovation Idea Submitted: ${idea.title}`, 'Internal');
        return newIdea;
    },

    async voteIdea(ideaId) {
        const ideas = await AdminService.getInnovationIdeas();
        const idea = ideas.find(i => i.id === ideaId);
        if (idea) {
            idea.votes += 1;
            AdminService._saveData('gt_innovation_ideas', ideas);
            return true;
        }
        return false;
    }
};

export default AdminService;
