import { useTheme } from "../context/ThemeContext";
import { Moon, Sun } from "lucide-react";

const DarkModeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="theme-toggle-btn"
    >
      {isDark ? <Moon size={15} strokeWidth={2.25} /> : <Sun size={15} strokeWidth={2.25} />}
      <span>{isDark ? "Dark" : "Light"}</span>
    </button>
  );
};

export default DarkModeToggle;
