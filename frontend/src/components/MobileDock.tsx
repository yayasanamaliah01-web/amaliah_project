import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Newspaper, History, User } from 'lucide-react';

export default function MobileDock() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[64px] bg-white border-t border-slate-200 z-50 pb-safe shadow-lg">
      <div className="flex items-center justify-between h-full px-1">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 w-1/4 h-full border-none bg-transparent transition-colors ${
              isActive ? 'text-emerald-700 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Home className={`w-[22px] h-[22px] ${isActive ? 'stroke-[2.2]' : 'stroke-[1.5]'}`} />
              <span className="text-[10px]">Beranda</span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/articles"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 w-1/4 h-full border-none bg-transparent transition-colors ${
              isActive ? 'text-emerald-700 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Newspaper className={`w-[22px] h-[22px] ${isActive ? 'stroke-[2.2]' : 'stroke-[1.5]'}`} />
              <span className="text-[10px]">Artikel</span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/impact"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 w-1/4 h-full border-none bg-transparent transition-colors ${
              isActive ? 'text-emerald-700 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <History className={`w-[22px] h-[22px] ${isActive ? 'stroke-[2.2]' : 'stroke-[1.5]'}`} />
              <span className="text-[10px]">Riwayat</span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 w-1/4 h-full border-none bg-transparent transition-colors ${
              isActive ? 'text-emerald-700 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <User className={`w-[22px] h-[22px] ${isActive ? 'stroke-[2.2]' : 'stroke-[1.5]'}`} />
              <span className="text-[10px]">Profil</span>
            </>
          )}
        </NavLink>
      </div>
    </nav>
  );
}
