import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useSelector } from 'react-redux';
import { exportToPdf } from '../../utils/pdfGenerator';
import { Users, Mail, Phone, MapPin, Briefcase, Building, Download } from 'lucide-react';

const AssignedEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await api.get('/hr/employees');
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = () => {
    const headers = ['Name', 'Email', 'Phone', 'Department', 'Job Title', 'Base Salary ($)', 'Status'];
    const data = employees.map((emp) => [
      emp.name,
      emp.email,
      emp.phone || 'N/A',
      emp.department || 'N/A',
      emp.jobTitle || 'N/A',
      `$${emp.baseSalary?.toLocaleString() || 0}`,
      emp.active ? 'ACTIVE' : 'INACTIVE',
    ]);

    exportToPdf({
      title: 'Assigned Employees Summary Report',
      subtitle: `Report for HR Manager: ${user?.name || 'HR Team'}`,
      headers,
      data,
      filename: `Dayflow_Assigned_Employees_${new Date().toISOString().split('T')[0]}.pdf`,
      user,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">Assigned Employees</h1>
          <p className="text-xs font-medium text-slate-500">Manage and view profiles of employees assigned to you</p>
        </div>
        <button
          onClick={handleDownloadPdf}
          disabled={loading || employees.length === 0}
          className="py-2.5 px-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:opacity-95 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-cyan-500/20 transition-all self-start sm:self-auto"
        >
          <Download className="w-4 h-4" /> Download Report (PDF)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-slate-400 text-sm font-semibold col-span-full">Loading assigned employees...</p>
        ) : employees.length === 0 ? (
          <p className="text-slate-400 text-sm font-semibold col-span-full">No employees currently assigned to your HR account.</p>
        ) : (
          employees.map((emp) => (
            <div key={emp.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <img
                  src={emp.profilePicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'}
                  alt={emp.name}
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                />
                <div>
                  <h3 className="text-sm font-bold text-slate-800">{emp.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">{emp.jobTitle}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-200 rounded">
                    {emp.department}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-slate-400" /> {emp.email}</div>
                <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-400" /> {emp.phone || 'N/A'}</div>
                <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {emp.address || 'N/A'}</div>
                <div className="flex items-center gap-2 font-bold text-slate-800 pt-1">
                  Base Salary: ${emp.baseSalary?.toLocaleString()}/yr
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AssignedEmployees;
