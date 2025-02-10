import React from 'react';
import { Send, Loader2, Wand2 } from 'lucide-react';

export function PostForm({ formData, isLoading, onSubmit, onChange, onPrefill }) {
  return (
    <div className="card p-8 animate-in slide-in-from-left">
      <div className="flex justify-between items-center mb-6">
        <h1>Create New Post</h1>
        <button
          type="button"
          onClick={onPrefill}
          className="btn-secondary group"
        >
          <Wand2 className="-ml-1 mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
          Prefill Form
        </button>
      </div>
      
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label htmlFor="channelIds" className="label">
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
            className="input bg-primary-light/50 focus:bg-white transition-colors"
          />
        </div>

        <div>
          <label htmlFor="publishTime" className="label">
            Publish Time *
          </label>
          <input
            type="datetime-local"
            id="publishTime"
            name="publishTime"
            value={formData.publishTime.split('.')[0]}
            onChange={onChange}
            required
            className="input hover:border-primary transition-colors"
          />
        </div>

        <div className="space-y-4">
          <h3>Content</h3>
          
          <div>
            <label htmlFor="content.title" className="label">
              Title *
            </label>
            <input
              type="text"
              id="content.title"
              name="content.title"
              value={formData.content.title}
              onChange={onChange}
              required
              className="input hover:border-primary transition-colors"
              placeholder="Enter post title"
            />
          </div>

          <div>
            <label htmlFor="content.text" className="label">
              Text *
            </label>
            <textarea
              id="content.text"
              name="content.text"
              value={formData.content.text}
              onChange={onChange}
              required
              rows={4}
              className="input hover:border-primary transition-colors"
              placeholder="Enter post content"
            />
          </div>

          <div>
            <label htmlFor="content.type" className="label">
              Content Type
            </label>
            <select
              id="content.type"
              name="content.type"
              value={formData.content.type}
              onChange={onChange}
              className="input hover:border-primary transition-colors"
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
          <label htmlFor="authorId" className="label">
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
            className="input bg-primary-light/50 focus:bg-white transition-colors"
          />
        </div>

        <div>
          <label htmlFor="actor" className="label">
            Actor *
          </label>
          <input
            type="text"
            id="actor"
            name="actor"
            value={formData.actor}
            onChange={onChange}
            required
            className="input hover:border-primary transition-colors"
            placeholder="Enter actor name"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed group hover:scale-[1.02] transition-transform"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
              <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white/80" />
              Posting...
            </>
          ) : (
            <>
              <Send className="-ml-1 mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              Create Post
            </>
          )}
        </button>
      </form>
    </div>
  );
}