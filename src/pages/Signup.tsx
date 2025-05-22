
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { authService } from '@/services/api';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, CheckCircle2 } from "lucide-react";
import { Notification } from '@/components/ui/notification';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  
  const { success, error } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      return error(
        "Erreur",
        "Veuillez remplir tous les champs obligatoires"
      );
    }
    
    if (password !== confirmPassword) {
      return error(
        "Erreur",
        "Les mots de passe ne correspondent pas"
      );
    }
    
    setLoading(true);
    
    try {
      const response = await authService.signup(name, email, company || null, password,confirmPassword);
      
      if (response.error) throw new Error(response.error);
      
      setSignupSuccess(true);
      
      success(
        "Inscription réussie",
        "Veuillez vérifier votre boîte email pour confirmer votre compte"
      );
      
    } catch (error: any) {
      console.error('Signup error:', error);
      error(
        "Échec de l'inscription",
        error.message || "Une erreur s'est produite lors de la création de votre compte"
      );
    } finally {
      setLoading(false);
    }
  };
  
  if (signupSuccess) {
    return (
      <div className="text-center">
        <Notification 
          variant="success"
          title="Inscription réussie"
          description="Un email de confirmation a été envoyé à votre adresse email."
          className="mb-6"
        />
        
        <p className="mt-4 text-gray-600">
          Vous n'avez pas reçu d'email? Vérifiez votre dossier de spam ou
        </p>
        <Button 
          variant="link" 
          className="mt-1 text-translation-600"
          onClick={() => {
            // Here we would normally resend the verification email
            success(
              "Email renvoyé",
              "Un nouvel email de confirmation a été envoyé"
            );
          }}
        >
          cliquez ici pour renvoyer
        </Button>

        <div className="mt-6">
          <Link to="/login">
            <Button variant="outline" className="w-full">
              Retour à la page de connexion
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-6">Créer un compte</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nom complet *</Label>
          <Input 
            id="name"
            placeholder="Jean Dupont"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
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
          <Label htmlFor="company">Entreprise</Label>
          <Input 
            id="company"
            placeholder="Nom de votre entreprise (optionnel)"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            disabled={loading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe *</Label>
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
          <Label htmlFor="confirmPassword">Confirmer le mot de passe *</Label>
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
          {loading ? 'Inscription en cours...' : 'S\'inscrire'}
        </Button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-slate-500">
          Vous avez déjà un compte ?{' '}
          <Link to="/login" className="text-translation-600 hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
