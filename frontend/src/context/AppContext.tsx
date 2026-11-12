import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  api,
  API_BASE_URL,
  UserProfile,
  ApiCampaign,
  ApiPublicSummary,
  ApiActivityLog,
  ApiBankMutation,
  ApiLpj
} from '../services/api';

export type TaskStatus = 'Menunggu Laporan' | 'Menunggu Persetujuan' | 'Selesai';

export interface PenyaluranTask {
  id: string;
  date: string;
  program: string;
  recipient: string;
  amount: string;
  status: TaskStatus;
  notes: string;
  reportPhoto?: string | null;
  reportNote?: string | null;
}

export type UserRole = 'guest' | 'user' | 'admin' | 'penyalur' | 'analis' | 'ketua';

interface AppContextType {
  // Auth state & actions
  currentUser: UserProfile | null;
  user: UserProfile | null;
  userRole: UserRole;
  token: string | null;
  setUserRole: (role: UserRole) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string, role?: string) => Promise<void>;
  logout: () => void;

  // Backend Live Data
  campaigns: ApiCampaign[];
  summary: ApiPublicSummary | null;
  activities: ApiActivityLog[];
  mutations: ApiBankMutation[];
  lpjReports: ApiLpj[];
  isLoadingData: boolean;
  refreshAllData: () => Promise<void>;
  refreshData: () => Promise<void>;

  // Tasks for amil/penyalur
  tasks: PenyaluranTask[];
  updateTask: (id: string, updates: Partial<PenyaluranTask>) => void;
}

export const AppContext = createContext<AppContextType>({} as any);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('maun_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('maun_token');
  });

  const [userRole, setUserRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('maun_user');
    if (saved) {
      const user = JSON.parse(saved);
      const roleMap: Record<string, UserRole> = {
        ADMIN: 'admin',
        BENDAHARA: 'analis',
        RELAWAN: 'penyalur',
        DONATUR: 'user',
      };
      return roleMap[user.role?.toUpperCase()] || 'user';
    }
    return 'guest';
  });

  // Live Backend Data States
  const [campaigns, setCampaigns] = useState<ApiCampaign[]>([]);
  const [summary, setSummary] = useState<ApiPublicSummary | null>(null);
  const [activities, setActivities] = useState<ApiActivityLog[]>([]);
  const [mutations, setMutations] = useState<ApiBankMutation[]>([]);
  const [lpjReports, setLpjReports] = useState<ApiLpj[]>([]);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);

  // Default tasks for penyalur
  const [tasks, setTasks] = useState<PenyaluranTask[]>([
    {
      id: 'OUT-004',
      date: '27 Ags 2026',
      program: 'Bantuan Biaya Hidup (Bpk. Ahmad)',
      recipient: 'Bpk. Ahmad (Lansia)',
      amount: 'Rp 500.000',
      status: 'Menunggu Laporan',
      notes: 'Harap foto penerima saat penyerahan sembako dan uang tunai.',
      reportPhoto: null,
      reportNote: null,
    },
    {
      id: 'OUT-005',
      date: '28 Ags 2026',
      program: 'Santunan Yatim Desa B',
      recipient: 'Panti Asuhan Al-Ikhlas',
      amount: 'Rp 5.000.000',
      status: 'Menunggu Persetujuan',
      notes: 'Penyerahan bantuan operasional panti asuhan.',
      reportPhoto: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=400',
      reportNote: 'Dana telah diterima oleh ketua panti asuhan beserta bukti kuitansi.',
    },
    {
      id: 'OUT-006',
      date: '20 Ags 2026',
      program: 'Pembangunan Sumur Bor',
      recipient: 'Warga Dusun Sukamaju',
      amount: 'Rp 15.000.000',
      status: 'Selesai',
      notes: 'Penyaluran tahap akhir.',
      reportPhoto: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=400',
      reportNote: 'Alhamdulillah air sudah mengalir dan dapat digunakan warga.',
    },
  ]);

  const refreshAllData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const [cRes, sRes, aRes, mRes, lRes] = await Promise.allSettled([
        api.campaigns.getAll(),
        api.transparency.getSummary(),
        api.transparency.getActivities(),
        api.transparency.getMutations(),
        api.lpj.getAll(),
      ]);

      if (cRes.status === 'fulfilled') setCampaigns(cRes.value);
      if (sRes.status === 'fulfilled') setSummary(sRes.value);
      if (aRes.status === 'fulfilled') setActivities(aRes.value);
      if (mRes.status === 'fulfilled') setMutations(mRes.value);
      if (lRes.status === 'fulfilled') setLpjReports(lRes.value);
    } catch (err) {
      console.error('Error fetching backend data:', err);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    refreshAllData();

    // Lightweight Real-time Push via Server-Sent Events (SSE)
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource(`${API_BASE_URL}/stream/live`);

      eventSource.addEventListener('DONATION_SUCCESS', (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);
          console.log('[SSE] Live Donation received:', data);
          refreshAllData();
        } catch (_) {
          refreshAllData();
        }
      });

      eventSource.addEventListener('DISBURSEMENT_SUCCESS', (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);
          console.log('[SSE] Live Disbursement processed:', data);
          refreshAllData();
        } catch (_) {
          refreshAllData();
        }
      });

      eventSource.addEventListener('BANK_SYNCED', () => {
        console.log('[SSE] Live Bank Statement synced');
        refreshAllData();
      });

      eventSource.onerror = () => {
        // EventSource automatically handles reconnection
      };
    } catch (err) {
      console.debug('[SSE] Stream init:', err);
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [refreshAllData]);

  const login = async (email: string, password: string) => {
    const res = await api.auth.login({ email, password });
    const user: UserProfile = {
      id: res.id,
      name: res.name,
      email: res.email,
      role: res.role,
      phone: res.phone,
      token: res.token,
    };

    localStorage.setItem('maun_token', res.token);
    localStorage.setItem('maun_user', JSON.stringify(user));

    setCurrentUser(user);
    setToken(res.token);

    const roleMap: Record<string, UserRole> = {
      ADMIN: 'admin',
      BENDAHARA: 'analis',
      RELAWAN: 'penyalur',
      DONATUR: 'user',
    };
    setUserRole(roleMap[res.role?.toUpperCase()] || 'user');
  };

  const register = async (name: string, email: string, password: string, phone?: string, role?: string) => {
    const res = await api.auth.register({ name, email, password, phone, role: role || 'DONATUR' });
    const user: UserProfile = {
      id: res.id,
      name: res.name,
      email: res.email,
      role: res.role,
      phone: res.phone,
      token: res.token,
    };

    localStorage.setItem('maun_token', res.token);
    localStorage.setItem('maun_user', JSON.stringify(user));

    setCurrentUser(user);
    setToken(res.token);

    const roleMap: Record<string, UserRole> = {
      ADMIN: 'admin',
      BENDAHARA: 'analis',
      RELAWAN: 'penyalur',
      DONATUR: 'user',
    };
    setUserRole(roleMap[res.role?.toUpperCase()] || 'user');
  };

  const logout = () => {
    localStorage.removeItem('maun_token');
    localStorage.removeItem('maun_user');
    setCurrentUser(null);
    setToken(null);
    setUserRole('guest');
  };

  const updateTask = (id: string, updates: Partial<PenyaluranTask>) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        user: currentUser,
        userRole,
        token,
        setUserRole,
        login,
        register,
        logout,
        campaigns,
        summary,
        activities,
        mutations,
        lpjReports,
        isLoadingData,
        refreshAllData,
        refreshData: refreshAllData,
        tasks,
        updateTask,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
