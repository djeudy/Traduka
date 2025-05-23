
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
    // This is a placeholder for Google login
    // In a real implementation, this would open a Google OAuth popup
    // and then send the token to your backend
    window.location.href = '/api/auth/google/';
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
