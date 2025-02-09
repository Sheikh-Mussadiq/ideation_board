import React from 'react';
import PropTypes from 'prop-types';
import { Send, Loader2, Wand2 } from 'lucide-react';

export function PostForm({ formData, isLoading, onSubmit, onChange, onPrefill }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create New Post</h1>
        <button
          type="button"
          onClick={onPrefill}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Wand2 className="-ml-1 mr-2 h-4 w-4" />
          Prefill Form
        </button>
      </div>
      
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label htmlFor="channelIds" className="block text-sm font-medium text-gray-700">
            Channel ID *
          </label>
          <input
            type="text"
            id="channelIds"
            name="channelIds"
            value={formData.channelIds[0]}
            onChange={onChange}
            required
            readOnly
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="publishTime" className="block text-sm font-medium text-gray-700">
            Publish Time *
          </label>
          <input
            type="datetime-local"
            id="publishTime"
            name="publishTime"
            value={formData.publishTime.split('.')[0]}
            onChange={onChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Content</h3>
          
          <div>
            <label htmlFor="content.title" className="block text-sm font-medium text-gray-700">
              Title *
            </label>
            <input
              type="text"
              id="content.title"
              name="content.title"
              value={formData.content.title}
              onChange={onChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter post title"
            />
          </div>

          <div>
            <label htmlFor="content.text" className="block text-sm font-medium text-gray-700">
              Text *
            </label>
            <textarea
              id="content.text"
              name="content.text"
              value={formData.content.text}
              onChange={onChange}
              required
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter post content"
            />
          </div>

          <div>
            <label htmlFor="content.type" className="block text-sm font-medium text-gray-700">
              Content Type
            </label>
            <select
              id="content.type"
              name="content.type"
              value={formData.content.type}
              onChange={onChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="POST">Post</option>
              <option value="COMMENT">Comment</option>
              <option value="THREAD">Thread</option>
              <option value="MESSAGE">Message</option>
              <option value="RATING">Rating</option>
              <option value="TICKET">Ticket</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="authorId" className="block text-sm font-medium text-gray-700">
            Author ID *
          </label>
          <input
            type="text"
            id="authorId"
            name="authorId"
            value={formData.authorId}
            onChange={onChange}
            required
            readOnly
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="actor" className="block text-sm font-medium text-gray-700">
            Actor *
          </label>
          <input
            type="text"
            id="actor"
            name="actor"
            value={formData.actor}
            onChange={onChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter actor name"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
              Posting...
            </>
          ) : (
            <>
              <Send className="-ml-1 mr-2 h-4 w-4" />
              Create Post
            </>
          )}
        </button>
      </form>
    </div>
  );
}

PostForm.propTypes = {
  formData: PropTypes.shape({
    channelIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    publishTime: PropTypes.string.isRequired,
    content: PropTypes.shape({
      text: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired
    }).isRequired,
    authorId: PropTypes.string.isRequired,
    actor: PropTypes.string.isRequired
  }).isRequired,
  isLoading: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onPrefill: PropTypes.func.isRequired
};