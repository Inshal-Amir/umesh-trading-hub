"use client";

import { useState } from 'react';
import { Shield } from 'lucide-react';

interface AuthScreenProps {
  onLogin: () => void;
}

export default function AuthScreen({ onLogin }: AuthScreenProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stored = localStorage.getItem('admin_password');
    if (password === stored) {
      sessionStorage.setItem('isLoggedIn', 'true');
      onLogin();
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-teal/10 rounded-full flex items-center justify-center mb-4 border border-teal/20">
            <Shield className="w-8 h-8 text-teal" />
          </div>
          <h1 className="text-2xl font-space-grotesk font-bold text-gray-100">Umesh Trading Hub</h1>
          <p className="text-gray-400 text-sm mt-2 font-mono">AUTHORIZED ACCESS ONLY</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="password"
              placeholder="Enter Access Key"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              className="w-full bg-gray-800 border border-gray-700 text-gray-100 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal transition-all text-center font-mono tracking-widest placeholder:tracking-normal"
              autoFocus
            />
            {error && (
              <p className="text-red-400 text-xs text-center mt-2 font-medium">Invalid access key provided</p>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full bg-teal text-gray-950 font-bold py-3 rounded-xl hover:bg-teal/90 transition-colors shadow-[0_0_15px_rgba(45,212,191,0.2)] hover:shadow-[0_0_20px_rgba(45,212,191,0.3)]"
          >
            INITIALIZE UPLINK
          </button>
        </form>

        <p className="text-gray-600 text-xs text-center mt-8 font-mono">
          ⚠️ Client-side auth only - not for production
        </p>
      </div>
    </div>
  );
}
