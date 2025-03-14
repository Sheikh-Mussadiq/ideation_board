import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { Users, UserCheck, UserMinus, Search, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  assignBoardToTeam,
  unassignBoardFromTeam,
  shareWithUsers,
  removeSharedUsers,
} from "../services/boardService";
import toast from "react-hot-toast";

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
      onClose();
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
      onClose();
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
      onClose();
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
      onClose();
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-design-black p-6 shadow-xl transition-all">
                <Dialog.Title className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                  <Users className="h-5 w-5 text-button-primary-cta" />
                  Share Board
                </Dialog.Title>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
                  <TabButton tab="teams" label="Teams" icon={Users} />
                  <TabButton tab="users" label="Users" icon={User} />
                </div>

                {/* Search Bar */}
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search teams or users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 pl-10 text-sm bg-gray-50 dark:bg-design-black/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-button-primary-cta focus:border-transparent transition-all"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>

                {/* Content Based on Active Tab */}
                <AnimatePresence mode="wait">
                  {activeTab === "teams" ? (
                    // Teams List
                    <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-hide">
                      <AnimatePresence mode="wait">
                        {filteredTeams.map((team) => (
                          <motion.button
                            key={team._id || team.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setSelectedTeam(team)}
                            className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center justify-between group ${
                              selectedTeam?.id === team.id
                                ? "hover:bg-button-primary-cta/10 hover:text-button-primary-cta dark:bg-button-primary-cta/20"
                                : "hover:bg-gray-50 dark:hover:bg-gray-800"
                            }`}
                          >
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {team.name}
                            </span>
                            {board.team_id === team._id && (
                              <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded-full">
                                Current
                              </span>
                            )}
                          </motion.button>
                        ))}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-2 max-h-60 overflow-y-auto scrollbar-hide"
                    >
                      {filteredUsers.map((user) => (
                        <motion.button
                          key={user.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          onClick={() =>
                            setSelectedUsers((prev) =>
                              prev.includes(user.id)
                                ? prev.filter((id) => id !== user.id)
                                : [...prev, user.id]
                            )
                          }
                          className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center justify-between group ${
                            selectedUsers.includes(user.id)
                              ? "bg-button-primary-cta/10 text-button-primary-cta dark:bg-button-primary-cta/20"
                              : "hover:bg-gray-50 dark:hover:bg-gray-800"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                              {user.avatar_url ? (
                                <img
                                  src={user.avatar_url}
                                  alt={user.name}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                              ) : (
                                <User className="h-4 w-4" />
                              )}
                            </div>
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {user.name || user.email}
                            </span>
                          </div>
                          {board.shared_users?.includes(user.id) && (
                            <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded-full">
                              Shared
                            </span>
                          )}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action Section */}
                {((activeTab === "teams" && selectedTeam) ||
                  (activeTab === "users" && selectedUsers.length > 0)) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/30"
                  >
                    {activeTab === "teams" ? (
                      <>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                          {board.team_id === selectedTeam._id ? (
                            <span className="flex items-center gap-2">
                              <UserMinus className="h-4 w-4 text-semantic-error" />
                              Stop Sharing with team:{" "}
                              <span className="font-semibold">
                                {selectedTeam.name}
                              </span>
                              ?
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <UserCheck className="h-4 w-4 text-semantic-success" />
                              Share with team:{" "}
                              <span className="font-semibold">
                                {selectedTeam.name}
                              </span>
                              ?
                            </span>
                          )}
                        </p>
                        <button
                          onClick={handleTeamAction}
                          className={`btn-primary text-sm w-full justify-center ${
                            board.team_id === selectedTeam._id
                              ? "!bg-semantic-error hover:!bg-semantic-error/90"
                              : "!bg-semantic-success hover:!bg-semantic-success/90"
                          }`}
                        >
                          {board.team_id === selectedTeam._id ? (
                            <>
                              <UserMinus className="h-4 w-4 mr-2" />
                              Stop Sharing
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-4 w-4 mr-2" />
                              Share
                            </>
                          )}
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                          <span className="flex items-center gap-2">
                            {selectedUsers.some((id) =>
                              board.shared_users?.includes(id)
                            ) ? (
                              <>
                                <UserMinus className="h-4 w-4 text-semantic-error" />
                                Remove {selectedUsers.length} users from board?
                              </>
                            ) : (
                              <>
                                <UserCheck className="h-4 w-4 text-semantic-success" />
                                Share with {selectedUsers.length} selected
                                users?
                              </>
                            )}
                          </span>
                        </p>
                        <button
                          onClick={handleUserAction}
                          className={`btn-primary text-sm w-full justify-center ${
                            selectedUsers.some((id) =>
                              board.shared_users?.includes(id)
                            )
                              ? "!bg-semantic-error hover:!bg-semantic-error/90"
                              : "!bg-semantic-success hover:!bg-semantic-success/90"
                          }`}
                        >
                          {selectedUsers.some((id) =>
                            board.shared_users?.includes(id)
                          ) ? (
                            <>
                              <UserMinus className="h-4 w-4 mr-2" />
                              Remove Users
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-4 w-4 mr-2" />
                              Share with Users
                            </>
                          )}
                        </button>
                      </>
                    )}
                  </motion.div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
