import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/authSlice';
import api from '../../services/api';
import { Shield, Briefcase, UserCheck, Lock, Mail, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e, customEmail, customPassword) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    const loginEmail = customEmail || email;
    const loginPassword = customPassword || password;

    try {
      const res = await api.post('/auth/login', { email: loginEmail, password: loginPassword });
      const { token, userId, role, hrId, employeeId, name } = res.data;
      const user = { userId, email: loginEmail, role, hrId, employeeId, name };

      dispatch(setCredentials({ token, user }));

      if (role === 'ROLE_ADMIN') navigate('/admin/dashboard');
      else if (role === 'ROLE_HR') navigate('/hr/dashboard');
      else if (role === 'ROLE_EMPLOYEE') navigate('/employee/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-2xl mx-auto shadow-lg shadow-blue-500/25">
            D
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Dayflow HRMS</h1>
          <p className="text-sm text-slate-500">Sign in to your role-based portal & AI assistant</p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Quick Demo Login Cards for Hackathon Judges */}
        <div className="space-y-2 pt-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">
            Quick One-Click Demo Logins
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleLogin(null, 'admin@dayflow.com', 'Admin@123')}
              className="p-2.5 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl text-purple-700 font-semibold text-xs flex flex-col items-center gap-1 transition-all"
            >
              <Shield className="w-4 h-4" /> ADMIN
            </button>
            <button
              onClick={() => handleLogin(null, 'hr.sarah@dayflow.com', 'Hr@12345')}
              className="p-2.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl text-blue-700 font-semibold text-xs flex flex-col items-center gap-1 transition-all"
            >
              <Briefcase className="w-4 h-4" /> HR USER
            </button>
            <button
              onClick={() => handleLogin(null, 'emp.alex@dayflow.com', 'Emp@12345')}
              className="p-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-emerald-700 font-semibold text-xs flex flex-col items-center gap-1 transition-all"
            >
              <UserCheck className="w-4 h-4" /> EMPLOYEE
            </button>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Signing in...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            New employee?{' '}
            <Link to="/register" className="font-semibold text-blue-600 hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
