import React, { useState } from 'react';
import { Routes, Route, useNavigate, useParams, NavLink } from 'react-router-dom';
import {
  Camera,
  CheckCircle2,
  Upload,
  MapPin,
  Calendar,
  ArrowLeft,
  LogOut,
  Home,
  ClipboardList,
  User,
  Clock,
  ChevronRight,
  FileCheck,
} from 'lucide-react';
import { useAppContext, PenyaluranTask } from '../context/AppContext';
import BeritaAcaraModal from '../components/BeritaAcaraModal';

// Sub-page: Form Pelaporan Tugas Penyaluran (dengan URL path /penyalur/tasks/:taskId/report)
function PenyaluranReportForm() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { tasks, updateTask } = useAppContext();

  const currentTask = tasks.find((t) => t.id === taskId);
  const [photo, setPhoto] = useState<string | null>(null);
  const [note, setNote] = useState('');

  if (!currentTask) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center max-w-sm">
          <p className="text-slate-700 font-bold mb-3">Tugas tidak ditemukan atau sudah selesai.</p>
          <button
            onClick={() => navigate('/penyalur')}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
          >
            Kembali ke Daftar Tugas
          </button>
        </div>
      </div>
    );
  }

  const handleSubmitReport = () => {
    updateTask(currentTask.id, {
      status: 'Menunggu Persetujuan',
      reportPhoto: photo || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=400',
      reportNote: note || 'Laporan penyaluran telah diserahkan di lokasi.',
    });
    navigate('/penyalur/history');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20">
      <div className="bg-white px-4 py-4 border-b border-slate-200 sticky top-0 z-10 flex items-center gap-3 shadow-xs">
        <button
          onClick={() => navigate('/penyalur')}
          className="p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-full transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-bold text-slate-900 text-base">Buat Laporan Penyaluran</h1>
      </div>

      <div className="flex-1 p-4 space-y-5 max-w-md mx-auto w-full">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="text-xs font-mono font-bold text-emerald-700 mb-1">{currentTask.id}</div>
          <h2 className="text-lg font-bold text-slate-900 mb-3">{currentTask.program}</h2>

          <div className="space-y-2.5">
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                <MapPin className="w-4 h-4 text-slate-400" />
              </div>
              <div>
                <strong className="text-slate-900 block text-xs">{currentTask.recipient}</strong>
                <span className="text-[11px] text-slate-400">Penerima Manfaat</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                <Calendar className="w-4 h-4 text-slate-400" />
              </div>
              <div>
                <strong className="text-slate-900 block text-xs">{currentTask.date}</strong>
                <span className="text-[11px] text-slate-400">Target Tanggal</span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3.5 bg-amber-50 rounded-xl border border-amber-100 text-xs">
            <div className="font-bold text-amber-800 mb-0.5 uppercase tracking-wider text-[10px]">Catatan Admin</div>
            <div className="text-amber-900 leading-relaxed">{currentTask.notes}</div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-sm px-1">Unggah Bukti Penyaluran</h3>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Foto Dokumentasi Lapangan</label>
              {photo ? (
                <div className="relative rounded-xl overflow-hidden border border-slate-200 group">
                  <img src={photo} alt="Preview" className="w-full h-52 object-cover" />
                  <button
                    onClick={() => setPhoto(null)}
                    className="absolute inset-0 bg-black/60 text-white flex items-center justify-center text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    Ganti Foto
                  </button>
                </div>
              ) : (
                <div
                  onClick={() =>
                    setPhoto(
                      'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=400'
                    )
                  }
                  className="w-full h-44 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-100 hover:border-emerald-500 hover:text-emerald-700 cursor-pointer transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-xs border border-slate-100 mb-2">
                    <Camera className="w-5 h-5 text-emerald-600" />
                  </div>
                  <span className="font-semibold text-xs">Ambil Foto / Unggah Bukti</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Keterangan Kondisi Lapangan</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="Ceritakan detail penyerahan donasi, reaksi penerima manfaat..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white transition-all resize-none text-xs"
              ></textarea>
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmitReport}
          className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-3.5 rounded-xl font-bold text-xs hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
        >
          <Upload className="w-4 h-4" /> Kirim Laporan Penyaluran
        </button>
      </div>
    </div>
  );
}

// Sub-page: Daftar Tugas Aktif
function PenyaluranTasksList() {
  const { tasks } = useAppContext();
  const navigate = useNavigate();
  const activeTasks = tasks.filter((t) => t.status === 'Menunggu Laporan');

  return (
    <div className="space-y-4">
      {activeTasks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 shadow-xs mt-4">
          <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-7 h-7 text-emerald-600" />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-1">Semua Selesai!</h3>
          <p className="text-slate-500 font-normal text-xs">Tidak ada tugas penyaluran tertunda saat ini.</p>
        </div>
      ) : (
        activeTasks.map((task) => (
          <div
            key={task.id}
            onClick={() => navigate(`/penyalur/tasks/${task.id}/report`)}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-emerald-400 hover:shadow-sm transition-all group relative overflow-hidden"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-500"></div>
            <div className="p-4 pl-5">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-mono font-bold text-slate-500">{task.id}</span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  <Clock className="w-3 h-3 text-amber-600" /> Menunggu Laporan
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-0.5 group-hover:text-emerald-700 transition-colors">
                {task.program}
              </h3>
              <p className="text-xs text-slate-600 mb-3">{task.recipient}</p>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    Nominal Penyaluran
                  </div>
                  <div className="font-bold text-slate-900 text-sm">{task.amount}</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// Sub-page: Riwayat Laporan Selesai
function PenyaluranHistory() {
  const { tasks } = useAppContext();
  const [selectedHistoryTask, setSelectedHistoryTask] = useState<PenyaluranTask | null>(null);
  const historyTasks = tasks.filter((t) => t.status !== 'Menunggu Laporan');

  return (
    <div className="space-y-4">
      {historyTasks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 shadow-xs mt-4">
          <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <p className="text-slate-500 font-normal text-xs">Belum ada riwayat laporan terkirim.</p>
        </div>
      ) : (
        historyTasks.map((task) => (
          <div key={task.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-0.5">{task.program}</h3>
                <div className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> {task.date}
                </div>
              </div>
              {task.status === 'Selesai' ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                  <CheckCircle2 className="w-3 h-3" /> Disetujui
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                  <Clock className="w-3 h-3" /> Menunggu Review
                </span>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 text-xs text-slate-600 mb-3">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-slate-800">{task.recipient}</span>
              </div>
              {task.reportPhoto && (
                <div className="flex gap-3 mb-3">
                  <img
                    src={task.reportPhoto}
                    alt="Report"
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <p className="text-xs text-slate-600 line-clamp-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex-1 italic">
                    &quot;{task.reportNote}&quot;
                  </p>
                </div>
              )}
              {task.status === 'Selesai' && (
                <button
                  onClick={() => setSelectedHistoryTask(task)}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <FileCheck className="w-4 h-4 text-emerald-600" /> Lihat Berita Acara
                </button>
              )}
            </div>
          </div>
        ))
      )}

      <BeritaAcaraModal
        isOpen={!!selectedHistoryTask}
        onClose={() => setSelectedHistoryTask(null)}
        task={selectedHistoryTask}
      />
    </div>
  );
}

// Sub-page: Profil Amil Penyalur
function PenyaluranProfile() {
  const { tasks, setUserRole, logout } = useAppContext();
  const navigate = useNavigate();
  const activeTasks = tasks.filter((t) => t.status === 'Menunggu Laporan');
  const historyTasks = tasks.filter((t) => t.status !== 'Menunggu Laporan');

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col items-center text-center">
        <div className="w-18 h-18 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-700 mb-3 border-4 border-white shadow-xs">
          <User className="w-9 h-9" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Ahmad Penyalur</h2>
        <p className="text-xs text-slate-500 font-medium mb-5">Amil Lapangan • Semarang & Sekitarnya</p>

        <div className="grid grid-cols-2 gap-4 w-full pt-5 border-t border-slate-100">
          <div>
            <div className="text-xl font-bold text-emerald-700 mb-0.5">{historyTasks.length}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tugas Selesai</div>
          </div>
          <div>
            <div className="text-xl font-bold text-amber-500 mb-0.5">{activeTasks.length}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tugas Aktif</div>
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          logout();
          setUserRole('guest');
          navigate('/');
        }}
        className="w-full bg-white border border-slate-200 text-slate-700 font-bold p-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors shadow-xs cursor-pointer text-xs"
      >
        <LogOut className="w-4 h-4" /> Keluar Akun Amil
      </button>
    </div>
  );
}

export default function PenyalurApp() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20">
      <Routes>
        <Route path="tasks/:taskId/report" element={<PenyaluranReportForm />} />
        <Route
          path="*"
          element={
            <>
              {/* Header */}
              <div className="bg-emerald-800 text-white px-5 py-4 sticky top-0 z-10 shadow-xs rounded-b-2xl mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="font-bold text-lg">Portal Amil Penyalur</h1>
                    <p className="text-emerald-200 text-xs mt-0.5">
                      Penyaluran amanah donasi Yayasan Semarang Infak
                    </p>
                  </div>
                </div>
              </div>

              {/* Body Content with Sub-routes */}
              <div className="flex-1 px-4 max-w-md mx-auto w-full">
                <Routes>
                  <Route index element={<PenyaluranTasksList />} />
                  <Route path="history" element={<PenyaluranHistory />} />
                  <Route path="profile" element={<PenyaluranProfile />} />
                </Routes>
              </div>

              {/* Bottom Nav using React Router NavLink */}
              <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe z-30 shadow-md">
                <div className="flex items-center justify-around max-w-md mx-auto">
                  <NavLink
                    to="/penyalur"
                    end
                    className={({ isActive }) =>
                      `flex-1 flex flex-col items-center justify-center py-2.5 px-2 gap-1 transition-colors ${
                        isActive ? 'text-emerald-700 font-bold' : 'text-slate-400 hover:text-slate-600'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className={`p-1 rounded-full ${isActive ? 'bg-emerald-50' : 'bg-transparent'}`}>
                          <Home className={`w-5 h-5 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.5]'}`} />
                        </div>
                        <span className="text-[10px]">Tugas</span>
                      </>
                    )}
                  </NavLink>

                  <NavLink
                    to="/penyalur/history"
                    className={({ isActive }) =>
                      `flex-1 flex flex-col items-center justify-center py-2.5 px-2 gap-1 transition-colors ${
                        isActive ? 'text-emerald-700 font-bold' : 'text-slate-400 hover:text-slate-600'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className={`p-1 rounded-full ${isActive ? 'bg-emerald-50' : 'bg-transparent'}`}>
                          <ClipboardList className={`w-5 h-5 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.5]'}`} />
                        </div>
                        <span className="text-[10px]">Riwayat</span>
                      </>
                    )}
                  </NavLink>

                  <NavLink
                    to="/penyalur/profile"
                    className={({ isActive }) =>
                      `flex-1 flex flex-col items-center justify-center py-2.5 px-2 gap-1 transition-colors ${
                        isActive ? 'text-emerald-700 font-bold' : 'text-slate-400 hover:text-slate-600'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className={`p-1 rounded-full ${isActive ? 'bg-emerald-50' : 'bg-transparent'}`}>
                          <User className={`w-5 h-5 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.5]'}`} />
                        </div>
                        <span className="text-[10px]">Profil</span>
                      </>
                    )}
                  </NavLink>
                </div>
              </div>
            </>
          }
        />
      </Routes>
    </div>
  );
}
