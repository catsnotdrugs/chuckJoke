import {
  PawPrint,
  Briefcase,
  Star,
  Code2,
  Skull,
  Shirt,
  UtensilsCrossed,
  ScrollText,
  DollarSign,
  Film,
  Music2,
  Vote,
  Church,
  FlaskConical,
  Trophy,
  Plane,
  Dice5,
  type LucideIcon,
} from 'lucide-react';

export type CategoryId =
  | 'random'
  | 'animal'
  | 'career'
  | 'celebrity'
  | 'dev'
  | 'explicit'
  | 'fashion'
  | 'food'
  | 'history'
  | 'money'
  | 'movie'
  | 'music'
  | 'political'
  | 'religion'
  | 'science'
  | 'sport'
  | 'travel';

export interface Category {
  id: CategoryId;
  label: string;
  icon: LucideIcon;
  /** Color tint applied to the active chip and portrait stage. */
  hue: string;
}

export const RANDOM: Category = {
  id: 'random',
  label: 'Random',
  icon: Dice5,
  hue: '#ff1f3d',
};

export const CATEGORIES: Category[] = [
  { id: 'animal', label: 'Animal', icon: PawPrint, hue: '#ffb627' },
  { id: 'career', label: 'Career', icon: Briefcase, hue: '#00ffd1' },
  { id: 'celebrity', label: 'Celebrity', icon: Star, hue: '#ff2bd6' },
  { id: 'dev', label: 'Dev', icon: Code2, hue: '#00ffd1' },
  { id: 'explicit', label: 'Explicit', icon: Skull, hue: '#ff1f3d' },
  { id: 'fashion', label: 'Fashion', icon: Shirt, hue: '#ff2bd6' },
  { id: 'food', label: 'Food', icon: UtensilsCrossed, hue: '#ffb627' },
  { id: 'history', label: 'History', icon: ScrollText, hue: '#ffb627' },
  { id: 'money', label: 'Money', icon: DollarSign, hue: '#00ffd1' },
  { id: 'movie', label: 'Movie', icon: Film, hue: '#ff2bd6' },
  { id: 'music', label: 'Music', icon: Music2, hue: '#7a3cff' },
  { id: 'political', label: 'Political', icon: Vote, hue: '#ff1f3d' },
  { id: 'religion', label: 'Religion', icon: Church, hue: '#ffb627' },
  { id: 'science', label: 'Science', icon: FlaskConical, hue: '#00ffd1' },
  { id: 'sport', label: 'Sport', icon: Trophy, hue: '#ffb627' },
  { id: 'travel', label: 'Travel', icon: Plane, hue: '#00ffd1' },
];
