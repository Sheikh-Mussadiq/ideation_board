import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import MainContent from "./MainContent";
import { useAuth } from "../../context/AuthContext";
import { useBoards } from "../../context/BoardContext";

export default function Layout({ children }) {
  const { currentUser } = useAuth();
  const { loadInitialBoards } = useBoards();

  useEffect(() => {
    if (currentUser?.accountId) {
      loadInitialBoards(currentUser.accountId);
    }
  }, [currentUser?.accountId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light to-white">
      <Sidebar />
      <TopBar />
      <MainContent>{children}</MainContent>
    </div>
  );
}
