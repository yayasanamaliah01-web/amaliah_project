import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sprout,
  ArrowRight,
  Building2,
  FileCheck2,
  ShieldCheck,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface WakafProps {
  onBack?: () => void;
  openCheckout?: (progId?: string | number, amount?: number) => void;
}

export default function WakafPage({ onBack, openCheckout }: WakafProps) {
  const navigate = useNavigate();
  const { campaigns } = useAppContext();

  // Pilihan nominal wakaf uang per meter atau per paket
  const wakafPackages = [
    { label: 'Wakaf Uang Tunai', amount: 50000, desc: 'Mulai dari Rp 50.000 untuk tabungan jariyah abadi' },
    { label: 'Paket Sarana Santri', amount: 100000, desc: 'Wakaf fasilitas & kitab belajar santri tahfidz' },
    { label: 'Paket Semen & Bata', amount: 250000, desc: 'Untuk pembangunan asrama santri dhuafa' },
    { label: 'Wakaf Lahan 1 Meter²', amount: 500000, desc: 'Pembebasan lahan perluasan pondok pesantren' },
  ];

  const [selectedAmount, setSelectedAmount] = useState<number>(100000);
  const [customAmount, setCustomAmount] = useState<string>('');

  // Filter campaigns suitable for Wakaf
  const wakafCampaigns = campaigns.filter(
    (c) =>
      c.category?.toLowerCase().includes('wakaf') ||
      c.title?.toLowerCase().includes('wakaf') ||
      c.title?.toLowerCase().includes('lahan') ||
      c.title?.toLowerCase().includes('pembangunan') ||
      c.title?.toLowerCase().includes('asrama')
  );

  const displayCampaigns =
    wakafCampaigns.length > 0 ? wakafCampaigns : campaigns.slice(0, 3);

  const handleSelectPackage = (amount: number) => {
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
    const amount = selectedAmount > 0 ? selectedAmount : 100000;
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
      {/* Hero Banner Wakaf */}
      <section className="bg-gradient-to-br from-teal-800 via-emerald-800 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-emerald-100 text-xs font-semibold mb-4 border border-white/20">
              <Sprout className="w-3.5 h-3.5 text-emerald-300" />
              <span>Amal Jariyah Abadi & Produktif</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight mb-4">
              Wakaf Uang & Sarana Pesantren
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base md:text-lg leading-relaxed mb-8">
              Pahala yang terus mengalir bahkan setelah kita wafat. Menjadi pondasi tegaknya asrama santri,
              masjid, dan sarana pendidikan Al-Qur'an generasi penerus umat.
            </p>

            {/* Quick Box Tunaikan Wakaf */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 text-slate-800 shadow-xl border border-slate-100 max-w-2xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs sm:text-sm font-bold text-slate-700">Pilih Paket Wakaf Produktif:</span>
                <span className="text-[11px] text-teal-800 font-semibold bg-teal-50 px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-teal-100">
                  <FileCheck2 className="w-3.5 h-3.5 text-teal-600" /> Sertifikat Digital Resmi
                </span>
              </div>

              {/* Grid Paket Wakaf */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
                {wakafPackages.map((pkg) => {
                  const isSelected = selectedAmount === pkg.amount && !customAmount;
                  return (
                    <button
                      key={pkg.amount}
                      type="button"
                      onClick={() => handleSelectPackage(pkg.amount)}
                      className={`p-3 text-left rounded-xl transition-all border ${
                        isSelected
                          ? 'bg-teal-50/80 border-teal-600 ring-2 ring-teal-600 shadow-xs'
                          : 'bg-slate-50 border-slate-200 hover:border-teal-400 hover:bg-teal-50/30'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="font-bold text-xs text-slate-900">{pkg.label}</span>
                        <span className="font-extrabold text-xs text-teal-700">
                          Rp {(pkg.amount).toLocaleString('id-ID')}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-tight">{pkg.desc}</p>
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
                  placeholder="Atau masukkan nominal wakaf lainnya..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 bg-slate-50/60 focus:bg-white"
                />
              </div>

              <button
                type="button"
                onClick={() => handleTunaikan()}
                className="w-full py-3.5 px-6 rounded-xl bg-teal-700 hover:bg-teal-800 active:scale-[0.99] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-teal-700/25 transition-all cursor-pointer"
              >
                <span>Tunaikan Wakaf Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Program Unggulan Wakaf */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-teal-700 mb-1">
              Investasi Akhirat
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Aset & Proyek Wakaf Berjalan
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md">
            Setiap jengkal tanah dan bata bangunan yang Anda wakafkan tercatat rapi dalam registrasi wakaf yayasan.
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
                className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-teal-400 transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  <div className="aspect-[16/10] bg-slate-100 relative overflow-hidden">
                    <img
                      src={prog.image}
                      alt={prog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-bold text-teal-800 shadow-xs">
                      {prog.category || 'Wakaf Uang & Aset'}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-base text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-2 mb-2 leading-snug">
                      {prog.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                      {prog.description}
                    </p>

                    <div className="space-y-1.5 mb-4">
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-teal-600 h-full rounded-full transition-all duration-700"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-[11px] font-medium text-slate-500">
                        <span>Terkumpul: <strong className="text-slate-900 font-bold">Rp {(prog.currentAmount || 0).toLocaleString('id-ID')}</strong></span>
                        <span className="text-teal-700 font-bold">{percentage}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    type="button"
                    onClick={() => handleTunaikan(prog.id)}
                    className="w-full py-2.5 px-4 rounded-xl bg-teal-50 hover:bg-teal-700 text-teal-800 hover:text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Salurkan Wakaf Ini</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Nazhir & Akuntabilitas Wakaf */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xs">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-teal-800 rounded-full text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              Tata Kelola Nazhir Terverifikasi
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Amanah, Sah Secara Syariah & Hukum
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Yayasan Amaliah bertindak sebagai Nazhir resmi yang memelihara pokok wakaf agar tetap utuh dan
              mengalirkan manfaat produktifnya untuk kesejahteraan santri dan umat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-teal-50/40 border border-teal-100">
              <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center font-bold mb-3">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 mb-1">Sertifikat Wakaf Digital</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Setiap donatur wakaf memperoleh sertifikat digital resmi bertanda tangan Nazhir yang dapat diunduh kapan saja.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-teal-50/40 border border-teal-100">
              <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center font-bold mb-3">
                <Building2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 mb-1">Pokok Abadi & Produktif</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Aset fisik wakaf (tanah, bangunan, sarana) tidak dijualbelikan atau diwariskan, melainkan terus dirawat.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-teal-50/40 border border-teal-100">
              <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center font-bold mb-3">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 mb-1">Laporan Progres Rutin</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dokumentasi foto dan laporan perkembangan fisik pembangunan diperbarui secara terbuka pada portal transparansi.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
