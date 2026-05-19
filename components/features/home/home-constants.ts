import { Backpack, HeartHandshake, Users } from 'lucide-react';

export const HERO_MAIN_IMAGE = '/hero-home-classroom.png';

export const TEXT_HIGHLIGHT_UNDERLINE_SRC = '/home/text-highlight-underline.png';

export const HERO_TRUST_ICON_PATHS = [
  '/home/hero-icon-learning.png',
  '/home/hero-icon-location.png',
  '/home/hero-icon-flag.png'
] as const;

export const HERO_PNG_ICONS = {
  learning: '/home/hero-icon-learning.png',
  location: '/home/hero-icon-location.png',
  book: '/home/hero-icon-book.png',
  teacher: '/home/hero-icon-teacher.png',
  community: '/home/hero-icon-community.png',
  creative: '/home/hero-icon-creative.png'
} as const;

export const ABOUT_HIGHLIGHT_ICONS = [Backpack, HeartHandshake, Users] as const;

export const ABOUT_SNOWFLAKES = [
  { top: '4%', right: '4%', size: 56, rotate: -14 },
  { top: '2%', right: '28%', size: 48, rotate: 12 },
  { top: '16%', right: '8%', size: 52, rotate: -8 },
  { top: '22%', right: '36%', size: 44, rotate: 20 },
  { top: '12%', right: '52%', size: 46, rotate: -18 },
  { top: '28%', right: '20%', size: 50, rotate: 6 },
  { top: '8%', right: '42%', size: 42, rotate: -22 }
] as const;

export const PARENT_VOICES_LOOP_SETS = 3;
