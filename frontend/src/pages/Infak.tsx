import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Sparkles,
  BookOpen,
  Utensils,
  GraduationCap,
  Home,
  Coins,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface InfakProps {
  onBack?: () => void;
  openCheckout?: (progId?: string | number, amount?: number) => void;
}

export default function InfakPage({ onBack, openCheckout }: InfakProps) {
  const navigate = useNavigate();
  const { campaigns } = useAppContext();

  // Nominal infak cepat
  const quickAmounts = [25000, 50000, 100000, 250000, 500000, 1000000];
  const [selectedAmount, setSelectedAmount] = useState<number>(50000);
  const [customAmount, setCustomAmount] = useState<string>('');

  // Cari program infak dari database context / fallback
  const infakCampaigns = campaigns.filter(
    (c) =>
      c.category?.toLowerCase().includes('infaq') ||
      c.category?.toLowerCase().includes('infak') ||
      c.title?.toLowerCase().includes('infak') ||
      c.title?.toLowerCase().includes('santri')
  );

  const displayCampaigns = infakCampaigns.length > 0 ? infakCampaigns : campaigns.slice(0, 3);

  const handleNominalClick = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    setCustomAmount(raw);
    if (raw) {
      setSelectedAmount(parseInt(raw, 10));
    }
  };

  const handleTunaikan = (progId?: string | number) => {
    const amount = selectedAmount > 0 ? selectedAmount : 50000;
    const targetId = progId || displayCampaigns[0]?.id || 1;
    if (openCheckout) {
      openCheckout(targetId, amount);
    } else {
      navigate('/pembayaran', {
        state: { campaignId: targetId, amount },
      });
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-emerald-100 text-xs font-semibold mb-4 border border-white/20">
              <Heart className="w-3.5 h-3.5 text-emerald-300 fill-emerald-300" />
              <span>Pilar Kebaikan Amaliah Semarang</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight mb-4">
              Infak Berkah & Berkelanjutan
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base md:text-lg leading-relaxed mb-8">
              Salurkan infak terbaik Anda untuk memuliakan santri penghafal Al-Qur'an, kafalah guru ngaji,
              dan operasional dakwah yang berkelanjutan di Semarang & sekitarnya.
            </p>

            {/* Quick Box Tunaikan Infak Langsung */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 text-slate-800 shadow-xl border border-slate-100 max-w-2xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs sm:text-sm font-bold text-slate-700">Pilih Nominal Infak:</span>
                <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                  100% Tersalurkan
                </span>
              </div>

              {/* Grid Nominal Cepat */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
                {quickAmounts.map((amt) => {
                  const isSelected = selectedAmount === amt && !customAmount;
                  return (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleNominalClick(amt)}
                      className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-600'
                          : 'bg-slate-50 text-slate-700 border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50'
                      }`}
                    >
                      Rp {(amt / 1000).toLocaleString('id-ID')}k
                    </button>
                  );
                })}
              </div>

              {/* Input Nominal Bebas */}
              <div className="relative mb-4">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">
                  Rp
                </span>
                <input
                  type="text"
                  value={customAmount ? parseInt(customAmount, 10).toLocaleString('id-ID') : ''}
                  onChange={handleCustomChange}
                  placeholder="Atau masukkan nominal lainnya..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 bg-slate-50/60 focus:bg-white"
                />
              </div>

              <button
                type="button"
                onClick={() => handleTunaikan()}
                className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all"
              >
                <span>Tunaikan Infak Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Program Unggulan Infak */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
              Pilihan Tema Infak
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Program Infak Pesantren Amaliah
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md">
            Setiap rupiah infak Anda dikelola secara amanah dengan audit berkala dan dilaporkan secara transparan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayCampaigns.map((prog) => {
            const percentage = Math.min(
              100,
              Math.round(((prog.currentAmount || 0) / (prog.targetAmount || 1)) * 100)
            );

            return (
              <div
                key={prog.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-emerald-400 transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  <div className="aspect-[16/10] bg-slate-100 relative overflow-hidden">
                    <img
                      src={prog.image}
                      alt={prog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-bold text-emerald-800 shadow-xs">
                      {prog.category || 'Infak Terikat'}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 mb-2 leading-snug">
                      {prog.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                      {prog.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 mb-4">
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-600 h-full rounded-full transition-all duration-700"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-[11px] font-medium text-slate-500">
                        <span>Terkumpul: <strong className="text-slate-900 font-bold">Rp {(prog.currentAmount || 0).toLocaleString('id-ID')}</strong></span>
                        <span className="text-emerald-700 font-bold">{percentage}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    type="button"
                    onClick={() => handleTunaikan(prog.id)}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Salurkan Infak Ini</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Edukasi & Perbedaan Infak */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xs">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Keutamaan & Panduan
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Apa yang Membedakan Infak?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Infak adalah pengeluaran harta di jalan Allah yang bersifat sukarela tanpa batasan nishab, waktu,
              maupun syarat asnaf tertentu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-3">
                <Utensils className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 mb-1">Pangan & Gizi Santri</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Menyokong kebutuhan beras, lauk bernutrisi, dan dapur umum bagi ratusan santri dhuafa penghafal Al-Qur'an.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-3">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 mb-1">Kafalah Guru & Asatidz</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Memberikan penghargaan dan insentif layak bagi para ustadz dan ustadzah yang ikhlas membina para santri.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-3">
                <Home className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 mb-1">Operasional & Sarana</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Listrik pondok, pemeliharaan air bersih, perbaikan ruang kelas, dan perlengkapan sarana belajar santri.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
