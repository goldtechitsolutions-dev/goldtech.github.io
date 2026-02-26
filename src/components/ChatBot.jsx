import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare, X, Send, User, ChevronDown,
    Code, Smartphone, Cpu, Server, Shield,
    Database, Briefcase, Megaphone, Globe, MoreHorizontal
} from 'lucide-react';
import robotIcon from '../assets/chatbot-transparent.png';
import AdminService from '../services/adminService';
import { countryCodes } from '../utils/countryData';

const ChatBot = () => {
    const serviceOptions = [
        { name: 'Custom Software', icon: <Code size={16} />, color: '#3b82f6' },
        { name: 'Web & Mobile Apps', icon: <Smartphone size={16} />, color: '#2563eb' },
        { name: 'AI & ML', icon: <Cpu size={16} />, color: '#8b5cf6' },
        { name: 'Cloud Infrastructure', icon: <Server size={16} />, color: '#6366f1' },
        { name: 'Cybersecurity', icon: <Shield size={16} />, color: '#ef4444' },
        { name: 'Data Analytics', icon: <Database size={16} />, color: '#10b981' },
        { name: 'Salesforce & SAP', icon: <Briefcase size={16} />, color: '#0ea5e9' },
        { name: 'Digital Marketing', icon: <Megaphone size={16} />, color: '#f59e0b' },
        { name: 'Digital Transformation', icon: <Globe size={16} />, color: '#14b8a6' },
        { name: 'Other', icon: <MoreHorizontal size={16} />, color: '#64748b' }
    ];

    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi there! 👋 I'm SONA, your virtual assistant at GoldTech IT Solutions. How can I help you today?", sender: 'bot' }
    ]);
    const [input, setInput] = useState("");
    const [step, setStep] = useState(0); // 0: Start, 1: Name, 2: Email, 3: Phone, 4: Service, 5: Done
    const [formData, setFormData] = useState({ name: '', email: '', countryCode: '+91', phone: '', service: '', requirements: '' });
    const [showLeadForm, setShowLeadForm] = useState(true);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [startTime] = useState(Date.now()); // Track start time for duration
    const [currentSessionId] = useState(Date.now()); // Stable ID for the whole session
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const dropdownRef = useRef(null);

    const filteredCountries = countryCodes.filter(c =>
        (c.name && c.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (c.code && c.code.includes(searchTerm))
    );

    // Animation variants for service chips reveal
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.8, y: 10 },
        show: { opacity: 1, scale: 1, y: 0 }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleFormSubmit = (e) => {
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

        setShowLeadForm(false);
        setIsTyping(true);

        const fullPhone = `${formData.countryCode} ${formData.phone}`;
        const updatedFormData = { ...formData, phone: fullPhone };
        setFormData(updatedFormData);

        // 1. Personalized welcome message after 800ms
        setTimeout(async () => {
            setIsTyping(false);
            const welcomeMsg = {
                id: Date.now(),
                text: `Hi ${formData.name}! 👋 I'm SONA. Thanks for sharing your details.`,
                sender: 'bot'
            };
            setMessages([welcomeMsg]);

            // Initial log
            const logData = {
                id: currentSessionId,
                user: formData.name,
                status: 'New',
                duration: '0m 0s',
                messages: [welcomeMsg],
                formData: updatedFormData
            };
            await AdminService.addChatLog(logData);

            // 2. Follow-up message with service options after 1.5s delay
            setTimeout(() => {
                setIsTyping(true);

                setTimeout(async () => {
                    setIsTyping(false);
                    const serviceMsg = {
                        id: Date.now() + 1,
                        text: "Which service are you interested in?",
                        sender: 'bot',
                        options: serviceOptions
                    };
                    setMessages(prev => [...prev, serviceMsg]);

                    // Update log with both messages
                    await AdminService.addChatLog({
                        ...logData,
                        messages: [welcomeMsg, serviceMsg]
                    });

                    // Supplemental scroll for staggered chips
                    setTimeout(scrollToBottom, 500);
                    setTimeout(scrollToBottom, 1000);
                    setTimeout(scrollToBottom, 1500);
                }, 1200); // Simulated "thinking" time for the second message
            }, 800); // Gap between messages
        }, 800);
    };

    const handleOptionClick = async (option) => {
        // Treat option click as user input
        setInput("");

        // Add user message immediately
        const newMessages = [...messages, { id: Date.now(), text: option, sender: 'user' }];
        setMessages(newMessages);

        // Trigger bot processing
        await processStep(option, newMessages);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen, isTyping]);

    const handleSend = async () => {
        if (!input.trim()) return;

        // Add user message
        const newMessages = [...messages, { id: Date.now(), text: input, sender: 'user' }];
        setMessages(newMessages);

        const userInput = input;
        setInput("");

        // Process bot response with a small delay for realism
        setTimeout(async () => {
            await processStep(userInput, newMessages);
        }, 300); // Reduced initial delay since processStep has its own delay now
    };

    const saveChatSession = async (finalMessages, status) => {
        console.log("Saving Chat Session...", { status, formData }); // Debug log
        const endTime = Date.now();
        const durationMs = endTime - startTime;
        const minutes = Math.floor(durationMs / 60000);
        const seconds = ((durationMs % 60000) / 1000).toFixed(0);
        const duration = `${minutes}m ${seconds}s`;

        const log = {
            id: currentSessionId,
            user: formData.name || `Visitor #${Math.floor(Math.random() * 9000) + 1000}`,
            status: status,
            duration: duration,
            messages: finalMessages,
            formData: formData
        };

        await AdminService.addChatLog(log);
        console.log("Chat Session Saved to AdminService"); // Debug log
    };

    const processStep = async (lastInput, currentMessages) => {
        let nextMessage = "";
        let nextStep = step + 1;
        const normalizedInput = lastInput.trim().toLowerCase();

        // Global Knowledge Base Check
        const knowledgeBase = [
            { keys: ['hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening', 'sup', 'yo'], answer: "Hello! I'm SONA, your virtual assistant. How can I help you today?" },
            { keys: ['who are you', 'who are u', 'who r u', 'what is this', 'are you a bot', 'are u a bot', 'are you human', 'are u human', 'real person', 'your name', 'ur name'], answer: "I'm SONA, an AI assistant for GoldTech. I'm here to help you explore our services and connect with our experts." },
            { keys: ['services', 'our services', 'what services', 'what features', 'list services', 'show services', 'what do you do', 'what do u do', 'what u do', 'what you do', 'what do you offer', 'what do u offer', 'what do you provide', 'what do u provide'], answer: "We represent GoldTech IT Solutions. We specialize in:\n• Web & Mobile Applications\n• Salesforce & SAP Solutions\n• AI & Automation\n• Cloud Infrastructure\n• Data Analytics\n• Digital Transformation\n\nWhich of these areas are you interested in?" },
            { keys: ['location', 'address', 'where are you', 'where are u', 'where r u', 'office', 'headquarters', 'based in'], answer: "We are located at:\n📍 T-hub, Hyderabad" },

            // Services - Prioritize Specific Intent
            { keys: ['web', 'website', 'web dev', 'web application', 'build a site', 'app', 'mobile app', 'android', 'ios', 'application'], answer: "We build high-performance, responsive websites and mobile applications (iOS/Android) using the latest technologies. Are you looking for a custom web or mobile solution?" },
            { keys: ['salesforce', 'sap', 'crm', 'erp'], answer: "We provide expert Salesforce and SAP implementation, customization, and management to optimize your enterprise workflows and CRM needs." },
            { keys: ['ai', 'artificial intelligence', 'ml', 'machine learning', 'genai'], answer: "We specialize in AI solutions including AI Strategy & engineering, Data for AI, Process for AI, Agentic legacy modernization, Physical AI, and AI Trust. How can AI help your business?" },
            { keys: ['cloud', 'aws', 'azure', 'gcp'], answer: "We offer comprehensive cloud services including migration, management, and architecture on AWS, Azure, and Google Cloud." },

            // HR & Recruitment FAQs
            { keys: ['insurance', 'health', 'medical', 'benefits'], answer: "Yes! We offer comprehensive health insurance covering medical, dental, and vision for all full-time employees and their dependents." },
            { keys: ['remote', 'wfh', 'work from home', 'flexible'], answer: "We are a remote-first company! We also have hubs in major cities if you prefer an office environment. We offer flexible working hours to suit your lifestyle." },
            { keys: ['salary', 'pay', 'compensation', 'ctc'], answer: "Our compensation packages are competitive and market-leading, based on role, experience, and location. We also offer performance bonuses and stock options." },
            { keys: ['interview', 'process', 'hiring process'], answer: "Our process typically involves: 1. Application Review 2. Initial Screening 3. Technical/Role Interview 4. Cultural Fit Round 5. Offer! You can track your status in the Create Profile portal." },
            { keys: ['culture', 'life', 'environment'], answer: "At GoldTech, we value innovation, learning, and wellbeing. We have a 'no-ego' policy, annual learning stipends, and regular team retreats." },

            // Contact - Email Priority
            { keys: ['contact mail', 'mail', 'email', 'gmail', 'mail id', 'email id'], answer: "Here is our email:\n\ngoldtechitsolutions@gmail.com\n📞 9640786029" },

            // Contact - Phone Priority
            { keys: ['contact no', 'contact number', 'phone', 'call', 'give ur no', 'ur no', 'your no', 'give no', 'mobile no', 'number'], answer: "Here is our number:\n\n📞 9640786029\ngoldtechitsolutions@gmail.com" },

            // Contact - General
            { keys: ['contact', 'support', 'reach out'], answer: "Here are our contact details:\n\ngoldtechitsolutions@gmail.com\n📞 9640786029" },

            { keys: ['hiring', 'job', 'career', 'vacancy', 'resume', 'cv', 'work for you', 'work for u', 'opening'], answer: "We are always looking for talented individuals! Please check our Careers page or email your resume to careers@goldtech.com." },
            { keys: ['price', 'cost', 'quote', 'rates', 'pricing', 'how much', 'charges'], answer: "Our pricing is customized based on the project scope and requirements. I can connect you with our sales team for a detailed quote. Would you like that?" },
            { keys: ['thank', 'thanks', 'thx'], answer: "You're welcome! Is there anything else I can help you with?" },
            { keys: ['bye', 'goodbye', 'see ya', 'cya'], answer: "Goodbye! Have a great day ahead! 👋" }
        ];

        const kbMatch = knowledgeBase.find(item => item.keys.some(key => {
            try {
                const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                return new RegExp(`\\b${escapedKey}\\b`, 'i').test(normalizedInput);
            } catch (e) {
                return normalizedInput.includes(key);
            }
        }));

        // Special Priority: If we are expecting a service selection, check if input matches a service EXACTLY
        const exactServiceMatch = serviceOptions.find(opt => opt.name.toLowerCase() === normalizedInput);

        if (exactServiceMatch && step === 0) {
            // Treat as service selection even if KB matches
            setFormData(prev => ({ ...prev, service: exactServiceMatch.name }));
            if (formData.name) {
                nextMessage = `Great choice! To better assist you with "${exactServiceMatch.name}", could you please tell me a bit more about your specific requirements?`;
                nextStep = 7;
            } else {
                nextMessage = "I'd be happy to assist you with that. To get started, may I know your full name?";
                nextStep = 1;
            }
        } else if (kbMatch) {
            nextMessage = kbMatch.answer;
            nextStep = 0;
        } else {
            switch (step) {
                case 0: // Handshake / Greeting / Initial Intent
                    {
                        if (normalizedInput && ['no', 'nothing', 'nope', 'nah', 'none', 'not now', 'later', 'bye', 'goodbye', 'cancel'].some(w => normalizedInput === w || normalizedInput.includes(w))) {
                            nextMessage = "Alright! Feel free to reach out whenever you're ready. Have a wonderful day!";
                            nextStep = 5;
                        } else if (['yes', 'yeah', 'yep', 'sure', 'ok', 'okay'].some(w => normalizedInput === w)) {
                            nextMessage = "Great! Could you tell me a little more about what you have in mind?";
                            nextStep = 0;
                        } else if (normalizedInput.length < 3) {
                            nextMessage = "I'm sorry, I didn't quite catch that. Could you please clarify what you are looking for?";
                            nextStep = 0;
                        } else {
                            if (normalizedInput && (normalizedInput === 'other' || normalizedInput.includes('other'))) {
                                setFormData(prev => ({ ...prev, service: 'Other' }));
                                nextMessage = "Could you please briefly explain your requirements so we can better understand your needs?";
                                nextStep = 7;
                            } else {
                                setFormData(prev => ({ ...prev, service: lastInput }));
                                if (formData.name) {
                                    nextMessage = `Great choice! To better assist you with "${lastInput}", could you please tell me a bit more about your specific requirements?`;
                                    nextStep = 7;
                                } else {
                                    nextMessage = "I'd be happy to assist you with that. To get started, may I know your full name?";
                                    nextStep = 1;
                                }
                            }
                        }
                    }
                    break;

                case 1: // Captured Name
                    if (normalizedInput && (['what', 'why', 'how', 'who', 'when', '?'].some(q => normalizedInput.includes(q)) || normalizedInput.length < 2)) {
                        nextMessage = "I need your full name to proceed. Could you please type it for me?";
                        nextStep = 1;
                    } else {
                        setFormData(prev => ({ ...prev, name: lastInput }));
                        if (formData.service) {
                            nextMessage = `Nice to meet you, ${lastInput}! To connect you with the right expert, could you please share your contact details (Email and Phone)?`;
                            nextStep = 3;
                        } else {
                            nextMessage = `Nice to meet you, ${lastInput}! How can we help you today?`;
                            nextStep = 2;
                        }
                    }
                    break;

                case 2: // Captured Service Interest
                    setFormData(prev => ({ ...prev, service: lastInput }));
                    nextMessage = "Thanks for letting us know. To connect you with the right expert, could you please share your contact details (Email and Phone)?";
                    nextStep = 3;
                    break;

                case 3: // Captured Contact Details
                    {
                        const hasEmail = lastInput && lastInput.includes('@');
                        const hasPhone = /\d{7,}/.test(lastInput);
                        if (hasEmail && hasPhone) {
                            setFormData(prev => ({ ...prev, email: lastInput, phone: lastInput }));
                            nextMessage = "Perfect! To better assist you, could you please tell me a bit more about your specific requirements?";
                            nextStep = 7;
                        } else if (hasEmail) {
                            setFormData(prev => ({ ...prev, email: lastInput }));
                            nextMessage = "Thanks! Could you also share your Phone Number so we can reach you quickly?";
                            nextStep = 4;
                        } else if (hasPhone) {
                            setFormData(prev => ({ ...prev, phone: lastInput }));
                            nextMessage = "Got it. Could you also share your Email ID?";
                            nextStep = 4;
                        } else {
                            nextMessage = "I didn't quite catch that. Could you please share a valid Email or Phone Number?";
                            nextStep = 3;
                        }
                    }
                    break;

                case 4: // Captured Missing Contact Detail
                    if (formData.email && !formData.phone) setFormData(prev => ({ ...prev, phone: lastInput }));
                    else if (!formData.email && formData.phone) setFormData(prev => ({ ...prev, email: lastInput }));
                    nextMessage = "Thanks for sharing. To better assist you, could you please tell me a bit more about your specific requirements?";
                    nextStep = 7;
                    break;

                case 6:
                case 7: // Final Requirement Capture
                    {
                        setFormData(prev => ({ ...prev, requirements: lastInput }));
                        nextMessage = "Thank you so much! I've passed your detailed requirements to our team. An expert will review them and contact you shortly. Have a great day! 👋";
                        nextStep = 5;
                    }
                    break;

                default:
                    nextMessage = "Thanks again! We'll be in touch.";
                    nextStep = 5;
            }
        }

        // Show typing indicator before delivery
        setIsTyping(true);
        setStep(nextStep);

        const thinkingTime = Math.min(Math.max(nextMessage.length * 15, 800), 2000);

        setTimeout(async () => {
            setIsTyping(false);
            const botMsg = { id: Date.now() + 1, text: nextMessage, sender: 'bot' };
            const updatedMessages = [...currentMessages, botMsg];
            setMessages(updatedMessages);

            // Save Log if session ended (Lead Captured)
            if (nextStep === 5) {
                await saveChatSession(updatedMessages, 'New');
            }

            // Supplemental scroll for staggered chips
            if (nextMessage && (nextMessage.includes("service") || nextMessage.includes("Which area"))) {
                setTimeout(scrollToBottom, 500);
                setTimeout(scrollToBottom, 1000);
                setTimeout(scrollToBottom, 1500);
            }
        }, thinkingTime);
    };


    return (
        <>
            {/* Chat Trigger Button */}
            <div
                style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 9998 }}
            >
                <div style={{ position: 'relative' }}>
                    {/* Tooltip/Speech Bubble */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, x: -20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ delay: 1, duration: 0.5 }}
                        style={{
                            position: 'absolute',
                            right: '70px',
                            top: '10px',
                            background: '#fff',
                            padding: '8px 12px',
                            borderRadius: '12px',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            color: '#0f172a',
                            whiteSpace: 'nowrap',
                            pointerEvents: 'none'
                        }}
                    >
                        Hi! 👋
                        <div style={{
                            position: 'absolute',
                            right: '-6px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: 0,
                            height: 0,
                            borderTop: '6px solid transparent',
                            borderBottom: '6px solid transparent',
                            borderLeft: '6px solid #fff'
                        }} />
                    </motion.div>

                    <motion.button
                        onClick={() => setIsOpen(!isOpen)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            width: '120px', // Larger size for the character
                            height: '120px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
                        }}
                    >
                        <motion.img
                            src={robotIcon}
                            alt="Chat with SONA"
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            animate={{
                                y: [0, -8, 0], // Floating effect
                                rotate: [0, 5, -5, 0] // Gentle swaying
                            }}
                            transition={{
                                y: {
                                    repeat: Infinity,
                                    duration: 2,
                                    ease: "easeInOut"
                                },
                                rotate: {
                                    repeat: Infinity,
                                    duration: 3,
                                    ease: "easeInOut"
                                }
                            }}
                        />
                    </motion.button>
                </div>
            </div>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        style={{
                            position: 'fixed',
                            bottom: '100px',
                            right: '30px',
                            width: '380px',
                            maxWidth: '90vw',
                            height: '500px',
                            background: 'rgba(255, 255, 255, 0.05)', // Very transparent
                            backdropFilter: 'blur(5px)', // Reduced blur
                            borderRadius: '16px',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                            zIndex: 9999,
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            border: '1px solid rgba(255, 255, 255, 0.3)'
                        }}
                    >
                        {/* Header */}
                        <div style={{
                            background: 'var(--color-blue-dark)',
                            padding: '16px 20px',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            <div style={{
                                background: '#fff',
                                padding: '2px',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                width: '45px',
                                height: '45px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                            }}>
                                <motion.img
                                    src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80"
                                    alt="SONA"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                                    animate={{ y: [0, -3, 0] }}
                                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                />
                            </div>
                            <div>
                                <h4 style={{ margin: 0, fontSize: '1rem' }}>SONA</h4>
                                <span style={{ fontSize: '0.8rem', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%' }}></span> Online
                                </span>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {showLeadForm ? (
                            /* Lead Collection Form */
                            <div style={{
                                flex: 1,
                                padding: '20px 25px', // Reduced top/bottom padding
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center', // Keep centered but allow scroll if needed
                                gap: '15px', // Reduced gap
                                background: 'rgba(255, 255, 255, 0.05)', // Very transparent
                                backdropFilter: 'blur(3px)', // Minimal blur
                                overflowY: 'auto', // Allow scroll if content is too tall
                                borderBottomLeftRadius: '16px',
                                borderBottomRightRadius: '16px'
                            }}>
                                <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                                    <h3 style={{ margin: '0 0 8px 0', color: '#fff', fontSize: '1.2rem', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>Welcome! 👋</h3>
                                    <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.9rem' }}>Please fill in your details to start chatting with SONA.</p>
                                </div>

                                <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '4px', fontWeight: '500' }}>Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Enter your full name"
                                            style={{
                                                width: '100%',
                                                padding: '10px 12px',
                                                borderRadius: '8px',
                                                border: '1px solid #cbd5e1',
                                                fontSize: '0.95rem',
                                                outline: 'none',
                                                transition: 'border-color 0.2s'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = 'var(--color-blue-accent)'}
                                            onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '4px', fontWeight: '500' }}>Email ID</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="Enter your email address"
                                            style={{
                                                width: '100%',
                                                padding: '10px 12px',
                                                borderRadius: '8px',
                                                border: '1px solid #cbd5e1',
                                                fontSize: '0.95rem',
                                                outline: 'none',
                                                transition: 'border-color 0.2s'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = 'var(--color-blue-accent)'}
                                            onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '4px', fontWeight: '500' }}>Mobile Number</label>
                                        <div style={{ display: 'flex', gap: '8px', position: 'relative' }}>
                                            <div ref={dropdownRef} style={{ width: '85px', flexShrink: 0, position: 'relative' }}>
                                                <div
                                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                                    style={{
                                                        padding: '10px 8px',
                                                        borderRadius: '8px',
                                                        background: '#fff',
                                                        border: '1px solid #cbd5e1',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        height: '100%',
                                                        gap: '4px',
                                                        cursor: 'pointer',
                                                        justifyContent: 'space-between'
                                                    }}
                                                >
                                                    <img
                                                        src={`https://flagcdn.com/w20/${countryCodes.find(c => c.code === formData.countryCode)?.iso || 'in'}.png`}
                                                        width="20"
                                                        alt="flag"
                                                        style={{ borderRadius: '2px' }}
                                                    />
                                                    <span style={{ fontSize: '0.8rem', color: '#0f172a' }}>{formData.countryCode}</span>
                                                    <ChevronDown size={14} color="#0f172a" style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease' }} />
                                                </div>

                                                {isDropdownOpen && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.95 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        style={{
                                                            position: 'absolute',
                                                            bottom: 'calc(100% + 5px)',
                                                            left: 0,
                                                            width: '200px',
                                                            background: '#fff',
                                                            border: '1px solid #e2e8f0',
                                                            borderRadius: '8px',
                                                            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                                            zIndex: 10000,
                                                            maxHeight: '200px',
                                                            overflow: 'hidden',
                                                            display: 'flex',
                                                            flexDirection: 'column'
                                                        }}
                                                    >
                                                        <div style={{ padding: '6px', borderBottom: '1px solid #f1f5f9' }}>
                                                            <input
                                                                type="text"
                                                                placeholder="Search..."
                                                                value={searchTerm}
                                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                                autoFocus
                                                                style={{
                                                                    width: '100%',
                                                                    padding: '6px 8px',
                                                                    borderRadius: '4px',
                                                                    border: '1px solid #e2e8f0',
                                                                    fontSize: '0.8rem',
                                                                    outline: 'none'
                                                                }}
                                                            />
                                                        </div>
                                                        <div style={{ flex: 1, overflowY: 'auto', padding: '4px' }}>
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
                                                                            padding: '6px 10px',
                                                                            borderRadius: '4px',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            gap: '8px',
                                                                            cursor: 'pointer',
                                                                            background: formData.countryCode === c.code ? '#f8fafc' : 'transparent'
                                                                        }}
                                                                    >
                                                                        <img
                                                                            src={`https://flagcdn.com/w20/${c.iso}.png`}
                                                                            width="18"
                                                                            alt={c.name}
                                                                            style={{ borderRadius: '2px' }}
                                                                        />
                                                                        <span style={{ fontSize: '0.75rem', color: '#1e293b' }}>{c.name} ({c.code})</span>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <div style={{ color: '#94a3b8', textAlign: 'center', padding: '10px', fontSize: '0.75rem' }}>NotFound</div>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </div>
                                            <div style={{ flex: 1, position: 'relative' }}>
                                                <input
                                                    type="tel"
                                                    required
                                                    value={formData.phone}
                                                    onChange={(e) => {
                                                        setFormData({ ...formData, phone: e.target.value });
                                                        setPhoneError("");
                                                    }}
                                                    placeholder="Enter number"
                                                    style={{
                                                        width: '100%',
                                                        padding: '10px 12px',
                                                        borderRadius: '8px',
                                                        border: phoneError ? '2px solid #ef4444' : '1px solid #cbd5e1',
                                                        fontSize: '0.95rem',
                                                        outline: 'none',
                                                        transition: 'border-color 0.2s'
                                                    }}
                                                />
                                                {phoneError && (
                                                    <motion.span
                                                        initial={{ opacity: 0, y: -5 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        style={{
                                                            position: 'absolute',
                                                            left: '2px',
                                                            bottom: '-16px',
                                                            color: '#ef4444',
                                                            fontSize: '0.65rem',
                                                            fontWeight: '600'
                                                        }}
                                                    >
                                                        {phoneError}
                                                    </motion.span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        style={{
                                            marginTop: '15px',
                                            width: '100%',
                                            background: 'var(--color-gold-gradient)',
                                            color: 'var(--color-blue-dark)',
                                            padding: '14px',
                                            borderRadius: '8px',
                                            border: 'none',
                                            fontWeight: '700',
                                            fontSize: '1rem',
                                            cursor: 'pointer',
                                            transition: 'transform 0.1s, box-shadow 0.2s',
                                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                        }}
                                        onMouseDown={(e) => e.target.style.transform = 'scale(0.98)'}
                                        onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
                                        onMouseEnter={(e) => e.target.style.boxShadow = '0 6px 8px rgba(0,0,0,0.15)'}
                                        onMouseLeave={(e) => e.target.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'}
                                    >
                                        Start Chatting
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <>
                                {/* Messages Area */}
                                <div style={{
                                    flex: 1,
                                    padding: '20px',
                                    overflowY: 'auto',
                                    background: 'transparent',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '15px'
                                }}>
                                    {messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            style={{
                                                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                                maxWidth: msg.sender === 'bot' ? '92%' : '80%' // Wider for bot messages
                                            }}
                                        >
                                            <div style={{
                                                padding: '12px 16px',
                                                borderRadius: '12px',
                                                borderBottomRightRadius: msg.sender === 'user' ? '2px' : '12px',
                                                borderTopLeftRadius: msg.sender === 'bot' ? '2px' : '12px',
                                                background: msg.sender === 'user' ? 'var(--color-blue-accent)' : '#fff',
                                                color: msg.sender === 'user' ? '#fff' : '#1e293b',
                                                boxShadow: msg.sender === 'bot' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                                                fontSize: '0.95rem',
                                                lineHeight: '1.5',
                                                whiteSpace: 'pre-wrap',
                                                overflowWrap: 'break-word',
                                                wordBreak: 'break-word',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '8px'
                                            }}>
                                                {msg.sender === 'bot' ? (
                                                    <>
                                                        <div>
                                                            {/* Simple parser to highlight emails and numbers */}
                                                            {msg.text.split(/(\s+)/).map((part, index) => {
                                                                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                                                const phoneRegex = /^(\+?\d{10,}|\d{3,}-\d{3,}-\d{4,})$/; // Simple check for likely phone numbers
                                                                const isPhone = /\d{10}/.test(part) || part.includes('9640786029');

                                                                if (emailRegex.test(part) || isPhone) {
                                                                    return <span key={index} style={{
                                                                        background: 'linear-gradient(90deg, #B4941F, #D4AF37, #F2D06B, #D4AF37, #B4941F)', // Richer Gold for White BG
                                                                        WebkitBackgroundClip: 'text',
                                                                        WebkitTextFillColor: 'transparent',
                                                                        fontWeight: '800',
                                                                        fontSize: '0.9rem', // Slightly smaller for better fit
                                                                        display: 'inline-block' // Ensure gradient applies
                                                                    }}>
                                                                        {part}
                                                                    </span>;
                                                                }
                                                                return part;
                                                            })}
                                                        </div>
                                                        {msg.options && (
                                                            <motion.div
                                                                variants={containerVariants}
                                                                initial="hidden"
                                                                animate="show"
                                                                style={{
                                                                    display: 'grid',
                                                                    gridTemplateColumns: 'repeat(2, 1fr)',
                                                                    gap: '8px',
                                                                    marginTop: '10px',
                                                                    width: '100%'
                                                                }}
                                                            >
                                                                {msg.options.map((opt, idx) => (
                                                                    <motion.button
                                                                        key={idx}
                                                                        variants={itemVariants}
                                                                        whileHover={{ scale: 1.02, y: -1 }}
                                                                        whileTap={{ scale: 0.98 }}
                                                                        onClick={() => handleOptionClick(opt.name)}
                                                                        style={{
                                                                            padding: '8px 10px',
                                                                            borderRadius: '10px',
                                                                            border: '1px solid rgba(0,0,0,0.05)',
                                                                            background: '#f8fafc',
                                                                            color: '#1e293b',
                                                                            fontSize: '0.7rem',
                                                                            cursor: 'pointer',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            gap: '8px',
                                                                            transition: 'background 0.2s, border-color 0.2s',
                                                                            fontWeight: '600',
                                                                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                                                                            textAlign: 'left'
                                                                        }}
                                                                        onMouseEnter={(e) => {
                                                                            e.currentTarget.style.background = '#fff';
                                                                            e.currentTarget.style.borderColor = opt.color;
                                                                        }}
                                                                        onMouseLeave={(e) => {
                                                                            e.currentTarget.style.background = '#f8fafc';
                                                                            e.currentTarget.style.borderColor = 'rgba(0,0,0,0.05)';
                                                                        }}
                                                                    >
                                                                        <div style={{
                                                                            color: opt.color,
                                                                            background: `${opt.color}15`,
                                                                            padding: '5px',
                                                                            borderRadius: '6px',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center',
                                                                            flexShrink: 0
                                                                        }}>
                                                                            {opt.icon}
                                                                        </div>
                                                                        <span style={{ lineHeight: '1.2' }}>{opt.name}</span>
                                                                    </motion.button>
                                                                ))}
                                                            </motion.div>
                                                        )}
                                                    </>
                                                ) : (
                                                    msg.text
                                                )}
                                            </div>
                                            <span style={{
                                                fontSize: '0.7rem',
                                                color: '#94a3b8',
                                                marginTop: '4px',
                                                display: 'block',
                                                textAlign: msg.sender === 'user' ? 'right' : 'left'
                                            }}>
                                                {msg.sender === 'bot' ? 'SONA' : 'You'}
                                            </span>
                                        </div>
                                    ))}
                                    {/* Typing Indicator */}
                                    {isTyping && (
                                        <div style={{ alignSelf: 'flex-start', maxWidth: '80%' }}>
                                            <div style={{
                                                padding: '12px 16px',
                                                borderRadius: '12px',
                                                borderTopLeftRadius: '2px',
                                                background: '#fff',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                                display: 'flex',
                                                gap: '4px',
                                                alignItems: 'center',
                                                width: 'fit-content'
                                            }}>
                                                {[0, 1, 2].map((i) => (
                                                    <motion.div
                                                        key={i}
                                                        animate={{
                                                            y: [0, -5, 0],
                                                            opacity: [0.4, 1, 0.4]
                                                        }}
                                                        transition={{
                                                            duration: 0.8,
                                                            repeat: Infinity,
                                                            delay: i * 0.15
                                                        }}
                                                        style={{
                                                            width: '6px',
                                                            height: '6px',
                                                            borderRadius: '50%',
                                                            background: 'var(--color-gold-deep)'
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input Area */}
                                <div style={{ padding: '15px', borderTop: '1px solid rgba(226, 232, 240, 0.5)', background: 'transparent' }}>
                                    <form
                                        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                        style={{ display: 'flex', gap: '10px' }}
                                    >
                                        <input
                                            type="text"
                                            placeholder="Type your message..."
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            disabled={step === 5}
                                            style={{
                                                flex: 1,
                                                padding: '12px',
                                                borderRadius: '24px',
                                                border: '1px solid rgba(226, 232, 240, 0.8)',
                                                outline: 'none',
                                                fontSize: '0.95rem',
                                                background: 'rgba(255, 255, 255, 0.9)'
                                            }}
                                        />
                                        <button
                                            type="submit"
                                            disabled={!input.trim() || step === 5}
                                            style={{
                                                background: 'var(--color-gold-gradient)',
                                                color: 'var(--color-blue-dark)',
                                                border: 'none',
                                                borderRadius: '50%',
                                                width: '45px',
                                                height: '45px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                opacity: (!input.trim() || step === 5) ? 0.5 : 1
                                            }}
                                        >
                                            <Send size={20} />
                                        </button>
                                    </form>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatBot;
