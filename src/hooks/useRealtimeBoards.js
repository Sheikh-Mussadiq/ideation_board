import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useRealtimeBoards(accountId, onBoardChange) {
  useEffect(() => {
    if (!accountId) return;

    const channel = supabase
      .channel(`public:boards:${accountId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'boards',
          filter: `account_id=eq.${accountId}`
        },
        (payload) => {
          console.log('Board change received:', payload);
          onBoardChange(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [accountId, onBoardChange]);
}
