import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Trash2,
  CheckSquare,
  Paperclip,
  MessageSquare,
  Calendar,
  AlignLeft,
  Check,
} from "lucide-react";
import { format } from "date-fns";
// import PrioritySelect from "./PrioritySelect";
import CardModal from "./CardModal";
import Tooltip from "./Tooltip";
// Shimmer loading component
const ShimmerCard = () => (
  <div className="card p-4 relative overflow-hidden">
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="flex gap-2 mt-3">
        <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
        <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
      </div>
    </div>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent shimmer"></div>
  </div>
);

export default function KanbanCard({
  card,
  isDragging = false,
  onUpdate,
  onDelete,
  onArchive,
  boardId,
  boardTitle,
  teamUsers,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(card.completed || false);
  const [isHovered, setIsHovered] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: card.id,
    });

  // React.useEffect(() => {
  //   // Simulate loading delay
  //   const timer = setTimeout(() => {
  //     setIsLoading(false);
  //   }, 1000);
  //   return () => clearTimeout(timer);
  // }, []);

  // if (isLoading) {
  //   return <ShimmerCard />;
  // }

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const truncateDescription = (text) => {
    if (!text) return "";
    return text.length > 30 ? text.substring(0, 20) + "..." : text;
  };

  const handleDescriptionClick = (e) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleCheckClick = (e) => {
    e.stopPropagation();
    const newDoneState = !card.completed;
    setIsCompleted(newDoneState);
    onUpdate(card.id, {
      completed: newDoneState,
    });
  };
  // const plainText = card.description.replace(/<\/?[^>]+>/g, ""); ///<\/?[^>]+>/g, ''
  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={() => setIsModalOpen(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`card p-4 cursor-grab hover:shadow-md transition-all dark:hover:bg-design-black/70 ${
          isDragging ? "opacity-50" : ""
        } relative group overflow-hidden`}
      >
        <div
          className={`absolute left-0 top-[-1px] bottom-[-1px] w-2 ${
            card.priority === "high"
              ? "bg-semantic-error"
              : card.priority === "medium"
              ? "bg-semantic-warning"
              : "bg-semantic-success"
          }`}
        ></div>
        {/* Card Content */}
        <div className="flex items-center justify-between">
          <h3
            className={`text-sm font-semibold text-design-black truncate flex-1 group-hover:text-button-primary-cta transition-colors dark:text-design-white ${
              card.completed ? "line-through" : ""
            }`}
          >
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

        {/* Description */}
        {card.description && (
          <div className="mt-2 flex items-start gap-2">
            <button
              onClick={handleCheckClick}
              className={`flex-shrink-0 mt-1 text-design-primaryGrey hover:text-button-primary-cta transition-colors ${
                isHovered ? "opacity-100" : "opacity-0"
              } group-hover:opacity-100`}
            >
              {card.completed ? (
                <Check className="h-4 w-4 text-semantic-success" />
              ) : (
                <CheckSquare className="h-4 w-4" />
              )}
            </button>
            <p
              onClick={handleDescriptionClick}
              className={`text-xs text-design-primaryGrey dark:text-design-greyOutlines cursor-pointer hover:text-button-primary-cta transition-colors ${
                card.completed ? "line-through" : ""
              }`}
            >
              {truncateDescription(card.description.replace(/<\/?[^>]+>/g, ""))}
            </p>
          </div>
        )}

        {/* Due Date */}
        {card.due_date && (
          <div className="mt-2 flex items-center text-xs text-design-primaryGrey dark:text-design-greyOutlines bg-button-tertiary-fill/30 w-fit px-2 py-1 rounded-full hover:bg-button-tertiary-fill/50 transition-colors">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{format(new Date(card.due_date), "MMM d, yyyy")}</span>
          </div>
        )}

        {/* Assignees */}
        {card.assignee && card.assignee.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {card.assignee.map((assignee, index) => (
              <div
                className="h-6 w-6 rounded-full bg-design-primaryPurple text-white text-xs flex items-center justify-center"
                style={{
                  zIndex: card.assignee.length - index,
                  marginLeft: index > 0 ? "-12px" : "0",
                }}
              >
                {assignee.firstName[0]}
                {assignee.lastName[0]}
              </div>
            ))}
          </div>
        )}

        {/* Card Metadata */}
        <div className="flex items-center gap-2 mt-3">
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              card.priority === "high"
                ? "bg-semantic-error-light text-semantic-error dark:bg-semantic-error/20"
                : card.priority === "medium"
                ? "bg-semantic-warning-light text-semantic-warning dark:bg-button-tertiary-fill/20"
                : "bg-semantic-success-light text-semantic-success dark:bg-semantic-success/20"
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
        boardId={boardId}
        boardTitle={boardTitle}
        teamUsers={teamUsers}
      />
    </>
  );
}
