import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, UserMinus, Search, Users } from "lucide-react";

export default function AssigneeModal({
  isOpen,
  onClose,
  users,
  currentAssignees = [],
  onAssign,
}) {
  const [localAssignees, setLocalAssignees] = useState(currentAssignees);
  const [searchQuery, setSearchQuery] = useState("");

  // Reset local state when modal opens with new currentAssignees
  useEffect(() => {
    setLocalAssignees(currentAssignees);
  }, [currentAssignees, isOpen]);

  const isAssigned = (userId) =>
    localAssignees.some((assignee) => assignee._id === userId);

  const handleUserClick = (user) => {
    const newAssignees = isAssigned(user._id)
      ? localAssignees.filter((assignee) => assignee._id !== user._id)
      : [...localAssignees, user];
    setLocalAssignees(newAssignees);
  };

  const handleClose = () => {
    // Only update in Supabase if there are actual changes
    if (JSON.stringify(localAssignees) !== JSON.stringify(currentAssignees)) {
      onAssign(localAssignees);
    }
    onClose();
  };

  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 z-50 flex items-center justify-center bg-design-black/20 backdrop-blur-[2px]"
        >
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            exit={{ y: 20 }}
            className="w-[90%] max-w-md bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-design-greyOutlines bg-design-greyBG/50">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-design-primaryPurple" />
                  <h3 className="text-lg font-medium text-design-black">
                    Assign Users
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-design-lightPurpleButtonFill text-design-primaryPurple text-xs font-medium">
                    {localAssignees.length}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-2 text-design-primaryGrey hover:text-semantic-error rounded-full hover:bg-semantic-error-light transition-all"
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>

              {/* Search Input */}
              <div className="mt-4 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-design-primaryGrey" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-design-greyOutlines bg-white focus:outline-none focus:ring-2 focus:ring-design-primaryPurple/20 focus:border-design-primaryPurple transition-all"
                />
              </div>
            </div>

            {/* Selected Users Preview */}
            <AnimatePresence>
              {localAssignees.length > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-3 flex flex-wrap gap-2 bg-design-lightPurpleButtonFill">
                    {localAssignees.map((assignee) => (
                      <motion.div
                        key={assignee._id}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="flex items-center gap-2 bg-white rounded-full pl-1 pr-2 py-1 shadow-sm"
                      >
                        <div className="h-6 w-6 rounded-full bg-design-primaryPurple text-white flex items-center justify-center text-xs font-medium">
                          {assignee.firstName[0]}
                          {assignee.lastName[0]}
                        </div>
                        <span className="text-xs text-design-primaryGrey">
                          {assignee.firstName}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleUserClick(assignee)}
                          className="ml-1 p-1 rounded-full hover:bg-semantic-error-light hover:text-semantic-error"
                        >
                          <X className="h-3 w-3" />
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Users List */}
            <div className="max-h-[40vh] overflow-y-auto p-2 space-y-1">
              {filteredUsers.map((user) => (
                <motion.button
                  key={user._id}
                  onClick={() => handleUserClick(user)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                    isAssigned(user._id)
                      ? "bg-design-lightPurpleButtonFill text-design-primaryPurple"
                      : "hover:bg-design-greyBG"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        isAssigned(user._id)
                          ? "bg-design-primaryPurple text-white"
                          : "bg-design-greyBG text-design-primaryGrey"
                      }`}
                    >
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-design-black">
                        {user.firstName} {user.lastName}
                      </p>
                      
                    </div>
                  </div>
                  <motion.div
                    initial={false}
                    animate={
                      isAssigned(user._id) ? { rotate: 360 } : { rotate: 0 }
                    }
                  >
                    {isAssigned(user._id) ? (
                      <UserMinus className="h-5 w-5 text-semantic-error" />
                    ) : (
                      <Check className="h-5 w-5 text-design-primaryPurple opacity-0 group-hover:opacity-100" />
                    )}
                  </motion.div>
                </motion.button>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-design-greyOutlines bg-design-greyBG/50">
              <div className="flex justify-end gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setLocalAssignees([])}
                  className="px-4 py-2 rounded-lg text-semantic-error hover:bg-semantic-error-light transition-all"
                >
                  Clear All
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClose}
                  className="px-4 py-2 rounded-lg bg-design-primaryPurple text-white hover:bg-button-primary-hover transition-all"
                >
                  Save Changes
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
