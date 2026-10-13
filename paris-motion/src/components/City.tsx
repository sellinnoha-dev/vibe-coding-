import React from 'react';
import {C} from '../lib/theme';
import {colorAt, draw, hash} from '../lib/anim';

// ---------------------------------------------------------------------------
// Immeuble haussmannien — repère local : x de 0 à W, sol à y = 0, hauteur ≈ 500 (vers le haut).
// Rez-de-chaussée en arcades, balcons filants aux 2e et 5e étages, toit mansardé en zinc.
// ---------------------------------------------------------------------------
export const BUILDING_W = 350;
const BAYS = 5;
const BAY = BUILDING_W / BAYS;
export const FLOOR_Y = (k: number) => -100 - 60 * (k - 1); // bas de l'étage k (1 → 5)
export const CORNICE_Y = -400;
export const WIN = {w: 30, h: 42};
/** Rectangle (repère local) de la fenêtre de l'étage `floor`, travée `bay`. */
export const windowRect = (floor: number, bay: number) => ({
  x: bay * BAY + (BAY - WIN.w) / 2,
  y: FLOOR_Y(floor) - 8 - WIN.h,
  w: WIN.w,
  h: WIN.h,
});

export type NightColors = {stone: string; line: string; roof: string; glass: string};
export const nightColors = (n: number): NightColors => ({
  stone: colorAt(n, [0, 0.5, 1], ['#EFE3CF', '#7F6E7C', '#15284A']),
  line: colorAt(n, [0, 1], [C.navy, '#2C4573']),
  roof: colorAt(n, [0, 0.5, 1], ['#8E9CB3', '#4E5576', '#0F1E3B']),
  glass: colorAt(n, [0, 1], ['#C6D1DC', '#0C1830']),
});

const railing = (x1: number, x2: number, y: number) => {
  let d = `M${x1},${y - 12} L${x2},${y - 12} M${x1},${y} L${x2},${y}`;
  for (let x = x1 + 3; x < x2; x += 6) d += ` M${x},${y - 12} L${x},${y}`;
  return d;
};

export const Building: React.FC<{
  seed: number;
  drawP: number; // tracé des lignes 0 → 1
  windowsP: number; // apparition des fenêtres 0 → 1
  night: number; // 0 jour → 1 nuit
  light: number; // 0 → 1 : allumage progressif des fenêtres
  awning?: boolean; // store rouge de café
  frame: number;
}> = ({seed, drawP, windowsP, night, light, awning, frame}) => {
  const W = BUILDING_W;
  const col = nightColors(night);
  const p = (a: number, b: number) => Math.min(Math.max((drawP - a) / (b - a), 0), 1);

  const horizontals =
    [1, 2, 3, 4, 5].map((k) => `M0,${FLOOR_Y(k)} L${W},${FLOOR_Y(k)}`).join(' ') +
    ` M-6,${CORNICE_Y} L${W + 6},${CORNICE_Y} M-6,${CORNICE_Y - 8} L${W + 6},${CORNICE_Y - 8}` +
    ` M0,-92 L${W},-92`;
  const verticals = `M0,0 L0,${CORNICE_Y} M${W},0 L${W},${CORNICE_Y}`;
  const roof = `M-4,${CORNICE_Y - 8} L12,-470 L${W - 12},-470 L${W + 4},${CORNICE_Y - 8}`;
  const chimneys = [45, W - 75].map((x) => `M${x},-470 L${x},-494 L${x + 24},-494 L${x + 24},-470 M${x - 3},-494 L${x + 27},-494`).join(' ');
  const balconies = railing(4, W - 4, FLOOR_Y(2) - 2) + ' ' + railing(4, W - 4, FLOOR_Y(5) - 2);
  const balconettes = [1, 3, 4]
    .map((k) =>
      Array.from({length: BAYS}, (_, b) => {
        const r = windowRect(k, b);
        return railing(r.x - 2, r.x + r.w + 2, FLOOR_Y(k) - 4).replace(/M[\d.]+,-?[\d.]+ L[\d.]+,-?[\d.]+ /, '');
      }).join(' '),
    )
    .join(' ');

  return (
    <g>
      {/* Façade et toit */}
      <rect x={0} y={CORNICE_Y} width={W} height={-CORNICE_Y} fill={col.stone} opacity={p(0.15, 0.6)} />
      <path d={`${roof} Z`} fill={col.roof} opacity={p(0.55, 0.95)} />
      <path d={horizontals} pathLength={1} fill="none" stroke={col.line} strokeWidth={2} style={draw(p(0, 0.45))} />
      <path d={verticals} pathLength={1} fill="none" stroke={col.line} strokeWidth={2.4} style={draw(p(0.1, 0.5))} />
      <path d={roof} pathLength={1} fill="none" stroke={col.line} strokeWidth={2.2} style={draw(p(0.45, 0.85))} />
      <path d={chimneys} pathLength={1} fill={col.roof} stroke={col.line} strokeWidth={2} style={draw(p(0.7, 1))} opacity={p(0.7, 0.8)} />

      {/* Lucarnes */}
      {[0, 2, 4].map((b) => {
        const x = b * BAY + BAY / 2;
        const lit = Math.min(Math.max((light - hash(seed * 31 + b) * 0.85) / 0.12, 0), 1) * (hash(seed + b * 9) > 0.45 ? 1 : 0);
        return (
          <g key={b} opacity={p(0.75, 1)}>
            <path d={`M${x - 13},-412 L${x - 13},-440 Q${x},-456 ${x + 13},-440 L${x + 13},-412 Z`} fill={col.stone} stroke={col.line} strokeWidth={2} />
            <rect x={x - 7} y={-438} width={14} height={22} fill={colorAt(lit, [0, 1], [col.glass, C.goldLight])} />
          </g>
        );
      })}

      {/* Fenêtres des étages */}
      {[1, 2, 3, 4, 5].map((k) =>
        Array.from({length: BAYS}, (_, b) => {
          const r = windowRect(k, b);
          const id = seed * 100 + k * 10 + b;
          const appear = Math.min(Math.max((windowsP - hash(id) * 0.6) / 0.4, 0), 1);
          const willLight = hash(id + 0.5) < 0.68;
          const lit = willLight ? Math.min(Math.max((light - hash(id + 0.25) * 0.85) / 0.15, 0), 1) : 0;
          const flick = lit > 0 ? 0.92 + 0.08 * Math.sin(frame * 0.07 + id) : 1;
          const glass = colorAt(lit * flick, [0, 1], [col.glass, hash(id + 3) > 0.5 ? C.goldLight : '#F5C982']);
          return (
            <g key={`${k}-${b}`} transform={`translate(${r.x + r.w / 2} ${r.y + r.h}) scale(1 ${appear}) translate(${-(r.x + r.w / 2)} ${-(r.y + r.h)})`} opacity={appear}>
              {lit > 0 && <rect x={r.x - 10} y={r.y - 10} width={r.w + 20} height={r.h + 20} rx={14} fill={C.gold} opacity={0.22 * lit} />}
              <rect x={r.x} y={r.y} width={r.w} height={r.h} fill={glass} stroke={col.line} strokeWidth={1.6} />
              <path d={`M${r.x + r.w / 2},${r.y} L${r.x + r.w / 2},${r.y + r.h} M${r.x},${r.y + r.h * 0.38} L${r.x + r.w},${r.y + r.h * 0.38}`} stroke={col.line} strokeWidth={1} opacity={0.8} />
            </g>
          );
        }),
      )}

      {/* Balcons filants (2e et 5e) et garde-corps */}
      <path d={balconies} pathLength={1} fill="none" stroke={night > 0.5 ? '#3A5487' : C.navy} strokeWidth={1.4} style={draw(p(0.4, 0.85))} />
      <path d={balconettes} fill="none" stroke={col.line} strokeWidth={1.1} opacity={Math.min(windowsP * 1.5, 1) * 0.9} />

      {/* Rez-de-chaussée en arcades */}
      {Array.from({length: BAYS}, (_, b) => {
        const cx = b * BAY + BAY / 2;
        const id = seed * 100 + b;
        const shopLit = Math.min(Math.max((light - hash(id + 7) * 0.5) / 0.2, 0), 1);
        return (
          <path
            key={b}
            d={`M${cx - 23},0 L${cx - 23},-62 A23,23 0 0 1 ${cx + 23},-62 L${cx + 23},0`}
            pathLength={1}
            fill={colorAt(shopLit, [0, 1], [col.glass, '#F3C77C'])}
            fillOpacity={p(0.3, 0.7)}
            stroke={col.line}
            strokeWidth={2}
            style={draw(p(0.2, 0.6))}
          />
        );
      })}
      {awning && (
        <g opacity={p(0.6, 1)}>
          <path d={`M${BAY * 0.15},-70 L${BAY * 2.85},-70 L${BAY * 2.95},-48 L${BAY * 0.05},-48 Z`} fill={C.red} />
          {Array.from({length: 7}, (_, i) => (
            <path key={i} d={`M${BAY * 0.05 + i * BAY * 0.48},-48 q${BAY * 0.12},10 ${BAY * 0.24},0`} fill={C.red} />
          ))}
        </g>
      )}
    </g>
  );
};

// ---------------------------------------------------------------------------
// Lampadaire parisien (candélabre) — base à (0, 0)
// ---------------------------------------------------------------------------
export const Lamp: React.FC<{on: number; night: number; appear?: number}> = ({on, night, appear = 1}) => {
  const line = colorAt(night, [0, 1], [C.navy, '#0A1528']);
  return (
    <g opacity={appear}>
      {on > 0 && <circle cx={0} cy={-136} r={70} fill="url(#lampGlow)" opacity={on} />}
      <path d="M-9,0 L9,0 L5,-16 L-5,-16 Z M0,-16 L0,-118 M-14,-118 L14,-118" stroke={line} strokeWidth={4} fill={line} strokeLinejoin="round" />
      <path d="M-10,-120 L10,-120 L14,-146 L-14,-146 Z" fill={colorAt(on, [0, 1], ['#D7DEE6', '#FFE2A3'])} stroke={line} strokeWidth={3} strokeLinejoin="round" />
      <path d="M-16,-146 L16,-146 L0,-158 Z" fill={line} />
    </g>
  );
};

// ---------------------------------------------------------------------------
// Arbre stylisé — base à (0, 0)
// ---------------------------------------------------------------------------
export const Tree: React.FC<{size?: number; night: number; seed?: number; frame: number; appear?: number}> = ({size = 1, night, seed = 0, frame, appear = 1}) => {
  const leaf = colorAt(night, [0, 1], ['#AEBACB', '#10213F']);
  const leaf2 = colorAt(night, [0, 1], ['#9AA9BE', '#0D1C37']);
  const trunk = colorAt(night, [0, 1], [C.navy, '#081226']);
  const sway = Math.sin(frame / 40 + seed) * 1.5;
  return (
    <g transform={`scale(${size}) scale(${appear})`} opacity={appear}>
      <path d="M-4,0 L-3,-70 L3,-70 L4,0 Z" fill={trunk} />
      <g transform={`translate(${sway} 0)`}>
        <ellipse cx={-22} cy={-92} rx={36} ry={32} fill={leaf2} />
        <ellipse cx={22} cy={-96} rx={38} ry={34} fill={leaf2} />
        <ellipse cx={0} cy={-122} rx={40} ry={36} fill={leaf} />
      </g>
    </g>
  );
};

// ---------------------------------------------------------------------------
// Passants (silhouettes animées) — pieds à (0, 0), hauteur ≈ 62
// ---------------------------------------------------------------------------
const Person: React.FC<{phase: number; color: string; dir: 1 | -1; coat?: string; tall?: number}> = ({phase, color, dir, coat, tall = 1}) => {
  const a = Math.sin(phase) * 0.42;
  const leg = (ang: number) => `M0,-27 L${Math.sin(ang) * 27},${-27 + Math.cos(ang) * 27}`;
  const arm = (ang: number) => `M0,-48 L${Math.sin(ang) * 20},${-48 + Math.cos(ang) * 20}`;
  const bob = Math.abs(Math.cos(phase)) * 1.2;
  return (
    <g transform={`scale(${dir * tall} ${tall}) translate(0 ${-bob})`}>
      <path d={`${leg(a)} ${leg(-a)}`} stroke={color} strokeWidth={5} strokeLinecap="round" />
      <path d={`${arm(-a * 0.8)} ${arm(a * 0.8)}`} stroke={color} strokeWidth={4.5} strokeLinecap="round" />
      <path d="M-7,-52 L7,-52 L9,-24 L-9,-24 Z" fill={coat ?? color} />
      <circle cx={1} cy={-59} r={6.5} fill={color} />
    </g>
  );
};

const Dog: React.FC<{phase: number; color: string; dir: 1 | -1}> = ({phase, color, dir}) => {
  const a = Math.sin(phase * 1.6) * 0.5;
  const leg = (x: number, ang: number) => `M${x},-12 L${x + Math.sin(ang) * 11},${-12 + Math.cos(ang) * 11}`;
  return (
    <g transform={`scale(${dir} 1)`}>
      <path d={`${leg(-9, a)} ${leg(9, -a)}`} stroke={color} strokeWidth={3.5} strokeLinecap="round" />
      <ellipse cx={0} cy={-15} rx={13} ry={6} fill={color} />
      <circle cx={14} cy={-21} r={5} fill={color} />
      <path d="M-12,-17 L-19,-24" stroke={color} strokeWidth={3} strokeLinecap="round" />
    </g>
  );
};

export const Walkers: React.FC<{frame: number; night: number; groundY: number; appear: number}> = ({frame, night, groundY, appear}) => {
  const col = colorAt(night, [0, 1], ['#24375E', '#040B18']);
  const t = frame / 30;
  // Un couple qui se promène, une personne avec son chien, un passant pressé.
  const coupleX = 260 + t * 34;
  const dogX = 1900 - t * 28;
  const soloX = -200 + t * 52;
  return (
    <g opacity={appear}>
      <g transform={`translate(${coupleX} ${groundY})`}>
        <Person phase={t * 5.2} color={col} dir={1} />
        <g transform="translate(-20 0)">
          <Person phase={t * 5.2 + 0.4} color={col} dir={1} coat={night > 0.5 ? '#3B0E1A' : C.red} tall={0.93} />
        </g>
        <path d="M-15,-40 Q-9,-36 -4,-40" stroke={col} strokeWidth={4} fill="none" strokeLinecap="round" />
      </g>
      <g transform={`translate(${dogX} ${groundY})`}>
        <Person phase={t * 4.6} color={col} dir={-1} />
        <g transform="translate(-34 0)">
          <Dog phase={t * 4.6} color={col} dir={-1} />
        </g>
        <path d="M-6,-38 Q-24,-26 -46,-22" stroke={col} strokeWidth={1.2} fill="none" />
      </g>
      <g transform={`translate(${soloX} ${groundY})`}>
        <Person phase={t * 6.4} color={col} dir={1} tall={1.04} />
      </g>
    </g>
  );
};

// ---------------------------------------------------------------------------
// Bateaux — ligne de flottaison à (0, 0)
// ---------------------------------------------------------------------------
export const Barge: React.FC<{night: number}> = ({night}) => {
  const hull = colorAt(night, [0, 1], [C.navy, '#081328']);
  return (
    <g>
      <path d="M-150,0 L150,0 L165,-22 L-160,-22 Z" fill={hull} />
      <rect x={-130} y={-34} width={200} height={12} fill={colorAt(night, [0, 1], ['#B9C3CF', '#14223F'])} />
      <path d="M90,-22 L90,-58 L135,-58 L135,-22 Z" fill={colorAt(night, [0, 1], [C.cream, '#14223F'])} stroke={hull} strokeWidth={3} />
      <rect x={100} y={-50} width={26} height={14} fill={colorAt(night, [0, 1], ['#C6D1DC', '#F2C26B'])} />
      <rect x={-148} y={-30} width={20} height={6} fill={C.red} />
    </g>
  );
};

export const TourBoat: React.FC<{frame: number}> = ({frame}) => (
  <g>
    <path d="M-190,0 L180,0 L205,-26 L-200,-26 Z" fill="#081328" />
    <path d="M-170,-26 L170,-26 L160,-64 Q0,-74 -160,-64 Z" fill="#0F2141" />
    {Array.from({length: 13}, (_, i) => (
      <rect key={i} x={-150 + i * 23} y={-58} width={16} height={22} rx={3} fill={i % 4 === 1 ? '#F5C982' : '#F2D597'} opacity={0.85 + 0.15 * Math.sin(frame * 0.1 + i)} />
    ))}
    <rect x={-150} y={-56} width={300} height={22} fill="#F2D597" opacity={0.12} />
  </g>
);
