import { supabase } from "../lib/supabase";
import { normalizeSingleResult } from "../lib/helpers";

export async function createCard(columnId, card, accountId) {
  const { data: newCard, error: cardError } = await supabase
    .from("cards")
    .insert([
      {
        column_id: columnId,
        title: card.title,
        description: card.description,
        priority: card.priority,
        labels: card.labels || [],
        attachments: card.attachments || [],
        position: card.position,
        account_id: accountId,
      },
    ])
    .select()
    .single();

  if (cardError) throw cardError;
  const normalizedCard = normalizeSingleResult(newCard);
  
  return {
    ...normalizedCard,
    attachments: normalizedCard?.attachments || [],
  };
}


export async function updateCard(cardId, updates) {
  console.log("updates in card service updateCard: ", updates);

 
  const { error: cardError } = await supabase
    .from("cards")
    .update({
      title: updates.title,
      checklist: updates.checklist,
      description: updates.description,
      column_id: updates.column_id,
      labels: updates.labels,
      priority: updates.priority,
      due_date: updates.due_date,
      assignee: updates.assignee,
      position: updates.position,
      completed: updates.completed,
      archived: updates.archived,
      attachments: updates.attachments,
      updated_at: new Date().toISOString(),
    })
    
    .eq("id", cardId);

  if (cardError) throw cardError;
}

export async function deleteCard(cardId, accountId) {
  const { error } = await supabase.from("cards").delete().eq("id", cardId);
 
  if (error) throw error;
}

export const moveCardToColumn = async (
  cardId,
  columnId,
  newPosition,
) => {
  const { data, error } = await supabase
    .from("cards")
    .update({ column_id: columnId, position: newPosition })
    .eq("id", cardId);

  if (error) {
    throw error;
  }

  return data;
};

export const updateCardPositions = async (cards) => {
  const updates = cards.map((card) =>
    supabase
      .from("cards")
      .update({ position: card.position, column_id: card.column_id })
      .eq("id", card.id)
  );

  // Run all updates in parallel for better performance
  const results = await Promise.all(updates);

  // Check for errors in any request
  for (const { error } of results) {
    if (error) throw error;
  }

  return { success: true };
};

export const updateComment = async (action, cardId, comment) => {
  let data, error;

  switch (action) {
    case "add":
      ({ data, error } = await supabase.from("comments").insert({
        card_id: cardId,
        text: comment.text,
        author: comment.author,
        user_id: comment.user_id,
        created_at: comment.created_at,
      }));
      break;

    case "edit":
      ({ data, error } = await supabase
        .from("comments")
        .update({
          text: comment.text,
          updated_at: comment.editedAt,
        })
        .eq("id", comment.id)
        .eq("card_id", cardId)
        .eq("account_id", comment.account_id));
      break;

    case "delete":
      console.log("comment in updateComment: ", comment);
      ({ data, error } = await supabase
        .from("comments")
        .delete()
        .eq("account_id", comment.account_id)
        .eq("id", comment.commentId));
      break;

    default:
      throw new Error("Invalid action");
  }

  if (error) {
    throw error;
  }

  return data;
};
