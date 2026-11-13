import React, { useState } from 'react';
import { BadgeCheck, Heart } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { programsData } from '../data';

export default function Programs({ onSelectProgram }: { onSelectProgram: (id: string) => void }) {
  const { campaigns } = useAppContext();
  const [filter, setFilter] = useState('all');
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Use live campaigns if available from backend
  const displayCampaigns =
    campaigns.length > 0
      ? campaigns.map((c) => ({
          id: String(c.id),
          title: c.title,
          category: c.category.toLowerCase(),
          categoryLabel: c.category,
          image: c.image,
          raisedAmount: `Rp ${c.collectedAmount?.toLocaleString('id-ID')}`,
          targetAmount: `Rp ${c.targetAmount?.toLocaleString('id-ID')}`,
          raisedPercentage: c.progressPercentage || 0,
          daysLeft: c.remainingDays,
        }))
      : programsData;

  const filteredPrograms =
    filter === 'all'
      ? displayCampaigns
      : displayCampaigns.filter((p) => p.category.includes(filter.toLowerCase()));

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section id="programs" className="bg-white py-6 md:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-5 md:mb-8 flex flex-col md:flex-row md:items-end justify-between gap-3.5">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-1">Pilih Program Kebaikan</h2>
            <p className="text-xs text-slate-500 font-normal">Mulai langkah kebaikanmu hari ini secara transparan.</p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1.5 md:pb-0 scrollbar-hide">
            <button
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${
                filter === 'all'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilter('dapur')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${
                filter === 'dapur'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Dapur & Beras Santri
            </button>
            <button
              onClick={() => setFilter('guru')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${
                filter === 'guru'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Bisyarah Guru & Ustadz
            </button>
            <button
              onClick={() => setFilter('sarana')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${
                filter === 'sarana'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Listrik, Air & Sarana
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3.5">
          {filteredPrograms.map((prog) => (
            <div
              key={prog.id}
              className="p-3.5 md:p-4 border border-slate-200/80 rounded-2xl cursor-pointer flex gap-3.5 md:gap-4 group hover:border-emerald-300 hover:shadow-sm transition-all bg-white items-center"
              onClick={() => onSelectProgram(prog.id)}
            >
              <div className="w-22 h-22 sm:w-26 sm:h-26 md:w-32 md:h-32 shrink-0 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center relative">
                {!imageErrors[prog.id] ? (
                  <img
                    src={prog.image}
                    alt={prog.title}
                    onError={() => handleImageError(prog.id)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <Heart className="w-7 h-7 text-slate-300 stroke-[1.5]" />
                )}
              </div>
              <div className="flex flex-col flex-1 justify-center py-0.5 min-w-0">
                <h3 className="font-semibold text-xs sm:text-sm md:text-base text-slate-800 leading-snug line-clamp-2 mb-1.5 group-hover:text-emerald-700 transition-colors">
                  {prog.title}
                </h3>

                <div className="flex items-center gap-1.5 mb-2.5 text-[10px] md:text-xs text-slate-500 font-normal">
                  <span>amaliah Verified</span>
                  <BadgeCheck className="w-3.5 h-3.5 text-emerald-600 fill-emerald-50" />
                </div>

                <div className="mt-auto">
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-1.5">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, prog.raisedPercentage)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-[9px] text-slate-400 mb-0.5 font-medium uppercase tracking-wide">Terkumpul</div>
                      <div className="text-xs md:text-sm font-semibold text-emerald-700">{prog.raisedAmount}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[9px] text-slate-400 mb-0.5 font-medium uppercase tracking-wide">Sisa hari</div>
                      <div className="text-xs md:text-sm font-medium text-slate-700">{prog.daysLeft}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
