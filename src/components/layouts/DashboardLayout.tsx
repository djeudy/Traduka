
import { Outlet } from 'react-router-dom';
import { Menubar, MenubarMenu, MenubarTrigger } from '@/components/ui/menubar';
import { Link } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import UserMenu from '@/components/user/UserMenu';

const DashboardLayout = () => {
  const { user } = useUser();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Menubar className="rounded-none border-b border-gray-200 px-2 lg:px-4">
        <MenubarMenu>
          <MenubarTrigger className="font-bold">
            <Link to="/dashboard" className="flex items-center">
              <span className="text-translation-600">Translate</span>
              <span className="text-gray-800">Pro</span>
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
