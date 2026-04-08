/**
 * CI-020: components/UI/ThemeToggle.jsx
 * Animated dark/light mode toggle button.
 * Baseline: Sub-system Baseline v1.0.0
 */

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.jsx';

export default function ThemeToggle({ compact = false }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className={`
        relative inline-flex items-center gap-2 rounded-xl border transition-all duration-300
        ${compact ? 'p-2' : 'px-3 py-2'}
        border-[var(--border-glass)] bg-[var(--bg-secondary)]
        hover:border-[var(--accent)] hover:shadow-md
        text-[var(--text-secondary)] hover:text-[var(--accent)]
      `}
    >
      <span
        className="transition-all duration-500"
        style={{ transform: isDark ? 'rotate(0deg)' : 'rotate(180deg)' }}
      >
        {isDark ? <Sun size={16} /> : <Moon size={16} />}
      </span>
      {!compact && (
        <span className="text-xs font-medium">
          {isDark ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  );
}
