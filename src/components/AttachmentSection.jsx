import React, { useState, useRef } from "react";
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
  Loader2,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useWindowDimensions } from "../hooks/useWindowDimensions";
import { useScrollLock } from "../hooks/useScrollLock";

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
  boardId,
  boardTitle,
}) {
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [newLink, setNewLink] = useState("");
  const [linkError, setLinkError] = useState(null);
  const [showAllAttachments, setShowAllAttachments] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loadingFileId, setLoadingFileId] = useState(null);
  const [imageUrls, setImageUrls] = useState({});
  const { width: windowWidth } = useWindowDimensions();
  const imageContainerRef = useRef(null);

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

  const getFileCategory = (filename) => {
    if (!filename) return "link";
    const ext = filename.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "img";
    if (["mp4", "mov", "avi", "webm"].includes(ext)) return "video";
    if (["pdf", "doc", "docx", "txt"].includes(ext)) return "doc";
    return "other";
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
        file_type: "link",
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

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Generate a unique file path
      const fileExt = file.name.split(".").pop();
      const fileName = `${
        file.name.substring(0, file.name.lastIndexOf(".")) || file.name
      }_${Date.now()}.${fileExt}`;
      const filePath = `${boardTitle} ${boardId}/${fileName}`;

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from("ideation_media")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      // Add attachment to the card with just the storage path
      onAddAttachment({
        id: Date.now().toString(),
        type: "file",
        file_type: getFileCategory(file.name),
        storagePath: filePath,
        name: file.name,
        size: file.size,
        createdAt: new Date().toISOString(),
      });

      toast.success("File uploaded successfully");
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteAttachment = async (attachmentId) => {
    const attachment = attachments.find((a) => a.id === attachmentId);
    if (!attachment) return;

    setIsDeleting(true);
    setLoadingFileId(attachmentId);
    try {
      // If it's a file type and has a storage path, delete from Supabase Storage
      if (attachment.type === "file" && attachment.storagePath) {
        const { error } = await supabase.storage
          .from("ideation_media")
          .remove([attachment.storagePath]);

        if (error) throw error;
      }

      // Delete from database
      onDeleteAttachment(attachmentId);
      toast.success("Attachment deleted successfully");
    } catch (error) {
      console.error("Error deleting attachment:", error);
      toast.error("Failed to delete attachment");
    } finally {
      setIsDeleting(false);
      setLoadingFileId(null);
    }
  };

  const getSignedUrl = async (storagePath) => {
    try {
      setLoadingFileId(storagePath);
      const { data, error } = await supabase.storage
        .from("ideation_media")
        .createSignedUrl(storagePath, 3600); // URL valid for 60 minutes
      // .createSignedUrl(storagePath, 63072000); // URL valid for 2 years

      if (error) throw error;

      return data.signedUrl;
    } catch (error) {
      console.error("Error generating signed URL:", error);
      toast.error("Failed to generate download link");
      return null;
    } finally {
      setLoadingFileId(null);
      toast.success("Download link valid for 60 minutes");
    }
  };

  const handleFileDownload = async (attachment) => {
    if (attachment.type !== "file" || !attachment.storagePath) return;

    const signedUrl = await getSignedUrl(attachment.storagePath);
    if (signedUrl) {
      // Open the signed URL in a new tab
      window.open(signedUrl, "_blank");
    }
  };

  const getImageSignedUrl = async (storagePath) => {
    try {
      const { data, error } = await supabase.storage
        .from("ideation_media")
        .createSignedUrl(storagePath, 86400); // 24 hours = 86400 seconds

      if (error) throw error;
      return data.signedUrl;
    } catch (error) {
      console.error("Error generating image signed URL:", error);
      return null;
    }
  };

  React.useEffect(() => {
    const loadImageUrls = async () => {
      const imageAttachments = attachments.filter((a) => a.file_type === "img");
      const urls = {};

      for (const attachment of imageAttachments) {
        if (attachment.storagePath) {
          const signedUrl = await getImageSignedUrl(attachment.storagePath);
          if (signedUrl) {
            urls[attachment.storagePath] = signedUrl;
          }
        }
      }

      setImageUrls(urls);
    };

    loadImageUrls();
  }, [attachments]);

  const visibleAttachments = showAllAttachments
    ? attachments
    : attachments.slice(0, 2);
  const hasMoreAttachments = attachments.length > 2;

  return (
    <div className="space-y-4 bg-white/50 backdrop-blur-sm border border-design-greyOutlines/20 p-3 sm:p-4 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center text-sm font-medium text-design-primaryGrey">
          <Paperclip className="h-5 w-5 mr-2 text-design-primaryPurple" />
          Attachments
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-start sm:justify-end">
          <button
            onClick={() => setIsAddingLink(true)}
            disabled={isUploading || isDeleting}
            className="flex items-center px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-design-primaryPurple bg-design-lightPurpleButtonFill rounded-lg hover:bg-button-primary-cta hover:text-white transition-all duration-300 transform hover:scale-105 disabled:opacity-50 flex-1 sm:flex-auto justify-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Link
          </button>
          <label
            className={`flex items-center px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-design-primaryPurple bg-design-lightPurpleButtonFill rounded-lg hover:bg-button-primary-cta hover:text-white transition-all duration-300 transform hover:scale-105 cursor-pointer flex-1 sm:flex-auto justify-center ${
              isUploading ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-1" />
                Upload File
              </>
            )}
            <input
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isUploading || isDeleting}
            />
          </label>
        </div>
      </div>

      {isAddingLink && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{
              opacity: 1,
              y: 0,
              height: "auto",
              transition: {
                type: "spring",
                stiffness: 500,
                damping: 30,
              },
            }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="overflow-hidden"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-design-greyOutlines/20"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <motion.input
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  type="url"
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  placeholder="Enter URL..."
                  className={`input flex-1 p-2 w-full overflow-hidden text-ellipsis ${
                    linkError ? "border-semantic-error" : ""
                  }`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddLink();
                    }
                  }}
                />
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddLink}
                    className="btn-primary flex-1 sm:flex-none justify-center"
                  >
                    Add
                  </motion.button>
                  <motion.button
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => {
                      setIsAddingLink(false);
                      setNewLink("");
                      setLinkError(null);
                    }}
                    className="btn-ghost p-2"
                  >
                    <X className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>
              {linkError && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-semantic-error mt-2 break-words overflow-hidden"
                >
                  {linkError}
                </motion.p>
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}

      <div className="space-y-2">
        {visibleAttachments.map((attachment) => (
          <div
            key={attachment.id}
            className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-white border border-design-greyOutlines/20 rounded-lg hover:border-design-primaryPurple/30 transition-all duration-300 transform hover:scale-[1.01] hover:shadow-sm gap-3"
          >
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-design-lightPurpleButtonFill flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                <FileTypeIcon type={attachment.name} className="h-5 w-5" />
              </div>
              <div className="flex flex-col min-w-0 flex-1 sm:flex-auto">
                <span className="text-sm font-medium text-gray-800 group-hover:text-design-primaryPurple transition-colors duration-300 truncate max-w-[150px] sm:max-w-[200px] md:max-w-[300px] lg:max-w-[400px] overflow-hidden text-ellipsis">
                  {attachment.name}
                </span>
                {attachment.type === "link" && (
                  <span className="text-xs text-design-primaryGrey truncate max-w-[150px] sm:max-w-[200px] md:max-w-[300px] lg:max-w-[400px] overflow-hidden text-ellipsis">
                    {attachment.url}
                  </span>
                )}
                <span className="text-xs text-design-primaryGrey">
                  Added {new Date(attachment.createdAt).toLocaleDateString()}
                  {attachment.size &&
                    ` • ${Math.round(attachment.size / 1024)} KB`}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between w-full sm:w-auto gap-2">
              {attachment.file_type === "img" && attachment.storagePath && (
                <div className="w-16 h-16 sm:w-20 sm:h-20 overflow-hidden rounded-lg relative flex-shrink-0">
                  {imageUrls[attachment.storagePath] ? (
                    <img
                      src={imageUrls[attachment.storagePath]}
                      alt={attachment.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                      <Loader2 className="h-4 w-4 animate-spin text-design-primaryGrey" />
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center space-x-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-auto">
                {attachment.type === "link" ? (
                  <a
                    href={attachment.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-full hover:bg-design-lightPurpleButtonFill text-design-primaryGrey hover:text-design-primaryPurple transition-all duration-300"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : (
                  <button
                    onClick={() => handleFileDownload(attachment)}
                    disabled={loadingFileId === attachment.storagePath}
                    className="p-2 rounded-full hover:bg-design-lightPurpleButtonFill text-design-primaryGrey hover:text-design-primaryPurple transition-all duration-300 disabled:opacity-50"
                  >
                    {loadingFileId === attachment.storagePath ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                  </button>
                )}
                <button
                  onClick={() => handleDeleteAttachment(attachment.id)}
                  disabled={isDeleting || loadingFileId === attachment.id}
                  className="p-2 rounded-full hover:bg-semantic-error-light text-design-primaryGrey hover:text-semantic-error transition-all duration-300 disabled:opacity-50"
                >
                  {loadingFileId === attachment.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                </button>
              </div>
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
