"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AuthUser, LoginData, SignupData, OngSignupData, login, signup, signupOng, me, logout } from "@/services/Auth/Auth";

interface UserSignupInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isOng: boolean;
  login: (data: LoginData) => Promise<void>;
  signup: (data: UserSignupInput) => Promise<AuthUser>;
  signupOng: (data: OngSignupData) => Promise<AuthUser>;
  logout: () => Promise<void>;
  setUser: (user: AuthUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isOng = user?.type === 'ong';

  const checkAuth = async () => {
    try {
      const userData = await me();
      setUser(userData);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const publicPaths = ['/entrar', '/cadastrar', '/'];
      const isPublicPath = publicPaths.includes(currentPath);

      if (!isPublicPath) {
        checkAuth();
      } else {
        setIsLoading(false);
      }
    }
  }, []);

  const handleLogin = async (data: LoginData) => {
    setIsLoading(true);
    try {
      await login(data);
      const userData = await me();
      setUser(userData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (data: UserSignupInput): Promise<AuthUser> => {
    setIsLoading(true);
    try {
      const signupData: SignupData = {
        fullName: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: data.password,
      };
      const response = await signup(signupData);
      setUser(response.user);
      return response.user;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupOng = async (data: OngSignupData): Promise<AuthUser> => {
    setIsLoading(true);
    try {
      const response = await signupOng(data);
      setUser(response.user);
      return response.user;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isOng,
        login: handleLogin,
        signup: handleSignup,
        signupOng: handleSignupOng,
        logout: handleLogout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};