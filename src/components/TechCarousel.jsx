import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Server, Shield, Database, Cpu, Globe } from 'lucide-react';

const icons = [
    { Icon: Code, color: '#D4AF37' },     // Gold
    { Icon: Server, color: '#003366' },   // Blue
    { Icon: Shield, color: '#F2D06B' },   // Light Gold
    { Icon: Database, color: '#00509E' }, // Blue Accent
    { Icon: Cpu, color: '#AA8C2C' },      // Dark Gold
    { Icon: Globe, color: '#001F3F' }     // Dark Blue
];

const TechCarousel = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % icons.length);
        }, 2500);
        return () => clearInterval(timer);
    }, []);

    const CurrentIcon = icons[index].Icon;

    return (
        <div className="tech-carousel-container" style={{
            perspective: '1200px', // Increased perspective
            width: '180px', // Increased size
            height: '180px',
            position: 'relative',
            marginBottom: '3rem',
            transformStyle: 'preserve-3d'
        }}>
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={index}
                    initial={{ rotateY: -180, scale: 0.5, opacity: 0, z: -200 }}
                    animate={{ rotateY: 0, scale: 1, opacity: 1, z: 0 }}
                    exit={{ rotateY: 180, scale: 0.5, opacity: 0, z: -200 }}
                    transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 20
                    }}
                    style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)',
                        borderRadius: '30px',
                        boxShadow: `0 10px 40px ${icons[index].color}50`,
                        border: `2px solid ${icons[index].color}`,
                        position: 'absolute',
                        backdropFilter: 'blur(5px)'
                    }}
                >
                    <CurrentIcon
                        size={90}
                        color={icons[index].color}
                        strokeWidth={1.5}
                        style={{ filter: `drop-shadow(0 0 10px ${icons[index].color})` }}
                    />
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default TechCarousel;
