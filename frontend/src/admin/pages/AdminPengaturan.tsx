import React, { useState } from 'react';
import { Settings, Shield, History, Users, ArrowLeft, Plus, Edit2, Trash2 } from 'lucide-react';

export default function AdminPengaturan() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  if (activeMenu === 'users') {
    return (
      <div className="p-6 bg-slate-50 min-h-full">
        <button onClick={() => setActiveMenu(null)} className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Pengaturan
        </button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Role & Akses Pengguna</h1>
            <p className="text-sm text-slate-500 mt-1">Kelola daftar admin, bendahara, dan staf yayasan.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-maun-600 text-white rounded-lg text-sm font-bold hover:bg-maun-700 transition-colors">
            <Plus className="w-4 h-4 stroke-[3]" /> Tambah Pengguna
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                <th className="p-4">Nama & Email</th>
                <th className="p-4">Role Akses</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4">
                  <div className="text-sm font-bold text-slate-900">Admin Utama</div>
                  <div className="text-xs text-slate-500 mt-0.5">admin@maun.id</div>
                </td>
                <td className="p-4 text-sm font-semibold text-slate-700">
                  <span className="bg-purple-50 text-purple-700 px-2.5 py-1 rounded-md text-xs border border-purple-100">Super Admin</span>
                </td>
                <td className="p-4 text-center">
                  <span className="inline-flex px-2 py-1 bg-emerald-50 text-emerald-600 rounded text-[11px] font-bold">Aktif</span>
                </td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4">
                  <div className="text-sm font-bold text-slate-900">Bpk. H. Abdurrahman</div>
                  <div className="text-xs text-slate-500 mt-0.5">ketua@maun.id</div>
                </td>
                <td className="p-4 text-sm font-semibold text-slate-700">
                  <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-xs border border-blue-100">Ketua Yayasan</span>
                </td>
                <td className="p-4 text-center">
                  <span className="inline-flex px-2 py-1 bg-emerald-50 text-emerald-600 rounded text-[11px] font-bold">Aktif</span>
                </td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4">
                  <div className="text-sm font-bold text-slate-900">Siti Aisyah</div>
                  <div className="text-xs text-slate-500 mt-0.5">bendahara@maun.id</div>
                </td>
                <td className="p-4 text-sm font-semibold text-slate-700">
                  <span className="bg-amber-50 text-amber-700 px-2.5 py-1 rounded-md text-xs border border-amber-100">Bendahara</span>
                </td>
                <td className="p-4 text-center">
                  <span className="inline-flex px-2 py-1 bg-emerald-50 text-emerald-600 rounded text-[11px] font-bold">Aktif</span>
                </td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 min-h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pengaturan & Audit</h1>
          <p className="text-sm text-slate-500 mt-1">Konfigurasi master data, akses pengguna, dan log aktivitas.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-maun-500 transition-colors group">
          <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600 mb-3 group-hover:bg-maun-50 group-hover:text-maun-600 transition-colors">
            <Settings className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 mb-1">Master Data</h3>
          <p className="text-xs text-slate-500">Kategori dana, program, asnaf, akun kas.</p>
        </div>
        
        <div onClick={() => setActiveMenu('users')} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-maun-500 transition-colors group">
          <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600 mb-3 group-hover:bg-maun-50 group-hover:text-maun-600 transition-colors">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 mb-1">Role & Akses Pengguna</h3>
          <p className="text-xs text-slate-500">Atur admin, bendahara, ketua, dan auditor.</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-maun-500 transition-colors group">
          <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600 mb-3 group-hover:bg-maun-50 group-hover:text-maun-600 transition-colors">
            <History className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 mb-1">Log Aktivitas</h3>
          <p className="text-xs text-slate-500">Jejak audit: siapa mengubah apa dan kapan.</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-maun-500 transition-colors group">
          <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600 mb-3 group-hover:bg-maun-50 group-hover:text-maun-600 transition-colors">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 mb-1">Periode Akuntansi</h3>
          <p className="text-xs text-slate-500">Kunci/tutup buku akhir bulan.</p>
        </div>
      </div>
    </div>
  );
}
