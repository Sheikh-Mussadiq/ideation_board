import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabase";

export function useMouseRealtime(username) {
  const [users, setUsers] = useState({}); // Store only one position per user
  const lastSent = useRef(Date.now()); // Track last update time

  useEffect(() => {
    if (!username) return;

    const handleMouseMove = (e) => {
      const now = Date.now();
      if (now - lastSent.current < 100) return; // Limit updates to 10 times per second

      lastSent.current = now;
      const { clientX: x, clientY: y } = e;

      // Send the new position via Supabase Broadcast
      supabase.channel("mouse-channel").send({
        type: "broadcast",
        event: "mouse_move",
        payload: { username, x, y },
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Listen for incoming cursor updates
    const subscription = supabase
      .channel("mouse-channel")
      .on("broadcast", { event: "mouse_move" }, (payload) => {
        setUsers((prev) => ({
          ...prev,
          [payload.payload.username]: payload.payload, // Overwrite the old position
        }));
      })
      .subscribe();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      subscription.unsubscribe();
    };
  }, [username]);

  return users; // Return the latest positions
}
