import React from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSidebar } from "../../context/SidebarContext";
import { motion } from "framer-motion";
import NotificationBell from "../NotificationBell";

export default function TopBar() {
  const navigate = useNavigate();
  const { isExpanded } = useSidebar();

  const handleToSocialHub = () => {
    window.location.href = "https://socialhub.io/";
  };

  return (
    <motion.div
      className="fixed top-0 right-0 h-12 bg-white/80 backdrop-blur-sm border-b border-gray-200 z-40 shadow-sm"
      animate={{
        left: isExpanded ? "16rem" : "4.5rem",
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="h-full px-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary">Ideation Board</h1>
        <div className="flex items-center space-x-4">
          <NotificationBell />
          <button onClick={handleToSocialHub} className="btn-primary">
            <LogOut className="h-4 w-4 mr-2" />
            Social Hub
          </button>
        </div>
      </div>
    </motion.div>
  );
}
