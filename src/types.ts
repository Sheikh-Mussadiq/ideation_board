export interface PostFormData {
  channelIds: string[];
  publishTime: string;
  content: {
    text: string;
    title?: string;
    type: PostType;
  };
  authorId: string;
  actor: string;
}

export type PostType = 'POST' | 'COMMENT' | 'THREAD' | 'MESSAGE' | 'RATING' | 'TICKET';

export interface ApiResponse {
  data: any;
  status?: number;
  statusText?: string;
  error?: boolean;
}

export interface Content {
  id: string;
  title: string;
  type: PostType;
  status: 'published' | 'draft' | 'scheduled';
  createdAt: string;
  engagement: string;
  content: string;
  metrics: {
    likes: number;
    shares: number;
    comments: number;
  };
}

export interface Label {
  text: string;
  color: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

export interface IdeaCard {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
  dueDate?: string;
  labels: Label[];
  checklist: ChecklistItem[];
  attachments: Attachment[];
  comments: Comment[];
  archived?: boolean;
}

export interface Column {
  id: string;
  title: string;
  cards: IdeaCard[];
}

export interface Board {
  id: string;
  title: string;
  columns: Column[];
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: string;
  editedAt?: string;
}

export interface Attachment {
  id: string;
  type: 'file' | 'link';
  url: string;
  name: string;
  size?: number;
  createdAt: string;
}