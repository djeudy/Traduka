
import React from 'react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface EmailVerificationPendingProps {
  email?: string;
}

const EmailVerificationPending: React.FC<EmailVerificationPendingProps> = ({ email }) => {
  const { logout } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleResendVerification = async () => {
    try {
      // Implement resend verification logic
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/auth/resend-activation/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email })
      });
      
      if (response.ok) {
        toast({
          title: "Email envoyé",
          description: "Un nouveau lien de vérification a été envoyé à votre adresse email.",
          className: "bg-green-50 border-green-200 text-green-800",
        });
      } else {
        toast({
          title: "Erreur",
          description: "Impossible d'envoyer l'email de vérification.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error resending verification email:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de l'email.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Vérification d'email requise</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p>
            Veuillez vérifier votre adresse email avant de continuer.
            Un lien de vérification a été envoyé à <strong>{email}</strong>.
          </p>
          <p className="text-sm text-gray-500">
            Si vous ne trouvez pas l'email, vérifiez votre dossier spam ou cliquez sur le bouton ci-dessous pour renvoyer l'email de vérification.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button onClick={handleResendVerification} className="w-full">
          Renvoyer l'email de vérification
        </Button>
        <Button onClick={() => logout()} variant="outline" className="w-full">
          Déconnexion
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmailVerificationPending;
