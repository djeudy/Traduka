
import { get, post, put, del } from './apiUtils';

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
  user_id: number;
}

const notificationService = {
  async getNotifications() {
    return await get<Notification[]>(`/api/notifications/`);
  },
  
  async getNotification(notificationId: string) {
    return await get<Notification>(`/api/notifications/${notificationId}/`);
  },
  
  async markAsRead(notificationId: string) {
    return await put<Notification>(`/api/notifications/${notificationId}/read/`, {});
  },
  
  async markAllAsRead() {
    return await post<void>(`/api/notifications/mark-all-read/`, {});
  },
  
  async deleteNotification(notificationId: string) {
    return await del<void>(`/api/notifications/${notificationId}/`);
  },
  
  async clearAllNotifications() {
    return await del<void>(`/api/notifications/`);
  }
};

export { notificationService };
