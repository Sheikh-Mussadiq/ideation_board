// import React from 'react';
// import { Calendar } from 'lucide-react';
// import { format } from 'date-fns';

// export default function DatePicker({ value, onChange }) {
//   const [isOpen, setIsOpen] = React.useState(false);

//   return (
//     <div className="relative">
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="btn-ghost text-sm rounded-full"
//       >
//         <Calendar className="h-4 w-4 mr-1" />
//         {format(new Date(value), 'MMM d')}
//       </button>

//       {isOpen && (
//         <div className="absolute z-10 mt-1 rounded-md shadow-lg bg-white ring-1 ring-primary ring-opacity-10">
//           <input
//             type="date"
//             value={value.split('T')[0]}
//             onChange={(e) => {
//               onChange(e.target.value);
//               setIsOpen(false);
//             }}
//             className="input p-2 border-none focus:ring-2 focus:ring-primary"
//           />
//         </div>
//       )}
//     </div>
//   );
// }

import React from "react";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

export default function DatePicker({ value, onChange, className = "" }) {
  const [isOpen, setIsOpen] = React.useState(false);

  const formattedDate = value
    ? format(new Date(value), "MMM d, yyyy")
    : "Set due date";

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 text-sm text-design-primaryGrey hover:text-button-primary-cta bg-button-tertiary-fill hover:bg-button-tertiary-fill/70 rounded-full transition-all shadow-sm hover:shadow-md border border-button-primary-cta/10 hover:border-button-primary-cta/30 dark:bg-button-tertiary-fill/10 dark:hover:bg-button-tertiary-fill/20"
      >
        <Calendar className="h-4 w-4 mr-2" />
        {formattedDate}
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 rounded-xl shadow-lg bg-white ring-1 ring-button-primary-cta/20 dark:bg-design-black dark:border dark:border-design-greyOutlines/20 animate-in slide-in-from-top-2 p-2">
          <input
            type="date"
            value={value ? value.split("T")[0] : ""}
            onChange={(e) => {
              onChange(e.target.value);
              setIsOpen(false);
            }}
            className="p-3 rounded-lg border-none focus:ring-2 focus:ring-button-primary-cta bg-button-tertiary-fill/10 hover:bg-button-tertiary-fill/20 transition-colors dark:bg-design-black dark:text-design-white"
          />
        </div>
      )}
    </div>
  );
}
