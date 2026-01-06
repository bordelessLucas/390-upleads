import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { login as firebaseLogin, register as firebaseRegister, logout as firebaseLogout } from '../services/authService';

export interface UserProfile {
  displayName?: string;
  email?: string;
  uid: string;
}

export interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        try {
          setCurrentUser(user);
          
          if (user) {
            const profile: UserProfile = {
              displayName: user.displayName || undefined,
              email: user.email || undefined,
              uid: user.uid
            };
            setUserProfile(profile);
          } else {
            setUserProfile(null);
          }
        } catch (error) {
          console.error('Erro no estado de autenticação:', error);
        } finally {
          setLoading(false);
        }
      });

      return unsubscribe;
    } catch (error) {
      console.error('Erro ao configurar listener de autenticação:', error);
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    await firebaseLogin(email, password);
  };

  const register = async (email: string, password: string, displayName: string) => {
    await firebaseRegister(email, password, displayName);
  };

  const logout = async () => {
    await firebaseLogout();
    setUserProfile(null);
  };

  const refreshProfile = async () => {
    if (currentUser) {
      const profile: UserProfile = {
        displayName: currentUser.displayName || undefined,
        email: currentUser.email || undefined,
        uid: currentUser.uid
      };
      setUserProfile(profile);
    }
  };

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    login,
    register,
    logout,
    refreshProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

