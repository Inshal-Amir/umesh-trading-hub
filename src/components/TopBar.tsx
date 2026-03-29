"use client";

import { useSystemStatus } from '../hooks/useDashboardData';
import { useTriggers } from '../hooks/useTriggers';
import { Power, Activity, ShieldAlert, Wifi, WifiOff, LogOut, KeyRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import PasswordChangeModal from './PasswordChangeModal';
import ThemeToggle from './ThemeToggle';

export default function TopBar() {
  const { statusData, isLoading, isError } = useSystemStatus();
  const { fireCustomTrigger, isPending } = useTriggers();
  const [time, setTime] = useState(new Date());
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatUTC = (date: Date) => {
    return date.toISOString().substr(11, 8) + ' UTC';
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isLoggedIn');
    window.location.reload();
  };

  const getStatusColor = (status?: string) => {
    if (status === 'active') return 'text-teal border-teal/20 bg-teal/10';
    if (status === 'paused') return 'text-gray-400 border-gray-400/20 bg-gray-400/10';
    return 'text-red border-red/20 bg-red/10';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-700 bg-gray-900/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gold/10 border border-gold/20">
            <Activity className="h-6 w-6 text-gold" />
          </div>
          <h1 className="text-xl font-bold font-space-grotesk tracking-tight truncate max-w-[150px] sm:max-w-max">Umesh Trading Hub</h1>
          
          <div className="hidden lg:flex items-center ml-8 gap-3">
            <div className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-2 ${getStatusColor(statusData?.agent1)}`}>
              <div className={`w-2 h-2 rounded-full ${statusData?.agent1 === 'active' ? 'bg-teal' : 'bg-gray-400'}`} />
              SA1: {isLoading ? '...' : (statusData?.sa1_mode || 'OFFLINE').toUpperCase()}
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-2 ${getStatusColor(statusData?.agent2)}`}>
              <div className={`w-2 h-2 rounded-full ${statusData?.agent2 === 'active' ? 'bg-teal' : 'bg-gray-400'}`} />
              SA2: {isLoading ? '...' : (statusData?.sa2_mode || 'OFFLINE').toUpperCase()}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          <div className="hidden md:flex flex-col items-end">
            <div className="flex items-center gap-2 text-sm text-gray-400 font-mono">
              {isError ? <WifiOff className="w-4 h-4 text-red animate-pulse" /> : <Wifi className="w-4 h-4 text-teal" />}
              {isError ? <span className="text-red">Reconnecting...</span> : formatUTC(time)}
            </div>
            {statusData?.updated && !isError && (
              <span className="text-[10px] font-mono text-gray-500">Last Update: {new Date(statusData.updated).toLocaleTimeString()}</span>
            )}
          </div>
          
          <button
            onClick={() => fireCustomTrigger('kill', undefined, 'Kill switch activated! Closing positions.')}
            disabled={isPending || statusData?.kill_switch}
            className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-red/10 text-red border border-red/20 rounded-lg font-medium hover:bg-red hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
          >
            {statusData?.kill_switch ? <ShieldAlert className="w-4 h-4" /> : <Power className="w-4 h-4" />}
            <span className="hidden sm:inline">{statusData?.kill_switch ? 'KILL SWITCH ACTIVE' : 'KILL SWITCH'}</span>
          </button>

          <div className="h-6 w-px bg-gray-700 hidden sm:block"></div>

          <ThemeToggle />

          <button onClick={() => setIsUpdateModalOpen(true)} className="p-2 text-gray-400 hover:text-white transition-colors border border-gray-700 rounded-lg hover:bg-gray-800" title="Change Password">
             <KeyRound className="w-4 h-4" />
          </button>

          <button onClick={handleLogout} className="p-2 text-red-400 hover:text-red transition-colors border border-red-400/20 bg-red-400/10 rounded-lg hover:bg-red-400/20" title="Logout">
             <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
      <PasswordChangeModal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)} />
    </header>
  );
}
