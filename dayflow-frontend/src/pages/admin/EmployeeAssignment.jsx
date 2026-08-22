import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { UserPlus, ArrowRightLeft, CheckCircle2 } from 'lucide-react';

const EmployeeAssignment = () => {
  const [employees, setEmployees] = useState([]);
  const [hrs, setHrs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmp, setSelectedEmp] = useState('');
  const [selectedHr, setSelectedHr] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [empRes, hrRes] = await Promise.all([
        api.get('/admin/employees'),
        api.get('/admin/hr'),
      ]);
      setEmployees(empRes.data);
      setHrs(hrRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedEmp || !selectedHr) return;
    setSubmitting(true);
    setMsg('');
    try {
      await api.post('/admin/assign-employee', {
        employeeId: parseInt(selectedEmp),
        hrId: parseInt(selectedHr),
      });
      setMsg('Employee assigned successfully!');
      fetchData();
    } catch (err) {
      setMsg('Failed to assign employee.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">Assign & Reassign Employees to HR</h1>
        <p className="text-xs text-slate-500">Assign employees to HR managers to enforce permissions</p>
      </div>

      {msg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {msg}
        </div>
      )}

      {/* Assignment Control Box */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <ArrowRightLeft className="w-4 h-4 text-purple-600" /> Reassign Responsible HR Manager
        </h3>

        <form onSubmit={handleAssign} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Select Employee</label>
            <select
              value={selectedEmp}
              onChange={(e) => setSelectedEmp(e.target.value)}
              className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
              required
            >
              <option value="">-- Select Employee --</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.department} - Currently: {emp.hrName})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Select HR Manager</label>
            <select
              value={selectedHr}
              onChange={(e) => setSelectedHr(e.target.value)}
              className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
              required
            >
              <option value="">-- Select HR Manager --</option>
              {hrs.map((hr) => (
                <option key={hr.id} value={hr.id}>
                  {hr.name} ({hr.department})
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" /> {submitting ? 'Assigning...' : 'Confirm Assignment'}
          </button>
        </form>
      </div>

      {/* Current Employee Assignment Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-6">Employee</th>
                <th className="py-3.5 px-6">Department</th>
                <th className="py-3.5 px-6">Job Title</th>
                <th className="py-3.5 px-6">Assigned HR Manager</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium">
              {loading ? (
                <tr><td colSpan="4" className="py-8 text-center text-slate-400">Loading assignments...</td></tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 text-slate-800 font-bold">{emp.name}</td>
                    <td className="py-4 px-6 text-slate-600">{emp.department}</td>
                    <td className="py-4 px-6 text-slate-600">{emp.jobTitle}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                        {emp.hrName || 'Unassigned'}
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

export default EmployeeAssignment;
