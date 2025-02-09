import { create } from 'zustand';

export const usePresenceStore = create((set) => ({
  users: [],
  currentUser: null,
  setCurrentUser: (user) =>
    set((state) => ({
      currentUser: user,
      users: [...state.users.filter(u => u.id !== user.id), user]
    })),
  addUser: (user) =>
    set((state) => ({
      users: [...state.users.filter(u => u.id !== user.id), user]
    })),
  removeUser: (userId) =>
    set((state) => ({
      users: state.users.filter(user => user.id !== userId)
    })),
  updateUserPresence: (userId, updates) =>
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