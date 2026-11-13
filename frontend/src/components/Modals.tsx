import React, { useState } from 'react';
import { X, Heart, QrCode, CreditCard, CheckCircle, ArrowRight, Sparkles, RefreshCw } from 'lucide-react';
import { api, ApiDonation } from '../services/api';
import { useAppContext } from '../context/AppContext';

export function ModalWrapper({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto border border-slate-100">
        <div className="flex justify-between items-start mb-5">
          <div>
            <h3 className="font-bold text-xl text-slate-900 tracking-tight">{title}</h3>
            {subtitle && <div className="text-xs text-slate-500 mt-1">{subtitle}</div>}
          </div>
          <button onClick={onClose} className="p-1.5 -mr-1 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function CheckoutModal({
  isOpen,
  onClose,
  programId,
  programTitle,
}: {
  isOpen: boolean;
  onClose: () => void;
  programId?: number | string;
  programTitle?: string;
}) {
  const { currentUser, campaigns, refreshAllData } = useAppContext();

  const [step, setStep] = useState<'form' | 'payment' | 'success'>('form');
  const [selectedCampaignId, setSelectedCampaignId] = useState<number>(() => {
    return programId ? Number(programId) : (campaigns[0]?.id || 1);
  });
  const [amount, setAmount] = useState<number>(50000);
  const [donorName, setDonorName] = useState<string>(currentUser?.name || '');
  const [donorEmail, setDonorEmail] = useState<string>(currentUser?.email || '');
  const [donorPhone, setDonorPhone] = useState<string>(currentUser?.phone || '');
  const [doa, setDoa] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<'QRIS' | 'VIRTUAL_ACCOUNT'>('QRIS');

  // Donation response state
  const [donationData, setDonationData] = useState<ApiDonation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSimulatingBankPay, setIsSimulatingBankPay] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const presetAmounts = [25000, 50000, 100000, 250000, 500000];

  const handleCreateDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await api.donations.create({
        campaignId: selectedCampaignId,
        donorName: isAnonymous ? 'Hamba Allah' : (donorName || 'Hamba Allah'),
        donorEmail: donorEmail || undefined,
        donorPhone: donorPhone || undefined,
        isAnonymous,
        amount,
        doa: doa || undefined,
        paymentMethod,
        paymentChannel: 'BSI',
      });

      setDonationData(res);
      setStep('payment');
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal memproses donasi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimulateBankPayment = async () => {
    if (!donationData) return;
    setIsSimulatingBankPay(true);
    setErrorMsg(null);

    try {
      await api.bankSim.payQris(donationData.transactionId, donationData.amount);
      
      // Wait a moment for webhook callback to process
      setTimeout(async () => {
        try {
          const updated = await api.donations.getById(donationData.transactionId);
          setDonationData(updated);
          setStep('success');
          await refreshAllData();
        } catch (_) {
          setStep('success');
        } finally {
          setIsSimulatingBankPay(false);
        }
      }, 1200);
    } catch (err: any) {
      setErrorMsg('Gagal simulasi bayar: ' + (err.message || 'Error'));
      setIsSimulatingBankPay(false);
    }
  };

  const handleClose = () => {
    setStep('form');
    setDonationData(null);
    onClose();
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={handleClose}
      title={step === 'payment' ? 'Pembayaran Donasi' : step === 'success' ? 'Donasi Berhasil!' : 'Infaq & Donasi'}
      subtitle={programTitle || 'Yayasan Semarang Infak (amaliah)'}
    >
      {/* STEP 1: DONATION FORM */}
      {step === 'form' && (
        <form onSubmit={handleCreateDonation} className="flex flex-col gap-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
              {errorMsg}
            </div>
          )}

          {/* Program Selector if not preselected */}
          {!programId && campaigns.length > 0 && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                Pilih Program Donasi
              </label>
              <select
                value={selectedCampaignId}
                onChange={(e) => setSelectedCampaignId(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-emerald-500"
              >
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Nominal Donasi */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
              Pilih / Masukkan Nominal (Rp)
            </label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {presetAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAmount(amt)}
                  className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all ${
                    amount === amt
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Rp {amt.toLocaleString('id-ID')}
                </button>
              ))}
            </div>
            <input
              type="number"
              min={10000}
              step={5000}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full p-3 rounded-xl border border-slate-200 font-extrabold text-lg text-slate-900 outline-none focus:border-emerald-500 text-center bg-slate-50 focus:bg-white"
            />
          </div>

          {/* Data Donatur */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Nama Donatur</label>
              <input
                type="text"
                disabled={isAnonymous}
                placeholder="Nama Lengkap atau Sapaan"
                value={isAnonymous ? 'Hamba Allah' : donorName}
                onChange={(e) => setDonorName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none bg-white focus:border-emerald-500 disabled:bg-slate-200/60"
              />
            </div>

            <label className="text-xs font-semibold text-slate-600 flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 accent-emerald-600 rounded"
              />
              <span>Sembunyikan Nama (Donasi sebagai Hamba Allah)</span>
            </label>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Doa / Pesan Kebaikan (Opsional)</label>
              <textarea
                rows={2}
                placeholder="Tuliskan doa atau harapan untuk program ini..."
                value={doa}
                onChange={(e) => setDoa(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none bg-white focus:border-emerald-500"
              ></textarea>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
              Metode Pembayaran
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('QRIS')}
                className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                  paymentMethod === 'QRIS'
                    ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-700'
                }`}
              >
                <QrCode className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <div className="text-xs font-bold">QRIS Dinamis</div>
                  <div className="text-[10px] text-slate-500">BSI, BCA, GoPay, ShopeePay</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('VIRTUAL_ACCOUNT')}
                className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                  paymentMethod === 'VIRTUAL_ACCOUNT'
                    ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-700'
                }`}
              >
                <CreditCard className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <div className="text-xs font-bold">Virtual Account</div>
                  <div className="text-[10px] text-slate-500">BSI Virtual Account</div>
                </div>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm py-3.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {isLoading ? (
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
            ) : (
              <>
                <Heart className="w-4 h-4 fill-white" /> Lanjutkan ke Pembayaran
              </>
            )}
          </button>
        </form>
      )}

      {/* STEP 2: PAYMENT & QRIS DISPLAY */}
      {step === 'payment' && donationData && (
        <div className="flex flex-col items-center text-center gap-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 w-full text-xs text-emerald-800 font-semibold flex items-center justify-between">
            <span>Total Tagihan:</span>
            <span className="text-base font-black text-emerald-700">Rp {donationData.amount.toLocaleString('id-ID')}</span>
          </div>

          {donationData.paymentMethod === 'QRIS' ? (
            <div className="bg-white p-4 rounded-2xl border-2 border-dashed border-emerald-400 flex flex-col items-center w-full shadow-inner">
              {donationData.qrCodeUrl ? (
                <img
                  src={donationData.qrCodeUrl}
                  alt="QRIS Code"
                  className="w-56 h-56 rounded-xl object-contain bg-white shadow-sm border border-slate-100"
                />
              ) : (
                <div className="w-52 h-52 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                  <QrCode className="w-16 h-16" />
                </div>
              )}
              <div className="text-[11px] font-bold text-slate-700 mt-2">NMID: ID102026amaliah01</div>
              <div className="text-[10px] text-slate-500">Scan dengan aplikasi Mobile Banking atau E-Wallet apa saja</div>
            </div>
          ) : (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 w-full text-left">
              <div className="text-xs text-slate-500 font-medium">Nomor Virtual Account BSI:</div>
              <div className="text-xl font-mono font-black text-slate-900 tracking-wider my-1">
                {donationData.vaNumber || '998877112233'}
              </div>
              <div className="text-[11px] text-slate-500">Atas Nama: <strong>amaliah - {donationData.donorName}</strong></div>
            </div>
          )}

          <div className="text-[11px] text-slate-400 font-medium">
            ID Transaksi: <span className="font-mono text-slate-600">{donationData.transactionId}</span>
          </div>

          {/* LIVE SIMULATION ACTION BUTTON */}
          <div className="w-full bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex flex-col gap-2">
            <div className="text-[11px] font-bold text-slate-600 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Simulasi Pembayaran Bank (Testing Sandbox)</span>
            </div>
            <button
              type="button"
              disabled={isSimulatingBankPay}
              onClick={handleSimulateBankPayment}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {isSimulatingBankPay ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Memproses Callback Bank...
                </>
              ) : (
                <>
                  <CheckCircle className="w-3.5 h-3.5" /> Bayar Sekarang (Simulasi Bank)
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: SUCCESS STATE */}
      {step === 'success' && donationData && (
        <div className="flex flex-col items-center text-center py-4 gap-4">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shadow-inner">
            <CheckCircle className="w-10 h-10" />
          </div>
          <div>
            <h4 className="text-xl font-black text-slate-900">Alhamdulillah, Pembayaran Diterima!</h4>
            <p className="text-xs text-slate-500 mt-1">
              Donasi sebesar <strong>Rp {donationData.amount.toLocaleString('id-ID')}</strong> telah masuk ke rekening yayasan secara realtime.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 w-full text-xs text-left space-y-1.5 font-medium">
            <div className="flex justify-between">
              <span className="text-slate-500">ID Transaksi:</span>
              <span className="font-mono font-bold text-slate-800">{donationData.transactionId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Donatur:</span>
              <span className="font-bold text-slate-800">{donationData.donorName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status Bank:</span>
              <span className="font-bold text-emerald-600 uppercase">Lunas (Mutasi Tercatat)</span>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl transition-all"
          >
            Tutup & Lihat Transparansi
          </button>
        </div>
      )}
    </ModalWrapper>
  );
}
