import {s, VOICE_SLOTS} from './timeline';

// Effets sonores discrets, calés sur les apparitions et les transitions (en images).
export const SFX: {file: string; at: number; volume: number}[] = [
  {file: 'shimmer', at: 18, volume: 0.32}, // apparition du titre
  {file: 'whoosh', at: 146, volume: 0.28}, // ouverture vers la scène 2
  {file: 'chime', at: 196, volume: 0.24}, // la tour Eiffel se dessine
  {file: 'chime', at: 324, volume: 0.2}, // l'Arc de Triomphe se dessine
  {file: 'whoosh', at: 452, volume: 0.24}, // les corniches deviennent des immeubles
  {file: 'shimmer', at: 980, volume: 0.26}, // la ville s'illumine
  {file: 'whoosh', at: 1206, volume: 0.24}, // les fenêtres deviennent des tuiles
  {file: 'whoosh', at: 1524, volume: 0.22}, // vers la conclusion
  {file: 'shimmer', at: 1640, volume: 0.28}, // la tour s'illumine
];

const RAMP = 12; // ~0,4 s de fondu pour baisser / remonter la musique

/** Volume de la musique : baissé automatiquement pendant la voix off (ducking). */
export const musicVolume = (f: number, withVoice: boolean) => {
  const fadeIn = Math.min(1, f / 20);
  const fadeOut = Math.min(1, Math.max(0, (1796 - f) / 70));
  let duck = 1;
  if (withVoice) {
    for (const v of VOICE_SLOTS) {
      const a = s(v.start) - RAMP;
      const b = s(v.start + v.max) + 4;
      const d = f < a || f > b + RAMP ? 0 : f < a + RAMP ? (f - a) / RAMP : f > b ? 1 - (f - b) / RAMP : 1;
      duck = Math.min(duck, 1 - 0.62 * d);
    }
  }
  return 0.9 * fadeIn * fadeOut * duck;
};
