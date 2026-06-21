import React, { useState as bS, useEffect as bE, useMemo as bM } from 'react';
import { createPortal as bPortal } from 'react-dom';
import { WOA as B } from './legacyData';
import { Crest, StatRow, hexA } from './legacyComponents.jsx';
import { chronicleFor } from './chronicles';

export function BookGlyph({ size = 15, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
      <path d="M12 6c-1.8-1.6-4.2-2.2-8-2.2v14.4c3.8 0 6.2.6 8 2.2 1.8-1.6 4.2-2.2 8-2.2V3.8c-3.8 0-6.2.6-8 2.2Z" />
      <path d="M12 6v14.4" />
    </svg>
  );
}

function BookChip({ label, ink, on, onToggle }) {
  return (
    <button type="button" onClick={onToggle} style={{
      fontFamily: 'var(--display)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
      textTransform: 'uppercase', padding: '5px 11px', borderRadius: 2, cursor: 'pointer',
      color: on ? '#f4e6c9' : (ink || 'var(--ink-soft)'),
      background: on ? (ink || 'var(--seal)') : 'rgba(255,250,235,0.5)',
      border: `1px solid ${on ? (ink || 'var(--seal)') : hexA(ink || '#5e4f3a', 0.4)}`,
      transition: 'background .14s, color .14s, border-color .14s',
    }}>{label}</button>
  );
}

function BookCard({ fig, onOpen }) {
  const posChips = B.POSITIONS.filter(p => fig.eligible.includes(p.key));
  return (
    <div role="button" tabIndex={0}
      onClick={() => onOpen(fig)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(fig); } }}
      className="panel" style={{ padding: '12px 13px', display: 'flex', gap: 11, alignItems: 'flex-start',
      borderLeft: `4px solid ${fig.regionInk}`, animation: 'woaFadeUp 0.3s ease both',
      cursor: 'pointer', userSelect: 'none' }}>
      <div style={{ flexShrink: 0 }}>
        <Crest fig={fig} size={42} pos={fig.eligible[0]} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
          <span className="disp" style={{ fontSize: 15.5, lineHeight: 1.05 }}>{fig.name}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
            <span className="disp" style={{ fontSize: 13, color: 'var(--gold)', whiteSpace: 'nowrap' }}>{fig.pr}</span>
            <span style={{ fontSize: 12, color: 'var(--ink-faint)', lineHeight: 1 }}>›</span>
          </span>
        </div>
        <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 11.5, color: 'var(--ink-soft)', marginTop: 1,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {fig.regionName} · {fig.eraName} · <span style={{ fontStyle: 'normal', fontWeight: 700, color: 'var(--ink-soft)' }}>{fig.tier}</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginTop: 6 }}>
          {posChips.map(p => (
            <span key={p.key} style={{
              fontFamily: 'var(--display)', fontSize: 7.5, fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.1em', padding: '1px 5px', borderRadius: 2,
              color: 'var(--seal)', border: '1px solid rgba(143,45,34,0.35)', background: 'rgba(143,45,34,0.06)',
            }}>{p.abbr}</span>
          ))}
          {fig.tags.slice(0, 2).map(t => (
            <span key={t} style={{
              fontFamily: 'var(--display)', fontSize: 7.5, fontWeight: 600, textTransform: 'uppercase',
              letterSpacing: '0.1em', padding: '1px 5px', borderRadius: 2,
              color: fig.regionInk, border: `1px solid ${hexA(fig.regionInk, 0.35)}`, background: hexA(fig.regionInk, 0.07),
            }}>{t}</span>
          ))}
        </div>
        <div style={{ marginTop: 7 }}><StatRow fig={fig} compact /></div>
      </div>
    </div>
  );
}

// The full-chronicle pop-out — opened from a Books card, dismissed by the
// close button, the scrim, or Escape.
function ChronicleModal({ fig, onClose }) {
  const posChips = B.POSITIONS.filter(p => fig.eligible.includes(p.key));
  const { hook, body } = chronicleFor(fig);
  return (
    <div onClick={(e) => { e.stopPropagation(); onClose(); }} style={{
      position: 'absolute', inset: 0, zIndex: 120, background: 'rgba(20,12,4,0.66)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '34px 30px',
      animation: 'woaFadeUp 0.18s ease both' }}>
      <div onClick={(e) => e.stopPropagation()} className="panel" role="dialog" aria-label={`${fig.name} chronicle`}
        style={{ position: 'relative', width: 'min(560px, 100%)', maxHeight: '100%', overflowY: 'auto',
          padding: '24px 28px 26px', borderLeft: `5px solid ${fig.regionInk}`,
          boxShadow: '0 26px 70px rgba(20,12,4,0.6)', animation: 'woaPop 0.3s ease both' }}>
        <div className="frame-rule" />
        <button type="button" onClick={onClose} title="Close" style={{
          position: 'absolute', top: 14, right: 14, width: 30, height: 30,
          background: 'none', border: '1px solid var(--panel-edge)', borderRadius: 3, cursor: 'pointer',
          fontFamily: 'var(--display)', fontSize: 13, fontWeight: 700, color: 'var(--ink-soft)',
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>

        <div style={{ display: 'flex', gap: 16, alignItems: 'center', paddingRight: 28 }}>
          <div style={{ flexShrink: 0 }}><Crest fig={fig} size={58} pos={fig.eligible[0]} /></div>
          <div style={{ minWidth: 0 }}>
            <div className="disp" style={{ fontSize: 27, lineHeight: 1.02 }}>{fig.name}</div>
            <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 13, color: 'var(--ink-soft)', marginTop: 3 }}>
              {fig.regionName} · {fig.eraName} · <span style={{ fontStyle: 'normal', fontWeight: 700, color: 'var(--seal)' }}>{fig.tier}</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 7 }}>
              {posChips.map(p => (
                <span key={p.key} style={{ fontFamily: 'var(--display)', fontSize: 8.5, fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: '0.1em', padding: '2px 6px', borderRadius: 2,
                  color: 'var(--seal)', border: '1px solid rgba(143,45,34,0.35)', background: 'rgba(143,45,34,0.06)' }}>{p.name}</span>
              ))}
              {fig.tags.map(t => (
                <span key={t} style={{ fontFamily: 'var(--display)', fontSize: 8.5, fontWeight: 600, textTransform: 'uppercase',
                  letterSpacing: '0.1em', padding: '2px 6px', borderRadius: 2,
                  color: fig.regionInk, border: `1px solid ${hexA(fig.regionInk, 0.35)}`, background: hexA(fig.regionInk, 0.07) }}>{t}</span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ margin: '16px 0' }}><StatRow fig={fig} /></div>

        <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 15, color: 'var(--seal)', lineHeight: 1.45 }}>{hook}</div>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 14, color: 'var(--ink)', lineHeight: 1.6, marginTop: 9 }}>{body}</div>
      </div>
    </div>
  );
}

export function BooksOverlay({ open, onClose }) {
  const [regSel, setRegSel] = bS(() => new Set());
  const [eraSel, setEraSel] = bS(() => new Set());
  const [posSel, setPosSel] = bS(() => new Set());
  const [detail, setDetail] = bS(null); // figure whose chronicle pop-out is open

  bE(() => {
    if (!open) return;
    // Escape closes the chronicle pop-out first, then the Books.
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (detail) setDetail(null); else onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, detail]);

  const list = bM(() => {
    return B.ROSTER
      .filter(f => (!regSel.size || regSel.has(f.region))
        && (!eraSel.size || eraSel.has(f.era))
        && (!posSel.size || f.eligible.some(k => posSel.has(k))))
      .slice()
      .sort((a, b) => b.pr - a.pr || a.name.localeCompare(b.name));
  }, [regSel, eraSel, posSel]);

  if (!open) return null;

  const toggle = (set, setter, key) => {
    const next = new Set(set);
    next.has(key) ? next.delete(key) : next.add(key);
    setter(next);
  };

  return bPortal(
    <div data-screen-label="The Books" onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(26,19,11,0.62)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '34px 30px',
      animation: 'woaFadeUp 0.22s ease both' }}>
      <div className="panel" onClick={(e) => e.stopPropagation()} style={{
        position: 'relative', width: 'min(1280px, 100%)', maxHeight: '100%',
        display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden',
        boxShadow: '0 22px 70px rgba(20,12,4,0.55)', animation: 'woaPop 0.32s ease both' }}>
        <div className="frame-rule" />

        {/* header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '20px 26px 14px' }}>
          <span style={{ color: 'var(--seal)' }}><BookGlyph size={26} /></span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="disp" style={{ fontSize: 26, lineHeight: 1 }}>The Books</div>
            <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 13, color: 'var(--ink-soft)', marginTop: 3 }}>
              The full codex of the wheel — every figure who may answer the call.
            </div>
          </div>
          <span className="label" style={{ fontSize: 10.5 }}>
            {list.length} of {B.ROSTER.length} figures
          </span>
          <button type="button" onClick={onClose} title="Close the Books" style={{
            background: 'none', border: '1px solid var(--panel-edge)', borderRadius: 3, cursor: 'pointer',
            fontFamily: 'var(--display)', fontSize: 13, fontWeight: 700, color: 'var(--ink-soft)',
            width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>

        {/* filters */}
        <div style={{ padding: '0 26px 14px', borderBottom: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 7 }}>
            <span className="caps" style={{ fontSize: 10, color: 'var(--ink)', width: 52, flexShrink: 0 }}>Region</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <BookChip label="All" on={regSel.size === 0} onToggle={() => setRegSel(new Set())} />
              {Object.values(B.REGIONS).map(r => (
                <BookChip key={r.key} label={r.short} ink={r.ink} on={regSel.has(r.key)}
                  onToggle={() => toggle(regSel, setRegSel, r.key)} />
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 7 }}>
            <span className="caps" style={{ fontSize: 10, color: 'var(--ink)', width: 52, flexShrink: 0 }}>Era</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <BookChip label="All" on={eraSel.size === 0} onToggle={() => setEraSel(new Set())} />
              {Object.values(B.ERAS).map(e => (
                <BookChip key={e.key} label={e.short} ink="#5e4f3a" on={eraSel.has(e.key)}
                  onToggle={() => toggle(eraSel, setEraSel, e.key)} />
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="caps" style={{ fontSize: 10, color: 'var(--ink)', width: 52, flexShrink: 0 }}>Rank</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <BookChip label="All" on={posSel.size === 0} onToggle={() => setPosSel(new Set())} />
              {B.POSITIONS.map(p => (
                <BookChip key={p.key} label={p.name} ink="#8f2d22" on={posSel.has(p.key)}
                  onToggle={() => toggle(posSel, setPosSel, p.key)} />
              ))}
            </div>
          </div>
        </div>

        {/* card shelves */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 26px 24px' }}>
          {list.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 15, color: 'var(--ink-faint)' }}>
              No figure in the codex matches those marks. Loosen a filter.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(272px, 1fr))', gap: 10 }}>
              {list.map(f => <BookCard key={f.id} fig={f} onOpen={setDetail} />)}
            </div>
          )}
        </div>
      </div>

      {detail && <ChronicleModal fig={detail} onClose={() => setDetail(null)} />}
    </div>,
    document.body,
  );
}

Object.assign(window, { BooksOverlay, BookGlyph });
