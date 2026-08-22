import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProtectedRoute from '../components/ProtectedRoute';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

// Public Landing Page
import LandingPage from '../pages/LandingPage';

// Auth
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Admin
import AdminDashboard from '../pages/admin/AdminDashboard';
import HrManagement from '../pages/admin/HrManagement';
import EmployeeAssignment from '../pages/admin/EmployeeAssignment';
import SystemReports from '../pages/admin/SystemReports';
import AuditLogs from '../pages/admin/AuditLogs';

// HR
import HrDashboard from '../pages/hr/HrDashboard';
import AssignedEmployees from '../pages/hr/AssignedEmployees';
import LeaveApprovals from '../pages/hr/LeaveApprovals';
import AttendanceManager from '../pages/hr/AttendanceManager';
import TeamPayroll from '../pages/hr/TeamPayroll';

// Employee
import EmployeeDashboard from '../pages/employee/EmployeeDashboard';
import MyAttendance from '../pages/employee/MyAttendance';
import MyLeaves from '../pages/employee/MyLeaves';
import MyPayroll from '../pages/employee/MyPayroll';
import MyProfile from '../pages/employee/MyProfile';
import MyHrTimeline from '../pages/employee/MyHrTimeline';

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full">
          <Routes>
            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/hr-management" element={<HrManagement />} />
              <Route path="/admin/employee-assignment" element={<EmployeeAssignment />} />
              <Route path="/admin/reports" element={<SystemReports />} />
              <Route path="/admin/audit-logs" element={<AuditLogs />} />
            </Route>

            {/* HR Routes */}
            <Route element={<ProtectedRoute allowedRoles={['ROLE_HR']} />}>
              <Route path="/hr/dashboard" element={<HrDashboard />} />
              <Route path="/hr/employees" element={<AssignedEmployees />} />
              <Route path="/hr/leave-approvals" element={<LeaveApprovals />} />
              <Route path="/hr/attendance" element={<AttendanceManager />} />
              <Route path="/hr/payroll" element={<TeamPayroll />} />
            </Route>

            {/* Employee Routes */}
            <Route element={<ProtectedRoute allowedRoles={['ROLE_EMPLOYEE']} />}>
              <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
              <Route path="/employee/attendance" element={<MyAttendance />} />
              <Route path="/employee/leaves" element={<MyLeaves />} />
              <Route path="/employee/payroll" element={<MyPayroll />} />
              <Route path="/employee/timeline" element={<MyHrTimeline />} />
              <Route path="/employee/profile" element={<MyProfile />} />
            </Route>

            {/* Default Catch-all inside layout */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const AppRoutes = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'ROLE_ADMIN') return '/admin/dashboard';
    if (user.role === 'ROLE_HR') return '/hr/dashboard';
    if (user.role === 'ROLE_EMPLOYEE') return '/employee/dashboard';
    return '/login';
  };

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to={getDashboardPath()} replace /> : <LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/*" element={<DashboardLayout />} />
    </Routes>
  );
};

export default AppRoutes;
