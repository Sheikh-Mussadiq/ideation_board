import React, { useRef, useEffect } from "react";
import { Bell, CheckCircle, AlertCircle, Info, X } from "lucide-react";
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
        className="relative p-2 text-gray-600 hover:text-primary transition-all duration-200 rounded-full hover:bg-primary-light/10"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] text-xs font-semibold text-white bg-semantic-error px-1 rounded-full"
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
            className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg ring-1 ring-black/5 z-50 max-h-[80vh] flex flex-col overflow-hidden"
          >
            <div className="p-4 bg-gray-50/80 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={markAllAsRead}
                    className="text-sm font-medium text-primary hover:text-primary-hover transition-colors px-3 py-1.5 rounded-full hover:bg-primary-light/20"
                  >
                    Mark all as read
                  </motion.button>
                )}
              </div>
            </div>

            <motion.div
              className="overflow-y-auto flex-1 max-h-[60vh]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                  <Bell className="h-12 w-12 text-gray-300 mb-2" />
                  <p className="text-gray-400 font-medium">
                    No notifications yet
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      whileHover={{
                        backgroundColor: notification.read
                          ? "rgba(0, 0, 0, 0.02)"
                          : "rgba(var(--color-primary-light), 0.15)",
                      }}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-4 cursor-pointer transition-all duration-200 ${
                        !notification.read
                          ? "bg-primary-light/10"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1">
                          <p
                            className={`text-sm ${
                              !notification.read
                                ? "text-gray-900 font-medium"
                                : "text-gray-600"
                            }`}
                          >
                            {notification.content}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {format(
                              new Date(notification.created_at),
                              "MMM d, HH:mm"
                            )}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
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
