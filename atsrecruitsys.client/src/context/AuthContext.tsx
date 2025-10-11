import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, LoginRequest, User } from '../types';
import { AuthService } from '../services';

// Define the AuthContext type
interface IAuthContext {
  authState: AuthState;
  user: User | null; // Add user property
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
  isRecruiter: () => boolean;
  isHiringManager: () => boolean;
  isApplicant: () => boolean;
}

// Create the AuthContext
const AuthContext = createContext<IAuthContext | undefined>(undefined);

// Props for AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

// Create the AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    loading: true,
    error: null,
  });

  // Check if user is already logged in on component mount
  useEffect(() => {
    const userData = AuthService.getCurrentUser();
    if (userData) {
      console.log('Loaded user from storage:', userData.user); // Debug log
      setAuthState({
        isAuthenticated: true,
        user: userData.user,
        token: userData.token,
        loading: false,
        error: null,
      });
    } else {
      setAuthState((prevState) => ({
        ...prevState,
        loading: false,
      }));
    }
  }, []);

  // Login function
  const login = async (data: LoginRequest) => {
    try {
      setAuthState((prevState) => ({
        ...prevState,
        loading: true,
        error: null,
      }));

      const response = await AuthService.login(data);

      if (response.isSuccess) {
        AuthService.setCurrentUser(response);

        // Extract user from nested User object in response
        const userObj = (response as any).user || response;
        
        const user: User = {
          id: userObj.userId || userObj.id,
          email: userObj.email,
          firstName: userObj.firstName,
          lastName: userObj.lastName,
          roles: userObj.roles || [],
        };

        console.log('Login successful, user roles:', user.roles); // Debug log

        setAuthState({
          isAuthenticated: true,
          user,
          token: response.token,
          loading: false,
          error: null,
        });
      } else {
        setAuthState((prevState) => ({
          ...prevState,
          loading: false,
          error: response.message,
        }));
        throw new Error(response.message);
      }
    } catch (error: any) {
      setAuthState((prevState) => ({
        ...prevState,
        loading: false,
        error: error.message || 'An error occurred during login',
      }));
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    AuthService.logout();
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
      loading: false,
      error: null,
    });
  };

  // Role check functions - with null safety and debug logging
  const isAdmin = () => {
    const hasRole = authState.user?.roles?.includes('Admin') ?? false;
    console.log('isAdmin check:', hasRole, 'roles:', authState.user?.roles); // Debug log
    return hasRole;
  };
  
  const isRecruiter = () => {
    const hasRole = authState.user?.roles?.includes('Recruiter') ?? false;
    console.log('isRecruiter check:', hasRole, 'roles:', authState.user?.roles); // Debug log
    return hasRole;
  };
  
  const isHiringManager = () => {
    const hasRole = authState.user?.roles?.includes('HiringManager') ?? false;
    console.log('isHiringManager check:', hasRole, 'roles:', authState.user?.roles); // Debug log
    return hasRole;
  };
  
  const isApplicant = () => {
    const hasRole = authState.user?.roles?.includes('Applicant') ?? false;
    return hasRole;
  };

  const contextValue = {
    authState,
    user: authState.user,
    login,
    logout,
    isAdmin,
    isRecruiter,
    isHiringManager,
    isApplicant,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// Custom hook for using the AuthContext
export const useAuth = (): IAuthContext => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
