import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calculator,
  ArrowLeft,
  CheckCircle2,
  Info,
  Coins,
  ShieldCheck,
  Building,
  Users,
  Wallet,
  Sparkles,
  ArrowRight,
  BookOpen,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

type ZakatType = 'penghasilan' | 'maal' | 'fitrah';

// Format number to Indonesian Rupiah display
function formatRupiahInput(value: number | string): string {
  const num = typeof value === 'string' ? parseInt(value.replace(/\D/g, ''), 10) : value;
  if (isNaN(num) || num === 0) return '';
  return num.toLocaleString('id-ID');
}

function parseRupiahInput(str: string): number {
  const clean = str.replace(/\D/g, '');
  return clean ? parseInt(clean, 10) : 0;
}

export default function ZakatPage({
  onBack,
  openCheckout,
}: {
  onBack: () => void;
  openCheckout?: (progId?: string) => void;
}) {
  const navigate = useNavigate();
  const { campaigns } = useAppContext();
  const [activeTab, setActiveTab] = useState<ZakatType>('penghasilan');

  // Harga Emas per gram standar BAZNAS 2026 (Rp 1.350.000 / gram)
  const [goldPricePerGram, setGoldPricePerGram] = useState<number>(1350000);
  const [showGoldSetting, setShowGoldSetting] = useState(false);

  // Nisab Tahunan: 85 gram emas
  const annualNisab = useMemo(() => 85 * goldPricePerGram, [goldPricePerGram]);
  // Nisab Bulanan: (85 gram emas) / 12 bulan
  const monthlyNisab = useMemo(() => Math.round(annualNisab / 12), [annualNisab]);

  // ==========================================
  // 1. STATE ZAKAT PENGHASILAN / PROFESI
  // ==========================================
  const [gajiPokok, setGajiPokok] = useState<number>(12000000);
  const [tunjangan, setTunjangan] = useState<number>(3000000);
  const [pengeluaranPokok, setPengeluaranPokok] = useState<number>(4500000);

  // Perhitungan Zakat Penghasilan
  const totalPendapatanBulanan = gajiPokok + tunjangan;
  const pendapatanBersihBulanan = Math.max(0, totalPendapatanBulanan - pengeluaranPokok);
  const isPenghasilanWajib = pendapatanBersihBulanan >= monthlyNisab;
  const zakatPenghasilanBulanan = isPenghasilanWajib ? Math.round(pendapatanBersihBulanan * 0.025) : 0;
  const zakatPenghasilanTahunan = zakatPenghasilanBulanan * 12;

  // ==========================================
  // 2. STATE ZAKAT MAAL (HARTA SIMPANAN / TABUNGAN)
  // ==========================================
  const [tabunganGiro, setTabunganGiro] = useState<number>(100000000);
  const [emasPerak, setEmasPerak] = useState<number>(30000000);
  const [investasiLancar, setInvestasiLancar] = useState<number>(20000000);
  const [utangJatuhTempo, setUtangJatuhTempo] = useState<number>(10000000);

  // Perhitungan Zakat Maal
  const totalHartaMaal = tabunganGiro + emasPerak + investasiLancar;
  const hartaBersihMaal = Math.max(0, totalHartaMaal - utangJatuhTempo);
  const isMaalWajib = hartaBersihMaal >= annualNisab;
  const zakatMaalTahunan = isMaalWajib ? Math.round(hartaBersihMaal * 0.025) : 0;

  // ==========================================
  // 3. STATE ZAKAT FITRAH
  // ==========================================
  const [jumlahJiwa, setJumlahJiwa] = useState<number>(4);
  const [tarifFitrah, setTarifFitrah] = useState<number>(45000); // Standar beras 2.5kg = Rp 45.000 / jiwa
  const totalZakatFitrah = jumlahJiwa * tarifFitrah;

  // Temukan program Zakat jika tersedia di backend
  const zakatCampaign = useMemo(() => {
    return campaigns.find((c) => c.category?.toLowerCase().includes('zakat')) || campaigns[0];
  }, [campaigns]);

  const handleBayarZakat = () => {
    let nominal = 50000;
    let labelKategori = 'Zakat Penghasilan';

    if (activeTab === 'penghasilan') {
      labelKategori = 'Zakat Penghasilan';
      nominal = zakatPenghasilanBulanan > 0 ? zakatPenghasilanBulanan : 50000;
    } else if (activeTab === 'maal') {
      labelKategori = 'Zakat Maal (Harta)';
      nominal = zakatMaalTahunan > 0 ? zakatMaalTahunan : 100000;
    } else if (activeTab === 'fitrah') {
      labelKategori = `Zakat Fitrah (${jumlahJiwa} Jiwa)`;
      nominal = totalZakatFitrah > 0 ? totalZakatFitrah : 45000;
    }

    navigate('/pembayaran', {
      state: {
        campaignId: zakatCampaign?.id,
        amount: nominal,
        programTitle: `Zakat Pesantren Amaliah - ${labelKategori}`,
        zakatCategory: labelKategori,
        doa: `Niat menunaikan ${labelKategori} untuk Pesantren Amaliah fardhan lillaahi ta'ala`,
      },
    });
  };

  const resetCalculator = () => {
    if (activeTab === 'penghasilan') {
      setGajiPokok(0);
      setTunjangan(0);
      setPengeluaranPokok(0);
    } else if (activeTab === 'maal') {
      setTabunganGiro(0);
      setEmasPerak(0);
      setInvestasiLancar(0);
      setUtangJatuhTempo(0);
    } else {
      setJumlahJiwa(1);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Top Navbar */}
      <div className="bg-white border-b border-slate-200/80 px-4 py-3.5 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
            aria-label="Kembali"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-base md:text-lg text-slate-900 leading-tight">
              Kalkulator Zakat
            </h1>
            <p className="text-[11px] text-slate-500">Standar Fikih & Regulasi BAZNAS RI</p>
          </div>
        </div>

        <button
          onClick={resetCalculator}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          title="Reset input formulir"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 md:py-8 space-y-6">
        {/* Banner Nisab Emas Acuan */}
        <div className="bg-emerald-800 text-white rounded-2xl p-4 sm:p-5 shadow-sm relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-700 text-emerald-200 text-xs font-medium mb-1.5">
                <Coins className="w-3.5 h-3.5" />
                Nisab Acuan: 85 Gram Emas
              </div>
              <div className="text-xl sm:text-2xl font-bold tracking-tight">
                Rp {monthlyNisab.toLocaleString('id-ID')}{' '}
                <span className="text-sm font-normal text-emerald-200">/ bulan</span>
              </div>
              <p className="text-xs text-emerald-100 mt-0.5">
                Setara Rp {annualNisab.toLocaleString('id-ID')} per tahun (Emas Rp{' '}
                {goldPricePerGram.toLocaleString('id-ID')}/g)
              </p>
            </div>

            <button
              onClick={() => setShowGoldSetting(!showGoldSetting)}
              className="text-xs self-start sm:self-center font-medium bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-lg transition-colors border border-white/20"
            >
              {showGoldSetting ? 'Tutup Pengaturan' : 'Sesuaikan Harga Emas'}
            </button>
          </div>

          {showGoldSetting && (
            <div className="mt-4 pt-4 border-t border-white/20 relative z-10">
              <label className="text-xs text-emerald-100 block mb-1.5 font-medium">
                Harga Emas Murni Terkini (per gram):
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">Rp</span>
                <input
                  type="text"
                  value={formatRupiahInput(goldPricePerGram)}
                  onChange={(e) => setGoldPricePerGram(parseRupiahInput(e.target.value) || 1000000)}
                  className="bg-white/20 text-white font-bold text-sm px-3 py-1.5 rounded-lg border border-white/30 focus:outline-none focus:bg-white/30 w-44"
                />
                <button
                  onClick={() => setGoldPricePerGram(1350000)}
                  className="text-[11px] underline text-emerald-200 hover:text-white"
                >
                  Gunakan Default (Rp 1.350.000)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tab Selection */}
        <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-1">
          <button
            onClick={() => setActiveTab('penghasilan')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 text-center ${
              activeTab === 'penghasilan'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Zakat Penghasilan
          </button>
          <button
            onClick={() => setActiveTab('maal')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 text-center ${
              activeTab === 'maal'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Zakat Maal (Harta)
          </button>
          <button
            onClick={() => setActiveTab('fitrah')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 text-center ${
              activeTab === 'fitrah'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Zakat Fitrah
          </button>
        </div>

        {/* ============================================================== */}
        {/* FORM 1: ZAKAT PENGHASILAN */}
        {/* ============================================================== */}
        {activeTab === 'penghasilan' && (
          <div className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200/90 shadow-xs space-y-5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs sm:text-sm font-semibold text-slate-800">
                  1. Gaji Pokok per Bulan
                </label>
                <span className="text-[11px] text-slate-500">Penghasilan rutin bulanan</span>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-500 text-sm">
                  Rp
                </span>
                <input
                  type="text"
                  value={formatRupiahInput(gajiPokok)}
                  onChange={(e) => setGajiPokok(parseRupiahInput(e.target.value))}
                  placeholder="0"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 font-bold text-base text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-50 bg-slate-50/60 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs sm:text-sm font-semibold text-slate-800">
                  2. Tunjangan & Pendapatan Tambahan
                </label>
                <span className="text-[11px] text-slate-500">Bonus, insentif, freelance</span>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-500 text-sm">
                  Rp
                </span>
                <input
                  type="text"
                  value={formatRupiahInput(tunjangan)}
                  onChange={(e) => setTunjangan(parseRupiahInput(e.target.value))}
                  placeholder="0"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 font-bold text-base text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-50 bg-slate-50/60 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs sm:text-sm font-semibold text-slate-800">
                  3. Pengeluaran Kebutuhan Pokok & Utang
                </label>
                <span className="text-[11px] text-slate-500">Cicilan/utang jatuh tempo & nafkah</span>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-500 text-sm">
                  Rp
                </span>
                <input
                  type="text"
                  value={formatRupiahInput(pengeluaranPokok)}
                  onChange={(e) => setPengeluaranPokok(parseRupiahInput(e.target.value))}
                  placeholder="0"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 font-bold text-base text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-50 bg-slate-50/60 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Quick Summary Strip */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 text-xs flex items-center justify-between text-slate-600">
              <span>Pendapatan Bersih (Netto):</span>
              <span className="font-bold text-slate-900 text-sm">
                Rp {pendapatanBersihBulanan.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* FORM 2: ZAKAT MAAL */}
        {/* ============================================================== */}
        {activeTab === 'maal' && (
          <div className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200/90 shadow-xs space-y-5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs sm:text-sm font-semibold text-slate-800">
                  1. Saldo Tabungan / Giro / Deposito
                </label>
                <span className="text-[11px] text-slate-500">Simpanan yang telah tersimpan 1 thn</span>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-500 text-sm">
                  Rp
                </span>
                <input
                  type="text"
                  value={formatRupiahInput(tabunganGiro)}
                  onChange={(e) => setTabunganGiro(parseRupiahInput(e.target.value))}
                  placeholder="0"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 font-bold text-base text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-50 bg-slate-50/60 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs sm:text-sm font-semibold text-slate-800">
                  2. Nilai Emas & Logam Mulia Simpanan
                </label>
                <span className="text-[11px] text-slate-500">Emas batangan / perhiasan simpanan</span>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-500 text-sm">
                  Rp
                </span>
                <input
                  type="text"
                  value={formatRupiahInput(emasPerak)}
                  onChange={(e) => setEmasPerak(parseRupiahInput(e.target.value))}
                  placeholder="0"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 font-bold text-base text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-50 bg-slate-50/60 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs sm:text-sm font-semibold text-slate-800">
                  3. Aset Bisnis / Saham / Reksa Dana Lancar
                </label>
                <span className="text-[11px] text-slate-500">Surat berharga & aset perdagangan</span>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-500 text-sm">
                  Rp
                </span>
                <input
                  type="text"
                  value={formatRupiahInput(investasiLancar)}
                  onChange={(e) => setInvestasiLancar(parseRupiahInput(e.target.value))}
                  placeholder="0"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 font-bold text-base text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-50 bg-slate-50/60 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs sm:text-sm font-semibold text-slate-800">
                  4. Utang Jatuh Tempo (Pengurang)
                </label>
                <span className="text-[11px] text-slate-500">Utang jangka pendek yang wajib lunas</span>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-500 text-sm">
                  Rp
                </span>
                <input
                  type="text"
                  value={formatRupiahInput(utangJatuhTempo)}
                  onChange={(e) => setUtangJatuhTempo(parseRupiahInput(e.target.value))}
                  placeholder="0"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 font-bold text-base text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-50 bg-slate-50/60 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Quick Summary Strip */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 text-xs flex items-center justify-between text-slate-600">
              <span>Total Harta Bersih Terhitung:</span>
              <span className="font-bold text-slate-900 text-sm">
                Rp {hartaBersihMaal.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* FORM 3: ZAKAT FITRAH */}
        {/* ============================================================== */}
        {activeTab === 'fitrah' && (
          <div className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200/90 shadow-xs space-y-5">
            <div>
              <label className="text-xs sm:text-sm font-semibold text-slate-800 block mb-1">
                Jumlah Jiwa / Anggota Keluarga yang Ditanggung
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setJumlahJiwa((prev) => Math.max(1, prev - 1))}
                  className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-lg text-slate-700 transition-colors"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={jumlahJiwa}
                  onChange={(e) => setJumlahJiwa(Math.max(1, parseInt(e.target.value) || 1))}
                  className="flex-1 py-3 text-center rounded-xl border border-slate-200 font-bold text-lg text-slate-900 outline-none focus:border-emerald-600"
                />
                <button
                  type="button"
                  onClick={() => setJumlahJiwa((prev) => prev + 1)}
                  className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-lg text-slate-700 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs sm:text-sm font-semibold text-slate-800 block mb-2">
                Pilihan Besaran per Jiwa (Beras 2.5 kg / 3.5 Liter)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTarifFitrah(45000)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    tarifFitrah === 45000
                      ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 font-bold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 font-medium'
                  }`}
                >
                  <div className="text-xs text-slate-500">Standar BAZNAS</div>
                  <div className="text-sm sm:text-base font-bold">Rp 45.000 / jiwa</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTarifFitrah(50000)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    tarifFitrah === 50000
                      ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 font-bold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 font-medium'
                  }`}
                >
                  <div className="text-xs text-slate-500">Beras Premium</div>
                  <div className="text-sm sm:text-base font-bold">Rp 50.000 / jiwa</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* HASIL KALKULASI & ACTION CARD */}
        {/* ============================================================== */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
          {/* Status Kelayakan Syariah Banner */}
          {activeTab === 'penghasilan' && (
            <div
              className={`p-4 rounded-xl flex items-start gap-3 border ${
                isPenghasilanWajib
                  ? 'bg-emerald-50 border-emerald-200/80 text-emerald-900'
                  : 'bg-amber-50 border-amber-200/80 text-amber-900'
              }`}
            >
              {isPenghasilanWajib ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div className="text-xs sm:text-sm">
                <span className="font-bold block mb-0.5">
                  {isPenghasilanWajib
                    ? 'Wajib Menunaikan Zakat Penghasilan (2.5%)'
                    : 'Belum Mencapai Nisab Wajib Zakat'}
                </span>
                <span className="text-slate-600 leading-relaxed">
                  {isPenghasilanWajib
                    ? `Penghasilan bersih Anda (Rp ${pendapatanBersihBulanan.toLocaleString(
                        'id-ID'
                      )}) telah melampaui nisab bulanan (Rp ${monthlyNisab.toLocaleString('id-ID')}).`
                    : `Penghasilan bersih Anda belum mencapai batas nisab bulanan (Rp ${monthlyNisab.toLocaleString(
                        'id-ID'
                      )}). Anda dianjurkan menyalurkannya dalam bentuk Infaq atau Sedekah.`}
                </span>
              </div>
            </div>
          )}

          {activeTab === 'maal' && (
            <div
              className={`p-4 rounded-xl flex items-start gap-3 border ${
                isMaalWajib
                  ? 'bg-emerald-50 border-emerald-200/80 text-emerald-900'
                  : 'bg-amber-50 border-amber-200/80 text-amber-900'
              }`}
            >
              {isMaalWajib ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div className="text-xs sm:text-sm">
                <span className="font-bold block mb-0.5">
                  {isMaalWajib ? 'Wajib Menunaikan Zakat Maal (2.5%)' : 'Belum Mencapai Nisab Zakat Maal'}
                </span>
                <span className="text-slate-600 leading-relaxed">
                  {isMaalWajib
                    ? `Total harta bersih yang mencapai haul (Rp ${hartaBersihMaal.toLocaleString(
                        'id-ID'
                      )}) telah melampaui nisab tahunan 85g emas (Rp ${annualNisab.toLocaleString('id-ID')}).`
                    : `Total harta simpanan Anda belum mencapai batas nisab 85g emas (Rp ${annualNisab.toLocaleString(
                        'id-ID'
                      )}).`}
                </span>
              </div>
            </div>
          )}

          {activeTab === 'fitrah' && (
            <div className="p-4 rounded-xl flex items-start gap-3 border bg-emerald-50 border-emerald-200/80 text-emerald-900">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm">
                <span className="font-bold block mb-0.5">Kewajiban Zakat Fitrah</span>
                <span className="text-slate-600 leading-relaxed">
                  Zakat fitrah wajib ditunaikan sebelum shalat Idul Fitri bagi setiap jiwa Muslim yang
                  memiliki kelebihan makanan pada malam hari raya.
                </span>
              </div>
            </div>
          )}

          {/* Nominal Akhir */}
          <div className="pt-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              {activeTab === 'fitrah'
                ? 'Total Zakat Fitrah yang Harus Dibayar'
                : activeTab === 'penghasilan'
                ? 'Kewajiban Zakat per Bulan'
                : 'Kewajiban Zakat Maal (per Tahun)'}
            </span>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-700 tracking-tight">
                Rp{' '}
                {activeTab === 'fitrah'
                  ? totalZakatFitrah.toLocaleString('id-ID')
                  : activeTab === 'penghasilan'
                  ? zakatPenghasilanBulanan.toLocaleString('id-ID')
                  : zakatMaalTahunan.toLocaleString('id-ID')}
              </div>

              {activeTab === 'penghasilan' && isPenghasilanWajib && (
                <div className="text-xs text-slate-500 font-medium">
                  atau setara{' '}
                  <span className="font-bold text-slate-800">
                    Rp {zakatPenghasilanTahunan.toLocaleString('id-ID')}
                  </span>{' '}
                  / tahun
                </div>
              )}
            </div>

            <div className="text-[11px] text-slate-400">
              *Telah dihitung berdasarkan fatwa MUI & ketentuan nisab perbankan syariah terverifikasi.
            </div>
          </div>

          {/* Tombol Aksi Pembayaran */}
          <div className="pt-3">
            <button
              onClick={handleBayarZakat}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base py-4 rounded-xl shadow-md shadow-emerald-600/15 transition-all flex items-center justify-center gap-2 group active:scale-[0.99]"
            >
              <span>
                {activeTab === 'penghasilan' && !isPenghasilanWajib
                  ? 'Tunaikan Infaq / Sedekah Sekarang'
                  : 'Tunaikan Zakat Sekarang'}
              </span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Edukasi Syariah & Niat Zakat */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>Niat Menunaikan Zakat</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
            <p className="text-right font-serif text-lg leading-loose text-slate-800">
              نَوَيْتُ أَنْ أُخْرِجَ زَكَاةَ مَالِي فَرْضًا لِلّٰهِ تَعَالَى
            </p>
            <p className="text-xs italic text-slate-600">
              "Nawaitu an ukhrija zakaata maali fardhan lillaahi ta'aala"
            </p>
            <p className="text-xs text-slate-700">
              <strong>Artinya:</strong> "Aku niat mengeluarkan zakat hartaku, fardhu karena Allah Ta'ala."
            </p>
          </div>

          <div className="text-xs text-slate-500 leading-relaxed flex items-start gap-2 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              Dana zakat yang Anda salurkan melalui Pesantren Amaliah akan disalurkan 100%
              kepada 8 asnaf mustahik yang berhak sesuai syariat Islam dan dilaporkan secara real-time
              melalui sistem transparansi sub-rekening perbankan.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
