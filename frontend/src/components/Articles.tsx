import React from 'react';
import { ArrowRight } from 'lucide-react';
import { articlesData } from '../data';

export default function Articles() {
  return (
    <section id="artikel" className="bg-slate-50 py-8 md:py-12 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6 md:mb-8">
          <div>
            <h2 className="font-semibold text-lg md:text-xl text-slate-900">
              Kabar & Edukasi Terbaru
            </h2>
          </div>
          <button className="text-maun-600 font-medium text-sm flex items-center gap-1 hover:text-maun-700 transition-colors group">
            Lihat Semua <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {articlesData.map(art => (
            <div key={art.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-sm transition-shadow cursor-pointer">
              <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                <img src={art.imgUrl} alt={art.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <div className="text-[11px] font-medium text-slate-400 mb-1.5">
                  {art.date}
                </div>
                <h3 className="font-medium text-[15px] text-slate-900 leading-snug mb-2 line-clamp-2">
                  {art.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
