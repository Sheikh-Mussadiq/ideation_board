import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useRealtimeColumns(boardId, onColumnChange) {
  useEffect(() => {
    const channel = supabase
      .channel(`board-columns-${boardId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'columns',
          filter: `board_id=eq.${boardId}`
        },
        async (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const { data: column } = await supabase
              .from('columns')
              .select(`
                *,
                cards (
                  *,
                  labels (name),
                  comments (*),
                  attachments (*)
                )
              `)
              .eq('id', payload.new.id)
              .single();

            if (column) {
              const formattedColumn = {
                id: column.id,
                title: column.title,
                cards: column.cards.map(card => ({
                  id: card.id,
                  title: card.title,
                  description: card.description,
                  priority: card.priority,
                  assignee: card.assignee,
                  dueDate: card.due_date,
                  labels: card.labels?.map(l => l.name) || [],
                  attachments: card.attachments || [],
                  comments: card.comments || [],
                  archived: card.archived
                }))
              };
              onColumnChange(formattedColumn);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [boardId, onColumnChange]);
}