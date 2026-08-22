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
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200">
            <Shield className="w-3 h-3" /> ADMIN
          </span>
        );
      case 'ROLE_HR':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-100 text-cyan-800 border border-cyan-200">
            <Briefcase className="w-3 h-3" /> HR MANAGER
          </span>
        );
      case 'ROLE_EMPLOYEE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
            <UserCheck className="w-3 h-3" /> EMPLOYEE
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-cyan-500/20">
          D
        </div>
        <div>
          <span className="text-lg font-black tracking-tight bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dayflow
          </span>
          <span className="ml-2 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200">
            HRMS 2.0
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button
          onClick={() => setNotifOpen(true)}
          className="relative p-2 text-slate-600 hover:bg-cyan-50 hover:text-cyan-600 rounded-xl transition-colors"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
        </button>

        <div className="h-6 w-px bg-slate-200"></div>

        {/* User Info Pill */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 py-1.5 px-3 rounded-full shadow-xs">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-sm font-bold text-slate-800 leading-none mb-1">{user?.name}</div>
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
