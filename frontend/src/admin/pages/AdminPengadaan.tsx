import React, { useState } from 'react';
import { ShoppingCart, Plus, CheckCircle2, Clock, ArrowLeft, Download } from 'lucide-react';

export default function AdminPengadaan() {
  const [selectedReq, setSelectedReq] = useState<any>(null);

  const requests = [
    { id: 'REQ-001', item: 'Karpet Masjid (Syaf Baru)', program: 'Operasional Masjid', amount: 'Rp 4.500.000', status: 'Disetujui', date: '25 Ags 2026', vendor: 'Toko Karpet Al-Mukmin', desc: 'Penggantian karpet shaf depan sepanjang 20 meter.' },
    { id: 'REQ-002', item: 'Sound System (Speaker Luar)', program: 'Renovasi Masjid', amount: 'Rp 6.200.000', status: 'Menunggu', date: '26 Ags 2026', vendor: 'Audio Jaya', desc: '2 Unit Speaker TOA corong 25W untuk luar ruangan.' },
  ];

  if (selectedReq) {
     return (
      <div className="p-6 bg-slate-50 min-h-full">
        <button onClick={() => setSelectedReq(null)} className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Pengadaan
        </button>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden max-w-2xl mx-auto">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center">
             <div>
               <h2 className="text-xl font-bold text-slate-900">Detail Pengajuan</h2>
               <p className="text-sm text-slate-500 mt-1">ID: {selectedReq.id}</p>
             </div>
             {selectedReq.status === 'Menunggu' ? (
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-rose-50 text-rose-600 font-semibold text-sm rounded-lg hover:bg-rose-100 transition-colors">Tolak</button>
                  <button className="px-4 py-2 bg-emerald-600 text-white font-semibold text-sm rounded-lg hover:bg-emerald-700 transition-colors" onClick={() => setSelectedReq({...selectedReq, status: 'Disetujui'})}>Setujui</button>
                </div>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                  <CheckCircle2 className="w-4 h-4" /> Telah Disetujui
                </span>
              )}
          </div>
          <div className="p-6 space-y-6">
            <div>
               <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Nama Barang / Jasa</div>
               <div className="text-lg font-bold text-slate-900">{selectedReq.item}</div>
               <div className="text-sm font-medium text-slate-500 mt-1">{selectedReq.desc}</div>
            </div>
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
               <div>
                 <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Program / Divisi</div>
                 <div className="font-bold text-slate-900">{selectedReq.program}</div>
               </div>
               <div>
                 <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Estimasi Biaya</div>
                 <div className="font-bold text-slate-900 text-lg tabular-nums">{selectedReq.amount}</div>
               </div>
            </div>
            <div>
               <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Rekomendasi Vendor / Toko</div>
               <div className="font-bold text-slate-900 p-3 border border-slate-200 rounded-lg bg-white flex items-center gap-3">
                 <ShoppingCart className="w-5 h-5 text-slate-400" /> {selectedReq.vendor}
               </div>
            </div>
            <div>
               <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Lampiran (Quotation)</div>
               <button className="flex items-center gap-2 px-4 py-3 border border-slate-200 hover:bg-slate-50 rounded-lg w-full text-left transition-colors">
                 <div className="w-8 h-8 rounded bg-amaliah-50 flex items-center justify-center text-amaliah-600 shrink-0"><Download className="w-4 h-4" /></div>
                 <div>
                   <div className="text-sm font-bold text-slate-900">Quotation_{selectedReq.vendor.replace(/\s+/g, '')}.pdf</div>
                   <div className="text-xs text-slate-500">PDF Document • 1.2 MB</div>
                 </div>
               </button>
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
          <h1 className="text-2xl font-bold text-slate-900">Pengadaan Barang/Jasa</h1>
          <p className="text-sm text-slate-500 mt-1">Kelola pengajuan pembelian untuk kebutuhan operasional atau program.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-amaliah-600 text-white rounded-lg text-sm font-bold hover:bg-amaliah-700 transition-colors">
            <Plus className="w-4 h-4 stroke-[3]" /> Ajukan Pengadaan
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
              <th className="p-4">Tanggal & ID</th>
              <th className="p-4">Barang/Jasa</th>
              <th className="p-4 text-right">Estimasi Biaya</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {requests.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => setSelectedReq(r)}>
                <td className="p-4">
                  <div className="text-sm font-bold text-slate-900">{r.date}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{r.id}</div>
                </td>
                <td className="p-4">
                  <div className="text-sm font-bold text-slate-900">{r.item}</div>
                  <div className="text-xs text-slate-500 mt-0.5">Program: {r.program}</div>
                </td>
                <td className="p-4 text-sm font-bold text-slate-900 text-right tabular-nums">{r.amount}</td>
                <td className="p-4 text-center">
                  {r.status === 'Disetujui' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                      <CheckCircle2 className="w-3 h-3" /> {r.status}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
                      <Clock className="w-3 h-3" /> {r.status}
                    </span>
                  )}
                </td>
                <td className="p-4 text-center">
                  <button onClick={(e) => { e.stopPropagation(); setSelectedReq(r); }} className="text-xs font-semibold text-amaliah-600 hover:text-amaliah-700 hover:underline">Detail</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
