import React from "react";
import { motion } from "framer-motion";

export default function MainContent({ children }) {
  return (
    // <div className="ml-16 min-h-screen">
    //   <main className="p-6 animate-in fade-in-50">{children}</main>
    // </div>
    <motion.div
      className="min-h-screen"
      initial={{ marginLeft: "16rem" }}
      animate={{ marginLeft: "4.5rem" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <main className="p-6 animate-in fade-in-50">{children}</main>
    </motion.div>
  );
}
