import { supabase } from '../lib/supabase';
import { normalizeSingleResult } from '../lib/helpers';

export async function fetchNotifications() {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    // .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

export async function createNotification(notificationData) {
    console.log(notificationData);
  const { data, error } = await supabase
    .from('notifications')
    .insert([{
      ...notificationData,
      created_at: new Date().toISOString(),
      read: false
    }])
    .select()
    .single();

    console.log(data);
  if (error) throw error;
  return normalizeSingleResult(data);
}

export async function markNotificationAsRead(notificationId) {
  const { data, error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId)
    .select()
    .single();

  if (error) throw error;
  return normalizeSingleResult(data);
}

export async function markAllNotificationsAsRead(userId) {
  const { data, error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', userId)
    .select();

  if (error) throw error;
  return data;
}

export async function deleteNotification(notificationId) {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', notificationId);

  if (error) throw error;
}
