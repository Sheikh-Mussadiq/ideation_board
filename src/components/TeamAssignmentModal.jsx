import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Users, UserCheck, UserMinus, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TeamAssignmentModal({
  isOpen,
  onClose,
  teams,
  selectedTeam,
  onSelectTeam,
  onAssign,
  onUnassign,
  currentTeamId,
  searchQuery,
  setSearchQuery,
}) {
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
                  Share Board with a Team
                </Dialog.Title>

                {/* Search Bar */}
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search teams..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 pl-10 text-sm bg-gray-50 dark:bg-design-black/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-button-primary-cta focus:border-transparent transition-all"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>

                {/* Teams List */}
                <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-hide">
                  <AnimatePresence mode="wait">
                    {teams.map((team) => (
                      <motion.button
                        key={team._id || team.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => onSelectTeam(team)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center justify-between group ${
                          selectedTeam?.id === team.id
                            ? "hover:bg-button-primary-cta/10 hover:text-button-primary-cta dark:bg-button-primary-cta/20"
                            : "hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                      >
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {team.name}
                        </span>
                        {currentTeamId === team._id && (
                          <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded-full">
                            Current
                          </span>
                        )}
                      </motion.button>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Assignment Action */}
                {selectedTeam && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/30"
                  >
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      {currentTeamId === selectedTeam._id ? (
                        <span className="flex items-center gap-2">
                          <UserMinus className="h-4 w-4 text-semantic-error" />
                          Unassign from team{" "}
                          <span className="font-semibold">
                            {selectedTeam.name}
                          </span>
                          ?
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <UserCheck className="h-4 w-4 text-semantic-success" />
                          Assign to team{" "}
                          <span className="font-semibold">
                            {selectedTeam.name}
                          </span>
                          ?
                        </span>
                      )}
                    </p>
                    <button
                      onClick={() =>
                        currentTeamId === selectedTeam._id
                          ? onUnassign(selectedTeam.id)
                          : onAssign(selectedTeam._id)
                      }
                      className={`btn-primary text-sm w-full justify-center ${
                        currentTeamId === selectedTeam._id
                          ? "!bg-semantic-error hover:!bg-semantic-error/90"
                          : "!bg-semantic-success hover:!bg-semantic-success/90"
                      }`}
                    >
                      {currentTeamId === selectedTeam._id ? (
                        <>
                          <UserMinus className="h-4 w-4 mr-2" />
                          Unassign
                        </>
                      ) : (
                        <>
                          <UserCheck className="h-4 w-4 mr-2" />
                          Assign
                        </>
                      )}
                    </button>
                  </motion.div>
                )}

                {/* Footer Actions */}
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={onClose}
                    className="btn-ghost text-sm flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
