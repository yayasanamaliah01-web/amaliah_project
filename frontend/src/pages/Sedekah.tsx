import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Sun,
  Heart,
  Droplets,
  BookOpen,
  Coffee,
  CheckCircle2,
  ChevronRight,
  Clock,
  ShieldCheck,
  Smile,
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface SedekahProps {
  onBack?: () => void;
  openCheckout?: (progId?: string | number, amount?: number) => void;
}

export default function SedekahPage({ onBack, openCheckout }: SedekahProps) {
  const navigate = useNavigate();
  const { campaigns } = useAppContext();

  // Quick Sedekah amounts
  const quickAmounts = [10000, 20000, 50000, 100000, 200000];
  const [selectedAmount, setSelectedAmount] = useState<number>(20000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('subuh');

  // Filter campaigns suitable for Sedekah
  const sedekahCampaigns = campaigns.filter(
    (c) =>
      c.category?.toLowerCase().includes('sedekah') ||
      c.title?.toLowerCase().includes('sedekah') ||
      c.title?.toLowerCase().includes('subuh') ||
      c.title?.toLowerCase().includes('air') ||
      c.title?.toLowerCase().includes('pangan')
  );

  const displayCampaigns =
    sedekahCampaigns.length > 0 ? sedekahCampaigns : campaigns.slice(0, 3);

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
    const amount = selectedAmount > 0 ? selectedAmount : 20000;
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
      {/* Hero Banner Sedekah Subuh */}
      <section className="bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-amber-100 text-xs font-semibold mb-4 border border-white/20">
              <Sun className="w-3.5 h-3.5 text-amber-200" />
              <span>Rutinitas Pagi Membawa Berkah</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight mb-4">
              Sedekah Subuh & Harian
            </h1>
            <p className="text-amber-100 text-sm sm:text-base md:text-lg leading-relaxed mb-8">
              "Tidak ada satu subuh pun yang dialami hamba-hamba Allah kecuali turun kepada mereka dua malaikat,
              salah satunya berdoa: 'Ya Allah, berikanlah ganti bagi orang yang berinfak'." (HR. Bukhari & Muslim)
            </p>

            {/* Quick Box Sedekah */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 text-slate-800 shadow-xl border border-slate-100 max-w-2xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs sm:text-sm font-bold text-slate-700">Pilih Nominal Sedekah Harian:</span>
                <span className="text-[11px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Waktu Terbaik: Ba'da Subuh
                </span>
              </div>

              {/* Grid Nominal Cepat */}
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-3">
                {quickAmounts.map((amt) => {
                  const isSelected = selectedAmount === amt && !customAmount;
                  return (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleNominalClick(amt)}
                      className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30 ring-2 ring-amber-600'
                          : 'bg-slate-50 text-slate-700 border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50'
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
                  placeholder="Atau ketik nominal lainnya (contoh: 15000)..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100 bg-slate-50/60 focus:bg-white"
                />
              </div>

              <button
                type="button"
                onClick={() => handleTunaikan()}
                className="w-full py-3.5 px-6 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-[0.99] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-amber-600/25 transition-all"
              >
                <span>Tunaikan Sedekah Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Program Sedekah Spesifik */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">
              Jalan Kebaikan
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Pilihan Program Sedekah
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md">
            Mulai dari sedekah subuh, paket beras santri, hingga sedekah air bersih untuk pesantren pelosok.
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
                className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-amber-400 transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  <div className="aspect-[16/10] bg-slate-100 relative overflow-hidden">
                    <img
                      src={prog.image}
                      alt={prog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-bold text-amber-800 shadow-xs">
                      {prog.category || 'Sedekah Rutin'}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-base text-slate-900 group-hover:text-amber-700 transition-colors line-clamp-2 mb-2 leading-snug">
                      {prog.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                      {prog.description}
                    </p>

                    <div className="space-y-1.5 mb-4">
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-amber-600 h-full rounded-full transition-all duration-700"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-[11px] font-medium text-slate-500">
                        <span>Terkumpul: <strong className="text-slate-900 font-bold">Rp {(prog.currentAmount || 0).toLocaleString('id-ID')}</strong></span>
                        <span className="text-amber-700 font-bold">{percentage}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    type="button"
                    onClick={() => handleTunaikan(prog.id)}
                    className="w-full py-2.5 px-4 rounded-xl bg-amber-50 hover:bg-amber-600 text-amber-800 hover:text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Salurkan Sedekah Ini</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Keutamaan Sedekah Subuh Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xs">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Mengapa Sedekah Subuh Begitu Istimewa?
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              3 Fadhilah Utama Sedekah Subuh
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-100">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold mb-3">
                <Sun className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 mb-1">Didoakan Khusus Dua Malaikat</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Malaikat turun di awal fajar untuk mendoakan keberkahan rezeki dan penggantian berlipat bagi yang bersedekah.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-100">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold mb-3">
                <Smile className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 mb-1">Membuka Pintu Hajat & Kesembuhan</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Rasulullah SAW bersabda: "Obatilah orang-orang yang sakit di antara kalian dengan sedekah."
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-100">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold mb-3">
                <Heart className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 mb-1">Menolak Bala & Bencana</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sedekah di awal hari menjadi benteng perlindungan diri dan keluarga dari mara bahaya sepanjang hari.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
