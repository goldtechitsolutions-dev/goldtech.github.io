import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, MessageSquare, MapPin, Phone, Send, Globe, Star, ChevronDown } from 'lucide-react';
import contactBg from '../assets/im2.png';
import AdminService from '../services/adminService';
import { countryCodes } from '../utils/countryData';

const ContactForm = () => {
    const [status, setStatus] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState({ code: '+91', country: 'IN', iso: 'in' });
    const [searchTerm, setSearchTerm] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const dropdownRef = useRef(null);

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

    const submitForm = async (ev) => {
        ev.preventDefault();

        const form = ev.target;
        const data = new FormData(form);
        const phone = data.get('phone');

        // Validation
        if (!/^\d+$/.test(phone)) {
            setPhoneError("Numbers only please");
            return;
        }
        if (phone.length < 7 || phone.length > 15) {
            setPhoneError("Phone must be 7-15 digits");
            return;
        }
        setPhoneError("");

        setStatus("SUBMITTING");
        const fullPhone = `${data.get('countryCode')} ${phone}`;

        try {
            // Save as Lead in AdminService
            const newLead = {
                name: data.get('name'),
                email: data.get('email'),
                phone: fullPhone,
                message: data.get('message'),
                contact: 'Website Visitor',
                source: 'Website Contact Form',
                value: 0,
                stage: 'New'
            };

            await AdminService.addLead(newLead);

            // Also save as Query for Admin/Sales Portals
            const newQuery = {
                name: data.get('name'),
                email: data.get('email'),
                phone: fullPhone,
                message: data.get('message'),
                role: 'Visitor'
            };
            await AdminService.addQuery(newQuery);

            // Continue with original Formspree submission (optional, keeping for backward compat)
            const response = await fetch(form.action, {
                method: form.method,
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok || form.action.includes('YOUR_FORM_ID')) {
                form.reset();
                setStatus("SUCCESS");
                setTimeout(() => setStatus(""), 5000);
            } else {
                setStatus("ERROR");
            }
        } catch (error) {
            console.error("Submission error:", error);
            setStatus("ERROR");
        }
    };

    return (
        <section id="contact" style={{
            position: 'relative',
            backgroundImage: `url(${contactBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            padding: '100px 0',
            minHeight: '800px',
            display: 'flex',
            alignItems: 'center'
        }}>
            {/* Dark Premium Overlay */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, rgba(0, 16, 33, 0.6) 0%, rgba(0, 31, 63, 0.4) 100%)',
                zIndex: 0
            }} />

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                    gap: '50px',
                    alignItems: 'start'
                }}>
                    {/* Left Side: Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <div style={{ marginBottom: '40px' }}>
                            <span style={{
                                color: 'var(--color-gold-primary)',
                                textTransform: 'uppercase',
                                letterSpacing: '2px',
                                fontWeight: '700',
                                fontSize: '0.9rem',
                                display: 'block',
                                marginBottom: '10px'
                            }}>
                                Connect With Us
                            </span>
                            <h2 style={{
                                color: '#fff',
                                fontSize: '3rem',
                                fontWeight: '800',
                                marginBottom: '20px',
                                lineHeight: '1.2'
                            }}>
                                Let's Build Your <span style={{ color: 'var(--color-gold-primary)' }}>Digital Future</span>
                            </h2>
                            <p style={{
                                color: '#cbd5e1',
                                fontSize: '1.1rem',
                                lineHeight: '1.6',
                                marginBottom: '30px'
                            }}>
                                We're ready to partner with you to transform your vision into reality. Reach out to our experts today.
                            </p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                            {[
                                { icon: Mail, label: 'Email Us', text: 'goldtechitsolutions@gmail.com' },
                                { icon: Phone, label: 'Call Us', text: '+91 9640786029' },
                                { icon: Globe, label: 'Global Presence', text: 'Serving Clients Worldwide' }
                            ].map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <div style={{
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '12px',
                                        background: 'rgba(191, 149, 63, 0.1)',
                                        border: '1px solid rgba(191, 149, 63, 0.3)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--color-gold-primary)'
                                    }}>
                                        <item.icon size={22} />
                                    </div>
                                    <div>
                                        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>{item.label}</div>
                                        <div style={{ color: '#fff', fontWeight: '600', fontSize: '1.05rem' }}>{item.text}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Side: Glassmorphic Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(15px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '24px',
                            padding: '40px',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                        }}
                    >
                        <form
                            onSubmit={submitForm}
                            action="https://formspree.io/f/YOUR_FORM_ID"
                            method="POST"
                            style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}
                        >
                            <div style={{ position: 'relative' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#e2e8f0', fontWeight: '500' }}>
                                    <User size={16} color="var(--color-gold-primary)" /> Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Type here..."
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '14px 18px',
                                        borderRadius: '12px',
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        color: '#fff',
                                        outline: 'none',
                                        fontSize: '1rem',
                                        transition: 'all 0.3s ease'
                                    }}
                                    className="premium-input"
                                />
                            </div>

                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#e2e8f0', fontWeight: '500' }}>
                                    <Mail size={16} color="var(--color-gold-primary)" /> Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Type here..."
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '14px 18px',
                                        borderRadius: '12px',
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        color: '#fff',
                                        outline: 'none',
                                        fontSize: '1rem',
                                        transition: 'all 0.3s ease'
                                    }}
                                    className="premium-input"
                                />
                            </div>

                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#e2e8f0', fontWeight: '500' }}>
                                    <Phone size={16} color="var(--color-gold-primary)" /> Mobile No:
                                </label>
                                <div style={{ display: 'flex', gap: '10px', position: 'relative' }}>
                                    <div ref={dropdownRef} style={{ width: '100px', position: 'relative' }}>
                                        <div
                                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                            style={{
                                                padding: '14px 10px',
                                                borderRadius: '12px',
                                                background: 'rgba(255, 255, 255, 0.03)',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                color: '#fff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                cursor: 'pointer',
                                                height: '100%',
                                                justifyContent: 'space-between'
                                            }}
                                            className="premium-input"
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <img
                                                    src={`https://flagcdn.com/w20/${selectedCountry.iso}.png`}
                                                    width="20"
                                                    alt={selectedCountry.country}
                                                    style={{ borderRadius: '2px' }}
                                                />
                                                <span style={{ fontSize: '0.9rem' }}>{selectedCountry.code}</span>
                                            </div>
                                            <ChevronDown size={14} color="var(--color-gold-primary)" style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease' }} />
                                        </div>

                                        <input type="hidden" name="countryCode" value={selectedCountry.code} />

                                        {isDropdownOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                style={{
                                                    position: 'absolute',
                                                    bottom: 'calc(100% + 5px)',
                                                    left: 0,
                                                    width: '220px',
                                                    background: '#001f3f',
                                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                                    borderRadius: '12px',
                                                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                                                    zIndex: 100,
                                                    maxHeight: '300px',
                                                    overflow: 'hidden',
                                                    display: 'flex',
                                                    flexDirection: 'column'
                                                }}
                                            >
                                                <div style={{ padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
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
                                                            background: 'rgba(255,255,255,0.05)',
                                                            border: '1px solid rgba(255,255,255,0.1)',
                                                            color: '#fff',
                                                            fontSize: '0.85rem',
                                                            outline: 'none'
                                                        }}
                                                    />
                                                </div>
                                                <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
                                                    {filteredCountries.length > 0 ? (
                                                        filteredCountries.map(c => (
                                                            <div
                                                                key={`${c.iso}-${c.code}`}
                                                                onClick={() => {
                                                                    setSelectedCountry(c);
                                                                    setIsDropdownOpen(false);
                                                                    setSearchTerm("");
                                                                }}
                                                                style={{
                                                                    padding: '10px',
                                                                    borderRadius: '8px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '10px',
                                                                    cursor: 'pointer',
                                                                    transition: 'background 0.2s',
                                                                    background: selectedCountry.code === c.code && selectedCountry.iso === c.iso ? 'rgba(191, 149, 63, 0.1)' : 'transparent'
                                                                }}
                                                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                                                                onMouseLeave={(e) => e.currentTarget.style.background = selectedCountry.code === c.code && selectedCountry.iso === c.iso ? 'rgba(191, 149, 63, 0.1)' : 'transparent'}
                                                            >
                                                                <img
                                                                    src={`https://flagcdn.com/w20/${c.iso}.png`}
                                                                    width="20"
                                                                    alt={c.country}
                                                                    style={{ borderRadius: '2px', flexShrink: 0 }}
                                                                />
                                                                <span style={{ color: '#fff', fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                                    {c.name} ({c.code})
                                                                </span>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '10px', fontSize: '0.85rem' }}>No countries found</div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                    <div style={{ flex: 1, position: 'relative' }}>
                                        <input
                                            type="tel"
                                            name="phone"
                                            placeholder="Type here..."
                                            required
                                            onChange={() => setPhoneError("")}
                                            style={{
                                                width: '100%',
                                                padding: '14px 18px',
                                                borderRadius: '12px',
                                                background: 'rgba(255, 255, 255, 0.03)',
                                                border: phoneError ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)',
                                                color: '#fff',
                                                outline: 'none',
                                                fontSize: '1rem',
                                                transition: 'all 0.3s ease'
                                            }}
                                            className="premium-input"
                                        />
                                        {phoneError && (
                                            <motion.span
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                style={{
                                                    position: 'absolute',
                                                    left: '0',
                                                    bottom: '-20px',
                                                    color: '#ef4444',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '500'
                                                }}
                                            >
                                                {phoneError}
                                            </motion.span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#e2e8f0', fontWeight: '500' }}>
                                    <MessageSquare size={16} color="var(--color-gold-primary)" /> Your Message
                                </label>
                                <textarea
                                    name="message"
                                    rows="4"
                                    placeholder="Type here..."
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '14px 18px',
                                        borderRadius: '12px',
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        color: '#fff',
                                        outline: 'none',
                                        fontSize: '1rem',
                                        resize: 'none',
                                        transition: 'all 0.3s ease'
                                    }}
                                    className="premium-input"
                                ></textarea>
                            </div>

                            {status === "SUCCESS" ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    style={{
                                        padding: '15px',
                                        borderRadius: '12px',
                                        background: 'rgba(34, 197, 94, 0.1)',
                                        border: '1px solid rgba(34, 197, 94, 0.3)',
                                        color: '#4ade80',
                                        textAlign: 'center',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '10px'
                                    }}
                                >
                                    <Star size={20} /> Success! We'll contact you shortly.
                                </motion.div>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={status === "SUBMITTING"}
                                    style={{
                                        width: '100%',
                                        padding: '16px',
                                        borderRadius: '12px',
                                        background: 'linear-gradient(to right, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c)',
                                        color: '#001f3f',
                                        fontWeight: '700',
                                        fontSize: '1.1rem',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '10px',
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 10px 20px -5px rgba(191, 149, 63, 0.4)'
                                    }}
                                    className="premium-btn"
                                >
                                    {status === "SUBMITTING" ? "SENDING..." : (
                                        <>SEND MESSAGE <Send size={18} /></>
                                    )}
                                </button>
                            )}
                            {status === "ERROR" && (
                                <p style={{ color: '#ef4444', textAlign: 'center', fontSize: '0.9rem' }}>
                                    Unable to send. Please try again or email us directly.
                                </p>
                            )}
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ContactForm;
