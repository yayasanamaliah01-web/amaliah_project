import React, { useState } from 'react';
import { Heart, Wallet, HeartHandshake, Sprout, Gift, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function CategoryGrid({ setActivePage }: { setActivePage: (page: string) => void }) {
  const [activeTab, setActiveTab] = useState('donasi');

  const categories = [
    { 
      id: 'donasi', 
      icon: Heart, 
      label: 'Infak Santri', 
      actionPage: 'programs',
      description: 'Salurkan infak dan sedekah untuk pemenuhan pangan harian santri serta beasiswa tahfidz dhuafa.',
      purpose: 'Beras & dapur santri, santunan santri yatim, dan bisyarah para guru ngaji.',
      proofStat: '1.250+ Santri Dhuafa Terbantu',
      proofImage: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80'
    },
    { 
      id: 'zakat', 
      icon: Wallet, 
      label: 'Zakat', 
      actionPage: 'zakat',
      description: 'Tunaikan kewajiban Zakat Maal, Penghasilan, dan Fitrah Anda melalui amil resmi Pesantren Amaliah.',
      purpose: 'Disalurkan khusus kepada 8 Asnaf mustahik dan santri fisabilillah sesuai syariat Islam.',
      proofStat: 'Rp 12,4 Miliar Zakat Tersalurkan',
      proofImage: 'https://images.unsplash.com/photo-1564121211835-e88c852648ab?auto=format&fit=crop&w=800&q=80'
    },
    { 
      id: 'wakaf', 
      icon: Sprout, 
      label: 'Wakaf', 
      actionPage: 'wakaf',
      description: 'Investasi amal jariyah abadi untuk perluasan asrama santri, sarana masjid, dan ruang tahfidz.',
      purpose: 'Pembangunan asrama santri, sumur bor air bersih, dan fasilitas pendidikan pesantren.',
      proofStat: '6 Gedung Asrama & Fasilitas Terbangun',
      proofImage: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=800&q=80'
    },
    { 
      id: 'qurban', 
      icon: Gift, 
      label: 'Qurban', 
      actionPage: 'qurban',
      description: 'Ibadah qurban berkah untuk hidangan bergizi santri tahfidz dan masyarakat dhuafa sekitar pesantren.',
      purpose: 'Penyembelihan syar’i dan distribusi daging qurban untuk ribuan santri dan warga sekitar.',
      proofStat: '850+ Hewan Qurban Terdistribusi',
      proofImage: 'https://images.unsplash.com/photo-1628189686445-568853b0e3dd?auto=format&fit=crop&w=800&q=80'
    },
    { 
      id: 'galang-dana', 
      icon: HeartHandshake, 
      label: 'Galang Dana', 
      actionPage: 'galang-dana',
      description: 'Inisiasi gerakan kebaikan mandiri untuk program dakwah, bantuan darurat santri, dan sosial kemanusiaan.',
      purpose: 'Penggalangan dana terverifikasi untuk tanggap medis santri dan program kebaikan yayasan.',
      proofStat: '120+ Program Terverifikasi',
      proofImage: 'https://images.unsplash.com/photo-1593113565214-80afcb4dd16c?auto=format&fit=crop&w=800&q=80'
    },
  ];

  const activeCategory = categories.find(c => c.id === activeTab) || categories[0];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 8 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
  };

  return (
    <section className="bg-white py-12 md:py-16 lg:py-20 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-10 max-w-2xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight"
          >
            Pilihan Berbagi
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 mt-2 text-xs sm:text-sm md:text-base leading-relaxed"
          >
            Pilih jalan kebaikanmu. Setiap kategori memiliki tujuan dan dampak nyata yang telah terbukti bagi para santri dan mustahik.
          </motion.p>
        </div>

        {/* Category Tabs: Proportional, centered & responsive */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex items-center justify-between sm:justify-center gap-2 sm:gap-4 md:gap-6 max-w-3xl mx-auto mb-8 sm:mb-10 overflow-x-auto scrollbar-hide pb-2 px-1"
        >
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeTab === cat.id;
            return (
              <motion.div 
                variants={itemVariants} 
                key={cat.id} 
                className="flex flex-col items-center cursor-pointer group shrink-0 w-[64px] sm:w-[84px] md:w-[96px]" 
                onClick={() => setActiveTab(cat.id)}
              >
                <div 
                  className={`w-[52px] h-[52px] sm:w-[64px] sm:h-[64px] md:w-[70px] md:h-[70px] rounded-2xl border flex items-center justify-center mb-2.5 transition-all duration-300 ${
                    isActive 
                      ? 'bg-emerald-600 border-emerald-600 shadow-md shadow-emerald-600/20 scale-105' 
                      : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50'
                  }`}
                >
                  <Icon 
                    className={`w-6 h-6 sm:w-7 sm:h-7 stroke-[1.75] transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-600'
                    }`} 
                  />
                </div>
                <span 
                  className={`text-[11px] sm:text-xs md:text-sm font-semibold text-center leading-tight transition-colors ${
                    isActive ? 'text-emerald-800 font-bold' : 'text-slate-600 group-hover:text-slate-900'
                  }`}
                >
                  {cat.label}
                </span>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Tab Content Card: Highly Proportional & Balanced on Desktop */}
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white rounded-3xl p-5 sm:p-7 md:p-8 lg:p-10 border border-slate-200/90 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center"
            >
              {/* Left Column: Details & Action */}
              <div className="w-full lg:col-span-7 order-2 lg:order-1 flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-100 text-xs font-semibold text-emerald-800 rounded-lg mb-3">
                    <activeCategory.icon className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Tentang Program {activeCategory.label}</span>
                  </div>

                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 mb-3 leading-snug tracking-tight">
                    {activeCategory.description}
                  </h3>
                  
                  <div className="space-y-3.5 my-5">
                    <div className="flex items-start gap-3">
                      <div className="bg-emerald-50 w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 border border-emerald-100">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Tujuan Penyaluran</div>
                        <div className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">{activeCategory.purpose}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-emerald-50 w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 border border-emerald-100">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Bukti Penyaluran Terverifikasi</div>
                        <div className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">{activeCategory.proofStat}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    onClick={() => setActivePage(activeCategory.actionPage)}
                    className="w-full sm:w-auto bg-emerald-600 text-white font-semibold text-xs sm:text-sm md:text-base px-6 sm:px-8 py-3.5 rounded-xl hover:bg-emerald-700 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm shadow-emerald-600/20 group"
                  >
                    <span>Mulai {activeCategory.label} Sekarang</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
              
              {/* Right Column: Proportional Aspect Photo (4:3 on desktop) */}
              <div className="w-full lg:col-span-5 order-1 lg:order-2">
                <div className="aspect-[16/10] sm:aspect-[4/3] lg:aspect-[4/3] rounded-2xl overflow-hidden shadow-xs border border-slate-200/80 relative group bg-slate-100">
                  <img 
                    src={activeCategory.proofImage} 
                    alt={`Penyaluran ${activeCategory.label}`} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent pointer-events-none"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="inline-block bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider text-white mb-1.5 border border-white/20">
                      Dokumentasi Lapangan
                    </div>
                    <div className="text-xs sm:text-sm font-semibold leading-tight drop-shadow-xs">
                      {activeCategory.label} Pesantren tersalurkan dengan transparan.
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
