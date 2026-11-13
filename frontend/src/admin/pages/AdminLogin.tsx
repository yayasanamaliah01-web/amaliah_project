import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Building2,
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, currentUser, userRole, logout } = useAppContext();

  const [email, setEmail] = useState('admin@amaliah.id');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const demoAccounts = [
    { label: 'Admin Utama', email: 'admin@amaliah.id', pass: 'admin123' },
    { label: 'Bendahara', email: 'bendahara@amaliah.id', pass: 'bendahara123' },
    { label: 'Pengurus / Relawan', email: 'relawan@amaliah.id', pass: 'relawan123' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      await login(email, password);
      // Read updated user from localStorage
      const userStr = localStorage.getItem('amaliah_user');
      const user = userStr ? JSON.parse(userStr) : null;
      const role = user?.role?.toUpperCase();

      if (role === 'DONATUR') {
        logout();
        setErrorMsg('Akses ditolak: Akun ini adalah akun Donatur/Jamaah umum. Portal ini hanya untuk pengurus/admin pesantren.');
        setIsLoading(false);
        return;
      }

      setSuccessMsg('Autentikasi administrator berhasil! Mengalihkan ke panel...');
      setTimeout(() => {
        navigate('/admin');
      }, 600);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal masuk. Periksa email dan password administrator Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background Accent */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 z-10">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Portal Publik
        </button>

        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-tr from-emerald-600 to-teal-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 mb-3 border border-emerald-400/30">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Portal Administrator
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Khusus Pengurus, Bendahara & Manajemen Pesantren Amaliah
          </p>
        </div>

        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          {errorMsg && (
            <div className="mb-4 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start gap-2.5 text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2.5 text-emerald-400 text-xs font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Administrator *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@amaliah.id"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl focus:outline-none focus:border-emerald-500 text-white text-xs font-medium transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl focus:outline-none focus:border-emerald-500 text-white text-xs font-medium transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-lg shadow-emerald-600/30"
            >
              {isLoading ? (
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" /> Masuk ke Panel Admin
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access for Admin */}
          <div className="mt-6 pt-5 border-t border-slate-700/60">
            <p className="text-[11px] font-semibold text-slate-400 mb-2">Akses Cepat Pengurus:</p>
            <div className="grid grid-cols-3 gap-2">
              {demoAccounts.map((d) => (
                <button
                  key={d.label}
                  type="button"
                  onClick={() => {
                    setEmail(d.email);
                    setPassword(d.pass);
                    setErrorMsg(null);
                  }}
                  className={`p-2 rounded-lg text-center text-[10px] font-semibold border transition-all cursor-pointer ${
                    email === d.email
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] text-slate-500 mt-6">
          Pesantren Amaliah Secure Administration Portal © 2026
        </p>
      </div>
    </div>
  );
}

