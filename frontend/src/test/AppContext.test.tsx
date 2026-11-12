import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import React from 'react';
import { AppProvider, useAppContext } from '../context/AppContext';
import { api } from '../services/api';

vi.mock('../services/api', () => ({
  API_BASE_URL: 'http://localhost:8081/api/v1',
  api: {
    campaigns: {
      getAll: vi.fn().mockResolvedValue([]),
    },
    transparency: {
      getSummary: vi.fn().mockResolvedValue(null),
      getActivities: vi.fn().mockResolvedValue([]),
      getMutations: vi.fn().mockResolvedValue([]),
    },
    lpj: {
      getAll: vi.fn().mockResolvedValue([]),
    },
    auth: {
      login: vi.fn(),
      register: vi.fn(),
    },
  },
}));

describe('AppContext Unit Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AppProvider>{children}</AppProvider>
  );

  it('should initialize with default guest state when localStorage is empty', async () => {
    const { result } = renderHook(() => useAppContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoadingData).toBe(false);
    });

    expect(result.current.userRole).toBe('guest');
    expect(result.current.currentUser).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.tasks.length).toBeGreaterThan(0);
  });

  it('should initialize with saved user from localStorage', async () => {
    const savedUser = {
      id: 1,
      name: 'Admin User',
      email: 'admin@amaliah.id',
      role: 'ADMIN',
    };
    localStorage.setItem('maun_user', JSON.stringify(savedUser));
    localStorage.setItem('maun_token', 'saved-jwt-123');

    const { result } = renderHook(() => useAppContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoadingData).toBe(false);
    });

    expect(result.current.currentUser).toEqual(savedUser);
    expect(result.current.token).toBe('saved-jwt-123');
    expect(result.current.userRole).toBe('admin');
  });

  it('should handle login and update user, token, and userRole', async () => {
    const mockAuthResponse = {
      token: 'jwt-token-login',
      tokenType: 'Bearer',
      id: 10,
      name: 'Budi Donatur',
      email: 'budi@example.com',
      role: 'DONATUR',
      phone: '08123456789',
    };

    (api.auth.login as any).mockResolvedValueOnce(mockAuthResponse);

    const { result } = renderHook(() => useAppContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoadingData).toBe(false);
    });

    await act(async () => {
      await result.current.login('budi@example.com', 'password123');
    });

    expect(api.auth.login).toHaveBeenCalledWith({
      email: 'budi@example.com',
      password: 'password123',
    });

    expect(result.current.token).toBe('jwt-token-login');
    expect(result.current.currentUser?.name).toBe('Budi Donatur');
    expect(result.current.userRole).toBe('user');
    expect(localStorage.getItem('maun_token')).toBe('jwt-token-login');
  });

  it('should handle register and update user and token', async () => {
    const mockRegisterResponse = {
      token: 'jwt-token-register',
      tokenType: 'Bearer',
      id: 11,
      name: 'Siti Rahma',
      email: 'siti@example.com',
      role: 'DONATUR',
      phone: '08987654321',
    };

    (api.auth.register as any).mockResolvedValueOnce(mockRegisterResponse);

    const { result } = renderHook(() => useAppContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoadingData).toBe(false);
    });

    await act(async () => {
      await result.current.register(
        'Siti Rahma',
        'siti@example.com',
        'secretPass',
        '08987654321',
        'DONATUR'
      );
    });

    expect(result.current.token).toBe('jwt-token-register');
    expect(result.current.currentUser?.email).toBe('siti@example.com');
  });

  it('should handle logout and clear state and localStorage', async () => {
    localStorage.setItem('maun_token', 'token-to-be-cleared');
    localStorage.setItem('maun_user', JSON.stringify({ name: 'User' }));

    const { result } = renderHook(() => useAppContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoadingData).toBe(false);
    });

    act(() => {
      result.current.logout();
    });

    expect(result.current.currentUser).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.userRole).toBe('guest');
    expect(localStorage.getItem('maun_token')).toBeNull();
    expect(localStorage.getItem('maun_user')).toBeNull();
  });

  it('should update task status and details via updateTask', async () => {
    const { result } = renderHook(() => useAppContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoadingData).toBe(false);
    });

    act(() => {
      result.current.updateTask('OUT-004', {
        status: 'Selesai',
        reportNote: 'Bantuan telah diterima langsung.',
      });
    });

    const updated = result.current.tasks.find((t) => t.id === 'OUT-004');
    expect(updated?.status).toBe('Selesai');
    expect(updated?.reportNote).toBe('Bantuan telah diterima langsung.');
  });
});
