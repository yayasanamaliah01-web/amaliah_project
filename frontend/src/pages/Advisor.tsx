import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Bot,
  Send,
  User,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Calculator,
  RefreshCw,
  Clock,
  HeartHandshake,
  Check,
  CheckCheck,
  ChevronRight,
  ExternalLink,
  BookOpen,
  Info,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { api, ApiChatMessage } from '../services/api';

export default function AdvisorPage({ onBack }: { onBack?: () => void }) {
  const navigate = useNavigate();
  const { currentUser } = useAppContext();

  // Mode: 'live' (Terhubung ke Dashboard WhatsApp Admin) atau 'ai' (Ustadz AI Fiqih)
  const [mode, setMode] = useState<'live' | 'ai'>('live');

  // Sesi unik untuk chat
  const [sessionId] = useState<string>(() => {
    if (currentUser?.email) return `user-${currentUser.email.replace(/[@.]/g, '_')}`;
    const saved = localStorage.getItem('amaliah_chat_session_id');
    if (saved) return saved;
    const newId = `guest-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    localStorage.setItem('amaliah_chat_session_id', newId);
    return newId;
  });

  // State untuk Live Chat
  const [liveMessages, setLiveMessages] = useState<ApiChatMessage[]>([]);
  const [liveInput, setLiveInput] = useState('');
  const [isLoadingLive, setIsLoadingLive] = useState(false);
  const [isSendingLive, setIsSendingLive] = useState(false);

  // State untuk AI Chat
  const [aiMessages, setAiMessages] = useState<Array<{ id: string; role: 'bot' | 'user'; text: string; time: string; link?: string }>>([
    {
      id: 'ai-1',
      role: 'bot',
      text: "Assalamu'alaikum Warahmatullahi Wabarakatuh! Saya Ustadz AI Amaliah, asisten Fiqih Zakat & Konsultasi Filantropi Islam. Anda dapat berkonsultasi seputar perhitungan Zakat Mal, Zakat Penghasilan, Fidyah, atau rekomendasi program sedekah santri penghafal Al-Qur'an.",
      time: 'Baru saja',
    },
  ]);
  const [aiInput, setAiInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ==========================================================
  // 1. LIVE CHAT ENGINE (SYNC DENGAN ADMIN WHATSAPP DASHBOARD)
  // ==========================================================
  const loadLiveMessages = async (isSilent = false) => {
    if (!isSilent) setIsLoadingLive(true);
    try {
      const data = await api.chats.getMessages(sessionId, 'USER');
      setLiveMessages(data);
      if (!isSilent) {
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    } catch (err) {
      console.error('Gagal mengambil pesan live:', err);
    } finally {
      if (!isSilent) setIsLoadingLive(false);
    }
  };

  useEffect(() => {
    if (mode === 'live') {
      loadLiveMessages();
      const interval = setInterval(() => {
        loadLiveMessages(true);
      }, 3500);
      return () => clearInterval(interval);
    }
  }, [mode, sessionId]);

  const handleSendLiveMessage = async (textToSend?: string) => {
    const text = (textToSend || liveInput).trim();
    if (!text || isSendingLive) return;

    if (!textToSend) setLiveInput('');
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
      console.error('Gagal mengirim pesan live:', err);
    } finally {
      setIsSendingLive(false);
    }
  };

  // ==========================================================
  // 2. AI KONSULTAN FIQIH & PERHITUNGAN ZAKAT
  // ==========================================================
  const handleSendAiMessage = (queryText?: string) => {
    const text = (queryText || aiInput).trim();
    if (!text || isAiTyping) return;

    if (!queryText) setAiInput('');
    const userMsg = {
      id: `u-${Date.now()}`,
      role: 'user' as const,
      text,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };
    setAiMessages((prev) => [...prev, userMsg]);
    setIsAiTyping(true);
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);

    setTimeout(() => {
      let botResponse = '';
      let actionLink: string | undefined = undefined;
      const lower = text.toLowerCase();

      if (lower.includes('nisab') || lower.includes('nishab') || lower.includes('zakat mal') || lower.includes('emas')) {
        botResponse =
          "Nishab Zakat Mal setara dengan **85 gram emas murni**. Jika harga emas saat ini diasumsikan Rp 1.250.000/gram, maka nishab zakat mal adalah sekitar **Rp 106.250.000** yang telah tersimpan genap 1 tahun (haul). Besaran zakat yang wajib dikeluarkan adalah **2,5%**.";
      } else if (lower.includes('penghasilan') || lower.includes('profesi') || lower.includes('gaji')) {
        botResponse =
          "Menurut fatwa MUI No. 3 Tahun 2003, Zakat Penghasilan ditunaikan saat menerima penghasilan jika telah mencapai nishab setara **524 kg beras per bulan** (sekitar **Rp 7.500.000/bulan**). Besar zakatnya adalah **2,5%** dari penghasilan kotor atau setelah kebutuhan pokok mendesak.";
      } else if (lower.includes('fidyah')) {
        botResponse =
          "Fidyah ditunaikan bagi orang tua lanjut usia atau yang sakit menahun yang tidak sanggup berpuasa. Takarannya adalah **1 mud (± 675 gram beras)** atau disetarakan dengan biaya satu porsi makan lengkap (sekitar **Rp 25.000 - Rp 30.000/hari**) untuk setiap hari puasa yang ditinggalkan.";
      } else if (lower.includes('rekening') || lower.includes('transfer') || lower.includes('bsi')) {
        botResponse =
          "Rekening resmi Yayasan Pesantren Amaliah adalah **Bank Syariah Indonesia (BSI) 7711223344 a.n Yayasan Semarang Infak**. Anda juga dapat berdonasi instan melalui QRIS atau Virtual Account otomatis di halaman Penunaian.";
        actionLink = '/pembayaran';
      } else if (lower.includes('santri') || lower.includes('rekomendasi') || lower.includes('program') || lower.includes('beras')) {
        botResponse =
          "Program kebaikan utama yang sedang berjalan di Pesantren Amaliah saat ini antara lain:\n1. **Operasional Dapur & Sedekah Beras Santri Tahfidz**\n2. **Kafalah & Tunjangan Bulanan Asatidz**\n3. **Operasional Listrik PLN & Pemeliharaan Asrama Santri**.\nSemua penyaluran memiliki laporan LPJ transparan.";
        actionLink = '/programs';
      } else {
        botResponse =
          "Terima kasih atas pertanyaannya. Segala bentuk infak dan sedekah yang ditunaikan ke Yayasan Pesantren Amaliah akan disalurkan 100% tepat sasaran kepada para santri dan asatidz dengan pencatatan mutasi bank live. Jika ada pertanyaan khusus, Anda dapat beralih ke tab **Live Chat Pengurus** untuk berbicara langsung dengan tim sekretariat kami.";
      }

      setAiMessages((prev) => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          role: 'bot',
          text: botResponse,
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          link: actionLink,
        },
      ]);
      setIsAiTyping(false);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    }, 800);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="flex flex-col bg-slate-100 min-h-screen sm:h-screen w-full font-sans">
      {/* Top Header */}
      <header className="bg-white px-4 py-3.5 sm:px-6 border-b border-slate-200/90 shadow-2xs flex-shrink-0 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors cursor-pointer"
            title="Kembali"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                Konsultasi ZISWAF & Layanan Donatur
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                <ShieldCheck className="w-3 h-3 text-emerald-600" /> Resmi Pesantren
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Yayasan Pesantren Amaliah Semarang • Respon Cepat
            </p>
          </div>
        </div>

        {/* Status Indikator */}
        <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200/60">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-bold text-emerald-800">
            {mode === 'live' ? 'Pengurus Online' : 'AI Fiqih Siap'}
          </span>
        </div>
      </header>

      {/* Mode Switcher Tabs */}
      <div className="bg-white border-b border-slate-200/80 px-4 py-2 shrink-0">
        <div className="max-w-3xl mx-auto flex gap-2">
          <button
            type="button"
            onClick={() => setMode('live')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              mode === 'live'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/70'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Live Chat Pengurus (Terhubung ke Admin)</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          </button>

          <button
            type="button"
            onClick={() => setMode('ai')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              mode === 'ai'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/70'
            }`}
          >
            <Bot className="w-4 h-4 text-emerald-400" />
            <span>Ustadz AI Fiqih & Kalkulator Zakat</span>
          </button>
        </div>
      </div>

      {/* Main Chat Box Container */}
      <div className="flex-1 flex flex-col max-w-3xl w-full mx-auto overflow-hidden bg-white sm:border-x border-slate-200 shadow-xs relative">
        {/* ==================================================== */}
        {/* TAB 1: LIVE CHAT DENGAN ADMIN (WhatsApp Connected) */}
        {/* ==================================================== */}
        {mode === 'live' && (
          <div className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-hidden">
            {/* Live Chat Notification Strip */}
            <div className="bg-emerald-50/90 border-b border-emerald-100 p-2.5 px-4 text-xs text-emerald-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Pesan Anda terhubung langsung ke Dashboard Pengurus Pesantren Amaliah.</span>
              </div>
              <span className="text-[10px] font-semibold text-emerald-700 hidden sm:inline">Dibalas Segera</span>
            </div>

            {/* Quick Question Pills for Live Chat */}
            <div className="p-3 bg-white border-b border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
              <span className="text-[11px] font-bold text-slate-400 shrink-0">Pertanyaan Cepat:</span>
              <button
                type="button"
                onClick={() => handleSendLiveMessage("Assalamu'alaikum Ustadz, mau konfirmasi apakah donasi saya via BSI sudah terverifikasi?")}
                className="text-[11px] bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 rounded-full px-3 py-1 font-medium whitespace-nowrap transition-colors"
              >
                Konfirmasi Transfer Donasi
              </button>
              <button
                type="button"
                onClick={() => handleSendLiveMessage("Bismillah, bagaimana prosedur penyaluran bantuan langsung / sedekah beras fisik ke pondok?")}
                className="text-[11px] bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 rounded-full px-3 py-1 font-medium whitespace-nowrap transition-colors"
              >
                Kirim Beras Fisik ke Pondok
              </button>
              <button
                type="button"
                onClick={() => handleSendLiveMessage("Bisa minta nomor rekening resmi BSI Yayasan Pesantren Amaliah?")}
                className="text-[11px] bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 rounded-full px-3 py-1 font-medium whitespace-nowrap transition-colors"
              >
                Rekening Resmi BSI
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 custom-scrollbar">
              {isLoadingLive ? (
                <div className="flex justify-center py-10">
                  <RefreshCw className="w-6 h-6 text-emerald-600 animate-spin" />
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
                      <div className={`flex items-end gap-2 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                        {/* Avatar */}
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            isUser ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {isUser ? (currentUser?.name?.substring(0, 1) || 'D') : 'U'}
                        </div>

                        {/* Bubble */}
                        <div
                          className={`rounded-2xl p-3 px-3.5 text-xs leading-relaxed shadow-2xs ${
                            isUser
                              ? 'bg-emerald-700 text-white rounded-br-xs'
                              : 'bg-white text-slate-800 rounded-bl-xs border border-slate-200/80'
                          }`}
                        >
                          {!isUser && (
                            <div className="text-[11px] font-bold text-emerald-800 mb-1 flex items-center gap-1">
                              <span>{msg.senderName || 'Ustadz Pengurus'}</span>
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

            {/* Live Chat Input Bar */}
            <div className="bg-white border-t border-slate-200 p-3 sm:p-4 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendLiveMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Ketik pesan Anda ke pengurus..."
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
        )}

        {/* ==================================================== */}
        {/* TAB 2: USTADZ AI FIQIH & KALKULATOR ZISWAF */}
        {/* ==================================================== */}
        {mode === 'ai' && (
          <div className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-hidden">
            {/* AI Top Pills */}
            <div className="p-3 bg-white border-b border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
              <span className="text-[11px] font-bold text-slate-400 shrink-0">Topik Fiqih:</span>
              <button
                type="button"
                onClick={() => handleSendAiMessage("Berapa nishab dan rumus zakat mal emas?")}
                className="text-[11px] bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 rounded-full px-3 py-1 font-medium whitespace-nowrap transition-colors"
              >
                Nishab Zakat Mal
              </button>
              <button
                type="button"
                onClick={() => handleSendAiMessage("Bagaimana perhitungan zakat penghasilan bulanan?")}
                className="text-[11px] bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 rounded-full px-3 py-1 font-medium whitespace-nowrap transition-colors"
              >
                Zakat Penghasilan
              </button>
              <button
                type="button"
                onClick={() => handleSendAiMessage("Berapa takaran fidyah puasa dan nilai rupiahnya?")}
                className="text-[11px] bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 rounded-full px-3 py-1 font-medium whitespace-nowrap transition-colors"
              >
                Ketentuan Fidyah
              </button>
              <button
                type="button"
                onClick={() => handleSendAiMessage("Apa saja program sedekah santri di Pesantren Amaliah?")}
                className="text-[11px] bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 rounded-full px-3 py-1 font-medium whitespace-nowrap transition-colors"
              >
                Program Pesantren
              </button>
            </div>

            {/* AI Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 custom-scrollbar">
              {aiMessages.map((msg) => {
                const isBot = msg.role === 'bot';
                return (
                  <div key={msg.id} className={`flex ${isBot ? 'justify-start' : 'justify-end'} w-full`}>
                    <div className={`flex items-start gap-2.5 max-w-[88%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          isBot ? 'bg-emerald-800 text-emerald-200' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                      </div>

                      <div
                        className={`rounded-2xl p-3.5 px-4 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                          isBot
                            ? 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs'
                            : 'bg-emerald-700 text-white rounded-tr-xs'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{msg.text}</div>

                        {msg.link && (
                          <div className="mt-2.5 pt-2 border-t border-slate-100">
                            <button
                              type="button"
                              onClick={() => navigate(msg.link!)}
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors"
                            >
                              <span>Buka Halaman Penyaluran</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        <span className={`block text-[10px] mt-1 text-right ${isBot ? 'text-slate-400' : 'text-emerald-200'}`}>
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {isAiTyping && (
                <div className="flex items-center gap-2 text-xs text-slate-400 italic py-1">
                  <div className="w-7 h-7 rounded-full bg-emerald-800 text-emerald-200 flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5 animate-bounce" />
                  </div>
                  <span>Ustadz AI sedang menyusun jawaban fiqih...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* AI Input Bar */}
            <div className="bg-white border-t border-slate-200 p-3 sm:p-4 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendAiMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Tanyakan hukum zakat, nisab, sedekah, atau fidyah..."
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  className="flex-1 bg-slate-50 focus:bg-white p-3 px-4 rounded-xl text-xs sm:text-sm outline-none border border-slate-200 focus:border-emerald-600 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!aiInput.trim() || isAiTyping}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white p-3 sm:px-5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-40 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Tanya</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
