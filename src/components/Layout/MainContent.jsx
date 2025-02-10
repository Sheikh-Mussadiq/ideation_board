import React from 'react';

export default function MainContent({ children }) {
  return (
    <div className="ml-16 pt-16 min-h-screen bg-gradient-to-br from-primary-light to-white">
      <main className="p-6 animate-in fade-in-50">
        {children}
      </main>
    </div>
  );
}