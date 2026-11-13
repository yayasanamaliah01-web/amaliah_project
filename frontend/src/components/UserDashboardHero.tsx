import React, { useState, useEffect } from 'react';

const banners = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=1200&q=80",
    badge: "Program Spesial",
    title: "Raih Keberkahan dengan Sedekah Subuh",
    desc: "Awali harimu dengan kebaikan. Sedekah sekarang sebelum matahari terbit."
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
    badge: "Darurat",
    title: "Bantu Korban Kekeringan Pedalaman",
    desc: "Air bersih adalah sumber kehidupan. Salurkan bantuanmu hari ini."
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=1200&q=80",
    badge: "Amal Jariyah",
    title: "Wakaf Kelas Santri Pelosok",
    desc: "Pahala tak terputus setiap huruf yang mereka pelajari. Wakaf sekarang."
  }
];

export default function UserDashboardHero({ setActivePage }: { setActivePage: (page: string) => void }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000); // Slide otomatis setiap 5 detik
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-white pt-4 pb-1 md:pt-6 md:pb-2 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Poster / Banner in a clean card */}
        <div 
          onClick={() => setActivePage('programs')}
          className="relative w-full aspect-[2.6/1] sm:aspect-[21/9] md:aspect-[21/7] rounded-2xl overflow-hidden cursor-pointer group border border-slate-200 bg-slate-100"
        >
          {/* Slider Container */}
          <div 
            className="flex h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {banners.map((banner) => (
              <div key={banner.id} className="relative w-full h-full flex-shrink-0">
                <img 
                  src={banner.image} 
                  alt={banner.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/50 to-transparent flex flex-col justify-center p-5 md:p-10">
                  <span className="hidden md:inline-flex bg-amaliah-600 text-white text-[9px] md:text-xs font-semibold px-2 py-1 rounded-md uppercase tracking-wide self-start mb-2">
                    {banner.badge}
                  </span>
                  <h3 className="text-lg sm:text-xl md:text-3xl font-semibold text-white mb-1.5 md:mb-3 max-w-[250px] sm:max-w-[350px] md:max-w-[450px] leading-snug">
                    {banner.title}
                  </h3>
                  <p className="hidden md:block text-[11px] sm:text-xs md:text-base text-slate-200 font-medium max-w-[200px] sm:max-w-[300px] md:max-w-[400px] leading-relaxed">
                    {banner.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Dots Indicators */}
          <div className="absolute bottom-3 md:bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlide(idx);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentSlide === idx ? 'w-6 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
