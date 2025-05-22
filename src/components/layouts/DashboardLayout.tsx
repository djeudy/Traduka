
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Bell, MessageSquare, File, Settings, LogOut, Menu, Shield } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useToast } from '@/hooks/use-toast';
import EmailVerificationPending from '@/components/auth/EmailVerificationPending';

const DashboardLayout = () => {
  const { user, loading, isEmailVerified,logout } = useUser();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const { toast } = useToast();
  
  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-customBlue"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }else if (!isEmailVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
        <EmailVerificationPending email={user.email} />
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      // Using the API service instead of Supabase
      logout();
      
      // toast({
      //   title: "Déconnecté",
      //   description: "Vous avez été déconnecté avec succès",
      // });
    } catch (error) {
      console.error('Logout error:', error);
      
      toast({
        title: "Erreur de déconnexion",
        description: "Une erreur est survenue lors de la déconnexion",
        variant: "destructive",
      });
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-customBlue text-white' : 'text-white/80 hover:bg-customBlue/50';
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden bg-customBlue w-full p-4 flex items-center justify-between fixed top-0 z-30 shadow-md">
        <Link to="/dashboard" className="flex items-center gap-2 text-white">
          <span className="font-bold text-xl">Traduka</span>
        </Link>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Button variant="ghost" size="icon" className="text-white" onClick={toggleMobileMenu}>
            <Menu size={24} />
          </Button>
        </div>
      </header>

      {/* Sidebar - Fixed on desktop, slide-in on mobile */}
      <aside className={`bg-customBlue w-full md:w-64 md:min-h-screen p-4 flex flex-col fixed md:sticky top-0 z-20 h-screen transition-transform duration-300 ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="flex justify-between items-center md:flex-col md:items-start mb-6 pt-0 md:pt-4">
          <Link to="/dashboard" className="flex items-center gap-2 text-white">
            <span className="font-bold text-xl">Traduka</span>
          </Link>
          <div className="flex items-center gap-2 md:mt-4 md:self-end">
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>
            <Button variant="ghost" size="icon" className="md:hidden text-white" onClick={toggleMobileMenu}>
              <Bell size={20} />
            </Button>
          </div>
        </div>
        
        <nav className="flex flex-col gap-1 flex-1 mt-4">
          <Link 
            to="/dashboard" 
            className={`px-4 py-2 rounded-md flex items-center gap-3 ${isActive('/dashboard')}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <File size={18} />
            <span>{t('navigation.projects')}</span>
          </Link>
          
          {/* Only show submit project for clients and admins */}
          {(user.role === 'client' || user.role === 'admin') && (
            <Link 
              to="/submit-project" 
              className={`px-4 py-2 rounded-md flex items-center gap-3 ${isActive('/submit-project')}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <MessageSquare size={18} />
              <span>{t('navigation.newProject')}</span>
            </Link>
          )}

          {/* Admin access to user management */}
          {user.role === 'admin' && (
            <Link 
              to="/admin" 
              className={`px-4 py-2 rounded-md flex items-center gap-3 ${isActive('/admin')}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Shield size={18} />
              <span>Administration</span>
            </Link>
          )}
        </nav>
        
        <div className="mt-auto">
          <div className="border-t border-white/20 pt-4 mt-4">
            <div className="flex items-center gap-3 px-4 py-2">
              <div className="w-8 h-8 rounded-full bg-white text-customBlue flex items-center justify-center font-semibold">
                {user?.name?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                <p className="text-xs text-white/60 truncate">{user.email}</p>
              </div>
            </div>
            <div className="flex flex-col gap-1 mt-2">
              <div className="text-xs text-white/40 px-4">
                Role: {user?.role?.charAt(0).toUpperCase() + user.role.slice(1)}
              </div>
              <Button variant="ghost" size="sm" className="justify-start text-white/80 hover:bg-customBlue/50 px-4 py-2 h-auto">
                <Settings size={16} className="mr-3" />
                <span>{t('navigation.settings')}</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="justify-start text-white/80 hover:bg-customBlue/50 px-4 py-2 h-auto"
                onClick={handleLogout}
              >
                <LogOut size={16} className="mr-3" />
                <span>{t('navigation.logout')}</span>
              </Button>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Backdrop for mobile menu */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-10 md:hidden" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      {/* Main content - with padding on mobile to account for fixed header */}
      <main className="flex-1 p-4 md:p-6 bg-slate-50 mt-16 md:mt-0 w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
