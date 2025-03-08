import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Search,
  Lightbulb,
  ChevronDown,
  Plus,
  Layout,
  ChevronLeft,
  ChevronRight,
  Kanban,
  SquareKanban,
  UserSquare2,
  Users,
  Settings,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Tooltip from "../Tooltip";
import { useBoards } from "../../context/BoardContext";
import { useAuth } from "../../context/AuthContext";
import { useSidebar } from "../../context/SidebarContext";
import SettingsModal from "../SettingsModal";

const navItems = [
  { name: "Home", path: "/home", icon: Home },
  { name: "Ideation", path: "/ideation", icon: Lightbulb },
];

const BoardSection = React.memo(
  ({ title, boards, searchValue, onSearchChange, icon: Icon }) => {
    const navigate = useNavigate();

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-design-primaryGrey">
          <Icon className="h-4 w-4" />
          {title}
        </div>
        <div className="px-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search boards..."
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-4 py-1.5 pl-8 text-sm bg-design-greyBG dark:bg-design-black border border-design-greyOutlines dark:border-design-greyOutlines/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-design-primaryPurple focus:border-transparent transition-all"
            />
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-design-primaryGrey" />
          </div>
        </div>
        <div className="space-y-1 max-h-40 overflow-y-auto over-">
          {boards.length > 0 ? (
            boards.map((board) => (
              <motion.button
                key={board.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="flex items-center w-[90%] px-3 py-1.5 text-sm break-all text-left text-design-primaryGrey hover:bg-design-primaryPurple/10 hover:text-design-primaryPurple rounded-lg transition-all duration-200 ml-3"
                onClick={() => navigate(`/ideation/${board.id}`)}
              >
                {board.title}
              </motion.button>
            ))
          ) : (
            <p className="text-sm text-design-primaryGrey dark:text-design-greyOutlines px-3 py-2">
              No boards found
            </p>
          )}
        </div>
      </div>
    );
  }
);

BoardSection.displayName = "BoardSection";

export default function Sidebar() {
  const { isExpanded, setIsExpanded } = useSidebar();
  const [myBoardsSearch, setMyBoardsSearch] = useState("");
  const [sharedBoardsSearch, setSharedBoardsSearch] = useState("");
  const [isBoardsOpen, setIsBoardsOpen] = useState(false);
  const { currentUser, authUser } = useAuth();
  const { boardsList, isLoading } = useBoards();
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Split boards into my boards and shared boards
  const myBoards = boardsList.filter(
    (board) => board.created_by === authUser.id
  );
  const sharedBoards = boardsList.filter(
    (board) => board.created_by !== authUser.id
  );

  // Filter boards based on search
  const myBoardsFiltered = React.useMemo(() => {
    return myBoards.filter((board) =>
      board.title.toLowerCase().includes(myBoardsSearch.toLowerCase())
    );
  }, [myBoards, myBoardsSearch]);

  const sharedBoardsFiltered = React.useMemo(() => {
    return sharedBoards.filter((board) =>
      board.title.toLowerCase().includes(sharedBoardsSearch.toLowerCase())
    );
  }, [sharedBoards, sharedBoardsSearch]);

  const handleBoardClickNoSidebar = () => {
    setIsExpanded(true);
    setIsBoardsOpen(true);
  };

  return (
    <>
      <motion.div
        className="fixed inset-y-0 left-0 bg-white/60 dark:bg-design-black/60  backdrop-blur-xl border-r border-design-greyOutlines z-50 flex flex-col"
        animate={{
          width: isExpanded ? "16rem" : "4.5rem",
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="flex flex-col h-full relative">
          {/* Toggle Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="absolute -right-3 top-6 bg-design-primaryPurple hover:bg-design-primaryPurple/90 rounded-full p-1.5 shadow-lg shadow-design-primaryPurple/20 transition-all duration-300"
          >
            {isExpanded ? (
              <ChevronLeft className="h-4 w-4 text-white" />
            ) : (
              <ChevronRight className="h-4 w-4 text-white" />
            )}
          </button>
          {/* Logo */}
          <div className="p-4 mb-2">
            <AnimatePresence>
              {isExpanded ? (
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xl font-bold text-design-primaryPurple tracking-tight"
                >
                  Social Hub
                </motion.h1>
              ) : (
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xl font-bold text-design-primaryPurple"
                >
                  SH
                </motion.h1>
              )}
            </AnimatePresence>
          </div>
          <nav className="flex-1 px-3 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Tooltip
                  key={item.name}
                  text={!isExpanded ? item.name : undefined}
                  position="right"
                >
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2.5 rounded-xl transition-all duration-300 group ${
                        isActive
                          ? "bg-design-primaryPurple text-white shadow-lg shadow-design-primaryPurple/20"
                          : "text-design-primaryGrey hover:bg-design-primaryPurple/10 hover:text-design-primaryPurple"
                      }`
                    }
                  >
                    <Icon className="h-[18px] w-[18px] flex-shrink-0" />
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="ml-3 font-medium overflow-hidden whitespace-nowrap text-sm"
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </NavLink>
                </Tooltip>
              );
            })}

            {/* Boards Section */}
            <div className="mt-6">
              <Tooltip
                text={!isExpanded ? "Boards" : undefined}
                position="right"
              >
                <button
                  onClick={() => {
                    isExpanded
                      ? setIsBoardsOpen(!isBoardsOpen)
                      : handleBoardClickNoSidebar();
                  }}
                  className="flex items-center justify-between w-full px-3 py-2.5 text-design-primaryGrey hover:bg-design-primaryPurple/10 hover:text-design-primaryPurple rounded-xl transition-all duration-300"
                >
                  <div className="flex items-center">
                    <SquareKanban className="h-[18px] w-[18px] flex-shrink-0" />
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="ml-3 font-medium text-sm"
                        >
                          Boards
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                  {isExpanded && (
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-300 ${
                        isBoardsOpen ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>
              </Tooltip>

              {/* Boards Content */}
              <AnimatePresence>
                {isBoardsOpen && isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="mt-2 space-y-4"
                  >
                    {/* Existing BoardSection components remain unchanged */}
                    <BoardSection
                      title="My Boards"
                      boards={myBoardsFiltered}
                      searchValue={myBoardsSearch}
                      onSearchChange={setMyBoardsSearch}
                      icon={UserSquare2}
                    />
                    <BoardSection
                      title="Shared Boards"
                      boards={sharedBoardsFiltered}
                      searchValue={sharedBoardsSearch}
                      onSearchChange={setSharedBoardsSearch}
                      icon={Users}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>
          {/* User Profile Section */}
          <div className="p-3 mt-auto space-y-2">
            {/* Settings Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsSettingsOpen(true)}
              className={`flex items-center ${
                isExpanded ? "justify-start" : "justify-center"
              } gap-3 w-full p-2 rounded-xl hover:bg-design-primaryPurple/10 text-design-primaryGrey hover:text-design-primaryPurple transition-colors`}
            >
              <Settings className="h-[18px] w-[18px]" />
              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="text-sm font-medium"
                  >
                    Settings
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
            <motion.div
              className={`flex items-center ${
                isExpanded ? "justify-start" : "justify-center"
              } gap-3 p-2 rounded-xl bg-design-greyBG/50 backdrop-blur-sm`}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-8 h-8 rounded-lg bg-design-primaryPurple/20 flex items-center justify-center flex-shrink-0">
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    className="w-8 h-8 rounded-lg object-cover"
                    alt="User Avatar"
                  />
                ) : (
                  <span className="text-design-primaryPurple font-medium">
                    {currentUser.firstName.slice(0, 1)}
                  </span>
                )}
              </div>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex-1 overflow-hidden"
                  >
                    <p className="text-sm font-medium text-design-primaryGrey truncate">
                      {currentUser.firstName}
                    </p>
                    <p className="text-xs text-design-primaryGrey/60 truncate">
                      {currentUser.email}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        user={currentUser}
      />
    </>
  );
}
