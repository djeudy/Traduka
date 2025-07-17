
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { authService } from '@/services/api';
import { UserRole } from '@/types';
import { Notification } from '@/components/ui/notification';
import GoogleSignInButton from './GoogleSignInButton';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUser } = useUser();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      return toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
    }
    
    setLoading(true);
    
    try {
      const response = await authService.login(email, password);
      
      if (response.error) throw new Error(response.error);

      if (response.data) {
        // Save tokens to localStorage
        localStorage.setItem('authToken', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);
        
        // Save user data to localStorage
        localStorage.setItem('userData', JSON.stringify({
          ...response.data.user,
          email_verified: response.data.user.email_verified || false
        }));
        
        // Determine the user role from the API response
        const userRole = response.data.user.role || 'client';
        
        // Check if email is verified
        const emailVerified = response.data.user.email_verified || false;
        
        setUser({
          id: response.data.user.id,
          email: response.data.user.email,
          name: response.data.user.name || response.data.user.email,
          company: response.data.user.company,
          role: userRole as UserRole
        });
        
        if (!emailVerified) {
          setNeedsVerification(true);
          toast({
            title: "Vérification requise",
            description: "Un email de vérification a été envoyé à votre adresse.",
            className: "bg-yellow-50 border-yellow-200 text-yellow-800",
          });
        } else {
          toast({
            title: "Connexion réussie",
            description: "Bienvenue sur votre tableau de bord",
          });
          
          navigate('/dashboard');
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Échec de la connexion",
        description: error.message || "Email ou mot de passe incorrect",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = () => {
    navigate('/reset-password');
  };

  const handleResendVerification = async () => {
    if (!email) {
      return toast({
        title: "Erreur",
        description: "Veuillez entrer votre email",
        variant: "destructive",
      });
    }
    
    setLoading(true);
    
    try {
      const response = await authService.resendVerificationEmail(email);
      
      if (response.error) throw new Error(response.error);
      
      toast({
        title: "Email envoyé",
        description: "Un nouvel email de vérification a été envoyé.",
      });
    } catch (error: any) {
      console.error('Resend verification error:', error);
      toast({
        title: "Échec de l'envoi",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      {needsVerification && (
        <Notification
          variant="warning"
          title="Vérification d'email requise"
          description="Veuillez vérifier votre boîte de réception et cliquer sur le lien de vérification."
          className="mb-4"
        />
      )}
    
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email"
            type="email"
            placeholder="votre@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Mot de passe</Label>
            <Button
              type="button"
              variant="link"
              className="text-sm text-translation-600 hover:underline"
              onClick={handlePasswordReset}
            >
              Mot de passe oublié ?
            </Button>
          </div>
          <Input 
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>
        
        <Button type="submit" className="w-full bg-translation-600 hover:bg-translation-700" disabled={loading}>
          {loading ? 'Connexion en cours...' : 'Se connecter'}
        </Button>
        
        {needsVerification && (
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleResendVerification}
            disabled={loading}
          >
            Renvoyer l'email de vérification
          </Button>
        )}
      </form>
      
      <GoogleSignInButton onLoading={setLoading} />
    </>
  );
};

export default LoginForm;
