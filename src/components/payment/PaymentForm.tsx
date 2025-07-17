
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Document, Payment, PaymentMethod } from '@/types';
import { useUser } from '@/contexts/UserContext';
import { fileService } from '@/services/api';
import { paymentService } from '@/services/paymentService';

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
  const [currency, setCurrency] = useState<'USD' | 'HTG'>('USD');
  
  // Form fields for different payment methods
  
  // MonCash fields
  const [moncashPhone, setMoncashPhone] = useState('');
  
  // Bank transfer fields
  const [bankName, setBankName] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [bankRoutingNumber, setBankRoutingNumber] = useState('');
  const [bankReference, setBankReference] = useState('');
  
  // Proof of payment
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [uploadingProof, setUploadingProof] = useState(false);
  
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (!user) throw new Error("Vous devez être connecté pour effectuer un paiement");
      
      let proofFileUrl = '';
      let proofFileId = '';
      
      // Upload proof of payment file if provided (for moncash and bank)
      if (proofFile && (paymentMethod === 'moncash' || paymentMethod === 'bank')) {
        setUploadingProof(true);
        
        const uploadResult = await fileService.uploadFiles(
          [proofFile], 
          'payment_proofs', 
          projectId, 
          user.id
        );
        
        if (uploadResult.error) {
          throw new Error(uploadResult.error);
        }
        
        if (uploadResult.data?.files?.[0]) {
          proofFileUrl = uploadResult.data.files[0].url;
          proofFileId = uploadResult.data.files[0].path; // Use path as file ID
        }
        
        setUploadingProof(false);
      }
      
      // Create payment object with method-specific fields
      const paymentData: any = {
        amount: amount,
        currency: currency,
        method: paymentMethod as PaymentMethod,
        project: projectId,
        
        // MonCash specific fields
        ...(paymentMethod === 'moncash' && {
          moncash_phone: moncashPhone,
        }),
        
        // Bank transfer specific fields
        ...(paymentMethod === 'bank' && {
          bank_name: bankName,
          bank_account_number: bankAccountNumber,
          bank_routing_number: bankRoutingNumber,
          bank_reference: bankReference,
        }),
        
        // Proof of payment
        ...(proofFileUrl && {
          proof_of_payment_url: proofFileUrl,
          proof_of_payment_file_id: proofFileId,
        }),
      };
      
      // Create payment via API
      const result = await paymentService.createPayment(paymentData);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      if (result.data) {
        // For MonCash, redirect to MonCash payment page if redirect URL is provided
        if (paymentMethod === 'moncash' && result.data.moncash_redirect_url) {
          window.location.href = result.data.moncash_redirect_url;
          return;
        }
        
        // Call the callback function to update the parent component
        onPaymentComplete(result.data);
        
        // Show success message
        toast({
          title: "Paiement soumis",
          description: "Votre paiement est en cours de vérification par notre équipe.",
        });
      }
      
      // Reset form
      setMoncashPhone('');
      setBankName('');
      setBankAccountNumber('');
      setBankRoutingNumber('');
      setBankReference('');
      setProofFile(null);
      
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Échec du paiement",
        description: error.message || "Une erreur est survenue lors du traitement du paiement",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setUploadingProof(false);
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
              <p className="text-2xl font-bold">{amount} {currency}</p>
              <p className="text-xs text-gray-500">TVA incluse</p>
            </div>
          </div>
          
          {/* Currency selector for MonCash and Bank payments */}
          {(paymentMethod === 'moncash' || paymentMethod === 'bank') && (
            <div className="space-y-2">
              <Label htmlFor="currency">Devise</Label>
              <Select value={currency} onValueChange={(value: 'USD' | 'HTG') => setCurrency(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez la devise" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD (Dollar américain)</SelectItem>
                  <SelectItem value="HTG">HTG (Gourde haïtienne)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          <Separator />
          
          {paymentMethod === 'moncash' && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Paiement MonCash:</strong><br/>
                  Montant: <strong>{amount} {currency}</strong><br/>
                  Vous serez redirigé vers MonCash pour effectuer le paiement en toute sécurité.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="moncashPhone">Votre numéro MonCash</Label>
                <Input 
                  id="moncashPhone" 
                  value={moncashPhone}
                  onChange={(e) => setMoncashPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="Ex: 5034567890"
                  required
                />
                <p className="text-xs text-gray-500">
                  Numéro de téléphone associé à votre compte MonCash
                </p>
              </div>
            </div>
          )}
          
          {paymentMethod === 'bank' && (
            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-md border border-purple-200">
                <p className="text-sm text-purple-800">
                  <strong>Instructions virement bancaire:</strong><br/>
                  <strong>Banque:</strong> Banque Nationale de Crédit<br/>
                  <strong>Compte:</strong> 1234567890<br/>
                  <strong>Nom:</strong> Traduka Services<br/>
                  <strong>Montant:</strong> {amount} {currency}<br/>
                  <strong>Référence:</strong> Projet #{projectId.slice(0, 8)}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bankName">Nom de votre banque</Label>
                <Input 
                  id="bankName" 
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="Ex: Banque Nationale de Crédit"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bankAccountNumber">Numéro de compte émetteur</Label>
                <Input 
                  id="bankAccountNumber" 
                  value={bankAccountNumber}
                  onChange={(e) => setBankAccountNumber(e.target.value)}
                  placeholder="Ex: 1234567890"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bankRoutingNumber">Code de routage (optionnel)</Label>
                <Input 
                  id="bankRoutingNumber" 
                  value={bankRoutingNumber}
                  onChange={(e) => setBankRoutingNumber(e.target.value)}
                  placeholder="Ex: 123456789"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bankReference">Référence de transaction</Label>
                <Input 
                  id="bankReference" 
                  value={bankReference}
                  onChange={(e) => setBankReference(e.target.value)}
                  placeholder="Ex: REF123456"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="proofFile">Preuve de virement *</Label>
                <Input 
                  id="proofFile" 
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                  required
                />
                <p className="text-xs text-gray-500">
                  Téléchargez le reçu de virement. Formats acceptés: JPG, PNG, PDF. Max 5MB
                </p>
              </div>
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full mt-4" 
            disabled={isSubmitting || uploadingProof}
          >
            {uploadingProof ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Téléchargement...
              </>
            ) : isSubmitting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Traitement...
              </>
            ) : (
              'Soumettre le paiement'
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
