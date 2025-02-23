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
      
        },
        (payload) => {
          console.log('Board change received:', payload);
          if (payload.eventType === 'DELETE') {
            // For DELETE events, payload.old contains the deleted record
            onBoardChange({ id: payload.old.id, type: 'DELETE' });
          } else {
            onBoardChange(payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [accountId, onBoardChange]);
}
