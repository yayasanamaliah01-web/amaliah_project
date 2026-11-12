import React from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, ArrowRight, CheckCircle2, ArrowDownLeft, ArrowUpRight, FileText, Landmark } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function RecentActivities({ setActivePage }: { setActivePage: (page: string) => void }) {
  const { lpjReports, activities, mutations, summary } = useAppContext();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  const displayReports = lpjReports.slice(0, 3);

  return (
    <section className="bg-slate-50 py-12 md:py-16 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* BANK TRANSPARENCY LIVE TICKER BAR */}
        {summary && (
          <div className="mb-10 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-100/80 flex items-center justify-center text-emerald-700 shadow-xs">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Rekonsiliasi Kas Bank
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> {summary.bankName}
                  </span>
                </div>
                <div className="text-base sm:text-lg font-bold text-slate-800 mt-0.5">
                  Saldo Rekening: Rp {summary.currentLiveBankBalance.toLocaleString('id-ID')}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 w-full md:w-auto text-center md:text-right border-t md:border-t-0 pt-3.5 md:pt-0 border-slate-100">
              <div>
                <div className="text-[10px] font-medium uppercase text-slate-400">Total Donasi Masuk</div>
                <div className="text-xs sm:text-sm font-semibold text-emerald-700">
                  Rp {summary.totalDonationsCollected.toLocaleString('id-ID')}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-medium uppercase text-slate-400">Total Tersalurkan</div>
                <div className="text-xs sm:text-sm font-semibold text-slate-700">
                  Rp {summary.totalFundsDisbursed.toLocaleString('id-ID')}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-medium uppercase text-slate-400">LPJ Terbit</div>
                <div className="text-xs sm:text-sm font-semibold text-slate-700">
                  {summary.totalLpjPublished} Dokumen
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 md:mb-10 gap-3 sm:gap-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            className="flex-1 min-w-0 w-full"
          >
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-100 text-xs font-semibold text-emerald-800 rounded-lg">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Transparansi Penyaluran</span>
              </div>
              <h2 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight break-words">
                Laporan LPJ & Aktivitas Live
              </h2>
              <p className="text-xs text-slate-500 max-w-xl font-normal leading-relaxed">
                Setiap rupiah infak diaudit dan dapat ditelusuri rincian penyalurannya secara transparan.
              </p>
            </div>
          </motion.div>
          <motion.button
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            onClick={() => setActivePage('impact')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors group cursor-pointer shrink-0 pt-1 sm:pt-0"
          >
            <span>Lihat Semua LPJ & Laporan</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>

        {/* 3 LPJ Reports Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6"
        >
          {displayReports.length > 0 ? (
            displayReports.map((report) => {
              const photos = report.documentationUrls ? report.documentationUrls.split(',') : [];
              const firstPhoto = photos[0] || 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800';

              return (
                <motion.div
                  variants={itemVariants}
                  key={report.id}
                  className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-md hover:border-emerald-200 transition-all duration-300 group cursor-pointer flex flex-col"
                  onClick={() => setActivePage('impact')}
                >
                  <div className="aspect-[4/3] relative overflow-hidden bg-slate-100">
                    <img
                      src={firstPhoto}
                      alt={report.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-xs">
                      <FileText className="w-3 h-3 text-emerald-600" /> {report.lpjNumber}
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-sm md:text-base text-slate-800 mb-1.5 line-clamp-2 leading-snug group-hover:text-emerald-700 transition-colors">
                        {report.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-3.5 font-normal">
                        {report.summary}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-normal">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                        <span className="truncate">{report.location || 'Semarang'}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="text-[9px] font-medium text-slate-400 uppercase tracking-wider mb-0.5">
                          Dana Tersalurkan
                        </div>
                        <div className="text-xs md:text-sm font-semibold text-emerald-700">
                          Rp {report.totalSpent.toLocaleString('id-ID')}
                        </div>
                      </div>
                      <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-3 text-center py-10 text-slate-400 text-sm">
              Memuat data laporan pertanggungjawaban...
            </div>
          )}
        </motion.div>

        {/* LIVE STREAM MUTATIONS TICKER */}
        {activities.length > 0 && (
          <div className="mt-8 md:mt-10 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-1.5 mb-3.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0"></span>
                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Live Feed Transparansi & Mutasi
                </h4>
              </div>
              <span className="text-[10px] sm:text-[11px] text-slate-400 font-normal">Real-time update</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {activities.slice(0, 4).map((act) => (
                <div
                  key={act.id}
                  className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs overflow-hidden"
                >
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        act.actionType === 'DONASI_MASUK'
                          ? 'bg-emerald-100/80 text-emerald-700'
                          : 'bg-blue-100/80 text-blue-700'
                      }`}
                    >
                      {act.actionType === 'DONASI_MASUK' ? (
                        <ArrowDownLeft className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-xs text-slate-800 truncate">{act.title}</div>
                      <div className="text-[10px] text-slate-500 truncate">{act.description}</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0 pl-1">
                    <span
                      className={`font-semibold text-xs whitespace-nowrap ${
                        act.actionType === 'DONASI_MASUK' ? 'text-emerald-700' : 'text-blue-700'
                      }`}
                    >
                      {act.actionType === 'DONASI_MASUK' ? '+' : '-'} Rp {act.amount?.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
