import React, { useState } from 'react';
import { format } from 'date-fns';
import { User, Edit2, Trash2, MessageSquare } from 'lucide-react';

export default function CommentSection({
  comments,
  onAddComment,
  onEditComment,
  onDeleteComment
}) {
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment.trim());
      setNewComment('');
    }
  };

  const handleEdit = (commentId) => {
    if (editText.trim()) {
      onEditComment(commentId, editText.trim());
      setEditingId(null);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in-50">
      <div className="flex items-center text-sm text-gray-700">
        <MessageSquare className="h-4 w-4 mr-2" />
        Comments
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="input flex-1 min-w-0"
        />
        <button
          type="submit"
          disabled={!newComment.trim()}
          className="btn-primary disabled:opacity-50"
        >
          Add
        </button>
      </form>

      <div className="space-y-3">
        {comments.map(comment => (
          <div key={comment.id} className="bg-primary-light/50 rounded-lg p-3 hover:bg-primary-light transition-all hover:scale-[1.02] group">
            {editingId === comment.id ? (
              <div className="space-y-2">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="input w-full"
                  rows={2}
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditingId(null)}
                    className="btn-ghost btn-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleEdit(comment.id)}
                    className="btn-primary btn-sm"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-6 w-6 rounded-full bg-primary-light flex items-center justify-center group-hover:scale-110 transition-transform">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-gray-800">
                      {comment.author}
                    </span>
                    <span className="text-xs text-gray-500">
                      {format(new Date(comment.created_at), 'MMM d, yyyy HH:mm')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setEditingId(comment.id);
                        setEditText(comment.text);
                      }}
                      className="btn-ghost p-1 hover:scale-110 transition-transform"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDeleteComment(comment.id)}
                      className="btn-ghost p-1 hover:text-semantic-error hover:scale-110 transition-transform"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-700 leading-relaxed">{comment.text}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}