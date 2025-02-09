import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, ThumbsUp, Share2, MessageCircle, Loader2 } from 'lucide-react';
import Header from '../components/Header';
import { fetchContentById } from '../services/contentService';
import PropTypes from 'prop-types';

export default function ContentDetailsPage() {
  const { id } = useParams();
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadContent = async () => {
      if (!id) return;
      try {
        const data = await fetchContentById(id);
        setContent(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load content');
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error || 'Content not found'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            to="/content"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Content List
          </Link>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900">{content.title}</h1>
              <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                content.status === 'published' ? 'bg-green-100 text-green-800' :
                content.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {content.status}
              </span>
            </div>

            <div className="mb-8">
              <p className="text-sm text-gray-500">
                Created on {format(new Date(content.createdAt), 'MMMM d, yyyy')} • {content.type}
              </p>
            </div>

            <div className="prose max-w-none mb-8">
              <p className="text-gray-700 text-lg">{content.content}</p>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <ThumbsUp className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">{content.metrics.likes} Likes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Share2 className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">{content.metrics.shares} Shares</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">{content.metrics.comments} Comments</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4">
            <div className="text-sm">
              <span className="font-medium text-gray-900">Total Engagement:</span>
              <span className="ml-2 text-gray-600">{content.engagement}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ContentDetailsPage.propTypes = {
  // No props needed as this is a top-level page component
};