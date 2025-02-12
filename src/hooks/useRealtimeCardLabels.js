import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useRealtimeCardLabels(cardId, onLabelChange) {
  useEffect(() => {
    if (!cardId) return;


    const channel = supabase
      .channel(`labels-${cardId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'card_labels',
          
        },
        async (payload) => {
          console.log("Label change detected:", payload);

          if (payload.eventType === 'DELETE') {
            onLabelChange({ 
              id: payload.old.id,
              type: 'DELETE' 
            });
            return;
          }

          // For INSERT and UPDATE, fetch the complete label data
          const { data: label, error } = await supabase
            .from('card_labels')
            .select('*')
            .eq('id', payload.new.id)
            .single();

          if (error) {
            console.error('Error fetching label details:', error);
            return;
          }

          onLabelChange({
            ...label,
            type: payload.eventType
          });
        }
      )
      .subscribe();

    return () => {
   
      supabase.removeChannel(channel);
    };
  }, [cardId, onLabelChange]);
}
