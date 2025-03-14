import { supabase } from "../lib/supabase";
import { boardShareEmailService } from "./emailService";

export async function fetchBoards() {
  const { data: boards, error: boardsError } = await supabase
    .from("boards")
    .select("*")
    // .eq('account_id', accountId)
    .order("created_at", { ascending: true });

  if (boardsError) throw boardsError;

  const boardsWithDetails = await Promise.all(
    boards.map(async (board) => {
      const { data: columns, error: columnsError } = await supabase
        .from("columns")
        .select("*")
        .eq("board_id", board.id)
        .order("position", { ascending: true });

      if (columnsError) throw columnsError;

      const columnsWithCards = await Promise.all(
        columns.map(async (column) => {
          const { data: cards, error: cardsError } = await supabase
            .from("cards")
            .select("*")
            .eq("column_id", column.id)
            .order("position", { ascending: true });

          if (cardsError) throw cardsError;

          const cardsWithDetails = await Promise.all(
            cards.map(async (card) => {
              const [{ data: comments, error: commentsError }] =
                await Promise.all([
                  supabase
                    .from("comments")
                    .select("*")
                    .eq("card_id", card.id)
                    .order("created_at", { ascending: false }),
                ]);

              if (commentsError) throw commentsError;

              return {
                id: card.id,
                title: card.title,
                description: card.description,
                priority: card.priority,
                labels: card.labels || [],
                due_date: card.due_date,
                assignee: card.assignee,
                checklist: card.checklist,
                completed: card.completed,
                attachments: card.attachments || [],
                comments: comments || [],
                archived: card.archived,
              };
            })
          );

          return {
            id: column.id,
            title: column.title,
            cards: cardsWithDetails,
          };
        })
      );

      return {
        id: board.id,
        title: board.title,
        columns: columnsWithCards,
        team_id: board.team_id,
        shared_users: board.shared_users,
        account_id: board.account_id,
        created_by: board.created_by,
        created_at: board.created_at,
        updated_at: board.updated_at,
      };
    })
  );

  return boardsWithDetails;
}

export async function fetchBoardsList() {
  const { data: boards, error: boardsError } = await supabase
    .from("boards")
    .select("*")
    .order("created_at", { ascending: false });

  if (boardsError) throw boardsError;

  return boards;
}

export async function createBoard(title, accountId, userId) {
  const { data: board, error: boardError } = await supabase
    .from("boards")
    .insert([{ title, account_id: accountId, created_by: userId }])
    .select()
    .single();

  if (boardError) throw boardError;

  const defaultColumns = [
    { title: "To Do", position: 0, account_id: accountId },
    { title: "In Progress", position: 1, account_id: accountId },
    { title: "Done", position: 2, account_id: accountId },
  ];

  const { data: columns, error: columnsError } = await supabase
    .from("columns")
    .insert(
      defaultColumns.map((col) => ({
        board_id: board.id,
        title: col.title,
        account_id: col.account_id,
        position: col.position,
      }))
    )
    .select();

  if (columnsError) throw columnsError;

  return {
    id: board.id,
    title: board.title,
    account_id: board.account_id,
    created_by: board.created_by,
    columns: columns.map((col) => ({
      id: col.id,
      title: col.title,
      cards: [],
    })),
  };
}
export async function assignBoardToTeam(boardId, teamId) {
  console.log("boardId: ", boardId, teamId);
  const { data, error } = await supabase
    .from("boards")
    .update({ team_id: teamId })
    .eq("id", boardId)
    .select("*", { count: "exact" });

  if (error) throw error;

  // return count;
}

export async function unassignBoardFromTeam(boardId) {
  const { data, error, count } = await supabase
    .from("boards")
    .update({ team_id: null })
    .eq("id", boardId)
    .select("*", { count: "exact" });

  // console.log("data:", data, "error:", error, "count:", count);

  if (error) throw error;

  // return count;
}

export async function updateBoard(boardId, updates) {
  const { error } = await supabase
    .from("boards")
    .update({ title: updates.title, updated_at: new Date().toISOString() })
    .eq("id", boardId);

  if (error) throw error;
}

export async function deleteBoard(boardId) {
  // Delete the board
  const { error: boardError } = await supabase
    .from("boards")
    .delete()
    .eq("id", boardId);
  if (boardError) throw boardError;

}

export async function fetchBoardLogs(boardId) {
  const { data: logs, error } = await supabase
    .from("board_logs")
    .select("*")
    .eq("board_id", boardId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return logs;
}

export async function shareWithUsers(boardId, userIds, currentUserName, boardTitle) {
  // First fetch current shared_users
  const { data: currentBoard, error: fetchError } = await supabase
    .from("boards")
    .select("shared_users")
    .eq("id", boardId)
    .single();

  if (fetchError) throw fetchError;

  // Combine existing and new users, removing duplicates
  const currentUsers = currentBoard.shared_users || [];
  const updatedUsers = [...new Set([...currentUsers, ...userIds])];
  const newUsers = userIds.filter(userId => !currentUsers.includes(userId)); // Only new users

  // Send email to new users

  boardShareEmailService(newUsers, currentUserName ,boardTitle, boardId);


  // Update the board with combined users
  const { data, error } = await supabase
    .from("boards")
    .update({ shared_users: updatedUsers })
    .eq("id", boardId)
    .select();

  if (error) throw error;
  return data;
}

export async function removeSharedUsers(boardId, userIds) {
  // First fetch current shared_users
  const { data: currentBoard, error: fetchError } = await supabase
    .from("boards")
    .select("shared_users")
    .eq("id", boardId)
    .single();

  if (fetchError) throw fetchError;

  // Filter out the users to be removed
  const updatedUsers = (currentBoard.shared_users || []).filter(
    userId => !userIds.includes(userId)
  );

  // Update the board with the filtered users
  const { data, error } = await supabase
    .from("boards")
    .update({ shared_users: updatedUsers })
    .eq("id", boardId)
    .select();

  if (error) throw error;
  return data;
}
