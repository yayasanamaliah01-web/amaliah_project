import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Send,
  CheckCheck,
  Check,
  Clock,
  MoreVertical,
  Phone,
  Shield,
  Smile,
  MessageSquare,
  Sparkles,
  RefreshCw,
  User,
  Filter,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { api, ApiChatMessage, ApiConversationSummary } from '../../services/api';
import { useAppContext } from '../../context/AppContext';

export default function AdminChat() {
  const { currentUser } = useAppContext();

  const [conversations, setConversations] = useState<ApiConversationSummary[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ApiChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unread'>('all');
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickTemplates = [
    {
      title: 'Salam Pembuka',
      text: "Wa'alaikumsalam Warahmatullahi Wabarakatuh. Ahlan wa sahlan Bpk/Ibu di layanan resmi Yayasan Pesantren Amaliah. Ada yang bisa kami bantu?",
    },
    {
      title: 'Doa Penerimaan Zakat',
      text: "Alhamdulillah wa syukrulillah. Jazakumullahu khairan katsiran atas infak/zakat yang ditunaikan. Semoga Allah SWT memberkahi harta yang tersisa dan menjadikannya pembersih.",
    },
    {
      title: 'Rekening Resmi BSI',
      text: 'Berikut rekening resmi Yayasan Pesantren Amaliah:\nBank Syariah Indonesia (BSI)\nNo. Rek: 7711223344\na.n Yayasan Semarang Infak\nKonfirmasi otomatis via QRIS / VA di web.',
    },
    {
      title: 'Konfirmasi Donasi Masuk',
      text: 'Alhamdulillah donasi Anda telah kami verifikasi masuk ke kas penerimaan. E-Receipt resmi telah terbit dan dapat diunduh di website.',
    },
  ];

  // 1. Fetch conversations list
  const loadConversations = async () => {
    try {
      const data = await api.chats.getConversations();
      setConversations(data);
      if (!selectedSessionId && data.length > 0) {
        setSelectedSessionId(data[0].sessionId);
      }
    } catch (err) {
      console.error('Gagal mengambil daftar percakapan:', err);
    }
  };

  // 2. Fetch messages in selected session
  const loadMessages = async (sessionId: string, isSilent = false) => {
    if (!isSilent) setIsLoadingMessages(true);
    try {
      const data = await api.chats.getMessages(sessionId, 'ADMIN');
      setMessages(data);
      if (!isSilent) {
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    } catch (err) {
      console.error('Gagal mengambil pesan:', err);
    } finally {
      if (!isSilent) setIsLoadingMessages(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadConversations();
  }, []);

  // Polling conversations & messages every 3.5s (WhatsApp Realtime Feel)
  useEffect(() => {
    const interval = setInterval(() => {
      loadConversations();
      if (selectedSessionId) {
        loadMessages(selectedSessionId, true);
      }
    }, 3500);
    return () => clearInterval(interval);
  }, [selectedSessionId]);

  // Load messages when conversation changes
  useEffect(() => {
    if (selectedSessionId) {
      loadMessages(selectedSessionId, false);
      // Mark as read in list locally
      setConversations((prev) =>
        prev.map((c) => (c.sessionId === selectedSessionId ? { ...c, unreadCount: 0 } : c))
      );
    }
  }, [selectedSessionId]);

  // Handle send message from Admin
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !selectedSessionId || isSending) return;

    const messageText = inputText.trim();
    setInputText('');
    setIsSending(true);

    try {
      const newMsg = await api.chats.sendMessage(selectedSessionId, {
        senderName: currentUser?.name || 'Admin Pesantren Amaliah',
        senderEmail: currentUser?.email || 'admin@amaliah.id',
        senderRole: 'ADMIN',
        content: messageText,
      });

      setMessages((prev) => [...prev, newMsg]);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);

      // Refresh list to update snippet
      loadConversations();
    } catch (err) {
      console.error('Gagal mengirim pesan balasan:', err);
    } finally {
      setIsSending(false);
    }
  };

  const selectedConv = conversations.find((c) => c.sessionId === selectedSessionId);

  const filteredConversations = conversations.filter((c) => {
    const matchSearch =
      c.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.donorEmail.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterType === 'unread') {
      return matchSearch && c.unreadCount > 0;
    }
    return matchSearch;
  });

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-slate-100 overflow-hidden font-sans">
      {/* WhatsApp Container Card */}
      <div className="flex-1 flex overflow-hidden border-t border-slate-200">
        {/* ==================================================== */}
        {/* LEFT COLUMN: CHAT LIST (WhatsApp Sidebar) */}
        {/* ==================================================== */}
        <div className="w-full md:w-80 lg:w-96 bg-white border-r border-slate-200 flex flex-col h-full shrink-0">
          {/* Header Sidebar WA */}
          <div className="bg-[#f0f2f5] p-3 px-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                {currentUser?.name?.substring(0, 2).toUpperCase() || 'AD'}
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-800 leading-tight">Live Chat Donatur</h3>
                <p className="text-[11px] text-slate-500">Yayasan Pesantren Amaliah</p>
              </div>
            </div>
            <button
              onClick={loadConversations}
              className="p-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-200/60 transition-colors"
              title="Perbarui Chat"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Search Bar & Filter */}
          <div className="p-2.5 bg-white border-b border-slate-100 space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari atau mulai chat baru..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#f0f2f5] pl-9 pr-4 py-1.5 rounded-lg text-xs outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500 transition-all border border-transparent focus:border-slate-200"
              />
            </div>

            <div className="flex items-center gap-1.5 pt-0.5">
              <button
                type="button"
                onClick={() => setFilterType('all')}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-full transition-colors ${
                  filterType === 'all'
                    ? 'bg-[#008069] text-white shadow-2xs'
                    : 'bg-[#f0f2f5] text-slate-600 hover:bg-slate-200'
                }`}
              >
                Semua ({conversations.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterType('unread')}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-full transition-colors ${
                  filterType === 'unread'
                    ? 'bg-[#008069] text-white shadow-2xs'
                    : 'bg-[#f0f2f5] text-slate-600 hover:bg-slate-200'
                }`}
              >
                Belum Dibaca
              </button>
            </div>
          </div>

          {/* Contact List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-300 stroke-[1.5]" />
                <p>Tidak ada percakapan ditemukan.</p>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = conv.sessionId === selectedSessionId;
                const timeStr = conv.lastTimestamp
                  ? new Date(conv.lastTimestamp).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '';

                return (
                  <div
                    key={conv.sessionId}
                    onClick={() => setSelectedSessionId(conv.sessionId)}
                    className={`p-3 px-4 flex items-center gap-3 cursor-pointer transition-colors relative ${
                      isSelected ? 'bg-[#f0f2f5]' : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0 border border-emerald-200/60 relative">
                      {conv.donorName.substring(0, 2).toUpperCase()}
                      {conv.isOnline && (
                        <span className="w-3 h-3 bg-emerald-500 border-2 border-white rounded-full absolute bottom-0 right-0"></span>
                      )}
                    </div>

                    {/* Text Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className="font-bold text-xs text-slate-900 truncate">{conv.donorName}</h4>
                        <span className="text-[10px] text-slate-400 font-medium shrink-0 ml-1">
                          {timeStr}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] text-slate-500 truncate max-w-[190px]">
                          {conv.lastMessage}
                        </p>
                        {conv.unreadCount > 0 && (
                          <span className="bg-[#25d366] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-4 text-center shrink-0">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ==================================================== */}
        {/* RIGHT COLUMN: ACTIVE CHAT WINDOW (WhatsApp Theme) */}
        {/* ==================================================== */}
        {selectedSessionId && selectedConv ? (
          <div className="flex-1 flex flex-col h-full bg-[#efeae2] relative overflow-hidden">
            {/* Header Active Chat (WhatsApp Style) */}
            <div className="bg-[#f0f2f5] p-3 px-4 border-b border-slate-200 flex items-center justify-between shrink-0 shadow-2xs z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-sm">
                  {selectedConv.donorName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 leading-tight">
                    {selectedConv.donorName}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Online • Konsultasi ZISWAF Aktif</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowQuickReplies(!showQuickReplies)}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 text-emerald-800 border border-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Template Cepat</span>
                </button>
              </div>
            </div>

            {/* Quick Replies Drawer */}
            {showQuickReplies && (
              <div className="bg-white border-b border-slate-200 p-3 px-4 shadow-sm z-10 animate-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                    Pilih Template Balasan Cepat Ustadz & Pengurus:
                  </span>
                  <button
                    onClick={() => setShowQuickReplies(false)}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    Tutup
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {quickTemplates.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setInputText(item.text);
                        setShowQuickReplies(false);
                      }}
                      className="p-2.5 rounded-xl border border-slate-200 text-left hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors bg-slate-50/50"
                    >
                      <div className="text-xs font-bold text-slate-800">{item.title}</div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">{item.text}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Messages Body (WhatsApp Doodle Look) */}
            <div
              className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 custom-scrollbar"
              style={{
                backgroundImage:
                  'radial-gradient(#cbd5e1 0.75px, transparent 0.75px), radial-gradient(#cbd5e1 0.75px, #efeae2 0.75px)',
                backgroundSize: '24px 24px',
                backgroundPosition: '0 0, 12px 12px',
              }}
            >
              {/* Security Pill Notice */}
              <div className="flex justify-center my-2">
                <div className="bg-[#ffeecd] border border-amber-200/60 text-[#54656f] text-[11px] px-3.5 py-1.5 rounded-xl shadow-2xs flex items-center gap-1.5 max-w-md text-center">
                  <Shield className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>Layanan live konsultasi resmi terhubung aman dengan Sistem Keuangan Pesantren Amaliah.</span>
                </div>
              </div>

              {isLoadingMessages ? (
                <div className="flex justify-center py-10">
                  <RefreshCw className="w-6 h-6 text-emerald-600 animate-spin" />
                </div>
              ) : (
                messages.map((msg) => {
                  const isAdmin = msg.senderRole === 'ADMIN';
                  const timeFormatted = msg.timestamp
                    ? new Date(msg.timestamp).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '';

                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isAdmin ? 'justify-end' : 'justify-start'} w-full`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-3 px-3.5 shadow-xs relative text-xs leading-relaxed ${
                          isAdmin
                            ? 'bg-[#d9fdd3] text-slate-900 rounded-tr-xs'
                            : 'bg-white text-slate-900 rounded-tl-xs border border-slate-200/60'
                        }`}
                      >
                        {!isAdmin && (
                          <div className="text-[11px] font-bold text-emerald-800 mb-1">
                            {msg.senderName || 'Donatur'}
                          </div>
                        )}

                        <div className="whitespace-pre-wrap">{msg.content}</div>

                        <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-400">
                          <span>{timeFormatted}</span>
                          {isAdmin && (
                            <span title={msg.isRead ? 'Dibaca' : 'Terkirim'}>
                              {msg.isRead ? (
                                <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                              ) : (
                                <Check className="w-3.5 h-3.5 text-slate-400" />
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar (WhatsApp Style Bottom Bar) */}
            <div className="bg-[#f0f2f5] p-3 px-4 border-t border-slate-200 shrink-0">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2 max-w-5xl mx-auto">
                <input
                  type="text"
                  placeholder="Ketik balasan Anda untuk donatur..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 bg-white p-3 px-4 rounded-xl text-xs outline-none focus:ring-1 focus:ring-emerald-500 border border-slate-200"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim() || isSending}
                  className="w-11 h-11 rounded-xl bg-[#008069] hover:bg-[#006a57] text-white flex items-center justify-center transition-all shadow-xs cursor-pointer disabled:opacity-40"
                  title="Kirim Balasan"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-[#f0f2f5] text-slate-400 p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-200/70 flex items-center justify-center mb-3 text-slate-400">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-base text-slate-700">Layanan Live Chat Donatur</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Pilih salah satu kontak di sisi kiri untuk membalas konsultasi zakat, konfirmasi sedekah, dan pesan donatur.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
