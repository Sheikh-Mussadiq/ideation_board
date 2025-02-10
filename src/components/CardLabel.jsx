import React from 'react';

const LABEL_COLORS = {
  red: 'bg-semantic-error-light text-semantic-error border border-semantic-error',
  blue: 'bg-semantic-info-light text-semantic-info border border-semantic-info',
  green: 'bg-semantic-success-light text-semantic-success border border-semantic-success',
  yellow: 'bg-semantic-warning-light text-semantic-warning border border-semantic-warning',
  purple: 'bg-primary-light text-primary border border-primary',
  gray: 'bg-gray-100 text-gray-700 border border-gray-200'
};

export default function CardLabel({ label, onDelete }) {
  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
        LABEL_COLORS[label.color]
      }`}
    >
      {label.text}
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="ml-1.5 hover:text-semantic-error focus:outline-none transition-colors"
        >
          ×
        </button>
      )}
    </span>
  );
}