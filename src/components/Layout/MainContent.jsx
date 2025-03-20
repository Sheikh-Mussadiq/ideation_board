import React from "react";
import { motion } from "framer-motion";
import { useSidebar } from "../../context/SidebarContext";

export default function MainContent({ children }) {
  const { isExpanded } = useSidebar();

  return (
    <div
      className={`min-h-screen transition-all duration-300 ease-in-out ${
        isExpanded ? "md:ml-64" : "md:ml-[4.5rem]"
      }`}
    >
      <main className="p-6 animate-in fade-in-50">{children}</main>
    </div>
  );
}
