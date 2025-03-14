import React, { useEffect, useState } from "react";
import { useBoards } from "../context/BoardContext";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  ClipboardList,
  Users,
  Layers,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import { format, isSameDay } from "date-fns";
import { useNavigate } from "react-router-dom";
import Calendar from "../components/Calendar";
import TaskList from "../components/TaskList";
import { Sun, Moon, Sunrise, Sunset } from "lucide-react";

const StatCard = ({ icon: Icon, title, value, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`relative overflow-hidden bg-white p-6 rounded-2xl border border-design-greyOutlines shadow-sm transition-all`}
  >
    {/* Gradient overlay */}
    <div
      className={`absolute inset-0 opacity-15 ${
        {
          total: "bg-gradient-to-r from-blue-600 via-sky-400 to-cyan-500",
          completed:
            "bg-gradient-to-r from-green-500 via-emerald-400 to-teal-500",
          tasks:
            "bg-gradient-to-r from-violet-600 via-purple-500 to-fuchsia-500",
        }[color]
      }`}
    />

    <div className="relative flex items-center gap-4">
      <div
        className={`p-3 rounded-xl ${
          {
            total: "bg-blue-600/10",
            completed: "bg-green-500/10",
            tasks: "bg-violet-600/10",
          }[color]
        }`}
      >
        <Icon
          className={`h-6 w-6 ${
            {
              total: "text-blue-600",
              completed: "text-green-500",
              tasks: "text-violet-600",
            }[color]
          }`}
        />
      </div>
      <div>
        <h3 className="text-sm font-medium text-design-primaryGrey">{title}</h3>
        <p className="text-2xl font-bold text-design-black mt-1">{value}</p>
      </div>
    </div>
  </motion.div>
);

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    return format(new Date(dateString), "MMM dd, yyyy");
  } catch (error) {
    return "Invalid date";
  }
};

// Update the BoardTable component
const BoardTable = ({ boards, teams, onBoardClick }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="border-b border-design-greyOutlines">
          <th className="text-left p-3 text-sm font-medium text-design-primaryGrey">
            Board Name
          </th>
          <th className="text-left p-3 text-sm font-medium text-design-primaryGrey">
            Team
          </th>
          <th className="text-left p-3 text-sm font-medium text-design-primaryGrey">
            Total Cards
          </th>
          <th className="text-left p-3 text-sm font-medium text-design-primaryGrey">
            Completed
          </th>
          <th className="text-left p-3 text-sm font-medium text-design-primaryGrey">
            Created At
          </th>
          <th className="text-left p-3 text-sm font-medium text-design-primaryGrey">
            Last Updated
          </th>
          <th className="text-left p-3 text-sm font-medium text-design-primaryGrey"></th>
        </tr>
      </thead>
      <tbody>
        {boards.map((board) => {
          const team = teams.find((team) => team._id === board.team_id);
          const totalCards = board.columns?.reduce(
            (acc, col) => acc + (col.cards?.length || 0),
            0
          );
          const completedCards = board.columns?.reduce(
            (acc, col) =>
              acc + (col.cards?.filter((card) => card.completed)?.length || 0),
            0
          );

          return (
            <motion.tr
              key={board.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ backgroundColor: "rgba(124, 58, 237, 0.05)" }}
              onClick={() => onBoardClick(board.id)}
              className="border-b border-design-greyOutlines cursor-pointer"
            >
              <td className="p-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-design-lightPurpleButtonFill">
                    <Layers className="h-5 w-5 text-design-primaryPurple" />
                  </div>
                  <span className="font-medium text-design-black">
                    {board.title}
                  </span>
                </div>
              </td>
              <td className="p-3">
                <span className="text-sm text-design-primaryGrey flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {team?.name || "Personal"}
                </span>
              </td>
              <td className="p-3">
                <span className="text-sm text-design-primaryGrey">
                  {totalCards}
                </span>
              </td>
              <td className="p-3">
                <span className="text-sm text-design-primaryGrey">
                  {completedCards}/{totalCards}
                </span>
              </td>
              <td className="p-3">
                <span className="text-sm text-design-primaryGrey">
                  {formatDate(board.created_at)}
                </span>
              </td>
              <td className="p-3">
                <span className="text-sm text-design-primaryGrey">
                  {formatDate(board.updated_at)}
                </span>
              </td>
              <td className="p-3 text-right">
                <ArrowRight className="h-5 w-5 text-design-primaryGrey inline-block" />
              </td>
            </motion.tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

const BoardDropdown = ({ boards, selectedBoard, onBoardSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-design-greyOutlines hover:border-design-primaryPurple/30 transition-all"
      >
        <Layers className="h-5 w-5 text-design-primaryPurple" />
        <span className="font-medium text-design-black">
          {selectedBoard ? selectedBoard.title : "All Boards"}
        </span>
        <ChevronDown className="h-4 w-4 text-design-primaryGrey" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl border border-design-greyOutlines shadow-lg z-50">
          <div className="p-2">
            <div
              className="p-2 rounded-lg cursor-pointer hover:bg-design-lightPurpleButtonFill"
              onClick={() => {
                onBoardSelect(null);
                setIsOpen(false);
              }}
            >
              All Boards
            </div>
            {boards.map((board) => (
              <div
                key={board.id}
                className="p-2 rounded-lg cursor-pointer hover:bg-design-lightPurpleButtonFill"
                onClick={() => {
                  onBoardSelect(board);
                  setIsOpen(false);
                }}
              >
                {board.title}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function HomePage() {
  const { boardsList, loadInitialBoards, isLoading, updateCard } = useBoards();
  const { currentUser, currentUserTeams } = useAuth();
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    myTasks: [],
  });
  const [calendarDays, setCalendarDays] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading || boardsList.length === 0) {
      loadInitialBoards();
    }
  }, []);

  useEffect(() => {
    let totalTasks = 0;
    let completedTasks = 0;
    let myTasks = [];

    const boardsToProcess = selectedBoard ? [selectedBoard] : boardsList;

    boardsToProcess.forEach((board) => {
      board.columns?.forEach((column) => {
        column.cards?.forEach((card) => {
          totalTasks++;
          if (card.completed) completedTasks++;
          if (
            card.assignee?.some(
              (assignee) => assignee._id === currentUser.userId
            )
          ) {
            // Add both board ID and board title to the task
            myTasks.push({
              ...card,
              boardId: board.id,
              boardTitle: board.title,
            });
          }
        });
      });
    });

    setStats({ totalTasks, completedTasks, myTasks });
  }, [boardsList, currentUser, selectedBoard]);

  const handleBoardClick = (boardId) => {
    navigate(`/ideation/${boardId}`);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return {
        text: "Good Morning",
        icon: Sunrise,
        className: "text-amber-500",
      };
    } else if (hour >= 12 && hour < 17) {
      return {
        text: "Good Afternoon",
        icon: Sun,
        className: "text-yellow-500",
      };
    } else if (hour >= 17 && hour < 20) {
      return {
        text: "Good Evening",
        icon: Sunset,
        className: "text-orange-500",
      };
    } else {
      return {
        text: "Good Night",
        icon: Moon,
        className: "text-indigo-500",
      };
    }
  };

  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  if (isLoading) {
    return (
      <div className="p-8 space-y-8 animate-in fade-in-50">
        {/* Header Shimmer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            <div className="h-9 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          </div>
          <div className="h-10 w-40 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
        </div>

        {/* Stats Cards Shimmer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl border border-gray-100 animate-pulse"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gray-200 dark:bg-gray-700"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-7 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Calendar and Tasks Grid Shimmer */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calendar Shimmer */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {[...Array(35)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 rounded-lg bg-gray-100 dark:bg-gray-800 p-2"
                >
                  <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Tasks List Shimmer */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100">
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800"
                >
                  <div className="h-4 w-4 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-3 w-1/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Boards Table Shimmer */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 border-b border-gray-100"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                  <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 animate-in fade-in-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GreetingIcon className={`h-8 w-8 ${greeting.className}`} />
          <h1 className="text-3xl font-bold text-design-black">
            {greeting.text}, {currentUser.firstName}
          </h1>
        </div>
        <BoardDropdown
          boards={boardsList}
          selectedBoard={selectedBoard}
          onBoardSelect={setSelectedBoard}
        />
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={ClipboardList}
          title="Total Tasks"
          value={stats.totalTasks}
          color="total"
        />
        <StatCard
          icon={CheckCircle2}
          title="Completed Tasks"
          value={stats.completedTasks}
          color="completed"
        />
        <StatCard
          icon={Layers}
          title="My Tasks"
          value={stats.myTasks.length}
          color="tasks"
        />
      </div>

      {/* Calendar and Tasks Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Calendar
          tasks={stats.myTasks}
          onTaskClick={(task) => {
            if (task.boardId) {
              navigate(`/ideation/${task.boardId}`);
            }
          }}
        />
        <TaskList tasks={stats.myTasks} />
      </div>

      {/* Full Width Boards Section */}
      {!selectedBoard && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl border border-design-greyOutlines w-full"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-design-primaryPurple" />
              <h2 className="text-lg font-semibold text-design-black">
                My Boards
              </h2>
            </div>
            <span className="text-sm text-design-primaryGrey">
              {boardsList.length} {boardsList.length === 1 ? "Board" : "Boards"}
            </span>
          </div>
          <BoardTable
            boards={boardsList}
            teams={currentUserTeams}
            onBoardClick={handleBoardClick}
          />
        </motion.div>
      )}
    </div>
  );
}
