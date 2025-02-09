import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

export default function EditableText({ value, onChange, className = '', isTitle = false }) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (text !== value) {
      onChange(text);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === 'Escape') {
      setText(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return isTitle ? (
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`w-full px-2 py-1 text-sm font-medium text-gray-900 border border-indigo-500 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
      />
    ) : (
      <textarea
        ref={inputRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`w-full px-2 py-1 text-sm text-gray-500 border border-indigo-500 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
        rows={3}
      />
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className={`cursor-text ${className}`}
    >
      {value}
    </div>
  );
}

EditableText.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  isTitle: PropTypes.bool
};