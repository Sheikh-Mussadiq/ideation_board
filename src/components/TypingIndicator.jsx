import React from 'react';
import { useTypingIndicator } from '../hooks/useTypingIndicator';

export default function TypingIndicator({ cardId }) {
  const { typingUsers } = useTypingIndicator(cardId);

  if (typingUsers.length === 0) return null;

  return (
    <div className="text-xs text-gray-500 italic mt-1 flex items-center">
      {typingUsers.length === 1 ? (
        <span>{typingUsers[0]} is typing...</span>
      ) : (
        <span>{typingUsers.slice(0, -1).join(', ')} and {typingUsers[typingUsers.length - 1]} are typing...</span>
      )}
      <span className="flex items-center space-x-0.5 ml-1">
        <span className="w-1 h-1 bg-primary rounded-full animate-bounce"></span>
        <span className="w-1 h-1 bg-primary rounded-full animate-bounce delay-100"></span>
        <span className="w-1 h-1 bg-primary rounded-full animate-bounce delay-200"></span>
      </span>
    </div>
  );
}