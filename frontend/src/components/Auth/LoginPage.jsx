/**
 * CI-013: components/Auth/LoginPage.jsx
 * Glassmorphism login page with form validation.
 * Baseline: Sub-system Baseline v1.0.0
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, AlertCircle, CheckSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import ThemeToggle from '../UI/ThemeToggle.jsx';

export default function LoginPage() {
  const navigate  = useNavigate();
  const { login, loading } = useAuth();

  const [form, setForm]     = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const e = {};
    if (!form.email)    e.email    = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email.';
    if (!form.password) e.password = 'Password is required.';
    return e;
  };

  const handleChange = (field) => (ev) => {
    setForm((p) => ({ ...p, [field]: ev.target.value }));
    setErrors((p) => ({ ...p, [field]: '' }));
    setApiError('');
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const result = await login(form.email, form.password);
    if (result.success) navigate('/');
    else setApiError(result.error);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] bg-mesh flex items-center justify-center p-4">
      {/* Theme toggle top-right */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--accent)] shadow-lg mb-4"
               style={{ boxShadow: '0 8px 24px var(--accent-glow)' }}>
            <CheckSquare size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
            TaskFlow
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            SCM Demo — Sign in to your workspace
          </p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6">
            Welcome back
          </h2>

          {/* API Error Banner */}
          {apiError && (
            <div className="flex items-center gap-2 p-3 mb-5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm animate-fade-in">
              <AlertCircle size={15} className="shrink-0" />
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="email"
                  className={`input-field ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                  style={{ paddingLeft: '2.25rem' }}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange('email')}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="password"
                  className={`input-field ${errors.password ? 'border-red-500 focus:border-red-500' : ''}`}
                  style={{ paddingLeft: '2.25rem' }}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange('password')}
                  autoComplete="current-password"
                />
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn size={16} />
                  Sign In
                </span>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
            No account?{' '}
            <Link to="/signup" className="text-[var(--accent)] font-medium hover:underline">
              Create one free
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-[var(--text-muted)] mt-6">
          CI-013 · Sub-system Baseline v1.0.0
        </p>
      </div>
    </div>
  );
}
