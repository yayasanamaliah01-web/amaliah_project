import React from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  FileCheck,
  Users,
  LogOut,
  PieChart,
  TrendingUp,
  Wallet,
  Clock,
  FileText,
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const dataZiswaf = [
  { name: 'Jan', Zakat: 4000, Infaq: 2400, Wakaf: 2400 },
  { name: 'Feb', Zakat: 3000, Infaq: 1398, Wakaf: 2210 },
  { name: 'Mar', Zakat: 2000, Infaq: 9800, Wakaf: 2290 },
  { name: 'Apr', Zakat: 2780, Infaq: 3908, Wakaf: 2000 },
  { name: 'Mei', Zakat: 1890, Infaq: 4800, Wakaf: 2181 },
  { name: 'Jun', Zakat: 2390, Infaq: 3800, Wakaf: 2500 },
];

function AnalisDashboard() {
  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Analitik</h1>
        <p className="text-slate-500 text-sm mt-1">Pantau performa penghimpunan dan penyaluran dana ZISWAF.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-start justify-between">
          <div>
            <p className="text-sm font-bold text-slate-500 mb-1 uppercase tracking-wider">Total Penghimpunan</p>
            <h3 className="text-3xl font-bold text-slate-900">Rp 1.2B</h3>
            <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mt-2">
              <TrendingUp className="w-3 h-3" /> +12.5% dari bulan lalu
            </p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
            <Wallet className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-start justify-between">
          <div>
            <p className="text-sm font-bold text-slate-500 mb-1 uppercase tracking-wider">Total Penyaluran</p>
            <h3 className="text-3xl font-bold text-slate-900">Rp 850M</h3>
            <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mt-2">
              <TrendingUp className="w-3 h-3" /> +5.2% dari bulan lalu
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
            <PieChart className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-start justify-between">
          <div>
            <p className="text-sm font-bold text-slate-500 mb-1 uppercase tracking-wider">Donatur Aktif</p>
            <h3 className="text-3xl font-bold text-slate-900">4,205</h3>
            <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mt-2">
              <TrendingUp className="w-3 h-3" /> +124 donatur baru
            </p>
          </div>
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Tren Penghimpunan ZISWAF</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataZiswaf} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 600, color: '#475569' }} />
              <Bar dataKey="Zakat" fill="#0f766e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Infaq" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Wakaf" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function VerifikasiDonasi() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Verifikasi Donasi</h1>
        <p className="text-slate-500 text-sm mt-1">Validasi bukti transfer manual dari donatur sebelum diterbitkan kuitansi.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Cari ID transaksi, nama donatur..."
              className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
            />
          </div>
          <select className="px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500">
            <option>Menunggu Verifikasi</option>
            <option>Selesai</option>
          </select>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
              <th className="p-4">Tanggal & ID</th>
              <th className="p-4">Donatur</th>
              <th className="p-4">Program</th>
              <th className="p-4">Nominal</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="p-4">
                <div className="font-semibold text-slate-900">26 Ags 2026</div>
                <div className="text-xs text-slate-500 mt-0.5">TRX-9823</div>
              </td>
              <td className="p-4">
                <div className="font-semibold text-slate-900">Hamba Allah</div>
                <div className="text-xs text-slate-500 mt-0.5">BCA - 014***</div>
              </td>
              <td className="p-4">Zakat Penghasilan</td>
              <td className="p-4 font-bold text-slate-900">Rp 2.500.000</td>
              <td className="p-4 text-center">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
                  <Clock className="w-3 h-3" /> Menunggu
                </span>
              </td>
              <td className="p-4 text-center">
                <button className="text-emerald-700 font-bold hover:underline cursor-pointer">Periksa</button>
              </td>
            </tr>
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="p-4">
                <div className="font-semibold text-slate-900">25 Ags 2026</div>
                <div className="text-xs text-slate-500 mt-0.5">TRX-9820</div>
              </td>
              <td className="p-4">
                <div className="font-semibold text-slate-900">Budi Santoso</div>
                <div className="text-xs text-slate-500 mt-0.5">Mandiri - 131***</div>
              </td>
              <td className="p-4">Infaq Yatim</td>
              <td className="p-4 font-bold text-slate-900">Rp 500.000</td>
              <td className="p-4 text-center">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
                  <Clock className="w-3 h-3" /> Menunggu
                </span>
              </td>
              <td className="p-4 text-center">
                <button className="text-emerald-700 font-bold hover:underline cursor-pointer">Periksa</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function VerifikasiMustahik() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Verifikasi Mustahik</h1>
        <p className="text-slate-500 text-sm mt-1">Scoring dan validasi pengajuan penerima manfaat (asnaf).</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg text-slate-900 mb-1">Bpk. Supriyadi</h3>
              <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                <span className="px-2 py-0.5 bg-slate-100 rounded text-xs">Fakir Miskin</span>
                <span>Kec. Semarang Barat</span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
              Perlu Survey
            </span>
          </div>
          <div className="p-5 space-y-4 text-sm">
            <div>
              <div className="font-bold text-slate-700 mb-1">Pengajuan Bantuan:</div>
              <div className="text-slate-900">Bantuan Biaya Hidup (Sembako & Tunai)</div>
            </div>
            <div>
              <div className="font-bold text-slate-700 mb-1">Dokumen Terlampir:</div>
              <div className="flex gap-2">
                <span className="flex items-center gap-1 text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded border border-blue-100">
                  <FileText className="w-3 h-3" /> KTP & KK
                </span>
                <span className="flex items-center gap-1 text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded border border-blue-100">
                  <FileText className="w-3 h-3" /> SKTM Kelurahan
                </span>
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-slate-600">
              &quot;Terdampak musibah, memiliki 3 tanggungan yang masih bersekolah.&quot;
            </div>
          </div>
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer">
              Tolak
            </button>
            <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 cursor-pointer">
              Tugaskan Surveyor
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg text-slate-900 mb-1">Ibu Aminah</h3>
              <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                <span className="px-2 py-0.5 bg-slate-100 rounded text-xs">Gharimin</span>
                <span>Kec. Semarang Tengah</span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
              Tinjau Hasil Survey
            </span>
          </div>
          <div className="p-5 space-y-4 text-sm">
            <div>
              <div className="font-bold text-slate-700 mb-1">Pengajuan Bantuan:</div>
              <div className="text-slate-900">Pelunasan Tunggakan Pengobatan Rumah Sakit</div>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 text-emerald-800">
              <div className="font-bold text-xs uppercase mb-1">Hasil Survey Lapangan (Score: 85/100)</div>
              &quot;Kondisi sesuai dengan pengajuan. Sangat layak dibantu masuk asnaf Gharimin.&quot;
            </div>
          </div>
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
            <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 cursor-pointer">
              Setujui Bantuan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AnalisApp() {
  const { setUserRole, logout } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserRole('guest');
    navigate('/');
  };

  const navLinkStyle = ({ isActive }: { isActive: boolean }) =>
    `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
      isActive ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800 text-slate-300 hover:text-white'
    }`;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed inset-y-0 left-0 z-20">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3 text-white mb-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center font-bold text-lg">
              SI
            </div>
            <span className="font-bold text-lg tracking-tight">Portal Analis</span>
          </div>
          <p className="text-xs text-slate-400 font-medium">Yayasan Semarang Infak</p>
        </div>

        <div className="flex-1 py-6 space-y-1.5 px-3">
          <NavLink to="/analis" end className={navLinkStyle}>
            <BarChart3 className="w-5 h-5" /> Dashboard Analitik
          </NavLink>
          <NavLink to="/analis/verifikasi-donasi" className={navLinkStyle}>
            <FileCheck className="w-5 h-5" /> Verifikasi Donasi
          </NavLink>
          <NavLink to="/analis/verifikasi-mustahik" className={navLinkStyle}>
            <Users className="w-5 h-5" /> Verifikasi Mustahik
          </NavLink>
        </div>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <Routes>
          <Route index element={<AnalisDashboard />} />
          <Route path="verifikasi-donasi" element={<VerifikasiDonasi />} />
          <Route path="verifikasi-mustahik" element={<VerifikasiMustahik />} />
        </Routes>
      </main>
    </div>
  );
}
