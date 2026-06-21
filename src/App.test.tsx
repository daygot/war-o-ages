import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from './App';

describe('App', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it('renders the canonical desktop Campaign Table intro', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /War O' Ages/i })).toBeInTheDocument();
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

  it('renders the completed legion council instead of blanking after all positions are filled', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /Council/i }));

    expect(await screen.findByText(/The War Council/i)).toBeInTheDocument();
    expect(screen.getByText(/Synergies & De-Buffs/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /March to War/i })).toBeInTheDocument();
    expect(document.body.textContent).toContain('Choose an Ideology');
  });

  it('renders the verdict screen with a twist of fate instead of blanking', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.75);
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /Verdict/i }));

    expect(await screen.findByText(/Victory|Defeat/i)).toBeInTheDocument();
    expect(screen.getByText(/The Reckoning/i)).toBeInTheDocument();
    expect(screen.getByText(/Share the Chronicle/i)).toBeInTheDocument();
    expect(screen.getByText(/New War/i)).toBeInTheDocument();
  });

  it('opens The Books codex overlay from the command bar', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /The Books/i }));

    expect(screen.getByText(/The full codex of the wheel/i)).toBeInTheDocument();
    expect(screen.getByText(/193 of 193 figures/i)).toBeInTheDocument();
  });
});
