import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAdmin: boolean;
  userEmail: string | null;
  loginAsAdmin: (password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('kalara_admin_auth') === 'true';
  });
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    return localStorage.getItem('kalara_admin_email') || null;
  });

  useEffect(() => {
    if (isAdmin) {
      localStorage.setItem('kalara_admin_auth', 'true');
    } else {
      localStorage.removeItem('kalara_admin_auth');
      localStorage.removeItem('kalara_admin_email');
    }
  }, [isAdmin]);

  const loginAsAdmin = (pass: string) => {
    if (pass === 'kalara2026' || pass === 'admin') {
      setIsAdmin(true);
      setUserEmail('admin@kalaradistro.id');
      localStorage.setItem('kalara_admin_email', 'admin@kalaradistro.id');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    setUserEmail(null);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, userEmail, loginAsAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
