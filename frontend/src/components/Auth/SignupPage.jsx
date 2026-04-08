/**
 * CI-014: components/Auth/SignupPage.jsx
 * Glassmorphism registration page with full form validation.
 * Baseline: Sub-system Baseline v1.0.0
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, AlertCircle, CheckSquare, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import ThemeToggle from '../UI/ThemeToggle.jsx';

const strengthCheck = (pwd) => {
  let score = 0;
  if (pwd.length >= 6)           score++;
  if (pwd.length >= 10)          score++;
  if (/[A-Z]/.test(pwd))        score++;
  if (/[0-9]/.test(pwd))        score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score; // 0-5
};

const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
const strengthColor = ['', '#f25f4c', '#ff8906', '#a7a9be', '#22c55e', '#e53170'];

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup, loading } = useAuth();

  const [form, setForm]     = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const strength = strengthCheck(form.password);

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name    = 'Full name is required.';
    if (!form.email)        e.email   = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email.';
    if (!form.password)     e.password = 'Password is required.';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters.';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match.';
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
    const result = await signup(form.name, form.email, form.password);
    if (result.success) navigate('/');
    else setApiError(result.error);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] bg-mesh flex items-center justify-center p-4">
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
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">TaskFlow</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Create your free workspace</p>
        </div>

        <div className="glass rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6">Get started</h2>

          {apiError && (
            <div className="flex items-center gap-2 p-3 mb-5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm animate-fade-in">
              <AlertCircle size={15} className="shrink-0" />
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Full Name</label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input type="text" className={`input-field ${errors.name ? 'border-red-500' : ''}`} style={{ paddingLeft: '2.25rem' }}
                  placeholder="Ada Lovelace" value={form.name} onChange={handleChange('name')} autoComplete="name" />
              </div>
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input type="email" className={`input-field ${errors.email ? 'border-red-500' : ''}`} style={{ paddingLeft: '2.25rem' }}
                  placeholder="you@example.com" value={form.email} onChange={handleChange('email')} autoComplete="email" />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input type="password" className={`input-field ${errors.password ? 'border-red-500' : ''}`} style={{ paddingLeft: '2.25rem' }}
                  placeholder="Min. 6 characters" value={form.password} onChange={handleChange('password')} autoComplete="new-password" />
              </div>
              {/* Strength meter */}
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1,2,3,4,5].map((n) => (
                      <div key={n} className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{ background: n <= strength ? strengthColor[strength] : 'var(--border-glass)' }} />
                    ))}
                  </div>
                  <p className="text-xs" style={{ color: strengthColor[strength] }}>
                    {strengthLabel[strength]}
                  </p>
                </div>
              )}
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input type="password" className={`input-field ${errors.confirm ? 'border-red-500' : ''}`} style={{ paddingLeft: '2.25rem' }}
                  placeholder="••••••••" value={form.confirm} onChange={handleChange('confirm')} autoComplete="new-password" />
                {form.confirm && form.confirm === form.password && (
                  <Check size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
                )}
              </div>
              {errors.confirm && <p className="text-xs text-red-500 mt-1">{errors.confirm}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <UserPlus size={16} />
                  Create Account
                </span>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[var(--accent)] font-medium hover:underline">Sign in</Link>
          </p>
        </div>

        <p className="text-center text-xs text-[var(--text-muted)] mt-6">
          CI-014 · Sub-system Baseline v1.0.0
        </p>
      </div>
    </div>
  );
}
