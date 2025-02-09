import { supabase } from '../lib/supabase';

export async function createCard(columnId, card) {
  const { data: newCard, error: cardError } = await supabase
    .from('cards')
    .insert([{
      column_id: columnId,
      title: card.title,
      description: card.description,
      priority: card.priority,
      due_date: card.dueDate,
      assignee: card.assignee,
      position: 0,
      archived: false
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

export async function updateCard(cardId, updates) {
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

export async function deleteCard(cardId) {
  const { error } = await supabase
    .from('cards')
    .delete()
    .eq('id', cardId);

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