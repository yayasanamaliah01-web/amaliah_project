import React, { useState } from 'react';
import { FileText, Download, Printer, ArrowLeft, Calendar, Filter } from 'lucide-react';

export default function AdminLaporan() {
  const [selectedReport, setSelectedReport] = useState<any>(null);

  const reports = [
    { id: 1, title: 'Laporan Posisi Keuangan (Neraca)', desc: 'Menyajikan aset neto Terikat dan Tidak Terikat per tanggal.' },
    { id: 2, title: 'Laporan Perubahan Aset Neto', desc: 'Mutasi penambahan dan pengurangan aset neto selama periode berjalan.' },
    { id: 3, title: 'Laporan Arus Kas', desc: 'Rincian uang masuk dan keluar berdasarkan aktivitas operasi dan investasi.' },
    { id: 4, title: 'Laporan Rincian Penerimaan ZIS', desc: 'Rekapitulasi penerimaan Zakat, Infaq, Sedekah per donatur.' },
  ];

  if (selectedReport) {
    return (
      <div className="p-6 bg-slate-50 min-h-full">
        <button onClick={() => setSelectedReport(null)} className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Laporan
        </button>
        
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden max-w-4xl mx-auto">
          <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{selectedReport.title}</h2>
              <p className="text-sm text-slate-500 mt-1">Yayasan amaliah Indonesia</p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                <Printer className="w-4 h-4" /> Cetak
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-amaliah-600 text-white rounded-lg text-sm font-bold hover:bg-amaliah-700 transition-colors">
                <Download className="w-4 h-4" /> Unduh PDF
              </button>
            </div>
          </div>
          
          <div className="p-6 border-b border-slate-200 flex flex-wrap gap-4">
             <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700">
               <Calendar className="w-4 h-4 text-slate-400" />
               <span>Periode: <strong>Agustus 2026</strong></span>
             </div>
             <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
               <Filter className="w-4 h-4" /> Ubah Parameter
             </button>
          </div>

          <div className="p-8 overflow-x-auto">
            {/* Mockup of Financial Statement */}
            <div className="min-w-[600px]">
              <div className="text-center mb-8">
                <h3 className="font-bold text-lg text-slate-900">YAYASAN amaliah INDONESIA</h3>
                <h4 className="font-bold text-md text-slate-800 uppercase">{selectedReport.title}</h4>
                <p className="text-sm text-slate-600">Per 31 Agustus 2026 dan 2025</p>
                <p className="text-xs text-slate-500 italic">(Dinyatakan dalam Rupiah)</p>
              </div>
              
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-y-2 border-slate-900">
                    <th className="py-3 text-left font-bold text-slate-900">URAIAN</th>
                    <th className="py-3 text-right font-bold text-slate-900 w-32">2026</th>
                    <th className="py-3 text-right font-bold text-slate-900 w-32">2025</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3 font-bold text-slate-900" colSpan={3}>ASET LANCAR</td>
                  </tr>
                  <tr>
                    <td className="py-2 pl-4 text-slate-700">Kas dan Setara Kas</td>
                    <td className="py-2 text-right tabular-nums">804.350.000</td>
                    <td className="py-2 text-right tabular-nums">650.120.000</td>
                  </tr>
                  <tr>
                    <td className="py-2 pl-4 text-slate-700">Piutang</td>
                    <td className="py-2 text-right tabular-nums">15.000.000</td>
                    <td className="py-2 text-right tabular-nums">10.000.000</td>
                  </tr>
                  <tr className="border-t border-slate-300">
                    <td className="py-3 pl-4 font-bold text-slate-900">Total Aset Lancar</td>
                    <td className="py-3 text-right font-bold text-slate-900 tabular-nums">819.350.000</td>
                    <td className="py-3 text-right font-bold text-slate-900 tabular-nums">660.120.000</td>
                  </tr>
                  
                  <tr>
                    <td className="py-3 font-bold text-slate-900 mt-4" colSpan={3}>ASET TIDAK LANCAR</td>
                  </tr>
                  <tr>
                    <td className="py-2 pl-4 text-slate-700">Aset Tetap (Neto)</td>
                    <td className="py-2 text-right tabular-nums">1.200.000.000</td>
                    <td className="py-2 text-right tabular-nums">1.250.000.000</td>
                  </tr>
                  <tr className="border-t border-slate-300">
                    <td className="py-3 pl-4 font-bold text-slate-900">Total Aset Tidak Lancar</td>
                    <td className="py-3 text-right font-bold text-slate-900 tabular-nums">1.200.000.000</td>
                    <td className="py-3 text-right font-bold text-slate-900 tabular-nums">1.250.000.000</td>
                  </tr>
                  
                  <tr className="border-y-2 border-slate-900">
                    <td className="py-3 font-bold text-slate-900">TOTAL ASET</td>
                    <td className="py-3 text-right font-bold text-slate-900 tabular-nums">2.019.350.000</td>
                    <td className="py-3 text-right font-bold text-slate-900 tabular-nums">1.910.120.000</td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-12 flex justify-end">
                 <div className="text-center">
                   <div className="text-sm text-slate-600 mb-16">Jakarta, 01 September 2026<br/>Ketua Yayasan</div>
                   <div className="font-bold text-slate-900 underline decoration-slate-300 underline-offset-4">Bpk. H. Abdurrahman</div>
                 </div>
              </div>
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
          <h1 className="text-2xl font-bold text-slate-900">Laporan & Transparansi</h1>
          <p className="text-sm text-slate-500 mt-1">Hasilkan laporan standar akuntansi PSAK 109 untuk yayasan nirlaba.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map(rep => (
          <div key={rep.id} onClick={() => setSelectedReport(rep)} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-amaliah-300 transition-all flex items-start gap-4 cursor-pointer">
            <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 text-indigo-600">
              <FileText className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 mb-1 leading-snug">{rep.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">{rep.desc}</p>
              <div className="flex gap-2">
                <button onClick={(e) => { e.stopPropagation(); setSelectedReport(rep); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded border border-slate-200 transition-colors">
                  <Printer className="w-3.5 h-3.5" /> Lihat Preview
                </button>
                <button onClick={(e) => { e.stopPropagation(); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-amaliah-50 hover:bg-amaliah-100 text-amaliah-700 text-xs font-semibold rounded border border-amaliah-200 transition-colors">
                  <Download className="w-3.5 h-3.5" /> Export PDF
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
