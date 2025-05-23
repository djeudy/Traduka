
export type UserRole = 'admin' | 'translator' | 'client';

export interface User {
  id: number;
  name: string;
  email: string;
  company?: string;
  role: UserRole;
}

export interface Comment {
  id: string;
  text: string;
  created_at: string;
  user_id: string;
  project_id: string;
  user?: {
    name: string;
    email: string;
    role?: UserRole;
  };
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  project_id: string;
  user_id: string;
}

export interface ProjectDocument {
  id?: string;
  name: string;
  path: string;
  size: number;
  url: string;
  uploaded_at?: string;
  project_id?: string;
}

export type PaymentMethod = 'stripe' | 'paypal' | 'moncash';

export type ProjectStatus = 'waiting' | 'in-progress' | 'review' | 'completed';

export interface Project {
  id: string;                           // UUID
  name: string;
  source_language: string;
  target_language: string;
  status: string;                      // peut-être un enum ou string vide
  submitted_at: string;                // ISO date string
  started_at: string | null;           // ISO date string ou null
  estimated_completion_date: string | null; // ISO date string ou null
  completed_at: string | null;         // ISO date string ou null
  private_project: boolean;
  client: number;                      // id client
  translator: number | null;           // id traducteur ou null
  documents: Document[];               // tableau de documents 
  payments: Payment[];
  comments: Comment[];
  quote?: DocumentQuote[];             // New field for document quotes
}

export interface Document {
  id: string;
  source_url: string;
  name: string;
  url?: string;
  size?: number;
  uploaded_at?: string;
  translated_url?: string;
  completedAt?: string;
  path?: string;  // Added to satisfy TypeScript
}

export interface DocumentQuote {
  document_id: string;
  document_name: string;
  price: number;
  currency: string;
}

// API response interfaces to match backend structure
export interface ApiProject {
  id: string;
  source_document_count: number,
  translated_document_count: number,
  name: string;
  client: number;
  translator: number | null;
  source_language: string;
  target_language: string;
  status: string;
  submitted_at: string;
  started_at: string | null;
  estimated_completion_date: string | null;
  completed_at: string | null;
  private_project: boolean;
}

export interface ApiComment {
  id: string;
  text: string;
  user: number;
  project: string;
  created_at: string;
}

export interface ApiPayment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  user: number;
  project: string;
  created_at: string;
}
