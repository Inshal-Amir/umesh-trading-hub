"use client";

import { useState, useEffect } from 'react';
import { usePerformanceStats } from '../hooks/useDashboardData';
import { useTriggers } from '../hooks/useTriggers';
import { Shield, Save, Edit2, WifiOff } from 'lucide-react';

export default function RiskGuardCard() {
  const { performanceData, isLoading, isError } = usePerformanceStats();
  const { fireCustomTrigger } = useTriggers();
  
  const [isEditing, setIsEditing] = useState(false);
  const [tradeSize, setTradeSize] = useState(0);
  const [maxLoss, setMaxLoss] = useState(0);

  useEffect(() => {
    if (performanceData) {
      setTradeSize(performanceData.trade_size);
      setMaxLoss(performanceData.daily_max_loss);
    }
  }, [performanceData]);

  if (isLoading) return <div className="p-6 bg-gray-800 rounded-xl border border-gray-700 animate-pulse h-full min-h-[220px]" />;
  if (isError) return (
    <div className="p-6 bg-gray-800 rounded-xl border border-red/50 text-red flex flex-col items-center justify-center h-full min-h-[200px]">
      <WifiOff className="w-6 h-6 mb-2" />
      <p className="text-center font-mono text-xs">Error loading risk state</p>
    </div>
  );

  const todaysLoss = Math.max(0, -(performanceData?.total_pnl || 0)); // Simple calculation for demo
  const riskRemaining = Math.max(0, maxLoss - todaysLoss);
  const riskPercent = (todaysLoss / maxLoss) * 100;

  const handleSave = async () => {
    await fireCustomTrigger('update-risk', { trade_size: tradeSize, daily_max_loss: maxLoss }, 'Risk parameters updated');
    setIsEditing(false);
  };

  return (
    <div className="p-6 bg-gray-800 rounded-xl border border-gray-700 shadow-xl relative overflow-hidden flex flex-col h-full grow">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-gray-400 font-medium text-sm tracking-wider uppercase flex items-center gap-2">
          <Shield className="w-4 h-4 text-teal" />
          Risk Guard
        </h3>
        
        {isEditing ? (
          <button onClick={handleSave} className="text-teal hover:text-white transition-colors bg-teal/10 p-2 rounded-lg">
            <Save className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5">
            <Edit2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 grow">
        <div className="space-y-4">
          <div>
            <p className="text-gray-400 text-[10px] font-mono mb-1 uppercase tracking-widest">Trade Size</p>
            {isEditing ? (
              <input 
                type="number" 
                value={tradeSize} 
                onChange={(e) => setTradeSize(Number(e.target.value))}
                className="w-full bg-gray-900 border border-teal text-white text-lg font-space-grotesk font-bold p-1 rounded-md focus:outline-none"
              />
            ) : (
              <p className="text-lg font-bold font-space-grotesk text-gray-100">${tradeSize}</p>
            )}
          </div>
          <div>
            <p className="text-gray-400 text-[10px] font-mono mb-1 uppercase tracking-widest">Max Loss</p>
            {isEditing ? (
              <input 
                type="number" 
                value={maxLoss} 
                onChange={(e) => setMaxLoss(Number(e.target.value))}
                className="w-full bg-gray-900 border border-red text-white text-lg font-space-grotesk font-bold p-1 rounded-md focus:outline-none"
              />
            ) : (
              <p className="text-lg font-bold font-space-grotesk text-red-400">${maxLoss}</p>
            )}
          </div>
        </div>

        <div className="space-y-4 border-l border-gray-700/50 pl-4">
          <div>
            <p className="text-gray-400 text-[10px] font-mono mb-1 uppercase tracking-widest">Today&apos;s Loss</p>
            <p className={`text-lg font-bold font-space-grotesk ${todaysLoss > 0 ? 'text-red-400' : 'text-teal'}`}>
              ${todaysLoss.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-[10px] font-mono mb-1 uppercase tracking-widest">Remaining</p>
            <p className={`text-lg font-bold font-space-grotesk ${riskRemaining < (maxLoss * 0.2) ? 'text-orange-400' : 'text-teal'}`}>
              ${riskRemaining.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 w-full bg-gray-900 h-1.5 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ${riskPercent > 80 ? 'bg-red' : riskPercent > 50 ? 'bg-orange-500' : 'bg-teal'}`}
          style={{ width: `${Math.min(100, riskPercent)}%` }}
        />
      </div>
    </div>
  );
}
