
import { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

const AuthLayout = () => {
  const { user } = useUser();
  const { t } = useLanguage();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      toast({
        title: t('auth.alreadyLoggedIn'),
        description: t('auth.redirectingToDashboard'),
        className: "bg-blue-50 border-blue-200 text-blue-800",
      });
    }
  }, [user, toast, t]);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-translation-900 to-translation-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="text-center mb-8">
            {/* <h1 className="text-2xl font-bold text-translation-900">Traduka</h1> */}
            <img src=''/>
            {/* <p className="text-slate-500">Gestion de projets de traduction</p> */}
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
