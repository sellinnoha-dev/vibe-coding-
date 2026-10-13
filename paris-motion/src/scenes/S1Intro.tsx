import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, FONT_TEXT, FONT_TITLE} from '../lib/theme';
import {draw, easeOut, lerp, prog, tween} from '../lib/anim';
import {CORSICA_PATH, FRANCE_PATH, FRANCE_SIZE, PARIS, SEINE_PATH} from '../components/FranceMap';
import {EiffelTower} from '../components/EiffelTower';

// Scène 1 — 0 à 6 s : titre, silhouette de la tour Eiffel, carte de France qui se rapproche de Paris.
export const MAP_SCALE = 0.74;
const MAP_CENTER = {x: 1370, y: 540};
export const ZOOM = {from: 96, to: 168};
export const PARIS_START = {
  x: MAP_CENTER.x + (PARIS[0] - FRANCE_SIZE.w / 2) * MAP_SCALE,
  y: MAP_CENTER.y + (PARIS[1] - FRANCE_SIZE.h / 2) * MAP_SCALE,
};

export const S1Intro: React.FC = () => {
  const f = useCurrentFrame();
  if (f > 200) return null; // couvert par la scène 2 dès 6,4 s
  const zoom = prog(f, ZOOM.from, ZOOM.to);
  const sc = MAP_SCALE * Math.pow(7, zoom);
  const px = lerp(PARIS_START.x, 960, zoom);
  const py = lerp(PARIS_START.y, 540, zoom);
  const mapDraw = prog(f, 8, 70);
  const titleOut = prog(f, 112, 150);
  const pulse = (f % 45) / 45;

  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 68% 50%, ${C.nightSoft} 0%, ${C.night} 70%)`}}>
      {/* Carte de France */}
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        <g transform={`translate(${px} ${py}) scale(${sc}) translate(${-PARIS[0]} ${-PARIS[1]})`}>
          <path d={FRANCE_PATH} fill={C.nightLine} fillOpacity={0.55 * prog(f, 40, 80)} />
          <path d={CORSICA_PATH} fill={C.nightLine} fillOpacity={0.55 * prog(f, 40, 80)} />
          <path d={FRANCE_PATH} pathLength={1} fill="none" stroke={C.cream} strokeWidth={2.2} vectorEffect="non-scaling-stroke" strokeLinejoin="round" style={draw(mapDraw)} />
          <path d={CORSICA_PATH} pathLength={1} fill="none" stroke={C.cream} strokeWidth={2.2} vectorEffect="non-scaling-stroke" style={draw(prog(f, 50, 75))} />
          <path d={SEINE_PATH} pathLength={1} fill="none" stroke="#5F7FAF" strokeWidth={2} vectorEffect="non-scaling-stroke" strokeLinecap="round" style={draw(prog(f, 55, 90))} />
        </g>
        {/* Point de Paris (taille constante à l'écran) */}
        <g transform={`translate(${px} ${py})`} opacity={prog(f, 50, 66)}>
          <circle r={14 + 40 * pulse} fill="none" stroke={C.gold} strokeWidth={2} opacity={(1 - pulse) * 0.8 * (1 - zoom)} />
          <circle r={14 * prog(f, 50, 66, easeOut)} fill={C.gold} />
        </g>
      </svg>

      {/* Libellé « Paris » sur la carte */}
      <div
        style={{
          position: 'absolute',
          left: px + 28,
          top: py - 22,
          fontFamily: FONT_TEXT,
          fontWeight: 600,
          fontSize: 26,
          letterSpacing: 4,
          color: C.cream,
          opacity: prog(f, 62, 80) * (1 - prog(f, ZOOM.from, ZOOM.from + 25)),
          transform: `translateX(${tween(f, [62, 84], [-10, 0], easeOut)}px)`,
        }}
      >
        PARIS
      </div>

      {/* Bloc titre */}
      <div style={{position: 'absolute', left: 150, top: 210, opacity: 1 - titleOut, transform: `translateX(${-40 * titleOut}px)`}}>
        <svg width={120} height={280} style={{display: 'block', marginLeft: -8}}>
          <g transform="translate(0 6) scale(0.27)">
            <EiffelTower progress={prog(f, 4, 58)} color={C.gold} stroke={3.6} />
          </g>
        </svg>
        <div style={{overflow: 'hidden', marginTop: 18}}>
          <div
            style={{
              fontFamily: FONT_TITLE,
              fontWeight: 700,
              fontSize: 150,
              lineHeight: 1,
              color: C.cream,
              transform: `translateY(${(1 - prog(f, 22, 54, easeOut)) * 105}%)`,
            }}
          >
            Paris,
          </div>
        </div>
        <div style={{overflow: 'hidden', marginTop: 8}}>
          <div
            style={{
              fontFamily: FONT_TITLE,
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: 60,
              color: C.goldLight,
              paddingBottom: 10,
              transform: `translateY(${(1 - prog(f, 40, 70, easeOut)) * 105}%)`,
            }}
          >
            une ville qui me fait rêver
          </div>
        </div>
        <div style={{width: 120 * prog(f, 58, 86, easeOut), height: 2, background: C.red, marginTop: 22}} />
      </div>
    </AbsoluteFill>
  );
};
