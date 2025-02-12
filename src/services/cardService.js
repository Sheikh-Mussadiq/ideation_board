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



import { supabase } from '../lib/supabase';

export async function createCard(columnId, card, accountId) {
  const { data: newCard, error: cardError } = await supabase
    .from('cards')
    .insert([{
      column_id: columnId,
      title: card.title,
      description: card.description,
      priority: card.priority,
      due_date: card.dueDate,
      assignee: card.assignee,
      position: card.position,
      archived: false,
      account_id: accountId
    }])

    .select()
    .single();

  if (cardError) throw cardError;

  if (card.labels.length > 0) {
    const { error: labelsError } = await supabase
      .from('labels')
      .insert(
        card.labels.map(label => ({
          card_id: newCard.id,
          name: label
        }))
      );

    if (labelsError) throw labelsError;
  }

  return {
    ...newCard,
    labels: card.labels,
    attachments: [],
    comments: []
  };
}

export async function updateCard(cardId, updates, accountId) {
  console.log("updates in card servies update card: ", updates);
  const { error: cardError } = await supabase
    .from('cards')
    .update({
      title: updates.title,
      description: updates.description,
      priority: updates.priority,
      due_date: updates.dueDate,
      assignee: updates.assignee,
      archived: updates.archived,
      updated_at: new Date().toISOString()
    })
    .eq('account_id', accountId)
    .eq('id', cardId);

  if (cardError) throw cardError;

  if (updates.labels) {
    await supabase
      .from('labels')
      .delete()
      .eq('card_id', cardId);

    if (updates.labels.length > 0) {
      const { error: labelsError } = await supabase
        .from('labels')
        .insert(
          updates.labels.map(label => ({
            card_id: cardId,
            name: label
          }))
        );

      if (labelsError) throw labelsError;
    }
  }
}

export async function deleteCard(cardId, accountId) {
  const { error } = await supabase
    .from('cards')
    .delete()
    .eq('id', cardId)
    .eq('account_id', accountId);
  if (error) throw error;
}

export async function addComment(cardId, text, author) {
  const { data, error } = await supabase
    .from('comments')
    .insert([{
      card_id: cardId,
      text,
      author
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function addAttachment(cardId, attachment) {
  const { data, error } = await supabase
    .from('attachments')
    .insert([{
      card_id: cardId,
      type: attachment.type,
      url: attachment.url,
      name: attachment.name,
      size: attachment.size
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}


export const moveCardToColumn = async (cardId, columnId, newPosition, accountId) => {
  const { data, error } = await supabase
    .from('cards')
    .update({ column_id: columnId, position: newPosition })
    .eq('id', cardId)
    .eq('account_id', accountId);

  if (error) {
    throw error;
  }

  return data;
};


export const updateCardPositions = async (cards, accountId) => {
  const updates = cards.map((card) =>
    supabase
      .from('cards')
      .update({ position: card.position, column_id: card.column_id })
      .eq('id', card.id)
      .eq('account_id', accountId)
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
    case 'add':
      ({ data, error } = await supabase
        .from('comments')
        .insert({
          card_id: cardId,
          text: comment.text,
          author: comment.author,
          account_id: comment.account_id,
          created_at: comment.created_at
        }));
      break;

    case 'edit':
      ({ data, error } = await supabase
        .from('comments')
        .update({
          text: comment.text,
          updated_at: comment.editedAt
        })
        .eq('id', comment.id))
        .eq('account_id', comment.account_id);
      break;

    case 'delete':
      ({ data, error } = await supabase
        .from('comments')
        .delete()
        .eq('account_id', comment.account_id)
        .eq('id', comment.id));
      break;

    default:
      throw new Error('Invalid action');
  }

  if (error) {
    throw error;
  }

  return data;
};