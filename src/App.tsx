
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { Toaster } from '@/components/ui/toaster';
import { UserProvider } from '@/contexts/UserContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import AuthLayout from './components/layouts/AuthLayout';
import DashboardLayout from './components/layouts/DashboardLayout';
import NotFound from './pages/NotFound';
import Index from './pages/Index';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import SubmitProject from './pages/SubmitProject';
import ProjectDetail from './pages/ProjectDetail';
import ProjectPayment from './pages/ProjectPayment';
import NotificationExample from './components/examples/NotificationExample';
import PasswordReset from './pages/PasswordReset';
import EmailVerification from './components/auth/EmailVerification';

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <LanguageProvider>
          <Toaster />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/notifications" element={<NotificationExample />} />
            
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/reset-password" element={<PasswordReset />} />
              <Route path="/reset-password/:uid/:token" element={<PasswordReset />} />
              <Route path="/verify-email/:uid/:token" element={<EmailVerification />} />
            </Route>
            
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/submit-project" element={<SubmitProject />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="/projects/:id/payment" element={<ProjectPayment />} />
            </Route>
            
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </LanguageProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
