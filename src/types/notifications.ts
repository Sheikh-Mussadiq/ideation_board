export interface Notification {
  id: string;
  userEmail: string;
  type: 'mention';
  content: string;
  cardId: string;
  boardId: string;
  read: boolean;
  createdAt: string;
}

export interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
}