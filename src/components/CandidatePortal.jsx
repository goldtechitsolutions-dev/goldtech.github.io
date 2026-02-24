import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, ArrowRight, FileText, Calendar, CheckCircle, Clock, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { countryCodes } from '../utils/countryData';
import { useRef, useEffect } from 'react';

const CandidatePortal = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [authMode, setAuthMode] = useState('signup'); // 'login' or 'signup'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userProfile, setUserProfile] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [loginError, setLoginError] = useState("");
    const dropdownRef = useRef(null);
    const [formData, setFormData] = useState({
        name: '',
        countryCode: '+91',
        phone: '',
        experience: '',
        jobLookingFor: '',
        linkedin: '',
        portfolio: ''
    });

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const filteredCountries = countryCodes.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.code.includes(searchTerm)
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError("");
        try {
            const module = await import('../services/adminService');
            const AdminService = module.default;
            const candidates = await AdminService.getCandidates();

            const candidate = candidates.find(c => c.email.toLowerCase() === email.toLowerCase());

            if (candidate) {
                setUserProfile(candidate);
                setIsLoggedIn(true);
            } else {
                setLoginError("Candidate profile not found. Please sign up.");
            }
        } catch (error) {
            console.error("Login error:", error);
            setLoginError("Technical error occurred. Please try again.");
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        // Mobile Validation
        if (!/^\d+$/.test(formData.phone)) {
            setPhoneError("Numbers only");
            return;
        }
        if (formData.phone.length < 7 || formData.phone.length > 15) {
            setPhoneError("7-15 digits required");
            return;
        }
        setPhoneError("");

        try {
            const module = await import('../services/adminService');
            const AdminService = module.default;

            const resumeInput = document.getElementById('portal-resume');
            const resumeFile = resumeInput?.files[0];

            const signupFormData = new FormData();
            signupFormData.append('name', formData.name);
            signupFormData.append('email', email);
            signupFormData.append('phone', `${formData.countryCode}${formData.phone}`);
            signupFormData.append('experience', formData.experience);
            signupFormData.append('role', formData.jobLookingFor);
            signupFormData.append('linkedin', formData.linkedin);
            signupFormData.append('portfolio', formData.portfolio);
            signupFormData.append('source', 'Candidate Portal');

            if (resumeFile) {
                if (resumeFile.size > 2 * 1024 * 1024) {
                    alert("Resume file too large. Please upload a file smaller than 2MB.");
                    return;
                }
                signupFormData.append('resume', resumeFile);
            }

            const newCandidate = await AdminService.addCandidate(signupFormData);

            setUserProfile(newCandidate);
            setIsLoggedIn(true);
        } catch (error) {
            console.error("Signup error:", error);
        }
    };

    if (!isLoggedIn) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#0f172a',
                fontFamily: "'Outfit', sans-serif",
                padding: '40px 20px'
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        padding: '40px',
                        borderRadius: '20px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        width: '100%',
                        maxWidth: authMode === 'signup' ? '600px' : '400px',
                        color: '#fff'
                    }}
                >
                    <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>{authMode === 'signup' ? 'Create Your Profile' : 'Welcome Back'}</h2>
                    <p style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '30px' }}>
                        {authMode === 'signup' ? 'Join GoldTech and track your career journey' : 'Access your profile to track applications'}
                    </p>

                    <form onSubmit={authMode === 'signup' ? handleSignup : handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {authMode === 'signup' && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Full Name *</label>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        style={{ width: '100%', padding: '12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Phone Number *</label>
                                    <div style={{ display: 'flex', gap: '10px', position: 'relative' }}>
                                        <div ref={dropdownRef} style={{ width: '100px', flexShrink: 0, position: 'relative' }}>
                                            <div
                                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                                style={{
                                                    padding: '12px 10px',
                                                    borderRadius: '8px',
                                                    background: 'rgba(255, 255, 255, 0.05)',
                                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    height: '100%',
                                                    gap: '8px',
                                                    cursor: 'pointer',
                                                    justifyContent: 'space-between'
                                                }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <img
                                                        src={`https://flagcdn.com/w20/${countryCodes.find(c => c.code === formData.countryCode)?.iso || 'in'}.png`}
                                                        width="20"
                                                        alt="flag"
                                                        style={{ borderRadius: '2px' }}
                                                    />
                                                    <span style={{ fontSize: '0.9rem', color: '#fff' }}>{formData.countryCode}</span>
                                                </div>
                                                <ChevronDown size={14} color="#94a3b8" style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease' }} />
                                            </div>

                                            {isDropdownOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    style={{
                                                        position: 'absolute',
                                                        top: 'calc(100% + 5px)',
                                                        left: 0,
                                                        width: '250px',
                                                        background: '#1e293b',
                                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                                        borderRadius: '12px',
                                                        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                                                        zIndex: 1000,
                                                        maxHeight: '250px',
                                                        overflow: 'hidden',
                                                        display: 'flex',
                                                        flexDirection: 'column'
                                                    }}
                                                >
                                                    <div style={{ padding: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                                        <input
                                                            type="text"
                                                            placeholder="Search country..."
                                                            value={searchTerm}
                                                            onChange={(e) => setSearchTerm(e.target.value)}
                                                            autoFocus
                                                            style={{
                                                                width: '100%',
                                                                padding: '8px 12px',
                                                                borderRadius: '6px',
                                                                background: 'rgba(255, 255, 255, 0.05)',
                                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                                color: '#fff',
                                                                fontSize: '0.85rem',
                                                                outline: 'none'
                                                            }}
                                                        />
                                                    </div>
                                                    <div style={{ flex: 1, overflowY: 'auto', padding: '6px' }}>
                                                        {filteredCountries.length > 0 ? (
                                                            filteredCountries.map(c => (
                                                                <div
                                                                    key={`${c.iso}-${c.code}`}
                                                                    onClick={() => {
                                                                        setFormData({ ...formData, countryCode: c.code });
                                                                        setIsDropdownOpen(false);
                                                                        setSearchTerm("");
                                                                    }}
                                                                    style={{
                                                                        padding: '8px 12px',
                                                                        borderRadius: '8px',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: '10px',
                                                                        cursor: 'pointer',
                                                                        background: formData.countryCode === c.code ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                                                                        transition: 'background 0.2s'
                                                                    }}
                                                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                                                                    onMouseLeave={(e) => e.currentTarget.style.background = formData.countryCode === c.code ? 'rgba(255, 255, 255, 0.1)' : 'transparent'}
                                                                >
                                                                    <img
                                                                        src={`https://flagcdn.com/w20/${c.iso}.png`}
                                                                        width="20"
                                                                        alt={c.name}
                                                                        style={{ borderRadius: '2px' }}
                                                                    />
                                                                    <span style={{ fontSize: '0.85rem', color: '#fff' }}>{c.name} ({c.code})</span>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div style={{ color: '#64748b', textAlign: 'center', padding: '20px', fontSize: '0.85rem' }}>No countries found</div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>
                                        <div style={{ flex: 1, position: 'relative' }}>
                                            <input
                                                type="tel"
                                                placeholder="00000 00000"
                                                value={formData.phone}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, phone: e.target.value });
                                                    setPhoneError("");
                                                }}
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    background: 'rgba(255, 255, 255, 0.05)',
                                                    border: phoneError ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)',
                                                    borderRadius: '8px',
                                                    color: '#fff',
                                                    outline: 'none'
                                                }}
                                                required
                                            />
                                            {phoneError && (
                                                <motion.span
                                                    initial={{ opacity: 0, y: -5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    style={{
                                                        position: 'absolute',
                                                        left: '0',
                                                        bottom: '-18px',
                                                        color: '#ef4444',
                                                        fontSize: '0.7rem',
                                                        fontWeight: '500'
                                                    }}
                                                >
                                                    {phoneError}
                                                </motion.span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {authMode === 'signup' && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Years of Experience *</label>
                                    <input
                                        type="number"
                                        placeholder="e.g. 5"
                                        value={formData.experience}
                                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                        style={{ width: '100%', padding: '12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Job Looking For *</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Frontend Developer"
                                        value={formData.jobLookingFor}
                                        onChange={(e) => setFormData({ ...formData, jobLookingFor: e.target.value })}
                                        style={{ width: '100%', padding: '12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Email Address *</label>
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    style={{ width: '100%', padding: '12px 12px 12px 40px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                                    required
                                />
                            </div>
                        </div>

                        {authMode === 'signup' && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>LinkedIn Profile</label>
                                    <input
                                        type="text"
                                        placeholder="linkedin.com/in/..."
                                        value={formData.linkedin}
                                        onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                        style={{ width: '100%', padding: '12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>GitHub/Portfolio</label>
                                    <input
                                        type="text"
                                        placeholder="github.com/..."
                                        value={formData.portfolio}
                                        onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                                        style={{ width: '100%', padding: '12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                                    />
                                </div>
                            </div>
                        )}

                        {loginError && (
                            <div style={{ color: '#ef4444', fontSize: '0.9rem', textAlign: 'center', background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '8px' }}>
                                {loginError}
                            </div>
                        )}

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>{authMode === 'signup' ? 'Create Password *' : 'Password *'}</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    style={{ width: '100%', padding: '12px 12px 12px 40px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                                    required
                                />
                            </div>
                        </div>

                        {authMode === 'signup' && (
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Upload Resume *</label>
                                <div style={{ border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '8px', padding: '20px', textAlign: 'center', color: '#94a3b8', cursor: 'pointer' }} onClick={() => document.getElementById('portal-resume').click()}>
                                    <input type="file" id="portal-resume" style={{ display: 'none' }} required onChange={(e) => {
                                        if (e.target.files[0]) {
                                            document.getElementById('portal-resume-label').textContent = e.target.files[0].name;
                                        }
                                    }} />
                                    <span id="portal-resume-label">Click to upload (PDF/Doc)</span>
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            style={{
                                background: 'linear-gradient(135deg, #FFD700 0%, #D4AF37 100%)',
                                color: '#000',
                                padding: '15px',
                                borderRadius: '8px',
                                border: 'none',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                marginTop: '10px',
                                fontSize: '1rem'
                            }}
                        >
                            {authMode === 'signup' ? 'Create Profile' : 'Sign In'}
                        </button>
                    </form>

                    <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem', color: '#94a3b8' }}>
                        {authMode === 'signup' ? (
                            <>Already have a profile? <span onClick={() => setAuthMode('login')} style={{ color: '#D4AF37', cursor: 'pointer' }}>Sign In</span></>
                        ) : (
                            <>Don't have a profile? <span onClick={() => setAuthMode('signup')} style={{ color: '#D4AF37', cursor: 'pointer' }}>Create One</span></>
                        )}
                    </div>

                    <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem' }}>
                        <Link to="/career" style={{ color: '#94a3b8', textDecoration: 'none' }}>← Back to Careers</Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#0f172a', fontFamily: "'Outfit', sans-serif", color: '#fff', padding: '40px' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', margin: '0 0 10px 0' }}>Welcome back, {userProfile?.name?.split(' ')[0] || 'Alice'}!</h1>
                        <p style={{ color: '#94a3b8', margin: 0 }}>{userProfile?.role || 'Senior Frontend Developer'} Application</p>
                    </div>
                    <button onClick={() => { setIsLoggedIn(false); setUserProfile(null); }} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>Sign Out</button>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>

                    {/* Main Status Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                backdropFilter: 'blur(10px)',
                                padding: '30px',
                                borderRadius: '20px',
                                border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}
                        >
                            <h3 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Clock color="#D4AF37" /> Application Status
                            </h3>

                            {/* Progress Bar */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', marginBottom: '10px' }}>
                                {/* Line */}
                                <div style={{ position: 'absolute', top: '15px', left: '0', right: '0', height: '2px', background: 'rgba(255,255,255,0.1)', zIndex: 0 }}></div>
                                <div style={{ position: 'absolute', top: '15px', left: '0', width: '66%', height: '2px', background: '#D4AF37', zIndex: 0 }}></div>

                                {['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'].filter(s => s !== 'Rejected' || userProfile?.stage === 'Rejected').map((step, i) => {
                                    const stages = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired'];
                                    const currentStageIndex = stages.indexOf(userProfile?.stage || 'Applied');
                                    const isCompleted = i <= (currentStageIndex === -1 ? 0 : currentStageIndex);

                                    return (
                                        <div key={step} style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                                            <div style={{
                                                width: '32px', height: '32px', borderRadius: '50%',
                                                background: step === 'Rejected' ? '#ef4444' : (isCompleted ? '#D4AF37' : '#1e293b'),
                                                border: isCompleted ? 'none' : '2px solid rgba(255,255,255,0.2)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                margin: '0 auto 10px auto',
                                                color: isCompleted ? '#000' : '#fff',
                                                fontWeight: 'bold'
                                            }}>
                                                {isCompleted ? <CheckCircle size={16} /> : i + 1}
                                            </div>
                                            <span style={{ fontSize: '0.85rem', color: isCompleted ? '#fff' : '#64748b' }}>{step}</span>
                                        </div>
                                    );
                                })}
                            </div>
                            <div style={{ marginTop: '30px', padding: '15px', background: userProfile?.stage === 'Rejected' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(212, 175, 55, 0.1)', borderRadius: '10px', border: userProfile?.stage === 'Rejected' ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(212, 175, 55, 0.2)' }}>
                                <p style={{ margin: 0, color: userProfile?.stage === 'Rejected' ? '#ef4444' : '#D4AF37' }}>
                                    <strong>Current Stage: {userProfile?.stage || 'Applied'}</strong> <br />
                                    {userProfile?.stage === 'Applied' && "Your application has been received and is currently under review by our talent acquisition team."}
                                    {userProfile?.stage === 'Screening' && "Your profile has been vetted and is now in the initial screening phase."}
                                    {userProfile?.stage === 'Interview' && "Great news! You have passed the screening round. Our team is scheduling your technical interview."}
                                    {userProfile?.stage === 'Offer' && "Congratulations! We are impressed with your profile and are currently preparing an offer for you."}
                                    {userProfile?.stage === 'Hired' && "Authorization complete. Welcome to the GoldTech intelligence network."}
                                    {userProfile?.stage === 'Rejected' && "Thank you for your interest. We have decided to move forward with other candidates at this time."}
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                backdropFilter: 'blur(10px)',
                                padding: '30px',
                                borderRadius: '20px',
                                border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}
                        >
                            <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <FileText color="#D4AF37" /> Documents & Files
                            </h3>
                            <div style={{ display: 'grid', gap: '15px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <div style={{ width: '40px', height: '40px', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <h4 style={{ margin: 0 }}>{userProfile?.resume || 'Resume.pdf'}</h4>
                                            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Uploaded {userProfile?.appliedDate || 'Nov 1, 2023'}</span>
                                        </div>
                                    </div>
                                    {userProfile?.resumeFile && (
                                        <button
                                            onClick={() => {
                                                const link = document.createElement('a');
                                                link.href = userProfile.resumeFile;
                                                link.download = userProfile.resume;
                                                document.body.appendChild(link);
                                                link.click();
                                                document.body.removeChild(link);
                                            }}
                                            style={{ background: 'transparent', border: 'none', color: '#38bdf8', cursor: 'pointer' }}
                                        >
                                            View
                                        </button>
                                    )}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <div style={{ width: '40px', height: '40px', background: 'rgba(212, 175, 55, 0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4AF37' }}>
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <h4 style={{ margin: 0 }}>NDA_GoldTech.pdf</h4>
                                            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Pending Signature</span>
                                        </div>
                                    </div>
                                    <button style={{ background: '#D4AF37', border: 'none', color: '#000', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }}>Sign Now</button>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                backdropFilter: 'blur(10px)',
                                padding: '25px',
                                borderRadius: '20px',
                                border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}
                        >
                            <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Calendar color="#D4AF37" /> Upcoming Events
                            </h3>
                            <div style={{ padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', marginBottom: '15px' }}>
                                <div style={{ fontSize: '0.85rem', color: '#D4AF37', fontWeight: 'bold', marginBottom: '5px' }}>TOMORROW • 2:00 PM</div>
                                <h4 style={{ margin: '0 0 5px 0' }}>Technical Interview</h4>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>with Sarah Jenkins (CTO)</p>
                                <button style={{ marginTop: '10px', width: '100%', padding: '8px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' }}>Join Google Meet</button>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            style={{
                                background: 'rgba(34, 197, 94, 0.1)',
                                backdropFilter: 'blur(10px)',
                                padding: '25px',
                                borderRadius: '20px',
                                border: '1px solid rgba(34, 197, 94, 0.2)'
                            }}
                        >
                            <h3 style={{ marginBottom: '10px', color: '#86efac' }}>Need Help?</h3>
                            <p style={{ margin: '0 0 15px 0', fontSize: '0.9rem', color: '#cbd5e1' }}>Contact your recruiter if you have any questions.</p>
                            <a href="mailto:careers@goldtech.com" style={{ display: 'block', textAlign: 'center', background: '#22c55e', color: '#fff', padding: '10px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>Email Recruiter</a>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CandidatePortal;
