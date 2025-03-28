import { supabase } from '../lib/supabase';

 export async function mentioningEmailService (mentionedUsers, currentUserName, cardTitle, boardId, comment) {
  // const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/email/sendMentioningEmail`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Accept': 'application/json',
  //   },
  //   body: JSON.stringify({ mentionedUsers, currentUserName, cardTitle, boardId, comment }),
  //   credentials: 'include'
  // });

  // const data = await response.json();
  // return data;  
  console.log('mentionedUsers', mentionedUsers);
  supabase.functions.invoke('send-mention-email', {
    body: {
      mentionedUsers,
      currentUserName,
      cardTitle,
      boardId,
      comment
    }
  });
}

export async function assigneeEmailService (assignedUsers, currentUserName, cardTitle, boardId, boardTitle) {
  // const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/email/sendAssigneeEmail`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Accept': 'application/json',
  //   },
  //   body: JSON.stringify({ assignedUsers, currentUserName, cardTitle, boardId, boardTitle }),
  //   credentials: 'include'
  // });

  // const data = await response.json();
  // return data;

  supabase.functions.invoke('send-assign-email', {
            body: {
              assignedUsers,
              currentUserName,
              cardTitle,
              boardId,
              boardTitle
            }
          });
}

export async function boardShareEmailService (sharedUsers, currentUserName, boardTitle, boardId) {
  // const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/email/sendBoardSharedEmail`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Accept': 'application/json',
  //   },
  //   body: JSON.stringify({ sharedUsers, currentUserName, boardTitle, boardId }),
  //   credentials: 'include'
  // });

  // const data = await response.json();
  // return data;
  supabase.functions.invoke('send-boardShared-email', {
    body: {
      sharedUsers,
      currentUserName,
      boardId,
      boardTitle,
    }
  });
}