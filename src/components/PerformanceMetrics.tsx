"use client";

import { usePerformanceStats, useBalanceData } from '../hooks/useDashboardData';
import { BarChart3, TrendingUp, TrendingDown, Target, Zap, Clock } from 'lucide-react';

export default function PerformanceMetrics() {
  const { performanceData, isLoading: perfLoading } = usePerformanceStats();
  const { balanceData, isLoading: balLoading } = useBalanceData();

  const isLoading = perfLoading || balLoading;

  if (isLoading) return <div className="p-6 bg-gray-800 rounded-xl border border-gray-700 animate-pulse h-full min-h-[200px]" />;

  const stats = [
    { 
      label: 'Open Trades', 
      value: balanceData?.open_trades || 0, 
      icon: <Zap className="w-4 h-4 text-teal" />,
      color: 'text-teal'
    },
    { 
      label: 'Closed Trades', 
      value: balanceData?.closed_trades || 0, 
      icon: <Clock className="w-4 h-4 text-gray-400" />,
      color: 'text-gray-300'
    },
    { 
      label: 'Win Rate', 
      value: `${performanceData?.win_rate?.toFixed(1) || 0}%`, 
      icon: <Target className="w-4 h-4" />,
      color: (performanceData?.win_rate || 0) >= 50 ? 'text-teal shadow-teal/20' : 'text-red-400',
      trend: (performanceData?.win_rate || 0) >= 50 ? 'up' : 'down'
    },
    { 
      label: 'Total P&L', 
      value: `$${performanceData?.total_pnl?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}`, 
      icon: (performanceData?.total_pnl || 0) >= 0 ? <TrendingUp className="w-4 h-4 text-teal" /> : <TrendingDown className="w-4 h-4 text-red-500" />,
      color: (performanceData?.total_pnl || 0) >= 0 ? 'text-teal' : 'text-red-500',
      trend: (performanceData?.total_pnl || 0) >= 0 ? 'up' : 'down'
    },
    { 
      label: 'Best Trade', 
      value: `$${performanceData?.best_trade?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}`, 
      icon: <TrendingUp className="w-4 h-4 text-teal" />,
      color: 'text-teal',
      trend: 'up'
    },
    { 
      label: 'Avg P&L', 
      value: `$${performanceData?.avg_pnl?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}`, 
      icon: (performanceData?.avg_pnl || 0) >= 0 ? <TrendingUp className="w-4 h-4 text-teal" /> : <TrendingDown className="w-4 h-4 text-red-500" />,
      color: (performanceData?.avg_pnl || 0) >= 0 ? 'text-teal' : 'text-red-500',
      trend: (performanceData?.avg_pnl || 0) >= 0 ? 'up' : 'down'
    }
  ];

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-xl p-6 h-full flex flex-col">
      <h3 className="text-gray-400 font-medium text-sm tracking-wider uppercase mb-6 flex items-center gap-2">
        <BarChart3 className="w-4 h-4 text-teal" />
        Trade Statistics
      </h3>
      
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 grow">
        {stats.map((stat, i) => (
          <div key={i} className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-gray-400 text-[10px] uppercase font-mono tracking-widest">
              {stat.icon}
              {stat.label}
            </div>
            <div className={`text-xl font-bold font-space-grotesk flex items-center gap-1 ${stat.color}`}>
              {stat.value}
              {stat.trend && (
                stat.trend === 'up' ? 
                <TrendingUp className="w-3 h-3" /> : 
                <TrendingDown className="w-3 h-3" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
