import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Bot,
  Users,
  CalendarCheck,
  FileCheck,
  CircleDollarSign,
  BarChart3,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  BrainCircuit,
  Building2,
  UserCheck,
  FileText
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-cyan-500 selection:text-white">
      {/* 1. NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-cyan-500/25">
              D
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              Dayflow <span className="text-xs font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-200">HRMS 2.0</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-cyan-600 transition-colors">Features</a>
            <a href="#ai-assistant" className="hover:text-cyan-600 transition-colors">AI Assistant</a>
            <a href="#hierarchy" className="hover:text-cyan-600 transition-colors">Role Hierarchy</a>
            <a href="#security" className="hover:text-cyan-600 transition-colors">Security</a>
            <a href="#how-it-works" className="hover:text-cyan-600 transition-colors">How It Works</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="py-2.5 px-4 text-sm font-bold text-slate-700 hover:text-cyan-600 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="py-2.5 px-5 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:opacity-95 text-white font-bold text-sm rounded-xl shadow-md shadow-cyan-500/20 transition-all flex items-center gap-1.5"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative pt-16 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold shadow-xs">
              <Sparkles className="w-4 h-4 text-cyan-600" /> Permission-Aware Privacy-First HR Intelligence
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              AI-Powered HR, <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600">
                Designed Around People
              </span>
            </h1>

            <p className="text-base md:text-lg text-slate-600 leading-relaxed font-medium">
              Streamline Admin management, HR team workflows, and Employee self-service with an embedded, permission-aware AI assistant that answers questions without exposing confidential data.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                to="/register"
                className="py-3.5 px-7 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:opacity-95 text-white font-bold text-base rounded-2xl shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
              >
                Get Started Free <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#ai-assistant"
                className="py-3.5 px-7 bg-white hover:bg-slate-100 text-slate-800 font-bold text-base rounded-2xl border border-slate-200 shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Bot className="w-5 h-5 text-purple-600" /> Explore AI Assistant
              </a>
            </div>
          </div>

          {/* Visual Dashboard Card Mockup */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 rounded-3xl blur-xl opacity-25"></div>
            <div className="relative bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 text-white flex items-center justify-center font-bold">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Dayflow AI Assistant</h3>
                    <p className="text-[11px] text-slate-400">Authenticated Employee Scope • Alex Morgan</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                  PRIVACY FIREWALL ACTIVE
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-slate-700">
                  <span className="font-bold text-cyan-600">Employee Prompt:</span> "Why did my attendance percentage decrease?"
                </div>
                <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950 p-3.5 rounded-2xl border border-cyan-500/20 text-slate-100 space-y-1">
                  <span className="font-bold text-cyan-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> AI Explanation Engine:
                  </span>
                  <p className="leading-relaxed text-slate-300">
                    "Your attendance rate is 89% this month mainly due to 2 late check-ins past 9:15 AM and 1 approved leave day."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. STATS SECTION */}
      <section className="bg-white border-y border-slate-200/80 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">100%</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">RBAC Isolation</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">3-Tier</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Admin → HR → Employee</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-cyan-500 to-purple-600 bg-clip-text text-transparent">&lt; 50ms</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">AI Tool Latency</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">Zero</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Unauthorized Data Leaks</div>
          </div>
        </div>
      </section>

      {/* 4. FEATURES GRID */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Complete Enterprise HR Capabilities</h2>
            <p className="text-sm text-slate-600">Everything your organization needs to manage people, time, and payroll seamlessly.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Smart Employee Management</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Role-based employee tracking, profile management, and dynamic assignment between HR managers.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">AI Employee Assistant</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Permission-gated conversational AI providing instant answers for leave balances, attendance, and policies.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Intelligent Attendance</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                One-click check-in/out widgets, daily work hour calculation, and late check-in tracking.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Leave Management</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Submit time-off requests, track balance deductions, and process HR approvals with comments.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
                <CircleDollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Payroll Visibility</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Read-only employee salary breakdown, allowances, deductions, and downloadable PDF salary slips.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Analytics & Reports</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Chart.js charts for department distribution, team leave trends, and system audit logs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. AI ASSISTANT SHOWCASE ⭐ */}
      <section id="ai-assistant" className="bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Next-Gen HR Intelligence</span>
            <h2 className="text-3xl font-black tracking-tight">"Your HR, Just One Conversation Away"</h2>
            <p className="text-sm text-slate-300">Ask natural language questions about your work data without filling complex forms.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-900/80 p-5 rounded-3xl border border-cyan-500/20 space-y-3">
              <Sparkles className="w-6 h-6 text-cyan-400" />
              <h4 className="text-sm font-bold">Explain Attendance</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                AI analyzes check-in history to explain attendance rate drops based strictly on real records.
              </p>
            </div>

            <div className="bg-slate-900/80 p-5 rounded-3xl border border-cyan-500/20 space-y-3">
              <FileText className="w-6 h-6 text-blue-400" />
              <h4 className="text-sm font-bold">Explain Leave Decision</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Uses recorded HR decision comments and leave policies to explain why a request was approved or rejected.
              </p>
            </div>

            <div className="bg-slate-900/80 p-5 rounded-3xl border border-cyan-500/20 space-y-3">
              <BrainCircuit className="w-6 h-6 text-purple-400" />
              <h4 className="text-sm font-bold">HR Policy RAG</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Retrieves employee-accessible company policies without hallucination or unauthorized data exposure.
              </p>
            </div>

            <div className="bg-slate-900/80 p-5 rounded-3xl border border-cyan-500/20 space-y-3">
              <UserCheck className="w-6 h-6 text-emerald-400" />
              <h4 className="text-sm font-bold">Personal HR Timeline</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generates a visual milestone stream tracking joining date, leave decisions, and payroll disbursals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. ROLE HIERARCHY */}
      <section id="hierarchy" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Structured 3-Tier Role Management</h2>
            <p className="text-sm text-slate-600">Strict organizational responsibility enforced on both frontend and backend.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 font-extrabold flex items-center justify-center mx-auto text-lg">
                1
              </div>
              <h3 className="text-base font-bold text-slate-800">ADMIN ROLE</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Creates & manages HR user accounts, activates/deactivates HR, and reassigns employee groups.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-800 font-extrabold flex items-center justify-center mx-auto text-lg">
                2
              </div>
              <h3 className="text-base font-bold text-slate-800">HR MANAGER ROLE</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Manages ONLY assigned team members (`employee.hr.id == authenticatedHr.id`). HTTP 403 on cross-HR access.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 font-extrabold flex items-center justify-center mx-auto text-lg">
                3
              </div>
              <h3 className="text-base font-bold text-slate-800">EMPLOYEE ROLE</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Accesses personal attendance, leave, payroll, profile, and Dayflow AI Assistant scoped to JWT identity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. SECURITY SECTION 🔐 */}
      <section id="security" className="py-20 px-6 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Enterprise Security Boundary</span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
              "AI That Respects Your Privacy"
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Unlike generic chatbots with direct SQL access, Dayflow AI runs behind a permission-aware gateway that derives user identity solely from backend JWT claims.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Permission-Aware AI Gateway</h4>
                  <p className="text-xs text-slate-400">Controlled tools prevent arbitrary SQL execution or DB sweeps.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Least-Privilege Principle</h4>
                  <p className="text-xs text-slate-400">Context building injects only the minimal required dataset per prompt.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Human-in-the-Loop Confirmation</h4>
                  <p className="text-xs text-slate-400">AI recommends actions; sensitive updates require explicit employee approval.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/90 p-8 rounded-3xl border border-cyan-500/20 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-400" /> AI Security Firewall Demo
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 text-rose-300 font-mono">
                User Prompt: "Show me John's salary"
              </div>
              <div className="p-3 bg-rose-950/60 border border-rose-800/80 rounded-xl text-rose-200">
                <strong>Result: DENIED (HTTP 403 / Firewall)</strong><br />
                "I am authorized only to provide payroll information for your own account."
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. HOW IT WORKS */}
      <section id="how-it-works" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">How Dayflow Works</h2>
            <p className="text-sm text-slate-600">A clear 4-step workflow for organizational productivity.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-bold flex items-center justify-center mx-auto shadow-md">1</div>
              <h4 className="text-sm font-bold text-slate-800">Admin Manages HR</h4>
              <p className="text-xs text-slate-500">Admin sets up HR accounts and monitoring.</p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-bold flex items-center justify-center mx-auto shadow-md">2</div>
              <h4 className="text-sm font-bold text-slate-800">HR Manages Employees</h4>
              <p className="text-xs text-slate-500">HR handles attendance, leaves, and team payroll.</p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-bold flex items-center justify-center mx-auto shadow-md">3</div>
              <h4 className="text-sm font-bold text-slate-800">Employee Self-Service</h4>
              <p className="text-xs text-slate-500">Employee checks in, applies for leave, and views slips.</p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-bold flex items-center justify-center mx-auto shadow-md">4</div>
              <h4 className="text-sm font-bold text-slate-800">AI Assistant Guidance</h4>
              <p className="text-xs text-slate-500">AI provides explainable HR intelligence safely.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. CTA */}
      <section className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-700 text-white py-16 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">
            Transform the Way Your Organization Works
          </h2>
          <p className="text-sm text-cyan-100 max-w-xl mx-auto font-medium">
            Experience role-based HR management with an AI assistant that prioritizes security and privacy.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 py-3.5 px-8 bg-white text-blue-600 hover:bg-slate-50 font-bold text-base rounded-2xl shadow-xl transition-all"
          >
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* 10. FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-10 px-6 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-bold">
            <Building2 className="w-4 h-4 text-cyan-400" /> Dayflow HRMS 2.0
          </div>
          <p>© 2026 Dayflow – AI-Powered Human Resource Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
