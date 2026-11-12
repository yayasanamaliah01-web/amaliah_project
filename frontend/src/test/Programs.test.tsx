import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import Programs from '../components/Programs';
import { AppProvider } from '../context/AppContext';

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

describe('Programs Component Unit Tests', () => {
  it('renders section title and filter buttons', async () => {
    render(
      <AppProvider>
        <Programs onSelectProgram={vi.fn()} />
      </AppProvider>
    );

    expect(screen.getByText('Pilih Program Kebaikan')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Semua' })).toBeInTheDocument();
  });

  it('filters program list when category filter button is clicked', async () => {
    render(
      <AppProvider>
        <Programs onSelectProgram={vi.fn()} />
      </AppProvider>
    );

    const dapurFilterBtn = screen.getByRole('button', { name: /Dapur & Beras/i });
    fireEvent.click(dapurFilterBtn);

    expect(dapurFilterBtn).toHaveClass('bg-emerald-600');
  });

  it('triggers onSelectProgram when program card is clicked', async () => {
    const handleSelect = vi.fn();

    render(
      <AppProvider>
        <Programs onSelectProgram={handleSelect} />
      </AppProvider>
    );

    const programCard = screen.getByText(/Operasional Dapur & Sedekah Beras/i);
    expect(programCard).toBeInTheDocument();

    fireEvent.click(programCard);
    expect(handleSelect).toHaveBeenCalledWith('dapur-1');
  });
});
