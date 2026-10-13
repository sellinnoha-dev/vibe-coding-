import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, FONT_TITLE} from '../lib/theme';
import {easeOut, hash, prog, tween} from '../lib/anim';
import {EiffelTower} from '../components/EiffelTower';
import {SKYLINE, SKYLINE_WINDOWS} from '../components/Skyline';

// Scène 6 — 52 à 60 s : conclusion, Paris de nuit avec la tour Eiffel illuminée.
const G = 930;
const TOWER = {cx: 1350, scale: 0.7};

const Line: React.FC<{f: number; start: number; children: React.ReactNode; style: React.CSSProperties}> = ({f, start, children, style}) => {
  const p = prog(f, start, start + 30, easeOut);
  return (
    <div style={{overflow: 'hidden', paddingBottom: 12}}>
      <div style={{...style, whiteSpace: 'nowrap', transform: `translateY(${(1 - p) * 100}%)`, opacity: Math.min(1, p * 1.5)}}>{children}</div>
    </div>
  );
};

export const S6Finale: React.FC = () => {
  const f = useCurrentFrame();
  if (f < 1525) return null;
  const bg = prog(f, 1530, 1592);
  const rise = prog(f, 1568, 1640);
  const towerP = prog(f, 1572, 1665);
  const glow = prog(f, 1640, 1690);
  const top = G - 1000 * TOWER.scale;
  const beamAngle = tween(f, [1660, 1800], [-62, 18], (x) => x);
  const beam = prog(f, 1665, 1700);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${C.night} 0%, #13274B 70%, #1E3561 100%)`, opacity: bg}} />
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        <defs>
          <linearGradient id="beam" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor={C.goldLight} stopOpacity={0.45} />
            <stop offset="100%" stopColor={C.goldLight} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="seineNight" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#12264A" />
            <stop offset="100%" stopColor="#070F22" />
          </linearGradient>
          <clipPath id="aboveHorizon">
            <rect x={0} y={0} width={1920} height={G} />
          </clipPath>
        </defs>

        {/* Étoiles */}
        {Array.from({length: 90}, (_, i) => (
          <circle
            key={i}
            cx={hash(i * 1.3) * 1920}
            cy={hash(i * 2.1 + 5) * 640}
            r={hash(i + 7) * 1.7 + 0.5}
            fill={C.white}
            opacity={prog(f, 1555 + (i % 10) * 4, 1600 + (i % 10) * 4) * (0.3 + 0.55 * Math.abs(Math.sin(f / 22 + i * 2.7)))}
          />
        ))}

        {/* Faisceau du phare de la tour */}
        <g opacity={beam * 0.7} transform={`translate(${TOWER.cx} ${top + 28}) rotate(${beamAngle})`}>
          <path d="M0,0 L1500,-70 L1500,70 Z" fill="url(#beam)" />
        </g>

        {/* Silhouette de la ville qui s'élève depuis l'horizon */}
        <g clipPath="url(#aboveHorizon)">
          <g transform={`translate(0 ${(1 - rise) * 190})`}>
            <path d={SKYLINE} fill="#0A1630" />
            {SKYLINE_WINDOWS.map((w, i) => (
              <rect key={i} x={w.x} y={w.y} width={5} height={7} fill={C.goldLight} opacity={prog(f, 1610 + w.on * 60, 1630 + w.on * 60) * 0.85} />
            ))}
          </g>
        </g>

        {/* La Seine et ses reflets */}
        <rect x={0} y={G} width={1920} height={150} fill="url(#seineNight)" opacity={prog(f, 1575, 1625)} />
        {Array.from({length: 7}, (_, i) => {
          const w = (110 - i * 12) * (0.75 + 0.25 * Math.sin(f / 8 + i * 1.7));
          return <rect key={i} x={TOWER.cx - w / 2 + Math.sin(f / 12 + i) * 6} y={G + 14 + i * 19} width={w} height={4} rx={2} fill={C.gold} opacity={glow * (0.7 - i * 0.08)} />;
        })}
        {Array.from({length: 26}, (_, i) => {
          const x = hash(i * 3.3) * 1920;
          if (Math.abs(x - TOWER.cx) < 90) return null;
          return <rect key={i} x={x + Math.sin(f / 10 + i) * 4} y={G + 16 + hash(i * 5.1) * 110} width={14 + hash(i) * 26} height={3} rx={1.5} fill={C.goldLight} opacity={prog(f, 1630, 1680) * 0.4} />;
        })}

        {/* La tour Eiffel illuminée */}
        <g transform={`translate(${TOWER.cx - 200 * TOWER.scale} ${top}) scale(${TOWER.scale})`}>
          <EiffelTower progress={towerP} color={C.gold} fill="#0A1630" fillOpacity={0.9 * prog(f, 1600, 1650)} stroke={3.4} glow={glow} sparkle={prog(f, 1705, 1720)} frame={f} />
        </g>
      </svg>

      {/* Message final */}
      <div style={{position: 'absolute', left: 140, top: 268}}>
        <Line f={f} start={1598} style={{fontFamily: FONT_TITLE, fontWeight: 600, fontSize: 82, lineHeight: 1.1, color: C.cream}}>
          Paris, bien plus
        </Line>
        <Line f={f} start={1608} style={{fontFamily: FONT_TITLE, fontWeight: 600, fontSize: 82, lineHeight: 1.1, color: C.cream}}>
          qu’une ville&nbsp;:
        </Line>
        <Line f={f} start={1632} style={{fontFamily: FONT_TITLE, fontStyle: 'italic', fontSize: 88, lineHeight: 1.15, color: C.goldLight}}>
          une atmosphère unique.
        </Line>
      </div>
    </AbsoluteFill>
  );
};
