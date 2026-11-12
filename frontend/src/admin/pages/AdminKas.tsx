import React, { useState } from 'react';
import { Wallet, Landmark, ArrowRightLeft, History, ArrowLeft, Download, ShieldCheck, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function AdminKas() {
  const { summary, mutations: liveMutations } = useAppContext();
  const [selectedAcc, setSelectedAcc] = useState<any>(null);

  const mainBalance = summary?.currentLiveBankBalance || 154500000;
  const accountNumber = summary?.bankAccountNumber || '7711223344';
  const bankName = summary?.bankName || 'Bank Syariah Indonesia (BSI)';

  const accounts = [
    {
      id: 1,
      name: bankName,
      no: accountNumber,
      type: 'Rekening Utama (BI-SNAP Terhubung)',
      rawBalance: mainBalance,
      balance: `Rp ${mainBalance.toLocaleString('id-ID')}`,
      icon: Landmark,
      isLive: true,
    },
    {
      id: 2,
      name: 'Bank Muamalat (Operasional)',
      no: '3219876543',
      type: 'Rekening Cadangan',
      rawBalance: 120500000,
      balance: 'Rp 120.500.000',
      icon: Landmark,
      isLive: false,
    },
    {
      id: 3,
      name: 'Kas Tunai / Brankas Yayasan',
      no: '-',
      type: 'Kas Kecil (Petty Cash)',
      rawBalance: 33850000,
      balance: 'Rp 33.850.000',
      icon: Wallet,
      isLive: false,
    },
  ];

  // Export mutations to CSV
  const handleExport = () => {
    const listToExport = selectedAcc?.isLive && liveMutations.length > 0 ? liveMutations : [];
    const headers = ['ID Mutasi', 'Deskripsi', 'Tipe', 'Nominal', 'Referensi', 'Tanggal'];
    const rows = listToExport.map((m) => [
      m.transactionId || m.id,
      `"${(m.description || '').replace(/"/g, '""')}"`,
      m.type,
      m.amount,
      m.reference || '-',
      m.timestamp || '-',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mutasi-${selectedAcc?.no || 'kas'}-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (selectedAcc) {
    const isLive = selectedAcc.isLive;
    const hasLiveMutations = isLive && liveMutations && liveMutations.length > 0;

    return (
      <div className="p-6 bg-slate-50 min-h-full">
        <button
          onClick={() => setSelectedAcc(null)}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Kas
        </button>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden mb-6">
          <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row justify-between md:items-center gap-4 bg-slate-50/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-emerald-700 shadow-xs">
                <selectedAcc.icon className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900 leading-tight">{selectedAcc.name}</h2>
                  {isLive && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" /> Live Bank API
                    </span>
                  )}
                </div>
                <p className="text-xs font-medium text-slate-500 mt-1">
                  Rekening: <span className="font-mono font-semibold text-slate-700">{selectedAcc.no}</span> • {selectedAcc.type}
                </p>
              </div>
            </div>
            <div className="text-left md:text-right">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Saldo Kas Terverifikasi</div>
              <div className="text-2xl font-bold text-slate-900 tabular-nums">{selectedAcc.balance}</div>
            </div>
          </div>

          <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white">
            <h3 className="font-bold text-slate-800 text-sm">Mutasi Rekening (Buku Kas Terkini)</h3>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" /> Export Mutasi CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                  <th className="p-4">Tanggal & Waktu</th>
                  <th className="p-4">Uraian Transaksi</th>
                  <th className="p-4">Kategori / Ref</th>
                  <th className="p-4 text-right text-emerald-700">Masuk (Kredit)</th>
                  <th className="p-4 text-right text-rose-600">Keluar (Debet)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {hasLiveMutations ? (
                  liveMutations.map((mut) => {
                    const isCredit = mut.type === 'CREDIT';
                    return (
                      <tr key={mut.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-4 text-slate-600 font-medium">
                          {mut.timestamp ? new Date(mut.timestamp).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : 'Hari ini'}
                        </td>
                        <td className="p-4 font-semibold text-slate-800">
                          <div className="flex items-center gap-2">
                            <span className={`p-1 rounded-md ${isCredit ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                              {isCredit ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                            </span>
                            <span>{mut.description}</span>
                          </div>
                        </td>
                        <td className="p-4 text-slate-500 font-mono text-[11px]">
                          {mut.reference || mut.category || '-'}
                        </td>
                        <td className="p-4 font-bold text-emerald-700 text-right tabular-nums">
                          {isCredit ? `+ Rp ${mut.amount?.toLocaleString('id-ID')}` : '-'}
                        </td>
                        <td className="p-4 font-bold text-rose-600 text-right tabular-nums">
                          {!isCredit ? `- Rp ${mut.amount?.toLocaleString('id-ID')}` : '-'}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  [
                    { date: '28 Okt 2026 10:15', desc: 'Transfer Masuk - Infaq Program Santri', ref: 'QRIS-DON-9921', in: 'Rp 2.500.000', out: '-' },
                    { date: '27 Okt 2026 14:30', desc: 'Penyaluran - Pengadaan Beras Santri', ref: 'DISB-2026-001', in: '-', out: 'Rp 4.500.000' },
                    { date: '26 Okt 2026 09:00', desc: 'Transfer Masuk - Zakat Penghasilan VA', ref: 'VA-9090771122', in: 'Rp 5.000.000', out: '-' },
                    { date: '25 Okt 2026 16:45', desc: 'Operasional Listrik PLN Pesantren', ref: 'PLN-AUTO-DEB', in: '-', out: 'Rp 1.250.000' },
                  ].map((mut, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-4 text-slate-600 font-medium">{mut.date}</td>
                      <td className="p-4 font-semibold text-slate-800">{mut.desc}</td>
                      <td className="p-4 text-slate-500 font-mono text-[11px]">{mut.ref}</td>
                      <td className="p-4 font-bold text-emerald-700 text-right tabular-nums">{mut.in}</td>
                      <td className="p-4 font-bold text-rose-600 text-right tabular-nums">{mut.out}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 min-h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">Kas & Rekening Bank</h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitoring rekening bank yayasan terintegrasi API BI-SNAP dan pencatatan buku kas.
          </p>
        </div>
        <div className="flex gap-2.5">
          <button
            onClick={() => setSelectedAcc(accounts[0])}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs cursor-pointer"
          >
            <History className="w-4 h-4" /> Buka Buku Kas Utama
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
        {accounts.map((acc) => (
          <div
            key={acc.id}
            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-400 transition-all cursor-pointer"
            onClick={() => setSelectedAcc(acc)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
                  <acc.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm leading-tight">{acc.name}</h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">{acc.no}</p>
                </div>
              </div>
              {acc.isLive && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              )}
            </div>
            <div className="pt-4 border-t border-slate-100">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Saldo Kas Terverifikasi
              </div>
              <div className="text-2xl font-bold text-slate-900 tabular-nums mb-3">{acc.balance}</div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedAcc(acc);
                }}
                className="w-full py-2 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 text-slate-600 text-xs font-semibold rounded-xl transition-colors border border-slate-200/80 flex justify-center items-center gap-1.5 cursor-pointer"
              >
                <History className="w-3.5 h-3.5" /> Lihat Rincian Mutasi
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
