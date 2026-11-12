export const API_BASE_URL = 'http://localhost:8081/api/v1';
export const BANK_SIM_BASE_URL = 'http://localhost:9090';

// Helper for HTTP requests
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('maun_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = `Error ${response.status}: ${response.statusText}`;
    try {
      const errorJson = await response.json();
      errorMsg = errorJson.message || errorJson.error || errorMsg;
    } catch (_) {}
    throw new Error(errorMsg);
  }

  return response.json();
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string;
  token?: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string;
}

export interface ApiCampaign {
  id: number;
  title: string;
  slug: string;
  category: string;
  targetAmount: number;
  collectedAmount: number;
  donorCount: number;
  remainingDays: number;
  image: string;
  description: string;
  isUrgent: boolean;
  isVerified: boolean;
  location: string;
  organizer: string;
  status: string;
  progressPercentage: number;
  createdAt: string;
}

export interface ApiDonation {
  id: number;
  transactionId: string;
  campaignId: number;
  campaignTitle: string;
  donorName: string;
  donorEmail: string;
  isAnonymous: boolean;
  amount: number;
  doa: string;
  paymentMethod: string;
  paymentChannel: string;
  status: string;
  qrisString?: string;
  qrCodeUrl?: string;
  vaNumber?: string;
  paidAt?: string;
  expiresAt?: string;
  createdAt: string;
}

export interface ApiPublicSummary {
  totalDonationsCollected: number;
  totalFundsDisbursed: number;
  currentLiveBankBalance: number;
  totalDonors: number;
  totalCampaigns: number;
  totalDisbursements: number;
  totalLpjPublished: number;
  bankAccountNumber: string;
  bankAccountName: string;
  bankName: string;
  lastBankSync: string;
}

export interface ApiActivityLog {
  id: number;
  actionType: string;
  title: string;
  description: string;
  amount: number;
  campaignId?: number;
  campaignTitle?: string;
  actorName: string;
  iconType: string;
  timestamp: string;
}

export interface ApiBankMutation {
  id: number;
  transactionId: string;
  type: 'CREDIT' | 'DEBIT';
  amount: number;
  description: string;
  reference: string;
  balanceAfter?: number;
  category: string;
  campaignTitle?: string;
  timestamp: string;
}

export interface ApiLpj {
  id: number;
  lpjNumber: string;
  campaignId: number;
  campaignTitle: string;
  disbursementId?: number;
  title: string;
  summary: string;
  totalSpent: number;
  remainingFunds: number;
  beneficiaryCount: number;
  location: string;
  documentationUrls: string;
  breakdownItemsJson: string;
  preparedBy: string;
  verifiedBy: string;
  status: string;
  reportDate: string;
  createdAt: string;
}

export interface ApiDisbursement {
  id: number;
  disbursementNumber: string;
  campaignId: number;
  campaignTitle: string;
  title: string;
  amount: number;
  category: string;
  beneficiaryName: string;
  beneficiaryAccount: string;
  beneficiaryBank: string;
  status: string;
  approvedBy: string;
  notes: string;
  receiptUrl: string;
  disbursementDate: string;
}

export const api = {
  auth: {
    login: (body: { email: string; password: string }) =>
      request<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    register: (body: { name: string; email: string; password: string; phone?: string; role?: string }) =>
      request<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
  },
  campaigns: {
    getAll: (category?: string, status?: string) => {
      const params = new URLSearchParams();
      if (category && category !== 'Semua') params.append('category', category);
      if (status) params.append('status', status);
      const query = params.toString() ? `?${params.toString()}` : '';
      return request<ApiCampaign[]>(`/campaigns${query}`);
    },
    getById: (id: number | string) => request<ApiCampaign>(`/campaigns/${id}`),
    getBySlug: (slug: string) => request<ApiCampaign>(`/campaigns/slug/${slug}`),
    create: (data: any) =>
      request<ApiCampaign>('/campaigns', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },
  donations: {
    create: (data: {
      campaignId: number;
      donorName: string;
      donorEmail?: string;
      donorPhone?: string;
      isAnonymous?: boolean;
      amount: number;
      doa?: string;
      paymentMethod?: string;
      paymentChannel?: string;
    }) =>
      request<ApiDonation>('/donations', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    getById: (transactionId: string) => request<ApiDonation>(`/donations/${transactionId}`),
    getByCampaign: (campaignId: number | string) =>
      request<ApiDonation[]>(`/donations/campaign/${campaignId}`),
    getRecent: () => request<ApiDonation[]>('/donations/recent'),
  },
  transparency: {
    getSummary: () => request<ApiPublicSummary>('/transparency/summary'),
    getCampaignDetail: (campaignId: number | string) =>
      request<{
        campaign: ApiCampaign;
        totalCollected: number;
        totalDisbursed: number;
        remainingBalance: number;
        recentDonations: ApiDonation[];
        disbursements: ApiDisbursement[];
        lpjReports: ApiLpj[];
        activityLogs: ApiActivityLog[];
      }>(`/transparency/campaign/${campaignId}`),
    getActivities: () => request<ApiActivityLog[]>('/transparency/activities'),
    getMutations: () => request<ApiBankMutation[]>('/transparency/mutations'),
  },
  lpj: {
    getAll: () => request<ApiLpj[]>('/lpj'),
    getById: (id: number | string) => request<ApiLpj>(`/lpj/${id}`),
    getByCampaign: (campaignId: number | string) => request<ApiLpj[]>(`/lpj/campaign/${campaignId}`),
    create: (data: {
      campaignId: number;
      disbursementId?: number;
      title: string;
      summary: string;
      totalSpent: number;
      beneficiaryCount: number;
      location?: string;
      documentationUrls?: string;
      breakdownItemsJson?: string;
    }) =>
      request<ApiLpj>('/lpj', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },
  disbursements: {
    getAll: () => request<ApiDisbursement[]>('/disbursements'),
    getByCampaign: (campaignId: number | string) =>
      request<ApiDisbursement[]>(`/disbursements/campaign/${campaignId}`),
    create: (data: {
      campaignId: number;
      title: string;
      amount: number;
      category?: string;
      beneficiaryName?: string;
      beneficiaryAccount?: string;
      beneficiaryBank?: string;
      notes?: string;
      receiptUrl?: string;
      executeBankTransfer?: boolean;
    }) =>
      request<ApiDisbursement>('/disbursements', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },
  bankSync: {
    trigger: () =>
      request<{ message: string; status: string }>('/bank-sync/trigger', {
        method: 'POST',
      }),
  },
  bankSim: {
    payQris: async (orderId: string, amount: number) => {
      const res = await fetch(`${BANK_SIM_BASE_URL}/sim/pay-qris`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referenceNo: orderId, amount }),
      });
      return res.json();
    },
    getDashboard: async () => {
      const res = await fetch(`${BANK_SIM_BASE_URL}/sim/dashboard`);
      return res.json();
    },
  },
};
