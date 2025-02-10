import React from 'react';
import { Check, Link, X, ExternalLink } from 'lucide-react';

export default function PostSuccessModal({ isOpen, onClose, onAddLink, postUrl }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black/25" onClick={onClose}></div>
        
        <div className="relative card max-w-md w-full p-6">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-semantic-success-light rounded-full p-2 animate-bounce">
              <Check className="h-8 w-8 text-semantic-success" />
            </div>
          </div>
          
          <h3 className="text-lg font-semibold text-center mb-4 text-gray-800">
            Successfully created post in Content Planner
          </h3>

          {postUrl && (
            <div className="mb-6 p-3 bg-primary-light rounded-lg hover:bg-primary-light/80 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 truncate mr-2">
                  {postUrl}
                </span>
                <a
                  href={postUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 text-primary hover:text-primary-hover transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 mt-6">
            <button
              onClick={onAddLink}
              className="btn-primary w-full group"
            >
              <Link className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
              Add link to Content
            </button>
            
            <button
              onClick={onClose}
              className="btn-secondary w-full group"
            >
              <X className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}