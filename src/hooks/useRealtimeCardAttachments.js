import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useRealtimeCardAttachments(cardId, onAttachmentChange) {
  useEffect(() => {
    if (!cardId) return;

    const channel = supabase
      .channel(`attachments-card-${cardId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'card_attachments',
          filter: `card_id=eq.${cardId}`
        },
        (payload) => {
          if (payload.eventType === 'DELETE') {
            onAttachmentChange({ 
              id: payload.old.id, 
              card_id: payload.old.card_id,
              type: 'DELETE' 
            });
            return;
          }

          onAttachmentChange({
            ...payload.new,
            type: payload.eventType
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [cardId, onAttachmentChange]);
}
