import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { User, Phone, MapPin, Building, Briefcase, Camera, Save, CheckCircle2 } from 'lucide-react';

const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ phone: '', address: '', profilePicture: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/employee/profile');
      setProfile(res.data);
      setForm({
        phone: res.data.phone || '',
        address: res.data.address || '',
        profilePicture: res.data.profilePicture || '',
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      const res = await api.put('/employee/profile', form);
      setProfile(res.data);
      setMsg('Profile updated successfully!');
    } catch (err) {
      setMsg('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-semibold">Loading profile...</div>;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">My Profile Settings</h1>
        <p className="text-xs text-slate-500">Update permitted personal info (Phone, Address, Profile Picture)</p>
      </div>

      {msg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {msg}
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
        {/* Avatar & Read-only header */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <img
            src={profile?.profilePicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'}
            alt="Avatar"
            className="w-20 h-20 rounded-2xl object-cover border-2 border-blue-500/20 shadow-md"
          />
          <div>
            <h2 className="text-lg font-bold text-slate-800">{profile?.name}</h2>
            <p className="text-xs text-slate-500 font-medium">{profile?.jobTitle} • {profile?.department}</p>
            <p className="text-xs text-slate-400 mt-1">{profile?.email}</p>
          </div>
        </div>

        {/* Read-Only Employment Information */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Employment Information (Read-Only)</h3>
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <span className="text-xs text-slate-400 font-medium">Department</span>
              <p className="text-sm font-semibold text-slate-800">{profile?.department}</p>
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">Job Title</span>
              <p className="text-sm font-semibold text-slate-800">{profile?.jobTitle}</p>
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">Assigned HR</span>
              <p className="text-sm font-semibold text-blue-600">{profile?.hrName || 'General HR'}</p>
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">Joining Date</span>
              <p className="text-sm font-semibold text-slate-800">{profile?.joiningDate}</p>
            </div>
          </div>
        </div>

        {/* Editable Form */}
        <form onSubmit={handleUpdate} className="space-y-4 pt-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Editable Personal Information</h3>
          
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Address</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Profile Picture Image URL (Cloudinary)</label>
            <div className="relative">
              <Camera className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={form.profilePicture}
                onChange={(e) => setForm({ ...form, profilePicture: e.target.value })}
                placeholder="https://cloudinary.com/..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all"
          >
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MyProfile;
