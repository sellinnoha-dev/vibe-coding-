import React from 'react';
import {C} from '../lib/theme';
import {colorAt, draw, hash} from '../lib/anim';

// =====================================================================================
// Le pont des Arts en élévation (repère « monde »).
// Tablier de x = 220 à x = 1700, à y = 640. Surface de la Seine à y = 720.
// =====================================================================================
export const BR = {x0: 220, x1: 1700, deck: 640, water: 720, railTop: 592, railBottom: 636, panels: 40};
export const PANEL_W = (BR.x1 - BR.x0) / BR.panels;
export const archX = (n: number, i: number) => BR.x0 + ((BR.x1 - BR.x0) / n) * i;

/** Arche en fonte : arc surbaissé + montants verticaux entre l'arc et le tablier. */
const archPath = (a: number, b: number) => {
  const mid = (a + b) / 2;
  let d = `M${a + 8},700 Q${mid},608 ${b - 8},700`;
  const span = b - a;
  for (let k = 1; k < 8; k++) {
    const x = a + 8 + ((span - 16) * k) / 8;
    const t = k / 8;
    const y = (1 - t) * (1 - t) * 700 + 2 * (1 - t) * t * 608 + t * t * 700;
    d += ` M${x},${y} L${x},${BR.deck + 8}`;
  }
  return d;
};
export const ARCH_CROWN = 654;

export type BridgeState = {
  n: number; // nombre d'arches (9 puis 7)
  drawP: number; // tracé
  centerFirst?: boolean; // tracé depuis le centre
  collapse?: {indices: number[]; p: number}; // effondrement de 1979
  opacity?: number;
  night: number;
};

export const Bridge: React.FC<BridgeState> = ({n, drawP, centerFirst, collapse, opacity = 1, night}) => {
  const line = colorAt(night, [0, 1], [C.navy, '#6F86B5']);
  const stone = colorAt(night, [0, 1], ['#E2D4BC', '#1A2C4F']);
  const c = (n - 1) / 2;
  const partP = (i: number) => {
    const order = centerFirst ? Math.abs(i - c) / (c + 0.5) : i / n;
    return Math.min(Math.max((drawP - order * 0.6) / 0.4, 0), 1);
  };
  return (
    <g opacity={opacity}>
      {Array.from({length: n}, (_, i) => {
        const a = archX(n, i);
        const b = archX(n, i + 1);
        const fall = collapse && collapse.indices.includes(i) ? collapse.p : 0;
        const p = partP(i);
        const mid = (a + b) / 2;
        return (
          <g key={i} opacity={1 - fall} transform={`translate(${mid} 650) rotate(${fall * (i % 2 ? 14 : -12)}) translate(${-mid} ${-650 + fall * 120})`}>
            <path d={archPath(a, b)} pathLength={1} fill="none" stroke={line} strokeWidth={2.4} strokeLinecap="round" style={draw(p)} />
            <path d={`M${a},${BR.deck} L${b},${BR.deck} M${a},${BR.deck + 8} L${b},${BR.deck + 8}`} pathLength={1} stroke={line} strokeWidth={2.6} style={draw(p)} />
          </g>
        );
      })}
      {/* Piles en pierre */}
      {Array.from({length: n - 1}, (_, k) => {
        const x = archX(n, k + 1);
        const p = Math.min(partP(k), partP(k + 1));
        return (
          <g key={k} opacity={p}>
            <path d={`M${x - 11},690 L${x + 11},690 L${x + 13},860 L${x - 13},860 Z`} fill={stone} stroke={line} strokeWidth={2} />
            <path d={`M${x - 14},690 L${x + 14},690`} stroke={line} strokeWidth={3} />
          </g>
        );
      })}
    </g>
  );
};

/** Garde-corps : poteaux, grillage (puis vitres), avec les cadenas accrochés. */
export type RailState = {
  drawP: number;
  mesh: number; // opacité du grillage
  glass: number; // 0 → 1 : pose des vitres
  locksAt: number; // image courante pour l'apparition des cadenas
  locksOut: number; // 0 → 1 : retrait des cadenas (2015)
  fallen: {panel: number; p: number; board: number}; // panneau tombé en 2014 + planche provisoire
  night: number;
  frame: number;
  gap?: {x0: number; x1: number; p: number};
};

const LOCK_COLORS = [C.gold, C.red, '#B9C3CF', C.goldLight, '#8E9CB3', C.cream, '#D98C5F', '#6F86B5'];
export const LOCKS = Array.from({length: 1100}, (_, i) => {
  const x = BR.x0 + 4 + hash(i * 1.37) * (BR.x1 - BR.x0 - 8);
  const y = BR.railTop + 8 + hash(i * 2.71) * (BR.railBottom - BR.railTop - 12);
  return {
    x,
    y,
    panel: Math.floor((x - BR.x0) / PANEL_W),
    color: LOCK_COLORS[Math.floor(hash(i * 5.3) * LOCK_COLORS.length)],
    size: 0.75 + hash(i * 7.1) * 0.45,
    appear: 950 + Math.pow(hash(i * 9.9), 0.6) * 200,
    rot: (hash(i * 3.3) - 0.5) * 30,
  };
});
// Un cœur de cadenas rouges au centre du pont.
export const HEART = Array.from({length: 18}, (_, k) => {
  const t = (k / 18) * Math.PI * 2;
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
  return {x: 960 + x * 1.05, y: 612 + y * 1.05, appear: 1110 + k * 3};
});

export const MiniLock: React.FC<{x: number; y: number; s: number; color: string; rot?: number; closed?: number; opacity?: number}> = ({x, y, s, color, rot = 0, closed = 1, opacity = 1}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={opacity}>
    <path d={`M-2.6,${-1 - (1 - closed) * 2} L-2.6,-4 A2.6,2.6 0 0 1 2.6,-4 L2.6,-1`} fill="none" stroke="#5C6B85" strokeWidth={1.1} />
    <rect x={-3.6} y={-1.2} width={7.2} height={6} rx={1.2} fill={color} stroke="rgba(11,26,51,0.55)" strokeWidth={0.5} />
  </g>
);

export const Railing: React.FC<RailState> = ({drawP, mesh, glass, locksAt, locksOut, fallen, night, frame, gap}) => {
  const line = colorAt(night, [0, 1], [C.navy, '#6F86B5']);
  const L = BR.x1 - BR.x0;
  return (
    <g>
      <defs>
        <pattern id="meshA" width={5} height={5} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0,0 L0,5" stroke={line} strokeWidth={0.55} />
        </pattern>
        <pattern id="meshB" width={5} height={5} patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
          <path d="M0,0 L0,5" stroke={line} strokeWidth={0.55} />
        </pattern>
        <linearGradient id="glassG" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#E8F2F7" stopOpacity={0.55} />
          <stop offset="100%" stopColor="#BFD6E3" stopOpacity={0.25} />
        </linearGradient>
      </defs>
      {Array.from({length: BR.panels}, (_, k) => {
        const x = BR.x0 + k * PANEL_W;
        const isFallen = k === fallen.panel;
        const fp = isFallen ? fallen.p : 0;
        const vis = Math.min(Math.max((drawP * L - (x - BR.x0)) / 120, 0), 1);
        const gp = Math.min(Math.max(glass * 1.6 - (k / BR.panels) * 0.6, 0), 1);
        const inGap = gap && x + PANEL_W / 2 > gap.x0 && x + PANEL_W / 2 < gap.x1 ? gap.p : 0;
        return (
          <g key={k} opacity={vis * (1 - inGap)} transform={`translate(0 ${inGap * 120})`}>
            {/* Grillage + cadenas de ce panneau (ils tombent ensemble en 2014) */}
            <g opacity={1 - fp} transform={`translate(${x} ${BR.railBottom}) rotate(${fp * 28}) translate(${-x} ${-BR.railBottom + fp * 70})`}>
              <g opacity={mesh}>
                <rect x={x + 1} y={BR.railTop + 2} width={PANEL_W - 2} height={BR.railBottom - BR.railTop - 2} fill="url(#meshA)" />
                <rect x={x + 1} y={BR.railTop + 2} width={PANEL_W - 2} height={BR.railBottom - BR.railTop - 2} fill="url(#meshB)" />
              </g>
              {LOCKS.filter((l) => l.panel === k && locksAt >= l.appear).map((l, i) => {
                const pop = Math.min((locksAt - l.appear) / 8, 1);
                const out = Math.min(Math.max(locksOut * 1.5 - hash(l.x) * 0.5, 0), 1);
                if (out >= 1) return null;
                return <MiniLock key={i} opacity={1 - out} x={l.x} y={l.y + out * 30} s={l.size * (0.4 + 0.6 * pop) * (pop < 1 ? 1 + 0.25 * Math.sin(pop * Math.PI) : 1)} color={l.color} rot={l.rot} />;
              })}
            </g>
            {isFallen && fallen.board > 0 && (
              <rect x={x + 1} y={BR.railTop + 2} width={PANEL_W - 2} height={BR.railBottom - BR.railTop - 2} fill="#C9A878" opacity={fallen.board * (1 - gp)} />
            )}
            {gp > 0 && (
              <g transform={`translate(0 ${(1 - gp) * -12})`} opacity={gp}>
                <rect x={x + 1.5} y={BR.railTop + 2} width={PANEL_W - 3} height={BR.railBottom - BR.railTop - 2} fill="url(#glassG)" stroke={C.white} strokeWidth={0.6} strokeOpacity={0.7} />
                <path d={`M${x + 8},${BR.railTop + 34} L${x + 20},${BR.railTop + 6}`} stroke={C.white} strokeWidth={1.4} opacity={0.5 + 0.3 * Math.sin(frame / 20 + k)} />
              </g>
            )}
          </g>
        );
      })}
      {/* Poteaux et main courante */}
      <path
        d={
          `M${BR.x0},${BR.railTop} L${BR.x1},${BR.railTop} M${BR.x0},${BR.railBottom} L${BR.x1},${BR.railBottom} ` +
          Array.from({length: BR.panels + 1}, (_, k) => `M${BR.x0 + k * PANEL_W},${BR.railTop} L${BR.x0 + k * PANEL_W},${BR.deck}`).join(' ')
        }
        pathLength={1}
        stroke={line}
        strokeWidth={2.2}
        fill="none"
        style={draw(drawP)}
      />
    </g>
  );
};

// =====================================================================================
// Grand cadenas (titre) — centré sur le corps, largeur ≈ 120, hauteur ≈ 160
// =====================================================================================
/** Points de l'anse du cadenas (pour la transformer en arche). */
export const shacklePoints = (closed: number, N = 40): [number, number][] => {
  const lift = (1 - closed) * 26;
  const pts: [number, number][] = [];
  for (let i = 0; i <= N; i++) {
    const u = i / N;
    if (u < 0.25) pts.push([-38, -10 - lift - (u / 0.25) * 40]);
    else if (u < 0.75) {
      const a = Math.PI - ((u - 0.25) / 0.5) * Math.PI;
      pts.push([38 * Math.cos(a), -50 - lift - 38 * Math.sin(a)]);
    } else pts.push([38, -50 - (u >= 0.999 ? 40 * 1 : ((u - 0.75) / 0.25) * 40) + 0 - lift]);
  }
  // Correction de la jambe droite (descend de -50 à -10)
  for (let i = 0; i <= N; i++) {
    const u = i / N;
    if (u >= 0.75) pts[i] = [38, -50 + ((u - 0.75) / 0.25) * 40 - lift];
  }
  return pts;
};
export const polyline = (pts: [number, number][]) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

export const BigLock: React.FC<{drawP: number; closed: number; heart: number; color?: string; hideShackle?: boolean}> = ({drawP, closed, heart, color = C.gold, hideShackle}) => (
  <g>
    {!hideShackle && (
      <path d={polyline(shacklePoints(closed))} pathLength={1} fill="none" stroke={color} strokeWidth={11} strokeLinecap="round" style={draw(Math.min(drawP * 1.4, 1))} />
    )}
    <rect x={-62} y={-14} width={124} height={104} rx={18} pathLength={1} fill={C.nightSoft} fillOpacity={Math.max(0, drawP * 2 - 1)} stroke={color} strokeWidth={5} style={draw(drawP)} />
    <g opacity={heart} transform={`translate(0 ${30}) scale(${0.6 + 0.4 * heart})`}>
      <path d="M0,22 C-30,2 -26,-20 -12,-22 C-4,-23 0,-16 0,-12 C0,-16 4,-23 12,-22 C26,-20 30,2 0,22 Z" fill={C.red} />
    </g>
  </g>
);

/** Petite clé qui tombe dans la Seine. */
export const Key: React.FC<{color?: string}> = ({color = C.gold}) => (
  <g>
    <circle cx={0} cy={0} r={3.2} fill="none" stroke={color} strokeWidth={1.4} />
    <path d="M3.2,0 L12,0 M9,0 L9,2.5 M11,0 L11,2" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
  </g>
);

// =====================================================================================
// Rives : Institut de France (rive gauche) et Louvre (rive droite)
// =====================================================================================
const windowsGrid = (x0: number, x1: number, rows: number[], step: number, w: number, h: number) => {
  const out: {x: number; y: number; w: number; h: number}[] = [];
  for (const y of rows) for (let x = x0; x + w <= x1; x += step) out.push({x, y, w, h});
  return out;
};
const INSTITUT_WIN = windowsGrid(-60, 62, [578, 606], 22, 9, 16).concat(windowsGrid(198, 214, [578, 606], 22, 9, 16));
const LOUVRE_WIN = windowsGrid(1700, 2060, [520, 560, 600], 28, 12, 22);

export const Banks: React.FC<{drawP: number; night: number; light: number; frame: number}> = ({drawP, night, light, frame}) => {
  const line = colorAt(night, [0, 1], [C.navy, '#4E6797']);
  const stone = colorAt(night, [0, 0.5, 1], ['#EFE3CF', '#7F6E7C', '#15284A']);
  const roof = colorAt(night, [0, 0.5, 1], ['#8E9CB3', '#4E5576', '#0F1E3B']);
  const quay = colorAt(night, [0, 1], ['#D9CBB2', '#132442']);
  const p = (a: number, b: number) => Math.min(Math.max((drawP - a) / (b - a), 0), 1);
  const win = (list: typeof LOUVRE_WIN, seed: number) =>
    list.map((r, i) => {
      const lit = hash(seed + i) < 0.75 ? Math.min(Math.max((light - hash(seed + i * 3) * 0.8) / 0.2, 0), 1) : 0;
      return <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} fill={colorAt(lit, [0, 1], [colorAt(night, [0, 1], ['#C6D1DC', '#0C1830']), C.goldLight])} stroke={line} strokeWidth={1} opacity={p(0.4, 0.9)} />;
    });
  return (
    <g>
      {/* Institut de France, avec sa coupole */}
      <g opacity={p(0, 0.3)}>
        <rect x={-80} y={560} width={295} height={80} fill={stone} stroke={line} strokeWidth={2} />
        <rect x={70} y={500} width={120} height={140} fill={stone} stroke={line} strokeWidth={2} />
        <path d="M62,500 L130,470 L198,500 Z" fill={stone} stroke={line} strokeWidth={2} />
        <path d={Array.from({length: 6}, (_, i) => `M${82 + i * 19},508 L${82 + i * 19},640`).join(' ')} stroke={line} strokeWidth={2} />
        <rect x={100} y={430} width={60} height={40} fill={stone} stroke={line} strokeWidth={2} />
        <path d={Array.from({length: 5}, (_, i) => `M${106 + i * 12},434 L${106 + i * 12},466`).join(' ')} stroke={line} strokeWidth={1.2} />
        <path d="M96,432 Q130,346 164,432 Z" fill={roof} stroke={line} strokeWidth={2} />
        <path d="M124,374 L124,356 L136,356 L136,374 M130,356 L130,342" fill={stone} stroke={line} strokeWidth={2} />
      </g>
      {win(INSTITUT_WIN, 11)}
      {/* Le Louvre */}
      <g opacity={p(0.15, 0.45)}>
        <rect x={1690} y={500} width={420} height={140} fill={stone} stroke={line} strokeWidth={2} />
        <path d="M1735,500 L1755,420 L1875,420 L1895,500 Z" fill={roof} stroke={line} strokeWidth={2} />
        <path d="M1690,500 L1700,476 L2110,476 L2110,500 Z" fill={roof} stroke={line} strokeWidth={2} />
        <path d="M1785,420 L1785,404 L1805,404 L1805,420 M1825,420 L1825,404 L1845,404 L1845,420" fill={roof} stroke={line} strokeWidth={2} />
        <path d="M1690,508 L2110,508 M1690,590 L2110,590" stroke={line} strokeWidth={1.4} />
      </g>
      {win(LOUVRE_WIN, 31)}
      {/* Quais */}
      <rect x={-100} y={640} width={325} height={440} fill={quay} />
      <rect x={1695} y={640} width={500} height={440} fill={quay} />
      <path d={`M-100,640 L225,640 M1695,640 L2200,640 M225,640 L225,1080 M1695,640 L1695,1080`} stroke={line} strokeWidth={2} />
      {Array.from({length: 6}, (_, i) => (
        <path key={i} d={`M-100,${670 + i * 32} L225,${670 + i * 32} M1695,${670 + i * 32} L2200,${670 + i * 32}`} stroke={colorAt(night, [0, 1], ['#B9A88C', '#1E3358'])} strokeWidth={1.4} />
      ))}
    </g>
  );
};
