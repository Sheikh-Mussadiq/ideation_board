import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import { PostForm } from '../components/PostForm';
import { DebugPanel } from '../components/DebugPanel';
import { API_CONFIG } from '../config';

export default function PostFormPage() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [formData, setFormData] = useState({
    channelIds: ['656ef10f4695b4a5851a9452'],
    publishTime: '2025-11-24T11:44:33.977Z',
    content: {
      text: '',
      title: '',
      type: 'POST'
    },
    authorId: '5620ec175a5c8da16a01e2d2',
    actor: 'John Doe'
  });

  useEffect(() => {
    const prefillData = location.state?.prefillData;
    if (prefillData) {
      setFormData(prefillData);
      toast.success('Form prefilled with card content');
    }
  }, [location.state]);

  const handlePrefill = () => {
    setFormData({
      channelIds: ['656ef10f4695b4a5851a9452'],
      publishTime: '2025-11-24T11:44:33.977Z',
      content: {
        text: 'Sample post content',
        title: 'Sample post title',
        type: 'POST'
      },
      authorId: '5620ec175a5c8da16a01e2d2',
      actor: 'John Doe'
    });
    toast.success('Form prefilled with sample data');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setApiResponse(null);

    const apiUrl = `${API_CONFIG.BASE_URL}?accesstoken=${API_CONFIG.ACCESS_TOKEN}`;
    
    const requestPayload = {
      channelIds: formData.channelIds,
      publishTime: formData.publishTime,
      content: {
        text: formData.content.text,
        ...(formData.content.title ? { title: formData.content.title } : {}),
        type: formData.content.type
      },
      authorId: formData.authorId,
      actor: formData.actor
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify(requestPayload)
      });

      const responseData = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(responseData?.message || `Request failed with status ${response.status}`);
      }

      const apiResponseData = {
        data: responseData,
        status: response.status,
        statusText: response.statusText
      };

      setApiResponse(apiResponseData);
      toast.success('Post created successfully!');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create post';
      console.error('API Error:', errorMessage);
      
      const errorResponse = {
        error: true,
        status: 500,
        statusText: 'Error',
        data: { message: errorMessage }
      };

      setApiResponse(errorResponse);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PostForm
          formData={formData}
          isLoading={isLoading}
          onSubmit={handleSubmit}
          onChange={handleChange}
          onPrefill={handlePrefill}
        />
        <DebugPanel 
          formData={formData} 
          apiResponse={apiResponse}
        />
      </div>
    </div>
  );
}

PostFormPage.propTypes = {
  // No props needed as this is a top-level page component
};