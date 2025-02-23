import React, { useState, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { Plus, ChevronDown, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import KanbanColumn from "../components/KanbanColumn";
import KanbanCard from "../components/KanbanCard";
import ResetDataButton from "../components/ResetDataButton";
import DeleteBoardModal from "../components/DeleteBoardModal";
import {
  fetchBoards,
  createBoard,
  updateBoard,
  deleteBoard,
  assignBoardToTeam,
  unassignBoardFromTeam,
} from "../services/boardService";
import {
  createCard,
  updateCard,
  deleteCard,
  moveCardToColumn,
  updateCardPositions,
} from "../services/cardService";
import { createColumn, deleteColumn } from "../services/columnService";
import { useRealtimeCards } from "../hooks/useRealtimeCards";
import { useRealtimeColumns } from "../hooks/useRealtimeColumns";
import { useLoadingCursor } from "../hooks/useLoadingCursor";
import { useAuth } from "../context/AuthContext";
import { useRealtimeCardComments } from "../hooks/useRealtimeCardComments";
import { useRealtimeBoards } from "../hooks/useRealtimeBoards";
import { usePresenceBroadcast } from "../hooks/usePresenceBroadcast";
import { useNavigate, useParams } from "react-router-dom";
import LoadingShimmer from "../components/LoadingShimmer";
import Tooltip from "../components/Tooltip";
import { useBoards } from "../context/BoardContext";

export default function IdeationPage() {
  const [boards, setBoards] = useState([]);
  const [selectedBoardId, setSelectedBoardId] = useState(null);
  const [activeCard, setActiveCard] = useState(null);
  const [isAddingBoard, setIsAddingBoard] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const { currentUser, currentUserUsers, currentUserTeams } = useAuth();
  const activeUsers = usePresenceBroadcast(selectedBoardId, currentUser);
  const navigate = useNavigate();
  const { boardId } = useParams();
  const { updateBoardsList } = useBoards();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    loadBoards();
  }, []);

  useEffect(() => {
    setSelectedBoardId(boardId);
  }, [boardId]);
  const loadBoards = async (payload) => {
    try {
      // If it's a delete event, just remove the board from state
      if (payload?.type === "DELETE") {
        setBoards((prev) => prev.filter((board) => board.id !== payload.id));
        // If the deleted board was selected, select another board
        if (selectedBoardId === payload.id) {
          const remainingBoards = boards.filter(
            (board) => board.id !== payload.id
          );
          if (remainingBoards.length > 0) {
            setSelectedBoardId(remainingBoards[0].id);
            navigate(`/ideation/${remainingBoards[0].id}`);
          } else {
            setSelectedBoardId(null);
            navigate("/ideation");
          }
        }
        return;
      }

      // Otherwise load all boards
      const loadedBoards = await fetchBoards(currentUser.accountId);
      setBoards(loadedBoards);
      updateBoardsList(loadedBoards); // Update the global boards list

      if (loadedBoards.length > 0) {
        if (boardId) {
          // If URL has boardId, verify it exists and select it
          const boardExists = loadedBoards.some(
            (board) => board.id === boardId
          );
          if (boardExists) {
            setSelectedBoardId(boardId);
          } else {
            // If board doesn't exist, select first board and update URL
            setSelectedBoardId(loadedBoards[0].id);
            navigate(`/ideation/${loadedBoards[0].id}`);
          }
        } else {
          // No boardId in URL, select first board and update URL
          setSelectedBoardId(loadedBoards[0].id);
          navigate(`/ideation/${loadedBoards[0].id}`);
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading boards:", error);
      toast.error("Failed to load boards");
      setIsLoading(false);
    }
  };
  const handleBoardSelect = (boardId) => {
    setSelectedBoardId(boardId);
    navigate(`/ideation/${boardId}`);
  };

  const handleCardChange = (updatedCard) => {
    setBoards((prevBoards) => {
      // Find the card's current location in any column
      let sourceColumnId;
      let cardFound = false;

      const newBoards = prevBoards.map((board) => ({
        ...board,
        columns: board.columns.map((col) => {
          // First, remove the card from its current position if it exists
          const cardInThisColumn = col.cards.find(
            (card) => card.id === updatedCard.id
          );
          if (cardInThisColumn) {
            sourceColumnId = col.id;
            cardFound = true;
          }

          // Remove card from current column
          const filteredCards = col.cards.filter(
            (card) => card.id !== updatedCard.id
          );

          // If this is the target column for the card
          if (col.id === updatedCard.column_id) {
            // Insert card at the correct position
            const newCards = [...filteredCards];
            if (updatedCard.type !== "DELETE") {
              // Create new card object with all necessary properties
              const cardToInsert = {
                ...(cardFound
                  ? prevBoards
                      .flatMap((b) => b.columns)
                      .flatMap((c) => c.cards)
                      .find((c) => c.id === updatedCard.id)
                  : {}),
                ...updatedCard,
                position: updatedCard.position || 0,
              };

              // Insert card at the specified position
              newCards.splice(updatedCard.position, 0, cardToInsert);
            }

            // Sort cards by position
            newCards.sort((a, b) => a.position - b.position);

            return { ...col, cards: newCards };
          }

          return { ...col, cards: filteredCards };
        }),
      }));

      return newBoards;
    });
  };

  const handleColumnChange = (updatedColumn) => {
    if (updatedColumn.type === "DELETE") {
      setBoards((prev) =>
        prev.map((board) => ({
          ...board,
          columns: board.columns.filter((col) => col.id !== updatedColumn.id),
        }))
      );
      return;
    }

    setBoards((prev) =>
      prev.map((board) => {
        if (board.id === updatedColumn.board_id) {
          const existingColumnIndex = board.columns.findIndex(
            (col) => col.id === updatedColumn.id
          );
          const updatedColumns = [...board.columns];

          const columnWithCards = {
            ...updatedColumn,
            cards: updatedColumn.cards || [],
          };

          if (existingColumnIndex === -1 && updatedColumn.type === "INSERT") {
            updatedColumns.push(columnWithCards);
          } else if (existingColumnIndex !== -1) {
            updatedColumns[existingColumnIndex] = {
              ...updatedColumns[existingColumnIndex],
              ...columnWithCards,
              cards: updatedColumns[existingColumnIndex].cards || [],
            };
          }

          return {
            ...board,
            columns: updatedColumns,
          };
        }
        return board;
      })
    );
  };

  const handleCommentChange = (updatedComment, eventType) => {
    if (eventType === "DELETE") {
      setBoards((prev) =>
        prev.map((board) => ({
          ...board,
          columns: board.columns.map((col) => ({
            ...col,
            cards: col.cards.map((card) => ({
              ...card,
              comments: card.comments
                ? card.comments.filter(
                    (comment) => comment.id !== updatedComment
                  )
                : [],
            })),
          })),
        }))
      );
      return;
    }

    setBoards((prev) =>
      prev.map((board) => ({
        ...board,
        columns: board.columns.map((col) => ({
          ...col,
          cards: col.cards.map((card) => {
            if (card.id === updatedComment.card_id) {
              const existingCommentIndex = card.comments.findIndex(
                (comment) => comment.id === updatedComment.id
              );
              const updatedComments = [...card.comments];

              if (existingCommentIndex === -1 && eventType === "INSERT") {
                updatedComments.push(updatedComment);
              } else if (existingCommentIndex !== -1) {
                updatedComments[existingCommentIndex] = {
                  ...updatedComments[existingCommentIndex],
                  ...updatedComment,
                };
              }

              return {
                ...card,
                comments: updatedComments,
              };
            }
            return card;
          }),
        })),
      }))
    );
  };

  useRealtimeCards(selectedBoardId || "", handleCardChange);
  useRealtimeColumns(selectedBoardId || "", handleColumnChange);
  useRealtimeCardComments(selectedBoardId, handleCommentChange);
  useRealtimeBoards(currentUser.accountId, loadBoards);
  useLoadingCursor(loading);

  const handleAddBoard = async () => {
    if (newBoardTitle.trim()) {
      try {
        setLoading(true);
        const newBoard = await createBoard(
          newBoardTitle.trim(),
          currentUser.accountId
        );
        const updatedBoards = [...boards, newBoard];
        setBoards(updatedBoards);
        updateBoardsList(updatedBoards); // Update global boards list
        setSelectedBoardId(newBoard.id);
        navigate(`/ideation/${newBoard.id}`);
        setNewBoardTitle("");
        setIsAddingBoard(false);
        toast.success("Board created successfully");
      } catch (error) {
        console.error("Error creating board:", error);
        toast.error("Failed to create board");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAssignBoardToTeam = async (teamId) => {
    console.log("Assigning board to team:", selectedBoardId, teamId);
    try {
      setLoading(true);
      await assignBoardToTeam(selectedBoardId, teamId);
      // const response = await assignBoardToTeam(selectedBoardId, teamId);

      // console.log("response: ", response);
      // if (!response) {
      //   toast.error("Failed to unassign board from team");
      //   return;
      // }

      setBoards((prev) =>
        prev.map((board) =>
          board.id === selectedBoardId ? { ...board, team_id: teamId } : board
        )
      );

      toast.success("Board assigned to team successfully");
      setIsTeamModalOpen(false);
      setSelectedTeam(null);
    } catch (error) {
      console.error("Error assigning board to team:", error);
      toast.error("Failed to assign board to team");
    } finally {
      setLoading(false);
    }
  };

  const handleUnassignBoardFromTeam = async (teamId) => {
    console.log("Unassigning board from team:", selectedBoardId, teamId);
    try {
      setLoading(true);
      // const response = await unassignBoardFromTeam(selectedBoardId);
       await unassignBoardFromTeam(selectedBoardId);

      // console.log("response: ", response);
      // if (!response) {
      //   toast.error("Failed to unassign board from team");
      //   return;
      // }
      setBoards((prev) =>
        prev.map((board) =>
          board.id === selectedBoardId ? { ...board, team_id: null } : board
        )
      );
      toast.success("Board unassigned from team successfully");
      setIsTeamModalOpen(false);
      setSelectedTeam(null);
    } catch (error) {
      console.error("Error unassigning board from team:", error);
      toast.error("Failed to unassign board from team");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBoard = async () => {
    if (!selectedBoardId) return;

    try {
      setLoading(true);
      await deleteBoard(selectedBoardId, currentUser.accountId);
      const updatedBoards = boards.filter(
        (board) => board.id !== selectedBoardId
      );
      setBoards(updatedBoards);
      updateBoardsList(updatedBoards); // Update global boards list

      // Find next available board
      const nextBoard = boards.find((board) => board.id !== selectedBoardId);
      if (nextBoard) {
        setSelectedBoardId(nextBoard.id);
        navigate(`/ideation/${nextBoard.id}`);
      } else {
        setSelectedBoardId(null);
        navigate("/ideation");
      }

      toast.success("Board deleted successfully");
    } catch (error) {
      console.error("Error deleting board:", error);
      toast.error("Failed to delete board");
    } finally {
      setIsDeleteModalOpen(false);
      setLoading(false);
    }
  };
  const handleAddColumn = async () => {
    if (newColumnTitle.trim() && selectedBoardId) {
      try {
        setLoading(true);
        const newColumn = await createColumn(
          selectedBoardId,
          newColumnTitle.trim(),
          currentUser.accountId
        );
        setBoards((prev) =>
          prev.map((board) =>
            board.id === selectedBoardId
              ? { ...board, columns: [...board.columns, newColumn] }
              : board
          )
        );
        setNewColumnTitle("");
        setIsAddingColumn(false);
        toast.success("Column added successfully");
      } catch (error) {
        console.error("Error adding column:", error);
        toast.error("Failed to add column");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteColumn = async (columnId) => {
    if (!selectedBoardId) return;

    try {
      setLoading(true);
      const response = await deleteColumn(columnId, currentUser.accountId);

      setBoards((prev) =>
        prev.map((board) =>
          board.id === selectedBoardId
            ? {
                ...board,
                columns: board.columns.filter((col) => col.id !== columnId),
              }
            : board
        )
      );
      toast.success("Column deleted successfully");
    } catch (error) {
      console.error("Error deleting column:", error);
      toast.error("Failed to delete column");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = async (columnId) => {
    try {
      setLoading(true);
      const newCard = await createCard(
        columnId,
        {
          title: "New Task",
          priority: "medium",
          description: "Add a description...",
          labels: [],
          attachments: [],
          position: 0, // Set initial position to 0
        },
        currentUser.accountId
      );

      const updatedBoards = boards.map((board) => ({
        ...board,
        columns: board.columns.map((col) => {
          if (col.id === columnId) {
            const updatedCards = [
              newCard,
              ...col.cards.map((card) => ({
                ...card,
                position: card.position + 1,
              })),
            ];

            updateCardPositions(updatedCards).catch((error) => {
              console.error("Error updating card positions:", error);
            });

            return {
              ...col,
              cards: updatedCards,
            };
          }
          return col;
        }),
      }));

      setBoards(updatedBoards);
      toast.success("Card added successfully");
    } catch (error) {
      console.error("Error adding card:", error);
      toast.error("Failed to add card");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCard = async (cardId, updates) => {
    try {
      setLoading(true);
      await updateCard(cardId, updates, currentUser.accountId);
      setBoards((prev) =>
        prev.map((board) => ({
          ...board,
          columns: board.columns.map((col) => ({
            ...col,
            cards: col.cards.map((card) =>
              card.id === cardId ? { ...card, ...updates } : card
            ),
          })),
        }))
      );
    } catch (error) {
      console.error("Error updating card:", error);
      toast.error("Failed to update card");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCard = async (cardId) => {
    try {
      setLoading(true);
      await deleteCard(cardId, currentUser.accountId);
      setBoards((prev) =>
        prev.map((board) => ({
          ...board,
          columns: board.columns.map((col) => ({
            ...col,
            cards: col.cards.filter((card) => card.id !== cardId),
          })),
        }))
      );
      toast.success("Card deleted successfully");
    } catch (error) {
      console.error("Error deleting card:", error);
      toast.error("Failed to delete card");
    } finally {
      setLoading(false);
    }
  };

  const handleArchiveCard = async (cardId) => {
    try {
      await updateCard(cardId, { archived: true }, currentUser.accountId);
      setBoards((prev) =>
        prev.map((board) => ({
          ...board,
          columns: board.columns.map((col) => ({
            ...col,
            cards: col.cards.map((card) =>
              card.id === cardId ? { ...card, archived: true } : card
            ),
          })),
        }))
      );
      toast.success("Card archived successfully");
    } catch (error) {
      console.error("Error archiving card:", error);
      toast.error("Failed to archive card");
    }
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const card = boards
      .flatMap((board) => board.columns)
      .flatMap((col) => col.cards)
      .find((card) => card.id === active.id);

    if (card) {
      setActiveCard(card);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over) return;

    const activeCard = boards
      .flatMap((board) => board.columns)
      .flatMap((col) => col.cards)
      .find((card) => card.id === active.id);

    const sourceColumn = boards
      .flatMap((board) => board.columns)
      .find((col) => col.cards.some((card) => card.id === active.id));

    const overCard = boards
      .flatMap((board) => board.columns)
      .flatMap((col) => col.cards)
      .find((card) => card.id === over.id);

    const overColumn = overCard
      ? boards
          .flatMap((board) => board.columns)
          .find((col) => col.cards.includes(overCard))
      : boards
          .flatMap((board) => board.columns)
          .find((col) => col.id === over.id);

    if (!activeCard || !overColumn) return;

    const isSameColumn = sourceColumn.id === overColumn.id;
    const newPosition = overCard
      ? overColumn.cards.findIndex((card) => card.id === over.id)
      : overColumn.cards.length;

    try {
      const updatedBoards = boards.map((board) => ({
        ...board,
        columns: board.columns.map((col) => {
          if (!isSameColumn && col.id === sourceColumn.id) {
            return {
              ...col,
              cards: col.cards.filter((card) => card.id !== active.id),
            };
          }

          if (col.id === overColumn.id) {
            let updatedCards;

            if (isSameColumn) {
              const cards = [...col.cards];
              const oldIndex = cards.findIndex((card) => card.id === active.id);
              const [movedCard] = cards.splice(oldIndex, 1);
              cards.splice(newPosition, 0, movedCard);
              updatedCards = cards;
            } else {
              updatedCards = [
                ...col.cards,
                { ...activeCard, column_id: overColumn.id },
              ];
            }

            const finalCards = updatedCards.map((card, index) => ({
              ...card,
              position: index,
              column_id: overColumn.id,
            }));

            return {
              ...col,
              cards: finalCards,
            };
          }

          return col;
        }),
      }));

      setBoards(updatedBoards);

      const cardsToUpdate = updatedBoards
        .flatMap((board) => board.columns)
        .find((col) => col.id === overColumn.id).cards;

      if (isSameColumn) {
        await updateCardPositions(cardsToUpdate, currentUser.accountId);
      } else {
        await moveCardToColumn(
          activeCard.id,
          overColumn.id,
          newPosition,
          currentUser.accountId
        );
        await updateCardPositions(cardsToUpdate, currentUser.accountId);
      }
    } catch (error) {
      console.error("Error moving card:", error);
      toast.error("Failed to move card");
    }

    setActiveCard(null);
  };

  const selectedBoard = boards.find((board) => board.id === selectedBoardId);

  useEffect(() => {
    console.log(currentUser, "board: ", selectedBoard);
  }, [currentUser, selectedBoard]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-light to-white dark:from-design-black dark:to-design-black p-6">
        <div className="mx-auto">
          {/* Header shimmer */}
          <div className="flex justify-between items-center mb-8">
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
          </div>

          <LoadingShimmer />
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-design-white border border-design-greyOutlines rounded-3xl dark:bg-design-black p-6 flex flex-col mt-8">
      <div className="flex-none">
        <div>
          <h1 className="text-2xl font-semibold">{selectedBoard.title}</h1>
        </div>
        <div className="flex items-center justify-between gap-4 mt-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsTeamModalOpen(true)}
              className="btn-secondary text-sm"
            >
              <span
                className={`h-1 w-1 mr-2  ${
                  selectedBoard.team_id ? "bg-green-300" : "bg-red-300"
                } rounded-full`}
              ></span>
              Assign to Team
            </button>
            <div className="flex -space-x-3">
              {activeUsers.map((user, index) => (
                <>
                  <Tooltip text={user.firstName}>
                    <img
                      src={user.avatarUrl}
                      alt={user.firstName}
                      className="w-8 h-8 rounded-full cursor-pointer border-2 border-white shadow-lg"
                      style={{ zIndex: activeUsers.length - index }} // Ensures correct stacking order
                    />
                  </Tooltip>
                </>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAddingBoard ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newBoardTitle}
                  onChange={(e) => setNewBoardTitle(e.target.value)}
                  placeholder="Board title..."
                  className="input p-2"
                  autoFocus
                />
                <button onClick={handleAddBoard} className="btn-primary">
                  Add
                </button>
                <button
                  onClick={() => {
                    setIsAddingBoard(false);
                    setNewBoardTitle("");
                  }}
                  className="btn-ghost"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 m-2">
                <button
                  onClick={() => setIsAddingBoard(true)}
                  className="btn-primary group hover:scale-105 transition-transform"
                >
                  <Plus className="h-4 w-4  group-hover:rotate-90 transition-transform" />
                  Add Board
                </button>
                {selectedBoardId && (
                  <>
                    <button
                      onClick={() => setIsDeleteModalOpen(true)}
                      className="btn-ghost p-2 hover:text-semantic-error transition-all"
                      title="Delete Board"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedBoard && (
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6 overflow-x-auto flex-1 scrollbar-hide">
            <SortableContext items={selectedBoard.columns.map((col) => col.id)}>
              {selectedBoard.columns.map((column) => (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  onAddCard={() => handleAddCard(column.id)}
                  onUpdateCard={handleUpdateCard}
                  onDeleteCard={handleDeleteCard}
                  onArchiveCard={handleArchiveCard}
                  onDeleteColumn={() => handleDeleteColumn(column.id)}
                  boardId={selectedBoard.id}
                  boardTitle={selectedBoard.title}
                />
              ))}
            </SortableContext>

            {isAddingColumn ? (
              <div className="flex-shrink-0 w-80 bg-primary-light/50 backdrop-blur-sm rounded-lg p-4 snap-start animate-in slide-in-from-right">
                <input
                  type="text"
                  value={newColumnTitle}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                  placeholder="Column title..."
                  className="input"
                  autoFocus
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button onClick={handleAddColumn} className="btn-primary">
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingColumn(false);
                      setNewColumnTitle("");
                    }}
                    className="btn-ghost"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingColumn(true)}
                className="flex-shrink-0 w-80 bg-primary-light/30 backdrop-blur-sm rounded-lg p-4 flex items-center justify-center text-primary hover:text-primary-hover hover:bg-primary-light/50 transition-all hover:scale-105 snap-start group"
              >
                <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform" />
                Add Column
              </button>
            )}
          </div>

          <DragOverlay>
            {activeCard ? (
              <KanbanCard
                card={activeCard}
                isDragging
                onUpdate={handleUpdateCard}
                onDelete={handleDeleteCard}
                onArchive={handleArchiveCard}
                boardId={selectedBoard.id}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      <ResetDataButton />

      <DeleteBoardModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteBoard}
        boardTitle={selectedBoard?.title || ""}
      />
      {isTeamModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-design-black rounded-lg p-6 w-96 max-w-[90%] shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Assign Board to Team</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {currentUserTeams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => setSelectedTeam(team)}
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                    selectedTeam?.id === team.id
                      ? "bg-primary-light dark:bg-primary-dark"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {team.name}
                </button>
              ))}
            </div>

            {selectedTeam && (
              <div className="mt-4 p-3 border border-gray-200 dark:border-gray-700 rounded-md">
                <p className="text-sm mb-2">
                  Assign board to team:{" "}
                  <span className="font-semibold">{selectedTeam.name}</span>?
                </p>
                <button
                  onClick={() => {
                    selectedBoard.team_id === selectedTeam._id
                      ? handleUnassignBoardFromTeam(selectedBoard.id)
                      : handleAssignBoardToTeam(selectedTeam._id);
                  }}
                  // disabled={selectedBoard.team_id === selectedTeam._id}
                  className="btn-primary text-sm"
                >
                  {
                    selectedBoard.team_id === selectedTeam._id
                      ? "Unassign"
                      : "  Yes, Assign" //
                  }
                </button>
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setIsTeamModalOpen(false);
                  setSelectedTeam(null);
                }}
                className="btn-ghost text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
