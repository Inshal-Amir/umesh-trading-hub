"use client";

import { useState } from 'react';
import { ShieldAlert, X, CheckCircle } from 'lucide-react';

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PasswordChangeModal({ isOpen, onClose }: PasswordChangeModalProps) {
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Check current
    const stored = localStorage.getItem('admin_password');
    if (currentPass !== stored) {
      setError('Current password is incorrect.');
      return;
    }

    if (newPass.length < 4) {
      setError('New password must be at least 4 characters long.');
      return;
    }

    if (newPass !== confirmPass) {
      setError('New passwords do not match.');
      return;
    }

    // Success
    localStorage.setItem('admin_password', newPass);
    setSuccess(true);
    setTimeout(() => {
      onClose();
      // Reset state for future
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
      setSuccess(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-800/50">
          <h3 className="text-gray-200 font-bold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-teal" />
            Change Password
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          {success ? (
            <div className="flex flex-col items-center justify-center py-6 text-teal animate-in fade-in">
              <CheckCircle className="w-12 h-12 mb-3 drop-shadow-[0_0_10px_rgba(45,212,191,0.5)]" />
              <p className="font-bold">Password Updated</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Current Password</label>
                <input
                  type="password"
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  required
                  className="w-full bg-gray-800 border border-gray-700 text-gray-100 px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal focus:border-teal"
                />
              </div>
              
              <div>
                <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">New Password</label>
                <input
                  type="password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  required
                  className="w-full bg-gray-800 border border-gray-700 text-gray-100 px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal focus:border-teal"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  required
                  className="w-full bg-gray-800 border border-gray-700 text-gray-100 px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal focus:border-teal"
                />
              </div>

              {error && <p className="text-red-400 text-xs mt-2">{error}</p>}

              <button
                type="submit"
                className="w-full mt-6 bg-teal text-gray-950 font-bold py-2 rounded-lg hover:bg-teal/90 transition-colors shadow-[0_0_15px_rgba(45,212,191,0.2)] hover:shadow-[0_0_20px_rgba(45,212,191,0.3)]"
              >
                Update Password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
