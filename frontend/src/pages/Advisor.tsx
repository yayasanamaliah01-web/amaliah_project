import React from 'react';
import { Bot, Send, User, ArrowLeft } from 'lucide-react';

export default function AdvisorPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col bg-slate-50 w-full h-[100dvh]">
      {/* Header for Chat */}
      <div className="bg-white px-3 py-3 md:px-6 md:py-4 border-b border-slate-200 shadow-sm flex-shrink-0 flex items-center gap-3">
        <button onClick={onBack} className="p-2 hover:bg-slate-50 rounded-full text-slate-600">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg md:text-xl font-semibold text-slate-900">MAUN Chat</h1>
          <p className="text-[11px] md:text-xs text-slate-500 font-medium">Asisten Kebaikan Berbasis AI</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-medium text-emerald-600">Online</span>
        </div>
      </div>
      
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-5 max-w-4xl mx-auto w-full">
        <div className="flex items-start gap-3 w-full md:max-w-[85%]">
          <div className="w-8 h-8 rounded-full bg-maun-50 text-maun-600 flex items-center justify-center flex-shrink-0 mt-1">
            <Bot className="w-4 h-4 stroke-[1.5]" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="bg-white p-3.5 md:p-4 rounded-2xl rounded-tl-sm border border-slate-200 text-sm text-slate-700 leading-relaxed shadow-sm">
              Assalamu'alaikum! Saya MAUN AI Chat. Anda bisa bertanya seputar Zakat, rekomendasi sedekah, atau butuh bantuan menghitung ziswaf Anda hari ini?
            </div>
            <span className="text-[10px] text-slate-400 font-medium ml-1">10:00 AM</span>
          </div>
        </div>

        <div className="flex items-start gap-3 w-full justify-end md:max-w-[85%] ml-auto">
          <div className="flex flex-col gap-1 items-end">
            <div className="bg-slate-900 text-white p-3.5 md:p-4 rounded-2xl rounded-tr-sm text-sm leading-relaxed shadow-sm">
              Wa'alaikumsalam. Boleh minta rekomendasi program donasi untuk anak yatim?
            </div>
            <span className="text-[10px] text-slate-400 font-medium mr-1">10:02 AM</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center flex-shrink-0 mt-1">
            <User className="w-4 h-4 stroke-[1.5]" />
          </div>
        </div>

        <div className="flex items-start gap-3 w-full md:max-w-[85%]">
          <div className="w-8 h-8 rounded-full bg-maun-50 text-maun-600 flex items-center justify-center flex-shrink-0 mt-1">
            <Bot className="w-4 h-4 stroke-[1.5]" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="bg-white p-3.5 md:p-4 rounded-2xl rounded-tl-sm border border-slate-200 text-sm text-slate-700 leading-relaxed shadow-sm">
              Tentu. Saat ini ada program <strong>"Beasiswa Yatim Dhuafa"</strong> yang sangat membutuhkan bantuan. Dana akan digunakan untuk biaya sekolah dan alat tulis. Apakah Anda ingin saya arahkan ke halaman donasinya?
            </div>
            <span className="text-[10px] text-slate-400 font-medium ml-1">10:02 AM</span>
          </div>
        </div>
      </div>
      
      {/* Input Area */}
      <div className="bg-white border-t border-slate-200 p-3 md:p-5 flex-shrink-0">
        <div className="max-w-4xl mx-auto flex gap-2 relative">
          <input 
            type="text" 
            placeholder="Ketik pesan Anda..." 
            className="flex-1 p-3 pl-4 md:p-4 md:pl-5 rounded-full border border-slate-200 text-sm outline-none focus:border-maun-400 bg-slate-50 focus:bg-white transition-colors" 
          />
          <button className="bg-maun-600 text-white font-medium w-12 h-12 md:w-14 md:h-14 rounded-full hover:bg-maun-700 transition-colors flex items-center justify-center flex-shrink-0 shadow-sm">
            <Send className="w-5 h-5 stroke-[1.5] -ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
