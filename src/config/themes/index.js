import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';

const defaultThemeDefinition = {
  typography: {
    fontFamily: 'DM Sans, sans-serif',
    fontSize: 15,
  },
  palette: {
    primary: {
      main: '#8ab5c2',
      light: '#bbe7f5',
      dark: '#5b8592',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#3f6b72',
      light: '#6d99a0',
      dark: '#104047',
      contrastText: '#ffffff',
    },
    background: {
      default: '#ffffff'
    }
  },
};


const defaultTheme = responsiveFontSizes(createMuiTheme(defaultThemeDefinition));

const sidebarTheme = responsiveFontSizes(createMuiTheme({
  palette: {
    type: 'dark',
    ...defaultThemeDefinition.palette,
    background: {
      paper: '#3f6b72'
    },

  },
}));



export { defaultTheme, sidebarTheme };
