import { createConfig } from '@tokenami/css';

export default createConfig({
  include: ['entrypoints/**/*.{ts,tsx}'],
  grid: '0.25rem',
  responsive: {},
  theme: {
    alpha: {},
    anim: {},
    border: {},
    color: {
      primary: "blue"
    },
    ease: {},
    'font-size': {},
    leading: {},
    'line-style': {},
    radii: {},
    size: {},
    shadow: {},
    surface: {},
    tracking: {},
    transition: {},
    weight: {},
    z: {},
  },
});
