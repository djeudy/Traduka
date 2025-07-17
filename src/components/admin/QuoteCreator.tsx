import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Quote } from '@/types';
import { quoteService } from '@/services/quoteService';
import { fileService } from '@/services/api';
import { useUser } from '@/contexts/UserContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface QuoteCreatorProps {
  projectId: string;
  onQuoteCreated: (quote: Quote) => void;
}

const QuoteCreator = ({ projectId, onQuoteCreated }: QuoteCreatorProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<'USD' | 'HTG'>('USD');
  const [description, setDescription] = useState('');
  const [quoteFile, setQuoteFile] = useState<File | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || user.role !== 'admin') {
      toast({
        title: t('admin.accessDenied'),
        description: t('admin.onlyAdminsCanCreateQuotes'),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let quoteFileUrl = '';
      let quoteFileId = '';

      // Upload quote file if provided
      if (quoteFile) {
        setUploadingFile(true);
        
        const uploadResult = await fileService.uploadFiles(
          [quoteFile], 
          'quotes', 
          projectId, 
          user.id
        );
        
        if (uploadResult.error) {
          throw new Error(uploadResult.error);
        }
        
        if (uploadResult.data?.files?.[0]) {
          quoteFileUrl = uploadResult.data.files[0].url;
          quoteFileId = uploadResult.data.files[0].path;
        }
        
        setUploadingFile(false);
      }

      const quoteData: Partial<Quote> = {
        project: projectId,
        total_amount: parseFloat(amount),
        currency,
        description,
        quote_file_url: quoteFileUrl,
        quote_file_id: quoteFileId,
      };

      const result = await quoteService.createQuote(quoteData);

      if (result.error) {
        throw new Error(result.error);
      }

      if (result.data) {
        onQuoteCreated(result.data);
        toast({
          title: t('admin.quoteCreated'),
          description: t('admin.quoteCreatedSuccess'),
        });

        // Reset form
        setAmount('');
        setCurrency('USD');
        setDescription('');
        setQuoteFile(null);
      }
    } catch (error: any) {
      console.error('Quote creation error:', error);
      toast({
        title: t('admin.error'),
        description: error.message || t('admin.errorCreatingQuote'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setUploadingFile(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('admin.createQuote')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Label htmlFor="description">{t('admin.description')}</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('admin.quoteDetails')}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quoteFile">{t('admin.quoteFile')}</Label>
            <Input
              id="quoteFile"
              type="file"
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              onChange={(e) => setQuoteFile(e.target.files?.[0] || null)}
            />
            <p className="text-xs text-gray-500">
              {t('admin.acceptedFormats')}
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting || uploadingFile}
          >
            {uploadingFile ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                {t('admin.uploading')}
              </>
            ) : isSubmitting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                {t('admin.creating')}
              </>
            ) : (
              t('admin.createQuoteButton')
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default QuoteCreator;