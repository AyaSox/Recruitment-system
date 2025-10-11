import api from './api';
import { LoginRequest, AuthResponse } from '../types';

// Define User interface for better type safety
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export interface StoredAuthData {
  user: User;
  token: string;
}

const AuthService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/login', data);
    return response.data;
  },

  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: (): StoredAuthData | null => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (!token || !userStr) return null;

    try {
      const user = JSON.parse(userStr) as User;
      return { user, token };
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      return null;
    }
  },

  setCurrentUser: (data: any): void => {
    if (data.token) {
      // Handle both flat and nested response structures
      const user = data.user || data; // Backend sends nested User object
      
      const userData = {
        id: user.userId || user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles || [], // Ensure roles is always an array
      };
      
      console.log('Storing user data:', userData); // Debug log
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(userData));
    }
  },

  hasRole: (requiredRole: string): boolean => {
    const userData = AuthService.getCurrentUser();
    if (!userData) return false;
    return userData.user.roles.includes(requiredRole);
  },
};

export default AuthService;
