"use client";

import { useState } from 'react';
import { ShieldAlert, X, CheckCircle, Eye, EyeOff, Loader2 } from 'lucide-react';

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PasswordChangeModal({ isOpen, onClose }: PasswordChangeModalProps) {
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Check current - fallback to admin123
    const stored = localStorage.getItem('admin_password') || 'admin123';
    
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

    setIsUpdating(true);
    
    // Success simulation for better UX
    setTimeout(() => {
      localStorage.setItem('admin_password', newPass);
      setSuccess(true);
      setIsUpdating(false);
      
      setTimeout(() => {
        onClose();
        // Reset state for future
        setCurrentPass('');
        setNewPass('');
        setConfirmPass('');
        setSuccess(false);
      }, 1500);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in duration-200">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
          <h3 className="text-gray-100 font-bold flex items-center gap-2 text-sm tracking-wide">
            <ShieldAlert className="w-4 h-4 text-teal" />
            SECURITY SETTINGS
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-white transition-colors p-1 hover:bg-gray-800 rounded"
            disabled={isUpdating}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          {success ? (
            <div className="flex flex-col items-center justify-center py-6 text-teal animate-in fade-in zoom-in">
              <div className="w-16 h-16 bg-teal/10 rounded-full flex items-center justify-center mb-4 border border-teal/20">
                <CheckCircle className="w-8 h-8 text-teal drop-shadow-[0_0_10px_rgba(45,212,191,0.5)]" />
              </div>
              <p className="font-bold text-lg">ACCESS KEY UPDATED</p>
              <p className="text-gray-500 text-xs mt-1 font-mono">Changes persisted successfully.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-[10px] text-gray-500 font-bold uppercase tracking-widest ml-1">Current Password</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    required
                    className="w-full bg-gray-950 border border-gray-800 text-gray-100 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal/50 focus:border-teal/50 transition-all font-mono text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              
              <div className="space-y-1.5 pt-2 border-t border-gray-800/50">
                <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest ml-1">New Password</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    required
                    className="w-full bg-gray-950 border border-gray-800 text-gray-100 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal/50 focus:border-teal/50 transition-all font-mono text-sm"
                    placeholder="New access key"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest ml-1">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    required
                    className="w-full bg-gray-950 border border-gray-800 text-gray-100 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal/50 focus:border-teal/50 transition-all font-mono text-sm"
                    placeholder="Repeat access key"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between px-1">
                <button 
                  type="button" 
                  onClick={() => setShowPass(!showPass)}
                  className="flex items-center gap-2 text-[10px] text-gray-500 hover:text-teal font-bold transition-colors uppercase tracking-widest"
                >
                  {showPass ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  {showPass ? 'Hide passwords' : 'Show passwords'}
                </button>
                {error && <p className="text-red-400 text-[10px] font-bold uppercase tracking-tight">{error}</p>}
              </div>

              <button
                type="submit"
                disabled={isUpdating}
                className="w-full mt-4 bg-teal text-gray-950 font-bold py-3 rounded-xl hover:bg-teal/90 transition-all shadow-[0_4px_15px_rgba(45,212,191,0.2)] hover:shadow-[0_4px_20px_rgba(45,212,191,0.3)] disabled:opacity-50 flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
              >
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'AUTHORIZE UPDATE'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
