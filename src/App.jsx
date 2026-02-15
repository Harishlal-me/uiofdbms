import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/public/Landing';
import LoginPage from './pages/public/Login';
import Dashboard from './pages/user/Dashboard';
import ReportLost from './pages/user/ReportLost';
import ReportFound from './pages/user/ReportFound';
import BrowseItems from './pages/user/Browse';
import ReportedLost from './pages/user/ReportedLost';
import ReportedFound from './pages/user/ReportedFound';
import CSCredits from './pages/user/CSCredits';

import AdminDashboard from './pages/admin/AdminDashboard';
import VerificationQueue from './pages/admin/VerificationQueue';
import ItemDatabase from './pages/admin/ItemDatabase';
import Users from './pages/admin/Users';
import StorageLocations from './pages/admin/StorageLocations';

import AuditLogs from './pages/admin/AuditLogs';
import Analytics from './pages/admin/Analytics';

import AppLayout from './components/layout/AppLayout';
import { NotificationProvider } from './context/NotificationContext';

// Mock Auth wrapper
const ProtectedRoute = ({ children, role }) => {
  const userRole = localStorage.getItem('userRole'); // 'user' or 'admin'
  if (!userRole) return <Navigate to="/login" replace />;
  if (role && userRole !== role) return <Navigate to="/dashboard" replace />;
  return children;
};



export default function App() {
  return (
    <NotificationProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* User Routes (Wrapped in Layout) */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/report-lost" element={<ProtectedRoute><ReportLost /></ProtectedRoute>} />
            <Route path="/report-found" element={<ProtectedRoute><ReportFound /></ProtectedRoute>} />
            <Route path="/browse" element={<ProtectedRoute><BrowseItems /></ProtectedRoute>} />
            <Route path="/reported-lost" element={<ProtectedRoute><ReportedLost /></ProtectedRoute>} />
            <Route path="/reported-found" element={<ProtectedRoute><ReportedFound /></ProtectedRoute>} />
            <Route path="/cs-credits" element={<ProtectedRoute><CSCredits /></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/verification-queue" element={<ProtectedRoute role="admin"><VerificationQueue /></ProtectedRoute>} />
            <Route path="/admin/items" element={<ProtectedRoute role="admin"><ItemDatabase /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute role="admin"><Users /></ProtectedRoute>} />
            <Route path="/admin/storage" element={<ProtectedRoute role="admin"><StorageLocations /></ProtectedRoute>} />

            <Route path="/admin/audit-logs" element={<ProtectedRoute role="admin"><AuditLogs /></ProtectedRoute>} />
            <Route path="/admin/analytics" element={<ProtectedRoute role="admin"><Analytics /></ProtectedRoute>} />
          </Route>
        </Routes>
      </Router>
    </NotificationProvider>
  );
}
