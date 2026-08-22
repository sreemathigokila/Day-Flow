import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { Mail, Lock, User, Phone, Briefcase, Building, MapPin, ArrowRight, KeyRound, CheckCircle2, Sparkles } from 'lucide-react';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    department: 'Engineering',
    jobTitle: 'Software Engineer',
    address: '',
  });

  const [otpModal, setOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/send-otp', { email: form.email });
      setGeneratedOtp(res.data.otp);
      setOtpModal(true);
      setSuccess('Verification OTP sent! Check your email inbox or use the demo chip below.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send verification OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setError('');
    setOtpLoading(true);

    try {
      await api.post('/auth/register', { ...form, otp: otpCode });
      setOtpModal(false);
      alert('Registration successful and email verified! Redirecting to login...');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Invalid OTP code. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-6">
        <div className="text-center space-y-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center text-white font-black text-xl mx-auto shadow-md">
            D
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Employee Registration</h1>
          <p className="text-xs font-medium text-slate-500">Create your Dayflow Employee account with Email OTP Verification</p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSendOtp} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Jane Doe"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="emp.jane@dayflow.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
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
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Job Title</label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={form.jobTitle}
                  onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Address</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="742 Evergreen Terrace, Springfield"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:opacity-95 text-white font-bold rounded-xl text-sm shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Sending OTP to Email...' : 'Send Verification OTP to Email'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-cyan-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* OTP Verification Modal */}
      {otpModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center mx-auto mb-2">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-800">Email Verification OTP</h3>
              <p className="text-xs text-slate-500">
                We sent a 6-digit OTP code to <strong className="text-slate-700">{form.email}</strong>. Please enter it below to verify.
              </p>
            </div>

            {/* Hackathon Demo Fast-Track Chip */}
            {generatedOtp && (
              <div className="bg-gradient-to-r from-cyan-50 via-blue-50 to-purple-50 border border-cyan-200 p-3 rounded-2xl text-center space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-cyan-700 tracking-wider flex items-center justify-center gap-1">
                  <Sparkles className="w-3 h-3" /> Hackathon Demo Fast-Track OTP
                </span>
                <p className="text-sm font-black text-slate-800 tracking-widest">{generatedOtp}</p>
                <button
                  onClick={() => setOtpCode(generatedOtp)}
                  className="text-[10px] font-bold text-cyan-700 hover:underline"
                >
                  Click to Auto-Fill OTP Code
                </button>
              </div>
            )}

            {error && (
              <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                {error}
              </p>
            )}

            <form onSubmit={handleVerifyAndRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 text-center">
                  6-Digit OTP Code
                </label>
                <input
                  type="text"
                  required
                  maxLength="6"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="123456"
                  className="w-full text-center tracking-[0.5em] text-lg font-bold py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOtpModal(false)}
                  className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={otpLoading}
                  className="w-2/3 py-2.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 shadow-md shadow-cyan-500/20"
                >
                  {otpLoading ? 'Verifying...' : 'Verify OTP & Complete'} <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
