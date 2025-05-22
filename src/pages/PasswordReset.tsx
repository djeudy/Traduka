
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { authService } from '@/services/api';
import { Notification } from '@/components/ui/notification';

const PasswordReset = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { uid, token } = useParams();
  
  // If uid and token are present, we're on the reset confirmation page
  const isResetConfirmation = !!uid && !!token;
  
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      return toast({
        title: "Erreur",
        description: "Veuillez entrer votre adresse email",
        variant: "destructive",
      });
    }
    
    setLoading(true);
    
    try {
      const response = await authService.resetPasswordRequest(email);
      
      if (response.error) throw new Error(response.error);
      
      setResetSent(true);
      
      toast({
        title: "Email envoyé",
        description: "Un email a été envoyé avec les instructions pour réinitialiser votre mot de passe.",
      });
      
    } catch (error: any) {
      console.error('Password reset request error:', error);
      toast({
        title: "Échec de la demande",
        description: error.message || "Une erreur s'est produite lors de la demande de réinitialisation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      return toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
    }
    
    if (password !== confirmPassword) {
      return toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      });
    }
    
    setLoading(true);
    
    try {
      const response = await authService.resetPassword(uid!, token!, password);
      
      if (response.error) throw new Error(response.error);
      
      setResetSuccess(true);
      
      toast({
        title: "Réinitialisation réussie",
        description: "Votre mot de passe a été réinitialisé avec succès.",
      });
      
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (error: any) {
      console.error('Password reset confirmation error:', error);
      toast({
        title: "Échec de la réinitialisation",
        description: error.message || "Une erreur s'est produite lors de la réinitialisation du mot de passe",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (resetSent && !isResetConfirmation) {
    return (
      <div className="text-center">
        <Notification 
          variant="success"
          title="Email de réinitialisation envoyé"
          description="Veuillez vérifier votre boîte email pour les instructions de réinitialisation."
          className="mb-6"
        />
        
        <p className="mt-4 text-gray-600">
          Vous n'avez pas reçu d'email? Vérifiez votre dossier de spam ou
        </p>
        <Button 
          variant="link" 
          className="mt-1 text-translation-600"
          onClick={() => {
            setResetSent(false);
          }}
        >
          essayez à nouveau
        </Button>

        <div className="mt-6">
          <Button variant="outline" className="w-full" onClick={() => navigate('/login')}>
            Retour à la page de connexion
          </Button>
        </div>
      </div>
    );
  }
  
  if (resetSuccess) {
    return (
      <div className="text-center">
        <Notification 
          variant="success"
          title="Réinitialisation réussie"
          description="Votre mot de passe a été réinitialisé avec succès. Vous allez être redirigé vers la page de connexion."
          className="mb-6"
        />
        
        <div className="mt-6">
          <Button variant="outline" className="w-full" onClick={() => navigate('/login')}>
            Aller à la page de connexion
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-6">
        {isResetConfirmation ? 'Réinitialiser votre mot de passe' : 'Mot de passe oublié'}
      </h2>
      
      {isResetConfirmation ? (
        <form onSubmit={handleConfirmReset} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Nouveau mot de passe</Label>
            <Input 
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
            <Input 
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <Button type="submit" className="w-full bg-translation-600 hover:bg-translation-700" disabled={loading}>
            {loading ? 'Réinitialisation en cours...' : 'Réinitialiser le mot de passe'}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleRequestReset} className="space-y-4">
          <p className="text-gray-600 mb-4">
            Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </p>
          
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
          
          <Button type="submit" className="w-full bg-translation-600 hover:bg-translation-700" disabled={loading}>
            {loading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
          </Button>
          
          <div className="mt-4 text-center">
            <Button 
              variant="link" 
              className="text-translation-600"
              onClick={() => navigate('/login')}
            >
              Retour à la connexion
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PasswordReset;
