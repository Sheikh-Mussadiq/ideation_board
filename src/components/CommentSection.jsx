import React, { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { User, Edit2, Trash2, MessageSquare, ChevronDown } from "lucide-react";
import { createNotification } from "../services/notificationService";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { mentioningEmailService } from "../services/emailService";
import toast from "react-hot-toast";
import Translate from "./Translate"; // Import Translate component

export default function CommentSection({
  comments,
  userUserId,
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

  const adjustTextareaHeight = (element) => {
    element.style.height = "auto";
    element.style.height = Math.min(element.scrollHeight, 150) + "px"; // Max height of 150px
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    const position = e.target.selectionStart;
    setNewComment(value);
    setCursorPosition(position);
    adjustTextareaHeight(e.target);

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
              content: `${
                currentUser.userName
              } mentioned you in a comment: "${newComment.trim()}" at ${cardTitle}`,
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

      mentioningEmailService(
        mentionedUsers,
        currentUser.userName,
        cardTitle,
        boardId,
        newComment.trim()
      );

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
    <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300 bg-white dark:bg-design-black/30 border border-design-greyOutlines/20 p-6 rounded-2xl shadow-sm">
      <div className="flex items-center space-x-3">
        <MessageSquare className="h-5 w-5 text-design-primaryPurple" />
        <span className="font-semibold text-design-black dark:text-design-white">
          <Translate>Comments</Translate>
        </span>
        {comments.length > 0 && (
          <span className="px-2.5 py-1 rounded-full text-xs bg-design-lightPurpleButtonFill text-design-primaryPurple font-medium">
            {comments.length}
          </span>
        )}
      </div>

      <div className="relative">
        <form onSubmit={handleSubmit} className="group">
          <div className="flex gap-2 transition-all duration-200 focus-within:scale-[1.01]">
            <textarea
              ref={inputRef}
              value={newComment}
              onChange={handleInputChange}
              placeholder="Add a comment... (Use @ to mention)"
              rows={1}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-design-greyOutlines/50 focus:border-design-primaryPurple focus:ring-0 dark:bg-design-black/50 dark:border-design-greyOutlines/20 placeholder:text-design-primaryGrey/50 min-h-[48px] max-h-[150px] resize-none overflow-auto scrollbar-none"
              style={{
                height: "auto",
                overflowY: "auto",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="h-12 px-4 bg-design-primaryPurple text-white rounded-xl font-medium shadow-lg hover:shadow-design-primaryPurple/25 disabled:opacity-50 disabled:hover:shadow-none transition-all duration-200 hover:scale-105 disabled:scale-100 self-start"
            >
              <Translate>Send</Translate>
            </button>
          </div>
        </form>

        {showMentions && filteredMentions.length > 0 && (
          <div className="absolute bottom-full mb-2 w-full bg-white dark:bg-design-black/90 rounded-xl shadow-xl border border-design-greyOutlines/20 max-h-48 overflow-y-auto z-10 animate-in slide-in-from-top-2 duration-200">
            {filteredMentions.map((user) => (
              <button
                key={user._id}
                onClick={() => insertMention(user)}
                className="w-full text-left px-4 py-2.5 hover:bg-design-lightVioletSelection dark:hover:bg-design-primaryPurple/10 flex items-center gap-3 transition-colors duration-150"
              >
                <div className="h-8 w-8 rounded-full bg-design-primaryPurple text-white flex items-center justify-center text-sm font-medium">
                  {user.userName[0].toUpperCase()}
                </div>
                <span className="text-design-black dark:text-design-white">
                  @{user.userName}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        {visibleComments.map((comment) => (
          <div
            key={comment.id}
            className="group rounded-xl p-4 hover:bg-design-lightPurpleButtonFill dark:hover:bg-design-primaryPurple/5 transition-all duration-200 hover:scale-[1.01]"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-9 w-9 rounded-full bg-design-primaryPurple/10 border-2 border-design-primaryPurple/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <User className="h-4 w-4 text-design-primaryPurple" />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-design-black dark:text-design-white">
                    {comment.author}
                  </span>
                  <span className="text-xs text-design-primaryGrey">
                    {format(
                      new Date(comment.updated_at || comment.created_at),
                      "MMM d, yyyy HH:mm"
                    )}
                  </span>
                </div>
              </div>

              {comment.user_id === userUserId && (
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => {
                      setEditingId(comment.id);
                      setEditText(comment.text);
                    }}
                    className="p-2 rounded-lg hover:bg-design-primaryPurple/10 hover:text-design-primaryPurple transition-colors duration-150"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDeleteComment(comment.id)}
                    className="p-2 rounded-lg hover:bg-semantic-error-light hover:text-semantic-error transition-colors duration-150"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {editingId === comment.id ? (
              <div className="mt-3 space-y-3">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border-2 border-design-greyOutlines/50 focus:border-design-primaryPurple focus:ring-0 dark:bg-design-black/50 min-h-[80px]"
                  rows={2}
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-4 py-1.5 rounded-lg hover:bg-design-greyBG transition-colors duration-150"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleEdit(comment.id)}
                    className="px-4 py-1.5 bg-design-primaryPurple text-white rounded-lg hover:bg-button-primary-hover transition-colors duration-150"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-3 text-design-black dark:text-design-greyOutlines leading-relaxed">
                {renderCommentText(comment.text)}
                {comment.updated_at && (
                  <span className="text-xs text-design-primaryGrey ml-2">
                    (edited)
                  </span>
                )}
              </p>
            )}
          </div>
        ))}

        {hasMoreComments && (
          <button
            onClick={() => setShowAllComments(!showAllComments)}
            className="w-full py-3 text-design-primaryPurple hover:text-button-primary-hover flex items-center justify-center gap-2 group transition-colors duration-150"
          >
            <span className="font-medium">
              {showAllComments ? (
                <Translate>Show Less</Translate>
              ) : (
                <Translate>View All Comments</Translate>
              )}
            </span>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-300 ${
                showAllComments ? "rotate-180" : "group-hover:translate-y-0.5"
              }`}
            />
          </button>
        )}
      </div>
    </div>
  );
}
