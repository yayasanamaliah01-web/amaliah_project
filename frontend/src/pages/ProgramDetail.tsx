import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  Heart,
  FileText,
  Banknote,
  BadgeCheck,
  Share2,
  Shield,
  User,
  MapPin,
  CheckCircle2,
  ArrowDownLeft,
  ArrowUpRight,
  ReceiptText,
  CreditCard,
  Building2,
  Scale,
  ExternalLink,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { api, ApiDonation, ApiLpj, ApiDisbursement } from '../services/api';

export default function ProgramDetail({
  id,
  onBack,
  openCheckout,
}: {
  id: string;
  onBack: () => void;
  openCheckout: () => void;
}) {
  const { campaigns } = useAppContext();
  const [activeTab, setActiveTab] = useState<'masuk' | 'keluar'>('masuk');

  const campaign =
    campaigns.find((c) => String(c.id) === String(id) || c.slug === id) || campaigns[0];

  const [donations, setDonations] = useState<ApiDonation[]>([]);
  const [lpjList, setLpjList] = useState<ApiLpj[]>([]);
  const [disbursements, setDisbursements] = useState<ApiDisbursement[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (campaign?.id) {
      setIsLoading(true);
      Promise.allSettled([
        api.donations.getByCampaign(campaign.id),
        api.lpj.getByCampaign(campaign.id),
        api.disbursements.getByCampaign(campaign.id),
      ]).then(([donRes, lpjRes, disbRes]) => {
        if (donRes.status === 'fulfilled') setDonations(donRes.value);
        if (lpjRes.status === 'fulfilled') setLpjList(lpjRes.value);
        if (disbRes.status === 'fulfilled') setDisbursements(disbRes.value);
        setIsLoading(false);
      });
    }
  }, [campaign?.id]);

  // Calculate Sub-Rekening Cash Flow
  const totalInflow = campaign?.collectedAmount || 0;
  const totalOutflow = useMemo(() => {
    return disbursements.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  }, [disbursements]);
  const remainingSubBalance = Math.max(0, totalInflow - totalOutflow);

  // Unified Chronological Mutasi Ledger for Sub-Rekening
  const unifiedLedger = useMemo(() => {
    const entries: {
      id: string;
      date: string;
      type: 'MASUK' | 'KELUAR';
      title: string;
      party: string;
      refNo: string;
      amount: number;
      category: string;
      notes?: string;
    }[] = [];

    donations.forEach((d) => {
      entries.push({
        id: `don-${d.id}`,
        date: d.paidAt || d.createdAt,
        type: 'MASUK',
        title: 'Donasi Masuk via QRIS / Bank',
        party: d.isAnonymous ? 'Hamba Allah' : d.donorName,
        refNo: d.transactionId,
        amount: d.amount,
        category: d.paymentMethod || 'QRIS SNAP',
        notes: d.doa || 'Infaq / Sedekah',
      });
    });

    disbursements.forEach((disb) => {
      entries.push({
        id: `disb-${disb.id}`,
        date: disb.disbursementDate || disb.createdAt || new Date().toISOString(),
        type: 'KELUAR',
        title: disb.title,
        party: `Penerima: ${disb.beneficiaryName} (${disb.beneficiaryBank || 'Bank Transfer'})`,
        refNo: disb.disbursementNumber,
        amount: disb.amount,
        category: disb.category || 'Penyaluran Program',
        notes: disb.notes || `Disetujui oleh: ${disb.approvedBy}`,
      });
    });

    // Sort descending by date
    return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [donations, disbursements]);

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500 font-normal text-sm">Memuat data program donasi...</p>
      </div>
    );
  }

  const progress = campaign.progressPercentage || 0;
  const subRekNumber = `SUB-REK-${String(campaign.id).padStart(4, '0')}`;

  return (
    <div className="flex flex-col bg-slate-50 min-h-screen">
      {/* Hero Image */}
      <div className="relative aspect-[4/3] md:aspect-[21/9] w-full max-w-3xl mx-auto">
        <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover" />
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black/60 to-transparent"></div>
        <button
          onClick={onBack}
          className="absolute top-4 left-4 p-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-md transition-colors rounded-full text-white"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2]" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white -mt-6 md:-mt-10 relative z-10 rounded-t-3xl max-w-3xl mx-auto w-full pb-32 shadow-[0_-8px_30px_rgba(0,0,0,0.04)]">
        <div className="px-5 py-6">
          {/* Top Badges */}
          <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                {campaign.category}
              </span>
              {campaign.isUrgent && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                  Mendesak
                </span>
              )}
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-50 border border-slate-200/80 text-slate-600 text-xs font-medium">
              <Building2 className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-mono text-[11px] font-semibold">{subRekNumber}</span>
            </div>
          </div>

          {/* Program Title */}
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-800 leading-snug tracking-normal mb-4">
            {campaign.title}
          </h1>

          {/* Fundraising Progress Card */}
          <div className="bg-slate-50/70 border border-slate-200/60 rounded-2xl p-4 sm:p-5 mb-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
              <div>
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block mb-0.5">
                  Dana Terkumpul
                </span>
                <div className="text-2xl sm:text-3xl font-semibold text-slate-800 tracking-tight">
                  Rp {campaign.collectedAmount?.toLocaleString('id-ID')}
                </div>
              </div>
              <div className="text-xs text-slate-500 sm:text-right">
                dari target <span className="font-medium text-slate-600">Rp {campaign.targetAmount?.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* Progress Bar with Percentage Tag */}
            <div className="space-y-1.5">
              <div className="w-full h-2 bg-slate-200/70 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, progress)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
                <span className="text-emerald-700 font-medium">{progress.toFixed(0)}% terpenuhi</span>
                <span className="inline-flex items-center gap-1 text-slate-500 font-normal">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {campaign.remainingDays} hari tersisa
                </span>
              </div>
            </div>
          </div>

          {/* Sub-Rekening Financial Transparency Card (Clean, Trustworthy, Light Surface) */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs mb-5">
            {/* Card Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4 gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-semibold text-slate-700 truncate">
                    Buku Kas Sub-Rekening Program
                  </div>
                  <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-x-1.5 font-normal">
                    <span className="font-mono text-slate-600">{subRekNumber}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-medium">BSI Virtual Escrow</span>
                  </div>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/50 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Live Mutasi
              </span>
            </div>

            {/* 3 Metric Cards: Stacking vertically on mobile, 3 columns on tablet/desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-center">
              {/* Uang Masuk */}
              <div className="bg-slate-50/70 rounded-xl p-3 border border-slate-100/90 flex items-center justify-between sm:flex-col sm:justify-between sm:text-center transition-all">
                <div className="flex items-center sm:justify-center gap-2 sm:gap-1">
                  <div className="w-7 h-7 sm:w-auto sm:h-auto rounded-lg sm:rounded-none bg-emerald-100/60 sm:bg-transparent flex items-center justify-center text-emerald-700 shrink-0">
                    <ArrowDownLeft className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                  </div>
                  <div className="text-left sm:text-center">
                    <div className="text-xs sm:text-[11px] font-medium text-slate-600">Uang Masuk</div>
                    <div className="text-[10px] text-slate-400 sm:hidden">{donations.length} donasi tercatat</div>
                  </div>
                </div>
                <div className="text-right sm:text-center mt-0 sm:mt-1">
                  <div className="font-semibold text-sm text-slate-700 tracking-tight">
                    Rp {totalInflow.toLocaleString('id-ID')}
                  </div>
                  <div className="text-[10px] text-slate-400 hidden sm:block mt-0.5">
                    {donations.length} donasi
                  </div>
                </div>
              </div>

              {/* Uang Keluar */}
              <div className="bg-slate-50/70 rounded-xl p-3 border border-slate-100/90 flex items-center justify-between sm:flex-col sm:justify-between sm:text-center transition-all">
                <div className="flex items-center sm:justify-center gap-2 sm:gap-1">
                  <div className="w-7 h-7 sm:w-auto sm:h-auto rounded-lg sm:rounded-none bg-rose-100/60 sm:bg-transparent flex items-center justify-center text-rose-600 shrink-0">
                    <ArrowUpRight className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                  </div>
                  <div className="text-left sm:text-center">
                    <div className="text-xs sm:text-[11px] font-medium text-slate-600">Uang Keluar</div>
                    <div className="text-[10px] text-slate-400 sm:hidden">{disbursements.length} penyaluran dana</div>
                  </div>
                </div>
                <div className="text-right sm:text-center mt-0 sm:mt-1">
                  <div className="font-semibold text-sm text-slate-700 tracking-tight">
                    Rp {totalOutflow.toLocaleString('id-ID')}
                  </div>
                  <div className="text-[10px] text-slate-400 hidden sm:block mt-0.5">
                    {disbursements.length} penyaluran
                  </div>
                </div>
              </div>

              {/* Sisa Kas */}
              <div className="bg-emerald-50/50 rounded-xl p-3 border border-emerald-200/60 flex items-center justify-between sm:flex-col sm:justify-between sm:text-center transition-all">
                <div className="flex items-center sm:justify-center gap-2 sm:gap-1">
                  <div className="w-7 h-7 sm:w-auto sm:h-auto rounded-lg sm:rounded-none bg-emerald-100/70 sm:bg-transparent flex items-center justify-center text-emerald-700 shrink-0">
                    <Scale className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                  </div>
                  <div className="text-left sm:text-center">
                    <div className="text-xs sm:text-[11px] font-medium text-emerald-800">Sisa Kas</div>
                    <div className="text-[10px] text-emerald-600/80 sm:hidden font-normal">Siap disalurkan</div>
                  </div>
                </div>
                <div className="text-right sm:text-center mt-0 sm:mt-1">
                  <div className="font-semibold text-sm text-emerald-800 tracking-tight">
                    Rp {remainingSubBalance.toLocaleString('id-ID')}
                  </div>
                  <div className="text-[10px] text-emerald-600/80 hidden sm:block mt-0.5 font-normal">
                    Siap disalurkan
                  </div>
                </div>
              </div>
            </div>

            {/* Audit Guarantee Footer */}
            <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1 font-normal text-slate-500">
                <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                Audit real-time terhubung BI-SNAP
              </span>
              <button
                onClick={() => setActiveTab('masuk')}
                className="text-emerald-700 hover:text-emerald-800 font-medium hover:underline inline-flex items-center gap-0.5"
              >
                Lihat Mutasi <ExternalLink className="w-3 h-3 ml-0.5" />
              </button>
            </div>
          </div>

          {/* Clean Quick Stats Pods */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="flex items-center gap-2.5 p-3 bg-slate-50/70 rounded-xl border border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Heart className="w-4 h-4 fill-emerald-100" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-slate-700 text-xs sm:text-sm truncate">
                  {campaign.donorCount}
                </div>
                <div className="text-[10px] text-slate-400">Donatur</div>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-3 bg-slate-50/70 rounded-xl border border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-slate-700 text-xs sm:text-sm truncate">
                  {lpjList.length} LPJ
                </div>
                <div className="text-[10px] text-slate-400">Terbit</div>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-3 bg-slate-50/70 rounded-xl border border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Banknote className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-slate-700 text-xs sm:text-sm truncate">
                  {disbursements.length} Kali
                </div>
                <div className="text-[10px] text-slate-400">Penyaluran</div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-2 w-full bg-slate-50"></div>

        {/* Organizer & Description */}
        <div className="px-5 py-5">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <h2 className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
              Penggalang Dana Terverifikasi
            </h2>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-semibold text-sm shrink-0">
                {campaign.organizer ? campaign.organizer.charAt(0) : 'M'}
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="font-semibold text-xs md:text-sm text-slate-800">{campaign.organizer}</span>
                  <BadgeCheck className="w-3.5 h-3.5 text-emerald-600 fill-emerald-50" />
                </div>
                <p className="text-[10px] text-slate-500 font-normal">
                  {campaign.location} • Rekening Penampung Yayasan
                </p>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-600 leading-relaxed space-y-2">
            <p>{campaign.description}</p>
          </div>
        </div>

        <div className="h-2 w-full bg-slate-50"></div>

        {/* 2 Tabs Only: Uang Masuk & Uang Keluar */}
        <div className="px-5 py-5">
          <div className="grid grid-cols-2 border-b border-slate-200/80 mb-5">
            <button
              onClick={() => setActiveTab('masuk')}
              className={`pb-3 text-xs sm:text-sm font-medium relative transition-colors flex items-center justify-center gap-1.5 sm:gap-2 ${
                activeTab === 'masuk' ? 'text-emerald-700 font-semibold' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <ArrowDownLeft className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Uang Masuk</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-normal ${
                activeTab === 'masuk' ? 'bg-emerald-100/70 text-emerald-800' : 'bg-slate-100 text-slate-500'
              }`}>
                {donations.length}
              </span>
              {activeTab === 'masuk' && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 rounded-t-full"></div>
              )}
            </button>

            <button
              onClick={() => setActiveTab('keluar')}
              className={`pb-3 text-xs sm:text-sm font-medium relative transition-colors flex items-center justify-center gap-1.5 sm:gap-2 ${
                activeTab === 'keluar' ? 'text-rose-700 font-semibold' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <ArrowUpRight className="w-4 h-4 text-rose-500 shrink-0" />
              <span>Uang Keluar</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-normal ${
                activeTab === 'keluar' ? 'bg-rose-100/70 text-rose-800' : 'bg-slate-100 text-slate-500'
              }`}>
                {disbursements.length}
              </span>
              {activeTab === 'keluar' && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-rose-600 rounded-t-full"></div>
              )}
            </button>
          </div>

          {/* TAB 1: UANG MASUK */}
          {activeTab === 'masuk' && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2 px-0.5">
                <span className="font-medium text-slate-600">Riwayat Donasi Masuk</span>
                <span className="text-[11px] font-mono font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/50 px-2 py-0.5 rounded-full">
                  {subRekNumber}
                </span>
              </div>

              {donations.length > 0 ? (
                donations.map((d) => (
                  <div
                    key={d.id}
                    className="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-slate-200 transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100/60 flex items-center justify-center shrink-0">
                          <ArrowDownLeft className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                              Uang Masuk
                            </span>
                            <span className="text-[11px] text-slate-400 font-normal">
                              {d.paidAt
                                ? new Date(d.paidAt).toLocaleDateString('id-ID', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })
                                : 'Baru saja'}
                            </span>
                          </div>
                          <div className="font-medium text-xs sm:text-sm text-slate-700 truncate leading-snug">
                            {d.donorName || 'Hamba Allah'}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate mt-0.5 font-normal">
                            {d.paymentMethod || 'QRIS'} • Ref: <span className="font-mono text-slate-500">{d.transactionId}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="font-semibold text-xs sm:text-sm tracking-tight text-emerald-600">
                          + Rp {d.amount?.toLocaleString('id-ID')}
                        </div>
                        <div className="text-[10px] text-slate-400 font-normal mt-0.5">
                          {d.paymentMethod || 'Donasi'}
                        </div>
                      </div>
                    </div>

                    {/* Doa donatur jika ada */}
                    {d.doa && (
                      <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 italic bg-slate-50/70 p-2.5 rounded-xl font-normal leading-relaxed">
                        "{d.doa}"
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Belum ada transaksi donasi masuk untuk sub-rekening program ini.
                </div>
              )}
            </div>
          )}

          {/* TAB 2: UANG KELUAR */}
          {activeTab === 'keluar' && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2 px-0.5">
                <span className="font-medium text-slate-600">Riwayat Penyaluran Dana Program</span>
                <span className="text-[11px] font-mono font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/50 px-2 py-0.5 rounded-full">
                  {subRekNumber}
                </span>
              </div>

              {disbursements.length > 0 ? (
                disbursements.map((disb) => (
                  <div
                    key={disb.id}
                    className="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-slate-200 transition-all flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 border border-rose-100/60 flex items-center justify-center shrink-0">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/50">
                            Uang Keluar
                          </span>
                          <span className="text-[11px] text-slate-400 font-normal">
                            {new Date(disb.disbursementDate || disb.createdAt || Date.now()).toLocaleDateString('id-ID', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <div className="font-medium text-xs sm:text-sm text-slate-700 truncate leading-snug">
                          {disb.title}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate mt-0.5 font-normal">
                          Penerima: {disb.beneficiaryName} ({disb.beneficiaryBank || 'Transfer'}) • Ref: <span className="font-mono text-slate-500">{disb.disbursementNumber}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-semibold text-xs sm:text-sm tracking-tight text-rose-500">
                        - Rp {disb.amount?.toLocaleString('id-ID')}
                      </div>
                      <div className="text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/50 px-2 py-0.5 rounded-full inline-block mt-1">
                        Sukses Disalurkan
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Belum ada riwayat penyaluran dana keluar untuk sub-rekening program ini.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-200/80 p-3.5 pb-5 md:pb-3.5 z-50 flex justify-center shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
        <div className="w-full max-w-3xl flex items-center gap-2.5">
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: campaign.title,
                  url: window.location.href,
                }).catch(() => {});
              } else {
                navigator.clipboard?.writeText(window.location.href);
                alert('Tautan program berhasil disalin!');
              }
            }}
            className="px-5 py-3 border border-slate-200 text-slate-600 bg-white rounded-xl font-medium text-xs sm:text-sm hover:bg-slate-50 hover:text-slate-800 transition-all text-center shrink-0"
          >
            Bagikan
          </button>
          <button
            onClick={openCheckout}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl py-3 font-semibold text-xs sm:text-sm shadow-sm transition-all text-center cursor-pointer"
          >
            Donasi ke Sub-Rekening Ini
          </button>
        </div>
      </div>
    </div>
  );
}
