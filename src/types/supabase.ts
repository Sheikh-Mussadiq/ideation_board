export interface Database {
  public: {
    Tables: {
      boards: {
        Row: {
          id: string;
          title: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          updated_at?: string;
        };
      };
      columns: {
        Row: {
          id: string;
          board_id: string;
          title: string;
          position: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          board_id: string;
          title: string;
          position: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          board_id?: string;
          title?: string;
          position?: number;
          updated_at?: string;
        };
      };
      cards: {
        Row: {
          id: string;
          column_id: string;
          title: string;
          description: string;
          priority: string;
          due_date: string | null;
          assignee: string | null;
          position: number;
          archived: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          column_id: string;
          title: string;
          description: string;
          priority: string;
          due_date?: string | null;
          assignee?: string | null;
          position: number;
          archived?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          column_id?: string;
          title?: string;
          description?: string;
          priority?: string;
          due_date?: string | null;
          assignee?: string | null;
          position?: number;
          archived?: boolean;
          updated_at?: string;
        };
      };
      labels: {
        Row: {
          id: string;
          card_id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          card_id: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          card_id?: string;
          name?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          card_id: string;
          text: string;
          author: string;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          card_id: string;
          text: string;
          author: string;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          card_id?: string;
          text?: string;
          author?: string;
          updated_at?: string;
        };
      };
      attachments: {
        Row: {
          id: string;
          card_id: string;
          type: string;
          url: string;
          name: string;
          size: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          card_id: string;
          type: string;
          url: string;
          name: string;
          size?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          card_id?: string;
          type?: string;
          url?: string;
          name?: string;
          size?: number | null;
        };
      };
    };
  };
}