import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { usePresenceStore } from '../stores/presenceStore';

export function useTypingIndicator(cardId: string) {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const currentUser = usePresenceStore(state => state.currentUser);

  useEffect(() => {
    const channel = supabase.channel(`typing-${cardId}`);

    channel
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        setTypingUsers(prev => [...new Set([...prev, payload.user])]);
        
        // Remove user from typing after 2 seconds of no updates
        setTimeout(() => {
          setTypingUsers(prev => prev.filter(user => user !== payload.user));
        }, 2000);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [cardId]);

  const startTyping = () => {
    if (!currentUser) return;
    
    supabase.channel(`typing-${cardId}`).send({
      type: 'broadcast',
      event: 'typing',
      payload: { user: currentUser.email }
    });
  };

  return {
    typingUsers: typingUsers.filter(user => user !== currentUser?.email),
    startTyping
  };
}