import { Content } from '../types';
import { API_CONFIG } from '../config';

const MOCK_CONTENT: Content[] = [
  {
    id: '1',
    title: 'Product Launch Announcement',
    type: 'POST',
    status: 'published',
    createdAt: '2024-03-15T10:00:00Z',
    engagement: '245',
    content: 'Excited to announce our new product launch! Stay tuned for more details.',
    metrics: {
      likes: 120,
      shares: 45,
      comments: 80
    }
  },
  {
    id: '2',
    title: 'Customer Success Story',
    type: 'POST',
    status: 'draft',
    createdAt: '2024-03-16T14:30:00Z',
    engagement: '0',
    content: 'How our platform helped Company X achieve 200% growth in 6 months.',
    metrics: {
      likes: 0,
      shares: 0,
      comments: 0
    }
  },
  {
    id: '3',
    title: 'Weekly Update Thread',
    type: 'THREAD',
    status: 'scheduled',
    createdAt: '2024-03-17T09:00:00Z',
    engagement: '89',
    content: 'Here are this week\'s major updates and improvements.',
    metrics: {
      likes: 45,
      shares: 12,
      comments: 32
    }
  }
];

export async function fetchContent(): Promise<Content[]> {
  // For demo purposes, return mock data instead of making API call
  return MOCK_CONTENT;
}

export async function fetchContentById(id: string): Promise<Content | null> {
  // For demo purposes, find content in mock data
  const content = MOCK_CONTENT.find(item => item.id === id);
  return content || null;
}