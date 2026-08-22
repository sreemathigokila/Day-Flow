import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useSelector } from 'react-redux';
import { exportToPdf } from '../../utils/pdfGenerator';
import { Shield, Clock, CheckCircle2, Download } from 'lucide-react';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/audit-logs');
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = () => {
    const headers = ['Timestamp', 'Actor / User', 'Action', 'Target Entity', 'Details', 'Status'];
    const data = logs.map((log) => [
      new Date(log.timestamp).toLocaleString(),
      log.actorEmail,
      log.action,
      log.targetEntity,
      log.details,
      log.allowed ? 'ALLOWED' : 'DENIED',
    ]);

    exportToPdf({
      title: 'System Audit & Security Compliance Log',
      subtitle: `Report for Admin: ${user?.name || 'System Administrator'}`,
      headers,
      data,
      filename: `Dayflow_Audit_Log_${new Date().toISOString().split('T')[0]}.pdf`,
      user,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">System Audit & Compliance Logs</h1>
          <p className="text-xs font-medium text-slate-500">Immutable audit log of administrative actions, role updates, and AI tool execution attempts</p>
        </div>
        <button
          onClick={handleDownloadPdf}
          disabled={loading || logs.length === 0}
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
                <th className="py-3.5 px-6">Timestamp</th>
                <th className="py-3.5 px-6">User / Actor</th>
                <th className="py-3.5 px-6">Action</th>
                <th className="py-3.5 px-6">Target Entity</th>
                <th className="py-3.5 px-6">Details</th>
                <th className="py-3.5 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium">
              {loading ? (
                <tr><td colSpan="6" className="py-8 text-center text-slate-400">Loading audit logs...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan="6" className="py-8 text-center text-slate-400">No audit logs recorded yet.</td></tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 text-xs text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="py-4 px-6 text-slate-800 font-bold">{log.actorEmail}</td>
                    <td className="py-4 px-6 font-semibold text-blue-600">{log.action}</td>
                    <td className="py-4 px-6 text-slate-600">{log.targetEntity}</td>
                    <td className="py-4 px-6 text-slate-500 text-xs max-w-xs truncate">{log.details}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        log.allowed ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {log.allowed ? 'ALLOWED' : 'DENIED'}
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

export default AuditLogs;
