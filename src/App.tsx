import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Support from './pages/Support';
import Tutorials from './pages/Tutorials';
import ProxyChecker from './pages/ProxyChecker';
import ProxyManager from './pages/ProxyManager';
import ProtectedRoute from './components/ProtectedRoute';
import { Sidebar } from './components/Sidebar';
import { NotificationPopup } from './components/NotificationPopup';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-[#121212] transition-colors duration-200">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <div className="flex">
                      <Sidebar />
                      <div className="lg:ml-64 flex-1">
                        <Dashboard />
                      </div>
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/proxy-checker"
                element={
                  <ProtectedRoute>
                    <div className="flex">
                      <Sidebar />
                      <div className="lg:ml-64 flex-1">
                        <ProxyChecker />
                      </div>
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/proxy-manager"
                element={
                  <ProtectedRoute>
                    <div className="flex">
                      <Sidebar />
                      <div className="lg:ml-64 flex-1">
                        <ProxyManager />
                      </div>
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <div className="flex">
                      <Sidebar />
                      <div className="lg:ml-64 flex-1">
                        <Analytics />
                      </div>
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tutorials"
                element={
                  <ProtectedRoute>
                    <div className="flex">
                      <Sidebar />
                      <div className="lg:ml-64 flex-1">
                        <Tutorials />
                      </div>
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/support"
                element={
                  <ProtectedRoute>
                    <div className="flex">
                      <Sidebar />
                      <div className="lg:ml-64 flex-1">
                        <Support />
                      </div>
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
            <NotificationPopup />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;