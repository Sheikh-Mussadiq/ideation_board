import React from "react";
import { motion } from "framer-motion";
import { useSidebar } from "../../context/SidebarContext";

export default function MainContent({ children }) {
  const { isExpanded } = useSidebar();

  return (
    <motion.div
      className="min-h-screen"
      animate={{
        marginLeft: isExpanded ? "16rem" : "4.5rem",
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <main className="p-6 animate-in fade-in-50">{children}</main>
    </motion.div>
  );
}
