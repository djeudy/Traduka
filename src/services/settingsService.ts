
import { get, put, post } from './apiUtils';

export interface UserSettings {
  id: number;
  user_id: number;
  theme: 'light' | 'dark' | 'system';
  notifications_enabled: boolean;
  email_notifications: boolean;
  language_preference: string;
  display_name: string;
}

export interface AppSettings {
  maintenance_mode: boolean;
  version: string;
  features: {
    [key: string]: boolean;
  };
}

const settingsService = {
  async getUserSettings() {
    return await get<UserSettings>(`/api/settings/user/`);
  },
  
  async updateUserSettings(settings: Partial<UserSettings>) {
    return await put<UserSettings>(`/api/settings/user/`, settings);
  },
  
  async getAppSettings() {
    return await get<AppSettings>(`/api/settings/app/`);
  },
  
  async resetUserSettings() {
    return await post<UserSettings>(`/api/settings/user/reset/`, {});
  }
};

export { settingsService };
