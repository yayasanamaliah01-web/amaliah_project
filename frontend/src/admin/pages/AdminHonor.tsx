import React, { useState } from 'react';
import { UserCog, Plus, CheckCircle2 } from 'lucide-react';

export default function AdminHonor() {
  const [staff, setStaff] = useState([
    { id: 1, name: 'Ust. Abdul Malik', role: 'Imam Masjid', honor: 'Rp 2.500.000', source: 'Dana Amil', status: 'Terbayar' },
    { id: 2, name: 'Bpk. Herman', role: 'Marbot', honor: 'Rp 1.500.000', source: 'Infaq Operasional', status: 'Terbayar' },
    { id: 3, name: 'Ibu Aisyah', role: 'Guru TPQ', honor: 'Rp 1.000.000', source: 'Zakat (Fisabilillah)', status: 'Belum Dibayar' },
  ]);

  const toggleStatus = (id: number) => {
    setStaff(staff.map(s => {
      if (s.id === id) {
        return { ...s, status: s.status === 'Terbayar' ? 'Belum Dibayar' : 'Terbayar' };
      }
      return s;
    }));
  };

  return (
    <div className="p-6 bg-slate-50 min-h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kepengurusan & Honor</h1>
          <p className="text-sm text-slate-500 mt-1">Daftar petugas dan manajemen pembayaran honor bulanan.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-maun-600 text-white rounded-lg text-sm font-bold hover:bg-maun-700 transition-colors">
            <Plus className="w-4 h-4 stroke-[3]" /> Bayar Massal
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
              <th className="p-4">Nama & Peran</th>
              <th className="p-4">Sumber Dana (Boleh)</th>
              <th className="p-4 text-right">Nominal Honor</th>
              <th className="p-4 text-center">Status (Bulan Ini)</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {staff.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4">
                  <div className="text-sm font-bold text-slate-900">{s.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{s.role}</div>
                </td>
                <td className="p-4 text-sm font-semibold text-slate-700">
                  <span className="bg-slate-100 px-2 py-1 rounded text-xs">{s.source}</span>
                </td>
                <td className="p-4 text-sm font-bold text-slate-900 text-right tabular-nums">{s.honor}</td>
                <td className="p-4 text-center">
                  {s.status === 'Terbayar' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                      <CheckCircle2 className="w-3 h-3" /> {s.status}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
                      Belum
                    </span>
                  )}
                </td>
                <td className="p-4 text-center">
                  {s.status === 'Belum Dibayar' ? (
                     <button onClick={() => toggleStatus(s.id)} className="text-xs font-semibold text-maun-600 hover:text-maun-700 hover:underline">Bayar Sekarang</button>
                  ) : (
                     <button onClick={() => toggleStatus(s.id)} className="text-xs font-semibold text-slate-400 hover:text-slate-600 hover:underline">Batalkan</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
