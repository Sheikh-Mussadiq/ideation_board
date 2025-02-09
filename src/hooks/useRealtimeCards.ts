import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { IdeaCard } from '../types';

export function useRealtimeCards(boardId: string, onCardChange: (card: IdeaCard) => void) {
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
              const formattedCard: IdeaCard = {
                id: cardData.id,
                title: cardData.title,
                description: cardData.description,
                priority: cardData.priority as 'low' | 'medium' | 'high',
                assignee: cardData.assignee,
                dueDate: cardData.due_date,
                labels: cardData.labels?.map((l: any) => l.name) || [],
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