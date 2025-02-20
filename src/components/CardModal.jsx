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
  CheckSquare,
  Tags,
  AlertCircle,
  NotebookText,
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
import { Label, PriorityHigh, Tag } from "@mui/icons-material";
import RichTextEditor from "./RichTextEditor";
import Tooltip from "./Tooltip";

export default function CardModal({
  isOpen,
  onClose,
  card,
  onUpdate,
  onDelete,
  onArchive,
  boardTitle,
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
          <div className="flex min-h-full items-center md:items-stretch justify-center md:justify-end p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-x-full"
              enterTo="opacity-100 translate-x-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-x-0"
              leaveTo="opacity-0 translate-x-full"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-8 mt-8 text-left align-middle shadow-xl transition-all border border-gray-100 ">
                <div className="flex justify-between ">
                  <p className="text-xl sm:text-2xl font-medium text-design-primaryGrey">
                    Board: {boardTitle}
                  </p>

                  <div className="flex items-center space-x-2">
                    <Tooltip text="Share Link">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.href);
                          toast.success("Link copied to clipboard!");
                        }}
                        className="p-2 text-gray-400 hover:text-primary rounded-full 
                          hover:bg-primary-light transition-all duration-200 hover:scale-105"
                      >
                        <Share2 className="h-5 w-5" />
                      </button>
                    </Tooltip>

                    <Tooltip text="Archive Card">
                      <button
                        onClick={() => {
                          onArchive(card.id);
                          onClose();
                        }}
                        className="p-2 text-gray-400 hover:text-primary rounded-full 
                          hover:bg-primary-light transition-all duration-200 hover:scale-105"
                      >
                        <Archive className="h-5 w-5" />
                      </button>
                    </Tooltip>

                    <Tooltip text="Delete Card">
                      <button
                        onClick={() => {
                          onDelete(card.id);
                          onClose();
                        }}
                        className="p-2 text-gray-400 hover:text-semantic-error rounded-full 
                          hover:bg-semantic-error-light transition-all duration-200 hover:scale-105"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </Tooltip>

                    <Tooltip text="Close">
                      <button
                        onClick={handleClose}
                        className="p-2 text-gray-400 hover:text-primary rounded-full 
                          hover:bg-primary-light transition-all duration-200 hover:scale-105"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </Tooltip>
                  </div>
                </div>
                <div className="h-0.5 w-full bg-design-greyOutlines mt-2" />

                <div className="space-y-6">
                  {/* Title Section */}
                  <div className="flex items-center  mt-8 p-3 rounded-xl ">
                    <AlignLeft className="h-6 w-6 text-design-primaryPurple flex-shrink-0 mr-3" />
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
                        <span
                          onClick={() => setIsEditingTitle(true)}
                          className="text-2xl font-semibold text-gray-900 truncate hover:text-primary transition-colors cursor-pointer"
                        >
                          {localTitle}
                        </span>
                      )}
                    </Dialog.Title>
                    <div className="group relative">
                      <button
                        onClick={() => setIsEditingTitle(true)}
                        className="p-2 text-gray-400 hover:text-design-primaryPurple rounded-full hover:bg-design-primaryPurple/20 transition-all hover:scale-110 flex-shrink-0"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 hidden group-hover:block">
                        <div className="bg-gray-800 text-white text-sm py-1 px-2 rounded-md shadow-lg whitespace-nowrap">
                          Edit Title
                          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Due Date & Priority Row */}
                  <div className="space-y-7 p-4 rounded-xl ">
                    <div className="grid grid-cols-2 items-center ">
                      <label className="flex text-base font-medium text-design-primaryGrey">
                        <Calendar className="h-5 w-5 mr-2 text-design-primaryGrey" />
                        Due Date
                      </label>
                      <DatePicker
                        value={card.due_date}
                        onChange={handleDueDateChange}
                      />
                    </div>
                    <div className="grid grid-cols-2 items-center">
                      <label className="flex gap-2 text-base font-medium text-design-primaryGrey">
                        <AlertCircle className="h-5 w-5 text-design-primaryGrey" />
                        Priority
                      </label>
                      <PrioritySelect
                        value={card.priority}
                        onChange={(value) =>
                          onUpdate(card.id, { priority: value })
                        }
                      />
                    </div>
                    {/* Labels */}
                    <div className="grid grid-cols-2 items-center ">
                      <label className="flex gap-2 text-base font-medium text-design-primaryGrey">
                        <Tags className="h-5 w-5 text-design-primaryGrey" />
                        Labels
                      </label>
                      <LabelManager
                        labels={card.labels}
                        onUpdate={(labels) => onUpdate(card.id, { labels })}
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="flex text-base font-medium text-gray-700 items-center">
                      <NotebookText className="h-5 w-5 mr-2 text-design-primaryGrey" />
                      Description
                    </label>
                    {/* <textarea
                      value={localDescription}
                      onChange={handleDescriptionChange}
                      onBlur={handleDescriptionBlur}
                      rows={4}
                      className="w-full rounded-xl bg-design-greyBG/30 border border-gray-200 shadow-sm p-2 focus:border-primary focus:ring-primary resize-none transition-all hover:border-primary dark:bg-design-black/50 dark:border-design-greyOutlines/20"
                      placeholder="Add a description..."
                    /> */}
                    <RichTextEditor
                      key={card.id}
                      content={localDescription}
                      onChange={setLocalDescription}
                      onBlur={handleDescriptionBlur}
                    />
                  </div>

                  {/* Checklist */}
                  <div className="bg-gray-50/50 border border-gray-100 p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={() => setShowChecklist(!showChecklist)}
                        className="inline-flex items-center px-4 py-2 border border-design-greyOutlines rounded-lg shadow-sm text-sm font-medium text-primary bg-white transition-all hover:scale-105"
                      >
                        {showChecklist ? "Hide Checklist" : "Show Checklist"}
                      </button>
                      {card.checklist && card.checklist.length > 0 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-sm font-medium bg-button-tertiary-fill text-button-primary-cta dark:bg-button-tertiary-fill/20">
                          <CheckSquare className="h-4 w-4 mr-1" />
                          {card.checklist.filter((item) => item.checked).length}
                          /{card.checklist.length}
                        </span>
                      )}
                    </div>
                    {showChecklist && (
                      <ChecklistModal
                        isOpen={showChecklist}
                        onClose={() => setShowChecklist(false)}
                        checklist={card.checklist || []}
                        onUpdate={(checklist) =>
                          onUpdate(card.id, { checklist })
                        }
                      />
                    )}
                    {/* <ChecklistModal
                      isOpen={showChecklist}
                      onClose={() => setShowChecklist(false)}
                      checklist={card.checklist || []}
                      onUpdate={(checklist) => onUpdate(card.id, { checklist })}
                    /> */}
                    {/* {!showChecklist && (
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => setShowChecklist(true)}
                          className="inline-flex items-center px-4 py-2 border border-design-greyOutlines rounded-lg shadow-sm text-sm font-medium text-primary bg-white transition-all hover:scale-105"
                        >
                          Show Checklist
                        </button>
                        {card.checklist && card.checklist.length > 0 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-sm font-medium bg-button-tertiary-fill text-button-primary-cta dark:bg-button-tertiary-fill/20">
                            <CheckSquare className="h-4 w-4 mr-1" />
                            {
                              card.checklist.filter((item) => item.checked)
                                .length
                            }
                            /{card.checklist.length}
                          </span>
                        )} */}
                    {/* </div> */}
                    {/* )} */}
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
