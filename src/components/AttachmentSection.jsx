import React, { useState } from "react";
import {
  Paperclip,
  X,
  ExternalLink,
  Download,
  Plus,
  ChevronDown,
  FileText,
  Image as ImageIcon,
  FileVideo,
  File,
  Link as LinkIcon,
} from "lucide-react";

const FileTypeIcon = ({ type, className = "h-4 w-4" }) => {
  const getFileType = (filename) => {
    if (!filename) return "link";
    const ext = filename.split(".").pop().toLowerCase();
    if (["pdf"].includes(ext)) return "pdf";
    if (["doc", "docx"].includes(ext)) return "word";
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "image";
    if (["mp4", "mov", "avi", "webm"].includes(ext)) return "video";
    return "file";
  };

  const getFileExtension = (filename) => {
    if (!filename) return "";
    return filename.split(".").pop().toLowerCase();
  };

  const fileType = getFileType(type);
  const extension = getFileExtension(type);

  const iconColors = {
    pdf: "text-semantic-error hover:text-semantic-error-hover",
    word: "text-semantic-info hover:text-semantic-info-hover",
    image: "text-design-primaryPurple hover:text-button-primary-hover",
    video: "text-semantic-warning hover:text-semantic-warning-hover",
    link: "text-design-primaryPurple hover:text-button-primary-hover",
    file: "text-design-primaryGrey hover:text-gray-700",
  };

  const icons = {
    pdf: <FileText className={`${className} ${iconColors.pdf}`} />,
    word: <FileText className={`${className} ${iconColors.word}`} />,
    image: <ImageIcon className={`${className} ${iconColors.image}`} />,
    video: <FileVideo className={`${className} ${iconColors.video}`} />,
    link: <LinkIcon className={`${className} ${iconColors.link}`} />,
    file: <File className={`${className} ${iconColors.file}`} />,
  };

  return (
    <div className="relative flex flex-col items-center">
      {icons[fileType] || icons.file}
      {extension && fileType !== "link" && (
        <span
          className="text-[10px] font-medium mt-1 uppercase"
          style={{
            color: iconColors[fileType].split(" ")[0].replace("text-", ""),
          }}
        >
          {extension}
        </span>
      )}
    </div>
  );
};

export default function AttachmentSection({
  attachments,
  onAddAttachment,
  onDeleteAttachment,
}) {
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [newLink, setNewLink] = useState("");
  const [linkError, setLinkError] = useState(null);
  const [showAllAttachments, setShowAllAttachments] = useState(false);

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

  const visibleAttachments = showAllAttachments
    ? attachments
    : attachments.slice(0, 2);
  const hasMoreAttachments = attachments.length > 2;

  return (
    <div className="space-y-4 bg-white/50 backdrop-blur-sm border border-design-greyOutlines/20 p-4 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center text-sm font-medium text-design-primaryGrey">
          <Paperclip className="h-5 w-5 mr-2 text-design-primaryPurple" />
          Attachments
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsAddingLink(true)}
            className="flex items-center px-3 py-1.5 text-sm text-design-primaryPurple bg-design-lightPurpleButtonFill rounded-lg hover:bg-button-primary-cta hover:text-white transition-all duration-300 transform hover:scale-105"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Link
          </button>
          <label className="flex items-center px-3 py-1.5 text-sm text-design-primaryPurple bg-design-lightPurpleButtonFill rounded-lg hover:bg-button-primary-cta hover:text-white transition-all duration-300 transform hover:scale-105 cursor-pointer">
            <Plus className="h-4 w-4 mr-1" />
            Upload File
            <input type="file" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>
      </div>

      {isAddingLink && (
        <div className="animate-in zoom-in-95 duration-200 bg-white p-4 rounded-lg shadow-sm border border-design-greyOutlines/20">
          <div className="flex items-center gap-2">
            <input
              type="url"
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
              placeholder="Enter URL..."
              className={`input flex-1 p-2 ${
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
              className="btn-ghost p-2 hover:scale-110 transition-transform"
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
        {visibleAttachments.map((attachment) => (
          <div
            key={attachment.id}
            className="group flex items-center justify-between p-3 bg-white border border-design-greyOutlines/20 rounded-lg hover:border-design-primaryPurple/30 transition-all duration-300 transform hover:scale-[1.01] hover:shadow-sm"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg bg-design-lightPurpleButtonFill flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <FileTypeIcon type={attachment.name} className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-800 group-hover:text-design-primaryPurple transition-colors duration-300">
                  {attachment.name}
                </span>
                <span className="text-xs text-design-primaryGrey">
                  Added {new Date(attachment.createdAt).toLocaleDateString()}
                  {attachment.size &&
                    ` • ${Math.round(attachment.size / 1024)} KB`}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <a
                href={attachment.url}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full hover:bg-design-lightPurpleButtonFill text-design-primaryGrey hover:text-design-primaryPurple transition-all duration-300"
              >
                {attachment.type === "link" ? (
                  <ExternalLink className="h-4 w-4" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
              </a>
              <button
                onClick={() => onDeleteAttachment(attachment.id)}
                className="p-2 rounded-full hover:bg-semantic-error-light text-design-primaryGrey hover:text-semantic-error transition-all duration-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {hasMoreAttachments && (
          <button
            onClick={() => setShowAllAttachments(!showAllAttachments)}
            className="w-full py-2 px-4 text-sm text-design-primaryPurple hover:text-button-primary-hover flex items-center justify-center gap-2 group transition-all duration-300"
          >
            <span>
              {showAllAttachments ? "Show Less" : "View More Attachments"}
            </span>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-300 ${
                showAllAttachments ? "rotate-180" : ""
              }`}
            />
          </button>
        )}
      </div>
    </div>
  );
}
