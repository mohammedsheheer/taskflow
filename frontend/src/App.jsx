/**
 * App.jsx — Root application component with routing and context providers.
 * CI Registry: Orchestrates CI-010, CI-011, CI-012.
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider }  from './context/ThemeContext.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { TaskProvider }   from './context/TaskContext.jsx';
import LoginPage   from './components/Auth/LoginPage.jsx';
import SignupPage  from './components/Auth/SignupPage.jsx';
import TaskBoard   from './components/Tasks/TaskBoard.jsx';

// Protected route wrapper
function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

// Public route wrapper (redirect if already logged in)
function PublicRoute({ children }) {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TaskProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login"  element={<PublicRoute><LoginPage  /></PublicRoute>} />
              <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
              <Route path="/"       element={<PrivateRoute><TaskBoard /></PrivateRoute>} />
              <Route path="*"       element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </TaskProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
