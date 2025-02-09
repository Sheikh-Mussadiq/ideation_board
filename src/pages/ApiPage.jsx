import React from 'react';
import { Code2, Copy, ExternalLink } from 'lucide-react';
import Header from '../components/Header';
import toast from 'react-hot-toast';

const API_ENDPOINTS = [
  {
    method: 'POST',
    path: '/cp/posts',
    description: 'Create new content planner posts',
    example: `{
  "channelIds": ["656ef10f4695b4a5851a9452"],
  "publishTime": "2024-04-01T10:00:00.000Z",
  "content": {
    "text": "Post content",
    "title": "Post title",
    "type": "POST"
  },
  "authorId": "5620ec175a5c8da16a01e2d2",
  "actor": "System"
}`,
    response: `{
  "id": "67464d6f6e25ae7962e4eed2",
  "postId": "67464d6f6e25ae7962e4eed4",
  "status": "draft"
}`
  },
  {
    method: 'PUT',
    path: '/cp/posts/{id}',
    description: 'Update an existing post',
    example: `{
  "content": {
    "text": "Updated content",
    "title": "Updated title",
    "type": "POST"
  }
}`,
    response: `{
  "id": "67464d6f6e25ae7962e4eed2",
  "status": "draft"
}`
  },
  {
    method: 'GET',
    path: '/cp/posts/{id}',
    description: 'Get post details by ID',
    response: `{
  "id": "67464d6f6e25ae7962e4eed2",
  "status": "draft",
  "content": {
    "text": "Post content",
    "title": "Post title",
    "type": "POST"
  }
}`
  },
  {
    method: 'DELETE',
    path: '/cp/postGroups/{id}',
    description: 'Delete a post group and its related posts',
    response: '204 No Content'
  }
];

export default function ApiPage() {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">API Documentation</h1>
              <a
                href="https://automation-api.socialhub.io/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-900"
              >
                Full Documentation
                <ExternalLink className="ml-1 h-4 w-4" />
              </a>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-600 mb-8">
                The SocialHub API allows you to programmatically create, update, and manage posts in the Content Planner.
                Here are the main endpoints available:
              </p>

              <div className="space-y-8">
                {API_ENDPOINTS.map((endpoint, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                            endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                            endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'}`}>
                          {endpoint.method}
                        </span>
                        <code className="text-sm font-mono">{endpoint.path}</code>
                      </div>
                      <Code2 className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="p-4">
                      <p className="text-gray-600 mb-4">{endpoint.description}</p>
                      
                      {endpoint.example && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Request Body:</h4>
                          <div className="relative">
                            <pre className="bg-gray-50 rounded p-4 text-sm overflow-x-auto">
                              {endpoint.example}
                            </pre>
                            <button
                              onClick={() => copyToClipboard(endpoint.example)}
                              className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Response:</h4>
                        <div className="relative">
                          <pre className="bg-gray-50 rounded p-4 text-sm overflow-x-auto">
                            {endpoint.response}
                          </pre>
                          <button
                            onClick={() => copyToClipboard(endpoint.response)}
                            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}