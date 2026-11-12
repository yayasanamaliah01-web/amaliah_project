import React, { useState } from 'react';
import { Search, Plus, Filter, Download, FileText, CheckCircle2, ArrowLeft, Printer, User, Wallet, Save } from 'lucide-react';

export default function AdminPenerimaan() {
  const [selectedTrx, setSelectedTrx] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    donor: '',
    source: 'Transfer Bank',
    amount: '',
    type: 'Zakat',
    // Dynamic fields
    asnaf: 'Fakir', // For Zakat
    assetType: 'Uang', // For Wakaf
    purpose: '', // For Infaq
    isBound: false, // For Infaq
  });

  const transactions = [
    { id: 'TRX-001', date: '26 Ags 2026', source: 'Transfer Bank', type: 'Zakat', donor: 'Hamba Allah', purpose: 'Zakat Penghasilan', amount: 'Rp 2.500.000', status: 'Selesai' },
    { id: 'TRX-002', date: '25 Ags 2026', source: 'QRIS', type: 'Infaq Terikat', donor: 'Budi Santoso', purpose: 'Renovasi Masjid', amount: 'Rp 500.000', status: 'Selesai' },
    { id: 'TRX-003', date: '25 Ags 2026', source: 'Kotak Amal', type: 'Infaq Tidak Terikat', donor: 'Jamaah', purpose: 'Operasional', amount: 'Rp 1.250.000', status: 'Selesai' },
    { id: 'TRX-004', date: '24 Ags 2026', source: 'Tunai', type: 'Wakaf Uang', donor: 'Siti Aminah', purpose: 'Wakaf Pembebasan Lahan', amount: 'Rp 10.000.000', status: 'Selesai' },
  ];

  if (isAdding) {
    return (
      <div className="p-6 bg-slate-50 min-h-full">
        <button onClick={() => setIsAdding(false)} className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar
        </button>
        
        <div className="max-w-3xl bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 bg-slate-50/50">
            <h2 className="text-xl font-bold text-slate-900">Catat Penerimaan Baru</h2>
            <p className="text-sm text-slate-500 mt-1">Masukkan detail dana yang diterima oleh yayasan.</p>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Tanggal Terima</label>
                <input type="date" className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-maun-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nama Donatur</label>
                <input type="text" placeholder="Contoh: Hamba Allah" className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-maun-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Metode Bayar (Sumber)</label>
                <select className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-maun-500">
                  <option>Transfer Bank</option>
                  <option>QRIS</option>
                  <option>Kotak Amal</option>
                  <option>Tunai</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nominal (Rp)</label>
                <input type="number" placeholder="0" className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-maun-500" />
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6 mt-6">
              <label className="block text-sm font-bold text-slate-700 mb-4">Peruntukan Dana</label>
              
              <div className="flex gap-4 mb-6">
                {['Zakat', 'Wakaf', 'Infaq'].map((type) => (
                  <label key={type} className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${formData.type === type ? 'border-maun-500 bg-maun-50 text-maun-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                    <input type="radio" name="danaType" value={type} className="hidden" checked={formData.type === type} onChange={(e) => setFormData({...formData, type: e.target.value})} />
                    <span className="font-bold text-sm">{type}</span>
                  </label>
                ))}
              </div>

              {/* Dynamic Fields based on Type */}
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                {formData.type === 'Zakat' && (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Pilih Asnaf (Golongan Penerima)</label>
                    <select className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-maun-500">
                      <option>Fakir</option>
                      <option>Miskin</option>
                      <option>Amil</option>
                      <option>Mualaf</option>
                      <option>Riqab</option>
                      <option>Gharimin</option>
                      <option>Fisabilillah</option>
                      <option>Ibnu Sabil</option>
                    </select>
                  </div>
                )}
                
                {formData.type === 'Wakaf' && (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Jenis Aset Wakaf</label>
                    <select className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-maun-500">
                      <option>Wakaf Uang</option>
                      <option>Wakaf Tanah</option>
                      <option>Wakaf Bangunan / Masjid</option>
                      <option>Wakaf Kendaraan</option>
                    </select>
                  </div>
                )}

                {formData.type === 'Infaq' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg">
                      <div>
                        <div className="font-bold text-sm text-slate-900">Infaq Terikat?</div>
                        <div className="text-xs text-slate-500 mt-0.5">Apakah donatur menentukan tujuan spesifik?</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={formData.isBound} onChange={(e) => setFormData({...formData, isBound: e.target.checked})} />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-maun-600"></div>
                      </label>
                    </div>
                    {formData.isBound && (
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Tujuan Spesifik (Program/Kegiatan)</label>
                        <input type="text" placeholder="Contoh: Renovasi Masjid At-Taqwa, Bantuan Anak Yatim" className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-maun-500" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Catatan Tambahan (Opsional)</label>
              <textarea rows={3} className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-maun-500"></textarea>
            </div>
          </div>
          
          <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
            <button onClick={() => setIsAdding(false)} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Batal
            </button>
            <button onClick={() => setIsAdding(false)} className="flex items-center gap-2 px-6 py-2 bg-maun-600 text-white rounded-lg text-sm font-bold hover:bg-maun-700 transition-colors">
              <Save className="w-4 h-4" /> Simpan Data
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
        <div className="max-w-3xl mx-auto bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Kuitansi Penerimaan</h2>
              <p className="text-sm text-slate-500 mt-1">No Bukti: {selectedTrx.id}</p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                <Printer className="w-4 h-4" /> Cetak
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-maun-600 text-white rounded-lg text-sm font-bold hover:bg-maun-700 transition-colors">
                <Download className="w-4 h-4" /> Unduh PDF
              </button>
            </div>
          </div>
          
          <div className="p-8">
            <div className="flex items-center justify-between border-b border-dashed border-slate-200 pb-6 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-maun-50 rounded-full flex items-center justify-center text-maun-600">
                  <span className="font-bold text-xl">M</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Yayasan MAUN Indonesia</h3>
                  <p className="text-xs text-slate-500">Jl. Kebaikan No. 99, Jakarta</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tanggal Terima</div>
                <div className="font-semibold text-slate-900">{selectedTrx.date}</div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                    <User className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Telah terima dari</div>
                    <div className="font-bold text-slate-900 text-lg">{selectedTrx.donor}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Metode Bayar</div>
                  <div className="inline-flex px-2.5 py-1 bg-white border border-slate-200 rounded text-xs font-semibold text-slate-700">{selectedTrx.source}</div>
                </div>
              </div>

              <div className="bg-maun-50 border border-maun-100 rounded-xl p-6">
                 <div className="text-[11px] font-bold text-maun-500 uppercase tracking-wider mb-2">Sebesar Nominal</div>
                 <div className="text-3xl font-bold text-maun-900 tabular-nums">{selectedTrx.amount}</div>
              </div>

              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Peruntukan Dana (Tujuan)</div>
                <div className="font-semibold text-slate-900 flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-slate-400"/>
                  {selectedTrx.type} — {selectedTrx.purpose}
                </div>
              </div>
            </div>

            <div className="mt-12 flex justify-between items-end">
              <div>
                <div className="text-xs text-slate-500 italic">"Semoga Allah memberikan pahala atas apa yang engkau berikan..."</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-slate-500 mb-12">Penerima (Amil)</div>
                <div className="font-bold text-slate-900 border-b border-slate-300 pb-1">Admin Yayasan</div>
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
          <h1 className="text-2xl font-bold text-slate-900">Penerimaan Dana</h1>
          <p className="text-sm text-slate-500 mt-1">Kelola dan catat semua transaksi dana masuk.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
          <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 px-4 py-2 bg-maun-600 text-white rounded-lg text-sm font-bold hover:bg-maun-700 transition-colors">
            <Plus className="w-4 h-4 stroke-[3]" /> Catat Penerimaan
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Cari nama, no bukti..." className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-maun-500" />
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
                <th className="p-4">No Bukti</th>
                <th className="p-4">Tanggal</th>
                <th className="p-4">Donatur & Sumber</th>
                <th className="p-4">Jenis & Tujuan</th>
                <th className="p-4 text-right">Nominal</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((trx) => (
                <tr key={trx.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => setSelectedTrx(trx)}>
                  <td className="p-4 text-sm font-semibold text-slate-900">{trx.id}</td>
                  <td className="p-4 text-sm text-slate-600">{trx.date}</td>
                  <td className="p-4">
                    <div className="text-sm font-bold text-slate-900">{trx.donor}</div>
                    <div className="text-xs font-medium text-slate-500 mt-0.5">{trx.source}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-bold text-slate-900">{trx.type}</div>
                    <div className="text-xs font-medium text-slate-500 mt-0.5">{trx.purpose}</div>
                  </td>
                  <td className="p-4 text-sm font-bold text-slate-900 text-right tabular-nums">{trx.amount}</td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                      <CheckCircle2 className="w-3 h-3" /> {trx.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button onClick={(e) => { e.stopPropagation(); setSelectedTrx(trx); }} className="p-2 text-slate-400 hover:text-maun-600 hover:bg-maun-50 rounded-lg transition-colors" title="Lihat Kuitansi">
                      <FileText className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-200 flex justify-between items-center text-sm text-slate-500 bg-slate-50/50">
          <span>Menampilkan 1-4 dari 4 data</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-slate-200 rounded text-slate-400 cursor-not-allowed">Sebelumnya</button>
            <button className="px-3 py-1 border border-slate-200 rounded text-slate-400 cursor-not-allowed">Selanjutnya</button>
          </div>
        </div>
      </div>
    </div>
  );
}
