import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { authService } from '@/services/api';
import { UserRole } from '@/types';

interface GoogleSignInButtonProps {
  onLoading?: (loading: boolean) => void;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ onLoading }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUser } = useUser();

  useEffect(() => {
    const initializeGoogleSignIn = async () => {
      try {
        // Load Google Sign-In script if not already loaded
        if (!window.google) {
          const script = document.createElement('script');
          script.src = 'https://accounts.google.com/gsi/client';
          script.async = true;
          script.defer = true;
          
          await new Promise<void>((resolve, reject) => {
            script.onload = () => {
              // Wait a bit for Google to fully initialize
              setTimeout(() => {
                if (window.google) {
                  resolve();
                } else {
                  reject(new Error('Google Sign-In failed to initialize'));
                }
              }, 100);
            };
            script.onerror = () => reject(new Error('Failed to load Google Sign-In script'));
            document.head.appendChild(script);
          });
        }

        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        if (!clientId) {
          console.error('Google Client ID not configured');
          return;
        }

        // Initialize Google Sign-In
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response: { credential: string }) => {
            if (onLoading) onLoading(true);
            
            try {
              const result = await authService.googleLogin(response.credential);
              
              if (result.error) throw new Error(result.error);
              
              if (result.data) {
                setUser({
                  id: result.data.user.id,
                  email: result.data.user.email,
                  name: result.data.user.name || result.data.user.email,
                  company: result.data.user.company,
                  role: result.data.user.role as UserRole
                });
                
                toast({
                  title: "Connexion réussie",
                  description: "Bienvenue sur votre tableau de bord",
                });
                
                navigate('/dashboard');
              }
            } catch (error: any) {
              console.error('Google login error:', error);
              toast({
                title: "Échec de la connexion Google",
                description: error.message || "Une erreur est survenue",
                variant: "destructive",
              });
            } finally {
              if (onLoading) onLoading(false);
            }
          },
          auto_select: false,
          cancel_on_tap_outside: false,
        });

        // Render the Google Sign-In button
        if (containerRef.current) {
          containerRef.current.innerHTML = ''; // Clear any existing content
          
          window.google.accounts.id.renderButton(containerRef.current, {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'signin_with',
            shape: 'rectangular',
          });
        }
      } catch (error) {
        console.error('Error initializing Google Sign-In:', error);
        toast({
          title: "Erreur Google Sign-In",
          description: "Impossible d'initialiser Google Sign-In. Vérifiez votre configuration.",
          variant: "destructive",
        });
      }
    };

    initializeGoogleSignIn();
  }, [navigate, toast, setUser, onLoading]);

  return (
    <div className="w-full mt-6 space-y-4">
      <p className="text-center text-sm text-slate-500">Ou connectez-vous avec</p>
      
      <div className="mt-4">
        <div ref={containerRef} className="w-full" />
      </div>
    </div>
  );
};

export default GoogleSignInButton;