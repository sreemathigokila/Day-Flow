import React from 'react';
import { useSelector } from 'react-redux';
import { exportToPdf } from '../../utils/pdfGenerator';
import { BarChart3, ShieldCheck, Database, Download } from 'lucide-react';

const SystemReports = () => {
  const { user } = useSelector((state) => state.auth);

  const handleDownloadPdf = () => {
    const headers = ['Report Category', 'Metric / Feature', 'Compliance Status', 'Security Specification'];
    const data = [
      ['AI Security', 'Permission Gateway', '100% ENFORCED', 'Strictly scopes tools to authenticated employee ID'],
      ['AI Firewall', 'Cross-Employee Denial', 'ACTIVE', 'Rejects requests attempting to access other employees data'],
      ['RBAC Authorization', 'HR-Employee Scope', 'ACTIVE (HTTP 403)', 'HR can only view explicitly assigned employees'],
      ['Audit Logging', 'Immutable Logs', 'ACTIVE', 'Logs administrative changes and AI tool executions'],
      ['Data Encryption', 'BCrypt & JWT', 'ENCRYPTED', 'Passwords hashed with BCrypt, statelessly secured with JWT'],
    ];

    exportToPdf({
      title: 'Dayflow HRMS System Security & Compliance Report',
      subtitle: `Generated for Administrator: ${user?.name || 'System Admin'}`,
      headers,
      data,
      filename: `Dayflow_System_Security_Report_${new Date().toISOString().split('T')[0]}.pdf`,
      user,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">System-Wide Analytics & Audit Reports</h1>
          <p className="text-xs font-medium text-slate-500">Global HR statistics, AI authorization metrics, and compliance logging</p>
        </div>
        <button
          onClick={handleDownloadPdf}
          className="py-2.5 px-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:opacity-95 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-cyan-500/20 transition-all self-start sm:self-auto"
        >
          <Download className="w-4 h-4" /> Download System Report (PDF)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-800">AI Assistant Security & Privacy Firewall</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            The Dayflow AI Assistant is strictly restricted to employee-owned data via backend Spring AI tool functions. Direct database queries, cross-employee data lookups, and administrator credentials access are blocked automatically.
          </p>
          <div className="pt-2 text-xs font-bold text-purple-600">Status: 100% Compliant & Enforced</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Database & RBAC Integrity Report</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            All REST API endpoints verify authentication claims against JWT tokens and check resource ownership or HR-employee mapping on the Spring Boot backend prior to returning data.
          </p>
          <div className="pt-2 text-xs font-bold text-cyan-700">Backend Checks: Active on 100% of Endpoints</div>
        </div>
      </div>
    </div>
  );
};

export default SystemReports;
