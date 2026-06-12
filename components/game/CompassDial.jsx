import React from 'react';

/* Canonical wheel data (regions outer ring, eras inner ring). */
export const WHEEL_REGIONS = [
  { key: 'EASIA', wheel: 'East Asia', ink: '#3f7d5a' },
  { key: 'MEDIT', wheel: 'The Med', ink: '#9a6a1f' },
  { key: 'MIDE', wheel: 'Middle East', ink: '#2f6f86' },
  { key: 'AFRIC', wheel: 'Africa', ink: '#b5642a' },
  { key: 'AMER', wheel: 'The Americas', ink: '#2d8079' },
  { key: 'WEUR', wheel: 'Western Europe', ink: '#3a5a8c' },
  { key: 'EEUR', wheel: 'Eastern Europe', ink: '#8a3b5a' },
  { key: 'SASIA', wheel: 'South Asia', ink: '#a8602c' },
];
export const WHEEL_ERAS = [
  { key: 'ANCIENT', name: 'Ancient' },
  { key: 'CLASSIC', name: 'Classical' },
  { key: 'MEDIEV', name: 'Medieval' },
  { key: 'EARLYM', name: 'Early Modern' },
  { key: 'MODERN', name: 'Modern' },
  { key: 'PRESENT', name: 'Present' },
];

function hexA(hex, a) {
  const h = hex.replace('#', '');
  return `rgba(${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)},${a})`;
}
function wedgePath(cx, cy, rIn, rOut, a0, a1) {
  const p = (r, a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  const [x0, y0] = p(rOut, a0), [x1, y1] = p(rOut, a1);
  const [x2, y2] = p(rIn, a1), [x3, y3] = p(rIn, a0);
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M${x0},${y0} A${rOut},${rOut} 0 ${large} 1 ${x1},${y1} L${x2},${y2} A${rIn},${rIn} 0 ${large} 0 ${x3},${y3} Z`;
}
/* Lower half of the dial = curved text would render upside down. */
function isLowerHalf(a) {
  return Math.sin(a) > 1e-6 || (Math.abs(Math.sin(a)) <= 1e-6 && Math.cos(a) < 0);
}
/* Curved label baseline; reverses on the lower half so text stays
   upright. Pass the LIVE on-screen angle as flipAt. */
function ringArc(cx, cy, R, mid, half, flipAt = mid) {
  const flip = isLowerHalf(flipAt);
  const P = (a) => [cx + R * Math.cos(a), cy + R * Math.sin(a)];
  const a0 = mid - half, a1 = mid + half;
  if (flip) { const [x0, y0] = P(a1), [x1, y1] = P(a0); return `M${x0.toFixed(2)},${y0.toFixed(2)} A${R},${R} 0 0 0 ${x1.toFixed(2)},${y1.toFixed(2)}`; }
  const [x0, y0] = P(a0), [x1, y1] = P(a1); return `M${x0.toFixed(2)},${y0.toFixed(2)} A${R},${R} 0 0 1 ${x1.toFixed(2)},${y1.toFixed(2)}`;
}

/* The Wheel of Ages — two-ring compass dial. Outer ring = 8 regions in
   their inks; inner ring = 6 eras in alternating parchment. Fixed
   pointers top (REGION, wax red) and bottom (ERA, dark). Animate by
   raising regionRot/eraRot with spinning=true (3.1s/3.4s decelerating
   cubic-bezier baked in). */
export function CompassDial({ size = 250, regionRot = 0, eraRot = 0, spinning = false, landedRegion, landedEra, regions = WHEEL_REGIONS, eras = WHEEL_ERAS }) {
  const cx = 150, cy = 150;
  const seg = (Math.PI * 2) / regions.length;
  const eseg = (Math.PI * 2) / eras.length;
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
      <div style={{ position: 'absolute', bottom: '19.5%', left: '50%', transform: 'translateX(-50%)', zIndex: 11, display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none' }}>
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
          const screenMid = mid + regionRot * Math.PI / 180;
          const isLanded = landedRegion === r.key && !spinning;
          const words = r.wheel.split(' ');
          const twoLine = words.length >= 2 && r.wheel.length > 9;
          const arc1 = 'dsArcReg1' + r.key;
          const arc2 = 'dsArcReg2' + r.key;
          const fs = twoLine ? 12 : (r.wheel.length > 11 ? 11.5 : 13.5);
          const fill = isLanded ? '#fff7e6' : '#f3e3c2';
          const op = isLanded ? 1 : 0.92;
          const half = words.length > 2 ? Math.ceil(words.length / 2) : 1;
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
          const arc1 = 'dsArcEra1' + e.key;
          const arc2 = 'dsArcEra2' + e.key;
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
