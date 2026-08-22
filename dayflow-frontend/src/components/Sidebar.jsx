import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  CalendarCheck,
  FileCheck,
  CircleDollarSign,
  User,
  Bot,
  BarChart3,
  Building2,
  Clock,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/admin/hr-management', label: 'HR Accounts', icon: Users },
    { to: '/admin/employee-assignment', label: 'Assign Employees', icon: UserPlus },
    { to: '/admin/reports', label: 'System Analytics', icon: BarChart3 },
    { to: '/admin/audit-logs', label: 'Audit Logs', icon: ShieldAlert },
  ];

  const hrLinks = [
    { to: '/hr/dashboard', label: 'HR Dashboard', icon: LayoutDashboard },
    { to: '/hr/employees', label: 'Assigned Employees', icon: Users },
    { to: '/hr/leave-approvals', label: 'Leave Requests', icon: FileCheck },
    { to: '/hr/attendance', label: 'Attendance Log', icon: CalendarCheck },
    { to: '/hr/payroll', label: 'Team Payroll', icon: CircleDollarSign },
  ];

  const employeeLinks = [
    { to: '/employee/dashboard', label: 'Dashboard & AI', icon: Bot },
    { to: '/employee/attendance', label: 'My Attendance', icon: CalendarCheck },
    { to: '/employee/leaves', label: 'My Leaves', icon: FileCheck },
    { to: '/employee/payroll', label: 'My Payroll', icon: CircleDollarSign },
    { to: '/employee/timeline', label: 'My HR Timeline', icon: Clock },
    { to: '/employee/profile', label: 'My Profile', icon: User },
  ];

  let currentLinks = [];
  if (user?.role === 'ROLE_ADMIN') currentLinks = adminLinks;
  else if (user?.role === 'ROLE_HR') currentLinks = hrLinks;
  else if (user?.role === 'ROLE_EMPLOYEE') currentLinks = employeeLinks;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-[calc(100vh-4rem)] sticky top-16 p-4 flex flex-col justify-between shrink-0 hidden md:flex">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">
            Main Navigation
          </p>
          <nav className="space-y-1.5">
            {currentLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-bold text-sm transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white shadow-md shadow-cyan-500/20'
                        : 'text-slate-600 hover:bg-cyan-50/60 hover:text-cyan-700'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Info Box */}
      <div className="p-3.5 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 rounded-2xl text-white border border-cyan-500/20 shadow-md">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold mb-1">
          <Sparkles className="w-4 h-4" /> Dayflow Enterprise
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          AI-Powered Privacy-First HRMS with Blue-Cyan-Purple Theme.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
