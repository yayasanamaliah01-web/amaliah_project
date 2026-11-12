import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import CategoryGrid from '../components/CategoryGrid';

describe('CategoryGrid Component Unit Tests', () => {
  it('renders all category navigation items', () => {
    render(<CategoryGrid setActivePage={vi.fn()} />);

    expect(screen.getByText('Infak Santri')).toBeInTheDocument();
    expect(screen.getByText('Zakat')).toBeInTheDocument();
    expect(screen.getByText('Wakaf')).toBeInTheDocument();
    expect(screen.getByText('Qurban')).toBeInTheDocument();
    expect(screen.getByText('Galang Dana')).toBeInTheDocument();
  });

  it('switches tab content when category is clicked', () => {
    render(<CategoryGrid setActivePage={vi.fn()} />);

    // Click Zakat category button
    const zakatBtn = screen.getByText('Zakat');
    fireEvent.click(zakatBtn);

    expect(screen.getByText(/Tentang Program Zakat/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Mulai Zakat Sekarang/i })).toBeInTheDocument();
  });

  it('calls setActivePage when CTA button is clicked', () => {
    const handleSetActivePage = vi.fn();
    render(<CategoryGrid setActivePage={handleSetActivePage} />);

    const ctaButton = screen.getByRole('button', { name: /Mulai Infak Santri Sekarang/i });
    fireEvent.click(ctaButton);

    expect(handleSetActivePage).toHaveBeenCalledWith('programs');
  });
});

