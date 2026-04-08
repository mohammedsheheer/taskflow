/**
 * CI-009: controllers/taskController.js
 * Full CRUD scoped to authenticated user.
 * Baseline: System Baseline v1.0.0
 */

import { run, get, all } from '../config/db.js';

// GET /api/tasks
export function getTasks(req, res, next) {
  try {
    const { status, priority, category } = req.query;
    let sql    = 'SELECT * FROM tasks WHERE user_id = ?';
    const params = [req.user.id];

    if (status)   { sql += ' AND status = ?';   params.push(status); }
    if (priority) { sql += ' AND priority = ?'; params.push(priority); }
    if (category) { sql += ' AND category = ?'; params.push(category); }
    sql += ' ORDER BY created_at DESC';

    const tasks = all(sql, params);
    res.json({ tasks });
  } catch (err) { next(err); }
}

// POST /api/tasks
export function createTask(req, res, next) {
  try {
    const { title, description, status, priority, category, due_date } = req.body;
    if (!title)
      return res.status(400).json({ error: 'Task title is required.' });

    const { lastInsertRowid } = run(
      `INSERT INTO tasks (user_id, title, description, status, priority, category, due_date)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        title,
        description || '',
        status    || 'todo',
        priority  || 'medium',
        category  || 'personal',
        due_date  || null,
      ]
    );

    const task = get('SELECT * FROM tasks WHERE id = ?', [lastInsertRowid]);
    res.status(201).json({ task });
  } catch (err) { next(err); }
}

// PUT /api/tasks/:id
export function updateTask(req, res, next) {
  try {
    const existing = get(
      'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (!existing)
      return res.status(404).json({ error: 'Task not found.' });

    const { title, description, status, priority, category, due_date } = req.body;

    run(
      `UPDATE tasks
       SET title=?, description=?, status=?, priority=?, category=?, due_date=?,
           updated_at=datetime('now')
       WHERE id=? AND user_id=?`,
      [
        title        ?? existing.title,
        description  ?? existing.description,
        status       ?? existing.status,
        priority     ?? existing.priority,
        category     ?? existing.category,
        due_date     !== undefined ? due_date : existing.due_date,
        req.params.id,
        req.user.id,
      ]
    );

    const task = get('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
    res.json({ task });
  } catch (err) { next(err); }
}

// DELETE /api/tasks/:id
export function deleteTask(req, res, next) {
  try {
    const { changes } = run(
      'DELETE FROM tasks WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (changes === 0)
      return res.status(404).json({ error: 'Task not found.' });
    res.json({ message: 'Task deleted successfully.' });
  } catch (err) { next(err); }
}
