import React, { createContext, useContext, useState } from "react";

const BoardContext = createContext();

export const BoardProvider = ({ children }) => {
  const [boardsList, setBoardsList] = useState([]);

  const updateBoardsList = (boards) => {
    setBoardsList(boards);
  };

  return (
    <BoardContext.Provider value={{ boardsList, updateBoardsList }}>
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
