import axios from 'axios';
import { APIStatus, BalanceData, PerformanceStats, SignalDetail, EventData } from './types';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://148.230.81.24:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Helper for error handling logging
const handleApiError = (error: any, endpoint: string) => {
  console.error(`API Error on ${endpoint}:`, error?.response?.data || error.message);
  throw error;
};

// ==========================
// GET ENDPOINTS
// ==========================

export const getStatus = async (): Promise<APIStatus> => {
  try {
    const res = await apiClient.get<APIStatus>('/status');
    return res.data;
  } catch (error) {
    return handleApiError(error, '/status');
  }
};

export const getBalance = async (): Promise<BalanceData> => {
  try {
    const res = await apiClient.get<BalanceData>('/balance');
    return res.data;
  } catch (error) {
    return handleApiError(error, '/balance');
  }
};

export const getPerformance = async (): Promise<PerformanceStats> => {
  try {
    const res = await apiClient.get<PerformanceStats>('/performance');
    return res.data;
  } catch (error) {
    return handleApiError(error, '/performance');
  }
};

export const getBothSignal = async (symbol: string): Promise<{ sa1: SignalDetail; sa2: SignalDetail }> => {
  try {
    const res = await apiClient.get<{ sa1: SignalDetail; sa2: SignalDetail }>(`/both/${symbol}`);
    return res.data;
  } catch (error) {
    return handleApiError(error, `/both/${symbol}`);
  }
};

export const getTrades = async (): Promise<any> => {
  try {
    const res = await apiClient.get<any>('/trades');
    return res.data;
  } catch (error) {
    return handleApiError(error, '/trades');
  }
};

export const getEvents = async (): Promise<EventData> => {
  try {
    const res = await apiClient.get<EventData>('/events');
    return res.data;
  } catch (error) {
    return handleApiError(error, '/events');
  }
};

// ==========================
// POST / TRIGGER ENDPOINTS
// ==========================

export const triggerKillSwitch = async () => {
  return apiClient.post('/trigger/kill');
};

export const triggerModeSwitch = async (agent: string, mode: string) => {
  return apiClient.post('/trigger/switch-mode', { agent, mode });
};

export const triggerAction = async (endpoint: string, payload?: any) => {
  return apiClient.post(`/trigger/${endpoint}`, payload);
};

import { CloseTradeResponse } from './types';

export const closeTrade = async (tradeId: number): Promise<CloseTradeResponse> => {
  // Increase timeout to 30s since blockchain transactions (Jupiter swaps) can occasionally take longer than 10s
  const res = await apiClient.post<CloseTradeResponse>(`/trigger/close-trade/${tradeId}`, undefined, { timeout: 30000 });
  return res.data;
};

export default apiClient;
