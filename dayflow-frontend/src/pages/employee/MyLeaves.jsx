import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { exportToPdf } from '../../utils/pdfGenerator';
import { useSelector } from 'react-redux';
import { FilePlus, FileCheck, Clock, CheckCircle2, XCircle, Sparkles, Download } from 'lucide-react';

const MyLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    leaveType: 'PAID',
    startDate: '',
    endDate: '',
    remarks: '',
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [explainModal, setExplainModal] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [explainLoading, setExplainLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [lRes, bRes] = await Promise.all([
        api.get('/employee/leaves'),
        api.get('/employee/leaves/balance'),
      ]);
      setLeaves(lRes.data);
      setBalance(bRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitLoading(true);

    try {
      await api.post('/employee/leaves', form);
      setShowModal(false);
      setForm({ leaveType: 'PAID', startDate: '', endDate: '', remarks: '' });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit leave request');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleExplainDecision = async (leaveId) => {
    setExplainModal(true);
    setExplainLoading(true);
    try {
      const res = await api.get(`/ai/explain-leave/${leaveId}`);
      setExplanation(res.data.explanationText);
    } catch (err) {
      setExplanation('Failed to generate leave decision explanation.');
    } finally {
      setExplainLoading(false);
    }
  };

  const handleDownloadPdf = () => {
    const headers = ['Leave Type', 'Start Date', 'End Date', 'Remarks', 'Status', 'HR Comments'];
    const data = leaves.map((l) => [
      l.leaveType,
      l.startDate,
      l.endDate,
      l.remarks || 'None',
      l.status,
      l.hrComments || 'None',
    ]);

    exportToPdf({
      title: 'My Personal Leave Applications & History Report',
      subtitle: `Employee: ${user?.name || 'Employee Portal'}`,
      headers,
      data,
      filename: `My_Leave_History_${new Date().toISOString().split('T')[0]}.pdf`,
      user,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">My Leave Management</h1>
          <p className="text-xs font-medium text-slate-500">Apply for time off and view leave request statuses</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownloadPdf}
            disabled={loading || leaves.length === 0}
            className="py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 font-bold border border-slate-200 rounded-xl text-xs flex items-center gap-2 shadow-xs transition-all"
          >
            <Download className="w-4 h-4 text-cyan-600" /> Download Report (PDF)
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="py-2.5 px-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:opacity-95 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-cyan-500/20 transition-all"
          >
            <FilePlus className="w-4 h-4" /> Apply for Leave
          </button>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-medium">Total Allowed</span>
          <p className="text-xl font-bold text-slate-800 mt-1">{balance?.totalAllowed || 24} Days</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-medium">Paid Leaves Used</span>
          <p className="text-xl font-bold text-blue-600 mt-1">{balance?.paidLeavesUsed || 0} Days</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-medium">Sick Leaves Used</span>
          <p className="text-xl font-bold text-purple-600 mt-1">{balance?.sickLeavesUsed || 0} Days</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-medium">Remaining Balance</span>
          <p className="text-xl font-bold text-emerald-600 mt-1">{balance?.remainingLeaves || 0} Days</p>
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-6">Leave Type</th>
                <th className="py-3.5 px-6">Start Date</th>
                <th className="py-3.5 px-6">End Date</th>
                <th className="py-3.5 px-6">Remarks</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">HR Comments</th>
                <th className="py-3.5 px-6 text-right">AI Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium">
              {loading ? (
                <tr><td colSpan="7" className="py-8 text-center text-slate-400">Loading leave requests...</td></tr>
              ) : leaves.length === 0 ? (
                <tr><td colSpan="7" className="py-8 text-center text-slate-400">No leave requests found.</td></tr>
              ) : (
                leaves.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 text-slate-800 font-semibold">{l.leaveType}</td>
                    <td className="py-4 px-6 text-slate-600">{l.startDate}</td>
                    <td className="py-4 px-6 text-slate-600">{l.endDate}</td>
                    <td className="py-4 px-6 text-slate-500 max-w-xs truncate">{l.remarks}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        l.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                        l.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {l.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500 text-xs italic">{l.hrComments || 'None'}</td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleExplainDecision(l.id)}
                        className="py-1 px-2.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 font-bold rounded-lg text-xs flex items-center gap-1 ml-auto border border-cyan-200"
                      >
                        <Sparkles className="w-3 h-3 text-cyan-600" /> Explain
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Leave Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Apply for Leave</h3>
            {error && <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-2.5 rounded-xl">{error}</p>}
            <form onSubmit={handleApply} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Leave Type</label>
                <select
                  value={form.leaveType}
                  onChange={(e) => setForm({ ...form, leaveType: e.target.value })}
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                >
                  <option value="PAID">PAID LEAVE</option>
                  <option value="SICK">SICK LEAVE</option>
                  <option value="UNPAID">UNPAID LEAVE</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Remarks / Reason</label>
                <textarea
                  rows="3"
                  required
                  value={form.remarks}
                  onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                  placeholder="Explain reason for leave..."
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                ></textarea>
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
                  disabled={submitLoading}
                  className="py-2 px-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-bold rounded-xl text-xs"
                >
                  {submitLoading ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Explain Decision Modal */}
      {explainModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-cyan-700 font-bold">
              <Sparkles className="w-5 h-5 text-cyan-500" /> AI Leave Decision Explanation
            </div>
            {explainLoading ? (
              <p className="text-xs text-slate-500 py-4 text-center">Analyzing leave decision record & HR comments...</p>
            ) : (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                {explanation}
              </div>
            )}
            <div className="flex justify-end">
              <button
                onClick={() => setExplainModal(false)}
                className="py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyLeaves;
