import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import modernOffice from '../assets/modern-office.png';
import AdminService from '../services/adminService';
import { countryCodes } from '../utils/countryData';

const BookingModal = () => {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        countryCode: '+91',
        mobile: '',
        email: '',
        topic: '',
        date: '',
        timeHour: '10',
        timeMinute: '00',
        timeAmPm: 'AM'
    });
    const [submitted, setSubmitted] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const dropdownRef = useRef(null);

    const filteredCountries = countryCodes.filter(c =>
        (c.name && c.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (c.code && c.code.includes(searchTerm))
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

    const services = [
        "Business Transformation",
        "Software Security",
        "Cloud Migration",
        "Custom App Development",
        "IT Consulting",
        "Data Analytics",
        "AI & Machine Learning"
    ];



    const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
    const minutes = ['00', '15', '30', '45'];

    const generateMeetingLink = () => {
        const characters = 'abcdefghijklmnopqrstuvwxyz';
        const generateSegment = (length) => {
            let result = '';
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return result;
        };
        return `https://meet.google.com/${generateSegment(3)}-${generateSegment(4)}-${generateSegment(3)}`;
    };

    const [isBooking, setIsBooking] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation for mobile
        if (!/^\d+$/.test(formData.mobile)) {
            setPhoneError("Numbers only please");
            return;
        }
        if (formData.mobile.length < 7 || formData.mobile.length > 15) {
            setPhoneError("Phone must be 7-15 digits");
            return;
        }
        setPhoneError("");

        try {
            setIsBooking(true);
            const formattedTime = `${formData.timeHour}:${formData.timeMinute} ${formData.timeAmPm}`;

            // Validate Date and Time
            const selectedDateTime = new Date(`${formData.date} ${formattedTime}`);
            const now = new Date();

            if (selectedDateTime < now) {
                alert("Please select a future date and time for your consultation.");
                setIsBooking(false);
                return;
            }

            const meetingLink = generateMeetingLink();

            // Create meeting object
            const newMeeting = {
                name: formData.name,
                mobile: `${formData.countryCode} ${formData.mobile}`,
                email: formData.email,
                topic: formData.topic,
                date: formData.date,
                time: formattedTime,
                status: 'Scheduled',
                link: meetingLink
            };

            // Persist to AdminService
            await AdminService.addMeeting(newMeeting);

            // Show success state
            setSubmitted(true);
            setIsBooking(false);

            // Reset after longer delay to ensure user sees it
            setTimeout(() => {
                setSubmitted(false);
                setShowForm(false);
                setFormData({
                    name: '',
                    countryCode: '+91',
                    mobile: '',
                    email: '',
                    topic: '',
                    date: '',
                    timeHour: '10',
                    timeMinute: '00',
                    timeAmPm: 'AM'
                });
            }, 5000);
        } catch (error) {
            setIsBooking(false);
            console.error("Booking submission failed:", error);
            alert("Something went wrong while booking. Please try again.");
        }
    };

    const getTodayLocal = () => {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const today = getTodayLocal();

    const handleDateChange = (e) => {
        const selectedDate = e.target.value;
        if (selectedDate && selectedDate < today) {
            alert("Please select today's date or a future date.");
            setFormData({ ...formData, date: today });
            return;
        }
        setFormData({ ...formData, date: selectedDate });
    };

    const inputStyle = {
        width: '100%',
        padding: '12px 16px',
        borderRadius: '8px',
        border: '1px solid rgba(255,255,255,0.2)',
        background: 'rgba(255,255,255,0.05)',
        color: '#fff',
        fontSize: '1rem',
        outline: 'none',
        marginBottom: '15px'
    };

    const selectStyle = {
        ...inputStyle,
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23ffffff%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 12px center',
        backgroundSize: '12px',
        cursor: 'pointer',
        paddingRight: '30px'
    };

    return (
        <section style={{
            padding: '80px 20px',
            position: 'relative',
            overflow: 'hidden',
            backgroundImage: `url(${modernOffice})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
        }}>
            {/* Dark Overlay */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(0, 0, 0, 0.4)',
                zIndex: 0
            }} />

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true, margin: "-100px" }}
                className="container"
                style={{ position: 'relative', zIndex: 1 }}
            >
                <div style={{
                    position: 'relative',
                    background: 'rgba(15, 23, 42, 0.85)', // More transparent for glassmorphism
                    backdropFilter: 'blur(10px)',
                    borderRadius: '24px',
                    padding: '60px 40px',
                    textAlign: 'center',
                    overflow: 'hidden',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    maxWidth: '800px', // Reverted to original width
                    margin: '0 auto'
                }}>
                    {/* Background Tech Glow */}
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3]
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        style={{
                            position: 'absolute',
                            top: '-50%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '800px',
                            height: '800px',
                            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%)',
                            filter: 'blur(80px)',
                            zIndex: 0,
                            pointerEvents: 'none'
                        }}
                    />

                    {/* Content */}
                    <div style={{ position: 'relative', zIndex: 10 }}>
                        <AnimatePresence mode="wait">
                            {!showForm && !submitted ? (
                                <motion.div
                                    key="cta"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem', color: '#fff', fontWeight: '800', letterSpacing: '-1px' }}>
                                        Ready to Transform Your <span style={{
                                            background: 'linear-gradient(to right, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent'
                                        }}>Business?</span>
                                    </h2>

                                    <p style={{ fontSize: '1.25rem', marginBottom: '3rem', maxWidth: '700px', margin: '0 auto 3rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                                        Schedule a free 30-minute consultation with our tech experts to discuss your needs and unlock new possibilities.
                                    </p>

                                    <motion.button
                                        id="open-booking-form-btn"
                                        onClick={() => setShowForm(true)}
                                        whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(212, 175, 55, 0.6)" }}
                                        whileTap={{ scale: 0.95 }}
                                        style={{
                                            background: 'linear-gradient(to right, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c)',
                                            color: '#0f172a',
                                            padding: '18px 48px',
                                            borderRadius: '50px',
                                            fontWeight: '800',
                                            fontSize: '1.2rem',
                                            border: 'none',
                                            cursor: 'pointer',
                                            textTransform: 'uppercase',
                                            letterSpacing: '1px'
                                        }}
                                    >
                                        Book Consultation
                                    </motion.button>
                                </motion.div>
                            ) : submitted ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    style={{ padding: '40px' }}
                                >
                                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>✅</div>
                                    <h3 style={{ color: '#fff', fontSize: '2rem', marginBottom: '10px' }}>Consultation Booked!</h3>
                                    <p style={{ color: '#cbd5e1' }}>We have received your request. Our team will contact you shortly at {formData.email} to confirm the details.</p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="form"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    style={{ textAlign: 'left', maxWidth: '500px', margin: '0 auto' }}
                                >
                                    <h3 style={{ color: '#fff', fontSize: '1.8rem', marginBottom: '20px', textAlign: 'center' }}>Book Your Session</h3>
                                    <form onSubmit={handleSubmit} id="booking-consultation-form">
                                        <input
                                            id="booking-name-input"
                                            type="text"
                                            placeholder="Your Name"
                                            required
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            style={inputStyle}
                                        />

                                        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', position: 'relative' }}>
                                            <div ref={dropdownRef} style={{ width: '100px', position: 'relative' }}>
                                                <div
                                                    id="country-code-dropdown-toggle"
                                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                                    style={{
                                                        padding: '12px 10px',
                                                        borderRadius: '8px',
                                                        background: 'rgba(255, 255, 255, 0.05)',
                                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                                        color: '#fff',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '8px',
                                                        cursor: 'pointer',
                                                        height: '100%',
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
                                                        <span style={{ fontSize: '0.9rem' }}>{formData.countryCode}</span>
                                                    </div>
                                                    <ChevronDown size={14} color="#fff" style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease' }} />
                                                </div>

                                                {isDropdownOpen && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        style={{
                                                            position: 'absolute',
                                                            top: 'calc(100% + 5px)',
                                                            left: 0,
                                                            width: '220px',
                                                            background: '#0f172a',
                                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                                            borderRadius: '8px',
                                                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                                                            zIndex: 100,
                                                            maxHeight: '250px',
                                                            overflow: 'hidden',
                                                            display: 'flex',
                                                            flexDirection: 'column'
                                                        }}
                                                    >
                                                        <div style={{ padding: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                            <input
                                                                id="country-search-input"
                                                                type="text"
                                                                placeholder="Search country..."
                                                                value={searchTerm}
                                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                                autoFocus
                                                                style={{
                                                                    width: '100%',
                                                                    padding: '6px 10px',
                                                                    borderRadius: '6px',
                                                                    background: 'rgba(255,255,255,0.05)',
                                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                                    color: '#fff',
                                                                    fontSize: '0.85rem',
                                                                    outline: 'none'
                                                                }}
                                                            />
                                                        </div>
                                                        <div style={{ flex: 1, overflowY: 'auto', padding: '5px' }}>
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
                                                                            padding: '8px 10px',
                                                                            borderRadius: '6px',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            gap: '10px',
                                                                            cursor: 'pointer',
                                                                            transition: 'background 0.2s',
                                                                            background: formData.countryCode === c.code ? 'rgba(212, 175, 55, 0.2)' : 'transparent'
                                                                        }}
                                                                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                                                                        onMouseLeave={(e) => e.currentTarget.style.background = formData.countryCode === c.code ? 'rgba(212, 175, 55, 0.2)' : 'transparent'}
                                                                    >
                                                                        <img
                                                                            src={`https://flagcdn.com/w20/${c.iso}.png`}
                                                                            width="20"
                                                                            alt={c.name}
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
                                                    id="booking-mobile-input"
                                                    type="tel"
                                                    placeholder="Mobile Number"
                                                    required
                                                    value={formData.mobile}
                                                    onChange={e => {
                                                        setFormData({ ...formData, mobile: e.target.value });
                                                        setPhoneError("");
                                                    }}
                                                    style={{
                                                        ...inputStyle,
                                                        marginBottom: 0,
                                                        width: '100%',
                                                        border: phoneError ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.2)'
                                                    }}
                                                />
                                                {phoneError && (
                                                    <motion.span
                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                        animate={{ opacity: 1, scale: 1 }}
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

                                        <input
                                            id="booking-email-input"
                                            type="email"
                                            placeholder="Your Email"
                                            required
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            style={inputStyle}
                                        />

                                        <input
                                            id="booking-topic-input"
                                            list="services-list"
                                            placeholder="Service Interested In (Type or Select)"
                                            value={formData.topic}
                                            onChange={e => setFormData({ ...formData, topic: e.target.value })}
                                            style={inputStyle}
                                        />
                                        <datalist id="services-list">
                                            {services.map(s => <option key={s} value={s} />)}
                                        </datalist>

                                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '15px' }}>
                                            <input
                                                id="booking-date-input"
                                                type="date"
                                                required
                                                min={today}
                                                value={formData.date}
                                                onChange={handleDateChange}
                                                style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
                                            />

                                            {/* Custom Time Picker */}
                                            <div style={{ display: 'flex', gap: '5px', flex: 1, height: '45px' }}>
                                                <select
                                                    id="booking-hour-select"
                                                    value={formData.timeHour}
                                                    onChange={e => setFormData({ ...formData, timeHour: e.target.value })}
                                                    style={{ ...selectStyle, marginBottom: 0, padding: '5px', textAlign: 'center' }}
                                                >
                                                    {hours.map(h => <option key={h} value={h} style={{ color: '#000' }}>{h}</option>)}
                                                </select>
                                                <span style={{ color: '#fff', alignSelf: 'center' }}>:</span>
                                                <select
                                                    id="booking-minute-select"
                                                    value={formData.timeMinute}
                                                    onChange={e => setFormData({ ...formData, timeMinute: e.target.value })}
                                                    style={{ ...selectStyle, marginBottom: 0, padding: '5px', textAlign: 'center' }}
                                                >
                                                    {minutes.map(m => <option key={m} value={m} style={{ color: '#000' }}>{m}</option>)}
                                                </select>
                                                <select
                                                    id="booking-ampm-select"
                                                    value={formData.timeAmPm}
                                                    onChange={e => setFormData({ ...formData, timeAmPm: e.target.value })}
                                                    style={{ ...selectStyle, marginBottom: 0, padding: '5px', textAlign: 'center' }}
                                                >
                                                    <option value="AM" style={{ color: '#000' }}>AM</option>
                                                    <option value="PM" style={{ color: '#000' }}>PM</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                                            <button
                                                id="booking-cancel-btn"
                                                type="button"
                                                onClick={() => setShowForm(false)}
                                                style={{
                                                    flex: 1,
                                                    padding: '12px',
                                                    borderRadius: '8px',
                                                    border: '1px solid #cbd5e1',
                                                    background: 'transparent',
                                                    color: '#fff',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                id="booking-confirm-btn"
                                                type="submit"
                                                disabled={isBooking}
                                                style={{
                                                    flex: 1,
                                                    padding: '12px',
                                                    borderRadius: '8px',
                                                    border: 'none',
                                                    background: 'linear-gradient(90deg, #D4AF37 0%, #F2D06B 100%)',
                                                    color: '#002C5F',
                                                    fontWeight: 'bold',
                                                    cursor: isBooking ? 'not-allowed' : 'pointer',
                                                    opacity: isBooking ? 0.7 : 1
                                                }}
                                            >
                                                {isBooking ? 'Booking...' : 'Confirm Booking'}
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default BookingModal;
