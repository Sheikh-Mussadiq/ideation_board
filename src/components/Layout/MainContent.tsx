import React from 'react';

interface MainContentProps {
  children: React.ReactNode;
}

export default function MainContent({ children }: MainContentProps) {
  return (
    <div className="ml-16 pt-16 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <main className="p-6">
        {children}
      </main>
    </div>
  );
}