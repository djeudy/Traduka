
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { Notification } from '@/components/ui/notification';

const EmailVerification: React.FC = () => {
  const { uid, token } = useParams<{ uid: string, token: string }>();
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { verifyEmail } = useUser();
  
  useEffect(() => {
    const verifyEmailToken = async () => {
      if (uid && token) {
        try {
          const result = await verifyEmail(uid, token);
          setSuccess(result);
          
          if (result) {
            toast({
              title: "Email vérifié",
              description: "Votre adresse e-mail a été vérifiée avec succès.",
              className: "bg-green-50 border-green-200 text-green-800",
            });
          } else {
            toast({
              title: "Échec de la vérification",
              description: "Le lien de vérification est invalide ou a expiré.",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error('Verification error:', error);
          setSuccess(false);
          toast({
            title: "Erreur",
            description: "Une erreur est survenue lors de la vérification.",
            variant: "destructive",
          });
        } finally {
          setVerifying(false);
        }
      } else {
        setVerifying(false);
        setSuccess(false);
      }
    };
    
    verifyEmailToken();
  }, [uid, token, verifyEmail, toast]);
  
  const handleContinue = () => {
    navigate('/dashboard');
  };
  
  const handleLogin = () => {
    navigate('/login');
  };
  
  if (verifying) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Vérification en cours...</h2>
        <p className="text-gray-500">Veuillez patienter pendant la vérification de votre email.</p>
      </div>
    );
  }
  
  return (
    <div className="text-center">
      {success ? (
        <>
          <Notification
            variant="success"
            title="Vérification réussie"
            description="Votre adresse e-mail a été vérifiée avec succès."
            className="mb-4"
          />
          <Button onClick={handleContinue} className="w-full bg-translation-600 hover:bg-translation-700">
            Continuer vers le tableau de bord
          </Button>
        </>
      ) : (
        <>
          <Notification
            variant="error"
            title="Échec de la vérification"
            description="Le lien de vérification est invalide ou a expiré."
            className="mb-4"
          />
          <Button onClick={handleLogin} className="w-full bg-translation-600 hover:bg-translation-700">
            Retourner à la connexion
          </Button>
        </>
      )}
    </div>
  );
};

export default EmailVerification;
