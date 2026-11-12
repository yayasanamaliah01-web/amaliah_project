import React, { useState } from 'react';
import { 
  Building2, 
  LayoutDashboard, 
  Activity, 
  FileBarChart, 
  LogOut, 
  TrendingUp,
  Wallet,
  PieChart,
  Users,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  History,
  ArrowDownToLine,
  ArrowUpFromLine,
  Search,
  Filter,
  Target,
  Briefcase,
  Map,
  Award,
  Star,
  BarChart3
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { name: 'Jan', Penghimpunan: 4000, Penyaluran: 2400 },
  { name: 'Feb', Penghimpunan: 5000, Penyaluran: 3398 },
  { name: 'Mar', Penghimpunan: 6000, Penyaluran: 4800 },
  { name: 'Apr', Penghimpunan: 7780, Penyaluran: 5908 },
  { name: 'Mei', Penghimpunan: 6890, Penyaluran: 5800 },
  { name: 'Jun', Penghimpunan: 8390, Penyaluran: 7800 },
];

const activityLogs = [
  { id: 1, time: '10 menit yang lalu', actor: 'Ahmad (Amil)', role: 'penyalur', action: 'Mengunggah Berita Acara & Bukti Foto Penyaluran BAST/004/VIII', status: 'success' },
  { id: 2, time: '45 menit yang lalu', actor: 'Admin Pusat', role: 'admin', action: 'Memverifikasi dan Menerbitkan BAST untuk Penyaluran TRX-006', status: 'success' },
  { id: 3, time: '1 jam yang lalu', actor: 'Analis Keuangan', role: 'analis', action: 'Menyetujui 3 Mustahik baru (Kategori Fakir Miskin)', status: 'info' },
  { id: 4, time: '2 jam yang lalu', actor: 'Hamba Allah', role: 'user', action: 'Melakukan donasi Wakaf Sumur sebesar Rp 5.000.000', status: 'success' },
  { id: 5, time: '5 jam yang lalu', actor: 'Budi (Surveyor)', role: 'penyalur', action: 'Menyelesaikan survey lapangan untuk pengajuan biaya berobat', status: 'info' },
  { id: 6, time: '1 hari yang lalu', actor: 'Admin Pusat', role: 'admin', action: 'Menambahkan program baru: Bantuan Kemanusiaan Darurat', status: 'info' },
];

const incomingDonations = [
  { id: 'IN-1001', date: '26 Ags 2026', name: 'Hamba Allah', program: 'Zakat Penghasilan', amount: 'Rp 2.500.000', method: 'BCA', status: 'Berhasil' },
  { id: 'IN-1002', date: '25 Ags 2026', name: 'Budi Santoso', program: 'Infaq Yatim', amount: 'Rp 500.000', method: 'Mandiri', status: 'Berhasil' },
  { id: 'IN-1003', date: '25 Ags 2026', name: 'Siti Aminah', program: 'Wakaf Sumur', amount: 'Rp 1.000.000', method: 'QRIS', status: 'Berhasil' },
  { id: 'IN-1004', date: '24 Ags 2026', name: 'Anonim', program: 'Sedekah Subuh', amount: 'Rp 50.000', method: 'Gopay', status: 'Berhasil' },
];

const programPerformance = [
  { id: 1, name: 'Zakat Penghasilan', target: 5000000000, current: 4200000000, percentage: 84 },
  { id: 2, name: 'Wakaf Pembangunan Masjid', target: 2000000000, current: 1500000000, percentage: 75 },
  { id: 3, name: 'Infaq Anak Yatim', target: 1000000000, current: 950000000, percentage: 95 },
  { id: 4, name: 'Bantuan Kemanusiaan Darurat', target: 500000000, current: 120000000, percentage: 24 },
];

const teamPerformance = [
  { id: 1, name: 'Ahmad (Amil Lapangan)', area: 'Jawa Barat', tasksCompleted: 145, activeTasks: 3, rating: 4.9 },
  { id: 2, name: 'Budi (Surveyor)', area: 'Jawa Tengah', tasksCompleted: 98, activeTasks: 5, rating: 4.8 },
  { id: 3, name: 'Siti (Analis Data)', area: 'Kantor Pusat', tasksCompleted: 320, activeTasks: 12, rating: 5.0 },
  { id: 4, name: 'Rudi (Amil Lapangan)', area: 'Jawa Timur', tasksCompleted: 87, activeTasks: 2, rating: 4.6 },
];

export default function KetuaApp() {
  const { tasks, setUserRole } = useAppContext();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'program' | 'tim' | 'aktivitas' | 'laporan' | 'transaksi'>('dashboard');
  const [txFilter, setTxFilter] = useState<'semua' | 'masuk' | 'keluar'>('semua');

  // Combine and sort transactions for the list
  const allTransactions = [
    ...incomingDonations.map(d => ({ type: 'masuk', id: d.id, date: d.date, entity: d.name, program: d.program, amount: d.amount, method: d.method, status: d.status })),
    ...tasks.map(t => ({ type: 'keluar', id: t.id, date: t.date, entity: t.recipient, program: t.program, amount: t.amount, method: 'Bank Transfer / Tunai', status: t.status }))
  ].sort((a, b) => a.date > b.date ? -1 : 1);

  const filteredTransactions = allTransactions.filter(tx => txFilter === 'semua' || tx.type === txFilter);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed inset-y-0 left-0 z-20">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3 text-white mb-2">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center font-bold text-lg text-slate-900 shadow-md">K</div>
            <span className="font-bold text-xl tracking-tight">Portal Ketua</span>
          </div>
          <p className="text-xs text-slate-400 font-medium">Executive Dashboard</p>
        </div>
        
        <div className="flex-1 py-6 space-y-1 px-3 overflow-y-auto">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'dashboard' ? 'bg-amber-500/10 text-amber-500' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <LayoutDashboard className="w-5 h-5" /> Executive Summary
          </button>
          <button 
            onClick={() => setActiveTab('program')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'program' ? 'bg-amber-500/10 text-amber-500' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <Target className="w-5 h-5" /> Pantauan Program
          </button>
          <button 
            onClick={() => setActiveTab('tim')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'tim' ? 'bg-amber-500/10 text-amber-500' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <Briefcase className="w-5 h-5" /> Kinerja Tim & Amil
          </button>
          <button 
            onClick={() => setActiveTab('aktivitas')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'aktivitas' ? 'bg-amber-500/10 text-amber-500' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <Activity className="w-5 h-5" /> Log Aktivitas Sistem
          </button>
          <button 
            onClick={() => setActiveTab('transaksi')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'transaksi' ? 'bg-amber-500/10 text-amber-500' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <History className="w-5 h-5" /> Riwayat Transaksi
          </button>
          <button 
            onClick={() => setActiveTab('laporan')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'laporan' ? 'bg-amber-500/10 text-amber-500' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <FileBarChart className="w-5 h-5" /> Laporan Komprehensif
          </button>
        </div>

        <div className="p-4 border-t border-slate-800">
          <button onClick={() => setUserRole('guest')} className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
            <LogOut className="w-4 h-4" /> Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        
        {activeTab === 'dashboard' && (
          <div className="space-y-8 max-w-6xl">
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Executive Dashboard</h1>
                <p className="text-slate-500 text-sm mt-1">Ringkasan kesehatan finansial dan operasional Yayasan.</p>
              </div>
              <div className="px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-sm font-bold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Mode Pengawasan
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600 mb-4 border border-slate-100">
                  <Building2 className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Saldo Kas Yayasan</p>
                <h3 className="text-2xl font-bold text-slate-900">Rp 4.5B</h3>
              </div>
              
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-4 border border-emerald-100">
                  <Wallet className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Penghimpunan</p>
                <h3 className="text-2xl font-bold text-slate-900">Rp 12.8B</h3>
                <p className="text-xs font-semibold text-emerald-600 mt-2 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +15% YTD</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4 border border-blue-100">
                  <PieChart className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Penyaluran</p>
                <h3 className="text-2xl font-bold text-slate-900">Rp 8.3B</h3>
                <p className="text-xs font-semibold text-slate-500 mt-2">64.8% dari Penghimpunan</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-4 border border-purple-100">
                  <Users className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Pengguna (User)</p>
                <h3 className="text-2xl font-bold text-slate-900">24,502</h3>
                <p className="text-xs font-semibold text-emerald-600 mt-2 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Aktif berdonasi</p>
              </div>
            </div>

            {/* Chart Section */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Arus Kas Penghimpunan vs Penyaluran (Jutaan Rupiah)</h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <Tooltip contentStyle={{borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                    <Area type="monotone" dataKey="Penghimpunan" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorIn)" />
                    <Area type="monotone" dataKey="Penyaluran" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorOut)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'program' && (
          <div className="space-y-6 max-w-5xl">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Pantauan Program & Kampanye</h1>
              <p className="text-slate-500 text-sm mt-1">Monitoring pencapaian target donasi berdasarkan program penyaluran.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {programPerformance.map(prog => (
                <div key={prog.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">{prog.name}</h3>
                      <p className="text-sm text-slate-500 mt-1">Target: Rp {(prog.target / 1000000).toLocaleString('id-ID')} Juta</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${prog.percentage >= 80 ? 'bg-emerald-50 text-emerald-700' : prog.percentage >= 50 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'}`}>
                      {prog.percentage}% Tercapai
                    </div>
                  </div>
                  
                  <div className="w-full bg-slate-100 rounded-full h-3 mb-2 overflow-hidden">
                    <div 
                      className={`h-3 rounded-full ${prog.percentage >= 80 ? 'bg-emerald-500' : prog.percentage >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`} 
                      style={{ width: `${prog.percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>Terkumpul: Rp {(prog.current / 1000000).toLocaleString('id-ID')} Juta</span>
                    <span>Sisa: Rp {((prog.target - prog.current) / 1000000).toLocaleString('id-ID')} Juta</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tim' && (
          <div className="space-y-6 max-w-5xl">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Kinerja Tim & Amil Lapangan</h1>
              <p className="text-slate-500 text-sm mt-1">Monitoring produktivitas dan penilaian performa petugas di lapangan.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 flex items-center gap-2"><Award className="w-5 h-5 text-amber-500" /> Leaderboard Produktivitas</h3>
              </div>
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                    <th className="p-4">Nama Petugas</th>
                    <th className="p-4">Wilayah Tugas</th>
                    <th className="p-4 text-center">Tugas Selesai</th>
                    <th className="p-4 text-center">Tugas Aktif</th>
                    <th className="p-4 text-center">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {teamPerformance.map(team => (
                    <tr key={team.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-bold text-slate-900">{team.name}</td>
                      <td className="p-4 text-slate-600 flex items-center gap-2"><Map className="w-4 h-4 text-slate-400" /> {team.area}</td>
                      <td className="p-4 text-center font-bold text-emerald-600">{team.tasksCompleted}</td>
                      <td className="p-4 text-center font-bold text-amber-600">{team.activeTasks}</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1 font-bold text-slate-800">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {team.rating}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'aktivitas' && (
          <div className="space-y-6 max-w-5xl">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Log Aktivitas Sistem</h1>
              <p className="text-slate-500 text-sm mt-1">Pantau seluruh aktivitas operasional dari Amil, Admin, Analis, hingga Donatur secara real-time.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 shadow-sm">Semua Peran</span>
                  <span className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-500 cursor-pointer hover:bg-slate-200">Admin</span>
                  <span className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-500 cursor-pointer hover:bg-slate-200">Penyalur</span>
                </div>
              </div>
              <div className="p-6">
                <div className="relative border-l-2 border-slate-100 ml-3 space-y-8 pb-4">
                  {activityLogs.map((log, index) => (
                    <div key={log.id} className="relative pl-8">
                      {/* Timeline Dot */}
                      <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-4 border-white shadow-sm ${
                        log.status === 'success' ? 'bg-emerald-500' : 'bg-blue-500'
                      }`}></div>
                      
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-sm text-slate-900">{log.actor}</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                              {log.role}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600">{log.action}</p>
                        </div>
                        <div className="text-xs font-medium text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {log.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transaksi' && (
          <div className="space-y-6 max-w-6xl">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Riwayat Transaksi Global</h1>
              <p className="text-slate-500 text-sm mt-1">Laporan mutasi keseluruhan arus kas donasi masuk dan penyaluran dana keluar.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 bg-slate-50/50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex gap-2">
                  <button 
                    onClick={() => setTxFilter('semua')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${txFilter === 'semua' ? 'bg-slate-800 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    Semua Transaksi
                  </button>
                  <button 
                    onClick={() => setTxFilter('masuk')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors ${txFilter === 'masuk' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    <ArrowDownToLine className="w-4 h-4" /> Uang Masuk
                  </button>
                  <button 
                    onClick={() => setTxFilter('keluar')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors ${txFilter === 'keluar' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    <ArrowUpFromLine className="w-4 h-4" /> Uang Keluar
                  </button>
                </div>
                <div className="flex gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="Cari ID, Nama..." className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-amber-500" />
                  </div>
                  <button className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50">
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                      <th className="p-4">Tipe & ID</th>
                      <th className="p-4">Tanggal</th>
                      <th className="p-4">Donatur / Penerima</th>
                      <th className="p-4">Program</th>
                      <th className="p-4">Metode</th>
                      <th className="p-4">Nominal</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {filteredTransactions.map(tx => (
                      <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {tx.type === 'masuk' ? (
                              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                <ArrowDownToLine className="w-4 h-4" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                <ArrowUpFromLine className="w-4 h-4" />
                              </div>
                            )}
                            <div>
                              <div className={`text-xs font-bold uppercase tracking-wider ${tx.type === 'masuk' ? 'text-emerald-700' : 'text-blue-700'}`}>
                                {tx.type === 'masuk' ? 'IN' : 'OUT'}
                              </div>
                              <div className="text-xs text-slate-500 mt-0.5">{tx.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-slate-600">{tx.date}</td>
                        <td className="p-4 font-bold text-slate-900">{tx.entity}</td>
                        <td className="p-4 text-slate-700">{tx.program}</td>
                        <td className="p-4 text-slate-600">{tx.method}</td>
                        <td className={`p-4 font-bold ${tx.type === 'masuk' ? 'text-emerald-600' : 'text-slate-900'}`}>
                          {tx.type === 'masuk' ? '+' : '-'}{tx.amount}
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                            tx.status === 'Berhasil' || tx.status === 'Selesai' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                            'bg-amber-50 text-amber-700 border-amber-100'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'laporan' && (
          <div className="space-y-6 max-w-5xl">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Laporan Komprehensif</h1>
              <p className="text-slate-500 text-sm mt-1">Pusat unduhan berkas laporan operasional dan kepatuhan syariah.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center shrink-0">
                  <FileBarChart className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900">Laporan Keuangan Q3 2026</h3>
                  <p className="text-sm text-slate-500 mt-1 mb-4">Neraca saldo, arus kas, dan rasio penyaluran dana ZISWAF kuartal 3.</p>
                  <button className="flex items-center gap-2 text-sm font-bold text-rose-600 hover:text-rose-700">
                    Unduh PDF <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                  <FileBarChart className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900">Audit Kepatuhan Syariah 2025</h3>
                  <p className="text-sm text-slate-500 mt-1 mb-4">Laporan hasil audit internal dan eksternal DPS (Dewan Pengawas Syariah).</p>
                  <button className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700">
                    Unduh PDF <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900">Rekapitulasi BAST Bulan Ini</h3>
                  <p className="text-sm text-slate-500 mt-1 mb-4">Kumpulan Berita Acara Serah Terima (BAST) yang telah divalidasi sistem.</p>
                  <button className="flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700">
                    Buka Arsip <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
