import React from 'react';
import { Beaker } from 'lucide-react';
import Header from '../components/Header';
import PropTypes from 'prop-types';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Beaker className="h-6 w-6 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">Test Environment</h1>
            </div>
            
            <div className="prose max-w-none">
              <p className="text-gray-600">
                This is a test environment where you can experiment with new features and functionality.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

TestPage.propTypes = {
  // No props needed as this is a top-level page component
};