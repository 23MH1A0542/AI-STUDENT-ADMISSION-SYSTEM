import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import CourseRecommender from './pages/CourseRecommender';
import CoursesList from './pages/CoursesList';
import AdminDashboard from './pages/AdminDashboard';
import CourseCRUD from './pages/CourseCRUD';
import ApplicationReview from './pages/ApplicationReview';
import Analytics from './pages/Analytics';

// Helper component for protecting student routes
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return null; // Wait for initial auth lookup
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Helper component for protecting admin routes
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return isAdmin ? children : <Navigate to="/dashboard" replace />;
};

const AppContent = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/login" element={
        isAuthenticated 
          ? <Navigate to={isAdmin ? "/admin/dashboard" : "/dashboard"} replace /> 
          : <Login />
      } />
      <Route path="/register" element={
        isAuthenticated 
          ? <Navigate to="/dashboard" replace /> 
          : <Register />
      } />

      {/* Shared routes inside layout */}
      <Route path="/courses" element={
        <Layout>
          <CoursesList />
        </Layout>
      } />

      {/* Student Protected Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout>
            <StudentDashboard />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/recommendations" element={
        <ProtectedRoute>
          <Layout>
            <CourseRecommender />
          </Layout>
        </ProtectedRoute>
      } />

      {/* Admin Protected Routes */}
      <Route path="/admin/dashboard" element={
        <AdminRoute>
          <Layout>
            <AdminDashboard />
          </Layout>
        </AdminRoute>
      } />

      <Route path="/admin/courses" element={
        <AdminRoute>
          <Layout>
            <CourseCRUD />
          </Layout>
        </AdminRoute>
      } />

      <Route path="/admin/applications/:id" element={
        <AdminRoute>
          <Layout>
            <ApplicationReview />
          </Layout>
        </AdminRoute>
      } />

      <Route path="/admin/analytics" element={
        <AdminRoute>
          <Layout>
            <Analytics />
          </Layout>
        </AdminRoute>
      } />

      {/* Fallback Redirection */}
      <Route path="*" element={
        <Navigate to={isAuthenticated ? (isAdmin ? "/admin/dashboard" : "/dashboard") : "/login"} replace />
      } />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
