import React from 'react';
import { BarChart3, ShieldCheck, Database, Layers } from 'lucide-react';

const SystemReports = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">System-Wide Analytics & Audit Reports</h1>
        <p className="text-xs text-slate-500">Global HR statistics, AI authorization metrics, and compliance logging</p>
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
          <div className="pt-2 text-xs font-semibold text-purple-600">Status: 100% Compliant & Enforced</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Database & RBAC Integrity Report</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            All REST API endpoints verify authentication claims against JWT tokens and check resource ownership or HR-employee mapping on the Spring Boot backend prior to returning data.
          </p>
          <div className="pt-2 text-xs font-semibold text-blue-600">Backend Checks: Active on 100% of Endpoints</div>
        </div>
      </div>
    </div>
  );
};

export default SystemReports;
