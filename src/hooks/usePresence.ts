import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { usePresenceStore } from '../stores/presenceStore';
import { UserPresence } from '../types/presence';

export function usePresence(boardId: string) {
  const { currentUser, addUser, removeUser, updateUserPresence } = usePresenceStore();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    if (!currentUser || !boardId) return;

    const channel = supabase.channel(`presence:${boardId}`, {
      config: {
        presence: {
          key: currentUser.id,
        },
      },
    });

    channelRef.current = channel;

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState<UserPresence>();
        Object.values(state).forEach(presences => {
          if (presences && presences.length > 0) {
            const presence = presences[0];
            addUser(presence);
          }
        });
      })
      .on('presence', { event: 'join' }, ({ key, newPresence }) => {
        if (newPresence && newPresence.length > 0) {
          addUser(newPresence[0]);
        }
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        removeUser(key);
      });

    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({
          ...currentUser,
          lastSeen: new Date().toISOString()
        });
      }
    });

    return () => {
      channel.unsubscribe();
      channelRef.current = null;
    };
  }, [boardId, currentUser, addUser, removeUser]);

  const updatePresence = async (updates: Partial<UserPresence>) => {
    if (!currentUser || !channelRef.current) return;

    const updatedPresence = {
      ...currentUser,
      ...updates,
      lastSeen: new Date().toISOString()
    };

    updateUserPresence(currentUser.id, updates);

    if (channelRef.current.state === 'joined') {
      await channelRef.current.track(updatedPresence);
    }
  };

  return { updatePresence };
}