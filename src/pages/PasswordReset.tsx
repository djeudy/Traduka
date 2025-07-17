
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { authService } from '@/services/api';
import { Notification } from '@/components/ui/notification';
import { useLanguage } from '@/contexts/LanguageContext';

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
  const { t } = useLanguage();
  
  // If uid and token are present, we're on the reset confirmation page
  const isResetConfirmation = !!uid && !!token;
  
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      return toast({
        title: t('passwordReset.error'),
        description: t('passwordReset.pleaseEnterEmail'),
        variant: "destructive",
      });
    }
    
    setLoading(true);
    
    try {
      const response = await authService.resetPasswordRequest(email);
      
      if (response.error) throw new Error(response.error);
      
      setResetSent(true);
      
      toast({
        title: t('passwordReset.emailSent'),
        description: t('passwordReset.emailSentDesc'),
      });
      
    } catch (error: any) {
      console.error('Password reset request error:', error);
      toast({
        title: t('passwordReset.requestFailed'),
        description: error.message || t('passwordReset.requestError'),
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
        title: t('passwordReset.error'),
        description: t('passwordReset.pleaseFillAllFields'),
        variant: "destructive",
      });
    }
    
    if (password !== confirmPassword) {
      return toast({
        title: t('passwordReset.error'),
        description: t('passwordReset.passwordsNotMatch'),
        variant: "destructive",
      });
    }
    
    setLoading(true);
    
    try {
      const response = await authService.resetPassword(uid!, token!, password);
      
      if (response.error) throw new Error(response.error);
      
      setResetSuccess(true);
      
      toast({
        title: t('passwordReset.resetSuccessToast'),
        description: t('passwordReset.resetSuccessToastDesc'),
      });
      
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (error: any) {
      console.error('Password reset confirmation error:', error);
      toast({
        title: t('passwordReset.resetFailed'),
        description: error.message || t('passwordReset.resetError'),
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
          title={t('passwordReset.resetSentTitle')}
          description={t('passwordReset.resetSentDesc')}
          className="mb-6"
        />
        
        <p className="mt-4 text-gray-600">
          {t('passwordReset.noEmailReceived')}
        </p>
        <Button 
          variant="link" 
          className="mt-1 text-translation-600"
          onClick={() => {
            setResetSent(false);
          }}
        >
          {t('passwordReset.tryAgain')}
        </Button>

        <div className="mt-6">
          <Button variant="outline" className="w-full" onClick={() => navigate('/login')}>
            {t('passwordReset.backToLoginPage')}
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
          title={t('passwordReset.resetSuccessTitle')}
          description={t('passwordReset.resetSuccessDesc')}
          className="mb-6"
        />
        
        <div className="mt-6">
          <Button variant="outline" className="w-full" onClick={() => navigate('/login')}>
            {t('passwordReset.goToLogin')}
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-6">
        {isResetConfirmation ? t('passwordReset.resetPassword') : t('passwordReset.forgotPassword')}
      </h2>
      
      {isResetConfirmation ? (
        <form onSubmit={handleConfirmReset} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">{t('passwordReset.newPassword')}</Label>
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
            <Label htmlFor="confirmPassword">{t('passwordReset.confirmPassword')}</Label>
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
            {loading ? t('passwordReset.resetingPassword') : t('passwordReset.resetPasswordButton')}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleRequestReset} className="space-y-4">
          <p className="text-gray-600 mb-4">
            {t('passwordReset.enterEmailDesc')}
          </p>
          
          <div className="space-y-2">
            <Label htmlFor="email">{t('passwordReset.email')}</Label>
            <Input 
              id="email"
              type="email"
              placeholder={t('passwordReset.emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <Button type="submit" className="w-full bg-translation-600 hover:bg-translation-700" disabled={loading}>
            {loading ? t('passwordReset.sending') : t('passwordReset.sendResetLink')}
          </Button>
          
          <div className="mt-4 text-center">
            <Button 
              variant="link" 
              className="text-translation-600"
              onClick={() => navigate('/login')}
            >
              {t('passwordReset.backToLogin')}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PasswordReset;
