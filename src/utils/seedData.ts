import { supabase } from '../lib/supabase';

const BOARDS = [
  {
    id: 'b1000000-0000-0000-0000-000000000001',
    title: 'Kampagnenplanung',
    columns: [
      { title: 'Planung', position: 0 },
      { title: 'In Bearbeitung', position: 1 },
      { title: 'Review', position: 2 },
      { title: 'Abgeschlossen', position: 3 }
    ],
    cards: [
      {
        title: 'Social Media Strategie Q2',
        description: 'Entwicklung der Social Media Strategie für das zweite Quartal',
        priority: 'high',
        labels: ['strategie', 'social-media']
      },
      {
        title: 'Newsletter Kampagne',
        description: 'Planung und Umsetzung der Q2 Newsletter Serie',
        priority: 'medium',
        labels: ['email', 'content']
      }
    ]
  },
  {
    id: 'b1000000-0000-0000-0000-000000000002',
    title: 'Content Ideen',
    columns: [
      { title: 'Neue Ideen', position: 0 },
      { title: 'Zu Prüfen', position: 1 },
      { title: 'Genehmigt', position: 2 },
      { title: 'In Produktion', position: 3 }
    ],
    cards: [
      {
        title: 'Video Tutorial Serie',
        description: 'Erstellung von Produkt-Tutorials für neue Features',
        priority: 'high',
        labels: ['video', 'tutorial']
      },
      {
        title: 'Blog Artikel Serie',
        description: 'Expertenbeiträge zu Branchentrends',
        priority: 'medium',
        labels: ['blog', 'content']
      }
    ]
  },
  {
    id: 'b1000000-0000-0000-0000-000000000003',
    title: 'Geplante Kollaborationen',
    columns: [
      { title: 'Potenzielle Partner', position: 0 },
      { title: 'In Verhandlung', position: 1 },
      { title: 'Bestätigt', position: 2 },
      { title: 'Abgeschlossen', position: 3 }
    ],
    cards: [
      {
        title: 'Tech Konferenz Sponsoring',
        description: 'Sponsoring Möglichkeiten für die DevCon 2024',
        priority: 'high',
        labels: ['event', 'networking']
      },
      {
        title: 'Influencer Kooperation',
        description: 'Zusammenarbeit mit Tech Influencern',
        priority: 'medium',
        labels: ['influencer', 'marketing']
      }
    ]
  },
  {
    id: 'b1000000-0000-0000-0000-000000000004',
    title: 'ToDo\'s und Aufgaben',
    columns: [
      { title: 'Backlog', position: 0 },
      { title: 'Diese Woche', position: 1 },
      { title: 'In Arbeit', position: 2 },
      { title: 'Erledigt', position: 3 }
    ],
    cards: [
      {
        title: 'Team Meeting Vorbereitung',
        description: 'Agenda und Unterlagen für wöchentliches Meeting',
        priority: 'high',
        labels: ['meeting', 'intern']
      },
      {
        title: 'Reporting Dashboard',
        description: 'Monatliche KPIs zusammenstellen',
        priority: 'medium',
        labels: ['reporting', 'analytics']
      }
    ]
  }
];

export async function seedKanbanData() {
  try {
    // Clear existing data
    await supabase.from('boards').delete().neq('id', '0');

    // Create boards
    for (const board of BOARDS) {
      // Insert board
      const { data: boardData, error: boardError } = await supabase
        .from('boards')
        .insert([{ id: board.id, title: board.title }])
        .select()
        .single();

      if (boardError) throw boardError;

      // Insert columns
      for (const column of board.columns) {
        const { data: columnData, error: columnError } = await supabase
          .from('columns')
          .insert([{
            board_id: boardData.id,
            title: column.title,
            position: column.position
          }])
          .select()
          .single();

        if (columnError) throw columnError;

        // Insert cards for first column
        if (column.position === 0) {
          for (const card of board.cards) {
            const { data: cardData, error: cardError } = await supabase
              .from('cards')
              .insert([{
                column_id: columnData.id,
                title: card.title,
                description: card.description,
                priority: card.priority,
                position: 0
              }])
              .select()
              .single();

            if (cardError) throw cardError;

            // Insert labels
            for (const label of card.labels) {
              const { error: labelError } = await supabase
                .from('labels')
                .insert([{
                  card_id: cardData.id,
                  name: label
                }]);

              if (labelError) throw labelError;
            }
          }
        }
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error seeding data:', error);
    return { success: false, error };
  }
}