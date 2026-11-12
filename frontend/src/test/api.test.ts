import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { api, API_BASE_URL } from '../services/api';

describe('API Service Unit Tests', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    localStorage.clear();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  describe('request helper & headers', () => {
    it('should include Authorization header when token exists in localStorage', async () => {
      localStorage.setItem('maun_token', 'test-jwt-token-123');

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: 'ok' }),
      });

      await api.campaigns.getById(1);

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/campaigns/1`,
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Authorization: 'Bearer test-jwt-token-123',
          }),
        })
      );
    });

    it('should throw an error with custom message when API returns non-200', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => ({ message: 'Email sudah terdaftar' }),
      });

      await expect(
        api.auth.register({
          name: 'Test',
          email: 'test@example.com',
          password: 'pass',
        })
      ).rejects.toThrow('Email sudah terdaftar');
    });

    it('should fallback to statusText when error response JSON is invalid', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => {
          throw new Error('Not JSON');
        },
      });

      await expect(api.campaigns.getById(99)).rejects.toThrow('Error 500: Internal Server Error');
    });
  });

  describe('auth endpoints', () => {
    it('should call /auth/login with POST method and body', async () => {
      const mockResponse = {
        token: 'token-abc',
        tokenType: 'Bearer',
        id: 1,
        name: 'Ahmad',
        email: 'ahmad@example.com',
        role: 'DONATUR',
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await api.auth.login({
        email: 'ahmad@example.com',
        password: 'password123',
      });

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/auth/login`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ email: 'ahmad@example.com', password: 'password123' }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should call /auth/register with user registration payload', async () => {
      const registerData = {
        name: 'Ahmad Donatur',
        email: 'ahmad@example.com',
        password: 'password123',
        phone: '08123456789',
        role: 'DONATUR',
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: 'new-token' }),
      });

      const res = await api.auth.register(registerData);

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/auth/register`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(registerData),
        })
      );
      expect(res.token).toBe('new-token');
    });
  });

  describe('campaign endpoints', () => {
    it('should construct correct query parameters for getAll campaigns', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      await api.campaigns.getAll('Pendidikan', 'ACTIVE');

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/campaigns?category=Pendidikan&status=ACTIVE`,
        expect.any(Object)
      );
    });

    it('should omit "Semua" from category query parameter', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      await api.campaigns.getAll('Semua', 'ACTIVE');

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/campaigns?status=ACTIVE`,
        expect.any(Object)
      );
    });

    it('should call getBySlug with encoded slug path', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 5, slug: 'bantuan-beras' }),
      });

      const res = await api.campaigns.getBySlug('bantuan-beras');

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/campaigns/slug/bantuan-beras`,
        expect.any(Object)
      );
      expect(res.slug).toBe('bantuan-beras');
    });
  });

  describe('donation endpoints', () => {
    it('should post donation request to /donations', async () => {
      const donationPayload = {
        campaignId: 1,
        donorName: 'Ahmad',
        donorEmail: 'ahmad@example.com',
        amount: 50000,
        paymentMethod: 'QRIS',
        isAnonymous: false,
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          transactionId: 'DON-12345',
          qrisString: '000201...',
        }),
      });

      const res = await api.donations.create(donationPayload);

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/donations`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(donationPayload),
        })
      );
      expect(res.transactionId).toBe('DON-12345');
    });
  });
});
