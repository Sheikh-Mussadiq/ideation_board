import React, { useState } from "react";
import { format } from "date-fns";
import { User, Edit2, Trash2, MessageSquare, ChevronDown } from "lucide-react";

export default function CommentSection({
  comments,
  onAddComment,
  onEditComment,
  onDeleteComment,
}) {
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment.trim());
      setNewComment("");
    }
  };

  const handleEdit = (commentId) => {
    if (editText.trim()) {
      onEditComment(commentId, editText.trim());
      setEditingId(null);
    }
  };

  const visibleComments = showAllComments ? comments : comments.slice(0, 3);
  const hasMoreComments = comments.length > 3;

  return (
    <div className="space-y-4 animate-in fade-in-50 bg-gray-50/50 border border-gray-100 p-4 rounded-xl">
      <div className="flex items-center text-sm text-gray-700">
        <MessageSquare className="h-4 w-4 mr-2" />
        <span className="font-medium">Comments</span>
        {comments.length > 0 && (
          <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-primary-light text-primary">
            {comments.length}
          </span>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex gap-2 bg-white p-3 rounded-lg shadow-sm dark:bg-design-black/50"
      >
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="input flex-1 min-w-0 border-gray-200 focus:border-primary focus:ring-primary"
        />
        <button
          type="submit"
          disabled={!newComment.trim()}
          className="btn-primary disabled:opacity-50 hover:scale-105 transition-transform shadow-lg hover:shadow-xl dark:disabled:bg-button-disabled-fill dark:disabled:text-button-disabled-text"
        >
          Add
        </button>
      </form>

      <div className="space-y-3">
        {visibleComments.map((comment) => (
          <div
            key={comment.id}
            className="bg-primary-light/50 rounded-lg p-3 hover:bg-primary-light transition-all hover:scale-[1.02] group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-white border-2 border-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-800 dark:text-design-white">
                    {comment.author}
                  </span>
                  <span className="text-xs text-design-primaryGrey dark:text-design-greyOutlines">
                    {format(new Date(comment.created_at), "MMM d, yyyy HH:mm")}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setEditingId(comment.id);
                    setEditText(comment.text);
                  }}
                  className="btn-ghost p-1.5 rounded-lg hover:bg-white hover:scale-110 transition-transform dark:hover:bg-design-black/50"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDeleteComment(comment.id)}
                  className="btn-ghost p-1.5 rounded-lg hover:bg-white hover:text-semantic-error hover:scale-110 transition-transform dark:hover:bg-design-black/50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            {editingId === comment.id ? (
              <div className="space-y-2">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="input w-full dark:bg-design-black/50 dark:border-design-greyOutlines/20"
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
              <p className="mt-2 text-sm text-gray-700 leading-relaxed dark:text-design-greyOutlines">
                {comment.text}
              </p>
            )}
          </div>
        ))}

        {hasMoreComments && (
          <button
            onClick={() => setShowAllComments(!showAllComments)}
            className="w-full py-2 px-4 text-sm text-primary hover:text-primary-hover flex items-center justify-center gap-2 group"
          >
            <span>{showAllComments ? "Show Less" : "View More Comments"}</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                showAllComments ? "rotate-180" : ""
              }`}
            />
          </button>
        )}
      </div>
    </div>
  );
}
