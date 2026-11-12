import React from 'react';
import { ArrowRight, ShieldCheck, Calculator } from 'lucide-react';
import { motion } from 'motion/react';

export default function Hero({
  openCheckout,
  setActivePage,
}: {
  openCheckout: () => void;
  setActivePage: (page: string) => void;
}) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.04,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section
      id="hero"
      className="relative bg-white border-b border-slate-200/80 overflow-hidden min-h-[calc(100dvh-4rem)] flex flex-col justify-start lg:justify-center"
    >
      {/* ============================================================== */}
      {/* 1. MOBILE VIEW: ULTRA-CLEAN, LIGHT & MINIMALIST                */}
      {/* ============================================================== */}
      <div className="lg:hidden w-full px-4 pt-3 pb-12 flex-1 flex flex-col justify-start">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {/* Top Badge & Clean Title */}
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-[11px] font-semibold text-emerald-800 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Pesantren Amaliah</span>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-700 font-bold">Akreditasi A</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 leading-snug tracking-tight">
              Mencetak Generasi Qur'ani, <br />
              <span className="text-emerald-700">Menjaga Amanah Ummat</span>
            </h1>
          </motion.div>

          {/* Bright, Crisp Santri Photo Card */}
          <motion.div
            variants={itemVariants}
            className="w-full aspect-[16/9] max-h-[190px] rounded-2xl overflow-hidden relative border border-slate-200/80 shadow-xs"
          >
            <img
              src="/images/santri-hero.jpg"
              alt="Santri Pesantren Amaliah Belajar Al-Qur'an"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute bottom-2 left-2.5 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[10px] font-semibold text-slate-800 border border-white/60 shadow-xs">
              Santri Tahfidz Qur'an Amaliah
            </div>
          </motion.div>

          {/* Clean 2-Column Buttons */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-2 pt-0.5">
            <button
              onClick={() => setActivePage('programs')}
              className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-semibold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-600/20 transition-all"
            >
              <span>Tunaikan Infaq</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActivePage('zakat')}
              className="bg-white hover:bg-slate-50 active:scale-95 border border-slate-200 text-slate-700 font-semibold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs"
            >
              <Calculator className="w-3.5 h-3.5 text-emerald-600" />
              <span>Kalkulator Zakat</span>
            </button>
          </motion.div>

          {/* Clean Minimalist Stats Bar */}
          <motion.div
            variants={itemVariants}
            className="bg-slate-50 rounded-xl border border-slate-200/70 p-2.5 grid grid-cols-3 divide-x divide-slate-200 text-center"
          >
            <div className="px-1">
              <div className="text-xs font-bold text-slate-900">1.250+</div>
              <div className="text-[10px] text-slate-500 font-medium">Santri Dhuafa</div>
            </div>
            <div className="px-1">
              <div className="text-xs font-bold text-slate-900">100%</div>
              <div className="text-[10px] text-slate-500 font-medium">Bebas Biaya</div>
            </div>
            <div className="px-1">
              <div className="text-xs font-bold text-emerald-700">Bank BSI</div>
              <div className="text-[10px] text-slate-500 font-medium">Transparan</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ============================================================== */}
      {/* 2. DESKTOP VIEW: CLEAN 2-COLUMN LUXURY HERO LAYOUT              */}
      {/* ============================================================== */}
      <div className="hidden lg:flex max-w-7xl mx-auto px-6 w-full py-16 items-center">
        <div className="grid grid-cols-2 gap-12 items-center w-full">
          
          {/* Left Column Text & Controls */}
          <motion.div
            className="relative z-10 max-w-2xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/70 text-xs font-semibold text-emerald-800 mb-4"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>Pesantren Amaliah • Amanah & Transparan</span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl xl:text-5xl font-bold text-slate-900 leading-[1.2] mb-3.5 tracking-tight"
            >
              Mencetak Generasi Qur'ani, <br />
              <span className="text-emerald-700">Menjaga Amanah Ummat</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-slate-600 text-base leading-relaxed mb-6 max-w-xl"
            >
              Salurkan infak, sedekah, dan zakat secara langsung untuk pemenuhan pangan harian santri,
              bisyarah para ustadz, serta sarana dakwah Pesantren Amaliah dengan sistem keterbukaan sub-rekening perbankan syariah.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex items-center gap-3"
            >
              <button
                onClick={() => setActivePage('programs')}
                className="bg-emerald-600 text-white font-semibold text-base px-6 py-3 rounded-xl hover:bg-emerald-700 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm shadow-emerald-600/20 group"
              >
                <span>Tunaikan Infaq Santri</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => setActivePage('zakat')}
                className="bg-white border border-slate-200/90 text-slate-700 font-semibold text-base px-5 py-3 rounded-xl hover:bg-slate-100 hover:text-slate-900 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                <Calculator className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Kalkulator Zakat</span>
              </button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="mt-8 pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-6"
            >
              <div>
                <div className="text-2xl font-bold text-slate-900 leading-tight">1.250+</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Santri Dhuafa & Yatim</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 leading-tight">100%</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Pendidikan & Asrama Gratis</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-700 leading-tight">Bank BSI</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Transparansi Real-Time</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column Photo Card */}
          <motion.div
            className="relative flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          >
            <div className="w-full aspect-[16/10] max-h-[420px] rounded-2xl overflow-hidden border border-slate-200/90 bg-white relative shadow-sm">
              <img
                src="/images/santri-hero.jpg"
                alt="Santri Pesantren Amaliah Mengaji Al-Qur'an"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none"></div>
              <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-lg text-[11px] font-semibold text-slate-700 border border-white/60 shadow-xs">
                Santri Tahfidz Qur'an Amaliah
              </div>
            </div>

            {/* Clean Floating Verification Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
              className="absolute -bottom-5 -left-4 bg-white rounded-xl p-3.5 border border-slate-200/90 flex items-center gap-3.5 shadow-md"
            >
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0 border border-emerald-100">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Tata Kelola & Syariah</div>
                <div className="text-xs sm:text-sm font-bold text-slate-900">Akreditasi A • 100% Terverifikasi</div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
