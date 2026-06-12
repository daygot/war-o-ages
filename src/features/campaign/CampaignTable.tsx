import { useMemo, useState } from 'react';
import { FigureCard } from '../../components/FigureCard';
import { Button, Panel, SectionRule, Tag } from '../../components/core';
import { buildDailyCampaign, scoreLegion } from '../../domain/engine';

const phases = ['Intro', 'Muster', 'Council', 'Battle', 'Verdict'] as const;

export function CampaignTable() {
  const campaign = useMemo(() => buildDailyCampaign(), []);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const playerScore = useMemo(() => scoreLegion(campaign.player, campaign.battleground, campaign.ideology, campaign.seed), [campaign]);
  const enemyScore = useMemo(() => scoreLegion(campaign.enemy, campaign.battleground, campaign.ideology, campaign.seed + 7), [campaign]);
  const currentPhase = phases[phaseIndex];

  return (
    <main className="campaign-shell">
      <header className="command-bar" aria-label="Campaign navigation">
        <div className="brand-lockup">
          <div className="sigil-mark">⚔</div>
          <span className="deco">War <span className="wo-o">O</span>' Ages</span>
        </div>
        <nav className="phase-nav">
          {phases.map((phase, index) => (
            <button key={phase} type="button" className={index === phaseIndex ? 'phase is-active' : 'phase'} onClick={() => setPhaseIndex(index)}>
              {index > 0 ? '· ' : ''}{phase}
            </button>
          ))}
        </nav>
        <span className="label">Seed {campaign.seed}</span>
      </header>

      <section className="hero-panel panel frame-rule">
        <div>
          <p className="label">Daily Chronicle</p>
          <h1>War O' Ages</h1>
          <p className="serif-it">Assemble a legion across history. Spin the wheel. Conquer the ages.</p>
        </div>
        <Button variant="gold" onClick={() => setPhaseIndex(Math.min(phaseIndex + 1, phases.length - 1))}>
          {phaseIndex === 0 ? 'Begin Campaign ✦' : `Advance to ${phases[Math.min(phaseIndex + 1, phases.length - 1)]} ✦`}
        </Button>
      </section>

      <div className="war-table">
        <aside className="rail">
          <SectionRule>Your Legion</SectionRule>
          <div className="stack">
            {campaign.player.map((pick) => <FigureCard key={pick.position.key} pick={pick} compact />)}
          </div>
        </aside>

        <section className="stage">
          <Panel title={currentPhase} dark>
            <h2>The Campaign Table Is Being Forged</h2>
            <p className="serif-it">This production shell now runs through Vite, React, and TypeScript. The old CDN/Babel prototype remains as a visual reference while the game rules move into typed modules.</p>
            <div className="battlefield-card">
              <span className="label">Daily Battlefield</span>
              <h3>{campaign.battleground.name}</h3>
              <p>{campaign.battleground.terrain}</p>
              <div className="tag-row">
                {campaign.battleground.favoredTags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
              </div>
            </div>
            <div className="score-grid">
              <div>
                <span className="label">Your Verdict</span>
                <strong>{playerScore.final}</strong>
              </div>
              <div>
                <span className="label">Enemy Warband</span>
                <strong>{enemyScore.final}</strong>
              </div>
            </div>
          </Panel>
        </section>

        <aside className="rail">
          <SectionRule>War Council</SectionRule>
          <Panel title="Ideology" accent="var(--gold)">
            <h3>{campaign.ideology.name}</h3>
            <p className="serif-it">{campaign.ideology.tenet}</p>
            <div className="tag-row">
              {campaign.ideology.favoredTags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
            </div>
          </Panel>
          <Panel title="Synergies" accent="var(--seal)">
            {playerScore.synergies.length ? playerScore.synergies.map((synergy) => <p key={synergy} className="synergy-line">✦ {synergy}</p>) : <p className="serif-it">No omen has yet repeated.</p>}
          </Panel>
        </aside>
      </div>
    </main>
  );
}
