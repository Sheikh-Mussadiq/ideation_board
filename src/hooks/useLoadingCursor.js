import { useEffect } from "react";
import { toast } from "react-hot-toast";

export function useLoadingCursor(isLoading) {
  useEffect(() => {
    if (isLoading) {
      document.body.classList.add("loading-cursor");
      const handleClick = (event) => {
        event.preventDefault();
        toast("Please wait...", { icon: "⏳" });
      };
      document.addEventListener("click", handleClick, true);

      return () => {
        document.body.classList.remove("loading-cursor");
        document.removeEventListener("click", handleClick, true);
      };
    }
  }, [isLoading]);
}
