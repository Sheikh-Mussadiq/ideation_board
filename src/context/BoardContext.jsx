// import React, { createContext, useContext, useState } from "react";
// import { fetchBoardsList } from "../services/boardService";

// const BoardContext = createContext();

// export const BoardProvider = ({ children }) => {
//   const [boardsList, setBoardsList] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   const loadInitialBoards = async (accountId) => {
//     try {
//       setIsLoading(true);
//       const boards = await fetchBoardsList();
//       setBoardsList(boards);
//     } catch (error) {
//       console.error("Error loading initial boards:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const updateBoardsList = (boards) => {
//     setBoardsList(boards);
//   };

//   return (
//     <BoardContext.Provider
//       value={{ boardsList, updateBoardsList, loadInitialBoards, isLoading }}
//     >
//       {children}
//     </BoardContext.Provider>
//   );
// };

// export const useBoards = () => {
//   const context = useContext(BoardContext);
//   if (!context) {
//     throw new Error("useBoards must be used within a BoardProvider");
//   }
//   return context;
// };

import React, { createContext, useContext, useState } from "react";
import { fetchBoards, createBoard, updateBoard, deleteBoard } from "../services/boardService";

const BoardContext = createContext();

export const BoardProvider = ({ children }) => {
  const [boardsList, setBoardsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadInitialBoards = async () => {
    try {
      setIsLoading(true);
      const boards = await fetchBoards();
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

  const addBoard = async (title, accountId, userId) => {
    try {
      const newBoard = await createBoard(title, accountId, userId);
      setBoardsList((prev) => [...prev, newBoard]);
      return newBoard;
    } catch (error) {
      console.error("Error adding board:", error);
      throw error;
    }
  };

  const updateBoardInList = async (boardId, updates) => {
    try {
      await updateBoard(boardId, updates);
      setBoardsList((prev) =>
        prev.map((board) =>
          board.id === boardId ? { ...board, ...updates } : board
        )
      );
    } catch (error) {
      console.error("Error updating board:", error);
      throw error;
    }
  };

  const removeBoardFromList = async (boardId) => {
    try {
      await deleteBoard(boardId);
      setBoardsList((prev) => prev.filter((board) => board.id !== boardId));
    } catch (error) {
      console.error("Error removing board:", error);
      throw error;
    }
  };

  return (
    <BoardContext.Provider
      value={{ 
        boardsList, 
        updateBoardsList, 
        loadInitialBoards, 
        isLoading,
        addBoard,
        updateBoardInList,
        removeBoardFromList
      }}
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