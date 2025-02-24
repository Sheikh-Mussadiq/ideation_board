import React, { createContext, useContext, useState } from "react";
import { fetchBoardsList } from "../services/boardService";

const BoardContext = createContext();

export const BoardProvider = ({ children }) => {
  const [boardsList, setBoardsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadInitialBoards = async (accountId) => {
    try {
      setIsLoading(true);
      const boards = await fetchBoardsList();
      setBoardsList(boards);
    } catch (error) {
      console.error("Error loading initial boards:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateBoardsList = (boards) => {
    setBoardsList(boards);
  };

  return (
    <BoardContext.Provider
      value={{ boardsList, updateBoardsList, loadInitialBoards, isLoading }}
    >
      {children}
    </BoardContext.Provider>
  );
};

export const useBoards = () => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error("useBoards must be used within a BoardProvider");
  }
  return context;
};
