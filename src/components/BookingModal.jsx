import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X, Calendar } from 'lucide-react';
import modernOffice from '../assets/modern-office.png';
import AdminService from '../services/adminService';
import { countryCodes } from '../utils/countryData';

const BookingModal = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        countryCode: '+91',
        mobile: '',
        email: '',
        topic: '',
        date: '',
        timeHour: '',
        timeMinute: '',
        timeAmPm: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [dateDisplayValue, setDateDisplayValue] = useState("");
    const dropdownRef = useRef(null);
    const dateInputRef = useRef(null);

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

        if (isModalOpen) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.classList.remove('modal-open');
        };
    }, [isModalOpen]);

    const services = [
        "AI & Machine Learning",
        "IT Support & Service",
        "Business Transformation",
        "Software Security",
        "Cloud Migration",
        "Custom App Development",
        "Data Analytics"
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
                setIsModalOpen(false);
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
        const value = e.target.value; // Expected YYYY-MM-DD from native picker
        if (value && value < today) {
            alert("Please select today's date or a future date.");
            return;
        }

        if (value) {
            setFormData({ ...formData, date: value });
            // Convert YYYY-MM-DD to DD/MM/YYYY for display
            const [y, m, d] = value.split('-');
            setDateDisplayValue(`${d}/${m}/${y}`);
        }
    };

    const handleManualDateChange = (e) => {
        let val = e.target.value;
        // Allow only numbers and slashes
        val = val.replace(/[^0-9/]/g, '');

        // Auto-format as DD/MM/YYYY
        if (val.length === 2 && !val.includes('/')) val += '/';
        if (val.length === 5 && val.split('/').length === 2) val += '/';
        if (val.length > 10) val = val.substring(0, 10);

        setDateDisplayValue(val);

        // Try to validate and sync with formData.date (YYYY-MM-DD)
        if (val.length === 10) {
            const [d, m, y] = val.split('/');
            const isoDate = `${y}-${m}-${d}`;
            const dateObj = new Date(isoDate);

            if (!isNaN(dateObj.getTime())) {
                if (isoDate < today) {
                    setPhoneError("Please select a future date"); // Reusing error display or alert
                } else {
                    setFormData(prev => ({ ...prev, date: isoDate }));
                    setPhoneError("");
                }
            }
        }
    };


    return (
        <section className="booking-section" style={{
            backgroundImage: `url(${modernOffice})`
        }}>
            {/* Dark Overlay */}
            <div className="booking-overlay" />

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true, margin: "-100px" }}
                className="container"
                style={{ position: 'relative', zIndex: 1 }}
            >
                <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                    <h2 className="booking-hero-title">
                        Ready to Transform Your <span style={{
                            background: 'linear-gradient(to right, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>Business?</span>
                    </h2>

                    <p style={{ fontSize: '1.25rem', marginBottom: '3.5rem', maxWidth: '750px', margin: '0 auto 3.5rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                        Join the elite circle of businesses powered by our advanced technology solutions. Experience the true gold standard of digital excellence through our expert consultation.
                    </p>

                    <motion.button
                        id="open-booking-modal-btn"
                        onClick={() => setIsModalOpen(true)}
                        whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(212, 175, 55, 0.4)" }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            background: 'linear-gradient(to right, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c)',
                            color: '#0f172a',
                            padding: '20px 60px',
                            borderRadius: '50px',
                            fontWeight: '900',
                            fontSize: '1.25rem',
                            border: 'none',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            letterSpacing: '2px'
                        }}
                    >
                        FREE CONSULTATION
                    </motion.button>
                </div>
            </motion.div>

            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        className="booking-modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}
                    >
                        <motion.div
                            className="booking-modal-card"
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                                <X size={24} />
                            </button>

                            {/* Background Tech Glow */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.3, 0.5, 0.3]
                                }}
                                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                                className="booking-glow"
                            />

                            {/* Content */}
                            <div style={{ position: 'relative', zIndex: 10 }}>
                                <AnimatePresence mode="wait">
                                    {submitted ? (
                                        <motion.div
                                            key="success"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="booking-success-card"
                                        >
                                            <div className="booking-success-icon">✅</div>
                                            <h3 style={{ color: '#fff', fontSize: '2.5rem', marginBottom: '15px' }}>Consultation Booked!</h3>
                                            <p style={{ color: '#cbd5e1', fontSize: '1.1rem' }}>We have received your request. Our team will contact you shortly at <strong>{formData.email}</strong> to confirm the details.</p>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="form"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="booking-form-container"
                                        >
                                            <h3 className="booking-form-title">Book Your Session</h3>
                                            <form onSubmit={handleSubmit} id="booking-consultation-form">
                                                <input
                                                    id="booking-name-input"
                                                    type="text"
                                                    placeholder="Your Name"
                                                    required
                                                    className="booking-input"
                                                    value={formData.name}
                                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                />

                                                <div className="booking-input-group">
                                                    <div ref={dropdownRef} className="booking-country-select-container">
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
                                                    <div className="booking-mobile-input-container">
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
                                                            className="booking-input"
                                                            style={{
                                                                marginBottom: 0,
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
                                                    className="booking-input"
                                                />

                                                <input
                                                    id="booking-topic-input"
                                                    list="services-list"
                                                    placeholder="Service Interested In (Type or Select)"
                                                    value={formData.topic}
                                                    onChange={e => setFormData({ ...formData, topic: e.target.value })}
                                                    className="booking-input"
                                                />
                                                <datalist id="services-list">
                                                    {services.map(s => <option key={s} value={s} />)}
                                                </datalist>

                                                <div className="booking-row">
                                                    <div className="date-input-wrapper" style={{ position: 'relative', flex: 1 }}>
                                                        <input
                                                            id="booking-date-input"
                                                            type="text"
                                                            placeholder="DD/MM/YYYY"
                                                            value={dateDisplayValue}
                                                            onChange={handleManualDateChange}
                                                            className="booking-input"
                                                            required
                                                            style={{ paddingRight: '45px' }}
                                                        />
                                                        <Calendar
                                                            size={20}
                                                            className="calendar-icon"
                                                            onClick={() => dateInputRef.current?.showPicker()}
                                                            style={{
                                                                position: 'absolute',
                                                                right: '12px',
                                                                top: '50%',
                                                                transform: 'translateY(-50%)',
                                                                cursor: 'pointer',
                                                                color: 'rgba(255,255,255,0.6)',
                                                                zIndex: 10
                                                            }}
                                                        />
                                                        <input
                                                            ref={dateInputRef}
                                                            type="date"
                                                            min={today}
                                                            onChange={handleDateChange}
                                                            style={{
                                                                position: 'absolute',
                                                                visibility: 'hidden',
                                                                width: 0,
                                                                height: 0
                                                            }}
                                                        />
                                                    </div>

                                                    <div className="time-picker-container">
                                                        <select
                                                            id="booking-hour-select"
                                                            value={formData.timeHour}
                                                            onChange={e => setFormData({ ...formData, timeHour: e.target.value })}
                                                            className="booking-select"
                                                            required
                                                        >
                                                            <option value="" disabled style={{ color: '#000' }}>Hr</option>
                                                            {hours.map(h => <option key={h} value={h} style={{ color: '#000' }}>{h}</option>)}
                                                        </select>
                                                        <span style={{ color: '#fff', alignSelf: 'center' }}>:</span>
                                                        <select
                                                            id="booking-minute-select"
                                                            value={formData.timeMinute}
                                                            onChange={e => setFormData({ ...formData, timeMinute: e.target.value })}
                                                            className="booking-select"
                                                            required
                                                        >
                                                            <option value="" disabled style={{ color: '#000' }}>Min</option>
                                                            {minutes.map(m => <option key={m} value={m} style={{ color: '#000' }}>{m}</option>)}
                                                        </select>
                                                        <select
                                                            id="booking-ampm-select"
                                                            value={formData.timeAmPm}
                                                            onChange={e => setFormData({ ...formData, timeAmPm: e.target.value })}
                                                            className="booking-select"
                                                            required
                                                        >
                                                            <option value="" disabled style={{ color: '#000' }}>AM/PM</option>
                                                            <option value="AM" style={{ color: '#000' }}>AM</option>
                                                            <option value="PM" style={{ color: '#000' }}>PM</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="booking-btn-group">
                                                    <button
                                                        id="booking-cancel-btn"
                                                        type="button"
                                                        onClick={() => setIsModalOpen(false)}
                                                        className="booking-btn-cancel"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        id="booking-confirm-btn"
                                                        type="submit"
                                                        disabled={isBooking}
                                                        className="booking-btn-confirm"
                                                    >
                                                        {isBooking ? 'Booking...' : 'Confirm Booking'}
                                                    </button>
                                                </div>
                                            </form>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default BookingModal;
