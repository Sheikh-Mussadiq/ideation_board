// "use client";

// import { useState } from "react";
// import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
// import {
//   format,
//   addMonths,
//   subMonths,
//   startOfMonth,
//   endOfMonth,
//   eachDayOfInterval,
//   isSameMonth,
//   isSameDay,
//   isToday,
// } from "date-fns";
// import { motion, AnimatePresence } from "framer-motion";

// export default function DatePicker({ value, onChange, className = "" }) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [currentMonth, setCurrentMonth] = useState(
//     value ? new Date(value) : new Date()
//   );

//   const formattedDate = value
//     ? format(new Date(value), "MMM d, yyyy")
//     : "Set due date";

//   const days = eachDayOfInterval({
//     start: startOfMonth(currentMonth),
//     end: endOfMonth(currentMonth),
//   });

//   const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
//   const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

//   const handleDateSelect = (date) => {
//     onChange(format(date, "yyyy-MM-dd"));
//     setIsOpen(false);
//   };

//   return (
//     <div className={`relative ${className}`}>
//       <motion.button
//         onClick={() => setIsOpen(!isOpen)}
//         className="inline-flex items-center px-4 py-2 text-sm text-gray-700 bg-white rounded-full transition-all shadow-sm hover:shadow-md border border-gray-200 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//         whileHover={{ scale: 1.02 }}
//         whileTap={{ scale: 0.98 }}
//       >
//         <motion.div
//           initial={{ rotate: 0 }}
//           animate={{ rotate: isOpen ? 180 : 0 }}
//           transition={{ duration: 0.3 }}
//         >
//           <CalendarIcon className="h-4 w-4 mr-2 text-blue-500" />
//         </motion.div>
//         {formattedDate}
//         <motion.div
//           initial={{ rotate: 0 }}
//           animate={{ rotate: isOpen ? 180 : 0 }}
//           transition={{ duration: 0.3 }}
//         >
//           <ChevronLeft className="h-4 w-4 ml-2 text-gray-400" />
//         </motion.div>
//       </motion.button>

//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -10 }}
//             transition={{ duration: 0.2 }}
//             className="absolute z-10 mt-2 p-4 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5"
//           >
//             <div className="flex justify-between items-center mb-4">
//               <button
//                 onClick={prevMonth}
//                 className="p-1 rounded-full hover:bg-gray-100"
//               >
//                 <ChevronLeft className="h-5 w-5 text-gray-600" />
//               </button>
//               <h2 className="text-lg font-semibold text-gray-700">
//                 {format(currentMonth, "MMMM yyyy")}
//               </h2>
//               <button
//                 onClick={nextMonth}
//                 className="p-1 rounded-full hover:bg-gray-100"
//               >
//                 <ChevronRight className="h-5 w-5 text-gray-600" />
//               </button>
//             </div>
//             <div className="grid grid-cols-7 gap-1">
//               {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
//                 <div
//                   key={day}
//                   className="text-center text-sm font-medium text-gray-400"
//                 >
//                   {day}
//                 </div>
//               ))}
//               {days.map((day, dayIdx) => (
//                 <motion.button
//                   key={day.toString()}
//                   onClick={() => handleDateSelect(day)}
//                   className={`
//                     p-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500
//                     ${
//                       !isSameMonth(day, currentMonth)
//                         ? "text-gray-300"
//                         : isSameDay(day, new Date(value))
//                         ? "bg-blue-500 text-white"
//                         : isToday(day)
//                         ? "bg-blue-100 text-blue-600"
//                         : "text-gray-700 hover:bg-gray-100"
//                     }
//                   `}
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   {format(day, "d")}
//                 </motion.button>
//               ))}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

"use client";

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

export default function DatePicker({ value, onChange, className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(
    value ? parseISO(value) : new Date()
  );

  const formattedDate = value
    ? format(parseISO(value), "MMM d, yyyy")
    : "Set due date";

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
    { label: "Today", date: new Date() },
    { label: "Next month", date: addMonths(new Date(), 1) },
    { label: "In 2 months", date: addMonths(new Date(), 2) },
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
                {format(currentMonth, "MMMM yyyy")}
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
                  {day}
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
                Clear date
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
