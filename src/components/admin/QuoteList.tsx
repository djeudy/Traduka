import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Quote } from '@/types';
import { quoteService } from '@/services/quoteService';
import { useUser } from '@/contexts/UserContext';

interface QuoteListProps {
  projectId: string;
  quotes: Quote[];
  onQuoteUpdated: (quote: Quote) => void;
}

const QuoteList = ({ projectId, quotes, onQuoteUpdated }: QuoteListProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'sent':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'sent':
        return 'Envoyé';
      case 'accepted':
        return 'Accepté';
      case 'rejected':
        return 'Rejeté';
      default:
        return status;
    }
  };

  const handleUpdateStatus = async (quoteId: string, newStatus: string) => {
    setLoading(true);
    try {
      const result = await quoteService.updateQuoteStatus(quoteId, newStatus);
      
      if (result.error) {
        throw new Error(result.error);
      }

      // Update the quote in the parent component
      const updatedQuote = quotes.find(q => q.id === quoteId);
      if (updatedQuote) {
        const newQuote = { ...updatedQuote, status: newStatus as any };
        onQuoteUpdated(newQuote);
      }

      toast({
        title: "Statut mis à jour",
        description: `Le devis a été marqué comme ${getStatusLabel(newStatus).toLowerCase()}.`,
      });
    } catch (error: any) {
      console.error('Update status error:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la mise à jour du statut",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (quotes.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-gray-500">
            Aucun devis pour ce projet
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {quotes.map((quote) => (
        <Card key={quote.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                Devis #{quote.id.slice(0, 8)}
              </CardTitle>
              <Badge variant="outline" className={getStatusBadgeClass(quote.status)}>
                {getStatusLabel(quote.status)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Montant</p>
                <p className="text-lg font-semibold">{quote.total_amount} {quote.currency}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Créé par</p>
                <p className="text-sm">{quote.created_by.name}</p>
              </div>
            </div>

            {quote.description && (
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Description</p>
                <p className="text-sm bg-gray-50 p-2 rounded">{quote.description}</p>
              </div>
            )}

            {quote.quote_file_url && (
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Fichier</p>
                <a 
                  href={quote.quote_file_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  📄 Télécharger le devis
                </a>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                Créé le {new Date(quote.created_at).toLocaleDateString('fr-FR')}
              </div>
              
              <div className="flex space-x-2">
                {/* Actions pour l'admin */}
                {user?.role === 'admin' && quote.status === 'pending' && (
                  <Button 
                    size="sm" 
                    onClick={() => handleUpdateStatus(quote.id, 'sent')}
                    disabled={loading}
                  >
                    Envoyer
                  </Button>
                )}
                
                {/* Actions pour le client */}
                {user?.role === 'client' && quote.status === 'sent' && (
                  <>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleUpdateStatus(quote.id, 'accepted')}
                      disabled={loading}
                    >
                      Accepter
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleUpdateStatus(quote.id, 'rejected')}
                      disabled={loading}
                    >
                      Rejeter
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuoteList;