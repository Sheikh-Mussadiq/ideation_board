import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Tag, Plus, X } from 'lucide-react';

const LABEL_COLORS = {
  red: '#fda4af',
  blue: '#7dd3fc',
  green: '#6ee7b7',
  yellow: '#fcd34d',
  purple: '#c4b5fd',
  pink: '#f9a8d4',
  indigo: '#818cf8',
  gray: '#d1d5db'
};

export default function LabelManager({ labels, onUpdate }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newLabelText, setNewLabelText] = useState('');
  const [selectedColor, setSelectedColor] = useState('blue');

  const handleAddLabel = () => {
    if (newLabelText.trim()) {
      onUpdate([...labels, { text: newLabelText.trim(), color: selectedColor }]);
      setNewLabelText('');
      setIsAdding(false);
    }
  };

  const handleDeleteLabel = (index) => {
    onUpdate(labels.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1">
        {labels.map((label, index) => (
          <span
            key={index}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            style={{
              backgroundColor: `${LABEL_COLORS[label.color]}20`,
              color: LABEL_COLORS[label.color],
              borderColor: LABEL_COLORS[label.color]
            }}
          >
            {label.text}
            <button
              onClick={() => handleDeleteLabel(index)}
              className="ml-1.5 hover:text-red-500 focus:outline-none"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
        >
          <Plus className="h-3 w-3 mr-1" />
          Add Label
        </button>
      </div>

      {isAdding && (
        <div className="mt-2 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={newLabelText}
              onChange={(e) => setNewLabelText(e.target.value)}
              placeholder="Label text..."
              className="flex-1 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
              autoFocus
            />
            <div className="flex gap-1">
              {Object.entries(LABEL_COLORS).map(([color, value]) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-6 h-6 rounded-full ${
                    selectedColor === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                  }`}
                  style={{ backgroundColor: value }}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsAdding(false)}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              onClick={handleAddLabel}
              className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

LabelManager.propTypes = {
  labels: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired
  })).isRequired,
  onUpdate: PropTypes.func.isRequired
};