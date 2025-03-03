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
          total:
            "bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-blue-600 via-sky-400 via-cyan-500 to-transparent",
          completed:
            "bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-green-500 via-emerald-400 via-teal-500 to-transparent",
          tasks:
            "bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-violet-600 via-purple-500 via-fuchsia-500 to-transparent",
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

const BoardCard = ({ board, teamName, totalCards, onClick }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    whileHover={{ scale: 1.02 }}
    className="bg-white p-4 rounded-xl border border-design-greyOutlines hover:border-design-primaryPurple/30 transition-all cursor-pointer"
    onClick={onClick}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-design-lightPurpleButtonFill">
          <Layers className="h-5 w-5 text-design-primaryPurple" />
        </div>
        <div>
          <h3 className="font-medium text-design-black">{board.title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-design-primaryGrey flex items-center gap-1">
              <ClipboardList className="h-3 w-3" />
              {totalCards} cards
            </span>
            {teamName && (
              <span className="text-xs text-design-primaryGrey flex items-center gap-1">
                <Users className="h-3 w-3" />
                {teamName}
              </span>
            )}
          </div>
        </div>
      </div>
      <ArrowRight className="h-5 w-5 text-design-primaryGrey" />
    </div>
  </motion.div>
);

export default function HomePage() {
  const { boardsList, loadInitialBoards, isLoading } = useBoards();
  const { currentUser, currentUserTeams } = useAuth();
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    myTasks: [],
  });
  const [calendarDays, setCalendarDays] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && boardsList.length === 0) {
      loadInitialBoards();
    }
  }, [isLoading, boardsList.length, loadInitialBoards]);

  useEffect(() => {
    // Calculate statistics
    let totalTasks = 0;
    let completedTasks = 0;
    let myTasks = [];

    boardsList.forEach((board) => {
      board.columns?.forEach((column) => {
        column.cards?.forEach((card) => {
          totalTasks++;
          if (card.completed) completedTasks++;
          if (
            card.assignee?.some(
              (assignee) => assignee._id === currentUser.userId
            )
          ) {
            myTasks.push(card);
          }
        });
      });
    });
    setStats({ totalTasks, completedTasks, myTasks });

    // Generate calendar days (current month)
    const today = new Date();
    const daysInMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    ).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) =>
      format(
        new Date(today.getFullYear(), today.getMonth(), i + 1),
        "yyyy-MM-dd"
      )
    );
    setCalendarDays(days);
  }, [boardsList, currentUser]);

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
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl border border-design-greyOutlines animate-pulse"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gray-200 h-12 w-12"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-6 bg-gray-200 rounded w-12"></div>
                </div>
              </div>
            </div>
          ))}
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
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-design-primaryPurple/20 flex items-center justify-center">
            {currentUser.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt="avatar"
                className="h-10 w-10 rounded-xl"
              />
            ) : (
              currentUser.firstName[0]
            )}
          </div>
          <div>
            <p className="font-medium text-design-black">
              {currentUser.firstName} {currentUser.lastName}
            </p>
            <p className="text-sm text-design-primaryGrey">
              {currentUser.email}
            </p>
          </div>
        </div>
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

      {/* Calendar and Boards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calendar */}
        <div className="space-y-8">
          <Calendar
            tasks={stats.myTasks}
            onTaskClick={(task) => navigate(`/ideation/${task.boardId}`)}
          />
        </div>
        <TaskList
          tasks={stats.myTasks.map((task) => ({
            ...task,
            boardTitle:
              boardsList.find((board) =>
                board.columns?.some((col) =>
                  col.cards?.some((card) => card.id === task.id)
                )
              )?.title || "Unknown Board",
          }))}
          onStatusChange={(cardId, completed) => {
            const boardId = boardsList.find((board) =>
              board.columns?.some((col) =>
                col.cards?.some((card) => card.id === cardId)
              )
            )?.id;
            if (boardId) {
              onUpdateCard(cardId, { completed });
            }
          }}
        />

        {/* Boards List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl border border-design-greyOutlines"
        >
          <h2 className="text-lg font-semibold text-design-black mb-4 flex items-center gap-2">
            <Layers className="h-5 w-5 text-design-primaryPurple" />
            My Boards
          </h2>
          <div className="space-y-3">
            {boardsList.map((board) => {
              const team = currentUserTeams.find(
                (team) => team._id === board.team_id
              );
              const totalCards = board.columns?.reduce(
                (acc, col) => acc + (col.cards?.length || 0),
                0
              );

              return (
                <BoardCard
                  key={board.id}
                  board={board}
                  teamName={team?.name}
                  totalCards={totalCards}
                  onClick={() => handleBoardClick(board.id)}
                />
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
