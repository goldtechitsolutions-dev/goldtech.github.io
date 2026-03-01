import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Shield, Server, Code, ChartBar, MapPin, ChevronRight, CheckCircle, ArrowRight } from 'lucide-react';
import '../components.css';

// Capitalize first letter of each word
const formatCityName = (str) => {
    if (!str) return 'Your Area';
    return str.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const LocationSEO = () => {
    const { city } = useParams();
    const formattedCity = formatCityName(city);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        // Dynamic SEO Meta Tags
        document.title = `IT Support & Managed Services in ${formattedCity} | GoldTech IT Solutions`;

        // Update Meta Description
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.name = "description";
            document.head.appendChild(metaDescription);
        }
        metaDescription.content = `Looking for reliable IT support, cybersecurity, and managed IT services in ${formattedCity}? GoldTech IT Solutions provides premium tech solutions tailored for local businesses.`;

        window.scrollTo(0, 0);

        return () => {
            // Optional: reset title on unmount if needed, though usually handled by other page components
            document.title = "GoldTech IT Solutions | Excellence Delivered";
        }
    }, [formattedCity]);

    const localServices = [
        {
            icon: Shield,
            title: `Cybersecurity in ${formattedCity}`,
            description: `Protecting local businesses in ${formattedCity} against advanced cyber threats with zero-trust architecture and 24/7 monitoring.`
        },
        {
            icon: Server,
            title: 'Managed IT Support',
            description: `Reliable, responsive helpdesk and infrastructure management to keep your ${formattedCity} operations running smoothly.`
        },
        {
            icon: Code,
            title: 'Custom Software Development',
            description: `Scalable enterprise applications and custom software solutions designed for the specific needs of your market.`
        },
        {
            icon: ChartBar,
            title: 'Cloud Transformation',
            description: `Seamless migration and management of AWS, Azure, and GCP environments for enhanced agility.`
        }
    ];

    const benefits = [
        `Local expertise understanding the ${formattedCity} business landscape.`,
        "Rapid response times for critical on-site and remote IT issues.",
        "Proactive monitoring to prevent downtime before it happens.",
        "Tailored technology strategies aligned with your local growth goals."
    ];

    return (
        <div className="location-seo-page" style={{ background: '#0f172a', minHeight: '100vh', color: '#f8fafc', paddingBottom: '80px' }}>
            {/* Hero Section */}
            <section style={{
                position: 'relative',
                padding: '120px 20px 80px',
                textAlign: 'center',
                overflow: 'hidden',
                background: 'linear-gradient(180deg, rgba(15, 23, 42, 0) 0%, #0f172a 100%)'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '-20%', left: '-10%', right: '-10%', bottom: '20%',
                    background: 'radial-gradient(circle at center, rgba(212, 175, 55, 0.08) 0%, rgba(15, 23, 42, 0) 70%)',
                    zIndex: 0,
                    pointerEvents: 'none'
                }}></div>

                <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }} className={`fade-in-section ${isVisible ? 'is-visible' : ''}`}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: '20px', color: '#D4AF37', fontSize: '0.9rem', fontWeight: '600', marginBottom: '20px', letterSpacing: '0.05em' }}>
                        <MapPin size={16} /> SERVING {formattedCity.toUpperCase()}
                    </div>
                    <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: '800', marginBottom: '24px', lineHeight: '1.1' }}>
                        Premium IT Solutions & Support in <br />
                        <span style={{ background: 'linear-gradient(90deg, #D4AF37 0%, #FFF 50%, #D4AF37 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundSize: '200% auto', animation: 'shine 3s linear infinite' }}>
                            {formattedCity}
                        </span>
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: '#94a3b8', marginBottom: '40px', maxWidth: '700px', margin: '0 auto 40px', lineHeight: '1.6' }}>
                        Empowering businesses in <strong>{formattedCity}</strong> with enterprise-grade cybersecurity, managed IT services, and innovative digital transformation strategies.
                    </p>
                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/contact" className="premium-button">
                            Get a Free Local Assessment <ArrowRight size={18} />
                        </Link>
                        <Link to="/services" style={{ padding: '15px 30px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', textDecoration: 'none', borderRadius: '30px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'all 0.3s' }}>
                            View Our Services
                        </Link>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '16px' }}>Targeted Solutions for {formattedCity}</h2>
                    <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>We deliver comprehensive technology services designed to drive growth and efficiency for your local enterprise.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
                    {localServices.map((service, index) => {
                        const Icon = service.icon;
                        return (
                            <div key={index} className="service-card" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '40px 30px', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                                <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.05) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4AF37', marginBottom: '24px', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                                    <Icon size={30} />
                                </div>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '16px', color: '#f8fafc' }}>{service.title}</h3>
                                <p style={{ color: '#94a3b8', lineHeight: '1.6', marginBottom: '24px' }}>{service.description}</p>
                                <Link to={`/services/${service.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} style={{ color: '#D4AF37', textDecoration: 'none', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.95rem' }}>
                                    Learn More <ChevronRight size={16} />
                                </Link>
                            </div>
                        )
                    })}
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section style={{ padding: '80px 20px', background: 'rgba(0,0,0,0.2)', marginTop: '40px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        <div className="section-subtitle" style={{ color: '#D4AF37', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.85rem' }}>YOUR LOCAL IT PARTNER</div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: '1.2' }}>Why {formattedCity} Businesses Trust GoldTech</h2>
                        <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: '1.7' }}>
                            We don't just provide software; we engineer success. By partnering with GoldTech, you gain access to a dedicated team that understands the unique challenges of operating in <strong>{formattedCity}</strong>.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {benefits.map((benefit, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                    <CheckCircle size={20} color="#D4AF37" style={{ flexShrink: 0, marginTop: '4px' }} />
                                    <span style={{ color: '#e2e8f0', fontSize: '1.05rem', lineHeight: '1.5' }}>{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
                        {/* Placeholder for local imagery or abstract tech visual */}
                        <div style={{ width: '100%', height: '500px', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ textAlign: 'center' }}>
                                <MapPin size={80} color="rgba(212, 175, 55, 0.4)" style={{ marginBottom: '20px' }} />
                                <h3 style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.5rem' }}>Delivering Excellence to<br />{formattedCity}</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section style={{ padding: '100px 20px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '24px' }}>Ready to Elevate Your IT in {formattedCity}?</h2>
                <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '40px', lineHeight: '1.6' }}>
                    Contact our specialists today to discuss how GoldTech IT Solutions can secure and scale your infrastructure.
                </p>
                <Link to="/contact" className="premium-button" style={{ transform: 'scale(1.05)' }}>
                    Contact Our Local Team
                </Link>
            </section>
        </div>
    );
};

export default LocationSEO;
