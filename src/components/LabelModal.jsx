"use client";

import { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollLock } from "../hooks/useScrollLock";
import Translate from "./Translate";

const LABEL_COLORS = {
  red: {
    bg: "bg-semantic-error/20",
    text: "text-semantic-error",
    button: "bg-semantic-error",
  },
  blue: {
    bg: "bg-blue-500/20",
    text: "text-blue-500",
    button: "bg-blue-500",
  },
  green: {
    bg: "bg-semantic-success/20",
    text: "text-semantic-success",
    button: "bg-semantic-success",
  },
  yellow: {
    bg: "bg-yellow-500/20",
    text: "text-yellow-500",
    button: "bg-yellow-500",
  },
  purple: {
    bg: "bg-button-primary-cta/20",
    text: "text-button-primary-cta",
    button: "bg-button-primary-cta",
  },
  gray: {
    bg: "bg-design-greyBG/20",
    text: "text-design-black",
    button: "bg-design-greyBG",
  },
};

export default function LabelModal({ isOpen, onClose, labels, onUpdate }) {
  useScrollLock(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);
  const [newLabelText, setNewLabelText] = useState("");
  const [selectedColor, setSelectedColor] = useState("blue");

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(onClose, 200);
  };

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-x-0 top-48 flex items-start justify-center z-[200] mt-4">
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
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-design-black">
            <Translate>Labels</Translate>
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-semantic-error rounded-full hover:bg-semantic-error-light transition-colors p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {labels.map((label, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  LABEL_COLORS[label.color].bg
                } ${LABEL_COLORS[label.color].text}`}
              >
                {label.text}
                <button
                  onClick={() => handleDeleteLabel(index)}
                  className="ml-2 hover:text-semantic-error focus:outline-none"
                >
                  <X className="h-3 w-3" />
                </button>
              </motion.span>
            ))}
          </div>

          <div className="mt-4">
            <div className="flex flex-col space-y-3">
              <input
                type="text"
                value={newLabelText}
                onChange={(e) => setNewLabelText(e.target.value)}
                placeholder="Enter label text..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all dark:bg-design-black/50 dark:border-design-greyOutlines/20"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddLabel();
                  }
                }}
              />

              <div className="flex flex-wrap gap-2">
                {Object.entries(LABEL_COLORS).map(([color, value]) => (
                  <motion.button
                    key={color}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full ${
                      LABEL_COLORS[color].button
                    } ${
                      selectedColor === color
                        ? "ring-2 ring-offset-2 ring-button-primary-cta"
                        : ""
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleAddLabel}
                disabled={!newLabelText.trim()}
                className="w-full px-4 py-2 bg-design-primaryPurple text-white rounded-lg hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Translate>Add Label</Translate>
              </button>
            </div>
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
