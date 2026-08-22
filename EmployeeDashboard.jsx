import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import DayflowAiAssistantCard from './DayflowAiAssistantCard';
import StatCard from '../../components/StatCard';
import { CalendarCheck, FileCheck, CircleDollarSign, Clock, LogIn, LogOut, CheckCircle2, User } from 'lucide-react';

const EmployeeDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get('/employee/dashboard');
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      setActionLoading(true);
      setMsg('');
      await api.post('/employee/check-in');
      setMsg('Check-in successful!');
      fetchDashboard();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Check-in failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setActionLoading(true);
      setMsg('');
      await api.post('/employee/check-out');
      setMsg('Check-out successful!');
      fetchDashboard();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Check-out failed');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-semibold">Loading Employee Portal...</div>;

  const { profile, todayAttendance, leaveBalance, recentNetSalary } = data || {};

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={profile?.profilePicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'}
            alt="Profile"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500/20 shadow-md"
          />
          <div>
            <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">
              Welcome back, {profile?.name}! 👋
            </h1>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              {profile?.jobTitle} • {profile?.department} Department
            </p>
            <p className="text-xs text-blue-600 font-medium mt-1">
              Assigned HR Manager: <span className="font-bold">{profile?.hrName || 'Unassigned'}</span>
            </p>
          </div>
        </div>

        {/* Check-In / Check-Out Widget */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col items-center justify-center space-y-2 min-w-[240px]">
          <div className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-blue-600" /> Today's Attendance Widget
          </div>
          {msg && <p className="text-[11px] font-bold text-blue-600">{msg}</p>}
          <div className="flex gap-2 w-full">
            {!todayAttendance ? (
              <button
                onClick={handleCheckIn}
                disabled={actionLoading}
                className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1 shadow-md shadow-emerald-500/20 transition-all"
              >
                <LogIn className="w-3.5 h-3.5" /> Check In
              </button>
            ) : todayAttendance.checkOutTime == null ? (
              <button
                onClick={handleCheckOut}
                disabled={actionLoading}
                className="flex-1 py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1 shadow-md shadow-rose-500/20 transition-all"
              >
                <LogOut className="w-3.5 h-3.5" /> Check Out
              </button>
            ) : (
              <div className="w-full py-2 px-3 bg-slate-200 text-slate-700 font-bold rounded-xl text-xs text-center flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Attendance Completed ({todayAttendance.workHours} hrs)
              </div>
            )}
          </div>
          {todayAttendance && (
            <div className="text-[11px] text-slate-500 font-medium">
              In: {todayAttendance.checkInTime || '--:--'} | Out: {todayAttendance.checkOutTime || 'Active'}
            </div>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Remaining Leaves"
          value={`${leaveBalance?.remainingLeaves || 0} Days`}
          icon={FileCheck}
          color="emerald"
          subtitle={`Used: ${leaveBalance?.paidLeavesUsed + leaveBalance?.sickLeavesUsed} / Total: ${leaveBalance?.totalAllowed}`}
        />
        <StatCard
          title="Recent Net Salary"
          value={`$${recentNetSalary?.toLocaleString() || '0'}`}
          icon={CircleDollarSign}
          color="blue"
          subtitle="Monthly disbursement summary"
        />
        <StatCard
          title="Today's Status"
          value={todayAttendance ? todayAttendance.status : 'NOT CHECKED IN'}
          icon={CalendarCheck}
          color={todayAttendance ? 'emerald' : 'amber'}
          subtitle={todayAttendance?.checkInTime ? `Checked in at ${todayAttendance.checkInTime}` : 'Pending check-in'}
        />
        <StatCard
          title="Profile Active"
          value="VERIFIED"
          icon={User}
          color="purple"
          subtitle={`Employee ID: #${profile?.id}`}
        />
      </div>

      {/* Dayflow AI Assistant Banner Card */}
      <DayflowAiAssistantCard />
    </div>
  );
};

export default EmployeeDashboard;
