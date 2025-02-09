import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { Column, IdeaCard } from '../types';
import KanbanCard from './KanbanCard';
import { Plus, Trash2 } from 'lucide-react';
import PresenceIndicator from './PresenceIndicator';
import { usePresence } from '../hooks/usePresence';

interface KanbanColumnProps {
  column: Column;
  onAddCard: () => void;
  onUpdateCard: (cardId: string, updates: Partial<IdeaCard>) => void;
  onDeleteCard: (cardId: string) => void;
  onArchiveCard: (cardId: string) => void;
  onDeleteColumn: () => void;
  boardId: string;
}

export default function KanbanColumn({ 
  column, 
  onAddCard,
  onUpdateCard, 
  onDeleteCard,
  onArchiveCard,
  onDeleteColumn,
  boardId
}: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id
  });

  const { updatePresence } = usePresence(boardId);

  React.useEffect(() => {
    updatePresence({ currentColumn: column.id });
    return () => {
      updatePresence({ currentColumn: undefined });
    };
  }, [column.id]);

  const visibleCards = column.cards.filter(card => !card.archived);

  return (
    <div
      ref={setNodeRef}
      className="flex-shrink-0 w-80 bg-gray-100 rounded-lg p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-900">{column.title}</h3>
          <PresenceIndicator location="column" id={column.id} />
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 text-sm font-medium text-gray-600 bg-white rounded-full">
            {visibleCards.length}
          </span>
          <button
            onClick={onDeleteColumn}
            className="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-white"
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
          className="w-full py-2 flex items-center justify-center text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Card
        </button>
      </div>
    </div>
  );
}