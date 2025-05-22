
import { get, post, put, patch, del } from './apiUtils';
import { adaptCommentFromAPI } from '@/utils/commentAdapter';
import { Comment } from '@/types';

// CommentService will handle all API requests related to comments
const commentService = {
  async getAllComments() {
    return await get<Comment[]>(`/api/comments/`);
  },
  
  async getProjectComments(projectId: string) {
    const response = await get<any[]>(`/api/projects/${projectId}/comments/`);
    if (response.data) {
      // Convert API response to frontend model
      response.data = response.data.map(adaptCommentFromAPI);
    }
    return response;
  },
  
  async getComment(commentId: string) {
    const response = await get<any>(`/api/comments/${commentId}/`);
    if (response.data) {
      response.data = adaptCommentFromAPI(response.data);
    }
    return response;
  },
  
  async createComment(projectId: string, text: string) {
    const response = await post<any>(`/api/projects/${projectId}/comments/`, { text });
    if (response.data) {
      response.data = adaptCommentFromAPI(response.data);
    }
    return response;
  },
  
  async updateComment(commentId: string, text: string) {
    const response = await put<any>(`/api/comments/${commentId}/`, { text });
    if (response.data) {
      response.data = adaptCommentFromAPI(response.data);
    }
    return response;
  },
  
  async patchComment(commentId: string, text: string) {
    const response = await patch<any>(`/api/comments/${commentId}/`, { text });
    if (response.data) {
      response.data = adaptCommentFromAPI(response.data);
    }
    return response;
  },
  
  async deleteComment(commentId: string) {
    return await del<void>(`/api/comments/${commentId}/`);
  }
};

export { commentService };
