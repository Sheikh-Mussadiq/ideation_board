import React from "react";

export default function Tooltip({ text, children, position = "top" }) {
  if (!text) return children;

  return (
    <div className="relative inline-block group/tooltip">
      {children}
      <div
        className={`
          absolute z-50 hidden group-hover/tooltip:block
          pointer-events-none
          ${getPositionClasses(position)}
        `}
      >
        <div className="relative w-max px-2 py-1 text-sm font-medium text-white bg-gray-800 rounded-md">
          {text}
          <div
            className={`
              absolute w-0 h-0 border-solid border-transparent
              ${getArrowClasses(position)}
            `}
            style={{ borderWidth: "5px" }}
          />
        </div>
      </div>
    </div>
  );
}

function getPositionClasses(position) {
  switch (position) {
    case "right":
      return "left-[calc(100%+8px)] top-1/2 -translate-y-1/2";
    case "left":
      return "right-[calc(100%+8px)] top-1/2 -translate-y-1/2";
    case "bottom":
      return "top-[calc(100%+8px)] left-1/2 -translate-x-1/2";
    case "top":
    default:
      return "bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2";
  }
}

function getArrowClasses(position) {
  switch (position) {
    case "right":
      return "left-[-10px] top-1/2 -translate-y-1/2 border-r-gray-800 border-l-0 border-[5px]";
    case "left":
      return "right-[-10px] top-1/2 -translate-y-1/2 border-l-gray-800 border-r-0 border-[5px]";
    case "bottom":
      return "top-[-10px] left-1/2 -translate-x-1/2 border-b-gray-800 border-t-0 border-[5px]";
    case "top":
    default:
      return "bottom-[-10px] left-1/2 -translate-x-1/2 border-t-gray-800 border-b-0 border-[5px]";
  }
}
