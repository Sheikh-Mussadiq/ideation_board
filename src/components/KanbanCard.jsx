import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2 } from 'lucide-react';
import PrioritySelect from './PrioritySelect';
import CardModal from './CardModal';

export default function KanbanCard({ 
  card, 
  isDragging = false, 
  onUpdate,
  onDelete,
  onArchive,
  boardId
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({
    id: card.id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };


  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={() => setIsModalOpen(true)}
        className={`card p-4 cursor-grab hover:shadow-md transition-all ${
          isDragging ? 'opacity-50' : ''
        }`}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800 truncate flex-1">
            {card.title}
          </h3>
          <div className="flex items-center gap-2">
            <PrioritySelect
              value={card.priority}
              onChange={(value) => onUpdate(card.id, { priority: value })}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(card.id);
              }}
              className="btn-ghost p-1"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
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