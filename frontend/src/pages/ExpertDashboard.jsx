import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Users, MessageSquare, CheckCircle, Clock, XCircle,
  Send, LogOut, Briefcase, RefreshCw, User, ShieldCheck, Trash2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API_BASE = '/api/expert';

export default function ExpertDashboard({ onLogout }) {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const messagesEndRef = useRef(null);
  const pollRef = useRef(null);

  // Fetch all sessions
  const fetchSessions = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/sessions`);
      if (!res.ok) return;
      const data = await res.json();
      setSessions(data);
      setLastUpdated(new Date());

      // Auto-update selected session nếu đang mở
      if (selectedSession) {
        const updated = data.find(s => s.id === selectedSession.id);
        if (updated) setSelectedSession(updated);
      }
    } catch (err) {
      console.warn('Polling error:', err);
    }
  }, [selectedSession]);

  // Polling mỗi 3 giây
  useEffect(() => {
    fetchSessions();
    pollRef.current = setInterval(fetchSessions, 3000);
    return () => clearInterval(pollRef.current);
  }, [fetchSessions]);

  // Auto scroll tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedSession?.messages]);

  const handleAccept = async (session) => {
    try {
      const res = await fetch(`${API_BASE}/sessions/${session.id}/accept`, { method: 'PUT' });
      if (res.ok) {
        const updated = await res.json();
        setSelectedSession(updated);
        await fetchSessions();
      }
    } catch (err) { console.error(err); }
  };

  const handleClose = async (session) => {
    if (!window.confirm('Bạn có chắc muốn kết thúc phiên tư vấn này?')) return;
    try {
      const res = await fetch(`${API_BASE}/sessions/${session.id}/close`, { method: 'PUT' });
      if (res.ok) {
        setSelectedSession(null);
        await fetchSessions();
      }
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (e, session) => {
    e.stopPropagation();
    if (!window.confirm('Bạn có chắc chắn muốn xóa vĩnh viễn đoạn chat này không?')) return;
    try {
      const res = await fetch(`${API_BASE}/sessions/${session.id}`, { method: 'DELETE' });
      if (res.ok) {
        if (selectedSession?.id === session.id) {
          setSelectedSession(null);
        }
        await fetchSessions();
      } else {
        alert('Không thể xóa phiên tư vấn này');
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi kết nối khi xóa phiên tư vấn');
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedSession || sending) return;
    setSending(true);
    const text = message.trim();
    setMessage('');
    try {
      const res = await fetch(`${API_BASE}/sessions/${selectedSession.id}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender: 'expert', senderName: user?.name || 'Chuyên gia', text })
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedSession(data.session);
        await fetchSessions();
      }
    } catch (err) { console.error(err); }
    finally { setSending(false); }
  };

  const pending = sessions.filter(s => s.status === 'pending');
  const active = sessions.filter(s => s.status === 'active');
  const closed = sessions.filter(s => s.status === 'closed');

  const StatusBadge = ({ status }) => {
    const map = {
      pending: { label: 'Chờ xử lý', cls: 'bg-amber-100 text-amber-700 border-amber-200', icon: <Clock className="w-3 h-3" /> },
      active:  { label: 'Đang tư vấn', cls: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: <CheckCircle className="w-3 h-3" /> },
      closed:  { label: 'Đã kết thúc', cls: 'bg-slate-100 text-slate-500 border-slate-200', icon: <XCircle className="w-3 h-3" /> },
    };
    const s = map[status] || map.closed;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${s.cls}`}>
        {s.icon}{s.label}
      </span>
    );
  };

  const SessionCard = ({ session }) => {
    const isSelected = selectedSession?.id === session.id;
    const lastMsg = session.messages[session.messages.length - 1];
    return (
      <div
        onClick={() => setSelectedSession(session)}
        className={`p-3 rounded-xl border cursor-pointer transition-all relative group ${
          isSelected
            ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 dark:border-indigo-600 shadow-sm'
            : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 hover:bg-slate-50 dark:hover:bg-slate-800'
        }`}
      >
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-sky-400 flex items-center justify-center text-white font-bold text-xs shrink-0">
              {session.userName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{session.userName}</p>
              <p className="text-xs text-slate-500 truncate">{session.careerName}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <StatusBadge status={session.status} />
            <button
              onClick={(e) => handleDelete(e, session)}
              title="Xóa đoạn chat"
              className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md transition-all z-10 mt-0.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        {lastMsg && (
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-1 pl-9">
            {lastMsg.sender === 'expert' ? '✦ Bạn: ' : ''}{lastMsg.text}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-950 font-sans">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-400 flex items-center justify-center shadow-md">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-slate-800 dark:text-slate-100 leading-none">Expert Dashboard</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">CareerAI — Tư vấn hướng nghiệp</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="hidden sm:flex items-center gap-1 text-xs text-slate-400">
              <RefreshCw className="w-3 h-3" />
              {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          )}
          <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 px-3 py-1.5 rounded-xl">
            <div className="w-6 h-6 rounded-lg bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">{user?.name}</span>
          </div>
          <button
            onClick={onLogout}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
            title="Đăng xuất"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 min-h-0 gap-0">
        {/* LEFT PANEL — Danh sách sessions */}
        <aside className="w-80 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 p-4 border-b border-slate-100 dark:border-slate-800">
            {[
              { label: 'Chờ xử lý', value: pending.length, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/20' },
              { label: 'Đang tư vấn', value: active.length, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/20' },
              { label: 'Đã xong', value: closed.length, color: 'text-slate-500', bg: 'bg-slate-100 dark:bg-slate-800' },
            ].map(stat => (
              <div key={stat.label} className={`${stat.bg} rounded-xl p-2.5 text-center`}>
                <p className={`text-xl font-extrabold ${stat.color}`}>{stat.value}</p>
                <p className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Session List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {sessions.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm font-medium">Chưa có yêu cầu tư vấn</p>
                <p className="text-xs mt-1">Đang polling mỗi 3 giây...</p>
              </div>
            ) : (
              <>
                {pending.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-amber-600 uppercase tracking-wider px-1 mb-1.5">⏳ Chờ xử lý ({pending.length})</p>
                    <div className="space-y-1.5">{pending.map(s => <SessionCard key={s.id} session={s} />)}</div>
                  </div>
                )}
                {active.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider px-1 mb-1.5 mt-3">💬 Đang tư vấn ({active.length})</p>
                    <div className="space-y-1.5">{active.map(s => <SessionCard key={s.id} session={s} />)}</div>
                  </div>
                )}
                {closed.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 mb-1.5 mt-3">✓ Đã kết thúc ({closed.length})</p>
                    <div className="space-y-1.5">{closed.map(s => <SessionCard key={s.id} session={s} />)}</div>
                  </div>
                )}
              </>
            )}
          </div>
        </aside>

        {/* RIGHT PANEL — Chat */}
        <main className="flex-1 flex flex-col min-w-0">
          {selectedSession ? (
            <>
              {/* Chat Header */}
              <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-5 py-3 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-400 flex items-center justify-center text-white font-bold">
                    {selectedSession.userName?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-100">{selectedSession.userName}</p>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-3 h-3 text-slate-400" />
                      <span className="text-xs text-slate-500">{selectedSession.careerName}</span>
                      <StatusBadge status={selectedSession.status} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedSession.status === 'pending' && (
                    <button
                      onClick={() => handleAccept(selectedSession)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl text-sm font-bold shadow-md active:scale-95 transition-all"
                    >
                      <CheckCircle className="w-4 h-4" /> Chấp nhận tư vấn
                    </button>
                  )}
                  {selectedSession.status === 'active' && (
                    <button
                      onClick={() => handleClose(selectedSession)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-600 hover:text-red-600 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-700 transition-all"
                    >
                      <XCircle className="w-4 h-4" /> Kết thúc
                    </button>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-slate-50 dark:bg-slate-950">
                {selectedSession.messages.map((msg) => {
                  const isExpert = msg.sender === 'expert';
                  return (
                    <div key={msg.id} className={`flex gap-2.5 ${isExpert ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0 mt-1 ${isExpert ? 'bg-indigo-500' : 'bg-slate-400'}`}>
                        {isExpert ? <ShieldCheck className="w-4 h-4" /> : <User className="w-4 h-4" />}
                      </div>
                      <div className={`max-w-[70%] ${isExpert ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                        <p className={`text-xs font-semibold ${isExpert ? 'text-indigo-600 dark:text-indigo-400 text-right' : 'text-slate-500'}`}>
                          {msg.senderName}
                        </p>
                        <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                          isExpert
                            ? 'bg-indigo-600 text-white rounded-tr-sm'
                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-tl-sm shadow-sm'
                        }`}>
                          {msg.text}
                        </div>
                        <p className="text-[10px] text-slate-400">
                          {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              {selectedSession.status === 'active' ? (
                <form
                  onSubmit={handleSend}
                  className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 flex gap-3 items-end shrink-0"
                >
                  <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); }}}
                    placeholder="Nhập tin nhắn tư vấn... (Enter để gửi)"
                    rows={2}
                    className="flex-1 resize-none px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!message.trim() || sending}
                    className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-md disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              ) : selectedSession.status === 'pending' ? (
                <div className="bg-amber-50 dark:bg-amber-950/20 border-t border-amber-200 dark:border-amber-800 p-4 text-center shrink-0">
                  <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">Chấp nhận phiên tư vấn để bắt đầu chat</p>
                </div>
              ) : (
                <div className="bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-4 text-center shrink-0">
                  <p className="text-sm text-slate-500">Phiên tư vấn đã kết thúc</p>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-4">
              <div className="w-20 h-20 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center">
                <MessageSquare className="w-10 h-10 text-indigo-300" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-slate-600 dark:text-slate-300">Chọn một phiên tư vấn</p>
                <p className="text-sm mt-1">để xem nội dung chat và hỗ trợ học viên</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
