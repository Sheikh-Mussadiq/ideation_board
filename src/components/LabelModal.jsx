import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

const LABEL_COLORS = {
  red: 'bg-semantic-error-light text-semantic-error',
  blue: 'bg-semantic-info-light text-semantic-info',
  green: 'bg-semantic-success-light text-semantic-success',
  yellow: 'bg-semantic-warning-light text-semantic-warning',
  purple: 'bg-primary-light text-primary',
  gray: 'bg-gray-100 text-gray-700'
};

export default function LabelModal({ isOpen, onClose, labels, onUpdate }) {
  const [newLabelText, setNewLabelText] = useState('');
  const [selectedColor, setSelectedColor] = useState('blue');

  if (!isOpen) return null;

  const handleAddLabel = () => {
    if (newLabelText.trim()) {
      onUpdate([...labels, { text: newLabelText.trim(), color: selectedColor }]);
      setNewLabelText('');
      setSelectedColor('blue');
    }
  };

  const handleDeleteLabel = (index) => {
    onUpdate(labels.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-30" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Manage Labels</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {labels.map((label, index) => (
                  <span
                    key={index}
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${LABEL_COLORS[label.color]}`}
                  >
                    {label.text}
                    <button
                      onClick={() => handleDeleteLabel(index)}
                      className="ml-1.5 hover:text-semantic-error focus:outline-none transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-medium mb-2">Add New Label</h4>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newLabelText}
                    onChange={(e) => setNewLabelText(e.target.value)}
                    placeholder="Enter label text..."
                    className="input"
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Color
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(LABEL_COLORS).map(([color, value]) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`w-8 h-8 rounded-full transition-all ${LABEL_COLORS[color]} ${
                            selectedColor === color ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleAddLabel}
                    disabled={!newLabelText.trim()}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Label
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}