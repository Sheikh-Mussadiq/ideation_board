import React from "react";

const LABEL_COLORS = {
  red: "bg-button-outline-fill text-semantic-error border border-semantic-error",
  blue: "bg-button-outline-fill text-button-primary-cta border border-button-primary-cta",
  green:
    "bg-button-outline-fill text-semantic-success border border-semantic-success",
  yellow:
    "bg-button-tertiary-fill text-button-primary-cta border border-button-primary-cta",
  purple:
    "bg-button-outline-fill text-button-primary-cta border border-button-primary-cta",
  gray: "bg-button-secondary-fill text-design-black border border-design-greyOutlines",
};

export default function CardLabel({ label, onDelete }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
        LABEL_COLORS[label.color]
      }`}
    >
      {label.text}
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="ml-1.5 hover:text-semantic-error focus:outline-none transition-colors"
        >
          ×
        </button>
      )}
    </span>
  );
}
