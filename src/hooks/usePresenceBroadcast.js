import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function usePresenceBroadcast(boardId, currentUser) {
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    if (!boardId || !currentUser) return;

    // Create presence channel
    const channel = supabase.channel(`presence:${boardId}`, {
      config: {
        presence: {
          key: currentUser.accountId,
        },
      },
    });

    // Handle presence changes
    channel.on('presence', { event: 'sync' }, () => {
      const presenceState = channel.presenceState();
      const users = Object.values(presenceState).flat().map(presence => ({
        accountId: presence.key,
        firstName: presence.firstName
      }));
      setActiveUsers(users);
    });

    // Subscribe and send initial presence state
    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({
          firstName: currentUser.firstName,
        });
      }
    });

    // Cleanup
    return () => {
      channel.unsubscribe();
    };
  }, [boardId, currentUser]);

  return activeUsers;
}
