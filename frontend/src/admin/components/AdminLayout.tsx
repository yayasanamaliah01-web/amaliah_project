import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LogOut,
  Settings,
  Menu,
  X,
  MessageSquare,
  Bell,
} from 'lucide-react';

export interface AdminMenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  group: string;
}

export interface AdminMenuGroup {
  id: string;
  label: string;
}

interface AdminLayoutProps {
  menuGroups: AdminMenuGroup[];
  menuItems: AdminMenuItem[];
  quickRailIds: string[];
  activePage: string;
  onSelectPage: (id: string) => void;
  onExit: () => void;
  children: React.ReactNode;
}

/**
 * Shared layout shell for the Admin Portal with aligned header & left icon rail,
 * stable scrollbar gutter (prevents horizontal layout shift), and smooth page transitions.
 */
export default function AdminLayout({
  menuGroups,
  menuItems,
  quickRailIds,
  activePage,
  onSelectPage,
  onExit,
  children,
}: AdminLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeItem = menuItems.find((m) => m.id === activePage) || menuItems[0];
  const activeGroupId = activeItem.group;
  const activeGroupItems = menuItems.filter((m) => m.group === activeGroupId);
  const quickRailItems = quickRailIds
    .map((id) => menuItems.find((m) => m.id === id))
    .filter((item): item is AdminMenuItem => Boolean(item));

  const handleSelect = (id: string) => {
    onSelectPage(id);
    setMobileMenuOpen(false);
  };

  const handleGroupClick = (groupId: string) => {
    const firstItem = menuItems.find((m) => m.group === groupId);
    if (firstItem) {
      handleSelect(firstItem.id);
    }
  };

  return (
    <div
      className="min-h-screen bg-slate-50 font-sans flex flex-col text-slate-900"
      style={{ scrollbarGutter: 'stable' }}
    >
      {/* Top Minimalist Header — shares exact max-w & horizontal padding with body */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40">
        <div className="max-w-[1440px] w-full mx-auto px-4 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 lg:hidden cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
            <button
              onClick={() => handleSelect('dashboard')}
              className="flex items-center gap-2.5 text-left cursor-pointer"
            >
              <div className="w-10 h-10 bg-emerald-700 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0">
                SI
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-slate-900 text-sm tracking-tight block leading-none">
                  Amaliah
                </span>
                <span className="text-[11px] text-slate-400 font-medium block mt-0.5">
                  Admin Portal
                </span>
              </div>
            </button>
          </div>

          {/* Center Top Pill Navigation */}
          <nav className="hidden lg:flex items-center bg-[#F6F7F9] border border-slate-200/80 rounded-full p-1 gap-0.5">
            {menuGroups.map((group) => {
              const isGroupActive = activeGroupId === group.id;
              return (
                <button
                  key={group.id}
                  onClick={() => handleGroupClick(group.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer ${
                    isGroupActive
                      ? 'bg-white text-slate-900 border border-slate-200/80'
                      : 'text-slate-500 hover:text-slate-800 border border-transparent'
                  }`}
                >
                  {group.label}
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleSelect('chat')}
              title="Live Chat Donatur"
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
                activePage === 'chat'
                  ? 'bg-emerald-700 border-emerald-700 text-white'
                  : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleSelect('laporan')}
              title="Laporan & Transparansi"
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
                activePage === 'laporan'
                  ? 'bg-emerald-700 border-emerald-700 text-white'
                  : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <Bell className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-white border border-slate-200">
              <div className="w-7 h-7 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold text-xs">
                A
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-semibold text-slate-800 leading-none">Admin Utama</div>
                <div className="text-[10px] text-slate-400 mt-0.5 leading-none">Super Admin</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Dropdown Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-3 z-30">
          <div className="flex flex-wrap gap-1.5">
            {menuItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-emerald-700 border-emerald-700 text-white'
                      : 'bg-[#F6F7F9] border-slate-200 text-slate-600'
                  }`}
                >
                  <item.icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
          <div className="pt-2 border-t border-slate-100 flex justify-end">
            <button
              onClick={onExit}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-rose-600 border border-rose-200 bg-rose-50/50 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar Admin</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Shell — aligned exactly with header max-w-[1440px] & px-4 lg:px-8 */}
      <div className="flex-1 flex max-w-[1440px] w-full mx-auto px-4 lg:px-8 py-6 gap-6 lg:gap-8">
        {/* Slim Grouped Left Icon Rail (Desktop, flush left with SI logo) */}
        <aside className="hidden lg:flex flex-col justify-between shrink-0 w-12 sticky top-21 h-[calc(100vh-6.5rem)]">
          <div className="flex flex-col gap-3">
            {/* Group 1: Active Section Icons */}
            <div className="bg-white border border-slate-200/90 rounded-full p-1.5 flex flex-col items-center gap-1">
              {activeGroupItems.map((item) => {
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    title={item.label}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-150 cursor-pointer ${
                      isActive
                        ? 'bg-emerald-700 text-white'
                        : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                  </button>
                );
              })}
            </div>

            {/* Group 2: Quick Jump Icons */}
            <div className="bg-white border border-slate-200/90 rounded-full p-1.5 flex flex-col items-center gap-1">
              {quickRailItems.map((item) => {
                const isActive = activePage === item.id;
                return (
                  <button
                    key={`quick-${item.id}`}
                    onClick={() => handleSelect(item.id)}
                    title={item.label}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-150 cursor-pointer ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Group 3: Settings & Exit */}
          <div className="bg-white border border-slate-200/90 rounded-full p-1.5 flex flex-col items-center gap-1">
            <button
              onClick={() => handleSelect('pengaturan')}
              title="Pengaturan & Audit"
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-150 cursor-pointer ${
                activePage === 'pengaturan'
                  ? 'bg-emerald-700 text-white'
                  : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
              }`}
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={onExit}
              title="Keluar Admin"
              className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors duration-150 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 flex flex-col">
          {/* Smooth Animated Page Container */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePage}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.16, ease: 'easeOut' }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
