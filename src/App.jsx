import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import PortalAuth from './components/PortalAuth';

const AboutPage = lazy(() => import('./components/AboutPage'));
const ServiceDetail = lazy(() => import('./components/ServiceDetail'));
const IndustryDetail = lazy(() => import('./components/IndustryDetail'));
const InsightDetail = lazy(() => import('./components/InsightDetail'));
const Services = lazy(() => import('./components/Services'));
const Industries = lazy(() => import('./components/Industries'));
const Insights = lazy(() => import('./components/Insights'));

const Products = lazy(() => import('./components/Products'));
const Career = lazy(() => import('./components/Career'));
const ContactForm = lazy(() => import('./components/ContactForm'));
const LocationSEO = lazy(() => import('./components/LocationSEO'));
const Admin = lazy(() => import('./components/Admin'));
const HRPortal = lazy(() => import('./components/HRPortal'));
const EmployeePortal = lazy(() => import('./components/EmployeePortal'));
const ManagerPortal = lazy(() => import('./components/ManagerPortal'));
const FinancePortal = lazy(() => import('./components/FinancePortal'));
const SalesPortal = lazy(() => import('./components/SalesPortal'));
const ClientPortal = lazy(() => import('./components/ClientPortal'));
const CandidatePortal = lazy(() => import('./components/CandidatePortal'));
const ProjectManagementPortal = lazy(() => import('./components/ProjectManagementPortal'));
const ResearchPortal = lazy(() => import('./components/ResearchPortal'));

import './App.css';
import './components.css';

const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f172a', color: '#D4AF37' }}>
    <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid rgba(212, 175, 55, 0.3)', borderTop: '4px solid #D4AF37', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
  </div>
);

function App() {
  return (
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
  );
}

export default App;
