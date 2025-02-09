import React from 'react';
import { Check, Link, X, ExternalLink } from 'lucide-react';

interface PostSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLink: () => void;
  postUrl?: string | null;
}

export default function PostSuccessModal({ isOpen, onClose, onAddLink, postUrl }: PostSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-30" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-green-100 rounded-full p-2">
              <Check className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <h3 className="text-lg font-medium text-center mb-4">
            Successfully created post in Content Planner
          </h3>

          {postUrl && (
            <div className="mb-6 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 truncate mr-2">
                  {postUrl}
                </span>
                <a
                  href={postUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 text-indigo-600 hover:text-indigo-800"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 mt-6">
            <button
              onClick={onAddLink}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Link className="h-4 w-4 mr-2" />
              Add link to Content
            </button>
            
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <X className="h-4 w-4 mr-2" />
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}