// import { useEffect } from 'react';
// import { supabase } from '../lib/supabase';

// export function useRealtimeCardComments(cardId, onCommentChange) {
//   useEffect(() => {
//     if (!cardId) return;

//     console.log("Setting up comment subscription for card:", cardId);

//     const channel = supabase
//       .channel(`comments-${cardId}`)
//       .on(
//         'postgres_changes',
//         {
//           event: '*',
//           schema: 'public',
//           table: 'comments',
//           filter: `card_id=eq.${cardId}`
//         },
//         (payload) => {
//           console.log("Comment change detected:", payload);

//           if (payload.eventType === 'DELETE') {
//             onCommentChange({ 
//               id: payload.old.id,
//               card_id: cardId,
//               type: 'DELETE' 
//             });
//             return;
//           }

//           onCommentChange({
//             ...payload.new,
//             type: payload.eventType
//           });
//         }
//       )
//       .subscribe();

//     return () => {
    
//       supabase.removeChannel(channel);
//     };
//   }, [cardId, onCommentChange]);
// }

import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useRealtimeCardComments(boardId, onCommentChange) {
  useEffect(() => {
    if (!boardId) return;

    // console.log("Setting up comment subscription for card:", cardId);

    const channel = supabase
      .channel(`comments-${boardId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
        //   filter: `card_id=eq.${cardId}`
        },
        (payload) => {
          console.log("Comment change detected:", payload);

          if (payload.eventType === 'DELETE') {
            onCommentChange(payload.old.id, 'DELETE');
          } else {
            onCommentChange(payload.new, payload.eventType);
          }
        }
      )
      .subscribe();

    return () => {
     
      supabase.removeChannel(channel);
    };
  }, [ boardId, onCommentChange]);
}
