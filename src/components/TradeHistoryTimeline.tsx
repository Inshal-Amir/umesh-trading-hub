"use client";

import { useEventsData } from '../hooks/useDashboardData';
import { Activity, Zap, CheckCircle2, TrendingUp, TrendingDown, WifiOff } from 'lucide-react';

export default function TradeHistoryTimeline() {
  const { eventsData, isLoading, isError } = useEventsData();

  if (isLoading) return <div className="p-6 bg-gray-800 rounded-xl border border-gray-700 animate-pulse h-96" />;
  if (isError) return <div className="p-6 bg-gray-800 rounded-xl border border-red/50 text-red flex flex-col items-center justify-center h-48"><WifiOff className="w-6 h-6 mb-2" /><p className="text-center font-mono text-sm">Error loading events</p></div>;

  const eventsList = eventsData?.events || [];
  // Show last 15 events in reverse order
  const sortedEvents = [...eventsList].reverse().slice(0, 15);

  const getTypeStyles = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'TRADE_OPENED': return 'bg-teal/20 text-teal border-teal/30';
      case 'TRADE_CLOSED': return 'bg-gold/20 text-gold border-gold/30';
      case 'MODE_CHANGE': return 'bg-blue-400/20 text-blue-400 border-blue-400/30';
      case 'KILL_SWITCH': return 'bg-red/20 text-red border-red/30';
      default: return 'bg-gray-700/50 text-gray-400 border-gray-600/50';
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-xl p-6 flex flex-col h-full max-h-[500px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-gray-400 font-medium text-sm tracking-wider uppercase flex items-center gap-2">
          <Activity className="w-4 h-4 text-teal" />
          Recent Events
        </h3>
        <span className="text-[10px] text-gray-500 font-mono italic">Auto-refresh (30s)</span>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {sortedEvents.length === 0 ? (
          <p className="text-gray-500 text-sm font-mono text-center mt-10">Waiting for system logs...</p>
        ) : (
          sortedEvents.map((event, i) => {
            const time = event[1] || '';
            const type = event[2] || 'INFO';
            const desc = event[3] || '';

            return (
              <div key={`${event[0]}-${i}`} className="flex gap-4 relative">
                {i !== sortedEvents.length - 1 && (
                  <div className="absolute top-8 bottom-[-16px] left-4 w-px bg-gray-700/50" />
                )}
                
                <div className="w-8 h-8 rounded-full border border-gray-700 bg-gray-900 flex shrink-0 items-center justify-center z-10">
                  <Activity className={`w-3 h-3 ${type.includes('TRADE') ? 'text-teal' : 'text-gray-500'}`} />
                </div>
                
                <div className="flex-1 pb-4">
                  <div className="flex justify-between items-start mb-1 gap-4">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${getTypeStyles(type)}`}>
                      {type}
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono whitespace-nowrap">
                      {new Date(time).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-gray-300 text-xs font-mono leading-relaxed mt-1">
                    {desc}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
