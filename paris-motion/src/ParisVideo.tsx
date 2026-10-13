import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {C} from './lib/theme';
import {prog} from './lib/anim';
import {s, VOICE_SLOTS} from './lib/timeline';
import {musicVolume, SFX} from './lib/audio';
import {S1Intro} from './scenes/S1Intro';
import {S2Monuments} from './scenes/S2Monuments';
import {S34City} from './scenes/S34City';
import {CultureTiles, S5Culture} from './scenes/S5Culture';
import {S6Finale} from './scenes/S6Finale';

export type VideoProps = {
  /** 'guide' = voix de synthèse provisoire, 'perso' = ta propre voix, 'aucune' = musique seule. */
  voix: 'guide' | 'perso' | 'aucune';
  musique: boolean;
};

const Grain: React.FC = () => (
  <svg width={1920} height={1080} style={{position: 'absolute', opacity: 0.05, mixBlendMode: 'overlay'}}>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} stitchTiles="stitch" />
    </filter>
    <rect width="100%" height="100%" filter="url(#grain)" />
  </svg>
);

const FinalFade: React.FC = () => {
  const f = useCurrentFrame();
  // Fin propre : tout revient doucement au bleu nuit sur les deux dernières secondes.
  return <AbsoluteFill style={{background: C.night, opacity: prog(f, 1738, 1794)}} />;
};

export const ParisVideo: React.FC<VideoProps> = ({voix, musique}) => {
  const withVoice = voix !== 'aucune';
  return (
    <AbsoluteFill style={{background: C.night}}>
      <S1Intro />
      <S2Monuments />
      <S34City />
      <S5Culture />
      <S6Finale />
      <CultureTiles />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 62%, rgba(5,12,28,0.28) 100%)'}} />
      <Grain />
      <FinalFade />

      {musique && <Audio src={staticFile('audio/musique.wav')} volume={(f) => musicVolume(f, withVoice)} />}
      {SFX.map((x, i) => (
        <Sequence key={i} from={x.at} durationInFrames={120} layout="none">
          <Audio src={staticFile(`audio/sfx/${x.file}.wav`)} volume={x.volume} />
        </Sequence>
      ))}
      {withVoice &&
        VOICE_SLOTS.map((v) => (
          <Sequence key={v.file} from={s(v.start)} durationInFrames={s(v.max) + 15} layout="none">
            <Audio src={staticFile(`voix/${voix}/${v.file}.wav`)} volume={1} />
          </Sequence>
        ))}
    </AbsoluteFill>
  );
};
