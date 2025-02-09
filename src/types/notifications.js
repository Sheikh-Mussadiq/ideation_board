import PropTypes from 'prop-types';

export const NotificationShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  userEmail: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['mention']).isRequired,
  content: PropTypes.string.isRequired,
  cardId: PropTypes.string.isRequired,
  boardId: PropTypes.string.isRequired,
  read: PropTypes.bool.isRequired,
  createdAt: PropTypes.string.isRequired
});

export const NotificationsStateShape = PropTypes.shape({
  notifications: PropTypes.arrayOf(NotificationShape).isRequired,
  unreadCount: PropTypes.number.isRequired,
  addNotification: PropTypes.func.isRequired,
  markAsRead: PropTypes.func.isRequired,
  markAllAsRead: PropTypes.func.isRequired
});