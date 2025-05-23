
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Document, DocumentQuote } from '@/types';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface DocumentQuoteProps {
  documents: Document[];
  className?: string;
}

export const DocumentQuoteDisplay = ({ documents, className }: DocumentQuoteProps) => {
  // Price per word - in reality this would be fetched from an API or configuration
  const PRICE_PER_WORD = 0.05; 
  
  // Assuming document size (in bytes) ~ number of words (simple heuristic)
  // In a real app, you would have actual word counts
  const getEstimatedWords = (size: number = 0): number => {
    return Math.floor(size / 7); // Rough approximation: ~7 bytes per word
  };
  
  const quotes: DocumentQuote[] = documents.map(doc => ({
    document_id: doc.id || '',
    document_name: doc.name,
    // Calculate price based on document size (simulated word count)
    price: parseFloat((getEstimatedWords(doc.size) * PRICE_PER_WORD).toFixed(2)),
    currency: 'EUR'
  }));
  
  const totalPrice = quotes.reduce((sum, quote) => sum + quote.price, 0);
  
  return (
    <Card className={cn("", className)}>
      <CardContent className="pt-6">
        <h3 className="text-xl font-semibold mb-4">Devis pour les documents</h3>
        
        <div className="space-y-4">
          {quotes.length > 0 ? (
            <>
              <div className="space-y-3">
                {quotes.map((quote) => (
                  <div key={quote.document_id} className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{quote.document_name}</h4>
                      <p className="text-sm text-gray-500">
                        ~{getEstimatedWords(documents.find(d => d.id === quote.document_id)?.size || 0)} mots
                      </p>
                    </div>
                    <span className="font-medium">{quote.price} {quote.currency}</span>
                  </div>
                ))}
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center pt-2">
                <span className="font-medium">Total</span>
                <span className="text-xl font-bold">{totalPrice} EUR</span>
              </div>
              
              <p className="text-sm text-gray-500 mt-2">
                * Ce devis est basé sur une estimation du nombre de mots. Le prix final peut varier.
              </p>
            </>
          ) : (
            <p className="text-gray-500 text-center py-4">
              Aucun document à traduire
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentQuoteDisplay;
