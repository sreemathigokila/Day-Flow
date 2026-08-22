import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { UserPlus, Shield, Power, Mail, Phone, Building } from 'lucide-react';

const HrManagement = () => {
  const [hrs, setHrs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    department: 'Human Resources',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchHrs();
  }, []);

  const fetchHrs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/hr');
      setHrs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHr = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.post('/admin/hr', form);
      setShowModal(false);
      setForm({ name: '', email: '', password: '', phone: '', department: 'Human Resources' });
      fetchHrs();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create HR account');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (hrId, currentActive) => {
    try {
      await api.put(`/admin/hr/${hrId}/status?active=${!currentActive}`);
      fetchHrs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">HR User Account Management</h1>
          <p className="text-xs text-slate-500">Create, configure, and activate/deactivate HR accounts</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-purple-500/20 transition-all"
        >
          <UserPlus className="w-4 h-4" /> Create New HR Account
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-6">HR Manager</th>
                <th className="py-3.5 px-6">Email</th>
                <th className="py-3.5 px-6">Department</th>
                <th className="py-3.5 px-6">Assigned Employees</th>
                <th className="py-3.5 px-6">Account Status</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium">
              {loading ? (
                <tr><td colSpan="6" className="py-8 text-center text-slate-400">Loading HR managers...</td></tr>
              ) : hrs.length === 0 ? (
                <tr><td colSpan="6" className="py-8 text-center text-slate-400">No HR accounts created yet.</td></tr>
              ) : (
                hrs.map((hr) => (
                  <tr key={hr.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 text-slate-800 font-bold flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center">
                        {hr.name.charAt(0)}
                      </div>
                      {hr.name}
                    </td>
                    <td className="py-4 px-6 text-slate-600">{hr.email}</td>
                    <td className="py-4 px-6 text-slate-600 font-semibold">{hr.department}</td>
                    <td className="py-4 px-6 text-blue-600 font-bold">{hr.assignedEmployeeCount} Employees</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        hr.active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {hr.active ? 'ACTIVE' : 'DEACTIVATED'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleToggleStatus(hr.id, hr.active)}
                        className={`py-1.5 px-3 rounded-xl font-semibold text-xs transition-all flex items-center gap-1 ml-auto ${
                          hr.active
                            ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                        }`}
                      >
                        <Power className="w-3.5 h-3.5" /> {hr.active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create HR Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Create HR Account</h3>
            {error && <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-2.5 rounded-xl">{error}</p>}
            
            <form onSubmit={handleCreateHr} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Sarah Jenkins"
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="hr.sarah@dayflow.com"
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl text-xs"
                >
                  {submitting ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HrManagement;
