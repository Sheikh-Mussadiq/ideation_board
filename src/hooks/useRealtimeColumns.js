import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useRealtimeColumns(boardId, onColumnChange) {
  useEffect(() => {
    if (!boardId) return;
    console.log('useRealtimeColumns:', boardId);
    const channel = supabase
      .channel(`public:columns:${boardId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'columns',
          // filter: `board_id=eq.${boardId}`
        },
        (payload) => {
          // console.log('Column change received:', payload);

          if (payload.eventType === 'DELETE') {
            onColumnChange({ 
              id: payload.old.id, 
              board_id: payload.old.board_id,
              type: 'DELETE' 
            });
            return;
          }

          const updatedColumn = payload.new;
          if (updatedColumn) {
            onColumnChange({
              ...updatedColumn,
              cards: [], // Initialize empty cards array for new columns
              type: payload.eventType
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [boardId, onColumnChange]);
}