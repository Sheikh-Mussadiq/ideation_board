import React, { useState } from 'react';
import { Paperclip, X, ExternalLink, Download } from 'lucide-react';
import { Attachment } from '../types';

interface AttachmentSectionProps {
  attachments: Attachment[];
  onAddAttachment: (attachment: Attachment) => void;
  onDeleteAttachment: (attachmentId: string) => void;
}

export default function AttachmentSection({
  attachments,
  onAddAttachment,
  onDeleteAttachment
}: AttachmentSectionProps) {
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [newLink, setNewLink] = useState('');
  const [linkError, setLinkError] = useState<string | null>(null);

  const isValidUrl = (urlString: string) => {
    try {
      // Add protocol if missing
      const urlToTest = urlString.match(/^https?:\/\//) ? urlString : `https://${urlString}`;
      new URL(urlToTest);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleAddLink = () => {
    setLinkError(null);
    
    if (!newLink.trim()) {
      setLinkError('Please enter a URL');
      return;
    }

    // Add protocol if missing
    const finalUrl = newLink.match(/^https?:\/\//) ? newLink : `https://${newLink}`;

    if (!isValidUrl(finalUrl)) {
      setLinkError('Please enter a valid URL');
      return;
    }
    
    try {
      const url = new URL(finalUrl);
      onAddAttachment({
        id: Date.now().toString(),
        type: 'link',
        url: finalUrl,
        name: url.hostname,
        createdAt: new Date().toISOString()
      });
      setNewLink('');
      setIsAddingLink(false);
    } catch (error) {
      setLinkError('Invalid URL format');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAddAttachment({
        id: Date.now().toString(),
        type: 'file',
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        createdAt: new Date().toISOString()
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-700">
          <Paperclip className="h-4 w-4 mr-2" />
          Attachments
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsAddingLink(true)}
            className="text-sm text-indigo-600 hover:text-indigo-900"
          >
            Add Link
          </button>
          <label className="cursor-pointer text-sm text-indigo-600 hover:text-indigo-900">
            Upload File
            <input
              type="file"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>
      </div>

      {isAddingLink && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="url"
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
              placeholder="Enter URL..."
              className={`flex-1 rounded-md border ${
                linkError ? 'border-red-300' : 'border-gray-300'
              } shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddLink();
                }
              }}
            />
            <button
              onClick={handleAddLink}
              className="px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Add
            </button>
            <button
              onClick={() => {
                setIsAddingLink(false);
                setNewLink('');
                setLinkError(null);
              }}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {linkError && (
            <p className="text-sm text-red-600">{linkError}</p>
          )}
        </div>
      )}

      <div className="space-y-2">
        {attachments.map(attachment => (
          <div
            key={attachment.id}
            className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-2">
              {attachment.type === 'link' ? (
                <ExternalLink className="h-4 w-4 text-gray-400" />
              ) : (
                <Paperclip className="h-4 w-4 text-gray-400" />
              )}
              <span className="text-sm text-gray-900">{attachment.name}</span>
              {attachment.size && (
                <span className="text-xs text-gray-500">
                  ({Math.round(attachment.size / 1024)} KB)
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <a
                href={attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 text-gray-400 hover:text-gray-600"
                onClick={(e) => e.stopPropagation()}
              >
                {attachment.type === 'link' ? (
                  <ExternalLink className="h-4 w-4" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
              </a>
              <button
                onClick={() => onDeleteAttachment(attachment.id)}
                className="p-1 text-gray-400 hover:text-red-600"
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