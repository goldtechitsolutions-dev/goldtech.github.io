import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo-transparent.png';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '100%' }}>
                <Link
                    to="/"
                    className="logo-container"
                    style={{ textDecoration: 'none' }}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                    <img src={logo} alt="GoldTech Logo" className="logo-img" />
                    <div className="brand-name">
                        <span className="brand-gold">GOLD</span>
                        <span style={{ color: 'var(--color-blue-accent)' }}>TECH</span>
                    </div>
                </Link>
                <ul className="nav-links">
                    <li><Link to="/services" className="nav-link" target="_blank" rel="noopener noreferrer">Services</Link></li>
                    <li><Link to="/industries" className="nav-link" target="_blank" rel="noopener noreferrer">Industries</Link></li>
                    <li><Link to="/insights" className="nav-link" target="_blank" rel="noopener noreferrer">Insights</Link></li>
                    <li><Link to="/about" className="nav-link" target="_blank" rel="noopener noreferrer">About</Link></li>
                    <li><Link to="/products" className="nav-link" target="_blank" rel="noopener noreferrer">Products</Link></li>
                    <li><Link to="/career" className="nav-link" target="_blank" rel="noopener noreferrer">Career</Link></li>
                    <li><Link to="/contact" className="nav-link" target="_blank" rel="noopener noreferrer">Contact Us</Link></li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
