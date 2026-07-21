import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta base "funcional". Claude Design la refinará después.
        rivera: {
          dark: '#0f172a',
          gold: '#c9a227',
          steel: '#334155',
        },
      },
    },
  },
  plugins: [],
};

export default config;
