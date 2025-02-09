import { supabase } from '../lib/supabase';
import { Board, Column, IdeaCard } from '../types';

export async function fetchBoards(): Promise<Board[]> {
  const { data: boards, error: boardsError } = await supabase
    .from('boards')
    .select('*')
    .order('created_at', { ascending: true });

  if (boardsError) throw boardsError;

  const boardsWithDetails = await Promise.all(
    boards.map(async (board) => {
      const { data: columns, error: columnsError } = await supabase
        .from('columns')
        .select('*')
        .eq('board_id', board.id)
        .order('position', { ascending: true });

      if (columnsError) throw columnsError;

      const columnsWithCards = await Promise.all(
        columns.map(async (column) => {
          const { data: cards, error: cardsError } = await supabase
            .from('cards')
            .select('*')
            .eq('column_id', column.id)
            .order('position', { ascending: true });

          if (cardsError) throw cardsError;

          const cardsWithDetails = await Promise.all(
            cards.map(async (card) => {
              const [
                { data: labels, error: labelsError },
                { data: comments, error: commentsError },
                { data: attachments, error: attachmentsError }
              ] = await Promise.all([
                supabase.from('labels').select('*').eq('card_id', card.id),
                supabase.from('comments').select('*').eq('card_id', card.id),
                supabase.from('attachments').select('*').eq('card_id', card.id)
              ]);

              if (labelsError) throw labelsError;
              if (commentsError) throw commentsError;
              if (attachmentsError) throw attachmentsError;

              return {
                id: card.id,
                title: card.title,
                description: card.description,
                priority: card.priority as 'low' | 'medium' | 'high',
                labels: labels?.map(l => l.name) || [],
                dueDate: card.due_date,
                assignee: card.assignee,
                attachments: attachments || [],
                comments: comments || [],
                archived: card.archived
              };
            })
          );

          return {
            id: column.id,
            title: column.title,
            cards: cardsWithDetails
          };
        })
      );

      return {
        id: board.id,
        title: board.title,
        columns: columnsWithCards
      };
    })
  );

  return boardsWithDetails;
}

export async function createBoard(title: string): Promise<Board> {
  const { data: board, error: boardError } = await supabase
    .from('boards')
    .insert([{ title }])
    .select()
    .single();

  if (boardError) throw boardError;

  const defaultColumns = [
    { title: 'To Do', position: 0 },
    { title: 'In Progress', position: 1 },
    { title: 'Done', position: 2 }
  ];

  const { data: columns, error: columnsError } = await supabase
    .from('columns')
    .insert(
      defaultColumns.map(col => ({
        board_id: board.id,
        title: col.title,
        position: col.position
      }))
    )
    .select();

  if (columnsError) throw columnsError;

  return {
    id: board.id,
    title: board.title,
    columns: columns.map(col => ({
      id: col.id,
      title: col.title,
      cards: []
    }))
  };
}

export async function updateBoard(boardId: string, updates: Partial<Board>): Promise<void> {
  const { error } = await supabase
    .from('boards')
    .update({ title: updates.title, updated_at: new Date().toISOString() })
    .eq('id', boardId);

  if (error) throw error;
}

export async function deleteBoard(boardId: string): Promise<void> {
  const { error } = await supabase
    .from('boards')
    .delete()
    .eq('id', boardId);

  if (error) throw error;
}