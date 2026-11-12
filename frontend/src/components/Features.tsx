import React from 'react';
import { ShieldCheck, FileSearch, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function Features() {
  const pillars = [
    { 
      id: 'mudah', 
      icon: ShieldCheck, 
      title: 'Donasi Mudah & Aman', 
      description: 'Cukup beberapa klik untuk menyalurkan niat baikmu. Kami menggunakan sistem pembayaran yang terenkripsi dan diawasi.' 
    },
    { 
      id: 'transparan', 
      icon: FileSearch, 
      title: 'Laporan Transparan', 
      description: 'Kamu bisa memantau langsung kemana donasimu disalurkan melalui laporan yang rutin kami perbarui.' 
    },
    { 
      id: 'dampak', 
      icon: CheckCircle2, 
      title: 'Tepat Sasaran', 
      description: 'Tim kami di lapangan memastikan bantuanmu sampai ke tangan mereka yang benar-benar membutuhkan.' 
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <section className="bg-white py-16 md:py-24 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-2xl mx-auto mb-12 md:mb-16"
        >
          <h2 className="text-2xl md:text-3xl font-semibold md:font-bold text-slate-900 mb-4 tracking-tight">Mengapa Berbagi Melalui MAUN?</h2>
          <p className="text-sm md:text-base text-slate-600">
            Kami memastikan setiap niat baikmu tersalurkan dengan aman, mudah, dan penuh makna.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
        >
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <motion.div variants={itemVariants} key={pillar.id} className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-100 flex flex-col items-start hover:shadow-sm transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-6 shadow-sm text-maun-600">
                  <Icon className="w-6 h-6 stroke-[1.5]" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-3">{pillar.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{pillar.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
