import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithGoogle } = useAppContext();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('Memverifikasi akun Google Anda...');

  useEffect(() => {
    const code = searchParams.get('code');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setError('Otorisasi Google dibatalkan atau ditolak.');
      return;
    }

    if (!code) {
      setError('Kode otorisasi Google tidak ditemukan dalam respon.');
      return;
    }

    const processAuth = async () => {
      try {
        setStatus('Berhasil terhubung ke Google. Menyiapkan sesi akun...');
        const redirectUri = window.location.origin + '/auth/google/callback';
        await loginWithGoogle(undefined, code, redirectUri);
        setStatus('Login berhasil! Mengalihkan ke dashboard...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 600);
      } catch (err: any) {
        setError(err.message || 'Gagal memproses autentikasi Google.');
      }
    };

    processAuth();
  }, [searchParams, loginWithGoogle, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8 text-center">
        {error ? (
          <div>
            <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-100">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-bold text-slate-800 mb-2">Autentikasi Gagal</h2>
            <p className="text-xs text-slate-500 mb-6">{error}</p>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Kembali ke Halaman Login
            </button>
          </div>
        ) : (
          <div>
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-100">
              <Loader2 className="w-7 h-7 animate-spin" />
            </div>
            <h2 className="text-lg font-bold text-slate-800 mb-2">Masuk dengan Google</h2>
            <p className="text-xs text-slate-500">{status}</p>
          </div>
        )}
      </div>
    </div>
  );
}

