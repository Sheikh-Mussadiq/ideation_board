import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, isToday, isTomorrow } from "date-fns";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  CheckCircle2,
  Circle,
  ArrowRight,
  AlertCircle,
  Clock,
} from "lucide-react";
import Translate from "./Translate"; // Import Translate component

const priorityConfig = {
  high: {
    color: "text-semantic-error",
    bg: "bg-semantic-error-light",
    icon: AlertCircle,
  },
  medium: {
    color: "text-semantic-warning",
    bg: "bg-semantic-warning-light",
    icon: Clock,
  },
  low: {
    color: "text-semantic-success",
    bg: "bg-semantic-success-light",
    icon: CheckCircle2,
  },
};

const TaskCard = ({ task }) => {
  const navigate = useNavigate();
  const PriorityIcon = priorityConfig[task.priority]?.icon || Clock;

  const formatDueDate = (date) => {
    if (!date) return null;
    const dueDate = new Date(date);
    if (isToday(dueDate)) return "Today";
    if (isTomorrow(dueDate)) return "Tomorrow";
    return format(dueDate, "MMM dd");
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      onClick={() => navigate(`/ideation/${task.boardId}`)}
      className="bg-white rounded-xl border border-design-greyOutlines p-3.5 hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex items-start gap-4">
        {/* Status Toggle */}
        <motion.button
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          className="mt-1"
        >
          {task.completed ? (
            <CheckCircle2 className="h-5 w-5 text-semantic-success" />
          ) : (
            <Circle className="h-5 w-5 text-design-primaryGrey group-hover:text-design-primaryPurple" />
          )}
        </motion.button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <h3
              className={`font-medium text-design-black truncate ${
                task.completed ? "line-through text-design-primaryGrey" : ""
              }`}
            >
              <Translate>{task.title}</Translate>
            </h3>
            <ArrowRight className="h-5 w-5 text-design-primaryGrey opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Task Details */}
          <div className="mt-2 flex items-center gap-3 flex-wrap">
            {/* Priority Badge */}
            <span
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                priorityConfig[task.priority]?.color
              } ${priorityConfig[task.priority]?.bg}`}
            >
              <PriorityIcon className="h-3 w-3" />
              <Translate>{task.priority}</Translate>
            </span>

            {/* Due Date */}
            {task.due_date && (
              <span className="inline-flex items-center gap-1 text-xs text-design-primaryGrey">
                <Calendar className="h-3 w-3" />
                <Translate>{formatDueDate(task.due_date)}</Translate>
              </span>
            )}

            {/* Labels */}
            {task.labels && task.labels.length > 0 && (
              <div className="flex items-center gap-1">
                {task.labels.slice(0, 2).map((label, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 rounded-full text-xs bg-design-lightPurpleButtonFill text-design-primaryPurple"
                  >
                    <Translate>{label.text}</Translate>
                  </span>
                ))}
                {task.labels.length > 2 && (
                  <span className="text-xs text-design-primaryGrey">
                    <Translate>+{task.labels.length - 2}</Translate>
                  </span>
                )}
              </div>
            )}

            {/* Board Name */}
            <span className="text-xs text-design-primaryGrey ml-auto">
              <Translate>{task.boardTitle}</Translate>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function TaskList({ tasks, onStatusChange }) {
  // Sort tasks by due date and priority
  const sortedTasks = [...tasks].sort((a, b) => {
    // First sort by due date
    if (a.due_date && b.due_date) {
      return new Date(a.due_date) - new Date(b.due_date);
    }
    if (a.due_date) return -1;
    if (b.due_date) return 1;

    // Then by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  // Only take the first 5 tasks
  const displayedTasks = sortedTasks.slice(0, 5);

  return (
    <div className="bg-white p-6 rounded-2xl border border-design-greyOutlines h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-design-black">
          <Translate>My Tasks</Translate>
        </h2>
        <span className="text-sm text-design-primaryGrey">
          <Translate>Showing {Math.min(5, sortedTasks.length)} of {sortedTasks.length} tasks</Translate>
        </span>
      </div>

      <div className="lg:flex-1 lg:overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {sortedTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8 text-design-primaryGrey"
            >
              <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-design-primaryPurple opacity-50" />
              <p className="text-sm">
                <Translate>No tasks assigned to you</Translate>
              </p>
            </motion.div>
          ) : (
            <div className="space-y-3 lg:pr-2">
              {displayedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStatusChange={onStatusChange}
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
