import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the production Campaign Table shell', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /War O' Ages/i })).toBeInTheDocument();
    expect(screen.getByText(/Assemble a legion across history/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Begin Campaign/i })).toBeInTheDocument();
    expect(screen.getByText(/Your Legion/i)).toBeInTheDocument();
    expect(screen.getByText(/Daily Battlefield/i)).toBeInTheDocument();
  });
});
