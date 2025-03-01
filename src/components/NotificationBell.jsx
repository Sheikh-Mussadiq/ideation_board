import React, { useRef, useEffect } from "react";
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  X,
  Check,
  MailOpen,
  Mail,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotificationStore } from "../stores/notificationStore";
import { useNotifications } from "../hooks/useNotifications";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const getNotificationIcon = (type) => {
  switch (type) {
    case "success":
      return <CheckCircle className="w-4 h-4 text-semantic-success" />;
    case "error":
      return <AlertCircle className="w-4 h-4 text-semantic-error" />;
    case "warning":
      return <AlertCircle className="w-4 h-4 text-semantic-warning" />;
    default:
      return <Info className="w-4 h-4 text-primary" />;
  }
};

export default function NotificationBell() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { notifications, unreadCount } = useNotificationStore();
  const { markAsRead, markAllAsRead } = useNotifications();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    // Navigate to the relevant board/card if needed
    if (notification.board_id) {
      navigate(`/ideation/${notification.board_id}`);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 text-design-primaryGrey hover:text-button-primary-cta transition-all duration-200 rounded-full hover:bg-button-tertiary-fill"
        aria-label="Notifications"
      >
        <Bell className="h-[18px] w-[18px]" />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] text-xs font-semibold text-white bg-semantic-error px-1.5 rounded-full"
            >
              {unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg ring-1 ring-black/5 z-50 max-h-[80vh] flex flex-col overflow-hidden backdrop-blur-sm"
          >
            <div className="p-4 bg-design-greyBG/50 border-b border-design-greyOutlines">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-design-black">
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <span className="text-xs font-medium text-design-primaryGrey bg-white px-2 py-1 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={markAllAsRead}
                    className="text-sm font-medium text-button-primary-cta hover:text-button-primary-hover transition-colors px-3 py-1.5 rounded-full hover:bg-button-tertiary-fill flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    Mark all read
                  </motion.button>
                )}
              </div>
            </div>

            <motion.div
              className="overflow-y-auto flex-1 max-h-[60vh] scrollbar-thin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {notifications.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-8 text-center text-gray-500 flex flex-col items-center"
                >
                  <MailOpen className="h-12 w-12 text-design-primaryGrey mb-3" />
                  <p className="text-design-primaryGrey font-medium">
                    No notifications yet
                  </p>
                  <p className="text-sm text-design-primaryGrey/70 mt-1">
                    We'll notify you when something arrives
                  </p>
                </motion.div>
              ) : (
                <div className="divide-y divide-design-greyOutlines">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      whileHover={{
                        backgroundColor: "rgba(240, 238, 255, 0.5)",
                      }}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-4 cursor-pointer transition-all duration-200 ${
                        !notification.read ? "bg-button-tertiary-fill" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm ${
                              !notification.read
                                ? "text-design-black font-medium"
                                : "text-design-primaryGrey"
                            }`}
                          >
                            {notification.content}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs text-design-primaryGrey">
                              {format(
                                new Date(notification.created_at),
                                "MMM d, HH:mm"
                              )}
                            </p>
                            {notification.read ? (
                              <MailOpen className="w-3 h-3 text-design-primaryGrey" />
                            ) : (
                              <Mail className="w-3 h-3 text-button-primary-cta" />
                            )}
                          </div>
                        </div>
                        {!notification.read && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 rounded-full bg-button-primary-cta shrink-0 mt-2"
                          />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
