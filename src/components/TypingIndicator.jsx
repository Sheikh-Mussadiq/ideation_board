import React from 'react';
import PropTypes from 'prop-types';
import { useTypingIndicator } from '../hooks/useTypingIndicator';

export default function TypingIndicator({ cardId }) {
  const { typingUsers } = useTypingIndicator(cardId);

  if (typingUsers.length === 0) return null;

  return (
    <div className="text-xs text-gray-500 italic mt-1">
      {typingUsers.length === 1 ? (
        <span>{typingUsers[0]} is typing...</span>
      ) : (
        <span>{typingUsers.slice(0, -1).join(', ')} and {typingUsers[typingUsers.length - 1]} are typing...</span>
      )}
      <span className="inline-flex ml-1">
        <span className="animate-bounce">.</span>
        <span className="animate-bounce delay-100">.</span>
        <span className="animate-bounce delay-200">.</span>
      </span>
    </div>
  );
}

TypingIndicator.propTypes = {
  cardId: PropTypes.string.isRequired
};