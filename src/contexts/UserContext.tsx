import React, { useState, useEffect, createContext, useContext } from 'react';
import { User, UserRole } from '../types';
import { authService } from '@/services/authService';

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  logout: () => Promise<void>;
  verifyEmail: (uid: string, token: string) => Promise<boolean>;
  isEmailVerified: boolean;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  loading: true,
  logout: async () => {},
  verifyEmail: async () => false,
  isEmailVerified: false,
});

export const useUser = () => useContext(UserContext);

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  // Setup token refresh
  useEffect(() => {
    const refreshAuthToken = async () => {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        try {
          const response = await authService.refreshToken(refreshToken);
          
          if (response.data && response.data.access) {
            localStorage.setItem('authToken', response.data.access);
          }
        } catch (error) {
          console.error("Token refresh error:", error);
          // If refresh fails, log the user out
          logout();
        }
      }
    };
    
    // Refresh token on mount
    refreshAuthToken();
    
    // Setup interval to refresh token (every 10 minutes)
    const tokenRefreshInterval = setInterval(() => {
      if (authService.isAuthenticated()) {
        refreshAuthToken();
      }
    }, 10 * 60 * 1000); // 10 minutes
    
    return () => {
      clearInterval(tokenRefreshInterval);
    };
  }, []);

  // Logout function
  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsEmailVerified(false);
      // Redirect to login page
      window.location.href = '/login';
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const verifyEmail = async (uid: string, token: string): Promise<boolean> => {
    try {
      const response = await authService.verifyEmail(uid, token);
      if (response.data && !response.error) {
        setIsEmailVerified(true);
        
        // Update the stored user data to reflect email verification
        const userData = authService.getUserData();
        if (userData) {
          localStorage.setItem('userData', JSON.stringify({
            ...userData,
            email_verified: true
          }));
        }
        
        return true;
      } else {
        console.error("Email verification failed:", response.error);
        return false;
      }
    } catch (error) {
      console.error("Error verifying email:", error);
      return false;
    }
  };

  // Update internal user state whenever the component mounts
  const updateUserState = (userData: any) => {
    if (userData) {
      setUser({
        id: userData.id,
        email: userData.email,
        name: userData.name,
        company: userData.company || undefined,
        role: userData.role as UserRole,
      });
      
      // Set email verification status
      setIsEmailVerified(userData.email_verified || false);
    }
  };

  useEffect(() => {
    // Check if the user is already authenticated
    const checkUserSession = () => {
      try {
        if (authService.isAuthenticated()) {
          const userData = authService.getUserData();
          if (userData) {
            updateUserState(userData);
          }
        }
      } catch (error) {
        console.error("Error retrieving session:", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkUserSession();
  }, []);

  // Update internal state when setUser is called
  const setUserWithVerification = (newUser: User | null) => {
    setUser(newUser);
    
    // If setting a user, check if the email is verified from localStorage
    if (newUser) {
      const userData = authService.getUserData();
      if (userData) {
        setIsEmailVerified(userData.email_verified || false);
      }
    } else {
      setIsEmailVerified(false);
    }
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser: setUserWithVerification, 
      loading, 
      logout, 
      verifyEmail, 
      isEmailVerified 
    }}>
      {children}
    </UserContext.Provider>
  );
};
