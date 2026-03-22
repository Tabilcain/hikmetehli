import { useLocation } from "react-router-dom";
import { usePerformanceMode } from "@/hooks/usePerformanceMode";

export const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const { lowPerformanceMode } = usePerformanceMode();
  const location = useLocation();
  const isPrimaryRoute = location.pathname === "/"
    || location.pathname.startsWith("/muasir")
    || location.pathname.startsWith("/selef-incileri")
    || location.pathname.startsWith("/sahabeden");

  if (lowPerformanceMode && isPrimaryRoute) {
    return <div>{children}</div>;
  }

  return <div className={lowPerformanceMode ? "page-fade-quick" : "page-fade"}>{children}</div>;
};
