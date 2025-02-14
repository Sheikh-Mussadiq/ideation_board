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
// import { useMouseRealtime } from '../hooks/useMouseRealtime';

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
  const { currentUser } = useAuth();
  // const username = "User1"; // Replace with actual username (e.g., from auth)
  // const users = useMouseRealtime(username);

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

  const loadBoards = async (payload) => {
    try {
      const loadedBoards = await fetchBoards(currentUser.accountId);
      setBoards(loadedBoards);
      if (loadedBoards.length > 0 && !selectedBoardId) {
        setSelectedBoardId(loadedBoards[0].id);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading boards:", error);
      toast.error("Failed to load boards");
      setIsLoading(false);
    }
  };

  // const handleCardChange = (updatedCard) => {
  //   console.log('Card change received:', updatedCard);

  //   if (updatedCard.type === 'DELETE') {
  //     setBoards(prev => prev.map(board => ({
  //       ...board,
  //       columns: board.columns.map(col => ({
  //         ...col,
  //         cards: col.cards.filter(card => card.id !== updatedCard.id)
  //       }))
  //     })));
  //     return;
  //   }

  //   setBoards(prev => prev.map(board => ({
  //     ...board,
  //     columns: board.columns.map(col => {
  //       if (col.id === updatedCard.column_id) {
  //         const existingCardIndex = col.cards.findIndex(card => card.id === updatedCard.id);
  //         const updatedCards = [...col.cards];

  //         if (existingCardIndex === -1 && updatedCard.type === 'INSERT') {
  //           // New card
  //           updatedCards.push(updatedCard);
  //         } else if (existingCardIndex !== -1) {
  //           // Update existing card
  //           updatedCards[existingCardIndex] = {
  //             ...updatedCards[existingCardIndex],
  //             ...updatedCard
  //           };
  //         }

  //         return {
  //           ...col,
  //           cards: updatedCards
  //         };
  //       }
  //       return col;
  //     })
  //   })));
  // };

  const handleCardChange = (updatedCard) => {
    // console.log('Card change received:', updatedCard);

    if (updatedCard.type === "DELETE") {
      setBoards((prev) =>
        prev.map((board) => ({
          ...board,
          columns: board.columns.map((col) => ({
            ...col,
            cards: col.cards.filter((card) => card.id !== updatedCard.id),
          })),
        }))
      );
      return;
    }

    setBoards((prevBoards) => {
      // Clone the boards to ensure a new reference
      const newBoards = prevBoards.map((board) => ({
        ...board,
        columns: board.columns.map((col) => {
          if (col.id === updatedCard.column_id) {
            // Clone the cards array to ensure reactivity
            let updatedCards = [...col.cards];

            if (updatedCard.type === "DELETE") {
              updatedCards = updatedCards.filter(
                (card) => card.id !== updatedCard.id
              );
            } else {
              const existingCardIndex = updatedCards.findIndex(
                (card) => card.id === updatedCard.id
              );
              if (existingCardIndex === -1 && updatedCard.type === "INSERT") {
                updatedCards.push(updatedCard);
              } else if (existingCardIndex !== -1) {
                updatedCards[existingCardIndex] = {
                  ...updatedCards[existingCardIndex],
                  ...updatedCard,
                };
              }
            }

            return { ...col, cards: updatedCards };
          }
          return col;
        }),
      }));

      return [...newBoards]; // Ensure a new array reference to trigger re-render
    });
  };

  const handleColumnChange = (updatedColumn) => {
    // console.log('Column change received:', updatedColumn);

    if (updatedColumn.type === "DELETE") {
      // Simply remove the column from the board, cascade delete will handle the cards
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

          // Ensure cards array exists
          const columnWithCards = {
            ...updatedColumn,
            cards: updatedColumn.cards || [],
          };

          if (existingColumnIndex === -1 && updatedColumn.type === "INSERT") {
            // New column
            updatedColumns.push(columnWithCards);
          } else if (existingColumnIndex !== -1) {
            // Update existing column while preserving cards
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
                // New comment
                updatedComments.push(updatedComment);
              } else if (existingCommentIndex !== -1) {
                // Update existing comment
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

  const handleLabelUpdate = (payload, payloadType) => {
    console.log("Label change received:", payload, payloadType);
  };

  // Set up realtime subscriptions
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
        setBoards((prev) => [...prev, newBoard]);
        setSelectedBoardId(newBoard.id);
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

  const handleDeleteBoard = async () => {
    if (!selectedBoardId) return;

    try {
      setLoading(true);
      await deleteBoard(selectedBoardId, currentUser.accountId);
      setBoards((prev) => prev.filter((board) => board.id !== selectedBoardId));
      setSelectedBoardId(
        boards.find((board) => board.id !== selectedBoardId)?.id || null
      );
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
          description: "Add description here",
          priority: "medium",
          labels: [],
          attachments: [],
          comments: [],
          position: 0, // Set initial position to 0
        },
        currentUser.accountId
      );

      // Update the frontend state
      const updatedBoards = boards.map((board) => ({
        ...board,
        columns: board.columns.map((col) => {
          if (col.id === columnId) {
            // Add new card at the beginning and shift other cards down
            const updatedCards = [
              newCard,
              ...col.cards.map((card) => ({
                ...card,
                position: card.position + 1,
              })),
            ];

            // Update all card positions in the database
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
          // Handle source column (remove card)
          if (!isSameColumn && col.id === sourceColumn.id) {
            return {
              ...col,
              cards: col.cards.filter((card) => card.id !== active.id),
            };
          }

          // Handle destination column (add/reorder card)
          if (col.id === overColumn.id) {
            let updatedCards;

            if (isSameColumn) {
              // For same column, reorder the cards
              const cards = [...col.cards];
              const oldIndex = cards.findIndex((card) => card.id === active.id);
              const [movedCard] = cards.splice(oldIndex, 1);
              cards.splice(newPosition, 0, movedCard);
              updatedCards = cards;
            } else {
              // For different columns, add to destination
              updatedCards = [
                ...col.cards,
                { ...activeCard, column_id: overColumn.id },
              ];
            }

            // Update positions for all cards
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

      // Get all cards that need position updates
      const cardsToUpdate = updatedBoards
        .flatMap((board) => board.columns)
        .find((col) => col.id === overColumn.id).cards;

      if (isSameColumn) {
        // Update positions for all cards in the same column
        await updateCardPositions(cardsToUpdate, currentUser.accountId);
      } else {
        // First move the card to new column, then update positions for all affected cards
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-light to-white p-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <div className="text-primary font-medium">Loading boards...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-button-tertiary-fill to-design-white p-6 dark:from-button-tertiary-fill/10 dark:to-design-black">
      {/* {Object.values(users).map((user) => (
        <div
          key={user.username}
          style={{
            position: "absolute",
            left: user.x,
            top: user.y,
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }}
        >
          🖱️ <span style={{ fontSize: 12, background: "black", color: "white", padding: "2px", borderRadius: "4px" }}>{user.username}</span>
        </div>
      ))} */}
      <div className="mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-button-primary-cta dark:text-button-primary-text">
              Ideation Board
            </h1>
            <div className="relative">
              <select
                value={selectedBoardId || ""}
                onChange={(e) => setSelectedBoardId(e.target.value)}
                className="appearance-none bg-design-white/80 backdrop-blur-sm border border-button-primary-cta/20 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-button-primary-cta transition-all hover:border-button-primary-cta dark:bg-design-black/50 dark:border-button-primary-cta/10"
              >
                {boards.map((board) => (
                  <option key={board.id} value={board.id}>
                    {board.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-button-primary-cta pointer-events-none" />
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
                  className="input"
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
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddingBoard(true)}
                  className="btn-primary group hover:scale-105 transition-transform"
                >
                  <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform" />
                  Add Board
                </button>
                {selectedBoardId && (
                  <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="btn-ghost p-2 hover:text-semantic-error hover:rotate-90 transition-all"
                    title="Delete Board"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {selectedBoard && (
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-6 overflow-x-auto pb-4 min-h-[calc(100vh-12rem)]">
              <SortableContext
                items={selectedBoard.columns.map((col) => col.id)}
              >
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
      </div>
      <ResetDataButton />

      <DeleteBoardModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteBoard}
        boardTitle={selectedBoard?.title || ""}
      />
    </div>
  );
}
