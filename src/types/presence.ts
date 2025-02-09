export interface UserPresence {
  id: string;
  email: string;
  avatar?: string;
  lastSeen: string;
  status: 'online' | 'offline';
  currentCard?: string;
  currentColumn?: string;
}

export interface PresenceState {
  users: UserPresence[];
  currentUser: UserPresence | null;
  setCurrentUser: (user: UserPresence) => void;
  addUser: (user: UserPresence) => void;
  removeUser: (userId: string) => void;
  updateUserPresence: (userId: string, updates: Partial<UserPresence>) => void;
}