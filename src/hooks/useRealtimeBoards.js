import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useRealtimeBoards( onBoardChange) {
  useEffect(() => {

    const channel = supabase
      .channel(`public:boards`)
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
  }, [ onBoardChange]);
}
