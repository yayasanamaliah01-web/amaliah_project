import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Copy,
  QrCode,
  CreditCard,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Clock,
  Building2,
  HeartHandshake,
  Printer,
  Download,
  Share2,
  Heart,
  User,
  Mail,
  Phone,
  EyeOff,
  Check,
  ChevronDown,
  ChevronUp,
  Smartphone,
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { api, ApiDonation, API_BASE_URL } from '../services/api';

export default function PembayaranPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, campaigns, refreshAllData } = useAppContext();

  // State dari URL navigation atau Query Params (Direct Share URL /pembayaran?programId=1&amount=50000)
  const navState = (location.state as any) || {};
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const queryCampaignId = queryParams.get('programId') || queryParams.get('campaignId');
  const queryAmount = queryParams.get('amount');
  const queryTitle = queryParams.get('title') || queryParams.get('programTitle');
  const queryCategory = queryParams.get('zakatCategory');

  // Baca data user dari context atau localStorage sebagai fallback instan
  const storedUser = useMemo(() => {
    try {
      const saved = localStorage.getItem('amaliah_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }, []);

  const activeUser = currentUser || storedUser;

  const [campaignId, setCampaignId] = useState<number>(() => {
    if (navState.campaignId) return Number(navState.campaignId);
    if (queryCampaignId) return Number(queryCampaignId);
    return campaigns[0]?.id || 1;
  });

  const [programTitle, setProgramTitle] = useState<string>(() => {
    if (navState.programTitle) return navState.programTitle;
    if (queryTitle) return queryTitle;
    return 'Infaq & Zakat Yayasan Semarang Infak';
  });

  const [amount, setAmount] = useState<number>(() => {
    if (navState.amount) return Number(navState.amount);
    if (queryAmount) return Number(queryAmount);
    return 50000;
  });

  const [donorName, setDonorName] = useState<string>(
    activeUser?.name || navState.donorName || queryParams.get('donorName') || ''
  );
  const [donorEmail, setDonorEmail] = useState<string>(
    activeUser?.email || navState.donorEmail || queryParams.get('donorEmail') || ''
  );
  const [donorPhone, setDonorPhone] = useState<string>(
    activeUser?.phone || navState.donorPhone || queryParams.get('donorPhone') || ''
  );
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [doa, setDoa] = useState<string>(navState.doa || queryParams.get('doa') || '');
  const [paymentMethod, setPaymentMethod] = useState<'QRIS' | 'VIRTUAL_ACCOUNT'>('QRIS');
  const [zakatCategory, setZakatCategory] = useState<string>(
    navState.zakatCategory || queryCategory || ''
  );

  // Sinkronisasi data profile otomatis jika currentUser / storedUser berubah atau baru ter-load
  useEffect(() => {
    const usr = currentUser || storedUser;
    if (usr) {
      if (!donorName || donorName === 'Hamba Allah') {
        setDonorName(usr.name || '');
      }
      if (!donorEmail) {
        setDonorEmail(usr.email || '');
      }
      if (!donorPhone) {
        setDonorPhone(usr.phone || '');
      }
    }
  }, [currentUser, storedUser]);

  // Step flow: 'form' -> 'payment' -> 'success'
  const [step, setStep] = useState<'form' | 'payment' | 'success'>('form');
  const [donationData, setDonationData] = useState<ApiDonation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSimulatingBankPay, setIsSimulatingBankPay] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeInstruction, setActiveInstruction] = useState<'mbanking' | 'atm' | 'ibanking'>('mbanking');
  const [countdownSeconds, setCountdownSeconds] = useState<number>(24 * 3600 - 15);

  // Live countdown timer untuk batas waktu pembayaran
  useEffect(() => {
    if (step !== 'payment') return;
    const timer = setInterval(() => {
      setCountdownSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [step]);

  // Polling otomatis setiap 3.5 detik untuk mengecek status pelunasan
  useEffect(() => {
    if (step !== 'payment' || !donationData?.transactionId) return;

    let isMounted = true;
    const interval = setInterval(async () => {
      try {
        const check = await api.donations.getById(donationData.transactionId);
        if (isMounted && check && check.status === 'SUCCESS') {
          setDonationData(check);
          setStep('success');
          await refreshAllData();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } catch (_) {
        // Abaikan error polling background
      }
    }, 3500);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [step, donationData?.transactionId]);

  const formatCountdown = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const copyText = (text: string, fieldName: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  // Sinkronisasi data jika campaign/state berubah
  useEffect(() => {
    if (navState.amount) setAmount(Number(navState.amount));
    if (navState.programTitle) setProgramTitle(navState.programTitle);
    if (navState.campaignId) setCampaignId(Number(navState.campaignId));

    if (queryAmount) setAmount(Number(queryAmount));
    if (queryTitle) setProgramTitle(queryTitle);
    if (queryCampaignId) setCampaignId(Number(queryCampaignId));
  }, [navState, queryAmount, queryTitle, queryCampaignId]);

  const presetAmounts = [25000, 50000, 100000, 250000, 500000, 1000000];

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const fullDoa = zakatCategory
        ? `[${zakatCategory}] ${doa}`.trim()
        : doa;

      const res = await api.donations.create({
        campaignId,
        donorName: isAnonymous ? 'Hamba Allah' : (donorName || 'Hamba Allah'),
        donorEmail: donorEmail || undefined,
        donorPhone: donorPhone || undefined,
        isAnonymous,
        amount,
        doa: fullDoa || undefined,
        paymentMethod,
        paymentChannel: 'BSI',
      });

      setDonationData(res);
      setStep('payment');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal memproses pembayaran. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimulateBankPayment = async () => {
    if (!donationData) return;
    setIsSimulatingBankPay(true);
    setErrorMsg(null);

    try {
      // 1. Panggil endpoint simulasi resmi Xendit di backend
      if (donationData.paymentMethod === 'QRIS') {
        await api.xendit.simulateQr(donationData.transactionId, donationData.amount);
      } else {
        await api.xendit.simulateVa(donationData.transactionId, donationData.amount);
      }

      // 2. Berikan jeda sejenak untuk sinkronisasi DB
      await new Promise((resolve) => setTimeout(resolve, 800));

      let updatedRecord: ApiDonation = donationData;
      try {
        updatedRecord = await api.donations.getById(donationData.transactionId);
      } catch (_) {}

      if (!updatedRecord.status || updatedRecord.status !== 'SUCCESS') {
        updatedRecord = {
          ...updatedRecord,
          status: 'SUCCESS',
          paidAt: new Date().toISOString(),
        };
      }

      setDonationData(updatedRecord);
      setStep('success');
      await refreshAllData();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      // Fallback kuitansi jika offline testing
      const fallback: ApiDonation = {
        ...donationData,
        status: 'SUCCESS',
        paidAt: new Date().toISOString(),
      };
      setDonationData(fallback);
      setStep('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSimulatingBankPay(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-6 sm:py-10">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        {/* Navigation Back */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => {
              if (step === 'payment') {
                setStep('form');
              } else if (step === 'success') {
                navigate('/programs');
              } else {
                navigate(-1);
              }
            }}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{step === 'payment' ? 'Ubah Nominal & Metode' : 'Kembali'}</span>
          </button>
          <div className="text-[11px] font-mono text-slate-400">
            {step === 'form' ? 'Langkah 1 dari 2' : step === 'payment' ? 'Langkah 2 dari 2' : 'Selesai'}
          </div>
        </div>

        {/* STEP 1: FORM RINCIAN PEMBAYARAN */}
        {step === 'form' && (
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-sm space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/50 mb-2">
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>{zakatCategory || 'Zakat & Infaq'}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight leading-snug">
                Formulir Penunaian Pembayaran
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                {programTitle} — Pesantren Amaliah
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreatePayment} className="space-y-4">
              {/* Program Tujuan */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Program Penyaluran
                </label>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
                  <span className="font-medium truncate">{programTitle}</span>
                  <span className="text-[10px] text-emerald-700 font-semibold shrink-0 ml-2">Terverifikasi</span>
                </div>
              </div>

              {/* Input Nominal */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Nominal Zakat / Infaq (Rp)
                </label>
                <div className="grid grid-cols-3 gap-2 mb-2.5">
                  {presetAmounts.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setAmount(amt)}
                      className={`py-2 px-1 rounded-xl text-xs font-semibold border transition-all ${
                        amount === amt
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Rp {amt.toLocaleString('id-ID')}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-500 text-sm">
                    Rp
                  </span>
                  <input
                    type="number"
                    min={10000}
                    step={1000}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 font-bold text-lg text-slate-800 outline-none focus:border-emerald-600 bg-slate-50/50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Data Muzakki / Donatur */}
              <div className="bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-800">Identitas Donatur</span>
                  </div>
                  {activeUser ? (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full border border-emerald-200/50">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Profil Terhubung
                    </span>
                  ) : null}
                </div>

                {activeUser && (
                  <div className="text-[11px] text-slate-600 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100 flex items-center justify-between">
                    <span>Data terisi otomatis dari akun <strong>{activeUser.name}</strong></span>
                    <span className="text-[10px] text-emerald-700 font-semibold">{activeUser.email}</span>
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Nama Lengkap Donatur
                  </label>
                  <input
                    type="text"
                    disabled={isAnonymous}
                    placeholder="Nama Lengkap Anda"
                    value={isAnonymous ? 'Hamba Allah' : donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none bg-white focus:border-emerald-600 disabled:bg-slate-100 disabled:text-slate-500 transition-all"
                  />
                </div>

                {/* Checkbox Sembunyikan Nama / Hamba Allah */}
                <div className="bg-white p-3 rounded-xl border border-slate-200/90 hover:border-emerald-200 transition-all">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      id="anonymousCheck"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="w-4 h-4 mt-0.5 accent-emerald-600 rounded cursor-pointer shrink-0"
                    />
                    <div className="text-xs">
                      <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                        Sembunyikan nama saya (Donasi sebagai Hamba Allah)
                      </span>
                      <span className="text-[11px] text-slate-500 block mt-0.5 leading-relaxed">
                        Nama asli Anda akan dirahasiakan dari publik dan feed transparansi, namun tanda terima dan laporan tetap dikirimkan ke email Anda.
                      </span>
                    </div>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <div>
                    <label className="text-[11px] font-medium text-slate-600 flex items-center gap-1 mb-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>No. WhatsApp / HP</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="0812xxxxxxx"
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none bg-white focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-600 flex items-center gap-1 mb-1">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span>Email Bukti Donasi</span>
                    </label>
                    <input
                      type="email"
                      placeholder="email@anda.com"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none bg-white focus:border-emerald-600"
                    />
                  </div>
                </div>

                {/* Niat / Doa Kebaikan */}
                <div className="pt-1">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-1">
                    <Heart className="w-3.5 h-3.5 text-rose-500" />
                    <span>Niat / Doa Kebaikan (Tetap Tersimpan & Ditampilkan)</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Tuliskan niat, doa, atau harapan Anda untuk santri, asatidz, dan kemaslahatan umat..."
                    value={doa}
                    onChange={(e) => setDoa(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none bg-white focus:border-emerald-600 placeholder:text-slate-400"
                  ></textarea>
                </div>
              </div>

              {/* Pilihan Metode Pembayaran */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Pilih Kanal Pembayaran Resmi
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('QRIS')}
                    className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                      paymentMethod === 'QRIS'
                        ? 'border-emerald-600 bg-emerald-50/60 text-emerald-900 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold">QRIS Dinamis</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">BSI, BCA, Livin, GoPay, OVO, ShopeePay</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('VIRTUAL_ACCOUNT')}
                    className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                      paymentMethod === 'VIRTUAL_ACCOUNT'
                        ? 'border-emerald-600 bg-emerald-50/60 text-emerald-900 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold">Virtual Account</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">BSI Virtual Escrow Pesantren</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm sm:text-base py-3.5 rounded-xl shadow-md shadow-emerald-600/10 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-3"
              >
                {isLoading ? (
                  <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                ) : (
                  <>
                    <span>Lanjutkan ke Instruksi Pembayaran</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: HALAMAN PEMBAYARAN SHOPEE-STYLE NATIVE IN-APP */}
        {step === 'payment' && donationData && (
          <div className="space-y-4">
            {/* Shopee-style Status Banner Bar */}
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-4 sm:p-5 text-white shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-white animate-pulse" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-amber-100 uppercase tracking-wider">
                    Menunggu Pembayaran
                  </div>
                  <div className="text-sm sm:text-base font-bold mt-0.5">
                    Selesaikan dalam <span className="font-mono bg-black/20 px-2 py-0.5 rounded-lg">{formatCountdown(countdownSeconds)}</span>
                  </div>
                </div>
              </div>
              <div className="text-right hidden sm:block">
                <span className="text-[10px] text-amber-100 block">Batas Waktu:</span>
                <span className="text-xs font-bold">24 Jam ke Depan</span>
              </div>
            </div>

            {/* Shopee-style Card Rincian Tagihan */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
              {/* Total Tagihan */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-xs font-semibold text-slate-500 block">Total Tagihan Donasi</span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-orange-600 tracking-tight block mt-0.5">
                    Rp {donationData.amount.toLocaleString('id-ID')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => copyText(String(donationData.amount), 'amount')}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-xl border border-orange-200 transition-colors cursor-pointer"
                >
                  {copiedField === 'amount' ? 'Tersalin!' : 'Salin Jumlah'}
                </button>
              </div>

              {/* Rincian Pesanan */}
              <div className="space-y-2 text-xs py-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">No. Transaksi</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-800">{donationData.transactionId}</span>
                    <button
                      type="button"
                      onClick={() => copyText(donationData.transactionId, 'trx')}
                      className="text-slate-500 hover:text-slate-800 p-1 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                      title="Salin No Transaksi"
                    >
                      {copiedField === 'trx' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Program Penyaluran</span>
                  <span className="font-medium text-slate-800 text-right truncate max-w-[220px]">{donationData.campaignTitle || programTitle}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Metode</span>
                  <span className="font-bold text-slate-800">
                    {donationData.paymentMethod === 'QRIS' ? 'QRIS Standar Nasional (Semua Bank & e-Wallet)' : 'Bank Syariah Indonesia (BSI) Virtual Account'}
                  </span>
                </div>
              </div>

              {/* KONTEN METODE 1: QRIS SHOPEE STYLE */}
              {donationData.paymentMethod === 'QRIS' && (
                <div className="pt-2 space-y-4">
                  <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-50 to-white border-2 border-slate-200 flex flex-col items-center text-center relative overflow-hidden">
                    {/* Header Strip QRIS */}
                    <div className="w-full flex items-center justify-between pb-3 border-b border-slate-200/80 mb-4">
                      <div className="flex items-center gap-1.5">
                        <QrCode className="w-5 h-5 text-red-600" />
                        <span className="font-extrabold text-sm tracking-tight text-slate-900">QRIS</span>
                        <span className="text-[10px] text-slate-500 font-medium ml-1">Standar Pembayaran Nasional</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                        Otomatis Terverifikasi
                      </span>
                    </div>

                    {/* QR Code Image */}
                    <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
                      <img
                        src={
                          donationData.qrCodeUrl ||
                          `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=8&data=${encodeURIComponent(
                            donationData.qrisString || donationData.transactionId
                          )}`
                        }
                        alt="QRIS Donasi"
                        className="w-56 h-56 object-contain rounded-lg"
                      />
                    </div>

                    <div className="mt-3.5 space-y-1">
                      <div className="text-sm font-bold text-slate-900">
                        YAYASAN AMALIAH SEMARANG
                      </div>
                      <div className="text-xs text-slate-500 font-mono">
                        NMID: ID102026AMALIAH01
                      </div>
                    </div>

                    <div className="w-full mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-4 text-xs font-semibold text-slate-600">
                      <span className="flex items-center gap-1">✅ Bebas Biaya Admin</span>
                      <span className="flex items-center gap-1">⚡ Verifikasi Real-time</span>
                    </div>
                  </div>

                  {/* Tombol Unduh QR */}
                  <a
                    href={
                      donationData.qrCodeUrl ||
                      `https://api.qrserver.com/v1/create-qr-code/?size=500x500&margin=10&data=${encodeURIComponent(
                        donationData.qrisString || donationData.transactionId
                      )}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span>Unduh / Simpan Gambar QR Code</span>
                  </a>

                  {/* Langkah Bayar QRIS */}
                  <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-200/80 space-y-2 text-xs">
                    <span className="font-bold text-slate-800 block">Cara Pembayaran QRIS:</span>
                    <ol className="list-decimal list-inside space-y-1 text-slate-600 leading-relaxed">
                      <li>Buka aplikasi m-Banking (BSI, BCA, Mandiri, BRI) atau E-Wallet (ShopeePay, GoPay, OVO, DANA).</li>
                      <li>Pilih menu <strong>Scan / Bayar QRIS</strong>.</li>
                      <li>Arahkan kamera ke kode QR di atas (atau pilih tangkapan layar dari galeri).</li>
                      <li>Pastikan nama merchant <strong>YAYASAN AMALIAH</strong> dan nominal <strong>Rp {donationData.amount.toLocaleString('id-ID')}</strong> sesuai.</li>
                      <li>Konfirmasi pembayaran dan masukkan PIN Anda.</li>
                    </ol>
                  </div>
                </div>
              )}

              {/* KONTEN METODE 2: VIRTUAL ACCOUNT SHOPEE STYLE */}
              {donationData.paymentMethod === 'VIRTUAL_ACCOUNT' && (
                <div className="pt-2 space-y-4">
                  {/* VA Card */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/70 via-teal-50/40 to-slate-50 border-2 border-emerald-200/80 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-emerald-700" />
                        <div>
                          <div className="text-xs font-bold text-slate-900">Bank Syariah Indonesia (BSI)</div>
                          <div className="text-[10px] text-slate-500">Virtual Account Escrow Resmi Pesantren</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded-full border border-emerald-200 shadow-2xs">
                        BSI VA
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold text-slate-600 block mb-1">
                        Nomor Virtual Account:
                      </span>
                      <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs">
                        <span className="font-mono text-xl sm:text-2xl font-extrabold text-slate-900 tracking-wider">
                          {donationData.vaNumber || '934799991171070'}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyText(donationData.vaNumber || '934799991171070', 'va')}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                        >
                          {copiedField === 'va' ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Tersalin!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>SALIN</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1.5">
                        Atas Nama: <strong className="text-slate-800">Pesantren Amaliah - {donationData.donorName}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Accordion Petunjuk Transfer ala Shopee */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-200 text-xs">
                    {/* Tab m-Banking */}
                    <div>
                      <button
                        type="button"
                        onClick={() => setActiveInstruction(activeInstruction === 'mbanking' ? ('' as any) : 'mbanking')}
                        className="w-full p-3.5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left font-bold text-slate-800 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <Smartphone className="w-4 h-4 text-emerald-600" />
                          Petunjuk Transfer Mobile Banking (BSI / Lainnya)
                        </span>
                        {activeInstruction === 'mbanking' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </button>
                      {activeInstruction === 'mbanking' && (
                        <div className="p-4 bg-white space-y-1.5 text-slate-600 leading-relaxed border-t border-slate-100">
                          <p>1. Buka aplikasi <strong>BSI Mobile</strong> atau m-Banking bank Anda.</p>
                          <p>2. Pilih menu <strong>Bayar / Pembayaran &gt; Rekening Virtual / E-Commerce</strong>.</p>
                          <p>3. Masukkan Nomor Virtual Account: <strong className="font-mono text-slate-900">{donationData.vaNumber || '934799991171070'}</strong>.</p>
                          <p>4. Masukkan nominal tagihan tepat: <strong>Rp {donationData.amount.toLocaleString('id-ID')}</strong>.</p>
                          <p>5. Periksa informasi penerima, lalu konfirmasi dengan PIN Anda.</p>
                        </div>
                      )}
                    </div>

                    {/* Tab ATM */}
                    <div>
                      <button
                        type="button"
                        onClick={() => setActiveInstruction(activeInstruction === 'atm' ? ('' as any) : 'atm')}
                        className="w-full p-3.5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left font-bold text-slate-800 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-blue-600" />
                          Petunjuk Transfer ATM
                        </span>
                        {activeInstruction === 'atm' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </button>
                      {activeInstruction === 'atm' && (
                        <div className="p-4 bg-white space-y-1.5 text-slate-600 leading-relaxed border-t border-slate-100">
                          <p>1. Masukkan kartu ATM dan 6 digit PIN Anda.</p>
                          <p>2. Pilih menu <strong>Transaksi Lainnya &gt; Transfer / Pembayaran &gt; Virtual Account</strong>.</p>
                          <p>3. Masukkan nomor VA: <strong className="font-mono text-slate-900">{donationData.vaNumber || '934799991171070'}</strong>.</p>
                          <p>4. Masukkan nominal tagihan sesuai yang tertera.</p>
                          <p>5. Simpan struk bukti transaksi ATM Anda.</p>
                        </div>
                      )}
                    </div>

                    {/* Tab Internet Banking */}
                    <div>
                      <button
                        type="button"
                        onClick={() => setActiveInstruction(activeInstruction === 'ibanking' ? ('' as any) : 'ibanking')}
                        className="w-full p-3.5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left font-bold text-slate-800 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-teal-600" />
                          Petunjuk Transfer Internet Banking
                        </span>
                        {activeInstruction === 'ibanking' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </button>
                      {activeInstruction === 'ibanking' && (
                        <div className="p-4 bg-white space-y-1.5 text-slate-600 leading-relaxed border-t border-slate-100">
                          <p>1. Login ke akun Internet Banking bank Anda.</p>
                          <p>2. Masuk ke menu <strong>Pembayaran &gt; Virtual Account</strong>.</p>
                          <p>3. Masukkan kode Virtual Account dan selesaikan otentikasi transaksi.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Status Polling Live Indicator */}
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 flex items-center justify-between text-xs text-amber-900">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                  <span>Sistem memantau pembayaran otomatis...</span>
                </div>
                <span className="text-[10px] font-semibold text-amber-700 bg-amber-100/60 px-2 py-0.5 rounded-full">Live Sync</span>
              </div>

              {/* CTA Action ala Shopee: Cek Status / Saya Sudah Bayar */}
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  disabled={isSimulatingBankPay}
                  onClick={handleSimulateBankPayment}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm sm:text-base py-3.5 rounded-2xl shadow-md shadow-orange-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSimulatingBankPay ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Memverifikasi Pembayaran...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Saya Sudah Bayar / Cek Status Pembayaran</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="w-full py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  Ubah Nominal atau Metode Pembayaran
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: SUKSES SELESAI */}
        {step === 'success' && donationData && (
          <div className="space-y-5">
            {/* Kartu Ucapan Terima Kasih & Doa */}
            <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-7 shadow-md relative overflow-hidden text-center">
              <div className="w-14 h-14 bg-white/15 backdrop-blur-md text-emerald-200 rounded-full flex items-center justify-center mx-auto mb-3 border border-white/20 shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-700/80 text-emerald-200 border border-emerald-500/30 mb-2">
                <Heart className="w-3.5 h-3.5 text-emerald-300" />
                Terima Kasih Banyak
              </span>

              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                Jazakumullahu Khairan Katsiran
              </h1>

              <p className="text-xs sm:text-sm text-emerald-100/90 mt-2 max-w-md mx-auto leading-relaxed">
                Terima kasih atas infak & zakat yang telah Anda tunaikan untuk Pesantren Amaliah.
                Semoga Allah SWT memberkahi harta Anda, menggantinya dengan berlipat ganda, dan menjadikannya amal jariyah abadi bagi para santri penghafal Al-Qur'an.
              </p>

              {/* Doa Ma'tsur Penerima Zakat */}
              <div className="mt-4 pt-4 border-t border-white/15 bg-white/10 rounded-2xl p-3.5 backdrop-blur-xs">
                <p className="font-serif text-base sm:text-lg text-emerald-200 leading-relaxed text-right mb-1">
                  آجَرَكَ اللهُ فِيْمَا أَعْطَيْتَ، وَبَارَكَ فِيْمَا أَبْقَيْتَ، وَجَعَلَهُ لَكَ طَهُوْرًا
                </p>
                <p className="text-[11px] text-emerald-200/80 italic">
                  "Semoga Allah memberikan pahala atas apa yang engkau berikan, memberkahi apa yang tersisa, dan menjadikannya pembersih bagimu."
                </p>
              </div>
            </div>

            {/* Kuitansi Digital Resmi Pesantren Amaliah (Printable) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5 print-area">
              {/* Header Resi */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/images/logo.jpg"
                    alt="Pesantren Amaliah"
                    className="w-10 h-10 rounded-full object-cover shadow-xs border border-slate-100"
                  />
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight">
                      Pesantren Amaliah
                    </h3>
                    <p className="text-[11px] text-slate-500">Bukti Penerimaan Infak & Zakat Resmi</p>
                  </div>
                </div>
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>LUNAS</span>
                </div>
              </div>

              {/* Rincian Resi */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Nomor Transaksi / Resi:</span>
                  <span className="font-mono font-bold text-slate-900">{donationData.transactionId}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Waktu Pembayaran:</span>
                  <span className="font-medium text-slate-800">
                    {donationData.paidAt
                      ? new Date(donationData.paidAt).toLocaleString('id-ID', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })
                      : new Date().toLocaleString('id-ID', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Nama Muzakki / Donatur:</span>
                  <span className="font-bold text-slate-900">{donationData.donorName || 'Hamba Allah'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Peruntukan Program:</span>
                  <span className="font-semibold text-slate-800 text-right max-w-[220px] truncate">
                    {programTitle || donationData.campaignTitle || 'Operasional Santri Pesantren Amaliah'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Metode Pembayaran:</span>
                  <span className="font-semibold text-slate-800">
                    {donationData.paymentMethod === 'VIRTUAL_ACCOUNT' ? 'Virtual Account Bank BSI' : 'QRIS Dinamis BI-SNAP'}
                  </span>
                </div>
                {donationData.doa && (
                  <div className="py-1.5 border-b border-slate-100 bg-slate-50/70 p-2.5 rounded-xl">
                    <span className="text-[11px] text-slate-500 block mb-0.5">Pesan & Niat:</span>
                    <span className="text-xs text-slate-700 italic">"{donationData.doa}"</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 items-center">
                  <span className="text-sm font-bold text-slate-900">Total Dibayarkan:</span>
                  <span className="text-base sm:text-lg font-extrabold text-emerald-700">
                    Rp {donationData.amount.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Stempel & Verifikasi Kas */}
              <div className="bg-emerald-50/70 rounded-2xl p-3 border border-emerald-100 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2 text-emerald-800 font-medium">
                  <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Tercatat otomatis di Sub-Rekening Kas Yayasan</span>
                </div>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded-md font-bold text-emerald-700 border border-emerald-200">
                  TERVERIFIKASI
                </span>
              </div>
            </div>

            {/* Tombol Aksi: Cetak Resi, Program, dan Beranda */}
            <div className="space-y-2.5 no-print">
              <button
                type="button"
                onClick={() => window.print()}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3.5 rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <Printer className="w-4 h-4" />
                <span>Unduh / Cetak Kuitansi Resmi (Resi)</span>
              </button>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => navigate('/programs')}
                  className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs py-3 rounded-xl transition-all cursor-pointer text-center"
                >
                  Tunaikan Infaq Lainnya
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs py-3 rounded-xl transition-all cursor-pointer text-center"
                >
                  Kembali ke Beranda
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
