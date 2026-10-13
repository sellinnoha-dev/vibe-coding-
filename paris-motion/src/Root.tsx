import React from 'react';
import {Composition} from 'remotion';
import {ParisVideo, VideoProps} from './ParisVideo';
import {PontProps, PontVideo} from './pont/PontVideo';
import {PontPhotos} from './pont/PontPhotos';
import {DURATION, FPS} from './lib/timeline';
import {loadAllFonts} from './lib/theme';

loadAllFonts();

export const RemotionRoot: React.FC = () => (
  <>
  <Composition
    id="ParisMotion"
    component={ParisVideo}
    durationInFrames={DURATION}
    fps={FPS}
    width={1920}
    height={1080}
    defaultProps={{voix: 'guide', musique: true} satisfies VideoProps}
  />
  <Composition
    id="PontDesArts"
    component={PontVideo}
    durationInFrames={DURATION}
    fps={FPS}
    width={1920}
    height={1080}
    defaultProps={{musique: true, baisserMusiquePourVoix: true} satisfies PontProps}
  />
  <Composition
    id="PontDesArtsPhotos"
    component={PontPhotos}
    durationInFrames={DURATION}
    fps={FPS}
    width={1920}
    height={1080}
    defaultProps={{musique: true, baisserMusiquePourVoix: true} satisfies PontProps}
  />
  </>
);
