/**
 * CI-019: components/Tasks/TaskModal.jsx
 * Create / Edit task modal with full form and validation.
 * Baseline: Sub-system Baseline v1.0.0
 */

import React, { useState, useEffect } from 'react';
import { X, Save, Plus } from 'lucide-react';
import { useTask } from '../../context/TaskContext.jsx';

const EMPTY = {
  title: '', description: '', status: 'todo',
  priority: 'medium', category: 'personal', due_date: '',
};

const STATUSES   = ['todo', 'in-progress', 'done'];
const PRIORITIES = ['low', 'medium', 'high'];
const CATEGORIES = ['work', 'personal', 'health', 'learning', 'other'];

const PRIORITY_COLORS = { low: '#22c55e', medium: '#ff8906', high: '#f25f4c' };
const STATUS_LABELS   = { 'todo': 'To Do', 'in-progress': 'In Progress', 'done': 'Done' };

export default function TaskModal({ task, onClose }) {
  const { createTask, updateTask } = useTask();
  const isEdit = Boolean(task);

  const [form, setForm]     = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (task) {
      setForm({
        title:       task.title       || '',
        description: task.description || '',
        status:      task.status      || 'todo',
        priority:    task.priority    || 'medium',
        category:    task.category    || 'personal',
        due_date:    task.due_date    ? task.due_date.slice(0, 10) : '',
      });
    }
  }, [task]);

  const set = (field) => (ev) => {
    setForm((p) => ({ ...p, [field]: ev.target.value }));
    setErrors((p) => ({ ...p, [field]: '' }));
    setApiError('');
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required.';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setSaving(true);
    const payload = { ...form, due_date: form.due_date || null };
    const result  = isEdit
      ? await updateTask(task.id, payload)
      : await createTask(payload);

    setSaving(false);
    if (result.success) onClose();
    else setApiError(result.error || 'Something went wrong.');
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="glass rounded-2xl w-full max-w-lg shadow-2xl animate-scale-in">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--border-glass)]">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">
            {isEdit ? 'Edit Task' : 'New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)]
              hover:bg-[var(--border-glass)] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {apiError && (
            <p className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {apiError}
            </p>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={`input-field ${errors.title ? 'border-red-500' : ''}`}
              placeholder="What needs to be done?"
              value={form.title}
              onChange={set('title')}
              autoFocus
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              className="input-field resize-none"
              placeholder="Add more context…"
              value={form.description}
              onChange={set('description')}
            />
          </div>

          {/* Row: Status + Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Status</label>
              <select className="input-field" value={form.status} onChange={set('status')}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Priority</label>
              <select className="input-field" value={form.priority} onChange={set('priority')}
                style={{ color: PRIORITY_COLORS[form.priority] }}>
                {PRIORITIES.map((p) => (
                  <option key={p} value={p} style={{ color: PRIORITY_COLORS[p] }}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row: Category + Due Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Category</label>
              <select className="input-field" value={form.category} onChange={set('category')}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Due Date</label>
              <input
                type="date"
                className="input-field"
                value={form.due_date}
                onChange={set('due_date')}
                min={new Date().toISOString().slice(0, 10)}
              />
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--text-secondary)]
                border border-[var(--border-glass)] hover:bg-[var(--border-glass)] transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isEdit ? (
                <><Save size={14} /> Save Changes</>
              ) : (
                <><Plus size={14} /> Create Task</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
