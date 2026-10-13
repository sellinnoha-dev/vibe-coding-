import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, FONT_TEXT, FONT_TITLE} from '../lib/theme';
import {colorAt, draw, easeOut, hash, lerp, prog} from '../lib/anim';
import {CULTURE} from '../components/Icons';
import {SceneHeading} from '../components/Text';
import {windowRect} from '../components/City';
import {CITY, cityToScreen} from './S34City';

// Scène 5 — 41 à 52 s : la culture et les découvertes.

const TILE = 200;
const tileCenter = (i: number, f: number) => ({x: 432 + i * 264, y: lerp(510, 465, prog(f, 1372, 1412))});
// Dans la conclusion, les tuiles deviennent une petite frise sous le texte final.
const MINI = 60;
const miniCenter = (i: number) => ({x: 170 + i * 82, y: 664});

/** Choisit une fenêtre allumée par immeuble visible : elle deviendra une tuile. */
const SOURCE_WINDOWS = (() => {
  const picked: {b: number; floor: number; bay: number}[] = [];
  for (const b of [0, 1, 2, 3, 4]) {
    const seed = b + 1;
    outer: for (const floor of [3, 2, 4]) {
      for (const bay of [2, 1, 3]) {
        const id = seed * 100 + floor * 10 + bay;
        if (hash(id + 0.5) < 0.68) {
          picked.push({b, floor, bay});
          break outer;
        }
      }
    }
  }
  return picked;
})();

const windowScreen = (i: number, f: number) => {
  const w = SOURCE_WINDOWS[i];
  const r = windowRect(w.floor, w.bay);
  const bx = CITY.buildings[w.b];
  const tl = cityToScreen(bx + r.x * CITY.bs, CITY.ground + r.y * CITY.bs, f);
  const br = cityToScreen(bx + (r.x + r.w) * CITY.bs, CITY.ground + (r.y + r.h) * CITY.bs, f);
  return {x: (tl.x + br.x) / 2, y: (tl.y + br.y) / 2, w: br.x - tl.x, h: br.y - tl.y};
};

const STATIONS = ['Montmartre', 'Le Marais', 'Saint-Germain', 'Quartier latin', 'Belleville'];
const METRO = {y: 820, x1: 300, x2: 1640};

/** Fond, titre et ligne de métro des quartiers. */
export const S5Culture: React.FC = () => {
  const f = useCurrentFrame();
  if (f < 1210 || f > 1610) return null;
  const bg = prog(f, 1215, 1268);
  const lineP = prog(f, 1388, 1455);
  // La ligne de métro devient l'horizon du panorama final.
  const toHorizon = prog(f, 1530, 1592);
  const y = lerp(METRO.y, 930, toHorizon);
  const x1 = lerp(METRO.x1, -20, toHorizon);
  const x2 = lerp(METRO.x2, 1940, toHorizon);
  const stationsOut = prog(f, 1512, 1538);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 45%, #18305A 0%, ${C.night} 72%)`, opacity: bg}} />
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        <g opacity={(1 - stationsOut) * prog(f, 1385, 1400)}>
          <circle cx={238} cy={METRO.y} r={26} fill="none" stroke={C.cream} strokeWidth={2.5} />
        </g>
        <path
          d={`M${x1},${y} L${x2},${y}`}
          pathLength={1}
          stroke={colorAt(toHorizon, [0, 1], [C.red, C.gold])}
          strokeWidth={lerp(12, 2, toHorizon)}
          strokeLinecap="round"
          style={draw(lineP)}
          opacity={1 - prog(f, 1592, 1608)}
        />
        {STATIONS.map((_, i) => {
          const x = 380 + i * 290;
          const on = prog(f, 1392 + i * 11, 1408 + i * 11, easeOut);
          return <circle key={i} cx={x} cy={METRO.y} r={13 * on} fill={C.white} stroke={C.night} strokeWidth={4} opacity={1 - stationsOut} />;
        })}
      </svg>
      <div style={{position: 'absolute', left: 238, top: METRO.y, transform: 'translate(-50%, -50%)', fontFamily: FONT_TEXT, fontWeight: 600, fontSize: 28, color: C.cream, opacity: (1 - stationsOut) * prog(f, 1385, 1400)}}>
        M
      </div>
      <div
        style={{
          position: 'absolute',
          left: 300,
          top: METRO.y - 72,
          fontFamily: FONT_TEXT,
          fontWeight: 600,
          fontSize: 21,
          letterSpacing: 5,
          color: C.gold,
          opacity: prog(f, 1400, 1425) * (1 - stationsOut),
        }}
      >
        CHAQUE QUARTIER A SON CARACTÈRE
      </div>
      {STATIONS.map((name, i) => {
        const p = prog(f, 1398 + i * 11, 1422 + i * 11, easeOut);
        return (
          <div
            key={name}
            style={{
              position: 'absolute',
              left: 380 + i * 290,
              top: METRO.y + 30,
              transform: `translate(-50%, ${(1 - p) * 10}px)`,
              fontFamily: FONT_TITLE,
              fontStyle: 'italic',
              fontSize: 31,
              color: C.cream,
              whiteSpace: 'nowrap',
              opacity: p * (1 - stationsOut),
            }}
          >
            {name}
          </div>
        );
      })}
      <SceneHeading frame={f} start={1248} end={1540} kicker="04 — La culture" lines={['Toujours quelque chose', 'à découvrir']} color={C.cream} />
    </AbsoluteFill>
  );
};

/** Tuiles culturelles : fenêtres allumées → tuiles → petite frise finale. */
export const CultureTiles: React.FC = () => {
  const f = useCurrentFrame();
  if (f < 1200) return null;
  const morph = prog(f, 1215, 1282);
  const shrink = prog(f, 1528, 1592);
  return (
    <AbsoluteFill style={{opacity: prog(f, 1200, 1212)}}>
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        {CULTURE.map(({Icon}, i) => {
          const src = windowScreen(i, Math.min(f, 1268));
          const big = tileCenter(i, f);
          const mini = miniCenter(i);
          const cx = lerp(lerp(src.x, big.x, morph), mini.x, shrink);
          const cy = lerp(lerp(src.y, big.y, morph), mini.y, shrink);
          const w = lerp(lerp(src.w, TILE, morph), MINI, shrink);
          const h = lerp(lerp(src.h, TILE, morph), MINI, shrink);
          const rx = lerp(lerp(0, 30, morph), 12, shrink);
          const fill = colorAt(prog(f, 1225, 1280), [0, 1], [C.goldLight, C.nightSoft]);
          const iconP = prog(f, 1262 + i * 7, 1318 + i * 7);
          const iconScale = (w / TILE) * 1.12;
          return (
            <g key={i}>
              <rect x={cx - w / 2 - 14} y={cy - h / 2 - 14} width={w + 28} height={h + 28} rx={rx + 10} fill={C.gold} opacity={0.18 * (1 - morph) + 0.06} />
              <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx={rx} fill={fill} stroke={C.gold} strokeWidth={lerp(0, 2, morph)} />
              <g transform={`translate(${cx} ${cy}) scale(${iconScale})`}>
                <Icon p={iconP} t={Math.max(0, f - 1290 - i * 9)} color={C.cream} />
              </g>
            </g>
          );
        })}
      </svg>
      {CULTURE.map(({label}, i) => {
        const c = tileCenter(i, f);
        const p = prog(f, 1292 + i * 7, 1316 + i * 7, easeOut);
        return (
          <div
            key={label}
            style={{
              position: 'absolute',
              left: c.x,
              top: c.y + TILE / 2 + 22,
              transform: `translate(-50%, ${(1 - p) * 12}px)`,
              fontFamily: FONT_TEXT,
              fontWeight: 600,
              fontSize: 23,
              letterSpacing: 4,
              textTransform: 'uppercase',
              color: C.cream,
              opacity: p * (1 - prog(f, 1505, 1530)),
            }}
          >
            {label}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
