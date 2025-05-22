
import { postFormData,ApiResponse } from './apiUtils';
import { appwrite } from '@/integrations/appwrite/client';
import { ID } from 'appwrite';
export interface FileUploadResponse {
  id: string;
  file: string;
  name: string;
  uploaded_at: string;
}

const fileService = {
  // Upload a file to a specific bucket with folder structure
  async uploadFile(file: File, bucket: string, folderPath: string): Promise<ApiResponse<{url: string, path: string}>> {
    try {
      // Validate file type
      const acceptedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
                            'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                            'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                            'text/plain', 'text/csv', 'text/html', 'text/markdown'];
      
      if (!acceptedTypes.includes(file.type)) {
        return { error: `Type de fichier non accepté: ${file.type}. Seuls les documents et fichiers texte sont acceptés.` };
      }
      
      // Generate a unique filename using timestamp
      const timestamp = new Date().getTime();
      const uniqueFilename = `${folderPath}/${timestamp}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      
      // Upload file to Appwrite Storage
      const { data, error } = await appwrite.storage.uploadFile(file);
      
      if (error) {
        throw new Error(error.message || 'Error uploading file');
      }
      
      return { 
        data: {
          url: data?.url || '',
          path: data?.path || uniqueFilename
        }
      };
    } catch (error) {
      console.error('File upload error:', error);
      return { error: error instanceof Error ? error.message : 'Erreur lors du téléchargement du fichier' };
    }
  },
  
  // Upload multiple files in batch
  async uploadFiles(files: File[], bucket: string, projectId: string, userId: number): Promise<ApiResponse<{files: {url: string, path: string, name: string, size: number}[]}>> {
    try {
      const folderPath = `${userId}/${projectId.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const uploadedFiles = [];
      const errors = [];
      
      for (const file of files) {
        const result = await this.uploadFile(file, bucket, folderPath);
        console.log(result)
        if (result.error) {
          errors.push(`${file.name}: ${result.error}`);
        } else if (result.data) {
          uploadedFiles.push({
            url: result.data.url,
            path: result.data.path,
            name: file.name,
            size: file.size
          });
        }
      }
      
      if (errors.length > 0 && uploadedFiles.length === 0) {
        return { error: `Erreurs lors du téléchar...: ${errors.join(', ')}` };
      }
      
      return { 
        data: { files: uploadedFiles },
        error: errors.length > 0 ? `Certains fichiers n'ont pas pu être téléchargés: ${errors.join(', ')}` : undefined
      };
    } catch (error) {
      console.error('Batch file upload error:', error);
      return { error: error instanceof Error ? error.message : 'Erreur lors du téléchargement des fichiers' };
    }
  }
};

export { fileService };
