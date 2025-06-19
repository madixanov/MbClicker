import { useEffect } from "react";
import syncClicksToStrapi from "../utils/syncClicksToStrapi";

const AutoSaveClicks = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      syncClicksToStrapi();
    }, 15000); // каждые 15 секунд

    return () => clearInterval(interval);
  }, []);

  return null;
};

export default AutoSaveClicks;
