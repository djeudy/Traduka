
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
  currency: 'USD' | 'HTG';
  status: 'pending' | 'completed' | 'failed' | 'processing' | 'cancelled';
  method: 'moncash' | 'bank';
  created_at: string;
  project_id: string;
  user_id: string;
  
  // MonCash specific fields
  moncash_phone?: string;
  moncash_transaction_id?: string;
  moncash_order_id?: string;
  moncash_payment_token?: string;
  moncash_redirect_url?: string;
  
  // Bank transfer specific fields
  bank_name?: string;
  bank_account_number?: string;
  bank_routing_number?: string;
  bank_reference?: string;
  
  // Proof of payment
  proof_of_payment_file_id?: string;
  proof_of_payment_url?: string;
  
  // Admin fields
  admin_notes?: string;
  verified_by?: number;
  verified_at?: string;
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

export type PaymentMethod = 'moncash' | 'bank';

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
  instructions: string | null;
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

export interface Quote {
  id: string;
  project: string;
  total_amount: number;
  currency: 'USD' | 'HTG';
  status: 'pending' | 'sent' | 'accepted' | 'rejected';
  description?: string;
  quote_file_url?: string;
  quote_file_id?: string;
  created_by: User;
  created_at: string;
  sent_at?: string;
  accepted_at?: string;
  rejected_at?: string;
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
  instructions: string | null;
  payments?: Payment[];
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

// Google Sign-In types
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          prompt: () => void;
          renderButton: (container: HTMLElement, options: {
            theme?: 'outline' | 'filled_blue' | 'filled_black';
            size?: 'large' | 'medium' | 'small';
            width?: string;
            text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
            shape?: 'rectangular' | 'pill' | 'circle' | 'square';
          }) => void;
        };
      };
    };
  }
}
