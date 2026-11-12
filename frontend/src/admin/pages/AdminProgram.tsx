import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Plus,
  Filter,
  Target,
  Users,
  MoreVertical,
  ArrowLeft,
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  Calendar,
  MapPin,
  CheckCircle2,
  Save,
  Building2,
  Scale,
  ReceiptText,
  AlertCircle,
  Banknote,
  Send,
} from 'lucide-react';
import { api, ApiCampaign, ApiDisbursement, ApiDonation } from '../../services/api';
import { useAppContext } from '../../context/AppContext';

export default function AdminProgram() {
  const { campaigns, refreshData } = useAppContext();
  const [selectedProgram, setSelectedProgram] = useState<ApiCampaign | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isDisbursing, setIsDisbursing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Semua');

  // Sub-account ledger data for selected program
  const [donations, setDonations] = useState<ApiDonation[]>([]);
  const [disbursements, setDisbursements] = useState<ApiDisbursement[]>([]);
  const [isLoadingLedger, setIsLoadingLedger] = useState(false);

  // Form states for creating new program/sub-account
  const [formData, setFormData] = useState({
    title: '',
    category: 'Infaq Terikat',
    targetAmount: '',
    remainingDays: '90',
    organizer: 'Lembaga Infak MAUN Semarang',
    location: 'Kota Semarang & Jawa Tengah',
    description: '',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
    isUrgent: false,
  });

  // Form states for recording a disbursement / cash out
  const [disbData, setDisbData] = useState({
    title: '',
    amount: '',
    category: 'Penyaluran Mustahik',
    beneficiaryName: '',
    beneficiaryAccount: '',
    beneficiaryBank: 'BSI (Bank Syariah Indonesia)',
    notes: '',
    executeBankTransfer: true,
  });

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Load ledger details when a program is selected
  useEffect(() => {
    if (selectedProgram?.id) {
      setIsLoadingLedger(true);
      Promise.allSettled([
        api.donations.getByCampaign(selectedProgram.id),
        api.disbursements.getByCampaign(selectedProgram.id),
      ]).then(([donRes, disbRes]) => {
        if (donRes.status === 'fulfilled') setDonations(donRes.value);
        if (disbRes.status === 'fulfilled') setDisbursements(disbRes.value);
        setIsLoadingLedger(false);
      });
    }
  }, [selectedProgram?.id]);

  // Calculations for selected sub-account
  const totalInflow = selectedProgram?.collectedAmount || 0;
  const totalOutflow = useMemo(() => {
    return disbursements.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  }, [disbursements]);
  const remainingBalance = Math.max(0, totalInflow - totalOutflow);

  // Filtered campaigns list
  const filteredCampaigns = campaigns.filter((c) => {
    const matchCat = categoryFilter === 'Semua' || c.category === categoryFilter;
    const matchQuery =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.location && c.location.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchQuery;
  });

  // Handle Save New Program
  const handleSaveProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.targetAmount) {
      setErrorMsg('Nama Program dan Target Anggaran wajib diisi.');
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
      setIsAdding(false);
      setFormData({
        title: '',
        category: 'Infaq Terikat',
        targetAmount: '',
        remainingDays: '90',
        organizer: 'Lembaga Infak MAUN Semarang',
        location: 'Kota Semarang & Jawa Tengah',
        description: '',
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
        isUrgent: false,
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menyimpan program baru');
    } finally {
      setSaving(false);
    }
  };

  // Handle Save Disbursement / Pencairan Dana Sub-Rekening
  const handleSaveDisbursement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProgram) return;

    const amountNum = Number(disbData.amount);
    if (!disbData.title || !amountNum || amountNum <= 0) {
      setErrorMsg('Judul dan Nominal Pencairan wajib diisi dengan benar.');
      return;
    }

    if (amountNum > remainingBalance) {
      setErrorMsg(`Nominal pencairan (Rp ${amountNum.toLocaleString('id-ID')}) melebihi sisa saldo kas sub-rekening (Rp ${remainingBalance.toLocaleString('id-ID')}).`);
      return;
    }

    try {
      setSaving(true);
      setErrorMsg('');

      await api.disbursements.create({
        campaignId: selectedProgram.id,
        title: disbData.title,
        amount: amountNum,
        category: disbData.category,
        beneficiaryName: disbData.beneficiaryName || 'Penerima Manfaat / Vendor',
        beneficiaryAccount: disbData.beneficiaryAccount || '1234567890',
        beneficiaryBank: disbData.beneficiaryBank,
        notes: disbData.notes,
        executeBankTransfer: disbData.executeBankTransfer,
      });

      await refreshData();
      // Refresh local disbursements
      const updatedDisb = await api.disbursements.getByCampaign(selectedProgram.id);
      setDisbursements(updatedDisb);
      setIsDisbursing(false);
      setDisbData({
        title: '',
        amount: '',
        category: 'Penyaluran Mustahik',
        beneficiaryName: '',
        beneficiaryAccount: '',
        beneficiaryBank: 'BSI (Bank Syariah Indonesia)',
        notes: '',
        executeBankTransfer: true,
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal memproses pencairan');
    } finally {
      setSaving(false);
    }
  };

  // Screen 1: Add New Program / Sub-Rekening
  if (isAdding) {
    return (
      <div className="p-6 bg-slate-50 min-h-full">
        <button
          onClick={() => {
            setIsAdding(false);
            setErrorMsg('');
          }}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Program
        </button>

        <div className="max-w-3xl bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Buat Sub-Rekening / Tema Donasi Baru</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Setiap tema donasi otomatis memiliki sub-rekening kas terisolasi untuk transparansi donasi dan penyaluran.
                </p>
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="mx-6 mt-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSaveProgram} className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Nama Program / Tema Donasi *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Contoh: Pembangunan Sumur Bor Air Bersih Pedalaman"
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Kategori Sub-Rekening *
                </label>
                <select
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Infaq Terikat">Infaq Terikat</option>
                  <option value="Infaq Tidak Terikat">Infaq Tidak Terikat</option>
                  <option value="Zakat">Zakat Maal / Fitrah</option>
                  <option value="Wakaf Uang">Wakaf Uang</option>
                  <option value="Kemanusiaan">Bencana & Kemanusiaan</option>
                  <option value="Pendidikan">Beasiswa & Pendidikan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Target Anggaran (Rp) *
                </label>
                <input
                  type="number"
                  required
                  min="100000"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                  placeholder="Contoh: 50000000"
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Penanggung Jawab (PIC / Organizer)
                </label>
                <input
                  type="text"
                  value={formData.organizer}
                  onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                  placeholder="Nama divisi / pengurus"
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Target Waktu (Hari)
                </label>
                <input
                  type="number"
                  value={formData.remainingDays}
                  onChange={(e) => setFormData({ ...formData, remainingDays: e.target.value })}
                  placeholder="60"
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Lokasi Pelaksanaan
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Contoh: Kelurahan Gunungpati, Kota Semarang"
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                URL Gambar Banner
              </label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Deskripsi & Peruntukan Dana
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Jelaskan latar belakang, rincian pos anggaran, serta peruntukan dana penyaluran program ini..."
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              ></textarea>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isUrgentCheck"
                checked={formData.isUrgent}
                onChange={(e) => setFormData({ ...formData, isUrgent: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <label htmlFor="isUrgentCheck" className="text-xs font-semibold text-slate-700">
                Tandai sebagai Program Mendesak / Tanggap Darurat
              </label>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>
                Setelah disimpan, sistem otomatis membuatkan <b>Virtual Sub-Rekening Ledger</b> dan QRIS dinamis yang terhubung ke Bank Simulator.
              </span>
            </div>

            <div className="border-t border-slate-200 pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-4 h-4" /> {saving ? 'Menyimpan...' : 'Buka Sub-Rekening & Simpan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Screen 2: Program Detail & Sub-Rekening Ledger View
  if (selectedProgram) {
    const subRekCode = `SUB-REK-${String(selectedProgram.id).padStart(4, '0')}`;
    const progress = selectedProgram.progressPercentage || 0;

    return (
      <div className="p-6 bg-slate-50 min-h-full">
        <button
          onClick={() => {
            setSelectedProgram(null);
            setIsDisbursing(false);
            setErrorMsg('');
          }}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Program
        </button>

        {/* Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
          <div className="p-6 border-b border-slate-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-md bg-emerald-50 text-emerald-700">
                  {selectedProgram.category}
                </span>
                <span className="px-2.5 py-1 text-xs font-mono font-bold rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                  {subRekCode}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsDisbursing(true)}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <ArrowUpRight className="w-4 h-4" /> Pencairan / Penyaluran Dana
                </button>
              </div>
            </div>

            <h2 className="text-2xl font-black text-slate-900 mb-2">{selectedProgram.title}</h2>
            <p className="text-slate-600 text-xs md:text-sm leading-relaxed mb-6 max-w-3xl">
              {selectedProgram.description}
            </p>

            <div className="flex flex-wrap gap-6 text-xs text-slate-700 font-medium">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" /> <span>{selectedProgram.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-400" /> <span>{selectedProgram.donorCount} Donatur Terdaftar</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-slate-400" /> <span>PIC: {selectedProgram.organizer}</span>
              </div>
            </div>
          </div>

          {/* Sub-Rekening Cash Flow Ledger Summary */}
          <div className="p-6 bg-slate-900 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ReceiptText className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Buku Kas Sub-Rekening Program ({subRekCode})
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                Sinkronisasi Bank API Otomatis
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <div className="text-[10px] text-slate-400 font-semibold mb-1">Target Anggaran</div>
                <div className="text-base font-bold text-slate-200">
                  Rp {selectedProgram.targetAmount?.toLocaleString('id-ID')}
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold mb-1">
                  <ArrowDownLeft className="w-3 h-3" /> Uang Masuk (Donasi)
                </div>
                <div className="text-base font-bold text-emerald-400">
                  Rp {totalInflow.toLocaleString('id-ID')}
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <div className="flex items-center gap-1 text-[10px] text-rose-400 font-semibold mb-1">
                  <ArrowUpRight className="w-3 h-3" /> Uang Keluar (Penyaluran)
                </div>
                <div className="text-base font-bold text-rose-400">
                  Rp {totalOutflow.toLocaleString('id-ID')}
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-3 border border-emerald-500/30">
                <div className="flex items-center gap-1 text-[10px] text-amber-300 font-semibold mb-1">
                  <Scale className="w-3 h-3" /> Sisa Kas Sub-Rekening
                </div>
                <div className="text-base font-black text-white">
                  Rp {remainingBalance.toLocaleString('id-ID')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal / Section: Catat Penyaluran Dana */}
        {isDisbursing && (
          <div className="bg-white rounded-2xl border-2 border-rose-200 shadow-md p-6 mb-6">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Pencairan Dana Sub-Rekening</h3>
                  <p className="text-xs text-slate-500">
                    Sisa saldo kas tersedia: <b>Rp {remainingBalance.toLocaleString('id-ID')}</b>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDisbursing(false)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                Tutup
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveDisbursement} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Judul Penyaluran / Peruntukan *
                  </label>
                  <input
                    type="text"
                    required
                    value={disbData.title}
                    onChange={(e) => setDisbData({ ...disbData, title: e.target.value })}
                    placeholder="Contoh: Pembelian Bahan Bangunan Pipa & Semen Tahap 1"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Nominal Pencairan (Rp) *
                  </label>
                  <input
                    type="number"
                    required
                    max={remainingBalance}
                    value={disbData.amount}
                    onChange={(e) => setDisbData({ ...disbData, amount: e.target.value })}
                    placeholder="Contoh: 15000000"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Nama Penerima / Vendor
                  </label>
                  <input
                    type="text"
                    value={disbData.beneficiaryName}
                    onChange={(e) => setDisbData({ ...disbData, beneficiaryName: e.target.value })}
                    placeholder="Contoh: Toko Material Berkah / Mustahik"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Bank Penerima
                  </label>
                  <select
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 bg-white"
                    value={disbData.beneficiaryBank}
                    onChange={(e) => setDisbData({ ...disbData, beneficiaryBank: e.target.value })}
                  >
                    <option value="BSI (Bank Syariah Indonesia)">BSI (Bank Syariah Indonesia)</option>
                    <option value="Bank Jateng Syariah">Bank Jateng Syariah</option>
                    <option value="BCA">BCA</option>
                    <option value="BRI">BRI</option>
                    <option value="Mandiri">Mandiri</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Catatan / Keterangan Penyaluran
                </label>
                <input
                  type="text"
                  value={disbData.notes}
                  onChange={(e) => setDisbData({ ...disbData, notes: e.target.value })}
                  placeholder="Keterangan tambahan atau nomor faktur vendor..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="execBank"
                  checked={disbData.executeBankTransfer}
                  onChange={(e) => setDisbData({ ...disbData, executeBankTransfer: e.target.checked })}
                  className="w-4 h-4 text-rose-600 rounded"
                />
                <label htmlFor="execBank" className="text-xs font-bold text-slate-800">
                  Eksekusi Transfer Bank Otomatis (BI-SNAP Intrabank Transfer ke Bank Simulator)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDisbursing(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" /> {saving ? 'Memproses...' : 'Proses Pencairan'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tabel Mutasi Masuk & Keluar Sub-Rekening */}
        <h3 className="font-bold text-slate-900 mb-3 text-base flex items-center justify-between">
          <span>Riwayat Aliran Kas Sub-Rekening (Masuk & Keluar)</span>
          <span className="text-xs text-slate-500 font-normal">
            Total {donations.length} Masuk • {disbursements.length} Keluar
          </span>
        </h3>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 uppercase tracking-wider text-slate-500 font-bold">
                <th className="p-3.5">Tanggal</th>
                <th className="p-3.5">Tipe & Ref</th>
                <th className="p-3.5">Keterangan / Pihak Terkait</th>
                <th className="p-3.5 text-right">Uang Masuk (+)</th>
                <th className="p-3.5 text-right">Uang Keluar (-)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Disbursements */}
              {disbursements.map((d) => (
                <tr key={`disb-${d.id}`} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3.5 font-mono text-slate-500">
                    {new Date(d.disbursementDate || d.createdAt).toLocaleDateString('id-ID')}
                  </td>
                  <td className="p-3.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-black text-[10px] bg-rose-50 text-rose-700">
                      <ArrowUpRight className="w-3 h-3" /> KELUAR
                    </span>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">{d.disbursementNumber}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-slate-900">{d.title}</div>
                    <div className="text-[10px] text-slate-500">
                      Penerima: {d.beneficiaryName} ({d.beneficiaryBank}) • PIC: {d.approvedBy}
                    </div>
                  </td>
                  <td className="p-3.5 text-right text-slate-300">-</td>
                  <td className="p-3.5 text-right font-black text-rose-600">
                    - Rp {d.amount?.toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}

              {/* Donations */}
              {donations.map((don) => (
                <tr key={`don-${don.id}`} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3.5 font-mono text-slate-500">
                    {new Date(don.paidAt || don.createdAt).toLocaleDateString('id-ID')}
                  </td>
                  <td className="p-3.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-black text-[10px] bg-emerald-50 text-emerald-700">
                      <ArrowDownLeft className="w-3 h-3" /> MASUK
                    </span>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">{don.transactionId}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-slate-900">
                      {don.isAnonymous ? 'Hamba Allah' : don.donorName}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Metode: {don.paymentMethod} {don.doa ? `• "${don.doa}"` : ''}
                    </div>
                  </td>
                  <td className="p-3.5 text-right font-black text-emerald-700">
                    + Rp {don.amount?.toLocaleString('id-ID')}
                  </td>
                  <td className="p-3.5 text-right text-slate-300">-</td>
                </tr>
              ))}

              {donations.length === 0 && disbursements.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    Belum ada transaksi mutasi tercatat pada sub-rekening ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Screen 3: List of All Programs / Sub-Rekening
  return (
    <div className="p-6 bg-slate-50 min-h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Sub-Rekening Program & Anggaran</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola tema donasi, pantau buku kas sub-rekening, mutasi uang masuk/keluar, dan pencairan dana.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Buat Tema / Sub-Rekening Baru
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Cari program, kategori, atau lokasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['Semua', 'Infaq Terikat', 'Infaq Tidak Terikat', 'Zakat', 'Wakaf Uang', 'Kemanusiaan'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                categoryFilter === cat
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Programs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCampaigns.map((prog) => {
          const subRekCode = `SUB-REK-${String(prog.id).padStart(4, '0')}`;
          return (
            <div
              key={prog.id}
              onClick={() => setSelectedProgram(prog)}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md hover:border-emerald-400 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-emerald-50 text-emerald-700">
                    {prog.category}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    {subRekCode}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1 leading-snug group-hover:text-emerald-700 transition-colors">
                  {prog.title}
                </h3>
                <p className="text-xs text-slate-500 mb-4 line-clamp-2">{prog.description}</p>

                <div className="mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-end mb-1.5 text-xs">
                    <span className="font-semibold text-slate-500">Saldo Terkumpul</span>
                    <span className="font-bold text-emerald-700">
                      Rp {prog.collectedAmount?.toLocaleString('id-ID')}
                      <span className="text-[10px] text-slate-400 font-normal"> / Rp {prog.targetAmount?.toLocaleString('id-ID')}</span>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-600 transition-all"
                      style={{ width: `${Math.min(100, prog.progressPercentage || 0)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <Users className="w-3.5 h-3.5 text-slate-400" /> {prog.donorCount} Donatur
                </div>
                <span className="text-emerald-700 font-bold hover:underline">Buka Buku Kas &rarr;</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
