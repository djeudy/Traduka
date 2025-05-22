
import { get, post } from './apiUtils';

// Auth response interfaces
export interface AuthResponse {
  access: string;
  refresh: string;
  user: any;
  role: string;
}

export interface MessageResponse {
  message: string;
}

const authService = {
  async login(email: string, password: string): Promise<{ data?: AuthResponse; error?: string }> {
    const result = await post<AuthResponse>('/api/auth/login/', { email, password });
    if (result.data) {
      localStorage.setItem('authToken', result.data.access);
      localStorage.setItem('refreshToken', result.data.refresh);
      localStorage.setItem('userData', JSON.stringify(result.data.user));
    }
    
    return result;
  },
  
  async signup(name: string, email: string, company: string | null, password: string, password2: string): Promise<{ data?: MessageResponse; error?: string }> {
    return await post<MessageResponse>('/api/auth/register/', { name, email, company, password, password2 });
  },
  
  async refreshToken(refreshToken: string): Promise<{ data?: { access: string }; error?: string }> {
    const result = await post<{ access: string }>('/api/auth/token/refresh/', { refresh: refreshToken });
    
    if (result.data) {
      localStorage.setItem('authToken', result.data.access);
    }
    
    return result;
  },
  
  async resetPasswordRequest(email: string): Promise<{ data?: MessageResponse; error?: string }> {
    return await post<MessageResponse>('/api/auth/password/reset/', { email });
  },
  
  async resetPassword(uid: string, token: string, password: string): Promise<{ data?: MessageResponse; error?: string }> {
    return await post<MessageResponse>(`/api/auth/password/reset/${uid}/${token}/`, { password });
  },
  
  async googleLogin(token: string): Promise<{ data?: AuthResponse; error?: string }> {
    const result = await post<AuthResponse>('/api/auth/google/', { token });
    
    if (result.data) {
      localStorage.setItem('authToken', result.data.access);
      localStorage.setItem('refreshToken', result.data.refresh);
      localStorage.setItem('userData', JSON.stringify(result.data.user));
    }
    
    return result;
  },
  
  async verifyEmail(uid: string, token: string): Promise<{ data?: MessageResponse; error?: string }> {
    return await get<MessageResponse>(`/api/auth/activate/${uid}/${token}/`);
  },
  
  async resendVerificationEmail(email: string): Promise<{ data?: MessageResponse; error?: string }> {
    return await post<MessageResponse>('/api/auth/resend-activation/', { email });
  },
  
  async logout(): Promise<void> {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
  },
  
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  },
  
  getUserData(): any {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }
};

export { authService };
