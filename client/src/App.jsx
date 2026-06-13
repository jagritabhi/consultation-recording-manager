import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';

// Import Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RecordingList from './pages/RecordingList';
import RecordingForm from './pages/RecordingForm';
import RecordingDetails from './pages/RecordingDetails';
import Profile from './pages/Profile';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Application Layout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard Index */}
            <Route index element={<Dashboard />} />

            {/* Recording Management */}
            <Route path="recordings" element={<RecordingList />} />
            <Route path="recordings/new" element={<RecordingForm />} />
            <Route path="recordings/edit/:id" element={<RecordingForm />} />
            <Route path="recordings/:id" element={<RecordingDetails />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Catch-all Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
