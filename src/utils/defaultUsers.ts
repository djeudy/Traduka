
import { User, UserRole } from '@/types';

export const defaultUsers: User[] = [
  {
    id: 1,
    name: "Admin",
    email: "admin@example.com",
    company: "Translation Company",
    role: "admin"
  },
  {
    id: 2,
    name: "Translator",
    email: "translator@example.com",
    company: "Freelance Translations",
    role: "translator"
  },
  {
    id: 3,
    name: "Client",
    email: "client@example.com",
    company: "Client Company",
    role: "client"
  }
];

export const getUserByEmail = (email: string): User | undefined => {
  return defaultUsers.find(user => user.email === email);
};

export const getUserById = (id: number): User | undefined => {
  return defaultUsers.find(user => user.id === id);
};
