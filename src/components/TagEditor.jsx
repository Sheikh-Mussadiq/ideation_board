import React, { useState } from 'react';
import { X, Plus, Check } from 'lucide-react';

export default function TagEditor({ tags, onUpdate }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [editingTag, setEditingTag] = useState(null);

  const handleAddTag = () => {
    if (newTag.trim()) {
      onUpdate([...tags, newTag.trim()]);
      setNewTag('');
      setIsAdding(false);
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    onUpdate(tags.filter(tag => tag !== tagToDelete));
  };

  const handleEditTag = (oldTag, newTagValue) => {
    if (newTagValue.trim() && newTagValue !== oldTag) {
      onUpdate(tags.map(tag => tag === oldTag ? newTagValue : tag));
    }
    setEditingTag(null);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1">
        {tags.map(tag => (
          <span
            key={tag}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-light text-primary hover:bg-primary-light/80 transition-colors group"
          >
            {tag}
            <button
              onClick={() => onUpdate(tags.filter(t => t !== tag))}
              className="ml-1.5 text-primary group-hover:text-semantic-error transition-colors"
            >
              ×
            </button>
          </span>
        ))}
        <button
          onClick={() => setIsAdding(true)}
          className="btn-ghost btn-sm rounded-full hover:bg-primary-light transition-colors"
        >
          <Plus className="h-3 w-3 mr-1" />
          Add Tag
        </button>
      </div>

      {isAdding && (
        <div className="mt-2 p-3 bg-primary-light rounded-lg animate-in slide-in-from-top">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onBlur={handleAddTag}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddTag();
              if (e.key === 'Escape') setIsAdding(false);
            }}
            className="input text-xs focus:ring-2 focus:ring-primary"
            placeholder="Add new tag..."
            autoFocus
          />
        </div>
      )}
    </div>
  );
}