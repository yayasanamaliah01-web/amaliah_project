import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../pages/Login';
import { AppProvider } from '../context/AppContext';
import { api } from '../services/api';

vi.mock('../services/api', () => ({
  API_BASE_URL: 'http://localhost:8081/api/v1',
  api: {
    campaigns: { getAll: vi.fn().mockResolvedValue([]) },
    transparency: {
      getSummary: vi.fn().mockResolvedValue(null),
      getActivities: vi.fn().mockResolvedValue([]),
      getMutations: vi.fn().mockResolvedValue([]),
    },
    lpj: { getAll: vi.fn().mockResolvedValue([]) },
    auth: {
      login: vi.fn(),
      register: vi.fn(),
    },
  },
}));

describe('LoginPage Component Unit Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  const renderLogin = (props: { onBack?: () => void; onSuccess?: () => void } = {}) => {
    return render(
      <MemoryRouter>
        <AppProvider>
          <LoginPage onBack={props.onBack || vi.fn()} onSuccess={props.onSuccess} />
        </AppProvider>
      </MemoryRouter>
    );
  };

  it('renders login form and demo accounts', () => {
    renderLogin();

    expect(screen.getByText('Masuk ke Akun')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('nama@email.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Masuk/i })).toBeInTheDocument();
    expect(screen.getByText(/Admin Pesantren/i)).toBeInTheDocument();
    expect(screen.getByText(/Bendahara Pesantren/i)).toBeInTheDocument();
  });

  it('selects demo account and fills credentials', () => {
    renderLogin();

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'BENDAHARA' } });

    const emailInput = screen.getByPlaceholderText('nama@email.com') as HTMLInputElement;
    expect(emailInput.value).toBe('bendahara@amaliah.id');
  });

  it('submits login successfully and calls onSuccess', async () => {
    const handleSuccess = vi.fn();

    (api.auth.login as any).mockResolvedValueOnce({
      token: 'mock-jwt-token',
      tokenType: 'Bearer',
      id: 1,
      name: 'Admin',
      email: 'admin@amaliah.id',
      role: 'ADMIN',
    });

    renderLogin({ onSuccess: handleSuccess });

    const submitBtn = screen.getByRole('button', { name: /Masuk/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Login berhasil/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(handleSuccess).toHaveBeenCalled();
    }, { timeout: 1500 });
  });

  it('displays error message when login fails', async () => {
    (api.auth.login as any).mockRejectedValueOnce(
      new Error('Email atau password salah')
    );

    renderLogin();

    const submitBtn = screen.getByRole('button', { name: /Masuk/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Email atau password salah')).toBeInTheDocument();
    });
  });

  it('switches between Login and Register tabs', () => {
    renderLogin();

    const registerSwitchBtn = screen.getByRole('button', { name: /Daftar sekarang/i });
    fireEvent.click(registerSwitchBtn);

    expect(screen.getByPlaceholderText('Contoh: Ahmad Fauzan')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Daftar Sekarang/i })).toBeInTheDocument();
  });
});

