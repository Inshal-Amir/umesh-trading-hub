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
    <div className="fixed inset-0 z-[999] flex items-start justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300 pt-32" onClick={onClose}>
      <div 
        className="bg-gray-900 border border-gray-700 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-full max-w-sm overflow-hidden animate-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-950/40">
          <h3 className="text-gray-100 font-bold flex items-center gap-2 text-xs tracking-widest uppercase">
            <ShieldAlert className="w-4 h-4 text-teal" />
            Security Vault
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-white transition-colors p-1.5 hover:bg-gray-800 rounded-lg"
            disabled={isUpdating}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          {success ? (
            <div className="flex flex-col items-center justify-center py-8 text-teal animate-in fade-in zoom-in scale-in">
              <div className="w-20 h-20 bg-teal/10 rounded-full flex items-center justify-center mb-5 border border-teal/20 shadow-[0_0_20px_rgba(45,212,191,0.1)]">
                <CheckCircle className="w-10 h-10 text-teal drop-shadow-[0_0_12px_rgba(45,212,191,0.5)]" />
              </div>
              <p className="font-bold text-xl tracking-tight">KEY UPDATED</p>
              <p className="text-gray-500 text-[10px] mt-2 font-mono uppercase tracking-widest">Access granted with new credentials.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <label className="block text-[10px] text-gray-500 font-bold uppercase tracking-widest ml-1">Current Access Key</label>
                <input
                  type={showPass ? "text" : "password"}
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  required
                  className="w-full bg-black/40 border border-gray-800 text-gray-100 px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal/50 focus:border-teal/50 transition-all font-mono text-sm placeholder:text-gray-700"
                  placeholder="Existing key"
                />
              </div>
              
              <div className="space-y-4 pt-2 border-t border-gray-800/50">
                <div className="space-y-1.5">
                  <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest ml-1">New Access Key</label>
                  <input
                    type={showPass ? "text" : "password"}
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    required
                    className="w-full bg-black/40 border border-gray-800 text-gray-100 px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal/50 focus:border-teal/50 transition-all font-mono text-sm placeholder:text-gray-700"
                    placeholder="Minimal 4 chars"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest ml-1">Confirm New Key</label>
                  <input
                    type={showPass ? "text" : "password"}
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    required
                    className="w-full bg-black/40 border border-gray-800 text-gray-100 px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal/50 focus:border-teal/50 transition-all font-mono text-sm placeholder:text-gray-700"
                    placeholder="Repeat new key"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between px-1">
                  <button 
                    type="button" 
                    onClick={() => setShowPass(!showPass)}
                    className="flex items-center gap-2 text-[10px] text-gray-500 hover:text-teal font-bold transition-colors uppercase tracking-widest"
                  >
                    {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    {showPass ? 'Hide' : 'Show'} Keys
                  </button>
                  {error && <p className="text-red-500 text-[10px] font-bold uppercase tracking-tight animate-pulse">{error}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full bg-teal text-gray-950 font-bold py-3.5 rounded-xl hover:bg-teal-hover transition-all shadow-[0_10px_20px_rgba(45,212,191,0.15)] hover:shadow-[0_10px_25px_rgba(45,212,191,0.25)] disabled:opacity-50 flex items-center justify-center gap-2 text-xs uppercase tracking-widest active:scale-[0.98]"
                >
                  {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'AUTHORIZE UPDATE'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
