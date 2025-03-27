import React, { useState, useEffect, Fragment, useCallback } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  X,
  Archive,
  RefreshCw,
  Search,
  Calendar,
  LayoutGrid,
  List,
  Filter,
  CheckSquare,
} from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { useBoards } from "../context/BoardContext"; // Import the BoardContext hook
import Tooltip from "./Tooltip";

export default function ArchivedCardsModal({
  isOpen,
  onClose,
  onRestoreCard,
  boardId,
}) {
  const [archivedCards, setArchivedCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBoard, setSelectedBoard] = useState(boardId || "all");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [boards, setBoards] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentBoardTitle, setCurrentBoardTitle] = useState("");
  const { currentUser, authUser } = useAuth(); // Add authUser to the destructuring
  const { boardsList, updateBoardsList } = useBoards(); // Get boardsList and updateBoardsList from context

  // Use boardsList from context
  useEffect(() => {
    if (isOpen) {
      fetchArchivedCards();
      fetchBoards();
    }
  }, [isOpen, boardsList, boardId]); // Use boardsList as dependency

  useEffect(() => {
    if (boardId && boardsList.length > 0) {
      // Find the board title directly from boardsList
      const board = boardsList.find((b) => b.id === boardId);
      if (board) {
        setCurrentBoardTitle(board.title);
      }
    }
  }, [boardId, boardsList]);

  const fetchBoards = async () => {
    try {
      // Use boards from context instead of making a new API call
      setBoards(boardsList);
    } catch (error) {
      console.error("Error processing boards:", error);
    }
  };

  // Refactored to use only boardsList from context
  const fetchArchivedCards = async () => {
    setIsLoading(true);
    try {
      // Extract archived cards from boardsList in context
      const archivedCardsWithDetails = [];

      boardsList.forEach((board) => {
        // For boardId filter, only process the specified board
        if (boardId && board.id !== boardId) {
          return;
        }

        // Process the board if user is the creator or it's shared with them
        // const isCreator = board.created_by === authUser.id;
        // const isSharedWithUser = board.shared_users && board.shared_users.includes(authUser.id);

        // if (isCreator || isSharedWithUser) {
        board.columns.forEach((column) => {
          const archivedCardsInColumn = column.cards
            .filter((card) => card.archived)
            .map((card) => ({
              ...card,
              column: {
                id: column.id,
                title: column.title,
                board_id: board.id,
              },
              board: {
                id: board.id,
                title: board.title,
                created_by: board.created_by,
              },
            }));

          archivedCardsWithDetails.push(...archivedCardsInColumn);
        });
        // }
      });

      setArchivedCards(archivedCardsWithDetails);
      setIsLoading(false);
    } catch (error) {
      console.error("Error processing archived cards:", error);
      setIsLoading(false);
    }
  };

  const filterCards = useCallback(() => {
    if (!archivedCards) return [];

    let filteredCards = [...archivedCards];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredCards = filteredCards.filter(
        (card) =>
          card.title?.toLowerCase().includes(query) ||
          card.description?.toLowerCase().includes(query)
      );
    }

    // Filter by selected board (if not viewing boardId-specific cards)
    if (!boardId && selectedBoard !== "all") {
      filteredCards = filteredCards.filter(
        (card) => card.board.id === selectedBoard
      );
    }

    return filteredCards;
  }, [archivedCards, searchQuery, selectedBoard, boardId]);

  const handleRestoreCard = async (card) => {
    try {
      const { error } = await supabase
        .from("cards")
        .update({ archived: false })
        .eq("id", card.id);

      if (error) throw error;

      // Update the board state in context after restoring the card
      if (boardsList && boardsList.length > 0) {
        const updatedBoardsList = boardsList.map((board) => {
          // Find the board this card belongs to
          if (board.id === card.board.id) {
            // Clone the board
            const updatedBoard = { ...board };
            // Update the columns
            updatedBoard.columns = board.columns.map((column) => {
              // Find the column this card belongs to
              if (column.id === card.column.id) {
                // Clone the column
                const updatedColumn = { ...column };
                // Update the card's archived status
                updatedColumn.cards = column.cards.map((c) =>
                  c.id === card.id ? { ...c, archived: false } : c
                );
                return updatedColumn;
              }
              return column;
            });
            return updatedBoard;
          }
          return board;
        });

        // Update the boards list in context
        updateBoardsList(updatedBoardsList);
      }

      // Remove the card from the local state
      setArchivedCards((prev) => prev.filter((c) => c.id !== card.id));

      // Call the onRestoreCard callback if provided
      if (onRestoreCard) {
        onRestoreCard(card.id, card.column_id, card.position);
      }

      toast.success("Card restored successfully!", {
        icon: "🔄",
      });
    } catch (error) {
      console.error("Error restoring card:", error);
      toast.error("Failed to restore card");
    }
  };

  const handleDeleteCard = async (cardId) => {
    try {
      const { error } = await supabase.from("cards").delete().eq("id", cardId);

      if (error) throw error;

      setArchivedCards(archivedCards.filter((card) => card.id !== cardId));
      toast.success("Card permanently deleted");
    } catch (error) {
      console.error("Error deleting card:", error);
      toast.error("Failed to delete card");
    }
  };

  const truncateDescription = (text) => {
    if (!text) return "";
    const plainText = text.replace(/<\/?[^>]+>/g, "");
    return plainText.length > 100
      ? plainText.substring(0, 100) + "..."
      : plainText;
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-design-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <Archive className="h-6 w-6 text-design-primaryPurple mr-2" />
                    <Dialog.Title
                      as="h3"
                      className="text-xl font-medium text-design-black"
                    >
                      {boardId ? (
                        <>
                          {currentBoardTitle ? currentBoardTitle : "Board"}{" "}
                          Archived Cards
                        </>
                      ) : (
                        "All Archived Cards"
                      )}
                    </Dialog.Title>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X className="h-5 w-5 text-design-primaryGrey" />
                  </button>
                </div>

                {/* Search and Filter Bar */}
                <div className="mb-6 flex flex-wrap gap-3 items-center">
                  <div className="relative flex-grow max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-design-primaryGrey" />
                    <input
                      type="text"
                      placeholder="Search archived cards..."
                      className="pl-10 pr-4 py-2 w-full border border-design-greyOutlines rounded-lg focus:outline-none focus:ring-2 focus:ring-design-primaryPurple/20 focus:border-design-primaryPurple"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  {!boardId && (
                    <div className="relative">
                      <button
                        className="px-3 py-2 border border-design-greyOutlines rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors"
                        onClick={() => setFilterOpen(!filterOpen)}
                      >
                        <Filter className="h-4 w-4" />
                        <span>Filter</span>
                      </button>

                      {filterOpen && (
                        <div className="absolute top-full mt-2 left-0 bg-white shadow-lg rounded-lg p-3 border border-gray-100 min-w-[200px] z-10">
                          <div className="mb-3">
                            <label className="text-sm font-medium text-design-primaryGrey mb-1 block">
                              Board
                            </label>
                            <select
                              className="w-full p-2 border border-design-greyOutlines rounded-md"
                              value={selectedBoard}
                              onChange={(e) => setSelectedBoard(e.target.value)}
                            >
                              <option value="all">All Boards</option>
                              {boards.map((board) => (
                                <option key={board.id} value={board.id}>
                                  {board.title}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center border border-design-greyOutlines rounded-lg overflow-hidden">
                    <button
                      className={`p-2 ${
                        viewMode === "grid"
                          ? "bg-design-primaryPurple text-white"
                          : "text-design-primaryGrey hover:bg-gray-50"
                      }`}
                      onClick={() => setViewMode("grid")}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </button>
                    <button
                      className={`p-2 ${
                        viewMode === "list"
                          ? "bg-design-primaryPurple text-white"
                          : "text-design-primaryGrey hover:bg-gray-50"
                      }`}
                      onClick={() => setViewMode("list")}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>

                  <Tooltip text="Refresh" position="top">
                    <button
                      onClick={fetchArchivedCards}
                      className="p-2 border border-design-greyOutlines rounded-lg text-design-primaryGrey hover:bg-gray-50 transition-colors"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                  </Tooltip>
                </div>

                {/* Cards Container */}
                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="border border-gray-200 rounded-lg p-4 h-48"
                      >
                        <div className="animate-pulse">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                          <div className="h-12 bg-gray-200 rounded w-full mb-3"></div>
                          <div className="flex justify-between">
                            <div className="h-6 w-16 bg-gray-200 rounded"></div>
                            <div className="h-6 w-24 bg-gray-200 rounded"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filterCards().length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-10 text-design-primaryGrey">
                    <Archive className="h-16 w-16 mb-4 opacity-30" />
                    <p className="text-lg">No archived cards found</p>
                    <p className="text-sm mt-1">
                      Archive cards from your boards to see them here
                    </p>
                  </div>
                ) : viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto p-1">
                    {filterCards().map((card) => (
                      <div
                        key={card.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow group relative"
                      >
                        <div className="flex justify-between mb-1">
                          <span className="text-xs text-design-primaryGrey">
                            {card.board?.title} • {card.column?.title}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              card.priority === "high"
                                ? "bg-semantic-error-light text-semantic-error"
                                : card.priority === "medium"
                                ? "bg-semantic-warning-light text-semantic-warning"
                                : "bg-semantic-success-light text-semantic-success"
                            }`}
                          >
                            {card.priority}
                          </span>
                        </div>

                        <h3
                          className={`text-base font-medium text-design-black mb-2 ${
                            card.completed ? "line-through opacity-60" : ""
                          }`}
                        >
                          {card.title}
                        </h3>

                        {card.description && (
                          <p
                            className={`text-sm text-design-primaryGrey mb-3 ${
                              card.completed ? "line-through opacity-60" : ""
                            }`}
                          >
                            {truncateDescription(card.description)}
                          </p>
                        )}

                        <div className="flex justify-between items-center mt-auto">
                          <div className="flex items-center text-xs text-design-primaryGrey">
                            <Calendar className="h-3 w-3 mr-1" />
                            {card.updated_at &&
                              format(new Date(card.updated_at), "MMM d, yyyy")}
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleRestoreCard(card)}
                              className="p-1.5 text-xs rounded-lg bg-semantic-success/10 text-semantic-success hover:bg-semantic-success/20 transition-colors"
                            >
                              Restore
                            </button>
                            <button
                              onClick={() => handleDeleteCard(card.id)}
                              className="p-1.5 text-xs rounded-lg bg-semantic-error/10 text-semantic-error hover:bg-semantic-error/20 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        {card.completed && (
                          <span className="absolute top-2 right-2 text-semantic-success">
                            <CheckSquare className="h-4 w-4" />
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="overflow-x-auto max-h-[600px]">
                    <table className="min-w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="text-left p-3 text-sm font-medium text-design-primaryGrey">
                            Title
                          </th>
                          <th className="text-left p-3 text-sm font-medium text-design-primaryGrey">
                            Board / Column
                          </th>
                          <th className="text-left p-3 text-sm font-medium text-design-primaryGrey">
                            Priority
                          </th>
                          <th className="text-left p-3 text-sm font-medium text-design-primaryGrey">
                            Archived Date
                          </th>
                          <th className="text-right p-3 text-sm font-medium text-design-primaryGrey">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filterCards().map((card) => (
                          <tr
                            key={card.id}
                            className="border-b border-gray-100 hover:bg-gray-50"
                          >
                            <td className="p-3 text-sm">
                              <div className="font-medium text-design-black">
                                {card.title}
                              </div>
                              {card.description && (
                                <div className="text-xs text-design-primaryGrey mt-1">
                                  {truncateDescription(card.description)}
                                </div>
                              )}
                            </td>
                            <td className="p-3 text-sm">
                              <div>{card.board?.title}</div>
                              <div className="text-xs text-design-primaryGrey">
                                {card.column?.title}
                              </div>
                            </td>
                            <td className="p-3 text-sm">
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                  card.priority === "high"
                                    ? "bg-semantic-error-light text-semantic-error"
                                    : card.priority === "medium"
                                    ? "bg-semantic-warning-light text-semantic-warning"
                                    : "bg-semantic-success-light text-semantic-success"
                                }`}
                              >
                                {card.priority}
                              </span>
                            </td>
                            <td className="p-3 text-sm text-design-primaryGrey">
                              {card.updated_at &&
                                format(
                                  new Date(card.updated_at),
                                  "MMM d, yyyy"
                                )}
                            </td>
                            <td className="p-3 text-sm text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => handleRestoreCard(card)}
                                  className="p-1.5 text-xs rounded-lg bg-semantic-success/10 text-semantic-success hover:bg-semantic-success/20 transition-colors"
                                >
                                  Restore
                                </button>
                                <button
                                  onClick={() => handleDeleteCard(card.id)}
                                  className="p-1.5 text-xs rounded-lg bg-semantic-error/10 text-semantic-error hover:bg-semantic-error/20 transition-colors"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
