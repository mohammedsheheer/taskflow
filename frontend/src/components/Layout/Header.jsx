/**
 * CI-016: components/Layout/Header.jsx
 * Top header bar with search, theme toggle, and mobile menu.
 * Baseline: Sub-system Baseline v1.0.0 (palette + icon-overlap fix)
 */

import React, { useState } from 'react';
import { Search, Plus, Menu, X } from 'lucide-react';
import ThemeToggle from '../UI/ThemeToggle.jsx';
import Sidebar from './Sidebar.jsx';

export default function Header({ onNewTask, activeFilter, onFilterChange, taskCount }) {
  const [search, setSearch]       = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden animate-fade-in">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"
               onClick={() => setMobileOpen(false)} />
          <div className="relative w-72 h-full animate-slide-up">
            <Sidebar
              activeFilter={activeFilter}
              onFilterChange={onFilterChange}
              mobile
              onClose={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Header Bar */}
      <header className="glass border-b border-[var(--border-glass)] px-4 md:px-6 py-3 flex items-center gap-3 sticky top-0 z-40">
        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--border-glass)] transition-colors"
          onClick={() => setMobileOpen(true)}
        >
          <Menu size={20} />
        </button>

        {/* Title / breadcrumb */}
        <div className="hidden md:block">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">
            {taskCount !== undefined ? `${taskCount} task${taskCount !== 1 ? 's' : ''}` : 'Tasks'}
          </h2>
        </div>

        {/* Search — icon fixed left, input padded enough so text never overlaps */}
        <div className="flex-1 max-w-sm relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none z-10"
          />
          <input
            type="text"
            placeholder="Search tasks…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field py-2 text-sm"
            style={{ paddingLeft: '2.25rem' }}
          />
        </div>

        <div className="flex-1" />

        {/* Actions */}
        <ThemeToggle compact />

        <button
          onClick={onNewTask}
          className="btn-primary gap-2"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">New Task</span>
        </button>
      </header>
    </>
  );
}
