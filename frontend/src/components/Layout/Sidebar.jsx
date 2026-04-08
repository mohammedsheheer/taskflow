/**
 * CI-015: components/Layout/Sidebar.jsx
 * Navigation sidebar with category/status filters.
 * Baseline: Sub-system Baseline v1.0.0
 */

import React from 'react';
import {
  CheckSquare, LayoutDashboard, Briefcase, User, Heart,
  BookOpen, MoreHorizontal, ListTodo, Clock, CheckCircle2,
  ChevronRight, LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTask } from '../../context/TaskContext.jsx';

const NAV_ITEMS = [
  { label: 'All Tasks',    icon: LayoutDashboard, filter: {} },
  { label: 'To Do',        icon: ListTodo,         filter: { status: 'todo' } },
  { label: 'In Progress',  icon: Clock,            filter: { status: 'in-progress' } },
  { label: 'Completed',    icon: CheckCircle2,     filter: { status: 'done' } },
];

const CATEGORIES = [
  { label: 'Work',     icon: Briefcase,    key: 'work',     cls: 'cat-work' },
  { label: 'Personal', icon: User,         key: 'personal', cls: 'cat-personal' },
  { label: 'Health',   icon: Heart,        key: 'health',   cls: 'cat-health' },
  { label: 'Learning', icon: BookOpen,     key: 'learning', cls: 'cat-learning' },
  { label: 'Other',    icon: MoreHorizontal, key: 'other',  cls: 'cat-other' },
];

export default function Sidebar({ activeFilter, onFilterChange, mobile, onClose }) {
  const { user, logout } = useAuth();
  const { tasks } = useTask();

  const countFor = (filter) => {
    return tasks.filter((t) => {
      if (filter.status   && t.status   !== filter.status)   return false;
      if (filter.category && t.category !== filter.category) return false;
      return true;
    }).length;
  };

  const isActive = (filter) => {
    return JSON.stringify(activeFilter) === JSON.stringify(filter);
  };

  const handleNav = (filter) => {
    onFilterChange(filter);
    if (mobile && onClose) onClose();
  };

  return (
    <aside className={`
      flex flex-col h-full
      ${mobile ? 'w-full' : 'w-64'}
      glass border-r border-[var(--border-glass)]
      p-4 gap-6
    `}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-2 pt-2">
        <div className="w-9 h-9 rounded-xl bg-[var(--accent)] flex items-center justify-center shrink-0"
             style={{ boxShadow: '0 4px 12px var(--accent-glow)' }}>
          <CheckSquare size={18} className="text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold text-[var(--text-primary)] leading-none">TaskFlow</h1>
          <p className="text-[10px] text-[var(--text-muted)] font-mono mt-0.5">v1.0.0 · SCM Demo</p>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="flex flex-col gap-1">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] px-2 mb-1">
          Views
        </p>
        {NAV_ITEMS.map(({ label, icon: Icon, filter }) => (
          <button
            key={label}
            onClick={() => handleNav(filter)}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
              transition-all duration-150
              ${isActive(filter)
                ? 'bg-[var(--accent)] text-white shadow-sm'
                : 'text-[var(--text-secondary)] hover:bg-[var(--border-glass)] hover:text-[var(--text-primary)]'
              }
            `}
          >
            <Icon size={16} />
            <span className="flex-1 text-left">{label}</span>
            <span className={`text-xs rounded-full px-2 py-0.5 font-mono
              ${isActive(filter) ? 'bg-white/20 text-white' : 'bg-[var(--border-glass)] text-[var(--text-muted)]'}`}>
              {countFor(filter)}
            </span>
          </button>
        ))}
      </nav>

      {/* Categories */}
      <nav className="flex flex-col gap-1">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] px-2 mb-1">
          Categories
        </p>
        {CATEGORIES.map(({ label, icon: Icon, key, cls }) => {
          const filter = { category: key };
          const active = isActive(filter);
          return (
            <button
              key={key}
              onClick={() => handleNav(filter)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-150
                ${active
                  ? 'bg-[var(--accent)] text-white'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--border-glass)] hover:text-[var(--text-primary)]'
                }
              `}
            >
              <Icon size={16} />
              <span className="flex-1 text-left">{label}</span>
              <span className={`text-xs rounded-full px-2 py-0.5 font-mono
                ${active ? 'bg-white/20 text-white' : 'bg-[var(--border-glass)] text-[var(--text-muted)]'}`}>
                {countFor(filter)}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* User / Logout */}
      <div className="border-t border-[var(--border-glass)] pt-4">
        <div className="flex items-center gap-3 px-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-white text-xs font-bold shrink-0">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--text-primary)] truncate">{user?.name}</p>
            <p className="text-xs text-[var(--text-muted)] truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
            text-[var(--text-secondary)] hover:bg-red-500/10 hover:text-red-500
            transition-all duration-150"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
