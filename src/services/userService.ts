
import { get, put, patch } from './apiUtils';

export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  company?: string;
  role: string;
}

const userService = {
  async getAllUsers() {
    return await get<User[]>(`/api/users/`);
  },
  
  async getUser(userId: number) {
    return await get<User>(`/api/users/${userId}/`);
  },
  
  async changeUserRole(userId: number, role: string) {
    return await patch<User>(`/api/users/${userId}/change_role/`, { role });
  },
  
  async getCurrentUser(userId: number) {
    return await get<User>(`/api/users/me/${userId}/`);
  },
  
  async updateCurrentUser(userId: number, userData: Partial<User>) {
    return await put<User>(`/api/users/me/${userId}/`, userData);
  },
  
  async patchCurrentUser(userId: number, userData: Partial<User>) {
    return await patch<User>(`/api/users/me/${userId}/`, userData);
  }
};

export { userService };
