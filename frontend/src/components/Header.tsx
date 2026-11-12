import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, User, MessageCircle } from 'lucide-react';

export default function Header({
  isLoggedIn,
  onLogout,
}: {
  activePage?: string;
  setActivePage?: (page: string) => void;
  openCheckout?: () => void;
  isLoggedIn: boolean;
  onLogin?: () => void;
  onLogout: () => void;
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinkStyle = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive ? 'text-emerald-700 font-semibold' : 'text-slate-600 hover:text-emerald-700'
    }`;

  return (
    <header
      className={`w-full sticky top-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs'
          : 'bg-white border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo Brand Link */}
          <Link
            to={isLoggedIn ? '/dashboard' : '/'}
            className="flex items-center cursor-pointer flex-shrink-0"
          >
            <img
              src="/images/logo.jpg"
              alt="Semarang Infak"
              className="h-10 sm:h-11 w-auto object-contain rounded-full shadow-xs"
            />
          </Link>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-xl relative ml-4 items-center h-9">
            <Search className="w-4 h-4 absolute left-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari program donasi atau zakat..."
              className="w-full h-full pl-10 pr-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full text-sm focus:border-emerald-500 focus:bg-white outline-none transition-colors"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigate('/programs');
                }
              }}
            />
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 flex-shrink-0">
            <NavLink to={isLoggedIn ? '/dashboard' : '/'} className={navLinkStyle} end>
              Beranda
            </NavLink>
            <NavLink to="/programs" className={navLinkStyle}>
              Donasi
            </NavLink>
            <NavLink to="/zakat" className={navLinkStyle}>
              Zakat
            </NavLink>
            <NavLink to="/advisor" className={navLinkStyle}>
              Konsultasi
            </NavLink>

            <div className="w-px h-6 bg-slate-200 mx-2"></div>

            {!isLoggedIn ? (
              <Link
                to="/login"
                className="text-sm md:text-base font-semibold bg-emerald-600 text-white px-6 py-2.5 rounded-full hover:bg-emerald-700 transition-colors shadow-xs"
              >
                Masuk
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="text-xs sm:text-sm font-semibold text-emerald-700 hover:bg-emerald-50/50 border border-emerald-600 px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1 shrink-0"
                >
                  Dashboard
                </Link>
                <button
                  onClick={onLogout}
                  className="text-sm font-medium text-slate-500 hover:text-rose-500 transition-colors cursor-pointer"
                >
                  Keluar
                </button>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `w-8 h-8 border rounded-full flex items-center justify-center transition-colors ${
                      isActive
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                        : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                    }`
                  }
                >
                  <User className="w-4 h-4" />
                </NavLink>
              </div>
            )}
          </nav>

          {/* Mobile Search and Icons */}
          <div className="flex md:hidden flex-1 items-center justify-end gap-2.5">
            {isLoggedIn ? (
              <Link
                to="/dashboard"
                className="text-xs font-semibold text-emerald-700 hover:bg-emerald-50/50 border border-emerald-600 px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1 shrink-0 active:scale-95"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                className="text-xs font-semibold bg-emerald-600 text-white px-4 py-1.5 rounded-full flex-shrink-0"
              >
                Masuk
              </Link>
            )}

            <NavLink
              to="/advisor"
              className={({ isActive }) =>
                `p-2 rounded-full flex-shrink-0 ${
                  isActive ? 'text-emerald-700 bg-emerald-50' : 'text-emerald-700 hover:bg-slate-50'
                }`
              }
            >
              <MessageCircle className="w-5 h-5 stroke-[1.5]" />
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  );
}
