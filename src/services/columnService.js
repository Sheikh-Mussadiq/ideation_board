import { supabase } from "../lib/supabase";

export async function createColumn(boardId, title, accountId) {
  // Get the highest position number for the current board
  const { data: columns, error: posError } = await supabase
    .from("columns")
    .select("position")
    .eq("board_id", boardId)
    .order("position", { ascending: false })
    .limit(1);

  if (posError) throw posError;

  const position = columns && columns.length > 0 ? columns[0].position + 1 : 0;

  const { data: newColumn, error } = await supabase
    .from("columns")
    .insert([
      {
        board_id: boardId,
        title,
        account_id: accountId,
        position,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return {
    id: newColumn.id,
    title: newColumn.title,
    cards: [],
  };
}

export async function deleteColumn(columnId, accountId) {
  console.log("deleteColumn:", columnId, accountId);
  const { error } = await supabase.from("columns").delete().eq("id", columnId);

  if (error) throw error;
}

export async function updateColumn(columnId, updates, accountId) {
  const { data, error } = await supabase
    .from("columns")
    .update(updates)
    .eq("id", columnId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
