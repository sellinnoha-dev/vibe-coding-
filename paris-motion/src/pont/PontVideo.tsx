import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {C, FONT_TEXT, FONT_TITLE} from '../lib/theme';
import {colorAt, easeIn, easeOut, hash, lerp, prog, tween} from '../lib/anim';
import {musicVolume} from '../lib/audio';
import {Label, SceneHeading} from '../components/Text';
import {EiffelTower} from '../components/EiffelTower';
import {Barge, Lamp, Walkers} from '../components/City';
import {archX, Banks, BigLock, BR, Bridge, HEART, Key, MiniLock, PANEL_W, polyline, Railing, shacklePoints} from './elements';

// « Le pont des Arts » — 60 s, 1800 images. Même découpage que la vidéo sur Paris :
// 0-6 s intro · 6-17 s naissance · 17-29 s chute et renaissance · 29-41 s cadenas · 41-52 s le poids · 52-60 s aujourd'hui

export type PontProps = {musique: boolean; baisserMusiquePourVoix: boolean};

// ---------------------------------------------------------------- Caméra simulée
export const pontCam = (f: number) => {
  const sA = lerp(1.08, 1, prog(f, 180, 500));
  const zin = prog(f, 880, 995);
  const sB = lerp(sA, 2.8, zin) + 0.12 * prog(f, 995, 1230) - 0.45 * prog(f, 1235, 1520);
  const zout = prog(f, 1540, 1660);
  return {
    s: lerp(sB, 1, zout),
    cx: lerp(960 + 40 * prog(f, 995, 1230) - 40 * prog(f, 1235, 1520), 960, zout),
    cy: lerp(lerp(540, 600, zin), 540, zout),
  };
};
const toScreen = (x: number, y: number, f: number) => {
  const c = pontCam(f);
  return {x: 960 + (x - c.cx) * c.s, y: 540 + (y - c.cy) * c.s};
};

// ---------------------------------------------------------------- Ciel : jour → heure dorée → nuit
const sky = (f: number) => {
  const keys = [880, 1000, 1200, 1285, 1450, 1600];
  const t = Math.min(Math.max(f, keys[0]), keys[5]);
  return {
    top: colorAt(t, keys, [C.cream, '#EDB58A', '#E39C80', '#7A5578', '#34426F', C.night]),
    bottom: colorAt(t, keys, ['#F8F1E6', '#F7D9A0', '#F2C18E', '#C98A88', '#8A6A8F', '#1C305A']),
  };
};

// ---------------------------------------------------------------- Chiffre clé (en haut à droite)
type Stat = {from: number; to: number; big: (f: number) => string; sub: string; color?: string};
const STATS: Stat[] = [
  {from: 228, to: 495, big: (f) => `1801 → ${Math.round(tween(f, [250, 310], [1801, 1804]))}`, sub: 'CONSTRUIT SOUS NAPOLÉON'},
  {from: 645, to: 765, big: () => '1979', sub: 'UNE PÉNICHE HEURTE LE PONT', color: C.red},
  {from: 770, to: 872, big: () => '1984', sub: '7 ARCHES AU LIEU DE 9'},
  {from: 1262, to: 1392, big: (f) => `${Math.round(tween(f, [1268, 1335], [0, 45], easeOut))} tonnes`, sub: "PRÈS D'UN MILLION DE CADENAS", color: C.red},
  {from: 1392, to: 1452, big: () => '2014', sub: 'UN GRILLAGE CÈDE', color: C.red},
  {from: 1452, to: 1540, big: () => '2015', sub: 'CADENAS RETIRÉS, VITRES POSÉES'},
];
const StatBox: React.FC<{f: number; night: number}> = ({f, night}) => (
  <>
    {STATS.map((st, i) => {
      if (f < st.from - 1 || f > st.to + 1) return null;
      const a = prog(f, st.from, st.from + 18, easeOut);
      const b = prog(f, st.to - 16, st.to);
      return (
        <div key={i} style={{position: 'absolute', right: 120, top: 112, textAlign: 'right', opacity: a * (1 - b), transform: `translateY(${(1 - a) * 18 - b * 12}px)`}}>
          <div style={{fontFamily: FONT_TITLE, fontWeight: 700, fontSize: 92, lineHeight: 1, color: st.color ?? colorAt(night, [0, 1], [C.navy, C.goldLight]), whiteSpace: 'nowrap'}}>{st.big(f)}</div>
          <div style={{fontFamily: FONT_TEXT, fontWeight: 600, fontSize: 20, letterSpacing: 4, color: colorAt(night, [0, 1], ['#9A7A3E', C.gold]), marginTop: 14}}>{st.sub}</div>
        </div>
      );
    })}
  </>
);

// ---------------------------------------------------------------- Scène 1 : titre
const Intro: React.FC<{f: number}> = ({f}) => {
  if (f > 200) return null;
  const out = prog(f, 110, 146);
  const move = prog(f, 108, 152);
  const lx = lerp(1360, 960, move);
  const ly = lerp(560, 560, move);
  const ls = lerp(1.6, 1.25, move);
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 70% 50%, ${C.nightSoft} 0%, ${C.night} 70%)`}}>
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        <g transform={`translate(${lx} ${ly}) scale(${ls})`} opacity={1 - prog(f, 150, 178)}>
          <circle r={150} fill={C.gold} opacity={0.06 * prog(f, 60, 90)} />
          <BigLock drawP={prog(f, 4, 56)} closed={prog(f, 56, 66, easeIn)} heart={prog(f, 68, 88, easeOut)} hideShackle={f >= 150} />
        </g>
      </svg>
      <div style={{position: 'absolute', left: 150, top: 300, opacity: 1 - out, transform: `translateX(${-40 * out}px)`}}>
        <div style={{fontFamily: FONT_TEXT, fontWeight: 600, fontSize: 22, letterSpacing: 6, color: C.gold, opacity: prog(f, 14, 34)}}>PARIS · ENTRE LE LOUVRE ET L'INSTITUT</div>
        <div style={{overflow: 'hidden', marginTop: 20}}>
          <div style={{fontFamily: FONT_TITLE, fontWeight: 700, fontSize: 132, lineHeight: 1.02, color: C.cream, transform: `translateY(${(1 - prog(f, 20, 52, easeOut)) * 105}%)`}}>Le pont</div>
        </div>
        <div style={{overflow: 'hidden'}}>
          <div style={{fontFamily: FONT_TITLE, fontWeight: 700, fontSize: 132, lineHeight: 1.02, color: C.cream, paddingBottom: 8, transform: `translateY(${(1 - prog(f, 28, 60, easeOut)) * 105}%)`}}>des Arts</div>
        </div>
        <div style={{overflow: 'hidden', marginTop: 6}}>
          <div style={{fontFamily: FONT_TITLE, fontStyle: 'italic', fontSize: 54, color: C.goldLight, paddingBottom: 10, transform: `translateY(${(1 - prog(f, 46, 76, easeOut)) * 105}%)`}}>un pont pas comme les autres</div>
        </div>
        <div style={{width: 120 * prog(f, 62, 90, easeOut), height: 2, background: C.red, marginTop: 20}} />
      </div>
    </AbsoluteFill>
  );
};

/** L'anse du cadenas se transforme en arche centrale du pont. */
const ShackleToArch: React.FC<{f: number}> = ({f}) => {
  if (f < 148 || f > 232) return null;
  const m = prog(f, 150, 214);
  const N = 40;
  const lock = shacklePoints(1, N).map(([x, y]) => [960 + x * 1.25, 560 + y * 1.25] as [number, number]);
  const a = archX(9, 4) + 8;
  const b = archX(9, 5) - 8;
  const arch = Array.from({length: N + 1}, (_, i) => {
    const t = i / N;
    const x = (1 - t) * (1 - t) * a + 2 * (1 - t) * t * ((a + b) / 2) + t * t * b;
    const y = (1 - t) * (1 - t) * 700 + 2 * (1 - t) * t * 608 + t * t * 700;
    const p = toScreen(x, y, f);
    return [p.x, p.y] as [number, number];
  });
  const pts = lock.map((p, i) => [lerp(p[0], arch[i][0], m), lerp(p[1], arch[i][1], m)] as [number, number]);
  return (
    <svg width={1920} height={1080} style={{position: 'absolute'}}>
      <path d={polyline(pts)} fill="none" stroke={colorAt(m, [0, 1], [C.gold, C.navy])} strokeWidth={lerp(14, 2.4, m)} strokeLinecap="round" opacity={1 - prog(f, 214, 230)} />
    </svg>
  );
};

// ---------------------------------------------------------------- Le monde (scènes 2 à 6)
const World: React.FC<{f: number}> = ({f}) => {
  if (f < 140) return null;
  const cam = pontCam(f);
  const sk = sky(f);
  const night = prog(f, 1300, 1580);
  const light = prog(f, 1470, 1620);
  const iris = tween(f, [140, 186], [0, 1150], easeIn);
  const old = f < 765;
  const collapseP = prog(f, 655, 722, easeIn);
  const barge = tween(f, [535, 652], [2150, 1218], easeOut) + tween(f, [690, 770], [0, 120]);
  const sunY = tween(f, [1240, 1440], [330, 760]);
  const keyT = prog(f, 1066, 1104, easeIn);
  const ripple = prog(f, 1104, 1180, easeOut);

  return (
    <AbsoluteFill style={{clipPath: f < 186 ? `circle(${iris}px at 960px 560px)` : undefined}}>
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${sk.top} 0%, ${sk.bottom} 80%)`}} />
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        <defs>
          <linearGradient id="seinePont" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={colorAt(night, [0, 0.5, 1], [C.river, '#8A7B95', '#10213F'])} />
            <stop offset="100%" stopColor={colorAt(night, [0, 0.5, 1], ['#7F98B1', '#4A4A6E', '#081428'])} />
          </linearGradient>
          <clipPath id="riverClip">
            <rect x={-200} y={BR.water} width={2400} height={500} />
          </clipPath>
        </defs>

        {/* Étoiles et soleil */}
        {Array.from({length: 80}, (_, i) => (
          <circle key={i} cx={hash(i * 1.9) * 1920} cy={hash(i * 3.7) * 520} r={hash(i) * 1.6 + 0.5} fill={C.white} opacity={prog(f, 1540, 1640) * (0.3 + 0.5 * Math.abs(Math.sin(f / 23 + i * 2.2)))} />
        ))}
        <g opacity={prog(f, 905, 975) * (1 - prog(f, 1400, 1450))}>
          <circle cx={1440} cy={sunY} r={130} fill={C.gold} opacity={0.16} />
          <circle cx={1440} cy={sunY} r={72} fill={colorAt(prog(f, 1240, 1420), [0, 1], ['#F4CF8C', '#E9855A'])} />
        </g>

        <g transform={`translate(960 540) scale(${cam.s}) translate(${-cam.cx} ${-cam.cy})`}>
          {/* Au loin : la tour Eiffel (visible depuis le pont, vers l'ouest) */}
          <g transform={`translate(${1480 - 200 * 0.3} ${640 - 1000 * 0.3}) scale(0.3)`} opacity={prog(f, 900, 980) * lerp(0.4, 1, prog(f, 1560, 1620))}>
            <EiffelTower progress={prog(f, 900, 1000)} color={colorAt(prog(f, 1560, 1620), [0, 1], [C.navy, C.gold])} stroke={4} glow={prog(f, 1580, 1640)} sparkle={prog(f, 1700, 1715)} frame={f} />
          </g>

          <Banks drawP={prog(f, 250, 380)} night={night} light={light} frame={f} />

          {/* La Seine */}
          <rect x={225} y={BR.water} width={1470} height={500} fill="url(#seinePont)" opacity={prog(f, 186, 240)} />
          <g clipPath="url(#riverClip)" opacity={0.18 * prog(f, 300, 360)}>
            <g transform={`translate(0 ${2 * BR.water}) scale(1 -1)`}>
              <Bridge n={old ? 9 : 7} drawP={1} night={night} opacity={old ? 1 - collapseP - prog(f, 725, 760) : prog(f, 800, 860)} />
            </g>
          </g>
          {Array.from({length: 30}, (_, i) => {
            const x = 225 + ((hash(i) * 1470 + f * (0.5 + hash(i + 9))) % 1470);
            return <rect key={i} x={x} y={BR.water + 20 + hash(i + 50) * 260} width={30 + hash(i + 3) * 50} height={2.5} rx={1.2} fill={C.white} opacity={prog(f, 200, 260) * 0.35 * (1 - night * 0.5)} />;
          })}
          {/* Reflets dorés la nuit */}
          {Array.from({length: 14}, (_, i) => {
            const x = 260 + i * 105;
            return Array.from({length: 5}, (_, j) => (
              <rect key={`${i}-${j}`} x={x - 14 + Math.sin(f / 10 + i + j) * 5} y={BR.water + 14 + j * 22} width={28 - j * 4} height={3} rx={1.5} fill={C.goldLight} opacity={light * (0.55 - j * 0.09)} />
            ));
          })}

          {/* La péniche de 1979 */}
          <g transform={`translate(${barge} ${BR.water + 16})`} opacity={prog(f, 535, 560) * (1 - prog(f, 720, 770))}>
            <Barge night={0} />
          </g>
          {/* Onde de choc douce à l'impact */}
          <circle cx={archX(9, 5)} cy={700} r={lerp(10, 140, prog(f, 650, 700, easeOut))} fill="none" stroke={C.red} strokeWidth={3} opacity={(1 - prog(f, 650, 700)) * prog(f, 648, 652)} />

          {/* Le pont : 9 arches (1804), puis 7 arches (1984) */}
          {old ? (
            <Bridge n={9} drawP={prog(f, 186, 330)} centerFirst night={night} collapse={{indices: [4, 5], p: collapseP}} opacity={1 - prog(f, 725, 760)} />
          ) : (
            <Bridge n={7} drawP={prog(f, 765, 860)} centerFirst night={night} />
          )}

          {/* Promeneurs le soir */}
          <g transform={`translate(960 ${BR.deck}) scale(1.25) translate(-960 ${-BR.deck})`}>
            <Walkers frame={f - 1300} night={night} groundY={BR.deck} appear={prog(f, 1600, 1650)} />
          </g>

          <Railing
            drawP={old ? prog(f, 230, 360) : prog(f, 780, 870)}
            mesh={1 - prog(f, 1445, 1485)}
            glass={prog(f, 1460, 1530)}
            locksAt={f}
            locksOut={prog(f, 1430, 1476)}
            fallen={{panel: 24, p: prog(f, 1372, 1418, easeIn), board: prog(f, 1420, 1440)}}
            night={night}
            frame={f}
            gap={old ? {x0: archX(9, 4), x1: archX(9, 6), p: collapseP} : undefined}
          />
          <g opacity={old ? 1 - prog(f, 722, 750) : 1}>
            {/* Cœur de cadenas rouges */}
            {HEART.map((h, i) => {
              const pop = prog(f, h.appear, h.appear + 10, easeOut);
              const out = prog(f, 1430, 1470);
              return pop > 0 && out < 1 ? <MiniLock key={i} x={h.x} y={h.y + out * 30} s={0.75 * pop} color={C.red} rot={0} opacity={1 - out} /> : null;
            })}
          </g>

          {/* La clé jetée dans la Seine */}
          {f > 1062 && f < 1185 && (
            <g transform={`translate(${lerp(1002, 1018, keyT)} ${lerp(628, BR.water, keyT)}) rotate(${keyT * 260})`} opacity={1 - prog(f, 1102, 1108)}>
              <Key />
            </g>
          )}
          {[0, 0.25, 0.5].map((d, i) => {
            const r = Math.max(0, (ripple - d) / (1 - d));
            return r > 0 && r < 1 ? <ellipse key={i} cx={1018} cy={BR.water + 2} rx={8 + 50 * r} ry={2 + 7 * r} fill="none" stroke={C.white} strokeWidth={1.4} opacity={(1 - r) * 0.8} /> : null;
          })}

          {/* Lampadaires du pont */}
          {[300, 960, 1620].map((x, i) => (
            <g key={i} transform={`translate(${x} ${BR.deck}) scale(0.62)`}>
              <Lamp night={night} on={prog(f, 1480 + i * 8, 1505 + i * 8)} appear={prog(f, 1540, 1580)} />
            </g>
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- Phrases explicatives (bas de l'écran)
export const CAPTIONS: {from: number; to: number; text: string}[] = [
  {from: 92, to: 176, text: "Une passerelle pour piétons qui relie le Louvre à l'Institut de France."},
  {from: 200, to: 330, text: 'Il est construit entre 1801 et 1804, sous Napoléon Bonaparte.'},
  {from: 336, to: 505, text: 'Premier pont métallique de Paris, il doit son nom au Louvre, appelé à l’époque « palais des Arts ».'},
  {from: 525, to: 645, text: 'Au fil du temps, les bombardements et les chocs de bateaux fragilisent le pont.'},
  {from: 651, to: 760, text: 'En 1979, une barge heurte une pile : une partie du pont s’effondre dans la Seine.'},
  {from: 766, to: 875, text: 'Reconstruit de 1981 à 1984, il n’a plus que 7 arches, alignées sur celles du Pont-Neuf voisin.'},
  {from: 895, to: 1030, text: 'À la fin des années 2000, les couples commencent à y accrocher des cadenas.'},
  {from: 1036, to: 1120, text: 'Ils y écrivent leurs prénoms : un symbole d’amour « verrouillé » pour toujours.'},
  {from: 1126, to: 1235, text: 'La clé est jetée dans la Seine, pour que personne ne puisse ouvrir le cadenas.'},
  {from: 1250, to: 1370, text: 'Près d’un million de cadenas : 45 tonnes, le poids d’une trentaine de voitures.'},
  {from: 1376, to: 1450, text: 'En juin 2014, un panneau du grillage s’affaisse sous ce poids.'},
  {from: 1456, to: 1560, text: 'En 2015, la Ville retire tous les cadenas et installe des panneaux de verre.'},
  {from: 1585, to: 1735, text: 'En 2017, une partie des cadenas est vendue aux enchères au profit de l’aide aux réfugiés.'},
];

const Captions: React.FC<{f: number}> = ({f}) => (
  <>
    {CAPTIONS.map((c, i) => {
      if (f < c.from - 1 || f > c.to + 1) return null;
      const a = prog(f, c.from, c.from + 14, easeOut);
      const b = prog(f, c.to - 12, c.to);
      return (
        <div key={i} style={{position: 'absolute', left: 0, right: 0, bottom: 64, display: 'flex', justifyContent: 'center', opacity: a * (1 - b), transform: `translateY(${(1 - a) * 14}px)`}}>
          <div
            style={{
              maxWidth: 1240,
              padding: '16px 34px',
              borderRadius: 14,
              background: 'rgba(11,26,51,0.74)',
              borderLeft: `4px solid ${C.gold}`,
              fontFamily: FONT_TEXT,
              fontWeight: 500,
              fontSize: 31,
              lineHeight: 1.35,
              color: C.cream,
              textAlign: 'center',
              textWrap: 'balance',
            } as React.CSSProperties}
          >
            {c.text}
          </div>
        </div>
      );
    })}
  </>
);

// ---------------------------------------------------------------- Textes
const Texts: React.FC<{f: number}> = ({f}) => {
  const night = prog(f, 1235, 1262);
  const inst = toScreen(220, 520, f);
  const louvre = toScreen(1690, 470, f);
  return (
    <>
      <SceneHeading frame={f} start={205} end={505} kicker="01 — Son histoire" lines={['Le premier pont', 'en métal de Paris']} />
      <Label frame={f} start={340} end={492} x={inst.x} y={inst.y} title="L'Institut de France" sub="RIVE GAUCHE" />
      <Label frame={f} start={370} end={492} x={louvre.x} y={louvre.y} title="Le Louvre" sub="ALORS « PALAIS DES ARTS »" align="right" />
      <SceneHeading frame={f} start={560} end={875} kicker="02 — Chute et renaissance" lines={['Effondré en 1979,', 'reconstruit en 1984']} />
      <SceneHeading frame={f} start={965} end={1228} kicker="03 — Les cadenas d'amour" lines={['Un cadenas, deux prénoms,', 'une clé dans la Seine']} kickerColor={C.navy} />
      <SceneHeading frame={f} start={1258} end={1545} kicker="04 — Le poids de l'amour" lines={['Un amour', 'un peu trop lourd']} color={C.cream} kickerColor={C.goldLight} />
      <StatBox f={f} night={night} />
      <Captions f={f} />
      {/* Message final */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center', opacity: 1 - prog(f, 1760, 1792)}}>
        <div style={{overflow: 'hidden'}}>
          <div style={{fontFamily: FONT_TITLE, fontWeight: 600, fontSize: 86, color: C.cream, transform: `translateY(${(1 - prog(f, 1648, 1680, easeOut)) * 100}%)`}}>Le pont des Arts,</div>
        </div>
        <div style={{overflow: 'hidden'}}>
          <div style={{fontFamily: FONT_TITLE, fontStyle: 'italic', fontSize: 70, color: C.goldLight, paddingBottom: 12, transform: `translateY(${(1 - prog(f, 1662, 1696, easeOut)) * 100}%)`}}>
            un pont d’histoire et d’amour.
          </div>
        </div>
      </div>
    </>
  );
};

const SFX_PONT: {file: string; at: number; volume: number}[] = [
  {file: 'shimmer', at: 22, volume: 0.26},
  {file: 'click', at: 60, volume: 0.4},
  {file: 'whoosh', at: 138, volume: 0.26},
  {file: 'chime', at: 300, volume: 0.2},
  {file: 'whoosh', at: 636, volume: 0.32},
  {file: 'chime', at: 772, volume: 0.2},
  {file: 'whoosh', at: 878, volume: 0.22},
  {file: 'click', at: 962, volume: 0.14},
  {file: 'click', at: 1004, volume: 0.12},
  {file: 'click', at: 1046, volume: 0.12},
  {file: 'chime', at: 1104, volume: 0.22},
  {file: 'whoosh', at: 1366, volume: 0.26},
  {file: 'shimmer', at: 1462, volume: 0.22},
  {file: 'whoosh', at: 1538, volume: 0.22},
  {file: 'shimmer', at: 1648, volume: 0.26},
];

export const PontVideo: React.FC<PontProps> = ({musique, baisserMusiquePourVoix}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: C.night}}>
      <Intro f={f} />
      <World f={f} />
      <ShackleToArch f={f} />
      <Texts f={f} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 62%, rgba(5,12,28,0.25) 100%)'}} />
      <AbsoluteFill style={{background: C.night, opacity: prog(f, 1740, 1795)}} />
      {musique && <Audio src={staticFile('audio/musique_pont.wav')} volume={(fr) => musicVolume(fr, baisserMusiquePourVoix)} />}
      {SFX_PONT.map((x, i) => (
        <Sequence key={i} from={x.at} durationInFrames={120} layout="none">
          <Audio src={staticFile(`audio/sfx/${x.file}.wav`)} volume={x.volume} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export {PANEL_W};
