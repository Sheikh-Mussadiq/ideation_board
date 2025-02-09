import React from 'react';
import PropTypes from 'prop-types';

export default function MainContent({ children }) {
  return (
    <div className="ml-16 pt-16 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <main className="p-6">
        {children}
      </main>
    </div>
  );
}

MainContent.propTypes = {
  children: PropTypes.node.isRequired
};