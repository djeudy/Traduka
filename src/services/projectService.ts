
import { get, post, put, patch, del, postFormData } from './apiUtils';
import { ApiProject, ApiComment, Project, Document, Comment } from '../types';
import { ApiResponse } from './apiUtils';

export interface ProjectDocument {
  id: string;
  name: string;
  file: string | File;
  project: string;
  uploaded_at: string;
}

const projectService = {
  // Projects
  async getAllProjects() {
    return await get<ApiProject[]>(`/api/projects/`);
  },
  
  async getProject(projectId: string) {
    return await get<Project>(`/api/projects/${projectId}/`);
  },
  
  async createProject(clientId: number, name: string, sourceLanguage: string, targetLanguage: string): Promise<ApiResponse<ApiProject>> {
    return await post<ApiProject>(`/api/projects/`, { name, source_language: sourceLanguage, target_language: targetLanguage });
  },
  
  async updateProject(projectId: string, project: Partial<ApiProject>) {
    return await put<ApiProject>(`/api/projects/${projectId}/`, project);
  },
  
  async patchProject(projectId: string, partialProject: Partial<ApiProject>) {
    return await patch<ApiProject>(`/api/projects/${projectId}/`, partialProject);
  },
  
  async deleteProject(projectId: string) {
    return await del<void>(`/api/projects/${projectId}/`);
  },
  
  // Project comments
  async getProjectComments(projectId: string) {
    return await get<ApiComment[]>(`/api/projects/${projectId}/comments/`);
  },
  
  async getProjectComment(projectId: string, commentId: string) {
    return await get<ApiComment>(`/api/projects/${projectId}/comments/${commentId}/`);
  },
  
  async createComment(projectId: string, text: string) {
    return await post<ApiComment>(`/api/projects/${projectId}/comments/`, { text });
  },
  
  async updateComment(projectId: string, commentId: string, text: string) {
    return await put<ApiComment>(`/api/projects/${projectId}/comments/${commentId}/`, { text });
  },
  
  async patchComment(projectId: string, commentId: string, text: string) {
    return await patch<ApiComment>(`/api/projects/${projectId}/comments/${commentId}/`, { text });
  },
  
  async deleteComment(projectId: string, commentId: string) {
    return await del<void>(`/api/projects/${projectId}/comments/${commentId}/`);
  },
  
  // Documents
  async getDocuments(projectId: string) {
    return await get<Document[]>(`/api/projects/${projectId}/documents/`);
  },
  
  async getDocument(projectId: string, documentId: string) {
    return await get<Document>(`/api/projects/${projectId}/documents/${documentId}/`);
  },
  
  async uploadDocument(projectId: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('project', projectId);
    formData.append('name', file.name);
    
    return await postFormData<Document>(`/api/projects/${projectId}/documents/`, formData);
  },
  
  async deleteDocument(projectId: string, documentId: string) {
    return await del<void>(`/api/projects/${projectId}/documents/${documentId}/`);
  },

  // Roles management
  async assignTranslator(projectId: string, translatorId: number) {
    return await patch<ApiProject>(`/api/projects/${projectId}/assign-translator/`, { translator: translatorId });
  },

  async unassignTranslator(projectId: string) {
    return await patch<ApiProject>(`/api/projects/${projectId}/assign-translator/`, { translator: null });
  }
};

export { projectService };
