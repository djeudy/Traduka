import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Payment } from '@/types';
import { paymentService } from '@/services/paymentService';
import { useUser } from '@/contexts/UserContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface PaymentManagerProps {
  projectId: string;
  payments: Payment[];
  onPaymentUpdated: (payment: Payment) => void;
  onPaymentCreated: (payment: Payment) => void;
}

const PaymentManager = ({ projectId, payments, onPaymentUpdated, onPaymentCreated }: PaymentManagerProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<'USD' | 'HTG'>('USD');
  const [method, setMethod] = useState<'moncash' | 'bank'>('moncash');
  const [description, setDescription] = useState('');
  const { toast } = useToast();
  const { user } = useUser();
  const { t } = useLanguage();

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || user.role !== 'admin') return;

    setIsCreating(true);

    try {
      const paymentData = {
        project: projectId,
        amount: parseFloat(amount),
        currency,
        method,
        status: 'pending' as const,
      };

      const result = await paymentService.createPayment(paymentData);

      if (result.error) {
        throw new Error(result.error);
      }

      if (result.data) {
        onPaymentCreated(result.data);
        toast({
          title: t('admin.paymentCreated'),
          description: t('admin.paymentCreatedSuccess'),
        });

        // Reset form
        setAmount('');
        setCurrency('USD');
        setMethod('moncash');
        setDescription('');
      }
    } catch (error: any) {
      console.error('Payment creation error:', error);
      toast({
        title: t('admin.error'),
        description: error.message || t('admin.errorCreatingPayment'),
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleVerifyPayment = async (paymentId: string, status: string, notes?: string) => {
    try {
      const result = await paymentService.verifyPayment(paymentId, status, notes);

      if (result.error) {
        throw new Error(result.error);
      }

      // Update the payment in the parent component
      const updatedPayment = payments.find(p => p.id === paymentId);
      if (updatedPayment) {
        const newPayment = { ...updatedPayment, status: status as any };
        onPaymentUpdated(newPayment);
      }

      toast({
        title: t('admin.paymentVerified'),
        description: `${t('admin.paymentMarkedAs')} ${status === 'completed' ? t('admin.completed') : status}.`,
      });
    } catch (error: any) {
      console.error('Payment verification error:', error);
      toast({
        title: t('admin.error'),
        description: error.message || t('admin.errorVerifyingPayment'),
        variant: "destructive",
      });
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return t('status.waiting');
      case 'processing':
        return t('admin.inProgress');
      case 'completed':
        return t('admin.completed');
      case 'failed':
        return 'Échoué'; // Keep as is - no translation key available
      case 'cancelled':
        return 'Annulé'; // Keep as is - no translation key available
      default:
        return status;
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="space-y-4">
        {payments.map((payment) => (
          <Card key={payment.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{payment.amount} {payment.currency}</p>
                  <p className="text-sm text-gray-500">{t('admin.paymentMethod')}: {payment.method}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(payment.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <Badge variant="outline" className={getStatusBadgeClass(payment.status)}>
                  {getStatusLabel(payment.status)}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Create Payment Form - Admin Only */}
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.createPayment')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreatePayment} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">{t('admin.amount')}</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="250.00"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currency">{t('admin.currency')}</Label>
                <Select value={currency} onValueChange={(value: 'USD' | 'HTG') => setCurrency(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('admin.selectCurrency')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">{t('admin.usdDollar')}</SelectItem>
                    <SelectItem value="HTG">{t('admin.htgGourde')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="method">{t('admin.paymentMethod')}</Label>
              <Select value={method} onValueChange={(value: 'moncash' | 'bank') => setMethod(value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('admin.selectMethod')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="moncash">{t('admin.moncash')}</SelectItem>
                  <SelectItem value="bank">{t('admin.bankTransfer')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" disabled={isCreating}>
              {isCreating ? t('admin.creating') : t('admin.createPaymentButton')}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Payments List */}
      <div className="space-y-4">
        {payments.map((payment) => (
          <Card key={payment.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-medium">{payment.amount} {payment.currency}</p>
                  <p className="text-sm text-gray-500">{t('admin.paymentMethod')}: {payment.method}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(payment.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <Badge variant="outline" className={getStatusBadgeClass(payment.status)}>
                  {getStatusLabel(payment.status)}
                </Badge>
              </div>

              {/* MonCash specific info */}
              {payment.method === 'moncash' && payment.moncash_phone && (
                <div className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">{t('admin.moncashPhone')}</span> {payment.moncash_phone}
                </div>
              )}

              {/* Bank specific info */}
              {payment.method === 'bank' && payment.bank_name && (
                <div className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">{t('admin.bank')}</span> {payment.bank_name}
                </div>
              )}

              {/* Proof of payment */}
              {payment.proof_of_payment_url && (
                <div className="mb-4">
                  <a 
                    href={payment.proof_of_payment_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    📄 {t('admin.viewProofOfPayment')}
                  </a>
                </div>
              )}

              {/* Admin actions */}
              {payment.status === 'processing' && (
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    onClick={() => handleVerifyPayment(payment.id, 'completed')}
                  >
                    {t('admin.approve')}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleVerifyPayment(payment.id, 'failed')}
                  >
                    {t('admin.reject')}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PaymentManager;