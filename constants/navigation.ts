export type NavItem = {
  label: string;
  href: string;
  key: string;
  children?: { label: string; href: string }[];
};

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
        label: 'Extended Services',
        href: '/parents/extended-services'
      },
      {
        label: 'Latest News',
        href: '/parents/news'
      },
      {
        label: 'Newsletters',
        href: '/parents/newsletters'
      },
      {
        label: 'Calendar',
        href: '/parents/calendar'
      },
      {
        label: 'Term Dates',
        href: '/parents/term-dates'
      }
    ]
  },
  {
    label: 'Children',
    href: '/children',
    key: 'children',
    children: [
      {
        label: 'Class Pages',
        href: '/children/class-pages'
      },
      {
        label: 'School Council',
        href: '/children/school-council'
      },
      {
        label: 'eSafety',
        href: '/children/e-safety'
      }
    ]
  },
  {
    label: 'Key Info',
    href: '/key-info',
    key: 'keyInfo',
    children: [
      {
        label: 'Curriculum',
        href: '/key-info/curriculum'
      },
      {
        label: 'School Day Timings',
        href: '/key-info/timings'
      },
      {
        label: 'Admissions',
        href: '/key-info/admissions'
      },
      {
        label: 'DFE Performance',
        href: '/key-info/performance'
      },
      {
        label: 'Uniform',
        href: '/key-info/uniform'
      },
      {
        label: 'School Meals',
        href: '/key-info/meals'
      },
      {
        label: 'Behaviour',
        href: '/key-info/behaviour'
      },
      {
        label: 'Ofsted Reports',
        href: '/key-info/ofsted'
      },
      {
        label: 'Pupil Premium',
        href: '/key-info/pupil-premium'
      },
      { label: 'Send', href: '/key-info/send' },
      {
        label: 'Sports Premium',
        href: '/key-info/sports-premium'
      },
      {
        label: 'School Policies',
        href: '/key-info/policies'
      }
    ]
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
