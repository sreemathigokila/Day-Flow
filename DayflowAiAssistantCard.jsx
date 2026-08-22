import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addMessage, setLoading } from '../../store/aiSlice';
import api from '../../services/api';
import { Bot, Send, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

const DayflowAiAssistantCard = () => {
  const [prompt, setPrompt] = useState('');
  const { messages, loading } = useSelector((state) => state.ai);
  const dispatch = useDispatch();

  const sampleQuestions = [
    "How many leave days do I have?",
    "What is my attendance percentage?",
    "Explain my salary structure.",
    "What is the company leave policy?",
    "Show me John's salary (Security Test)"
  ];

  const handleSend = async (customPrompt) => {
    const textToSend = customPrompt || prompt;
    if (!textToSend.trim() || loading) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    dispatch(addMessage(userMsg));
    if (!customPrompt) setPrompt('');
    dispatch(setLoading(true));

    try {
      const res = await api.post('/ai/assistant', { prompt: textToSend });
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: res.data.response,
        source: res.data.source,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      dispatch(addMessage(aiMsg));
    } catch (err) {
      const errorMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: err.response?.data?.message || 'Failed to process AI query.',
        source: 'ERROR',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      dispatch(addMessage(errorMsg));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-6 text-white shadow-xl border border-slate-700/50 flex flex-col justify-between min-h-[460px]">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">Dayflow AI Assistant</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> SECURE PERMISSION LAYER
                </span>
              </div>
              <p className="text-xs text-slate-400">Ask about your attendance, leave, payroll, or company HR policies...</p>
            </div>
          </div>
          <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-xs bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white py-1 px-3 rounded-full transition-all"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat History Stream */}
        <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none shadow-md'
                    : msg.source === 'SECURITY_FIREWALL'
                    ? 'bg-amber-950/70 text-amber-200 border border-amber-600/40 rounded-bl-none'
                    : 'bg-slate-800/90 text-slate-200 border border-slate-700 rounded-bl-none'
                }`}
              >
                {msg.source === 'SECURITY_FIREWALL' && (
                  <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400 mb-1">
                    <AlertCircle className="w-3.5 h-3.5" /> SECURITY RESTRICTION ENFORCED
                  </div>
                )}
                {msg.text}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-xs text-indigo-300 animate-pulse">
              <Bot className="w-4 h-4" /> Analyzing authorization tools & generating response...
            </div>
          )}
        </div>
      </div>

      {/* Input Box */}
      <div className="pt-4 border-t border-slate-700/60 mt-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type your question here..."
            className="w-full bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 rounded-2xl pl-4 pr-12 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="absolute right-2 p-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-xl transition-all"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default DayflowAiAssistantCard;
