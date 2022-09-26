// Dependencies
import minifyTheme from 'minify-css-string';

// Icons
import ELLOS_ICONS from '@/assets/icons';

export default {
  icons: {
    iconfont: 'mdi',
    values: ELLOS_ICONS,
  },
  theme: {
    dark: false,
    options: {
      // variations: false,
      customProperties: true,
      minifyTheme,
    },
    themes: {
      light: {
        primary: {
          base: '#457eb3',
          darken1: '#37648e',
          lighten1: '#e2eaf2',
          lighten2: '#f3f7fa',
        },
        secondary: {
          base: '#272727',
          darken1: '#000000',
          lighten1: '#e5e5e5',
          lighten2: '#f1f1f1',
        },
        accent: '#457eb3',
        error: {
          base: '#cc6767',
          darken1: '#a85555',
          lighten1: '#fdf4f4',
        },
        info: {
          base: '#f7f7f7',
          darken1: '#777777',
        },
        success: {
          base: '#6ea670',
          darken1: '#4b7b4e',
          lighten1: '#ddecdd',
          lighten2: '#eef7ee',
        },
        warning: {
          base: '#b38e45',
          darken1: '#8f7137',
          lighten1: '#f9f3e7',
        },
      },
    },
  },
};
