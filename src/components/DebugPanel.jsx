import React from 'react';
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
    <div className="card p-6 space-y-6 animate-in slide-in-from-right">
      <div>
        <h2 className="mb-4">Debug Panel</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="label mb-2">API Request Details:</h3>
            <pre className="bg-primary-light/30 rounded-lg p-4 overflow-auto max-h-[200px] text-sm font-mono">
              {JSON.stringify(requestDetails, null, 2)}
            </pre>
          </div>

          <div>
            <h3 className="label mb-2">CURL Command:</h3>
            <pre className="bg-primary-light/30 rounded-lg p-4 overflow-auto max-h-[200px] text-sm font-mono whitespace-pre-wrap">
              {curlCommand}
            </pre>
          </div>

          <div>
            <h3 className="label mb-2">API Response:</h3>
            <pre className="bg-primary-light/30 rounded-lg p-4 overflow-auto max-h-[200px] text-sm font-mono">
              {apiResponse ? JSON.stringify(apiResponse, null, 2) : 'No response yet'}
            </pre>
          </div>
        </div>

        <div className="text-xs text-gray-500 mt-4">
          <p>* Request details are updated in real-time as you modify the form</p>
          {apiResponse?.error && (
            <p className="text-semantic-error mt-2 animate-in slide-in-from-right">
              * Error occurred: {apiResponse.data?.message || 'Unknown error'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}