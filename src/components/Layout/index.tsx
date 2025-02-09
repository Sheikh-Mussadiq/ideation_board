import React from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import MainContent from './MainContent';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <TopBar />
      <MainContent>
        {children}
      </MainContent>
    </div>
  );
}