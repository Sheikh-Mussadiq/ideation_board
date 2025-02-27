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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Tooltip from "../Tooltip";
import { useBoards } from "../../context/BoardContext";
import { useAuth } from "../../context/AuthContext";
import { useSidebar } from "../../context/SidebarContext";
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
        <div className="space-y-1 max-h-40 overflow-y-auto scrollbar-hide">
          {boards.length > 0 ? (
            boards.map((board) => (
              <motion.button
                key={board.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="flex items-center w-full px-3 py-1.5 text-sm text-design-primaryGrey hover:bg-design-primaryPurple/10 hover:text-design-primaryPurple rounded-lg transition-all duration-200 ml-3"
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
        className="fixed inset-y-0 left-0 bg-white/80 backdrop-blur-sm border-r border-gray-200 shadow-sm z-50 flex flex-col"
        animate={{
          width: isExpanded ? "16rem" : "4.5rem",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="flex flex-col h-full relative">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="absolute -right-3 top-6 bg-design-black rounded-full p-1.5 border border-design-greyOutlines shadow-sm "
          >
            {isExpanded ? (
              <ChevronLeft className="h-4 w-4 text-design-white" />
            ) : (
              <ChevronRight className="h-4 w-4 text-design-white" />
            )}
          </button>

          <nav className="flex-1 p-4 space-y-2">
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
                      `flex items-center px-3 py-2 rounded-lg transition-all duration-200 group ${
                        isActive
                          ? "bg-design-primaryPurple text-white"
                          : "text-gray-600 hover:bg-design-primaryPurple/10 hover:text-design-primaryPurple"
                      }`
                    }
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          className="ml-3 font-medium overflow-hidden whitespace-nowrap"
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </NavLink>
                </Tooltip>
              );
            })}

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
                  className="flex items-center justify-between w-full px-3 py-2 text-gray-600 hover:bg-design-primaryPurple/10 hover:text-design-primaryPurple rounded-lg transition-all duration-200"
                >
                  <div className="flex items-center">
                    <SquareKanban className="h-5 w-5 flex-shrink-0" />
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          className="ml-3 font-medium overflow-hidden whitespace-nowrap"
                        >
                          Boards
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                  {isExpanded && (
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        isBoardsOpen ? "transform rotate-180" : ""
                      }`}
                    />
                  )}
                </button>
              </Tooltip>

              <AnimatePresence>
                {isBoardsOpen && isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-2 space-y-4"
                  >
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

          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-design-primaryPurple/20 flex items-center justify-center flex-shrink-0">
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    className="w-8 h-8 rounded-full"
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
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="flex-1 overflow-hidden"
                  >
                    <p className="text-sm font-medium text-gray-700 truncate">
                      {currentUser.firstName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {currentUser.email}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
