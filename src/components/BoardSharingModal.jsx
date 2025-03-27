import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import {
  Users,
  UserCheck,
  UserMinus,
  Search,
  User,
  Share2,
  X,
  UsersRound,
  UserRound,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  assignBoardToTeam,
  unassignBoardFromTeam,
  shareWithUsers,
  removeSharedUsers,
} from "../services/boardService";
import toast from "react-hot-toast";
import Tooltip from "./Tooltip";

export default function BoardSharingModal({
  isOpen,
  onClose,
  board,
  updateBoardsList,
  teams,
  users,
  currentUser,
}) {
  const [activeTab, setActiveTab] = useState("teams");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAssignBoardToTeam = async (teamId) => {
    try {
      setLoading(true);
      await assignBoardToTeam(board.id, teamId);

      updateBoardsList((prev) =>
        prev.map((b) => (b.id === board.id ? { ...b, team_id: teamId } : b))
      );

      toast.success("Board assigned to team successfully");
      setSelectedTeam(null);
    } catch (error) {
      console.error("Error assigning board to team:", error);
      toast.error("Failed to assign board to team");
    } finally {
      setLoading(false);
    }
  };

  const handleUnassignBoardFromTeam = async () => {
    try {
      setLoading(true);
      await unassignBoardFromTeam(board.id);

      updateBoardsList((prev) =>
        prev.map((b) => (b.id === board.id ? { ...b, team_id: null } : b))
      );

      toast.success("Board unassigned from team successfully");
      setSelectedTeam(null);
    } catch (error) {
      console.error("Error unassigning board from team:", error);
      toast.error("Failed to unassign board from team");
    } finally {
      setLoading(false);
    }
  };

  const handleShareWithUsers = async (userIds) => {
    try {
      setLoading(true);
      await shareWithUsers(
        board.id,
        userIds,
        currentUser.firstName,
        board.title
      );

      updateBoardsList((prev) =>
        prev.map((b) =>
          b.id === board.id
            ? {
                ...b,
                shared_users: [...(b.shared_users || []), ...userIds],
              }
            : b
        )
      );

      toast.success("Board shared with users successfully");
      setSelectedUsers([]);
    } catch (error) {
      console.error("Error sharing board with users:", error);
      toast.error("Failed to share board with users");
    } finally {
      setLoading(false);
    }
  };

  const handleUnshareWithUsers = async (userIds) => {
    try {
      setLoading(true);
      await removeSharedUsers(board.id, userIds);

      updateBoardsList((prev) =>
        prev.map((b) =>
          b.id === board.id
            ? {
                ...b,
                shared_users: (b.shared_users || []).filter(
                  (id) => !userIds.includes(id)
                ),
              }
            : b
        )
      );

      toast.success("Users removed from board successfully");
      setSelectedUsers([]);
    } catch (error) {
      console.error("Error removing users from board:", error);
      toast.error("Failed to remove users from board");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users?.filter(
    (user) =>
      (user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())) &&
      user.id !== currentUser.userId // Don't show current user
  );

  const filteredTeams = teams?.filter((team) =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const TabButton = ({ tab, label, icon: Icon }) => (
    <button
      onClick={() => {
        setActiveTab(tab);
        // Reset selections when switching tabs
        if (tab === "teams") {
          setSelectedUsers([]);
        } else {
          setSelectedTeam(null);
          setSelectedUsers([]); // Clear user selection when switching to "users" tab
        }
      }}
      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-all ${
        activeTab === tab
          ? "text-button-primary-cta border-button-primary-cta"
          : "text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );

  const handleTeamAction = () => {
    if (board.team_id === selectedTeam._id) {
      handleUnassignBoardFromTeam();
    } else {
      handleAssignBoardToTeam(selectedTeam._id);
    }
  };

  const handleUserAction = () => {
    const sharedUserIds = selectedUsers.filter((id) =>
      board.shared_users?.includes(id)
    );
    const nonSharedUserIds = selectedUsers.filter(
      (id) => !board.shared_users?.includes(id)
    );

    if (sharedUserIds.length > 0) {
      handleUnshareWithUsers(sharedUserIds);
    }
    if (nonSharedUserIds.length > 0) {
      handleShareWithUsers(nonSharedUserIds);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-design-black p-6 shadow-xl transition-all relative">
                <div className="absolute top-4 right-4">
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-semantic-error hover:bg-semantic-error-light/30 rounded-full transition-all duration-200"
                    aria-label="Close modal"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <Dialog.Title className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
                  <div className="p-2 bg-button-primary-cta/10 rounded-full">
                    <Share2 className="h-5 w-5 text-button-primary-cta" />
                  </div>
                  Share Board
                </Dialog.Title>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 dark:border-gray-700 mb-5">
                  <TabButton tab="teams" label="Teams" icon={UsersRound} />
                  <TabButton tab="users" label="Users" icon={User} />
                </div>

                {/* Search Bar */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative mb-5"
                >
                  <input
                    type="text"
                    placeholder={
                      activeTab === "teams"
                        ? "Search teams..."
                        : "Search users..."
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2.5 pl-10 text-sm bg-gray-50 dark:bg-design-black/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-button-primary-cta focus:border-transparent transition-all"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </motion.div>

                {/* Content Based on Active Tab */}
                <AnimatePresence mode="wait">
                  {activeTab === "teams" ? (
                    // Teams List
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-2 max-h-60 overflow-y-auto rounded-lg"
                    >
                      <AnimatePresence mode="wait">
                        {filteredTeams.map((team) => (
                          <motion.div
                            key={team._id || team.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            className={`w-full px-4 py-3 rounded-lg transition-all flex items-center justify-between group hover:scale-[1.01] ${
                              selectedTeam?.id === team.id
                                ? "bg-button-primary-cta/10 text-button-primary-cta dark:bg-button-primary-cta/20 border border-button-primary-cta/30"
                                : "hover:bg-gray-50 dark:hover:bg-gray-800"
                            }`}
                          >
                            <div
                              className="flex-1 text-left cursor-pointer"
                              onClick={() => setSelectedTeam(team)}
                            >
                              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {team.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {board?.team_id === team._id ? (
                                <button
                                  onClick={() => {
                                    setSelectedTeam(team);
                                    handleUnassignBoardFromTeam();
                                  }}
                                  className="p-2 rounded-full bg-semantic-error-light text-semantic-error hover:bg-semantic-error/20 transition-colors duration-200"
                                  title="Remove team access"
                                >
                                  <UserMinus className="h-4 w-4" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    setSelectedTeam(team);
                                    handleAssignBoardToTeam(team._id);
                                  }}
                                  className="p-2 rounded-full bg-semantic-success-light text-semantic-success hover:bg-semantic-success/20 transition-colors duration-200"
                                  title="Share with team"
                                >
                                  <UserCheck className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-2 max-h-60 overflow-y-auto rounded-lg"
                    >
                      {filteredUsers.map((user) => (
                        <motion.div
                          key={user.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`w-full px-4 py-3 rounded-lg transition-all flex items-center justify-between group hover:scale-[1.01] ${
                            selectedUsers.includes(user.id)
                              ? "bg-button-primary-cta/10 text-button-primary-cta dark:bg-button-primary-cta/20 border border-button-primary-cta/30"
                              : "hover:bg-gray-50 dark:hover:bg-gray-800"
                          }`}
                        >
                          <div
                            className="flex-1 text-left cursor-pointer flex items-center gap-3 min-w-0"
                            onClick={() =>
                              setSelectedUsers((prev) =>
                                prev.includes(user.id)
                                  ? prev.filter((id) => id !== user.id)
                                  : [...prev, user.id]
                              )
                            }
                          >
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden border border-gray-300 dark:border-gray-600">
                              {user.avatar_url ? (
                                <img
                                  src={user.avatar_url}
                                  alt={user.name}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                              ) : (
                                <UserRound className="h-4 w-4" />
                              )}
                            </div>
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                              {user.name || user.email}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {board.shared_users?.includes(user.id) ? (
                              <button
                                onClick={() =>
                                  handleUnshareWithUsers([user.id])
                                }
                                className="p-2 rounded-full bg-semantic-error-light text-semantic-error hover:bg-semantic-error/20 transition-colors duration-200"
                                title="Remove user access"
                              >
                                <UserMinus className="h-4 w-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleShareWithUsers([user.id])}
                                className="p-2 rounded-full bg-semantic-success-light text-semantic-success hover:bg-semantic-success/20 transition-colors duration-200"
                                title="Share with user"
                              >
                                <UserCheck className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
