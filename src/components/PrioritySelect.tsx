import React from 'react';
import { ChevronDown } from 'lucide-react';

interface PrioritySelectProps {
  value: 'low' | 'medium' | 'high';
  onChange: (value: 'low' | 'medium' | 'high') => void;
}

const priorityColors = {
  low: 'bg-green-100 text-green-800 hover:bg-green-200',
  medium: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  high: 'bg-red-100 text-red-800 hover:bg-red-200'
};

export default function PrioritySelect({ value, onChange }: PrioritySelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSelect = (priority: 'low' | 'medium' | 'high') => {
    onChange(priority);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${priorityColors[value]}`}
      >
        {value}
        <ChevronDown className="ml-1 h-3 w-3" />
      </button>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-24 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu">
            {Object.entries(priorityColors).map(([priority, colorClass]) => (
              <button
                key={priority}
                onClick={() => handleSelect(priority as 'low' | 'medium' | 'high')}
                className={`block w-full text-left px-4 py-2 text-xs ${colorClass}`}
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