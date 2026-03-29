"use client";

import { useState } from 'react';
import { AlertCircle, Terminal, CheckCircle2, X } from 'lucide-react';

interface ConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  symbol: string;
  direction: string;
  details: { label: string; value: string | number }[];
}

export default function ConsentModal({ isOpen, onClose, onConfirm, title, symbol, direction, details }: ConsentModalProps) {
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const isConfirmed = inputText === 'CONFIRM';

  const handleConfirm = () => {
    if (isConfirmed) {
      onConfirm();
      setInputText('');
      onClose();
    }
  };

  const getDirectionColor = (dir: string) => {
    if (dir === 'LONG') return 'text-teal border-teal/20 bg-teal/10';
    if (dir === 'SHORT') return 'text-red border-red/20 bg-red/10';
    return 'text-gray-400 border-gray-400/20 bg-gray-400/10';
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-gray-800 border border-gray-700 w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-700 bg-gray-900/50 flex justify-between items-center">
          <div className="flex items-center gap-2 text-gold">
            <AlertCircle className="w-5 h-5" />
            <h2 className="font-bold tracking-wide">{title}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xl font-space-grotesk font-bold text-white">{symbol}</span>
            <span className={`px-3 py-1 rounded-md text-xs font-bold border ${getDirectionColor(direction)}`}>
              {direction}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {details.map((detail, idx) => (
              <div key={idx} className="bg-gray-900/50 p-3 rounded border border-gray-700/50">
                <p className="text-gray-400 text-xs font-mono mb-1">{detail.label}</p>
                <p className="font-mono text-gray-100">{detail.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-red/10 border border-red/20 p-4 rounded-lg mb-6 flex gap-3 text-red items-start">
            <Terminal className="w-5 h-5 mt-0.5 shrink-0" />
            <div className="text-sm">
              <p className="font-bold mb-1">Execution Warning</p>
              <p className="text-red-400/80">This action will trigger an automated workflow via engine.py. Type <strong className="text-white bg-black/30 px-1 py-0.5 rounded">CONFIRM</strong> to authorize.</p>
            </div>
          </div>

          <input
            type="text"
            placeholder="Type CONFIRM here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 text-white font-mono p-3 rounded-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all mb-4"
          />

          <button
            onClick={handleConfirm}
            disabled={!isConfirmed}
            className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
              isConfirmed 
                ? 'bg-gold text-black hover:bg-gold-hover shadow-[0_0_15px_rgba(244,180,0,0.3)]' 
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isConfirmed && <CheckCircle2 className="w-5 h-5" />}
            EXECUTE TRADE
          </button>
        </div>
      </div>
    </div>
  );
}
