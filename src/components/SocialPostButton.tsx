import React, { useState } from 'react';
import { Send, ExternalLink, RefreshCw } from 'lucide-react';
import { createSocialHubPost, updateSocialHubPost } from '../services/postService';
import toast from 'react-hot-toast';
import { IdeaCard, Attachment } from '../types';
import PostSuccessModal from './PostSuccessModal';

interface SocialPostButtonProps {
  card: IdeaCard;
  onUpdateCard: (cardId: string, updates: Partial<IdeaCard>) => void;
}

export default function SocialPostButton({ card, onUpdateCard }: SocialPostButtonProps) {
  const [isPosting, setIsPosting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);

  const socialHubAttachment = card.attachments?.find(
    attachment => attachment.type === 'link' && attachment.name === 'SocialHub Post'
  );

  const handlePost = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    setIsPosting(true);
    try {
      const response = await createSocialHubPost(card.title, card.description);
      console.log('SocialHub response:', response); // Debug log
      
      if (response?.url) {
        setPendingUrl(response.url);
        setShowSuccessModal(true);
      } else {
        toast.success('Post created successfully!');
      }
    } catch (error) {
      console.error('Error posting to SocialHub:', error);
      toast.error('Failed to post to SocialHub');
    } finally {
      setIsPosting(false);
    }
  };

  const handleUpdate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!socialHubAttachment) return;

    setIsPosting(true);
    try {
      // Extract postId from the URL
      const url = new URL(socialHubAttachment.url);
      const postId = url.searchParams.get('selectedPostId') || url.pathname.split('/').pop();

      if (!postId) {
        throw new Error('Could not determine post ID');
      }

      const response = await updateSocialHubPost(postId, card.title, card.description);
      
      if (response?.url) {
        // Update the existing attachment with the new URL
        onUpdateCard(card.id, {
          attachments: card.attachments?.map(att => 
            att.id === socialHubAttachment.id 
              ? { ...att, url: response.url }
              : att
          )
        });
        toast.success('Post updated successfully!');
      }
    } catch (error) {
      console.error('Error updating SocialHub post:', error);
      toast.error('Failed to update post');
    } finally {
      setIsPosting(false);
    }
  };

  const handleAddLink = () => {
    if (pendingUrl) {
      const newAttachment: Attachment = {
        id: Date.now().toString(),
        type: 'link',
        url: pendingUrl,
        name: 'SocialHub Post',
        createdAt: new Date().toISOString()
      };

      onUpdateCard(card.id, {
        attachments: [...(card.attachments || []), newAttachment]
      });
    }
    setShowSuccessModal(false);
    setPendingUrl(null);
  };

  return (
    <>
      {socialHubAttachment ? (
        <div className="flex items-center gap-1">
          <a
            href={socialHubAttachment.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 text-indigo-600 hover:text-indigo-800"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="h-4 w-4" />
          </a>
          <button
            onClick={handleUpdate}
            disabled={isPosting}
            className="p-1 text-gray-400 hover:text-indigo-600 rounded-full hover:bg-gray-100 transition-colors"
            title="Update SocialHub post"
          >
            <RefreshCw className={`h-4 w-4 ${isPosting ? 'animate-spin' : ''}`} />
          </button>
        </div>
      ) : (
        <button
          onClick={handlePost}
          disabled={isPosting}
          className="p-1 text-gray-400 hover:text-indigo-600 rounded-full hover:bg-gray-100 transition-colors"
          title="Post to SocialHub"
        >
          <Send className={`h-4 w-4 ${isPosting ? 'animate-pulse' : ''}`} />
        </button>
      )}

      <PostSuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          setPendingUrl(null);
        }}
        onAddLink={handleAddLink}
        postUrl={pendingUrl}
      />
    </>
  );
}