import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2, CheckSquare, Paperclip, MessageSquare } from "lucide-react";
import PrioritySelect from "./PrioritySelect";
import CardModal from "./CardModal";

export default function KanbanCard({
  card,
  isDragging = false,
  onUpdate,
  onDelete,
  onArchive,
  boardId,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: card.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={() => setIsModalOpen(true)}
        className={`card p-4 cursor-grab hover:shadow-md transition-all hover:scale-[1.02] dark:hover:bg-design-black/70 ${
          isDragging ? "opacity-50" : ""
        } relative ${
          card.priority === "high"
            ? "border-l-4 border-b-0 border-t-0 border-r-0 border-semantic-error"
            : card.priority === "medium"
            ? "border-l-4 border-b-0 border-t-0 border-r-0 border-button-primary-cta"
            : "border-l-4 border-b-0 border-t-0 border-r-0 border-semantic-success"
        }`}
      >
        {/* Card Content */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-design-black truncate flex-1 group-hover:text-button-primary-cta transition-colors dark:text-design-white">
            {card.title}
          </h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(card.id);
            }}
            className="btn-ghost p-1 hover:text-semantic-error hover:scale-110 transition-all ml-2 dark:hover:text-semantic-error"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {/* Card Metadata */}
        <div className="flex items-center gap-2 mt-3">
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              card.priority === "high"
                ? "bg-semantic-error/10 text-semantic-error dark:bg-semantic-error/20"
                : card.priority === "medium"
                ? "bg-button-tertiary-fill text-button-primary-cta dark:bg-button-tertiary-fill/20"
                : "bg-semantic-success/10 text-semantic-success dark:bg-semantic-success/20"
            }`}
          >
            {card.priority}
          </span>

          {/* Checklist Counter */}
          {card.checklist && card.checklist.length > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-button-tertiary-fill text-button-primary-cta dark:bg-button-tertiary-fill/20">
              <CheckSquare className="h-3 w-3 mr-1" />
              {card.checklist.filter((item) => item.checked).length}/
              {card.checklist.length}
            </span>
          )}

          {/* Attachments Counter */}
          {card.attachments && card.attachments.length > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-button-secondary-fill text-design-primaryGrey dark:bg-button-secondary-fill/10 dark:text-design-greyOutlines">
              <Paperclip className="h-3 w-3 mr-1" />
              {card.attachments.length}
            </span>
          )}

          {/* Comments Counter */}
          {card.comments && card.comments.length > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-button-secondary-fill text-design-primaryGrey dark:bg-button-secondary-fill/10 dark:text-design-greyOutlines">
              <MessageSquare className="h-3 w-3 mr-1" />
              {card.comments.length}
            </span>
          )}
        </div>
      </div>

      <CardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        card={card}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onArchive={onArchive}
      />
    </>
  );
}
