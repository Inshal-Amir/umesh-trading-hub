"use client";

import { useState } from 'react';
import { useSignals } from '../hooks/useSignals';
import { useTriggers } from '../hooks/useTriggers';
import ConsentModal from './ConsentModal';
import { Play, RotateCw, ExternalLink } from 'lucide-react';

const TRACKED_SYMBOLS = ['BTCUSDT', 'SOLUSDT', 'ETHUSDT'];

export default function SignalTable() {
  const { fireCustomTrigger } = useTriggers();
  const [modalOpen, setModalOpen] = useState(false);
  const [activeSymbol, setActiveSymbol] = useState('');
  const [activeDirection, setActiveDirection] = useState('LONG');

  const symbolsData = TRACKED_SYMBOLS.map(symbol => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { signals, isLoading } = useSignals(symbol);
    return { symbol, signals, isLoading };
  });

  const handleAutoTrade = (symbol: string, direction: string) => {
    setActiveSymbol(symbol);
    setActiveDirection(direction);
    setModalOpen(true);
  };

  const confirmAutoTrade = async () => {
    await fireCustomTrigger('switch-mode', { agent: 'sa1', mode: 'auto', symbol: activeSymbol }, `Auto Trade armed for ${activeSymbol}`);
    // TODO: Connect this to `engine.py --auto SYMBOL SA1` in backend in the future.
  };

  const getDirectionColor = (dir?: string) => {
    if (dir === 'LONG') return 'text-teal border-teal/20 bg-teal/10';
    if (dir === 'SHORT') return 'text-red border-red/20 bg-red/10';
    return 'text-gray-400 border-gray-400/20 bg-gray-400/10';
  };

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-xl overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-gray-700 bg-gray-900/50">
        <h3 className="text-gray-400 font-medium text-sm tracking-wider uppercase">SA1 Live Signals</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-700/50 text-[10px] uppercase tracking-wider text-gray-500 font-mono bg-gray-900/40">
              <th className="p-3 font-medium">Symbol</th>
              <th className="p-3 font-medium">Strategy</th>
              <th className="p-3 font-medium">Direction</th>
              <th className="p-3 font-medium text-right">Entry</th>
              <th className="p-3 font-medium text-right">SL</th>
              <th className="p-3 font-medium text-right">TP</th>
              <th className="p-4 font-medium text-right pr-6">Tech Info</th>
            </tr>
          </thead>
          <tbody className="text-sm font-space-grotesk text-gray-100">
            {symbolsData.map(({ symbol, signals, isLoading }) => {
              const signal = signals?.sa1;
              const isNoTrade = signal?.direction === 'NO TRADE';
              const direction = signal?.direction || 'NO TRADE';
              
              return (
                <tr key={symbol} className="border-b border-gray-700/20 hover:bg-gray-700/20 transition-colors group">
                  <td className="p-3">
                     <span className="font-bold">{symbol}</span>
                  </td>
                  <td className="p-3">
                     <span className="text-xs text-gray-400 font-mono italic">
                        {isLoading ? '...' : (signal?.strategy || 'N/A')}
                     </span>
                  </td>
                  <td className="p-3">
                    {isLoading ? (
                      <div className="animate-pulse bg-gray-700 rounded w-16 h-6" />
                    ) : (
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getDirectionColor(direction)}`}>
                        {direction}
                      </span>
                    )}
                  </td>
                  <td className="p-3 font-mono text-right text-xs">
                    {isLoading ? '...' : (isNoTrade ? '---' : `$${signal?.entry || '---'}`)}
                  </td>
                  <td className="p-3 font-mono text-right text-xs text-red-400/80">
                    {isLoading ? '...' : (isNoTrade || !signal?.stop_loss ? '---' : `$${signal.stop_loss}`)}
                  </td>
                  <td className="p-3 font-mono text-right text-xs text-teal-400/80">
                    {isLoading ? '...' : (isNoTrade || !signal?.take_profit ? '---' : `$${signal.take_profit}`)}
                  </td>
                  <td className="p-3 text-right pr-6">
                    {!isLoading && !isNoTrade ? (
                      <div className="text-[10px] font-mono text-gray-400 flex flex-col">
                        <span>ADX: {signal?.adx_4h}</span>
                        <span>RSI: {signal?.rsi_1h}</span>
                      </div>
                    ) : (
                      <span className="text-gray-600">---</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ConsentModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onConfirm={confirmAutoTrade} 
        title="Authorize Auto-Trade" 
        symbol={activeSymbol}
        direction={activeDirection}
        details={[
          { label: "Agent", value: "SA1 (Trend + Momentum)" },
          { label: "Action", value: "Enter Next Signal" }
        ]} 
      />
    </div>
  );
}
