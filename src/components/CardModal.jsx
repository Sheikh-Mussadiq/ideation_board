// "use client";

// import { useState, Fragment, useRef, useEffect } from "react";
// import { Dialog, Transition } from "@headlessui/react";
// import { X, Share2, Archive, Trash2, Edit2, AlignLeft } from "lucide-react";
// import toast from "react-hot-toast";
// import PrioritySelect from "./PrioritySelect";
// import LabelManager from "./LabelManager";
// import AttachmentSection from "./AttachmentSection";
// import CommentSection from "./CommentSection";
// import ChecklistModal from "./ChecklistModal";
// import EditableText from "./EditableText";
// import { updateComment } from "../services/cardService";
// import { useAuth } from "../context/AuthContext";
// export default function CardModal({
//   isOpen,
//   onClose,
//   card,
//   onUpdate,
//   onDelete,
//   onArchive,
// }) {
//   const [showChecklist, setShowChecklist] = useState(false);
//   const [isEditingTitle, setIsEditingTitle] = useState(false);
//   const [localTitle, setLocalTitle] = useState(card.title);
//   const [localDescription, setLocalDescription] = useState(card.description);
//   const titleInputRef = useRef(null);
//   const { currentUser } = useAuth();

//   // Update local state when card props change
//   useEffect(() => {
//     setLocalTitle(card.title);
//     setLocalDescription(card.description);
//   }, [card.title, card.description]);

//   useEffect(() => {
//     if (isEditingTitle && titleInputRef.current) {
//       titleInputRef.current.focus();
//     }
//   }, [isEditingTitle]);

//   const handleClose = () => {
//     onClose();
//     setIsEditingTitle(false);
//   };

//   const handleTitleChange = (e) => {
//     setLocalTitle(e.target.value);
//   };

//   const handleTitleBlur = () => {
//     setIsEditingTitle(false);
//     if (localTitle !== card.title) {
//       onUpdate(card.id, { title: localTitle });
//     }
//   };

//   const handleDescriptionChange = (e) => {
//     setLocalDescription(e.target.value);
//   };

//   const handleDescriptionBlur = () => {
//     if (localDescription !== card.description) {
//       onUpdate(card.id, { description: localDescription });
//     }
//   };

//   return (
//     <Transition appear show={isOpen} as={Fragment}>
//       <Dialog as="div" className="relative z-50" onClose={handleClose}>
//         <Transition.Child
//           as={Fragment}
//           enter="ease-out duration-300"
//           enterFrom="opacity-0"
//           enterTo="opacity-100"
//           leave="ease-in duration-200"
//           leaveFrom="opacity-100"
//           leaveTo="opacity-0"
//         >
//           <div className="fixed inset-0 bg-design-black/25 backdrop-blur-sm" />
//         </Transition.Child>

//         <div className="fixed inset-0 overflow-y-auto">
//           <div className="flex min-h-full items-center justify-center p-4 text-center">
//             <Transition.Child
//               as={Fragment}
//               enter="ease-out duration-300"
//               enterFrom="opacity-0 scale-95"
//               enterTo="opacity-100 scale-100"
//               leave="ease-in duration-200"
//               leaveFrom="opacity-100 scale-100"
//               leaveTo="opacity-0 scale-95"
//             >
//               <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all border border-gray-100">
//                 <div className="absolute top-4 right-4 flex items-center space-x-2">
//                   <button
//                     onClick={() => {
//                       navigator.clipboard.writeText(window.location.href);
//                       toast.success("Link copied to clipboard!");
//                     }}
//                     className="p-2 text-gray-400 hover:text-primary rounded-full hover:bg-primary-light transition-colors"
//                     title="Share"
//                   >
//                     <Share2 className="h-5 w-5" />
//                   </button>
//                   <button
//                     onClick={() => {
//                       onArchive();
//                       onClose();
//                     }}
//                     className="p-2 text-gray-400 hover:text-primary rounded-full hover:bg-primary-light transition-colors"
//                     title="Archive"
//                   >
//                     <Archive className="h-5 w-5" />
//                   </button>
//                   <button
//                     onClick={() => {
//                       onDelete();
//                       onClose();
//                     }}
//                     className="p-2 text-gray-400 hover:text-semantic-error rounded-full hover:bg-semantic-error-light transition-colors"
//                     title="Delete"
//                   >
//                     <Trash2 className="h-5 w-5" />
//                   </button>
//                   <button
//                     onClick={handleClose}
//                     className="p-2 text-gray-400 hover:text-primary rounded-full hover:bg-primary-light transition-colors"
//                   >
//                     <X className="h-5 w-5" />
//                   </button>
//                 </div>

//                 <div className="space-y-6">
//                   {/* Title Section */}
//                   <div className="flex items-center bg-gray-50/50 border border-gray-100 mt-8 p-3 rounded-xl w-1/2">
//                     <AlignLeft className="h-6 w-6 text-primary flex-shrink-0 mr-3" />
//                     <Dialog.Title
//                       as="h3"
//                       className="text-lg font-medium leading-6 text-gray-900 flex-grow mr-2"
//                     >
//                       {isEditingTitle ? (
//                         <input
//                           ref={titleInputRef}
//                           type="text"
//                           value={localTitle}
//                           onChange={handleTitleChange}
//                           onBlur={handleTitleBlur}
//                           className="w-full max-w-full text-xl font-semibold text-gray-900 border-b-2 border-primary focus:ring-0 focus:outline-none bg-primary-light/30 px-3 py-2 rounded-lg transition-all"
//                           placeholder="Card title"
//                         />
//                       ) : (
//                         <span className="text-xl font-semibold text-gray-900 truncate hover:text-primary transition-colors">
//                           {localTitle}
//                         </span>
//                       )}
//                     </Dialog.Title>
//                     <button
//                       onClick={() => setIsEditingTitle(true)}
//                       className="p-2 text-gray-400 hover:text-primary rounded-full hover:bg-primary-light transition-all hover:scale-110 flex-shrink-0"
//                       title="Edit Title"
//                     >
//                       <Edit2 className="h-4 w-4" />
//                     </button>
//                   </div>

//                   {/* Priority & Labels Row */}
//                   <div className="flex items-center justify-between bg-gray-50/50 border border-gray-100 p-4 rounded-xl">
//                     <PrioritySelect
//                       value={card.priority}
//                       onChange={(value) =>
//                         onUpdate(card.id, { priority: value })
//                       }
//                     />
//                     <LabelManager
//                       labels={card.labels}
//                       onUpdate={(labels) => onUpdate(card.id, { labels })}
//                     />
//                   </div>

//                   {/* Description */}
//                   <div className="space-y-2">
//                     <label className="flex text-sm font-medium text-gray-700 mb-3 items-center">
//                       <AlignLeft className="h-4 w-4 mr-2 text-primary" />
//                       Description
//                     </label>
//                     <textarea
//                       value={localDescription}
//                       onChange={handleDescriptionChange}
//                       onBlur={handleDescriptionBlur}
//                       rows={4}
//                       className="w-full rounded-lg border border-gray-100 shadow-sm p-2 focus:border-primary focus:ring-primary resize-none transition-all hover:border-primary dark:bg-design-black/50 dark:border-design-greyOutlines/20"
//                       placeholder="Add a description..."
//                     />
//                   </div>

//                   {/* Checklist */}
//                   <div className="bg-gray-50/50 border border-gray-100 p-4 rounded-xl">
//                     <ChecklistModal
//                       isOpen={showChecklist}
//                       onClose={() => setShowChecklist(false)}
//                       checklist={card.checklist || []}
//                       onUpdate={(checklist) => onUpdate(card.id, { checklist })}
//                     />
//                     {!showChecklist && (
//                       <button
//                         onClick={() => setShowChecklist(true)}
//                         className="inline-flex items-center px-4 py-2 border border-primary/20 rounded-lg shadow-sm text-sm font-medium text-primary bg-white hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all hover:scale-105"
//                       >
//                         Show Checklist
//                       </button>
//                     )}
//                   </div>

//                   {/* Attachments */}
//                   <AttachmentSection
//                     attachments={card.attachments || []}
//                     onAddAttachment={(attachment) =>
//                       onUpdate(card.id, {
//                         attachments: [...(card.attachments || []), attachment],
//                       })
//                     }
//                     onDeleteAttachment={(attachmentId) =>
//                       onUpdate(card.id, {
//                         attachments: (card.attachments || []).filter(
//                           (a) => a.id !== attachmentId
//                         ),
//                       })
//                     }
//                   />

//                   {/* Comments */}
//                   <CommentSection
//                     comments={card.comments || []}
//                     onAddComment={async (text) => {
//                       const newComment = {
//                         id: Date.now().toString(),
//                         text,
//                         author: currentUser.firstName,
//                         account_id: currentUser.accountId,
//                         created_at: new Date().toISOString(),
//                       };
//                       try {
//                         await updateComment("add", card.id, newComment);
//                         // onUpdate(card.id, {
//                         //   comments: [...(card.comments || []), newComment],
//                         // });
//                         console.log(card.comments, "new comment:", newComment);
//                       } catch (error) {
//                         console.error("Error adding comment:", error);
//                       }
//                     }}
//                     onEditComment={async (commentId, text) => {
//                       const updatedComment = {
//                         id: commentId,
//                         text,
//                         account_id: currentUser.accountId,
//                         editedAt: new Date().toISOString(),
//                       };
//                       try {
//                         await updateComment("edit", card.id, updatedComment);
//                         // onUpdate(card.id, {
//                         //   comments: (card.comments || []).map((c) =>
//                         //     c.id === commentId
//                         //       ? { ...c, text, editedAt: updatedComment.editedAt }
//                         //       : c
//                         //   ),
//                         // });
//                       } catch (error) {
//                         console.error("Error editing comment:", error);
//                       }
//                     }}
//                     onDeleteComment={async (comment_ID) => {
//                       try {
//                         await updateComment("delete", card.id, {
//                           commentId: comment_ID,
//                           account_id: currentUser.accountId,
//                         });
//                         // onUpdate(card.id, {
//                         //   comments: (card.comments || []).filter(
//                         //     (c) => c.id !== comment_ID
//                         //   ),
//                         // });
//                       } catch (error) {
//                         console.error("Error deleting comment:", error);
//                       }
//                     }}
//                   />
//                 </div>
//               </Dialog.Panel>
//             </Transition.Child>
//           </div>
//         </div>
//       </Dialog>
//     </Transition>
//   );
// }

"use client";

import React, { useState, Fragment, useRef, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  X,
  Share2,
  Archive,
  Trash2,
  Edit2,
  AlignLeft,
  Calendar,
  CheckSquare
} from "lucide-react";
import toast from "react-hot-toast";
import PrioritySelect from "./PrioritySelect";
import LabelManager from "./LabelManager";
import AttachmentSection from "./AttachmentSection";
import CommentSection from "./CommentSection";
import ChecklistModal from "./ChecklistModal";
import EditableText from "./EditableText";
import DatePicker from "./DatePicker";
import { updateComment } from "../services/cardService";
import { useAuth } from "../context/AuthContext";

export default function CardModal({
  isOpen,
  onClose,
  card,
  onUpdate,
  onDelete,
  onArchive,
}) {
  const [showChecklist, setShowChecklist] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [localTitle, setLocalTitle] = useState(card.title);
  const [localDescription, setLocalDescription] = useState(card.description);
  const titleInputRef = useRef(null);
  const { currentUser } = useAuth();

  // Update local state when card props change
  useEffect(() => {
    setLocalTitle(card.title);
    setLocalDescription(card.description);
  }, [card.title, card.description]);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditingTitle]);

  const handleClose = () => {
    onClose();
    setIsEditingTitle(false);
  };

  const handleTitleChange = (e) => {
    setLocalTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (localTitle !== card.title) {
      onUpdate(card.id, { title: localTitle });
    }
  };

  const handleDescriptionChange = (e) => {
    setLocalDescription(e.target.value);
  };

  const handleDescriptionBlur = () => {
    if (localDescription !== card.description) {
      onUpdate(card.id, { description: localDescription });
    }
  };

  const handleDueDateChange = (date) => {
    onUpdate(card.id, { due_date: date });
  };

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
          <div className="fixed inset-0 bg-design-black/25 backdrop-blur-sm" />
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
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all border border-gray-100">
                <div className="absolute top-4 right-4 flex items-center space-x-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("Link copied to clipboard!");
                    }}
                    className="p-2 text-gray-400 hover:text-primary rounded-full hover:bg-primary-light transition-colors"
                    title="Share"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {
                      onArchive(card.id);
                      onClose();
                    }}
                    className="p-2 text-gray-400 hover:text-primary rounded-full hover:bg-primary-light transition-colors"
                    title="Archive"
                  >
                    <Archive className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {
                      onDelete(card.id);
                      onClose();
                    }}
                    className="p-2 text-gray-400 hover:text-semantic-error rounded-full hover:bg-semantic-error-light transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleClose}
                    className="p-2 text-gray-400 hover:text-primary rounded-full hover:bg-primary-light transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Title Section */}
                  <div className="flex items-center bg-gray-50/50 border border-gray-100 mt-8 p-3 rounded-xl w-1/2">
                    <AlignLeft className="h-6 w-6 text-primary flex-shrink-0 mr-3" />
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900 flex-grow mr-2"
                    >
                      {isEditingTitle ? (
                        <input
                          ref={titleInputRef}
                          type="text"
                          value={localTitle}
                          onChange={handleTitleChange}
                          onBlur={handleTitleBlur}
                          className="w-full max-w-full text-xl font-semibold text-gray-900 border-b-2 border-primary focus:ring-0 focus:outline-none bg-primary-light/30 px-3 py-2 rounded-lg transition-all"
                          placeholder="Card title"
                        />
                      ) : (
                        <span className="text-xl font-semibold text-gray-900 truncate hover:text-primary transition-colors">
                          {localTitle}
                        </span>
                      )}
                    </Dialog.Title>
                    <button
                      onClick={() => setIsEditingTitle(true)}
                      className="p-2 text-gray-400 hover:text-primary rounded-full hover:bg-primary-light transition-all hover:scale-110 flex-shrink-0"
                      title="Edit Title"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Due Date & Priority Row */}
                  <div className="flex items-center justify-between bg-gray-50/50 border border-gray-100 p-4 rounded-xl">
                    <DatePicker
                      value={card.due_date}
                      onChange={handleDueDateChange}
                    />
                    <PrioritySelect
                      value={card.priority}
                      onChange={(value) =>
                        onUpdate(card.id, { priority: value })
                      }
                    />
                  </div>

                  {/* Labels */}
                  <div className="bg-gray-50/50 border border-gray-100 p-4 rounded-xl">
                    <LabelManager
                      labels={card.labels}
                      onUpdate={(labels) => onUpdate(card.id, { labels })}
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="flex text-sm font-medium text-gray-700 mb-3 items-center">
                      <AlignLeft className="h-4 w-4 mr-2 text-primary" />
                      Description
                    </label>
                    <textarea
                      value={localDescription}
                      onChange={handleDescriptionChange}
                      onBlur={handleDescriptionBlur}
                      rows={4}
                      className="w-full rounded-lg border border-gray-100 shadow-sm p-2 focus:border-primary focus:ring-primary resize-none transition-all hover:border-primary dark:bg-design-black/50 dark:border-design-greyOutlines/20"
                      placeholder="Add a description..."
                    />
                  </div>

                  {/* Checklist */}
                  <div className="bg-gray-50/50 border border-gray-100 p-4 rounded-xl">
                    <ChecklistModal
                      isOpen={showChecklist}
                      onClose={() => setShowChecklist(false)}
                      checklist={card.checklist || []}
                      onUpdate={(checklist) => onUpdate(card.id, { checklist })}
                    />
                    {!showChecklist && (
                      <div className="flex items-center justify-between">
                      <button
                        onClick={() => setShowChecklist(true)}
                        className="inline-flex items-center px-4 py-2 border border-primary/20 rounded-lg shadow-sm text-sm font-medium text-primary bg-white hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all hover:scale-105"
                      >
                        Show Checklist
                      </button>
                      {card.checklist && card.checklist.length > 0 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-sm font-medium bg-button-tertiary-fill text-button-primary-cta dark:bg-button-tertiary-fill/20">
                          <CheckSquare className="h-4 w-4 mr-1" />
                          {card.checklist.filter((item) => item.checked).length}/
                          {card.checklist.length}
                        </span>
                      )}
                      </div>
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
                        attachments: (card.attachments || []).filter(
                          (a) => a.id !== attachmentId
                        ),
                      })
                    }
                  />

                  {/* Comments */}
                  <CommentSection
                    comments={card.comments || []}
                    onAddComment={async (text) => {
                      const newComment = {
                        id: Date.now().toString(),
                        text,
                        author: currentUser.firstName,
                        account_id: currentUser.accountId,
                        created_at: new Date().toISOString(),
                      };
                      try {
                        await updateComment("add", card.id, newComment);
                      } catch (error) {
                        console.error("Error adding comment:", error);
                      }
                    }}
                    onEditComment={async (commentId, text) => {
                      const updatedComment = {
                        id: commentId,
                        text,
                        account_id: currentUser.accountId,
                        editedAt: new Date().toISOString(),
                      };
                      try {
                        await updateComment("edit", card.id, updatedComment);
                      } catch (error) {
                        console.error("Error editing comment:", error);
                      }
                    }}
                    onDeleteComment={async (comment_ID) => {
                      try {
                        await updateComment("delete", card.id, {
                          commentId: comment_ID,
                          account_id: currentUser.accountId,
                        });
                      } catch (error) {
                        console.error("Error deleting comment:", error);
                      }
                    }}
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
