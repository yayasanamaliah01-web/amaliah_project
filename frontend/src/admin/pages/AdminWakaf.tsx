import React, { useState } from 'react';
import { MapPin, Plus, FileText, CheckCircle2, ArrowLeft, Download, Building2 } from 'lucide-react';

export default function AdminWakaf() {
  const [selectedAsset, setSelectedAsset] = useState<any>(null);

  const wakafAssets = [
    { id: 'WKF-001', name: 'Tanah Sawah 500m2', type: 'Tanah', value: 'Rp 250.000.000', nazhir: 'Yayasan amaliah', location: 'Desa Suka Maju', status: 'Produktif', date: '10 Jan 2025', donor: 'Bpk. H. Soleh' },
    { id: 'WKF-002', name: 'Ruko 2 Lantai', type: 'Bangunan', value: 'Rp 800.000.000', nazhir: 'Yayasan amaliah', location: 'Jl. Merdeka No. 10', status: 'Produktif', date: '05 Mar 2024', donor: 'Keluarga Bpk. Anwar' },
    { id: 'WKF-003', name: 'Ambulans APV', type: 'Kendaraan', value: 'Rp 150.000.000', nazhir: 'Yayasan amaliah', location: 'Klinik Umat', status: 'Digunakan', date: '12 Ags 2025', donor: 'Hamba Allah' },
  ];

  if (selectedAsset) {
     return (
       <div className="p-6 bg-slate-50 min-h-full">
         <button onClick={() => setSelectedAsset(null)} className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 mb-6 transition-colors">
           <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Wakaf
         </button>
         
         <div className="max-w-3xl mx-auto bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-200 text-center relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                 <Building2 className="w-64 h-64" />
               </div>
               <div className="relative z-10">
                 <div className="w-16 h-16 bg-amaliah-50 rounded-full flex items-center justify-center text-amaliah-600 mx-auto mb-4">
                    <FileText className="w-8 h-8" />
                 </div>
                 <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-widest mb-1">Sertifikat Wakaf</h2>
                 <p className="text-sm font-medium text-slate-500">No. Registrasi: {selectedAsset.id}</p>
               </div>
            </div>
            <div className="p-8 space-y-6">
               <div className="text-center mb-8 text-slate-700 italic">
                 "Sesungguhnya Allah menerima amal hamba-hambaNya yang ikhlas."
               </div>
               
               <div className="grid grid-cols-2 gap-y-6 gap-x-8 bg-slate-50 p-6 rounded-xl border border-slate-100">
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nama Aset Wakaf</div>
                    <div className="text-lg font-bold text-slate-900">{selectedAsset.name}</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Wakif (Pewakaf)</div>
                    <div className="text-lg font-bold text-slate-900">{selectedAsset.donor}</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Jenis Aset</div>
                    <div className="font-semibold text-slate-900">{selectedAsset.type}</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nazhir (Pengelola)</div>
                    <div className="font-semibold text-slate-900">{selectedAsset.nazhir}</div>
                  </div>
                  <div className="col-span-2 pt-4 border-t border-slate-200">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Lokasi Aset</div>
                    <div className="font-bold text-slate-900 flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400" /> {selectedAsset.location}</div>
                  </div>
               </div>
               
               <div className="bg-amaliah-50 border border-amaliah-100 rounded-xl p-5 flex justify-between items-center">
                  <div>
                    <div className="text-[11px] font-bold text-amaliah-500 uppercase tracking-wider mb-1">Nilai Estimasi Aset</div>
                    <div className="text-2xl font-bold text-amaliah-900">{selectedAsset.value}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] font-bold text-amaliah-500 uppercase tracking-wider mb-1">Status Pemanfaatan</div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold bg-emerald-100 text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {selectedAsset.status}
                    </span>
                  </div>
               </div>
            </div>
            <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
               <span className="text-xs text-slate-500 font-medium">Dicetak pada: 26 Ags 2026</span>
               <button className="flex items-center gap-2 px-4 py-2 bg-amaliah-600 text-white rounded-lg text-sm font-bold hover:bg-amaliah-700 transition-colors">
                 <Download className="w-4 h-4" /> Unduh Sertifikat PDF
               </button>
            </div>
         </div>
       </div>
     );
  }

  return (
    <div className="p-6 bg-slate-50 min-h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Wakaf & Aset</h1>
          <p className="text-sm text-slate-500 mt-1">Registrasi dan pemantauan status aset wakaf lembaga.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-amaliah-600 text-white rounded-lg text-sm font-bold hover:bg-amaliah-700 transition-colors">
            <Plus className="w-4 h-4 stroke-[3]" /> Register Aset
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                <th className="p-4">Nama Aset & ID</th>
                <th className="p-4">Jenis</th>
                <th className="p-4">Lokasi & Nazhir</th>
                <th className="p-4 text-right">Nilai Estimasi</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {wakafAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => setSelectedAsset(asset)}>
                  <td className="p-4">
                    <div className="text-sm font-bold text-slate-900">{asset.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{asset.id}</div>
                  </td>
                  <td className="p-4 text-sm font-semibold text-slate-700">
                    <span className="bg-slate-100 px-2 py-1 rounded text-xs">{asset.type}</span>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-semibold text-slate-800 flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {asset.location}</div>
                    <div className="text-xs text-slate-500 mt-0.5">Nazhir: {asset.nazhir}</div>
                  </td>
                  <td className="p-4 text-sm font-bold text-slate-900 text-right tabular-nums">{asset.value}</td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                      <CheckCircle2 className="w-3 h-3" /> {asset.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button onClick={(e) => { e.stopPropagation(); setSelectedAsset(asset); }} className="text-xs font-semibold text-amaliah-600 hover:text-amaliah-700 hover:underline">Sertifikat</button>
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
