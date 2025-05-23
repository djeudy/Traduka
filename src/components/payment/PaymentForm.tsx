
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Document, Payment, PaymentMethod } from '@/types';
import { useUser } from '@/contexts/UserContext';

interface PaymentFormProps {
  projectId: string;
  paymentMethod: string;
  documents?: Document[];
  onPaymentComplete: (payment: Payment) => void;
}

export const PaymentForm = ({ 
  projectId, 
  paymentMethod, 
  documents = [], 
  onPaymentComplete 
}: PaymentFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  
  // Calculate payment amount based on documents
  const PRICE_PER_WORD = 0.05;
  const getEstimatedWords = (size: number = 0): number => {
    return Math.floor(size / 7); // Simple estimation
  };
  
  const documentTotalCost = documents.reduce((sum, doc) => {
    const words = getEstimatedWords(doc.size || 0);
    return sum + (words * PRICE_PER_WORD);
  }, 0);
  
  // Use calculated amount or default to 250 if no documents
  const [amount] = useState(documentTotalCost > 0 ? parseFloat(documentTotalCost.toFixed(2)) : 250);
  
  // Form fields for different payment methods
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  const formatCardNumber = (value: string) => {
    return value
      .replace(/\s/g, '') // Remove spaces
      .replace(/(\d{4})(?=\d)/g, '$1 ') // Add space after every 4 digits
      .trim(); // Remove any trailing space
  };
  
  const formatExpiry = (value: string) => {
    return value
      .replace(/\s/g, '') // Remove spaces
      .replace(/(\d{2})(?=\d)/g, '$1/') // Add / after 2 digits
      .replace(/\/+/g, '/') // Remove double slashes
      .slice(0, 5); // Limit to MM/YY format
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Mock payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (!user) throw new Error("Vous devez être connecté pour effectuer un paiement");
      
      // Create a mock payment object
      const newPayment: Payment = {
        id: `payment-${Date.now()}`,
        amount: amount,
        currency: 'EUR',
        status: 'completed',
        created_at: new Date().toISOString(),
        project_id: projectId,
        user_id: user.id.toString() // Convert number to string to match type
      };
      
      // Call the callback function to update the parent component
      onPaymentComplete(newPayment);
      
      // Reset form
      setCardNumber('');
      setExpiry('');
      setCvc('');
      setName('');
      setEmail('');
      setPhone('');
      
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Échec du paiement",
        description: error.message || "Une erreur est survenue lors du traitement du paiement",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-medium">Paiement par {paymentMethod}</h3>
              <p className="text-sm text-gray-500">Traduction professionnelle</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{amount} €</p>
              <p className="text-xs text-gray-500">TVA incluse</p>
            </div>
          </div>
          
          <Separator />
          
          {paymentMethod === 'stripe' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardName">Nom sur la carte</Label>
                <Input 
                  id="cardName" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Numéro de carte</Label>
                <Input 
                  id="cardNumber" 
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Date d'expiration</Label>
                  <Input 
                    id="expiry" 
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    placeholder="MM/YY"
                    maxLength={5}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input 
                    id="cvc" 
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                    placeholder="123"
                    maxLength={3}
                    required
                  />
                </div>
              </div>
            </div>
          )}
          
          {paymentMethod === 'paypal' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email PayPal</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre-email@example.com"
                  required
                />
              </div>
            </div>
          )}
          
          {paymentMethod === 'moncash' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Numéro de téléphone</Label>
                <Input 
                  id="phone" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="0101234567"
                  required
                />
              </div>
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full mt-4" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Traitement...
              </>
            ) : (
              'Payer maintenant'
            )}
          </Button>
          
          <p className="text-xs text-center text-gray-500 mt-2">
            Paiement sécurisé et crypté
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;
