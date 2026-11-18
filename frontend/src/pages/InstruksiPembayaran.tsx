import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Copy,
  Check,
  Clock,
  QrCode,
  CreditCard,
  Download,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Heart,
  Share2,
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { api, ApiDonation } from '../services/api';

export default function InstruksiPembayaranPage() {
  const { transactionId } = useParams<{ transactionId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshAllData } = useAppContext();

  const [donation, setDonation] = useState<ApiDonation | null>(
    (location.state as any)?.donation || null
  );
  const [isLoading, setIsLoading] = useState(!donation);
  const [isChecking, setIsChecking] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeAccordion, setActiveAccordion] = useState<string | null>('mbanking');
  const [countdown, setCountdown] = useState<number>(24 * 3600 - 15);

  // Ambil data transaksi dari API jika dibuka langsung dari URL
  const fetchDonation = async (silent = false) => {
    if (!transactionId) return;
    if (!silent) setIsLoading(true);
    try {
      const data = await api.donations.getById(transactionId);
      if (data) {
        setDonation(data);
      }
    } catch (err: any) {
      if (!silent) setErrorMsg(err.message || 'Gagal memuat detail transaksi.');
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDonation();
  }, [transactionId]);

  // Countdown timer 24 jam
  useEffect(() => {
    if (donation?.status === 'SUCCESS') return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [donation?.status]);

  // Polling background setiap 3.5 detik untuk auto-detect status pelunasan
  useEffect(() => {
    if (!transactionId || donation?.status === 'SUCCESS') return;

    const interval = setInterval(async () => {
      try {
        const check = await api.donations.getById(transactionId);
        if (check && check.status === 'SUCCESS') {
          setDonation(check);
          await refreshAllData();
        }
      } catch (_) {}
    }, 3500);

    return () => clearInterval(interval);
  }, [transactionId, donation?.status]);

  const copyText = (text: string, fieldName: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formatTimer = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleManualCheck = async () => {
    if (!donation) return;
    setIsChecking(true);
    setErrorMsg(null);
    try {
      // 1. Coba verifikasi / simulasi bayar jika dev/sandbox
      if (donation.paymentMethod === 'QRIS') {
        try {
          await api.xendit.simulateQr(donation.transactionId, donation.amount);
        } catch (_) {}
      } else {
        try {
          await api.xendit.simulateVa(donation.transactionId, donation.amount);
        } catch (_) {}
      }

      // 2. Fetch status terbaru
      const updated = await api.donations.getById(donation.transactionId);
      if (updated) {
        setDonation(updated);
        if (updated.status === 'SUCCESS') {
          await refreshAllData();
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Pembayaran belum terdeteksi. Silakan tunggu beberapa saat.');
    } finally {
      setIsChecking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mb-3" />
        <p className="text-xs text-slate-500">Memuat rincian pembayaran...</p>
      </div>
    );
  }

  if (!donation) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 max-w-sm w-full shadow-sm">
          <h2 className="text-base font-bold text-slate-800 mb-2">Transaksi Tidak Ditemukan</h2>
          <p className="text-xs text-slate-500 mb-6">
            ID transaksi <span className="font-mono font-semibold">{transactionId}</span> tidak ditemukan atau telah kedaluwarsa.
          </p>
          <button
            onClick={() => navigate('/programs')}
            className="w-full py-3 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition-colors"
          >
            Lihat Program Donasi
          </button>
        </div>
      </div>
    );
  }

  const isSuccess = donation.status === 'SUCCESS';
  const qrImageSource =
    donation.qrCodeUrl ||
    `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
      donation.qrisString ||
        `00020101021226590014ID.LINKAJA.WWW01189360091100222047395204581253033605802ID5916PESANTREN+AMALIAH6008SEMARANG61055013162230119${donation.transactionId.replace(/[^a-zA-Z0-9]/g, '')}6304C350`
    )}`;

  const vaNumber =
    donation.vaNumber ||
    (donation.donorPhone ? `9901${donation.donorPhone.replace(/\D/g, '').slice(-8)}` : '99017711223344');

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans">
      {/* Sticky Header: Tombol back di pojok kiri, Judul di tengah */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 h-14 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-1 rounded-full hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer active:scale-95"
          title="Kembali"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-sm sm:text-base font-bold text-slate-800 text-center">
          Instruksi Pembayaran
        </h1>
        <div className="w-9" /> {/* Spacer penyeimbang tombol back agar judul tetap tepat di tengah */}
      </header>

      <main className="flex-1 max-w-lg w-full mx-auto px-4 py-5 space-y-4">
        {/* ============================================================== */}
        {/* KONDISI 1: SUKSES (Tanda Terima Kuitansi Donasi Digital) */}
        {/* ============================================================== */}
        {isSuccess ? (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100 shadow-xs">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="inline-block text-[10px] font-bold tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase mb-2">
                Terverifikasi Lunas
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Alhamdulillah, Donasi Diterima
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Jazakumullah Khairan Katsiran atas kebaikan dan kepedulian Anda.
              </p>
            </div>

            {/* Rincian Kuitansi */}
            <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/70 text-left space-y-2.5 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-2.5">
                <span className="text-slate-500 font-medium">Nominal Donasi</span>
                <span className="text-base font-semibold text-emerald-700">
                  Rp {donation.amount.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">No. Transaksi</span>
                <span className="font-mono font-semibold text-slate-800">{donation.transactionId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Program</span>
                <span className="font-medium text-slate-800 text-right truncate max-w-[200px]">
                  {donation.campaignTitle || 'Operasional Santri Amaliah'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Nama Donatur</span>
                <span className="font-semibold text-slate-800">
                  {donation.isAnonymous ? 'Hamba Allah' : donation.donorName}
                </span>
              </div>
              {donation.doa && (
                <div className="pt-2 border-t border-slate-200/60">
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1">Niat & Doa:</span>
                  <p className="text-xs italic text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200/70 leading-relaxed">
                    "{donation.doa}"
                  </p>
                </div>
              )}
            </div>

            <div className="pt-2 space-y-2.5">
              <button
                onClick={() => navigate('/programs')}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm cursor-pointer"
              >
                Lihat Program Penyaluran Lainnya
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
              >
                Kembali ke Beranda Utama
              </button>
            </div>
          </div>
        ) : (
          /* ============================================================== */
          /* KONDISI 2: MENUNGGU PEMBAYARAN (Clean Invoice & Payment Box)    */
          /* ============================================================== */
          <div className="space-y-3.5">
            {/* Status Timer Strip */}
            <div className="bg-amber-50/90 border border-amber-200/80 rounded-2xl p-3 sm:p-4 text-amber-900 flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-600 animate-pulse shrink-0" />
                <span className="text-xs font-medium">Selesaikan Pembayaran dalam</span>
              </div>
              <span className="font-mono text-xs sm:text-sm font-bold bg-white text-amber-900 px-2.5 py-1 rounded-lg border border-amber-200 shadow-2xs">
                {formatTimer(countdown)}
              </span>
            </div>

            {/* Total Pembayaran Card */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide block">
                    Total Tagihan
                  </span>
                  <span className="text-xl sm:text-2xl font-semibold text-slate-800 tracking-tight block mt-0.5">
                    Rp {donation.amount.toLocaleString('id-ID')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => copyText(String(donation.amount), 'amount')}
                  className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xl border border-emerald-200/70 transition-colors cursor-pointer"
                >
                  {copiedField === 'amount' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin</span>
                    </>
                  )}
                </button>
              </div>

              {/* Rincian Transaksi */}
              <div className="text-xs space-y-2 py-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">ID Transaksi</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-semibold text-slate-800">{donation.transactionId}</span>
                    <button
                      onClick={() => copyText(donation.transactionId, 'id')}
                      className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                      title="Salin ID"
                    >
                      {copiedField === 'id' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Program</span>
                  <span className="font-medium text-slate-800 text-right truncate max-w-[210px]">
                    {donation.campaignTitle || 'Infaq & Sedekah Pesantren'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Nama Donatur</span>
                  <span className="font-semibold text-slate-800">
                    {donation.isAnonymous ? 'Hamba Allah' : donation.donorName}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Metode</span>
                  <span className="font-semibold text-slate-800">
                    {donation.paymentMethod === 'QRIS'
                      ? 'QRIS Standar Nasional'
                      : 'BSI Virtual Account'}
                  </span>
                </div>
              </div>

              {/* KONTEN METODE: QRIS */}
              {donation.paymentMethod === 'QRIS' && (
                <div className="pt-3 border-t border-slate-100 flex flex-col items-center text-center">
                  <div className="w-full max-w-[280px] bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs mb-3">
                    <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-100">
                      <span className="text-[10px] font-bold text-slate-700">QRIS STANDAR NASIONAL</span>
                      <span className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-semibold">
                        Semua Bank & e-Wallet
                      </span>
                    </div>

                    <img
                      src={qrImageSource}
                      alt="QRIS Code Pembayaran"
                      className="w-full aspect-square object-contain rounded-lg border border-slate-100"
                    />

                    <div className="mt-2 text-[10px] text-slate-500 font-medium">
                      YAYASAN AMALIAH SEMARANG
                    </div>
                  </div>

                  <a
                    href={qrImageSource}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50/80 hover:bg-emerald-100 px-4 py-2 rounded-xl border border-emerald-200/60 transition-colors mb-4"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Simpan / Unduh QR Code</span>
                  </a>

                  {/* 4 Langkah Scan QRIS */}
                  <div className="w-full bg-slate-50/80 rounded-2xl p-4 border border-slate-200/70 text-left">
                    <span className="text-xs font-bold text-slate-800 block mb-2">
                      Cara Pembayaran QRIS:
                    </span>
                    <ol className="text-[11px] text-slate-600 space-y-1.5 list-decimal list-inside leading-relaxed">
                      <li>Buka aplikasi m-Banking (BSI, BCA, Mandiri, BRI) atau e-Wallet (ShopeePay, GoPay, OVO, DANA).</li>
                      <li>Pilih menu <strong>Scan / Bayar QRIS</strong>.</li>
                      <li>Scan QR di atas atau pilih gambar dari galeri HP Anda.</li>
                      <li>Periksa nominal <strong>Rp {donation.amount.toLocaleString('id-ID')}</strong> dan konfirmasi dengan PIN.</li>
                    </ol>
                  </div>
                </div>
              )}

              {/* KONTEN METODE: VIRTUAL ACCOUNT */}
              {donation.paymentMethod !== 'QRIS' && (
                <div className="pt-3 border-t border-slate-100 space-y-3.5">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                    <span className="text-[11px] font-medium text-slate-500 block mb-1">
                      Nomor Virtual Account BSI
                    </span>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xl sm:text-2xl font-bold text-slate-900 tracking-wider">
                        {vaNumber}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyText(vaNumber, 'va')}
                        className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-white hover:bg-emerald-50 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors cursor-pointer"
                      >
                        {copiedField === 'va' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedField === 'va' ? 'Tersalin' : 'Salin'}</span>
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-1">
                      Atas Nama: Yayasan Amaliah Infaq
                    </span>
                  </div>

                  {/* Petunjuk Transfer Accordion */}
                  <div className="space-y-2 text-xs">
                    <span className="font-bold text-slate-800 block">Petunjuk Pembayaran:</span>

                    {/* Accordion m-Banking */}
                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setActiveAccordion(activeAccordion === 'mbanking' ? null : 'mbanking')}
                        className="w-full p-3 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left font-semibold text-slate-700"
                      >
                        <span>BSI Mobile</span>
                        {activeAccordion === 'mbanking' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      {activeAccordion === 'mbanking' && (
                        <ol className="p-3 bg-white text-[11px] text-slate-600 space-y-1 list-decimal list-inside leading-relaxed border-t border-slate-100">
                          <li>Buka aplikasi BSI Mobile &gt; pilih menu <strong>Bayar</strong>.</li>
                          <li>Pilih institusi / masukkan kode VA <strong>{vaNumber}</strong>.</li>
                          <li>Pastikan nominal <strong>Rp {donation.amount.toLocaleString('id-ID')}</strong> sesuai.</li>
                          <li>Masukkan PIN transaksi Anda untuk menyelesaikan.</li>
                        </ol>
                      )}
                    </div>

                    {/* Accordion ATM / Bank Lain */}
                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setActiveAccordion(activeAccordion === 'atm' ? null : 'atm')}
                        className="w-full p-3 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left font-semibold text-slate-700"
                      >
                        <span>Transfer Antar Bank (ATM / m-Banking Lain)</span>
                        {activeAccordion === 'atm' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      {activeAccordion === 'atm' && (
                        <ol className="p-3 bg-white text-[11px] text-slate-600 space-y-1 list-decimal list-inside leading-relaxed border-t border-slate-100">
                          <li>Pilih menu <strong>Transfer Antar Bank</strong>.</li>
                          <li>Masukkan kode Bank BSI (<strong>451</strong>) + nomor VA <strong>{vaNumber}</strong>.</li>
                          <li>Masukkan nominal transfer tepat sejumlah <strong>Rp {donation.amount.toLocaleString('id-ID')}</strong>.</li>
                          <li>Konfirmasi detail dan selesaikan transaksi.</li>
                        </ol>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
                {errorMsg}
              </div>
            )}

            {/* CTA Utama: Saya Sudah Bayar / Cek Status */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleManualCheck}
                disabled={isChecking}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isChecking ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Mengecek Pembayaran...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Saya Sudah Bayar / Cek Status Pembayaran</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Sistem memantau pembayaran otomatis secara real-time</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
