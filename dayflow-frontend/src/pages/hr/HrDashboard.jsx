import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import StatCard from '../../components/StatCard';
import { Users, UserCheck, UserX, CalendarCheck, FileCheck } from 'lucide-react';

const HrDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHrDashboard();
  }, []);

  const fetchHrDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get('/hr/dashboard');
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-semibold">Loading HR Manager Dashboard...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">HR Manager Dashboard</h1>
        <p className="text-xs text-slate-500">Overview of employees assigned specifically to your management</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Assigned Employees"
          value={data?.assignedEmployeeCount || 0}
          icon={Users}
          color="blue"
          subtitle="Under your HR care"
        />
        <StatCard
          title="Present Today"
          value={data?.presentToday || 0}
          icon={UserCheck}
          color="emerald"
          subtitle="Checked in today"
        />
        <StatCard
          title="Absent Today"
          value={data?.absentToday || 0}
          icon={UserX}
          color="rose"
          subtitle="Unexcused absences"
        />
        <StatCard
          title="On Leave"
          value={data?.onLeaveToday || 0}
          icon={CalendarCheck}
          color="amber"
          subtitle="Approved leave off"
        />
        <StatCard
          title="Pending Requests"
          value={data?.pendingLeaveRequests || 0}
          icon={FileCheck}
          color="purple"
          subtitle="Awaiting decision"
        />
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-800">HR Manager Authorization & Responsibility Notice</h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          As an HR Manager, your role permits managing attendance, processing leave approvals, and reviewing records <strong>strictly for employees assigned to your account</strong>. Backend API security automatically blocks unauthorized access to employees assigned to other HR managers (HTTP 403 Forbidden).
        </p>
      </div>
    </div>
  );
};

export default HrDashboard;
