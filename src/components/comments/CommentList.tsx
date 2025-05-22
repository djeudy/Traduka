
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Comment } from '@/types';
import { get } from '@/services/api';

interface CommentListProps {
  projectId: string;
  refreshTrigger: number;
}

export const CommentList = ({ projectId, refreshTrigger }: CommentListProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const response = await get<Comment[]>(`/projects/${projectId}/comments`);
        
        if (response.error) throw new Error(response.error);
        
        setComments(response.data || []);
      } catch (error: any) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les commentaires",
          variant: "destructive",
        });
        console.error('Error fetching comments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [projectId, refreshTrigger, toast]);

  if (loading && comments.length === 0) {
    return <div className="text-center py-4">Chargement des commentaires...</div>;
  }

  if (comments.length === 0) {
    return <div className="text-center py-4 text-gray-500">Aucun commentaire pour ce projet</div>;
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <Card key={comment.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarFallback>
                  {comment.user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{comment.user?.name || 'Utilisateur'}</p>
                <p className="text-xs text-gray-500">
                  {new Date(comment.created_at).toLocaleDateString()} - 
                  {new Date(comment.created_at).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{comment.text}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CommentList;
