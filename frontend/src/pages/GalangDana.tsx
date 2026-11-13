import React, { useState } from 'react';
import {
  ArrowLeft,
  HeartHandshake,
  Building2,
  CheckCircle2,
  AlertCircle,
  Save,
  Sparkles,
  Info,
} from 'lucide-react';
import { api } from '../services/api';
import { useAppContext } from '../context/AppContext';

export default function GalangDanaPage({ onBack }: { onBack: () => void }) {
  const { refreshData, user } = useAppContext();
  const [isSuccess, setIsSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    category: 'Infaq Terikat',
    targetAmount: '',
    remainingDays: '60',
    location: 'Kota Semarang',
    organizer: user?.name || 'Komunitas Kebaikan amaliah',
    description: '',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
    isUrgent: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.targetAmount) {
      setErrorMsg('Nama Kampanye dan Target Dana wajib diisi.');
      return;
    }

    try {
      setSaving(true);
      setErrorMsg('');
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      await api.campaigns.create({
        title: formData.title,
        slug,
        category: formData.category,
        targetAmount: Number(formData.targetAmount),
        remainingDays: Number(formData.remainingDays) || 60,
        organizer: formData.organizer,
        location: formData.location,
        description: formData.description,
        image: formData.image,
        isUrgent: formData.isUrgent,
      });

      await refreshData();
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal membuat galang dana');
    } finally {
      setSaving(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 text-center">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Program Galang Dana Berhasil Dibuka!</h2>
        <p className="text-slate-600 text-xs md:text-sm max-w-md mb-6 leading-relaxed">
          Virtual Sub-Rekening dan QRIS dinamis untuk program <b>"{formData.title}"</b> telah siap menerima donasi dan mencatat seluruh mutasi kas secara transparan.
        </p>
        <button
          onClick={onBack}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
        >
          Lihat Daftar Program & Donasi
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 p-4 sticky top-0 z-10 flex items-center justify-between">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-50">
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </button>
        <h1 className="font-bold text-base text-slate-800">Buka Galang Dana / Sub-Rekening</h1>
        <div className="w-5"></div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-6">
        {/* Banner Info */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-5 text-white shadow-md mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-base">Inisiasi Tema Donasi Baru</h2>
              <p className="text-xs text-emerald-100">Setiap tema memiliki Sub-Rekening Bank Transparan</p>
            </div>
          </div>
          <p className="text-[11px] text-emerald-50 leading-relaxed">
            Semua dana yang masuk via QRIS otomatis tercatat ke buku kas tema ini, dan setiap pencairan dana mustahik diverifikasi dengan LPJ publik.
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Judul Program Kebaikan *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Contoh: Bantuan Sembako Yatim Piatu Kota Semarang"
                className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Kategori Donasi
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="Infaq Terikat">Infaq Terikat</option>
                  <option value="Infaq Tidak Terikat">Infaq Tidak Terikat</option>
                  <option value="Zakat">Zakat</option>
                  <option value="Wakaf Uang">Wakaf Uang</option>
                  <option value="Kemanusiaan">Kemanusiaan & Bencana</option>
                  <option value="Pendidikan">Pendidikan & Yatim</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Target Dana (Rp) *
                </label>
                <input
                  type="number"
                  required
                  min="50000"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                  placeholder="Contoh: 25000000"
                  className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Target Durasi (Hari)
                </label>
                <input
                  type="number"
                  value={formData.remainingDays}
                  onChange={(e) => setFormData({ ...formData, remainingDays: e.target.value })}
                  placeholder="60"
                  className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Lokasi Penerima Manfaat
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Kota Semarang"
                  className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Foto / Banner Program (URL)
              </label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Rincian & Cerita Program
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Ceritakan mengapa program ini membutuhkan bantuan dan bagaimana dana akan disalurkan..."
                className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
              ></textarea>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="urgentPublic"
                checked={formData.isUrgent}
                onChange={(e) => setFormData({ ...formData, isUrgent: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <label htmlFor="urgentPublic" className="text-xs font-semibold text-slate-700">
                Tandai sebagai Kasus Mendesak / Darurat
              </label>
            </div>

            <div className="pt-4 border-t border-slate-100 flex gap-3">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-[2] py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> {saving ? 'Membuka Sub-Rekening...' : 'Buka Galang Dana'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
