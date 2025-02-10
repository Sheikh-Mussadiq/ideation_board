import React from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import MainContent from './MainContent';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light to-white">
      <Sidebar />
      <TopBar />
      <MainContent>
        {children}
      </MainContent>
    </div>
  );
}