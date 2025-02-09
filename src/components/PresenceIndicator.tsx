import React from 'react';
import { usePresenceStore } from '../stores/presenceStore';

interface PresenceIndicatorProps {
  location: 'card' | 'column';
  id: string;
}

export default function PresenceIndicator({ location, id }: PresenceIndicatorProps) {
  const users = usePresenceStore(state => state.users);
  const currentUser = usePresenceStore(state => state.currentUser);
  
  const activeUsers = users.filter(user => 
    user.id !== currentUser?.id && // Don't show current user
    (location === 'card' ? user.currentCard === id : user.currentColumn === id)
  );

  if (activeUsers.length === 0) return null;

  return (
    <div className="flex -space-x-2 overflow-hidden">
      {activeUsers.slice(0, 3).map(user => (
        <div
          key={user.id}
          className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
          title={user.email}
        >
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.email}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <div className="h-full w-full rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-medium">
              {user.email.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      ))}
      {activeUsers.length > 3 && (
        <div className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-300 text-xs font-medium text-gray-700">
          +{activeUsers.length - 3}
        </div>
      )}
    </div>
  );
}