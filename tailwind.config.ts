import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          light: '#FAF6ED',
          DEFAULT: '#F7F0E3',
          dark: '#EFE5D3',
          deep: '#E6D7BF',
        },
        jaggery: {
          subtle: '#8A7B6E',
          muted: '#5C4E43',
          DEFAULT: '#2D241E',
          dark: '#1C1612',
          border: '#E3D7C6',
        },
        chilli: {
          light: '#BA4736',
          DEFAULT: '#A43D2E',
          hover: '#8E3224',
          active: '#76271A',
          tint: '#F5EAE7',
        },
        turmeric: {
          light: '#F2C869',
          DEFAULT: '#E8B54B',
          deep: '#C9962D',
          tint: '#FBF5E6',
        },
        leaf: {
          light: '#486F55',
          DEFAULT: '#365541',
          deep: '#253B2D',
          tint: '#EBF1ED',
        },
      },
      fontFamily: {
        display: ['var(--font-bricolage)', 'Bricolage Grotesque', 'Georgia', 'serif'],
        serif: ['var(--font-bricolage)', 'Bricolage Grotesque', 'Georgia', 'serif'],
        sans: ['var(--font-dm-sans)', 'DM Sans', 'system-ui', 'sans-serif'],
        kannada: ['var(--font-anek-kannada)', 'Anek Kannada', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'tightest': '-0.035em',
        'tighter': '-0.025em',
        'tight': '-0.015em',
        'wordmark': '0.04em',
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;

