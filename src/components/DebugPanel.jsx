import React from 'react';
import PropTypes from 'prop-types';
import { API_CONFIG } from '../config';

export function DebugPanel({ formData, apiResponse }) {
  const requestDetails = {
    method: 'POST',
    url: `${API_CONFIG.BASE_URL}?accesstoken=${API_CONFIG.ACCESS_TOKEN}`,
    headers: {
      'Content-Type': 'application/json'
    },
    data: formData
  };

  const curlCommand = `curl -X POST "${API_CONFIG.BASE_URL}?accesstoken=${API_CONFIG.ACCESS_TOKEN}" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(formData, null, 2)}'`;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Debug Panel</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">API Request Details:</h3>
            <pre className="bg-gray-50 rounded-md p-4 overflow-auto max-h-[200px] text-sm">
              {JSON.stringify(requestDetails, null, 2)}
            </pre>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">CURL Command:</h3>
            <pre className="bg-gray-50 rounded-md p-4 overflow-auto max-h-[200px] text-sm whitespace-pre-wrap">
              {curlCommand}
            </pre>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">API Response:</h3>
            <pre className="bg-gray-50 rounded-md p-4 overflow-auto max-h-[200px] text-sm">
              {apiResponse ? JSON.stringify(apiResponse, null, 2) : 'No response yet'}
            </pre>
          </div>
        </div>

        <div className="text-xs text-gray-500 mt-4">
          <p>* Request details are updated in real-time as you modify the form</p>
          {apiResponse?.error && (
            <p className="text-red-500 mt-2">
              * Error occurred: {apiResponse.data?.message || 'Unknown error'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

DebugPanel.propTypes = {
  formData: PropTypes.shape({
    channelIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    publishTime: PropTypes.string.isRequired,
    content: PropTypes.shape({
      text: PropTypes.string.isRequired,
      title: PropTypes.string,
      type: PropTypes.string.isRequired
    }).isRequired,
    authorId: PropTypes.string.isRequired,
    actor: PropTypes.string.isRequired
  }).isRequired,
  apiResponse: PropTypes.shape({
    data: PropTypes.any,
    status: PropTypes.number,
    statusText: PropTypes.string,
    error: PropTypes.bool
  })
};