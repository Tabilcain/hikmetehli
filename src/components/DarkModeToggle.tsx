import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="fixed top-6 right-6 z-50 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-300 hover:shadow-[0_0_20px_hsl(var(--primary)/0.15)]"
      aria-label="Toggle dark mode"
      type="button"
    >
      <span className={`theme-toggle-icon ${isDark ? "is-dark" : "is-light"}`}>
        {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
      </span>
    </button>
  );
};
