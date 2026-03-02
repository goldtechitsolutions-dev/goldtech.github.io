import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import PortalAuth from './components/PortalAuth';

const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f172a', color: '#D4AF37' }}>
    <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid rgba(212, 175, 55, 0.3)', borderTop: '4px solid #D4AF37', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
  </div>
);

// Helper to handle ChunkLoadError on deployments
const lazyWithRetry = (importFn) =>
  lazy(async () => {
    const pageHasBeenForceRefreshed = JSON.parse(
      window.localStorage.getItem('page-has-been-force-refreshed') || 'false'
    );

    try {
      const component = await importFn();
      window.localStorage.setItem('page-has-been-force-refreshed', 'false');
      return component;
    } catch (error) {
      if (!pageHasBeenForceRefreshed) {
        window.localStorage.setItem('page-has-been-force-refreshed', 'true');
        return window.location.reload();
      }
      throw error;
    }
  });

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', textAlign: 'center', background: '#0f172a', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 style={{ color: '#D4AF37' }}>Something went wrong.</h2>
          <p>The application was updated. Please refresh to continue.</p>
          <button
            onClick={() => window.location.reload()}
            style={{ padding: '10px 20px', background: '#D4AF37', border: 'none', borderRadius: '4px', cursor: 'pointer', color: '#000', fontWeight: 'bold', width: 'fit-content', margin: '20px auto' }}
          >
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const AboutPage = lazyWithRetry(() => import('./components/AboutPage'));
const ServiceDetail = lazyWithRetry(() => import('./components/ServiceDetail'));
const IndustryDetail = lazyWithRetry(() => import('./components/IndustryDetail'));
const InsightDetail = lazyWithRetry(() => import('./components/InsightDetail'));
const Services = lazyWithRetry(() => import('./components/Services'));
const Industries = lazyWithRetry(() => import('./components/Industries'));
const Insights = lazyWithRetry(() => import('./components/Insights'));

const Products = lazyWithRetry(() => import('./components/Products'));
const Career = lazyWithRetry(() => import('./components/Career'));
const ContactForm = lazyWithRetry(() => import('./components/ContactForm'));
const LocationSEO = lazyWithRetry(() => import('./components/LocationSEO'));
const Admin = lazyWithRetry(() => import('./components/Admin'));
const HRPortal = lazyWithRetry(() => import('./components/HRPortal'));
const EmployeePortal = lazyWithRetry(() => import('./components/EmployeePortal'));
const ManagerPortal = lazyWithRetry(() => import('./components/ManagerPortal'));
const FinancePortal = lazyWithRetry(() => import('./components/FinancePortal'));
const SalesPortal = lazyWithRetry(() => import('./components/SalesPortal'));
const ClientPortal = lazyWithRetry(() => import('./components/ClientPortal'));
const CandidatePortal = lazyWithRetry(() => import('./components/CandidatePortal'));
const ProjectManagementPortal = lazyWithRetry(() => import('./components/ProjectManagementPortal'));
const ResearchPortal = lazyWithRetry(() => import('./components/ResearchPortal'));

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/admin" element={<PortalAuth key="admin" portalName="Admin portal"><Admin /></PortalAuth>} />

          {/* Managed Portals with Auth */}
          <Route path="/hr" element={<PortalAuth key="hr" portalName="HR portal"><HRPortal /></PortalAuth>} />
          <Route path="/employee" element={<PortalAuth key="employee" portalName="Employee portal"><EmployeePortal /></PortalAuth>} />
          <Route path="/manager" element={<PortalAuth key="manager" portalName="Manager portal"><ManagerPortal /></PortalAuth>} />
          <Route path="/finance" element={<PortalAuth key="finance" portalName="Finance portal"><FinancePortal /></PortalAuth>} />
          <Route path="/sales" element={<PortalAuth key="sales" portalName="Sales portal"><SalesPortal /></PortalAuth>} />
          <Route path="/project-management" element={<PortalAuth key="pm" portalName="Project-management"><ProjectManagementPortal /></PortalAuth>} />
          <Route path="/tasks" element={<PortalAuth key="tasks" portalName="Tasks portal"><ProjectManagementPortal /></PortalAuth>} />
          <Route path="/research" element={<PortalAuth key="research" portalName="Research & development portal"><ResearchPortal /></PortalAuth>} />

          <Route path="/client" element={<PortalAuth key="client" portalName="Client portal"><ClientPortal /></PortalAuth>} />
          <Route path="/create-profile" element={<CandidatePortal />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />

            {/* Detail Pages */}
            <Route path="services/:id" element={<ServiceDetail />} />
            <Route path="industries/:id" element={<IndustryDetail />} />
            <Route path="insights/:id" element={<InsightDetail />} />

            {/* Main Section Pages */}
            <Route path="services" element={<Services />} />
            <Route path="industries" element={<Industries />} />
            <Route path="insights" element={<Insights />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="products" element={<Products />} />
            <Route path="career" element={<Career />} />
            <Route path="contact" element={<ContactForm />} />
            <Route path="locations/:city" element={<LocationSEO />} />

            {/* Fallback route - go to home */}
            <Route path="*" element={<Home />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
