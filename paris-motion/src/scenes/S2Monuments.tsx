import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C} from '../lib/theme';
import {draw, easeIn, lerp, prog, tween} from '../lib/anim';
import {EiffelTower} from '../components/EiffelTower';
import {ArcDeTriomphe} from '../components/ArcDeTriomphe';
import {Tree} from '../components/City';
import {Label, SceneHeading} from '../components/Text';

// Scène 2 — 6 à 17 s : la tour Eiffel puis l'Arc de Triomphe.
export const S2 = {
  ground: 930,
  eiffel: {cx: 800, scale: 0.64},
  arc: {left: 1150, scale: 0.72},
  sun: {x: 1010, y: 440, r: 105},
};
export const ARC_TOP = S2.ground - 500 * S2.arc.scale;

/** Caméra simulée : zoom serré sur la tour, puis travelling arrière qui révèle l'Arc. */
export const s2Cam = (f: number) => {
  const k = prog(f, 300, 405);
  const push = lerp(1.3, 1.36, prog(f, 180, 300, (t) => t));
  return {s: lerp(push, 1, k), cx: lerp(800, 960, k), cy: lerp(600, 540, k)};
};
export const s2ToScreen = (x: number, y: number, f: number) => {
  const c = s2Cam(f);
  return {x: 960 + (x - c.cx) * c.s, y: 540 + (y - c.cy) * c.s, s: c.s};
};

const farRoofs = (() => {
  let d = `M-300,${S2.ground}`;
  let x = -300;
  let i = 0;
  while (x < 2300) {
    const w = 120 + ((i * 53) % 70);
    const h = 42 + ((i * 37) % 30);
    d += ` L${x},${S2.ground - h} L${x + 14},${S2.ground - h - 22} L${x + w - 14},${S2.ground - h - 22} L${x + w},${S2.ground - h}`;
    x += w;
    i++;
  }
  return d + ` L${x},${S2.ground} Z`;
})();

export const S2Monuments: React.FC = () => {
  const f = useCurrentFrame();
  if (f < 148 || f > 545) return null;
  const cam = s2Cam(f);
  const iris = tween(f, [148, 192], [0, 1150], easeIn);
  const monumentsOut = prog(f, 468, 508);

  // Le point doré de Paris (scène 1) devient le soleil derrière la tour.
  const sunWorld = s2ToScreen(S2.sun.x, S2.sun.y, f);
  const m = prog(f, 162, 222);
  const sunX = lerp(960, sunWorld.x, m);
  const sunY = lerp(540, sunWorld.y, m);
  const sunR = lerp(14, S2.sun.r * sunWorld.s, m);
  const sunCol = m < 1 ? C.gold : '#EBC98A';

  const eiffelLeft = S2.eiffel.cx - 200 * S2.eiffel.scale;
  const eiffelTop = S2.ground - 1000 * S2.eiffel.scale;

  return (
    <AbsoluteFill style={{clipPath: f < 192 ? `circle(${iris}px at 960px 540px)` : undefined}}>
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${C.cream} 0%, #F8F1E6 100%)`}} />
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        <circle cx={sunX} cy={sunY} r={sunR * 1.7} fill={C.gold} opacity={0.12 * m * (1 - monumentsOut)} />
        <circle cx={sunX} cy={sunY} r={sunR} fill={sunCol} opacity={1 - monumentsOut * 0.6} />
        <g transform={`translate(960 540) scale(${cam.s}) translate(${-cam.cx} ${-cam.cy})`}>
          <g opacity={1 - monumentsOut}>
            <path d={farRoofs} fill={C.creamDeep} opacity={0.75 * prog(f, 200, 260)} />
            <rect x={-400} y={S2.ground} width={2800} height={300} fill="#EDE2CF" opacity={prog(f, 190, 230)} />
            <path d={`M-400,${S2.ground} L2400,${S2.ground}`} pathLength={1} stroke={C.navy} strokeWidth={2} style={draw(prog(f, 188, 240))} />
            <g transform={`translate(${eiffelLeft} ${eiffelTop}) scale(${S2.eiffel.scale})`}>
              <EiffelTower progress={prog(f, 192, 292)} color={C.navy} fill={C.navy} fillOpacity={0.07 * prog(f, 250, 300)} stroke={3.2} />
            </g>
            <g transform={`translate(${S2.arc.left} ${ARC_TOP}) scale(${S2.arc.scale})`}>
              <ArcDeTriomphe progress={prog(f, 322, 410)} color={C.navy} fill={C.navy} fillOpacity={0.07 * prog(f, 380, 420)} stroke={2.6} />
            </g>
            {[
              [590, 0.9, 230],
              [1010, 1, 245],
              [1095, 0.75, 345],
              [1560, 0.95, 390],
              [1680, 0.8, 400],
            ].map(([x, size, start], i) => (
              <g key={i} transform={`translate(${x} ${S2.ground})`}>
                <Tree size={size} night={0} seed={i} frame={f} appear={prog(f, start, start + 30)} />
              </g>
            ))}
          </g>
        </g>
      </svg>

      <SceneHeading frame={f} start={205} end={500} kicker="01 — Les monuments" lines={['Des monuments qui', 'rendent Paris unique']} />
      <Label
        frame={f}
        start={262}
        end={372}
        {...(() => {
          const p = s2ToScreen(885, 700, f);
          return {x: p.x, y: p.y};
        })()}
        title="La tour Eiffel"
        sub="1889 · 330 MÈTRES"
      />
      <Label
        frame={f}
        start={400}
        end={480}
        {...(() => {
          const p = s2ToScreen(S2.arc.left + 450 * S2.arc.scale, ARC_TOP + 40, f);
          return {x: p.x, y: p.y};
        })()}
        title="L'Arc de Triomphe"
        sub="1836 · 50 MÈTRES"
        lineLen={40}
      />
    </AbsoluteFill>
  );
};
