import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Label } from '../types';

interface LabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  labels: Label[];
  onUpdate: (labels: Label[]) => void;
}

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

export default function LabelModal({ isOpen, onClose, labels, onUpdate }: LabelModalProps) {
  const [newLabelText, setNewLabelText] = useState('');
  const [selectedColor, setSelectedColor] = useState<string>('blue');

  if (!isOpen) return null;

  const handleAddLabel = () => {
    if (newLabelText.trim()) {
      onUpdate([...labels, { text: newLabelText.trim(), color: selectedColor }]);
      setNewLabelText('');
      setSelectedColor('blue');
    }
  };

  const handleDeleteLabel = (index: number) => {
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
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: `${LABEL_COLORS[label.color as keyof typeof LABEL_COLORS]}20`,
                      color: LABEL_COLORS[label.color as keyof typeof LABEL_COLORS],
                      borderColor: LABEL_COLORS[label.color as keyof typeof LABEL_COLORS]
                    }}
                  >
                    {label.text}
                    <button
                      onClick={() => handleDeleteLabel(index)}
                      className="ml-1.5 hover:text-red-500 focus:outline-none"
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
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                          className={`w-8 h-8 rounded-full transition-transform ${
                            selectedColor === color ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''
                          }`}
                          style={{ backgroundColor: value }}
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleAddLabel}
                    disabled={!newLabelText.trim()}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
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