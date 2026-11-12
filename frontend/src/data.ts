import { Program, Article } from './types';

export const programsData: Program[] = [
  {
    id: 'dapur-1',
    category: 'dapur',
    categoryLabel: 'Dapur & Beras Santri',
    categoryColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    title: 'Operasional Dapur & Sedekah Beras Santri Penghafal Qur\'an',
    description: 'Kebutuhan pokok pangan 1.5 ton beras dan lauk pauk bergizi harian bagi santri mukim Pesantren Amaliah.',
    raisedPercentage: 85,
    daysLeft: 8,
    raisedAmount: 'Rp42.500.000',
    targetAmount: 'dari Rp 50jt',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80',
    campaigner: 'Dapur Berkah Amaliah'
  },
  {
    id: 'guru-1',
    category: 'guru',
    categoryLabel: 'Bisyarah Guru & Ustadz',
    categoryColor: 'bg-blue-100 text-blue-800 border-blue-200',
    title: 'Kafalah & Tunjangan Bulanan Asatidz Pembina Santri',
    description: 'Penyaluran bisyarah dan tunjangan kehormatan bagi 15 ustadz pengajar tahfidz dan diniyah pesantren.',
    raisedPercentage: 70,
    daysLeft: 16,
    raisedAmount: 'Rp35.000.000',
    targetAmount: 'dari Rp 50jt',
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80',
    campaigner: 'Biro SDM Pesantren'
  },
  {
    id: 'sarana-1',
    category: 'sarana',
    categoryLabel: 'Listrik, Air & Sarana',
    categoryColor: 'bg-amber-100 text-amber-800 border-amber-200',
    title: 'Operasional Listrik PLN, Pompa Air Bersih & Pemeliharaan Asrama',
    description: 'Biaya utilitas rutin bulanan listrik pesantren, perawatan sumur artesis, dan kelayakan sanitasi asrama.',
    raisedPercentage: 64,
    daysLeft: 21,
    raisedAmount: 'Rp19.200.000',
    targetAmount: 'dari Rp 30jt',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=600&q=80',
    campaigner: 'Pengelola Sarpras Pesantren'
  }
];

export const articlesData: Article[] = [
  {
    id: 'art_1',
    slug: 'lansia-pekerja',
    title: 'Lansia Pekerja',
    category: 'Kisah Berdampak',
    author: 'Tim Syariah MAUN',
    date: '16 Agustus 2026',
    readTime: '5 min baca',
    imgUrl: 'https://images.unsplash.com/photo-1544448777-62283e3c0429?auto=format&fit=crop&w=400&q=80',
    summary: 'Setiap sedekah yang Anda salurkan akan menjadi jembatan kebaikan yang meringankan beban hidup para lansia ini.',
    content: 'Pernahkah kita membayangkan menjadi mereka?...',
    categoryColor: 'bg-purple-100 text-purple-800'
  },
  {
    id: 'art_2',
    slug: 'panduan-lengkap-zakat-mal',
    title: 'Panduan Lengkap Zakat Mal & Zakat Penghasilan Menurut Ketentuan BAZNAS & MUI',
    category: 'Edukasi Zakat',
    author: 'Tim Syariah MAUN',
    date: '16 Agustus 2026',
    readTime: '5 min baca',
    imgUrl: 'https://images.unsplash.com/photo-1604594849809-dfedbc827105?auto=format&fit=crop&w=400&q=80',
    summary: 'Pahami perhitungan nisab bulanan setara 85gr emas, cara menghitung 2.5% penghasilan bersih, serta 8 golongan asnaf penerima zakat.',
    content: 'Zakat merupakan salah satu rukun Islam...',
    categoryColor: 'bg-maun-100 text-maun-800'
  }
];
