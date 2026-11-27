import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AdminLayout, { AdminMenuGroup, AdminMenuItem } from './components/AdminLayout';
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
import AdminArtikel from './pages/AdminArtikel';
import AdminChat from './pages/AdminChat';
import {
  LayoutDashboard,
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
  BookOpen,
  MessageSquare,
} from 'lucide-react';

const MENU_GROUPS: AdminMenuGroup[] = [
  { id: 'overview', label: 'Dashboard' },
  { id: 'finance', label: 'Dana & Program' },
  { id: 'distribution', label: 'Penyaluran' },
  { id: 'operations', label: 'Operasional' },
  { id: 'system', label: 'Pengaturan' },
];

const MENU_ITEMS: AdminMenuItem[] = [
  { id: 'dashboard', label: 'Ringkasan', icon: LayoutDashboard, group: 'overview' },
  { id: 'laporan', label: 'Laporan & Transparansi', icon: FileText, group: 'overview' },
  { id: 'chat', label: 'Live Chat Donatur', icon: MessageSquare, group: 'overview' },

  { id: 'penerimaan', label: 'Penerimaan Dana', icon: Receipt, group: 'finance' },
  { id: 'program', label: 'Program & Anggaran', icon: Calendar, group: 'finance' },
  { id: 'kas', label: 'Kas & Bank', icon: Wallet, group: 'finance' },

  { id: 'penyaluran', label: 'Penyaluran', icon: Send, group: 'distribution' },
  { id: 'mustahik', label: 'Registry Mustahik', icon: Users, group: 'distribution' },
  { id: 'wakaf', label: 'Wakaf & Aset', icon: Landmark, group: 'distribution' },

  { id: 'honor', label: 'Kepengurusan & Honor', icon: UserCog, group: 'operations' },
  { id: 'pengadaan', label: 'Pengadaan', icon: ShoppingCart, group: 'operations' },
  { id: 'artikel', label: 'Artikel & Edukasi', icon: BookOpen, group: 'operations' },

  { id: 'pengaturan', label: 'Pengaturan & Audit', icon: Settings, group: 'system' },
];

const QUICK_RAIL_IDS = ['penerimaan', 'penyaluran', 'chat', 'laporan'];

export default function AdminApp({ onExitAdmin }: { onExitAdmin?: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();

  const subPath = location.pathname.replace(/^\/admin\/?/, '').split('/')[0] || 'dashboard';
  const activeAdminPage = subPath === '' ? 'dashboard' : subPath;

  const handleSelectPage = (id: string) => {
    navigate(`/admin/${id === 'dashboard' ? '' : id}`);
  };

  const handleExit = () => {
    if (onExitAdmin) {
      onExitAdmin();
    } else {
      navigate('/');
    }
  };

  const renderActivePage = () => {
    switch (activeAdminPage) {
      case 'chat':
        return <AdminChat />;
      case 'penerimaan':
        return <AdminPenerimaan />;
      case 'penyaluran':
        return <AdminPenyaluran />;
      case 'program':
        return <AdminProgram />;
      case 'mustahik':
        return <AdminMustahik />;
      case 'kas':
        return <AdminKas />;
      case 'wakaf':
        return <AdminWakaf />;
      case 'honor':
        return <AdminHonor />;
      case 'pengadaan':
        return <AdminPengadaan />;
      case 'artikel':
        return <AdminArtikel />;
      case 'laporan':
        return <AdminLaporan />;
      case 'pengaturan':
        return <AdminPengaturan />;
      case 'dashboard':
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <AdminLayout
      menuGroups={MENU_GROUPS}
      menuItems={MENU_ITEMS}
      quickRailIds={QUICK_RAIL_IDS}
      activePage={activeAdminPage}
      onSelectPage={handleSelectPage}
      onExit={handleExit}
    >
      {renderActivePage()}
    </AdminLayout>
  );
}
