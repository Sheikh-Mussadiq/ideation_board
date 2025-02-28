import React, { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { User, Edit2, Trash2, MessageSquare, ChevronDown } from "lucide-react";
import { createNotification } from "../services/notificationService";
import { supabase } from "../lib/supabase"
import { useAuth } from "../context/AuthContext";

export default function CommentSection({
  comments,
  userAccountId,
  onAddComment,
  onEditComment,
  onDeleteComment,
  teamUsers,
  cardId,
  cardTitle, 
  boardId, 
}) {
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionFilter, setMentionFilter] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);
  const { currentUser } = useAuth();
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    const value = e.target.value;
    const position = e.target.selectionStart;
    setNewComment(value);
    setCursorPosition(position);

    // Find the word being typed at current cursor position
    const textBeforeCursor = value.slice(0, position);
    const wordsBeforeCursor = textBeforeCursor.split(/\s+/);
    const currentWord = wordsBeforeCursor[wordsBeforeCursor.length - 1];

    // Show mentions only if currently typing a mention (starts with @ and no spaces)
    if (currentWord.startsWith("@")) {
      const searchText = currentWord.slice(1).toLowerCase();
      setMentionFilter(searchText);
      setShowMentions(true);
    } else {
      setShowMentions(false);
    }
  };

  const insertMention = (user) => {
    const textBeforeCursor = newComment.slice(0, cursorPosition);
    const textAfterCursor = newComment.slice(cursorPosition);

    // Find the start of the current word
    const lastSpaceBeforeCursor = textBeforeCursor.lastIndexOf(" ");
    const start = lastSpaceBeforeCursor === -1 ? 0 : lastSpaceBeforeCursor + 1;

    // Construct new text with mention
    const newText =
      newComment.slice(0, start) +
      `@${user.userName} ` +
      newComment.slice(cursorPosition);

    setNewComment(newText);
    setShowMentions(false);
    inputRef.current?.focus();
  };

  const renderCommentText = (text) => {
    if (!text) return null; // Handle cases where text is undefined/null

    // Split the text into words while preserving spaces and punctuation
    const words = text.split(/(\s+)/); // Keeps spaces separate

    return words.map((word, index) => {
      // Check if word is a mention (starts with @ and followed by a username)
      if (word.startsWith("@") && word.length > 1) {
        const mentionText = word.slice(1).trim(); // Remove '@' and trim spaces

        // Check if this username exists in teamUsers
        const mentionedUser = teamUsers.find(
          (user) => user.userName.toLowerCase() === mentionText.toLowerCase()
        );

        if (mentionedUser) {
          return (
            <span key={index} className="font-medium text-design-primaryPurple">
              {word}
            </span>
          );
        }
      }

      // Return regular text for non-mentions
      return <span key={index}>{word}</span>;
    });
  };

  const extractMentions = (text) => {
    const mentions = [];
    const words = text.split(/\s+/);

    words.forEach((word) => {
      if (word.startsWith("@")) {
        const username = word.slice(1);
        const mentionedUser = teamUsers.find(
          (user) => user.userName.toLowerCase() === username.toLowerCase()
        );
        if (mentionedUser) {
          mentions.push(mentionedUser);
        }
      }
    });

    return mentions;
  };

  const filteredMentions = teamUsers.filter((user) =>
    user.userName.toLowerCase().includes(mentionFilter.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      // First add the comment
      await onAddComment(newComment.trim());

      // Then handle mentions and notifications
      const mentionedUsers = extractMentions(newComment.trim());

      // Create notifications for each mentioned user
      for (const user of mentionedUsers) {
        try {
          await supabase.from("notifications").insert([
            {
              user_id: user._id,
              content: `${currentUser.userName} mentioned you in a comment: "${newComment.trim()}" at ${cardTitle}`,
              type: "MENTION",
              board_id: boardId,
              card_id: cardId,
              created_at: new Date().toISOString(),
              read: false,
            },
          ]);
        } catch (error) {
          console.error("Error creating mention notification:", error);
        }
      }

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
        <MessageSquare className="h-5 w-5 mr-2" />
        <span className="font-medium">Comments</span>
        {comments.length > 0 && (
          <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-primary-light text-primary">
            {comments.length}
          </span>
        )}
      </div>

      <div className="relative">
        <form
          onSubmit={handleSubmit}
          className="flex gap-2 bg-white p-3 rounded-lg shadow-sm dark:bg-design-black/50"
        >
          <input
            ref={inputRef}
            type="text"
            value={newComment}
            onChange={handleInputChange}
            placeholder="Add a comment... (Use @ to mention)"
            className="input flex-1 min-w-0 border-gray-200 focus:border-primary focus:ring-primary p-2"
          />
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="btn-primary disabled:opacity-50 hover:scale-105 transition-transform shadow-lg hover:shadow-xl dark:disabled:bg-button-disabled-fill dark:disabled:text-button-disabled-text"
          >
            Add
          </button>
        </form>

        {/* Mentions suggestions */}
        {showMentions && filteredMentions.length > 0 && (
          <div className="absolute bottom-full mb-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-48 overflow-y-auto z-10">
            {filteredMentions.map((user) => (
              <button
                key={user._id}
                onClick={() => insertMention(user)}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
              >
                <div className="h-6 w-6 rounded-full bg-design-primaryPurple text-white flex items-center justify-center text-xs">
                  {user.userName[0]}
                </div>
                <span>@{user.userName}</span>
              </button>
            ))}
          </div>
        )}
      </div>

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
                    {comment.updated_at
                      ? format(
                          new Date(comment.updated_at),
                          "MMM d, yyyy HH:mm"
                        )
                      : format(
                          new Date(comment.created_at),
                          "MMM d, yyyy HH:mm"
                        )}
                  </span>
                </div>
              </div>
              <div
                className={`flex items-center space-x-2 ${
                  comment.account_id === userAccountId ? "" : "hidden"
                }`}
              >
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
                {renderCommentText(comment.text)}
                {comment.updated_at ? " (edited)" : ""}
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
