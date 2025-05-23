
import { Project, Document, Comment, Payment, UserRole } from '../types';

// Fonction pour générer un ID aléatoire
export const generateId = () => Math.random().toString(36).substring(2, 15);

// Documents fictifs
export const mockDocuments: Document[] = [
  {
    id: 'doc-1',
    source_url: '/documents/sample-document-1.pdf',
    name: 'Contrat de service.pdf',
    url: '/documents/sample-document-1.pdf',
    size: 240000,
    uploaded_at: '2023-04-15T10:30:00Z',
    path: '/documents/sample-document-1.pdf',
  },
  {
    id: 'doc-2',
    source_url: '/documents/sample-document-2.docx',
    name: 'Cahier des charges.docx',
    url: '/documents/sample-document-2.docx',
    size: 350000,
    uploaded_at: '2023-04-16T14:20:00Z',
    path: '/documents/sample-document-2.docx',
  },
  {
    id: 'doc-3',
    source_url: '/documents/sample-document-3.pdf',
    name: 'Manuel utilisateur.pdf',
    url: '/documents/sample-document-3.pdf',
    size: 1200000,
    uploaded_at: '2023-04-17T09:45:00Z',
    path: '/documents/sample-document-3.pdf',
  }
];

// Commentaires fictifs
export const mockComments: Comment[] = [
  {
    id: 'comment-1',
    text: 'Je viens d\'examiner votre document et j\'ai commencé la traduction. Je pense pouvoir le livrer dans 3 jours.',
    created_at: '2023-04-18T11:30:00Z',
    user_id: '2',
    project_id: 'project-1',
    user: {
      name: 'Sophie Martin',
      email: 'sophie.m@example.com',
      role: 'translator' as UserRole
    }
  },
  {
    id: 'comment-2',
    text: 'Merci pour votre retour rapide. Avez-vous besoin d\'informations supplémentaires sur le contexte du document?',
    created_at: '2023-04-18T13:45:00Z',
    user_id: '1',
    project_id: 'project-1',
    user: {
      name: 'Jean Dupont',
      email: 'jean.d@example.com',
      role: 'client' as UserRole
    }
  },
];

// Paiements fictifs
export const mockPayments: Payment[] = [
  {
    id: 'payment-1',
    amount: 250,
    currency: 'EUR',
    status: 'completed',
    created_at: '2023-04-20T09:15:00Z',
    project_id: 'project-2',
    user_id: '1'
  },
  {
    id: 'payment-2',
    amount: 180,
    currency: 'EUR',
    status: 'pending',
    created_at: '2023-04-22T16:30:00Z',
    project_id: 'project-3',
    user_id: '1'
  }
];

// Projets fictifs
export const mockProjects: Project[] = [
  {
    id: 'project-1',
    name: 'Traduction contrat juridique',
    source_language: 'Français',
    target_language: 'Anglais',
    status: 'in-progress',
    submitted_at: '2023-04-15T10:30:00Z',
    started_at: '2023-04-16T08:45:00Z',
    estimated_completion_date: '2023-04-25T17:00:00Z',
    completed_at: null,
    private_project: false,
    client: 1,
    translator: 2,
    documents: [mockDocuments[0]],
    comments: [mockComments[0], mockComments[1]],
    payments: []
  },
  {
    id: 'project-2',
    name: 'Traduction site web e-commerce',
    source_language: 'Anglais',
    target_language: 'Français',
    status: 'completed',
    submitted_at: '2023-03-20T14:15:00Z',
    started_at: '2023-03-22T10:30:00Z',
    estimated_completion_date: '2023-04-05T17:00:00Z',
    completed_at: '2023-04-03T11:20:00Z',
    private_project: false,
    client: 1,
    translator: 3,
    documents: [mockDocuments[1], mockDocuments[2]],
    comments: [],
    payments: [mockPayments[0]]
  },
  {
    id: 'project-3',
    name: 'Documentation technique',
    source_language: 'Allemand',
    target_language: 'Français',
    status: 'waiting',
    submitted_at: '2023-04-22T16:30:00Z',
    started_at: null,
    estimated_completion_date: null,
    completed_at: null,
    private_project: true,
    client: 3,
    translator: null,
    documents: [],
    comments: [],
    payments: [mockPayments[1]]
  }
];
