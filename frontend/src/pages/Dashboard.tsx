import React from 'react';
import UserDashboardHero from '../components/UserDashboardHero';
import SimpleCategoryGrid from '../components/SimpleCategoryGrid';
import Programs from '../components/Programs';
import ContinuousPrograms from '../components/ContinuousPrograms';

export default function DashboardPage({ openCheckout, setActivePage, onSelectProgram }: { openCheckout: () => void, setActivePage: (page: string) => void, onSelectProgram: (id: string) => void }) {
  return (
    <div className="bg-white min-h-screen">
      <UserDashboardHero setActivePage={setActivePage} />
      <SimpleCategoryGrid setActivePage={setActivePage} />
      <div className="h-2 w-full bg-slate-50 border-y border-slate-100"></div>
      <ContinuousPrograms onSelectProgram={onSelectProgram} />
      <div className="h-2 w-full bg-slate-50 border-y border-slate-100"></div>
      <div className="pt-2">
        <Programs onSelectProgram={onSelectProgram} />
      </div>
    </div>
  );
}
