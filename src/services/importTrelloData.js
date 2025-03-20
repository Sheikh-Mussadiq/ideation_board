import { supabase } from "../lib/supabase";
import DOMPurify from "dompurify";
import { normalizeSingleResult } from "../lib/helpers";

// Add input sanitization helper
const sanitizeInput = (input) => {
  if (typeof input === "string") {
    return DOMPurify.sanitize(input).trim().slice(0, 1000); // Limit string length
  }
  return input;
};

export async function importTrelloData(trelloData, accountId, userId) {
  try {
    // Validate input data structure
    if (
      !trelloData?.name ||
      !Array.isArray(trelloData.lists) ||
      !Array.isArray(trelloData.cards)
    ) {
      throw new Error("Invalid Trello data structure");
    }

    // Create the board with sanitized data
    const { data: boardData, error: boardError } = await supabase
      .from("boards")
      .insert({
        account_id: accountId,
        title: sanitizeInput(trelloData.name),
        created_by: userId,
      })
      .select("*")
      .single();

    if (boardError) throw boardError;

    const board = normalizeSingleResult(boardData);
    const createdColumns = [];

    // Map Trello list IDs to our column IDs
    const listIdMap = new Map();

    // Create columns and store their data
    for (const list of trelloData.lists) {
      if (!list.name || typeof list.pos !== "number") continue;

      const { data: columnData, error: columnError } = await supabase
        .from("columns")
        .insert({
          board_id: board.id,
          account_id: accountId,
          title: sanitizeInput(list.name),
          position: Math.max(0, Math.floor(list.pos)),
        })
        .select("*")
        .single();

      if (columnError) throw columnError;

      const column = normalizeSingleResult(columnData);
      column.cards = []; // Initialize cards array
      createdColumns.push(column);
      listIdMap.set(list.id, column.id);
    }

    // Create cards and organize them by column
    for (const card of trelloData.cards) {
      const columnId = listIdMap.get(card.idList);
      if (!columnId || !card.name) continue;

      const sanitizedCard = {
        column_id: columnId,
        account_id: accountId,
        title: sanitizeInput(card.name),
        description: sanitizeInput(card.desc),
        due_date: card.due ? new Date(card.due).toISOString() : null,
        labels: (card.idLabels || [])
          .map((labelId) => {
            const label = trelloData.labels.find((l) => l.id === labelId);
            return label
              ? { color: "green", text: sanitizeInput(label.name) }
              : null;
          })
          .filter(Boolean),
        checklist: (trelloData.checklists || [])
          .filter((cl) => cl.idCard === card.id)
          .flatMap((cl) =>
            cl.checkItems.map((item) => ({
              id: sanitizeInput(item.id),
              text: sanitizeInput(item.name),
              checked: Boolean(item.state === "complete"),
            }))
          ),
        attachments: [],
        position: Math.max(0, Math.floor(card.pos)),
        completed: Boolean(card.dueComplete),
        archived: Boolean(card.closed),
        priority: "medium",
      };

      const { data: cardData, error: cardError } = await supabase
        .from("cards")
        .insert(sanitizedCard)
        .select("*")
        .single();

      if (cardError) throw cardError;

      const createdCard = normalizeSingleResult(cardData);
      const targetColumn = createdColumns.find((col) => col.id === columnId);
      if (targetColumn) {
        targetColumn.cards.push(createdCard);
      }
    }

    // Sort cards within each column by position
    createdColumns.forEach((column) => {
      column.cards.sort((a, b) => a.position - b.position);
    });

    // Create complete board structure
    const completeBoard = {
      ...board,
      columns: createdColumns.sort((a, b) => a.position - b.position),
    };

    return { success: true, boardId: board.id, board: completeBoard };
  } catch (error) {
    console.error("Import failed:", error);
    return { success: false, error };
  }
}
