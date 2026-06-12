/* War O' Ages — screens B: Council + Battle + Result (+ share card) */

const { useState: useStateB, useEffect: useEffectB, useRef: useRefB } = React;
const WOAr = window.WOA;

// ── War Council ───────────────────────────────────────────────
function IdeologyChip({ def, squad, selected, onSelect }) {
  const eff = def.effect(squad);
  const pos = eff.pct >= 0;
  return (
    <button type="button" onClick={onSelect} className="panel" style={{
      textAlign: 'left', cursor: 'pointer', padding: '9px 10px', display: 'flex', gap: 8, alignItems: 'center',
      border: selected ? '1px solid var(--gold)' : '1px solid var(--panel-edge)',
      boxShadow: selected ? '0 0 0 2px var(--gold-bright)' : undefined,
      background: selected ? 'linear-gradient(180deg, rgba(212,175,79,0.18), rgba(255,250,235,0.35))' : undefined,
    }}>
      <div style={{ flexShrink: 0, width: 26, height: 26, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: selected ? 'var(--seal)' : 'rgba(120,96,54,0.10)', border: `1px solid ${selected ? 'var(--gold)' : 'var(--line)'}` }}>
        <BannerIcon icon={def.icon} size={17} color={selected ? '#f4e6c9' : 'var(--ink-soft)'} strokeWidth={1.7} />
      </div>
      <div className="disp" style={{ flex: 1, minWidth: 0, fontSize: 12.5, color: 'var(--ink)', lineHeight: 1.05, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{def.name}</div>
      <span className="disp" style={{ fontSize: 12.5, color: pos ? 'var(--c-EASIA)' : 'var(--seal)', whiteSpace: 'nowrap' }}>{pos ? '+' : ''}{eff.pct}%</span>
    </button>
  );
}

function CouncilScreen({ squad, battleground, ideology, setIdeology, onMarch }) {
  const syn = WOAr.detectSynergies(squad);
  const selDef = ideology ? WOAr.ideologyByKey(ideology) : null;
  const selEff = selDef ? selDef.effect(squad) : null;
  return (
    <div className="woa-screen">
      <TopBar left="War Council" right="Muster Complete" />
      <Banner sub="Name the cause your legion fights for, then march.">The War Council</Banner>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {WOAr.POSITIONS.map((p, i) => (
          <div key={p.key} style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: -2, top: '50%', transform: 'translateY(-50%)', zIndex: 3,
              fontFamily: 'var(--display)', fontSize: 7.5, fontWeight: 700, letterSpacing: '0.1em',
              writingMode: 'vertical-rl', color: 'var(--ink-faint)' }}>{p.abbr}</div>
            <div style={{ paddingLeft: 8 }}>
              <FigureRow fig={squad[p.key]} positionAbbr={p.abbr} animate delay={i * 70} pos={p.key} />
            </div>
          </div>
        ))}
      </div>

      {/* banner chooser */}
      <div style={{ marginTop: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
          <span className="caps" style={{ fontSize: 11, color: 'var(--gold)' }}>Rally Under a Banner</span>
          <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
          {WOAr.IDEOLOGIES.map(d => <IdeologyChip key={d.key} def={d} squad={squad} selected={ideology === d.key} onSelect={() => setIdeology(d.key)} />)}
        </div>
        {selDef ? (
          <div className="panel" style={{ marginTop: 9, padding: '10px 12px', background: 'linear-gradient(180deg,#2a2017,#3a2c1c)', border: '1px solid var(--gold)', display: 'flex', alignItems: 'center', gap: 9, animation: 'woaPop 0.3s ease both' }}>
            <BannerIcon icon={selDef.icon} size={22} color="var(--gold-bright)" strokeWidth={1.8} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="disp" style={{ fontSize: 14.5, color: '#e7d3a8', lineHeight: 1.05 }}>{selDef.name}</div>
              <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 11, color: '#b89c6a' }}>{selEff.note}</div>
            </div>
            <div className="disp" style={{ fontSize: 17, color: selEff.pct >= 0 ? '#9fd1a8' : '#e0907f', whiteSpace: 'nowrap' }}>{selEff.pct >= 0 ? '+' : ''}{selEff.pct}%</div>
          </div>
        ) : (
          <div style={{ marginTop: 8, fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 12, color: 'var(--ink-faint)', textAlign: 'center' }}>Tap a banner to set your cause.</div>
        )}
      </div>

      <div style={{ marginTop: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
          <span className="caps" style={{ fontSize: 11 }}>Synergies & De-Buffs</span>
          <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
        </div>
        {syn.length === 0 && (
          <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 13, color: 'var(--ink-faint)', textAlign: 'center', padding: '6px 0' }}>
            No synergies stirred — your legion fights on raw merit.
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {syn.map((s, i) => <SynergyRow key={s.name} s={s} delay={i * 80} />)}
        </div>
      </div>

      <div style={{ marginTop: 22, paddingBottom: 6 }}>
        <button className="btn btn-primary" disabled={!ideology} style={{ width: '100%', fontSize: 17, padding: '17px', opacity: ideology ? 1 : 0.5, cursor: ideology ? 'pointer' : 'not-allowed' }} onClick={ideology ? onMarch : undefined}>
          ⚔ March to War
        </button>
        {!ideology && <div style={{ textAlign: 'center', fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 11.5, color: 'var(--ink-faint)', marginTop: 8 }}>Raise a banner before you march.</div>}
      </div>
    </div>
  );
}

function SynergyRow({ s, delay = 0, fired }) {
  const colors = { buff: 'var(--c-EASIA)', risk: 'var(--gold)', penalty: 'var(--seal)' };
  const c = colors[s.kind] || 'var(--ink-soft)';
  return (
    <div className="panel" style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 10,
      borderLeft: `4px solid ${c}`, animation: `woaTick 0.4s ease both`, animationDelay: `${delay}ms`,
      boxShadow: fired ? `0 0 0 2px ${hexA('#d4af4f', 0.5)}` : undefined }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="disp" style={{ fontSize: 14.5, color: 'var(--ink)' }}>{s.name}</div>
        <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 11.5, color: 'var(--ink-soft)' }}>{s.note}</div>
      </div>
      <div className="disp" style={{ fontSize: 18, color: c, whiteSpace: 'nowrap' }}>{s.pct > 0 ? '+' : ''}{s.pct}%</div>
    </div>
  );
}

// ── Battle Reveal ─────────────────────────────────────────────
function BattleScreen({ player, enemy, battleground, onResolve }) {
  const [pScore, setPScore] = useStateB(0);
  const [eScore, setEScore] = useStateB(0);
  const [log, setLog] = useStateB([]);
  const [done, setDone] = useStateB(false);
  const [shake, setShake] = useStateB(false);
  const timers = useRefB([]);
  useEffectB(() => () => timers.current.forEach(clearTimeout), []);

  useEffectB(() => {
    const T = (fn, t) => timers.current.push(setTimeout(fn, t));
    // base tick
    animate(setPScore, 0, player.base, 1100, 200);
    animate(setEScore, 0, enemy.base, 1100, 400);
    let t = 1500;
    // player synergies stream
    player.syn.forEach((s) => {
      T(() => { setLog(l => [...l, { side: 'you', ...s }]); setShake(true); T2(() => setShake(false), 240); }, t);
      t += 760;
    });
    // battleground event (skip if negligible)
    const bgPct = Math.round((player.bg - 1) * 100);
    if (bgPct !== 0) {
      T(() => setLog(l => [...l, { side: 'field', name: battleground.name, pct: bgPct, kind: bgPct >= 0 ? 'buff' : 'penalty', note: 'Battleground modifier' }]), t);
      t += 700;
    }
    // final settle
    T(() => { animate(setPScore, player.base, player.final, 900, 0); animate(setEScore, enemy.base, enemy.final, 900, 0); }, t);
    t += 1100;
    T(() => setDone(true), t);
    function T2(fn, tt) { timers.current.push(setTimeout(fn, tt)); }
  }, []);

  function animate(setter, from, to, dur, delay) {
    timers.current.push(setTimeout(() => {
      const start = performance.now();
      const step = (now) => {
        const k = Math.min(1, (now - start) / dur);
        const e = 1 - Math.pow(1 - k, 3);
        setter(Math.round(from + (to - from) * e));
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay));
  }

  return (
    <div className="woa-screen" style={{ justifyContent: 'flex-start' }}>
      <TopBar left="The Clash" right={battleground.name} />
      <div style={{ textAlign: 'center', marginBottom: 6 }}>
        <div className="deco" style={{ fontSize: 22, fontWeight: 900, color: 'var(--seal)', animation: 'woaPop 0.5s ease both' }}>⚔ The Battle is Joined ⚔</div>
      </div>

      {/* scoreboards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 8, marginTop: 8 }}>
        <ScoreColumn label="Your Legion" score={pScore} ink="var(--c-EASIA)" shake={shake} lead={pScore >= eScore} />
        <div className="disp" style={{ fontSize: 20, color: 'var(--ink-faint)' }}>vs</div>
        <ScoreColumn label="The Enemy" score={eScore} ink="var(--seal)" align="right" lead={eScore > pScore} />
      </div>

      {/* event feed */}
      <div className="panel" style={{ marginTop: 16, padding: 12, minHeight: 168 }}>
        <div className="frame-rule" />
        <div className="label" style={{ textAlign: 'center', marginBottom: 8 }}>Dispatches from the Field</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {log.length === 0 && (
            <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--ink-faint)', textAlign: 'center', fontSize: 13, padding: '20px 0' }}>
              The armies take the field…
            </div>
          )}
          {log.map((e, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, animation: 'woaTick 0.4s ease both',
              padding: '6px 9px', borderRadius: 3, background: 'rgba(255,250,235,0.5)', border: '1px solid var(--line)' }}>
              <span style={{ fontFamily: 'var(--display)', fontSize: 8, fontWeight: 700, letterSpacing: '0.1em',
                color: e.side === 'field' ? 'var(--gold)' : e.kind === 'ideology' ? 'var(--gold-bright)' : 'var(--c-EASIA)', textTransform: 'uppercase' }}>
                {e.side === 'field' ? '⬡ Field' : e.kind === 'ideology' ? '⚑ Banner' : '✦ You'}
              </span>
              <span className="disp" style={{ flex: 1, fontSize: 14 }}>{e.name}</span>
              <span className="disp" style={{ fontSize: 15, color: e.pct >= 0 ? 'var(--c-EASIA)' : 'var(--seal)' }}>
                {e.pct > 0 ? '+' : ''}{e.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        {done ? (
          <button className="btn btn-primary" style={{ width: '100%', animation: 'woaPop 0.4s ease both' }} onClick={onResolve}>
            Reveal the Verdict ✦
          </button>
        ) : (
          <button className="btn btn-ghost" style={{ width: '100%', opacity: 0.7 }} disabled>The dust has not yet settled…</button>
        )}
      </div>
    </div>
  );
}

function ScoreColumn({ label, score, ink, align, shake, lead }) {
  return (
    <div style={{ textAlign: align === 'right' ? 'right' : 'left' }}>
      <div className="label" style={{ fontSize: 9 }}>{label}</div>
      <div className="disp" style={{ fontSize: 52, color: ink, lineHeight: 1, animation: shake ? 'woaPop 0.24s ease' : 'none',
        textShadow: lead ? '0 2px 8px rgba(176,138,46,0.25)' : 'none' }}>{score}</div>
    </div>
  );
}

// ── Result + share card ───────────────────────────────────────
function ResultScreen({ player, enemy, battleground, onReplay, onShare }) {
  const win = player.final >= enemy.final;
  const grade = WOAr.gradeFor(player.final);
  const cardRef = useRefB(null);
  return (
    <div className="woa-screen" style={{ paddingTop: 50 }}>
      <div style={{ textAlign: 'center', animation: 'woaFadeUp 0.5s ease both' }}>
        <WaxSeal grade={win ? grade : { letter: grade.letter, label: grade.label, color: '#6b5d48' }} size={78} animate />
        <div className="deco" style={{ fontSize: 38, fontWeight: 900, margin: '6px 0 0',
          color: win ? 'var(--seal)' : 'var(--ink-soft)' }}>{win ? 'Victory' : 'Defeat'}</div>
        <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 14, color: 'var(--ink-soft)' }}>
          {win ? 'History will remember your legion.' : 'The chronicles record a noble loss.'}
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <ResultCard ref={cardRef} player={player} enemy={enemy} battleground={battleground} win={win} grade={grade} />
      </div>

      <div style={{ display: 'flex', gap: 9, marginTop: 16 }}>
        <button className="btn btn-primary" style={{ flex: 2 }} onClick={onShare}>⤴ Share the Chronicle</button>
        <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onReplay}>New War</button>
      </div>

      {/* full revealed enemy roster */}
      <div style={{ marginTop: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
          <span className="caps" style={{ fontSize: 11, color: 'var(--seal)' }}>Enemy Roster Revealed</span>
          <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {WOAr.POSITIONS.map((p, i) => <FigureRow key={p.key} fig={enemy.squad[p.key]} positionAbbr={p.abbr} animate delay={i * 60} pos={p.key} />)}
        </div>
      </div>
    </div>
  );
}

// The shareable card — the virality centerpiece.
// The legions flank the card on the page, so the card itself is the
// VERDICT: scores and grade writ large, then "The Reckoning" — every
// synergy, banner and field effect that moved the tally.
const ResultCard = React.forwardRef(function ResultCard({ player, enemy, battleground, win, grade, twist }, ref) {
  const bgPct = Math.round((player.bg - 1) * 100);
  const reckoning = [
    ...player.syn.map(s => ({ ...s, tag: s.kind === 'ideology' ? 'Ideology' : (s.pct >= 0 ? 'Synergy' : 'De-Buff') })),
    ...(bgPct !== 0 ? [{ name: battleground.name, pct: bgPct, note: 'The ground itself took a side', tag: 'Field' }] : []),
    ...(twist ? [{ name: 'Twist of Fate', pct: twist.pct, note: twist.text, tag: 'Fate',
      side: twist.side === 'player' ? 'Your Legion' : 'The Enemy' }] : []),
  ];
  return (
    <div ref={ref} style={{
      position: 'relative', borderRadius: 4, overflow: 'hidden',
      background: 'linear-gradient(170deg, #efe6cf 0%, #e2d3ad 100%)',
      border: '2px solid #6e5418',
      boxShadow: '0 10px 30px rgba(60,40,16,0.35)', padding: 3,
    }}>
      <div style={{ border: '1px solid var(--gold)', borderRadius: 2, padding: '16px 17px 14px', position: 'relative' }}>
        {/* header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="deco" style={{ fontSize: 17, fontWeight: 900, color: 'var(--ink)', lineHeight: 1 }}>War <span className="wo-o">O</span>' Ages</div>
            <div className="label" style={{ fontSize: 8, marginTop: 2 }}>{battleground.name} · Daily Battlefield</div>
          </div>
          <Sigil size={28} />
        </div>
        <div className="hr-rule" style={{ margin: '12px 0' }} />

        {/* the verdict — scores writ large, grade sealed in wax */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', textAlign: 'center' }}>
          <div>
            <div className="label" style={{ fontSize: 9 }}>You</div>
            <div className="disp" style={{ fontSize: 64, color: win ? 'var(--seal)' : 'var(--ink-soft)', lineHeight: 1 }}>{Math.round(player.final)}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, padding: '0 12px' }}>
            <WaxSeal grade={win ? grade : { letter: grade.letter, label: grade.label, color: '#8a795c' }} size={76} animate />
            <div className="deco" style={{ fontSize: 15, fontWeight: 900, letterSpacing: '0.06em', color: win ? 'var(--seal)' : 'var(--ink-soft)' }}>{win ? 'WON' : 'LOST'}</div>
          </div>
          <div>
            <div className="label" style={{ fontSize: 9 }}>Foe</div>
            <div className="disp" style={{ fontSize: 64, color: 'var(--ink-soft)', lineHeight: 1 }}>{Math.round(enemy.final)}</div>
          </div>
        </div>

        <div className="hr-rule" style={{ margin: '14px 0 10px' }} />

        {/* the reckoning — every blessing and curse that moved the tally */}
        <div className="label" style={{ fontSize: 8.5, marginBottom: 7 }}>The Reckoning</div>
        {reckoning.length === 0 ? (
          <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 12, color: 'var(--ink-faint)', textAlign: 'center', padding: '3px 0 1px' }}>
            No synergies stirred — the legion fought on raw merit.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {reckoning.map((s) => {
              // basic logic: green accent for any positive %, red for any
              // negative % — names & notes stay in regular ink. Fate rows
              // carry a side chip naming WHOSE tally it moves.
              const accent = s.pct >= 0 ? 'var(--c-EASIA)' : 'var(--seal)';
              const sideInk = s.side === 'The Enemy' ? 'var(--seal)' : 'var(--c-EASIA)';
              return (
                <div key={s.tag + s.name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 9px',
                  borderRadius: 3, background: 'rgba(255,250,235,0.55)', border: '1px solid var(--line)',
                  borderLeft: `3px solid ${accent}` }}>
                  <span style={{ fontFamily: 'var(--display)', fontSize: 7.5, fontWeight: 700, letterSpacing: '0.12em',
                    textTransform: 'uppercase', color: accent, width: 54, flexShrink: 0 }}>{s.tag}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <span className="disp" style={{ fontSize: 12.5, lineHeight: 1.1, color: 'var(--ink)' }}>{s.name}</span>
                      {s.side && (
                        <span style={{ fontFamily: 'var(--display)', fontSize: 7, fontWeight: 700, letterSpacing: '0.1em',
                          textTransform: 'uppercase', padding: '1.5px 5px', borderRadius: 2, whiteSpace: 'nowrap',
                          color: sideInk, border: `1px solid ${sideInk}`, background: 'rgba(255,250,235,0.6)' }}>{s.side}</span>
                      )}
                    </div>
                    {s.note && <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 10, color: 'var(--ink-soft)', lineHeight: 1.25, marginTop: 1 }}>{s.note}</div>}
                  </div>
                  <span className="disp" style={{ fontSize: 15, color: accent, whiteSpace: 'nowrap' }}>
                    {s.pct > 0 ? '+' : ''}{s.pct}%
                  </span>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 13 }}>
          <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 11.5, color: 'var(--ink-soft)' }}>
            “{win ? quoteWin(player) : quoteLoss(enemy)}”
          </span>
        </div>
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <span className="caps" style={{ fontSize: 8, color: 'var(--ink-faint)' }}>waroages.io · can you conquer history?</span>
        </div>
      </div>
    </div>
  );
});

function ArmyStrip({ title, squad, muted }) {
  return (
    <div>
      <div className="label" style={{ fontSize: 7.5, marginBottom: 5, color: muted ? 'var(--seal)' : 'var(--c-EASIA)' }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {WOAr.POSITIONS.map(p => {
          const f = squad[p.key];
          return (
            <div key={p.key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Crest fig={f} size={18} dim={muted} />
              <span style={{ fontFamily: 'var(--serif)', fontSize: 10, lineHeight: 1.08, color: 'var(--ink)', fontStyle: muted ? 'italic' : 'normal', fontWeight: 500 }}>
                {f ? f.name : '—'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
function quoteWin(p) {
  const star = WOAr.POSITIONS.map(x => p.squad[x.key]).filter(Boolean).sort((a, b) => b.pr - a.pr)[0];
  return `${star.name} led ${Math.round(p.final)} souls to glory.`;
}
function quoteLoss(e) {
  const star = WOAr.POSITIONS.map(x => e.squad[x.key]).filter(Boolean).sort((a, b) => b.pr - a.pr)[0];
  return `${star.name}'s host proved one rank too strong.`;
}

Object.assign(window, { CouncilScreen, BattleScreen, ResultScreen, ResultCard });
