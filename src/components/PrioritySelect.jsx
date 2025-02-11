import React from 'react';
import { ChevronDown } from 'lucide-react';

const priorityColors = {
  low: {
    bg: 'bg-semantic-success-light',
    text: 'text-semantic-success',
    hover: 'hover:bg-semantic-success/20'
  },
  medium: {
    bg: 'bg-semantic-warning-light',
    text: 'text-semantic-warning',
    hover: 'hover:bg-semantic-warning/20'
  },
  high: {
    bg: 'bg-semantic-error-light',
    text: 'text-semantic-error',
    hover: 'hover:bg-semantic-error/20'
  }
};

export default function PrioritySelect({ value, onChange }) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSelect = (priority) => {
    onChange(priority);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${priorityColors[value].bg} ${priorityColors[value].text}`}
      >
        {value}
        <ChevronDown className="ml-1 h-3 w-3" />
      </button>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-24 rounded-md shadow-lg bg-white ring-1 ring-primary ring-opacity-10">
          <div className="py-1" role="menu">
            {Object.entries(priorityColors).map(([priority, colorClass]) => (
              <button
                key={priority}
                onClick={() => handleSelect(priority)}
                className={`block w-full text-left px-4 py-2 text-xs transition-colors ${priorityColors[priority].bg} ${priorityColors[priority].text} ${priorityColors[priority].hover}`}
                role="menuitem"
              >
                {priority}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}