import useSWR from 'swr';
import { getStatus, getBalance, getPerformance, getEvents, getTrades } from '../lib/api-client';

const POLLING_INTERVAL = 30000;

export function useSystemStatus() {
  const { data, error, isLoading, mutate } = useSWR('/status', getStatus, {
    refreshInterval: POLLING_INTERVAL,
  });

  return { statusData: data, isLoading, isError: error, mutate };
}

export function useBalanceData() {
  const { data, error, isLoading, mutate } = useSWR('/balance', getBalance, {
    refreshInterval: POLLING_INTERVAL,
  });

  return { balanceData: data, isLoading, isError: error, mutate };
}

export function usePerformanceStats() {
  const { data, error, isLoading, mutate } = useSWR('/performance', getPerformance, {
    refreshInterval: POLLING_INTERVAL,
  });

  return { performanceData: data, isLoading, isError: error, mutate };
}

export function useEventsData() {
  const { data, error, isLoading, mutate } = useSWR('/events', getEvents, {
    refreshInterval: POLLING_INTERVAL,
  });

  return { eventsData: data, isLoading, isError: error, mutate };
}

export function useTradesData() {
  const { data, error, isLoading, mutate } = useSWR('/trades', getTrades, {
    refreshInterval: POLLING_INTERVAL,
  });

  return { tradesData: data, isLoading, isError: error, mutate };
}
