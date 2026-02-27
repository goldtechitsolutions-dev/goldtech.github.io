import { Routes, Route } from 'react-router-dom';
import AboutPage from './components/AboutPage';
import Layout from './components/Layout';
import Home from './components/Home';
import ServiceDetail from './components/ServiceDetail';
import IndustryDetail from './components/IndustryDetail';
import InsightDetail from './components/InsightDetail';
import Services from './components/Services';
import Industries from './components/Industries';
import Insights from './components/Insights';

import Products from './components/Products';
import Career from './components/Career';
import ContactForm from './components/ContactForm';
import Admin from './components/Admin';
import HRPortal from './components/HRPortal';
import EmployeePortal from './components/EmployeePortal';
import ManagerPortal from './components/ManagerPortal';
import FinancePortal from './components/FinancePortal';
import SalesPortal from './components/SalesPortal';
import ClientPortal from './components/ClientPortal';
import CandidatePortal from './components/CandidatePortal';
import ProjectManagementPortal from './components/ProjectManagementPortal';
import ResearchPortal from './components/ResearchPortal';
import PortalAuth from './components/PortalAuth';
import './App.css';
import './components.css';

function App() {
  return (
    <>
      <Routes>
        <Route path="/admin" element={<PortalAuth portalName="Admin portal"><Admin /></PortalAuth>} />

        {/* Managed Portals with Auth */}
        <Route path="/hr" element={<PortalAuth portalName="HR portal"><HRPortal /></PortalAuth>} />
        <Route path="/employee" element={<PortalAuth portalName="Employee portal"><EmployeePortal /></PortalAuth>} />
        <Route path="/manager" element={<PortalAuth portalName="Manager portal"><ManagerPortal /></PortalAuth>} />
        <Route path="/finance" element={<PortalAuth portalName="Finance portal"><FinancePortal /></PortalAuth>} />
        <Route path="/sales" element={<PortalAuth portalName="Sales portal"><SalesPortal /></PortalAuth>} />
        <Route path="/project-management" element={<PortalAuth portalName="Project-management"><ProjectManagementPortal /></PortalAuth>} />
        <Route path="/tasks" element={<PortalAuth portalName="Tasks portal"><ProjectManagementPortal /></PortalAuth>} />
        <Route path="/research" element={<PortalAuth portalName="Research & development portal"><ResearchPortal /></PortalAuth>} />

        <Route path="/client" element={<PortalAuth portalName="Client portal"><ClientPortal /></PortalAuth>} />
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

          {/* Fallback route - go to home */}
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
