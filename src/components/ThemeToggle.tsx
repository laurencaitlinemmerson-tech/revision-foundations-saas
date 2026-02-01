'use client';

import { Moon, Sun } from 'lucide-react';
import { useContext, useState, useEffect } from 'react';
import { ThemeContext } from './ThemeProvider';

export default function ThemeToggle() {
  const context = useContext(ThemeContext);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // If no ThemeProvider, handle theme manually
  const theme = context?.theme ?? (typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  
  const toggleTheme = () => {
    if (context?.toggleTheme) {
      context.toggleTheme();
    } else if (typeof window !== 'undefined') {
      // Fallback: toggle manually
      const isDark = document.documentElement.classList.contains('dark');
      if (isDark) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      }
    }
  };

  // Avoid hydration mismatch
  if (!mounted) {
    return (
      <button
        className="p-2 rounded-lg hover:bg-[var(--lilac-soft)] dark:hover:bg-[var(--plum)]/20 transition-colors"
        aria-label="Toggle theme"
      >
        <Moon className="w-5 h-5 text-[var(--plum)] dark:text-[var(--lavender)]" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-[var(--lilac-soft)] dark:hover:bg-[var(--plum)]/20 transition-colors"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-[var(--plum)] dark:text-[var(--lavender)]" />
      ) : (
        <Sun className="w-5 h-5 text-[var(--lavender)]" />
      )}
    </button>
  );
}
