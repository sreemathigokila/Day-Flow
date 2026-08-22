import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useSelector } from 'react-redux';
import { exportToPdf } from '../../utils/pdfGenerator';
import { FileCheck, CheckCircle2, XCircle, Clock, Download } from 'lucide-react';

const LeaveApprovals = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReq, setSelectedReq] = useState(null);
  const [decision, setDecision] = useState({ status: 'APPROVED', comments: '' });
  const [submitting, setSubmitting] = useState(false);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get('/hr/leaves');
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (e) => {
    e.preventDefault();
    if (!selectedReq) return;
    setSubmitting(true);
    try {
      await api.put(`/hr/leaves/${selectedReq.id}/decision`, decision);
      setSelectedReq(null);
      setDecision({ status: 'APPROVED', comments: '' });
      fetchRequests();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadPdf = () => {
    const headers = ['Employee Name', 'Leave Type', 'Start Date', 'End Date', 'Remarks', 'Status', 'HR Comments'];
    const data = requests.map((r) => [
      r.employeeName,
      r.leaveType,
      r.startDate,
      r.endDate,
      r.remarks || 'None',
      r.status,
      r.hrComments || 'None',
    ]);

    exportToPdf({
      title: 'Assigned Employee Leave Requests Report',
      subtitle: `Report for HR Manager: ${user?.name || 'HR Team'}`,
      headers,
      data,
      filename: `Dayflow_Leave_Requests_${new Date().toISOString().split('T')[0]}.pdf`,
      user,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">Assigned Employee Leave Requests</h1>
          <p className="text-xs font-medium text-slate-500">Approve or reject leave applications submitted by your assigned team members</p>
        </div>
        <button
          onClick={handleDownloadPdf}
          disabled={loading || requests.length === 0}
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
                <th className="py-3.5 px-6">Type</th>
                <th className="py-3.5 px-6">Dates</th>
                <th className="py-3.5 px-6">Remarks</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium">
              {loading ? (
                <tr><td colSpan="6" className="py-8 text-center text-slate-400">Loading leave requests...</td></tr>
              ) : requests.length === 0 ? (
                <tr><td colSpan="6" className="py-8 text-center text-slate-400">No leave requests found.</td></tr>
              ) : (
                requests.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 text-slate-800 font-bold">{r.employeeName}</td>
                    <td className="py-4 px-6 text-slate-600 font-semibold">{r.leaveType}</td>
                    <td className="py-4 px-6 text-slate-600">{r.startDate} to {r.endDate}</td>
                    <td className="py-4 px-6 text-slate-500 max-w-xs truncate">{r.remarks}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        r.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                        r.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {r.status === 'PENDING' ? (
                        <button
                          onClick={() => setSelectedReq(r)}
                          className="py-1.5 px-3 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:opacity-95 text-white font-bold rounded-xl text-xs"
                        >
                          Review Request
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">Decided</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Decision Modal */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Review Leave Request</h3>
            <p className="text-xs text-slate-600">
              <strong>{selectedReq.employeeName}</strong> requested <strong>{selectedReq.leaveType} LEAVE</strong> from {selectedReq.startDate} to {selectedReq.endDate}.
            </p>

            <form onSubmit={handleDecision} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Decision</label>
                <select
                  value={decision.status}
                  onChange={(e) => setDecision({ ...decision, status: e.target.value })}
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                >
                  <option value="APPROVED">APPROVE REQUEST</option>
                  <option value="REJECTED">REJECT REQUEST</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">HR Comments</label>
                <textarea
                  rows="3"
                  value={decision.comments}
                  onChange={(e) => setDecision({ ...decision, comments: e.target.value })}
                  placeholder="Add comments or feedback for employee..."
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                ></textarea>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedReq(null)}
                  className="py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="py-2 px-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-bold rounded-xl text-xs"
                >
                  {submitting ? 'Saving...' : 'Save Decision'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveApprovals;
