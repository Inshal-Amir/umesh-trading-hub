"use client";

import { useState, useEffect } from 'react';
import AuthScreen from './AuthScreen';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if default password is set in localStorage, if not inject it
    if (!localStorage.getItem('admin_password')) {
      localStorage.setItem('admin_password', 'admin123');
    }

    // Check session
    const loggedIn = sessionStorage.getItem('isLoggedIn');
    setIsAuthenticated(loggedIn === 'true');
  }, []);

  if (isAuthenticated === null) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <AuthScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  return <>{children}</>;
}
