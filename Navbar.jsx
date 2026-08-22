import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { Bell, LogOut, User as UserIcon, Shield, Briefcase, UserCheck } from 'lucide-react';
import NotificationDrawer from './NotificationDrawer';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [notifOpen, setNotifOpen] = useState(false);

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ROLE_ADMIN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200">
            <Shield className="w-3 h-3" /> ADMIN
          </span>
        );
      case 'ROLE_HR':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
            <Briefcase className="w-3 h-3" /> HR MANAGER
          </span>
        );
      case 'ROLE_EMPLOYEE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
            <UserCheck className="w-3 h-3" /> EMPLOYEE
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-500/20">
          D
        </div>
        <div>
          <span className="text-lg font-bold text-slate-800 tracking-tight">Dayflow</span>
          <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">HRMS 2.0</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button
          onClick={() => setNotifOpen(true)}
          className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
        </button>

        <div className="h-6 w-px bg-slate-200"></div>

        {/* User Info Pill */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 py-1.5 px-3 rounded-full">
          <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-sm font-semibold text-slate-800 leading-none mb-1">{user?.name}</div>
            {getRoleBadge(user?.role)}
          </div>
        </div>

        {/* Logout button */}
        <button
          onClick={() => dispatch(logout())}
          className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      <NotificationDrawer open={notifOpen} onClose={() => setNotifOpen(false)} />
    </header>
  );
};

export default Navbar;
