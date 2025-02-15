import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useRealtimeCards(boardId, onCardChange) {
  useEffect(() => {
    if (!boardId) return;

    // Setup the real-time subscription
    const channel = supabase
      .channel(`cards-board-${boardId}`)
      .on(
        'postgres_changes',
        {
          event: '*', // Listening to all events
          schema: 'public',
          table: 'cards',
        },
        async (payload) => {
          console.log("Realtime card event received:", payload);

          // For position updates, we want to include column_id in the payload
          // to ensure proper column assignment in the UI
          const cardUpdate = {
            ...payload.new,
            column_id: payload.new?.column_id,
            position: payload.new?.position,
            type: payload.eventType
          };

          if (payload.eventType === 'DELETE') {
            onCardChange({ id: payload.old.id, type: 'DELETE' });
            return;
          }

          onCardChange(cardUpdate);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [boardId, onCardChange]);
}
