import {hash} from '../lib/anim';

// Silhouette de Paris (de gauche à droite) : toits haussmanniens, Sacré-Cœur sur sa butte,
// Panthéon, Notre-Dame, puis l'Arc de Triomphe. Ligne d'horizon à y = 930.
const G = 930;
const roofs = (x1: number, x2: number, seed: number) => {
  let d = '';
  let x = x1;
  let i = 0;
  while (x < x2) {
    const w = Math.min(70 + hash(seed + i) * 60, x2 - x);
    const h = 70 + hash(seed + i + 50) * 40;
    d += `M${x},${G} L${x},${G - h} L${x + 8},${G - h - 18} L${x + w - 8},${G - h - 18} L${x + w},${G - h} L${x + w},${G} Z `;
    if (hash(seed + i + 9) > 0.4) d += `M${x + w * 0.3},${G - h - 18} L${x + w * 0.3},${G - h - 30} L${x + w * 0.3 + 12},${G - h - 30} L${x + w * 0.3 + 12},${G - h - 18} Z `;
    x += w;
    i++;
  }
  return d;
};

export const SKYLINE = [
  roofs(-20, 140, 1),
  // Butte Montmartre et Sacré-Cœur
  `M100,${G} Q330,800 560,${G} Z`,
  'M285,875 L285,822 L395,822 L395,875 Z',
  'M302,824 Q340,742 378,824 Z M335,750 L335,733 L345,733 L345,750 Z M338,733 L340,722 L342,733 Z',
  'M284,826 Q296,800 308,826 Z M372,826 Q384,800 396,826 Z',
  'M398,858 L398,782 L412,782 L412,858 Z M397,784 Q405,766 413,784 Z',
  roofs(540, 760, 20),
  // Panthéon
  `M766,${G} L766,852 L894,852 L894,${G} Z`,
  'M798,852 L798,806 L862,806 L862,852 Z M800,808 Q830,744 860,808 Z M826,752 L826,736 L834,736 L834,752 Z',
  roofs(894, 930, 40),
  // Notre-Dame
  `M930,${G} L930,786 L986,786 L986,${G} Z M1012,${G} L1012,786 L1068,786 L1068,${G} Z M984,${G} L984,826 L1014,826 L1014,${G} Z`,
  `M1068,${G} L1068,858 L1160,858 L1170,${G} Z M1112,858 L1118,770 L1124,858 Z`,
  roofs(1170, 1560, 60),
  // Arc de Triomphe
  `M1580,${G} L1580,846 L1676,846 L1676,${G} L1642,${G} L1642,892 A14,14 0 0 0 1614,892 L1614,${G} Z`,
  roofs(1676, 1960, 80),
].join(' ');

/** Petites fenêtres allumées dans les toits. */
export const SKYLINE_WINDOWS = Array.from({length: 90}, (_, i) => {
  const zones = [
    [0, 130],
    [560, 750],
    [1180, 1550],
    [1690, 1920],
  ];
  const z = zones[i % zones.length];
  return {x: z[0] + hash(i * 1.7) * (z[1] - z[0]), y: G - 14 - hash(i * 2.9) * 60, on: hash(i * 4.1)};
});
