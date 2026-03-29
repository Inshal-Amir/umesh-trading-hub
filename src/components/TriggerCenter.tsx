"use client";

import { useState } from 'react';
import { useTriggers } from '../hooks/useTriggers';
import { Settings, Play, Square, AlertTriangle, ShieldAlert } from 'lucide-react';
import ConsentModal from './ConsentModal';

export default function TriggerCenter() {
  const { fireCustomTrigger, isPending } = useTriggers();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{endpoint: string, agent: string} | null>(null);

  const handleAction = (endpoint: string, msg: string) => {
    fireCustomTrigger(endpoint, undefined, msg);
  };

  const handleForceExitRequest = (agent: string, endpoint: string) => {
    setPendingAction({ agent, endpoint });
    setModalOpen(true);
  };

  const confirmForceExit = async () => {
    if (pendingAction) {
      await fireCustomTrigger(pendingAction.endpoint, undefined, `Force Exit executed for ${pendingAction.agent}`);
    }
    setPendingAction(null);
  };

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-xl p-6 h-full flex flex-col">
      <h3 className="text-gray-400 font-medium text-sm tracking-wider uppercase mb-6 flex items-center gap-2">
        <Settings className="w-4 h-4 text-teal" />
        Control Center
      </h3>
      
      <div className="space-y-4 grow">
        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700/50">
          <p className="text-gray-400 text-xs font-mono uppercase tracking-widest mb-3 flex justify-between">
            <span>SA1 Engine (Trend)</span>
            <button 
              onClick={() => handleForceExitRequest('SA1', 'force-exit-sa1')}
              disabled={isPending}
              className="text-red-400 hover:text-red border border-red-400/20 bg-red-400/10 hover:bg-red-400/20 px-2 py-0.5 rounded text-[10px] font-bold transition-colors disabled:opacity-50 flex items-center gap-1"
            >
              <ShieldAlert className="w-3 h-3" /> FORCE EXIT
            </button>
          </p>
          <div className="flex gap-3">
            <button 
              onClick={() => handleAction('start-sa1', 'SA1 Engine Started')}
              disabled={isPending}
              className="flex-1 bg-teal/10 hover:bg-teal hover:text-gray-900 text-teal border border-teal/20 transition-colors rounded-lg py-2 flex justify-center items-center gap-2 disabled:opacity-50"
            >
              <Play className="w-3 h-3 fill-current" />
              <span className="font-bold text-sm">START</span>
            </button>
            <button 
              onClick={() => handleAction('stop-sa1', 'SA1 Engine Stopped')}
              disabled={isPending}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600 transition-colors rounded-lg py-2 flex justify-center items-center gap-2 disabled:opacity-50"
            >
              <Square className="w-3 h-3 fill-current" />
              <span className="font-bold text-sm">STOP</span>
            </button>
          </div>
        </div>
        
        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700/50">
          <p className="text-gray-400 text-xs font-mono uppercase tracking-widest mb-3 flex justify-between">
            <span>SA2 Engine (OBV)</span>
             <button 
              onClick={() => handleForceExitRequest('SA2', 'force-exit-sa2')}
              disabled={isPending}
              className="text-red-400 hover:text-red border border-red-400/20 bg-red-400/10 hover:bg-red-400/20 px-2 py-0.5 rounded text-[10px] font-bold transition-colors disabled:opacity-50 flex items-center gap-1"
            >
              <ShieldAlert className="w-3 h-3" /> FORCE EXIT
            </button>
          </p>
          <div className="flex gap-3">
            <button 
              onClick={() => handleAction('start-sa2', 'SA2 Engine Started')}
              disabled={isPending}
              className="flex-1 bg-teal/10 hover:bg-teal hover:text-gray-900 text-teal border border-teal/20 transition-colors rounded-lg py-2 flex justify-center items-center gap-2 disabled:opacity-50"
            >
              <Play className="w-3 h-3 fill-current" />
              <span className="font-bold text-sm">START</span>
            </button>
            <button 
              onClick={() => handleAction('stop-sa2', 'SA2 Engine Stopped')}
              disabled={isPending}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600 transition-colors rounded-lg py-2 flex justify-center items-center gap-2 disabled:opacity-50"
            >
              <Square className="w-3 h-3 fill-current" />
              <span className="font-bold text-sm">STOP</span>
            </button>
          </div>
        </div>

        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700/50">
           <p className="text-gray-400 text-xs font-mono uppercase tracking-widest mb-3">System Utilities</p>
           <button 
              onClick={() => handleAction('regime-alert', 'Regime scan initiated')}
              disabled={isPending}
              className="w-full bg-gold/10 hover:bg-gold hover:text-gray-900 text-gold border border-gold/20 transition-colors rounded-lg py-2 flex justify-center items-center gap-2 disabled:opacity-50"
            >
              <AlertTriangle className="w-4 h-4" />
              <span className="font-bold text-sm">REGIME ALERT SCAN</span>
            </button>
        </div>
      </div>

      <ConsentModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onConfirm={confirmForceExit} 
        title="EMERGENCY OVERRIDE" 
        symbol="ALL"
        direction="CLOSE"
        details={[
          { label: "Action", value: `FORCE EXIT ${pendingAction?.agent}` },
          { label: "Warning", value: "Liquidating at market price immediately." }
        ]} 
      />
    </div>
  );
}
