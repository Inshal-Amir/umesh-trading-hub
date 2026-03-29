"use client";

import { useBalanceData } from '../hooks/useDashboardData';
import { Wallet, TrendingUp, TrendingDown, WifiOff } from 'lucide-react';

export default function PortfolioCard() {
  const { balanceData, isLoading, isError } = useBalanceData();

  if (isLoading) return <div className="p-6 bg-gray-800 rounded-xl border border-gray-700 animate-pulse h-48" />;
  if (isError) return <div className="p-6 bg-gray-800 rounded-xl border border-red/50 text-red flex items-center justify-center h-48"><WifiOff className="w-6 h-6 mb-2 mx-auto" /><p className="text-center font-mono text-sm">Error loading portfolio</p></div>;

  const pnlIsPositive = (balanceData?.total_pnl || 0) >= 0;

  return (
    <div className="p-6 bg-gray-800 rounded-xl border border-gray-700 shadow-xl relative overflow-hidden h-full flex flex-col justify-between">
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <Wallet className="w-24 h-24 text-teal" />
      </div>
      
      <div>
        <h3 className="text-gray-400 font-medium text-sm tracking-wider uppercase mb-4">Portfolio Value</h3>
        
        <div className="flex items-end gap-3 mb-6">
          <span className="text-4xl font-bold font-space-grotesk text-white">
            ${(balanceData?.total_usd || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
          <div className={`flex items-center gap-1 text-sm font-medium pb-1 ${pnlIsPositive ? 'text-teal' : 'text-red'}`}>
            {pnlIsPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            ${Math.abs(balanceData?.total_pnl || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700/50">
        <div>
          <p className="text-gray-400 text-xs uppercase mb-1">SOL Balance</p>
          <p className="font-mono text-gray-100">{balanceData?.sol?.toFixed(4) || "0.0000"}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs uppercase mb-1">USDC Balance</p>
          <p className="font-mono text-gray-100">${balanceData?.usdc?.toLocaleString() || "0.00"}</p>
        </div>
      </div>
    </div>
  );
}
