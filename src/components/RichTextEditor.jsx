import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List, ListOrdered } from "lucide-react";
import Tooltip from "./Tooltip";

const MenuBar = ({ editor }) => {
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
    </div>
  );
};

export default function RichTextEditor({ content, onChange, onBlur }) {
  const editor = useEditor({
    extensions: [StarterKit],
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
