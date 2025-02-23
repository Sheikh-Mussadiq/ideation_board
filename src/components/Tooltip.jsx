import React from "react";

export default function Tooltip({ text, children, position = "top" }) {
  if (!text) return children;

  return (
    <div className="relative group/tooltip">
      {children}
      <div
        className={`
        absolute z-50 hidden group-hover/tooltip:block
        pointer-events-none transition-all duration-150
        ${getPositionClasses(position)}
      `}
      >
        <div className="relative px-2 py-1 text-sm font-medium text-white bg-gray-800 rounded-md shadow-sm whitespace-nowrap">
          {text}
          <div
            className={`absolute w-0 h-0 ${getArrowClasses(position)}`}
            style={{
              borderWidth: "6px",
              borderStyle: "solid",
            }}
          />
        </div>
      </div>
    </div>
  );
}

function getPositionClasses(position) {
  switch (position) {
    case "right":
      return "left-full top-1/2 -translate-y-1/2 ml-2";
    case "left":
      return "right-full top-1/2 -translate-y-1/2 mr-2";
    case "bottom":
      return "top-full left-1/2 -translate-x-1/2 mt-2";
    case "top":
    default:
      return "bottom-full left-1/2 -translate-x-1/2 mb-2";
  }
}

function getArrowClasses(position) {
  switch (position) {
    case "right":
      return "-left-1 top-1/2 -translate-y-1/2 border-r-gray-800 border-t-transparent border-b-transparent border-l-transparent";
    case "left":
      return "-right-1 top-1/2 -translate-y-1/2 border-l-gray-800 border-t-transparent border-b-transparent border-r-transparent";
    case "bottom":
      return "-top-1 left-1/2 -translate-x-1/2 border-b-gray-800 border-l-transparent border-r-transparent border-t-transparent";
    case "top":
    default:
      return "-bottom-1 left-1/2 -translate-x-1/2 border-t-gray-800 border-l-transparent border-r-transparent border-b-transparent";
  }
}
