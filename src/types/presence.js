import PropTypes from 'prop-types';

export const UserPresenceShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  avatar: PropTypes.string,
  lastSeen: PropTypes.string.isRequired,
  status: PropTypes.oneOf(['online', 'offline']).isRequired,
  currentCard: PropTypes.string,
  currentColumn: PropTypes.string
});

export const PresenceStateShape = PropTypes.shape({
  users: PropTypes.arrayOf(UserPresenceShape).isRequired,
  currentUser: PropTypes.shape(UserPresenceShape),
  setCurrentUser: PropTypes.func.isRequired,
  addUser: PropTypes.func.isRequired,
  removeUser: PropTypes.func.isRequired,
  updateUserPresence: PropTypes.func.isRequired
});