import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

const priorityColors = {
  high: "semantic-error",
  medium: "semantic-warning",
  low: "semantic-success",
};

const CalendarDay = ({ date, tasks, currentMonth, onTaskClick }) => {
  const isCurrentMonth = isSameMonth(date, currentMonth);
  const isCurrentDate = isToday(date);
  const dayTasks = tasks.filter((task) => task.due_date && isSameDay(new Date(task.due_date), date));
  const hasTask = dayTasks.length > 0;

  return (
    <motion.div
      whileHover={hasTask ? { scale: 1.05 } : {}}
      className={`
        relative p-2 min-h-[60px] rounded-lg transition-all duration-300 group
        ${!isCurrentMonth ? "opacity-30" : ""}
        ${isCurrentDate ? "ring-2 ring-design-primaryPurple ring-offset-2" : ""}
        ${hasTask ? "bg-design-lightPurpleButtonFill cursor-pointer" : "hover:bg-design-greyBG/50"}
      `}
    >
      <span className={`
        text-sm font-medium block mb-1
        ${isCurrentDate ? "text-design-primaryPurple" : "text-design-primaryGrey"}
      `}>
        {format(date, "d")}
      </span>

      {/* Task Indicators */}
      {hasTask && (
        <div className="flex gap-1 flex-wrap">
          {dayTasks.slice(0, 2).map((task) => (
            <div
              key={task.id}
              className={`w-2 h-2 rounded-full bg-${priorityColors[task.priority]}`}
            />
          ))}
          {dayTasks.length > 2 && (
            <div className="w-2 h-2 rounded-full bg-design-primaryGrey text-[8px] flex items-center justify-center">
              +{dayTasks.length - 2}
            </div>
          )}
        </div>
      )}

      {/* Task Preview Popup */}
      {hasTask && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-2 w-48 z-20 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg shadow-lg border border-design-greyOutlines p-2"
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
                      <p className={`text-xs text-${priorityColors[task.priority]}`}>
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

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const handleMonthChange = async (direction) => {
    setIsLoading(true);
    const newMonth = direction === 'next' 
      ? addMonths(currentMonth, 1)
      : subMonths(currentMonth, 1);
    setCurrentMonth(newMonth);
    setIsLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-design-greyOutlines">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-design-primaryPurple" />
          <h2 className="text-lg font-semibold text-design-black">
            Task Calendar
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleMonthChange('prev')}
            className="p-1 rounded-lg hover:bg-design-greyBG transition-colors"
            disabled={isLoading}
          >
            <ChevronLeft className="h-5 w-5 text-design-primaryGrey" />
          </motion.button>
          <span className="text-sm font-medium text-design-black min-w-[100px] text-center">
            {format(currentMonth, "MMMM yyyy")}
          </span>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleMonthChange('next')}
            className="p-1 rounded-lg hover:bg-design-greyBG transition-colors"
            disabled={isLoading}
          >
            <ChevronRight className="h-5 w-5 text-design-primaryGrey" />
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-design-primaryGrey p-2"
          >
            {day}
          </div>
        ))}
        {days.map((date) => (
          <CalendarDay
            key={date.toISOString()}
            date={date}
            tasks={tasks}
            currentMonth={currentMonth}
            onTaskClick={onTaskClick}
          />
        ))}
      </div>
    </div>
  );
}