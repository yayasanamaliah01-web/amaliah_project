import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Send,
  RefreshCw,
  CheckCheck,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { api, ApiChatMessage } from '../services/api';

export default function AdvisorPage({ onBack }: { onBack?: () => void }) {
  const navigate = useNavigate();
  const { currentUser } = useAppContext();

  // Sesi unik untuk chat
  const [sessionId] = useState<string>(() => {
    if (currentUser?.email) return `user-${currentUser.email.replace(/[@.]/g, '_')}`;
    const saved = localStorage.getItem('amaliah_chat_session_id');
    if (saved) return saved;
    const newId = `guest-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    localStorage.setItem('amaliah_chat_session_id', newId);
    return newId;
  });

  const [liveMessages, setLiveMessages] = useState<ApiChatMessage[]>([]);
  const [liveInput, setLiveInput] = useState('');
  const [isLoadingLive, setIsLoadingLive] = useState(false);
  const [isSendingLive, setIsSendingLive] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadLiveMessages = async (isSilent = false) => {
    if (!isSilent) setIsLoadingLive(true);
    try {
      const data = await api.chats.getMessages(sessionId, 'USER');
      setLiveMessages(data);
      if (!isSilent) {
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    } catch (err) {
      console.error('Gagal mengambil pesan:', err);
    } finally {
      if (!isSilent) setIsLoadingLive(false);
    }
  };

  useEffect(() => {
    loadLiveMessages();
    const interval = setInterval(() => {
      loadLiveMessages(true);
    }, 3500);
    return () => clearInterval(interval);
  }, [sessionId]);

  const handleSendLiveMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = liveInput.trim();
    if (!text || isSendingLive) return;

    setLiveInput('');
    setIsSendingLive(true);

    try {
      const donorName = currentUser?.name || 'Muzakki / Donatur';
      const donorEmail = currentUser?.email || 'donatur@amaliah.id';

      const sent = await api.chats.sendMessage(sessionId, {
        senderName: donorName,
        senderEmail: donorEmail,
        senderRole: 'USER',
        content: text,
      });

      setLiveMessages((prev) => [...prev, sent]);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    } catch (err) {
      console.error('Gagal mengirim pesan:', err);
    } finally {
      setIsSendingLive(false);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="flex flex-col bg-slate-50 min-h-screen sm:h-screen w-full font-sans">
      {/* Clean Header: Back Button + Page Title + Online Status */}
      <header className="bg-white px-4 py-3 sm:px-6 border-b border-slate-200/90 shadow-2xs flex-shrink-0 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="p-2 -ml-1 hover:bg-slate-100 rounded-full text-slate-600 transition-colors cursor-pointer active:scale-95"
            title="Kembali"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800 font-bold text-sm shrink-0">
              YA
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                Konsultasi & Layanan Donatur
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[11px] font-medium text-emerald-700">Pengurus Online</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col max-w-3xl w-full mx-auto overflow-hidden bg-white sm:border-x border-slate-200 shadow-xs relative">
        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 bg-[#f8fafc] custom-scrollbar">
          {isLoadingLive ? (
            <div className="flex justify-center items-center h-48">
              <RefreshCw className="w-6 h-6 text-emerald-600 animate-spin" />
            </div>
          ) : liveMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center px-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-base mb-3 border border-emerald-100">
                YA
              </div>
              <h3 className="text-sm font-bold text-slate-800 mb-1">
                Selamat Datang di Layanan Yayasan Amaliah
              </h3>
              <p className="text-xs text-slate-500 max-w-sm">
                Silakan ketik pertanyaan atau konfirmasi donasi Anda di bawah. Pengurus kami akan segera merespon pesan Anda.
              </p>
            </div>
          ) : (
            liveMessages.map((msg) => {
              const isUser = msg.senderRole === 'USER';
              const timeFormatted = msg.timestamp
                ? new Date(msg.timestamp).toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '';

              return (
                <div
                  key={msg.id}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'} w-full`}
                >
                  <div className={`flex items-end gap-2 max-w-[85%] sm:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        isUser ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {isUser ? (currentUser?.name?.substring(0, 1) || 'D') : 'P'}
                    </div>

                    {/* Bubble */}
                    <div
                      className={`rounded-2xl p-3 px-3.5 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                        isUser
                          ? 'bg-emerald-700 text-white rounded-br-xs'
                          : 'bg-white text-slate-800 rounded-bl-xs border border-slate-200/80'
                      }`}
                    >
                      {!isUser && (
                        <div className="text-[11px] font-bold text-emerald-800 mb-1 flex items-center gap-1">
                          <span>{msg.senderName || 'Pengurus Amaliah'}</span>
                          <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded font-semibold">
                            Admin
                          </span>
                        </div>
                      )}

                      <div className="whitespace-pre-wrap">{msg.content}</div>

                      <div
                        className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                          isUser ? 'text-emerald-200' : 'text-slate-400'
                        }`}
                      >
                        <span>{timeFormatted}</span>
                        {isUser && <CheckCheck className="w-3.5 h-3.5 text-emerald-200" />}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="bg-white border-t border-slate-200 p-3 sm:p-4 shrink-0">
          <form
            onSubmit={handleSendLiveMessage}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ketik pesan Anda..."
              value={liveInput}
              onChange={(e) => setLiveInput(e.target.value)}
              className="flex-1 bg-slate-50 focus:bg-white p-3 px-4 rounded-xl text-xs sm:text-sm outline-none border border-slate-200 focus:border-emerald-600 transition-colors"
            />
            <button
              type="submit"
              disabled={!liveInput.trim() || isSendingLive}
              className="bg-emerald-700 hover:bg-emerald-800 text-white p-3 sm:px-5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-40 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Kirim</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
