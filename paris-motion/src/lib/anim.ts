import {Easing, interpolate, interpolateColors} from 'remotion';

// Courbes d'accélération / décélération douces (aucun mouvement linéaire brusque).
export const easeInOut = Easing.bezier(0.45, 0, 0.55, 1);
export const easeOut = Easing.bezier(0.22, 1, 0.36, 1);
export const easeIn = Easing.bezier(0.55, 0, 0.75, 0.2);

/** Interpolation bornée avec ease-in-out par défaut. */
export const tween = (
  frame: number,
  range: [number, number],
  out: [number, number],
  easing: (t: number) => number = easeInOut,
) =>
  interpolate(frame, range, out, {
    easing,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

/** 0 → 1 entre a et b. */
export const prog = (frame: number, a: number, b: number, easing = easeInOut) =>
  tween(frame, [a, b], [0, 1], easing);

/** Apparition puis disparition : 0 → 1 (a→b), 1 (b→c), 1 → 0 (c→d). */
export const inOut = (frame: number, a: number, b: number, c: number, d: number) =>
  Math.min(prog(frame, a, b, easeOut), 1 - prog(frame, c, d, easeInOut));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Couleur interpolée sur une suite de points clés (t entre 0 et 1). */
export const colorAt = (t: number, stops: number[], colors: string[]) =>
  interpolateColors(Math.min(Math.max(t, stops[0]), stops[stops.length - 1]), stops, colors);

/** Tracé progressif d'un chemin SVG (à combiner avec pathLength={1}). */
export const draw = (p: number) => ({
  strokeDasharray: 1,
  strokeDashoffset: 1 - Math.min(Math.max(p, 0), 1),
});

/** Bruit déterministe simple (aucun Math.random : rendu identique à chaque image). */
export const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
