import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, User, Key, Eye, EyeOff, ShieldAlert, LogOut, ChevronRight, Activity, ShieldCheck, UserCheck } from 'lucide-react';
import AdminService from '../services/adminService';
import logo from '../assets/logo-transparent.png';

const GlassCard = ({ children, className = '', style = {} }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            padding: '40px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            color: '#fff',
            ...style
        }}
        className={className}
    >
        {children}
    </motion.div>
);

const PortalAuth = ({ children, portalName }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);

    // Versioned keys to force re-authentication after security updates
    const getStorageKey = (name) => `gt_portal_user_v2_${name}`;
    const getOldStorageKey = (name) => `gt_portal_user_${name}`;

    useEffect(() => {
        const checkSession = async () => {
            const storageKey = getStorageKey(portalName);
            const oldStorageKey = getOldStorageKey(portalName);

            // Check if old storage exists and clear it (migration to v2)
            if (localStorage.getItem(oldStorageKey) || sessionStorage.getItem(oldStorageKey)) {
                localStorage.removeItem(oldStorageKey);
                sessionStorage.removeItem(oldStorageKey);
            }

            // Check new storage types
            const persistentUser = localStorage.getItem(storageKey);
            const sessionUser = sessionStorage.getItem(storageKey);

            const savedUser = persistentUser || sessionUser;

            if (savedUser) {
                const parsedUser = JSON.parse(savedUser);
                setUser(parsedUser);
                setIsLoggedIn(true);
            }
            setLoading(false);
        };
        checkSession();
    }, [portalName]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoginLoading(true);

        try {
            const res = await AdminService.authenticate(identifier, password);
            if (res.success) {
                const authenticatedUser = res.user;

                // Check if user has access to THIS specific portal
                const hasAccess = authenticatedUser.role === 'Admin' || (authenticatedUser.access && authenticatedUser.access.includes(portalName));

                if (hasAccess) {
                    const storageKey = getStorageKey(portalName);
                    const storage = rememberMe ? localStorage : sessionStorage;
                    storage.setItem(storageKey, JSON.stringify(authenticatedUser));

                    setUser(authenticatedUser);
                    setIsLoggedIn(true);
                } else {
                    setError(`Access Denied: You do not have permission to access the ${portalName}.`);
                }
            } else {
                setError(res.message || 'Invalid credentials');
            }
        } catch (err) {
            setError('An error occurred during authentication');
            console.error(err);
        } finally {
            setLoginLoading(false);
        }
    };

    const handleLogout = () => {
        const storageKey = getStorageKey(portalName);
        localStorage.removeItem(storageKey);
        sessionStorage.removeItem(storageKey);
        setIsLoggedIn(false);
        setUser(null);
        setIdentifier('');
        setPassword('');
    };

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    style={{ width: '40px', height: '40px', border: '3px solid rgba(212, 175, 55, 0.3)', borderTopColor: '#D4AF37', borderRadius: '50%' }}
                />
            </div>
        );
    }

    if (!isLoggedIn) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'radial-gradient(circle at top right, #1e293b 0%, #0f172a 100%)',
                fontFamily: "'Inter', sans-serif",
                padding: '20px'
            }}>
                <div style={{ position: 'absolute', top: '40px', left: '40px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <img src={logo} alt="GoldTech" style={{ width: '50px', height: 'auto' }} />
                    <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 'bold' }}>GOLDTECH <span style={{ color: '#D4AF37' }}>PORTALS</span></h2>
                </div>

                <div style={{ width: '100%', maxWidth: '450px' }}>
                    <GlassCard>
                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                background: 'rgba(212, 175, 55, 0.1)',
                                borderRadius: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 16px'
                            }}>
                                <Lock size={32} color="#D4AF37" />
                            </div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '8px' }}>Portal Authentication</h2>
                            <p style={{ color: '#94a3b8' }}>Please sign in to access the <span style={{ color: '#D4AF37', fontWeight: '600' }}>{portalName}</span></p>
                        </div>

                        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '500' }}>Email or Username</label>
                                <div style={{ position: 'relative' }}>
                                    <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                                    <input
                                        type="text"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        placeholder="Enter your credentials"
                                        style={{
                                            width: '100%',
                                            padding: '14px 14px 14px 48px',
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: '12px',
                                            color: '#fff',
                                            fontSize: '1rem',
                                            outline: 'none',
                                            transition: 'border-color 0.2s'
                                        }}
                                        required
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '500' }}>Password</label>
                                <div style={{ position: 'relative' }}>
                                    <Key size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        style={{
                                            width: '100%',
                                            padding: '14px 48px 14px 48px',
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: '12px',
                                            color: '#fff',
                                            fontSize: '1rem',
                                            outline: 'none'
                                        }}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#94a3b8', fontSize: '0.85rem' }}>
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        style={{ accentColor: '#D4AF37', cursor: 'pointer' }}
                                    />
                                    Keep me signed in
                                </label>
                            </div>

                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        style={{
                                            padding: '12px',
                                            background: 'rgba(239, 68, 68, 0.1)',
                                            border: '1px solid rgba(239, 68, 68, 0.2)',
                                            borderRadius: '8px',
                                            color: '#fca5a5',
                                            fontSize: '0.85rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px'
                                        }}
                                    >
                                        <ShieldAlert size={16} />
                                        {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loginLoading}
                                style={{
                                    width: '100%',
                                    padding: '14px',
                                    background: 'linear-gradient(135deg, #D4AF37 0%, #F2D06B 100%)',
                                    color: '#0f172a',
                                    fontWeight: '700',
                                    fontSize: '1rem',
                                    border: 'none',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    boxShadow: '0 10px 15px -3px rgba(212, 175, 55, 0.3)'
                                }}
                            >
                                {loginLoading ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                        style={{ width: '20px', height: '20px', border: '2px solid rgba(15, 23, 42, 0.3)', borderTopColor: '#0f172a', borderRadius: '50%' }}
                                    />
                                ) : (
                                    <>Sign In to Portal <ChevronRight size={18} /></>
                                )}
                            </motion.button>
                        </form>
                    </GlassCard>
                </div>

                <div style={{ position: 'absolute', bottom: '40px', display: 'flex', gap: '30px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.8rem' }}>
                        <Activity size={14} /> System Online
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.8rem' }}>
                        <ShieldCheck size={14} /> End-to-End Encryption
                    </div>
                </div>
            </div>
        );
    }

    // Wrap children with specific portal context or just pass user as prop if needed
    // For now, we'll clone children and inject logout and user info if they want it
    return (
        <div style={{ position: 'relative' }}>
            {/* Minimal Logout Bar (Optional - based on if child has its own logout) */}
            <div style={{
                position: 'fixed',
                top: 0,
                right: 0,
                zIndex: 999,
                padding: '10px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '15px'
            }}>
                <div style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    backdropFilter: 'blur(8px)',
                    padding: '6px 16px',
                    borderRadius: '30px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    color: '#fff',
                    fontSize: '0.8rem'
                }}>
                    <UserCheck size={14} color="#D4AF37" />
                    <span>Logged in as <strong>{user.name}</strong></span>
                    <button
                        onClick={handleLogout}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            marginLeft: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}
                    >
                        <LogOut size={14} /> Logout
                    </button>
                </div>
            </div>
            {React.cloneElement(children, { currentUser: user })}
        </div>
    );
};

export default PortalAuth;
