import React from 'react';
import {draw} from '../lib/anim';

// Arc de Triomphe vectoriel — repère local : largeur 450, hauteur 500, base à y = 500.
// Les lignes horizontales (corniches) sont exportées pour la transition vers la scène 3.
export const ARC_LINES_Y = [-6, 60, 80, 105, 250, 440];

type Part = {d: string; level: number; w?: number};

const relief = (x: number, y: number, w: number, h: number) =>
  `M${x},${y} L${x + w},${y} L${x + w},${y + h} L${x},${y + h} Z ` +
  `M${x + w * 0.3},${y + h * 0.85} Q${x + w * 0.35},${y + h * 0.4} ${x + w * 0.5},${y + h * 0.25} ` +
  `M${x + w * 0.5},${y + h * 0.25} Q${x + w * 0.68},${y + h * 0.45} ${x + w * 0.72},${y + h * 0.85} ` +
  `M${x + w * 0.38},${y + h * 0.5} L${x + w * 0.64},${y + h * 0.42}`;

const parts: Part[] = [
  {d: 'M0,500 L0,80 M450,80 L450,500', level: 0, w: 1.4},
  {d: 'M-14,500 L464,500', level: 0, w: 1.2},
  {d: 'M150,500 L150,250 A75,75 0 0 1 300,250 L300,500', level: 0.1, w: 1.4},
  {d: 'M136,250 A89,89 0 0 1 314,250', level: 0.25, w: 0.9},
  {d: 'M0,250 L136,250 M314,250 L450,250 M0,262 L138,262 M312,262 L450,262', level: 0.3, w: 0.9},
  {d: 'M0,440 L150,440 M300,440 L450,440', level: 0.05, w: 0.8},
  {d: relief(28, 290, 84, 135), level: 0.2, w: 0.7},
  {d: relief(338, 290, 84, 135), level: 0.2, w: 0.7},
  {d: relief(28, 128, 84, 105), level: 0.45, w: 0.7},
  {d: relief(338, 128, 84, 105), level: 0.45, w: 0.7},
  {d: 'M215,160 L235,160 L235,182 L215,182 Z', level: 0.5, w: 0.8},
  {d: 'M160,190 Q185,150 214,166 M236,166 Q265,150 290,190', level: 0.5, w: 0.7},
  {d: 'M-10,105 L460,105 M-10,80 L460,80 M-10,60 L460,60 L460,80 M-10,60 L-10,80', level: 0.6, w: 1.1},
  {d: Array.from({length: 30}, (_, i) => `M${4 + i * 15},86 L${4 + i * 15},99`).join(' '), level: 0.65, w: 0.5},
  {d: 'M5,60 L5,0 L445,0 L445,60 M-6,-6 L456,-6 L456,0 L-6,0 Z', level: 0.75, w: 1.1},
  {
    d: Array.from({length: 9}, (_, i) => {
      const cx = 45 + i * 45;
      return `M${cx - 9},30 A9,9 0 1 0 ${cx + 9},30 A9,9 0 1 0 ${cx - 9},30`;
    }).join(' '),
    level: 0.85,
    w: 0.7,
  },
];

export const ArcDeTriomphe: React.FC<{
  progress?: number;
  color?: string;
  fill?: string;
  fillOpacity?: number;
  stroke?: number;
}> = ({progress = 1, color = '#1B2D52', fill = '#1B2D52', fillOpacity = 0, stroke = 2.4}) => {
  const partP = (level: number) => Math.min(Math.max((progress - level * 0.7) / 0.3, 0), 1);
  return (
    <g>
      <path
        d="M-10,500 L-10,60 L-6,60 L-6,-6 L456,-6 L456,60 L460,60 L460,500 L300,500 L300,250 A75,75 0 0 0 150,250 L150,500 Z"
        fill={fill}
        opacity={fillOpacity}
      />
      {parts.map((p, i) => (
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
      ))}
    </g>
  );
};
