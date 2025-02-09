import { supabase } from '../lib/supabase';
import { Column } from '../types';

export async function createColumn(boardId: string, title: string): Promise<Column> {
  // Get the highest position number for the current board
  const { data: columns, error: posError } = await supabase
    .from('columns')
    .select('position')
    .eq('board_id', boardId)
    .order('position', { ascending: false })
    .limit(1);

  if (posError) throw posError;

  const position = columns && columns.length > 0 ? columns[0].position + 1 : 0;

  const { data: newColumn, error } = await supabase
    .from('columns')
    .insert([{
      board_id: boardId,
      title,
      position
    }])
    .select()
    .single();

  if (error) throw error;

  return {
    id: newColumn.id,
    title: newColumn.title,
    cards: []
  };
}

export async function deleteColumn(columnId: string): Promise<void> {
  const { error } = await supabase
    .from('columns')
    .delete()
    .eq('id', columnId);

  if (error) throw error;
}