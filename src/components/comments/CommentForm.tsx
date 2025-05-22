
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@/contexts/UserContext';
import { post } from '@/services/api';

interface CommentFormProps {
  projectId?: string;
  onAddComment: (commentText: string) => void;
  onCommentAdded?: () => void;
}

export const CommentForm = ({ projectId, onAddComment, onCommentAdded }: CommentFormProps) => {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();
  const { user } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      return error(
        "Erreur",
        "Le commentaire ne peut pas être vide"
      );
    }

    if (!user) {
      return error(
        "Erreur",
        "Vous devez être connecté pour ajouter un commentaire"
      );
    }

    setLoading(true);

    try {
      // Call the parent component's handler directly
      onAddComment(comment);
      
      // For API integration (when ready)
      if (projectId) {
        const response = await post('/comments', {
          text: comment,
          project_id: projectId,
          user_id: user.id
        });

        if (response.error) throw new Error(response.error);
      }

      success(
        "Commentaire ajouté",
        "Votre commentaire a été ajouté avec succès"
      );

      setComment('');
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error: any) {
      error(
        "Erreur",
        error.message || "Une erreur est survenue lors de l'ajout du commentaire"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="Ajouter un commentaire..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="min-h-[100px]"
        disabled={loading || !user}
      />
      <Button 
        type="submit" 
        disabled={loading || !user}
        className="bg-translation-600 hover:bg-translation-700"
      >
        {loading ? 'Envoi...' : 'Envoyer le commentaire'}
      </Button>
    </form>
  );
};

export default CommentForm;
