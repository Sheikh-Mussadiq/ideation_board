// import { supabase } from '../lib/supabase';

// export async function createCard(columnId, card) {
//   const { data: newCard, error: cardError } = await supabase
//     .from('cards')
//     .insert([{
//       column_id: columnId,
//       title: card.title,
//       description: card.description,
//       priority: card.priority,
//       due_date: card.dueDate,
//       assignee: card.assignee,
//       position: 0,
//       archived: false
//     }])
//     .select()
//     .single();

//   if (cardError) throw cardError;

//   if (card.labels.length > 0) {
//     const { error: labelsError } = await supabase
//       .from('labels')
//       .insert(
//         card.labels.map(label => ({
//           card_id: newCard.id,
//           name: label
//         }))
//       );

//     if (labelsError) throw labelsError;
//   }

//   return {
//     ...newCard,
//     labels: card.labels,
//     attachments: [],
//     comments: []
//   };
// }

// export async function updateCard(cardId, updates) {
//   const { error: cardError } = await supabase
//     .from('cards')
//     .update({
//       title: updates.title,
//       description: updates.description,
//       priority: updates.priority,
//       due_date: updates.dueDate,
//       assignee: updates.assignee,
//       archived: updates.archived,
//       updated_at: new Date().toISOString()
//     })
//     .eq('id', cardId);

//   if (cardError) throw cardError;

//   if (updates.labels) {
//     await supabase
//       .from('labels')
//       .delete()
//       .eq('card_id', cardId);

//     if (updates.labels.length > 0) {
//       const { error: labelsError } = await supabase
//         .from('labels')
//         .insert(
//           updates.labels.map(label => ({
//             card_id: cardId,
//             name: label
//           }))
//         );

//       if (labelsError) throw labelsError;
//     }
//   }
// }

// export async function deleteCard(cardId) {
//   const { error } = await supabase
//     .from('cards')
//     .delete()
//     .eq('id', cardId);

//   if (error) throw error;
// }

// export async function addComment(cardId, text, author) {
//   const { data, error } = await supabase
//     .from('comments')
//     .insert([{
//       card_id: cardId,
//       text,
//       author
//     }])
//     .select()
//     .single();

//   if (error) throw error;
//   return data;
// }

// export async function addAttachment(cardId, attachment) {
//   const { data, error } = await supabase
//     .from('attachments')
//     .insert([{
//       card_id: cardId,
//       type: attachment.type,
//       url: attachment.url,
//       name: attachment.name,
//       size: attachment.size
//     }])
//     .select()
//     .single();

//   if (error) throw error;
//   return data;
// }

import { supabase } from "../lib/supabase";

export async function createCard(columnId, card, accountId) {
  const { data: newCard, error: cardError } = await supabase
    .from("cards")
    .insert([
      {
        column_id: columnId,
        title: card.title,
        description: card.description,
        priority: card.priority,
        due_date: card.dueDate,
        labels: card.labels || [],
        attachments: card.attachments || [],
        assignee: card.assignee,
        position: card.position,
        archived: false,
        account_id: accountId,
      },
    ])

    .select()
    .single();

  if (cardError) throw cardError;

  if (card.labels.length > 0) {
    const { error: labelsError } = await supabase.from("labels").insert(
      card.labels.map((label) => ({
        card_id: newCard.id,
        name: label,
      }))
    );

    if (labelsError) throw labelsError;
  }

  return {
    ...newCard,
    labels: card.labels,
    attachments: [],
    comments: [],
  };
}

async function uploadFile(file) {
  const { data, error } = await supabase.storage
    .from("attachments")
    .upload(`cards/${file.name}`, file);

  if (error) {
    console.error("Upload failed:", error);
    throw error;
  }

  return data.path; // This gives the file path
}

function getFileUrl(filePath) {
  return supabase.storage.from("attachments").getPublicUrl(filePath).data
    .publicUrl;
}

// export async function updateCard(cardId, updates, accountId) {
//   console.log("updates in card servies update card: ", updates);

//   const { error: cardError } = await supabase
//     .from('cards')
//     .update({
//       title: updates.title,
//       checklist : updates.checklist,
//       description: updates.description,
//       labels: updates.labels,
//       priority: updates.priority,
//       due_date: updates.dueDate,
//       attachments: updates.attachments,
//       assignee: updates.assignee,
//       archived: updates.archived,
//       updated_at: new Date().toISOString()
//     })
//     .eq('account_id', accountId)
//     .eq('id', cardId);

//   if (cardError) throw cardError;

// }

export async function updateCard(cardId, updates, accountId) {
  console.log("updates in card service updateCard: ", updates);

  // 1️⃣ Fetch the existing attachments from the database

  if (updates.attachments) {
    const { data: card, error: fetchError } = await supabase
      .from("cards")
      .select("attachments")
      .eq("id", cardId)
      .eq("account_id", accountId)
      .single();

    if (fetchError) throw fetchError;

    const existingAttachments = card?.attachments || [];

    // 2️⃣ Find Deleted Attachments
    const deletedAttachments = existingAttachments.filter(
      (oldAttachment) =>
        !updates.attachments.some(
          (newAttachment) => newAttachment.id === oldAttachment.id
        )
    );

    // 3️⃣ Delete Files from Supabase Storage if Removed
    for (let attachment of deletedAttachments) {
      if (attachment.type === "file") {
        const filePath = `cards/${attachment.name}`;
        await supabase.storage.from("attachments").remove([filePath]);
      }
    }

    // 4️⃣ Find New Attachments (ones that are in updates but not in existing)
    let newAttachments = updates.attachments.filter(
      (newAttachment) =>
        !existingAttachments.some(
          (oldAttachment) => oldAttachment.id === newAttachment.id
        )
    );

    // 5️⃣ Handle File Uploads (for newly added files)
    for (let attachment of newAttachments) {
      if (attachment.type === "file" && attachment.url.startsWith("blob:")) {
        try {
          const file = await fetch(attachment.url).then((res) => res.blob()); // Convert blob URL to file
          const filePath = `cards/${attachment.name}`;
          const { data, error } = await supabase.storage
            .from("attachments")
            .upload(filePath, file);

          if (error) throw error;

          attachment.url = supabase.storage
            .from("attachments")
            .getPublicUrl(filePath).data.publicUrl;
        } catch (err) {
          console.error("File upload failed:", err);
        }
      }
    }
  }
  const { error: cardError } = await supabase
    .from("cards")
    .update({
      title: updates.title,
      checklist: updates.checklist,
      description: updates.description,
      labels: updates.labels,
      priority: updates.priority,
      due_date: updates.dueDate,
      assignee: updates.assignee,
      archived: updates.archived,
      attachments: updates.attachments,
      updated_at: new Date().toISOString(),
    })
    .eq("account_id", accountId)
    .eq("id", cardId);

  if (cardError) throw cardError;
}

export async function deleteCard(cardId, accountId) {
  const { error } = await supabase
    .from("cards")
    .delete()
    .eq("id", cardId)
    .eq("account_id", accountId);
  if (error) throw error;
}

export async function addComment(cardId, text, author) {
  const { data, error } = await supabase
    .from("comments")
    .insert([
      {
        card_id: cardId,
        text,
        author,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function addAttachment(cardId, attachment) {
  const { data, error } = await supabase
    .from("attachments")
    .insert([
      {
        card_id: cardId,
        type: attachment.type,
        url: attachment.url,
        name: attachment.name,
        size: attachment.size,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export const moveCardToColumn = async (
  cardId,
  columnId,
  newPosition,
  accountId
) => {
  const { data, error } = await supabase
    .from("cards")
    .update({ column_id: columnId, position: newPosition })
    .eq("id", cardId)
    .eq("account_id", accountId);

  if (error) {
    throw error;
  }

  return data;
};

export const updateCardPositions = async (cards, accountId) => {
  const updates = cards.map((card) =>
    supabase
      .from("cards")
      .update({ position: card.position, column_id: card.column_id })
      .eq("id", card.id)
      .eq("account_id", accountId)
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
        account_id: comment.account_id,
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
