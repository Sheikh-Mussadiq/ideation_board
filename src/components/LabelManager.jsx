import React, { useState } from 'react';
import { Tag, Plus, X } from 'lucide-react';

const LABEL_COLORS = {
  red: {
    bg: 'bg-semantic-error-light',
    text: 'text-semantic-error',
    button: 'bg-semantic-error/20'
  },
  blue: {
    bg: 'bg-semantic-info-light',
    text: 'text-semantic-info',
    button: 'bg-semantic-info/20'
  },
  green: {
    bg: 'bg-semantic-success-light',
    text: 'text-semantic-success',
    button: 'bg-semantic-success/20'
  },
  yellow: {
    bg: 'bg-semantic-warning-light',
    text: 'text-semantic-warning',
    button: 'bg-semantic-warning/20'
  },
  purple: {
    bg: 'bg-primary-light',
    text: 'text-primary',
    button: 'bg-primary/20'
  },
  gray: {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    button: 'bg-gray-200'
  }
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
        {labels && labels.map((label, index) => (
          <span
            key={index}
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${LABEL_COLORS[label.color].bg} ${LABEL_COLORS[label.color].text}`}
          >
            {label.text}
            <button
              onClick={() => handleDeleteLabel(index)}
              className="ml-1.5 hover:text-semantic-error focus:outline-none"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <button
          onClick={() => setIsAdding(true)}
          className="btn-ghost btn-sm rounded-full"
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
                  // className={`w-6 h-6 rounded-full ${
                  //   selectedColor === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                  // }`}
                  className={`w-6 h-6 rounded-full ${LABEL_COLORS[color].button} ${LABEL_COLORS[color].text} ${
                    selectedColor === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                  }`}
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