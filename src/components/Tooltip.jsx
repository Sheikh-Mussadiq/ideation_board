import React from "react";

export default function Tooltip({ text, children }) {
  return (
    <div className="group relative inline-block">
      {children}
      <div
        className="absolute left-1/2 -translate-x-1/2 -top-2 -translate-y-full 
        pointer-events-none opacity-0 group-hover:opacity-100 
        transition-all duration-300 ease-out group-hover:-translate-y-full 
        transform z-50"
      >
        <div
          className="bg-gray-900/90 backdrop-blur-sm text-white text-xs 
          py-1.5 px-3 rounded-lg shadow-lg whitespace-nowrap
          border border-white/10"
        >
          {text}
          <div
            className="absolute w-2 h-2 bg-gray-900/90 border-r border-b border-white/10
            left-1/2 -bottom-1 -translate-x-1/2 transform rotate-45"
          ></div>
        </div>
      </div>
    </div>
  );
}
