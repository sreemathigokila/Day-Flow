import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { CalendarCheck, Search } from 'lucide-react';

const AttendanceManager = () => {
  const [attendance, setAttendance] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendance();
  }, [date]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/hr/attendance?date=${date}`);
      setAttendance(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">Team Attendance Logs</h1>
          <p className="text-xs text-slate-500">Monitor check-ins, check-outs, and hours for assigned employees</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="py-2 px-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-6">Employee Name</th>
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6">Check In</th>
                <th className="py-3.5 px-6">Check Out</th>
                <th className="py-3.5 px-6">Work Hours</th>
                <th className="py-3.5 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium">
              {loading ? (
                <tr><td colSpan="6" className="py-8 text-center text-slate-400">Loading attendance records...</td></tr>
              ) : attendance.length === 0 ? (
                <tr><td colSpan="6" className="py-8 text-center text-slate-400">No attendance records for {date}.</td></tr>
              ) : (
                attendance.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 text-slate-800 font-bold">{a.employeeName}</td>
                    <td className="py-4 px-6 text-slate-600">{a.date}</td>
                    <td className="py-4 px-6 text-slate-600">{a.checkInTime || '--:--'}</td>
                    <td className="py-4 px-6 text-slate-600">{a.checkOutTime || 'Active'}</td>
                    <td className="py-4 px-6 text-slate-800 font-bold">{a.workHours ? `${a.workHours} hrs` : '--'}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceManager;
