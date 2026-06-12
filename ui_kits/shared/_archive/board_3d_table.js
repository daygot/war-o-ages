/* War O' Ages — formation board + compass dial */

const WOAb = window.WOA;
const { useState: useStateBd, useEffect: useEffectBd, useRef: useRefBd } = React;

// ── Formation positions — round-table seating ──────────────
// Percentages are relative to the aspect-locked table STAGE (360×230),
// placed at the five seat angles of the table ellipse.
const FORMATION = {
  commander:  { top: '14%',  left: '50%' },
  strategist: { top: '38%',  left: '13%' },
  general:    { top: '38%',  left: '87%' },
  allies:     { top: '76%',  left: '28%' },
  troops:     { top: '76%',  left: '72%' },
};

function PositionMarker({ pos, fig, active, justPlaced, onClick, scale = 1 }) {
  const f = FORMATION[pos.key];
  const sz = Math.round((fig ? 46 : 40) * scale);
  return (
    <button onClick={onClick} style={{
      position: 'absolute', top: f.top, left: f.left, transform: 'translate(-50%,-50%)',
      background: 'none', border: 'none', padding: 0, cursor: onClick ? 'pointer' : 'default',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, zIndex: active ? 6 : 4,
    }}>
      <div style={{
        padding: 3,
        animation: active ? 'woaPulseGold 1.4s ease-in-out infinite' : (justPlaced ? 'woaPop 0.5s ease both' : 'none'),
        boxShadow: active ? '0 0 0 2px var(--gold-bright)' : 'none', borderRadius: 10,
      }}>
        <Crest fig={fig} dashed={!fig} placeholderAbbr={pos.abbr} size={sz} pos={pos.key} />
      </div>
      <span style={{
        fontFamily: 'var(--display)', fontSize: 8, fontWeight: 700, letterSpacing: '0.1em',
        textTransform: 'uppercase', color: fig ? '#e7d3a8' : 'rgba(231,211,168,0.45)',
        background: 'rgba(24,18,12,0.72)', padding: '1px 5px', borderRadius: 2,
        whiteSpace: 'nowrap', maxWidth: fig ? Math.round(88 * scale) : 'none', overflow: 'hidden', textOverflow: 'ellipsis',
        border: '1px solid #6e5418',
      }}>{fig ? fig.name.split(' ').slice(-1)[0] : pos.name}</span>
    </button>
  );
}

// ── The war table — solid oak in perspective (360×230 stage) ──
// Drawn aspect-locked so it never squashes: extruded side wall,
// cast shadow, studded rim, parchment map inlay, compass medallion.
const STAGE_W = 360, STAGE_H = 230, STAGE_AR = STAGE_W / STAGE_H;

function WarTable() {
  const cx = 180, cy = 112, rx = 142, ry = 76, t = 16;      // top + thickness
  const inX = 124, inY = 62;                                 // map inlay
  const persp = 0.58;                                        // vertical foreshortening
  const studs = Array.from({ length: 28 }, (_, i) => i * (360 / 28));
  const seatAngles = [-90, -162, -18, 126, 54];              // five seats
  const grainAngles = [22, 58, 90, 122, 158];                // side-wall grain (lower half)
  const starPts = [];
  for (let i = 0; i < 16; i++) {
    const a = (-90 + i * 22.5) * Math.PI / 180;
    const r = i % 2 ? 6 : 14.5;
    starPts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * persp * Math.sin(a)).toFixed(1)}`);
  }
  const P = (RX, RY, deg) => { const a = deg * Math.PI / 180; return [cx + RX * Math.cos(a), cy + RY * Math.sin(a)]; };
  const [shx0, shy0] = P(rx - 4, ry - 3, -168);
  const [shx1, shy1] = P(rx - 4, ry - 3, -64);
  return (
    <g>
      <defs>
        <radialGradient id="wt3-shadow" cx="50%" cy="50%" r="50%">
          <stop offset="0.55" stopColor="rgba(10,5,0,0.42)" /><stop offset="1" stopColor="rgba(10,5,0,0)" />
        </radialGradient>
        <linearGradient id="wt3-side" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6b5226" /><stop offset="0.45" stopColor="#4a371a" /><stop offset="1" stopColor="#33250f" />
        </linearGradient>
        <radialGradient id="wt3-top" cx="38%" cy="26%" r="80%">
          <stop offset="0" stopColor="#97793e" /><stop offset="0.68" stopColor="#6e5527" /><stop offset="1" stopColor="#4e3b18" />
        </radialGradient>
        <radialGradient id="wt3-fld" cx="42%" cy="28%" r="78%">
          <stop offset="0" stopColor="#f0e9d6" /><stop offset="0.72" stopColor="#dccfb2" /><stop offset="1" stopColor="#bcab86" />
        </radialGradient>
      </defs>
      {/* cast shadow on the floor */}
      <ellipse cx={cx} cy={cy + t + 9} rx={rx + 18} ry={ry + 11} fill="url(#wt3-shadow)" />
      {/* extruded side wall (table thickness) */}
      <path d={`M${cx - rx},${cy} A${rx},${ry} 0 0 0 ${cx + rx},${cy} L${cx + rx},${cy + t} A${rx},${ry} 0 0 1 ${cx - rx},${cy + t} Z`}
        fill="url(#wt3-side)" stroke="#2e2210" strokeWidth="1" />
      {/* wood grain on the side wall */}
      {grainAngles.map((d, i) => {
        const [gx, gy] = P(rx, ry, d);
        return <line key={i} x1={gx} y1={gy + 2} x2={gx} y2={gy + t - 2} stroke="rgba(0,0,0,0.22)" strokeWidth="1.1" strokeLinecap="round" />;
      })}
      {/* bottom lip catches torch light */}
      <path d={`M${cx - rx},${cy + t} A${rx},${ry} 0 0 0 ${cx + rx},${cy + t}`}
        fill="none" stroke="rgba(212,175,79,0.22)" strokeWidth="1" />
      {/* table top */}
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="url(#wt3-top)" stroke="#9c7d3c" strokeWidth="1.6" />
      <ellipse cx={cx} cy={cy} rx={rx - 8} ry={ry - 6} fill="none" stroke="rgba(46,32,12,0.5)" strokeWidth="1.6" />
      {/* brass studs along the rim */}
      {studs.map((d, i) => {
        const [sx, sy] = P(rx - 4.5, ry - 3.5, d);
        return <circle key={i} cx={sx} cy={sy} r="1.25" fill="#c9a64b" opacity="0.9" />;
      })}
      {/* sheen on the upper-left rim */}
      <path d={`M${shx0.toFixed(1)},${shy0.toFixed(1)} A${rx - 4},${ry - 3} 0 0 1 ${shx1.toFixed(1)},${shy1.toFixed(1)}`}
        fill="none" stroke="rgba(255,243,214,0.30)" strokeWidth="2" strokeLinecap="round" />
      {/* parchment map inlay, inset with a top inner shadow */}
      <ellipse cx={cx} cy={cy} rx={inX} ry={inY} fill="url(#wt3-fld)" stroke="rgba(78,58,24,0.55)" strokeWidth="1.2" />
      <path d={`M${cx - inX},${cy} A${inX},${inY} 0 0 1 ${cx + inX},${cy}`}
        fill="none" stroke="rgba(60,42,16,0.28)" strokeWidth="3" />
      {/* five seat divisions */}
      {seatAngles.map((d, i) => {
        const [x1, y1] = P(inX * 0.27, inY * 0.27, d);
        const [x2, y2] = P(inX * 0.93, inY * 0.93, d);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(96,70,32,0.45)" strokeWidth="1" />;
      })}
      {/* compass medallion, foreshortened with the table */}
      <ellipse cx={cx} cy={cy} rx="27" ry="15.5" fill="#d8cdb0" stroke="#6e5226" strokeWidth="1.4" />
      <ellipse cx={cx} cy={cy} rx="20" ry="11" fill="none" stroke="#6e5226" strokeWidth="0.7" />
      <polygon points={starPts.join(' ')} fill="#6e5226" opacity="0.9" />
      <ellipse cx={cx} cy={cy} rx="2.4" ry="1.5" fill="#d8cdb0" />
    </g>
  );
}

// ── Wall dressing — fixed-size so it never distorts ─────────
function WallPennants({ side }) {
  const pos = side === 'left' ? { left: 8 } : { right: 8 };
  return (
    <svg width="66" height="54" viewBox="0 0 66 54" style={{
      position: 'absolute', top: 0, ...pos, zIndex: 2, pointerEvents: 'none',
      transform: side === 'right' ? 'scaleX(-1)' : 'none',
    }}>
      {[[12, '#9c7d3c', 50], [46, 'rgba(96,70,32,0.7)', 42]].map(([bx, fill, len], i) => (
        <g key={i}>
          <line x1={bx} y1={0} x2={bx} y2={len} stroke="rgba(100,74,34,0.55)" strokeWidth="1.3" />
          <path d={`M${bx},3 L${bx + 16},12 L${bx},28 Z`} fill={fill} stroke="rgba(100,74,34,0.5)" strokeWidth="0.8" opacity="0.85" />
        </g>
      ))}
    </svg>
  );
}

function WallTorch({ pos }) {
  return (
    <svg width="18" height="24" viewBox="0 0 18 24" style={{ position: 'absolute', ...pos, zIndex: 2, pointerEvents: 'none' }}>
      <path d="M5.5,9 L9,1 L12.5,9" fill="rgba(255,185,45,0.78)" />
      <path d="M7.4,8 L9,4 L10.6,8" fill="rgba(255,230,90,0.92)" />
      <line x1="9" y1="9" x2="9" y2="18" stroke="rgba(100,70,30,0.7)" strokeWidth="2.4" />
      <rect x="5" y="16.5" width="8" height="3.5" rx="1" fill="rgba(130,90,42,0.6)" />
    </svg>
  );
}

// ── Terrain backdrops — inked scenery on the war-room wall ─────
// One silhouette panorama per battleground, drawn behind the war table
// in the same 300×320 space. Muted, low-opacity — candle-lit murals,
// not photographs. The table and markers never move.
const TERRAIN_HALL = {
  steppe:   ['#4d5239', '#2a2d1e'],
  jungle:   ['#41503b', '#222b1f'],
  mountain: ['#4a4c55', '#26272d'],
  coast:    ['#42525a', '#222c30'],
  desert:   ['#5a4a32', '#2e261a'],
  walls:    ['#504639', '#2a261f'],
};

function TerrainBackdrop({ terrain }) {
  switch (terrain) {
    case 'steppe': return (
      <g>
        <rect width="300" height="320" fill="rgba(120,150,70,0.05)" />
        <path d="M0,96 Q50,80 105,90 T210,84 T300,92 L300,134 L0,134 Z" fill="rgba(130,160,80,0.11)" />
        <path d="M0,114 Q70,100 150,108 T300,104 L300,152 L0,152 Z" fill="rgba(110,140,70,0.08)" />
        <path d="M36,100 l3,-7 M40,100 l1,-9 M44,100 l-2,-7 M196,92 l3,-7 M200,92 l1,-9 M204,92 l-2,-7 M262,102 l3,-6 M266,102 l0,-8"
          stroke="rgba(150,175,95,0.22)" strokeWidth="1.1" fill="none" strokeLinecap="round" />
      </g>
    );
    case 'jungle': return (
      <g>
        <rect width="300" height="320" fill="rgba(50,110,60,0.06)" />
        <ellipse cx="40" cy="68" rx="56" ry="27" fill="rgba(60,120,70,0.12)" />
        <ellipse cx="132" cy="52" rx="66" ry="30" fill="rgba(50,112,62,0.10)" />
        <ellipse cx="238" cy="66" rx="60" ry="27" fill="rgba(64,125,74,0.12)" />
        <ellipse cx="86" cy="88" rx="40" ry="18" fill="rgba(46,100,56,0.10)" />
        <ellipse cx="196" cy="90" rx="44" ry="18" fill="rgba(46,100,56,0.10)" />
        <path d="M60,86 q5,18 -2,34 M150,76 q6,20 -1,38 M226,86 q5,16 -3,30 M108,94 q4,14 -2,26"
          stroke="rgba(70,130,80,0.22)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      </g>
    );
    case 'mountain': return (
      <g>
        <rect width="300" height="320" fill="rgba(100,110,135,0.05)" />
        <path d="M0,118 L42,58 L78,100 L122,38 L165,102 L205,56 L245,98 L275,74 L300,108 L300,148 L0,148 Z"
          fill="rgba(115,125,150,0.12)" />
        <path d="M0,128 L60,96 L120,124 L190,98 L250,126 L300,110 L300,156 L0,156 Z" fill="rgba(95,105,130,0.08)" />
        <path d="M122,38 L131,52 L125,51 L133,64 M42,58 L49,69 L44,68 L51,79 M205,56 L212,67 L207,66 L214,77"
          stroke="rgba(225,232,245,0.16)" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      </g>
    );
    case 'coast': return (
      <g>
        <rect width="300" height="320" fill="rgba(45,110,130,0.05)" />
        <rect x="0" y="86" width="300" height="50" fill="rgba(45,115,135,0.10)" />
        <path d="M0,86 H300" stroke="rgba(160,200,210,0.18)" strokeWidth="0.8" />
        <path d="M18,102 q8,-4 16,0 M70,114 q8,-4 16,0 M140,100 q8,-4 16,0 M205,116 q8,-4 16,0 M255,104 q8,-4 16,0 M110,122 q8,-4 16,0"
          stroke="rgba(150,200,210,0.16)" strokeWidth="1.3" fill="none" strokeLinecap="round" />
        <g fill="rgba(16,26,30,0.4)">
          <path d="M222,90 q15,8 32,0 l-4,6 h-25 Z" />
          <path d="M237,72 v18 h1.6 v-18 Z" />
          <path d="M231,74 h13 l-2.6,9 h-7.8 Z" />
        </g>
      </g>
    );
    case 'desert': return (
      <g>
        <rect width="300" height="320" fill="rgba(190,140,60,0.06)" />
        <circle cx="226" cy="54" r="13" fill="rgba(225,175,85,0.16)" />
        <path d="M0,108 Q70,86 150,104 T300,96 L300,144 L0,144 Z" fill="rgba(205,155,75,0.11)" />
        <path d="M0,126 Q90,110 190,122 T300,118 L300,156 L0,156 Z" fill="rgba(185,135,60,0.08)" />
        <path d="M58,100 q22,-7 44,-2 M178,112 q20,-6 40,-2" stroke="rgba(235,195,110,0.15)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      </g>
    );
    case 'walls': return (
      <g>
        <rect width="300" height="320" fill="rgba(150,125,90,0.05)" />
        <path d="M0,86 H18 V78 H30 V86 H48 V78 H60 V86 H78 V78 H90 V86 H108 V78 H120 V86 H138 V78 H150 V86 H168 V78 H180 V86 H198 V78 H210 V86 H228 V78 H240 V86 H258 V78 H270 V86 H288 V78 H300 V134 H0 Z"
          fill="rgba(160,135,95,0.11)" />
        <path d="M30,62 h32 v68 h-32 Z M238,62 h32 v68 h-32 Z" fill="rgba(150,125,90,0.13)" />
        <path d="M30,62 V54 h6 v8 M43,62 v-8 h6 v8 M56,62 v-8 h6 v8 M238,62 v-8 h6 v8 M251,62 v-8 h6 v8 M264,62 v-8 h6 v8"
          fill="rgba(150,125,90,0.13)" stroke="none" />
        <path d="M46,76 v12 M254,76 v12 M100,98 v11 M150,98 v11 M200,98 v11"
          stroke="rgba(30,22,14,0.4)" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M0,102 H300 M0,118 H300" stroke="rgba(30,22,14,0.22)" strokeWidth="0.6" />
      </g>
    );
    default: return null;
  }
}

function FormationBoard({ squad, activePos, justPlaced, battleground, onSlotClick, height = 320 }) {
  const hall = (battleground && TERRAIN_HALL[battleground.key]) || ['#4e4639', '#2c2820'];
  // measure the board so the table stage keeps a true aspect ratio
  const boardRef = useRefBd(null);
  const [box, setBox] = useStateBd({ w: 0, h: 0 });
  useEffectBd(() => {
    const el = boardRef.current;
    if (!el) return;
    // seed synchronously — ResizeObserver delivery rides the rendering
    // pipeline and may never fire in hidden/throttled iframes (exports),
    // and would otherwise leave a first-frame gap in visible ones
    setBox({ w: el.clientWidth, h: el.clientHeight });
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver((entries) => {
      const r = entries[0].contentRect;
      setBox((p) => (Math.abs(p.w - r.width) < 1 && Math.abs(p.h - r.height) < 1) ? p : { w: r.width, h: r.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const stageW = box.w && box.h ? Math.min(box.w - 10, box.h * STAGE_AR) : 0;
  const stageH = stageW / STAGE_AR;
  const ms = stageH ? Math.max(0.8, Math.min(1.2, stageH / STAGE_H)) : 1;
  return (
    <div className="panel" style={{ padding: 6, position: 'relative' }}>
      <div ref={boardRef} style={{
        position: 'relative', height, borderRadius: 2, overflow: 'hidden',
        background: `radial-gradient(95% 95% at 50% 46%, ${hall[0]}, ${hall[1]} 96%)`,
        border: '1px solid var(--panel-edge)',
      }}>
        {/* torch corner glow */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(circle at 4% 6%, rgba(255,140,20,0.18), transparent 28%), radial-gradient(circle at 96% 6%, rgba(255,140,20,0.18), transparent 28%), radial-gradient(circle at 4% 94%, rgba(255,140,20,0.10), transparent 24%), radial-gradient(circle at 96% 94%, rgba(255,140,20,0.10), transparent 24%)' }} />
        {/* hall + table */}
        <svg width="100%" height="100%" viewBox="0 0 300 320" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
          <defs>
            <pattern id="slab-board" width="38" height="28" patternUnits="userSpaceOnUse">
              <rect width="38" height="28" fill="none" stroke="rgba(206,180,120,0.09)" strokeWidth="0.5" />
              <line x1="0" y1="14" x2="19" y2="14" stroke="rgba(206,180,120,0.05)" strokeWidth="0.3" />
            </pattern>
          </defs>
          <rect width="300" height="320" fill="url(#slab-board)" />
          <g fill="none" stroke="rgba(206,180,120,0.07)" strokeWidth="0.5">
            {[0, 50, 100, 150, 200, 250, 300].map((x, i) => <line key={i} x1={x} y1={0} x2={150} y2={170} />)}
          </g>
          {/* battleground mural — redrawn for each campaign's terrain */}
          <TerrainBackdrop terrain={battleground ? battleground.key : null} />
        </svg>
        {/* wall dressing — fixed-size overlays, never stretched */}
        <WallPennants side="left" />
        <WallPennants side="right" />
        <WallTorch pos={{ left: 7, top: 8 }} />
        <WallTorch pos={{ right: 7, top: 8 }} />
        <WallTorch pos={{ left: 7, bottom: 6 }} />
        <WallTorch pos={{ right: 7, bottom: 6 }} />
        {/* battleground cartouche */}
        {battleground && (
          <div style={{
            position: 'absolute', top: 7, left: 7,
            background: 'linear-gradient(180deg,#2a2017,#3a2c1c)', color: '#e7d3a8',
            fontFamily: 'var(--display)', fontWeight: 700, fontSize: 9, letterSpacing: '0.14em',
            textTransform: 'uppercase', padding: '4px 11px', borderRadius: 2, whiteSpace: 'nowrap',
            border: '1px solid var(--gold)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)', zIndex: 7,
          }}>{battleground.name}</div>
        )}
        {/* aspect-locked stage: the 3D table + seats never distort */}
        {stageW > 0 && (
          <div style={{
            position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
            width: stageW, height: stageH, zIndex: 3,
          }}>
            <svg width="100%" height="100%" viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
              preserveAspectRatio="xMidYMid meet" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
              <WarTable />
            </svg>
            {WOAb.POSITIONS.map(p => (
              <PositionMarker key={p.key} pos={p} fig={squad[p.key]} scale={ms}
                active={activePos === p.key} justPlaced={justPlaced === p.key}
                onClick={onSlotClick ? () => onSlotClick(p.key) : null} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Compass / astrolabe spin dial ─────────────────────────────
function wedgePath(cx, cy, rIn, rOut, a0, a1) {
  const p = (r, a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  const [x0, y0] = p(rOut, a0), [x1, y1] = p(rOut, a1);
  const [x2, y2] = p(rIn, a1), [x3, y3] = p(rIn, a0);
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M${x0},${y0} A${rOut},${rOut} 0 ${large} 1 ${x1},${y1} L${x2},${y2} A${rIn},${rIn} 0 ${large} 0 ${x3},${y3} Z`;
}

// Is this on-screen angle in the lower half of the dial? (where curved text
// would otherwise render upside down). `cos<0` tiebreak keeps the exact 3/9
// o'clock edges consistent.
function isLowerHalf(a) {
  return Math.sin(a) > 1e-6 || (Math.abs(Math.sin(a)) <= 1e-6 && Math.cos(a) < 0);
}

// curved label baseline along a ring; reverses on the lower half so text stays
// upright. `flipAt` is the angle used to decide direction — pass the LIVE
// on-screen angle (home + rotation) so it's correct wherever the wheel settles;
// defaults to `mid` for static use.
function ringArc(cx, cy, R, mid, half, flipAt = mid) {
  const flip = isLowerHalf(flipAt);
  const P = (a) => [cx + R * Math.cos(a), cy + R * Math.sin(a)];
  const a0 = mid - half, a1 = mid + half;
  if (flip) { const [x0, y0] = P(a1), [x1, y1] = P(a0); return `M${x0.toFixed(2)},${y0.toFixed(2)} A${R},${R} 0 0 0 ${x1.toFixed(2)},${y1.toFixed(2)}`; }
  const [x0, y0] = P(a0), [x1, y1] = P(a1); return `M${x0.toFixed(2)},${y0.toFixed(2)} A${R},${R} 0 0 1 ${x1.toFixed(2)},${y1.toFixed(2)}`;
}

function CompassDial({ size = 250, regionRot = 0, eraRot = 0, spinning, landedRegion, landedEra }) {
  const regions = Object.values(WOAb.REGIONS);
  const eras = Object.values(WOAb.ERAS);
  const cx = 150, cy = 150;
  const seg = (Math.PI * 2) / regions.length;
  const eseg = (Math.PI * 2) / eras.length;
  // pointer geometry as % of the box so it tracks any size
  return (
    <div style={{ width: size, height: size, position: 'relative', margin: '0 auto' }}>
      {/* REGION pointer — top, points down into the outer ring */}
      <div style={{ position: 'absolute', top: -22, left: '50%', transform: 'translateX(-50%)', zIndex: 11, display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none' }}>
        <span style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 8.5, letterSpacing: '0.18em', color: 'var(--seal)', background: 'rgba(243,236,217,0.92)', border: '1px solid var(--gold)', borderRadius: 2, padding: '1px 6px', marginBottom: 1 }}>REGION</span>
        <svg width="26" height="20" viewBox="0 0 26 20" style={{ display: 'block', filter: 'drop-shadow(0 2px 2px rgba(40,24,8,0.4))' }}>
          <path d="M13,19 L4,3 Q3,0.5 6,0.5 H20 Q23,0.5 22,3 Z" fill="var(--seal)" stroke="var(--gold-bright)" strokeWidth="1.6" strokeLinejoin="round" />
          <circle cx="13" cy="5.5" r="2" fill="var(--gold-bright)" />
        </svg>
      </div>
      {/* ERA pointer — bottom, points up into the inner ring */}
      <div style={{ position: 'absolute', bottom: `${100 - 80.5}%`, left: '50%', transform: 'translateX(-50%)', zIndex: 11, display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none' }}>
        <svg width="22" height="17" viewBox="0 0 22 17" style={{ display: 'block', filter: 'drop-shadow(0 -1px 2px rgba(40,24,8,0.4))' }}>
          <path d="M11,0.5 L3,14 Q2,16.5 5,16.5 H17 Q20,16.5 19,14 Z" fill="#3a2c1c" stroke="var(--gold-bright)" strokeWidth="1.6" strokeLinejoin="round" />
          <circle cx="11" cy="12.5" r="1.7" fill="var(--gold-bright)" />
        </svg>
        <span style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 8.5, letterSpacing: '0.18em', color: '#3a2c1c', background: 'rgba(243,236,217,0.92)', border: '1px solid var(--gold)', borderRadius: 2, padding: '1px 6px', marginTop: 1 }}>ERA</span>
      </div>
      {/* outer region ring */}
      <svg width={size} height={size} viewBox="0 0 300 300" style={{
        position: 'absolute', inset: 0,
        transform: `rotate(${regionRot}deg)`,
        transition: spinning ? 'transform 3.1s cubic-bezier(0.16,0.9,0.2,1)' : 'none',
        filter: 'drop-shadow(0 4px 10px rgba(60,40,16,0.3))',
      }}>
        {regions.map((r, i) => {
          const a0 = i * seg - Math.PI / 2 - seg / 2;
          const a1 = a0 + seg;
          const mid = a0 + seg / 2;
          // where this wedge actually sits on screen once the ring is rotated
          const screenMid = mid + regionRot * Math.PI / 180;
          const isLanded = landedRegion === r.key && !spinning;
          const words = r.wheel.split(' ');
          const twoLine = words.length >= 2 && r.wheel.length > 9;
          const arc1 = 'arcReg1' + r.key;
          const arc2 = 'arcReg2' + r.key;
          const fs = twoLine ? 12 : (r.wheel.length > 11 ? 11.5 : 13.5);
          const fill = isLanded ? '#fff7e6' : '#f3e3c2';
          const op = isLanded ? 1 : 0.92;
          const half = words.length > 2 ? Math.ceil(words.length / 2) : 1;
          // On the lower half of the SCREEN the baseline is flipped, so swap
          // which line sits on the outer vs inner arc to preserve top‑to‑bottom
          // reading order. Keyed off the live on-screen angle, not the home angle.
          const flip = isLowerHalf(screenMid);
          const line1 = words.slice(0, half).join(' ');
          const line2 = words.slice(half).join(' ');
          const outerText = flip ? line2 : line1;
          const innerText = flip ? line1 : line2;
          return (
            <g key={r.key}>
              <path d={wedgePath(cx, cy, 96, 146, a0, a1)} fill={isLanded ? r.ink : hexA(r.ink, 0.82)}
                stroke="#f3ecd9" strokeWidth="1.5" />
              {twoLine ? (
                <>
                  <path id={arc1} d={ringArc(cx, cy, 128, mid, seg * 0.48, screenMid)} fill="none" stroke="none" />
                  <path id={arc2} d={ringArc(cx, cy, 112, mid, seg * 0.48, screenMid)} fill="none" stroke="none" />
                  <text fontFamily="Cinzel" fontWeight="700" fontSize={fs} letterSpacing="-0.01em" fill={fill} opacity={op}>
                    <textPath href={'#' + arc1} startOffset="50%" textAnchor="middle">{outerText}</textPath>
                  </text>
                  <text fontFamily="Cinzel" fontWeight="700" fontSize={fs} letterSpacing="-0.01em" fill={fill} opacity={op}>
                    <textPath href={'#' + arc2} startOffset="50%" textAnchor="middle">{innerText}</textPath>
                  </text>
                </>
              ) : (
                <>
                  <path id={arc1} d={ringArc(cx, cy, 121, mid, seg * 0.485, screenMid)} fill="none" stroke="none" />
                  <text fontFamily="Cinzel" fontWeight="700" fontSize={fs} letterSpacing="-0.01em" fill={fill} opacity={op}>
                    <textPath href={'#' + arc1} startOffset="50%" textAnchor="middle">{r.wheel}</textPath>
                  </text>
                </>
              )}
            </g>
          );
        })}
        <circle cx={cx} cy={cy} r="146" fill="none" stroke="var(--gold)" strokeWidth="2.5" />
        <circle cx={cx} cy={cy} r="96" fill="none" stroke="var(--gold)" strokeWidth="2" />
      </svg>
      {/* inner era ring */}
      <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 300 300" style={{
        position: 'absolute', top: '19%', left: '19%',
        transform: `rotate(${eraRot}deg)`,
        transition: spinning ? 'transform 3.4s cubic-bezier(0.16,0.9,0.2,1)' : 'none',
      }}>
        {eras.map((e, i) => {
          const a0 = i * eseg - Math.PI / 2 - eseg / 2;
          const a1 = a0 + eseg;
          const mid = a0 + eseg / 2;
          const screenMid = mid + eraRot * Math.PI / 180;
          const isLanded = landedEra === e.key && !spinning;
          const eWords = e.name.split(' ');
          const eTwoLine = eWords.length >= 2;
          const arc1 = 'arcEra1' + e.key;
          const arc2 = 'arcEra2' + e.key;
          const efs = eTwoLine ? 14 : (e.name.length > 7 ? 16 : 18);
          const efill = isLanded ? '#e7d3a8' : '#5e4f3a';
          const flip = isLowerHalf(screenMid);
          const outerText = flip ? eWords.slice(1).join(' ') : eWords[0];
          const innerText = flip ? eWords[0] : eWords.slice(1).join(' ');
          return (
            <g key={e.key}>
              <path d={wedgePath(cx, cy, 40, 146, a0, a1)} fill={isLanded ? '#3a2c1c' : (i % 2 ? '#d8c8a3' : '#cbb98a')}
                stroke="#a78f5f" strokeWidth="1.2" />
              {eTwoLine ? (
                <>
                  <path id={arc1} d={ringArc(cx, cy, 101, mid, eseg * 0.46, screenMid)} fill="none" stroke="none" />
                  <path id={arc2} d={ringArc(cx, cy, 84, mid, eseg * 0.46, screenMid)} fill="none" stroke="none" />
                  <text fontFamily="Cinzel" fontWeight="700" fontSize={efs} fill={efill}>
                    <textPath href={'#' + arc1} startOffset="50%" textAnchor="middle">{outerText}</textPath>
                  </text>
                  <text fontFamily="Cinzel" fontWeight="700" fontSize={efs} fill={efill}>
                    <textPath href={'#' + arc2} startOffset="50%" textAnchor="middle">{innerText}</textPath>
                  </text>
                </>
              ) : (
                <>
                  <path id={arc1} d={ringArc(cx, cy, 94, mid, eseg * 0.47, screenMid)} fill="none" stroke="none" />
                  <text fontFamily="Cinzel" fontWeight="700" fontSize={efs} fill={efill}>
                    <textPath href={'#' + arc1} startOffset="50%" textAnchor="middle">{e.name}</textPath>
                  </text>
                </>
              )}
            </g>
          );
        })}
        <circle cx={cx} cy={cy} r="146" fill="none" stroke="var(--gold)" strokeWidth="2" />
      </svg>
      {/* hub */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        width: size * 0.2, height: size * 0.2, borderRadius: '50%',
        background: 'radial-gradient(circle at 38% 32%, #d4af4f, #8a6c20)',
        border: '2px solid #6e5418', display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.35)', zIndex: 7,
      }}>
        <span style={{ fontFamily: 'var(--display)', fontWeight: 900, fontSize: size * 0.08, color: '#3a2c10' }}>✦</span>
      </div>
    </div>
  );
}

Object.assign(window, { FormationBoard, CompassDial, FORMATION });
