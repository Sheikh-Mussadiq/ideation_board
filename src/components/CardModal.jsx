// import React from 'react';
// import { X, Share2, Archive, Trash2 } from 'lucide-react';
// import toast from 'react-hot-toast';
// import PrioritySelect from './PrioritySelect';
// import LabelManager from './LabelManager';
// import AttachmentSection from './AttachmentSection';
// import CommentSection from './CommentSection';
// import ChecklistModal from './ChecklistModal';

// export default function CardModal({ 
//   isOpen, 
//   onClose, 
//   card, 
//   onUpdate, 
//   onDelete, 
//   onArchive 
// }) {
//   const [showChecklist, setShowChecklist] = React.useState(false);

//   if (!isOpen) return null;

//   const handleClose = (e) => {
//     e.stopPropagation();
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto">
//       <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
//         <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleClose}></div>

//         <div className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl mx-auto">
//           <div className="absolute top-4 right-4 flex items-center space-x-2">
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 navigator.clipboard.writeText(window.location.href);
//                 toast.success('Link copied to clipboard!');
//               }}
//               className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
//               title="Share"
//             >
//               <Share2 className="h-5 w-5" />
//             </button>
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onArchive();
//                 onClose();
//               }}
//               className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
//               title="Archive"
//             >
//               <Archive className="h-5 w-5" />
//             </button>
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onDelete();
//                 onClose();
//               }}
//               className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100"
//               title="Delete"
//             >
//               <Trash2 className="h-5 w-5" />
//             </button>
//             <button
//               onClick={handleClose}
//               className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
//             >
//               <X className="h-5 w-5" />
//             </button>
//           </div>

//           <div className="p-6">
//             <div className="space-y-6">
//               {/* Title Section */}
//               <div>
//                 <input
//                   type="text"
//                   value={card.title}
//                   onChange={(e) => onUpdate(card.id, { title: e.target.value })}
//                   className="w-full text-xl font-semibold text-gray-900 border-0 focus:ring-0 focus:outline-none"
//                   placeholder="Card title"
//                 />
//               </div>

//               {/* Priority & Labels Row */}
//               <div className="flex items-center justify-between">
//                 <PrioritySelect
//                   value={card.priority}
//                   onChange={(value) => onUpdate(card.id, { priority: value })}
//                 />
//                 <LabelManager
//                   labels={card.labels}
//                   onUpdate={(labels) => onUpdate(card.id, { labels })}
//                 />
//               </div>

//               {/* Description */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Description
//                 </label>
//                 <textarea
//                   value={card.description}
//                   onChange={(e) => onUpdate(card.id, { description: e.target.value })}
//                   rows={4}
//                   className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
//                   placeholder="Add a description..."
//                 />
//               </div>

//               {/* Checklist */}
//               <div>
//                 <ChecklistModal
//                   isOpen={showChecklist}
//                   onClose={() => setShowChecklist(false)}
//                   checklist={card.checklist || []}
//                   onUpdate={(checklist) => onUpdate(card.id, { checklist })}
//                 />
//                 {!showChecklist && (
//                   <button
//                     onClick={() => setShowChecklist(true)}
//                     className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                   >
//                     Show Checklist
//                   </button>
//                 )}
//               </div>

//               {/* Attachments */}
//               <AttachmentSection
//                 attachments={card.attachments || []}
//                 onAddAttachment={(attachment) => 
//                   onUpdate(card.id, { 
//                     attachments: [...(card.attachments || []), attachment] 
//                   })
//                 }
//                 onDeleteAttachment={(attachmentId) =>
//                   onUpdate(card.id, {
//                     attachments: (card.attachments || []).filter(a => a.id !== attachmentId)
//                   })
//                 }
//               />

//               {/* Comments */}
//               <CommentSection
//                 comments={card.comments || []}
//                 onAddComment={(text) =>
//                   onUpdate(card.id, {
//                     comments: [...(card.comments || []), {
//                       id: Date.now().toString(),
//                       text,
//                       author: 'Current User',
//                       createdAt: new Date().toISOString()
//                     }]
//                   })
//                 }
//                 onEditComment={(commentId, text) =>
//                   onUpdate(card.id, {
//                     comments: (card.comments || []).map(c =>
//                       c.id === commentId
//                         ? { ...c, text, editedAt: new Date().toISOString() }
//                         : c
//                     )
//                   })
//                 }
//                 onDeleteComment={(commentId) =>
//                   onUpdate(card.id, {
//                     comments: (card.comments || []).filter(c => c.id !== commentId)
//                   })
//                 }
//               />
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
import { X, Share2, Archive, Trash2 } from "lucide-react"
import toast from "react-hot-toast"
import PrioritySelect from "./PrioritySelect"
import LabelManager from "./LabelManager"
import AttachmentSection from "./AttachmentSection"
import CommentSection from "./CommentSection"
import ChecklistModal from "./ChecklistModal"

export default function CardModal({ isOpen, onClose, card, onUpdate, onDelete, onArchive }) {
  const [showChecklist, setShowChecklist] = useState(false)

  const handleClose = () => {
    onClose()
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
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
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="absolute top-4 right-4 flex items-center space-x-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href)
                      toast.success("Link copied to clipboard!")
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                    title="Share"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {
                      onArchive()
                      onClose()
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                    title="Archive"
                  >
                    <Archive className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {
                      onDelete()
                      onClose()
                    }}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleClose}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Title Section */}
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => onUpdate(card.id, { title: e.target.value })}
                      className="w-full text-xl font-semibold text-gray-900 border-0 focus:ring-0 focus:outline-none"
                      placeholder="Card title"
                    />
                  </Dialog.Title>

                  {/* Priority & Labels Row */}
                  <div className="flex items-center justify-between">
                    <PrioritySelect
                      value={card.priority}
                      onChange={(value) => onUpdate(card.id, { priority: value })}
                    />
                    <LabelManager labels={card.labels} onUpdate={(labels) => onUpdate(card.id, { labels })} />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={card.description}
                      onChange={(e) => onUpdate(card.id, { description: e.target.value })}
                      rows={4}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Add a description..."
                    />
                  </div>

                  {/* Checklist */}
                  <div>
                    <ChecklistModal
                      isOpen={showChecklist}
                      onClose={() => setShowChecklist(false)}
                      checklist={card.checklist || []}
                      onUpdate={(checklist) => onUpdate(card.id, { checklist })}
                    />
                    {!showChecklist && (
                      <button
                        onClick={() => setShowChecklist(true)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Show Checklist
                      </button>
                    )}
                  </div>

                  {/* Attachments */}
                  <AttachmentSection
                    attachments={card.attachments || []}
                    onAddAttachment={(attachment) =>
                      onUpdate(card.id, {
                        attachments: [...(card.attachments || []), attachment],
                      })
                    }
                    onDeleteAttachment={(attachmentId) =>
                      onUpdate(card.id, {
                        attachments: (card.attachments || []).filter((a) => a.id !== attachmentId),
                      })
                    }
                  />

                  {/* Comments */}
                  <CommentSection
                    comments={card.comments || []}
                    onAddComment={(text) =>
                      onUpdate(card.id, {
                        comments: [
                          ...(card.comments || []),
                          {
                            id: Date.now().toString(),
                            text,
                            author: "Current User",
                            createdAt: new Date().toISOString(),
                          },
                        ],
                      })
                    }
                    onEditComment={(commentId, text) =>
                      onUpdate(card.id, {
                        comments: (card.comments || []).map((c) =>
                          c.id === commentId ? { ...c, text, editedAt: new Date().toISOString() } : c,
                        ),
                      })
                    }
                    onDeleteComment={(commentId) =>
                      onUpdate(card.id, {
                        comments: (card.comments || []).filter((c) => c.id !== commentId),
                      })
                    }
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

