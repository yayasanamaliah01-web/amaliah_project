import React, { useState } from 'react';
import { Search, Plus, Filter, Download, ArrowUpRight, CheckCircle2, Clock, ArrowLeft, Building2, Calendar, FileText, Save, Check, FileCheck } from 'lucide-react';
import { useAppContext, PenyaluranTask } from '../../context/AppContext';
import BeritaAcaraModal from '../../components/BeritaAcaraModal';

export default function AdminPenyaluran() {
  const { tasks, updateTask } = useAppContext();
  const [selectedTrx, setSelectedTrx] = useState<PenyaluranTask | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [showBeritaAcara, setShowBeritaAcara] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    program: '',
    recipient: '',
    amount: '',
    sourceFund: 'Zakat',
    notes: ''
  });

  const handleApprove = (id: string) => {
    updateTask(id, { status: 'Selesai' });
    setSelectedTrx(null);
  };

  if (isAdding) {
    return (
      <div className="p-6 bg-slate-50 min-h-full">
        <button onClick={() => setIsAdding(false)} className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar
        </button>
        
        <div className="max-w-3xl bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 bg-slate-50/50">
            <h2 className="text-xl font-bold text-slate-900">Ajukan Penyaluran Baru</h2>
            <p className="text-sm text-slate-500 mt-1">Formulir pengajuan pencairan dana untuk program atau operasional.</p>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Tanggal Pengajuan</label>
                <input type="date" className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-amaliah-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Sumber Dana</label>
                <select className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-amaliah-500" value={formData.sourceFund} onChange={(e) => setFormData({...formData, sourceFund: e.target.value})}>
                  <option>Zakat</option>
                  <option>Infaq Terikat</option>
                  <option>Infaq Tidak Terikat</option>
                  <option>Wakaf Uang</option>
                  <option>Amil</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Nama Program / Kegiatan</label>
                <input type="text" placeholder="Contoh: Santunan Yatim Tahap 1, Pembayaran Listrik" className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-amaliah-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Penerima Manfaat / Vendor</label>
                <input type="text" placeholder="Contoh: 50 Anak Yatim Desa A, PLN" className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-amaliah-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nominal Pengajuan (Rp)</label>
                <input type="number" placeholder="0" className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-amaliah-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Catatan / Deskripsi Penyaluran</label>
              <textarea rows={4} placeholder="Jelaskan rincian penggunaan dana secara lengkap..." className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-amaliah-500"></textarea>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 items-start">
              <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <strong>Catatan Penting:</strong> Pengajuan ini akan diteruskan ke Amil Lapangan untuk laporan dan dokumentasi, sebelum disetujui.
              </div>
            </div>
          </div>
          
          <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
            <button onClick={() => setIsAdding(false)} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Batal
            </button>
            <button onClick={() => setIsAdding(false)} className="flex items-center gap-2 px-6 py-2 bg-amaliah-600 text-white rounded-lg text-sm font-bold hover:bg-amaliah-700 transition-colors">
              <Save className="w-4 h-4" /> Ajukan Penyaluran
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedTrx) {
    return (
      <div className="p-6 bg-slate-50 min-h-full">
        <button onClick={() => setSelectedTrx(null)} className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar
        </button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-500">{selectedTrx.id}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                    <span className="text-xs font-bold text-slate-500">{selectedTrx.date}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">{selectedTrx.program}</h2>
                </div>
                {selectedTrx.status === 'Selesai' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4" /> Selesai Disetujui
                  </span>
                ) : selectedTrx.status === 'Menunggu Persetujuan' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    <CheckCircle2 className="w-4 h-4" /> Laporan Diterima
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    <Clock className="w-4 h-4" /> Menunggu Laporan
                  </span>
                )}
              </div>
              
              <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <div className="text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1"><ArrowUpRight className="w-3.5 h-3.5" /> Penerima</div>
                  <div className="text-sm font-bold text-slate-900">{selectedTrx.recipient}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Tanggal</div>
                  <div className="text-sm font-bold text-slate-900">{selectedTrx.date}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> Nominal</div>
                  <div className="text-sm font-bold text-amaliah-600">{selectedTrx.amount}</div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-200">
                <div className="text-sm font-bold text-slate-700 mb-2">Catatan Pengajuan:</div>
                <p className="text-sm text-slate-600">{selectedTrx.notes}</p>
              </div>
            </div>

            {/* Laporan Amil Lapangan */}
            {(selectedTrx.status === 'Menunggu Persetujuan' || selectedTrx.status === 'Selesai') && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                  <h3 className="font-bold text-slate-900">Laporan Amil Lapangan</h3>
                </div>
                <div className="p-6">
                  {selectedTrx.reportPhoto && (
                    <div className="mb-4">
                      <div className="text-xs font-bold text-slate-500 mb-2">Foto Dokumentasi</div>
                      <img src={selectedTrx.reportPhoto} alt="Dokumentasi" className="rounded-xl border border-slate-200 w-full max-w-sm object-cover h-48" />
                    </div>
                  )}
                  {selectedTrx.reportNote && (
                    <div>
                      <div className="text-xs font-bold text-slate-500 mb-2">Keterangan / Laporan Lapangan</div>
                      <p className="text-sm text-slate-800 bg-slate-50 p-4 rounded-lg border border-slate-100">{selectedTrx.reportNote}</p>
                    </div>
                  )}
                  
                  {selectedTrx.status === 'Selesai' && (
                    <div className="mt-6 pt-6 border-t border-slate-200">
                      <button onClick={() => setShowBeritaAcara(true)} className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                        <FileCheck className="w-4 h-4" /> Buka Surat Berita Acara (BAST)
                      </button>
                    </div>
                  )}

                  {selectedTrx.status === 'Menunggu Persetujuan' && (
                    <div className="mt-6 pt-6 border-t border-slate-200 flex items-center justify-end gap-3">
                      <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50">Revisi</button>
                      <button onClick={() => handleApprove(selectedTrx.id)} className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 transition-colors">
                        <Check className="w-4 h-4" /> Setujui & Selesaikan
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sticky top-24">
              <h3 className="font-bold text-slate-900 mb-4">Ringkasan Dana</h3>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Nominal Pengajuan</span>
                  <span className="font-bold text-amaliah-900 text-base">{selectedTrx.amount}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-amaliah-200">
                  <span className="text-amaliah-800 font-bold">Total Disetujui</span>
                  <span className="font-bold text-xl text-amaliah-900">{selectedTrx.status === 'Selesai' ? selectedTrx.amount : '-'}</span>
                </div>
              </div>
              
              <div className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-wider">Alur Persetujuan</div>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[15px] before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-200">
                 <div className="flex items-start gap-4 relative">
                   <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 z-10 shrink-0 mt-0.5">
                     <CheckCircle2 className="w-4 h-4" />
                   </div>
                   <div>
                     <div className="text-sm font-bold text-slate-900">Diajukan oleh Program Manager</div>
                     <div className="text-xs font-medium text-slate-500 mt-0.5">{selectedTrx.date}</div>
                   </div>
                 </div>
                 
                 <div className="flex items-start gap-4 relative">
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 shrink-0 mt-0.5 ${(selectedTrx.status === 'Menunggu Persetujuan' || selectedTrx.status === 'Selesai') ? 'bg-emerald-100 text-emerald-600' : 'bg-white border-2 border-slate-200 text-slate-400'}`}>
                     {(selectedTrx.status === 'Menunggu Persetujuan' || selectedTrx.status === 'Selesai') ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                   </div>
                   <div>
                     <div className={`text-sm font-bold ${(selectedTrx.status === 'Menunggu Persetujuan' || selectedTrx.status === 'Selesai') ? 'text-slate-900' : 'text-slate-400'}`}>Laporan Amil Lapangan</div>
                     <div className="text-xs font-medium text-slate-500 mt-0.5">{(selectedTrx.status === 'Menunggu Persetujuan' || selectedTrx.status === 'Selesai') ? 'Laporan telah dikirim' : 'Menunggu laporan penyaluran'}</div>
                   </div>
                 </div>

                 <div className="flex items-start gap-4 relative">
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 shrink-0 mt-0.5 ${selectedTrx.status === 'Selesai' ? 'bg-emerald-100 text-emerald-600' : 'bg-white border-2 border-slate-200 text-slate-400'}`}>
                     {selectedTrx.status === 'Selesai' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                   </div>
                   <div>
                     <div className={`text-sm font-bold ${selectedTrx.status === 'Selesai' ? 'text-slate-900' : 'text-slate-400'}`}>Disetujui / Selesai</div>
                     <div className="text-xs font-medium text-slate-500 mt-0.5">{selectedTrx.status === 'Selesai' ? 'Penyaluran disetujui & selesai' : 'Menunggu persetujuan admin'}</div>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
        <BeritaAcaraModal isOpen={showBeritaAcara} onClose={() => setShowBeritaAcara(false)} task={selectedTrx} />
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 min-h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Penyaluran Dana</h1>
          <p className="text-sm text-slate-500 mt-1">Kelola dan pantau arus dana keluar beserta laporannya.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
          <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 px-4 py-2 bg-amaliah-600 text-white rounded-lg text-sm font-bold hover:bg-amaliah-700 transition-colors">
            <Plus className="w-4 h-4 stroke-[3]" /> Ajukan Penyaluran
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Cari program, penerima..." className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-amaliah-500" />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                <th className="p-4">Tanggal & ID</th>
                <th className="p-4">Program & Penerima</th>
                <th className="p-4 text-right">Nominal</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tasks.map((trx) => (
                <tr key={trx.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <div className="text-sm font-semibold text-slate-900">{trx.date}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{trx.id}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-semibold text-slate-900">{trx.program}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{trx.recipient}</div>
                  </td>
                  <td className="p-4 text-sm font-bold text-slate-900 text-right tabular-nums">{trx.amount}</td>
                  <td className="p-4 text-center">
                    {trx.status === 'Selesai' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                        <CheckCircle2 className="w-3 h-3" /> {trx.status}
                      </span>
                    ) : trx.status === 'Menunggu Persetujuan' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                        <CheckCircle2 className="w-3 h-3" /> Laporan Diterima
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
                        <Clock className="w-3 h-3" /> {trx.status}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <button onClick={() => setSelectedTrx(trx)} className="text-xs font-semibold text-amaliah-600 hover:text-amaliah-700 hover:underline">Detail</button>
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
