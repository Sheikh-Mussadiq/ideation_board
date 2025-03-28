import React, { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import EmojiPicker from "emoji-picker-react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Underline as UnderlineIcon,
  Smile,
} from "lucide-react";
import Tooltip from "./Tooltip";

const MenuBar = ({ editor }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    const closeEmojiPicker = () => setShowEmojiPicker(false);
    document.addEventListener("click", closeEmojiPicker);
    return () => document.removeEventListener("click", closeEmojiPicker);
  }, []);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 p-1 mb-2 border-b border-design-greyOutlines dark:border-design-greyOutlines/20">
      <Tooltip text="Bold (Ctrl+B)">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded hover:bg-design-primaryPurple/20 transition-all duration-200 ${
            editor.isActive("bold")
              ? "bg-design-primaryPurple/20 text-design-primaryPurple"
              : "text-design-primaryGrey"
          }`}
        >
          <Bold className="h-4 w-4" />
        </button>
      </Tooltip>
      <Tooltip text="Italic (Ctrl+I)">
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded hover:bg-design-primaryPurple/20 transition-all duration-200 ${
            editor.isActive("italic")
              ? "bg-design-primaryPurple/20 text-design-primaryPurple"
              : "text-design-primaryGrey"
          }`}
        >
          <Italic className="h-4 w-4" />
        </button>
      </Tooltip>
      <Tooltip text="Underline (Ctrl+U)">
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1.5 rounded hover:bg-design-primaryPurple/20 transition-all duration-200 ${
            editor.isActive("underline")
              ? "bg-design-primaryPurple/20 text-design-primaryPurple"
              : "text-design-primaryGrey"
          }`}
        >
          <UnderlineIcon className="h-4 w-4" />
        </button>
      </Tooltip>
      <Tooltip text="Bullet List">
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded hover:bg-design-primaryPurple/20 transition-colors ${
            editor.isActive("bulletList")
              ? "bg-design-primaryPurple/20 text-design-primaryPurple"
              : "text-design-primaryGrey"
          }`}
        >
          <List className="h-4 w-4" />
        </button>
      </Tooltip>
      <Tooltip text="Numbered List">
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded hover:bg-design-primaryPurple/20 transition-colors ${
            editor.isActive("orderedList")
              ? "bg-design-primaryPurple/20 text-design-primaryPurple"
              : "text-design-primaryGrey"
          }`}
        >
          <ListOrdered className="h-4 w-4" />
        </button>
      </Tooltip>
      {typeof window !== "undefined" && window.innerWidth > 768 && (
        <Tooltip text="Emoji">
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowEmojiPicker(!showEmojiPicker);
              }}
              className={`p-1.5 rounded hover:bg-design-primaryPurple/20 transition-colors ${
                showEmojiPicker
                  ? "bg-design-primaryPurple/20 text-design-primaryPurple"
                  : "text-design-primaryGrey"
              }`}
            >
              <Smile className="h-4 w-4" />
            </button>
            {showEmojiPicker && (
              <div
                className="absolute top-full mt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <EmojiPicker
                  onEmojiClick={(emojiData) => {
                    editor.chain().focus().insertContent(emojiData.emoji).run();
                    setShowEmojiPicker(false);
                  }}
                  width={300}
                  height={400}
                  previewConfig={{ showPreview: false }}
                  searchPlaceholder="Search emoji..."
                  skinTonesDisabled
                  theme="light"
                />
              </div>
            )}
          </div>
        </Tooltip>
      )}
    </div>
  );
};

export default function RichTextEditor({ content, onChange, onBlur }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: true,
        autolink: true,
        linkOnPaste: true,
        validate: (href) => /^https?:\/\//.test(href),
        HTMLAttributes: {
          class: "text-design-primaryPurple hover:underline",
          rel: "noopener noreferrer nofollow",
          target: "_blank",
        },
      }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onBlur: ({ editor }) => {
      onBlur?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none",
      },
    },
  });

  return (
    <div className="w-full rounded-lg border border-gray-100 shadow-sm p-2 focus-within:border-primary focus-within:ring-primary resize-none transition-all hover:border-primary dark:bg-design-black/50 dark:border-design-greyOutlines/20">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
