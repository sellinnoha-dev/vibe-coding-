import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C} from '../lib/theme';
import {colorAt, easeInOut, hash, lerp, prog, tween} from '../lib/anim';
import {Barge, Building, BUILDING_W, CORNICE_Y, FLOOR_Y, Lamp, TourBoat, Tree, Walkers, windowRect} from '../components/City';
import {EiffelTower} from '../components/EiffelTower';
import {ARC_LINES_Y} from '../components/ArcDeTriomphe';
import {SceneHeading} from '../components/Text';
import {ARC_TOP, S2, s2ToScreen} from './S2Monuments';

// Scènes 3 (17 → 29 s, la beauté de la ville) et 4 (29 → 41 s, l'ambiance du soir) :
// un même décor continu qui passe doucement du jour à la nuit.

export const CITY = {
  ground: 790,
  bs: 0.9, // échelle des immeubles
  quayTop: 840,
  river: 890,
  buildings: [-80, 235, 550, 865, 1420, 1735, 2050],
  lamps: [150, 560, 970, 1380, 1790, 2200],
  eiffel: {cx: 1300, scale: 0.44},
};

/** Caméra simulée de la ville : plan serré sur les façades, recul vers les quais, lent travelling. */
export const cityCam = (f: number) => {
  const back = prog(f, 640, 750);
  const push = prog(f, 1195, 1262, easeInOut);
  const pan = tween(f, [480, 1240], [0, 260]);
  return {
    s: lerp(1.16, 1, back) * lerp(1, 1.14, push),
    cx: 960 + pan,
    cy: lerp(520, 540, back),
  };
};
export const cityToScreen = (x: number, y: number, f: number) => {
  const c = cityCam(f);
  return {x: 960 + (x - c.cx) * c.s, y: 540 + (y - c.cy) * c.s, s: c.s};
};

/** Couleurs du ciel : crème (jour) → coucher de soleil → crépuscule → nuit. */
export const skyColors = (f: number) => {
  const t = prog(f, 880, 1050, (x) => x);
  return {
    top: colorAt(t, [0, 0.35, 0.65, 1], [C.cream, '#E3A27E', '#3A4A7A', C.night]),
    bottom: colorAt(t, [0, 0.35, 0.65, 1], ['#F8F1E6', '#F3C98E', '#9B7393', '#1C305A']),
  };
};
export const nightAt = (f: number) => prog(f, 895, 1035);
export const lightAt = (f: number) => prog(f, 985, 1120, (x) => x);

/** Lignes de transition : les corniches de l'Arc s'étirent et deviennent les étages des immeubles. */
const TransitionLines: React.FC<{f: number}> = ({f}) => {
  if (f < 450 || f > 560) return null;
  const targets = [CORNICE_Y, FLOOR_Y(5), FLOOR_Y(4), FLOOR_Y(3), FLOOR_Y(2), FLOOR_Y(1)].map((y) => CITY.ground + y * CITY.bs);
  const arcYs = [ARC_LINES_Y[0], ARC_LINES_Y[1], ARC_LINES_Y[2], ARC_LINES_Y[3], ARC_LINES_Y[4], ARC_LINES_Y[5]];
  const stretch = prog(f, 450, 490);
  const move = prog(f, 482, 528);
  const fade = 1 - prog(f, 522, 556);
  const arcL = s2ToScreen(S2.arc.left - 8, 0, f).x;
  const arcR = s2ToScreen(S2.arc.left + 458 * S2.arc.scale, 0, f).x;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute'}}>
      {arcYs.map((ay, i) => {
        const from = s2ToScreen(0, ARC_TOP + ay * S2.arc.scale, f).y;
        const to = cityToScreen(0, targets[i], f).y;
        const y = lerp(from, to, move);
        const x1 = lerp(arcL, -40, stretch);
        const x2 = lerp(arcR, 1960, stretch);
        return <line key={i} x1={x1} x2={x2} y1={y} y2={y} stroke={C.navy} strokeWidth={2} opacity={fade * prog(f, 450, 462)} />;
      })}
    </svg>
  );
};

const Reflection: React.FC<{x: number; f: number; on: number; width?: number; color?: string}> = ({x, f, on, width = 36, color = C.goldLight}) => (
  <g opacity={on}>
    {Array.from({length: 7}, (_, i) => {
      const y = CITY.river + 18 + i * 24;
      const w = width * (1 - i * 0.1) * (0.75 + 0.25 * Math.sin(f / 7 + i * 1.9 + x));
      return <rect key={i} x={x - w / 2 + Math.sin(f / 11 + i) * 5} y={y} width={w} height={4} rx={2} fill={color} opacity={0.75 - i * 0.08} />;
    })}
  </g>
);

export const S34City: React.FC = () => {
  const f = useCurrentFrame();
  if (f < 450 || f > 1275) return null;
  const cam = cityCam(f);
  const sky = skyColors(f);
  const n = nightAt(f);
  const light = lightAt(f);
  const drawP = (i: number) => prog(f, 505 + i * 8, 640 + i * 8);
  const winP = (i: number) => prog(f, 560 + i * 6, 660 + i * 6);
  const appear = prog(f, 515, 575);
  const cityOut = prog(f, 1215, 1268);
  const sunY = tween(f, [860, 1010], [250, 820]);
  const stars = prog(f, 990, 1070);
  const eiffelGlow = prog(f, 1010, 1060);

  return (
    <AbsoluteFill style={{opacity: 1 - cityOut}}>
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${sky.top} 0%, ${sky.bottom} 78%)`, opacity: prog(f, 470, 520)}} />
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        <defs>
          <radialGradient id="lampGlow">
            <stop offset="0%" stopColor="#FFE2A3" stopOpacity={0.85} />
            <stop offset="35%" stopColor="#F2C26B" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#F2C26B" stopOpacity={0} />
          </radialGradient>
          <linearGradient id="river" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={colorAt(n, [0, 0.5, 1], [C.river, '#7C6E8E', '#10213F'])} />
            <stop offset="100%" stopColor={colorAt(n, [0, 0.5, 1], ['#7F98B1', '#4A4A6E', '#081428'])} />
          </linearGradient>
        </defs>

        {/* Étoiles */}
        {stars > 0 &&
          Array.from({length: 70}, (_, i) => (
            <circle
              key={i}
              cx={hash(i) * 1920}
              cy={hash(i + 100) * 420}
              r={hash(i + 200) * 1.6 + 0.6}
              fill={C.white}
              opacity={stars * (0.35 + 0.5 * Math.abs(Math.sin(f / 25 + i * 3.3)))}
            />
          ))}

        {/* Soleil qui se couche derrière les immeubles */}
        <g opacity={prog(f, 525, 600) * (1 - prog(f, 990, 1015))}>
          <circle cx={1640} cy={sunY} r={120} fill={colorAt(n, [0, 1], [C.gold, '#E58B57'])} opacity={0.15} />
          <circle cx={1640} cy={sunY} r={66} fill={colorAt(prog(f, 860, 1000), [0, 1], ['#EBC98A', '#E9855A'])} />
        </g>

        <g transform={`translate(960 540) scale(${cam.s}) translate(${-cam.cx} ${-cam.cy})`}>
          {/* Tour Eiffel au loin */}
          <g
            transform={`translate(${CITY.eiffel.cx - 200 * CITY.eiffel.scale} ${CITY.ground - 1000 * CITY.eiffel.scale}) scale(${CITY.eiffel.scale})`}
            opacity={appear * lerp(0.45, 1, eiffelGlow)}
          >
            <EiffelTower
              progress={prog(f, 560, 680)}
              color={colorAt(eiffelGlow, [0, 1], [C.navy, C.gold])}
              fill={colorAt(n, [0, 1], [C.navy, '#0B1A33'])}
              fillOpacity={0.12 + 0.5 * n}
              stroke={3.4}
              glow={eiffelGlow}
              sparkle={prog(f, 1110, 1135) * (1 - prog(f, 1200, 1230))}
              frame={f}
            />
          </g>

          {/* Immeubles haussmanniens */}
          {CITY.buildings.map((x, i) => (
            <g key={i} transform={`translate(${x} ${CITY.ground}) scale(${CITY.bs})`}>
              <Building seed={i + 1} drawP={drawP(i)} windowsP={winP(i)} night={n} light={light} awning={i === 1 || i === 5} frame={f} />
            </g>
          ))}

          {/* Trottoir, arbres, lampadaires */}
          <rect x={-300} y={CITY.ground} width={2800} height={CITY.quayTop - CITY.ground} fill={colorAt(n, [0, 1], ['#E6D9C3', '#0E1C36'])} opacity={appear} />
          {[1235, 1375].map((x, i) => (
            <g key={i} transform={`translate(${x} ${CITY.ground + 6})`}>
              <Tree size={1.05 - i * 0.1} night={n} seed={i + 4} frame={f} appear={prog(f, 600 + i * 10, 640 + i * 10)} />
            </g>
          ))}
          {CITY.lamps.map((x, i) => (
            <g key={i} transform={`translate(${x} ${CITY.quayTop - 4})`}>
              <Lamp night={n} on={prog(f, 975 + i * 6, 995 + i * 6)} appear={prog(f, 600 + i * 8, 630 + i * 8)} />
            </g>
          ))}
          <Walkers frame={f - 600} night={n} groundY={CITY.quayTop - 6} appear={prog(f, 690, 740)} />

          {/* Parapet, boîtes des bouquinistes, mur du quai */}
          <g opacity={appear}>
            {[330, 382, 760, 1520, 1572, 1960].map((x, i) => (
              <g key={i}>
                <rect x={x} y={CITY.quayTop - 20} width={46} height={20} fill={colorAt(n, [0, 1], ['#3B5568', '#0B1830'])} />
                <path d={`M${x - 3},${CITY.quayTop - 20} L${x + 49},${CITY.quayTop - 20} L${x + 43},${CITY.quayTop - 30} L${x + 3},${CITY.quayTop - 30} Z`} fill={colorAt(n, [0, 1], ['#4A6579', '#0D1C36'])} />
              </g>
            ))}
            <rect x={-300} y={CITY.quayTop} width={2800} height={CITY.river - CITY.quayTop} fill={colorAt(n, [0, 1], ['#D9CBB2', '#132442'])} />
            <path
              d={
                `M-300,${CITY.quayTop} L2500,${CITY.quayTop} M-300,${CITY.quayTop + 6} L2500,${CITY.quayTop + 6} ` +
                Array.from({length: 60}, (_, i) => `M${-300 + i * 48 + (i % 2) * 24},${CITY.quayTop + 6} L${-300 + i * 48 + (i % 2) * 24},${CITY.river}`).join(' ') +
                ` M-300,${CITY.quayTop + 28} L2500,${CITY.quayTop + 28}`
              }
              stroke={colorAt(n, [0, 1], ['#B9A88C', '#1E3358'])}
              strokeWidth={1.5}
            />
          </g>

          {/* La Seine */}
          <rect x={-300} y={CITY.river} width={2800} height={400} fill="url(#river)" opacity={appear} />
          {Array.from({length: 26}, (_, i) => {
            const x = ((hash(i) * 2600 + f * (0.6 + hash(i + 9))) % 2600) - 300;
            const y = CITY.river + 22 + hash(i + 50) * 170;
            return <rect key={i} x={x} y={y} width={40 + hash(i + 3) * 60} height={2.5} rx={1.2} fill={C.white} opacity={appear * 0.35 * (1 - n * 0.6)} />;
          })}
          {CITY.lamps.map((x, i) => (
            <Reflection key={i} x={x} f={f} on={prog(f, 985 + i * 6, 1010 + i * 6)} />
          ))}
          {CITY.buildings.map((bx, i) =>
            [0, 2, 4].map((b) => {
              const r = windowRect(3, b);
              return <Reflection key={`${i}-${b}`} x={bx + (r.x + r.w / 2) * CITY.bs} f={f + i * 13} on={light * 0.45} width={18} color="#F5C982" />;
            }),
          )}
          <Reflection x={CITY.eiffel.cx} f={f} on={eiffelGlow * 0.8} width={60} color={C.gold} />

          {/* Bateaux : une péniche le jour, un bateau-mouche illuminé le soir */}
          <g transform={`translate(${tween(f, [560, 1000], [2150, 760], (x) => x)} ${CITY.river + 72})`} opacity={prog(f, 560, 600) * (1 - prog(f, 950, 1000))}>
            <Barge night={n} />
          </g>
          <g transform={`translate(${tween(f, [1030, 1270], [-320, 1000], (x) => x)} ${CITY.river + 96})`} opacity={prog(f, 1030, 1060)}>
            <TourBoat frame={f} />
          </g>
        </g>
      </svg>

      <TransitionLines f={f} />
      <SceneHeading frame={f} start={555} end={885} kicker="02 — L'architecture" lines={['Des façades élégantes', 'et les quais de Seine']} />
      <SceneHeading frame={f} start={958} end={1222} kicker="03 — L'ambiance" lines={['Le soir, quand', "la ville s'illumine"]} color={C.cream} />
    </AbsoluteFill>
  );
};

export const BUILDING_SPAN = BUILDING_W * CITY.bs;
