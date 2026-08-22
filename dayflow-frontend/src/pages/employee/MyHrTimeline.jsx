import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Clock, Calendar, CheckCircle2, FileCheck, CircleDollarSign, User, Sparkles } from 'lucide-react';

const MyHrTimeline = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimeline();
  }, []);

  const fetchTimeline = async () => {
    try {
      setLoading(true);
      const res = await api.get('/ai/timeline');
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-semibold">Generating your personal HR timeline...</div>;

  const { profile, events = [] } = data || {};

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'JOINING':
        return <User className="w-4 h-4 text-purple-600" />;
      case 'LEAVE':
        return <FileCheck className="w-4 h-4 text-amber-600" />;
      case 'PAYROLL':
        return <CircleDollarSign className="w-4 h-4 text-emerald-600" />;
      default:
        return <Calendar className="w-4 h-4 text-cyan-600" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl font-black text-slate-800 tracking-tight">My Personal HR Timeline</h1>
        <p className="text-xs font-medium text-slate-500">Chronological history of your journey, attendance milestones, leave requests, and payroll updates at Dayflow</p>
      </div>

      {/* AI Intelligence Summary Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-purple-950 p-5 rounded-3xl text-white shadow-lg border border-cyan-500/20 flex items-start gap-3">
        <Sparkles className="w-6 h-6 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-bold text-white">AI HR Timeline Intelligence Summary</h3>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            "Welcome {profile?.name}! Across your timeline, you have recorded <strong>{events.length} major HR events</strong>. Your assigned HR manager is <strong>{profile?.hrName || 'General HR'}</strong>."
          </p>
        </div>
      </div>

      {/* Vertical Timeline */}
      <div className="relative border-l-2 border-slate-200 ml-4 space-y-6 pt-2">
        {events.map((event, idx) => (
          <div key={idx} className="relative pl-6">
            {/* Circle Node */}
            <div className="absolute -left-3 top-1.5 w-6 h-6 rounded-full bg-white border-2 border-cyan-500 flex items-center justify-center shadow-xs">
              {getCategoryIcon(event.category)}
            </div>

            {/* Event Card */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold text-cyan-700 bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded">{event.category}</span>
                <span>{event.date}</span>
              </div>
              <h4 className="text-sm font-bold text-slate-800">{event.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyHrTimeline;
