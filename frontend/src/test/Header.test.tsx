import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import Header from '../components/Header';

describe('Header Component Unit Tests', () => {
  it('renders logo and navigation links', () => {
    render(
      <MemoryRouter>
        <Header isLoggedIn={false} onLogout={vi.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByAltText('Semarang Infak')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Cari program donasi atau zakat/i)).toBeInTheDocument();
    expect(screen.getByText('Donasi')).toBeInTheDocument();
    expect(screen.getByText('Zakat')).toBeInTheDocument();
  });

  it('shows Login button when user is not logged in', () => {
    render(
      <MemoryRouter>
        <Header isLoggedIn={false} onLogout={vi.fn()} />
      </MemoryRouter>
    );

    const loginLinks = screen.getAllByRole('link', { name: /Masuk/i });
    expect(loginLinks.length).toBeGreaterThan(0);
    expect(loginLinks[0]).toHaveAttribute('href', '/login');
  });

  it('shows Logout button when user is logged in and triggers onLogout callback', () => {
    const handleLogout = vi.fn();

    render(
      <MemoryRouter>
        <Header isLoggedIn={true} onLogout={handleLogout} />
      </MemoryRouter>
    );

    const logoutButton = screen.getByRole('button', { name: /Keluar/i });
    expect(logoutButton).toBeInTheDocument();

    fireEvent.click(logoutButton);
    expect(handleLogout).toHaveBeenCalledTimes(1);
  });

  it('shows Dashboard button on root path when logged in, but hides it on other paths like /dashboard', () => {
    // 1. On root path '/'
    const { unmount } = render(
      <MemoryRouter initialEntries={['/']}>
        <Header isLoggedIn={true} onLogout={vi.fn()} />
      </MemoryRouter>
    );

    const dashboardLinks = screen.getAllByRole('link', { name: /Dashboard/i });
    expect(dashboardLinks.length).toBeGreaterThan(0);
    expect(dashboardLinks[0]).toHaveAttribute('href', '/dashboard');

    unmount();

    // 2. On non-root path '/dashboard'
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Header isLoggedIn={true} onLogout={vi.fn()} />
      </MemoryRouter>
    );

    const hiddenDashboardLinks = screen.queryAllByRole('link', { name: /Dashboard/i });
    expect(hiddenDashboardLinks.length).toBe(0);
  });
});
