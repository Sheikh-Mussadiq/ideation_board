import React from 'react';

export interface Label {
  text: string;
  color: string;
}

interface CardLabelProps {
  label: Label;
  onDelete?: () => void;
}

const LABEL_COLORS = {
  red: 'bg-rose-100 text-rose-800 border border-rose-200',
  blue: 'bg-sky-100 text-sky-800 border border-sky-200',
  green: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
  yellow: 'bg-amber-100 text-amber-800 border border-amber-200',
  purple: 'bg-violet-100 text-violet-800 border border-violet-200',
  pink: 'bg-pink-100 text-pink-800 border border-pink-200',
  indigo: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
  gray: 'bg-slate-100 text-slate-800 border border-slate-200'
};

export default function CardLabel({ label, onDelete }: CardLabelProps) {
  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium shadow-sm ${
        LABEL_COLORS[label.color as keyof typeof LABEL_COLORS]
      }`}
    >
      {label.text}
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="ml-1.5 hover:text-red-500 focus:outline-none"
        >
          ×
        </button>
      )}
    </span>
  );
}