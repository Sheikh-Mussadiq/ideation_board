import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { Plus, Trash2 } from "lucide-react";
import KanbanCard from "./KanbanCard";
import PresenceIndicator from "./PresenceIndicator";
import { usePresence } from "../hooks/usePresence";

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
  boardId,
}) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  const { updatePresence } = usePresence(boardId);
  const [isLoading, setIsLoading] = React.useState(true);

  // React.useEffect(() => {
  //   updatePresence({ currentColumn: column.id });
  //   // Simulate loading delay
  //   const timer = setTimeout(() => {
  //     setIsLoading(false);
  //   }, 1000);
  //   return () => {
  //     updatePresence({ currentColumn: undefined });
  //     clearTimeout(timer);
  //   };
  // }, [column.id, updatePresence]);

  // if (isLoading) {
  //   return <ShimmerColumn />;
  // }

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
    <div
      ref={setNodeRef}
      className="flex-shrink-0 w-80 bg-design-greyBG/50 rounded-lg p-4 dark:bg-button-tertiary-fill/10"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-button-primary-cta dark:text-button-primary-text">
            {column.title}
          </h3>
          <PresenceIndicator location="column" id={column.id} />
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 text-sm font-medium text-button-primary-hover bg-design-white rounded-full dark:bg-design-black dark:text-button-primary-text">
            {visibleCards.length}
          </span>
          <button onClick={onDeleteColumn} className="btn-ghost p-1">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <SortableContext items={visibleCards.map((card) => card.id)}>
          {visibleCards.map((card) => (
            <KanbanCard
              key={card.id}
              card={card}
              onUpdate={onUpdateCard}
              onDelete={onDeleteCard}
              onArchive={onArchiveCard}
              boardId={boardId}
            />
          ))}
        </SortableContext>

        <button onClick={onAddCard} className="btn-secondary w-full">
          <Plus className="h-4 w-4 mr-1" />
          Add Card
        </button>
      </div>
    </div>
  );
}
