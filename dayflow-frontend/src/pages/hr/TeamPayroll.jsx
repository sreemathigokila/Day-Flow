import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useSelector } from 'react-redux';
import { exportToPdf } from '../../utils/pdfGenerator';
import { CircleDollarSign, CheckCircle2, Download } from 'lucide-react';

const TeamPayroll = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchPayroll();
  }, []);

  const fetchPayroll = async () => {
    try {
      setLoading(true);
      const res = await api.get('/hr/payroll');
      setPayrolls(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = () => {
    const headers = ['Employee Name', 'Period', 'Basic Salary', 'Allowances', 'Deductions', 'Net Salary', 'Status'];
    const data = payrolls.map((p) => [
      p.employeeName,
      `${p.month}/${p.year}`,
      `$${p.basicSalary?.toLocaleString() || 0}`,
      `+$${p.allowances?.toLocaleString() || 0}`,
      `-$${p.deductions?.toLocaleString() || 0}`,
      `$${p.netSalary?.toLocaleString() || 0}`,
      p.status,
    ]);

    exportToPdf({
      title: 'Assigned Team Payroll Overview Report',
      subtitle: `Report for HR Manager: ${user?.name || 'HR Team'}`,
      headers,
      data,
      filename: `Dayflow_Team_Payroll_${new Date().toISOString().split('T')[0]}.pdf`,
      user,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">Assigned Team Payroll Overview</h1>
          <p className="text-xs font-medium text-slate-500">View salary details and disbursement statuses for assigned employees</p>
        </div>
        <button
          onClick={handleDownloadPdf}
          disabled={loading || payrolls.length === 0}
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
                <th className="py-3.5 px-6">Employee</th>
                <th className="py-3.5 px-6">Month/Year</th>
                <th className="py-3.5 px-6">Basic Salary</th>
                <th className="py-3.5 px-6">Allowances</th>
                <th className="py-3.5 px-6">Deductions</th>
                <th className="py-3.5 px-6">Net Salary</th>
                <th className="py-3.5 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium">
              {loading ? (
                <tr><td colSpan="7" className="py-8 text-center text-slate-400">Loading team payroll...</td></tr>
              ) : payrolls.length === 0 ? (
                <tr><td colSpan="7" className="py-8 text-center text-slate-400">No payroll records found.</td></tr>
              ) : (
                payrolls.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 text-slate-800 font-bold">{p.employeeName}</td>
                    <td className="py-4 px-6 text-slate-600">{p.month}/{p.year}</td>
                    <td className="py-4 px-6 text-slate-600">${p.basicSalary?.toLocaleString()}</td>
                    <td className="py-4 px-6 text-emerald-600">+${p.allowances?.toLocaleString()}</td>
                    <td className="py-4 px-6 text-rose-600">-${p.deductions?.toLocaleString()}</td>
                    <td className="py-4 px-6 text-blue-600 font-bold text-base">${p.netSalary?.toLocaleString()}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                        <CheckCircle2 className="w-3 h-3" /> {p.status}
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

export default TeamPayroll;
