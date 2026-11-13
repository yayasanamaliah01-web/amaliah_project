import React from 'react';
import { ArrowLeft, Share2, Bookmark, Clock } from 'lucide-react';

export default function ArticleDetailPage({ id, onBack }: { id: string, onBack: () => void }) {
  // Using generic mock data for demonstration
  const article = {
    title: '5 Keutamaan Sedekah Subuh yang Jarang Diketahui',
    content: `
      <p class="mb-4">Sedekah subuh memiliki keistimewaan tersendiri dibanding waktu lainnya. Menurut berbagai riwayat, pada waktu subuh, malaikat turun ke bumi untuk mendoakan orang-orang yang bersedekah.</p>
      
      <h3 class="text-lg font-bold text-slate-800 mb-2 mt-6">1. Didoakan oleh Malaikat</h3>
      <p class="mb-4">Setiap pagi hari ketika hamba-hamba Allah berada di dalamnya, ada dua malaikat yang turun, salah satunya berdoa: "Ya Allah, berikanlah ganti kepada orang yang berinfak." (HR. Bukhari dan Muslim).</p>
      
      <h3 class="text-lg font-bold text-slate-800 mb-2 mt-6">2. Menolak Bala dan Penyakit</h3>
      <p class="mb-4">Sedekah dapat menutup 70 pintu keburukan. Dengan mengawali hari melalui sedekah, kita memohon perlindungan dari segala hal-hal buruk yang mungkin menimpa hari itu.</p>

      <p class="mb-4 mt-6">Oleh karena itu, marilah kita rutinkan amalan sedekah subuh ini, sekecil apapun nominalnya. Yang paling penting adalah keistiqomahan (konsistensi) kita dalam menjalankannya.</p>
    `,
    image: 'https://images.unsplash.com/photo-1593113565214-80afcb4dd16c?auto=format&fit=crop&w=1200&q=80',
    date: '20 Okt 2026',
    author: 'Tim Redaksi amaliah'
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-white border-b border-slate-100 p-4 sticky top-0 z-10 flex items-center justify-between">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-50">
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </button>
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-full hover:bg-slate-50">
            <Bookmark className="w-5 h-5 text-slate-600" />
          </button>
          <button className="p-2 rounded-full hover:bg-slate-50">
            <Share2 className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>
      
      <div className="max-w-2xl mx-auto pb-20">
        <div className="w-full aspect-video bg-slate-100">
          <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
        </div>
        
        <div className="p-5 sm:p-8">
          <div className="flex items-center gap-3 text-xs font-medium text-amaliah-600 mb-3 uppercase tracking-wider">
            <span>Inspirasi</span>
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            <span className="text-slate-500 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {article.date}</span>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 leading-tight">
            {article.title}
          </h1>
          
          <div className="flex items-center gap-3 mb-8 pb-8 border-b border-slate-100">
            <div className="w-10 h-10 rounded-full bg-amaliah-100 flex items-center justify-center text-amaliah-700 font-bold">
              M
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">{article.author}</p>
              <p className="text-xs text-slate-500">Penulis</p>
            </div>
          </div>
          
          <div 
            className="text-slate-700 text-sm md:text-base leading-relaxed"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>
      </div>
    </div>
  );
}
