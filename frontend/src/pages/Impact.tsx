import React, { useState } from 'react';
import { Search, CheckCircle2, Clock } from 'lucide-react';

const mockHistory = [
  {
    id: 'h1',
    title: 'Bantu Warga Kalimantan yang Terdampak Karhutla',
    date: '15 Sep 2026',
    nominal: 'Rp 250.000',
    status: 'Tersalurkan',
    image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'h2',
    title: 'Wujudkan Masjid Layak Pelosok Sulawesi Barat',
    date: '10 Sep 2026',
    nominal: 'Rp 500.000',
    status: 'Diproses',
    image: 'https://images.unsplash.com/photo-1564121211835-e88c852648ab?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'h3',
    title: 'Sedekah Subuh Pembangunan Panti Asuhan',
    date: '01 Sep 2026',
    nominal: 'Rp 50.000',
    status: 'Tersalurkan',
    image: 'https://images.unsplash.com/photo-1593113565214-80afcb4dd16c?auto=format&fit=crop&w=600&q=80'
  }
];

export default function ImpactPage({ onSelectImpact }: { onSelectImpact: (id: string) => void }) {
  const [filter, setFilter] = useState('Semua');
  const filters = ['Semua', 'Tersalurkan', 'Diproses'];

  const filteredHistory = filter === 'Semua' 
    ? mockHistory 
    : mockHistory.filter(item => item.status === filter);

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Header - Not overly bold */}
      <div className="bg-white border-b border-slate-100 p-4 sticky top-0 z-10 flex items-center justify-center relative">
        <h1 className="font-medium text-base sm:text-lg text-slate-700 tracking-normal">
          Riwayat Penyaluran
        </h1>
      </div>

      {/* Filter Buttons Section */}
      <div className="bg-white border-b border-slate-100 sticky top-[57px] z-10 shadow-xs">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-0.5">
            {filters.map((f) => {
              const isActive = filter === f;
              return (
                <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                    isActive 
                      ? 'bg-amaliah-600 text-white border border-amaliah-600 shadow-sm' 
                      : 'bg-transparent border border-amaliah-600 text-amaliah-600 hover:bg-amaliah-50'
                  }`}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 md:py-8">
        {/* History List */}
        <div className="flex flex-col gap-4">
          {filteredHistory.map((item) => (
            <div 
              key={item.id} 
              onClick={() => onSelectImpact(item.id)}
              className="bg-white p-4 border border-slate-200 rounded-2xl cursor-pointer group hover:border-amaliah-300 transition-colors flex gap-4 items-center"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-slate-800 text-sm md:text-base leading-tight line-clamp-2 pr-2">
                    {item.title}
                  </h3>
                </div>
                
                <div className="text-xs text-slate-500 mb-2.5 font-medium">{item.date} • {item.nominal}</div>
                
                {item.status === 'Tersalurkan' ? (
                  <div className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md text-[10px] md:text-xs font-semibold">
                    <CheckCircle2 className="w-3 h-3 md:w-3.5 md:h-3.5" />
                    Tersalurkan
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-600 rounded-md text-[10px] md:text-xs font-semibold">
                    <Clock className="w-3 h-3 md:w-3.5 md:h-3.5" />
                    Diproses
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
