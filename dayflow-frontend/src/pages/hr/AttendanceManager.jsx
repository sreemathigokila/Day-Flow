import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useSelector } from 'react-redux';
import { exportToPdf } from '../../utils/pdfGenerator';
import { CalendarCheck, Search, Download } from 'lucide-react';

const AttendanceManager = () => {
  const [attendance, setAttendance] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

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

  const handleDownloadPdf = () => {
    const headers = ['Employee Name', 'Date', 'Check In', 'Check Out', 'Work Hours', 'Status'];
    const data = attendance.map((a) => [
      a.employeeName,
      a.date,
      a.checkInTime || '--:--',
      a.checkOutTime || 'Active Session',
      a.workHours ? `${a.workHours} hrs` : '--',
      a.status,
    ]);

    exportToPdf({
      title: `Team Attendance Log Report (${date})`,
      subtitle: `Report for HR Manager: ${user?.name || 'HR Team'}`,
      headers,
      data,
      filename: `Dayflow_Attendance_Log_${date}.pdf`,
      user,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">Team Attendance Logs</h1>
          <p className="text-xs font-medium text-slate-500">Monitor check-ins, check-outs, and hours for assigned employees</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="py-2 px-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 shadow-sm"
          />
          <button
            onClick={handleDownloadPdf}
            disabled={loading || attendance.length === 0}
            className="py-2.5 px-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:opacity-95 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-cyan-500/20 transition-all"
          >
            <Download className="w-4 h-4" /> Download Report (PDF)
          </button>
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
