import { useMemo } from 'react';
import type { CategoryId } from '../lib/categories';

/**
 * Hand-pixeled 16x18 sprite of Chuck Norris with per-category accessory swap.
 * Rendered as an SVG of <rect>s for crisp scaling. Idle bob via animation class.
 */
interface Props {
  category: CategoryId;
  /** Pixel size multiplier. Default 8 → 128x144 sprite. */
  scale?: number;
  punching?: boolean;
  className?: string;
}

const W = 16;
const H = 18;

// Compact palette IDs → colors
const PAL: Record<string, string> = {
  '.': 'transparent',
  _: 'transparent',
  K: '#000010', // outline
  S: '#fcc4a0', // skin
  H: '#783c00', // hair / beard brown
  D: '#fcfcfc', // white (denim/highlight)
  B: '#0030a0', // blue denim
  R: '#d82838', // red shirt
  Y: '#fcd440', // yellow
  G: '#28a830', // green
  P: '#7028b8', // purple
  M: '#e040b0', // magenta
  C: '#80c8f8', // cyan
  X: '#3060e8', // accent blue
  O: '#f8801c', // orange
  T: '#787878', // grey
  W: '#fcfcfc', // white teeth / labcoat
};
type PalKey = string;

/**
 * Base Chuck sprite — head + beard + body. Each char = one pixel.
 * 16 wide × 18 tall.
 * `_` represents pixels that will be overridden by the category accessory layer.
 * The accessory map is the same dimensions; only its non-'.' pixels paint over base.
 */
const BASE: string[] = [
  '................', //  0 — empty above head
  '....KKKKKKKK....', //  1 — top of hair
  '...KHHHHHHHHK...', //  2 — hair line
  '..KHHHSSSSSHHK..', //  3 — forehead
  '..KHSSSSSSSSHK..', //  4
  '..KSKSSSSSKSSK..', //  5 — eyes outlined
  '..KSSSSSSSSSSK..', //  6
  '..KHSSSKSSSSHK..', //  7 — nose dot
  '..KHHHHHHHHHHK..', //  8 — beard top
  '..KHHHHHHHHHHK..', //  9 — beard
  '...KHHHHHHHHK...', // 10 — beard taper
  '....KHHHHHHK....', // 11
  '...KKBBBBBBKK...', // 12 — collar / shirt top
  '..KBBBBBBBBBBK..', // 13 — torso
  '..KBBKBBBBKBBK..', // 14 — torso w/ shading
  '..KBBBBBBBBBBK..', // 15
  '..KBKKBBBBKKBK..', // 16 — fists at sides
  '..KKKKKKKKKKKK..', // 17 — bottom
];

const PUNCH: string[] = [
  '................',
  '....KKKKKKKK....',
  '...KHHHHHHHHK...',
  '..KHHHSSSSSHHK..',
  '..KHSSSSSSSSHK..',
  '..KSKSSSSSKSSK..',
  '..KSSSSSSSSSSK..',
  '..KHSSSKSSSSHK..',
  '..KHHHHHHHHHHK..',
  '..KHHHHHHHHHHK..',
  '...KHHHHHHHHKKK', // arm extends right
  '....KHHHHHHKKKK',
  '...KKBBBBBBKBBK',
  '..KBBBBBBBBBBSS', // fist
  '..KBBBBBBBBBKKK',
  '..KBBBBBBBBBBK..',
  '..KBKKBBBBKKBK..',
  '..KKKKKKKKKKKK..',
];

function paint(layer: string[]): { x: number; y: number; c: string }[] {
  const out: { x: number; y: number; c: string }[] = [];
  for (let y = 0; y < layer.length; y++) {
    const row = layer[y];
    for (let x = 0; x < row.length; x++) {
      const ch = row[x] as PalKey;
      if (!ch || ch === '.' || ch === '_') continue;
      const color = PAL[ch];
      if (!color || color === 'transparent') continue;
      out.push({ x, y, c: color });
    }
  }
  return out;
}

function merge(base: string[], overlay: string[]): { x: number; y: number; c: string }[] {
  // Build a 2D map keyed by `y,x` so overlay wins.
  const map = new Map<string, string>();
  for (const p of paint(base)) map.set(`${p.y},${p.x}`, p.c);
  for (const p of paint(overlay)) map.set(`${p.y},${p.x}`, p.c);
  const out: { x: number; y: number; c: string }[] = [];
  for (const [key, c] of map) {
    const [yStr, xStr] = key.split(',');
    out.push({ x: Number(xStr), y: Number(yStr), c });
  }
  return out;
}

function blankLayer(): string[] {
  return Array.from({ length: H }, () => '.'.repeat(W));
}

function setPixel(layer: string[], x: number, y: number, ch: PalKey): string[] {
  if (y < 0 || y >= H || x < 0 || x >= W) return layer;
  const row = layer[y];
  layer[y] = row.slice(0, x) + ch + row.slice(x + 1);
  return layer;
}

function fillRow(layer: string[], y: number, x1: number, x2: number, ch: PalKey) {
  for (let x = x1; x <= x2; x++) setPixel(layer, x, y, ch);
}

function accessoryFor(category: CategoryId): string[] {
  const l = blankLayer();
  switch (category) {
    case 'movie': {
      // Cowboy hat — wide brim + crown over hair
      fillRow(l, 0, 3, 12, 'K');
      fillRow(l, 1, 4, 11, 'H');
      fillRow(l, 2, 2, 13, 'K');
      fillRow(l, 3, 3, 12, 'H');
      setPixel(l, 7, 1, 'R');
      setPixel(l, 8, 1, 'R');
      return l;
    }
    case 'dev': {
      // Glasses
      fillRow(l, 5, 3, 6, 'K');
      fillRow(l, 5, 9, 12, 'K');
      setPixel(l, 7, 5, 'K');
      setPixel(l, 8, 5, 'K');
      setPixel(l, 4, 5, 'C');
      setPixel(l, 5, 5, 'C');
      setPixel(l, 10, 5, 'C');
      setPixel(l, 11, 5, 'C');
      // Coffee mug in right hand
      fillRow(l, 13, 13, 15, 'K');
      fillRow(l, 14, 13, 15, 'W');
      setPixel(l, 14, 14, 'H');
      fillRow(l, 15, 13, 15, 'K');
      return l;
    }
    case 'science': {
      // Lab coat + safety goggles
      fillRow(l, 5, 3, 6, 'K');
      fillRow(l, 5, 9, 12, 'K');
      setPixel(l, 4, 5, 'C');
      setPixel(l, 5, 5, 'C');
      setPixel(l, 10, 5, 'C');
      setPixel(l, 11, 5, 'C');
      // Lab coat over body
      fillRow(l, 13, 2, 13, 'W');
      fillRow(l, 14, 2, 13, 'W');
      fillRow(l, 15, 2, 13, 'W');
      fillRow(l, 16, 2, 13, 'W');
      return l;
    }
    case 'sport': {
      // Headband
      fillRow(l, 2, 2, 13, 'R');
      fillRow(l, 3, 3, 12, 'D'); // white stripe
      fillRow(l, 4, 3, 12, 'R');
      return l;
    }
    case 'music': {
      // Pink shades + colored shirt
      fillRow(l, 5, 3, 12, 'K');
      fillRow(l, 6, 3, 6, 'M');
      fillRow(l, 6, 9, 12, 'M');
      // shirt → magenta
      for (let y = 13; y <= 16; y++) {
        for (let x = 2; x <= 13; x++) if (l[y][x] === '.') setPixel(l, x, y, 'M');
      }
      return l;
    }
    case 'food': {
      // Chef hat
      fillRow(l, 0, 4, 11, 'W');
      fillRow(l, 1, 3, 12, 'W');
      fillRow(l, 2, 3, 12, 'W');
      fillRow(l, 3, 2, 13, 'K');
      setPixel(l, 5, 1, 'W');
      setPixel(l, 10, 1, 'W');
      return l;
    }
    case 'history':
    case 'religion': {
      // Halo
      fillRow(l, 0, 4, 11, 'Y');
      setPixel(l, 4, 1, 'Y');
      setPixel(l, 11, 1, 'Y');
      return l;
    }
    case 'money': {
      // Sunglasses + yellow tie
      fillRow(l, 5, 3, 6, 'Y');
      fillRow(l, 5, 9, 12, 'Y');
      fillRow(l, 6, 3, 6, 'K');
      fillRow(l, 6, 9, 12, 'K');
      // Tie center stripe
      setPixel(l, 7, 13, 'Y');
      setPixel(l, 8, 13, 'Y');
      setPixel(l, 7, 14, 'Y');
      setPixel(l, 8, 14, 'Y');
      setPixel(l, 7, 15, 'Y');
      setPixel(l, 8, 15, 'Y');
      setPixel(l, 7, 16, 'Y');
      setPixel(l, 8, 16, 'Y');
      return l;
    }
    case 'fashion':
    case 'celebrity': {
      // Aviators + magenta scarf
      fillRow(l, 5, 2, 6, 'K');
      fillRow(l, 5, 9, 13, 'K');
      setPixel(l, 4, 5, 'M');
      setPixel(l, 5, 5, 'M');
      setPixel(l, 10, 5, 'M');
      setPixel(l, 11, 5, 'M');
      fillRow(l, 12, 2, 13, 'M');
      return l;
    }
    case 'political': {
      // Top hat
      fillRow(l, 0, 5, 10, 'K');
      fillRow(l, 1, 5, 10, 'K');
      setPixel(l, 5, 1, 'R');
      setPixel(l, 10, 1, 'R');
      fillRow(l, 2, 3, 12, 'K');
      return l;
    }
    case 'travel': {
      // Pilot cap
      fillRow(l, 1, 3, 12, 'K');
      fillRow(l, 2, 3, 12, 'C');
      fillRow(l, 3, 2, 13, 'K');
      setPixel(l, 8, 2, 'Y'); // emblem
      return l;
    }
    case 'animal': {
      // Bandana
      fillRow(l, 3, 2, 13, 'R');
      setPixel(l, 5, 3, 'W');
      setPixel(l, 8, 3, 'W');
      setPixel(l, 11, 3, 'W');
      return l;
    }
    case 'career': {
      // Cyan tie
      setPixel(l, 7, 13, 'C');
      setPixel(l, 8, 13, 'C');
      setPixel(l, 7, 14, 'C');
      setPixel(l, 8, 14, 'C');
      setPixel(l, 7, 15, 'C');
      setPixel(l, 8, 15, 'C');
      setPixel(l, 7, 16, 'C');
      setPixel(l, 8, 16, 'C');
      // White collar
      setPixel(l, 6, 12, 'W');
      setPixel(l, 9, 12, 'W');
      return l;
    }
    case 'explicit': {
      // Red censor bar
      fillRow(l, 5, 2, 13, 'R');
      return l;
    }
    case 'random':
    default: {
      // Sheriff star
      setPixel(l, 7, 0, 'Y');
      setPixel(l, 8, 0, 'Y');
      setPixel(l, 6, 1, 'Y');
      setPixel(l, 7, 1, 'Y');
      setPixel(l, 8, 1, 'Y');
      setPixel(l, 9, 1, 'Y');
      setPixel(l, 7, 2, 'Y');
      setPixel(l, 8, 2, 'Y');
      return l;
    }
  }
}

export function PixelChuck({ category, scale = 8, punching = false, className }: Props) {
  const pixels = useMemo(() => {
    const accessory = accessoryFor(category);
    const base = punching ? PUNCH : BASE;
    return merge(base, accessory);
  }, [category, punching]);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W * scale}
      height={H * scale}
      shapeRendering="crispEdges"
      className={`${className ?? ''} drop-shadow-[6px_6px_0_rgba(0,0,16,0.85)]`}
      aria-hidden
    >
      {pixels.map((p, i) => (
        <rect key={i} x={p.x} y={p.y} width={1} height={1} fill={p.c} />
      ))}
    </svg>
  );
}
