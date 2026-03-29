// APIStatus - from /status
export interface APIStatus {
  status: string;           // "running" or "stopped"
  agent1: string;           // "active" or "paused"
  agent2: string;           // "active" or "paused"
  sa1_mode: string;         // "auto" or "manual"
  sa2_mode: string;         // "auto" or "manual"
  symbol: string;           // "BTCUSDT", "ETHUSDT", "SOLUSDT"
  kill_switch: boolean;
  updated: string;          // ISO timestamp
}

// BalanceData - from /balance
export interface BalanceData {
  sol: number;              // SOL balance (e.g., 0.358625)
  sol_price: number;        // SOL price in USD (e.g., 82.87)
  sol_value: number;        // SOL value in USD (e.g., 29.72)
  usdc: number;             // USDC balance (e.g., 73.01)
  total_usd: number;        // Total portfolio value (e.g., 102.73)
  started: number;          // Starting balance (100.19)
  total_pnl: number;        // Realized P&L (e.g., 0.02)
  unrealized: number;       // Unrealized P&L
  open_trades: number;      // Count of open trades
  closed_trades: number;    // Count of closed trades
  updated: string;
}

// PerformanceStats - from /performance
export interface PerformanceStats {
  total_trades: number;
  wins: number;
  losses: number;
  win_rate: number;         // Percentage (e.g., 20.0)
  total_pnl: number;
  best_trade: number;
  worst_trade: number;
  avg_pnl: number;
  trade_size: number;
  daily_max_loss: number;
}

// SignalDetail - from /sa1/{symbol} or /both/{symbol}
export interface SignalDetail {
  symbol: string;
  regime: string;           // "trend", "range", "neutral"
  price: number;
  adx_4h: number;
  ema200_4h: number;
  rsi_1h: number;
  macd_hist: number;
  atr_1h: number;
  bb_upper: number;
  bb_mid: number;
  bb_lower: number;
  vwap: number;
  strategy: string;
  obv_signal: string | null;
  direction: string;        // "LONG", "SHORT", "NO TRADE"
  entry: number;
  stop_loss: number | null;
  take_profit: number | null;
  reason?: string;          // For NO TRADE scenarios
}

// TradeEvent - from /events
export interface EventData {
  events: any[][];          // Array of arrays
}

export interface TradeEvent {
  id: number;
  timestamp: string;
  type: string;
  description: string;
}

export interface CloseTradeResponse {
  status: 'processing' | 'success' | 'error';
  message: string;
  trade_id: number;
  symbol: string;
  direction: string;
  entry_price: number;
  exit_price: number;
  estimated_pnl: number;
  tx_signature: string;
  explorer_url: string | null;
  note: string;
}
