import React, { useState, useEffect, useRef } from "react";
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import {
  Plus,
  ChevronDown,
  Trash2,
  Clock,
  ClipboardList,
  MoreVertical,
  FolderPlus,
  Archive,
  Share2,
  Upload,
} from "lucide-react";
import toast from "react-hot-toast";
import KanbanColumn from "../components/KanbanColumn";
import KanbanCard from "../components/KanbanCard";
import DeleteBoardModal from "../components/DeleteBoardModal";
import BoardSharingModal from "../components/BoardSharingModal";
import BoardLogs from "../components/BoardLogs";
import ArchivedCardsModal from "../components/ArchivedCardsModal";
import { fetchBoards } from "../services/boardService";
import {
  createCard,
  updateCard,
  deleteCard,
  moveCardToColumn,
  updateCardPositions,
} from "../services/cardService";
import {
  createColumn,
  deleteColumn,
  updateColumn,
} from "../services/columnService";
import { importTrelloData } from "../services/importTrelloData";
// import { createNotification } from "../services/notificationService";
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
import { supabase } from "../lib/supabase";
import { assigneeEmailService } from "../services/emailService";

export default function IdeationPage() {
  const {
    boardsList,
    isLoading: boardsLoading,
    loadInitialBoards,
    updateBoardsList,
    addBoard,
    removeBoardFromList,
  } = useBoards();
  const [selectedBoardId, setSelectedBoardId] = useState(null);
  const [activeCard, setActiveCard] = useState(null);
  const [isAddingBoard, setIsAddingBoard] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [isArchivedCardsOpen, setIsArchivedCardsOpen] = useState(false);
  const { currentUser, currentUserUsers, currentUserTeams, authUser } =
    useAuth();
  const activeUsers = usePresenceBroadcast(selectedBoardId, currentUser);
  const selectedBoard = boardsList.find(
    (board) => board.id === selectedBoardId
  );
  const [teamUsers, setTeamUsers] = useState([]);
  const navigate = useNavigate();
  const { boardId } = useParams();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const fileInputRef = useRef(null);
  const [newCardId, setNewCardId] = useState(null);

  const handleTrelloImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Add security checks
    if (file.size > 1 * 1024 * 1024) {
      // 1MB limit
      toast.error("File size too large. Maximum size is 1MB.");
      return;
    }

    if (file.type !== "application/json") {
      toast.error("Only JSON files are allowed.");
      return;
    }

    try {
      const fileContent = await file.text();
      const trelloJson = JSON.parse(fileContent);
      // // Validate JSON structure before parsing
      // if (
      //   !fileContent.includes('"cards"') ||
      //   !fileContent.includes('"lists"')
      // ) {
      //   throw new Error("Invalid Trello file format");
      // }

      // Basic validation to check if it's a Trello JSON
      if (
        !trelloJson.cards ||
        !trelloJson.lists ||
        !Array.isArray(trelloJson.cards) ||
        !Array.isArray(trelloJson.lists)
      ) {
        throw new Error("Invalid Trello JSON format");
      }

      // TODO: Here you would process the Trello JSON and create boards/cards
      toast.success("Successfully validated Trello JSON");

      const result = await importTrelloData(
        trelloJson,
        currentUser.accountId,
        authUser.id
      );

      if (result.success) {
        // Update the boards list with the new board data
        updateBoardsList((prevBoards) => {
          const boardIndex = prevBoards.findIndex(
            (b) => b.id === result.boardId
          );
          if (boardIndex >= 0) {
            // Replace existing board
            return prevBoards.map((b) =>
              b.id === result.boardId ? result.board : b
            );
          } else {
            // Add new board
            return [...prevBoards, result.board];
          }
        });

        setSelectedBoardId(result.boardId);
        navigate(`/ideation/${result.boardId}`);
        toast.success("Trello JSON imported successfully");
      } else {
        console.error("Import failed:", result.error);
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error processing Trello JSON:", error);
      toast.error("Invalid Trello JSON file");
    }
  };

  useEffect(() => {
    loadInitialBoards();
  }, []);

  useEffect(() => {
    setSelectedBoardId(boardId);
  }, [boardId]);

  useEffect(() => {
    setSelectedBoardId(boardId);
  }, [boardId]);

  useEffect(() => {
    if (!selectedBoard || !currentUser) {
      setTeamUsers([]);
      return;
    }

    let allowedUsers = new Set();

    if (selectedBoard.team_id) {
      // If board has team_id, include team users and admins
      const team = currentUserTeams.find(
        (team) => team._id === selectedBoard.team_id
      );
      if (team) {
        team.users
          .filter((userId) => userId !== currentUser.userId) // Skip current user from team users
          .forEach((userId) => allowedUsers.add(userId));
      }
      // Add admins when board has team_id
      currentUserUsers
        .filter((user) => user.role === "ADMIN")
        .forEach((admin) => allowedUsers.add(admin._id));
    } else if (selectedBoard.shared_users) {
      // If no team_id but has shared users, only include shared users
      selectedBoard.shared_users.forEach((userId) => allowedUsers.add(userId));
    }

    // Filter currentUserUsers based on allowed users
    const filteredUsers = currentUserUsers.filter((user) =>
      allowedUsers.has(user._id)
    );

    // Create final users array with current user and filtered team users
    const finalUsers = [
      // Add current user first (formatted to match team users structure)
      {
        _id: currentUser.userId,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        role: currentUser.role,
        userName: currentUser.userName,
      },
      // Add other users, excluding current user if they're already in the team
      ...filteredUsers.filter((user) => user._id !== currentUser._id),
    ];

    setTeamUsers(finalUsers);
  }, [
    selectedBoard?.team_id,
    selectedBoard?.shared_users,
    currentUserTeams,
    currentUserUsers,
    selectedBoard,
    currentUser,
  ]);

  const handleBoardChange = async (payload) => {
    // If it's a delete event, just remove the board from state
    if (payload?.type === "DELETE") {
      updateBoardsList(boardsList.filter((board) => board.id !== payload.id));

      // If the deleted board was selected, select another board
      if (selectedBoardId === payload.id) {
        const remainingBoards = boardsList.filter(
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

    // For other changes, update the board in the list
    const updatedBoards = await fetchBoards();
    updateBoardsList(updatedBoards);
  };

  useEffect(() => {
    if (!boardsLoading) {
      if (boardsList.length === 0) {
        // If there are no boards, navigate to /ideation
        navigate("/ideation");
      } else if (boardId) {
        // If URL has boardId, verify it exists and select it
        const boardExists = boardsList.some((board) => board.id === boardId);
        if (boardExists) {
          setSelectedBoardId(boardId);
        } else {
          // If board doesn't exist, select first board and update URL
          setSelectedBoardId(boardsList[0].id);
          navigate(`/ideation/${boardsList[0].id}`);
        }
      } else {
        // No boardId in URL, select first board and update URL
        setSelectedBoardId(boardsList[0].id);
        navigate(`/ideation/${boardsList[0].id}`);
      }
    }
  }, [boardsList, boardsLoading, boardId, navigate]);

  const handleBoardSelect = (boardId) => {
    setSelectedBoardId(boardId);
    navigate(`/ideation/${boardId}`);
  };

  const handleCardChange = (updatedCard) => {
    updateBoardsList((prevBoards) => {
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
      updateBoardsList((prev) =>
        prev.map((board) => ({
          ...board,
          columns: board.columns.filter((col) => col.id !== updatedColumn.id),
        }))
      );
      return;
    }

    updateBoardsList((prev) =>
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
      updateBoardsList((prev) =>
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

    updateBoardsList((prev) =>
      prev.map((board) => ({
        ...board,
        columns: board.columns.map((col) => ({
          ...col,
          cards: col.cards.map((card) => {
            if (card.id === updatedComment.card_id) {
              const currentComments = card.comments || [];
              const existingCommentIndex = currentComments.findIndex(
                (comment) => comment.id === updatedComment.id
              );
              const updatedComments = [...currentComments];

              if (existingCommentIndex === -1 && eventType === "INSERT") {
                updatedComments.unshift(updatedComment);
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
  useRealtimeBoards(handleBoardChange);
  useLoadingCursor(loading);

  const handleAddBoard = async () => {
    if (newBoardTitle.trim()) {
      try {
        setLoading(true);
        const newBoard = await addBoard(
          newBoardTitle.trim(),
          currentUser.accountId,
          authUser.id
        );
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

  const handleDeleteBoard = async () => {
    if (!selectedBoardId) return;

    try {
      setLoading(true);
      await removeBoardFromList(selectedBoardId);

      // Find next available board
      const nextBoard = boardsList.find(
        (board) => board.id !== selectedBoardId
      );
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

        updateBoardsList((prev) =>
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
      await deleteColumn(columnId, currentUser.accountId);

      updateBoardsList((prev) =>
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

  const handleUpdateColumn = async (columnId, updates) => {
    try {
      setLoading(true);
      await updateColumn(columnId, updates, currentUser.accountId);

      updateBoardsList((prev) =>
        prev.map((board) => ({
          ...board,
          columns: board.columns.map((col) =>
            col.id === columnId ? { ...col, ...updates } : col
          ),
        }))
      );

      toast.success("Column updated successfully");
    } catch (error) {
      console.error("Error updating column:", error);
      toast.error("Failed to update column");
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
          assignee: [],
          position: 0, // Set initial position to 0
        },
        currentUser.accountId
      );

      setNewCardId(newCard.id); // Store the new card ID

      updateBoardsList((prev) => {
        const updatedBoards = prev.map((board) => ({
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
        return updatedBoards;
      });

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

      let oldCard = null;

      // Get the current (old) card from state only if updates has assignee
      if (updates.assignee && updates.assignee.length > 0) {
        oldCard = boardsList
          .flatMap((board) => board.columns)
          .flatMap((col) => col.cards)
          .find((card) => card.id === cardId);
      }

      // Perform the update (e.g., API call)
      await updateCard(cardId, updates, currentUser.accountId);

      // Update the boards state with the new card data
      updateBoardsList((prev) =>
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

      // If there are new assignees in the update, check against the old assignee list.
      if (updates.assignee && updates.assignee.length > 0 && oldCard) {
        // Extract _id values from the old card's assignee list (assuming they are objects)
        const oldAssigneeIds = Array.isArray(oldCard.assignee)
          ? oldCard.assignee.map((user) => user._id)
          : [];

        // Filter updates.assignee to only include truly new IDs and skip entries without _id
        const newAssignees = updates.assignee.filter(
          (user) =>
            user._id !== currentUser.userId &&
            !oldAssigneeIds.includes(user._id)
        );

        // Use the new title if provided; otherwise fallback to the old card title
        const cardTitle = updates.title || oldCard.title;

        newAssignees.length > 0 &&
          assigneeEmailService(
            newAssignees,
            currentUser.firstName,
            cardTitle,
            selectedBoardId,
            selectedBoard.title
          );
        // Create notifications for the new assignees
        for (const user of newAssignees) {
          try {
            if (!user._id || !cardTitle || !selectedBoard.title) {
              throw new Error("Missing required data for notification");
            }
            await supabase.from("notifications").insert([
              {
                user_id: user._id,
                content: `You've been assigned to "${cardTitle}" in board "${selectedBoard.title}"`,
                type: "CARD_ASSIGNMENT",
                board_id: selectedBoard.id,
                card_id: cardId,
                created_at: new Date().toISOString(),
                read: false,
              },
            ]);
          } catch (error) {
            console.error("Error creating notification:", error);
          }
        }
      }
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

      updateBoardsList((prev) =>
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

      updateBoardsList((prev) =>
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
    const card = boardsList
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

    const activeCard = boardsList
      .flatMap((board) => board.columns)
      .flatMap((col) => col.cards)
      .find((card) => card.id === active.id);

    const sourceColumn = boardsList
      .flatMap((board) => board.columns)
      .find((col) => col.cards.some((card) => card.id === active.id));

    const overCard = boardsList
      .flatMap((board) => board.columns)
      .flatMap((col) => col.cards)
      .find((card) => card.id === over.id);

    const overColumn = overCard
      ? boardsList
          .flatMap((board) => board.columns)
          .find((col) => col.cards.includes(overCard))
      : boardsList
          .flatMap((board) => board.columns)
          .find((col) => col.id === over.id);

    if (!activeCard || !overColumn) return;

    const isSameColumn = sourceColumn.id === overColumn.id;
    const newPosition = overCard
      ? overColumn.cards.findIndex((card) => card.id === over.id)
      : overColumn.cards.length;

    try {
      updateBoardsList((prev) => {
        const updatedBoards = prev.map((board) => ({
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
                const oldIndex = cards.findIndex(
                  (card) => card.id === active.id
                );
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
        return updatedBoards;
      });

      const cardsToUpdate = boardsList
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

  const handleRestoreCard = async (cardId, columnId, position) => {
    try {
      // Update the board state to include the restored card
      updateBoardsList((prev) =>
        prev.map((board) => ({
          ...board,
          columns: board.columns.map((col) => {
            if (col.id === columnId) {
              // Find the card and update its archived status
              const cardIndex = col.cards.findIndex((c) => c.id === cardId);
              if (cardIndex !== -1) {
                // Card already exists in column, just update archived status
                return {
                  ...col,
                  cards: col.cards.map((c) =>
                    c.id === cardId ? { ...c, archived: false } : c
                  ),
                };
              } else {
                // Card not found in column, add it back
                // We would need the full card details here, which should come from the ArchivedCardsModal
                return col;
              }
            }
            return col;
          }),
        }))
      );

      toast.success("Card restored successfully");
    } catch (error) {
      console.error("Error restoring card:", error);
      toast.error("Failed to restore card");
    }
  };

  const BoardActions = () => {
    const buttonRef = useRef(null);

    const dropdownItems = [
      {
        label: "Board History",
        icon: <Clock className="h-4 w-4" />,
        onClick: () => setIsLogsOpen(true),
        visible: true,
      },
      {
        label: "Archived Cards",
        icon: <Archive className="h-4 w-4" />,
        onClick: () => setIsArchivedCardsOpen(true),
        visible: true,
      },
      {
        label: "Delete Board",
        icon: <Trash2 className="h-4 w-4 text-semantic-error" />,
        onClick: () => setIsDeleteModalOpen(true),
        className: "text-semantic-error",
        visible: selectedBoard?.created_by === authUser.id,
      },
    ];

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (buttonRef.current && !buttonRef.current.contains(event.target)) {
          setIsActionsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
      <div className="relative" ref={buttonRef}>
        <button
          onClick={() => setIsActionsOpen(!isActionsOpen)}
          className="btn-ghost p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <MoreVertical className="h-5 w-5" />
        </button>

        {isActionsOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
            {dropdownItems
              .filter((item) => item.visible)
              .map((item, index) => (
                <button
                  key={index}
                  onClick={item.onClick}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 ${
                    item.className || ""
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
          </div>
        )}
      </div>
    );
  };

  if (boardsLoading) {
    return (
      <div className="h-[calc(100vh-4rem)] mt-8 border border-design-greyOutlines rounded-3xl bg-gradient-to-br from-primary-light to-white dark:from-design-black dark:to-design-black p-6">
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

  if (!boardsLoading && boardsList.length === 0) {
    return (
      <div className="h-[calc(100vh-4rem)] mt-8 border border-design-greyOutlines rounded-3xl bg-gradient-to-br from-primary-light to-white dark:from-design-black dark:to-design-black p-6">
        <div className="h-full flex flex-col items-center justify-center">
          <div className="bg-primary-light/30 p-6 rounded-full mb-6">
            <ClipboardList className="w-16 h-16 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
            No Boards Yet
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 text-center max-w-md">
            Create your first board to start organizing your ideas and tasks in
            a visual way.
          </p>
          {isAddingBoard ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newBoardTitle}
                onChange={(e) => setNewBoardTitle(e.target.value)}
                placeholder="Enter board title..."
                className="input p-2"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newBoardTitle.trim()) {
                    e.preventDefault();
                    handleAddBoard();
                  }
                }}
              />
              <button
                onClick={handleAddBoard}
                className="btn-primary"
                disabled={!newBoardTitle.trim()}
              >
                Create
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
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={() => setIsAddingBoard(true)}
                className="btn-primary flex items-center gap-2 px-6 py-3 text-lg animate-bounce"
              >
                <Plus className="h-5 w-5" />
                Create Your First Board
              </button>

              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleTrelloImport}
                  ref={fileInputRef}
                  className="hidden"
                  id="trello-import"
                />
                <label
                  htmlFor="trello-import"
                  className="btn-secondary flex items-center gap-2 cursor-pointer"
                >
                  <Upload className="h-5 w-5" />
                  Import from Trello
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] bg-design-white border border-design-greyOutlines rounded-3xl dark:bg-design-black p-6 flex flex-col mt-8">
      <div className="flex-none mb-4">
        <div className="flex items-center justify-between border-b border-design-greyOutlines">
          <h1 className="text-2xl font-semibold">
            {selectedBoard && selectedBoard.title}
          </h1>
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newBoardTitle.trim()) {
                      e.preventDefault();
                      handleAddBoard();
                    }
                  }}
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
                  className="btn-primary group flex items-center gap-2 px-3 py-2 sm:px-4"
                >
                  <FolderPlus className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span className="hidden sm:inline">Add Board</span>
                </button>

                <input
                  type="file"
                  accept=".json"
                  onChange={handleTrelloImport}
                  ref={fileInputRef}
                  className="hidden"
                  id="trello-import-header"
                />
                <label
                  htmlFor="trello-import-header"
                  className="btn-secondary group flex items-center gap-2 px-3 py-2 sm:px-4 cursor-pointer"
                >
                  <Upload className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span className="hidden sm:inline">Import Trello</span>{" "}
                </label>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 mt-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsTeamModalOpen(true)}
              className={`btn-secondary text-sm ${
                selectedBoard && selectedBoard.created_by === authUser.id
                  ? ""
                  : "hidden"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 mr-2 ${
                  selectedBoard &&
                  (selectedBoard.team_id ||
                    selectedBoard?.shared_users?.length > 0)
                    ? "bg-green-400"
                    : "bg-red-400"
                } rounded-full`}
              ></span>
              Share Board
            </button>
            <div className="flex -space-x-3">
              {activeUsers.map((user, index) => (
                <Tooltip
                  key={user.accountId}
                  text={`${user.firstName} ${user.lastName}`}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white bg-design-primaryPurple  cursor-pointer border-2 border-white shadow-lg transition-transform hover:scale-110"
                    style={{
                      zIndex: activeUsers.length - index,
                      backgroundColor: `hsl(${(index * 60) % 360}, 70%, 50%)`, // Creates different colors for each user
                    }}
                  >
                    {`${user.firstName[0]}${user.lastName[0]}`}
                  </div>
                </Tooltip>
              ))}
            </div>
          </div>
          {selectedBoardId && <BoardActions />}
        </div>
      </div>

      {selectedBoard && (
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6 overflow-x-auto flex-1 min-h-0">
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
                  onUpdateColumn={handleUpdateColumn}
                  boardId={selectedBoard.id}
                  teamUsers={teamUsers}
                  boardTitle={selectedBoard.title}
                  newCardId={newCardId}
                  onCardModalClose={() => setNewCardId(null)}
                />
              ))}
            </SortableContext>

            {isAddingColumn ? (
              <div className="flex-shrink-0 w-80 bg-primary-light/50 backdrop-blur-sm rounded-lg p-4 snap-start animate-in slide-in-from-right">
                <input
                  type="text"
                  value={newColumnTitle}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newColumnTitle.trim()) {
                      e.preventDefault();
                      handleAddColumn();
                    }
                  }}
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
                className="flex-shrink-0 w-80 bg-design-greyBG/50 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-center text-primary hover:text-primary-hover hover:bg-primary-light/50 transition-all  snap-start group"
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
                teamUsers={teamUsers}
                boardTitle={selectedBoard.title}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      <DeleteBoardModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteBoard}
        boardTitle={selectedBoard?.title || ""}
      />
      <BoardSharingModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        board={selectedBoard}
        updateBoardsList={updateBoardsList}
        teams={currentUserTeams}
        users={currentUserUsers}
        currentUser={currentUser}
      />
      <BoardLogs
        isOpen={isLogsOpen}
        setIsOpen={setIsLogsOpen}
        board={selectedBoard}
      />
      <ArchivedCardsModal
        isOpen={isArchivedCardsOpen}
        onClose={() => setIsArchivedCardsOpen(false)}
        onRestoreCard={() => {
          setIsArchivedCardsOpen(false);
        }}
        boardId={selectedBoardId}
      />
    </div>
  );
}
