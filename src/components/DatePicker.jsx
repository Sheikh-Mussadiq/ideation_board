// "use client";

import { useState } from "react";
import {
  CalendarIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
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
  parseISO,
} from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import Translate from "./Translate"; // Import Translate component

export default function DatePicker({ value, onChange, className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(
    value ? parseISO(value) : new Date()
  );

  const formattedDate = value
    ? format(parseISO(value), "MMM d, yyyy")
    : <Translate>Set due date</Translate>;

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const handleDateSelect = (date) => {
    onChange(format(date, "yyyy-MM-dd"));
    setIsOpen(false);
  };

  const quickSelectOptions = [
    { label: <Translate>Today</Translate>, date: new Date() },
    { label: <Translate>Next month</Translate>, date: addMonths(new Date(), 1) },
    { label: <Translate>In 2 months</Translate>, date: addMonths(new Date(), 2) },
  ];

  const clearDate = () => {
    onChange(null);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center text-base text-design-black border-none transition-all  "
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {formattedDate}
        <ChevronDown
          className={`h-4 w-4 ml-2 text-gray-400 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 z-10 mt-2 p-4 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 w-72"
          >
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={prevMonth}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <h2 className="text-lg font-semibold text-gray-700">
                <Translate>{format(currentMonth, "MMMM yyyy")}</Translate>
              </h2>
              <button
                onClick={nextMonth}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-4">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-gray-400"
                >
                  <Translate>{day}</Translate>
                </div>
              ))}
              {days.map((day, dayIdx) => (
                <motion.button
                  key={day.toString()}
                  onClick={() => handleDateSelect(day)}
                  className={`
                    p-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-design-primaryPurple
                    ${
                      !isSameMonth(day, currentMonth)
                        ? "text-gray-300"
                        : isSameDay(day, parseISO(value || ""))
                        ? "bg-design-primaryPurple text-white"
                        : isToday(day)
                        ? "bg-design-primaryPurple/20 text-design-primaryPurple"
                        : "text-gray-700 hover:bg-gray-100"
                    }
                  `}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {format(day, "d")}
                </motion.button>
              ))}
            </div>
            <div className="space-y-2">
              {quickSelectOptions.map((option) => (
                <motion.button
                  key={option.label}
                  onClick={() => handleDateSelect(option.date)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {option.label}
                </motion.button>
              ))}
              <motion.button
                onClick={clearDate}
                className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-md transition-colors flex items-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <X className="h-4 w-4 mr-2" />
                <Translate>Clear date</Translate>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
