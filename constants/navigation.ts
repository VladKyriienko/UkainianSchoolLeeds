import type { NavItem } from '@/types';

export type { NavItem };

export const NavItems: NavItem[] = [
  { label: 'Home', href: '/', key: 'home' },
  {
    label: 'About',
    href: '/about',
    key: 'about',
    children: [
      { label: 'Welcome', href: '/about/welcome' },
      {
        label: 'Whos Who',
        href: '/about/whos-who'
      },
      {
        label: 'Vacancies',
        href: '/about/vacancies'
      },
      {
        label: 'School Development Plan',
        href: '/about/development-plan'
      }
    ]
  },
  {
    label: 'Parents',
    href: '/parents',
    key: 'parents',
    children: [
      {
        label: 'Latest News',
        href: '/parents/news'
      },
      {
        label: 'Calendar',
        href: '/parents/calendar'
      },
      {
        label: 'Class Pages',
        href: '/parents/class-pages'
      }
    ]
  },
  {
    label: 'Key Info',
    href: '/key-info',
    key: 'keyInfo'
  },
  {
    label: 'Donate',
    href: '/donate',
    key: 'donate'
  },
  {
    label: 'Contact',
    href: '/contact',
    key: 'contact'
  }
];
