
import { Outlet } from 'react-router-dom';
import { Menubar, MenubarMenu, MenubarTrigger } from '@/components/ui/menubar';
import { Link } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import UserMenu from '@/components/user/UserMenu';

const DashboardLayout = () => {
  const { user } = useUser();
  
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
          </MenubarTrigger>
        </MenubarMenu>
        
        <div className="ml-auto flex items-center space-x-4">
          <UserMenu />
        </div>
      </Menubar>
      
      <main className="container mx-auto py-8 px-4">
        <Outlet />
      </main>
      
      <footer className="py-6 px-4 border-t mt-20">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} TranslatePro. Tous droits réservés.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-sm text-gray-500 hover:text-translation-600">
              Conditions d'utilisation
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-translation-600">
              Confidentialité
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-translation-600">
              Aide et support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;
