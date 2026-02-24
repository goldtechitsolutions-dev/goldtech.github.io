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
// import TaskManagementPortal from './components/TaskManagementPortal';
import './App.css';
import './components.css';

function App() {
  return (
    <>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/hr" element={<HRPortal />} />
        <Route path="/employee" element={<EmployeePortal />} />
        <Route path="/manager" element={<ManagerPortal />} />
        <Route path="/finance" element={<FinancePortal />} />
        <Route path="/sales" element={<SalesPortal />} />
        <Route path="/client" element={<ClientPortal />} />
        <Route path="/create-profile" element={<CandidatePortal />} />
        <Route path="/project-management" element={<ProjectManagementPortal />} />
        <Route path="/tasks" element={<ProjectManagementPortal />} />
        <Route path="/research" element={<ResearchPortal />} />
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
