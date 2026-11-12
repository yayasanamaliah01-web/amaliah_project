import React from 'react';
import { Heart, Wallet, HeartHandshake, Sprout, Gift } from 'lucide-react';
import { motion } from 'motion/react';

export default function SimpleCategoryGrid({ setActivePage }: { setActivePage: (page: string) => void }) {
  const categories = [
    { id: 'donasi', icon: Heart, label: 'Donasi', action: () => setActivePage('programs') },
    { id: 'zakat', icon: Wallet, label: 'Zakat', action: () => setActivePage('zakat') },
    { id: 'wakaf', icon: Sprout, label: 'Wakaf', action: () => setActivePage('wakaf') },
    { id: 'qurban', icon: Gift, label: 'Qurban', action: () => setActivePage('qurban') },
    { id: 'galang-dana', icon: HeartHandshake, label: 'Galang Dana', action: () => setActivePage('galang-dana') },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
  };

  return (
    <section className="bg-white pt-4 pb-4 md:pt-4 md:pb-6">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-lg md:text-xl font-semibold md:font-bold text-slate-800 mb-5"
        >
          Pilihan Berbagi
        </motion.h2>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex justify-between md:justify-center md:gap-8 max-w-2xl mx-auto overflow-x-auto scrollbar-hide"
        >
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <motion.div variants={itemVariants} key={cat.id} className="flex flex-col items-center cursor-pointer group flex-shrink-0 w-[60px] md:w-[80px]" onClick={cat.action}>
                <div className="w-[50px] h-[50px] md:w-16 md:h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mb-2 transition-transform group-hover:scale-105 hover:bg-maun-50 hover:border-maun-200">
                  <Icon className="w-6 h-6 md:w-7 md:h-7 stroke-[1.5] text-maun-600" />
                </div>
                <span className="text-[11px] md:text-xs font-semibold text-slate-700 text-center leading-tight">{cat.label}</span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
