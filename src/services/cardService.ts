import { supabase } from '../lib/supabase';
import { IdeaCard, Comment, Attachment } from '../types';

export async function createCard(columnId: string, card: Omit<IdeaCard, 'id'>): Promise<IdeaCard> {
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

export async function updateCard(cardId: string, updates: Partial<IdeaCard>): Promise<void> {
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

export async function deleteCard(cardId: string): Promise<void> {
  const { error } = await supabase
    .from('cards')
    .delete()
    .eq('id', cardId);

  if (error) throw error;
}

export async function addComment(cardId: string, text: string, author: string): Promise<Comment> {
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

export async function addAttachment(cardId: string, attachment: Omit<Attachment, 'id' | 'createdAt'>): Promise<Attachment> {
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