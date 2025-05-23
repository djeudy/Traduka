
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { projectService } from '@/services/projectService';
import { Document, DocumentQuote } from '@/types';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface QuotationManagerProps {
  projectId: string;
  documents: Document[];
  existingQuotes?: DocumentQuote[];
  onQuotesUpdated: (quotes: DocumentQuote[]) => void;
}

const QuotationManager = ({ projectId, documents, existingQuotes = [], onQuotesUpdated }: QuotationManagerProps) => {
  const [quotes, setQuotes] = useState<DocumentQuote[]>(existingQuotes);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  // Get documents that don't have a quote yet
  const documentsWithoutQuote = documents.filter(doc => 
    !quotes.some(quote => quote.document_id === doc.id)
  );
  
  const handleAddQuote = (document: Document) => {
    const newQuote: DocumentQuote = {
      document_id: document.id || '',
      document_name: document.name,
      price: 0,
      currency: 'EUR'
    };
    
    setQuotes([...quotes, newQuote]);
  };
  
  const handlePriceChange = (documentId: string, price: number) => {
    const updatedQuotes = quotes.map(quote => {
      if (quote.document_id === documentId) {
        return { ...quote, price };
      }
      return quote;
    });
    
    setQuotes(updatedQuotes);
  };
  
  const handleCurrencyChange = (documentId: string, currency: string) => {
    const updatedQuotes = quotes.map(quote => {
      if (quote.document_id === documentId) {
        return { ...quote, currency };
      }
      return quote;
    });
    
    setQuotes(updatedQuotes);
  };
  
  const handleRemoveQuote = (documentId: string) => {
    const updatedQuotes = quotes.filter(quote => quote.document_id !== documentId);
    setQuotes(updatedQuotes);
  };
  
  const handleSaveQuotes = async () => {
    setLoading(true);
    
    try {
      const response = await projectService.updateProjectQuotes(projectId, quotes);
      
      if (!response.error) {
        toast({
          title: "Devis mis à jour",
          description: "Les devis ont été mis à jour avec succès.",
        });
        
        onQuotesUpdated(quotes);
      } else {
        toast({
          title: "Erreur",
          description: response.error || "Une erreur est survenue lors de la mise à jour des devis.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error updating quotes:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour des devis.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const getTotalQuote = () => {
    return quotes.reduce((total, quote) => total + quote.price, 0);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des devis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* List of documents with quotes */}
        {quotes.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium">Devis existants</h3>
            <div className="space-y-4">
              {quotes.map((quote) => (
                <div key={quote.document_id} className="flex items-center space-x-4 p-4 border rounded-md">
                  <div className="flex-1">
                    <p className="font-medium">{quote.document_name}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      value={quote.price}
                      onChange={(e) => handlePriceChange(quote.document_id, parseFloat(e.target.value))}
                      className="w-24"
                      min="0"
                      step="0.01"
                    />
                    <select
                      value={quote.currency}
                      onChange={(e) => handleCurrencyChange(quote.document_id, e.target.value)}
                      className="border rounded p-2"
                    >
                      <option value="EUR">EUR</option>
                      <option value="USD">USD</option>
                      <option value="HTG">HTG</option>
                    </select>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRemoveQuote(quote.document_id)}
                    >
                      Supprimer
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between items-center pt-2">
              <p className="font-medium">Total: {getTotalQuote()} {quotes[0]?.currency}</p>
              <Button 
                className="bg-translation-600 hover:bg-translation-700"
                onClick={handleSaveQuotes}
                disabled={loading}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : 'Enregistrer les devis'}
              </Button>
            </div>
          </div>
        )}
        
        {/* Documents without quotes */}
        {documentsWithoutQuote.length > 0 && (
          <>
            {quotes.length > 0 && <Separator className="my-4" />}
            
            <div className="space-y-4">
              <h3 className="font-medium">Documents sans devis</h3>
              <div className="space-y-2">
                {documentsWithoutQuote.map((doc) => (
                  <div key={doc.id} className="flex justify-between items-center p-3 border rounded-md">
                    <p>{doc.name}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddQuote(doc)}
                    >
                      Ajouter au devis
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        
        {quotes.length === 0 && documentsWithoutQuote.length === 0 && (
          <div className="text-center py-6">
            <p className="text-gray-500">Aucun document disponible pour créer un devis.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuotationManager;
