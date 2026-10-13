import React from 'react';
import {C, FONT_TEXT, FONT_TITLE} from '../lib/theme';
import {easeOut, prog, tween} from '../lib/anim';

/**
 * Titre de scène : petit surtitre doré + titre en Playfair.
 * Entrée : les lignes glissent vers le haut dans un masque (révélation douce).
 * Sortie : fondu léger avec un petit déplacement.
 */
export const SceneHeading: React.FC<{
  frame: number;
  start: number;
  end: number;
  kicker: string;
  lines: string[];
  color?: string;
  x?: number;
  y?: number;
}> = ({frame, start, end, kicker, lines, color = C.navy, x = 120, y = 104}) => {
  const out = prog(frame, end - 24, end);
  if (frame < start - 1 || frame > end + 1) return null;
  const bar = prog(frame, start, start + 22, easeOut);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        opacity: 1 - out,
        transform: `translateY(${-14 * out}px)`,
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 18, marginBottom: 18}}>
        <div style={{width: 56 * bar, height: 2, background: C.gold}} />
        <div
          style={{
            fontFamily: FONT_TEXT,
            fontWeight: 600,
            fontSize: 22,
            letterSpacing: 6,
            textTransform: 'uppercase',
            color: C.gold,
            opacity: prog(frame, start + 6, start + 24),
            transform: `translateX(${tween(frame, [start + 6, start + 30], [-14, 0], easeOut)}px)`,
          }}
        >
          {kicker}
        </div>
      </div>
      {lines.map((line, i) => {
        const a = start + 12 + i * 7;
        const p = prog(frame, a, a + 26, easeOut);
        return (
          <div key={i} style={{overflow: 'hidden', paddingBottom: 8}}>
            <div
              style={{
                fontFamily: FONT_TITLE,
                fontWeight: 600,
                fontSize: 62,
                lineHeight: 1.1,
                color,
                whiteSpace: 'nowrap',
                transform: `translateY(${(1 - p) * 100}%)`,
                opacity: Math.min(1, p * 1.6),
              }}
            >
              {line}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/** Étiquette d'un monument : point doré, trait fin, nom et date. */
export const Label: React.FC<{
  frame: number;
  start: number;
  end: number;
  x: number;
  y: number;
  title: string;
  sub: string;
  color?: string;
  align?: 'left' | 'right';
  lineLen?: number;
}> = ({frame, start, end, x, y, title, sub, color = C.navy, align = 'left', lineLen = 70}) => {
  const p = prog(frame, start, start + 24, easeOut);
  const out = prog(frame, end - 20, end);
  const line = prog(frame, start, start + 18, easeOut);
  const dir = align === 'left' ? 1 : -1;
  return (
    <div style={{position: 'absolute', left: x, top: y, opacity: 1 - out}}>
      <div style={{position: 'absolute', left: -6, top: -6, width: 12, height: 12, borderRadius: 6, background: C.gold, transform: `scale(${line})`}} />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: dir > 0 ? 10 : -10 - lineLen * line,
          width: lineLen * line,
          height: 1.5,
          background: C.gold,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: -30,
          [align === 'left' ? 'left' : 'right']: lineLen + 24,
          whiteSpace: 'nowrap',
          textAlign: align,
          opacity: p,
          transform: `translateX(${(1 - p) * 16 * dir}px)`,
        }}
      >
        <div style={{fontFamily: FONT_TITLE, fontWeight: 600, fontSize: 36, color}}>{title}</div>
        <div style={{fontFamily: FONT_TEXT, fontWeight: 500, fontSize: 19, letterSpacing: 2.5, color: C.gold, marginTop: 4}}>{sub}</div>
      </div>
    </div>
  );
};
