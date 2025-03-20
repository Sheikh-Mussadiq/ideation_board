import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  startOfWeek,
  endOfWeek,
  parseISO,
  isWithinInterval,
  getDay,
} from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import Translate from "../components/Translate";

const priorityColors = {
  high: "bg-semantic-error",
  medium: "bg-semantic-warning",
  low: "bg-semantic-success",
};

const CalendarDay = ({ date, tasks, currentMonth, onTaskClick }) => {
  const isCurrentMonth = isSameMonth(date, currentMonth);
  const isCurrentDate = isToday(date);

  // Improve task filtering to handle ISO date strings
  const dayTasks = tasks.filter((task) => {
    if (!task.due_date) return false;
    const taskDate =
      typeof task.due_date === "string"
        ? parseISO(task.due_date)
        : task.due_date;
    return isSameDay(taskDate, date);
  });

  const hasTask = dayTasks.length > 0;

  return (
    <motion.div
      whileHover={hasTask ? { scale: 1.05, zIndex: 10 } : {}}
      className={`
        relative p-1.5 min-h-[45px] lg:min-h-[52px] rounded-lg transition-all duration-300 group
        ${!isCurrentMonth ? "opacity-30" : ""}
        ${isCurrentDate ? "ring-2 ring-design-primaryPurple ring-offset-2" : ""}
        ${
          hasTask
            ? "bg-design-lightPurpleButtonFill cursor-pointer"
            : "hover:bg-design-greyBG/50"
        }
      `}
    >
      <span
        className={`
        text-sm font-medium block mb-1
        ${
          isCurrentDate
            ? "text-design-primaryPurple"
            : "text-design-primaryGrey"
        }
      `}
      >
        {format(date, "d")}
      </span>

      {/* Task Indicators */}
      {hasTask && (
        <div className="flex gap-1 flex-wrap">
          {dayTasks.slice(0, 2).map((task) => (
            <div
              key={task.id}
              className={`w-2 h-2 rounded-full ${
                priorityColors[task.priority]
              }`}
            />
          ))}
          {dayTasks.length > 2 && (
            <div className="w-2 h-2 rounded-full  text-[8px] flex items-center justify-center">
              +{dayTasks.length - 2}
            </div>
          )}
        </div>
      )}

      {/* Task Preview Popup - Updated positioning and z-index */}
      {hasTask && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-2 w-48 z-50 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg shadow-lg border border-design-greyOutlines p-2 relative"
              style={{
                backdropFilter: "blur(8px)",
                backgroundColor: "rgba(255, 255, 255, 0.95)",
              }}
            >
              <div className="space-y-2">
                {dayTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    whileHover={{ x: 5 }}
                    onClick={() => onTaskClick(task)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-design-lightPurpleButtonFill cursor-pointer"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-design-black truncate">
                        {task.title}
                      </p>
                      <p
                        className={`text-xs ${
                          task.priority === "high"
                            ? "text-semantic-error"
                            : task.priority === "medium"
                            ? "text-semantic-warning"
                            : "text-semantic-success"
                        }`}
                      >
                        {task.priority}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-design-primaryPurple flex-shrink-0" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default function Calendar({ tasks, onTaskClick }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  // Get all days for the month view including padding days
  const getDaysInView = (date) => {
    const start = startOfWeek(startOfMonth(date));
    const end = endOfWeek(endOfMonth(date));
    return eachDayOfInterval({ start, end });
  };

  const days = getDaysInView(currentMonth);

  // Get tasks for the visible date range
  const getVisibleTasks = () => {
    return tasks.filter((task) => {
      if (!task.due_date) return false;
      const taskDate =
        typeof task.due_date === "string"
          ? parseISO(task.due_date)
          : task.due_date;
      return isWithinInterval(taskDate, {
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth),
      });
    });
  };

  const visibleTasks = getVisibleTasks();

  const handleMonthChange = async (direction) => {
    setIsLoading(true);
    const newMonth =
      direction === "next"
        ? addMonths(currentMonth, 1)
        : subMonths(currentMonth, 1);
    setCurrentMonth(newMonth);
    setIsLoading(false);
  };

  return (
    <div className="bg-white p-4 lg:p-5 rounded-2xl border border-design-greyOutlines h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-design-primaryPurple" />
          <h2 className="text-lg font-semibold text-design-black">
            <Translate>Task Calendar</Translate>
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleMonthChange("prev")}
            className="p-1 rounded-lg hover:bg-design-greyBG transition-colors"
            disabled={isLoading}
          >
            <ChevronLeft className="h-5 w-5 text-design-primaryGrey" />
          </motion.button>
          <span className="text-sm font-medium text-design-black min-w-[100px] text-center">
            <Translate>{format(currentMonth, "MMMM yyyy")}</Translate>
          </span>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleMonthChange("next")}
            className="p-1 rounded-lg hover:bg-design-greyBG transition-colors"
            disabled={isLoading}
          >
            <ChevronRight className="h-5 w-5 text-design-primaryGrey" />
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 lg:gap-2 flex-1">
        {/* Day headers with better styling */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center text-xs lg:text-sm font-medium text-design-primaryGrey p-1"
          >
            <Translate>{day}</Translate>
          </div>
        ))}

        {/* Calendar days with padding */}
        {days.map((date, index) => (
          <CalendarDay
            key={date.toISOString()}
            date={date}
            tasks={visibleTasks}
            currentMonth={currentMonth}
            onTaskClick={onTaskClick}
          />
        ))}
      </div>
    </div>
  );
}
