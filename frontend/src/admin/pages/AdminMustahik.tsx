import React, { useState } from 'react';
import { Search, Plus, Filter, FileText, CheckCircle2, AlertCircle, ArrowLeft, User, MapPin, Calendar, Heart } from 'lucide-react';

export default function AdminMustahik() {
  const [selectedMustahik, setSelectedMustahik] = useState<any>(null);

  const mustahiks = [
    { id: 'MST-001', name: 'Ahmad Subarjo', nik: '3201123456789001', asnaf: 'Fakir', dependents: 4, totalBantuan: 'Rp 2.500.000', status: 'Aktif', address: 'Jl. Merdeka Gg. 3 No. 4, Jakarta', joined: '12 Jan 2026', phone: '081234567890' },
    { id: 'MST-002', name: 'Siti Rohmah', nik: '3202987654321002', asnaf: 'Miskin', dependents: 2, totalBantuan: 'Rp 1.200.000', status: 'Perlu Verifikasi', address: 'Kampung Sawah RT 02 RW 01', joined: '05 Mar 2026', phone: '-' },
    { id: 'MST-003', name: 'Budi Santoso', nik: '3203456789012345', asnaf: 'Gharimin', dependents: 3, totalBantuan: 'Rp 5.000.000', status: 'Aktif', address: 'Komp. Beringin Blok B2', joined: '20 Jul 2026', phone: '089876543210' },
    { id: 'MST-004', name: 'TPA Al-Huda', nik: '-', asnaf: 'Fisabilillah', dependents: 50, totalBantuan: 'Rp 10.000.000', status: 'Aktif', address: 'Ciputat Raya No 10', joined: '01 Feb 2026', phone: '021-7654321' },
  ];

  if (selectedMustahik) {
    return (
      <div className="p-6 bg-slate-50 min-h-full">
        <button onClick={() => setSelectedMustahik(null)} className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Mustahik
        </button>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-center">
              <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-sm mx-auto flex items-center justify-center mb-4">
                <User className="w-10 h-10 text-slate-400" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">{selectedMustahik.name}</h2>
              <div className="inline-flex px-2.5 py-1 bg-amaliah-50 text-amaliah-700 font-bold text-xs rounded-full uppercase tracking-wider mb-4">
                Asnaf: {selectedMustahik.asnaf}
              </div>
              
              <div className="space-y-3 text-left pt-4 border-t border-slate-100 mt-2">
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">NIK / ID</div>
                  <div className="text-sm font-bold text-slate-900">{selectedMustahik.nik}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Kontak</div>
                  <div className="text-sm font-bold text-slate-900">{selectedMustahik.phone}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Alamat</div>
                  <div className="text-sm font-bold text-slate-900 flex items-start gap-1"><MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5"/> {selectedMustahik.address}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                   <Heart className="w-6 h-6 text-emerald-600" />
                 </div>
                 <div>
                   <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Bantuan Diterima</div>
                   <div className="text-xl font-bold text-slate-900">{selectedMustahik.totalBantuan}</div>
                 </div>
               </div>
               <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                   <Calendar className="w-6 h-6 text-blue-600" />
                 </div>
                 <div>
                   <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Tergabung Sejak</div>
                   <div className="text-lg font-bold text-slate-900">{selectedMustahik.joined}</div>
                 </div>
               </div>
            </div>
            
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-bold text-slate-900">Riwayat Bantuan</h3>
                <button className="text-sm font-semibold text-amaliah-600 hover:underline">Tambah Bantuan</button>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                    <th className="p-4">Tanggal</th>
                    <th className="p-4">Program / Jenis</th>
                    <th className="p-4 text-right">Nominal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 text-sm font-semibold text-slate-900">20 Ags 2026</td>
                    <td className="p-4 text-sm text-slate-700">Santunan Bulanan</td>
                    <td className="p-4 text-sm font-bold text-slate-900 text-right">Rp 500.000</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 text-sm font-semibold text-slate-900">15 Jul 2026</td>
                    <td className="p-4 text-sm text-slate-700">Santunan Bulanan</td>
                    <td className="p-4 text-sm font-bold text-slate-900 text-right">Rp 500.000</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 text-sm font-semibold text-slate-900">20 Jun 2026</td>
                    <td className="p-4 text-sm text-slate-700">Bantuan Biaya Berobat</td>
                    <td className="p-4 text-sm font-bold text-slate-900 text-right">Rp 1.500.000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 min-h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Registry Mustahik</h1>
          <p className="text-sm text-slate-500 mt-1">Data penerima manfaat untuk menghindari duplikasi bantuan.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-amaliah-600 text-white rounded-lg text-sm font-bold hover:bg-amaliah-700 transition-colors">
            <Plus className="w-4 h-4 stroke-[3]" /> Tambah Mustahik
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Cari NIK, Nama..." className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-amaliah-500" />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
              <Filter className="w-4 h-4" /> Asnaf
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                <th className="p-4">Nama & NIK</th>
                <th className="p-4">Kategori Asnaf</th>
                <th className="p-4 text-center">Tanggungan</th>
                <th className="p-4 text-right">Bantuan Thn Ini</th>
                <th className="p-4 text-center">Status Kelayakan</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mustahiks.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => setSelectedMustahik(m)}>
                  <td className="p-4">
                    <div className="text-sm font-bold text-slate-900">{m.name}</div>
                    <div className="text-xs font-medium text-slate-500 mt-0.5">NIK: {m.nik}</div>
                  </td>
                  <td className="p-4 text-sm font-semibold text-slate-700">
                    <span className="bg-slate-100 px-2 py-1 rounded text-xs">{m.asnaf}</span>
                  </td>
                  <td className="p-4 text-sm text-center font-medium text-slate-600">{m.dependents} Jiwa</td>
                  <td className="p-4 text-sm font-bold text-slate-900 text-right tabular-nums">{m.totalBantuan}</td>
                  <td className="p-4 text-center">
                    {m.status === 'Aktif' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                        <CheckCircle2 className="w-3 h-3" /> {m.status}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
                        <AlertCircle className="w-3 h-3" /> {m.status}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <button onClick={(e) => { e.stopPropagation(); setSelectedMustahik(m); }} className="text-xs font-semibold text-amaliah-600 hover:text-amaliah-700 hover:underline">Profil</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
