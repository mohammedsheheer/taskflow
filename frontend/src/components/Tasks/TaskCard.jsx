/**
 * CI-018: components/Tasks/TaskCard.jsx
 * Individual task card with glassmorphism styling and inline actions.
 * Baseline: Sub-system Baseline v1.0.0
 */

import React, { useState } from 'react';
import {
  Pencil, Trash2, Calendar, Flag, Tag,
  Circle, Timer, CheckCircle2
} from 'lucide-react';
import { useTask } from '../../context/TaskContext.jsx';

const PRIORITY_META = {
  low:    { label: 'Low',    cls: 'priority-low',    dotCls: 'priority-dot-low',    icon: '▼' },
  medium: { label: 'Medium', cls: 'priority-medium',  dotCls: 'priority-dot-medium', icon: '●' },
  high:   { label: 'High',   cls: 'priority-high',   dotCls: 'priority-dot-high',   icon: '▲' },
};

const STATUS_META = {
  'todo':        { label: 'To Do',       cls: 'status-todo',        Icon: Circle },
  'in-progress': { label: 'In Progress', cls: 'status-in-progress', Icon: Timer },
  'done':        { label: 'Done',        cls: 'status-done',        Icon: CheckCircle2 },
};

const CATEGORY_META = {
  work:     { label: 'Work',     cls: 'cat-work' },
  personal: { label: 'Personal', cls: 'cat-personal' },
  health:   { label: 'Health',   cls: 'cat-health' },
  learning: { label: 'Learning', cls: 'cat-learning' },
  other:    { label: 'Other',    cls: 'cat-other' },
};

export default function TaskCard({ task, onEdit }) {
  const { deleteTask, updateTask } = useTask();
  const [deleting, setDeleting] = useState(false);

  const priority = PRIORITY_META[task.priority] || PRIORITY_META.medium;
  const status   = STATUS_META[task.status]     || STATUS_META['todo'];
  const category = CATEGORY_META[task.category] || CATEGORY_META.other;

  const { Icon: StatusIcon } = status;

  const handleDelete = async () => {
    if (!confirm('Delete this task?')) return;
    setDeleting(true);
    await deleteTask(task.id);
  };

  const cycleStatus = async () => {
    const order = ['todo', 'in-progress', 'done'];
    const next  = order[(order.indexOf(task.status) + 1) % order.length];
    await updateTask(task.id, { ...task, status: next });
  };

  const formatDate = (d) => {
    if (!d) return null;
    return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  const isOverdue = task.due_date && task.status !== 'done' &&
    new Date(task.due_date) < new Date();

  return (
    <div
      className={`glass-card rounded-2xl p-4 flex flex-col gap-3 animate-fade-in
        ${deleting ? 'opacity-50 pointer-events-none' : ''}
        ${task.status === 'done' ? 'opacity-70' : ''}
      `}
    >
      {/* Top row: status cycle + title + actions */}
      <div className="flex items-start gap-3">
        {/* Status cycle button */}
        <button
          onClick={cycleStatus}
          title={`Status: ${status.label} — click to advance`}
          className={`mt-0.5 shrink-0 rounded-full p-1 transition-all duration-200
            ${status.cls} hover:scale-110`}
        >
          <StatusIcon size={16} />
        </button>

        {/* Title */}
        <h3 className={`flex-1 text-sm font-semibold text-[var(--text-primary)] leading-snug
          ${task.status === 'done' ? 'line-through text-[var(--text-muted)]' : ''}`}>
          {task.title}
        </h3>

        {/* Action buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--accent)]
              hover:bg-[var(--accent-glow)] transition-all duration-150"
            title="Edit task"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-500
              hover:bg-red-500/10 transition-all duration-150"
            title="Delete task"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-2 pl-8">
          {task.description}
        </p>
      )}

      {/* Footer pills */}
      <div className="flex flex-wrap items-center gap-2 pl-8">
        {/* Category */}
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${category.cls}`}>
          <Tag size={9} />
          {category.label}
        </span>

        {/* Priority */}
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${priority.cls}`}
              style={{ background: 'var(--border-glass)' }}>
          <span className={`w-1.5 h-1.5 rounded-full ${priority.dotCls}`} />
          {priority.label}
        </span>

        {/* Due date */}
        {task.due_date && (
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium
            ${isOverdue
              ? 'bg-red-500/10 text-red-500'
              : 'bg-[var(--border-glass)] text-[var(--text-muted)]'
            }`}>
            <Calendar size={9} />
            {isOverdue ? 'Overdue · ' : ''}{formatDate(task.due_date)}
          </span>
        )}
      </div>
    </div>
  );
}
