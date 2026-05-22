import { Backpack, HeartHandshake, Users } from 'lucide-react';

export const HERO_MAIN_IMAGE = '/hero-home-classroom.png';

export const TEXT_HIGHLIGHT_UNDERLINE_SRC = '/home/text-highlight-underline.png';

export const HERO_TRUST_ICON_PATHS = [
  '/home/hero-icon-learning.png',
  '/home/hero-icon-location.png',
  '/home/hero-icon-flag.png'
] as const;

export const HERO_PNG_ICONS = {
  teacher: '/home/hero-icon-teacher.png',
  community: '/home/hero-icon-community.png',
  creative: '/home/hero-icon-creative.png'
} as const;

export const ABOUT_HIGHLIGHT_ICONS = [Backpack, HeartHandshake, Users] as const;

export const ABOUT_PATTERN_SRC = '/about-vyshyvanka-pattern.png';

export const PARENT_VOICES_LOOP_SETS = 3;
