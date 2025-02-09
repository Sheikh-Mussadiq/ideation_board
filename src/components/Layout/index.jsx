import React from 'react';
import PropTypes from 'prop-types';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import MainContent from './MainContent';

export default function Layout({ children }) {
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

Layout.propTypes = {
  children: PropTypes.node.isRequired
};