import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

import WhatsAppButton from './WhatsAppButton';
import ChatBot from './ChatBot';

const Layout = () => {
    const { pathname } = useLocation();

    // Scroll to top on route change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <div className="app-layout">
            <Navbar />
            <main>
                <Outlet />
            </main>
            <WhatsAppButton />
            <ChatBot />
            <Footer />
        </div>
    );
};

export default Layout;
