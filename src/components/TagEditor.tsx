import React, { useState } from 'react';
import { X, Plus, Check } from 'lucide-react';

interface TagEditorProps {
  tags: string[];
  onUpdate: (tags: string[]) => void;
}

export default function TagEditor({ tags, onUpdate }: TagEditorProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [editingTag, setEditingTag] = useState<string | null>(null);

  const handleAddTag = () => {
    if (newTag.trim()) {
      onUpdate([...tags, newTag.trim()]);
      setNewTag('');
      setIsAdding(false);
    }
  };

  const handleDeleteTag = (tagToDelete: string) => {
    onUpdate(tags.filter(tag => tag !== tagToDelete));
  };

  const handleEditTag = (oldTag: string, newTagValue: string) => {
    if (newTagValue.trim() && newTagValue !== oldTag) {
      onUpdate(tags.map(tag => tag === oldTag ? newTagValue : tag));
    }
    setEditingTag(null);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1">
        {tags.map(tag => (
          <div key={tag} className="group relative inline-flex items-center">
            {editingTag === tag ? (
              <div className="flex items-center">
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => handleEditTag(tag, e.target.value)}
                  onBlur={() => setEditingTag(null)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleEditTag(tag, e.currentTarget.value);
                    if (e.key === 'Escape') setEditingTag(null);
                  }}
                  className="px-2 py-0.5 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  autoFocus
                />
              </div>
            ) : (
              <span
                onClick={() => setEditingTag(tag)}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 cursor-pointer hover:bg-gray-200"
              >
                {tag}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTag(tag);
                  }}
                  className="ml-1 text-gray-400 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        ))}
        {isAdding ? (
          <div className="inline-flex items-center">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onBlur={() => {
                handleAddTag();
                setIsAdding(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddTag();
                if (e.key === 'Escape') setIsAdding(false);
              }}
              className="px-2 py-0.5 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="New tag..."
              autoFocus
            />
            <button
              onClick={handleAddTag}
              className="ml-1 text-green-500 hover:text-green-600"
            >
              <Check className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Tag
          </button>
        )}
      </div>
    </div>
  );
}