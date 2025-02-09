import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Comment } from '../types';

export function useRealtimeComments(cardId: string, onCommentChange: (comment: Comment) => void) {
  useEffect(() => {
    if (!cardId) return;

    const channel = supabase
      .channel(`realtime:comments:${cardId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `card_id=eq.${cardId}`
        },
        async (payload) => {
          console.log('Realtime comment change:', payload);
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const comment: Comment = {
              id: payload.new.id,
              text: payload.new.text,
              author: payload.new.author,
              createdAt: payload.new.created_at,
              editedAt: payload.new.updated_at
            };
            onCommentChange(comment);
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [cardId, onCommentChange]);
}