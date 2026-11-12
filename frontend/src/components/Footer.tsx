import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-16 mt-0">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-sm">
        
        <div className="md:col-span-1">
          <div className="font-semibold text-xl text-white tracking-tight mb-2">Pesantren Amaliah</div>
          <p className="leading-relaxed mb-6 text-slate-400">
            Platform resmi infak, wakaf, dan operasional Pesantren Amaliah. Amanah, transparan, dan berdampak nyata bagi santri dan dakwah.
          </p>
          <div className="text-xs space-y-1.5 text-slate-400">
            <div>Terdaftar di Kemenag RI & BAZNAS</div>
            <div>Akreditasi & Tata Kelola Syariah</div>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-white mb-4">Program Pesantren</h4>
          <ul className="space-y-3">
            <li><a href="#programs" className="hover:text-white transition-colors">Beasiswa Santri Tahfidz</a></li>
            <li><a href="#programs" className="hover:text-white transition-colors">Wakaf Pembangunan Asrama</a></li>
            <li><a href="#programs" className="hover:text-white transition-colors">Operasional & Beras Santri</a></li>
            <li><a href="#programs" className="hover:text-white transition-colors">Kitab & Sarana Belajar</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-white mb-4">Layanan</h4>
          <ul className="space-y-3">
            <li><a href="#" className="hover:text-white transition-colors">Kalkulator Zakat</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Buku Kas & Mutasi</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Laporan Penyaluran (LPJ)</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Konfirmasi Infaq</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-white mb-4">Sekretariat</h4>
          <ul className="space-y-3">
            <li>0812-3456-1111</li>
            <li>layanan@amaliah.id</li>
            <li className="leading-relaxed">Komplek Pondok Pesantren Amaliah, Jawa Tengah</li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-800 px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
        <div>
          © 2026 Pesantren Amaliah. All rights reserved.
        </div>
        <div className="flex gap-4">
          <span>Keamanan Enkripsi SSL</span>
          <span>100% Transparan</span>
        </div>
      </div>
    </footer>
  );
}
