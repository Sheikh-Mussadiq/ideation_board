import { useEffect } from "react";

export function useScrollLock(lock) {
  useEffect(() => {
    if (lock) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${
        window.innerWidth - document.documentElement.clientWidth
      }px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [lock]);
}
