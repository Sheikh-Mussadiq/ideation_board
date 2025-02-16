// import React, { useState } from "react";
// import { Tag, Plus, X } from "lucide-react";

// const LABEL_COLORS = {
//   red: {
//     bg: "bg-button-outline-fill",
//     text: "text-semantic-error",
//     button: "bg-semantic-error/20",
//   },
//   blue: {
//     bg: "bg-button-outline-fill",
//     text: "text-button-primary-cta",
//     button: "bg-button-primary-cta/20",
//   },
//   green: {
//     bg: "bg-button-outline-fill",
//     text: "text-semantic-success",
//     button: "bg-semantic-success/20",
//   },
//   yellow: {
//     bg: "bg-button-tertiary-fill",
//     text: "text-button-primary-cta",
//     button: "bg-button-primary-cta/20",
//   },
//   purple: {
//     bg: "bg-button-outline-fill",
//     text: "text-button-primary-cta",
//     button: "bg-button-primary-cta/20",
//   },
//   gray: {
//     bg: "bg-button-secondary-fill",
//     text: "text-design-black",
//     button: "bg-design-greyBG",
//   },
// };

// export default function LabelManager({ labels, onUpdate }) {
//   const [isAdding, setIsAdding] = useState(false);
//   const [newLabelText, setNewLabelText] = useState("");
//   const [selectedColor, setSelectedColor] = useState("blue");

//   const handleAddLabel = () => {
//     if (newLabelText.trim()) {
//       onUpdate([
//         ...labels,
//         { text: newLabelText.trim(), color: selectedColor },
//       ]);
//       setNewLabelText("");
//       setIsAdding(false);
//     }
//   };

//   const handleDeleteLabel = (index) => {
//     onUpdate(labels.filter((_, i) => i !== index));
//   };

//   return (
//     <div className="space-y-2">
//       <div className="flex flex-wrap gap-1">
//         {labels &&
//           labels.map((label, index) => (
//             <span
//               key={index}
//               className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                 LABEL_COLORS[label.color].bg
//               } ${LABEL_COLORS[label.color].text}`}
//             >
//               {label.text}
//               <button
//                 onClick={() => handleDeleteLabel(index)}
//                 className="ml-1.5 hover:text-semantic-error focus:outline-none"
//               >
//                 <X className="h-3 w-3" />
//               </button>
//             </span>
//           ))}
//         <button
//           onClick={() => setIsAdding(true)}
//           className="btn-ghost btn-sm rounded-full"
//         >
//           <Plus className="h-3 w-3 mr-1" />
//           Add Label
//         </button>
//       </div>

//       {isAdding && (
//         <div className="mt-2 p-3 bg-button-secondary-fill rounded-lg dark:bg-button-secondary-fill/10">
//           <div className="flex items-center gap-2 mb-2">
//             <input
//               type="text"
//               value={newLabelText}
//               onChange={(e) => setNewLabelText(e.target.value)}
//               placeholder="Label text..."
//               className="flex-1 px-2 py-1 text-sm border border-design-greyOutlines rounded focus:outline-none focus:ring-1 focus:ring-button-primary-cta dark:bg-design-black/50 dark:border-design-greyOutlines/20"
//               autoFocus
//             />
//             <div className="flex gap-1">
//               {Object.entries(LABEL_COLORS).map(([color, value]) => (
//                 <button
//                   key={color}
//                   onClick={() => setSelectedColor(color)}
//                   // className={`w-6 h-6 rounded-full ${
//                   //   selectedColor === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
//                   // }`}
//                   className={`w-6 h-6 rounded-full ${
//                     LABEL_COLORS[color].button
//                   } ${LABEL_COLORS[color].text} ${
//                     selectedColor === color
//                       ? "ring-2 ring-offset-2 ring-button-primary-cta"
//                       : ""
//                   }`}
//                 />
//               ))}
//             </div>
//           </div>
//           <div className="flex justify-end gap-2">
//             <button
//               onClick={() => setIsAdding(false)}
//               className="px-3 py-1 text-sm text-design-primaryGrey hover:text-design-black dark:text-design-greyOutlines dark:hover:text-design-white"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleAddLabel}
//               className="px-3 py-1 text-sm bg-button-primary-cta text-button-primary-text rounded hover:bg-button-primary-hover dark:bg-button-primary-hover dark:hover:bg-button-primary-cta"
//             >
//               Add
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LABEL_COLORS = {
  red: {
    bg: "bg-button-outline-fill",
    text: "text-semantic-error",
    button: "bg-semantic-error/20",
  },
  blue: {
    bg: "bg-button-outline-fill",
    text: "text-button-primary-cta",
    button: "bg-button-primary-cta/20",
  },
  green: {
    bg: "bg-button-outline-fill",
    text: "text-semantic-success",
    button: "bg-semantic-success/20",
  },
  yellow: {
    bg: "bg-button-tertiary-fill",
    text: "text-button-primary-cta",
    button: "bg-button-primary-cta/20",
  },
  purple: {
    bg: "bg-button-outline-fill",
    text: "text-button-primary-cta",
    button: "bg-button-primary-cta/20",
  },
  gray: {
    bg: "bg-button-secondary-fill",
    text: "text-design-black",
    button: "bg-design-greyBG",
  },
};

export default function LabelManager({ labels, onUpdate }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newLabelText, setNewLabelText] = useState("");
  const [selectedColor, setSelectedColor] = useState("blue");

  const handleAddLabel = () => {
    if (newLabelText.trim()) {
      onUpdate([
        ...labels,
        { text: newLabelText.trim(), color: selectedColor },
      ]);
      setNewLabelText("");
      setIsAdding(false);
    }
  };

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
          onClick={() => setIsAdding(true)}
          className="btn-ghost btn-sm rounded-full"
        >
          <Plus className="h-3 w-3 mr-1" />
          Add Label
        </motion.button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mt-2 p-3 bg-button-secondary-fill rounded-lg dark:bg-button-secondary-fill/10"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-2">
              <input
                type="text"
                value={newLabelText}
                onChange={(e) => setNewLabelText(e.target.value)}
                placeholder="Label text..."
                className="w-full sm:w-auto flex-1 px-2 py-1 text-sm border border-design-greyOutlines rounded focus:outline-none focus:ring-1 focus:ring-button-primary-cta dark:bg-design-black/50 dark:border-design-greyOutlines/20"
                autoFocus
              />
              <div className="flex gap-1 flex-wrap">
                {Object.entries(LABEL_COLORS).map(([color, value]) => (
                  <motion.button
                    key={color}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedColor(color)}
                    className={`w-6 h-6 rounded-full ${
                      LABEL_COLORS[color].button
                    } ${LABEL_COLORS[color].text} ${
                      selectedColor === color
                        ? "ring-2 ring-offset-2 ring-button-primary-cta"
                        : ""
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAdding(false)}
                className="px-3 py-1 text-sm text-design-primaryGrey hover:text-design-black dark:text-design-greyOutlines dark:hover:text-design-white"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddLabel}
                className="px-3 py-1 text-sm bg-button-primary-cta text-button-primary-text rounded hover:bg-button-primary-hover dark:bg-button-primary-hover dark:hover:bg-button-primary-cta"
              >
                Add
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
