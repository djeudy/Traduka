
import { Comment } from '@/types';

// This is for converting between API and frontend comment formats
export const adaptCommentFromAPI = (comment: any): Comment => {
  return {
    id: comment.id,
    text: comment.content || comment.text,
    created_at: comment.createdAt ? comment.createdAt.toString() : comment.created_at,
    user_id: comment.userId || comment.user_id,
    project_id: comment.projectId || comment.project_id,
    user: comment.user
  };
};
