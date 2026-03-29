"use client";

import { useState, useEffect, useRef } from 'react';
import { Activity, Check } from 'lucide-react';

const SYMBOLS = ['BTCUSDT', 'SOLUSDT', 'ETHUSDT'];
const SYMBOL_MAP: Record<string, string> = {
  'BTCUSDT': 'BINANCE:BTCUSDT',
  'ETHUSDT': 'BINANCE:ETHUSDT',
  'SOLUSDT': 'BINANCE:SOLUSDT',
};

// Map custom indicator IDs to TradingView study configurations
const INDICATOR_MAP: Record<string, any> = {
  'RSI': { id: 'RSI@tv-basicstudies', inputs: { length: 14 } },
  'MACD': { id: 'MACD@tv-basicstudies' },
  'BB': { id: 'BB@tv-basicstudies', inputs: { length: 20, mult: 2.0 } },
  'VWAP': { id: 'VWAP@tv-basicstudies' },
  'EMA 200': { id: 'MAExp@tv-basicstudies', inputs: { length: 200 } },
  'Volume': { id: 'Volume@tv-basicstudies' }
};

const INDICATOR_DESC: Record<string, string> = {
  'RSI': 'Relative Strength Index - Momentum oscillator',
  'MACD': 'Moving Average Convergence Divergence - Trend-following momentum',
  'BB': 'Bollinger Bands - Volatility indicator',
  'VWAP': 'Volume Weighted Average Price',
  'EMA 200': '200-period Exponential Moving Average - Long-term trend',
  'Volume': 'Trading Volume'
};

const INDICATORS = Object.keys(INDICATOR_MAP);

export default function TradingViewChart() {
  const [activeSymbol, setActiveSymbol] = useState('SOLUSDT');
  const [indicatorMode, setIndicatorMode] = useState<'single' | 'multiple'>('multiple');
  const [activeIndicators, setActiveIndicators] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const storedMode = localStorage.getItem('tv_indicator_mode');
      if (storedMode === 'single' || storedMode === 'multiple') {
        setIndicatorMode(storedMode);
      }
      const storedInds = localStorage.getItem('tv_active_indicators');
      if (storedInds) {
        setActiveIndicators(JSON.parse(storedInds));
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current) return;

    // Load TradingView script
    const scriptId = 'tradingview-widget-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    const initWidget = () => {
      if (typeof window !== 'undefined' && (window as any).TradingView) {
        // Clear container before initializing new widget
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
          const widgetContainer = document.createElement('div');
          widgetContainer.id = 'tv_chart_container';
          widgetContainer.style.height = '100%';
          widgetContainer.style.width = '100%';
          containerRef.current.appendChild(widgetContainer);

          const studies = activeIndicators.map(ind => INDICATOR_MAP[ind]);
          
          new (window as any).TradingView.widget({
            autosize: true,
            symbol: SYMBOL_MAP[activeSymbol],
            interval: "60",
            timezone: "Etc/UTC",
            theme: "dark",
            style: "1",
            locale: "en",
            enable_publishing: false,
            backgroundColor: "#1a2844",
            gridColor: "#2a3854",
            hide_side_toolbar: true,
            allow_symbol_change: true,
            studies: studies,
            container_id: "tv_chart_container"
          });
        }
      }
    };

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = initWidget;
      document.body.appendChild(script);
    } else {
      initWidget();
    }

  }, [activeSymbol, activeIndicators, mounted]);

  const handleModeChange = (mode: 'single' | 'multiple') => {
    setIndicatorMode(mode);
    localStorage.setItem('tv_indicator_mode', mode);
    if (mode === 'single' && activeIndicators.length > 1) {
      const newInds = [activeIndicators[0]];
      setActiveIndicators(newInds);
      localStorage.setItem('tv_active_indicators', JSON.stringify(newInds));
    }
  };

  const toggleIndicator = (id: string) => {
    setActiveIndicators(prev => {
      let next: string[];
      if (indicatorMode === 'single') {
        next = prev.includes(id) ? [] : [id];
      } else {
        next = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id].slice(0, 3);
      }
      localStorage.setItem('tv_active_indicators', JSON.stringify(next));
      return next;
    });
  };

  if (!mounted) return <div className="bg-gray-800 rounded-xl h-[600px] animate-pulse" />;

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-xl overflow-hidden flex flex-col h-full w-full">
      <div className="p-4 border-b border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-900/50 gap-4 md:gap-0">
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {SYMBOLS.map(sym => (
            <button
              key={sym}
              onClick={() => setActiveSymbol(sym)}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold font-space-grotesk tracking-wide transition-all whitespace-nowrap ${
                activeSymbol === sym 
                  ? 'bg-teal/20 text-teal border border-teal/30' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
              }`}
            >
              {sym}
            </button>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center w-full md:w-auto">
          {/* Mode Toggle */}
          <div className="flex bg-gray-900/80 p-1 rounded-lg border border-gray-700 w-full sm:w-auto">
            <button
              onClick={() => handleModeChange('single')}
              className={`flex-1 sm:flex-none px-3 py-1 rounded text-xs font-bold transition-all ${
                indicatorMode === 'single'
                ? 'bg-gray-700 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              SINGLE
            </button>
            <button
              onClick={() => handleModeChange('multiple')}
              className={`flex-1 sm:flex-none px-3 py-1 rounded text-xs font-bold transition-all ${
                indicatorMode === 'multiple'
                ? 'bg-gray-700 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              MULTIPLE
            </button>
          </div>

          <div className="flex gap-2 text-teal items-center">
            <Activity className="w-4 h-4" />
            <span className="text-xs uppercase font-mono tracking-widest text-shadow-glow">
              Active: {activeIndicators.length > 0 ? `${activeIndicators.join(', ')} (${activeIndicators.length})` : 'None'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 w-full relative min-h-[600px] bg-[#1a2844]" ref={containerRef}>
        {/* JS injected widget goes here */}
      </div>

      <div className="p-3 border-t border-gray-700 bg-gray-900/30 overflow-x-auto">
        <div className="flex flex-nowrap sm:flex-wrap gap-2 justify-start px-1 min-w-max">
          {INDICATORS.map(ind => {
            const isActive = activeIndicators.includes(ind);
            return (
              <button
                key={ind}
                onClick={() => toggleIndicator(ind)}
                title={INDICATOR_DESC[ind]}
                className={`px-3 py-1.5 flex items-center gap-1.5 rounded-md text-xs font-bold font-mono transition-all duration-300 whitespace-nowrap ${
                  isActive 
                  ? 'bg-teal/20 text-teal border border-teal/40 shadow-[0_0_12px_rgba(45,212,191,0.25)]' 
                  : 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700 opacity-70 hover:opacity-100'
                }`}
              >
                {isActive && <Check className="w-3 h-3" />}
                {ind}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
