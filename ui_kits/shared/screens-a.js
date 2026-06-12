/* War O' Ages — screens A: Intro + Spin */

const { useState: useStateA, useEffect: useEffectA, useRef: useRefA } = React;
const WOAs = window.WOA;

// ── Shared header ─────────────────────────────────────────────
function TopBar({ left, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
        <Sigil size={30} />
        <span className="disp" style={{ fontSize: 15, letterSpacing: '0.08em' }}>{left || <>War <span className="wo-o">O</span>' Ages</>}</span>
      </div>
      <div className="label" style={{ fontSize: 9.5 }}>{right}</div>
    </div>
  );
}
function Sigil({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="18.5" fill="#2a2017" stroke="var(--gold)" strokeWidth="1.5" />
      <path d="M20,7 L24,18 L20,15 L16,18 Z" fill="var(--seal-2)" />
      <path d="M20,33 L16,22 L20,25 L24,22 Z" fill="var(--gold)" />
      <circle cx="20" cy="20" r="2.4" fill="var(--gold-bright)" />
    </svg>
  );
}

// ── Intro: Battlefield reveal ─────────────────────────────────
function IntroScreen({ battleground, enemy, onBegin }) {
  // The General is concealed pre-battle — only commander & strategist sighted.
  const reveal = ['commander', 'strategist'];
  return (
    <div className="woa-screen">
      <div style={{ textAlign: 'center', marginTop: 6, animation: 'woaFadeUp 0.6s ease both' }}>
        <Sigil size={50} />
        <div className="deco" style={{ fontSize: 33, fontWeight: 900, letterSpacing: '0.04em', margin: '8px 0 0', color: 'var(--ink)' }}>War <span className="wo-o">O</span>' Ages</div>
        <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 14, color: 'var(--ink-soft)', marginTop: 2 }}>
          Assemble a legion across history.
        </div>
      </div>

      <div className="panel" style={{ marginTop: 20, padding: 16, textAlign: 'center', animation: 'woaFadeUp 0.6s ease 0.1s both' }}>
        <div className="frame-rule" />
        <div className="label" style={{ marginBottom: 6 }}>Today's Battleground</div>
        <div className="disp" style={{ fontSize: 27, color: 'var(--seal)' }}>{battleground.name}</div>
        <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 13.5, color: 'var(--ink-soft)', margin: '4px 14px 12px' }}>
          {battleground.terrain}
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          <span style={{ ...pillA, color: 'var(--c-EASIA)', borderColor: hexA('#3f7d5a', 0.5) }}>▲ {battleground.buff}</span>
          <span style={{ ...pillA, color: 'var(--seal)', borderColor: hexA('#8f2d22', 0.5) }}>▼ {battleground.debuff}</span>
        </div>
      </div>

      <div style={{ marginTop: 18, animation: 'woaFadeUp 0.6s ease 0.2s both' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
          <span className="caps" style={{ fontSize: 11, color: 'var(--ink)' }}>The Enemy Musters</span>
          <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
          <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 11.5, color: 'var(--ink-faint)' }}>2 of 5 sighted</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {WOAs.POSITIONS.map(p => (
            <FigureRow key={p.key} fig={enemy[p.key]} positionAbbr={p.abbr} hidden={!reveal.includes(p.key)} pos={p.key} />
          ))}
        </div>
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 22, animation: 'woaFadeUp 0.6s ease 0.3s both' }}>
        <button className="btn btn-primary" style={{ width: '100%' }} onClick={onBegin}>Begin Campaign ✦</button>
        <div style={{ textAlign: 'center', fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 12, color: 'var(--ink-faint)', marginTop: 9 }}>
          Spin the wheel of history. Fill all five ranks.
        </div>
      </div>
    </div>
  );
}
const pillA = {
  fontFamily: 'var(--display)', fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em',
  padding: '3px 8px', borderRadius: 2, border: '1px solid', background: 'rgba(255,250,235,0.5)',
};

// ── Spin loop ─────────────────────────────────────────────────
function SpinScreen({ squad, setSquad, battleground, exclude = [], onComplete }) {
  const placedKeys = WOAs.POSITIONS.filter(p => squad[p.key]).map(p => p.key);
  const stepIndex = placedKeys.length;
  const pos = WOAs.POSITIONS[Math.min(stepIndex, 4)];
  const done = stepIndex >= 5;

  const [phase, setPhase] = useStateA('idle'); // idle | spinning | resolved
  const [regionRot, setRegionRot] = useStateA(0);
  const [eraRot, setEraRot] = useStateA(0);
  const [landed, setLanded] = useStateA({ region: null, era: null });
  const [drawn, setDrawn] = useStateA(null);
  const [justPlaced, setJustPlaced] = useStateA(null);
  const [hint, setHint] = useStateA(null);
  const timers = useRefA([]);

  useEffectA(() => () => timers.current.forEach(clearTimeout), []);

  const regions = Object.values(WOAs.REGIONS);
  const eras = Object.values(WOAs.ERAS);

  function spin() {
    if (phase !== 'idle' || done) return;
    const used = WOAs.squadList(squad).map(f => f.name);
    let pool = WOAs.poolFor(pos.key).filter(f => !used.includes(f.name) && !exclude.includes(f.name));
    if (!pool.length) pool = WOAs.poolFor(pos.key);
    const fig = pool[Math.floor(Math.random() * pool.length)];
    const ri = regions.findIndex(r => r.key === fig.region);
    const ei = eras.findIndex(e => e.key === fig.era);
    const segR = 360 / regions.length, segE = 360 / eras.length;
    const targR = ((-ri * segR) % 360 + 360) % 360;
    const targE = (((180 - ei * segE) % 360) + 360) % 360;
    setRegionRot(r => r + 360 * 4 + ((targR - (r % 360)) % 360 + 360) % 360);
    setEraRot(r => r - 360 * 5 - (((r - targE) % 360) + 360) % 360);
    setLanded({ region: null, era: null });
    setDrawn(null); setHint(null);
    setPhase('spinning');

    timers.current.push(setTimeout(() => setLanded({ region: fig.region, era: null }), 3200));
    timers.current.push(setTimeout(() => setLanded({ region: fig.region, era: fig.era }), 3550));
    timers.current.push(setTimeout(() => { setDrawn(fig); setPhase('resolved'); }, 3900));
  }

  function confirmPlace() {
    if (!drawn) return;
    const next = { ...squad, [pos.key]: drawn };
    const before = WOAs.detectSynergies(squad).length;
    const after = WOAs.detectSynergies(next);
    setSquad(next);
    setJustPlaced(pos.key);
    setDrawn(null); setPhase('idle'); setLanded({ region: null, era: null });
    if (after.length > before) {
      const fresh = after[after.length - 1];
      setHint(fresh);
      timers.current.push(setTimeout(() => setHint(null), 2600));
    }
    timers.current.push(setTimeout(() => setJustPlaced(null), 700));
    if (WOAs.POSITIONS.filter(p => next[p.key]).length >= 5) {
      timers.current.push(setTimeout(onComplete, 650));
    }
  }

  return (
    <div className="woa-screen">
      <TopBar left={<>War <span className="wo-o">O</span>' Ages</>} right={`Rank ${Math.min(stepIndex + 1, 5)} / 5`} />

      <FormationBoard squad={squad} activePos={!done ? pos.key : null} justPlaced={justPlaced}
        battleground={battleground} height={280} />

      {/* current objective */}
      {!done && (
        <div style={{ textAlign: 'center', margin: '14px 0 6px' }}>
          <div className="label">Now drawing</div>
          <div className="disp" style={{ fontSize: 21, color: pos.key && 'var(--ink)' }}>The {pos.name}</div>
          <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 12.5, color: 'var(--ink-soft)' }}>{pos.blurb}</div>
        </div>
      )}

      {/* dial / drawn card area */}
      <div style={{ position: 'relative', minHeight: 264, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {!drawn && (
          <CompassDial size={236} regionRot={regionRot} eraRot={eraRot}
            spinning={phase === 'spinning'} landedRegion={landed.region} landedEra={landed.era} />
        )}
        {phase === 'spinning' && (
          <div className="caps" style={{ marginTop: 14, fontSize: 11, color: 'var(--seal)', animation: 'woaFloat 1s ease-in-out infinite' }}>
            {landed.region ? (landed.era ? 'Summoning…' : 'Era settling…') : 'The wheel turns…'}
          </div>
        )}
        {drawn && (
          <div style={{ width: '100%', animation: 'woaPop 0.45s ease both' }}>
            <div style={{ textAlign: 'center', marginBottom: 8 }}>
              <span className="caps" style={{ fontSize: 10, color: 'var(--gold)' }}>✦ Drawn from the {WOAs.REGIONS[drawn.region].name} ✦</span>
            </div>
            <FigureCard fig={drawn} positionName={`${pos.name} · ${drawn.eraName}`} pos={pos.key} />
          </div>
        )}
      </div>

      {/* synergy hint toast */}
      {hint && (
        <div style={{ position: 'fixed', bottom: 96, left: '50%', transform: 'translateX(-50%)', zIndex: 80,
          background: 'linear-gradient(180deg,#2a2017,#3a2c1c)', color: '#e7d3a8', padding: '8px 16px',
          borderRadius: 3, border: '1px solid var(--gold)', boxShadow: '0 6px 18px rgba(0,0,0,0.35)',
          animation: 'woaPop 0.4s ease both', textAlign: 'center', maxWidth: 280 }}>
          <div className="caps" style={{ fontSize: 10, color: 'var(--gold-bright)' }}>Synergy Stirring</div>
          <div className="disp" style={{ fontSize: 15 }}>{hint.name} <span style={{ color: '#9fd1a8' }}>{hint.pct > 0 ? '+' : ''}{hint.pct}%</span></div>
        </div>
      )}

      {/* action */}
      <div style={{ marginTop: 12 }}>
        {phase === 'idle' && !done && (
          <button className="btn btn-gold" style={{ width: '100%' }} onClick={spin}>
            Spin the Wheel — {pos.name}
          </button>
        )}
        {phase === 'spinning' && (
          <button className="btn btn-ghost" style={{ width: '100%', opacity: 0.6 }} disabled>Spinning…</button>
        )}
        {phase === 'resolved' && drawn && (
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={confirmPlace}>
            Take Position ✦
          </button>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { IntroScreen, SpinScreen, TopBar, Sigil });
