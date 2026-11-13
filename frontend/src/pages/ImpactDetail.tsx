import React from 'react';
import { ArrowLeft, MapPin, CheckCircle2, Calendar, User, Clock, Image as ImageIcon } from 'lucide-react';

export default function ImpactDetailPage({ id, onBack }: { id: string, onBack: () => void }) {
  // Mock data for impact detail
  const detail = {
    programTitle: 'Bantu Warga Kalimantan yang Terdampak Karhutla',
    date: '15 Sep 2026',
    nominal: 'Rp 250.000',
    status: 'Tersalurkan',
    location: 'Kalimantan Tengah',
    beneficiaries: '150 Kepala Keluarga',
    description: 'Alhamdulillah, donasi Anda telah kami salurkan dalam bentuk paket oksigen, masker N95, dan obat-obatan untuk warga yang terdampak kabut asap. Bantuan ini sangat membantu warga untuk tetap bisa bernapas dengan aman di tengah pekatnya asap karhutla.',
    images: [
      'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1593113565214-80afcb4dd16c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=600&q=80'
    ]
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-white border-b border-slate-100 p-4 sticky top-0 z-10 flex items-center justify-center relative">
        <button onClick={onBack} className="absolute left-4 p-2 -ml-2 rounded-full hover:bg-slate-50 text-slate-700 transition-colors" aria-label="Kembali">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-medium text-base sm:text-lg text-slate-700 tracking-normal">
          Detail Penyaluran
        </h1>
      </div>
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 pb-20">
        
        {/* Status Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium mb-0.5">Status Donasi</p>
              <h2 className="text-base font-bold text-emerald-600">Alhamdulillah, Sudah Tersalurkan</h2>
            </div>
          </div>
          
          <h3 className="font-bold text-slate-800 mb-4">{detail.programTitle}</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500 mb-1">Nominal Donasi</p>
              <p className="text-sm font-semibold text-slate-800">{detail.nominal}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Tanggal Donasi</p>
              <p className="text-sm font-semibold text-slate-800">{detail.date}</p>
            </div>
          </div>
        </div>

        {/* Laporan Penyaluran */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6">
          <h3 className="font-bold text-slate-800 mb-4">Laporan Penyaluran</h3>
          
          <div className="space-y-3 mb-5">
            <div className="flex items-start gap-2 text-sm text-slate-600">
              <MapPin className="w-4 h-4 text-amaliah-500 mt-0.5 flex-shrink-0" />
              <span><span className="font-medium text-slate-700">Lokasi:</span> {detail.location}</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-slate-600">
              <User className="w-4 h-4 text-amaliah-500 mt-0.5 flex-shrink-0" />
              <span><span className="font-medium text-slate-700">Penerima Manfaat:</span> {detail.beneficiaries}</span>
            </div>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-700 leading-relaxed mb-5">
            {detail.description}
          </div>

          <h4 className="font-semibold text-sm text-slate-800 mb-3 flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-slate-400" />
            Bukti Foto Penyaluran
          </h4>
          
          <div className="grid grid-cols-2 gap-2">
            {detail.images.map((img, idx) => (
              <div key={idx} className={`rounded-xl overflow-hidden bg-slate-100 ${idx === 0 ? 'col-span-2 aspect-video' : 'aspect-square'}`}>
                <img src={img} alt="Bukti penyaluran" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
}
