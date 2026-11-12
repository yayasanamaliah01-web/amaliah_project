import React from 'react';
import Programs from '../components/Programs';
import { ArrowLeft } from 'lucide-react';

export default function ProgramsPage({ onSelectProgram, onBack }: { onSelectProgram: (id: string) => void, onBack: () => void }) {
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-white border-b border-slate-100 p-4 sticky top-0 z-10 flex items-center justify-center relative">
        <button onClick={onBack} className="absolute left-4 p-2 -ml-2 rounded-full hover:bg-slate-50">
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </button>
        <h1 className="font-bold text-lg text-slate-800">Donasi</h1>
      </div>
      <div className="pt-6 pb-2 bg-white mt-1.5 shadow-sm min-h-screen">
        <Programs onSelectProgram={onSelectProgram} />
      </div>
    </div>
  );
}

