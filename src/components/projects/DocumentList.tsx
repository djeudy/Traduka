
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Document } from '@/types';
import { projectService } from '@/services/projectService';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useUser } from '@/contexts/UserContext';

interface DocumentListProps {
  projectId: string;
  documents: Document[];
  status: string;
  onDocumentDelete: (docId: string) => void;
}

const DocumentList: React.FC<DocumentListProps> = ({ projectId, documents, status, onDocumentDelete }) => {
  const [uploadingTranslation, setUploadingTranslation] = useState<string | null>(null);
  const [deletingDocument, setDeletingDocument] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useUser();
  const isEditable = user?.role === 'admin' || user?.role === 'translator';

  const handleTranslatedUpload = async (docId: string, file: File) => {
    try {
      setUploadingTranslation(docId);
      // Ici on simule l'upload du document traduit
      // Dans une version réelle, il faudrait une API pour téléverser la traduction
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Document traduit téléversé",
        description: "Le document traduit a été ajouté avec succès",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du téléversement du document traduit",
        variant: "destructive",
      });
    } finally {
      setUploadingTranslation(null);
    }
  };

  const handleFileChange = (docId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleTranslatedUpload(docId, file);
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    try {
      setDeletingDocument(docId);
      const response = await projectService.deleteDocument(projectId, docId);
      
      if (!response.error) {
        toast({
          title: "Document supprimé",
          description: "Le document a été supprimé avec succès",
        });
        onDocumentDelete(docId);
      } else {
        toast({
          title: "Erreur",
          description: response.error || "Impossible de supprimer le document",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du document",
        variant: "destructive",
      });
    } finally {
      setDeletingDocument(null);
    }
  };

  return (
    <div className="space-y-4">
      {documents.map(doc => (
        <div key={doc.id} className="bg-white border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium">{doc.name}</h4>
                <p className="text-sm text-gray-500">
                  Ajouté le {new Date(doc.uploaded_at || '').toLocaleDateString('fr-FR')}
                  {doc.size && <span className="ml-2">({(doc.size / 1024).toFixed(1)} Ko)</span>}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-9" asChild>
                <a href={doc.source_url?.replace("preview","download")} download>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Original
                </a>
              </Button>
              
              {doc.translated_url && (
                <Button size="sm" className="h-9 bg-translation-600 hover:bg-translation-700" asChild>
                  <a href={doc.translated_url.replace("preview","download")} download>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Traduit
                  </a>
                </Button>
              )}
              
              {isEditable && status !== 'completed' && !doc.translated_url && (
                <div className="relative">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="h-9"
                    disabled={!!uploadingTranslation}
                  >
                    {uploadingTranslation === doc.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-1"></div>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                      </svg>
                    )}
                    Ajouter traduction
                  </Button>
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => handleFileChange(doc.id, e)}
                    disabled={!!uploadingTranslation}
                  />
                </div>
              )}
              
              {(user?.role === 'admin' || status === 'waiting') && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="h-9">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Supprimer le document</AlertDialogTitle>
                      <AlertDialogDescription>
                        Êtes-vous sûr de vouloir supprimer ce document ? Cette action est irréversible.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="bg-red-600 hover:bg-red-700"
                        disabled={deletingDocument === doc.id}
                      >
                        {deletingDocument === doc.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : 'Supprimer'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        </div>
      ))}
      
      {status !== 'completed' && (
        <div className="file-upload">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-400 mb-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
          </svg>
          <p className="font-medium">Glissez-déposez un document ici</p>
          <p className="text-sm text-gray-500 mt-1">ou cliquez pour parcourir</p>
          <Button variant="outline" className="mt-4">Ajouter un document</Button>
        </div>
      )}
    </div>
  );
};

export default DocumentList;
