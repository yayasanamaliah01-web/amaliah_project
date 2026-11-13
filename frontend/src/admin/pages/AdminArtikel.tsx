import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  User,
  Image,
  Tag,
  Save,
  X,
  ExternalLink,
  Upload,
  Loader2,
} from 'lucide-react';
import { Article } from '../../types';
import { articlesData as defaultArticles } from '../../data';
import { api } from '../../services/api';

const STORAGE_KEY = 'amaliah_articles';

export default function AdminArtikel() {
  const [articles, setArticles] = useState<Article[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return defaultArticles;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewArticle, setPreviewArticle] = useState<Article | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Article>>({
    title: '',
    slug: '',
    category: 'Fiqih & Fatwa Zakat',
    author: 'Tim Redaksi Amaliah',
    date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
    readTime: '4 menit baca',
    imgUrl: 'https://images.unsplash.com/photo-1584281722573-f931d683a375?auto=format&fit=crop&q=80&w=800',
    summary: '',
    content: '',
    categoryColor: 'bg-emerald-100 text-emerald-800',
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
    } catch (err) {
      console.error('Failed to save articles to storage', err);
    }
  }, [articles]);

  const categories = [
    'Semua',
    'Fiqih & Fatwa Zakat',
    'Kisah Santri & Pesantren',
    'Infaq & Sedekah',
    'Transparansi & Program',
  ];

  const categoryColorMap: Record<string, string> = {
    'Fiqih & Fatwa Zakat': 'bg-emerald-100 text-emerald-800',
    'Kisah Santri & Pesantren': 'bg-blue-100 text-blue-800',
    'Infaq & Sedekah': 'bg-amber-100 text-amber-800',
    'Transparansi & Program': 'bg-purple-100 text-purple-800',
  };

  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const res = await api.storage.upload(file, 'articles');
      setFormData(prev => ({ ...prev, imgUrl: res.url }));
    } catch (err: any) {
      alert('Gagal mengunggah berkas ke storage: ' + (err.message || err));
    } finally {
      setIsUploading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingArticle(null);
    setFormData({
      id: 'art-' + Date.now(),
      title: '',
      slug: '',
      category: 'Fiqih & Fatwa Zakat',
      author: 'Tim Redaksi Amaliah',
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      readTime: '4 menit baca',
      imgUrl: 'https://images.unsplash.com/photo-1584281722573-f931d683a375?auto=format&fit=crop&q=80&w=800',
      summary: '',
      content: '',
      categoryColor: 'bg-emerald-100 text-emerald-800',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (art: Article) => {
    setEditingArticle(art);
    setFormData({ ...art });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus artikel ini?')) {
      const updated = articles.filter((a) => a.id !== id);
      setArticles(updated);
      showSuccess('Artikel berhasil dihapus!');
    }
  };

  const handleTitleChange = (title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug && editingArticle ? prev.slug : slug,
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.summary) {
      alert('Judul dan Ringkasan artikel wajib diisi!');
      return;
    }

    const color = categoryColorMap[formData.category || ''] || 'bg-emerald-100 text-emerald-800';

    const savedArticle: Article = {
      id: formData.id || 'art-' + Date.now(),
      title: formData.title || '',
      slug: formData.slug || 'artikel-' + Date.now(),
      category: formData.category || 'Fiqih & Fatwa Zakat',
      author: formData.author || 'Tim Redaksi Amaliah',
      date: formData.date || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      readTime: formData.readTime || '3 menit baca',
      imgUrl: formData.imgUrl || 'https://images.unsplash.com/photo-1584281722573-f931d683a375?auto=format&fit=crop&q=80&w=800',
      summary: formData.summary || '',
      content: formData.content || formData.summary || '',
      categoryColor: color,
    };

    if (editingArticle) {
      setArticles((prev) => prev.map((a) => (a.id === editingArticle.id ? savedArticle : a)));
      showSuccess('Artikel berhasil diperbarui!');
    } else {
      setArticles((prev) => [savedArticle, ...prev]);
      showSuccess('Artikel baru berhasil diterbitkan!');
    }

    setIsModalOpen(false);
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const filteredArticles = articles.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua' || a.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Manajemen Konten & Literasi</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
            Editor Artikel & Berita
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Kelola edukasi ziswaf, berita kegiatan santri, dan laporan perkembangan Pesantren Amaliah.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tulis Artikel Baru</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-emerald-800 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari judul, kata kunci, penulis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-emerald-600 bg-slate-50 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Artikel</th>
                <th className="px-4 py-3.5">Kategori</th>
                <th className="px-4 py-3.5">Penulis</th>
                <th className="px-4 py-3.5">Tanggal</th>
                <th className="px-4 py-3.5">Durasi</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    Belum ada artikel yang cocok dengan pencarian Anda.
                  </td>
                </tr>
              ) : (
                filteredArticles.map((art) => (
                  <tr key={art.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4 max-w-sm">
                      <div className="flex items-center gap-3">
                        <img
                          src={art.imgUrl}
                          alt={art.title}
                          className="w-12 h-12 rounded-lg object-cover shrink-0 bg-slate-100 border border-slate-200"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 line-clamp-1 hover:text-emerald-700">
                            {art.title}
                          </p>
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {art.summary}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${art.categoryColor}`}>
                        {art.category}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap font-medium text-slate-600">
                      {art.author}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-slate-500">
                      {art.date}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-slate-500">
                      {art.readTime}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-right space-x-1.5">
                      <button
                        onClick={() => {
                          setPreviewArticle(art);
                          setIsPreviewOpen(true);
                        }}
                        title="Preview Tampilan"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(art)}
                        title="Edit Artikel"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(art.id)}
                        title="Hapus Artikel"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL EDITOR ARTIKEL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                    {editingArticle ? 'Edit Konten Artikel' : 'Tulis Artikel & Edukasi Baru'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Isi detail konten edukasi ziswaf dan kegiatan pesantren
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Judul Artikel *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Hukum Menunaikan Fidyah bagi Ibu Hamil"
                  value={formData.title || ''}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold text-slate-800 outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Slug URL
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="hukum-menunaikan-fidyah"
                    value={formData.slug || ''}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-600 font-mono outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Kategori *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium text-slate-700 outline-none focus:border-emerald-600"
                  >
                    <option value="Fiqih & Fatwa Zakat">Fiqih & Fatwa Zakat</option>
                    <option value="Kisah Santri & Pesantren">Kisah Santri & Pesantren</option>
                    <option value="Infaq & Sedekah">Infaq & Sedekah</option>
                    <option value="Transparansi & Program">Transparansi & Program</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Penulis / Redaksi
                  </label>
                  <input
                    type="text"
                    value={formData.author || ''}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium text-slate-700 outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Estimasi Waktu Baca
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 4 menit baca"
                    value={formData.readTime || ''}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-medium text-slate-700 outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Gambar Cover / Sampul (URL atau Upload Berkas)
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="https://... atau klik Upload"
                    value={formData.imgUrl || ''}
                    onChange={(e) => setFormData({ ...formData, imgUrl: e.target.value })}
                    className="flex-1 p-2.5 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-700 outline-none focus:border-emerald-600"
                  />
                  <label className="cursor-pointer px-3 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl font-bold flex items-center justify-center gap-1.5 shrink-0 transition-colors border border-emerald-200 text-xs">
                    {isUploading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Mengunggah...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload ke Storage</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={isUploading}
                      onChange={handleFileUpload}
                    />
                  </label>
                  {formData.imgUrl && (
                    <img
                      src={formData.imgUrl}
                      alt="Thumbnail preview"
                      className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Ringkasan Artikel (Summary) *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Ringkasan 1-2 kalimat untuk kartu artikel publik..."
                  value={formData.summary || ''}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-700 outline-none focus:border-emerald-600"
                ></textarea>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Konten Lengkap Artikel
                </label>
                <textarea
                  rows={8}
                  placeholder="Tuliskan naskah lengkap artikel, dalil, kutipan, dan penjelasan di sini..."
                  value={formData.content || ''}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-slate-800 leading-relaxed outline-none focus:border-emerald-600 font-sans"
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 font-semibold hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingArticle ? 'Simpan Perubahan' : 'Terbitkan Artikel'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PREVIEW ARTIKEL */}
      {isPreviewOpen && previewArticle && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="relative h-48 bg-slate-100">
              <img
                src={previewArticle.imgUrl}
                alt={previewArticle.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="absolute top-4 right-4 p-2 bg-slate-900/60 text-white rounded-full hover:bg-slate-900 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${previewArticle.categoryColor}`}>
                {previewArticle.category}
              </span>
              <h2 className="text-xl font-bold text-slate-900 leading-snug">
                {previewArticle.title}
              </h2>
              <div className="flex items-center gap-3 text-xs text-slate-500 pb-3 border-b border-slate-100">
                <span>{previewArticle.author}</span>
                <span>•</span>
                <span>{previewArticle.date}</span>
                <span>•</span>
                <span>{previewArticle.readTime}</span>
              </div>
              <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-xl border border-slate-200">
                "{previewArticle.summary}"
              </p>
              <div className="text-xs text-slate-700 leading-relaxed space-y-3 whitespace-pre-line">
                {previewArticle.content}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

