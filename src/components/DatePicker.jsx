import React from 'react';
import PropTypes from 'prop-types';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function DatePicker({ value, onChange }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-sm text-gray-500 hover:text-gray-700"
      >
        <Calendar className="h-4 w-4 mr-1" />
        {format(new Date(value), 'MMM d')}
      </button>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <input
            type="date"
            value={value.split('T')[0]}
            onChange={(e) => {
              onChange(e.target.value);
              setIsOpen(false);
            }}
            className="p-2 border-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      )}
    </div>
  );
}

DatePicker.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};