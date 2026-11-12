import React from 'react';
import { ArrowLeft, Gift } from 'lucide-react';

export default function QurbanPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 p-4 sticky top-0 z-10 flex items-center justify-center relative">
        <button onClick={onBack} className="absolute left-4 p-2 -ml-2 rounded-full hover:bg-slate-50">
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </button>
        <h1 className="font-bold text-lg text-slate-800">Qurban</h1>
      </div>
      <div className="p-6 flex flex-col items-center justify-center text-center mt-10">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4">
          <Gift className="w-8 h-8 stroke-[1.5]" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Halaman Qurban</h2>
        <p className="text-slate-500 text-sm max-w-sm">
          Program qurban sedang dalam tahap pengembangan. Nantikan fitur ini segera!
        </p>
      </div>
    </div>
  );
}
