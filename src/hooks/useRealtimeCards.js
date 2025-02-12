// import { useEffect } from 'react';
// import { supabase } from '../lib/supabase';

// export function useRealtimeCards(boardId, onCardChange) {
//   useEffect(() => {
//     if (!boardId) return;

//     // First get all column IDs for this board
   

//     const setupSubscription = async () => {
    
      
//       const channel = supabase
//         .channel(`public:cards:${boardId}`)
//         .on(
//           'postgres_changes',
//           {
//             event: '*',
//             schema: 'public',
//             table: 'cards',
           
//           },
//           async (payload) => {
//             // console.log('Card change received:', payload);
            
//             if (payload.eventType === 'DELETE') {
//               onCardChange({ id: payload.old.id, type: 'DELETE' });
//               return;
//             }

//             const { data: updatedCard, error } = await supabase
//               .from('cards')
//               .select('*')
//               .eq('id', payload.new.id)
//               .single();
 
//               console.log("updated card: ", updatedCard);
//             if (!error && updatedCard) {
//               onCardChange({
//                 ...updatedCard,
//                 type: payload.eventType
//               });
//             }
//           }
//         )
//         .subscribe();

//       return channel;
//     };

//     let channel;
//     setupSubscription().then(ch => channel = ch);

//     return () => {
//       if (channel) {
//         supabase.removeChannel(channel);
//       }
//     };
//   }, [boardId, onCardChange]);
// }

import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useRealtimeCards(boardId, onCardChange) {
  useEffect(() => {
    if (!boardId) return;

    // Setup the real-time subscription
    const channel = supabase
      .channel(`cards-board-${boardId}`)
      .on(
        'postgres_changes',
        {
          event: '*', // Listening to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'cards',
        },
        async (payload) => {
          console.log("Realtime event received:", payload);

          if (payload.eventType === 'DELETE') {
            onCardChange({ id: payload.old.id, type: 'DELETE' });
            return;
          }

          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            // We can use payload.new directly (avoiding an extra DB fetch)
            onCardChange({
              ...payload.new, 
              type: payload.eventType
            });
          }
        }
      )
      .subscribe();

    // Cleanup on unmount or boardId change
    return () => {
      supabase.removeChannel(channel);
    };
  }, [boardId, onCardChange]);
}
