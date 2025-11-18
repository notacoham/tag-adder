import { useState } from "react";

export const Tooltip = ({ children, content, side = "top" }) => {
  const [visible, setVisible] = useState(false);

  const sideClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <span
      className="relative inline-flex items-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && content && (
        <span
          className={`pointer-events-none absolute z-50 bg-gray-900 rounded-sm px-2 py-1 text-xs text-white shadow-lg max-w-xl w-max whitespace-normal break-words ${
            sideClasses[side] || sideClasses.top
          }`}
        >
          {content}
        </span>
      )}
    </span>
  );
};
