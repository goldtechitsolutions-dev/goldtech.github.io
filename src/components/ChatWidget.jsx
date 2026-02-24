import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send } from 'lucide-react';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { type: 'bot', text: 'Hi there! 👋 How can I help you regarding our IT solutions?' }
    ]);
    const [input, setInput] = useState("");

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Add user message
        setMessages(prev => [...prev, { type: 'user', text: input }]);
        const userInput = input;
        setInput("");

        // Simulate bot response
        setTimeout(() => {
            let botResponse = "Thanks for your message! Our team is currently offline, but we'll get back to you shortly.";
            if (userInput.toLowerCase().includes('service')) botResponse = "We offer Web Development, Cloud, and Security services. Would you like to know more?";
            if (userInput.toLowerCase().includes('price')) botResponse = "Our pricing is tailored to each project. Please fill out the contact form for a quote.";

            setMessages(prev => [...prev, { type: 'bot', text: botResponse }]);
        }, 1000);
    };

    return (
        <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999 }}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        style={{
                            width: '350px',
                            height: '450px',
                            background: '#fff',
                            borderRadius: '20px',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                            marginBottom: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            border: '1px solid rgba(0,0,0,0.05)'
                        }}
                    >
                        {/* Header */}
                        <div style={{ background: 'var(--color-blue-dark)', padding: '15px 20px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h4 style={{ margin: 0 }}>GoldTech Support</h4>
                                <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Online</span>
                            </div>
                            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px', background: '#f8fafc' }}>
                            {messages.map((msg, i) => (
                                <div key={i} style={{
                                    alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
                                    maxWidth: '80%',
                                    background: msg.type === 'user' ? 'var(--color-gold-primary)' : '#fff',
                                    color: msg.type === 'user' ? '#fff' : 'inherit',
                                    padding: '10px 15px',
                                    borderRadius: '15px',
                                    borderBottomRightRadius: msg.type === 'user' ? '5px' : '15px',
                                    borderBottomLeftRadius: msg.type === 'bot' ? '5px' : '15px',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                                    fontSize: '0.9rem'
                                }}>
                                    {msg.text}
                                </div>
                            ))}
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} style={{ padding: '15px', borderTop: '1px solid #eee', display: 'flex', gap: '10px' }}>
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                style={{ flex: 1, padding: '10px', borderRadius: '20px', border: '1px solid #eee', outline: 'none' }}
                            />
                            <button type="submit" style={{ background: 'var(--color-blue-dark)', color: '#fff', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                <Send size={18} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'var(--color-gold-gradient)',
                    border: 'none',
                    boxShadow: '0 4px 20px rgba(212, 175, 55, 0.4)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-blue-dark)'
                }}
            >
                <MessageSquare size={28} />
            </motion.button>
        </div>
    );
};

export default ChatWidget;
