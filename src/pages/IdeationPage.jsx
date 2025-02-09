import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { Plus, ChevronDown, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import KanbanColumn from '../components/KanbanColumn';
import KanbanCard from '../components/KanbanCard';
import ResetDataButton from '../components/ResetDataButton';
import DeleteBoardModal from '../components/DeleteBoardModal';
import { fetchBoards, createBoard, updateBoard, deleteBoard } from '../services/boardService';
import { createCard, updateCard, deleteCard } from '../services/cardService';
import { createColumn, deleteColumn } from '../services/columnService';
import { useRealtimeCards } from '../hooks/useRealtimeCards';
import { useRealtimeColumns } from '../hooks/useRealtimeColumns';

export default function IdeationPage() {
  const [boards, setBoards] = useState([]);
  const [selectedBoardId, setSelectedBoardId] = useState(null);
  const [activeCard, setActiveCard] = useState(null);
  const [isAddingBoard, setIsAddingBoard] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
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

  const loadBoards = async () => {
    try {
      const loadedBoards = await fetchBoards();
      setBoards(loadedBoards);
      if (loadedBoards.length > 0 && !selectedBoardId) {
        setSelectedBoardId(loadedBoards[0].id);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading boards:', error);
      toast.error('Failed to load boards');
      setIsLoading(false);
    }
  };

  const handleCardChange = (updatedCard) => {
    setBoards(prev => prev.map(board => ({
      ...board,
      columns: board.columns.map(column => ({
        ...column,
        cards: column.cards.map(card => 
          card.id === updatedCard.id ? updatedCard : card
        )
      }))
    })));
  };

  const handleColumnChange = (updatedColumn) => {
    setBoards(prev => prev.map(board => ({
      ...board,
      columns: board.columns.map(column => 
        column.id === updatedColumn.id ? updatedColumn : column
      )
    })));
  };

  // Set up realtime subscriptions
  useRealtimeCards(selectedBoardId || '', handleCardChange);
  useRealtimeColumns(selectedBoardId || '', handleColumnChange);

  const handleAddBoard = async () => {
    if (newBoardTitle.trim()) {
      try {
        const newBoard = await createBoard(newBoardTitle.trim());
        setBoards(prev => [...prev, newBoard]);
        setSelectedBoardId(newBoard.id);
        setNewBoardTitle('');
        setIsAddingBoard(false);
        toast.success('Board created successfully');
      } catch (error) {
        console.error('Error creating board:', error);
        toast.error('Failed to create board');
      }
    }
  };

  const handleDeleteBoard = async () => {
    if (!selectedBoardId) return;
    
    try {
      await deleteBoard(selectedBoardId);
      setBoards(prev => prev.filter(board => board.id !== selectedBoardId));
      setSelectedBoardId(boards.find(board => board.id !== selectedBoardId)?.id || null);
      toast.success('Board deleted successfully');
    } catch (error) {
      console.error('Error deleting board:', error);
      toast.error('Failed to delete board');
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const handleAddColumn = async () => {
    if (newColumnTitle.trim() && selectedBoardId) {
      try {
        const newColumn = await createColumn(selectedBoardId, newColumnTitle.trim());
        setBoards(prev => prev.map(board => 
          board.id === selectedBoardId
            ? { ...board, columns: [...board.columns, newColumn] }
            : board
        ));
        setNewColumnTitle('');
        setIsAddingColumn(false);
        toast.success('Column added successfully');
      } catch (error) {
        console.error('Error adding column:', error);
        toast.error('Failed to add column');
      }
    }
  };

  const handleDeleteColumn = async (columnId) => {
    if (!selectedBoardId) return;
    
    try {
      await deleteColumn(columnId);
      setBoards(prev => prev.map(board => 
        board.id === selectedBoardId
          ? { ...board, columns: board.columns.filter(col => col.id !== columnId) }
          : board
      ));
      toast.success('Column deleted successfully');
    } catch (error) {
      console.error('Error deleting column:', error);
      toast.error('Failed to delete column');
    }
  };

  const handleAddCard = async (columnId) => {
    try {
      const newCard = await createCard(columnId, {
        title: 'New Task',
        description: 'Add description here',
        priority: 'medium',
        labels: [],
        attachments: [],
        comments: []
      });

      setBoards(prev => prev.map(board => ({
        ...board,
        columns: board.columns.map(col => 
          col.id === columnId
            ? { ...col, cards: [...col.cards, newCard] }
            : col
        )
      })));
      
      toast.success('Card added successfully');
    } catch (error) {
      console.error('Error adding card:', error);
      toast.error('Failed to add card');
    }
  };

  const handleUpdateCard = async (cardId, updates) => {
    try {
      await updateCard(cardId, updates);
      setBoards(prev => prev.map(board => ({
        ...board,
        columns: board.columns.map(col => ({
          ...col,
          cards: col.cards.map(card => 
            card.id === cardId ? { ...card, ...updates } : card
          )
        }))
      })));
    } catch (error) {
      console.error('Error updating card:', error);
      toast.error('Failed to update card');
    }
  };

  const handleDeleteCard = async (cardId) => {
    try {
      await deleteCard(cardId);
      setBoards(prev => prev.map(board => ({
        ...board,
        columns: board.columns.map(col => ({
          ...col,
          cards: col.cards.filter(card => card.id !== cardId)
        }))
      })));
      toast.success('Card deleted successfully');
    } catch (error) {
      console.error('Error deleting card:', error);
      toast.error('Failed to delete card');
    }
  };

  const handleArchiveCard = async (cardId) => {
    try {
      await updateCard(cardId, { archived: true });
      setBoards(prev => prev.map(board => ({
        ...board,
        columns: board.columns.map(col => ({
          ...col,
          cards: col.cards.map(card => 
            card.id === cardId ? { ...card, archived: true } : card
          )
        }))
      })));
      toast.success('Card archived successfully');
    } catch (error) {
      console.error('Error archiving card:', error);
      toast.error('Failed to archive card');
    }
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const card = boards
      .flatMap(board => board.columns)
      .flatMap(col => col.cards)
      .find(card => card.id === active.id);
    
    if (card) {
      setActiveCard(card);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeCard = boards
      .flatMap(board => board.columns)
      .flatMap(col => col.cards)
      .find(card => card.id === active.id);
    
    const overColumn = boards
      .flatMap(board => board.columns)
      .find(col => col.id === over.id);

    if (!activeCard || !overColumn) return;

    try {
      await updateCard(activeCard.id, { column_id: overColumn.id });
      setBoards(prev => prev.map(board => ({
        ...board,
        columns: board.columns.map(col => {
          if (col.cards.some(card => card.id === active.id)) {
            return {
              ...col,
              cards: col.cards.filter(card => card.id !== active.id)
            };
          }
          if (col.id === overColumn.id) {
            return {
              ...col,
              cards: [...col.cards, activeCard]
            };
          }
          return col;
        })
      })));
    } catch (error) {
      console.error('Error moving card:', error);
      toast.error('Failed to move card');
    }

    setActiveCard(null);
  };

  const selectedBoard = boards.find(board => board.id === selectedBoardId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-gray-500">Loading boards...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Ideation Board</h1>
            <div className="relative">
              <select
                value={selectedBoardId || ''}
                onChange={(e) => setSelectedBoardId(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {boards.map(board => (
                  <option key={board.id} value={board.id}>{board.title}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
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
                  className="px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  autoFocus
                />
                <button
                  onClick={handleAddBoard}
                  className="px-3 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setIsAddingBoard(false);
                    setNewBoardTitle('');
                  }}
                  className="px-3 py-2 text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddingBoard(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Board
                </button>
                {selectedBoardId && (
                  <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100"
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
            <div className="flex gap-6 overflow-x-auto pb-4">
              <SortableContext items={selectedBoard.columns.map(col => col.id)}>
                {selectedBoard.columns.map(column => (
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
                <div className="flex-shrink-0 w-80 bg-gray-100 rounded-lg p-4">
                  <input
                    type="text"
                    value={newColumnTitle}
                    onChange={(e) => setNewColumnTitle(e.target.value)}
                    placeholder="Column title..."
                    className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    autoFocus
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={handleAddColumn}
                      className="px-3 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setIsAddingColumn(false);
                        setNewColumnTitle('');
                      }}
                      className="px-3 py-2 text-gray-600 hover:text-gray-900"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsAddingColumn(true)}
                  className="flex-shrink-0 w-80 bg-gray-100 rounded-lg p-4 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-200"
                >
                  <Plus className="h-5 w-5 mr-2" />
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
        boardTitle={selectedBoard?.title || ''}
      />
    </div>
  );
}