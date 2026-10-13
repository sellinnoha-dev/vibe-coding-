// Toutes les durées sont exprimées en images (30 images = 1 seconde).
export const FPS = 30;
export const DURATION = 60 * FPS; // 1800 images = 60 s exactement
export const s = (seconds: number) => Math.round(seconds * FPS);

export const SCENES = {
  intro: {from: 0, to: s(6)}, // 0 → 6 s
  monuments: {from: s(6), to: s(17)}, // 6 → 17 s
  architecture: {from: s(17), to: s(29)}, // 17 → 29 s
  ambiance: {from: s(29), to: s(41)}, // 29 → 41 s
  culture: {from: s(41), to: s(52)}, // 41 → 52 s
  finale: {from: s(52), to: s(60)}, // 52 → 60 s
};

// Créneaux de la voix off (en secondes) : début et durée maximale de chaque phrase.
export const VOICE_SLOTS = [
  {file: 'scene1', start: 0.8, max: 4.9},
  {file: 'scene2', start: 6.5, max: 10.0},
  {file: 'scene3', start: 17.5, max: 11.0},
  {file: 'scene4', start: 29.5, max: 11.0},
  {file: 'scene5', start: 41.5, max: 10.0},
  {file: 'scene6', start: 52.4, max: 6.6},
];
