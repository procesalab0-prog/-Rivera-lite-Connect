import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        rivera: {
          bg: '#0B0C0E',
          panel: '#16181D',
          panel2: '#121419',
          border: '#262A31',
          input: '#0C0E11',
          'input-border': '#2A2E36',
          red: '#E4121E',
          redb: '#E11119',
          ink: '#F2F4F7',
          muted: '#9BA3AE',
          dim: '#6b727c',
        },
      },
      fontFamily: {
        sans: ['var(--font-archivo)', 'system-ui', 'sans-serif'],
        cond: ['var(--font-saira-cond)', 'system-ui', 'sans-serif'],
        saira: ['var(--font-saira)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        riseIn: {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'none' },
        },
      },
      animation: {
        riseIn: 'riseIn .5s ease both',
      },
    },
  },
  plugins: [],
};

export default config;
