import defaultTheme from 'tailwindcss/defaultTheme';
import tailwindcssAnimate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'pages/**/*.{ts,tsx}'
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', ...defaultTheme.fontFamily.sans],
        display: ['var(--font-manrope)', 'var(--font-inter)', ...defaultTheme.fontFamily.sans]
      },
      fontSize: {
        body: ['1.125rem', { lineHeight: '1.75' }],
        h1: ['4rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        h2: ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        h3: ['1.75rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        h4: ['1.375rem', { lineHeight: '1.35', letterSpacing: '-0.01em' }],
        '2xs': ['0.6875rem', { lineHeight: '1rem' }]
      },
      minHeight: {
        editor: '27.5rem'
      },
      maxHeight: {
        editor: '27.5rem'
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      colors: {
        border: 'rgb(var(--border))',
        input: 'rgb(var(--input))',
        ring: 'rgb(var(--ring))',
        background: 'rgb(var(--background))',
        foreground: 'rgb(var(--foreground))',
        primary: {
          DEFAULT: 'rgb(var(--primary))',
          foreground: 'rgb(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'rgb(var(--secondary))',
          foreground: 'rgb(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'rgb(var(--destructive))',
          foreground: 'rgb(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'rgb(var(--muted))',
          foreground: 'rgb(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'rgb(var(--accent))',
          foreground: 'rgb(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'rgb(var(--popover))',
          foreground: 'rgb(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'rgb(var(--card))',
          foreground: 'rgb(var(--card-foreground))'
        },
        ukraine: {
          blue: 'rgb(var(--ukraine-blue))',
          yellow: 'rgb(var(--ukraine-yellow))',
          'header-bg': 'rgb(var(--ukraine-header-bg))',
          'header-fg': 'rgb(var(--ukraine-header-fg))',
          'header-muted': 'rgb(var(--ukraine-header-muted))'
        },
        brand: {
          blue: '#2563EB',
          'blue-light': '#EFF6FF',
          yellow: '#FACC15',
          ink: '#111827',
          muted: '#6B7280'
        },
        sidebar: {
          DEFAULT: 'rgb(var(--sidebar))',
          foreground: 'rgb(var(--sidebar-foreground))',
          primary: 'rgb(var(--sidebar-primary))',
          'primary-foreground': 'rgb(var(--sidebar-primary-foreground))',
          accent: 'rgb(var(--sidebar-accent))',
          'accent-foreground': 'rgb(var(--sidebar-accent-foreground))',
          border: 'rgb(var(--sidebar-border))',
          ring: 'rgb(var(--sidebar-ring))'
        }
      }
    }
  },
  plugins: [tailwindcssAnimate]
};
