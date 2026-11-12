import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import AdminPenerimaan from './pages/AdminPenerimaan';
import AdminPenyaluran from './pages/AdminPenyaluran';
import AdminProgram from './pages/AdminProgram';
import AdminMustahik from './pages/AdminMustahik';
import AdminKas from './pages/AdminKas';
import AdminWakaf from './pages/AdminWakaf';
import AdminHonor from './pages/AdminHonor';
import AdminPengadaan from './pages/AdminPengadaan';
import AdminLaporan from './pages/AdminLaporan';
import AdminPengaturan from './pages/AdminPengaturan';
import {
  LayoutDashboard,
  LogOut,
  Receipt,
  Send,
  Calendar,
  Users,
  Wallet,
  Landmark,
  UserCog,
  ShoppingCart,
  FileText,
  Settings,
  Menu,
} from 'lucide-react';

export default function AdminApp({ onExitAdmin }: { onExitAdmin?: () => void }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Extract current admin sub-page from URL path
  const subPath = location.pathname.replace(/^\/admin\/?/, '').split('/')[0] || 'dashboard';
  const activeAdminPage = subPath === '' ? 'dashboard' : subPath;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'penerimaan', label: 'Penerimaan Dana', icon: Receipt },
    { id: 'penyaluran', label: 'Penyaluran', icon: Send },
    { id: 'program', label: 'Program & Anggaran', icon: Calendar },
    { id: 'mustahik', label: 'Registry Mustahik', icon: Users },
    { id: 'kas', label: 'Kas & Bank', icon: Wallet },
    { id: 'wakaf', label: 'Wakaf & Aset', icon: Landmark },
    { id: 'honor', label: 'Kepengurusan & Honor', icon: UserCog },
    { id: 'pengadaan', label: 'Pengadaan', icon: ShoppingCart },
    { id: 'laporan', label: 'Laporan & Transparansi', icon: FileText },
    { id: 'pengaturan', label: 'Pengaturan & Audit', icon: Settings },
  ];

  const handleMenuClick = (id: string) => {
    navigate(`/admin/${id === 'dashboard' ? '' : id}`);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleExit = () => {
    if (onExitAdmin) {
      onExitAdmin();
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex text-slate-900 relative">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 ${
          isSidebarOpen ? 'w-64 translate-x-0' : '-translate-x-full md:translate-x-0 md:w-20'
        } shrink-0 bg-white border-r border-slate-200 text-slate-600 transition-all duration-300 flex flex-col h-screen`}
      >
        <div className="h-16 flex items-center px-4 border-b border-slate-100 shrink-0">
          <div className="w-8 h-8 bg-emerald-700 rounded-lg flex items-center justify-center text-white font-bold shrink-0 shadow-sm">
            SI
          </div>
          {isSidebarOpen && (
            <div className="ml-3 min-w-0">
              <span className="font-bold text-slate-900 text-sm tracking-tight block truncate">Semarang Infak</span>
              <span className="text-[10px] text-emerald-700 font-medium block truncate">Yayasan MAUN • Admin</span>
            </div>
          )}
        </div>
        <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          <nav className="space-y-1.5 px-3">
            {menuItems.map((item) => {
              const isActive = activeAdminPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.id)}
                  className={`w-full flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-bold'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'
                  } ${!isSidebarOpen ? 'md:justify-center px-0' : ''}`}
                  title={!isSidebarOpen ? item.label : undefined}
                >
                  <item.icon
                    className={`w-5 h-5 shrink-0 transition-colors ${
                      isActive ? 'text-emerald-700' : 'text-slate-400'
                    }`}
                  />
                  {isSidebarOpen && <span className="ml-3 text-sm text-left truncate">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-slate-100 shrink-0">
          <button
            onClick={handleExit}
            className={`flex items-center px-3 py-2.5 rounded-xl text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors w-full ${
              !isSidebarOpen ? 'md:justify-center px-0' : ''
            }`}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span className="ml-3 text-sm font-bold">Keluar Admin</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-3 md:gap-4">
            <button
              className="p-2 -ml-2 text-slate-500 hover:bg-slate-50 rounded-lg md:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="font-bold text-slate-800 hidden md:block">Yayasan Semarang Infak (MAUN)</h2>
            <div className="h-4 w-px bg-slate-300 hidden md:block"></div>
            <span className="text-xs md:text-sm font-medium text-slate-500 truncate">
              Periode: {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
            </span>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-2">
              <div className="hidden sm:block text-right">
                <div className="text-sm font-bold text-slate-800 leading-tight">Admin Utama</div>
                <div className="text-[10px] text-slate-500 font-medium">Super Admin</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 shrink-0">
                <Users className="w-4 h-4 text-slate-600" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          <Routes>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="penerimaan" element={<AdminPenerimaan />} />
            <Route path="penyaluran" element={<AdminPenyaluran />} />
            <Route path="program" element={<AdminProgram />} />
            <Route path="mustahik" element={<AdminMustahik />} />
            <Route path="kas" element={<AdminKas />} />
            <Route path="wakaf" element={<AdminWakaf />} />
            <Route path="honor" element={<AdminHonor />} />
            <Route path="pengadaan" element={<AdminPengadaan />} />
            <Route path="laporan" element={<AdminLaporan />} />
            <Route path="pengaturan" element={<AdminPengaturan />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
