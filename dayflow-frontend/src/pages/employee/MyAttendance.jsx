import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useSelector } from 'react-redux';
import { exportToPdf } from '../../utils/pdfGenerator';
import { CalendarCheck, Clock, CheckCircle2, Download } from 'lucide-react';

const MyAttendance = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const res = await api.get('/employee/attendance');
      setRecords(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = () => {
    const headers = ['Date', 'Check In', 'Check Out', 'Work Hours', 'Status'];
    const data = records.map((r) => [
      r.date,
      r.checkInTime || '--:--',
      r.checkOutTime || 'Active Session',
      r.workHours ? `${r.workHours} hrs` : '--',
      r.status,
    ]);

    exportToPdf({
      title: 'My Personal Attendance History Report',
      subtitle: `Employee: ${user?.name || 'Employee Portal'}`,
      headers,
      data,
      filename: `My_Attendance_History_${new Date().toISOString().split('T')[0]}.pdf`,
      user,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">My Attendance History</h1>
          <p className="text-xs font-medium text-slate-500">View daily check-ins, check-outs, and total work hours</p>
        </div>
        <button
          onClick={handleDownloadPdf}
          disabled={loading || records.length === 0}
          className="py-2.5 px-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:opacity-95 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-cyan-500/20 transition-all self-start sm:self-auto"
        >
          <Download className="w-4 h-4" /> Download Report (PDF)
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6">Check In</th>
                <th className="py-3.5 px-6">Check Out</th>
                <th className="py-3.5 px-6">Work Hours</th>
                <th className="py-3.5 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400">Loading attendance history...</td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400">No attendance records found.</td>
                </tr>
              ) : (
                records.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 text-slate-800 font-semibold">{r.date}</td>
                    <td className="py-4 px-6 text-slate-600">{r.checkInTime || '--:--'}</td>
                    <td className="py-4 px-6 text-slate-600">{r.checkOutTime || 'Active Session'}</td>
                    <td className="py-4 px-6 text-slate-800 font-bold">{r.workHours ? `${r.workHours} hrs` : '--'}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        r.status === 'PRESENT' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        <CheckCircle2 className="w-3 h-3" /> {r.status}
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

export default MyAttendance;
