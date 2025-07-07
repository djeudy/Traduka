
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/contexts/LanguageContext';
import SuperTokens, { SuperTokensWrapper } from "supertokens-auth-react";
import { getSuperTokensRoutesForReactRouterDom } from "supertokens-auth-react/ui";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import { EmailPasswordPreBuiltUI } from "supertokens-auth-react/recipe/emailpassword/prebuiltui";
import DashboardLayout from './components/layouts/DashboardLayout';
import NotFound from './pages/NotFound';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import SubmitProject from './pages/SubmitProject';
import ProjectDetail from './pages/ProjectDetail';
import ProjectPayment from './pages/ProjectPayment';
import AdminDashboard from './pages/AdminDashboard';
import NotificationExample from './components/examples/NotificationExample';

function App() {
  return (
    <SuperTokensWrapper>
      <BrowserRouter>
        <LanguageProvider>
          <Toaster />
          <Routes>
            {getSuperTokensRoutesForReactRouterDom(require("react-router-dom"), [EmailPasswordPreBuiltUI])}
            
            <Route path="/" element={<Index />} />
            <Route path="/notifications" element={<NotificationExample />} />
            
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={
                <SessionAuth>
                  <Dashboard />
                </SessionAuth>
              } />
              <Route path="/admin" element={
                <SessionAuth>
                  <AdminDashboard />
                </SessionAuth>
              } />
              <Route path="/submit-project" element={
                <SessionAuth>
                  <SubmitProject />
                </SessionAuth>
              } />
              <Route path="/projects/:id" element={
                <SessionAuth>
                  <ProjectDetail />
                </SessionAuth>
              } />
              <Route path="/projects/:id/payment" element={
                <SessionAuth>
                  <ProjectPayment />
                </SessionAuth>
              } />
            </Route>
            
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </LanguageProvider>
      </BrowserRouter>
    </SuperTokensWrapper>
  );
}

export default App;
