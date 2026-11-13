import React, { useState, useMemo } from 'react';
import { ArrowLeft, Clock, BookOpen } from 'lucide-react';
import { getStoredArticles } from '../data';

interface ArticleItem {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  image: string;
  date: string;
}

const mockArticles: ArticleItem[] = [
  {
    id: 'a1',
    title: '5 Keutamaan Sedekah Subuh yang Jarang Diketahui',
    category: 'Inspirasi',
    excerpt: 'Sedekah subuh memiliki keistimewaan tersendiri dibanding waktu lainnya. Berikut adalah penjelasannya menurut para ulama.',
    image: 'https://images.unsplash.com/photo-1593113565214-80afcb4dd16c?auto=format&fit=crop&w=600&q=80',
    date: '20 Okt 2026'
  },
  {
    id: 'a2',
    title: 'Penyaluran Bantuan Air Bersih di NTT Berjalan Lancar',
    category: 'Penyaluran',
    excerpt: 'Alhamdulillah, berkat bantuan para donatur, sebanyak 10 tangki air bersih telah didistribusikan ke 3 desa yang terdampak kekeringan ekstrim.',
    image: 'https://images.unsplash.com/photo-1564121211835-e88c852648ab?auto=format&fit=crop&w=600&q=80',
    date: '18 Okt 2026'
  },
  {
    id: 'a3',
    title: 'Mengenal Wakaf Produktif dan Manfaatnya bagi Umat',
    category: 'Wakaf',
    excerpt: 'Wakaf produktif merupakan salah satu instrumen ekonomi Islam yang potensial untuk mengentaskan kemiskinan jika dikelola dengan profesional.',
    image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=600&q=80',
    date: '15 Okt 2026'
  },
  {
    id: 'a4',
    title: 'Panduan Praktis Menghitung Nisab dan Kadar Zakat Mal',
    category: 'Zakat & Infaq',
    excerpt: 'Ketahui cara menghitung kewajiban zakat harta (mal) secara tepat sesuai kaidah fiqih kontemporer dan batasan haul.',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
    date: '12 Okt 2026'
  },
  {
    id: 'a5',
    title: 'Paket Pangan Bergizi untuk Lansia Dhuafa di Bojongsoang',
    category: 'Penyaluran',
    excerpt: 'Relawan amil lapangan menyerahkan puluhan paket sembako lengkap dan bantuan tunai langsung untuk para lansia pra-sejahtera.',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80',
    date: '08 Okt 2026'
  },
  {
    id: 'a6',
    title: 'Zakat Penghasilan: Kapan Wajib Dikeluarkan dan Berapa Tarifnya?',
    category: 'Zakat & Infaq',
    excerpt: 'Penjelasan tuntas mengenai zakat profesi atau pendapatan bulanan serta kemudahan menunaikannya melalui amil terpercaya.',
    image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80',
    date: '04 Okt 2026'
  }
];

const categories = ['Semua', 'Zakat & Infaq', 'Penyaluran', 'Wakaf', 'Inspirasi', 'Fiqih & Fatwa Zakat', 'Kisah Santri & Pesantren'];

export default function ArticlesPage({ onSelectArticle, onBack }: { onSelectArticle: (id: string) => void, onBack?: () => void }) {
  const [activeCategory, setActiveCategory] = useState<string>('Semua');

  const allArticles: ArticleItem[] = useMemo(() => {
    const stored = getStoredArticles().map((a) => ({
      id: a.id,
      title: a.title,
      category: a.category,
      excerpt: a.summary,
      image: a.imgUrl,
      date: a.date,
    }));
    // Gabungkan stored unik dengan mock
    const map = new Map<string, ArticleItem>();
    stored.forEach((item) => map.set(item.id, item));
    mockArticles.forEach((item) => {
      if (!map.has(item.id)) map.set(item.id, item);
    });
    return Array.from(map.values());
  }, []);

  const filteredArticles = activeCategory === 'Semua'
    ? allArticles
    : allArticles.filter((article) =>
        article.category.toLowerCase().includes(activeCategory.toLowerCase()) ||
        activeCategory.toLowerCase().includes(article.category.toLowerCase())
      );

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header - Not overly bold */}
      <div className="bg-white border-b border-slate-100 p-4 sticky top-0 z-10 flex items-center justify-center relative">
        {onBack && (
          <button 
            onClick={onBack} 
            className="absolute left-4 p-2 -ml-2 rounded-full hover:bg-slate-50 text-slate-700 transition-colors"
            aria-label="Kembali"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <h1 className="font-medium text-base sm:text-lg text-slate-700 tracking-normal">
          Artikel Terbaru
        </h1>
      </div>

      {/* Filter Buttons Section */}
      <div className="bg-white border-b border-slate-100 sticky top-[57px] z-10 shadow-xs">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-0.5">
            {categories.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-amaliah-600 text-white border border-amaliah-600 shadow-sm'
                      : 'bg-transparent border border-amaliah-600 text-amaliah-600 hover:bg-amaliah-50'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Articles List */}
      <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-4">
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article) => (
            <div 
              key={article.id}
              onClick={() => onSelectArticle(article.id)}
              className="bg-white p-4 rounded-2xl border border-slate-200 cursor-pointer hover:border-amaliah-300 transition-all hover:shadow-xs flex gap-4 items-center group"
            >
              <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11px] font-medium text-amaliah-700 bg-amaliah-50 border border-amaliah-100 px-2 py-0.5 rounded-full">
                    {article.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{article.date}</span>
                  </div>
                </div>
                <h2 className="font-semibold text-slate-800 text-sm md:text-base leading-snug mb-1.5 line-clamp-2 group-hover:text-amaliah-700 transition-colors">
                  {article.title}
                </h2>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center my-6">
            <div className="w-12 h-12 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-medium text-slate-700 mb-1">Belum ada artikel</h3>
            <p className="text-xs text-slate-400">Tidak ada artikel untuk kategori "{activeCategory}" saat ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}
