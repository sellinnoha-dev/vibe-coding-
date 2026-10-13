import React from 'react';
import {C} from '../lib/theme';
import {draw} from '../lib/anim';

// Pictogrammes au trait, centrés sur (0, 0), dans une boîte de 120 × 120.
// p : progression du tracé (0 → 1) ; t : temps en images pour les micro-animations.
type IconProps = {p: number; t: number; color?: string};

const sub = (p: number, a: number, b: number) => Math.min(Math.max((p - a) / (b - a), 0), 1);
const L: React.FC<{d: string; p: number; color: string; w?: number; fill?: string}> = ({d, p, color, w = 3.5, fill = 'none'}) => (
  <path d={d} pathLength={1} fill={fill} stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" style={draw(p)} />
);

/** Musées : la pyramide du Louvre. */
export const MuseumIcon: React.FC<IconProps> = ({p, t, color = C.cream}) => {
  const shine = ((t % 120) / 120) * 160 - 80;
  return (
    <g>
      <defs>
        <clipPath id="pyr">
          <path d="M-50,40 L0,-45 L50,40 Z" />
        </clipPath>
      </defs>
      <g clipPath="url(#pyr)" opacity={sub(p, 0.8, 1)}>
        <rect x={shine} y={-60} width={14} height={120} fill={C.goldLight} opacity={0.35} transform="skewX(-25)" />
      </g>
      <L d="M-50,40 L0,-45 L50,40 Z" p={sub(p, 0, 0.5)} color={color} />
      <L d="M0,-45 L-17,40 M0,-45 L17,40 M-31,8 L31,8 M-17,-17 L17,-17" p={sub(p, 0.4, 0.9)} color={color} w={2} />
      <L d="M-62,40 L62,40" p={sub(p, 0.3, 0.7)} color={C.gold} />
    </g>
  );
};

/** Cafés : une tasse fumante. */
export const CafeIcon: React.FC<IconProps> = ({p, t, color = C.cream}) => (
  <g transform="translate(0 6)">
    <L d="M-34,-12 L-30,26 Q-28,36 -18,36 L14,36 Q24,36 26,26 L30,-12 Z" p={sub(p, 0, 0.5)} color={color} />
    <L d="M30,-2 Q48,-4 46,10 Q44,22 27,21" p={sub(p, 0.3, 0.7)} color={color} />
    <L d="M-46,44 Q0,52 42,44" p={sub(p, 0.4, 0.8)} color={C.gold} />
    {[-16, 0, 16].map((x, i) => (
      <path
        key={i}
        d={`M${x},-22 q-7,-9 0,-18 q7,-9 0,-18`}
        fill="none"
        stroke={C.goldLight}
        strokeWidth={2.6}
        strokeLinecap="round"
        opacity={sub(p, 0.7, 1) * (0.45 + 0.4 * Math.sin(t / 9 + i * 1.7))}
        transform={`translate(0 ${-((t / 2 + i * 6) % 6)})`}
      />
    ))}
  </g>
);

/** Librairies : un livre ouvert dont une page se tourne. */
export const BookIcon: React.FC<IconProps> = ({p, t, color = C.cream}) => {
  const flip = Math.cos(Math.min(Math.max((t - 40) / 30, 0), 1) * Math.PI);
  return (
    <g transform="translate(0 4)">
      <L d="M0,-30 Q-25,-42 -55,-35 L-55,35 Q-25,28 0,40 Z" p={sub(p, 0, 0.5)} color={color} />
      <L d="M0,-30 Q25,-42 55,-35 L55,35 Q25,28 0,40 Z" p={sub(p, 0.1, 0.6)} color={color} />
      <L d="M-44,-18 L-12,-14 M-44,-4 L-12,0 M-44,10 L-12,14 M12,-14 L44,-18 M12,0 L44,-4" p={sub(p, 0.5, 0.9)} color={C.gold} w={2} />
      {p > 0.9 && (
        <path
          d="M0,-30 Q25,-42 52,-36 L52,34 Q25,27 0,40 Z"
          fill={C.nightSoft}
          stroke={color}
          strokeWidth={2.4}
          transform={`scale(${flip} 1)`}
          opacity={Math.abs(flip) > 0.04 ? 1 : 0}
        />
      )}
    </g>
  );
};

/** Art : une palette de peintre et son pinceau. */
export const ArtIcon: React.FC<IconProps> = ({p, t, color = C.cream}) => {
  const dots: [number, number, string][] = [
    [-30, -10, C.red],
    [-14, -30, C.gold],
    [10, -32, C.white],
    [32, -14, C.goldLight],
  ];
  return (
    <g>
      <L
        d="M-10,-45 C30,-48 58,-20 55,8 C52,30 30,28 22,38 C14,48 -5,50 -25,42 C-52,30 -58,-5 -45,-28 C-38,-40 -25,-44 -10,-45 Z"
        p={sub(p, 0, 0.55)}
        color={color}
      />
      <L d="M2,22 a8,8 0 1 0 16,0 a8,8 0 1 0 -16,0" p={sub(p, 0.4, 0.7)} color={color} w={2.6} />
      {dots.map(([x, y, c], i) => {
        const s = sub(p, 0.55 + i * 0.08, 0.75 + i * 0.08);
        return <circle key={i} cx={x} cy={y} r={7 * s * (1 + 0.06 * Math.sin(t / 8 + i))} fill={c} />;
      })}
      <g transform={`rotate(${Math.sin(t / 14) * 4} 40 40)`}>
        <L d="M34,52 L62,8" p={sub(p, 0.6, 0.9)} color={C.gold} w={4} />
      </g>
    </g>
  );
};

/** Spectacles : une scène de théâtre dont le rideau rouge s'ouvre. */
export const StageIcon: React.FC<IconProps> = ({p, t, color = C.cream}) => {
  const open = Math.min(Math.max((t - 20) / 40, 0), 1);
  const w = 46 - 26 * (open * open * (3 - 2 * open));
  return (
    <g transform="translate(0 4)">
      <g opacity={sub(p, 0.5, 0.8)}>
        <path d={`M-52,-36 Q${-52 + w * 0.6},-30 ${-52 + w},44 L-52,44 Z`} fill={C.red} />
        <path d={`M52,-36 Q${52 - w * 0.6},-30 ${52 - w},44 L52,44 Z`} fill={C.red} />
        <path d="M0,-6 l4,9 10,1 -8,6 3,10 -9,-6 -9,6 3,-10 -8,-6 10,-1 Z" fill={C.goldLight} opacity={open} />
      </g>
      <L d="M-55,46 L-55,-32 Q0,-62 55,-32 L55,46" p={sub(p, 0, 0.6)} color={color} />
      <L d="M-64,46 L64,46" p={sub(p, 0.3, 0.7)} color={C.gold} />
    </g>
  );
};

export const CULTURE = [
  {label: 'Musées', Icon: MuseumIcon},
  {label: 'Cafés', Icon: CafeIcon},
  {label: 'Librairies', Icon: BookIcon},
  {label: 'Art', Icon: ArtIcon},
  {label: 'Spectacles', Icon: StageIcon},
];
