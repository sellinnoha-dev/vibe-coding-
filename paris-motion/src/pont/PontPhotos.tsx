import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {C, FONT_TEXT, FONT_TITLE} from '../lib/theme';
import {draw, easeIn, easeInOut, easeOut, lerp, prog, tween} from '../lib/anim';
import {musicVolume} from '../lib/audio';
import {SceneHeading} from '../components/Text';
import {BigLock} from './elements';
import {CAPTIONS, PontProps} from './PontVideo';
import {PHOTOS} from './photos';

// Version « vraies images » : photos animées (zoom lent, fondus enchaînés) + habillage motion design.
// Même découpage et mêmes temps que la version illustrée : la voix off reste identique.

const FADE = 26; // durée des fondus enchaînés entre deux photos

const PhotoLayer: React.FC<{f: number}> = ({f}) => (
  <>
    {PHOTOS.map((p, i) => {
      if (f < p.from - 1 || f > p.to + 1) return null;
      const t = prog(f, p.from, p.to, (x) => easeInOut(x));
      const fadeIn = i === 0 ? 1 : prog(f, p.from, p.from + FADE);
      const z = lerp(p.zoom[0], p.zoom[1], t);
      const px = lerp(p.pan[0][0], p.pan[1][0], t);
      const py = lerp(p.pan[0][1], p.pan[1][1], t);
      const src = staticFile(`photos/pont/${p.file}`);
      if (p.mode === 'card') {
        const h = p.cardH ?? 480;
        const enter = prog(f, p.from, p.from + 34, easeOut);
        const gold = p.frame === 'gold';
        return (
          <AbsoluteFill key={p.file + i} style={{opacity: fadeIn}}>
            <Img src={staticFile(`photos/pont/${p.file.replace('.jpg', '-flou.jpg')}`)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1.04 + 0.04 * t})`}} />
            <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(11,26,51,0.7), rgba(11,26,51,0.5))'}} />
            <div style={{position: 'absolute', left: '50%', top: p.cardY ?? 560, transform: `translate(-50%, -50%) translateY(${(1 - enter) * 40}px) rotate(${(p.rot ?? 0) * enter}deg) scale(${lerp(0.94, 1, enter) * z})`}}>
              <div style={{padding: gold ? 18 : 14, paddingBottom: gold ? 18 : 14, background: gold ? 'linear-gradient(135deg, #8A6A2E, #E8C77E 45%, #9C7A38)' : '#FAF6EE', borderRadius: 4, boxShadow: '0 30px 70px rgba(0,0,0,0.55)'}}>
                <Img src={src} style={{display: 'block', height: h, width: 'auto', boxShadow: gold ? 'inset 0 0 0 2px rgba(0,0,0,0.3)' : undefined}} />
              </div>
              {p.legend && (
                <div style={{position: 'absolute', left: '50%', top: '100%', transform: 'translateX(-50%)', marginTop: 16, width: 900, textAlign: 'center', fontFamily: FONT_TITLE, fontStyle: 'italic', fontSize: 25, color: C.goldLight, opacity: prog(f, p.from + 30, p.from + 50), textShadow: '0 2px 10px rgba(0,0,0,0.6)'}}>
                  {p.legend}
                </div>
              )}
            </div>
          </AbsoluteFill>
        );
      }
      return (
        <AbsoluteFill key={p.file + i} style={{opacity: fadeIn}}>
          <Img src={src} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${z}) translate(${px}%, ${py}%)`}} />
          {p.credit && (
            <div style={{position: 'absolute', right: 22, bottom: 16, fontFamily: FONT_TEXT, fontSize: 15, color: 'rgba(255,255,255,0.75)', textShadow: '0 1px 3px rgba(0,0,0,0.8)'}}>
              {p.credit}
            </div>
          )}
        </AbsoluteFill>
      );
    })}
  </>
);

/** Voiles sombres pour garder les textes lisibles sur n'importe quelle photo. */
const Shades: React.FC<{f: number}> = ({f}) => {
  const intro = 1 - prog(f, 150, 200);
  const outro = prog(f, 1630, 1680);
  return (
    <>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(11,26,51,0.78) 0%, rgba(11,26,51,0.3) 34%, rgba(11,26,51,0) 55%, rgba(11,26,51,0.55) 100%)'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 900px 420px at 0% 0%, rgba(11,26,51,0.8) 0%, rgba(11,26,51,0) 100%)'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 700px 360px at 100% 0%, rgba(11,26,51,0.7) 0%, rgba(11,26,51,0) 100%)'}} />
      <AbsoluteFill style={{background: `linear-gradient(90deg, rgba(11,26,51,0.85) 0%, rgba(11,26,51,0.35) 60%, rgba(11,26,51,0.1) 100%)`, opacity: intro}} />
      <AbsoluteFill style={{background: 'rgba(11,26,51,0.45)', opacity: outro}} />
    </>
  );
};

type Stat = {from: number; to: number; big: (f: number) => string; sub: string; color?: string};
const STATS: Stat[] = [
  {from: 228, to: 495, big: (f) => `1801 → ${Math.round(tween(f, [250, 310], [1801, 1804]))}`, sub: 'CONSTRUIT SOUS NAPOLÉON'},
  {from: 645, to: 765, big: () => '1979', sub: 'UNE PÉNICHE HEURTE LE PONT', color: '#FF5A6E'},
  {from: 770, to: 872, big: () => '1984', sub: '7 ARCHES AU LIEU DE 9'},
  {from: 1262, to: 1392, big: (f) => `${Math.round(tween(f, [1268, 1335], [0, 45], easeOut))} tonnes`, sub: "PRÈS D'UN MILLION DE CADENAS", color: '#FF5A6E'},
  {from: 1392, to: 1452, big: () => '2014', sub: 'UN GRILLAGE CÈDE', color: '#FF5A6E'},
  {from: 1452, to: 1540, big: () => '2015', sub: 'CADENAS RETIRÉS, VITRES POSÉES'},
];
const StatBox: React.FC<{f: number}> = ({f}) => (
  <>
    {STATS.map((st, i) => {
      if (f < st.from - 1 || f > st.to + 1) return null;
      const a = prog(f, st.from, st.from + 18, easeOut);
      const b = prog(f, st.to - 16, st.to);
      return (
        <div key={i} style={{position: 'absolute', right: 120, top: 112, textAlign: 'right', opacity: a * (1 - b), transform: `translateY(${(1 - a) * 18 - b * 12}px)`, textShadow: '0 2px 18px rgba(0,0,0,0.45)'}}>
          <div style={{fontFamily: FONT_TITLE, fontWeight: 700, fontSize: 92, lineHeight: 1, color: st.color ?? C.cream, whiteSpace: 'nowrap'}}>{st.big(f)}</div>
          <div style={{fontFamily: FONT_TEXT, fontWeight: 600, fontSize: 20, letterSpacing: 4, color: C.goldLight, marginTop: 14}}>{st.sub}</div>
        </div>
      );
    })}
  </>
);

/** Schéma animé par-dessus la photo des arches : 9 arches → effondrement → 7 arches. */
const ArchSchema: React.FC<{f: number}> = ({f}) => {
  if (f < 560 || f > 885) return null;
  const show = prog(f, 565, 595) * (1 - prog(f, 860, 884));
  const x0 = 460;
  const x1 = 1460;
  const y = 760;
  const arches = (n: number, p: number, fall: number[] = [], fp = 0, color = C.goldLight) =>
    Array.from({length: n}, (_, i) => {
      const a = x0 + ((x1 - x0) / n) * i;
      const b = x0 + ((x1 - x0) / n) * (i + 1);
      const falling = fall.includes(i) ? fp : 0;
      const local = Math.min(Math.max(p * n - Math.abs(i - (n - 1) / 2) * 0.9, 0), 1);
      return (
        <g key={i} opacity={1 - falling} transform={`translate(0 ${falling * 70})`}>
          <path d={`M${a + 4},${y + 50} Q${(a + b) / 2},${y - 18} ${b - 4},${y + 50}`} pathLength={1} fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" style={draw(local)} />
          <path d={`M${a},${y} L${b},${y}`} pathLength={1} stroke={color} strokeWidth={4} style={draw(local)} />
        </g>
      );
    });
  const oldOn = f < 760;
  return (
    <div style={{position: 'absolute', inset: 0, opacity: show}}>
      <div style={{position: 'absolute', left: x0 - 60, top: y - 70, width: x1 - x0 + 120, height: 170, borderRadius: 18, background: 'rgba(11,26,51,0.62)'}} />
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        {oldOn
          ? arches(9, prog(f, 575, 640), [4, 5], prog(f, 655, 715, easeIn), C.goldLight)
          : arches(7, prog(f, 770, 830), [], 0, C.cream)}
      </svg>
      <div style={{position: 'absolute', left: x0 - 40, top: y - 62, fontFamily: FONT_TEXT, fontWeight: 600, fontSize: 18, letterSpacing: 4, color: C.goldLight}}>
        {oldOn ? 'SCHÉMA · LE PONT DE 1804 : 9 ARCHES' : 'SCHÉMA · LE PONT DE 1984 : 7 ARCHES'}
      </div>
    </div>
  );
};

const Captions: React.FC<{f: number}> = ({f}) => (
  <>
    {CAPTIONS.map((c, i) => {
      if (f < c.from - 1 || f > c.to + 1) return null;
      const a = prog(f, c.from, c.from + 14, easeOut);
      const b = prog(f, c.to - 12, c.to);
      return (
        <div key={i} style={{position: 'absolute', left: 0, right: 0, bottom: 64, display: 'flex', justifyContent: 'center', opacity: a * (1 - b), transform: `translateY(${(1 - a) * 14}px)`}}>
          <div style={{maxWidth: 1240, padding: '16px 34px', borderRadius: 14, background: 'rgba(11,26,51,0.8)', borderLeft: `4px solid ${C.gold}`, fontFamily: FONT_TEXT, fontWeight: 500, fontSize: 31, lineHeight: 1.35, color: C.cream, textAlign: 'center', textWrap: 'balance'} as React.CSSProperties}>
            {c.text}
          </div>
        </div>
      );
    })}
  </>
);

const Title: React.FC<{f: number}> = ({f}) => {
  if (f > 200) return null;
  const out = prog(f, 120, 160);
  return (
    <>
      <svg width={1920} height={1080} style={{position: 'absolute', opacity: 1 - out}}>
        <g transform="translate(1500 540) scale(1.3)">
          <BigLock drawP={prog(f, 4, 56)} closed={prog(f, 56, 66, easeIn)} heart={prog(f, 68, 88, easeOut)} />
        </g>
      </svg>
      <div style={{position: 'absolute', left: 150, top: 300, opacity: 1 - out, transform: `translateX(${-40 * out}px)`}}>
        <div style={{fontFamily: FONT_TEXT, fontWeight: 600, fontSize: 22, letterSpacing: 6, color: C.goldLight, opacity: prog(f, 14, 34)}}>PARIS · ENTRE LE LOUVRE ET L'INSTITUT</div>
        {['Le pont', 'des Arts'].map((w, i) => (
          <div key={w} style={{overflow: 'hidden', marginTop: i ? 0 : 20}}>
            <div style={{fontFamily: FONT_TITLE, fontWeight: 700, fontSize: 132, lineHeight: 1.02, color: C.cream, paddingBottom: i ? 8 : 0, transform: `translateY(${(1 - prog(f, 20 + i * 8, 52 + i * 8, easeOut)) * 105}%)`}}>{w}</div>
          </div>
        ))}
        <div style={{overflow: 'hidden', marginTop: 6}}>
          <div style={{fontFamily: FONT_TITLE, fontStyle: 'italic', fontSize: 54, color: C.goldLight, paddingBottom: 10, transform: `translateY(${(1 - prog(f, 46, 76, easeOut)) * 105}%)`}}>un pont pas comme les autres</div>
        </div>
        <div style={{width: 120 * prog(f, 62, 90, easeOut), height: 2, background: C.red, marginTop: 20}} />
      </div>
    </>
  );
};

const Final: React.FC<{f: number}> = ({f}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top: 360, textAlign: 'center', opacity: 1 - prog(f, 1760, 1792), textShadow: '0 2px 24px rgba(0,0,0,0.5)'}}>
    <div style={{overflow: 'hidden'}}>
      <div style={{fontFamily: FONT_TITLE, fontWeight: 600, fontSize: 96, color: C.cream, transform: `translateY(${(1 - prog(f, 1648, 1680, easeOut)) * 100}%)`}}>Le pont des Arts,</div>
    </div>
    <div style={{overflow: 'hidden'}}>
      <div style={{fontFamily: FONT_TITLE, fontStyle: 'italic', fontSize: 76, color: C.goldLight, paddingBottom: 12, transform: `translateY(${(1 - prog(f, 1662, 1696, easeOut)) * 100}%)`}}>un pont d’histoire et d’amour.</div>
    </div>
  </div>
);

const SFX: {file: string; at: number; volume: number}[] = [
  {file: 'shimmer', at: 22, volume: 0.26},
  {file: 'click', at: 60, volume: 0.4},
  {file: 'whoosh', at: 636, volume: 0.3},
  {file: 'chime', at: 772, volume: 0.2},
  {file: 'click', at: 880, volume: 0.2},
  {file: 'whoosh', at: 1366, volume: 0.24},
  {file: 'shimmer', at: 1648, volume: 0.26},
];

export const PontPhotos: React.FC<PontProps> = ({musique, baisserMusiquePourVoix}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: C.night}}>
      <PhotoLayer f={f} />
      <Shades f={f} />
      <Title f={f} />
      <ArchSchema f={f} />
      <SceneHeading frame={f} start={205} end={505} kicker="01 — Son histoire" lines={['Le premier pont', 'en métal de Paris']} color={C.cream} kickerColor={C.goldLight} />
      <SceneHeading frame={f} start={530} end={875} kicker="02 — Chute et renaissance" lines={['Effondré en 1979,', 'reconstruit en 1984']} color={C.cream} kickerColor={C.goldLight} />
      <SceneHeading frame={f} start={895} end={1228} kicker="03 — Les cadenas d'amour" lines={['Un cadenas, deux prénoms,', 'une clé dans la Seine']} color={C.cream} kickerColor={C.goldLight} />
      <SceneHeading frame={f} start={1258} end={1545} kicker="04 — Le poids de l'amour" lines={['Un amour', 'un peu trop lourd']} color={C.cream} kickerColor={C.goldLight} />
      <StatBox f={f} />
      <Captions f={f} />
      <Final f={f} />
      <AbsoluteFill style={{background: C.night, opacity: prog(f, 1740, 1795)}} />
      {musique && <Audio src={staticFile('audio/musique_pont.wav')} volume={(fr) => musicVolume(fr, baisserMusiquePourVoix)} />}
      {SFX.map((x, i) => (
        <Sequence key={i} from={x.at} durationInFrames={120} layout="none">
          <Audio src={staticFile(`audio/sfx/${x.file}.wav`)} volume={x.volume} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
