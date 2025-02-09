import PropTypes from 'prop-types';

// Post Form Types
export const PostFormDataShape = {
  channelIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  publishTime: PropTypes.string.isRequired,
  content: PropTypes.shape({
    text: PropTypes.string.isRequired,
    title: PropTypes.string,
    type: PropTypes.oneOf(['POST', 'COMMENT', 'THREAD', 'MESSAGE', 'RATING', 'TICKET']).isRequired
  }).isRequired,
  authorId: PropTypes.string.isRequired,
  actor: PropTypes.string.isRequired
};

export const ApiResponseShape = PropTypes.shape({
  data: PropTypes.any,
  status: PropTypes.number,
  statusText: PropTypes.string,
  error: PropTypes.bool
});

export const ContentShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['POST', 'COMMENT', 'THREAD', 'MESSAGE', 'RATING', 'TICKET']).isRequired,
  status: PropTypes.oneOf(['published', 'draft', 'scheduled']).isRequired,
  createdAt: PropTypes.string.isRequired,
  engagement: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  metrics: PropTypes.shape({
    likes: PropTypes.number.isRequired,
    shares: PropTypes.number.isRequired,
    comments: PropTypes.number.isRequired
  }).isRequired
});

export const LabelShape = PropTypes.shape({
  text: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired
});

export const ChecklistItemShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired
});

export const CommentShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  editedAt: PropTypes.string
});

export const AttachmentShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['file', 'link']).isRequired,
  url: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  size: PropTypes.number,
  createdAt: PropTypes.string.isRequired
});

export const IdeaCardShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  priority: PropTypes.oneOf(['low', 'medium', 'high']).isRequired,
  assignee: PropTypes.string,
  dueDate: PropTypes.string,
  labels: PropTypes.arrayOf(LabelShape).isRequired,
  checklist: PropTypes.arrayOf(ChecklistItemShape),
  attachments: PropTypes.arrayOf(AttachmentShape),
  comments: PropTypes.arrayOf(CommentShape),
  archived: PropTypes.bool
});

export const ColumnShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  cards: PropTypes.arrayOf(IdeaCardShape).isRequired
});

export const BoardShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  columns: PropTypes.arrayOf(ColumnShape).isRequired
});