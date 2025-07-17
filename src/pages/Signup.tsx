
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/api';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, CheckCircle2 } from "lucide-react";
import { Notification } from '@/components/ui/notification';
import { useLanguage } from '@/contexts/LanguageContext';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  
  const { success, error } = useToast();
  const { t } = useLanguage();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      return error(
        t('signup.error'),
        t('signup.fillRequiredFields')
      );
    }
    
    if (password !== confirmPassword) {
      return error(
        t('signup.error'),
        t('signup.passwordsNotMatch')
      );
    }
    
    setLoading(true);
    
    try {
      const response = await authService.signup(name, email, company || null, password, confirmPassword);
      
      if (response.error) {
        // Parse error - could be a string or object
        let errorMessage = '';
        
        if (typeof response.error === 'string') {
          errorMessage = response.error.toLowerCase();
        } else if (typeof response.error === 'object') {
          // Handle Django field errors (e.g., {"email": ["user with this email already exists."]})
          if (response.error.email && Array.isArray(response.error.email)) {
            errorMessage = response.error.email[0].toLowerCase();
          } else {
            errorMessage = JSON.stringify(response.error).toLowerCase();
          }
        }
        
        // Check for email already exists patterns
        if (errorMessage.includes('email') && (
            errorMessage.includes('already') || 
            errorMessage.includes('exist') || 
            errorMessage.includes('unique') ||
            errorMessage.includes('duplicate')
        )) {
          // Directly show error toast instead of throwing
          return error(
            t('signup.signupFailed'),
            t('signup.emailAlreadyExists')
          );
        } else if (errorMessage.includes('user') && (
            errorMessage.includes('already') || 
            errorMessage.includes('exist') ||
            errorMessage.includes('unique')
        )) {
          // Directly show error toast instead of throwing
          return error(
            t('signup.signupFailed'),
            t('signup.userAlreadyExists')
          );
        } else {
          // Throw error for generic cases
          throw new Error(typeof response.error === 'string' ? response.error : t('signup.genericError'));
        }
      }
      
      setSignupSuccess(true);
      
      success(
        t('signup.signupSuccess'),
        t('signup.checkEmailConfirmation')
      );
      
    } catch (error: any) {
      console.error('Signup error:', error);
      error(
        t('signup.signupFailed'),
        error.message || t('signup.genericError')
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
          title={t('signup.signupSuccess')}
          description={t('signup.confirmationEmailSent')}
          className="mb-6"
        />
        
        <p className="mt-4 text-gray-600">
          {t('signup.noEmailReceived')}
        </p>
        <Button 
          variant="link" 
          className="mt-1 text-translation-600"
          onClick={() => {
            // Here we would normally resend the verification email
            success(
              t('signup.emailResent'),
              t('signup.newConfirmationSent')
            );
          }}
        >
          {t('signup.clickToResend')}
        </Button>

        <div className="mt-6">
          <Link to="/login">
            <Button variant="outline" className="w-full">
              {t('signup.backToLogin')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-6">{t('signup.title')}</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">{t('signup.fullName')}</Label>
          <Input 
            id="name"
            placeholder={t('signup.fullNamePlaceholder')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">{t('signup.email')}</Label>
          <Input 
            id="email"
            type="email"
            placeholder={t('signup.emailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="company">{t('signup.company')}</Label>
          <Input 
            id="company"
            placeholder={t('signup.companyPlaceholder')}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            disabled={loading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">{t('signup.password')}</Label>
          <Input 
            id="password"
            type="password"
            placeholder={t('signup.passwordPlaceholder')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">{t('signup.confirmPassword')}</Label>
          <Input 
            id="confirmPassword"
            type="password"
            placeholder={t('signup.passwordPlaceholder')}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
          />
        </div>
        
        <Button type="submit" className="w-full bg-translation-600 hover:bg-translation-700" disabled={loading}>
          {loading ? t('signup.signingUp') : t('signup.signUp')}
        </Button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-slate-500">
          {t('signup.alreadyHaveAccount')}{' '}
          <Link to="/login" className="text-translation-600 hover:underline">
            {t('signup.signIn')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
