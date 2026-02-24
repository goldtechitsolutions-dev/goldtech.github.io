import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo-transparent.png';
import AdminService from '../services/adminService';

const Footer = () => {
    const [companyInfo, setCompanyInfo] = useState({ address: '', email: '', phone: '' });

    useEffect(() => {
        const fetchInfo = () => {
            setCompanyInfo(AdminService.getCompanyInfo());
        };

        fetchInfo();
        window.addEventListener('gt_data_update', fetchInfo);
        window.addEventListener('storage', fetchInfo);

        return () => {
            window.removeEventListener('gt_data_update', fetchInfo);
            window.removeEventListener('storage', fetchInfo);
        };
    }, []);

    return (
        <footer id="contact" className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                            <img src={logo} alt="GoldTech Logo" style={{ width: '40px', height: 'auto' }} />
                            <div className="brand-name">
                                <span className="brand-gold">GOLD</span>
                                <span style={{ color: 'var(--color-blue-accent)' }}>TECH</span>
                            </div>
                        </div>
                        <p>Empowering businesses through innovation and technology excellence.</p>
                    </div>

                    <div className="footer-contact">
                        <h4>Contact Us</h4>
                        <ul className="contact-info">
                            <li><span style={{ opacity: companyInfo.footerOpacity || 0.5 }}>📍 {companyInfo.address}</span></li>
                            <li>📧 {companyInfo.email}</li>
                            <li>📞 {companyInfo.phone}</li>
                        </ul>
                    </div>

                    <div className="footer-links">
                        <h4>Quick Links</h4>
                        <ul style={{ color: 'var(--color-text-muted)' }}>
                            <li><Link to="/" onClick={() => window.scrollTo(0, 0)}>Home</Link></li>
                            <li><Link to="/services" onClick={() => window.scrollTo(0, 0)}>Services</Link></li>
                            <li><Link to="/about" onClick={() => window.scrollTo(0, 0)}>About Us</Link></li>
                            <li><Link to="/contact" onClick={() => window.scrollTo(0, 0)}>Contact</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="copyright">
                    <p>&copy; {new Date().getFullYear()} GoldTech IT Solutions. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

