import React, { useState } from 'react';
import {
  User,
  LogOut,
  ChevronRight,
  Settings,
  Heart,
  ShieldCheck,
  Wallet,
  History,
  MapPin,
  Calendar,
  CheckCircle2,
  Shield,
  Phone,
  Mail,
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function ProfilePage({
  onLogout,
  onEnterAdmin,
}: {
  onLogout: () => void;
  onEnterAdmin?: () => void;
}) {
  const { currentUser, tasks, userRole } = useAppContext();
  const [showLaporan, setShowLaporan] = useState(false);

  const userDonationTasks = tasks;

  if (showLaporan) {
    return (
      <div className="bg-slate-50 min-h-screen pb-16 pt-5">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <button
            onClick={() => setShowLaporan(false)}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 mb-5 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 rotate-180" /> Kembali ke Profil
          </button>

          <h2 className="text-lg font-bold text-slate-800 mb-4">Laporan & Dokumentasi Penyaluran</h2>

          <div className="space-y-4">
            {userDonationTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
              >
                <div className="p-4 border-b border-slate-100 flex justify-between items-start bg-slate-50/70">
                  <div>
                    <h3 className="font-semibold text-sm text-slate-800 mb-0.5">{task.program}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-normal">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> {task.date}
                    </div>
                  </div>
                  {task.status === 'Selesai' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Disalurkan
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                      Dalam Proses
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-3 font-normal">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      Penerima: <span className="font-medium text-slate-800">{task.recipient}</span>
                    </span>
                  </div>

                  {task.status === 'Selesai' && task.reportPhoto ? (
                    <div className="space-y-3">
                      <div>
                        <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide mb-1.5">
                          Dokumentasi Penyaluran
                        </div>
                        <img
                          src={task.reportPhoto}
                          alt="Dokumentasi"
                          className="w-full h-44 object-cover rounded-xl border border-slate-200"
                        />
                      </div>

                      {task.reportNote && (
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wide mb-0.5">
                            Catatan Amil Lapangan
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed font-normal">"{task.reportNote}"</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-center">
                      <p className="text-xs text-slate-500 font-normal">
                        Bantuan sedang dalam proses penyaluran oleh Amil. Laporan dan kuitansi akan diverifikasi.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20 pt-5">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* User Info Header - Primary Background */}
        <div className="bg-emerald-700 rounded-2xl p-4 sm:p-5 mb-4 flex items-center justify-between text-white shadow-sm border border-emerald-800">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 sm:w-14 sm:h-14 bg-white/15 text-white rounded-xl flex items-center justify-center font-bold text-lg sm:text-xl border border-white/20 shrink-0 backdrop-blur-xs">
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-semibold text-white">
                  {currentUser?.name || 'Hamba Allah'}
                </h2>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-emerald-800/80 text-emerald-100 uppercase tracking-wide border border-emerald-600/60">
                  {currentUser?.role || userRole}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-100/90 font-normal mt-0.5">
                <Mail className="w-3.5 h-3.5 text-emerald-200" />
                <span>{currentUser?.email || 'Belum masuk'}</span>
              </div>
              {currentUser?.phone && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-100/90 font-normal mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-200" />
                  <span>{currentUser.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dompet Kebaikan Section */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-4 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 flex items-center justify-center">
                <Wallet className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-normal mb-0.5">Akumulasi Infaq & Donasi Anda</div>
                <div className="text-base sm:text-lg font-bold text-slate-800">Rp 2.450.000</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-100">
            <button
              onClick={() => setShowLaporan(true)}
              className="flex items-center justify-center gap-1.5 bg-slate-50 text-slate-700 text-xs font-medium py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <History className="w-3.5 h-3.5 text-emerald-600" /> Riwayat & LPJ
            </button>
            <button
              onClick={() => setShowLaporan(true)}
              className="flex items-center justify-center gap-1.5 bg-slate-50 text-slate-700 text-xs font-medium py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Bukti Kuitansi <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Other Menus */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-4">
          {userRole === 'admin' && onEnterAdmin && (
            <button
              onClick={onEnterAdmin}
              className="w-full flex items-center justify-between p-3.5 sm:p-4 hover:bg-slate-50 transition-colors border-b border-slate-100 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-slate-800 text-xs sm:text-sm">Dashboard Admin Yayasan</div>
                  <div className="text-[10px] text-slate-400 font-normal">Kelola kampanye, mutasi bank & LPJ</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          )}

          <button className="w-full flex items-center justify-between p-3.5 sm:p-4 hover:bg-slate-50 transition-colors border-b border-slate-100 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 flex items-center justify-center">
                <Heart className="w-4 h-4 stroke-[1.5]" />
              </div>
              <span className="font-medium text-slate-700 text-xs sm:text-sm">Program Pilihan Saya</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button className="w-full flex items-center justify-between p-3.5 sm:p-4 hover:bg-slate-50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 stroke-[1.5]" />
              </div>
              <span className="font-medium text-slate-700 text-xs sm:text-sm">Pusat Bantuan & Audit Syariah</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="w-full bg-white border border-slate-200 text-rose-600 font-medium text-xs sm:text-sm p-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-rose-50/50 hover:border-rose-200 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Keluar dari Akun
        </button>
      </div>
    </div>
  );
}
