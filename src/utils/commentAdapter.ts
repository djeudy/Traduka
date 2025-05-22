
import { Comment, ApiComment } from '@/types';

// Cette fonction convertit un commentaire API en format Comment frontend
export const adaptCommentFromAPI = (comment: ApiComment | any): Comment => {
  // Si c'est déjà au format Comment, retourner tel quel
  if (comment.user_id && comment.project_id) {
    return comment as Comment;
  }
  
  return {
    id: comment.id,
    text: comment.text || comment.content || '',
    created_at: comment.created_at || comment.createdAt || new Date().toISOString(),
    user_id: String(comment.user) || comment.userId || '',
    project_id: comment.project || comment.projectId || '',
    user: comment.user_details || comment.user || undefined
  };
};

// Cette fonction convertit un commentaire frontend en format API
export const adaptCommentToAPI = (comment: Comment): ApiComment => {
  return {
    id: comment.id,
    text: comment.text,
    user: parseInt(comment.user_id, 10),
    project: comment.project_id,
    created_at: comment.created_at
  };
};
