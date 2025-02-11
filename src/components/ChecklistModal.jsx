// import React, { useState } from 'react';
// import { X, Plus, CheckSquare, Square } from 'lucide-react';

// export default function ChecklistModal({ isOpen, onClose, checklist, onUpdate }) {
//   const [newItemText, setNewItemText] = useState('');

//   if (!isOpen) return null;

//   const handleAddItem = () => {
//     if (newItemText.trim()) {
//       onUpdate([
//         ...checklist,
//         {
//           id: Date.now().toString(),
//           text: newItemText.trim(),
//           checked: false
//         }
//       ]);
//       setNewItemText('');
//     }
//   };

//   const handleToggleItem = (itemId) => {
//     onUpdate(
//       checklist.map(item =>
//         item.id === itemId
//           ? { ...item, checked: !item.checked }
//           : item
//       )
//     );
//   };

//   const handleDeleteItem = (itemId) => {
//     onUpdate(checklist.filter(item => item.id !== itemId));
//   };

//   const completedCount = checklist.filter(item => item.checked).length;

//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto">
//       <div className="flex items-center justify-center min-h-screen px-4">
//         <div className="fixed inset-0 bg-black opacity-30" onClick={onClose}></div>
        
//         <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full">
//           <div className="p-6">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-medium">
//                 Checklist ({completedCount}/{checklist.length})
//               </h3>
//               <button
//                 onClick={onClose}
//                 className="text-gray-400 hover:text-gray-500"
//               >
//                 <X className="h-5 w-5" />
//               </button>
//             </div>

//             <div className="space-y-4">
//               {checklist.map(item => (
//                 <div key={item.id} className="flex items-center group">
//                   <button
//                     onClick={() => handleToggleItem(item.id)}
//                     className="flex-shrink-0 mr-2 text-gray-400 hover:text-indigo-600"
//                   >
//                     {item.checked ? (
//                       <CheckSquare className="h-5 w-5 text-indigo-600" />
//                     ) : (
//                       <Square className="h-5 w-5" />
//                     )}
//                   </button>
//                   <span className={`flex-grow ${item.checked ? 'line-through text-gray-400' : 'text-gray-700'}`}>
//                     {item.text}
//                   </span>
//                   <button
//                     onClick={() => handleDeleteItem(item.id)}
//                     className="flex-shrink-0 ml-2 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100"
//                   >
//                     <X className="h-4 w-4" />
//                   </button>
//                 </div>
//               ))}

//               <div className="flex items-center mt-4">
//                 <input
//                   type="text"
//                   value={newItemText}
//                   onChange={(e) => setNewItemText(e.target.value)}
//                   placeholder="Add new item..."
//                   className="flex-grow px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   onKeyDown={(e) => {
//                     if (e.key === 'Enter') {
//                       handleAddItem();
//                     }
//                   }}
//                 />
//                 <button
//                   onClick={handleAddItem}
//                   className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 >
//                   <Plus className="h-5 w-5" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client"

import { useState, Fragment } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { X, Plus, CheckSquare, Square } from "lucide-react"

export default function ChecklistModal({ isOpen, onClose, checklist, onUpdate }) {
  const [newItemText, setNewItemText] = useState("")

  const handleAddItem = () => {
    if (newItemText.trim()) {
      onUpdate([
        ...checklist,
        {
          id: Date.now().toString(),
          text: newItemText.trim(),
          checked: false,
        },
      ])
      setNewItemText("")
    }
  }

  const handleToggleItem = (itemId) => {
    onUpdate(checklist.map((item) => (item.id === itemId ? { ...item, checked: !item.checked } : item)))
  }

  const handleDeleteItem = (itemId) => {
    onUpdate(checklist.filter((item) => item.id !== itemId))
  }

  const completedCount = checklist.filter((item) => item.checked).length

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all border border-gray-100">
                <Dialog.Title
                  as="h3"
                  className="text-xl font-semibold text-gray-900 flex justify-between items-center mb-6"
                >
                  <span>
                    Checklist ({completedCount}/{checklist.length})
                  </span>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                    <X className="h-5 w-5" />
                  </button>
                </Dialog.Title>

                <div className="space-y-4">
                  {checklist.map((item) => (
                    <div key={item.id} className="flex items-center group hover:bg-primary-light/30 p-2 rounded-lg transition-all">
                      <button
                        onClick={() => handleToggleItem(item.id)}
                        className="flex-shrink-0 mr-3 text-gray-400 hover:text-primary transition-colors"
                      >
                        {item.checked ? (
                          <CheckSquare className="h-5 w-5 text-primary" />
                        ) : (
                          <Square className="h-5 w-5" />
                        )}
                      </button>
                      <span className={`flex-grow ${item.checked ? "line-through text-gray-400" : "text-gray-700"}`}>
                        {item.text}
                      </span>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="flex-shrink-0 ml-2 text-gray-400 hover:text-semantic-error opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={newItemText}
                      onChange={(e) => setNewItemText(e.target.value)}
                      placeholder="Add new item..."
                      className="flex-grow px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAddItem()
                        }
                      }}
                    />
                    <button
                      onClick={handleAddItem}
                      className="px-4 py-2 bg-primary text-white rounded-r-lg hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary transition-all hover:scale-105"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}


