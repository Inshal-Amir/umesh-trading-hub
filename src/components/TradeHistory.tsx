"use client";

import React, { useState } from 'react';
import { useTradesData } from '../hooks/useDashboardData';
import { ChevronDown, ChevronUp, ExternalLink, Activity, WifiOff, X, Loader2 } from 'lucide-react';
import { closeTrade } from '../lib/api-client';
import toast from 'react-hot-toast';

export default function TradeHistory() {
  const { tradesData, isLoading, isError, mutate } = useTradesData();
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterSymbol, setFilterSymbol] = useState<string>('All');
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [processingTrades, setProcessingTrades] = useState<Set<number>>(new Set());
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<any>(null);
  const [isClosing, setIsClosing] = useState(false);

  const handleCloseClick = (e: React.MouseEvent, trade: any) => {
    e.stopPropagation();
    setSelectedTrade(trade);
    setIsModalOpen(true);
  };

  const confirmCloseTrade = async () => {
    if (!selectedTrade) return;
    
    const tradeId = selectedTrade.id;
    setIsClosing(true);
    
    // Close modal immediately and set processing state 
    setIsModalOpen(false);
    setProcessingTrades(prev => new Set(prev).add(tradeId));
    
    try {
      const response = await closeTrade(tradeId);
      if (response.status === 'processing' || response.status === 'success') {
        toast.success(`Trade #${tradeId} closing initiated.`);
        await mutate();
      } else {
        toast.error(`Failed: ${response.message || 'Unknown error'}`);
        // Remove from processing state on explicit error
        setProcessingTrades(prev => {
          const next = new Set(prev);
          next.delete(tradeId);
          return next;
        });
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.response?.data?.detail || error.message || 'Failed to close trade');
      // Remove from processing state on network/server error
      setProcessingTrades(prev => {
        const next = new Set(prev);
        next.delete(tradeId);
        return next;
      });
    } finally {
      setIsClosing(false);
    }
  };

  if (isLoading) return <div className="p-6 bg-gray-800 rounded-xl border border-gray-700 animate-pulse min-h-[400px]" />;
  if (isError) return <div className="p-6 bg-gray-800 rounded-xl border border-red/50 text-red flex flex-col items-center justify-center min-h-[300px]"><WifiOff className="w-6 h-6 mb-2" /><p className="text-center font-mono text-sm">Error loading trade history</p></div>;

  // Extract raw trades array
  const rawTrades = Array.isArray(tradesData) ? tradesData : (tradesData as any)?.trades || [];

  // Parse according to the 16-index backend structure
  const parsedTrades = rawTrades.map((t: any[]) => ({
    id: t[0],
    time: t[1],
    agent: t[2],
    symbol: t[3],
    direction: t[4],
    entry: t[5],
    sl: t[6],
    tp: t[7],
    strategy: t[8],
    regime: t[9],
    obv_signal: t[10],
    status: t[11],
    pnl: t[12],
    exit_price: t[13],
    note: t[14],
    tx_signature: t[15],
    exit_time: t[16]
  }));

  // Apply filters
  let filteredTrades = parsedTrades;
  if (filterStatus !== 'All') {
    filteredTrades = filteredTrades.filter((t: any) => t.status?.toLowerCase() === filterStatus.toLowerCase());
  }
  if (filterSymbol !== 'All') {
    filteredTrades = filteredTrades.filter((t: any) => t.symbol === filterSymbol);
  }

  // Sort by ID descending (newest first) and limit to last 20
  filteredTrades.sort((a: any, b: any) => b.id - a.id);
  const displayTrades = filteredTrades.slice(0, 20);

  const toggleRow = (id: number) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getFormatDate = (isoString?: string) => {
    if (!isoString) return '---';
    const date = new Date(isoString);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' };
    return date.toLocaleDateString('en-US', options) + ' UTC';
  };

  const formatCurrency = (val: number | null | undefined) => {
    if (val === null || val === undefined) return '---';
    return `$${Number(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;
  };

  const formatPNL = (val: number | null | undefined) => {
    if (val === null || val === undefined) return '---';
    const num = Number(val);
    const prefix = num > 0 ? '+' : '';
    return (
      <span className={num > 0 ? 'text-teal font-bold' : num < 0 ? 'text-red font-bold' : 'text-gray-400 font-bold'}>
        {prefix}${num.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </span>
    );
  };

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-xl flex flex-col h-full overflow-hidden w-full">
      <div className="p-4 md:p-6 border-b border-gray-700 bg-gray-900/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-gray-400 font-medium text-sm tracking-wider uppercase flex items-center gap-2">
          <Activity className="w-4 h-4 text-teal" />
          Trade History
        </h3>
        
        <div className="flex flex-wrap gap-3">
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded-lg focus:ring-teal focus:border-teal block p-2 font-mono"
          >
            <option value="All">Status: All</option>
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
          </select>
          
          <select 
            value={filterSymbol}
            onChange={(e) => setFilterSymbol(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded-lg focus:ring-teal focus:border-teal block p-2 font-mono"
          >
            <option value="All">Symbol: All</option>
            <option value="BTCUSDT">BTCUSDT</option>
            <option value="ETHUSDT">ETHUSDT</option>
            <option value="SOLUSDT">SOLUSDT</option>
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="border-b border-gray-700/50 text-[10px] uppercase tracking-wider text-gray-500 font-mono bg-gray-900/40">
              <th className="p-3 font-medium pl-6">Time</th>
              <th className="p-3 font-medium">Agent</th>
              <th className="p-3 font-medium">Asset</th>
              <th className="p-3 font-medium">Action</th>
              <th className="p-3 font-medium text-right">Entry</th>
              <th className="p-3 font-medium text-right text-red-400/80">SL</th>
              <th className="p-3 font-medium text-right text-teal-400/80">TP</th>
              <th className="p-3 font-medium">Strategy</th>
              <th className="p-3 font-medium text-center">Status</th>
              <th className="p-3 font-medium text-right pr-6">P&L</th>
              <th className="p-3 font-medium text-center pr-6">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm font-space-grotesk text-gray-100">
            {displayTrades.length === 0 ? (
              <tr>
                <td colSpan={11} className="p-8 text-center text-gray-500 font-mono text-xs">
                  No trades found matching filters.
                </td>
              </tr>
            ) : (
              displayTrades.map((trade: any) => {
                const isExpanded = expandedRows.has(trade.id);
                const isLong = trade.direction === 'LONG';
                const isOpen = trade.status?.toLowerCase() === 'open';
                const isProcessing = processingTrades.has(trade.id);

                return (
                  <React.Fragment key={trade.id}>
                    <tr 
                      className="border-t border-gray-700/30 hover:bg-gray-700/30 transition-colors cursor-pointer group"
                      onClick={() => toggleRow(trade.id)}
                    >
                      <td className="p-3 pl-6 font-mono text-xs text-gray-400 flex items-center gap-2 mt-1.5">
                        {isExpanded ? <ChevronUp className="w-3 h-3 text-gray-500 transition-transform" /> : <ChevronDown className="w-3 h-3 text-gray-600 group-hover:text-teal transition-transform" />}
                        {getFormatDate(trade.time)}
                      </td>
                      <td className="p-3 font-bold text-gray-300 text-xs">{(trade.agent || '').toUpperCase()}</td>
                      <td className="p-3 font-bold bg-white/5 bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">{trade.symbol}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${isLong ? 'bg-teal/10 text-teal border-teal/30' : 'bg-red/10 text-red border-red/30'}`}>
                          {trade.direction || '---'}
                        </span>
                      </td>
                      <td className="p-3 text-right font-mono text-xs">{formatCurrency(trade.entry)}</td>
                      <td className="p-3 text-right font-mono text-xs text-red-400/80">{formatCurrency(trade.sl)}</td>
                      <td className="p-3 text-right font-mono text-xs text-teal-400/80">{formatCurrency(trade.tp)}</td>
                      <td className="p-3 text-xs text-gray-400 capitalize max-w-[150px] truncate" title={trade.strategy}>
                        {trade.strategy || '---'}
                      </td>
                      <td className="p-3 text-center">
                        {isOpen ? (
                          isProcessing ? (
                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-wide">
                              <Loader2 className="w-2.5 h-2.5 animate-spin" />
                              Closing
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase tracking-wide">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                              Open
                            </div>
                          )
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-gray-600/30 bg-gray-700/30 text-gray-400 text-[10px] font-bold uppercase tracking-wide">
                            Closed
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-right pr-6 font-mono text-sm tracking-tight">
                        {formatPNL(trade.pnl)}
                      </td>
                      <td className="p-3 text-center pr-6">
                        {isOpen ? (
                          <button 
                            onClick={(e) => isProcessing ? e.preventDefault() : handleCloseClick(e, trade)}
                            disabled={isProcessing}
                            className={`inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded text-[10px] font-bold tracking-wide transition-all ${
                              isProcessing
                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30 cursor-wait'
                                : 'bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500/20 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                            }`}
                          >
                            {isProcessing ? (
                              <><Loader2 className="w-3 h-3 animate-spin" /> CLOSING</>
                            ) : (
                              <><X className="w-3 h-3" /> CLOSE</>
                            )}
                          </button>
                        ) : (
                          <button className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded text-[10px] font-bold tracking-wide transition-all bg-gray-700/30 text-gray-500 border border-gray-700/50 cursor-not-allowed">
                            —
                          </button>
                        )}
                      </td>
                    </tr>
                    
                    {/* Expanded Details Row */}
                    {isExpanded && (
                      <tr className="bg-gray-900/30 border-b border-gray-700/50">
                        <td colSpan={11} className="px-6 py-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                            <div className="flex flex-col gap-1 p-3 rounded bg-gray-800/50 border border-gray-700/50">
                              <span className="text-gray-500 uppercase text-[10px] tracking-widest">Exit Time</span>
                              <span className="text-gray-300">{getFormatDate(trade.exit_time)}</span>
                            </div>
                            <div className="flex flex-col gap-1 p-3 rounded bg-gray-800/50 border border-gray-700/50">
                              <span className="text-gray-500 uppercase text-[10px] tracking-widest">Market Regime</span>
                              <span className="capitalize text-teal-400/80 font-bold">{trade.regime || 'Neutral'}</span>
                            </div>
                            <div className="flex flex-col gap-1 p-3 rounded bg-gray-800/50 border border-gray-700/50">
                              <span className="text-gray-500 uppercase text-[10px] tracking-widest">OBV Signal</span>
                              <span className="text-gray-300 capitalize">{trade.obv_signal || 'None'}</span>
                            </div>
                            <div className="flex flex-col gap-1 p-3 rounded bg-gray-800/50 border border-gray-700/50">
                              <span className="text-gray-500 uppercase text-[10px] tracking-widest flex items-center gap-1">
                                Blockchain TX <ExternalLink className="w-3 h-3" />
                              </span>
                              {trade.tx_signature ? (
                                <a href={`https://explorer.solana.com/tx/${trade.tx_signature}`} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors truncate" title={trade.tx_signature}>
                                  {trade.tx_signature.substring(0, 12)}...
                                </a>
                              ) : (
                                <span className="text-gray-600">No signature</span>
                              )}
                            </div>
                            <div className="col-span-2 md:col-span-4 flex flex-col gap-1 p-3 rounded bg-gray-800/50 border border-gray-700/50 mt-1">
                              <span className="text-gray-500 uppercase text-[10px] tracking-widest">Trade Notes & Logic</span>
                              <span className="text-gray-400">{trade.note || 'No notes available for this execution.'}</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      {/* Confirmation Modal */}
      {isModalOpen && selectedTrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setIsModalOpen(false)}>
          <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-sm w-full shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900/50">
              <h3 className="text-gray-100 font-bold tracking-wider flex items-center gap-2 text-sm font-mono">
                <X className="w-4 h-4 text-red-500" /> CLOSE TRADE
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-300 transition-colors"
                disabled={isClosing}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              <p className="text-xs font-space-grotesk text-gray-300 leading-relaxed">
                Are you sure you want to close this trade? 
                <br/>
                <span className="text-red-400 font-bold">This will execute a market order immediately.</span>
              </p>
              
              <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-3 space-y-2 font-mono text-xs">
                <div className="flex justify-between items-center bg-black/20 p-2 rounded">
                  <span className="text-gray-500 uppercase">Symbol</span>
                  <span className="font-bold text-gray-200">{selectedTrade.symbol}</span>
                </div>
                <div className="flex justify-between items-center bg-black/20 p-2 rounded">
                  <span className="text-gray-500 uppercase">Direction</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${selectedTrade.direction === 'LONG' ? 'bg-teal-500/10 text-teal-500 border-teal-500/30' : 'bg-red-500/10 text-red-500 border-red-500/30'}`}>
                    {selectedTrade.direction}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-black/20 p-2 rounded">
                  <span className="text-gray-500 uppercase">Entry Price</span>
                  <span className="text-gray-300">{formatCurrency(selectedTrade.entry)}</span>
                </div>
                <div className="flex justify-between items-center bg-black/20 p-2 rounded">
                  <span className="text-gray-500 uppercase">Current P&L</span>
                  <span>{formatPNL(selectedTrade.pnl)}</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-800 bg-gray-900/50 flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded border border-gray-700 text-gray-400 text-xs font-bold tracking-wider hover:bg-gray-800 hover:text-gray-200 transition-colors"
                disabled={isClosing}
              >
                CANCEL
              </button>
              <button 
                onClick={confirmCloseTrade}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-bold tracking-wider hover:bg-red-500/20 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
                disabled={isClosing}
              >
                {isClosing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'CONFIRM CLOSE'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
