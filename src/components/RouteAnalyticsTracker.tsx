import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "@/lib/analytics";

export const RouteAnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const fullPath = `${location.pathname}${location.search}${location.hash}`;
    trackPageView(fullPath);
  }, [location.hash, location.pathname, location.search]);

  return null;
};
