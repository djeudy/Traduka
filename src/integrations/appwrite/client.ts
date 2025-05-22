
// Appwrite client for storage and authentication

import { Client, Storage, Databases, Account } from 'appwrite';
import { unique } from '../../lib/utils'
// Configuration constants
const APPWRITE_ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID =  '682856fd002a0682e67d';
const APPWRITE_DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || 'your-database-id';
const APPWRITE_STORAGE_BUCKET_ID = '68285a970017b3d6aba0';

// Initialize Appwrite client
const client = new Client();
client
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

// Initialize Appwrite services
export const storage = new Storage(client);
export const databases = new Databases(client);
export const account = new Account(client);

// Storage related functions
export const appwriteStorage = {
  // Upload a file to storage
  uploadFile: async (file: File) => {
    try {
      const fileId = unique();
      
      const result = await storage.createFile(
        APPWRITE_STORAGE_BUCKET_ID,
        fileId,
        file
      );

      return { 
        data: { 
          id: result.$id,
          path: result.$id,
          url: getFilePreviewUrl(result.$id),
        }, 
        error: null 
      };
    } catch (error) {
      console.error('Appwrite storage upload error:', error);
      return { data: null, error };
    }
  },

  // Get public URL for a file
  getFilePreviewUrl: (fileId: string) => {
    return storage.getFilePreview(APPWRITE_STORAGE_BUCKET_ID, fileId);
  },

  // List all files in storage
  listFiles: async (queries: any[] = []) => {
    try {
      const result = await storage.listFiles(APPWRITE_STORAGE_BUCKET_ID, queries);
      return { data: result.files, error: null };
    } catch (error) {
      console.error('Appwrite storage list error:', error);
      return { data: null, error };
    }
  },

  // Delete a file from storage
  deleteFile: async (fileId: string) => {
    try {
      await storage.deleteFile(APPWRITE_STORAGE_BUCKET_ID, fileId);
      return { data: { id: fileId }, error: null };
    } catch (error) {
      console.error('Appwrite storage delete error:', error);
      return { data: null, error };
    }
  }
};

// Helper function to get file preview URL
function getFilePreviewUrl(fileId: string) {
  return storage.getFilePreview(APPWRITE_STORAGE_BUCKET_ID, fileId).toString();
}

// Export appwrite client as the default
export const appwrite = {
  storage: appwriteStorage,
  client,
  databases,
  account
};
