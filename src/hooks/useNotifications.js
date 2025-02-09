import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNotificationStore } from '../stores/notificationStore';
import { useAuth } from '../context/AuthContext';

export function useNotifications() {
  const { addNotification } = useNotificationStore();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser?.email) return;

    // Subscribe to new notifications
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_email=eq.${currentUser.email}`
        },
        (payload) => {
          if (payload.new) {
            addNotification({
              id: payload.new.id,
              userEmail: payload.new.user_email,
              type: payload.new.type,
              content: payload.new.content,
              cardId: payload.new.card_id,
              boardId: payload.new.board_id,
              read: payload.new.read,
              createdAt: payload.new.created_at
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser?.email, addNotification]);

  const markAsRead = async (notificationId) => {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (!error) {
      useNotificationStore.getState().markAsRead(notificationId);
    }
  };

  const markAllAsRead = async () => {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_email', currentUser?.email);

    if (!error) {
      useNotificationStore.getState().markAllAsRead();
    }
  };

  return { markAsRead, markAllAsRead };
}