import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the canonical desktop Campaign Table intro', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /War O' Ages/i })).toBeInTheDocument();
    expect(screen.getByText(/Assemble a legion across history/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Begin Campaign/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /The Books/i })).toBeInTheDocument();
    expect(screen.getByText(/Your Legion/i)).toBeInTheDocument();
    expect(screen.getByText(/Enemy Warband/i)).toBeInTheDocument();
    expect(screen.getByText(/Today's Battlefield/i)).toBeInTheDocument();
  });

  it('advances from intro into the muster wheel', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /Begin Campaign/i }));

    expect(await screen.findByRole('button', { name: /Spin the Wheel/i })).toBeInTheDocument();
    expect(screen.getByText(/The Wheel of Ages/i)).toBeInTheDocument();
  });

  it('opens The Books codex overlay from the command bar', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /The Books/i }));

    expect(screen.getByText(/The full codex of the wheel/i)).toBeInTheDocument();
    expect(screen.getByText(/193 of 193 figures/i)).toBeInTheDocument();
  });
});
