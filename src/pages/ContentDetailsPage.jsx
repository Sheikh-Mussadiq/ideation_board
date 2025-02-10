import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, ThumbsUp, Share2, MessageCircle, Loader2 } from 'lucide-react';
import Header from '../components/Header';

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
      <div className="min-h-screen bg-gradient-to-br from-primary-light to-white">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-light to-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-semantic-error-light border-l-4 border-semantic-error p-4 rounded-lg animate-in slide-in-from-top">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-semantic-error" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-semantic-error">{error || 'Content not found'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light to-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            to="/content"
            className="btn-ghost btn-sm rounded-full group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Content List
          </Link>
        </div>

        <div className="card animate-in fade-in-50">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900">{content.title}</h1>
              <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                content.status === 'published' ? 'bg-semantic-success-light text-semantic-success' :
                content.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                'bg-semantic-warning-light text-semantic-warning'
              }`}>
                {content.status}
              </span>
            </div>

            <div className="mb-8">
              <p className="text-sm text-gray-500 flex items-center gap-2">
                Created on {format(new Date(content.createdAt), 'MMMM d, yyyy')} • {content.type}
              </p>
            </div>

            <div className="prose max-w-none mb-8">
              <p className="text-gray-700 text-lg leading-relaxed">{content.content}</p>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <ThumbsUp className="h-5 w-5 text-primary" />
                  <span className="text-sm text-gray-600 font-medium">{content.metrics.likes} Likes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Share2 className="h-5 w-5 text-primary" />
                  <span className="text-sm text-gray-600 font-medium">{content.metrics.shares} Shares</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  <span className="text-sm text-gray-600 font-medium">{content.metrics.comments} Comments</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary-light px-6 py-4 rounded-b-lg">
            <div className="text-sm">
              <span className="font-medium text-primary">Total Engagement:</span>
              <span className="ml-2 text-primary-hover">{content.engagement}</span>
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