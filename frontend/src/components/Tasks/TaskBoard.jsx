/**
 * CI-017: components/Tasks/TaskBoard.jsx
 * Main task board with Kanban-style columns and filter controls.
 * Baseline: Sub-system Baseline v1.0.0
 */

import React, { useEffect, useState } from 'react';
import { Filter, X, Loader2, ClipboardList } from 'lucide-react';
import { useTask } from '../../context/TaskContext.jsx';
import TaskCard  from './TaskCard.jsx';
import TaskModal from './TaskModal.jsx';
import Header    from '../Layout/Header.jsx';
import Sidebar   from '../Layout/Sidebar.jsx';

const COLUMNS = [
  { key: 'todo',        label: 'To Do',       accent: '#a7a9be' },
  { key: 'in-progress', label: 'In Progress',  accent: '#ff8906' },
  { key: 'done',        label: 'Done',         accent: '#22c55e' },
];

export default function TaskBoard() {
  const { tasks, loading, error, fetchTasks, applyFilters, clearFilters, filters } = useTask();
  const [activeFilter, setActiveFilter] = useState({});
  const [modalOpen, setModalOpen]       = useState(false);
  const [editTask,  setEditTask]        = useState(null);

  useEffect(() => { fetchTasks(); }, []);

  // Derive local display based on sidebar filter
  const displayTasks = (() => {
    let t = [...tasks];
    if (activeFilter.status)   t = t.filter((x) => x.status   === activeFilter.status);
    if (activeFilter.category) t = t.filter((x) => x.category === activeFilter.category);
    return t;
  })();

  // Group into Kanban columns
  const grouped = COLUMNS.reduce((acc, col) => {
    acc[col.key] = displayTasks.filter((t) => t.status === col.key);
    return acc;
  }, {});

  // Flatten view if a status filter is active (show single column)
  const showKanban = !activeFilter.status;

  const openNew  = () => { setEditTask(null); setModalOpen(true); };
  const openEdit = (task) => { setEditTask(task); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditTask(null); };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-primary)] bg-mesh">
      {/* Sidebar — desktop only */}
      <div className="hidden md:flex md:flex-col md:w-64 shrink-0">
        <Sidebar
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header
          onNewTask={openNew}
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
          taskCount={displayTasks.length}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Active filter badge */}
          {(activeFilter.status || activeFilter.category) && (
            <div className="flex items-center gap-2 mb-4 animate-fade-in">
              <Filter size={13} className="text-[var(--text-muted)]" />
              <span className="text-xs text-[var(--text-secondary)]">Filtered by:</span>
              {activeFilter.status && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--accent)] text-white font-medium">
                  {activeFilter.status}
                </span>
              )}
              {activeFilter.category && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--accent)] text-white font-medium">
                  {activeFilter.category}
                </span>
              )}
              <button onClick={() => setActiveFilter({})}
                className="ml-1 p-0.5 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                <X size={12} />
              </button>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-[var(--text-muted)]">
              <Loader2 size={28} className="animate-spin" />
              <p className="text-sm">Loading tasks…</p>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="text-center py-16">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && displayTasks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-4 animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-[var(--border-glass)] flex items-center justify-center">
                <ClipboardList size={28} className="text-[var(--text-muted)]" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-[var(--text-primary)]">No tasks yet</p>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  Hit <strong>New Task</strong> to add your first one.
                </p>
              </div>
              <button onClick={openNew} className="btn-primary">
                + New Task
              </button>
            </div>
          )}

          {/* Kanban Board */}
          {!loading && !error && displayTasks.length > 0 && showKanban && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
              {COLUMNS.map((col) => (
                <div key={col.key} className="flex flex-col gap-3">
                  {/* Column header */}
                  <div className="flex items-center gap-2 px-1">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: col.accent }} />
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                      {col.label}
                    </h3>
                    <span className="ml-auto text-xs font-mono text-[var(--text-muted)]
                      bg-[var(--border-glass)] px-2 py-0.5 rounded-full">
                      {grouped[col.key].length}
                    </span>
                  </div>
                  {/* Cards */}
                  <div className="flex flex-col gap-3 min-h-[60px]">
                    {grouped[col.key].length === 0 ? (
                      <div className="rounded-2xl border-2 border-dashed border-[var(--border-glass)]
                        flex items-center justify-center py-8 text-xs text-[var(--text-muted)]">
                        Empty
                      </div>
                    ) : (
                      grouped[col.key].map((task) => (
                        <TaskCard key={task.id} task={task} onEdit={openEdit} />
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Filtered list view (single status or category filter) */}
          {!loading && !error && displayTasks.length > 0 && !showKanban && (
            <div className="flex flex-col gap-3 max-w-2xl">
              {displayTasks.map((task) => (
                <TaskCard key={task.id} task={task} onEdit={openEdit} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Task Modal */}
      {modalOpen && (
        <TaskModal task={editTask} onClose={closeModal} />
      )}
    </div>
  );
}
