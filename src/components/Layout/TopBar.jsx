import React from "react";
import { LogOut, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSidebar } from "../../context/SidebarContext";
import { motion } from "framer-motion";
import NotificationBell from "../NotificationBell";

export default function TopBar() {
  const navigate = useNavigate();
  const { isExpanded, toggleSidebar, isMobile } = useSidebar();

  const handleToSocialHub = () => {
    window.open("https://app.socialhub.io/inbox", "_blank");
  };

  return (
    <motion.div
      className="fixed top-0 h-12 bg-white/80 backdrop-blur-sm border-b border-gray-200 z-30 shadow-sm"
      initial={{ left: 0, right: 0 }}
      animate={{
        left: !isMobile && isExpanded ? "16rem" : isMobile ? "0" : "4.5rem",
        right: 0,
        transition: {
          type: "tween",
          duration: 0.3,
          ease: "easeInOut",
        },
      }}
    >
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold text-primary">Ideation Board</h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <NotificationBell />
          <button
            onClick={handleToSocialHub}
            className="btn-primary p-2 sm:px-4"
            title="Go to Social Hub"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline ml-2">Social Hub</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
