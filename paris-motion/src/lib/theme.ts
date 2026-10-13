import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

// Palette : bleu nuit, crème, blanc, touches de rouge et de doré.
export const C = {
  night: '#0B1A33',
  nightSoft: '#132748',
  nightLine: '#1E3561',
  navy: '#1B2D52',
  cream: '#F4EBDD',
  creamDeep: '#E8DAC3',
  stone: '#EADFCB',
  white: '#FFFFFF',
  gold: '#D4AF6A',
  goldLight: '#F2D597',
  red: '#C8102E',
  river: '#9DB3C7',
  zinc: '#7E8EA6',
};

export const FONT_TITLE = '"Playfair Display", Georgia, serif';
export const FONT_TEXT = 'Montserrat, Helvetica, Arial, sans-serif';

const fonts: [string, string, string, string][] = [
  ['Playfair Display', 'playfair-display-latin-400-normal.woff2', '400', 'normal'],
  ['Playfair Display', 'playfair-display-latin-600-normal.woff2', '600', 'normal'],
  ['Playfair Display', 'playfair-display-latin-700-normal.woff2', '700', 'normal'],
  ['Playfair Display', 'playfair-display-latin-400-italic.woff2', '400', 'italic'],
  ['Playfair Display', 'playfair-display-latin-600-italic.woff2', '600', 'italic'],
  ['Montserrat', 'montserrat-latin-400-normal.woff2', '400', 'normal'],
  ['Montserrat', 'montserrat-latin-500-normal.woff2', '500', 'normal'],
  ['Montserrat', 'montserrat-latin-600-normal.woff2', '600', 'normal'],
];

let loaded = false;
export const loadAllFonts = () => {
  if (loaded) return;
  loaded = true;
  for (const [family, file, weight, style] of fonts) {
    loadFont({family, url: staticFile(`fonts/${file}`), weight, style});
  }
};
