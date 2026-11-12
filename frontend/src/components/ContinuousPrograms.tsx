import React from 'react';
import { BadgeCheck, ChevronLeft, ChevronRight } from 'lucide-react';

const continuousPrograms = [
  {
    id: 'cp1',
    title: 'Bantu Warga Kalimantan yang Terdampak Karhutla',
    campaigner: 'Ekspedisi Kebaikan',
    raised: 'Rp646.369.775',
    progress: 85,
    image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'cp2',
    title: 'Wujudkan Masjid Layak Pelosok Sulawesi Barat',
    campaigner: 'Nyala Kebaikan',
    raised: 'Rp23.367.000',
    progress: 30,
    image: 'https://images.unsplash.com/photo-1564121211835-e88c852648ab?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'cp3',
    title: 'Bantu Perempuan, Ibu & Anak Korban Gempa',
    campaigner: 'Simpul Setara',
    raised: 'Rp45.257.000',
    progress: 60,
    image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=600&q=80'
  }
];

export default function ContinuousPrograms({ onSelectProgram }: { onSelectProgram: (id: string) => void }) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth + 40 : scrollLeft + clientWidth - 40;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="py-6 md:py-8 bg-white relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-4 md:mb-5 flex justify-between items-end">
          <h2 className="text-lg md:text-xl font-bold text-slate-800">Program Donasi Berkelanjutan</h2>
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>

        <div className="relative">
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto gap-3.5 sm:gap-4 pb-3 scrollbar-hide scroll-smooth snap-x snap-mandatory"
          >
            {continuousPrograms.map((prog) => (
              <div 
                key={prog.id} 
                onClick={() => onSelectProgram('1')}
                className="flex-shrink-0 w-[240px] sm:w-[260px] md:w-[270px] rounded-2xl border border-slate-200/80 overflow-hidden cursor-pointer snap-start flex flex-col group/card hover:border-emerald-300 hover:shadow-sm transition-all bg-white"
              >
                <div className="relative h-[135px] sm:h-[145px] w-full overflow-hidden bg-slate-100">
                  <img 
                    src={prog.image} 
                    alt={prog.title} 
                    className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500" 
                  />
                </div>
                <div className="p-3.5 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="text-xs text-slate-500 font-normal">{prog.campaigner}</span>
                      <BadgeCheck className="w-3.5 h-3.5 text-blue-500 fill-blue-50" />
                    </div>
                    
                    <h3 className="font-semibold text-xs sm:text-sm text-slate-800 leading-snug mb-3 line-clamp-2 min-h-[36px] group-hover/card:text-emerald-700 transition-colors">
                      {prog.title}
                    </h3>
                  </div>
                  
                  <div className="mt-auto">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] text-slate-400 font-normal uppercase tracking-wide">
                        {prog.id === 'cp2' ? 'Tersedia' : 'Terkumpul'}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-emerald-700">{prog.raised}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full transition-all" style={{ width: `${prog.progress}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
