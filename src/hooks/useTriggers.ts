import { useState } from 'react';
import toast from 'react-hot-toast';
import { triggerAction } from '../lib/api-client';
import { useSystemStatus } from './useDashboardData';

export function useTriggers() {
  const [isPending, setIsPending] = useState(false);
  const { mutate: mutateStatus } = useSystemStatus();

  const handleAction = async (endpoint: string, payload: any, successMsg: string) => {
    setIsPending(true);
    try {
      await triggerAction(endpoint, payload);
      toast.success(successMsg);
      await mutateStatus(); // refresh status immediately
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err.message || 'Action failed.');
    } finally {
      setIsPending(false);
    }
  };

  const fireCustomTrigger = (endpoint: string, payload?: any, successMsg: string = 'Success') => 
    handleAction(endpoint, payload, successMsg);

  return { isPending, fireCustomTrigger };
}
