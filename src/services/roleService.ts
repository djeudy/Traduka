
import { get, post, put, patch, del } from './apiUtils';
import { User, UserRole } from '@/types';
import { ApiResponse } from './apiUtils';

interface RoleChangeResponse {
  success: boolean;
  message: string;
  user?: User;
}

const roleService = {
  // Récupérer tous les utilisateurs avec leur rôle
  async getAllUsersWithRoles() {
    return await get<User[]>(`/api/users/roles/`);
  },
  
  // Changer le rôle d'un utilisateur (admin uniquement)
  async changeUserRole(userId: number, newRole: UserRole): Promise<ApiResponse<RoleChangeResponse>> {
    return await patch<RoleChangeResponse>(`/api/users/${userId}/role/`, { role: newRole });
  },
  
  // Récupérer tous les traducteurs
  async getAllTranslators() {
    return await get<User[]>(`/api/users/translators/`);
  },
  
  // Récupérer tous les clients
  async getAllClients() {
    return await get<User[]>(`/api/users/clients/`);
  },
  
  // Récupérer tous les administrateurs
  async getAllAdmins() {
    return await get<User[]>(`/api/users/admins/`);
  }
};

export { roleService };
