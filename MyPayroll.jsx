import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { CircleDollarSign, CheckCircle2, ShieldAlert } from 'lucide-react';

const MyPayroll = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayroll();
  }, []);

  const fetchPayroll = async () => {
    try {
      setLoading(true);
      const res = await api.get('/employee/payroll');
      setPayrolls(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">My Payroll & Salary Breakdown</h1>
          <p className="text-xs text-slate-500">Read-only personal salary structure and disbursement history</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Salary Slips & Disbursals</span>
          <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 border border-emerald-200 py-0.5 px-2.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> READ-ONLY PERSONAL ACCESS
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-6">Period</th>
                <th className="py-3.5 px-6">Basic Salary</th>
                <th className="py-3.5 px-6">Allowances</th>
                <th className="py-3.5 px-6">Deductions</th>
                <th className="py-3.5 px-6">Net Disbursement</th>
                <th className="py-3.5 px-6">Payment Date</th>
                <th className="py-3.5 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">Loading salary records...</td>
                </tr>
              ) : payrolls.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">No payroll records found.</td>
                </tr>
              ) : (
                payrolls.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 text-slate-800 font-semibold">{p.month}/{p.year}</td>
                    <td className="py-4 px-6 text-slate-600">${p.basicSalary?.toLocaleString()}</td>
                    <td className="py-4 px-6 text-emerald-600">+${p.allowances?.toLocaleString()}</td>
                    <td className="py-4 px-6 text-rose-600">-${p.deductions?.toLocaleString()}</td>
                    <td className="py-4 px-6 text-blue-600 font-bold text-base">${p.netSalary?.toLocaleString()}</td>
                    <td className="py-4 px-6 text-slate-500 text-xs">{p.paymentDate || 'N/A'}</td>
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

export default MyPayroll;
