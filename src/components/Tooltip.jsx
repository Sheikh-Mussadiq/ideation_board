import React, { useState, useEffect } from "react";

export default function Tooltip({
  text,
  children,
  position = "top",
  animated = false,
  persistent = false,
  persistentKey = null,
}) {
  const [hasClicked, setHasClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (persistent && persistentKey) {
      const hasUserClicked = localStorage.getItem(persistentKey) === "true";
      setHasClicked(hasUserClicked);
      setIsVisible(!hasUserClicked);
    }
  }, [persistent, persistentKey]);

  const handleClick = () => {
    if (persistent && persistentKey) {
      localStorage.setItem(persistentKey, "true");
      setHasClicked(true);
      setIsVisible(false);
    }
  };

  if (!text) return children;

  // Wrap children with click handler if persistent tooltip
  const wrappedChildren = persistent ? (
    <div onClick={handleClick}>{children}</div>
  ) : (
    children
  );

  const shouldAnimate = animated && (!persistent || !hasClicked);

  return (
    <div className="relative inline-block group/tooltip">
      {wrappedChildren}
      <div
        className={`
          absolute z-50 ${
            persistent && isVisible
              ? "block"
              : "hidden group-hover/tooltip:block"
          }
          ${persistent ? "pointer-events-auto" : "pointer-events-none"}
          ${shouldAnimate ? "animate-pulse opacity-80" : ""}
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
