import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, CheckSquare, Paperclip, MessageSquare } from 'lucide-react';
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
        className={`card p-4 cursor-grab hover:shadow-md transition-all hover:scale-[1.02] ${
          isDragging ? 'opacity-50' : ''
        } relative`}
      >
        {/* Card Content */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800 truncate flex-1 group-hover:text-primary transition-colors">
            {card.title}
          </h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(card.id);
            }}
            className="btn-ghost p-1 hover:text-semantic-error hover:scale-110 transition-all ml-2"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {/* Card Metadata */}
        <div className="flex items-center gap-2 mt-3">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            card.priority === 'high' ? 'bg-semantic-error/10 text-semantic-error' :
            card.priority === 'medium' ? 'bg-semantic-warning/10 text-semantic-warning' :
            'bg-semantic-success/10 text-semantic-success'
          }`}>
            {card.priority}
          </span>
          
          {/* Checklist Counter */}
          {card.checklist && card.checklist.length > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-light/50 text-primary">
              <CheckSquare className="h-3 w-3 mr-1" />
              {card.checklist.filter(item => item.checked).length}/{card.checklist.length}
            </span>
          )}
          
          {/* Attachments Counter */}
          {card.attachments && card.attachments.length > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
              <Paperclip className="h-3 w-3 mr-1" />
              {card.attachments.length}
            </span>
          )}
          
          {/* Comments Counter */}
          {card.comments && card.comments.length > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
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