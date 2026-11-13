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

  it('renders clean user login form', () => {
    renderLogin();

    expect(screen.getByText('Masuk ke Akun')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('nama@email.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Masuk$/i })).toBeInTheDocument();
  });

  it('allows user to input email and password', () => {
    renderLogin();

    const emailInput = screen.getByPlaceholderText('nama@email.com') as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText('••••••••') as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: 'donatur@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'donatur123' } });

    expect(emailInput.value).toBe('donatur@example.com');
    expect(passwordInput.value).toBe('donatur123');
  });

  it('submits login successfully and calls onSuccess', async () => {
    const handleSuccess = vi.fn();

    (api.auth.login as any).mockResolvedValueOnce({
      token: 'mock-jwt-token',
      tokenType: 'Bearer',
      id: 1,
      name: 'Donatur',
      email: 'donatur@example.com',
      role: 'DONATUR',
    });

    renderLogin({ onSuccess: handleSuccess });

    const emailInput = screen.getByPlaceholderText('nama@email.com') as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText('••••••••') as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: 'donatur@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'donatur123' } });

    const submitBtn = screen.getByRole('button', { name: /^Masuk$/i });
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

    const emailInput = screen.getByPlaceholderText('nama@email.com') as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText('••••••••') as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });

    const submitBtn = screen.getByRole('button', { name: /^Masuk$/i });
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

