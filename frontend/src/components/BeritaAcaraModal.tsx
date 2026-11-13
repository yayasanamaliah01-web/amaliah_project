import React from 'react';
import { X, Printer, Download } from 'lucide-react';
import { PenyaluranTask } from '../context/AppContext';

export default function BeritaAcaraModal({ isOpen, onClose, task }: { isOpen: boolean; onClose: () => void; task: PenyaluranTask | null }) {
  if (!isOpen || !task) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm print:p-0 print:bg-white print:block no-print-bg">
      <div className="print-area bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] print:max-w-none print:shadow-none print:max-h-none print:h-auto print:rounded-none">
        
        {/* Header / Actions - Hidden on print */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50 no-print">
          <h3 className="font-bold text-slate-900">Pratinjau Berita Acara</h3>
          <div className="flex gap-2">
            <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-amaliah-600 rounded-lg text-sm font-bold text-white hover:bg-amaliah-700 transition-colors shadow-sm">
              <Printer className="w-4 h-4" /> Cetak PDF / Print
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Content */}
        <div className="p-8 md:p-14 overflow-y-auto print:overflow-visible print:p-8 bg-white">
          
          {/* Kop Surat */}
          <div className="border-b-4 border-slate-900 pb-6 mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-amaliah-600 flex items-center justify-center text-white font-bold text-3xl shrink-0">
                M
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight uppercase">amaliah Foundation</h1>
                <p className="text-sm font-semibold text-slate-600">Lembaga Amil Zakat Nasional</p>
              </div>
            </div>
            <div className="text-right text-xs text-slate-500 leading-relaxed">
              Jl. Kebaikan No. 99, Jakarta Selatan<br />
              Telp: (021) 555-0123<br />
              Email: contact@amaliah.id | Web: www.amaliah.id
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-10">
            <h2 className="text-lg font-bold text-slate-900 underline underline-offset-4 mb-2">BERITA ACARA SERAH TERIMA BANTUAN</h2>
            <p className="text-sm font-medium text-slate-600">Nomor: BAST/{task.id.replace('OUT-', '')}/VIII/2026</p>
          </div>

          {/* Body */}
          <div className="space-y-4 text-sm text-slate-800 leading-loose">
            <p>Pada hari ini, <strong className="font-bold text-slate-900">{task.date}</strong>, telah dilakukan penyerahan bantuan program kemanusiaan dengan rincian sebagai berikut:</p>
            
            <div className="pl-4 py-2 border-l-4 border-slate-200 bg-slate-50/50 my-6">
              <table className="w-full text-sm">
                <tbody>
                  <tr>
                    <td className="py-2 w-48 align-top font-bold text-slate-700">Nama Program</td>
                    <td className="py-2 w-4 align-top text-slate-400">:</td>
                    <td className="py-2 align-top font-bold text-slate-900">{task.program}</td>
                  </tr>
                  <tr>
                    <td className="py-2 align-top font-bold text-slate-700">Penerima Manfaat</td>
                    <td className="py-2 align-top text-slate-400">:</td>
                    <td className="py-2 align-top text-slate-900">{task.recipient}</td>
                  </tr>
                  <tr>
                    <td className="py-2 align-top font-bold text-slate-700">Nominal / Bentuk Bantuan</td>
                    <td className="py-2 align-top text-slate-400">:</td>
                    <td className="py-2 align-top font-bold text-amaliah-700">{task.amount}</td>
                  </tr>
                  <tr>
                    <td className="py-2 align-top font-bold text-slate-700">Catatan Kondisi Lapangan</td>
                    <td className="py-2 align-top text-slate-400">:</td>
                    <td className="py-2 align-top italic text-slate-700">"{task.reportNote || task.notes}"</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>Bantuan tersebut telah disalurkan dan diterima dalam keadaan baik. Diserahkan langsung oleh Amil Lapangan (Pihak Pertama) kepada Penerima Manfaat (Pihak Kedua).</p>
            <p>Demikian berita acara serah terima ini dibuat dengan sebenar-benarnya beserta dokumentasi terlampir untuk dapat dipergunakan sebagaimana mestinya.</p>
          </div>

          {/* Signatures */}
          <div className="mt-16 grid grid-cols-2 gap-8 text-center text-sm font-medium">
            <div>
              <p className="mb-24">Pihak Pertama<br/><span className="text-slate-500">(Amil Penyalur)</span></p>
              <div className="inline-block relative">
                 <p className="font-bold text-slate-900 underline underline-offset-4 text-base">Ahmad Penyalur</p>
                 <div className="absolute -inset-2 opacity-20 -rotate-6 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #087A4F 2px, transparent 2px)', backgroundSize: '8px 8px' }}></div>
              </div>
              <p className="text-xs text-slate-500 mt-1">ID: AML-1029</p>
            </div>
            <div>
              <p className="mb-24">Pihak Kedua<br/><span className="text-slate-500">(Penerima Manfaat)</span></p>
              <p className="font-bold text-slate-900 underline underline-offset-4 text-base">{task.recipient}</p>
            </div>
          </div>
          
          <div className="mt-16 text-center text-sm font-medium">
            <p className="mb-20">Mengetahui,<br/><span className="text-slate-500">(Admin Yayasan)</span></p>
            <div className="relative inline-block">
              {/* Fake stamp */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-[3px] border-amaliah-600/30 rounded-full w-28 h-28 -rotate-12 flex items-center justify-center pointer-events-none">
                <div className="text-amaliah-600/30 font-black text-lg tracking-widest uppercase border-y-2 border-amaliah-600/30 py-1 px-2">
                  VERIFIED
                </div>
              </div>
              <p className="font-bold text-slate-900 underline underline-offset-4 text-base">Admin Pusat amaliah</p>
            </div>
          </div>
          
          {/* Footer Text */}
          <div className="mt-16 pt-6 border-t border-slate-200 text-center text-xs text-slate-400 print:mt-12">
            Dokumen ini dicetak secara otomatis dari Sistem Informasi amaliah pada {new Date().toLocaleDateString('id-ID')}
          </div>

        </div>
      </div>
    </div>
  );
}
