import useSWR from 'swr';
import { getBothSignal } from '../lib/api-client';

const POLLING_INTERVAL = 60000; // 60s for active signals

export function useSignals(symbol: string) {
  const { data, error, isLoading, mutate } = useSWR(
    symbol ? `/both/${symbol}` : null,
    () => getBothSignal(symbol),
    {
      refreshInterval: POLLING_INTERVAL,
    }
  );

  return { signals: data, isLoading, isError: error, mutate };
}
