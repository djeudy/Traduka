
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';
import { setupDemoAccounts } from '@/utils/demoAccounts';

const Login = () => {
  // Initialize demo accounts
  useEffect(() => {
    setupDemoAccounts();
  }, []);
  
  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-6">Connexion</h2>
      
      <LoginForm />
      

      
      <div className="mt-6 text-center">
        <p className="text-sm text-slate-500">
          Pas encore de compte ?{' '}
          <Link to="/signup" className="text-translation-600 hover:underline">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
