"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LabelModal from "./LabelModal";
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

export default function LabelManager({ labels, onUpdate }) {
  const [showModal, setShowModal] = useState(false);

  const handleDeleteLabel = (index) => {
    onUpdate(labels.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1">
        <AnimatePresence>
          {labels &&
            labels.map((label, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  LABEL_COLORS[label.color].bg
                } ${LABEL_COLORS[label.color].text}`}
              >
                {label.text}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDeleteLabel(index)}
                  className="ml-1.5 hover:text-semantic-error focus:outline-none"
                >
                  <X className="h-3 w-3" />
                </motion.button>
              </motion.span>
            ))}
        </AnimatePresence>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="btn-ghost hover:text-design-primaryPurple btn-sm rounded-full"
        >
          <Plus className="h-3 w-3 mr-1" />
          <Translate>Add Label</Translate>
        </motion.button>
      </div>

      <LabelModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        labels={labels}
        onUpdate={onUpdate}
      />
    </div>
  );
}
