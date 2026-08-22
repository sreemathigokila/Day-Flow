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
  Building2
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/admin/hr-management', label: 'HR Accounts', icon: Users },
    { to: '/admin/employee-assignment', label: 'Assign Employees', icon: UserPlus },
    { to: '/admin/reports', label: 'System Analytics', icon: BarChart3 },
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
          <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Main Menu
          </p>
          <nav className="space-y-1">
            {currentLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Info Pill */}
      <div className="p-3 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl text-white">
        <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold mb-1">
          <Building2 className="w-4 h-4" /> Dayflow Enterprise
        </div>
        <p className="text-xs text-slate-300">Role-Based HR Platform with AI Assistant Security Layer.</p>
      </div>
    </aside>
  );
};

export default Sidebar;
