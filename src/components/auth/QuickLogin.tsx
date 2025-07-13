
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@/contexts/UserContext';
import { authService } from '@/services/api';

interface QuickLoginProps {
  disabled: boolean;
}

const QuickLogin: React.FC<QuickLoginProps> = ({ disabled }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // Redirect to Django Google OAuth endpoint
      const { API_BASE_URL } = await import('@/config/api');
      window.location.href = `${API_BASE_URL}/api/auth/google/`;
    } catch (error) {
      console.error('Google login error:', error);
      toast({
        title: "Erreur de connexion",
        description: "Impossible de se connecter avec Google",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 space-y-4">
      <p className="text-center text-sm text-slate-500">Ou connectez-vous avec</p>
      
      <div className="grid gap-2">
        <Button
          variant="outline"
          onClick={handleGoogleLogin}
          disabled={disabled || loading}
          className="flex items-center justify-center gap-2"
        >
          <img 
            src="https://developers.google.com/identity/images/g-logo.png" 
            alt="Google"
            className="w-5 h-5"
          />
          Google
        </Button>
      </div>
    </div>
  );
};

export default QuickLogin;
