import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useRealtimeCards(boardId, onCardChange) {
  useEffect(() => {
    if (!boardId) return;

    const channel = supabase
      .channel(`realtime:cards:${boardId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cards',
          filter: `column_id=eq.${boardId}`
        },
        async (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const { data: cardData } = await supabase
              .from('cards')
              .select(`
                *,
                labels (name),
                comments (*),
                attachments (*)
              `)
              .eq('id', payload.new.id)
              .single();

            if (cardData) {
              const formattedCard = {
                id: cardData.id,
                title: cardData.title,
                description: cardData.description,
                priority: cardData.priority,
                assignee: cardData.assignee,
                dueDate: cardData.due_date,
                labels: cardData.labels?.map(l => l.name) || [],
                attachments: cardData.attachments || [],
                comments: cardData.comments || [],
                archived: cardData.archived
              };
              onCardChange(formattedCard);
            }
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [boardId, onCardChange]);
}