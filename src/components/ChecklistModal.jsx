"use client";

import { useState, useEffect } from "react";
import { X, Plus, CheckSquare, Square } from "lucide-react";
import { useScrollLock } from "../hooks/useScrollLock";
import Translate from "./Translate"; // Import Translate component

export default function ChecklistModal({
  isOpen,
  onClose,
  checklist,
  onUpdate,
}) {
  useScrollLock(isOpen);
  const [newItemText, setNewItemText] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(onClose, 200); // Wait for animation to complete
  };

  const handleAddItem = () => {
    if (newItemText.trim()) {
      onUpdate([
        ...checklist,
        {
          id: Date.now().toString(),
          text: newItemText.trim(),
          checked: false,
        },
      ]);
      setNewItemText("");
    }
  };

  const handleToggleItem = (itemId) => {
    onUpdate(
      checklist.map((item) =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleDeleteItem = (itemId) => {
    onUpdate(checklist.filter((item) => item.id !== itemId));
  };

  const completedCount = checklist.filter((item) => item.checked).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-x-0 top-80 flex items-start justify-center z-[200] mt-4">
      <div
        className="fixed inset-0 bg-black/25 backdrop-blur-sm"
        onClick={handleClose}
        style={{
          animation: isAnimating
            ? "fadeIn 0.2s ease-out forwards"
            : "fadeOut 0.2s ease-out forwards",
        }}
      />

      <div
        className="relative w-full max-w-md mx-4 bg-white rounded-2xl p-8 shadow-xl border border-gray-100"
        style={{
          animation: isAnimating
            ? "slideIn 0.2s ease-out forwards"
            : "slideOut 0.2s ease-out forwards",
        }}
      >
        <div className="text-xl font-semibold text-design-black dark:text-design-white flex justify-between items-center mb-6">
          <span>
            <Translate>Checklist</Translate> ({completedCount}/
            {checklist.length})
          </span>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-semantic-error rounded-full hover:bg-semantic-error-light transition-colors p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {checklist.map((item) => (
            <div
              key={item.id}
              className="flex items-center group hover:bg-primary-light/30 p-2 rounded-lg transition-all"
            >
              <button
                onClick={() => handleToggleItem(item.id)}
                className="flex-shrink-0 mr-3 text-gray-400 hover:text-primary transition-colors"
              >
                {item.checked ? (
                  <CheckSquare className="h-5 w-5 text-primary" />
                ) : (
                  <Square className="h-5 w-5" />
                )}
              </button>
              <span
                className={`flex-grow ${
                  item.checked
                    ? "line-through text-gray-400"
                    : "text-gray-700 dark:text-design-white"
                }`}
              >
                {item.text}
              </span>
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="flex-shrink-0 ml-2 text-gray-400 hover:text-semantic-error opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <div className="flex items-center">
            <input
              type="text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              placeholder="Add new item..."
              className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all dark:bg-design-black/50 dark:border-design-greyOutlines/20"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddItem();
                }
              }}
            />
            <button
              onClick={handleAddItem}
              className="px-4 py-2 bg-design-primaryPurple text-white rounded-r-lg hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary transition-all hover:scale-105"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideOut {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(0.95);
          }
        }
      `}</style>
    </div>
  );
}
