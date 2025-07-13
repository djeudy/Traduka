import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { API_BASE_URL } from '@/config/api';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUser } = useUser();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const error = urlParams.get('error');

        if (error) {
          toast({
            title: "Erreur d'authentification",
            description: error,
            variant: "destructive",
          });
          navigate('/login');
          return;
        }

        if (token) {
          // Store the token and user data
          localStorage.setItem('authToken', token);
          
          // Fetch user data
          const response = await fetch(`${API_BASE_URL}/api/auth/user/`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            localStorage.setItem('userData', JSON.stringify(userData));
            setUser(userData);
            
            toast({
              title: "Connexion réussie",
              description: "Vous êtes maintenant connecté avec Google",
            });
            
            navigate('/dashboard');
          } else {
            throw new Error('Failed to fetch user data');
          }
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Google callback error:', error);
        toast({
          title: "Erreur de connexion",
          description: "Une erreur est survenue lors de la connexion",
          variant: "destructive",
        });
        navigate('/login');
      }
    };

    handleGoogleCallback();
  }, [navigate, toast, setUser]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-translation-900 to-translation-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-6 sm:p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-translation-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Connexion en cours...</p>
        </div>
      </div>
    </div>
  );
};

export default GoogleCallback;