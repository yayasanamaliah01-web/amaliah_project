import React from 'react';
import { MapPin, Activity, Navigation, ArrowRight } from 'lucide-react';

export default function DistributionMap() {
  return (
    <section className="bg-slate-900 text-white py-16 md:py-24 border-y border-slate-800 relative overflow-hidden">
      {/* Background Map Graphic (Abstract) */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #10b981 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-500/20 border border-emerald-500/30 text-xs font-medium text-emerald-400 mb-6">
              <Activity className="w-3.5 h-3.5" /> Jejak Kebaikanmu
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold leading-tight mb-4">
              Lihat Bagaimana Donasimu<br/>Mengubah Hidup Mereka
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-md">
              Kebaikan yang kamu titipkan telah melakukan perjalanan jauh, merangkul saudara-saudara kita di pelosok nusantara yang sedang menanti secercah harapan.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <div className="text-2xl font-semibold text-white mb-1">34</div>
                <div className="text-xs text-slate-400">Provinsi Tersenyum</div>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <div className="text-2xl font-semibold text-white mb-1">1,285</div>
                <div className="text-xs text-slate-400">Titik Kebahagiaan</div>
              </div>
            </div>

            <button className="text-emerald-400 font-medium text-sm flex items-center gap-1.5 hover:text-emerald-300 transition-colors">
              Lihat Cerita Selengkapnya <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 w-full relative">
            <div className="aspect-[4/3] md:aspect-square bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden relative shadow-2xl">
              {/* Fake Map Image Placeholder */}
              <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80" alt="Peta Indonesia" className="w-full h-full object-cover opacity-40 mix-blend-luminosity grayscale" />
              
              {/* Map Pins */}
              <div className="absolute top-[30%] left-[30%] flex flex-col items-center animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="bg-emerald-500 text-white p-1.5 rounded-full shadow-lg shadow-emerald-500/50 mb-1">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="bg-slate-900 text-xs px-2 py-1 rounded shadow text-slate-200 border border-slate-700 whitespace-nowrap">Sumatera Barat (Rp 2.4M)</div>
              </div>

              <div className="absolute top-[60%] left-[55%] flex flex-col items-center animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                <div className="bg-emerald-500 text-white p-1.5 rounded-full shadow-lg shadow-emerald-500/50 mb-1">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="bg-slate-900 text-xs px-2 py-1 rounded shadow text-slate-200 border border-slate-700 whitespace-nowrap">NTT (Rp 1.8M)</div>
              </div>

              <div className="absolute top-[45%] left-[75%] flex flex-col items-center animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
                <div className="bg-emerald-500 text-white p-1.5 rounded-full shadow-lg shadow-emerald-500/50 mb-1">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="bg-slate-900 text-xs px-2 py-1 rounded shadow text-slate-200 border border-slate-700 whitespace-nowrap">Maluku (Rp 850Jt)</div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
