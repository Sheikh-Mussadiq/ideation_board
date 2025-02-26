import React, { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { Plus, Trash2 } from "lucide-react";
import KanbanCard from "./KanbanCard";
import PresenceIndicator from "./PresenceIndicator";
import { usePresence } from "../hooks/usePresence";
import DeleteColumnModal from "./DeleteColumnModal";
import Tooltip from "./Tooltip";

// Shimmer loading component
const ShimmerColumn = () => (
  <div className="flex-shrink-0 w-80 bg-button-tertiary-fill rounded-lg p-4 relative overflow-hidden">
    <div className="animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="space-y-3">
        <div className="h-24 bg-gray-200 rounded"></div>
        <div className="h-24 bg-gray-200 rounded"></div>
        <div className="h-24 bg-gray-200 rounded"></div>
      </div>
    </div>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent shimmer"></div>
  </div>
);

export default function KanbanColumn({
  column,
  onAddCard,
  onUpdateCard,
  onDeleteCard,
  onArchiveCard,
  onDeleteColumn,
  onUpdateColumn,
  boardId,
  boardTitle,
  teamUsers,
}) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  const { updatePresence } = usePresence(boardId);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);

  const handleTitleSubmit = (e) => {
    e.preventDefault();
    if (editTitle.trim() && editTitle !== column.title) {
      onUpdateColumn(column.id, { title: editTitle.trim() });
    }
    setIsEditing(false);
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === "Escape") {
      setEditTitle(column.title);
      setIsEditing(false);
    }
  };

  React.useEffect(() => {
    updatePresence({ currentColumn: column.id });
    return () => {
      updatePresence({ currentColumn: undefined });
    };
  }, [column.id, updatePresence]);

  // Ensure cards array exists
  const cards = column.cards || [];
  const visibleCards = cards.filter((card) => !card.archived);

  return (
    <>
      <div
        ref={setNodeRef}
        className="flex-shrink-0 w-80 bg-design-greyBG/50 rounded-2xl p-4 dark:bg-button-tertiary-fill/10 flex flex-col h-full"
      >
        <div className="flex-none mb-4">
          <div className="flex items-center justify-between mb-4 flex-none">
            <div className="flex items-center gap-2">
              {isEditing ? (
                <form onSubmit={handleTitleSubmit} className="flex-1">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onBlur={handleTitleSubmit}
                    onKeyDown={handleTitleKeyDown}
                    className="text-sm font-semibold bg-design-white dark:bg-design-black px-2 py-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-button-primary-cta"
                    autoFocus
                  />
                </form>
              ) : (
                <h3
                  className="text-sm font-semibold text-button-primary-cta dark:text-button-primary-text cursor-pointer hover:text-button-primary-hover"
                  onClick={() => setIsEditing(true)}
                >
                  {column.title}
                </h3>
              )}
              <PresenceIndicator location="column" id={column.id} />
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 text-sm font-medium text-button-primary-hover bg-design-white rounded-full dark:bg-design-black dark:text-button-primary-text">
                {visibleCards.length}
              </span>
              <Tooltip text={`Delete "${column.title}"`} position="bottom">
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="btn-ghost p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </Tooltip>
            </div>
          </div>
        </div>

        <div
          //  className="space-y-3 overflow-y-auto scrollbar-hide flex-1"
          className="space-y-3 overflow-y-auto scrollbar-hide flex-1 relative"
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent, black 5%, black 95%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent, black 5%, black 95%, transparent 100%)",
          }}
        >
          <div
            className="absolute inset-x-0 top-0 h-20 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, var(--tw-gradient-stops))",
              "--tw-gradient-from": "rgb(var(--design-greyBG) / 0.05)",
              "--tw-gradient-to": "transparent",
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
            style={{
              background: "linear-gradient(to top, var(--tw-gradient-stops))",
              "--tw-gradient-from": "rgb(var(--design-greyBG) / 0.05)",
              "--tw-gradient-to": "transparent",
            }}
          />
          <SortableContext items={visibleCards.map((card) => card.id)}>
            {visibleCards.map((card) => (
              <KanbanCard
                key={card.id}
                card={card}
                onUpdate={onUpdateCard}
                onDelete={onDeleteCard}
                onArchive={onArchiveCard}
                boardId={boardId}
                teamUsers={teamUsers}
                boardTitle={boardTitle}
              />
            ))}
          </SortableContext>
        </div>

        <div className="flex-none mt-3">
          <button onClick={onAddCard} className="btn-secondary w-full">
            <Plus className="h-4 w-4 mr-1" />
            Add Card
          </button>
        </div>
      </div>

      <DeleteColumnModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={onDeleteColumn}
        columnTitle={column.title}
      />
    </>
  );
}
