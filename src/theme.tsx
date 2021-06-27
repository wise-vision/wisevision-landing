import { Theme } from 'theme-ui';

export const pxToRem = (px: number) => `${px / 16}rem`;

// //////////////////// 0   1   2   3   4   5  6    7   8   9
const baseFontSizes = [12, 14, 16, 18, 20, 24, 28, 38, 48, 72];
// /////////////// 0  1  2   3   4   5   6   7
const baseSpace = [0, 4, 8, 16, 32, 64, 128, 256];
const baseSizes = [0, 4, 8, 16, 32, 64, 128, 256];

const theme: Theme = {
  useBorderBox: true,
  useBodyStyles: true,
  breakpoints: ['48em', '64em', '80em'],
  fontSizes: baseFontSizes.map((size) => pxToRem(size)),
  space: baseSpace.map((size) => pxToRem(size)),
  sizes: baseSizes.map((size) => pxToRem(size)),
  fonts: {
    body: 'Roboto Condensed, sans-serif',
    heading: 'Roboto Condensed, sans-serif',
  },
  colors: {
    text: '#000',
    textAlt: '#FFF',
    textMuted: '#E6E7E8',

    background: '#FFF',
    backgroundAlt: '#000',
    backgroundMuted: '#E6E7E8',

    primary: '#0028AB',
  },
  // @ts-ignore
  fontWeights: {
    body: '400',
    heading: '400',
    semiBold: '600',
    bold: '700',
  },
  lineHeights: {
    body: '1.25',
    heading: '1',
    loose: '1.5',
  },
  transitions: {
    standard: '0.3s ease-in-out',
  },
  text: {
    heading: {
      fontFamily: 'heading',
      fontWeight: 'bold',
      fontSize: [6, 7],
      color: 'primary',
    },
    largeHeading: {
      fontSize: [7, 9],
      fontWeight: 'body',
      color: 'textAlt',
    },
  },
  buttons: {
    primary: {
      fontFamily: 'body',
      textTransform: 'uppercase',
      borderRadius: '0',
      border: '1px solid',
      borderColor: 'background',
      cursor: 'pointer',
      transition: 'standard',
      '&:hover': {
        color: 'primary',
        bg: 'background',
        borderColor: 'primary',
      },
    },
    outline: {
      variant: 'buttons.primary',
      bg: 'transparent',
      border: '1px solid',
      borderColor: 'primary',
      color: 'primary',
      '&:hover': {
        color: 'textAlt',
        bg: 'primary',
      },
    },
  },
  forms: {
    input: {
      fontFamily: 'body',
      bg: 'background',
      color: 'text',
      borderRadius: '0',
      border: 'none',
      px: 3,
      py: pxToRem(10),
      '::placeholder': {
        color: 'inherit',
      },
    },
    textarea: {
      variant: 'forms.input',
    },
  },
  links: {
    nav: {
      color: 'textAlt',
      textTransform: 'uppercase',
      fontWeight: 'bold',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  },
  zIndices: {
    menu: 5,
  },
  layout: {
    container: {
      px: [3, 4, 5],
      maxWidth: pxToRem(1320),
    },
    footer: {
      variant: 'layout.container',
      maxWidth: [pxToRem(400), pxToRem(560), pxToRem(1320)],
    },
  },
  styles: {
    root: {
      fontFamily: 'body',
      fontSize: 3,
      fontWeight: 'body',
    },
  },
};

export default theme;
