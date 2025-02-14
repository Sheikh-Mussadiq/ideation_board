import React, { useState } from "react";
import { X, Plus } from "lucide-react";

const LABEL_COLORS = {
  red: "bg-button-outline-fill text-semantic-error",
  blue: "bg-button-outline-fill text-button-primary-cta",
  green: "bg-button-outline-fill text-semantic-success",
  yellow: "bg-button-tertiary-fill text-button-primary-cta",
  purple: "bg-button-outline-fill text-button-primary-cta",
  gray: "bg-button-secondary-fill text-design-black dark:text-design-white",
};

export default function LabelModal({ isOpen, onClose, labels, onUpdate }) {
  const [newLabelText, setNewLabelText] = useState("");
  const [selectedColor, setSelectedColor] = useState("blue");

  if (!isOpen) return null;

  const handleAddLabel = () => {
    if (newLabelText.trim()) {
      onUpdate([
        ...labels,
        { text: newLabelText.trim(), color: selectedColor },
      ]);
      setNewLabelText("");
      setSelectedColor("blue");
    }
  };

  const handleDeleteLabel = (index) => {
    onUpdate(labels.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div
          className="fixed inset-0 bg-design-black/30 backdrop-blur-sm"
          onClick={onClose}
        ></div>

        <div className="relative bg-design-white rounded-lg shadow-xl max-w-md w-full dark:bg-design-black/90 dark:border dark:border-design-greyOutlines/20">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-design-black dark:text-design-white">
                Manage Labels
              </h3>
              <button
                onClick={onClose}
                className="text-design-primaryGrey hover:text-design-black dark:text-design-greyOutlines dark:hover:text-design-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {labels.map((label, index) => (
                  <span
                    key={index}
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${
                      LABEL_COLORS[label.color]
                    }`}
                  >
                    {label.text}
                    <button
                      onClick={() => handleDeleteLabel(index)}
                      className="ml-1.5 hover:text-semantic-error focus:outline-none transition-colors dark:hover:text-semantic-error"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="border-t border-design-greyOutlines pt-4 dark:border-design-greyOutlines/20">
                <h4 className="text-sm font-medium mb-2 text-design-black dark:text-design-white">
                  Add New Label
                </h4>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newLabelText}
                    onChange={(e) => setNewLabelText(e.target.value)}
                    placeholder="Enter label text..."
                    className="input"
                  />

                  <div>
                    <label className="block text-sm font-medium text-design-primaryGrey mb-2 dark:text-design-greyOutlines">
                      Select Color
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(LABEL_COLORS).map(([color, value]) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`w-8 h-8 rounded-full transition-all ${
                            LABEL_COLORS[color]
                          } ${
                            selectedColor === color
                              ? "ring-2 ring-offset-2 ring-button-primary-cta scale-110 dark:ring-offset-design-black"
                              : ""
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleAddLabel}
                    disabled={!newLabelText.trim()}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed dark:disabled:bg-button-disabled-fill dark:disabled:text-button-disabled-text"
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
