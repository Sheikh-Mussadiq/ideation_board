import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { User, Trash2, MessageSquare, Paperclip, Archive, Tag, CheckSquare } from 'lucide-react';
import EditableText from './EditableText';
import PrioritySelect from './PrioritySelect';
import DatePicker from './DatePicker';
import AttachmentSection from './AttachmentSection';
import CommentSection from './CommentSection';
import LabelModal from './LabelModal';
import ChecklistModal from './ChecklistModal';
import CardLabel from './CardLabel';
import SocialPostButton from './SocialPostButton';

const LABEL_COLORS = {
  red: '#fda4af',
  blue: '#7dd3fc',
  green: '#6ee7b7',
  yellow: '#fcd34d',
  purple: '#c4b5fd',
  pink: '#f9a8d4',
  indigo: '#818cf8',
  gray: '#d1d5db'
};

export default function KanbanCard({ 
  card, 
  isDragging = false, 
  onUpdate,
  onDelete,
  onArchive,
  boardId
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [showChecklistModal, setShowChecklistModal] = useState(false);

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

  const completedItems = card.checklist?.filter(item => item.checked).length || 0;
  const totalItems = card.checklist?.length || 0;

  // Get the first label's color for the border
  const borderColor = card.labels[0]?.color ? LABEL_COLORS[card.labels[0].color] : undefined;

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        borderLeft: borderColor ? `4px solid ${borderColor}` : undefined
      }}
      {...attributes}
      {...listeners}
      className={`bg-white rounded-lg shadow p-4 cursor-grab ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <EditableText
            value={card.title}
            onChange={(value) => onUpdate(card.id, { title: value })}
            className="text-sm font-medium text-gray-900"
            isTitle
          />
          <div className="flex items-center gap-2">
            <PrioritySelect
              value={card.priority}
              onChange={(value) => onUpdate(card.id, { priority: value })}
            />
            <button
              onClick={() => onDelete(card.id)}
              className="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {card.labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {card.labels.map((label, index) => (
              <CardLabel
                key={index}
                label={label}
                onDelete={() => {
                  onUpdate(card.id, {
                    labels: card.labels.filter((_, i) => i !== index)
                  });
                }}
              />
            ))}
          </div>
        )}

        <EditableText
          value={card.description}
          onChange={(value) => onUpdate(card.id, { description: value })}
          className="text-sm text-gray-500"
        />

        <div className="flex items-center justify-between text-sm text-gray-500">
          {card.assignee && (
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              {card.assignee}
            </div>
          )}
          {card.dueDate && (
            <DatePicker
              value={card.dueDate}
              onChange={(value) => onUpdate(card.id, { dueDate: value })}
            />
          )}
        </div>

        <div className="flex items-center justify-between border-t pt-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setShowComments(!showComments);
                setIsExpanded(true);
              }}
              className="flex items-center text-gray-500 hover:text-gray-700"
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              {card.comments?.length || 0}
            </button>
            <button
              onClick={() => {
                setShowAttachments(!showAttachments);
                setIsExpanded(true);
              }}
              className="flex items-center text-gray-500 hover:text-gray-700"
            >
              <Paperclip className="h-4 w-4 mr-1" />
              {card.attachments?.length || 0}
            </button>
            <button
              onClick={() => setShowLabelModal(true)}
              className="flex items-center text-gray-500 hover:text-gray-700"
            >
              <Tag className="h-4 w-4 mr-1" />
              {card.labels.length}
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowChecklistModal(true)}
                className="flex items-center text-gray-500 hover:text-gray-700"
                title="Checklist"
              >
                <CheckSquare className="h-4 w-4 mr-1" />
                {totalItems > 0 && (
                  <span className={`text-xs ${
                    completedItems === totalItems ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {completedItems}/{totalItems}
                  </span>
                )}
              </button>
              <SocialPostButton card={card} onUpdateCard={onUpdate} />
            </div>
          </div>
          <button
            onClick={() => onArchive(card.id)}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <Archive className="h-4 w-4" />
          </button>
        </div>

        {isExpanded && (
          <div className="space-y-4 border-t pt-4">
            {showAttachments && (
              <AttachmentSection
                attachments={card.attachments || []}
                onAddAttachment={(attachment) => 
                  onUpdate(card.id, { 
                    attachments: [...(card.attachments || []), attachment] 
                  })
                }
                onDeleteAttachment={(attachmentId) =>
                  onUpdate(card.id, {
                    attachments: (card.attachments || []).filter(a => a.id !== attachmentId)
                  })
                }
              />
            )}

            {showComments && (
              <CommentSection
                comments={card.comments || []}
                onAddComment={(text) =>
                  onUpdate(card.id, {
                    comments: [...(card.comments || []), {
                      id: Date.now().toString(),
                      text,
                      author: 'Current User',
                      createdAt: new Date().toISOString()
                    }]
                  })
                }
                onEditComment={(commentId, text) =>
                  onUpdate(card.id, {
                    comments: (card.comments || []).map(c =>
                      c.id === commentId
                        ? { ...c, text, editedAt: new Date().toISOString() }
                        : c
                    )
                  })
                }
                onDeleteComment={(commentId) =>
                  onUpdate(card.id, {
                    comments: (card.comments || []).filter(c => c.id !== commentId)
                  })
                }
              />
            )}
          </div>
        )}
      </div>

      <LabelModal
        isOpen={showLabelModal}
        onClose={() => setShowLabelModal(false)}
        labels={card.labels}
        onUpdate={(labels) => {
          onUpdate(card.id, { labels });
          setShowLabelModal(false);
        }}
      />

      <ChecklistModal
        isOpen={showChecklistModal}
        onClose={() => setShowChecklistModal(false)}
        checklist={card.checklist || []}
        onUpdate={(checklist) => {
          onUpdate(card.id, { checklist });
        }}
      />
    </div>
  );
}

KanbanCard.propTypes = {
  card: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    priority: PropTypes.oneOf(['low', 'medium', 'high']).isRequired,
    assignee: PropTypes.string,
    dueDate: PropTypes.string,
    labels: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired
    })).isRequired,
    checklist: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      checked: PropTypes.bool.isRequired
    })),
    attachments: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['file', 'link']).isRequired,
      url: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      size: PropTypes.number,
      createdAt: PropTypes.string.isRequired
    })),
    comments: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      editedAt: PropTypes.string
    })),
    archived: PropTypes.bool
  }).isRequired,
  isDragging: PropTypes.bool,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onArchive: PropTypes.func.isRequired,
  boardId: PropTypes.string.isRequired
};