import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import StatCard from '../../components/StatCard';
import { Users, UserPlus, Shield, CalendarCheck, FileCheck, Building2 } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminDashboard();
  }, []);

  const fetchAdminDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/dashboard');
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-semibold">Loading Admin Command Center...</div>;

  const deptLabels = Object.keys(data?.employeesByDepartment || {});
  const deptData = Object.values(data?.employeesByDepartment || {});

  const doughnutData = {
    labels: deptLabels.length > 0 ? deptLabels : ['Engineering', 'Design', 'Infrastructure'],
    datasets: [
      {
        data: deptData.length > 0 ? deptData : [5, 3, 2],
        backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">System Admin Command Center</h1>
        <p className="text-xs text-slate-500">Highest-level management portal: Admin → HR → Employee hierarchy</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total HR Managers"
          value={data?.totalHrUsers || 0}
          icon={Users}
          color="purple"
          subtitle="Managed HR accounts"
        />
        <StatCard
          title="Total Employees"
          value={data?.totalEmployees || 0}
          icon={UserPlus}
          color="blue"
          subtitle="System-wide staff"
        />
        <StatCard
          title="Active HR Users"
          value={data?.activeHrUsers || 0}
          icon={Shield}
          color="emerald"
          subtitle="Enabled accounts"
        />
        <StatCard
          title="Present Today"
          value={data?.presentToday || 0}
          icon={CalendarCheck}
          color="emerald"
          subtitle="Checked-in today"
        />
        <StatCard
          title="Pending Leaves"
          value={data?.pendingLeaves || 0}
          icon={FileCheck}
          color="amber"
          subtitle="Global pending requests"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Distribution Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" /> Employee Department Distribution
            </h3>
            <p className="text-xs text-slate-400">System-wide staff allocation across teams</p>
          </div>
          <div className="w-48 h-48 mx-auto flex items-center justify-center">
            <Doughnut data={doughnutData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Core Hierarchy Architecture Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-6 rounded-3xl text-white shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
              System Architecture
            </span>
            <h2 className="text-lg font-bold mt-3">Admin → HR → Employee Management Flow</h2>
            <p className="text-xs text-slate-300 leading-relaxed mt-2">
              The Admin controls HR creation and employee assignment. HR managers supervise only their assigned employees. Employees access their own dashboard and permission-bound AI HR Assistant.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-700/60 text-center">
            <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700">
              <div className="text-xs font-bold text-purple-400">ADMIN</div>
              <div className="text-[11px] text-slate-400">Manages HR Users</div>
            </div>
            <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700">
              <div className="text-xs font-bold text-blue-400">HR MANAGER</div>
              <div className="text-[11px] text-slate-400">Manages Assigned Staff</div>
            </div>
            <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700">
              <div className="text-xs font-bold text-emerald-400">EMPLOYEE</div>
              <div className="text-[11px] text-slate-400">Own Portal & AI Assistant</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
