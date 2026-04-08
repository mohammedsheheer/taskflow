/**
 * CI-012: context/TaskContext.jsx
 * Central state management for tasks (CRUD + filters).
 * Baseline: Sub-system Baseline v1.0.0
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../api/axios.js';

const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const [tasks, setTasks]     = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [filters, setFilters] = useState({ status: '', priority: '', category: '' });

  const fetchTasks = useCallback(async (overrideFilters) => {
    setLoading(true);
    setError(null);
    try {
      const params = overrideFilters || filters;
      const { data } = await api.get('/tasks', { params });
      setTasks(data.tasks);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createTask = async (payload) => {
    try {
      const { data } = await api.post('/tasks', payload);
      setTasks((prev) => [data.task, ...prev]);
      return { success: true, task: data.task };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Failed to create task.' };
    }
  };

  const updateTask = async (id, payload) => {
    try {
      const { data } = await api.put(`/tasks/${id}`, payload);
      setTasks((prev) => prev.map((t) => (t.id === id ? data.task : t)));
      return { success: true, task: data.task };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Failed to update task.' };
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Failed to delete task.' };
    }
  };

  const applyFilters = (newFilters) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    fetchTasks(updated);
  };

  const clearFilters = () => {
    const reset = { status: '', priority: '', category: '' };
    setFilters(reset);
    fetchTasks(reset);
  };

  return (
    <TaskContext.Provider value={{
      tasks, loading, error, filters,
      fetchTasks, createTask, updateTask, deleteTask,
      applyFilters, clearFilters,
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTask() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTask must be used within TaskProvider');
  return ctx;
}
