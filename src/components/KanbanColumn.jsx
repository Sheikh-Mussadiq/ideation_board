import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { Plus, Trash2 } from 'lucide-react';
import KanbanCard from './KanbanCard';
import PresenceIndicator from './PresenceIndicator';
import { usePresence } from '../hooks/usePresence';

export default function KanbanColumn({ 
  column, 
  onAddCard,
  onUpdateCard, 
  onDeleteCard,
  onArchiveCard,
  onDeleteColumn,
  boardId
}) {
  const { setNodeRef } = useDroppable({
    id: column.id
  });

  const { updatePresence } = usePresence(boardId);

  React.useEffect(() => {
    updatePresence({ currentColumn: column.id });
    return () => {
      updatePresence({ currentColumn: undefined });
    };
  }, [column.id, updatePresence]);

  // Ensure cards array exists
  const cards = column.cards || [];
  const visibleCards = cards.filter(card => !card.archived);

  return (
    <div
      ref={setNodeRef}
      className="flex-shrink-0 w-80 bg-primary-light rounded-lg p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-primary">{column.title}</h3>
          <PresenceIndicator location="column" id={column.id} />
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 text-sm font-medium text-primary-hover bg-white rounded-full">
            {visibleCards.length}
          </span>
          <button
            onClick={onDeleteColumn}
            className="btn-ghost p-1"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <SortableContext items={visibleCards.map(card => card.id)}>
          {visibleCards.map(card => (
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

        <button
          onClick={onAddCard}
          className="btn-secondary w-full"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Card
        </button>
      </div>
    </div>
  );
}