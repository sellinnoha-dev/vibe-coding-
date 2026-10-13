import React from 'react';
import {draw, hash} from '../lib/anim';

// Tour Eiffel vectorielle — repère local : largeur 400, hauteur 1000, base à y = 1000.
// Proportions inspirées de la vraie tour : 1er étage à 57 m, 2e à 115 m, sommet à 330 m.

type Pt = [number, number];
const mir = ([x, y]: Pt): Pt => [400 - x, y];
const lerpP = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const quad = (a: Pt, c: Pt, b: Pt, t: number): Pt => [
  (1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0],
  (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1],
];
const pts = (p: Pt[]) => p.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

/** Croisillons (treillis) entre deux lignes A(t) et B(t). */
const lattice = (A: (t: number) => Pt, B: (t: number) => Pt, n: number) => {
  const z1: Pt[] = [];
  const z2: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    z1.push(i % 2 ? B(t) : A(t));
    z2.push(i % 2 ? A(t) : B(t));
  }
  return `${pts(z1)} ${pts(z2)}`;
};

// --- Géométrie (moitié gauche, la droite est le miroir) ---
const legOut = (t: number) => lerpP([10, 1000], [94, 827], t);
const legIn = (t: number) => lerpP([100, 1000], [130, 838], t);
const midOut = (t: number) => lerpP([94, 808], [139, 660], t);
const midIn = (t: number) => lerpP([150, 808], [184, 690], t);
const upL = (t: number) => quad([140, 640], [176, 400], [186, 172], t);
const upR = (t: number) => mir(upL(t));

const mirrorPath = (d: string) =>
  d.replace(/([ML])(-?[\d.]+),(-?[\d.]+)/g, (_m, c, x, y) => `${c}${(400 - parseFloat(x)).toFixed(1)},${y}`);

type Part = {d: string; level: number; w?: number};

const leftParts: Part[] = [
  {d: pts([legOut(0), legOut(1)]), level: 0, w: 1.4},
  {d: pts([legIn(0), legIn(1)]), level: 0.02, w: 1.2},
  {d: lattice(legOut, legIn, 6), level: 0.05, w: 0.7},
  {d: pts([midOut(0), midOut(1)]), level: 0.3, w: 1.3},
  {d: pts([midIn(0), midIn(1)]), level: 0.32, w: 1},
  {d: lattice(midOut, midIn, 5), level: 0.35, w: 0.7},
];

const parts: Part[] = [
  ...leftParts,
  ...leftParts.map((p) => ({...p, d: mirrorPath(p.d)})),
  // Grande arche de la base
  {d: 'M105.6,970 Q200,760 294.4,970', level: 0.12, w: 1.3},
  {d: 'M112,985 Q200,790 288,985', level: 0.14, w: 0.6},
  // 1er étage + galerie
  {d: 'M82,808 L318,808 L318,834 L82,834 Z', level: 0.25, w: 1.3},
  {
    d: Array.from({length: 19}, (_, i) => `M${92 + i * 12},812 L${92 + i * 12},830`).join(' '),
    level: 0.27,
    w: 0.5,
  },
  // Petite arche du 1er au 2e étage
  {d: 'M184,690 Q200,668 216,690', level: 0.45, w: 1},
  // 2e étage
  {d: 'M130,640 L270,640 L270,660 L130,660 Z', level: 0.5, w: 1.2},
  {d: Array.from({length: 11}, (_, i) => `M${137 + i * 12.6},643 L${137 + i * 12.6},657`).join(' '), level: 0.52, w: 0.5},
  // Fût supérieur
  {d: `${pts(Array.from({length: 21}, (_, i) => upL(i / 20)))}`, level: 0.55, w: 1.3},
  {d: `${pts(Array.from({length: 21}, (_, i) => upR(i / 20)))}`, level: 0.55, w: 1.3},
  {d: lattice(upL, upR, 14), level: 0.6, w: 0.6},
  {d: `${pts([upL(0.45), upR(0.45)])}`, level: 0.7, w: 1},
  // Sommet
  {d: 'M178,150 L222,150 L222,172 L178,172 Z', level: 0.85, w: 1.1},
  {d: 'M188,150 L188,112 Q200,92 212,112 L212,150', level: 0.9, w: 1},
  {d: 'M200,96 L200,18', level: 0.95, w: 1},
];

// Silhouette pleine (avec l'arche évidée) pour le remplissage.
const silhouette = (() => {
  const left: Pt[] = [[10, 1000], [94, 834], [82, 834], [82, 808], [94, 808], [139, 660], [130, 660], [130, 640], [140, 640]];
  const up = Array.from({length: 13}, (_, i) => upL(i / 12));
  const top: Pt[] = [[178, 172], [178, 150], [188, 150], [188, 112], [200, 96], [212, 112], [212, 150], [222, 150], [222, 172]];
  const right = [...left].reverse().map(mir);
  const upRight = [...up].reverse().map(mir);
  const outline = [...left, ...up, ...top, ...upRight, ...right];
  return `${pts(outline)} L300,1000 L294.4,970 Q200,760 105.6,970 L100,1000 Z`;
})();

export const EiffelTower: React.FC<{
  progress?: number; // 0 → 1 : tracé du bas vers le haut
  color?: string;
  fill?: string;
  fillOpacity?: number;
  stroke?: number; // multiplicateur d'épaisseur
  glow?: number; // 0 → 1 : halo doré (de nuit)
  sparkle?: number; // 0 → 1 : scintillement
  frame?: number;
}> = ({progress = 1, color = '#1B2D52', fill = '#1B2D52', fillOpacity = 0, stroke = 2.4, glow = 0, sparkle = 0, frame = 0}) => {
  const partP = (level: number) => Math.min(Math.max((progress - level * 0.72) / 0.28, 0), 1);
  const lines = parts.map((p, i) => (
    <path
      key={i}
      d={p.d}
      pathLength={1}
      fill="none"
      stroke={color}
      strokeWidth={(p.w ?? 1) * stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={draw(partP(p.level))}
    />
  ));
  return (
    <g>
      {glow > 0 && (
        <path d={silhouette} fill={color} opacity={0.18 * glow} style={{filter: `blur(${22}px)`}} />
      )}
      <path d={silhouette} fill={fill} opacity={fillOpacity} />
      {glow > 0 && <g opacity={0.55 * glow} style={{filter: 'blur(5px)'}}>{lines}</g>}
      {lines}
      {sparkle > 0 &&
        Array.from({length: 46}, (_, i) => {
          const t = hash(i * 3.1);
          const y = 990 - t * 900;
          const half = y > 834 ? 190 * (1 - (1000 - y) / 400) : y > 660 ? 110 * (y - 600) / 240 + 25 : 15 + (y - 172) / 468 * 45;
          const x = 200 + (hash(i * 7.7) * 2 - 1) * Math.max(half, 8);
          const tw = Math.max(0, Math.sin(frame * 0.45 + i * 2.3)) ** 6;
          return <circle key={i} cx={x} cy={y} r={4.5} fill="#FFFFFF" opacity={sparkle * tw} />;
        })}
    </g>
  );
};
