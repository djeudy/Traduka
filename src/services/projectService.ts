
import { get, post, put, patch, del, postFormData } from './apiUtils';
import { ApiProject, ApiComment,Project } from '../types';
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
  
  // Source documents
  async getDocuments(projectId: string) {
    return await get<ProjectDocument[]>(`/api/projects/${projectId}/documents/`);
  },
  
  async getDocument(projectId: string, documentId: string) {
    return await get<ProjectDocument>(`/api/projects/${projectId}/documents/${documentId}/`);
  },
  
  async uploadDocument(projectId: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('project', projectId);
    formData.append('name', file.name);
    
    return await postFormData<ProjectDocument>(`/api/projects/${projectId}/documents/`, formData);
  },
  
  async deleteDocument(projectId: string, documentId: string) {
    return await del<void>(`/api/projects/${projectId}/source-documents/${documentId}/`);
  },
  
};

export { projectService };





// // This file will be used to make API calls to the Django REST Framework backend
// // File storage service
// import { appwrite } from '@/integrations/appwrite/client';
// import { ID } from 'appwrite';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// interface ApiResponse<T> {
//   data?: T;
//   error?: string;
// }

// // Type sécurisé pour les erreurs
// interface ApiError {
//   message?: string;
//   detail?: string;
//   [key: string]: any;
// }

// // Définir des interfaces pour les réponses d'authentification
// interface AuthResponse {
//   access: string;
//   refresh: string;
//   user: any;
//   role: string;
// }

// interface MessageResponse {
//   message: string;
// }


// interface Project {
//   id: string;
//   name: string;
//   client: number;
//   translator: number | null;
//   source_language: string;
//   target_language: string;
//   status: string;
//   submitted_at: string;
//   started_at: string | null;
//   estimated_completion_date: string | null;
//   completed_at: string | null;
//   private_project: boolean;
// }

// interface Comment {
//   id: string;
//   text: string;
//   user: number;
//   project: string;
//   created_at: string;
// }

// interface Payment {
//   id: string;
//   amount: number;
//   currency: string;
//   status: string;
//   user: number;
//   project: string;
//   created_at: string;
// }

// interface SourceDocument {
//   id: string;
//   project: string;
//   file_url: string;
//   uploaded_at: string;
//   uploaded_by: number;
// }

// interface TranslatedDocument {
//   id: string;
//   project: string;
//   file_url: string;
//   uploaded_at: string;
//   uploaded_by: number;
// }


// // Fonction utilitaire pour gérer les réponses d'erreur de manière cohérente
// async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
//   if (!response.ok) {
//     try {
//       const errorData = await response.json() as ApiError;
//       return { error: errorData.message || errorData.detail || 'An error occurred' };
//     } catch (e) {
//       return { error: `HTTP error ${response.status}` };
//     }
//   }
  
//   try {
//     const data = await response.json();
//     return { data };
//   } catch (e) {
//     return { error: 'Invalid JSON response' };
//   }
// }

// // Fonction utilitaire pour créer les en-têtes de requête
// function getHeaders(contentType = 'application/json'): HeadersInit {
//   const headers: HeadersInit = {
//     'Content-Type': contentType,
//   };
  
//   const authToken = localStorage.getItem('authToken');
//   if (authToken) {
//     headers['Authorization'] = `Bearer ${authToken}`;
//   }
  
//   return headers;
// }

// export async function get<T>(endpoint: string): Promise<ApiResponse<T>> {
//   try {
//     const response = await fetch(`${API_URL}${endpoint}`, {
//       method: 'GET',
//       headers: getHeaders(),
//       credentials: 'include',
//     });
    
//     return await handleResponse<T>(response);
//   } catch (error) {
//     return { error: error instanceof Error ? error.message : 'Network error' };
//   }
// }

// export async function post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
//   try {
//     const response = await fetch(`${API_URL}${endpoint}`, {
//       method: 'POST',
//       headers: getHeaders(),
//       credentials: 'include',
//       body: JSON.stringify(body)
//     });
    
//     return await handleResponse<T>(response);
//   } catch (error) {
//     return { error: error instanceof Error ? error.message : 'Network error' };
//   }
// }

// export async function postFormData<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
//   try {
//     const response = await fetch(`${API_URL}${endpoint}`, {
//       method: 'POST',
//       headers: getHeaders('multipart/form-data'),
//       credentials: 'include',
//       body: formData
//     });
    
//     return await handleResponse<T>(response);
//   } catch (error) {
//     return { error: error instanceof Error ? error.message : 'Network error' };
//   }
// }

// export async function put<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
//   try {
//     const response = await fetch(`${API_URL}${endpoint}`, {
//       method: 'PUT',
//       headers: getHeaders(),
//       credentials: 'include',
//       body: JSON.stringify(body)
//     });
    
//     return await handleResponse<T>(response);
//   } catch (error) {
//     return { error: error instanceof Error ? error.message : 'Network error' };
//   }
// }

// export async function del<T>(endpoint: string): Promise<ApiResponse<T>> {
//   try {
//     const response = await fetch(`${API_URL}${endpoint}`, {
//       method: 'DELETE',
//       headers: getHeaders(),
//       credentials: 'include',
//     });
    
//     return await handleResponse<T>(response);
//   } catch (error) {
//     return { error: error instanceof Error ? error.message : 'Network error' };
//   }
// }



// // Authentication service
// export const authService = {
//   async login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
//     console.log(email, password)
//     const result = await post<AuthResponse>('/api/auth/login/', { email, password });
//     console.log(result)
//     if (result.data) {
//       localStorage.setItem('authToken', result.data.access);
//       localStorage.setItem('refreshToken', result.data.refresh);
//       localStorage.setItem('userData', JSON.stringify(result.data.user));
//     }
    
//     return result;
//   },
  
//   async signup(name: string, email: string, company: string | null, password: string,password2: string): Promise<ApiResponse<MessageResponse>> {
//     return await post<MessageResponse>('/api/auth/register/', { name, email, company, password, password2 });
//   },
  
//   async refreshToken(refreshToken: string): Promise<ApiResponse<{ access: string }>> {
//     const result = await post<{ access: string }>('/api/auth/token/refresh/', { refresh: refreshToken });
    
//     if (result.data) {
//       localStorage.setItem('authToken', result.data.access);
//     }
    
//     return result;
//   },
  
//   async resetPasswordRequest(email: string): Promise<ApiResponse<MessageResponse>> {
//     return await post<MessageResponse>('/api/auth/password/reset/', { email });
//   },
  
//   async resetPassword(uid: string, token: string, password: string): Promise<ApiResponse<MessageResponse>> {
//     return await post<MessageResponse>(`/api/auth/password/reset/${uid}/${token}/`, { password });
//   },
  
//   async googleLogin(token: string): Promise<ApiResponse<AuthResponse>> {
//     const result = await post<AuthResponse>('/api/auth/google/', { token });
    
//     if (result.data) {
//       localStorage.setItem('authToken', result.data.access);
//       localStorage.setItem('refreshToken', result.data.refresh);
//       localStorage.setItem('userData', JSON.stringify(result.data.user));
//     }
    
//     return result;
//   },
  
//   async verifyEmail(uid: string, token: string): Promise<ApiResponse<MessageResponse>> {
//     return await get<MessageResponse>(`/api/auth/activate/${uid}/${token}/`);
//   },
  
//   async resendVerificationEmail(email: string): Promise<ApiResponse<MessageResponse>> {
//     return await post<MessageResponse>('/api/auth/resend-activation/', { email });
//   },
  
//   async logout(): Promise<void> {
//     localStorage.removeItem('authToken');
//     localStorage.removeItem('refreshToken');
//     localStorage.removeItem('userData');
//   },
  
//   isAuthenticated(): boolean {
//     return !!localStorage.getItem('authToken');
//   },
  
//   getUserData(): any {
//     const userData = localStorage.getItem('userData');
//     return userData ? JSON.parse(userData) : null;
//   }
// };




// // file service
// export const fileService = {
//   // Upload a file to a specific bucket with folder structure
//   async uploadFile(file: File, bucket: string, folderPath: string): Promise<ApiResponse<{url: string, path: string}>> {
//     try {
//       // Validate file type
//       const acceptedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
//                             'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//                             'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
//                             'text/plain', 'text/csv', 'text/html', 'text/markdown'];
      
//       if (!acceptedTypes.includes(file.type)) {
//         return { error: `Type de fichier non accepté: ${file.type}. Seuls les documents et fichiers texte sont acceptés.` };
//       }
      
//       // Generate a unique filename using timestamp
//       const timestamp = new Date().getTime();
//       const uniqueFilename = `${folderPath}/${timestamp}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      
//       // Upload file to Appwrite Storage
//       const { data, error } = await appwrite.storage.uploadFile(file, uniqueFilename);
      
//       if (error) {
//         throw new Error(error.message || 'Error uploading file');
//       }
      
//       return { 
//         data: {
//           url: data?.url || '',
//           path: data?.path || uniqueFilename
//         }
//       };
//     } catch (error) {
//       console.error('File upload error:', error);
//       return { error: error instanceof Error ? error.message : 'Erreur lors du téléchargement du fichier' };
//     }
//   },
  
//   // Upload multiple files in batch
//   async uploadFiles(files: File[], bucket: string, projectId: string, userId: number): Promise<ApiResponse<{files: {url: string, path: string, name: string, size: number}[]}>> {
//     try {
//       const folderPath = `${userId}/${projectId.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
//       const uploadedFiles = [];
//       const errors = [];
      
//       for (const file of files) {
//         const result = await this.uploadFile(file, bucket, folderPath);
//         console.log(result)
//         if (result.error) {
//           errors.push(`${file.name}: ${result.error}`);
//         } else if (result.data) {
//           uploadedFiles.push({
//             url: result.data.url,
//             path: result.data.path,
//             name: file.name,
//             size: file.size
//           });
//         }
//       }
      
//       if (errors.length > 0 && uploadedFiles.length === 0) {
//         return { error: `Erreurs lors du téléchar...: ${errors.join(', ')}` };
//       }
      
//       return { 
//         data: { files: uploadedFiles },
//         error: errors.length > 0 ? `Certains fichiers n'ont pas pu être téléchargés: ${errors.join(', ')}` : undefined
//       };
//     } catch (error) {
//       console.error('Batch file upload error:', error);
//       return { error: error instanceof Error ? error.message : 'Erreur lors du téléchargement des fichiers' };
//     }
//   }
// };



// // project service  
// export const projectService = {
//   async getClientProjects(clientId: number): Promise<ApiResponse<Project[]>> {
//     return await get<Project[]>(`/api/clients/${clientId}/projects/`);
//   },
  
//   async createProject(clientId: number, name: string, sourceLanguage: string, targetLanguage: string): Promise<ApiResponse<Project>> {
//     return await post<Project>(`/api/clients/${clientId}/projects/`, { name, source_language: sourceLanguage, target_language: targetLanguage });
//   },
  
//   async getProjectComments(clientId: number, projectId: string): Promise<ApiResponse<Comment[]>> {
//     return await get<Comment[]>(`/api/clients/${clientId}/projects/${projectId}/comments/`);
//   },
  
//   async createComment(clientId: number, projectId: string, text: string): Promise<ApiResponse<Comment>> {
//     return await post<Comment>(`/api/clients/${clientId}/projects/${projectId}/comments/`, { text });
//   },
  
//   async createPayment(clientId: number, projectId: string, amount: number, currency: string): Promise<ApiResponse<Payment>> {
//     return await post<Payment>(`/api/clients/${clientId}/projects/${projectId}/payments/`, { amount, currency });
//   },
// };

