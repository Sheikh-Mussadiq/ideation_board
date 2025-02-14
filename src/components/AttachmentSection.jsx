import React, { useState } from "react";
import { Paperclip, X, ExternalLink, Download, Plus } from "lucide-react";

export default function AttachmentSection({
  attachments,
  onAddAttachment,
  onDeleteAttachment,
}) {
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [newLink, setNewLink] = useState("");
  const [linkError, setLinkError] = useState(null);

  const isValidUrl = (urlString) => {
    try {
      // Add protocol if missing
      const urlToTest = urlString.match(/^https?:\/\//)
        ? urlString
        : `https://${urlString}`;
      new URL(urlToTest);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleAddLink = () => {
    setLinkError(null);

    if (!newLink.trim()) {
      setLinkError("Please enter a URL");
      return;
    }

    // Add protocol if missing
    const finalUrl = newLink.match(/^https?:\/\//)
      ? newLink
      : `https://${newLink}`;

    if (!isValidUrl(finalUrl)) {
      setLinkError("Please enter a valid URL");
      return;
    }

    try {
      const url = new URL(finalUrl);
      onAddAttachment({
        id: Date.now().toString(),
        type: "link",
        url: finalUrl,
        name: url.hostname,
        createdAt: new Date().toISOString(),
      });
      setNewLink("");
      setIsAddingLink(false);
    } catch (error) {
      setLinkError("Invalid URL format");
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onAddAttachment({
        id: Date.now().toString(),
        type: "file",
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        createdAt: new Date().toISOString(),
      });
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in-50 bg-gray-50/50 border border-gray-100 p-4 rounded-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center text-sm font-medium text-gray-700">
          <Paperclip className="h-4 w-4 mr-2" />
          Attachments
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsAddingLink(true)}
            className="text-sm text-primary hover:text-primary-hover transition-all hover:scale-105 px-3 py-1 rounded-lg hover:bg-primary-light"
          >
            <Plus className="h-4 w-4 inline-block mr-1" />
            Add Link
          </button>
          <label className="cursor-pointer text-sm text-primary hover:text-primary-hover transition-all hover:scale-105 px-3 py-1 rounded-lg hover:bg-primary-light">
            <Plus className="h-4 w-4 inline-block mr-1" />
            Upload File
            <input type="file" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>
      </div>

      {isAddingLink && (
        <div className="space-y-2 animate-in slide-in-from-top bg-white p-4 rounded-lg shadow-sm dark:bg-design-black/50">
          <div className="flex items-center gap-2">
            <input
              type="url"
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
              placeholder="Enter URL..."
              className={`input flex-1 ${
                linkError ? "border-semantic-error" : ""
              }`}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddLink();
                }
              }}
            />
            <button onClick={handleAddLink} className="btn-primary">
              Add
            </button>
            <button
              onClick={() => {
                setIsAddingLink(false);
                setNewLink("");
                setLinkError(null);
              }}
              className="btn-ghost p-2 hover:rotate-90 transition-transform"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {linkError && (
            <p className="text-sm text-semantic-error">{linkError}</p>
          )}
        </div>
      )}

      <div className="space-y-2">
        {attachments.map((attachment) => (
          <div
            key={attachment.id}
            className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-primary/30 hover:bg-primary-light/10 transition-all hover:scale-[1.02] group dark:bg-design-black/50 dark:border-design-greyOutlines/20"
          >
            <div className="flex items-center space-x-2">
              {attachment.type === "link" ? (
                <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ExternalLink className="h-4 w-4 text-primary" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Paperclip className="h-4 w-4 text-primary" />
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-800 dark:text-design-white">
                  {attachment.name}
                </span>
                <span className="text-xs text-design-primaryGrey dark:text-design-greyOutlines">
                  Added {new Date(attachment.createdAt).toLocaleDateString()}
                </span>
              </div>
              {attachment.size && (
                <span className="text-xs text-design-primaryGrey dark:text-design-greyOutlines">
                  ({Math.round(attachment.size / 1024)} KB)
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <a
                href={attachment.url}
                target="_blank"
                rel="noreferrer"
                className="p-1 text-primary hover:text-primary-hover transition-all hover:scale-110"
                onClick={(e) => e.stopPropagation()}
              >
                {attachment.type === "link" ? (
                  <ExternalLink className="h-4 w-4" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
              </a>
              <button
                onClick={() => onDeleteAttachment(attachment.id)}
                className="p-1 text-primary hover:text-semantic-error transition-all hover:scale-110"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
