/**
 * CI-008: controllers/authController.js
 * Baseline: System Baseline v1.0.0
 */

import bcrypt from 'bcryptjs';
import jwt    from 'jsonwebtoken';
import { run, get } from '../config/db.js';

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// POST /api/auth/signup
export async function signup(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: 'Name, email and password are required.' });
    if (password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });

    const existing = get('SELECT id FROM users WHERE email = ?', [email]);
    if (existing)
      return res.status(409).json({ error: 'A user with this email already exists.' });

    const hashed = await bcrypt.hash(password, 12);
    const { lastInsertRowid } = run(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashed]
    );

    const user  = { id: lastInsertRowid, name, email };
    const token = generateToken(user);
    res.status(201).json({ token, user });
  } catch (err) { next(err); }
}

// POST /api/auth/login
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required.' });

    const user = get('SELECT * FROM users WHERE email = ?', [email]);
    if (!user)
      return res.status(401).json({ error: 'Invalid email or password.' });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ error: 'Invalid email or password.' });

    const token = generateToken(user);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) { next(err); }
}

// GET /api/auth/me
export function getMe(req, res, next) {
  try {
    const user = get(
      'SELECT id, name, email, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json({ user });
  } catch (err) { next(err); }
}
