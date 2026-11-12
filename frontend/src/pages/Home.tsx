import React from 'react';
import { MessageCircle } from 'lucide-react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import DistributionMap from '../components/DistributionMap';
import Articles from '../components/Articles';
import Programs from '../components/Programs';
import CategoryGrid from '../components/CategoryGrid';
import RecentActivities from '../components/RecentActivities';

export default function HomePage({ openCheckout, setActivePage }: { openCheckout: () => void, setActivePage: (page: string) => void }) {
  return (
    <>
      <Hero openCheckout={openCheckout} setActivePage={setActivePage} />
      <CategoryGrid setActivePage={setActivePage} />
      <RecentActivities setActivePage={setActivePage} />
      <Features />
      <DistributionMap />
      <Articles />

      {/* Floating Chat Button */}
      <button 
        onClick={() => setActivePage('advisor')}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-11 h-11 sm:w-14 sm:h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-emerald-700 active:scale-95 hover:scale-105 transition-all z-40 group"
        aria-label="Chat Advisor"
      >
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
        {/* Tooltip */}
        <span className="absolute right-14 sm:right-16 bg-slate-900 text-white text-xs font-semibold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md">
          Tanya Amaliah AI
        </span>
      </button>
    </>
  );
}

