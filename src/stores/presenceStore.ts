import { create } from 'zustand';
import { UserPresence, PresenceState } from '../types/presence';

export const usePresenceStore = create<PresenceState>((set) => ({
  users: [],
  currentUser: null,
  setCurrentUser: (user: UserPresence) =>
    set((state) => ({
      currentUser: user,
      users: [...state.users.filter(u => u.id !== user.id), user]
    })),
  addUser: (user: UserPresence) =>
    set((state) => ({
      users: [...state.users.filter(u => u.id !== user.id), user]
    })),
  removeUser: (userId: string) =>
    set((state) => ({
      users: state.users.filter(user => user.id !== userId)
    })),
  updateUserPresence: (userId: string, updates: Partial<UserPresence>) =>
    set((state) => ({
      users: state.users.map(user =>
        user.id === userId
          ? { ...user, ...updates, lastSeen: new Date().toISOString() }
          : user
      ),
      currentUser: state.currentUser?.id === userId
        ? { ...state.currentUser, ...updates, lastSeen: new Date().toISOString() }
        : state.currentUser
    }))
}));