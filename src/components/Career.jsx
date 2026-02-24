import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Search, Filter, Code, Database, Globe, Cpu, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import corporateTeam from '../assets/corporate-team.png';

const Career = () => {
    // showForm can be false, 'apply', or 'profile'
    const [showForm, setShowForm] = React.useState(false);
    const [status, setStatus] = React.useState("");
    const [jobs, setJobs] = React.useState([]);
    const [filteredJobs, setFilteredJobs] = React.useState([]);
    const [filters, setFilters] = React.useState({ search: '', department: 'All', type: 'All' });





    React.useEffect(() => {
        // Fetch active jobs from AdminService (async)
        const fetchJobs = async () => {
            const module = await import('../services/adminService');
            const AdminService = module.default;
            const allJobs = await AdminService.getJobs();
            const activeJobs = Array.isArray(allJobs) ? allJobs.filter(job => job.status === 'Active') : [];
            setJobs(activeJobs);
            setFilteredJobs(activeJobs);
        };
        fetchJobs();
    }, []);

    React.useEffect(() => {
        let result = jobs;
        if (filters.search) {
            result = result.filter(job => job.title.toLowerCase().includes(filters.search.toLowerCase()));
        }
        if (filters.department !== 'All') {
            result = result.filter(job => job.department === filters.department);
        }
        if (filters.type !== 'All') {
            result = result.filter(job => job.type === filters.type);
        }
        setFilteredJobs(result);
    }, [filters, jobs]);

    const submitForm = async (ev) => {
        ev.preventDefault();
        const form = ev.target;
        const formData = new FormData(form);
        const currentJob = JSON.parse(localStorage.getItem('currentJob') || '{}');

        // Add extra fields to FormData
        formData.append('role', currentJob.title);
        formData.append('source', 'Career Page');

        try {
            const module = await import('../services/adminService');
            const AdminService = module.default;

            await AdminService.addCandidate(formData);

            form.reset();
            const fileLabel = document.getElementById('file-label');
            if (fileLabel) fileLabel.textContent = "Drag & drop your resume here or browse";

            setStatus("SUCCESS");
            setTimeout(() => {
                setShowForm(false);
                setStatus("");
            }, 3000);
        } catch (error) {
            console.error("Submission error:", error);
            setStatus("ERROR");
        }
    };

    return (
        <section id="career" className="services-section" style={{
            position: 'relative',
            backgroundImage: `url(${corporateTeam})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
        }}>
            {/* Light Overlay */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(240, 248, 255, 0.3)',
                zIndex: 0
            }} />

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                    background: 'var(--color-blue-dark)',
                    borderRadius: '20px',
                    padding: '60px',
                    color: '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    boxShadow: 'var(--shadow-card)',
                    maxWidth: '900px',
                    margin: '0 auto'
                }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        style={{ zIndex: 2, textAlign: 'center', padding: '0 20px', width: '100%' }}
                    >
                        <div style={{ marginBottom: '20px', display: 'inline-block', background: 'rgba(212, 175, 55, 0.1)', padding: '5px 15px', borderRadius: '20px', border: '1px solid rgba(212, 175, 55, 0.3)', color: '#D4AF37', fontWeight: 'bold' }}>
                            CAREERS AT GOLDTECH
                        </div>
                        <h2 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', color: '#fff', lineHeight: '1.2' }}>
                            Building the <span style={{ color: '#D4AF37' }}>Gold Standard</span> of<br /> Fintech Infrastructure.
                        </h2>
                        <p style={{ maxWidth: '700px', margin: '0 auto 2.5rem auto', color: 'rgba(255,255,255,0.8)', fontSize: '1.2rem' }}>
                            Join a team of visionaries. We don't just write code; we architect financial ecosystems that power the future.
                        </p>

                        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '50px' }}>
                            <a href="#open-roles" style={{ textDecoration: 'none' }}>
                                <button style={{
                                    padding: '12px 30px',
                                    background: 'linear-gradient(135deg, #FFD700 0%, #D4AF37 100%)',
                                    color: '#000',
                                    border: 'none',
                                    borderRadius: '30px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    fontSize: '1.1rem',
                                    boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)'
                                }}>
                                    View Open Roles
                                </button>
                            </a>
                            <Link to="/create-profile" style={{ textDecoration: 'none' }}>
                                <button style={{
                                    padding: '12px 30px',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    background: 'rgba(255,255,255,0.1)',
                                    color: '#fff',
                                    borderRadius: '30px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    fontWeight: '500',
                                    fontSize: '1.1rem',
                                    backdropFilter: 'blur(5px)'
                                }}>
                                    Create Profile <ArrowRight size={18} />
                                </button>
                            </Link>
                        </div>

                        {/* Tech Stack Ticker */}
                        <div style={{ marginBottom: '60px', overflow: 'hidden', width: '100%', maxWidth: '900px', margin: '0 auto 60px auto' }}>
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginBottom: '20px', letterSpacing: '1px' }}>POWERED BY MODERN TECH</p>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', color: 'rgba(255,255,255,0.7)' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}><Code size={28} color="#61DAFB" /><span style={{ fontSize: '0.8rem' }}>React</span></div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}><Cpu size={28} color="#fff" /><span style={{ fontSize: '0.8rem' }}>Next.js</span></div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}><Database size={28} color="#00C7B7" /><span style={{ fontSize: '0.8rem' }}>MongoDB</span></div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}><Globe size={28} color="#FF9900" /><span style={{ fontSize: '0.8rem' }}>AWS</span></div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}><Cpu size={28} color="#339933" /><span style={{ fontSize: '0.8rem' }}>Node.js</span></div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}><Database size={28} color="#007ACC" /><span style={{ fontSize: '0.8rem' }}>TypeScript</span></div>
                            </div>
                        </div>



                        {/* Life at GoldTech Section - Enhanced */}
                        <div style={{ marginBottom: '80px', width: '100%', maxWidth: '1000px', margin: '0 auto 80px auto', textAlign: 'center' }}>
                            <h3 style={{ color: '#fff', marginBottom: '40px', fontSize: '2rem' }}>Why You'll Love It Here</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <h4 style={{ margin: '0 0 10px 0', color: '#D4AF37', fontSize: '1.2rem' }}>Flexible & Remote</h4>
                                    <p style={{ margin: 0, fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.5' }}>Work from where you feel most productive. We are a remote-first company with global hubs.</p>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <h4 style={{ margin: '0 0 10px 0', color: '#D4AF37', fontSize: '1.2rem' }}>Uncapped Growth</h4>
                                    <p style={{ margin: 0, fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.5' }}>$1500 annual learning stipend, conference budgets, and internal mentorship programs.</p>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <h4 style={{ margin: '0 0 10px 0', color: '#D4AF37', fontSize: '1.2rem' }}>Wellness First</h4>
                                    <p style={{ margin: 0, fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.5' }}>Comprehensive health, dental, and vision. Plus, monthly mental health days.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Job Search & Filter */}
                    {!showForm && (
                        <div id="open-roles" style={{ marginBottom: '30px', width: '100%', maxWidth: '800px', background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '10px' }}>
                                <input
                                    type="text"
                                    placeholder="Search by role..."
                                    value={filters.search}
                                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.1)', color: '#fff' }}
                                />
                                <select
                                    value={filters.department}
                                    onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.1)', color: '#fff' }}
                                >
                                    <option style={{ color: 'black' }} value="All">All Departments</option>
                                    <option style={{ color: 'black' }} value="Engineering">Engineering</option>
                                    <option style={{ color: 'black' }} value="Product">Product</option>
                                    <option style={{ color: 'black' }} value="Design">Design</option>
                                </select>
                                <select
                                    value={filters.type}
                                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.1)', color: '#fff' }}
                                >
                                    <option style={{ color: 'black' }} value="All">All Types</option>
                                    <option style={{ color: 'black' }} value="Full-time">Full-time</option>
                                    <option style={{ color: 'black' }} value="Contract">Contract</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Active Openings Preview */}
                    {!showForm && (
                        <div style={{ marginBottom: '50px', width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                                {filteredJobs.map(job => (
                                    <div key={job.id} style={{
                                        background: 'rgba(255,255,255,0.05)',
                                        backdropFilter: 'blur(10px)',
                                        padding: '25px',
                                        borderRadius: '15px',
                                        textAlign: 'left',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        transition: 'transform 0.2s',
                                        cursor: 'pointer'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                            <span style={{
                                                background: job.status === 'Active' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(234, 179, 8, 0.2)',
                                                color: job.status === 'Active' ? '#86efac' : '#fde047',
                                                padding: '4px 10px',
                                                borderRadius: '20px',
                                                fontSize: '0.75rem',
                                                fontWeight: 'bold',
                                                textTransform: 'uppercase'
                                            }}>{job.department}</span>
                                            {job.salaryRange && (
                                                <span style={{ color: '#86efac', fontWeight: 'bold', fontSize: '0.9rem' }}>{job.salaryRange}</span>
                                            )}
                                        </div>

                                        <h4 style={{ margin: '0 0 5px 0', fontSize: '1.25rem', color: '#fff' }}>{job.title}</h4>
                                        <p style={{ margin: '0 0 15px 0', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>{job.location} • {job.type} • {job.experience || 'Exp: N/A'}</p>

                                        {/* Tech Stack Tags */}
                                        {job.techStack && (
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '15px' }}>
                                                {job.techStack.map((tech, i) => (
                                                    <span key={i} style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.1)', color: '#D4AF37', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {job.description && (
                                            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '20px', lineHeight: '1.5' }}>
                                                {job.description}
                                            </p>
                                        )}

                                        <button onClick={() => { localStorage.setItem('currentJob', JSON.stringify(job)); setShowForm(true); }} style={{
                                            width: '100%',
                                            padding: '12px',
                                            background: '#fff',
                                            color: '#000',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}>
                                            Apply Now <ArrowRight size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Enhanced Application Form */}
                    {showForm && (
                        <div style={{ width: '100%', maxWidth: '800px', background: 'rgba(255,255,255,0.05)', padding: '40px', borderRadius: '20px', margin: '0 auto', textAlign: 'left', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                                <h3 style={{ margin: 0, fontSize: '1.8rem', color: '#fff' }}>Apply for {JSON.parse(localStorage.getItem('currentJob') || '{}').title}</h3>
                                <button onClick={() => setShowForm(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1rem' }}>Cancel</button>
                            </div>



                            <form onSubmit={submitForm} style={{ display: 'grid', gap: '20px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <input name="name" type="text" placeholder="Full Name *" required style={{ padding: '15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }} />
                                    <input name="email" type="email" placeholder="Email Address *" required style={{ padding: '15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <input name="phone" type="text" placeholder="Phone Number *" required style={{ padding: '15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }} />
                                    <input name="experience" type="number" placeholder="Years of Experience *" required style={{ padding: '15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <input name="linkedin" type="text" placeholder="LinkedIn Profile URL" style={{ padding: '15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }} />
                                    <input name="portfolio" type="text" placeholder="Portfolio/GitHub URL" style={{ padding: '15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }} />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '10px', color: '#D4AF37', fontWeight: '500' }}>Screening Question: Describe a time you solved a complex technical problem.</label>
                                    <textarea name="screening" placeholder="Tell us about the problem, your approach, and the outcome..." required style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', minHeight: '120px' }}></textarea>
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '10px', color: '#fff' }}>Upload Resume *</label>
                                    <input
                                        type="file"
                                        name="resume"
                                        required
                                        id="resume-upload"
                                        style={{ display: 'none' }}
                                        onChange={(e) => {
                                            const fileName = e.target.files[0]?.name;
                                            if (fileName) {
                                                document.getElementById('file-label').textContent = fileName;
                                            }
                                        }}
                                    />
                                    <div
                                        onClick={() => document.getElementById('resume-upload').click()}
                                        style={{ border: '2px dashed rgba(255,255,255,0.2)', borderRadius: '8px', padding: '30px', textAlign: 'center', color: '#94a3b8', cursor: 'pointer' }}
                                    >
                                        <span id="file-label">Drag & drop your resume here or <span style={{ color: '#D4AF37' }}>browse</span></span>
                                    </div>
                                </div>

                                {status === "SUCCESS" && (
                                    <div style={{ padding: '15px', background: 'rgba(34, 197, 94, 0.1)', color: '#86efac', borderRadius: '8px', border: '1px solid rgba(34, 197, 94, 0.2)', textAlign: 'center', fontWeight: 'bold' }}>
                                        Application Submitted Successfully! Our team will contact you soon.
                                    </div>
                                )}
                                {status === "ERROR" && (
                                    <div style={{ padding: '15px', background: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)', textAlign: 'center', fontWeight: 'bold' }}>
                                        There was an error submitting your application. Please try again.
                                    </div>
                                )}

                                <button type="submit" disabled={status === "SUCCESS"} style={{
                                    marginTop: '20px',
                                    padding: '15px',
                                    background: status === "SUCCESS" ? '#1e293b' : 'linear-gradient(135deg, #FFD700 0%, #D4AF37 100%)',
                                    color: status === "SUCCESS" ? '#94a3b8' : '#000',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: 'bold',
                                    fontSize: '1.1rem',
                                    cursor: status === "SUCCESS" ? 'default' : 'pointer',
                                    opacity: status === "SUCCESS" ? 0.7 : 1
                                }}>
                                    {status === "SUCCESS" ? "Application Received" : "Submit Application"}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Career;
