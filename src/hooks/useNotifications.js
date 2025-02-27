import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNotificationStore } from '../stores/notificationStore';
import { useAuth } from '../context/AuthContext';
import { 
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
} from '../services/notificationService';

export function useNotifications() {
  const { addNotification } = useNotificationStore();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser?.userId) return;

    // Initial fetch of notifications
    const loadNotifications = async () => {
      try {
        const notifications = await fetchNotifications();
        notifications.forEach(notification => addNotification(notification));
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    };

    loadNotifications();

    // Subscribe to new notifications
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          // filter: `user_id=eq.${currentUser.userId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            addNotification(payload.new);
          }
          // You could handle UPDATE and DELETE events here if needed
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser, addNotification]);

  const markAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      useNotificationStore.getState().markAsRead(notificationId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!currentUser.userId) return;
    try {
      await markAllNotificationsAsRead(currentUser.userId);
      useNotificationStore.getState().markAllAsRead();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  return { markAsRead, markAllAsRead };
}